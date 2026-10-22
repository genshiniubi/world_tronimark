import { promises as fs } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import type { Language, RunResult } from '@codelab/shared';
import { config } from '../config.js';

export interface ExecuteInput {
  language: Language;
  files: Record<string, string>;
  entryFile: string;
  stdin: string;
  timeLimitMs?: number;
  debug?: boolean;
}

interface SpawnResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  truncated: boolean;
  durationMs: number;
}

const IS_WINDOWS = process.platform === 'win32';
const MAX_FILES = 24;
const MAX_TOTAL_SOURCE = 256 * 1024;
const CPP_CACHE_TTL_MS = 15 * 60 * 1000;

interface CppCacheEntry {
  exePath: string;
  compileOutput: string;
  createdAt: number;
}

const cppCache = new Map<string, CppCacheEntry>();
let cppExecutionBlocked = false;
let cppExecutionNote = '尚未检测';

export async function probeCppExecution(): Promise<{
  blocked: boolean;
  note: string;
}> {
  if (!config.judge.cxx) {
    cppExecutionBlocked = false;
    cppExecutionNote = '未找到 C++ 编译器';
    return { blocked: false, note: cppExecutionNote };
  }
  const result = await executeCode({
    language: 'cpp',
    files: {
      'main.cpp': `#include <iostream>\n// probe ${Date.now()}\nint main(){ std::cout << "ok"; return 0; }\n`,
    },
    entryFile: 'main.cpp',
    stdin: '',
    timeLimitMs: 3000,
  });
  if (result.verdict === 'SE' || /应用控制策略|spawn UNKNOWN/i.test(result.stderr)) {
    cppExecutionBlocked = true;
    cppExecutionNote =
      'Windows 应用控制策略阻止了新编译的 C++ 程序；Python 判题不受影响。';
  } else if (result.verdict === 'OK') {
    cppExecutionBlocked = false;
    cppExecutionNote = 'C++ 运行探针通过';
  } else {
    cppExecutionBlocked = false;
    cppExecutionNote = `C++ 运行探针返回 ${result.verdict}`;
  }
  return { blocked: cppExecutionBlocked, note: cppExecutionNote };
}

export function getCppExecutionStatus(): { blocked: boolean; note: string } {
  return { blocked: cppExecutionBlocked, note: cppExecutionNote };
}

function cppSourceHash(input: ExecuteInput): string {
  return createHash('sha256')
    .update(config.judge.cxx ?? '')
    .update(config.judge.cxxStandard)
    .update(config.judge.cxxFlags)
    .update(input.entryFile)
    .update(String(Boolean(input.debug)))
    .update(JSON.stringify(input.files))
    .digest('hex');
}

export function validateFiles(files: Record<string, string>): void {
  const entries = Object.entries(files);
  if (entries.length === 0) throw new Error('代码文件不能为空');
  if (entries.length > MAX_FILES) throw new Error(`最多允许 ${MAX_FILES} 个文件`);
  let total = 0;
  for (const [file, content] of entries) {
    const normalized = file.replace(/\\/g, '/');
    if (
      !normalized ||
      normalized.startsWith('/') ||
      normalized.includes('\0') ||
      normalized.split('/').some((part) => part === '..' || part === '')
    ) {
      throw new Error(`非法文件路径: ${file}`);
    }
    if (!/^[a-zA-Z0-9_./-]+$/.test(normalized)) {
      throw new Error(`文件名只能包含字母、数字、下划线、点、斜杠和短横线: ${file}`);
    }
    if (typeof content !== 'string') throw new Error(`文件内容必须是字符串: ${file}`);
    total += Buffer.byteLength(content, 'utf8');
    if (Buffer.byteLength(content, 'utf8') > config.judge.maxSourceBytes) {
      throw new Error(`文件 ${file} 超过单文件大小限制`);
    }
  }
  if (total > MAX_TOTAL_SOURCE) throw new Error('全部文件总大小超过限制');
}

async function writeFiles(dir: string, files: Record<string, string>): Promise<void> {
  for (const [relative, content] of Object.entries(files)) {
    const target = path.join(dir, relative);
    const resolved = path.resolve(target);
    if (!resolved.startsWith(path.resolve(dir) + path.sep) && resolved !== path.resolve(dir)) {
      throw new Error(`非法文件路径: ${relative}`);
    }
    await fs.mkdir(path.dirname(resolved), { recursive: true });
    await fs.writeFile(resolved, content, 'utf8');
  }
}

