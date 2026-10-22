import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import cookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import { ZodError } from 'zod';
import {
  completionRequestSchema,
  explainRequestSchema,
  noteUpsertSchema,
  profileUpdateSchema,
  reviewRequestSchema,
  runRequestSchema,
  submitRequestSchema,
  type HealthInfo,
  type Language,
  type ProblemStatus,
  type SubmissionResult,
} from '@codelab/shared';
import { config, toolchain, aiConfigured } from './config.js';
import { getDatabase, type AppDatabase } from './db/database.js';
import { loadContent, type ContentBundle, type RawProblem } from './content/loader.js';
import {
  buildDashboard,
  toProblemDetail,
  toProblemSummary,
  toTrackDetail,
  toTrackSummary,
} from './content/service.js';
import { executeCode, traceCpp, tracePython, validateFiles } from './judge/runner.js';
import { getCppExecutionStatus, probeCppExecution } from './judge/runner.js';
import { judgeProblem } from './judge/judge.js';
import { aiStatus } from './ai/provider.js';
import {
  completeCode,
  explainSelection,
  reviewSubmission,
} from './ai/service.js';
import { ROOT_DIR } from './content/loader.js';

const COOKIE_NAME = 'codelab_learner';

interface AppContext {
  db: AppDatabase;
  content: ContentBundle;
}

