import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

export const editorTheme = EditorView.theme(
  {
    '&': {
      color: '#dbe4f0',
      backgroundColor: '#0e1116',
      height: '100%',
      fontSize: 'var(--editor-font-size, 14px)',
    },
    '.cm-scroller': {
      fontFamily:
        '"Cascadia Code", "Cascadia Mono", Consolas, "Courier New", monospace',
      lineHeight: '1.65',
      overflow: 'auto',
    },
    '.cm-content': {
      padding: '14px 0 60px',
      caretColor: '#ffb020',
    },
    '.cm-line': {
      padding: '0 18px 0 10px',
    },
    '.cm-gutters': {
      backgroundColor: '#0b0e12',
      color: '#4d5868',
      border: 'none',
      paddingLeft: '4px',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 10px 0 8px',
      minWidth: '38px',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(255, 176, 32, 0.045)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'rgba(255, 176, 32, 0.07)',
      color: '#ffb020',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      {
        backgroundColor: 'rgba(47, 107, 255, 0.35) !important',
      },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#ffb020',
      borderLeftWidth: '2px',
    },
    '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': {
      backgroundColor: 'rgba(47, 107, 255, 0.25)',
      outline: '1px solid rgba(47, 107, 255, 0.6)',
    },
    '.cm-searchMatch': {
      backgroundColor: 'rgba(255, 176, 32, 0.22)',
      outline: '1px solid rgba(255, 176, 32, 0.45)',
    },
    '.cm-selectionMatch': {
      backgroundColor: 'rgba(31, 157, 99, 0.18)',
    },
    '.cm-foldPlaceholder': {
      backgroundColor: '#1b2330',
      border: '1px solid #2b3648',
      color: '#9aa7b8',
    },
    '.cm-tooltip': {
      border: '1px solid #2b3648',
      backgroundColor: '#141a22',
      color: '#dbe4f0',
      borderRadius: '10px',
      boxShadow: '0 18px 48px rgba(0,0,0,.42)',
      overflow: 'hidden',
    },
    '.cm-tooltip-autocomplete > ul': {
      fontFamily:
        '"Cascadia Code", "Cascadia Mono", Consolas, "Courier New", monospace',
      maxHeight: '260px',
    },
    '.cm-tooltip-autocomplete > ul > li': {
      padding: '6px 10px',
      lineHeight: '1.45',
    },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
      backgroundColor: 'rgba(47, 107, 255, 0.3)',
      color: '#ffffff',
    },
    '.cm-completionIcon': {
      opacity: '0.8',
      paddingRight: '6px',
    },
    '.cm-completionLabel': {
      fontSize: '13px',
    },
    '.cm-completionDetail': {
      color: '#8c9aaf',
      fontSize: '12px',
      fontStyle: 'normal',
      marginLeft: '10px',
    },
    '.cm-completionInfo': {
      padding: '10px 12px',
      maxWidth: '320px',
      fontSize: '12px',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap',
    },
    '.cm-panels': {
      backgroundColor: '#141a22',
      color: '#dbe4f0',
      borderTop: '1px solid #2b3648',
    },
    '.cm-textfield': {
      backgroundColor: '#0e1116',
      border: '1px solid #2b3648',
      color: '#dbe4f0',
      borderRadius: '6px',
      padding: '3px 7px',
    },
    '.cm-button': {
      backgroundImage: 'none',
      backgroundColor: '#263346',
      border: '1px solid #334358',
      color: '#dbe4f0',
      borderRadius: '6px',
    },
  },
  { dark: true },
);

const highlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#7aa2ff', fontWeight: '600' },
  { tag: [tags.string, tags.special(tags.string)], color: '#b7e39b' },
  { tag: [tags.number, tags.bool, tags.null], color: '#ffb86c' },
  { tag: tags.comment, color: '#68768a', fontStyle: 'italic' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: '#ffd479' },
  { tag: [tags.className, tags.typeName, tags.namespace], color: '#7fd1c8' },
  { tag: [tags.operator, tags.punctuation], color: '#93a3b8' },
  { tag: [tags.variableName, tags.propertyName], color: '#dbe4f0' },
  { tag: tags.definition(tags.variableName), color: '#c6d4e6' },
  { tag: tags.self, color: '#ff9ec4' },
  { tag: tags.meta, color: '#8f9db1' },
  { tag: tags.heading, color: '#7aa2ff', fontWeight: '600' },
  { tag: tags.link, color: '#7fd1c8', textDecoration: 'underline' },
  { tag: tags.invalid, color: '#ff6b6b', textDecoration: 'underline' },
]);

export const editorHighlighting = syntaxHighlighting(highlight);
