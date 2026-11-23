<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <label class="field">
        <span class="field__label">{{ label }}</span>
        <slot />
    </label>
</template>

<style lang="scss" scoped>
.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;

    &__label {
        color: var(--color-text-secondary);
        font-size: 12.5px;
        font-weight: 500;
    }
}
</style>
