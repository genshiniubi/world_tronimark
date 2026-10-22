import type { CheckerType, TestCaseResult, Verdict } from '@codelab/shared';
import type { RawProblem } from '../content/loader.js';
import { executeCode } from './runner.js';

export interface JudgeOutcome {
  verdict: Verdict;
  passed: number;
  total: number;
  timeMs: number;
  compileOutput: string;
  cases: TestCaseResult[];
}

function normalizeText(value: string): string {
  return value.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[ \t]+$/gm, '').trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value).split(/\s+/).filter(Boolean);
}

function floatEqual(actual: string, expected: string): boolean {
  const a = tokenize(actual);
  const e = tokenize(expected);
  if (a.length !== e.length) return false;
  return a.every((token, index) => {
    const left = Number(token);
    const right = Number(e[index]);
    if (Number.isFinite(left) && Number.isFinite(right)) {
      return Math.abs(left - right) <= 1e-6 * Math.max(1, Math.abs(right));
    }
    return token === e[index];
  });
}

export function compareOutput(
  actual: string,
  expected: string,
  checker: CheckerType,
): boolean {
  if (checker === 'float') return floatEqual(actual, expected);
  if (checker === 'exact') return normalizeText(actual) === normalizeText(expected);
  return tokenize(actual).join(' ') === tokenize(expected).join(' ');
}

export async function judgeProblem(
  problem: RawProblem,
  language: 'cpp' | 'python',
  files: Record<string, string>,
): Promise<JudgeOutcome> {
  const entryFile = problem.meta.entryFiles[language];
  if (!entryFile) {
    return {
      verdict: 'SE',
      passed: 0,
      total: problem.meta.samples.length + problem.meta.tests.length,
      timeMs: 0,
      compileOutput: `题目不支持 ${language}`,
      cases: [],
    };
  }
  const allTests = [
    ...problem.meta.samples.map((test) => ({ ...test, hidden: false })),
    ...problem.meta.tests.map((test) => ({ ...test, hidden: true })),
  ];
  let passed = 0;
  let totalTime = 0;
  let compileOutput = '';
  const cases: TestCaseResult[] = [];

  for (const test of allTests) {
    const result = await executeCode({
      language,
      files,
      entryFile,
      stdin: test.input,
      timeLimitMs: problem.meta.timeLimitMs,
    });
    totalTime += result.timedOut ? problem.meta.timeLimitMs : result.timeMs;
    compileOutput = result.compileOutput || compileOutput;
    if (result.verdict === 'CE' || result.verdict === 'SE') {
      cases.push({
        id: test.id,
        verdict: result.verdict,
        timeMs: result.timeMs,
        hidden: test.hidden,
        ...(test.hidden ? {} : { input: test.input, expected: test.output }),
        ...(test.hidden ? {} : { actual: result.stdout }),
        ...(test.hidden ? {} : { stderr: result.stderr }),
      });
      return {
        verdict: result.verdict,
        passed,
        total: allTests.length,
        timeMs: totalTime,
        compileOutput,
        cases,
      };
    }
    const runtimeVerdict = result.verdict as Verdict | 'OK';
    let verdict: Verdict = 'AC';
    if (runtimeVerdict === 'TLE') verdict = 'TLE';
    else if (runtimeVerdict === 'OLE') verdict = 'OLE';
    else if (runtimeVerdict === 'RE') verdict = 'RE';
    else if (!compareOutput(result.stdout, test.output, problem.meta.checker)) verdict = 'WA';

    const caseResult: TestCaseResult = {
      id: test.id,
      verdict,
      timeMs: result.timeMs,
      hidden: test.hidden,
      ...(test.hidden
        ? {}
        : {
            input: test.input,
            expected: test.output,
            actual: result.stdout,
            stderr: result.stderr,
          }),
    };
    cases.push(caseResult);
    if (verdict === 'AC') {
      passed += 1;
    } else {
      return {
        verdict,
        passed,
        total: allTests.length,
        timeMs: totalTime,
        compileOutput,
        cases,
      };
    }
  }

  return {
    verdict: 'AC',
    passed,
    total: allTests.length,
    timeMs: totalTime,
    compileOutput,
    cases,
  };
}
