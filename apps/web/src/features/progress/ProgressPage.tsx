import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, downloadProgress, formatRelative } from '../../lib/api';
import { Icon } from '../../components/Icon';
import {
  ErrorBlock,
  LinkButton,
  LoadingBlock,
  ProgressBar,
  SectionHeading,
  VerdictBadge,
} from '../../components/ui';

export function ProgressPage() {
  const dashboard = useQuery({ queryKey: ['dashboard'], queryFn: api.dashboard });
  if (dashboard.isLoading) return <LoadingBlock label="正在统计学习进度…" />;
  if (dashboard.isError || !dashboard.data) {
    return (
      <ErrorBlock
        message={dashboard.error instanceof Error ? dashboard.error.message : '进度加载失败'}
        onRetry={() => void dashboard.refetch()}
      />
    );
  }
  const data = dashboard.data;
  return (
    <div className="page progress-page">
      <header className="page-head">
        <div>
          <div className="eyebrow">YOUR PROGRESS</div>
          <h1>学习进度</h1>
          <p className="page-lead">
            记录你的通过数、连续学习天数和每条路径的完成情况。进度保存在本地学习档案中。
          </p>
        </div>
        <button className="btn btn-secondary btn-md" type="button" onClick={downloadProgress}>
          <Icon name="download" size={16} /> 导出进度
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card accent-blue">
          <span>已通过</span>
          <strong>{data.stats.solved}</strong>
          <p>道题完成判题</p>
        </div>
        <div className="stat-card accent-green">
          <span>已尝试</span>
          <strong>{data.stats.attempted}</strong>
          <p>道题进入学习</p>
        </div>
        <div className="stat-card accent-amber">
          <span>连续学习</span>
          <strong>{data.stats.streakDays}</strong>
          <p>天有提交记录</p>
        </div>
        <div className="stat-card accent-purple">
          <span>投入时间</span>
          <strong>{data.stats.totalMinutes}</strong>
          <p>按题目预估累计</p>
        </div>
      </div>

      <section className="panel">
        <SectionHeading eyebrow="PATHS" title="各路径进度" />
        <div className="progress-paths">
          {data.tracks.map((track) => (
            <Link to={`/tracks/${track.id}`} className="progress-path-row" key={track.id}>
              <div className="progress-path-info">
                <strong>{track.title}</strong>
                <span className="muted">{track.subtitle}</span>
              </div>
              <ProgressBar value={track.solvedCount} max={track.problemCount} />
              <span className="progress-path-percent">
                {Math.round((track.solvedCount / Math.max(1, track.problemCount)) * 100)}%
              </span>
              <Icon name="chevron" size={16} />
            </Link>
          ))}
        </div>
      </section>

      <section className="home-grid">
        <div className="panel">
          <SectionHeading eyebrow="RECENT" title="最近提交" />
          {data.recentActivity.length === 0 ? (
            <p className="muted">还没有提交记录。</p>
          ) : (
            <div className="activity-list">
              {data.recentActivity.map((item) => (
                <Link className="activity-row" to={`/problems/${item.problemId}`} key={item.id}>
                  <VerdictBadge verdict={item.verdict} />
                  <span className="activity-title">{item.problemTitle}</span>
                  <span className="activity-time">{formatRelative(item.createdAt)}</span>
                  <Icon name="chevron" size={15} />
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="panel continue-panel">
          <SectionHeading eyebrow="NEXT" title="继续学习" />
          {data.continueLearning ? (
            <>
              <h3>{data.continueLearning.problemTitle}</h3>
              <p className="muted">
                {data.continueLearning.trackTitle} · {data.continueLearning.moduleTitle}
              </p>
              <LinkButton to={`/problems/${data.continueLearning.problemId}`} icon="play">
                打开题目
              </LinkButton>
            </>
          ) : (
            <LinkButton to="/problems" icon="arrow">
              去题库
            </LinkButton>
          )}
        </div>
      </section>
    </div>
  );
}
