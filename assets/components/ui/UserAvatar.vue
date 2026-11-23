<script setup>
import { computed } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 30,
    },
});

const initials = computed(() =>
    props.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join(''),
);
</script>

<template>
    <span class="avatar" :style="{ '--size': `${size}px` }" aria-hidden="true">{{ initials }}</span>
</template>

<style lang="scss" scoped>
.avatar {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background: var(--color-accent-soft);
    color: var(--color-accent-strong);
    font-size: calc(var(--size) * 0.4);
    font-weight: 600;
}
</style>
