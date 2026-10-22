import { loadContent } from '../apps/server/src/content/loader.js';
import { judgeProblem } from '../apps/server/src/judge/judge.js';

const content = await loadContent();
let checked = 0;
let failed = 0;
const only = process.argv[2];

for (const track of content.tracks) {
  for (const problem of track.problems) {
    if (only && problem.meta.id !== only && problem.meta.slug !== only) continue;
    for (const language of problem.meta.languages) {
      const files = problem.solutions[language];
      if (!files) {
        console.error(`✗ ${problem.meta.id} [${language}] 缺少官方题解`);
        failed += 1;
        continue;
      }
      const outcome = await judgeProblem(problem, language, files);
      checked += 1;
      if (outcome.verdict === 'AC') {
        console.log(
          `✓ ${problem.meta.id} [${language}] ${outcome.passed}/${outcome.total} (${outcome.timeMs}ms)`,
        );
      } else {
        failed += 1;
        console.error(
          `✗ ${problem.meta.id} [${language}] ${outcome.verdict} ${outcome.passed}/${outcome.total}`,
        );
        if (outcome.compileOutput) console.error(outcome.compileOutput.slice(0, 3000));
        for (const testCase of outcome.cases.filter((item) => item.verdict !== 'AC')) {
          console.error(
            JSON.stringify(
              {
                id: testCase.id,
                input: testCase.input,
                expected: testCase.expected,
                actual: testCase.actual,
                stderr: testCase.stderr?.slice(0, 500),
              },
              null,
              2,
            ),
          );
        }
      }
    }
  }
}

console.log(`\n题解验证完成: ${checked - failed}/${checked} 通过`);
if (failed > 0) process.exit(1);
