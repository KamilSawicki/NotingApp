<script setup>
import { t } from '@/i18n';

defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['command']);

const groups = [
    [
        { command: 'heading1', label: 'H1', title: t('editor.tools.heading', { level: 1 }), modifier: 'heading' },
        { command: 'heading2', label: 'H2', title: t('editor.tools.heading', { level: 2 }), modifier: 'heading' },
        { command: 'heading3', label: 'H3', title: t('editor.tools.heading', { level: 3 }), modifier: 'heading' },
    ],
    [
        { command: 'bold', label: 'B', title: t('editor.tools.bold'), modifier: 'bold' },
        { command: 'italic', label: 'I', title: t('editor.tools.italic'), modifier: 'italic' },
        { command: 'strikethrough', label: 'S', title: t('editor.tools.strikethrough') },
        { command: 'inlineCode', label: '`c`', title: t('editor.tools.inline_code') },
    ],
    [
        { command: 'bulletList', label: '•', title: t('editor.tools.bullet_list') },
        { command: 'orderedList', label: '1.', title: t('editor.tools.ordered_list') },
        { command: 'taskList', label: '☐', title: t('editor.tools.task_list') },
    ],
    [
        { command: 'quote', label: '>', title: t('editor.tools.quote') },
        { command: 'codeBlock', label: '{ }', title: t('editor.tools.code_block') },
        { command: 'horizontalRule', label: '—', title: t('editor.tools.horizontal_rule') },
        { command: 'link', label: '[]()', title: t('editor.tools.link') },
    ],
];
</script>

<template>
    <div class="toolbar" role="toolbar" :aria-label="$t('editor.tools.label')">
        <template v-for="(group, index) in groups" :key="index">
            <span v-if="index > 0" class="toolbar__separator" />
            <button
                v-for="tool in group"
                :key="tool.command"
                type="button"
                class="toolbar__button"
                :class="tool.modifier && `toolbar__button--${tool.modifier}`"
                :title="tool.title"
                :aria-label="tool.title"
                :disabled="disabled"
                @mousedown.prevent
                @click="$emit('command', tool.command)"
            >
                {{ tool.label }}
            </button>
        </template>
        <span class="toolbar__separator" />
        <button
            type="button"
            class="toolbar__hidden"
            :title="$t('editor.tools.hidden')"
            :disabled="disabled"
            @mousedown.prevent
            @click="$emit('command', 'hidden')"
        >
            <span class="toolbar__lock" aria-hidden="true" />
            {{ $t('editor.hidden.button') }}
        </button>
        <div class="toolbar__end">
            <slot name="end" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    padding: 6px 16px;
    border-bottom: 1px solid var(--color-divider);

    &__separator {
        width: 1px;
        height: 18px;
        margin: 0 4px;
        background: var(--color-divider);
    }

    &__button {
        min-width: 30px;
        height: 28px;
        padding: 0 7px;
        border: none;
        border-radius: var(--radius-sm);
        background: transparent;
        color: var(--color-text-control);
        font-family: var(--font-mono);
        font-size: 12.5px;
        cursor: pointer;

        &:hover:not(:disabled) {
            background: var(--color-hover-subtle);
        }

        &:disabled {
            opacity: 0.4;
            cursor: default;
        }

        &--heading {
            font-weight: 600;
        }

        &--bold {
            font-weight: 700;
        }

        &--italic {
            font-style: italic;
        }
    }

    &__hidden {
        display: flex;
        align-items: center;
        gap: 7px;
        height: 28px;
        padding: 0 10px;
        border: 1px dashed var(--color-hidden-border);
        border-radius: var(--radius-sm);
        background: var(--color-hidden-bg);
        color: var(--color-hidden-text);
        font-size: 12.5px;
        font-weight: 500;
        white-space: nowrap;
        cursor: pointer;

        &:hover:not(:disabled) {
            background: var(--color-hidden-bg-hover);
        }

        &:disabled {
            opacity: 0.4;
            cursor: default;
        }
    }

    &__lock {
        position: relative;
        flex: none;
        width: 12px;
        height: 14px;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 2px;
            width: 8px;
            height: 8px;
            border: 1.5px solid currentcolor;
            border-bottom: none;
            border-radius: 4px 4px 0 0;
        }

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 12px;
            height: 8px;
            border-radius: 2px;
            background: currentcolor;
        }
    }

    &__end {
        margin-left: auto;
    }
}
</style>
