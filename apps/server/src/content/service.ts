import type {
  DashboardData,
  Language,
  ProblemDetail,
  ProblemStatus,
  ProblemSummary,
  ProgressItem,
  TrackDetail,
  TrackModule,
  TrackSummary,
  Verdict,
} from '@codelab/shared';
import type { AppDatabase, ProblemStats } from '../db/database.js';
import type { ContentBundle, RawProblem, RawTrack } from './loader.js';

function statusOf(progress: Map<string, ProgressItem>, problemId: string): ProblemStatus {
  return progress.get(problemId)?.status ?? 'not_started';
}

function knowledgeTitles(bundle: ContentBundle, ids: string[]): string[] {
  return ids.map((id) => bundle.taxonomy.get(id)?.title ?? id);
}

function acceptance(stats: ProblemStats): number | null {
  if (stats.submissionCount === 0) return null;
  return Math.round((stats.acceptedCount / stats.submissionCount) * 1000) / 10;
}

export function toProblemSummary(
  bundle: ContentBundle,
  problem: RawProblem,
  progress: Map<string, ProgressItem>,
  stats: ProblemStats,
): ProblemSummary {
  return {
    id: problem.meta.id,
    slug: problem.meta.slug,
    title: problem.meta.title,
    trackId: problem.trackId,
    trackTitle: problem.trackTitle,
    moduleId: problem.meta.moduleId,
    moduleTitle: problem.moduleTitle,
    order: problem.meta.order,
    difficulty: problem.meta.difficulty,
    scenario: problem.meta.scenario,
    scenarioLabel: problem.meta.scenarioLabel,
    knowledgePoints: problem.meta.knowledgePoints,
    knowledgeTitles: knowledgeTitles(bundle, problem.meta.knowledgePoints),
    prerequisites: problem.meta.prerequisites,
    estimatedMinutes: problem.meta.estimatedMinutes,
    summary: problem.meta.summary,
    languages: problem.meta.languages,
    status: statusOf(progress, problem.meta.id),
    solvedCount: stats.solvedCount,
    attemptCount: stats.attemptCount,
    acceptanceRate: acceptance(stats),
  };
}

function nextProblem(
  track: RawTrack,
  progress: Map<string, ProgressItem>,
): { id: string; title: string; moduleTitle: string } | undefined {
  const unsolved = track.problems.find((problem) => statusOf(progress, problem.meta.id) !== 'solved');
  const picked = unsolved ?? track.problems[0];
  return picked
    ? { id: picked.meta.id, title: picked.meta.title, moduleTitle: picked.moduleTitle }
    : undefined;
}

export function toTrackSummary(
  track: RawTrack,
  progress: Map<string, ProgressItem>,
): TrackSummary {
  const solvedCount = track.problems.filter(
    (problem) => statusOf(progress, problem.meta.id) === 'solved',
  ).length;
  return {
    id: track.meta.id,
    title: track.meta.title,
    subtitle: track.meta.subtitle,
    description: track.meta.description,
    kind: track.meta.kind,
    language: track.meta.language,
    accent: track.meta.accent,
    icon: track.meta.icon,
    order: track.meta.order,
    moduleCount: track.meta.modules.length,
    problemCount: track.problems.length,
    solvedCount,
    nextProblem: nextProblem(track, progress),
  };
}

export function toTrackDetail(
  bundle: ContentBundle,
  track: RawTrack,
  progress: Map<string, ProgressItem>,
  db: AppDatabase,
): TrackDetail {
  const summary = toTrackSummary(track, progress);
  const modules: TrackModule[] = track.modules
    .slice()
    .sort((a, b) => a.meta.order - b.meta.order)
    .map((module) => {
      const problems = track.problems
        .filter((problem) => problem.meta.moduleId === module.meta.id)
        .sort((a, b) => a.meta.order - b.meta.order)
        .map((problem) =>
          toProblemSummary(bundle, problem, progress, db.getProblemStats(problem.meta.id)),
        );
      return {
        id: module.meta.id,
        title: module.meta.title,
        summary: module.meta.summary,
        difficulty: module.meta.difficulty,
        order: module.meta.order,
        knowledgePoints: module.meta.knowledgePoints,
        knowledgeTitles: knowledgeTitles(bundle, module.meta.knowledgePoints),
        prerequisites: module.meta.prerequisites,
        lesson: module.lesson,
        problems,
        solvedCount: problems.filter((problem) => problem.status === 'solved').length,
        totalCount: problems.length,
      };
    });
  return { ...summary, modules };
}

