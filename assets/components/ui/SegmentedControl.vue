<script setup>
defineProps({
    options: {
        type: Array,
        required: true,
    },
});

const value = defineModel({ type: String, required: true });
</script>

<template>
    <div class="segmented" role="radiogroup">
        <button
            v-for="option in options"
            :key="option.value"
            type="button"
            role="radio"
            class="segmented__option"
            :class="{ 'segmented__option--active': option.value === value }"
            :aria-checked="option.value === value"
            @click="value = option.value"
        >
            {{ option.label }}
        </button>
    </div>
</template>

<style lang="scss" scoped>
.segmented {
    display: flex;
    gap: 2px;
    padding: 2px;
    border-radius: 7px;
    background: var(--color-hover-subtle);

    &__option {
        height: 24px;
        padding: 0 10px;
        border: none;
        border-radius: 5px;
        background: transparent;
        color: var(--color-text-muted);
        font-size: 12px;
        white-space: nowrap;
        cursor: pointer;

        &--active {
            background: var(--color-surface);
            box-shadow: var(--shadow-control);
            color: var(--color-text);
        }
    }
}
</style>
