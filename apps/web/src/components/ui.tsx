import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Difficulty, ProblemStatus, Verdict } from '@codelab/shared';
import { DIFFICULTY_LABELS, VERDICT_CLASS, VERDICT_LABELS } from '@codelab/shared';
import { Icon, type IconName } from './Icon';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : icon ? <Icon name={icon} size={16} /> : null}
      {children}
    </button>
  );
}

export function LinkButton({
  to,
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
}: {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link className={`btn btn-${variant} btn-${size} ${className}`.trim()} to={to}>
      {icon ? <Icon name={icon} size={16} /> : null}
      {children}
    </Link>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`difficulty difficulty-${difficulty}`}>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

export function StatusDot({ status }: { status: ProblemStatus }) {
  const label = status === 'solved' ? '已通过' : status === 'in_progress' ? '进行中' : '未开始';
  return (
    <span className={`status-dot status-${status}`} title={label}>
      {status === 'solved' ? <Icon name="check" size={13} /> : null}
    </span>
  );
}

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return <span className={`verdict ${VERDICT_CLASS[verdict]}`}>{VERDICT_LABELS[verdict]}</span>;
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="progress-wrap" aria-label={label ?? `${value}/${max}`}>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress-text">
        {value}/{max}
      </span>
    </div>
  );
}

export function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: string }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2>{title}</h2>
        {description ? <p className="muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function LoadingBlock({ label = '加载中…' }: { label?: string }) {
  return (
    <div className="loading-block">
      <span className="spinner spinner-dark" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyBlock({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-block">
      <div className="empty-mark">∅</div>
      <h3>{title}</h3>
      {description ? <p className="muted">{description}</p> : null}
      {action}
    </div>
  );
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="error-block">
      <Icon name="info" size={20} />
      <div>
        <strong>出了点问题</strong>
        <p>{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" icon="refresh" onClick={onRetry}>
          重试
        </Button>
      ) : null}
    </div>
  );
}
