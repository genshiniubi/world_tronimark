import { useEffect, useState } from 'react';
import type { Note } from '@codelab/shared';
import { api, formatDate } from '../../lib/api';
import { Icon } from '../../components/Icon';
import { Markdown } from '../../components/Markdown';
import {
  Button,
  EmptyBlock,
  ErrorBlock,
  LoadingBlock,
} from '../../components/ui';

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('学习笔记');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.notes();
      setNotes(result);
      if (result.length > 0) {
        const first = result[0];
        setSelectedId(first.id);
        setTitle(first.title);
        setContent(first.content);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '笔记加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const select = (note: Note) => {
    setSelectedId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setMode('edit');
    setSavedAt(null);
  };

  const create = async () => {
    try {
      const note = await api.createNote({
        problemId: null,
        title: '新的学习笔记',
        content: '',
      });
      setNotes((current) => [note, ...current]);
      select(note);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '创建笔记失败');
    }
  };

  const save = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      const updated = await api.updateNote(selectedId, { title, content });
      setNotes((current) => current.map((note) => (note.id === updated.id ? updated : note)));
      setSavedAt(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (note: Note) => {
    if (!window.confirm(`删除笔记「${note.title}」？`)) return;
    await api.deleteNote(note.id);
    const next = notes.filter((item) => item.id !== note.id);
    setNotes(next);
    if (selectedId === note.id) {
      const first = next[0];
      setSelectedId(first?.id ?? null);
      setTitle(first?.title ?? '学习笔记');
      setContent(first?.content ?? '');
    }
  };

  if (loading) return <LoadingBlock label="正在加载笔记…" />;
  if (error) {
    return <ErrorBlock message={error} onRetry={() => void load()} />;
  }

  return (
    <div className="page notes-page">
      <header className="page-head">
        <div>
          <div className="eyebrow">YOUR NOTES</div>
          <h1>学习笔记</h1>
          <p className="page-lead">
            把思路、坑点和复杂度分析写下来。笔记保存在你的本地学习档案里。
          </p>
        </div>
        <Button icon="plus" onClick={() => void create()}>
          新建笔记
        </Button>
      </header>

      {notes.length === 0 ? (
        <EmptyBlock
          title="还没有笔记"
          description="在题目工作台点“笔记”，或在这里新建一条。"
          action={
            <Button icon="plus" onClick={() => void create()}>
              写第一条笔记
            </Button>
          }
        />
      ) : (
        <div className="notes-layout">
          <aside className="notes-list">
            {notes.map((note) => (
              <button
                key={note.id}
                type="button"
                className={`note-list-item ${selectedId === note.id ? 'is-active' : ''}`}
                onClick={() => select(note)}
              >
                <strong>{note.title || '未命名笔记'}</strong>
                <span>{note.content.slice(0, 70) || '空白笔记'}</span>
                <span className="note-list-time">{formatDate(note.updatedAt)}</span>
              </button>
            ))}
          </aside>
          <section className="note-editor-card">
            <div className="note-editor-head">
              <input
                className="note-title-input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-label="笔记标题"
              />
              <div className="note-editor-actions">
                <span className="muted">{saving ? '保存中…' : savedAt ? `已保存 ${savedAt}` : ''}</span>
                <Button size="sm" variant="secondary" icon="check" loading={saving} onClick={() => void save()}>
                  保存
                </Button>
                <button
                  type="button"
                  className="icon-btn small"
                  onClick={() => {
                    const note = notes.find((item) => item.id === selectedId);
                    if (note) void remove(note);
                  }}
                  aria-label="删除笔记"
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </div>
            <div className="note-mode-tabs">
              <button
                type="button"
                className={mode === 'edit' ? 'is-active' : ''}
                onClick={() => setMode('edit')}
              >
                <Icon name="code" size={14} /> 编辑
              </button>
              <button
                type="button"
                className={mode === 'preview' ? 'is-active' : ''}
                onClick={() => setMode('preview')}
              >
                <Icon name="book" size={14} /> 预览
              </button>
            </div>
            {mode === 'edit' ? (
              <textarea
                className="note-large-editor"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="支持 Markdown。写下这道题的关键思路、边界条件和下次要尝试的写法…"
              />
            ) : (
              <div className="note-large-preview">
                <Markdown>{content || '还没有内容。'}</Markdown>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