async function makeWorkDir(prefix: string): Promise<string> {
  const base = path.join(config.dataDir, 'tmp');
  await fs.mkdir(base, { recursive: true });
  return fs.mkdtemp(path.join(base, prefix));
}

async function removeDir(dir: string): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

function killTree(pid: number | undefined): void {
  if (!pid) return;
  if (IS_WINDOWS) {
    const killer = spawn('taskkill', ['/PID', String(pid), '/T', '/F'], {
      windowsHide: true,
      stdio: 'ignore',
    });
    killer.on('error', () => undefined);
  } else {
    try {
      process.kill(-pid, 'SIGKILL');
    } catch {
      // best effort
    }
  }
}

function humanizeSpawnError(message: string): string {
  if (/spawn UNKNOWN|Application Control|应用控制策略/i.test(message)) {
    return '系统应用控制策略阻止了程序执行（spawn UNKNOWN）。请查看 docs/judge-security.md 的 Windows 排查说明，或改用 Linux / 容器判题。';
  }
  return message;
}

function spawnCapture(
  command: string,
  args: string[],
  options: {
    cwd: string;
    input?: string;
    timeoutMs: number;
    maxOutputBytes?: number;
    env?: NodeJS.ProcessEnv;
  },
): Promise<SpawnResult> {
  return new Promise((resolve) => {
    const started = Date.now();
    const maxOutput = options.maxOutputBytes ?? config.judge.maxOutputBytes;
    let stdout = Buffer.alloc(0);
    let stderr = Buffer.alloc(0);
    let truncated = false;
    let timedOut = false;
    let settled = false;
    let child: ReturnType<typeof spawn>;

    try {
      child = spawn(command, args, {
        cwd: options.cwd,
        windowsHide: true,
        env: {
          ...process.env,
          ...(config.judge.cxx
            ? {
                PATH: [path.dirname(config.judge.cxx), process.env.PATH]
                  .filter(Boolean)
                  .join(path.delimiter),
              }
            : {}),
          ...options.env,
          PYTHONIOENCODING: 'utf-8',
          PYTHONDONTWRITEBYTECODE: '1',
          PYTHONNOUSERSITE: '1',
          LANG: 'C.UTF-8',
          LC_ALL: 'C.UTF-8',
        },
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: !IS_WINDOWS,
      });
    } catch (error) {
      resolve({
        stdout: '',
        stderr: humanizeSpawnError(error instanceof Error ? error.message : String(error)),
        exitCode: -1,
        timedOut: false,
        truncated: false,
        durationMs: Date.now() - started,
      });
      return;
    }

    const finish = (result: Omit<SpawnResult, 'durationMs'>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ ...result, durationMs: Date.now() - started });
    };

    const timer = setTimeout(() => {
      timedOut = true;
      killTree(child.pid);
    }, options.timeoutMs);

    child.stdout?.on('data', (chunk: Buffer) => {
      if (stdout.length + chunk.length > maxOutput) {
        stdout = Buffer.concat([stdout, chunk.subarray(0, Math.max(0, maxOutput - stdout.length))]);
        truncated = true;
        killTree(child.pid);
      } else {
        stdout = Buffer.concat([stdout, chunk]);
      }
    });
    child.stderr?.on('data', (chunk: Buffer) => {
      if (stderr.length + chunk.length > maxOutput) {
        stderr = Buffer.concat([stderr, chunk.subarray(0, Math.max(0, maxOutput - stderr.length))]);
        truncated = true;
        killTree(child.pid);
      } else {
        stderr = Buffer.concat([stderr, chunk]);
      }
    });
    child.on('error', (error) => {
      finish({
        stdout: stdout.toString('utf8'),
        stderr: humanizeSpawnError(`${stderr.toString('utf8')}\n${error.message}`.trim()),
        exitCode: -1,
        timedOut,
        truncated,
      });
    });
    child.on('close', (code) => {
      finish({
        stdout: stdout.toString('utf8'),
        stderr: stderr.toString('utf8'),
        exitCode: code,
        timedOut,
        truncated,
      });
    });
    if (options.input) {
      child.stdin?.write(options.input, 'utf8');
    }
    child.stdin?.end();
  });
}

