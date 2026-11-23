import { t } from '@/i18n';

const LIST_MARKER = /^(\s*)(- \[[ x]\] |[-*] |(\d+)\. |> )(.*)$/;
const ANY_PREFIX = /^(\s*)(- \[[ x]\] |[-*] |\d+\. |> )/;

function lineBounds(text, start, end) {
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = text.indexOf('\n', end);

    return { lineStart, lineEnd: lineEnd === -1 ? text.length : lineEnd };
}

function replaceLines(state, transform) {
    const { lineStart, lineEnd } = lineBounds(state.text, state.start, state.end);
    const insert = transform(state.text.slice(lineStart, lineEnd).split('\n')).join('\n');

    return { from: lineStart, to: lineEnd, insert, selectionStart: lineStart + insert.length };
}

export function wrap(state, before, after, placeholder) {
    const selected = state.text.slice(state.start, state.end) || placeholder;
    const selectionStart = state.start + before.length;

    return {
        from: state.start,
        to: state.end,
        insert: before + selected + after,
        selectionStart,
        selectionEnd: selectionStart + selected.length,
    };
}

export function toggleHeading(state, level) {
    return replaceLines({ ...state, end: state.start }, ([line]) => {
        const text = line.replace(/^#{1,6}\s+/, '');
        const currentLevel = line.match(/^(#{1,6})\s/)?.[1].length;

        return [currentLevel === level ? text : `${'#'.repeat(level)} ${text}`];
    });
}

const LIST_KINDS = {
    bullet: { marker: () => '- ', has: (line) => /^- (?!\[)/.test(line) },
    ordered: { marker: (index) => `${index + 1}. `, has: (line) => /^\d+\. /.test(line) },
    task: { marker: () => '- [ ] ', has: (line) => /^- \[[ x]\] /.test(line) },
    quote: { marker: () => '> ', has: (line) => line.startsWith('> ') },
};

export function toggleLinePrefix(state, kind) {
    const { marker, has } = LIST_KINDS[kind];

    return replaceLines(state, (lines) => {
        const strip = (line) => line.replace(ANY_PREFIX, '$1');

        return lines.every(has) ? lines.map(strip) : lines.map((line, index) => marker(index) + strip(line));
    });
}

export function insertText(state, text) {
    return { from: state.start, to: state.end, insert: text, selectionStart: state.start + text.length };
}

export function continueList(state) {
    if (state.start !== state.end) {
        return null;
    }

    const { lineStart, lineEnd } = lineBounds(state.text, state.start, state.start);
    const match = state.text.slice(lineStart, lineEnd).match(LIST_MARKER);

    if (!match) {
        return null;
    }

    const [, indent, marker, number, rest] = match;

    if (!rest.trim()) {
        return { from: lineStart, to: lineEnd, insert: '', selectionStart: lineStart };
    }

    const nextMarker = number ? `${Number(number) + 1}. ` : marker.startsWith('- [') ? '- [ ] ' : marker;

    return insertText(state, `\n${indent}${nextMarker}`);
}

export const COMMANDS = {
    heading1: (state) => toggleHeading(state, 1),
    heading2: (state) => toggleHeading(state, 2),
    heading3: (state) => toggleHeading(state, 3),
    bold: (state) => wrap(state, '**', '**', t('editor.placeholder.text')),
    italic: (state) => wrap(state, '*', '*', t('editor.placeholder.text')),
    strikethrough: (state) => wrap(state, '~~', '~~', t('editor.placeholder.text')),
    inlineCode: (state) => wrap(state, '`', '`', t('editor.placeholder.code')),
    bulletList: (state) => toggleLinePrefix(state, 'bullet'),
    orderedList: (state) => toggleLinePrefix(state, 'ordered'),
    taskList: (state) => toggleLinePrefix(state, 'task'),
    quote: (state) => toggleLinePrefix(state, 'quote'),
    codeBlock: (state) => wrap(state, '```\n', '\n```', t('editor.placeholder.code')),
    horizontalRule: (state) => insertText(state, '\n---\n'),
    link: (state) => wrap(state, '[', '](https://)', t('editor.placeholder.text')),
    hidden: (state) => insertHidden(state),
};

export function hiddenMarker(value, description) {
    const clean = (text) => text.replace(/[()]/g, '');

    return `#[hidden](${clean(value)})(${clean(description)})`;
}

export function insertHidden(state) {
    const selected = state.text.slice(state.start, state.end).replace(/[()]/g, '');
    const value = selected || t('editor.placeholder.hidden_value');
    const description = t('editor.placeholder.hidden_description');
    const valueStart = state.start + '#[hidden]('.length;
    const descriptionStart = valueStart + value.length + ')('.length;

    return {
        ...insertText(state, hiddenMarker(value, description)),
        selectionStart: selected ? descriptionStart : valueStart,
        selectionEnd: selected ? descriptionStart + description.length : valueStart + value.length,
    };
}
