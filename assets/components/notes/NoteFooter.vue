<script setup>
import { computed } from 'vue';
import { countHidden, countWords } from '@/markdown';
import { useNoteStore } from '@/stores/note';

defineProps({
    note: {
        type: Object,
        required: true,
    },
});

const noteStore = useNoteStore();

const words = computed(() => countWords(noteStore.note.content));
const hidden = computed(() => countHidden(noteStore.note.content));
</script>

<template>
    <footer class="note-footer">
        <span>{{ $t('note.words', { count: words }) }}</span>
        <span>{{ $t('note.footer.ai', { mode: $t(`note.ai.${note.aiAccess}`) }) }}</span>
        <span v-if="hidden" class="note-footer__hidden">{{ $t('note.footer.hidden', { count: hidden }) }}</span>
    </footer>
</template>

<style lang="scss" scoped>
.note-footer {
    display: flex;
    flex: none;
    align-items: center;
    gap: 16px;
    height: 30px;
    padding: 0 16px;
    overflow: hidden;
    border-top: 1px solid var(--color-divider);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: 11.5px;
    white-space: nowrap;

    &__hidden {
        color: var(--color-hidden-text);
    }
}
</style>
