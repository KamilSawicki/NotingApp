<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
import { useLayoutStore } from '@/stores/layout';

const layout = useLayoutStore();
</script>

<template>
    <div class="home">
        <div class="home__toolbar">
            <BaseButton
                size="md"
                :active="layout.isSidePanelOpen"
                :title="$t('home.toggle_side_panel')"
                @click="layout.toggleSidePanel()"
            >
                {{ layout.isSidePanelOpen ? '→' : '←' }}
            </BaseButton>
        </div>
        <p class="home__empty">{{ $t('home.empty') }}</p>
    </div>
</template>

<style lang="scss" scoped>
.home {
    display: flex;
    flex: 1;
    flex-direction: column;

    &__toolbar {
        display: flex;
        justify-content: flex-end;
        padding: 14px 24px 12px;
        border-bottom: 1px solid var(--color-divider);
    }

    &__empty {
        margin: auto;
        color: var(--color-text-muted);
    }
}
</style>
