import { useEffect, useRef, useState } from 'react';
import { EditorState, type Extension } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  rectangularSelection,
  crosshairCursor,
} from '@codemirror/view';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentLess,
  indentMore,
} from '@codemirror/commands';
import {
  bracketMatching,
  foldGutter,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
  defaultHighlightStyle,
} from '@codemirror/language';
import {
  autocompletion,
  acceptCompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionStatus,
  type CompletionContext,
  type CompletionResult,
} from '@codemirror/autocomplete';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import type { Language } from '@codelab/shared';
import { api } from '../lib/api';
import { editorHighlighting, editorTheme } from '../editor/theme';
import { Icon } from '../components/Icon';

export interface EditorSelection {
  text: string;
  from: number;
  to: number;
  context: string;
  coords: { left: number; top: number; bottom: number };
}

interface EditorPaneProps {
  value: string;
  language: Language;
  problemId: string;
  onChange: (value: string) => void;
  onSelection: (selection: EditorSelection | null) => void;
  onRun: () => void;
  onSubmit: () => void;
  aiEnabled: boolean;
}

export function EditorPane({
  value,
  language,
  problemId,
  onChange,
  onSelection,
  onRun,
  onSubmit,
  aiEnabled,
}: EditorPaneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onSelectionRef = useRef(onSelection);
  const onRunRef = useRef(onRun);
  const onSubmitRef = useRef(onSubmit);
  const lastExternalValue = useRef(value);
  const [cursor, setCursor] = useState({ line: 1, column: 1 });
  const [fontSize, setFontSize] = useState(() => {
    const stored = window.localStorage.getItem('codelab-editor-font');
    return stored ? Number(stored) : 14;
  });

  onChangeRef.current = onChange;
  onSelectionRef.current = onSelection;
  onRunRef.current = onRun;
  onSubmitRef.current = onSubmit;

  useEffect(() => {
    if (!hostRef.current) return;
    const languageExtension = language === 'cpp' ? cpp() : python();
    const completionSource = createCompletionSource(language, problemId, aiEnabled);
    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      indentUnit.of('    '),
      bracketMatching(),
      closeBrackets(),
      autocompletion({
        override: [completionSource],
        activateOnTyping: true,
        closeOnBlur: false,
        maxRenderedOptions: 10,
        icons: false,
      }),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([...searchKeymap, ...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
      keymap.of([
        {
          key: 'Tab',
          run: (view) => {
            if (completionStatus(view.state) === 'active') return acceptCompletion(view);
            return indentMore(view);
          },
        },
        { key: 'Shift-Tab', run: indentLess },
        {
          key: 'Mod-Enter',
          run: () => {
            onRunRef.current();
            return true;
          },
        },
        {
          key: 'Mod-Shift-Enter',
          run: () => {
            onSubmitRef.current();
            return true;
          },
        },
      ]),
      languageExtension,
      editorTheme,
      editorHighlighting,
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const next = update.state.doc.toString();
          lastExternalValue.current = next;
          onChangeRef.current(next);
        }
        if (update.selectionSet || update.docChanged) {
          const head = update.state.selection.main.head;
          const line = update.state.doc.lineAt(head);
          setCursor({ line: line.number, column: head - line.from + 1 });
        }
      }),
      EditorView.contentAttributes.of({
        'aria-label': '代码编辑器',
        spellcheck: 'false',
        autocapitalize: 'off',
      }),
    ];

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions,
      }),
      parent: hostRef.current,
    });
    viewRef.current = view;

    let selectionTimer: number | null = null;
    const emitSelection = () => {
      if (selectionTimer) window.clearTimeout(selectionTimer);
      selectionTimer = window.setTimeout(() => {
        const current = viewRef.current;
        if (!current) return;
        const selection = current.state.selection.main;
        if (selection.empty) {
          onSelectionRef.current(null);
          return;
        }
        const text = current.state.sliceDoc(selection.from, selection.to);
        if (!text.trim()) {
          onSelectionRef.current(null);
          return;
        }
        const coords = current.coordsAtPos(selection.from);
        if (!coords) return;
        const startLine = current.state.doc.lineAt(selection.from).number;
        const endLine = current.state.doc.lineAt(selection.to).number;
        const contextStart = current.state.doc.line(Math.max(1, startLine - 8)).from;
        const contextEnd = current.state.doc.line(
          Math.min(current.state.doc.lines, endLine + 8),
        ).to;
        onSelectionRef.current({
          text,
          from: selection.from,
          to: selection.to,
          context: current.state.sliceDoc(contextStart, contextEnd),
          coords: { left: coords.left, top: coords.top, bottom: coords.bottom },
        });
      }, 220);
    };
    const onMouseUp = () => emitSelection();
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.shiftKey || event.key === 'Shift') emitSelection();
    };
    view.dom.addEventListener('mouseup', onMouseUp);
    view.dom.addEventListener('keyup', onKeyUp);

    return () => {
      if (selectionTimer) window.clearTimeout(selectionTimer);
      view.dom.removeEventListener('mouseup', onMouseUp);
      view.dom.removeEventListener('keyup', onKeyUp);
      view.destroy();
      viewRef.current = null;
    };
    // The editor is intentionally recreated when language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, problemId, aiEnabled]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    if (value !== lastExternalValue.current) {
      lastExternalValue.current = value;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  }, [value]);

  useEffect(() => {
    window.localStorage.setItem('codelab-editor-font', String(fontSize));
  }, [fontSize]);

  return (
    <div
      className="editor-pane"
      style={{ ['--editor-font-size' as string]: `${fontSize}px` }}
    >
      <div className="editor-surface" ref={hostRef} />
      <div className="editor-statusbar">
        <div className="editor-status-left">
          <span>{language === 'cpp' ? 'C++17' : 'Python 3'}</span>
          <span>
            Ln {cursor.line}, Col {cursor.column}
          </span>
          <span>UTF-8</span>
        </div>
        <div className="editor-status-right">
          <span className={`ai-inline ${aiEnabled ? 'on' : 'off'}`}>
            <Icon name="sparkles" size={12} />
            {aiEnabled ? 'AI 补全：Tab 接受' : 'AI 补全已关闭'}
          </span>
          <div className="font-control" aria-label="编辑器字号">
            <button type="button" onClick={() => setFontSize((size) => Math.max(11, size - 1))}>
              A-
            </button>
            <span>{fontSize}</span>
            <button type="button" onClick={() => setFontSize((size) => Math.min(22, size + 1))}>
              A+
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function createCompletionSource(
  language: Language,
  problemId: string,
  aiEnabled: boolean,
) {
  return async (context: CompletionContext): Promise<CompletionResult | null> => {
    const word = context.matchBefore(/[A-Za-z_][A-Za-z0-9_:]*/);
    if (!context.explicit && (!word || word.from === word.to) && !word?.text) return null;
    if (!word && !context.explicit) return null;
    const from = word?.from ?? context.pos;
    const prefix = word?.text ?? '';
    if (context.aborted) return null;
    await new Promise((resolve) => setTimeout(resolve, context.explicit ? 0 : 240));
    if (context.aborted) return null;
    try {
      const result = await api.aiComplete({
        problemId,
        language,
        code: context.state.doc.toString(),
        cursor: context.pos,
        prefix,
      });
      if (result.items.length === 0) return null;
      return {
        from,
        options: result.items.map((item) => ({
          label: item.label,
          apply: item.insertText,
          detail: item.detail,
          info: item.documentation,
          type: item.source === 'ai' ? 'ai' : item.kind === 'snippet' ? 'snippet' : 'variable',
          boost: item.source === 'ai' ? 5 : 0,
          section: item.source === 'ai' ? 'AI 建议' : '本地建议',
        })),
        validFor: /^[A-Za-z_][A-Za-z0-9_:]*$/,
      };
    } catch {
      return null;
    }
  };
}
