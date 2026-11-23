<script setup>
import { onUnmounted, ref, useTemplateRef, watch } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { useNoteStore } from '@/stores/note';

const noteStore = useNoteStore();
const isMenuOpen = ref(false);
const root = useTemplateRef('root');

function exportPdf(anonymous) {
    isMenuOpen.value = false;
    noteStore.exportPdf({ anonymous });
}

function onDocumentPointerDown(event) {
    if (!root.value.contains(event.target)) {
        isMenuOpen.value = false;
    }
}

function onDocumentKeydown(event) {
    if (event.key === 'Escape') {
        isMenuOpen.value = false;
    }
}

watch(isMenuOpen, (open) => {
    const method = open ? 'addEventListener' : 'removeEventListener';
    document[method]('pointerdown', onDocumentPointerDown);
    document[method]('keydown', onDocumentKeydown);
});

onUnmounted(() => {
    isMenuOpen.value = false;
    document.removeEventListener('pointerdown', onDocumentPointerDown);
    document.removeEventListener('keydown', onDocumentKeydown);
});
</script>

<template>
    <div ref="root" class="export">
        <BaseButton size="md" class="export__main" @click="exportPdf(false)">{{ $t('note.export.full') }}</BaseButton>
        <BaseButton
            size="md"
            class="export__toggle"
            :active="isMenuOpen"
            :title="$t('note.export.more')"
            :aria-label="$t('note.export.more')"
            :aria-expanded="isMenuOpen"
            aria-haspopup="menu"
            @click="isMenuOpen = !isMenuOpen"
        >
            ▾
        </BaseButton>

        <div v-if="isMenuOpen" class="export__menu" role="menu">
            <button type="button" class="export__item" role="menuitem" @click="exportPdf(false)">
                <span class="export__label">{{ $t('note.export.full') }}</span>
                <span class="export__description">{{ $t('note.export.full_description') }}</span>
            </button>
            <button type="button" class="export__item" role="menuitem" @click="exportPdf(true)">
                <span class="export__label">{{ $t('note.export.anonymous') }}</span>
                <span class="export__description">{{ $t('note.export.anonymous_description') }}</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.export {
    position: relative;
    display: flex;

    &__main {
        border-right: none;
        border-radius: var(--radius-sm) 0 0 var(--radius-sm);
    }

    &__toggle {
        width: 28px;
        padding: 0;
        border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        font-size: 10px;
    }

    &__menu {
        position: absolute;
        top: calc(100% + 6px);
        right: 0;
        z-index: 20;
        display: flex;
        flex-direction: column;
        width: 280px;
        padding: 6px;
        border: 1px solid var(--color-border);
        border-radius: 10px;
        background: var(--color-surface);
        box-shadow: var(--shadow-popover);
    }

    &__item {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 9px 10px;
        border: none;
        border-radius: 7px;
        background: transparent;
        text-align: left;
        cursor: pointer;

        &:hover {
            background: var(--color-hover-subtle);
        }
    }

    &__label {
        color: var(--color-text);
        font-size: 13px;
        font-weight: 500;
    }

    &__description {
        color: var(--color-text-muted);
        font-size: 12px;
        line-height: 1.4;
    }
}
</style>
