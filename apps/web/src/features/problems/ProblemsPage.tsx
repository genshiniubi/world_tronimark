import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { ProblemStatus } from '@codelab/shared';
import { DIFFICULTY_LABELS, LANGUAGE_LABELS } from '@codelab/shared';
import { api } from '../../lib/api';
import { Icon } from '../../components/Icon';
import {
  DifficultyBadge,
  ErrorBlock,
  LoadingBlock,
  StatusDot,
  Tag,
} from '../../components/ui';

export function ProblemsPage() {
  const problems = useQuery({ queryKey: ['problems'], queryFn: () => api.problems() });
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState<'all' | ProblemStatus>('all');
  const [language, setLanguage] = useState('all');

  const items = problems.data?.items ?? [];
  const tracks = useMemo(
    () =>
      [...new Map(items.map((item) => [item.trackId, item.trackTitle])).entries()].map(
        ([id, title]) => ({ id, title }),
      ),
    [items],
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (track !== 'all' && item.trackId !== track) return false;
      if (difficulty !== 'all' && item.difficulty !== difficulty) return false;
      if (status !== 'all' && item.status !== status) return false;
      if (language !== 'all' && !item.languages.includes(language as 'cpp' | 'python')) return false;
      if (query.trim()) {
        const haystack = `${item.title} ${item.summary} ${item.knowledgeTitles.join(' ')}`.toLowerCase();
        if (!haystack.includes(query.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [items, track, difficulty, status, language, query]);

  if (problems.isLoading) return <LoadingBlock label="正在加载题库…" />;
  if (problems.isError) {
    return (
      <ErrorBlock
        message={problems.error instanceof Error ? problems.error.message : '题库加载失败'}
        onRetry={() => void problems.refetch()}
      />
    );
  }

  const solved = items.filter((item) => item.status === 'solved').length;
  const inProgress = items.filter((item) => item.status === 'in_progress').length;

  return (
    <div className="page problems-page">
      <header className="page-head problems-head">
        <div>
          <div className="eyebrow">PROBLEM SET</div>
          <h1>题库</h1>
          <p className="page-lead">
            按知识点循序渐进。每道题都可以运行、提交、调试，并在通过后查看题解和相似题。
          </p>
        </div>
        <div className="problem-summary">
          <div>
            <strong>{solved}</strong>
            <span>已通过</span>
          </div>
          <div>
            <strong>{inProgress}</strong>
            <span>进行中</span>
          </div>
          <div>
            <strong>{items.length}</strong>
            <span>全部题目</span>
          </div>
        </div>
      </header>

      <div className="filter-bar">
        <label className="search-field">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索题目、知识点…"
            aria-label="搜索题目"
          />
        </label>
        <select value={track} onChange={(event) => setTrack(event.target.value)} aria-label="学习路径">
          <option value="all">全部路径</option>
          {tracks.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
          aria-label="难度"
        >
          <option value="all">全部难度</option>
          {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as 'all' | ProblemStatus)}
          aria-label="完成状态"
        >
          <option value="all">全部状态</option>
          <option value="not_started">未开始</option>
          <option value="in_progress">进行中</option>
          <option value="solved">已通过</option>
        </select>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          aria-label="语言"
        >
          <option value="all">全部语言</option>
          <option value="cpp">C++17</option>
          <option value="python">Python 3</option>
        </select>
        {filtered.length !== items.length ? (
          <button
            className="text-btn"
            type="button"
            onClick={() => {
              setQuery('');
              setTrack('all');
              setDifficulty('all');
              setStatus('all');
              setLanguage('all');
            }}
          >
            清除筛选
          </button>
        ) : null}
      </div>

      <div className="table-card">
        <div className="problem-table-head">
          <span>状态</span>
          <span>题目</span>
          <span>知识点</span>
          <span>难度</span>
          <span>通过率</span>
          <span />
        </div>
        {filtered.length === 0 ? (
          <div className="empty-inline">
            <Icon name="search" size={22} />
            <p>没有匹配的题目，试试放宽筛选条件。</p>
          </div>
        ) : (
          filtered.map((problem) => (
            <Link className="problem-table-row" to={`/problems/${problem.id}`} key={problem.id}>
              <span className="cell-status">
                <StatusDot status={problem.status} />
              </span>
              <span className="cell-title">
                <strong>{problem.title}</strong>
                <span className="problem-path">
                  {problem.trackTitle} · {problem.moduleTitle}
                </span>
                <span className="problem-langs">
                  {problem.languages.map((item) => (
                    <Tag key={item} tone="soft">
                      {LANGUAGE_LABELS[item]}
                    </Tag>
                  ))}
                </span>
              </span>
              <span className="cell-tags">
                {problem.knowledgeTitles.slice(0, 2).map((title) => (
                  <Tag key={title}>{title}</Tag>
                ))}
              </span>
              <span>
                <DifficultyBadge difficulty={problem.difficulty} />
              </span>
              <span className="muted cell-rate">
                {problem.acceptanceRate === null ? '—' : `${problem.acceptanceRate}%`}
              </span>
              <span className="cell-arrow">
                <Icon name="chevron" size={16} />
              </span>
            </Link>
          ))
        )}
      </div>

      <p className="table-footnote">
        共 {filtered.length} 道题。通过率按本站全部提交计算，仅作学习参考。
      </p>
    </div>
  );
}
