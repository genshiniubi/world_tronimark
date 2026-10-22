import { useEffect, useRef, useState } from 'react';
import type { Note } from '@codelab/shared';
import { api } from '../../lib/api';
import { Icon } from '../../components/Icon';
import { Markdown } from '../../components/Markdown';
import { Button, LoadingBlock } from '../../components/ui';

export function NotesDrawer({
  problemId,
  problemTitle,
  open,
  onClose,
}: {
  problemId: string;
  problemTitle: string;
  open: boolean;
  onClose: () => void;
}) {
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const noteId = useRef<number | null>(null);
  const dirty = useRef(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .notes(problemId)
      .then((notes) => {
        const existing = notes.find((item) => item.problemId === problemId) ?? notes[0] ?? null;
        setNote(existing);
        noteId.current = existing?.id ?? null;
        setContent(existing?.content ?? '');
        dirty.current = false;
      })
      .finally(() => setLoading(false));
  }, [open, problemId]);

  useEffect(() => {
    if (!open || !dirty.current) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void save();
    }, 900);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, open]);

  const save = async () => {
    if (!dirty.current) return;
    setSaving(true);
    try {
      if (noteId.current) {
        const updated = await api.updateNote(noteId.current, {
          title: `${problemTitle} · 学习笔记`,
          content,
        });
        setNote(updated);
      } else {
        const created = await api.createNote({
          problemId,
          title: `${problemTitle} · 学习笔记`,
          content,
        });
        setNote(created);
        noteId.current = created.id;
      }
      dirty.current = false;
      setSavedAt(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Keep the draft on screen; the next edit retries.
    } finally {
      setSaving(false);
    }
  };

  const close = () => {
    void save();
    onClose();
  };

  const remove = async () => {
    if (!noteId.current) return;
    if (!window.confirm('删除这条笔记？删除后无法恢复。')) return;
    await api.deleteNote(noteId.current);
    noteId.current = null;
    setNote(null);
    setContent('');
    setSavedAt(null);
  };

  if (!open) return null;

  return (
    <div className="notes-drawer" role="dialog" aria-label="学习笔记">
      <div className="notes-head">
        <div>
          <span className="eyebrow">NOTES</span>
          <h3>学习笔记</h3>
        </div>
        <div className="notes-head-actions">
          <button type="button" className="icon-btn small" onClick={remove} aria-label="删除笔记">
            <Icon name="trash" size={15} />
          </button>
          <button type="button" className="icon-btn small" onClick={close} aria-label="关闭笔记">
            <Icon name="x" size={16} />
          </button>
        </div>
      </div>
      <div className="notes-tabs">
        <button
          type="button"
          className={mode === 'edit' ? 'is-active' : ''}
          onClick={() => setMode('edit')}
        >
          编辑
        </button>
        <button
          type="button"
          className={mode === 'preview' ? 'is-active' : ''}
          onClick={() => setMode('preview')}
        >
          预览
        </button>
        <span className="notes-save-state">
          {saving ? '保存中…' : savedAt ? `已保存 ${savedAt}` : note ? '已保存' : '未保存'}
        </span>
      </div>
      {loading ? (
        <LoadingBlock label="读取笔记…" />
      ) : mode === 'edit' ? (
        <textarea
          className="notes-editor"
          value={content}
          onChange={(event) => {
            dirty.current = true;
            setContent(event.target.value);
          }}
          placeholder="记录思路、踩过的坑、复杂度分析，或者下次要尝试的写法…"
          aria-label="笔记内容"
        />
      ) : (
        <div className="notes-preview">
          {content.trim() ? (
            <Markdown>{content}</Markdown>
          ) : (
            <p className="muted">还没有内容。切回编辑，写下这道题的关键思路。</p>
          )}
        </div>
      )}
      <div className="notes-foot">
        <span className="muted">自动保存到你的本地学习档案</span>
        <Button size="sm" variant="secondary" icon="note" onClick={() => void save()}>
          保存
        </Button>
      </div>
    </div>
  );
}
