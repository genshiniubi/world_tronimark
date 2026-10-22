import { z } from 'zod';

export const languageSchema = z.enum(['cpp', 'python']);
export const difficultySchema = z.enum(['beginner', 'easy', 'medium', 'hard', 'challenge']);
export const trackKindSchema = z.enum(['coding', 'knowledge', 'project']);
export const checkerSchema = z.enum(['exact', 'token', 'float']);
export const verdictSchema = z.enum(['AC', 'WA', 'TLE', 'RE', 'CE', 'OLE', 'SE']);

export const fileMapSchema = z.record(z.string().max(300), z.string().max(120_000));
export const languageFileMapSchema = z.record(languageSchema, fileMapSchema);

export const testSchema = z.object({
  id: z.string().min(1),
  input: z.string(),
  output: z.string(),
  explanation: z.string().optional(),
});

export const contentModuleSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  difficulty: difficultySchema,
  order: z.number().int().nonnegative(),
  knowledgePoints: z.array(z.string()).min(1),
  prerequisites: z.array(z.string()).default([]),
});

export const trackFileSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  kind: trackKindSchema,
  language: languageSchema.optional(),
  accent: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().int().nonnegative(),
  modules: z.array(contentModuleSchema).min(1),
});

export const problemMetaSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  moduleId: z.string().min(1),
  order: z.number().int().nonnegative(),
  difficulty: difficultySchema,
  scenario: z.string().min(1),
  scenarioLabel: z.string().min(1),
  knowledgePoints: z.array(z.string()).min(1).max(5),
  prerequisites: z.array(z.string()).default([]),
  estimatedMinutes: z.number().int().positive(),
  summary: z.string().min(1),
  languages: z.array(languageSchema).min(1),
  entryFiles: z.record(languageSchema, z.string().min(1)),
  timeLimitMs: z.number().int().positive().default(2000),
  checker: checkerSchema.default('token'),
  samples: z.array(testSchema).min(1),
  tests: z.array(testSchema).default([]),
  hints: z.array(z.string()).default([]),
  similar: z.array(z.string()).default([]),
});

export const knowledgePointSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  moduleIds: z.array(z.string()).default([]),
});

export const taxonomySchema = z.object({
  knowledgePoints: z.array(knowledgePointSchema),
});

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  email: z.string().min(1),
  wechat: z.string().min(1),
  github: z.string().min(1),
  sponsor: z.object({
    intro: z.string(),
    tiers: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
        benefits: z.string(),
      }),
    ),
    qrNote: z.string(),
  }),
});

export const runRequestSchema = z.object({
  problemId: z.string().min(1),
  language: languageSchema,
  files: fileMapSchema,
  stdin: z.string().max(32_000).default(''),
});

export const submitRequestSchema = z.object({
  problemId: z.string().min(1),
  language: languageSchema,
  files: fileMapSchema,
});

export const completionRequestSchema = z.object({
  problemId: z.string().optional(),
  language: languageSchema,
  code: z.string().max(20_000),
  cursor: z.number().int().nonnegative(),
  prefix: z.string().max(200).default(''),
});

export const explainRequestSchema = z.object({
  problemId: z.string().optional(),
  language: languageSchema,
  selectedText: z.string().min(1).max(4_000),
  context: z.string().max(12_000).default(''),
  question: z.string().max(1_000).optional(),
});

export const reviewRequestSchema = z.object({
  problemId: z.string().min(1),
  language: languageSchema,
  files: fileMapSchema,
  submissionId: z.number().int().positive(),
});

export const noteUpsertSchema = z.object({
  problemId: z.string().nullable().optional(),
  title: z.string().max(200).default('学习笔记'),
  content: z.string().max(100_000).default(''),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(1).max(40),
});

export const explainResponseSchema = z.object({
  meaning: z.string(),
  why: z.string(),
  alternatives: z.string(),
  convenient: z.string(),
  answer: z.string().optional(),
  degraded: z.boolean(),
});

export const reviewResponseSchema = z.object({
  passed: z.boolean(),
  headline: z.string(),
  strengths: z.array(z.string()),
  issues: z.array(z.string()),
  suggestions: z.array(z.string()),
  complexity: z.string(),
  processNote: z.string(),
  similarProblemIds: z.array(z.string()),
  degraded: z.boolean(),
});

export type TrackFile = z.infer<typeof trackFileSchema>;
export type ProblemMeta = z.infer<typeof problemMetaSchema>;
export type Taxonomy = z.infer<typeof taxonomySchema>;
export type RunRequest = z.infer<typeof runRequestSchema>;
export type SubmitRequest = z.infer<typeof submitRequestSchema>;
export type CompletionRequest = z.infer<typeof completionRequestSchema>;
export type ExplainRequest = z.infer<typeof explainRequestSchema>;
export type ReviewRequest = z.infer<typeof reviewRequestSchema>;
