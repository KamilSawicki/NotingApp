<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    variant: {
        type: String,
        default: 'outline',
        validator: (value) => ['outline', 'ghost', 'primary'].includes(value),
    },
    size: {
        type: String,
        default: 'sm',
        validator: (value) => ['sm', 'md'].includes(value),
    },
    square: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: false,
    },
    to: {
        type: [String, Object],
        default: null,
    },
});

const classes = computed(() => [
    'button',
    `button--${props.variant}`,
    `button--${props.size}`,
    { 'button--square': props.square, 'button--active': props.active },
]);
</script>

<template>
    <RouterLink v-if="to" :to="to" :class="classes">
        <slot />
    </RouterLink>
    <button v-else type="button" :class="classes">
        <slot />
    </button>
</template>

<style lang="scss" scoped>
.button {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    color: var(--color-text-control);
    font-size: 12.5px;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
        color: var(--color-text-control);
    }

    &--sm {
        height: 28px;
        padding: 0 9px;
    }

    &--md {
        height: 32px;
        padding: 0 12px;
        font-size: 13px;
    }

    &--square {
        padding: 0;
        aspect-ratio: 1;
        font-size: 16px;
    }

    &--outline {
        border-color: var(--color-border);
        background: var(--color-surface);

        &:hover {
            border-color: var(--color-border-hover);
        }
    }

    &--ghost {
        background: transparent;

        &:hover {
            background: var(--color-hover-subtle);
        }
    }

    &--primary {
        background: var(--color-text);
        color: var(--color-text-inverse);
        font-weight: 500;

        &:hover {
            background: var(--color-primary-hover);
            color: var(--color-text-inverse);
        }
    }

    &--active {
        background: var(--color-hover-subtle);
    }
}
</style>
