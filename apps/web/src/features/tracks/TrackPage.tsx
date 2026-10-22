import type { CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { ProblemSummary, TrackModule } from '@codelab/shared';
import { api } from '../../lib/api';
import { Icon } from '../../components/Icon';
import { Markdown } from '../../components/Markdown';
import {
  DifficultyBadge,
  ErrorBlock,
  LinkButton,
  LoadingBlock,
  ProgressBar,
  StatusDot,
  Tag,
} from '../../components/ui';

export function TrackPage() {
  const { trackId = '' } = useParams();
  const track = useQuery({
    queryKey: ['track', trackId],
    queryFn: () => api.track(trackId),
  });

  if (track.isLoading) return <LoadingBlock label="正在加载学习路径…" />;
  if (track.isError || !track.data) {
    return (
      <ErrorBlock
        message={track.error instanceof Error ? track.error.message : '学习路径不存在'}
        onRetry={() => void track.refetch()}
      />
    );
  }
  const data = track.data;
  const style = { '--track-accent': data.accent } as CSSProperties;
  const next = data.nextProblem;
  const isKnowledge = data.kind === 'knowledge';
  const nextModuleIndex = isKnowledge
    ? 0
    : Math.max(0, data.modules.findIndex((module) => module.solvedCount < module.totalCount));

  return (
    <div className="page track-page" style={style}>
      <nav className="breadcrumb" aria-label="面包屑">
        <Link to="/">学习中心</Link>
        <Icon name="chevron" size={13} />
        <span>{data.title}</span>
      </nav>

      <header className="track-hero">
        <div className="track-hero-main">
          <div className="eyebrow">LEARNING PATH</div>
          <h1>{data.title}</h1>
          <p className="track-hero-subtitle">{data.subtitle}</p>
          <p className="track-hero-description">{data.description}</p>
          <div className="track-hero-tags">
            <Tag tone="blue">{data.moduleCount} 个模块</Tag>
            {isKnowledge ? (
              <Tag tone="green">知识路径</Tag>
            ) : (
              <>
                <Tag>{data.problemCount} 道练习</Tag>
                <Tag tone="green">
                  {data.solvedCount > 0 ? `已完成 ${data.solvedCount} 题` : '从零开始'}
                </Tag>
              </>
            )}
          </div>
          <div className="track-hero-actions">
            {next ? (
              <LinkButton to={`/problems/${next.id}`} size="lg" icon="play">
                继续学习 · {next.title}
              </LinkButton>
            ) : null}
            {isKnowledge ? (
              <a className="btn btn-primary btn-lg" href="#track-modules">
                <Icon name="book" size={16} /> 开始阅读
              </a>
            ) : (
              <LinkButton to="/problems" size="lg" variant="secondary" icon="book">
                浏览题库
              </LinkButton>
            )}
          </div>
        </div>
        <aside className="track-hero-side">
          <div className="progress-ring-card">
            <span className="eyebrow">{isKnowledge ? 'KNOWLEDGE PATH' : 'PATH PROGRESS'}</span>
            {isKnowledge ? (
              <>
                <div className="big-progress">
                  {data.moduleCount}
                  <span>模块</span>
                </div>
                <p className="muted">
                  按顺序阅读知识卡。每个模块都包含动手命令和自查问题，不要求写代码。
                </p>
                <div className="next-inline">
                  <span>建议从</span>
                  <strong>{data.modules[0]?.title}</strong>
                  <span className="muted">系统基础 · 从命令行开始</span>
                </div>
              </>
            ) : (
              <>
                <div className="big-progress">
                  {Math.round((data.solvedCount / Math.max(1, data.problemCount)) * 100)}
                  <span>%</span>
                </div>
                <ProgressBar value={data.solvedCount} max={data.problemCount} />
                <p className="muted">
                  {data.solvedCount === data.problemCount
                    ? '这条路径已全部完成，去挑战算法专题吧。'
                    : `还剩 ${data.problemCount - data.solvedCount} 道题完成这条路径。`}
                </p>
                {next ? (
                  <div className="next-inline">
                    <span>建议下一题</span>
                    <strong>{next.title}</strong>
                    <span className="muted">{next.moduleTitle}</span>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </aside>
      </header>

      <div className="track-layout">
        <div className="track-modules" id="track-modules">
          {data.modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              knowledge={isKnowledge}
              defaultOpen={index === nextModuleIndex}
            />
          ))}
        </div>
        <aside className="track-sidebar">
          <div className="panel side-panel">
            <h3>学习方式</h3>
            <ol className="side-steps">
              {isKnowledge ? (
                <>
                  <li>按顺序读知识卡，先建立整体地图。</li>
                  <li>在终端里跟着命令做一遍。</li>
                  <li>回答自查问题，再进入下一个模块。</li>
                </>
              ) : (
                <>
                  <li>先读本模块知识卡，建立概念。</li>
                  <li>从第一题开始，自己写、自己运行。</li>
                  <li>提交后读 AI 复盘，再试类似题。</li>
                </>
              )}
            </ol>
          </div>
          <div className="panel side-panel">
            <h3>知识点覆盖</h3>
            <div className="tag-cloud">
              {[...new Set(data.modules.flatMap((module) => module.knowledgeTitles))].map(
                (point) => (
                  <Tag key={point} tone="soft">
                    {point}
                  </Tag>
                ),
              )}
            </div>
          </div>
          <div className="panel side-panel">
            <h3>学习建议</h3>
            <p className="muted side-note">
              {isKnowledge
                ? '先建立地图，再在终端里跟着做。遇到陌生的命令，先查 man page 或 --help，再回到知识卡对照。'
                : '不追求一次通过。先让代码跑起来，再用失败用例和 AI 复盘逐步修正，这才是工程能力的形成方式。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ModuleCard({
  module,
  index,
  knowledge,
  defaultOpen,
}: {
  module: TrackModule;
  index: number;
  knowledge: boolean;
  defaultOpen: boolean;
}) {
  return (
    <details className="module-card" open={defaultOpen}>
      <summary className="module-summary">
        <span className="module-index">{String(index + 1).padStart(2, '0')}</span>
        <div className="module-title-wrap">
          <div className="module-title-row">
            <h3>{module.title}</h3>
            <DifficultyBadge difficulty={module.difficulty} />
          </div>
          <p>{module.summary}</p>
          <div className="module-tags">
            {module.knowledgeTitles.map((point) => (
              <Tag key={point} tone="soft">
                {point}
              </Tag>
            ))}
          </div>
        </div>
        <div className="module-progress">
          <span>{knowledge ? '知识卡' : `${module.solvedCount}/${module.totalCount}`}</span>
          <Icon name="chevronDown" size={18} />
        </div>
      </summary>
      <div className={`module-body ${knowledge ? 'is-knowledge' : ''}`}>
        <div className="module-lesson">
          <div className="mini-heading">
            <Icon name="book" size={16} />
            知识卡
          </div>
          <Markdown>{module.lesson}</Markdown>
        </div>
        {!knowledge ? (
          <div className="module-problems">
            <div className="mini-heading">
              <Icon name="target" size={16} />
              本模块练习
            </div>
            {module.problems.map((problem) => (
              <ProblemRow key={problem.id} problem={problem} />
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}

function ProblemRow({ problem }: { problem: ProblemSummary }) {
  return (
    <Link to={`/problems/${problem.id}`} className={`problem-row status-row-${problem.status}`}>
      <StatusDot status={problem.status} />
      <div className="problem-row-main">
        <div className="problem-row-title">
          <strong>{problem.title}</strong>
          <DifficultyBadge difficulty={problem.difficulty} />
          {problem.status === 'solved' ? <Tag tone="green">已通过</Tag> : null}
        </div>
        <div className="problem-row-meta">
          <Tag tone="soft">{problem.scenarioLabel}</Tag>
          <span>{problem.estimatedMinutes} 分钟</span>
          <span>{problem.knowledgeTitles.join(' · ')}</span>
        </div>
      </div>
      <div className="problem-row-side">
        <span className="muted">
          {problem.acceptanceRate === null ? '尚无提交' : `通过率 ${problem.acceptanceRate}%`}
        </span>
        <Icon name="chevron" size={16} />
      </div>
    </Link>
  );
}
