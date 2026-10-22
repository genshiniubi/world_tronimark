import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  AiReview,
  FileMap,
  Language,
  ProblemDetail,
  SubmissionResult,
  Verdict,
} from '@codelab/shared';
import { DIFFICULTY_LABELS, LANGUAGE_LABELS, VERDICT_LABELS } from '@codelab/shared';
import { api, formatDate } from '../../lib/api';
import { useSite } from '../../lib/site-context';
import { Icon } from '../../components/Icon';
import { Markdown } from '../../components/Markdown';
import {
  Button,
  DifficultyBadge,
  ErrorBlock,
  LinkButton,
  LoadingBlock,
  StatusDot,
  Tag,
  VerdictBadge,
} from '../../components/ui';
import { EditorPane, type EditorSelection } from '../../editor/EditorPane';
import { FileTree } from './FileTree';
import {
  ConsolePane,
  type ConsoleTab,
  type DebugRun,
  type DebugTrace,
  type RunDisplay,
} from './ConsolePane';
import { SelectionCard } from './SelectionCard';
import { NotesDrawer } from './NotesDrawer';

type ProblemTab = 'statement' | 'hints' | 'attempts' | 'solution';
type MobileView = 'problem' | 'code' | 'console';

function draftKey(problemId: string, language: Language): string {
  return `codelab:draft:${problemId}:${language}`;
}

function readDraft(problemId: string, language: Language, starter: FileMap | undefined): FileMap {
  try {
    const raw = window.localStorage.getItem(draftKey(problemId, language));
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const files = parsed as FileMap;
        if (Object.values(files).every((value) => typeof value === 'string')) return files;
      }
    }
  } catch {
    // fall through to starter
  }
  return { ...(starter ?? {}) };
}

