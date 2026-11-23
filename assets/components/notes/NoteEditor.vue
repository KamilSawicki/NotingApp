<script setup>
import { nextTick, useTemplateRef } from 'vue';
import { COMMANDS, continueList } from '@/editor/commands';
import { useNoteStore } from '@/stores/note';

const SHORTCUTS = { b: 'bold', i: 'italic' };

const noteStore = useNoteStore();
const textarea = useTemplateRef('textarea');

async function apply(change) {
    const element = textarea.value;

    element.focus();
    element.setSelectionRange(change.from, change.to);

    if (!document.execCommand('insertText', false, change.insert)) {
        element.setRangeText(change.insert, change.from, change.to, 'end');
        noteStore.updateContent(element.value);
    }

    await nextTick();
    element.setSelectionRange(change.selectionStart, change.selectionEnd ?? change.selectionStart);
}

function currentState() {
    const { value, selectionStart, selectionEnd } = textarea.value;

    return { text: value, start: selectionStart, end: selectionEnd };
}

function run(command) {
    apply(COMMANDS[command](currentState()));
}

function onKeydown(event) {
    const modifier = event.ctrlKey || event.metaKey;
    const shortcut = SHORTCUTS[event.key.toLowerCase()];

    if (modifier && event.shiftKey && !event.altKey && event.key.toLowerCase() === 'h') {
        event.preventDefault();
        run('hidden');
    } else if (modifier && !event.shiftKey && !event.altKey && shortcut) {
        event.preventDefault();
        run(shortcut);
    } else if (event.key === 'Enter' && !modifier && !event.shiftKey) {
        const change = continueList(currentState());

        if (change) {
            event.preventDefault();
            apply(change);
        }
    }
}

defineExpose({ run });
</script>

<template>
    <textarea
        ref="textarea"
        class="note-editor"
        :value="noteStore.note.content"
        :aria-label="$t('note.editor_label')"
        spellcheck="false"
        @input="noteStore.updateContent($event.target.value)"
        @keydown="onKeydown"
    />
</template>
<style lang="scss" scoped>
.note-editor {
    flex: 1;
    min-width: 0;
    min-height: 0;
    margin: 0;
    padding: 24px 28px;
    border: none;
    outline: none;
    background: var(--color-editor-bg);
    color: var(--color-text);
    font-family: var(--font-mono);
    font-size: 13.5px;
    line-height: 1.7;
    resize: none;
    tab-size: 4;
}
</style>
