import { loadContent } from '../apps/server/src/content/loader.js';

const content = await loadContent();
const errors: string[] = [];
const warnings: string[] = [];

for (const track of content.tracks) {
  const moduleIds = new Set<string>();
  const problemIds = new Set<string>();
  const orders = new Set<number>();
  for (const module of track.modules) {
    if (moduleIds.has(module.meta.id)) errors.push(`模块 ID 重复: ${track.meta.id}/${module.meta.id}`);
    moduleIds.add(module.meta.id);
    if (module.lesson.trim().length < 40) {
      warnings.push(`模块知识卡过短: ${track.meta.id}/${module.meta.id}`);
    }
    const moduleProblems = track.problems.filter(
      (problem) => problem.meta.moduleId === module.meta.id,
    );
    if (moduleProblems.length === 0 && track.meta.kind === 'coding') {
      warnings.push(`模块没有练习题: ${track.meta.id}/${module.meta.id}`);
    }
  }
  for (const problem of track.problems) {
    if (problemIds.has(problem.meta.id)) errors.push(`题目 ID 重复: ${problem.meta.id}`);
    problemIds.add(problem.meta.id);
    if (orders.has(problem.meta.order)) {
      errors.push(`题目顺序重复: ${track.meta.id}/${problem.meta.order}`);
    }
    orders.add(problem.meta.order);
    if (problem.meta.samples.length === 0) errors.push(`题目没有样例: ${problem.meta.id}`);
    if (problem.meta.tests.length === 0) warnings.push(`题目没有隐藏用例: ${problem.meta.id}`);
    for (const language of problem.meta.languages) {
      if (!problem.solutions[language]) {
        errors.push(`题目缺少 ${language} 官方题解: ${problem.meta.id}`);
      }
      if (!problem.starters[language]) {
        errors.push(`题目缺少 ${language} 起始代码: ${problem.meta.id}`);
      }
    }
    for (const tag of problem.meta.knowledgePoints) {
      if (!content.taxonomy.has(tag)) errors.push(`未知知识点 ${tag}: ${problem.meta.id}`);
    }
  }
  if (track.problems.length === 0 && track.meta.kind === 'coding') {
    warnings.push(`学习路径没有题目: ${track.meta.id}`);
  }
}

if (content.sitePages.size < 3) errors.push('站点页面不足 about/contact/sponsor');

console.log('=== 内容校验 ===');
console.log(`学习路径: ${content.tracks.length}`);
console.log(`题目: ${content.problems.size}`);
console.log(`知识点: ${content.taxonomy.size}`);
for (const track of content.tracks) {
  console.log(`- ${track.meta.title}: ${track.meta.modules.length} 模块 / ${track.problems.length} 题`);
}
if (warnings.length) {
  console.log('\n警告:');
  warnings.forEach((warning) => console.log(`  ! ${warning}`));
}
if (errors.length) {
  console.error('\n错误:');
  errors.forEach((error) => console.error(`  x ${error}`));
  process.exit(1);
}
console.log('\n内容校验通过');