export function WorkspacePage() {
  const { problemId = '' } = useParams();
  const site = useSite();
  const queryClient = useQueryClient();
  const problemQuery = useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => api.problem(problemId),
  });
  const [language, setLanguage] = useState<Language>('cpp');
  const [files, setFiles] = useState<FileMap>({});
  const [activeFile, setActiveFile] = useState('');
  const [initialized, setInitialized] = useState<string | null>(null);
  const [problemTab, setProblemTab] = useState<ProblemTab>('statement');
  const [hintCount, setHintCount] = useState(0);
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>('run');
  const [runResult, setRunResult] = useState<RunDisplay | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmissionResult | null>(null);
  const [debugResult, setDebugResult] = useState<DebugTrace | DebugRun | null>(null);
  const [review, setReview] = useState<AiReview | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [debugging, setDebugging] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [selection, setSelection] = useState<EditorSelection | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>('problem');
  const [split, setSplit] = useState(42);
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(
    () => window.localStorage.getItem('codelab-ai-enabled') !== 'false',
  );
  const splitRef = useRef<HTMLDivElement | null>(null);
  const lastReviewSubmission = useRef<number | null>(null);

  const data = problemQuery.data;

  useEffect(() => {
    setSelection(null);
    setRunResult(null);
    setSubmitResult(null);
    setDebugResult(null);
    setReview(null);
    setReviewError(null);
    setProblemTab('statement');
    setHintCount(0);
    setConsoleTab('run');
    setMobileView('problem');
  }, [problemId]);

  useEffect(() => {
    if (!data || initialized === data.id) return;
    const initialLanguage =
      data.languages.find((item) => item === 'cpp') ?? data.languages[0] ?? 'cpp';
    const initialFiles = readDraft(
      data.id,
      initialLanguage,
      data.starterFiles[initialLanguage],
    );
    const entry = data.entryFiles[initialLanguage] ?? Object.keys(initialFiles)[0] ?? '';
    setLanguage(initialLanguage);
    setFiles(initialFiles);
    setActiveFile(entry);
    setCustomInput(data.samples[0]?.input ?? '');
    setInitialized(data.id);
  }, [data, initialized]);

  useEffect(() => {
    if (!data || initialized !== data.id) return;
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(draftKey(data.id, language), JSON.stringify(files));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [files, language, data, initialized]);

  useEffect(() => {
    window.localStorage.setItem('codelab-ai-enabled', String(aiEnabled));
  }, [aiEnabled]);

  useEffect(() => {
    if (!actionError) return;
    const timer = window.setTimeout(() => setActionError(null), 5000);
    return () => window.clearTimeout(timer);
  }, [actionError]);

  const entryFile = data?.entryFiles[language] ?? '';
  const activeContent = files[activeFile] ?? '';

  const updateFile = (path: string, value: string) => {
    setFiles((current) => ({ ...current, [path]: value }));
  };

  const createFile = (path: string) => {
    const clean = path.replace(/^\/+/, '').trim();
    if (!clean) return;
    if (files[clean] !== undefined) {
      setActionError('同名文件已存在');
      return;
    }
    const suffix = language === 'cpp' ? 'cpp' : 'py';
    const finalPath = clean.includes('.') ? clean : `${clean}.${suffix}`;
    const comment = language === 'cpp' ? `// ${finalPath}\n` : `# ${finalPath}\n`;
    setFiles((current) => ({ ...current, [finalPath]: comment }));
    setActiveFile(finalPath);
    setMobileView('code');
  };

  const deleteFile = (path: string) => {
    if (path === entryFile) {
      setActionError('入口文件不能删除');
      return;
    }
    if (!window.confirm(`删除文件 ${path}？`)) return;
    setFiles((current) => {
      const next = { ...current };
      delete next[path];
      return next;
    });
    if (activeFile === path) setActiveFile(entryFile);
  };

  const resetCode = () => {
    if (!data) return;
    if (!window.confirm('恢复为初始代码？当前草稿会被覆盖。')) return;
    const starter = { ...(data.starterFiles[language] ?? {}) };
    setFiles(starter);
    setActiveFile(data.entryFiles[language] ?? Object.keys(starter)[0] ?? '');
    setActionError(null);
  };

  const switchLanguage = (next: Language) => {
    if (!data || next === language) return;
    window.localStorage.setItem(draftKey(data.id, language), JSON.stringify(files));
    const nextFiles = readDraft(data.id, next, data.starterFiles[next]);
    setLanguage(next);
    setFiles(nextFiles);
    setActiveFile(data.entryFiles[next] ?? Object.keys(nextFiles)[0] ?? '');
    setSelection(null);
    setRunResult(null);
    setSubmitResult(null);
    setDebugResult(null);
    setReview(null);
    setCustomInput(data.samples[0]?.input ?? '');
    setMobileView('code');
  };

  const checkEntry = (): boolean => {
    if (!files[entryFile]) {
      setActionError(`入口文件 ${entryFile || '（未设置）'} 不存在，请恢复代码或重新创建。`);
      return false;
    }
    return true;
  };

  const handleRun = async () => {
    if (!data || running || submitting || debugging || !checkEntry()) return;
    setRunning(true);
    setConsoleTab('run');
    setMobileView('console');
    setActionError(null);
    try {
      const result = await api.run({
        problemId: data.id,
        language,
        files,
        stdin: customInput,
      });
      setRunResult(result as RunDisplay);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '运行失败');
    } finally {
      setRunning(false);
    }
  };

  const loadReview = async (submissionId: number) => {
    if (!data) return;
    lastReviewSubmission.current = submissionId;
    setReviewLoading(true);
    setReviewError(null);
    try {
      const result = await api.aiReview({
        problemId: data.id,
        language,
        files,
        submissionId,
      });
      setReview(result);
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : 'AI 复盘失败');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!data || running || submitting || debugging || !checkEntry()) return;
    setSubmitting(true);
    setConsoleTab('submit');
    setMobileView('console');
    setActionError(null);
    setReview(null);
    setReviewError(null);
    try {
      const result = await api.submit({
        problemId: data.id,
        language,
        files,
      });
      setSubmitResult(result);
      void queryClient.invalidateQueries({ queryKey: ['problem', data.id] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['problems'] });
      void queryClient.invalidateQueries({ queryKey: ['track', data.trackId] });
      void loadReview(result.submissionId);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDebug = async () => {
    if (!data || debugging || running || submitting || !checkEntry()) return;
    setDebugging(true);
    setConsoleTab('debug');
    setMobileView('console');
    setActionError(null);
    setDebugResult(null);
    try {
      const result = await api.debug({
        problemId: data.id,
        language,
        files,
        stdin: customInput || data.samples[0]?.input || '',
      });
      if (result.kind === 'trace') {
        setDebugResult(result);
      } else {
        setDebugResult({
          kind: 'run',
          message: result.message,
          result: {
            ...result.result,
            exitCode: null,
            timedOut: false,
            outputTruncated: false,
          },
        });
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '调试失败');
    } finally {
      setDebugging(false);
    }
  };

  const onSplitPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const container = splitRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const move = (moveEvent: PointerEvent) => {
      const percent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      setSplit(Math.min(68, Math.max(28, percent)));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (notesOpen) return;
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (event.shiftKey) void handleSubmit();
        else void handleRun();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (notesOpen) return;
      }
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, language, customInput, notesOpen, running, submitting]);

  if (problemQuery.isLoading) return <LoadingBlock label="正在打开题目…" />;
  if (problemQuery.isError || !data) {
    return (
      <ErrorBlock
        message={problemQuery.error instanceof Error ? problemQuery.error.message : '题目不存在'}
        onRetry={() => void problemQuery.refetch()}
      />
    );
  }

  const splitStyle = { '--split': `${split}%` } as CSSProperties;
  const languageOptions = data.languages;
  const hasUnsavedDraft = JSON.stringify(files) !== JSON.stringify(data.starterFiles[language] ?? {});

  return (
    <div className={`workspace-page mobile-${mobileView}`}>
      <div className="workspace-topbar">
        <div className="workspace-breadcrumb">
          <Link to={`/tracks/${data.trackId}`} className="back-link">
            <Icon name="arrowLeft" size={15} />
            {data.trackTitle}
          </Link>
          <span className="crumb-divider">/</span>
          <span>{data.moduleTitle}</span>
        </div>
        <div className="workspace-title-row">
          <div className="workspace-title-main">
            <h1>{data.title}</h1>
            <DifficultyBadge difficulty={data.difficulty} />
            <StatusDot status={data.status} />
            {data.status === 'solved' ? <Tag tone="green">已通过</Tag> : null}
            {data.acceptanceRate !== null ? (
              <span className="muted">通过率 {data.acceptanceRate}%</span>
            ) : null}
          </div>
          <div className="workspace-top-actions">
            <button
              type="button"
              className={`ai-toggle ${aiEnabled ? 'is-on' : ''}`}
              onClick={() => setAiEnabled((value) => !value)}
              title={aiEnabled ? '关闭 AI 补全' : '开启 AI 补全'}
            >
              <Icon name="sparkles" size={14} />
              AI
            </button>
            <Button
              variant="secondary"
              size="sm"
              icon="refresh"
              onClick={resetCode}
              title="恢复初始代码"
            >
              重置
            </Button>
            <LinkButton to="/problems" variant="ghost" size="sm" icon="arrowLeft">
              题库
            </LinkButton>
          </div>
        </div>
      </div>

      <div className="mobile-workspace-tabs" role="tablist" aria-label="工作台视图">
        {(
          [
            ['problem', '题目'],
            ['code', '代码'],
            ['console', '运行'],
          ] as Array<[MobileView, string]>
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={mobileView === id ? 'is-active' : ''}
            onClick={() => setMobileView(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {actionError ? (
        <div className="action-error" role="alert">
          <Icon name="info" size={16} />
          <span>{actionError}</span>
          <button type="button" className="icon-btn small" onClick={() => setActionError(null)}>
            <Icon name="x" size={14} />
          </button>
        </div>
      ) : null}

      {language === 'cpp' && site.health.cpp.executionBlocked ? (
        <div className="platform-warning" role="status">
          <Icon name="info" size={16} />
          <span>
            C++ 本地运行受限：{site.health.cpp.executionNote} Python 判题不受影响；C++ 题面、编辑器和题解仍可正常使用。
          </span>
        </div>
      ) : null}

      <div className="workspace-split" ref={splitRef} style={splitStyle}>
        <section className="problem-pane">
          <div className="problem-pane-head">
            <div className="problem-pane-tabs" role="tablist" aria-label="题目视图">
              {(
                [
                  ['statement', '题目'],
                  ['hints', '提示'],
                  ['attempts', '提交'],
                  ...(data.canViewSolution ? [['solution', '题解'] as [ProblemTab, string]] : []),
                ] as Array<[ProblemTab, string]>
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={problemTab === id}
                  className={problemTab === id ? 'is-active' : ''}
                  onClick={() => setProblemTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="icon-btn small"
              onClick={() => setNotesOpen(true)}
              title="打开笔记"
              aria-label="打开笔记"
            >
              <Icon name="note" size={16} />
            </button>
          </div>
          <div className="problem-scroll">
            {problemTab === 'statement' ? (
              <>
                <div className="problem-meta-row">
                  <Tag tone="blue">{data.scenarioLabel}</Tag>
                  {data.knowledgeTitles.map((title) => (
                    <Tag key={title}>{title}</Tag>
                  ))}
                  <span className="muted">
                    <Icon name="clock" size={13} /> 约 {data.estimatedMinutes} 分钟
                  </span>
                </div>
                <Markdown>{data.statement}</Markdown>
                <div className="problem-side-note">
                  <Icon name="sparkles" size={16} />
                  <span>选中代码中的任意片段，可以查看四段式解释并向 AI 追问。</span>
                </div>
              </>
            ) : null}
            {problemTab === 'hints' ? (
              <div className="hints-panel">
                <div className="mini-heading">
                  <Icon name="book" size={16} /> 渐进提示
                </div>
                {data.hints.length === 0 ? (
                  <p className="muted">这道题没有额外提示，先尝试从样例和约束推导。</p>
                ) : (
                  <>
                    {data.hints.slice(0, hintCount).map((hint, index) => (
                      <div className="hint-card" key={hint}>
                        <span>提示 {index + 1}</span>
                        <p>{hint}</p>
                      </div>
                    ))}
                    {hintCount < data.hints.length ? (
                      <Button
                        variant="soft"
                        size="sm"
                        icon="plus"
                        onClick={() => setHintCount((count) => count + 1)}
                      >
                        展开下一条提示
                      </Button>
                    ) : null}
                    {hintCount === 0 ? (
                      <p className="muted">
                        提示会逐步展开，建议先自己运行一次样例，再来看提示。
                      </p>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}
            {problemTab === 'attempts' ? (
              <div className="attempts-panel">
                <div className="mini-heading">
                  <Icon name="terminal" size={16} /> 提交记录
                </div>
                {data.attempts.length === 0 ? (
                  <p className="muted">还没有提交记录。提交后会显示判题结果、通过用例数和时间。</p>
                ) : (
                  data.attempts.map((attempt) => (
                    <div className="attempt-row" key={attempt.id}>
                      <VerdictBadge verdict={attempt.verdict as Verdict} />
                      <span>
                        {attempt.passed}/{attempt.total}
                      </span>
                      <span>{attempt.timeMs} ms</span>
                      <span>{LANGUAGE_LABELS[attempt.language]}</span>
                      <span className="muted">{formatDate(attempt.createdAt)}</span>
                    </div>
                  ))
                )}
              </div>
            ) : null}
            {problemTab === 'solution' && data.solution ? (
              <div className="solution-panel">
                <div className="solution-badge">
                  <Icon name="check" size={15} /> 已通过，题解已解锁
                </div>
                <Markdown>{data.solution}</Markdown>
              </div>
            ) : null}
          </div>
          <div className="problem-pane-foot">
            <span>
              {data.languages.map((item) => LANGUAGE_LABELS[item]).join(' / ')} ·{' '}
              {DIFFICULTY_LABELS[data.difficulty]}
            </span>
            <Link to="/notes" className="text-link">
              全部笔记 <Icon name="arrow" size={13} />
            </Link>
          </div>
        </section>

        <div
          className="split-handle"
          role="separator"
          aria-label="调整题目和代码区域宽度"
          aria-orientation="vertical"
          onPointerDown={onSplitPointerDown}
        >
          <span />
        </div>

        <section className="code-pane">
          <div className="code-toolbar">
            <div className="code-toolbar-left">
              {languageOptions.length > 1 ? (
                <select
                  className="language-select"
                  value={language}
                  onChange={(event) => switchLanguage(event.target.value as Language)}
                  aria-label="切换语言"
                >
                  {languageOptions.map((item) => (
                    <option key={item} value={item}>
                      {LANGUAGE_LABELS[item]}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="language-chip">{LANGUAGE_LABELS[language]}</span>
              )}
              <span className={`draft-indicator ${hasUnsavedDraft ? 'is-dirty' : ''}`}>
                {hasUnsavedDraft ? '草稿已保存到本地' : '初始代码'}
              </span>
            </div>
            <div className="code-actions">
              <Button
                variant="secondary"
                size="sm"
                icon="play"
                loading={running}
                onClick={() => void handleRun()}
                title="运行 (Ctrl+Enter)"
              >
                运行
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon="send"
                loading={submitting}
                onClick={() => void handleSubmit()}
                title="提交 (Ctrl+Shift+Enter)"
              >
                提交
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon="bug"
                loading={debugging}
                onClick={() => void handleDebug()}
              >
                调试
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="note"
                onClick={() => setNotesOpen(true)}
              >
                笔记
              </Button>
            </div>
          </div>

          <div className="code-main">
            <aside className="file-sidebar">
              <FileTree
                files={files}
                activeFile={activeFile}
                entryFile={entryFile}
                language={language}
                onSelect={(path) => {
                  setActiveFile(path);
                  setMobileView('code');
                }}
                onCreate={createFile}
                onDelete={deleteFile}
              />
              <div className="file-sidebar-foot">
                <span>入口</span>
                <code>{entryFile}</code>
              </div>
            </aside>
            <div className="editor-column">
              <div className="file-tabs">
                {Object.keys(files).map((path) => (
                  <button
                    key={path}
                    type="button"
                    className={`file-tab ${activeFile === path ? 'is-active' : ''}`}
                    onClick={() => setActiveFile(path)}
                    title={path}
                  >
                    <Icon name="file" size={13} />
                    <span>{path.split('/').pop()}</span>
                    {path === entryFile ? <span className="tab-entry">入口</span> : null}
                  </button>
                ))}
              </div>
              {activeContent !== undefined ? (
                <EditorPane
                  key={`${language}-${data.id}`}
                  value={activeContent}
                  language={language}
                  problemId={data.id}
                  onChange={(value) => updateFile(activeFile, value)}
                  onSelection={(next) => {
                    setSelection(next);
                    if (next) setMobileView('code');
                  }}
                  onRun={() => void handleRun()}
                  onSubmit={() => void handleSubmit()}
                  aiEnabled={aiEnabled}
                />
              ) : (
                <div className="editor-empty">
                  <p>请选择或新建一个代码文件。</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="plus"
                    onClick={() => createFile(language === 'cpp' ? 'src/helper.cpp' : 'src/helper.py')}
                  >
                    新建文件
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className={`console-wrap ${consoleCollapsed ? 'is-collapsed' : ''}`}>
            <button
              type="button"
              className="console-collapse"
              onClick={() => setConsoleCollapsed((value) => !value)}
              aria-label={consoleCollapsed ? '展开控制台' : '收起控制台'}
            >
              <Icon name={consoleCollapsed ? 'chevronDown' : 'chevron'} size={15} />
            </button>
            {!consoleCollapsed ? (
              <ConsolePane
                tab={consoleTab}
                onTabChange={setConsoleTab}
                runResult={runResult}
                submitResult={submitResult}
                debugResult={debugResult}
                review={review}
                reviewLoading={reviewLoading}
                reviewError={reviewError}
                samples={data.samples}
                customInput={customInput}
                onCustomInput={setCustomInput}
                onUseSample={(input) => {
                  setCustomInput(input);
                  setConsoleTab('run');
                }}
                onReviewRetry={() => {
                  if (lastReviewSubmission.current) {
                    void loadReview(lastReviewSubmission.current);
                  }
                }}
                aiConfigured={site.ai.configured}
                running={running || debugging}
                submitting={submitting}
                similar={data.similar}
              />
            ) : null}
          </div>
        </section>
      </div>

      {selection ? (
        <SelectionCard
          selection={selection}
          language={language}
          problemId={data.id}
          onClose={() => setSelection(null)}
        />
      ) : null}

      <NotesDrawer
        problemId={data.id}
        problemTitle={data.title}
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
      />
    </div>
  );
}
