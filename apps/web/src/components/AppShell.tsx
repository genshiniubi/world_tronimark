import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, downloadProgress } from '../lib/api';
import { SiteProvider } from '../lib/site-context';
import { Icon } from './Icon';
import { BrandMark } from './BrandMark';
import { ErrorBlock, LoadingBlock } from './ui';

const navItems = [
  { to: '/', label: '学习中心', end: true },
  { to: '/problems', label: '题库' },
  { to: '/notes', label: '笔记' },
  { to: '/progress', label: '学习进度' },
];

const footerLinks = [
  { to: '/about', label: '关于我们' },
  { to: '/contact', label: '联系服务' },
  { to: '/sponsor', label: '赞助我们' },
];

export function AppShell() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const bootstrap = useQuery({
    queryKey: ['bootstrap'],
    queryFn: api.bootstrap,
    staleTime: 60_000,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setMenuOpen(false);
  }, [location.pathname]);

  if (bootstrap.isLoading) {
    return (
      <div className="boot-screen">
        <div className="boot-logo">
          <BrandMark />
          <span>我敲，拟码</span>
        </div>
        <LoadingBlock label="正在准备你的学习空间…" />
      </div>
    );
  }

  if (bootstrap.isError || !bootstrap.data) {
    return (
      <div className="boot-screen">
        <ErrorBlock
          message={bootstrap.error instanceof Error ? bootstrap.error.message : '无法连接后端服务'}
          onRetry={() => void bootstrap.refetch()}
        />
        <p className="muted">请确认后端运行在 http://127.0.0.1:3001</p>
      </div>
    );
  }

  const site = bootstrap.data.site;

  return (
    <SiteProvider value={bootstrap.data}>
      <div className="app-shell">
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <header className="topbar">
          <div className="topbar-inner">
            <NavLink to="/" className="brand" aria-label={`${site.name} 首页`}>
              <BrandMark />
              <span className="brand-name">{site.name}</span>
              <span className="brand-tag">LEARN BY BUILDING</span>
            </NavLink>

            <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="主导航">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mobile-nav-extra">
                {footerLinks.map((item) => (
                  <NavLink key={item.to} to={item.to} className="nav-link">
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            <div className="topbar-actions">
              <span
                className={`ai-pill ${bootstrap.data.ai.configured ? 'is-online' : 'is-local'}`}
                title={
                  bootstrap.data.ai.configured
                    ? `AI 已连接：${bootstrap.data.ai.model}`
                    : '未配置 AI Key，当前使用本地降级能力'
                }
              >
                <Icon name="sparkles" size={14} />
                {bootstrap.data.ai.configured ? 'AI 已连接' : '本地 AI'}
              </span>
              <button
                className="icon-btn mobile-menu-btn"
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
                aria-expanded={menuOpen}
              >
                <Icon name={menuOpen ? 'close' : 'menu'} />
              </button>
            </div>
          </div>
        </header>

        <main id="main-content" className="main-content">
          <Outlet />
        </main>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="brand footer-logo">
                <BrandMark />
                <span className="brand-name">{site.name}</span>
              </div>
              <p>{site.description}</p>
              <button className="text-btn" type="button" onClick={downloadProgress}>
                <Icon name="download" size={14} /> 导出学习进度
              </button>
            </div>
            <div className="footer-col">
              <h4>学习</h4>
              <NavLink to="/problems">题库</NavLink>
              <NavLink to="/tracks/cpp">C++ 路径</NavLink>
              <NavLink to="/tracks/python">Python 路径</NavLink>
              <NavLink to="/tracks/algorithms">算法专题</NavLink>
            </div>
            <div className="footer-col">
              <h4>站点</h4>
              {footerLinks.map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="footer-col">
              <h4>环境</h4>
              <span
                className={`env-line ${
                  bootstrap.data.health.cpp.available && !bootstrap.data.health.cpp.executionBlocked
                    ? 'ok'
                    : 'bad'
                }`}
              >
                C++{' '}
                {!bootstrap.data.health.cpp.available
                  ? '未配置'
                  : bootstrap.data.health.cpp.executionBlocked
                    ? '运行受限'
                    : '可用'}
              </span>
              <span className={`env-line ${bootstrap.data.health.python.available ? 'ok' : 'bad'}`}>
                Python {bootstrap.data.health.python.available ? '可用' : '未配置'}
              </span>
              <span className="env-line">Node {bootstrap.data.health.node}</span>
              <span className="env-line muted">
                {bootstrap.data.health.ai.configured ? 'AI 服务已连接' : 'AI 本地降级'}
              </span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {site.name} · 以练代学
            </span>
            <span>本站不依赖 Google Fonts 或国外不稳定 CDN</span>
          </div>
        </footer>
      </div>
    </SiteProvider>
  );
}
