import type { Difficulty, Language, Verdict } from './types.js';

export const LANGUAGE_LABELS: Record<Language, string> = {
  cpp: 'C++17',
  python: 'Python 3',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: '入门',
  easy: '基础',
  medium: '进阶',
  hard: '挑战',
  challenge: '综合',
};

export const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  beginner: 1,
  easy: 2,
  medium: 3,
  hard: 4,
  challenge: 5,
};

export const VERDICT_LABELS: Record<Verdict, string> = {
  AC: '通过',
  WA: '答案错误',
  TLE: '超时',
  RE: '运行错误',
  CE: '编译错误',
  OLE: '输出超限',
  SE: '系统错误',
};

export const VERDICT_CLASS: Record<Verdict, string> = {
  AC: 'verdict-ac',
  WA: 'verdict-wa',
  TLE: 'verdict-tle',
  RE: 'verdict-re',
  CE: 'verdict-ce',
  OLE: 'verdict-ole',
  SE: 'verdict-se',
};

export const SCENARIO_LABELS: Record<string, string> = {
  life: '生活服务',
  retail: '商业零售',
  game: '游戏',
  science: '科学计算',
  text: '文本处理',
  system: '系统工具',
  logistics: '物流调度',
  finance: '金融账单',
  algorithm: '算法竞赛',
  data: '数据分析',
};

export const LANGUAGE_OPTIONS: Array<{ value: Language; label: string }> = [
  { value: 'cpp', label: 'C++17' },
  { value: 'python', label: 'Python 3' },
];
