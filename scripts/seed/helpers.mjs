import { promises as fs } from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(process.cwd());
export const CONTENT = path.join(ROOT, 'content');

export async function writeText(file, content) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}

export async function writeJson(file, value) {
  await writeText(file, JSON.stringify(value, null, 2));
}

export async function resetDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

function codeBlock(language, code) {
  return `\`\`\`${language}\n${code.replace(/\s+$/, '')}\n\`\`\``;
}

function statementMarkdown(def) {
  const sections = [];
  sections.push(`# ${def.title}`);
  sections.push(
    `> ${def.scenarioLabel} · ${def.estimatedMinutes} 分钟 · 知识点：${def.knowledgePoints.join('、')}`,
  );
  sections.push('## 情景');
  sections.push(def.statement.scenarioText);
  sections.push('## 任务');
  sections.push(def.statement.task);
  sections.push('## 输入格式');
  sections.push(def.statement.input);
  sections.push('## 输出格式');
  sections.push(def.statement.output);
  sections.push('## 样例');
  def.samples.forEach((sample, index) => {
    sections.push(`### 样例 ${index + 1}`);
    sections.push('**输入**');
    sections.push(codeBlock('text', sample.input));
    sections.push('**输出**');
    sections.push(codeBlock('text', sample.output));
    if (sample.explanation) {
      sections.push(`**解释**：${sample.explanation}`);
    }
  });
  sections.push('## 数据范围');
  sections.push(def.statement.constraints);
  if (def.statement.note) {
    sections.push('## 提示');
    sections.push(def.statement.note);
  }
  sections.push('## 知识点');
  sections.push(def.knowledgePoints.map((tag) => `\`${tag}\``).join(' · '));
  return sections.join('\n\n');
}

function solutionMarkdown(def) {
  const parts = [`# ${def.title} · 题解`, '## 思路', def.idea];
  for (const [language, data] of Object.entries(def.languages)) {
    parts.push(`## ${language === 'cpp' ? 'C++17' : 'Python 3'} 参考代码`);
    parts.push(codeBlock(language === 'cpp' ? 'cpp' : 'python', data.solution));
  }
  if (def.pitfalls?.length) {
    parts.push('## 常见错误');
    parts.push(def.pitfalls.map((item) => `- ${item}`).join('\n'));
  }
  return parts.join('\n\n');
}

export async function writeProblem(def) {
  const dir = path.join(CONTENT, 'tracks', def.track, 'problems', def.slug);
  await fs.mkdir(dir, { recursive: true });
  const languages = Object.keys(def.languages);
  const entryFiles = {};
  for (const language of languages) {
    const entry = def.languages[language].entry;
    entryFiles[language] = entry;
    await writeText(path.join(dir, 'starters', language, entry), def.languages[language].starter);
    await writeText(path.join(dir, 'solutions', language, entry), def.languages[language].solution);
  }
  const meta = {
    id: def.id,
    slug: def.slug,
    title: def.title,
    moduleId: def.moduleId,
    order: def.order,
    difficulty: def.difficulty,
    scenario: def.scenario,
    scenarioLabel: def.scenarioLabel,
    knowledgePoints: def.knowledgePoints,
    prerequisites: def.prerequisites ?? [],
    estimatedMinutes: def.estimatedMinutes,
    summary: def.summary,
    languages,
    entryFiles,
    timeLimitMs: def.timeLimitMs ?? 2000,
    checker: def.checker ?? 'token',
    samples: def.samples.map((sample, index) => ({
      id: `sample-${index + 1}`,
      input: sample.input,
      output: sample.output,
      ...(sample.explanation ? { explanation: sample.explanation } : {}),
    })),
    tests: def.tests.map((test, index) => ({
      id: `hidden-${index + 1}`,
      input: test.input,
      output: test.output,
    })),
    hints: def.hints ?? [],
    similar: def.similar ?? [],
  };
  await writeJson(path.join(dir, 'meta.json'), meta);
  await writeText(path.join(dir, 'statement.md'), statementMarkdown(def));
  await writeText(path.join(dir, 'solution.md'), solutionMarkdown(def));
}

export async function finish() {
  console.log('content generated');
}
