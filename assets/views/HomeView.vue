<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
import PanelLeftIcon from '@/components/ui/icons/PanelLeftIcon.vue';
import PanelRightIcon from '@/components/ui/icons/PanelRightIcon.vue';
import { useLayoutStore } from '@/stores/layout';

const layout = useLayoutStore();
</script>

<template>
    <div class="home">
        <div class="home__toolbar">
            <BaseButton
                v-if="!layout.isSidebarOpen"
                size="md"
                square
                :title="$t('home.show_sidebar')"
                :aria-label="$t('home.show_sidebar')"
                @click="layout.openSidebar()"
            >
                <PanelLeftIcon />
            </BaseButton>
            <BaseButton
                v-if="!layout.isSidePanelOpen"
                class="home__side-panel-toggle"
                size="md"
                square
                :title="$t('home.toggle_side_panel')"
                :aria-label="$t('home.toggle_side_panel')"
                @click="layout.openSidePanel()"
            >
                <PanelRightIcon />
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
        min-height: 59px;
        padding: 14px 24px 12px;
        border-bottom: 1px solid var(--color-divider);
    }

    &__side-panel-toggle {
        margin-left: auto;
    }

    &__empty {
        margin: auto;
        color: var(--color-text-muted);
    }
}
</style>