function cxxArgs(entryFiles: string[], output: string, debug: boolean): string[] {
  const flags = config.judge.cxxFlags.split(/\s+/).filter(Boolean);
  const args = [
    `-std=${config.judge.cxxStandard}`,
    ...flags,
    '-fdiagnostics-color=never',
    ...(IS_WINDOWS ? ['-finput-charset=UTF-8', '-fexec-charset=UTF-8'] : []),
    ...(debug ? ['-g', '-O0'] : []),
    ...entryFiles,
    '-o',
    output,
  ];
  return args;
}

function runVerdict(run: SpawnResult): RunResult['verdict'] {
  if (/应用控制策略|spawn UNKNOWN/i.test(run.stderr)) return 'SE';
  if (run.timedOut) return 'TLE';
  if (run.truncated) return 'OLE';
  return run.exitCode === 0 ? 'OK' : 'RE';
}

function cleanOutput(text: string, workDir: string): string {
  return text.replaceAll(workDir, '<workdir>').replaceAll(workDir.replaceAll('\\', '/'), '<workdir>');
}

export async function executeCode(input: ExecuteInput): Promise<RunResult> {
  validateFiles(input.files);
  if (!input.files[input.entryFile]) {
    return {
      verdict: 'SE',
      compileOutput: '',
      stdout: '',
      stderr: `入口文件不存在: ${input.entryFile}`,
      exitCode: -1,
      timeMs: 0,
      timedOut: false,
      outputTruncated: false,
    };
  }
  const workDir = await makeWorkDir('codelab-run-');
  try {
    await writeFiles(workDir, input.files);
    if (input.language === 'cpp') {
      if (!config.judge.cxx) {
        return {
          verdict: 'SE',
          compileOutput: '',
          stdout: '',
          stderr: '未找到 C++ 编译器，请检查 CXX 环境变量或工具链安装。',
          exitCode: -1,
          timeMs: 0,
          timedOut: false,
          outputTruncated: false,
        };
      }
      const sources = Object.keys(input.files)
        .filter((file) => file.endsWith('.cpp'))
        .sort((a, b) => (a === input.entryFile ? -1 : b === input.entryFile ? 1 : 0));
      if (!sources.includes(input.entryFile)) sources.unshift(input.entryFile);
      const exeName = IS_WINDOWS ? 'program.exe' : 'program';
      const exePath = path.join(workDir, exeName);
      const cacheKey = cppSourceHash(input);
      let compileOutput = '';
      const cached = cppCache.get(cacheKey);
      const cacheFresh = cached && Date.now() - cached.createdAt < CPP_CACHE_TTL_MS;
      let runtimeExePath = exePath;
      if (cacheFresh && cached) {
        runtimeExePath = cached.exePath;
        compileOutput = cached.compileOutput;
      }
      if (!cacheFresh) {
        const compiled = await spawnCapture(
          config.judge.cxx,
          cxxArgs(sources, exeName, Boolean(input.debug)),
          {
            cwd: workDir,
            timeoutMs: config.judge.compileTimeoutMs,
            env: { TMP: workDir, TEMP: workDir },
          },
        );
        compileOutput = cleanOutput(
          `${compiled.stdout}\n${compiled.stderr}`.trim(),
          workDir,
        );
        if (compiled.timedOut) {
          return {
            verdict: 'CE',
            compileOutput: `${compileOutput}\n编译超时`,
            stdout: '',
            stderr: '',
            exitCode: compiled.exitCode,
            timeMs: compiled.durationMs,
            timedOut: true,
            outputTruncated: compiled.truncated,
          };
        }
        if (compiled.exitCode !== 0) {
          return {
            verdict: 'CE',
            compileOutput: compileOutput || '编译失败',
            stdout: '',
            stderr: '',
            exitCode: compiled.exitCode,
            timeMs: compiled.durationMs,
            timedOut: false,
            outputTruncated: compiled.truncated,
          };
        }
        try {
          const cacheDir = path.join(config.dataDir, 'cache-cpp', cacheKey);
          await fs.mkdir(cacheDir, { recursive: true });
          const cachedExe = path.join(cacheDir, exeName);
          await fs.copyFile(exePath, cachedExe);
          cppCache.set(cacheKey, {
            exePath: cachedExe,
            compileOutput,
            createdAt: Date.now(),
          });
          if (cppCache.size > 80) {
            const oldest = [...cppCache.entries()].sort(
              (a, b) => a[1].createdAt - b[1].createdAt,
            )[0];
            if (oldest) {
              cppCache.delete(oldest[0]);
              await fs.rm(path.dirname(oldest[1].exePath), {
                recursive: true,
                force: true,
              });
            }
          }
        } catch {
          // A failed cache write should never fail the submission.
        }
      }
      const run = await spawnCapture(runtimeExePath, [], {
        cwd: workDir,
        input: input.stdin,
        // Windows Defender can delay first execution of a freshly compiled
        // binary by several seconds. Keep a generous wall-clock ceiling on
        // Windows so a legitimate solution is not reported as TLE.
        timeoutMs: IS_WINDOWS
          ? Math.max(input.timeLimitMs ?? config.judge.runTimeoutMs, 15000)
          : input.timeLimitMs ?? config.judge.runTimeoutMs,
        env: { TMP: workDir, TEMP: workDir },
      });
      return {
        verdict: runVerdict(run),
        compileOutput,
        stdout: cleanOutput(run.stdout, workDir),
        stderr: cleanOutput(run.stderr, workDir),
        exitCode: run.exitCode,
        timeMs: run.durationMs,
        timedOut: run.timedOut,
        outputTruncated: run.truncated,
      };
    }

    if (!config.judge.python) {
      return {
        verdict: 'SE',
        compileOutput: '',
        stdout: '',
        stderr: '未找到 Python 解释器，请检查 PYTHON 环境变量。',
        exitCode: -1,
        timeMs: 0,
        timedOut: false,
        outputTruncated: false,
      };
    }
    const run = await spawnCapture(
      config.judge.python,
      ['-B', input.entryFile],
      {
        cwd: workDir,
        input: input.stdin,
        timeoutMs: input.timeLimitMs ?? config.judge.runTimeoutMs,
        env: { TMP: workDir, TEMP: workDir },
      },
    );
    return {
      verdict: runVerdict(run),
      compileOutput: '',
      stdout: cleanOutput(run.stdout, workDir),
      stderr: cleanOutput(run.stderr, workDir),
      exitCode: run.exitCode,
      timeMs: run.durationMs,
      timedOut: run.timedOut,
      outputTruncated: run.truncated,
    };
  } finally {
    await removeDir(workDir);
  }
}

