import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

export const ROOT_DIR = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)));

dotenv.config({ path: path.join(ROOT_DIR, '.env') });
dotenv.config({ path: path.join(ROOT_DIR, '.env.local'), override: true });

function env(name: string, fallback = ''): string {
  return process.env[name]?.trim() || fallback;
}

function findExecutable(candidates: string[]): string | null {
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (candidate.includes('/') || candidate.includes('\\')) {
      if (existsSync(candidate)) return candidate;
      continue;
    }
    const lookup = process.platform === 'win32' ? 'where.exe' : 'which';
    const result = spawnSync(lookup, [candidate], { encoding: 'utf8', windowsHide: true });
    if (result.status === 0) {
      const first = result.stdout.split(/\r?\n/).find((line) => line.trim());
      if (first) return first.trim();
    }
  }
  return null;
}

function versionOf(executable: string | null, args: string[]): string | null {
  if (!executable) return null;
  const result = spawnSync(executable, args, {
    encoding: 'utf8',
    timeout: 5000,
    windowsHide: true,
  });
  if (result.status !== 0) return null;
  const text = `${result.stdout || ''}\n${result.stderr || ''}`.trim();
  return text.split(/\r?\n/)[0]?.trim() || null;
}

export const config = {
  rootDir: ROOT_DIR,
  contentDir: path.join(ROOT_DIR, 'content'),
  dataDir: path.resolve(ROOT_DIR, env('DATA_DIR', './data')),
  port: Number(env('PORT', '3001')),
  host: env('HOST', '127.0.0.1'),
  nodeEnv: env('NODE_ENV', 'development'),
  sessionSecret: env('SESSION_SECRET', 'codelab-dev-secret-change-me'),
  webDistDir: path.join(ROOT_DIR, 'apps', 'web', 'dist'),
  judge: {
    cxx: findExecutable([
      env('CXX'),
      path.join(ROOT_DIR, 'tools', 'msys64', 'mingw64', 'bin', 'g++.exe'),
      path.join(ROOT_DIR, 'tools', 'mingw64', 'bin', 'g++.exe'),
      path.join(ROOT_DIR, 'tools', 'winlibs', 'mingw64', 'bin', 'g++.exe'),
      'g++',
      'clang++',
    ]),
    cxxStandard: env('CXX_STANDARD', 'c++17'),
    cxxFlags: env('CXX_FLAGS', '-O2 -pipe -static-libgcc -static-libstdc++'),
    python: findExecutable([
      env('PYTHON'),
      'python',
      'python3',
      'py',
    ]),
    gdb: findExecutable([
      env('GDB'),
      path.join(ROOT_DIR, 'tools', 'msys64', 'mingw64', 'bin', 'gdb.exe'),
      'gdb',
    ]),
    compileTimeoutMs: Number(env('COMPILE_TIMEOUT_MS', '15000')),
    runTimeoutMs: Number(env('RUN_TIMEOUT_MS', '3000')),
    maxOutputBytes: Number(env('MAX_OUTPUT_BYTES', '65536')),
    maxSourceBytes: Number(env('MAX_SOURCE_BYTES', '65536')),
  },
  ai: {
    enabled: env('AI_ENABLED', 'true') === 'true',
    baseUrl: env('AI_BASE_URL', ''),
    apiKey: env('AI_API_KEY', ''),
    model: env('AI_MODEL', ''),
    timeoutMs: Number(env('AI_TIMEOUT_MS', '20000')),
  },
};

export const toolchain = {
  cxxPath: config.judge.cxx,
  cxxVersion: versionOf(config.judge.cxx, ['--version']),
  pythonPath: config.judge.python,
  pythonVersion: versionOf(config.judge.python, ['--version']),
};

export const aiConfigured = Boolean(
  config.ai.enabled &&
    config.ai.baseUrl &&
    (config.ai.apiKey || /127\.0\.0\.1|localhost/.test(config.ai.baseUrl)),
);

export function ensureDataDir(): void {
  mkdirSync(config.dataDir, { recursive: true });
}
