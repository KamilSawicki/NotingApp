<template>
    <div class="brand">
        <span class="brand__mark">N</span>
        <span class="brand__name">NotingApp</span>
    </div>
</template>

<style lang="scss" scoped>
.brand {
    display: flex;
    align-items: center;
    gap: 9px;
    font-family: var(--font-mono);
    font-weight: 600;

    &__mark {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: var(--radius-sm);
        background: var(--color-text);
        color: var(--color-text-inverse);
        font-size: 12px;
    }

    &__name {
        font-size: 14px;
    }
}
</style>
