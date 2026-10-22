import { Link } from 'react-router-dom';
import { LinkButton } from '../components/ui';

export function NotFoundPage() {
  return (
    <div className="page not-found">
      <div className="not-found-code">404</div>
      <h1>这条路径还没有被写出来</h1>
      <p className="muted">页面可能已移动，或者链接拼写有误。</p>
      <div className="not-found-actions">
        <LinkButton to="/" icon="arrowLeft">
          回到学习中心
        </LinkButton>
        <Link to="/problems" className="text-link">
          浏览题库
        </Link>
      </div>
    </div>
  );
}
