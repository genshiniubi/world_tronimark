export type Language = 'cpp' | 'python';
export type TrackKind = 'coding' | 'knowledge' | 'project';
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'challenge';
export type Verdict = 'AC' | 'WA' | 'TLE' | 'RE' | 'CE' | 'OLE' | 'SE';
export type CheckerType = 'exact' | 'token' | 'float';
export type ProblemStatus = 'not_started' | 'in_progress' | 'solved';

export type FileMap = Record<string, string>;

export interface TestCasePublic {
  id: string;
  input: string;
  output: string;
  explanation?: string;
  hidden?: false;
}

export interface TestCaseResult {
  id: string;
  verdict: Verdict;
  timeMs: number;
  hidden: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  stderr?: string;
}

export interface RunResult {
  verdict: Verdict | 'OK';
  compileOutput: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timeMs: number;
  timedOut: boolean;
  outputTruncated: boolean;
}

export interface SubmissionResult {
  submissionId: number;
  verdict: Verdict;
  passed: number;
  total: number;
  timeMs: number;
  compileOutput: string;
  cases: TestCaseResult[];
  aiReview?: AiReview;
}

export interface TrackModule {
  id: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  order: number;
  knowledgePoints: string[];
  knowledgeTitles: string[];
  prerequisites: string[];
  lesson: string;
  problems: ProblemSummary[];
  solvedCount: number;
  totalCount: number;
}

export interface TrackSummary {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  kind: TrackKind;
  language?: Language;
  accent: string;
  icon: string;
  order: number;
  moduleCount: number;
  problemCount: number;
  solvedCount: number;
  nextProblem?: { id: string; title: string; moduleTitle: string };
}

export interface TrackDetail extends TrackSummary {
  modules: TrackModule[];
}

export interface ProblemSummary {
  id: string;
  slug: string;
  title: string;
  trackId: string;
  trackTitle: string;
  moduleId: string;
  moduleTitle: string;
  order: number;
  difficulty: Difficulty;
  scenario: string;
  scenarioLabel: string;
  knowledgePoints: string[];
  knowledgeTitles: string[];
  prerequisites: string[];
  estimatedMinutes: number;
  summary: string;
  languages: Language[];
  status: ProblemStatus;
  solvedCount: number;
  attemptCount: number;
  acceptanceRate: number | null;
}

export interface ProblemDetail extends ProblemSummary {
  statement: string;
  starterFiles: Partial<Record<Language, FileMap>>;
  entryFiles: Partial<Record<Language, string>>;
  samples: TestCasePublic[];
  hints: string[];
  similar: ProblemSummary[];
  timeLimitMs: number;
  checker: CheckerType;
  canViewSolution: boolean;
  solution?: string;
  solutionFiles?: Partial<Record<Language, FileMap>>;
  attempts: SubmissionSummary[];
}

export interface SubmissionSummary {
  id: number;
  verdict: Verdict;
  passed: number;
  total: number;
  timeMs: number;
  language: Language;
  createdAt: string;
}

export interface ProgressItem {
  problemId: string;
  status: ProblemStatus;
  attempts: number;
  firstSolvedAt: string | null;
  lastAttemptAt: string | null;
}

export interface LearnerProfile {
  id: string;
  displayName: string;
  createdAt: string;
}

export interface DashboardData {
  profile: LearnerProfile;
  stats: {
    solved: number;
    attempted: number;
    streakDays: number;
    totalMinutes: number;
  };
  tracks: TrackSummary[];
  continueLearning: {
    problemId: string;
    problemTitle: string;
    trackId: string;
    trackTitle: string;
    moduleTitle: string;
  } | null;
  recentActivity: Array<{
    id: number;
    problemId: string;
    problemTitle: string;
    verdict: Verdict;
    createdAt: string;
  }>;
}

export interface AiStatus {
  enabled: boolean;
  configured: boolean;
  provider: string;
  model: string;
  features: {
    completion: boolean;
    explain: boolean;
    review: boolean;
  };
  fallback: boolean;
}

export interface BootstrapResponse {
  profile: LearnerProfile;
  tracks: TrackSummary[];
  ai: AiStatus;
  site: SiteConfig;
  health: HealthInfo;
}

export interface HealthInfo {
  ok: boolean;
  node: string;
  python: { available: boolean; version: string | null; path: string | null };
  cpp: {
    available: boolean;
    version: string | null;
    path: string | null;
    standard: string;
    executionBlocked?: boolean;
    executionNote?: string;
  };
  database: boolean;
  ai: AiStatus;
  checkedAt: string;
}

export interface AiCompletionItem {
  label: string;
  insertText: string;
  detail?: string;
  documentation?: string;
  kind: 'keyword' | 'snippet' | 'identifier' | 'ai';
  source: 'local' | 'ai';
}

export interface AiCompletionResponse {
  items: AiCompletionItem[];
  degraded: boolean;
}

export interface AiExplainRequest {
  problemId?: string;
  language: Language;
  selectedText: string;
  context: string;
  question?: string;
}

export interface AiExplainResponse {
  meaning: string;
  why: string;
  alternatives: string;
  convenient: string;
  answer?: string;
  degraded: boolean;
}

export interface AiReview {
  passed: boolean;
  headline: string;
  strengths: string[];
  issues: string[];
  suggestions: string[];
  complexity: string;
  processNote: string;
  similarProblemIds: string[];
  degraded: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  email: string;
  wechat: string;
  github: string;
  sponsor: {
    intro: string;
    tiers: Array<{ name: string; amount: string; benefits: string }>;
    qrNote: string;
  };
}

export interface SitePage {
  slug: string;
  title: string;
  content: string;
}

export interface Note {
  id: number;
  problemId: string | null;
  title: string;
  content: string;
  updatedAt: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}
