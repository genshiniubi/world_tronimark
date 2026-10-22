import { createHash } from 'node:crypto';
import type {
  AiCompletionItem,
  AiCompletionResponse,
  AiExplainResponse,
  AiReview,
  Language,
  ProblemSummary,
} from '@codelab/shared';
import { explainResponseSchema, reviewResponseSchema } from '@codelab/shared';
import type { AppDatabase } from '../db/database.js';
import { config } from '../config.js';
import { chat, isAiConfigured, parseJsonObject } from './provider.js';
import { fallbackExplain, fallbackReview, localCompletions } from './fallback.js';

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function languageName(language: Language): string {
  return language === 'cpp' ? 'C++17' : 'Python 3';
}

export async function completeCode(input: {
  db: AppDatabase;
  language: Language;
  code: string;
  cursor: number;
  prefix: string;
  problemTitle?: string;
}): Promise<AiCompletionResponse> {
  const local = localCompletions(input.language, input.code, input.cursor);
  if (!isAiConfigured() || input.code.length < 8) {
    return { items: local, degraded: !isAiConfigured() };
  }
  const cacheKey = hash(
    `complete:${config.ai.model}:${input.language}:${input.code.slice(-3000)}:${input.cursor}:${input.prefix}`,
  );
  const cached = input.db.getAiCache(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached) as AiCompletionResponse;
    } catch {
      // ignore bad cache
    }
  }
  const before = input.code.slice(Math.max(0, input.cursor - 3000), input.cursor);
  const after = input.code.slice(input.cursor, input.cursor + 800);
  const response = await chat(
    [
      {
        role: 'system',
        content:
          '你是一个代码补全引擎。只输出 JSON：{"items":[{"label":"短标签","insertText":"要插入的文本","detail":"一句话说明"}]}。最多 5 项。只补全当前光标处的词或一行短代码，不要输出完整题解，不要 Markdown，不要解释。',
      },
      {
        role: 'user',
        content: `语言：${languageName(input.language)}\n题目：${input.problemTitle ?? '未提供'}\n光标前代码：\n${before}\n\n光标后代码：\n${after}\n\n用户已输入前缀：${input.prefix || '（无）'}`,
      },
    ],
    { json: true, maxTokens: 400, timeoutMs: 7000, temperature: 0.1 },
  ).catch(() => null);
  if (!response) return { items: local, degraded: false };
  let aiItems: AiCompletionItem[] = [];
  try {
    const parsed = parseJsonObject<{ items?: Array<Record<string, unknown>> }>(response);
    aiItems = (parsed.items ?? [])
      .filter((item) => typeof item.label === 'string' && typeof item.insertText === 'string')
      .slice(0, 5)
      .map((item) => ({
        label: String(item.label),
        insertText: String(item.insertText),
        detail: typeof item.detail === 'string' ? item.detail : 'AI 建议',
        kind: 'ai' as const,
        source: 'ai' as const,
      }));
  } catch {
    aiItems = [];
  }
  const merged = [...local, ...aiItems].slice(0, 12);
  const result: AiCompletionResponse = { items: merged, degraded: false };
  input.db.setAiCache(cacheKey, 'completion', result);
  return result;
}

export async function explainSelection(input: {
  db: AppDatabase;
  language: Language;
  selectedText: string;
  context: string;
  question?: string;
  problemTitle?: string;
  problemStatement?: string;
}): Promise<AiExplainResponse> {
  if (!isAiConfigured()) {
    return fallbackExplain(input.language, input.selectedText, input.question);
  }
  const cacheKey = hash(
    `explain:${config.ai.model}:${input.language}:${input.selectedText}:${input.question ?? ''}:${input.problemTitle ?? ''}`,
  );
  const cached = input.db.getAiCache(cacheKey);
  if (cached) {
    try {
      const parsed = explainResponseSchema.parse(JSON.parse(cached));
      return parsed;
    } catch {
      // ignore bad cache
    }
  }
  try {
    const response = await chat(
      [
        {
          role: 'system',
          content:
            '你是编程学习网站的中文助教。请解释学生选中的代码。只输出 JSON，字段为 meaning、why、alternatives、convenient、answer。meaning：这段在做什么；why：为什么这样写；alternatives：还能怎么写；convenient：怎样写更方便、更不容易错；answer：如果学生有问题就回答，否则为空字符串。不要输出 Markdown 代码围栏，不要编造不存在的 API。',
        },
        {
          role: 'user',
          content: `语言：${languageName(input.language)}\n题目：${input.problemTitle ?? '未提供'}\n题面摘要：${(input.problemStatement ?? '').slice(0, 2500)}\n\n选中代码：\n${input.selectedText}\n\n上下文：\n${input.context.slice(0, 6000)}\n\n学生问题：${input.question ?? '（无，请做四段解释）'}`,
        },
      ],
      { json: true, maxTokens: 1200, temperature: 0.2 },
    );
    const parsed = explainResponseSchema.parse({
      ...parseJsonObject<Record<string, unknown>>(response),
      degraded: false,
    });
    input.db.setAiCache(cacheKey, 'explain', parsed);
    return parsed;
  } catch {
    return fallbackExplain(input.language, input.selectedText, input.question);
  }
}

