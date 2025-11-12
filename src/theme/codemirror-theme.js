import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Base theme - Light Pastel Mode
const baseTheme = EditorView.theme({
  '&': {
    color: '#1c1c1c',
    backgroundColor: '#fafafa',
    height: '100%',
  },
  '.cm-content': {
    caretColor: '#1c1c1c',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#1c1c1c',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#f0f0f0',
  },
  '.cm-panels': {
    backgroundColor: '#f9f9f9',
    color: '#1c1c1c',
  },
  '.cm-panels.cm-panels-top': {
    borderBottom: '1px solid #dcdcdc',
  },
  '.cm-searchMatch': {
    backgroundColor: '#fff8dc',
  },
  '.cm-searchMatch.selected': {
    backgroundColor: '#ffeaa7',
  },
  '.cm-activeLine': {
    backgroundColor: '#fce4ec', // very light pink tone
  },
  '.cm-selectionMatch': {
    backgroundColor: '#f8bbd0', // light rose highlight
  },
  '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: '#f8bbd0',
    outline: '1px solid #d81b60',
  },
  '.cm-gutters': {
    backgroundColor: '#f4f4f4',
    color: '#4a4a4a',
    borderRight: '1px solid #dcdcdc',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#fce4ec',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 16px',
  },
  '.cm-foldGutter': {
    width: '14px',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'transparent',
    border: '1px solid #b0b0b0',
    color: '#4a4a4a',
  },
});

// Syntax highlighting - Light Pastel Mode
const highlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#0d47a1' },
  { tag: tags.operator, color: '#212121' },
  { tag: tags.variableName, color: '#1a237e' },
  { tag: tags.string, color: '#b71c1c' },
  { tag: tags.number, color: '#1b5e20' },
  { tag: tags.bool, color: '#0d47a1' },
  { tag: tags.null, color: '#0d47a1' },
  { tag: tags.propertyName, color: '#1a237e' },
  { tag: tags.comment, color: '#33691e', fontStyle: 'italic' },
  { tag: tags.bracket, color: '#ad1457' },
  { tag: tags.tagName, color: '#6a1b9a' },
  { tag: tags.attributeName, color: '#c62828' },
  { tag: tags.attributeValue, color: '#1565c0' },
  { tag: tags.heading, color: '#4a148c', fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: 'bold' },
]);

// Combine everything
export const lightTheme = [
  baseTheme,
  syntaxHighlighting(highlightStyle),
  EditorState.tabSize.of(2),
  EditorView.lineWrapping,
];

export default lightTheme;
