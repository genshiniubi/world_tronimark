import { useEffect, useRef, useState } from 'react';
import type { AiExplainResponse, Language } from '@codelab/shared';
import { api } from '../../lib/api';
import type { EditorSelection } from '../../editor/EditorPane';
import { Icon } from '../../components/Icon';

interface SelectionCardProps {
  selection: EditorSelection | null;
  language: Language;
  problemId: string;
  onClose: () => void;
}

export function SelectionCard({ selection, language, problemId, onClose }: SelectionCardProps) {
  const [data, setData] = useState<AiExplainResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [pinned, setPinned] = useState(false);
  const [asked, setAsked] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const requestId = useRef(0);
  const cache = useRef(new Map<string, AiExplainResponse>());

  const text = selection?.text ?? '';

  useEffect(() => {
    if (!selection || text.trim().length < 2) {
      setData(null);
      setError(null);
      return;
    }
    const key = `${language}:${text}`;
    const cached = cache.current.get(key);
    if (cached) {
      setData(cached);
      setError(null);
      setLoading(false);
      setQuestion('');
      setAsked(false);
      return;
    }
    const current = ++requestId.current;
    setLoading(true);
    setError(null);
    setData(null);
    setQuestion('');
    setAsked(false);
    const timer = window.setTimeout(() => {
      api
        .aiExplain({
          problemId,
          language,
          selectedText: text,
          context: selection.context,
        })
        .then((result) => {
          if (requestId.current !== current) return;
          cache.current.set(key, result);
          setData(result);
          setLoading(false);
        })
        .catch((reason: unknown) => {
          if (requestId.current !== current) return;
          setError(reason instanceof Error ? reason.message : 'AI 解读失败');
          setLoading(false);
        });
    }, 280);
    return () => window.clearTimeout(timer);
  }, [selection, text, language, problemId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (pinned) return;
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [onClose, pinned]);

  if (!selection) return null;

  const ask = async () => {
    const prompt = question.trim();
    if (!prompt || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.aiExplain({
        problemId,
        language,
        selectedText: text,
        context: selection.context,
        question: prompt,
      });
      setData(result);
      setAsked(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'AI 回答失败');
    } finally {
      setLoading(false);
    }
  };

  const coords = selection.coords;
  const cardWidth = 390;
  const left = Math.min(
    Math.max(12, coords.left - 24),
    Math.max(12, window.innerWidth - cardWidth - 12),
  );
  const estimatedHeight = 440;
  const below = coords.bottom + 12;
  const placeAbove = below + estimatedHeight > window.innerHeight && coords.top > estimatedHeight;
  const top = placeAbove ? Math.max(12, coords.top - estimatedHeight - 12) : below;
  const position =
    window.innerWidth < 720
      ? undefined
      : ({ left: `${left}px`, top: `${top}px` } as const);

  return (
    <div
      className={`selection-card ${pinned ? 'is-pinned' : ''} ${placeAbove ? 'place-above' : ''}`}
      style={position}
      ref={cardRef}
      role="dialog"
      aria-label="代码解读"
    >
      <div className="selection-card-head">
        <div className="selection-title">
          <span className="selection-icon">
            <Icon name="sparkles" size={15} />
          </span>
          <div>
            <strong>代码解读</strong>
            <span>{data?.degraded === false ? 'AI 助教' : '本地助教'}</span>
          </div>
        </div>
        <div className="selection-actions">
          <button
            type="button"
            className={`icon-btn small ${pinned ? 'is-active' : ''}`}
            onClick={() => setPinned((value) => !value)}
            title={pinned ? '取消固定' : '固定窗口'}
            aria-label={pinned ? '取消固定' : '固定窗口'}
          >
            <Icon name="target" size={14} />
          </button>
          <button type="button" className="icon-btn small" onClick={onClose} aria-label="关闭解读">
            <Icon name="x" size={15} />
          </button>
        </div>
      </div>

      <div className="selection-code">
        <code>{text.length > 280 ? `${text.slice(0, 280)}…` : text}</code>
      </div>

      <div className="selection-body" aria-live="polite">
        {loading && !data ? (
          <div className="selection-skeleton">
            <span className="skeleton-line" />
            <span className="skeleton-line short" />
            <span className="skeleton-line" />
            <span className="skeleton-line shorter" />
          </div>
        ) : error ? (
          <div className="selection-error">
            <Icon name="info" size={16} />
            <span>{error}</span>
          </div>
        ) : data ? (
          <>
            <ExplainBlock index="01" title="这段在做什么" text={data.meaning} />
            <ExplainBlock index="02" title="为什么这样写" text={data.why} />
            <ExplainBlock index="03" title="还可以怎么写" text={data.alternatives} />
            <ExplainBlock index="04" title="怎样写更方便" text={data.convenient} />
            {data.answer ? (
              <div className="selection-answer">
                <span className="explain-label">你的问题</span>
                <p>{data.answer}</p>
              </div>
            ) : null}
            {data.degraded ? (
              <div className="selection-degraded">
                未配置 AI Key，以上为本地规则解释。配置 AI 后可结合完整上下文回答自定义问题。
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="selection-ask">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void ask();
            }
          }}
          placeholder={asked ? '继续追问这段代码…' : '问 AI：这段为什么这样写？'}
          aria-label="向 AI 提问"
        />
        <button
          type="button"
          className="ask-btn"
          onClick={() => void ask()}
          disabled={!question.trim() || loading}
          aria-label="发送问题"
        >
          {loading ? <span className="spinner" /> : <Icon name="send" size={15} />}
        </button>
      </div>
    </div>
  );
}

function ExplainBlock({ index, title, text }: { index: string; title: string; text: string }) {
  return (
    <div className="explain-block">
      <div className="explain-head">
        <span>{index}</span>
        <strong>{title}</strong>
      </div>
      <p>{text}</p>
    </div>
  );
}
