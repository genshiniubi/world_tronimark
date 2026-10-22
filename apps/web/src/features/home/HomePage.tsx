import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { TrackSummary } from '@codelab/shared';
import { api, formatRelative } from '../../lib/api';
import { Icon, type IconName } from '../../components/Icon';
import {
  DifficultyBadge,
  ErrorBlock,
  LinkButton,
  LoadingBlock,
  ProgressBar,
  SectionHeading,
  Tag,
  VerdictBadge,
} from '../../components/ui';

export function HomePage() {
  const dashboard = useQuery({
    queryKey: ['dashboard'],
    queryFn: api.dashboard,
  });

  if (dashboard.isLoading) return <LoadingBlock label="正在加载学习概览…" />;
  if (dashboard.isError || !dashboard.data) {
    return (
      <ErrorBlock
        message={dashboard.error instanceof Error ? dashboard.error.message : '加载失败'}
        onRetry={() => void dashboard.refetch()}
      />
    );
  }
  const data = dashboard.data;
  const continueTarget = data.continueLearning;
  const nextTrack = data.tracks.find((track) => track.nextProblem);

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" /> LEARN BY BUILDING
          </div>
          <h1>
            从第一行代码，
            <br />
            到独立完成一个项目。
          </h1>
          <p className="hero-lead">
            在真实情景里写 C++ 与 Python。每道题都有知识卡、即时判题和 AI 复盘，
            不背语法，直接把手感练出来。
          </p>
          <div className="hero-actions">
            {continueTarget ? (
              <LinkButton
                to={`/problems/${continueTarget.problemId}`}
                size="lg"
                icon="play"
              >
                继续学习 · {continueTarget.problemTitle}
              </LinkButton>
            ) : (
              <LinkButton to="/problems" size="lg" icon="arrow">
                开始第一道题
              </LinkButton>
            )}
            <LinkButton to="/problems" size="lg" variant="secondary" icon="book">
              浏览题库
            </LinkButton>
          </div>
          <div className="hero-stats">
            <div>
              <strong>{data.stats.solved}</strong>
              <span>已通过</span>
            </div>
            <div>
              <strong>{data.stats.streakDays}</strong>
              <span>连续天数</span>
            </div>
            <div>
              <strong>{data.stats.totalMinutes}</strong>
              <span>学习分钟</span>
            </div>
            <div>
              <strong>{data.tracks.length}</strong>
              <span>学习路径</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="代码示例">
          <div className="code-window">
            <div className="code-window-bar">
              <span className="dot dot-red" />
              <span className="dot dot-amber" />
              <span className="dot dot-green" />
              <span className="code-window-title">first_step.cpp</span>
              <span className="code-window-lang">C++17</span>
            </div>
            <pre className="hero-code">
              <code>
                <span className="code-comment">// 从一个真实问题开始</span>
                {'\n'}
                <span className="code-keyword">int</span> price, count;{'\n'}
                <span className="code-keyword">cin</span> &gt;&gt; price &gt;&gt; count;{'\n\n'}
                <span className="code-keyword">double</span> total = price * count;{'\n'}
                <span className="code-keyword">cout</span> &lt;&lt; fixed &lt;&lt; setprecision(2){'\n'}
                {'     '}&lt;&lt; total &lt;&lt; <span className="code-string">'\\n'</span>;{'\n'}
                {'\n'}
                <span className="code-comment">// 运行 → 判题 → 复盘 → 下一题</span>
              </code>
            </pre>
            <div className="code-window-footer">
              <span className="status-dot status-solved">
                <Icon name="check" size={12} />
              </span>
              <span>样例通过</span>
              <span className="code-window-tag">判题通过 · 可复盘</span>
            </div>
          </div>
          <div className="floating-note floating-note-a">
            <Icon name="sparkles" size={15} />
            <span>选中代码，问 AI 为什么这样写</span>
          </div>
          <div className="floating-note floating-note-b">
            <Icon name="target" size={15} />
            <span>每个知识点都有可运行练习</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <SectionHeading
          eyebrow="LEARNING PATHS"
          title="选择你的学习项目"
          description="每条路径都由知识卡、循序渐进的题目和综合练习组成。"
          action={
            <LinkButton to="/problems" variant="ghost" icon="arrow">
              全部题目
            </LinkButton>
          }
        />
        <div className="track-grid">
          {data.tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      <section className="home-grid">
        <div className="panel learning-loop">
          <SectionHeading eyebrow="HOW IT WORKS" title="一个完整的学习闭环" />
          <div className="loop-steps">
            {[
              ['01', '读知识卡', '先建立概念地图，知道这个知识点解决什么问题。'],
              ['02', '写真实题', '生活、商业、游戏、系统场景，不是孤立语法题。'],
              ['03', '真实判题', '样例 + 隐藏用例，编译错误和失败用例都能回看。'],
              ['04', 'AI 复盘', '从正确性、边界、复杂度给下一步建议，并推荐类似题。'],
            ].map(([index, title, text]) => (
              <div className="loop-step" key={index}>
                <span className="loop-index">{index}</span>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel recent-panel">
          <SectionHeading
            eyebrow="RECENT"
            title="最近活动"
            action={nextTrack ? <Tag tone="blue">下一题已准备</Tag> : null}
          />
          {data.recentActivity.length === 0 ? (
            <div className="empty-inline">
              <Icon name="terminal" size={20} />
              <p>还没有提交记录。选一道题，运行你的第一段代码。</p>
              <LinkButton to="/problems" size="sm" variant="soft">
                去题库
              </LinkButton>
            </div>
          ) : (
            <div className="activity-list">
              {data.recentActivity.map((item) => (
                <Link
                  className="activity-row"
                  to={`/problems/${item.problemId}`}
                  key={item.id}
                >
                  <VerdictBadge verdict={item.verdict} />
                  <span className="activity-title">{item.problemTitle}</span>
                  <span className="activity-time">{formatRelative(item.createdAt)}</span>
                  <Icon name="chevron" size={15} />
                </Link>
              ))}
            </div>
          )}
          <div className="continue-card">
            <div>
              <span className="eyebrow">CONTINUE</span>
              <h4>
                {continueTarget ? continueTarget.problemTitle : '从题库挑一道开始'}
              </h4>
              <p className="muted">
                {continueTarget
                  ? `${continueTarget.trackTitle} · ${continueTarget.moduleTitle}`
                  : '题目按知识点排序，不需要自己找顺序。'}
              </p>
            </div>
            <LinkButton
              to={continueTarget ? `/problems/${continueTarget.problemId}` : '/problems'}
              size="sm"
              icon="arrow"
            >
              继续
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="principles">
        <div className="principle">
          <Icon name="target" size={22} />
          <h3>先做对，再写好</h3>
          <p>判题只认结果；AI 复盘再和你讨论边界、复杂度与可读性。</p>
        </div>
        <div className="principle">
          <Icon name="book" size={22} />
          <h3>内容可扩展</h3>
          <p>新增语言、算法专题或系统知识，只需要增加内容与适配器。</p>
        </div>
        <div className="principle">
          <Icon name="sparkles" size={22} />
          <h3>AI 是助教</h3>
          <p>没有 API Key 也能用本地补全和规则复盘；通过与否由真实测试决定。</p>
        </div>
      </section>
    </div>
  );
}

function TrackCard({ track }: { track: TrackSummary }) {
  const style = { '--track-accent': track.accent } as CSSProperties;
  const iconName = (['cpp', 'python', 'algorithm', 'terminal'].includes(track.icon)
    ? track.icon
    : 'code') as IconName;
  const isKnowledge = track.kind === 'knowledge';
  return (
    <article className="track-card" style={style}>
      <div className="track-card-top">
        <span className="track-icon">
          <Icon name={iconName} size={22} />
        </span>
        <span className="track-kind">{isKnowledge ? '知识路径' : '编程路径'}</span>
      </div>
      <h3>{track.title}</h3>
      <p className="track-subtitle">{track.subtitle}</p>
      <p className="track-description">{track.description}</p>
      <div className="track-meta">
        <span>{track.moduleCount} 个模块</span>
        <span>{isKnowledge ? '知识卡 + 自查' : `${track.problemCount} 道题`}</span>
      </div>
      {isKnowledge ? (
        <div className="knowledge-progress-note">
          <Icon name="book" size={14} /> 从命令行到数据库，按顺序阅读
        </div>
      ) : (
        <ProgressBar value={track.solvedCount} max={track.problemCount} label="路径进度" />
      )}
      <div className="track-card-footer">
        <Link to={`/tracks/${track.id}`} className="text-link">
          查看路径 <Icon name="arrow" size={14} />
        </Link>
        {track.nextProblem ? (
          <Link to={`/problems/${track.nextProblem.id}`} className="mini-action">
            <Icon name="play" size={13} /> 下一题
          </Link>
        ) : isKnowledge ? (
          <Link to={`/tracks/${track.id}#track-modules`} className="mini-action">
            <Icon name="book" size={13} /> 开始阅读
          </Link>
        ) : null}
      </div>
    </article>
  );
}
