import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import type {
  Language,
  LearnerProfile,
  Note,
  ProblemStatus,
  ProgressItem,
  SubmissionSummary,
  Verdict,
} from '@codelab/shared';
import { config, ensureDataDir } from '../config.js';

export interface ProgressRow {
  problemId: string;
  status: ProblemStatus;
  attempts: number;
  firstSolvedAt: string | null;
  lastAttemptAt: string | null;
}

export interface SubmissionRow {
  id: number;
  learnerId: string;
  problemId: string;
  language: Language;
  verdict: Verdict;
  passed: number;
  total: number;
  timeMs: number;
  compileOutput: string;
  files: Record<string, string>;
  cases: unknown;
  createdAt: string;
}

export interface ProblemStats {
  solvedCount: number;
  attemptCount: number;
  submissionCount: number;
  acceptedCount: number;
}

export class AppDatabase {
  private readonly db: DatabaseSync;

  constructor(dbPath = path.join(config.dataDir, 'app.db')) {
    ensureDataDir();
    mkdirSync(path.dirname(dbPath), { recursive: true });
    this.db = new DatabaseSync(dbPath);
    this.db.exec('PRAGMA journal_mode = WAL;');
    this.db.exec('PRAGMA foreign_keys = ON;');
    this.migrate();
  }

  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS learners (
        id TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        last_seen_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS progress (
        learner_id TEXT NOT NULL,
        problem_id TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('not_started','in_progress','solved')),
        attempts INTEGER NOT NULL DEFAULT 0,
        first_solved_at TEXT,
        last_attempt_at TEXT,
        PRIMARY KEY (learner_id, problem_id),
        FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        learner_id TEXT NOT NULL,
        problem_id TEXT NOT NULL,
        language TEXT NOT NULL,
        verdict TEXT NOT NULL,
        passed INTEGER NOT NULL,
        total INTEGER NOT NULL,
        time_ms INTEGER NOT NULL,
        compile_output TEXT NOT NULL DEFAULT '',
        files_json TEXT NOT NULL,
        cases_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_submissions_learner_problem
        ON submissions(learner_id, problem_id, created_at DESC);

      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        learner_id TEXT NOT NULL,
        problem_id TEXT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_notes_learner ON notes(learner_id, updated_at DESC);

      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ai_cache (
        cache_key TEXT PRIMARY KEY,
        kind TEXT NOT NULL,
        response_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
  }

  getOrCreateLearner(id?: string): LearnerProfile {
    const now = new Date().toISOString();
    if (id) {
      const existing = this.db
        .prepare('SELECT id, display_name, created_at FROM learners WHERE id = ?')
        .get(id) as { id: string; display_name: string; created_at: string } | undefined;
      if (existing) {
        this.db.prepare('UPDATE learners SET last_seen_at = ? WHERE id = ?').run(now, id);
        return {
          id: existing.id,
          displayName: existing.display_name,
          createdAt: existing.created_at,
        };
      }
    }
    const newId = id || randomUUID();
    this.db
      .prepare(
        'INSERT INTO learners (id, display_name, created_at, last_seen_at) VALUES (?, ?, ?, ?)',
      )
      .run(newId, '学习者', now, now);
    return { id: newId, displayName: '学习者', createdAt: now };
  }

  updateDisplayName(learnerId: string, displayName: string): void {
    this.db
      .prepare('UPDATE learners SET display_name = ? WHERE id = ?')
      .run(displayName, learnerId);
  }

  getProgress(learnerId: string): ProgressRow[] {
    const rows = this.db
      .prepare(
        `SELECT problem_id, status, attempts, first_solved_at, last_attempt_at
         FROM progress WHERE learner_id = ?`,
      )
      .all(learnerId) as Array<{
      problem_id: string;
      status: ProblemStatus;
      attempts: number;
      first_solved_at: string | null;
      last_attempt_at: string | null;
    }>;
    return rows.map((row) => ({
      problemId: row.problem_id,
      status: row.status,
      attempts: row.attempts,
      firstSolvedAt: row.first_solved_at,
      lastAttemptAt: row.last_attempt_at,
    }));
  }

  getProgressMap(learnerId: string): Map<string, ProgressItem> {
    return new Map(this.getProgress(learnerId).map((row) => [row.problemId, row]));
  }

  getProblemStats(problemId: string): ProblemStats {
    const row = this.db
      .prepare(
        `SELECT
           SUM(CASE WHEN verdict = 'AC' THEN 1 ELSE 0 END) AS accepted,
           COUNT(*) AS submissions,
           COUNT(DISTINCT learner_id) AS attempts,
           COUNT(DISTINCT CASE WHEN verdict = 'AC' THEN learner_id END) AS solved
         FROM submissions WHERE problem_id = ?`,
      )
      .get(problemId) as {
      accepted: number | null;
      submissions: number | null;
      attempts: number | null;
      solved: number | null;
    };
    return {
      solvedCount: row.solved ?? 0,
      attemptCount: row.attempts ?? 0,
      submissionCount: row.submissions ?? 0,
      acceptedCount: row.accepted ?? 0,
    };
  }

  recordSubmission(input: {
    learnerId: string;
    problemId: string;
    language: Language;
    verdict: Verdict;
    passed: number;
    total: number;
    timeMs: number;
    compileOutput: string;
    files: Record<string, string>;
    cases: unknown;
  }): number {
    const now = new Date().toISOString();
    this.db.exec('BEGIN');
    try {
      const result = this.db
        .prepare(
          `INSERT INTO submissions
            (learner_id, problem_id, language, verdict, passed, total, time_ms, compile_output, files_json, cases_json, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          input.learnerId,
          input.problemId,
          input.language,
          input.verdict,
          input.passed,
          input.total,
          input.timeMs,
          input.compileOutput,
          JSON.stringify(input.files),
          JSON.stringify(input.cases),
          now,
        );
      const id = Number(result.lastInsertRowid);
      const existing = this.db
        .prepare(
          'SELECT status, attempts, first_solved_at FROM progress WHERE learner_id = ? AND problem_id = ?',
        )
        .get(input.learnerId, input.problemId) as
        | { status: ProblemStatus; attempts: number; first_solved_at: string | null }
        | undefined;
      const passedNow = input.verdict === 'AC';
      const nextStatus: ProblemStatus = passedNow
        ? 'solved'
        : existing?.status === 'solved'
          ? 'solved'
          : 'in_progress';
      const firstSolvedAt = existing?.first_solved_at || (passedNow ? now : null);
      this.db
        .prepare(
          `INSERT INTO progress (learner_id, problem_id, status, attempts, first_solved_at, last_attempt_at)
           VALUES (?, ?, ?, 1, ?, ?)
           ON CONFLICT(learner_id, problem_id) DO UPDATE SET
             status = excluded.status,
             attempts = progress.attempts + 1,
             first_solved_at = COALESCE(progress.first_solved_at, excluded.first_solved_at),
             last_attempt_at = excluded.last_attempt_at`,
        )
        .run(input.learnerId, input.problemId, nextStatus, firstSolvedAt, now);
      this.db.exec('COMMIT');
      return id;
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  getSubmissions(learnerId: string, problemId: string, limit = 12): SubmissionSummary[] {
    const rows = this.db
      .prepare(
        `SELECT id, verdict, passed, total, time_ms, language, created_at
         FROM submissions WHERE learner_id = ? AND problem_id = ?
         ORDER BY id DESC LIMIT ?`,
      )
      .all(learnerId, problemId, limit) as Array<{
      id: number;
      verdict: Verdict;
      passed: number;
      total: number;
      time_ms: number;
      language: Language;
      created_at: string;
    }>;
    return rows.map((row) => ({
      id: row.id,
      verdict: row.verdict,
      passed: row.passed,
      total: row.total,
      timeMs: row.time_ms,
      language: row.language,
      createdAt: row.created_at,
    }));
  }

  getSubmission(learnerId: string, submissionId: number): SubmissionRow | null {
    const row = this.db
      .prepare(
        `SELECT id, learner_id, problem_id, language, verdict, passed, total, time_ms,
                compile_output, files_json, cases_json, created_at
         FROM submissions WHERE id = ? AND learner_id = ?`,
      )
      .get(submissionId, learnerId) as
      | {
          id: number;
          learner_id: string;
          problem_id: string;
          language: Language;
          verdict: Verdict;
          passed: number;
          total: number;
          time_ms: number;
          compile_output: string;
          files_json: string;
          cases_json: string;
          created_at: string;
        }
      | undefined;
    if (!row) return null;
    return {
      id: row.id,
      learnerId: row.learner_id,
      problemId: row.problem_id,
      language: row.language,
      verdict: row.verdict,
      passed: row.passed,
      total: row.total,
      timeMs: row.time_ms,
      compileOutput: row.compile_output,
      files: JSON.parse(row.files_json) as Record<string, string>,
      cases: JSON.parse(row.cases_json) as unknown,
      createdAt: row.created_at,
    };
  }

  getRecentActivity(
    learnerId: string,
    limit = 6,
  ): Array<{ id: number; problemId: string; verdict: Verdict; createdAt: string }> {
    const rows = this.db
      .prepare(
        `SELECT id, problem_id, verdict, created_at FROM submissions
         WHERE learner_id = ? ORDER BY id DESC LIMIT ?`,
      )
      .all(learnerId, limit) as Array<{
      id: number;
      problem_id: string;
      verdict: Verdict;
      created_at: string;
    }>;
    return rows.map((row) => ({
      id: row.id,
      problemId: row.problem_id,
      verdict: row.verdict,
      createdAt: row.created_at,
    }));
  }

  getLastAttemptProblem(learnerId: string): string | null {
    const row = this.db
      .prepare(
        `SELECT problem_id FROM submissions WHERE learner_id = ?
         ORDER BY id DESC LIMIT 1`,
      )
      .get(learnerId) as { problem_id: string } | undefined;
    return row?.problem_id ?? null;
  }

  getStreakDays(learnerId: string): number {
    const rows = this.db
      .prepare(
        `SELECT DISTINCT substr(created_at, 1, 10) AS day FROM submissions
         WHERE learner_id = ? ORDER BY day DESC LIMIT 60`,
      )
      .all(learnerId) as Array<{ day: string }>;
    if (rows.length === 0) return 0;
    const days = new Set(rows.map((row) => row.day));
    let streak = 0;
    const cursor = new Date();
    for (let i = 0; i < 60; i += 1) {
      const key = cursor.toISOString().slice(0, 10);
      if (days.has(key)) {
        streak += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      } else if (i === 0) {
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  getNotes(learnerId: string, problemId?: string | null): Note[] {
    const rows = problemId
      ? (this.db
          .prepare(
            `SELECT id, problem_id, title, content, updated_at FROM notes
             WHERE learner_id = ? AND (problem_id = ? OR problem_id IS NULL)
             ORDER BY updated_at DESC`,
          )
          .all(learnerId, problemId) as unknown as NoteRow[])
      : (this.db
          .prepare(
            `SELECT id, problem_id, title, content, updated_at FROM notes
             WHERE learner_id = ? ORDER BY updated_at DESC`,
          )
          .all(learnerId) as unknown as NoteRow[]);
    return rows.map(mapNote);
  }

  getNote(learnerId: string, noteId: number): Note | null {
    const row = this.db
      .prepare(
        `SELECT id, problem_id, title, content, updated_at FROM notes
         WHERE id = ? AND learner_id = ?`,
      )
      .get(noteId, learnerId) as NoteRow | undefined;
    return row ? mapNote(row) : null;
  }

  createNote(learnerId: string, problemId: string | null, title: string, content: string): Note {
    const now = new Date().toISOString();
    const result = this.db
      .prepare(
        `INSERT INTO notes (learner_id, problem_id, title, content, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(learnerId, problemId, title, content, now, now);
    return {
      id: Number(result.lastInsertRowid),
      problemId,
      title,
      content,
      updatedAt: now,
    };
  }

  updateNote(learnerId: string, noteId: number, title: string, content: string): Note | null {
    const now = new Date().toISOString();
    const result = this.db
      .prepare(
        `UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ? AND learner_id = ?`,
      )
      .run(title, content, now, noteId, learnerId);
    if (result.changes === 0) return null;
    return this.getNote(learnerId, noteId);
  }

  deleteNote(learnerId: string, noteId: number): boolean {
    const result = this.db
      .prepare('DELETE FROM notes WHERE id = ? AND learner_id = ?')
      .run(noteId, learnerId);
    return result.changes > 0;
  }

  saveContactMessage(name: string, contact: string, message: string): number {
    const result = this.db
      .prepare(
        'INSERT INTO contact_messages (name, contact, message, created_at) VALUES (?, ?, ?, ?)',
      )
      .run(name, contact, message, new Date().toISOString());
    return Number(result.lastInsertRowid);
  }

  getAiCache(key: string): string | null {
    const row = this.db
      .prepare('SELECT response_json FROM ai_cache WHERE cache_key = ?')
      .get(key) as { response_json: string } | undefined;
    return row?.response_json ?? null;
  }

  setAiCache(key: string, kind: string, response: unknown): void {
    this.db
      .prepare(
        `INSERT INTO ai_cache (cache_key, kind, response_json, created_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(cache_key) DO UPDATE SET response_json = excluded.response_json,
           created_at = excluded.created_at`,
      )
      .run(key, kind, JSON.stringify(response), new Date().toISOString());
  }

  ping(): boolean {
    try {
      this.db.prepare('SELECT 1 AS ok').get();
      return true;
    } catch {
      return false;
    }
  }

  getExport(learnerId: string): unknown {    const learner = this.db
      .prepare('SELECT * FROM learners WHERE id = ?')
      .get(learnerId) as Record<string, unknown> | undefined;
    const progress = this.db.prepare('SELECT * FROM progress WHERE learner_id = ?').all(learnerId);
    const submissions = this.db
      .prepare(
        `SELECT id, problem_id, language, verdict, passed, total, time_ms, created_at
         FROM submissions WHERE learner_id = ? ORDER BY id DESC`,
      )
      .all(learnerId);
    const notes = this.db
      .prepare('SELECT * FROM notes WHERE learner_id = ? ORDER BY updated_at DESC')
      .all(learnerId);
    return { exportedAt: new Date().toISOString(), learner, progress, submissions, notes };
  }

  close(): void {
    this.db.close();
  }
}

interface NoteRow {
  id: number;
  problem_id: string | null;
  title: string;
  content: string;
  updated_at: string;
}

function mapNote(row: NoteRow): Note {
  return {
    id: row.id,
    problemId: row.problem_id,
    title: row.title,
    content: row.content,
    updatedAt: row.updated_at,
  };
}

let instance: AppDatabase | null = null;

export function getDatabase(): AppDatabase {
  if (!instance) instance = new AppDatabase();
  return instance;
}
