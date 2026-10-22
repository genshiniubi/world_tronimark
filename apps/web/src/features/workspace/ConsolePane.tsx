import { useState } from 'react';
import { Link } from 'react-router-dom';
import type {
  AiReview,
  ProblemSummary,
  SubmissionResult,
  TestCasePublic,
  Verdict,
} from '@codelab/shared';
import { VERDICT_LABELS } from '@codelab/shared';
import { Icon } from '../../components/Icon';
import { Button, EmptyBlock, Tag, VerdictBadge } from '../../components/ui';

export type ConsoleTab = 'run' | 'submit' | 'debug' | 'review' | 'samples';

export interface RunDisplay {
  verdict: string;
  compileOutput: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timeMs: number;
  timedOut: boolean;
  outputTruncated: boolean;
}

export interface DebugTrace {
  kind: 'trace';
  steps: Array<{ line: number; locals: Record<string, string> }>;
  stdout: string;
  stderr: string;
  error: string | null;
  timedOut: boolean;
}

export interface DebugRun {
  kind: 'run';
  message: string;
  result: RunDisplay;
}

interface ConsolePaneProps {
  tab: ConsoleTab;
  onTabChange: (tab: ConsoleTab) => void;
  runResult: RunDisplay | null;
  submitResult: SubmissionResult | null;
  debugResult: DebugTrace | DebugRun | null;
  review: AiReview | null;
  reviewLoading: boolean;
  reviewError: string | null;
  samples: TestCasePublic[];
  customInput: string;
  onCustomInput: (value: string) => void;
  onUseSample: (input: string) => void;
  onReviewRetry: () => void;
  aiConfigured: boolean;
  running: boolean;
  submitting: boolean;
  similar: ProblemSummary[];
}

