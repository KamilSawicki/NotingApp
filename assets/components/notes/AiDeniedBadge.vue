<template>
    <span class="ai-denied" :title="$t('note_tree.ai_denied')" :aria-label="$t('note_tree.ai_denied')" role="img">
        AI
    </span>
</template>

<style lang="scss" scoped>
.ai-denied {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    overflow: hidden;
    border: 1px solid var(--color-ai-denied-border);
    border-radius: 50%;
    background: var(--color-ai-denied-bg);
    color: var(--color-ai-denied);
    font-family: var(--font-mono);
    font-size: 7px;
    font-weight: 500;

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        left: 0;
        height: 1px;
        margin-top: -0.5px;
        background: var(--color-ai-denied-strike);
        transform: rotate(-45deg);
    }
}
</style>
