import { describe, expect, it } from 'vitest';
import { loadContent } from '../../apps/server/src/content/loader.js';

describe('content bundle', () => {
  it('loads four tracks and at least 48 problems', async () => {
    const content = await loadContent();
    expect(content.tracks.map((track) => track.meta.id)).toEqual([
      'cpp',
      'python',
      'algorithms',
      'systems',
    ]);
    expect(content.problems.size).toBeGreaterThanOrEqual(48);
    expect(content.taxonomy.size).toBeGreaterThanOrEqual(48);
  });

  it('gives every problem a starter, a solution and tests', async () => {
    const content = await loadContent();
    for (const problem of content.problems.values()) {
      expect(problem.meta.samples.length).toBeGreaterThan(0);
      expect(problem.statement.length).toBeGreaterThan(50);
      for (const language of problem.meta.languages) {
        expect(problem.starters[language]).toBeTruthy();
        expect(problem.solutions[language]).toBeTruthy();
      }
    }
  });

  it('only references registered knowledge points', async () => {
    const content = await loadContent();
    for (const problem of content.problems.values()) {
      for (const tag of problem.meta.knowledgePoints) {
        expect(content.taxonomy.has(tag)).toBe(true);
      }
    }
  });
});