function learnerFor(
  context: AppContext,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const rawCookie = request.cookies[COOKIE_NAME];
  const unsigned = rawCookie ? request.unsignCookie(rawCookie) : null;
  const cookieId = unsigned?.valid ? unsigned.value : undefined;
  const profile = context.db.getOrCreateLearner(cookieId);
  if (profile.id !== cookieId) {
    reply.setCookie(COOKIE_NAME, profile.id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      signed: true,
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return profile;
}

function healthInfo(db: AppDatabase): HealthInfo {
  const cppExecution = getCppExecutionStatus();
  return {
    ok: Boolean(toolchain.pythonPath && toolchain.cxxPath && db.ping()),
    node: process.version,
    python: {
      available: Boolean(toolchain.pythonPath),
      version: toolchain.pythonVersion,
      path: toolchain.pythonPath,
    },
    cpp: {
      available: Boolean(toolchain.cxxPath),
      version: toolchain.cxxVersion,
      path: toolchain.cxxPath,
      standard: config.judge.cxxStandard,
      executionBlocked: cppExecution.blocked,
      executionNote: cppExecution.note,
    },
    database: db.ping(),
    ai: aiStatus(),
    checkedAt: new Date().toISOString(),
  };
}

function findProblem(content: ContentBundle, problemId: string): RawProblem {
  const problem = content.problems.get(problemId);
  if (!problem) {
    const error = new Error('题目不存在') as Error & { statusCode: number };
    error.statusCode = 404;
    throw error;
  }
  return problem;
}

function ensureSupportedLanguage(problem: RawProblem, language: Language): void {
  if (!problem.meta.languages.includes(language)) {
    const error = new Error(`这道题暂不支持 ${language}`) as Error & { statusCode: number };
    error.statusCode = 400;
    throw error;
  }
}

function validateEntry(problem: RawProblem, language: Language, files: Record<string, string>): string {
  const entry = problem.meta.entryFiles[language];
  if (!entry || !files[entry]) {
    const error = new Error(`缺少入口文件 ${entry ?? ''}`) as Error & { statusCode: number };
    error.statusCode = 400;
    throw error;
  }
  return entry;
}

export async function createApp(): Promise<FastifyInstance> {
  const db = getDatabase();
  const content = await loadContent();
  const context: AppContext = { db, content };
  const app = Fastify({
    logger: {
      level: config.nodeEnv === 'production' ? 'info' : 'warn',
    },
    bodyLimit: 1_500_000,
    trustProxy: true,
  });

  await probeCppExecution();

  await app.register(cookie, { secret: config.sessionSecret });

  app.addHook('onSend', async (_request, reply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('X-Frame-Options', 'SAMEORIGIN');
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    reply.header(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'self';",
    );
    return payload;
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: 'VALIDATION_ERROR',
        message: '请求参数不合法',
        details: error.flatten(),
      });
    }
    const status = (error as { statusCode?: number }).statusCode ?? 500;
    if (status >= 500) request.log.error(error);
    return reply.code(status).send({
      error: status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR',
      message:
        status >= 500 && config.nodeEnv === 'production'
          ? '服务器处理请求时出错'
          : (error as Error).message || '请求失败',
    });
  });

  app.get('/api/health', async () => healthInfo(db));

  app.get('/api/bootstrap', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const progress = db.getProgressMap(profile.id);
    return {
      profile,
      tracks: content.tracks.map((track) => toTrackSummary(track, progress)),
      ai: aiStatus(),
      site: content.site,
      health: healthInfo(db),
    };
  });

  app.get('/api/dashboard', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const progress = db.getProgressMap(profile.id);
    return buildDashboard(content, profile, progress, db);
  });

  app.patch('/api/profile', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const body = profileUpdateSchema.parse(request.body);
    db.updateDisplayName(profile.id, body.displayName);
    return { ...profile, displayName: body.displayName };
  });

  app.get('/api/tracks', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const progress = db.getProgressMap(profile.id);
    return content.tracks.map((track) => toTrackSummary(track, progress));
  });

  app.get('/api/tracks/:trackId', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const { trackId } = request.params as { trackId: string };
    const track = content.tracks.find((item) => item.meta.id === trackId);
    if (!track) return reply.code(404).send({ error: 'NOT_FOUND', message: '学习路径不存在' });
    const progress = db.getProgressMap(profile.id);
    return toTrackDetail(content, track, progress, db);
  });

  app.get('/api/problems', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const progress = db.getProgressMap(profile.id);
    const query = request.query as {
      track?: string;
      module?: string;
      difficulty?: string;
      status?: ProblemStatus | 'all';
      language?: Language;
      knowledge?: string;
      q?: string;
    };
    const items = [...content.problems.values()]
      .map((problem) =>
        toProblemSummary(content, problem, progress, db.getProblemStats(problem.meta.id)),
      )
      .filter((item) => {
        if (query.track && item.trackId !== query.track) return false;
        if (query.module && item.moduleId !== query.module) return false;
        if (query.difficulty && item.difficulty !== query.difficulty) return false;
        if (query.status && query.status !== 'all' && item.status !== query.status) return false;
        if (query.language && !item.languages.includes(query.language)) return false;
        if (query.knowledge && !item.knowledgePoints.includes(query.knowledge)) return false;
        if (query.q) {
          const haystack = `${item.title} ${item.summary} ${item.knowledgeTitles.join(' ')}`.toLowerCase();
          if (!haystack.includes(query.q.toLowerCase())) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const trackOrder =
          content.tracks.findIndex((track) => track.meta.id === a.trackId) -
          content.tracks.findIndex((track) => track.meta.id === b.trackId);
        if (trackOrder !== 0) return trackOrder;
        return a.order - b.order;
      });
    return {
      items,
      knowledgePoints: [...content.taxonomy.entries()].map(([id, value]) => ({
        id,
        ...value,
      })),
    };
  });

  app.get('/api/problems/:problemId', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const { problemId } = request.params as { problemId: string };
    const problem = findProblem(content, problemId);
    const progress = db.getProgressMap(profile.id);
    return toProblemDetail(content, problem, progress, db, profile.id);
  });

  app.post('/api/run', async (request, reply) => {
    learnerFor(context, request, reply);
    const body = runRequestSchema.parse(request.body);
    const problem = findProblem(content, body.problemId);
    ensureSupportedLanguage(problem, body.language);
    validateFiles(body.files);
    const entryFile = validateEntry(problem, body.language, body.files);
    return executeCode({
      language: body.language,
      files: body.files,
      entryFile,
      stdin: body.stdin,
      timeLimitMs: problem.meta.timeLimitMs,
    });
  });

  app.post('/api/debug', async (request, reply) => {
    learnerFor(context, request, reply);
    const body = runRequestSchema.parse(request.body);
    const problem = findProblem(content, body.problemId);
    ensureSupportedLanguage(problem, body.language);
    validateFiles(body.files);
    const entryFile = validateEntry(problem, body.language, body.files);
    if (body.language === 'python') {
      const trace = await tracePython({
        language: 'python',
        files: body.files,
        entryFile,
        stdin: body.stdin,
        timeLimitMs: problem.meta.timeLimitMs,
      });
      return { kind: 'trace', ...trace };
    }
    const trace = await traceCpp({
      language: 'cpp',
      files: body.files,
      entryFile,
      stdin: body.stdin,
      timeLimitMs: problem.meta.timeLimitMs,
      debug: true,
    });
    return { kind: 'trace', ...trace };
  });

  app.post('/api/submit', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const body = submitRequestSchema.parse(request.body);
    const problem = findProblem(content, body.problemId);
    ensureSupportedLanguage(problem, body.language);
    validateFiles(body.files);
    validateEntry(problem, body.language, body.files);
    const outcome = await judgeProblem(problem, body.language, body.files);
    const submissionId = db.recordSubmission({
      learnerId: profile.id,
      problemId: problem.meta.id,
      language: body.language,
      verdict: outcome.verdict,
      passed: outcome.passed,
      total: outcome.total,
      timeMs: outcome.timeMs,
      compileOutput: outcome.compileOutput,
      files: body.files,
      cases: outcome.cases,
    });
    const result: SubmissionResult = {
      submissionId,
      ...outcome,
    };
    return result;
  });

  app.get('/api/submissions/:problemId', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const { problemId } = request.params as { problemId: string };
    return db.getSubmissions(profile.id, problemId, 20);
  });

  app.post('/api/ai/complete', async (request, reply) => {
    learnerFor(context, request, reply);
    const body = completionRequestSchema.parse(request.body);
    const problem = body.problemId ? content.problems.get(body.problemId) : undefined;
    return completeCode({
      db,
      language: body.language,
      code: body.code,
      cursor: body.cursor,
      prefix: body.prefix,
      problemTitle: problem?.meta.title,
    });
  });

  app.post('/api/ai/explain', async (request, reply) => {
    learnerFor(context, request, reply);
    const body = explainRequestSchema.parse(request.body);
    const problem = body.problemId ? content.problems.get(body.problemId) : undefined;
    return explainSelection({
      db,
      language: body.language,
      selectedText: body.selectedText,
      context: body.context,
      question: body.question,
      problemTitle: problem?.meta.title,
      problemStatement: problem?.statement,
    });
  });

  app.post('/api/ai/review', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const body = reviewRequestSchema.parse(request.body);
    const submission = db.getSubmission(profile.id, body.submissionId);
    if (!submission) {
      return reply.code(404).send({ error: 'NOT_FOUND', message: '提交记录不存在' });
    }
    const problem = findProblem(content, submission.problemId);
    const progress = db.getProgressMap(profile.id);
    const detail = toProblemDetail(content, problem, progress, db, profile.id);
    const previous = db.getSubmissions(profile.id, problem.meta.id, 20);
    const review = await reviewSubmission({
      db,
      problem: {
        id: problem.meta.id,
        title: problem.meta.title,
        statement: problem.statement,
        knowledgePoints: problem.meta.knowledgePoints,
        samples: problem.meta.samples,
      },
      language: submission.language,
      files: submission.files,
      verdict: submission.verdict,
      passed: submission.passed,
      total: submission.total,
      compileOutput: submission.compileOutput,
      attempts: previous.length,
      attemptHistory: previous.slice(0, 6).map((item) => ({
        verdict: item.verdict,
        passed: item.passed,
        total: item.total,
        createdAt: item.createdAt,
      })),
      similar: detail.similar,
    });
    return review;
  });

  app.get('/api/progress', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    return db.getProgress(profile.id);
  });

  app.get('/api/progress/export', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    reply.header('content-disposition', 'attachment; filename="codelab-progress.json"');
    return db.getExport(profile.id);
  });

  app.get('/api/notes', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const query = request.query as { problemId?: string };
    return db.getNotes(profile.id, query.problemId ?? null);
  });

  app.post('/api/notes', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const body = noteUpsertSchema.parse(request.body);
    return db.createNote(profile.id, body.problemId ?? null, body.title, body.content);
  });

  app.put('/api/notes/:noteId', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const { noteId } = request.params as { noteId: string };
    const body = noteUpsertSchema.parse(request.body);
    const note = db.updateNote(profile.id, Number(noteId), body.title, body.content);
    if (!note) return reply.code(404).send({ error: 'NOT_FOUND', message: '笔记不存在' });
    return note;
  });

  app.delete('/api/notes/:noteId', async (request, reply) => {
    const profile = learnerFor(context, request, reply);
    const { noteId } = request.params as { noteId: string };
    const ok = db.deleteNote(profile.id, Number(noteId));
    if (!ok) return reply.code(404).send({ error: 'NOT_FOUND', message: '笔记不存在' });
    return { ok: true };
  });

  app.get('/api/site/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const page = content.sitePages.get(slug);
    if (!page) return reply.code(404).send({ error: 'NOT_FOUND', message: '页面不存在' });
    return page;
  });

  app.post('/api/contact', async (request, reply) => {
    const body = request.body as { name?: string; contact?: string; message?: string };
    if (!body.name?.trim() || !body.contact?.trim() || !body.message?.trim()) {
      return reply.code(400).send({ error: 'VALIDATION_ERROR', message: '请填写完整信息' });
    }
    if (body.message.length > 5000) {
      return reply.code(400).send({ error: 'VALIDATION_ERROR', message: '留言太长了' });
    }
    const id = db.saveContactMessage(
      body.name.trim().slice(0, 100),
      body.contact.trim().slice(0, 200),
      body.message.trim(),
    );
    return { ok: true, id };
  });

  if (existsSync(config.webDistDir)) {
    const indexHtml = readFileSync(path.join(config.webDistDir, 'index.html'), 'utf8');
    await app.register(fastifyStatic, {
      root: path.join(config.webDistDir, 'assets'),
      prefix: '/assets/',
      wildcard: true,
    });
    app.get('/', async (_request, reply) => reply.type('text/html').send(indexHtml));
    app.get('/index.html', async (_request, reply) => reply.type('text/html').send(indexHtml));
    app.get('/favicon.svg', async (_request, reply) => {
      const faviconPath = path.join(config.webDistDir, 'favicon.svg');
      if (!existsSync(faviconPath)) return reply.code(404).send();
      return reply.type('image/svg+xml').send(readFileSync(faviconPath));
    });
    app.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith('/api/') || request.url.startsWith('/assets/')) {
        return reply.code(404).send({ error: 'NOT_FOUND', message: '资源不存在' });
      }
      return reply.type('text/html').send(indexHtml);
    });
  } else {
    app.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith('/api/')) {
        return reply.code(404).send({ error: 'NOT_FOUND', message: '接口不存在' });
      }
      return reply.code(404).send({
        error: 'NO_BUILD',
        message: '前端尚未构建。开发模式请访问 Vite 地址 http://127.0.0.1:5173',
      });
    });
  }

  app.log.info(
    `content loaded: ${content.tracks.length} tracks, ${content.problems.size} problems`,
  );
  app.log.info(`root: ${ROOT_DIR}`);
  app.log.info(`AI configured: ${aiConfigured ? 'yes' : 'no (local fallback)'}`);

  return app;
}

export const appContext = {
  rootDir: ROOT_DIR,
  dataDir: config.dataDir,
  webDistDir: config.webDistDir,
  contentDir: path.join(ROOT_DIR, 'content'),
};