export async function reviewSubmission(input: {
  db: AppDatabase;
  problem: {
    id: string;
    title: string;
    statement: string;
    knowledgePoints: string[];
    samples: Array<{ input: string; output: string }>;
  };
  language: Language;
  files: Record<string, string>;
  verdict: string;
  passed: number;
  total: number;
  compileOutput: string;
  attempts: number;
  attemptHistory: Array<{ verdict: string; passed: number; total: number; createdAt: string }>;
  similar: ProblemSummary[];
}): Promise<AiReview> {
  const fallback = fallbackReview({
    verdict: input.verdict,
    passed: input.passed,
    total: input.total,
    compileOutput: input.compileOutput,
    attempts: input.attempts,
    similar: input.similar,
  });
  if (!isAiConfigured()) return fallback;
  const cacheKey = hash(
    `review:${config.ai.model}:${input.problem.id}:${input.verdict}:${input.passed}/${input.total}:${Object.values(input.files).join('\n').slice(0, 8000)}`,
  );
  const cached = input.db.getAiCache(cacheKey);
  if (cached) {
    try {
      const parsed = reviewResponseSchema.parse(JSON.parse(cached));
      return { ...parsed, passed: input.verdict === 'AC' };
    } catch {
      // ignore bad cache
    }
  }
  const code = Object.entries(input.files)
    .map(([file, content]) => `--- ${file} ---\n${content}`)
    .join('\n\n')
    .slice(0, 12_000);
  try {
    const response = await chat(
      [
        {
          role: 'system',
          content:
            '你是编程学习网站的中文教练。判题结果已经确定，你不能改变 passed。只输出 JSON，字段：passed(boolean)、headline(string)、strengths(string[])、issues(string[])、suggestions(string[])、complexity(string)、processNote(string)、similarProblemIds(string[])。从正确性、边界、可读性、复杂度、调试过程五个角度给具体、简短的建议；不要给完整答案；不要编造测试结果。',
        },
        {
          role: 'user',
          content: `题目：${input.problem.title}\n知识点：${input.problem.knowledgePoints.join('、')}\n判题结果：${input.verdict}，通过 ${input.passed}/${input.total}\n提交次数：${input.attempts}\n最近提交：${input.attemptHistory.map((item) => `${item.verdict} ${item.passed}/${item.total} @ ${item.createdAt}`).join('；') || '（无）'}\n编译输出：${input.compileOutput.slice(0, 2000) || '（无）'}\n候选相似题 ID：${input.similar.map((item) => item.id).join(', ') || '（无）'}\n\n学生代码：\n${code}`,
        },
      ],
      { json: true, maxTokens: 1200, temperature: 0.2 },
    );
    const parsed = reviewResponseSchema.parse({
      ...parseJsonObject<Record<string, unknown>>(response),
      passed: input.verdict === 'AC',
      degraded: false,
    });
    const allowed = new Set(input.similar.map((item) => item.id));
    parsed.similarProblemIds = parsed.similarProblemIds.filter((id) => allowed.has(id));
    if (parsed.similarProblemIds.length === 0) {
      parsed.similarProblemIds = input.similar.slice(0, 3).map((item) => item.id);
    }
    input.db.setAiCache(cacheKey, 'review', parsed);
    return parsed;
  } catch {
    return fallback;
  }
}
