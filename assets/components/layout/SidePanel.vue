<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';

defineProps({
    tabs: {
        type: Array,
        required: true,
    },
    overlay: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['close']);

const activeTab = defineModel({ type: String, required: true });
</script>

<template>
    <aside class="side-panel" :class="{ 'side-panel--overlay': overlay }">
        <div class="side-panel__tabs" role="tablist">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                role="tab"
                class="side-panel__tab"
                :class="{ 'side-panel__tab--active': tab.key === activeTab }"
                :aria-selected="tab.key === activeTab"
                @click="activeTab = tab.key"
            >
                {{ tab.label }}
            </button>
            <BaseButton
                variant="ghost"
                square
                class="side-panel__close"
                :title="$t('side_panel.close')"
                @click="$emit('close')"
            >
                ×
            </BaseButton>
        </div>

        <div class="side-panel__content" role="tabpanel">
            <slot :name="activeTab" />
        </div>
    </aside>
</template>

<style lang="scss" scoped>
.side-panel {
    display: flex;
    flex: none;
    flex-direction: column;
    width: var(--side-panel-width);
    min-height: 0;
    border-left: 1px solid var(--color-border-subtle);
    background: var(--color-bg);

    &--overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 15;
        box-shadow: var(--shadow-overlay);
    }

    &__tabs {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 12px;
        border-bottom: 1px solid var(--color-border-subtle);
    }

    &__tab {
        height: 44px;
        padding: 0 8px;
        border: none;
        background: transparent;
        color: var(--color-text-muted);
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
        cursor: pointer;

        &--active {
            box-shadow: inset 0 -2px 0 var(--color-text);
            color: var(--color-text);
        }
    }

    &__close {
        margin-left: auto;
    }

    &__content {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 12px;
        overflow: auto;
        padding: 16px;
    }
}
</style>