function similarProblems(
  bundle: ContentBundle,
  problem: RawProblem,
  progress: Map<string, ProgressItem>,
  db: AppDatabase,
): ProblemSummary[] {
  const explicit = problem.meta.similar
    .map((id) => bundle.problems.get(id))
    .filter((item): item is RawProblem => Boolean(item));
  let candidates = explicit;
  if (candidates.length === 0) {
    candidates = [...bundle.problems.values()]
      .filter((item) => item.meta.id !== problem.meta.id)
      .filter(
        (item) =>
          problem.trackId === 'algorithms'
            ? item.trackId === 'algorithms'
            : item.trackId === problem.trackId,
      )
      .map((item) => {
        const shared = item.meta.knowledgePoints.filter((tag) =>
          problem.meta.knowledgePoints.includes(tag),
        ).length;
        return { item, score: shared + (item.meta.scenario === problem.meta.scenario ? 0.5 : 0) };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((entry) => entry.item);
  }
  return candidates
    .slice(0, 3)
    .map((item) =>
      toProblemSummary(bundle, item, progress, db.getProblemStats(item.meta.id)),
    );
}

export function toProblemDetail(
  bundle: ContentBundle,
  problem: RawProblem,
  progress: Map<string, ProgressItem>,
  db: AppDatabase,
  learnerId: string,
): ProblemDetail {
  const summary = toProblemSummary(
    bundle,
    problem,
    progress,
    db.getProblemStats(problem.meta.id),
  );
  const canViewSolution = summary.status === 'solved';
  return {
    ...summary,
    statement: problem.statement,
    starterFiles: problem.starters as Partial<Record<Language, Record<string, string>>>,
    entryFiles: problem.meta.entryFiles as Partial<Record<Language, string>>,
    samples: problem.meta.samples.map((sample) => ({
      id: sample.id,
      input: sample.input,
      output: sample.output,
      explanation: sample.explanation,
    })),
    hints: problem.meta.hints,
    similar: similarProblems(bundle, problem, progress, db),
    timeLimitMs: problem.meta.timeLimitMs,
    checker: problem.meta.checker,
    canViewSolution,
    solution: canViewSolution ? problem.solutionMarkdown : undefined,
    solutionFiles: canViewSolution ? problem.solutions : undefined,
    attempts: db.getSubmissions(learnerId, problem.meta.id, 12),
  };
}

export function buildDashboard(
  bundle: ContentBundle,
  profile: { id: string; displayName: string; createdAt: string },
  progress: Map<string, ProgressItem>,
  db: AppDatabase,
): DashboardData {
  const solved = [...progress.values()].filter((item) => item.status === 'solved');
  const totalMinutes = [...bundle.problems.values()]
    .filter((problem) => progress.get(problem.meta.id)?.status === 'solved')
    .reduce((sum, problem) => sum + problem.meta.estimatedMinutes, 0);
  const lastAttemptId = db.getLastAttemptProblem(profile.id);
  const lastProblem = lastAttemptId ? bundle.problems.get(lastAttemptId) : undefined;
  const fallback = bundle.tracks
    .flatMap((track) => track.problems)
    .find((problem) => statusOf(progress, problem.meta.id) !== 'solved');
  const continueProblem = lastProblem
    ? statusOf(progress, lastProblem.meta.id) === 'solved'
      ? fallback ?? lastProblem
      : lastProblem
    : fallback;
  const recent = db.getRecentActivity(profile.id, 6).map((item) => {
    const problem = bundle.problems.get(item.problemId);
    return {
      id: item.id,
      problemId: item.problemId,
      problemTitle: problem?.meta.title ?? item.problemId,
      verdict: item.verdict as Verdict,
      createdAt: item.createdAt,
    };
  });
  return {
    profile,
    stats: {
      solved: solved.length,
      attempted: progress.size,
      streakDays: db.getStreakDays(profile.id),
      totalMinutes,
    },
    tracks: bundle.tracks.map((track) => toTrackSummary(track, progress)),
    continueLearning: continueProblem
      ? {
          problemId: continueProblem.meta.id,
          problemTitle: continueProblem.meta.title,
          trackId: continueProblem.trackId,
          trackTitle: continueProblem.trackTitle,
          moduleTitle: continueProblem.moduleTitle,
        }
      : null,
    recentActivity: recent,
  };
}

export function getProblemAttempts(
  db: AppDatabase,
  learnerId: string,
  problemId: string,
  limit = 12,
) {
  return db.getSubmissions(learnerId, problemId, limit);
}
