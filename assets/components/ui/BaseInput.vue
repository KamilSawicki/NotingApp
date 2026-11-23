<script setup>
defineProps({
    monospace: {
        type: Boolean,
        default: false,
    },
});

const value = defineModel({ type: String, default: '' });
</script>

<template>
    <input v-model="value" class="input" :class="{ 'input--mono': monospace }" />
</template>

<style lang="scss" scoped>
.input {
    width: 100%;
    min-width: 0;
    height: 38px;
    padding: 0 12px;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    outline: none;
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 13.5px;

    &:focus {
        border-color: var(--color-accent);
    }

    &--mono {
        font-family: var(--font-mono);
        font-size: 13px;
    }
}
</style>
