<script setup>
import { computed } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { t } from '@/i18n';
import { useLayoutStore } from '@/stores/layout';
import { useNotesStore } from '@/stores/notes';

const props = defineProps({
    note: {
        type: Object,
        required: true,
    },
});

const layout = useLayoutStore();
const notesStore = useNotesStore();

const breadcrumb = computed(() =>
    [t('note.breadcrumb_root'), ...notesStore.ancestorsOf(props.note.id).map((ancestor) => ancestor.title)].join(' / '),
);
</script>

<template>
    <header class="note-header">
        <div class="note-header__breadcrumb">{{ breadcrumb }}</div>
        <div class="note-header__row">
            <input
                class="note-header__title"
                :value="note.title"
                :aria-label="$t('note.title_label')"
                :placeholder="$t('note.title.placeholder', {}, 'fields')"
                @input="notesStore.rename(note.id, $event.target.value)"
            />
            <BaseButton
                size="md"
                :active="layout.isSidePanelOpen"
                :title="$t('home.toggle_side_panel')"
                @click="layout.toggleSidePanel()"
            >
                {{ layout.isSidePanelOpen ? '→' : '←' }}
            </BaseButton>
        </div>
    </header>
</template>

<style lang="scss" scoped>
.note-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 24px 12px;
    border-bottom: 1px solid var(--color-divider);

    &__breadcrumb {
        overflow: hidden;
        color: var(--color-text-muted);
        font-family: var(--font-mono);
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__row {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    &__title {
        flex: 1;
        min-width: 120px;
        padding: 0;
        border: none;
        outline: none;
        background: transparent;
        color: var(--color-text);
        font-size: 22px;
        font-weight: 600;
        letter-spacing: -0.01em;
    }
}
</style>
