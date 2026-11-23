<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
});
</script>

<template>
    <header class="page-header">
        <div class="page-header__text">
            <h1 class="page-header__title">{{ title }}</h1>
            <p v-if="description" class="page-header__description">{{ description }}</p>
        </div>
        <slot name="actions" />
    </header>
</template>

<style lang="scss" scoped>
.page-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 16px;

    &__text {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 6px;
        min-width: 240px;
    }

    &__title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
    }

    &__description {
        max-width: 620px;
        margin: 0;
        color: var(--color-text-muted);
        font-size: 13.5px;
        line-height: 1.55;
    }
}
</style>