export interface TraceStep {
  line: number;
  locals: Record<string, string>;
}

export interface TraceResult {
  steps: TraceStep[];
  stdout: string;
  stderr: string;
  error: string | null;
  timedOut: boolean;
}

export async function traceCpp(input: ExecuteInput): Promise<TraceResult> {
  validateFiles(input.files);
  if (!config.judge.gdb) {
    return {
      steps: [],
      stdout: '',
      stderr: '',
      error: '未找到 gdb，无法执行 C++ 单步调试。',
      timedOut: false,
    };
  }
  const workDir = await makeWorkDir('codelab-cpp-debug-');
  try {
    await writeFiles(workDir, input.files);
    const sources = Object.keys(input.files)
      .filter((file) => file.endsWith('.cpp'))
      .sort((a, b) => (a === input.entryFile ? -1 : b === input.entryFile ? 1 : 0));
    if (!sources.includes(input.entryFile)) sources.unshift(input.entryFile);
    const flags = config.judge.cxxFlags.split(/\s+/).filter(Boolean);
    const baseFlags = [
      `-std=${config.judge.cxxStandard}`,
      ...flags,
      '-O0',
      '-g',
      '-fdiagnostics-color=never',
      ...(IS_WINDOWS ? ['-finput-charset=UTF-8', '-fexec-charset=UTF-8'] : []),
    ];
    const objectFiles: string[] = [];
    let compileOutput = '';
    for (const [index, source] of sources.entries()) {
      const objectFile = `user_${index}.o`;
      const compiled = await spawnCapture(
        config.judge.cxx!,
        [...baseFlags, '-Dmain=__student_main', '-c', source, '-o', objectFile],
        {
          cwd: workDir,
          timeoutMs: config.judge.compileTimeoutMs,
          env: { TMP: workDir, TEMP: workDir },
        },
      );
      compileOutput += `${compiled.stdout}\n${compiled.stderr}\n`;
      if (compiled.exitCode !== 0 || compiled.timedOut) {
        return {
          steps: [],
          stdout: '',
          stderr: cleanOutput(compileOutput.trim(), workDir),
          error: '编译失败，请先修复编译错误。',
          timedOut: compiled.timedOut,
        };
      }
      objectFiles.push(objectFile);
    }

    const harnessPath = path.join(workDir, '__harness.cpp');
    await fs.writeFile(
      harnessPath,
      `#include <cstdio>
extern int __student_main();
int main() {
  if (!freopen("input.txt", "r", stdin)) return 3;
  if (!freopen("program.out", "w", stdout)) return 4;
  if (!freopen("program.err", "w", stderr)) return 5;
  int code = __student_main();
  fflush(stdout);
  fflush(stderr);
  return code;
}
`,
      'utf8',
    );
    const harnessCompile = await spawnCapture(
      config.judge.cxx!,
      [...baseFlags, '-c', '__harness.cpp', '-o', '__harness.o'],
      {
        cwd: workDir,
        timeoutMs: config.judge.compileTimeoutMs,
        env: { TMP: workDir, TEMP: workDir },
      },
    );
    compileOutput += `${harnessCompile.stdout}\n${harnessCompile.stderr}\n`;
    if (harnessCompile.exitCode !== 0 || harnessCompile.timedOut) {
      return {
        steps: [],
        stdout: '',
        stderr: cleanOutput(compileOutput.trim(), workDir),
        error: '调试辅助程序编译失败。',
        timedOut: harnessCompile.timedOut,
      };
    }

    const exeName = IS_WINDOWS ? 'program.exe' : 'program';
    const linked = await spawnCapture(
      config.judge.cxx!,
      [...objectFiles, '__harness.o', '-o', exeName],
      {
        cwd: workDir,
        timeoutMs: config.judge.compileTimeoutMs,
        env: { TMP: workDir, TEMP: workDir },
      },
    );
    compileOutput += `${linked.stdout}\n${linked.stderr}\n`;
    if (linked.exitCode !== 0 || linked.timedOut) {
      return {
        steps: [],
        stdout: '',
        stderr: cleanOutput(compileOutput.trim(), workDir),
        error: '调试程序链接失败。',
        timedOut: linked.timedOut,
      };
    }

    await fs.writeFile(path.join(workDir, 'input.txt'), input.stdin, 'utf8');
    const entryFileName = path.basename(input.entryFile);
    const traceScript = `import gdb, json

ENTRY = ${JSON.stringify(entryFileName)}
MAX_STEPS = 200
steps = []
error = None

gdb.execute('set pagination off')
gdb.execute('set confirm off')
gdb.execute('set auto-load safe-path /')
gdb.execute('break __student_main')
gdb.execute('run')

for _ in range(MAX_STEPS):
    try:
        frame = gdb.newest_frame()
        sal = frame.find_sal()
        line = sal.line if sal else 0
        filename = sal.symtab.filename if sal and sal.symtab else ''
        if not filename.replace('\\\\', '/').endswith(ENTRY):
            gdb.execute('next')
            continue
        local_vars = {}
        block = frame.block()
        while block and not block.is_global:
            for sym in block:
                if sym.is_variable:
                    try:
                        local_vars[sym.name] = str(sym.value(frame))
                    except Exception:
                        pass
            block = block.superblock
        if not steps or steps[-1]['line'] != line or steps[-1]['locals'] != local_vars:
            steps.append({'line': line, 'locals': local_vars})
        gdb.execute('next')
    except gdb.error as exc:
        error = str(exc)
        break

with open('trace.json', 'w', encoding='utf-8') as handle:
    json.dump({'steps': steps, 'error': error}, handle, ensure_ascii=False)
`;
    await fs.writeFile(path.join(workDir, 'trace.py'), traceScript, 'utf8');

    const gdbRun = await spawnCapture(
      config.judge.gdb,
      ['-batch', '-ex', 'source trace.py', '--args', exeName],
      {
        cwd: workDir,
        timeoutMs: 20000,
        env: { TMP: workDir, TEMP: workDir },
      },
    );
    let trace: { steps: TraceStep[]; error: string | null } = { steps: [], error: null };
    try {
      trace = JSON.parse(await fs.readFile(path.join(workDir, 'trace.json'), 'utf8')) as {
        steps: TraceStep[];
        error: string | null;
      };
    } catch {
      // GDB may have failed before the Python trace script wrote its result.
    }
    const stdout = await readOptional(path.join(workDir, 'program.out'));
    const stderr = await readOptional(path.join(workDir, 'program.err'));
    const raw = `${gdbRun.stdout}\n${gdbRun.stderr}`;
    return {
      steps: trace.steps,
      stdout: cleanOutput(stdout, workDir),
      stderr: cleanOutput(stderr, workDir),
      error:
        gdbRun.timedOut
          ? '调试执行超时，可能命中了过多步骤或死循环。'
          : trace.steps.length === 0
            ? trace.error || cleanOutput(raw.trim().slice(0, 2000), workDir) || '没有采集到执行轨迹。'
            : null,
      timedOut: gdbRun.timedOut,
    };
  } finally {
    await removeDir(workDir);
  }
}

