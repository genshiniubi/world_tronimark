import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  problemMetaSchema,
  siteConfigSchema,
  taxonomySchema,
  trackFileSchema,
  type Language,
  type ProblemMeta,
  type SiteConfig,
  type SitePage,
  type TrackFile,
} from '@codelab/shared';

export const ROOT_DIR = path.resolve(fileURLToPath(new URL('../../../../', import.meta.url)));
export const CONTENT_DIR = path.join(ROOT_DIR, 'content');

export interface RawProblem {
  meta: ProblemMeta;
  statement: string;
  trackId: string;
  trackTitle: string;
  moduleTitle: string;
  starters: Partial<Record<Language, Record<string, string>>>;
  solutions: Partial<Record<Language, Record<string, string>>>;
  solutionMarkdown: string;
}

export interface RawModule {
  meta: TrackFile['modules'][number];
  lesson: string;
}

export interface RawTrack {
  meta: TrackFile;
  modules: RawModule[];
  problems: RawProblem[];
}

export interface ContentBundle {
  tracks: RawTrack[];
  problems: Map<string, RawProblem>;
  taxonomy: Map<string, { title: string; description: string }>;
  site: SiteConfig;
  sitePages: Map<string, SitePage>;
}

async function readText(file: string): Promise<string> {
  return fs.readFile(file, 'utf8');
}

async function readJson<T = unknown>(file: string): Promise<T> {
  return JSON.parse(await readText(file)) as T;
}

async function pathExists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function readFileTree(dir: string, prefix = ''): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  if (!(await pathExists(dir))) return out;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      Object.assign(out, await readFileTree(full, rel));
    } else if (entry.isFile()) {
      out[rel] = await readText(full);
    }
  }
  return out;
}

async function loadTrack(
  trackId: string,
  taxonomy: ContentBundle['taxonomy'],
): Promise<RawTrack> {
  const dir = path.join(CONTENT_DIR, 'tracks', trackId);
  const meta = trackFileSchema.parse(await readJson(path.join(dir, 'track.json')));
  const modules: RawModule[] = [];
  for (const moduleMeta of meta.modules) {
    const lessonPath = path.join(dir, 'modules', moduleMeta.id, 'lesson.md');
    const lesson = (await pathExists(lessonPath))
      ? await readText(lessonPath)
      : `# ${moduleMeta.title}\n\n${moduleMeta.summary}\n`;
    modules.push({ meta: moduleMeta, lesson });
  }

  const problemsDir = path.join(dir, 'problems');
  const problems: RawProblem[] = [];
  if (await pathExists(problemsDir)) {
    const problemDirs = (await fs.readdir(problemsDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));
    for (const problemDir of problemDirs) {
      const problemPath = path.join(problemsDir, problemDir.name);
      const problemMeta = problemMetaSchema.parse(
        await readJson(path.join(problemPath, 'meta.json')),
      );
      const moduleMeta = meta.modules.find((item) => item.id === problemMeta.moduleId);
      if (!moduleMeta) {
        throw new Error(
          `[content] ${meta.id}/${problemMeta.slug}: moduleId "${problemMeta.moduleId}" 不存在`,
        );
      }
      for (const kp of [...moduleMeta.knowledgePoints, ...problemMeta.knowledgePoints]) {
        if (!taxonomy.has(kp)) {
          throw new Error(
            `[content] ${meta.id}/${problemMeta.slug}: 未知知识点 "${kp}"，请先在 taxonomy.json 注册`,
          );
        }
      }
      for (const language of problemMeta.languages) {
        if (!problemMeta.entryFiles[language]) {
          throw new Error(
            `[content] ${meta.id}/${problemMeta.slug}: 缺少 ${language} entryFiles`,
          );
        }
      }
      const starters: RawProblem['starters'] = {};
      const solutions: RawProblem['solutions'] = {};
      for (const language of problemMeta.languages) {
        const starter = await readFileTree(path.join(problemPath, 'starters', language));
        if (!starter[problemMeta.entryFiles[language]!]) {
          throw new Error(
            `[content] ${meta.id}/${problemMeta.slug}: 起始文件 ${language}/${problemMeta.entryFiles[language]} 不存在`,
          );
        }
        starters[language] = starter;
        const solutionDir = path.join(problemPath, 'solutions', language);
        if (await pathExists(solutionDir)) {
          solutions[language] = await readFileTree(solutionDir);
        }
      }
      const solutionMarkdownPath = path.join(problemPath, 'solution.md');
      let statement = await readText(path.join(problemPath, 'statement.md'));
      for (const [tag, info] of taxonomy) {
        statement = statement.replaceAll(tag, info.title);
      }
      problems.push({
        meta: problemMeta,
        statement,
        trackId: meta.id,
        trackTitle: meta.title,
        moduleTitle: moduleMeta.title,
        starters,
        solutions,
        solutionMarkdown: (await pathExists(solutionMarkdownPath))
          ? await readText(solutionMarkdownPath)
          : '',
      });
    }
  }
  problems.sort((a, b) => a.meta.order - b.meta.order);
  return { meta, modules, problems };
}

export async function loadContent(): Promise<ContentBundle> {
  const registry = await readJson<{ tracks: string[] }>(path.join(CONTENT_DIR, 'registry.json'));
  const taxonomyRaw = taxonomySchema.parse(
    await readJson(path.join(CONTENT_DIR, 'taxonomy.json')),
  );
  const taxonomy = new Map(
    taxonomyRaw.knowledgePoints.map((item) => [
      item.id,
      { title: item.title, description: item.description },
    ]),
  );
  const tracks: RawTrack[] = [];
  for (const trackId of registry.tracks) {
    tracks.push(await loadTrack(trackId, taxonomy));
  }
  tracks.sort((a, b) => a.meta.order - b.meta.order);
  const problems = new Map<string, RawProblem>();
  for (const track of tracks) {
    for (const problem of track.problems) {
      if (problems.has(problem.meta.id)) {
        throw new Error(`[content] 题目 ID 重复: ${problem.meta.id}`);
      }
      problems.set(problem.meta.id, problem);
    }
  }
  const site = siteConfigSchema.parse(
    await readJson(path.join(CONTENT_DIR, 'site', 'site.json')),
  );
  const sitePages = new Map<string, SitePage>();
  for (const slug of ['about', 'contact', 'sponsor']) {
    const pagePath = path.join(CONTENT_DIR, 'site', `${slug}.md`);
    if (await pathExists(pagePath)) {
      sitePages.set(slug, {
        slug,
        title: slug === 'about' ? '关于我们' : slug === 'contact' ? '联系服务' : '赞助我们',
        content: await readText(pagePath),
      });
    }
  }
  return { tracks, problems, taxonomy, site, sitePages };
}

export function getModuleForProblem(track: RawTrack, moduleId: string): RawModule | undefined {
  return track.modules.find((item) => item.meta.id === moduleId);
}
