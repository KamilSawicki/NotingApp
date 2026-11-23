import MarkdownIt from 'markdown-it';
import { t } from '@/i18n';

const HIDDEN_SOURCE = String.raw`#\[hidden\]\(([^)]*)\)\(([^)]*)\)`;
const HIDDEN_PATTERN = new RegExp(HIDDEN_SOURCE, 'g');
const HIDDEN_AT_POSITION = new RegExp(HIDDEN_SOURCE, 'y');

function hiddenRule(state, silent) {
    HIDDEN_AT_POSITION.lastIndex = state.pos;
    const match = HIDDEN_AT_POSITION.exec(state.src);

    if (!match) {
        return false;
    }

    if (!silent) {
        const token = state.push('hidden', 'span', 0);
        token.meta = { value: match[1], description: match[2] };
    }

    state.pos += match[0].length;

    return true;
}

const markdown = new MarkdownIt({ html: false, linkify: false, typographer: false });

markdown.inline.ruler.before('link', 'hidden', hiddenRule);
markdown.renderer.rules.hidden = (tokens, index) => {
    const { value, description } = tokens[index].meta;
    const title = markdown.utils.escapeHtml(t('note.hidden.title', { description }));

    return `<span class="note-hidden" title="${title}">${markdown.utils.escapeHtml(value)}</span>`;
};

export function renderMarkdown(content) {
    return markdown.render(content);
}

export function countHidden(content) {
    return content.match(HIDDEN_PATTERN)?.length ?? 0;
}

export function countWords(content) {
    return content
        .replace(HIDDEN_PATTERN, ' ')
        .split(/\s+/)
        .filter((word) => /\p{L}|\p{N}/u.test(word)).length;
}
