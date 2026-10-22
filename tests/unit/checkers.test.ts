import { describe, expect, it } from 'vitest';
import { compareOutput } from '../../apps/server/src/judge/judge.js';

describe('output comparison', () => {
  it('ignores trailing whitespace and line ending differences in token mode', () => {
    expect(compareOutput('32.40\r\n', '32.40\n', 'token')).toBe(true);
    expect(compareOutput('1   2\n3', '1 2 3\n', 'token')).toBe(true);
  });

  it('keeps exact mode strict about internal spacing', () => {
    expect(compareOutput('1  2', '1 2', 'exact')).toBe(false);
    expect(compareOutput('1 2\n', '1 2\n', 'exact')).toBe(true);
  });

  it('supports float tolerance', () => {
    expect(compareOutput('3.1415926\n', '3.1415927\n', 'float')).toBe(true);
    expect(compareOutput('3.14\n', '3.15\n', 'float')).toBe(false);
  });

  it('rejects different token counts', () => {
    expect(compareOutput('1 2', '1 2 3', 'token')).toBe(false);
  });
});
