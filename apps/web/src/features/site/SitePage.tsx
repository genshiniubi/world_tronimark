import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useSite } from '../../lib/site-context';
import { Icon } from '../../components/Icon';
import { Markdown } from '../../components/Markdown';
import { ErrorBlock, LoadingBlock } from '../../components/ui';

export function SitePage({ slug }: { slug: 'about' | 'contact' | 'sponsor' }) {
  const site = useSite();
  const page = useQuery({
    queryKey: ['site-page', slug],
    queryFn: () => api.sitePage(slug),
  });

  if (page.isLoading) return <LoadingBlock label="正在打开页面…" />;
  if (page.isError || !page.data) {
    return (
      <ErrorBlock
        message={page.error instanceof Error ? page.error.message : '页面不存在'}
        onRetry={() => void page.refetch()}
      />
    );
  }

  const sponsor = site.site.sponsor;
  const singleColumn = slug === 'contact';

  return (
    <div className="page site-page">
      <header className="site-hero">
        <div className="eyebrow">
          {slug === 'sponsor' ? 'SUPPORT' : slug === 'contact' ? 'EMAIL' : 'CODELAB'}
        </div>
        <h1>{page.data.title}</h1>
        <p className="page-lead">
          {slug === 'about'
            ? '一个把“读懂”变成“写出来”的编程学习空间。'
            : slug === 'contact'
              ? '不需要填表，直接发邮件就好。'
              : '随意赞助，心意就好。'}
        </p>
      </header>

      <div className={`site-layout ${singleColumn ? 'single' : ''}`}>
        <article className="panel site-article">
          <Markdown>{page.data.content}</Markdown>
          {slug === 'contact' ? (
            <a className="contact-email-card" href={`mailto:${site.site.email}`}>
              <span className="contact-email-icon">
                <Icon name="send" size={22} />
              </span>
              <span className="contact-email-copy">
                <span className="eyebrow">EMAIL</span>
                <strong>{site.site.email}</strong>
                <span>点击发送邮件</span>
              </span>
              <Icon name="arrow" size={18} />
            </a>
          ) : null}
        </article>

        {slug === 'sponsor' ? (
          <aside className="site-aside">
            <div className="panel sponsor-summary">
              <span className="eyebrow">SPONSOR</span>
              <h3>支持我敲，拟码</h3>
              <p>{sponsor.intro}</p>
              <div className="sponsor-qr-wrap">
                <img
                  className="sponsor-qr"
                  src="/assets/sponsor-qr.svg"
                  alt="赞助二维码"
                  width={280}
                  height={280}
                />
              </div>
              <p className="muted small">{sponsor.qrNote}</p>
            </div>
          </aside>
        ) : null}

        {slug === 'about' ? (
          <aside className="site-aside">
            <div className="panel about-facts">
              <h3>站点信息</h3>
              <div className="fact-row">
                <span>站点</span>
                <strong>{site.site.name}</strong>
              </div>
              <div className="fact-row">
                <span>当前内容</span>
                <strong>{site.tracks.reduce((sum, item) => sum + item.problemCount, 0)} 道题</strong>
              </div>
              <div className="fact-row">
                <span>技术栈</span>
                <strong>React + CodeMirror + Fastify</strong>
              </div>
              <div className="fact-row">
                <span>外部依赖</span>
                <strong>无 Google Fonts / 国外 CDN</strong>
              </div>
              <p className="muted small">
                本站的题目、题解与判题用例会持续更新。欢迎通过“联系服务”发邮件。
              </p>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
