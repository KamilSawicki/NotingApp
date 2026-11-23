<script setup>
import { ref } from 'vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import SidePanel from '@/components/layout/SidePanel.vue';
import { useLayoutStore } from '@/stores/layout';
import { t } from '@/i18n';

const layout = useLayoutStore();

const sidePanelTabs = [
    { key: 'related', label: t('side_panel.tabs.related') },
    { key: 'css', label: t('side_panel.tabs.css') },
    { key: 'versions', label: t('side_panel.tabs.versions') },
];
const activeSidePanelTab = ref('related');
</script>

<template>
    <div class="notes-layout">
        <AppSidebar />

        <main class="notes-layout__main">
            <RouterView />
        </main>

        <SidePanel
            v-if="layout.isSidePanelOpen"
            v-model="activeSidePanelTab"
            :tabs="sidePanelTabs"
            :overlay="layout.isSidePanelOverlay"
            @close="layout.closeSidePanel()"
        >
            <template #related>
                <p class="notes-layout__panel-empty">{{ $t('side_panel.empty.related') }}</p>
            </template>
            <template #css>
                <p class="notes-layout__panel-empty">{{ $t('side_panel.empty.css') }}</p>
            </template>
            <template #versions>
                <p class="notes-layout__panel-empty">{{ $t('side_panel.empty.versions') }}</p>
            </template>
        </SidePanel>
    </div>
</template>

<style lang="scss" scoped>
.notes-layout {
    position: relative;
    display: flex;
    height: 100vh;
    overflow: hidden;

    &__main {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-width: 0;
        background: var(--color-surface);
    }

    &__panel-empty {
        margin: 0;
        color: var(--color-text-muted);
        font-size: 12.5px;
        line-height: 1.5;
    }
}
</style>
