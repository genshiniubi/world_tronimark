import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createApp } from '../../apps/server/src/app.js';

let app: FastifyInstance;
let cookie = '';

beforeAll(async () => {
  app = await createApp();
  const response = await app.inject({ method: 'GET', url: '/api/bootstrap' });
  expect(response.statusCode).toBe(200);
  const setCookie = response.headers['set-cookie'];
  const raw = Array.isArray(setCookie) ? setCookie[0] : setCookie;
  cookie = raw?.split(';')[0] ?? '';
});

afterAll(async () => {
  await app.close();
});

describe('api smoke', () => {
  it('serves health and course metadata', async () => {
    const health = await app.inject({ method: 'GET', url: '/api/health' });
    expect(health.statusCode).toBe(200);
    expect(health.json().database).toBe(true);

    const bootstrap = await app.inject({ method: 'GET', url: '/api/bootstrap' });
    expect(bootstrap.statusCode).toBe(200);
    const body = bootstrap.json();
    expect(body.tracks.length).toBe(4);
    expect(body.site.name).toBe('我敲，拟码');
  });

  it('returns a problem with public samples but without hidden tests', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/problems/cpp-start-01',
      headers: { cookie },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.title).toBe('奶茶店订单小票');
    expect(body.samples.length).toBeGreaterThan(0);
    expect(body.statement).not.toContain('hidden-1');
    expect(body.tests).toBeUndefined();
  });

  it('runs Python code through the real runner', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/run',
      headers: { cookie },
      payload: {
        problemId: 'py-start-01',
        language: 'python',
        files: { 'src/main.py': 'print("hello from judge")\n' },
        stdin: '',
      },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.verdict).toBe('OK');
    expect(body.stdout).toContain('hello from judge');
  });

  it('returns local fallback explanations without an AI key', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/ai/explain',
      headers: { cookie },
      payload: {
        problemId: 'cpp-start-01',
        language: 'cpp',
        selectedText: 'double total = 0;',
        context: 'double total = 0;',
      },
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.degraded).toBe(true);
    expect(body.meaning.length).toBeGreaterThan(0);
  });

  it('creates and lists notes for the learner', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/notes',
      headers: { cookie },
      payload: {
        problemId: 'cpp-start-01',
        title: '测试笔记',
        content: '先算原价，再算折扣。',
      },
    });
    expect(created.statusCode).toBe(200);
    const note = created.json();
    expect(note.id).toBeGreaterThan(0);

    const list = await app.inject({
      method: 'GET',
      url: '/api/notes?problemId=cpp-start-01',
      headers: { cookie },
    });
    expect(list.statusCode).toBe(200);
    expect(list.json().some((item: { id: number }) => item.id === note.id)).toBe(true);
  });

  it('accepts a contact message', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/contact',
      payload: {
        name: '测试用户',
        contact: 'test@example.com',
        message: '这是一条测试留言。',
      },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().ok).toBe(true);
  });
});