export function ConsolePane({
  tab,
  onTabChange,
  runResult,
  submitResult,
  debugResult,
  review,
  reviewLoading,
  reviewError,
  samples,
  customInput,
  onCustomInput,
  onUseSample,
  onReviewRetry,
  aiConfigured,
  running,
  submitting,
  similar,
}: ConsolePaneProps) {
  const tabs: Array<{ id: ConsoleTab; label: string; badge?: string }> = [
    { id: 'run', label: '运行结果' },
    { id: 'samples', label: '测试用例', badge: String(samples.length) },
    { id: 'debug', label: '调试' },
    {
      id: 'review',
      label: 'AI 复盘',
      badge: review ? (review.passed ? '通过' : '建议') : undefined,
    },
    { id: 'submit', label: '提交记录' },
  ];

  return (
    <section className="console-pane">
      <div className="console-head">
        <div className="console-tabs" role="tablist" aria-label="控制台">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={`console-tab ${tab === item.id ? 'is-active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              {item.label}
              {item.badge ? <span className="console-badge">{item.badge}</span> : null}
            </button>
          ))}
        </div>
        <div className="console-status">
          {running ? (
            <>
              <span className="spinner spinner-dark" /> 运行中
            </>
          ) : submitting ? (
            <>
              <span className="spinner spinner-dark" /> 判题中
            </>
          ) : (
            <>
              <span className="status-light" /> 就绪
            </>
          )}
        </div>
      </div>

      <div className="console-body">
        {tab === 'run' ? (
          <RunPanel
            result={runResult}
            customInput={customInput}
            onCustomInput={onCustomInput}
            onUseSample={onUseSample}
            samples={samples}
          />
        ) : null}
        {tab === 'samples' ? (
          <SamplesPanel samples={samples} onUseSample={onUseSample} />
        ) : null}
        {tab === 'debug' ? <DebugPanel result={debugResult} /> : null}
        {tab === 'review' ? (
          <ReviewPanel
            review={review}
            loading={reviewLoading}
            error={reviewError}
            onRetry={onReviewRetry}
            aiConfigured={aiConfigured}
            similar={similar}
          />
        ) : null}
        {tab === 'submit' ? <SubmitPanel result={submitResult} /> : null}
      </div>
    </section>
  );
}

function RunPanel({
  result,
  customInput,
  onCustomInput,
  onUseSample,
  samples,
}: {
  result: RunDisplay | null;
  customInput: string;
  onCustomInput: (value: string) => void;
  onUseSample: (input: string) => void;
  samples: TestCasePublic[];
}) {
  return (
    <div className="console-grid">
      <div className="stdin-panel">
        <div className="console-section-head">
          <span>自定义输入</span>
          <span className="muted">stdin</span>
        </div>
        <textarea
          value={customInput}
          onChange={(event) => onCustomInput(event.target.value)}
          spellCheck={false}
          aria-label="自定义输入"
          placeholder="在这里输入程序的标准输入…"
        />
        <div className="sample-shortcuts">
          {samples.map((sample, index) => (
            <button
              key={sample.id}
              type="button"
              className="text-btn"
              onClick={() => onUseSample(sample.input)}
            >
              样例 {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="output-panel">
        {!result ? (
          <EmptyBlock
            title="还没有运行"
            description="点击上方“运行”或按 Ctrl+Enter，使用自定义输入执行代码。"
          />
        ) : (
          <>
            <div className="result-summary">
              <RunVerdict verdict={result.verdict} />
              <span>{result.timeMs} ms</span>
              {result.exitCode !== null ? <span>exit {result.exitCode}</span> : null}
              {result.outputTruncated ? <Tag tone="amber">输出已截断</Tag> : null}
            </div>
            {result.compileOutput ? (
              <OutputBlock title="编译输出" text={result.compileOutput} tone="warn" />
            ) : null}
            {result.stdout ? <OutputBlock title="标准输出" text={result.stdout} /> : null}
            {result.stderr ? <OutputBlock title="标准错误" text={result.stderr} tone="danger" /> : null}
            {!result.stdout && !result.stderr && !result.compileOutput ? (
              <p className="muted console-empty-note">程序没有产生输出。</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function RunVerdict({ verdict }: { verdict: string }) {
  if (verdict === 'OK') return <Tag tone="green">运行成功</Tag>;
  if (verdict === 'CE') return <Tag tone="red">编译错误</Tag>;
  if (verdict === 'TLE') return <Tag tone="amber">运行超时</Tag>;
  if (verdict === 'RE') return <Tag tone="red">运行错误</Tag>;
  if (verdict === 'OLE') return <Tag tone="amber">输出超限</Tag>;
  if (verdict === 'SE') return <Tag tone="red">系统错误</Tag>;
  return <Tag tone="red">{verdict}</Tag>;
}

function SamplesPanel({
  samples,
  onUseSample,
}: {
  samples: TestCasePublic[];
  onUseSample: (input: string) => void;
}) {
  return (
    <div className="sample-list">
      {samples.map((sample, index) => (
        <div className="sample-card" key={sample.id}>
          <div className="sample-card-head">
            <strong>样例 {index + 1}</strong>
            <div className="sample-card-actions">
              <CopyButton text={sample.input} label="复制输入" />
              <button type="button" className="text-btn" onClick={() => onUseSample(sample.input)}>
                填入输入
              </button>
            </div>
          </div>
          <div className="sample-columns">
            <div>
              <span className="io-label">输入</span>
              <pre>{sample.input || '（空）'}</pre>
            </div>
            <div>
              <span className="io-label">输出</span>
              <pre>{sample.output || '（空）'}</pre>
            </div>
          </div>
          {sample.explanation ? <p className="sample-explain">{sample.explanation}</p> : null}
        </div>
      ))}
    </div>
  );
}

function DebugPanel({ result }: { result: DebugTrace | DebugRun | null }) {
  const [step, setStep] = useState(0);
  if (!result) {
    return (
      <EmptyBlock
        title="调试面板"
        description="点击“调试”查看执行轨迹。Python 使用逐行追踪；C++ 通过 GDB 采集源码行与局部变量。"
      />
    );
  }
  if (result.kind === 'run') {
    return (
      <div className="debug-panel">
        <div className="debug-note">
          <Icon name="info" size={16} />
          <p>{result.message}</p>
        </div>
        {result.result.compileOutput ? (
          <OutputBlock title="编译诊断" text={result.result.compileOutput} tone="warn" />
        ) : null}
        {result.result.stdout ? <OutputBlock title="标准输出" text={result.result.stdout} /> : null}
        {result.result.stderr ? (
          <OutputBlock title="运行回溯" text={result.result.stderr} tone="danger" />
        ) : null}
        <div className="result-summary">
          <RunVerdict verdict={result.result.verdict} />
          <span>{result.result.timeMs} ms</span>
        </div>
      </div>
    );
  }
  if (result.timedOut) {
    return (
      <EmptyBlock
        title="执行超时"
        description="没有采集到完整轨迹。检查循环终止条件，或减少输入规模。"
      />
    );
  }
  if (result.steps.length === 0) {
    return (
      <div className="debug-panel">
        {result.error ? <OutputBlock title="运行错误" text={result.error} tone="danger" /> : null}
        <EmptyBlock title="没有执行轨迹" description="程序可能没有进入主文件，或很快结束。" />
      </div>
    );
  }
  const current = result.steps[Math.min(step, result.steps.length - 1)];
  return (
    <div className="debug-panel">
      <div className="debug-controls">
        <button
          type="button"
          className="text-btn"
          onClick={() => setStep(0)}
          disabled={step === 0}
        >
          回到开头
        </button>
        <button
          type="button"
          className="text-btn"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={step === 0}
        >
          上一步
        </button>
        <input
          type="range"
          min={0}
          max={Math.max(0, result.steps.length - 1)}
          value={step}
          onChange={(event) => setStep(Number(event.target.value))}
          aria-label="执行步骤"
        />
        <button
          type="button"
          className="text-btn"
          onClick={() => setStep((value) => Math.min(result.steps.length - 1, value + 1))}
          disabled={step >= result.steps.length - 1}
        >
          下一步
        </button>
        <Tag tone="blue">
          {step + 1}/{result.steps.length}
        </Tag>
      </div>
      <div className="debug-grid">
        <div>
          <span className="io-label">当前行</span>
          <div className="debug-line">第 {current.line} 行</div>
          {step === 0 ? (
            <p className="debug-hint">进入函数时的局部变量可能尚未初始化，点击“下一步”查看赋值后的值。</p>
          ) : null}
          <span className="io-label">局部变量</span>
          <pre className="debug-locals">
            {Object.entries(current.locals).length === 0
              ? '（暂无局部变量）'
              : Object.entries(current.locals)
                  .map(([key, value]) => `${key} = ${value}`)
                  .join('\n')}
          </pre>
        </div>
        <div>
          <span className="io-label">标准输出</span>
          <pre className="debug-stdout">{result.stdout || '（空）'}</pre>
          {result.error ? <OutputBlock title="运行错误" text={result.error} tone="danger" /> : null}
        </div>
      </div>
    </div>
  );
}

function ReviewPanel({
  review,
  loading,
  error,
  onRetry,
  aiConfigured,
  similar,
}: {
  review: AiReview | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  aiConfigured: boolean;
  similar: ProblemSummary[];
}) {
  if (loading) {
    return (
      <div className="review-loading">
        <span className="spinner spinner-dark" />
        <div>
          <strong>正在复盘你的代码…</strong>
          <p className="muted">读取判题结果、失败用例和提交历史。</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="review-error">
        <Icon name="info" size={18} />
        <p>{error}</p>
        <Button variant="secondary" size="sm" icon="refresh" onClick={onRetry}>
          重试
        </Button>
      </div>
    );
  }
  if (!review) {
    return (
      <EmptyBlock
        title="提交后生成 AI 复盘"
        description={
          aiConfigured
            ? 'AI 会从正确性、边界、复杂度和调试过程给出建议。'
            : '当前未配置 AI Key，将使用本地规则生成复盘。'
        }
      />
    );
  }
  return (
    <div className={`review-panel ${review.passed ? 'is-passed' : 'is-failed'}`}>
      <div className="review-header">
        <div>
          <span className="eyebrow">{review.passed ? 'PASSED' : 'KEEP GOING'}</span>
          <h3>{review.headline}</h3>
        </div>
        <Tag tone={review.passed ? 'green' : 'amber'}>
          {review.passed ? '判题通过' : '判题未通过'}
        </Tag>
      </div>
      {review.degraded ? (
        <div className="review-degraded">
          本地规则复盘：未配置 AI Key，建议基于判题结果和代码结构生成。
        </div>
      ) : null}
      <div className="review-grid">
        <ReviewList title="做得好的地方" items={review.strengths} tone="green" />
        <ReviewList title="需要检查" items={review.issues} tone="amber" />
        <ReviewList title="下一步建议" items={review.suggestions} tone="blue" />
      </div>
      <div className="review-meta">
        <div>
          <span className="io-label">复杂度提示</span>
          <p>{review.complexity}</p>
        </div>
        <div>
          <span className="io-label">过程观察</span>
          <p>{review.processNote}</p>
        </div>
      </div>
      {review.similarProblemIds.length > 0 ? (
        <div className="review-similar">
          <span className="io-label">类似题再练</span>
          <div className="similar-links">
            {review.similarProblemIds.map((id) => {
              const target = similar.find((item) => item.id === id);
              return (
                <Link key={id} to={`/problems/${id}`} className="similar-link">
                  {target?.title ?? id} <Icon name="arrow" size={13} />
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ReviewList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'green' | 'amber' | 'blue';
}) {
  return (
    <div className={`review-list tone-${tone}`}>
      <h4>{title}</h4>
      {items.length === 0 ? (
        <p className="muted">暂无</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SubmitPanel({ result }: { result: SubmissionResult | null }) {
  if (!result) {
    return (
      <EmptyBlock
        title="还没有提交"
        description="提交会运行样例和隐藏用例，并记录本次结果。"
      />
    );
  }
  const verdict = result.verdict as Verdict;
  return (
    <div className="submit-panel">
      <div className="submit-summary">
        <div className={`big-verdict ${result.verdict === 'AC' ? 'is-ac' : ''}`}>
          {VERDICT_LABELS[verdict] ?? result.verdict}
        </div>
        <div className="submit-stats">
          <span>
            通过 <strong>{result.passed}</strong> / {result.total}
          </span>
          <span>{result.timeMs} ms</span>
          <span>提交 #{result.submissionId}</span>
        </div>
        <VerdictBadge verdict={verdict} />
      </div>
      {result.compileOutput ? (
        <OutputBlock title="编译输出" text={result.compileOutput} tone="warn" />
      ) : null}
      <div className="case-list">
        {result.cases.map((testCase, index) => (
          <div className={`case-row case-${testCase.verdict.toLowerCase()}`} key={testCase.id}>
            <span className="case-index">{index + 1}</span>
            <span className="case-name">
              {testCase.hidden ? '隐藏用例' : `样例 ${index + 1}`}
            </span>
            <VerdictBadge verdict={testCase.verdict} />
            <span className="case-time">{testCase.timeMs} ms</span>
            {!testCase.hidden && testCase.verdict !== 'AC' ? (
              <div className="case-detail">
                <div>
                  <span className="io-label">输入</span>
                  <pre>{testCase.input ?? ''}</pre>
                </div>
                <div>
                  <span className="io-label">期望</span>
                  <pre>{testCase.expected ?? ''}</pre>
                </div>
                <div>
                  <span className="io-label">实际</span>
                  <pre>{testCase.actual ?? ''}</pre>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <p className="muted console-empty-note">
        隐藏用例的输入与期望输出不会展示，只显示通过状态和耗时。
      </p>
    </div>
  );
}

function OutputBlock({
  title,
  text,
  tone = 'default',
}: {
  title: string;
  text: string;
  tone?: 'default' | 'warn' | 'danger';
}) {
  return (
    <div className={`output-block output-${tone}`}>
      <div className="output-block-head">
        <span>{title}</span>
        <CopyButton text={text} label="复制" />
      </div>
      <pre>{text}</pre>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="text-btn"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        });
      }}
    >
      <Icon name={copied ? 'check' : 'copy'} size={13} /> {copied ? '已复制' : label}
    </button>
  );
}
