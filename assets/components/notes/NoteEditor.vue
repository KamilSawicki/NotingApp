<script setup>
import { useNoteStore } from '@/stores/note';

const noteStore = useNoteStore();
</script>

<template>
    <textarea
        class="note-editor"
        :value="noteStore.note.content"
        :aria-label="$t('note.editor_label')"
        spellcheck="false"
        @input="noteStore.updateContent($event.target.value)"
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