async function readOptional(file: string): Promise<string> {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return '';
  }
}

export async function tracePython(input: ExecuteInput): Promise<TraceResult> {
  validateFiles(input.files);
  const workDir = await makeWorkDir('codelab-debug-');
  try {
    await writeFiles(workDir, input.files);
    const harness = `
import sys, json, runpy, io, contextlib, traceback

entry = sys.argv[1]
max_steps = 400
steps = []

def safe(value):
    try:
        text = repr(value)
    except Exception:
        text = '<unrepr>'
    if len(text) > 180:
        text = text[:177] + '...'
    return text

def tracer(frame, event, arg):
    if event == 'line' and frame.f_code.co_filename.endswith(entry):
        if len(steps) < max_steps:
            local_vars = {}
            for key, value in list(frame.f_locals.items()):
                if key.startswith('__'):
                    continue
                local_vars[key] = safe(value)
            steps.append({'line': frame.f_lineno, 'locals': local_vars})
    return tracer

out = io.StringIO()
err = io.StringIO()
error = None
try:
    sys.settrace(tracer)
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        runpy.run_path(entry, run_name='__main__')
except SystemExit as exc:
    if exc.code not in (0, None):
        error = '程序以状态码 %s 退出' % exc.code
except Exception:
    error = traceback.format_exc(limit=6)
finally:
    sys.settrace(None)

with open('__trace.json', 'w', encoding='utf-8') as handle:
    json.dump({'steps': steps, 'stdout': out.getvalue(), 'stderr': err.getvalue(), 'error': error}, handle, ensure_ascii=False)
`;
    await fs.writeFile(path.join(workDir, '__trace_runner.py'), harness, 'utf8');
    const run = await spawnCapture(
      config.judge.python!,
      ['-B', '__trace_runner.py', input.entryFile],
      {
        cwd: workDir,
        input: input.stdin,
        timeoutMs: input.timeLimitMs ?? config.judge.runTimeoutMs,
        env: { TMP: workDir, TEMP: workDir },
      },
    );
    let trace: Omit<TraceResult, 'timedOut'> = {
      steps: [],
      stdout: cleanOutput(run.stdout, workDir),
      stderr: cleanOutput(run.stderr, workDir),
      error: null,
    };
    try {
      const raw = await fs.readFile(path.join(workDir, '__trace.json'), 'utf8');
      trace = JSON.parse(raw) as typeof trace;
    } catch {
      // The process may have been killed before the harness wrote the trace.
    }
    return {
      ...trace,
      stdout: cleanOutput(trace.stdout || run.stdout, workDir),
      stderr: cleanOutput(trace.stderr || run.stderr, workDir),
      timedOut: run.timedOut,
    };
  } finally {
    await removeDir(workDir);
  }
}
