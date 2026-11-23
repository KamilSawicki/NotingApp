import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useMediaQuery } from '@/composables/useMediaQuery';

const PANEL_OVERLAY_WIDTH = 1200;

export const useLayoutStore = defineStore('layout', () => {
    const isSidePanelOverlay = useMediaQuery(`(max-width: ${PANEL_OVERLAY_WIDTH - 1}px)`);
    const isSidePanelOpen = ref(!isSidePanelOverlay.value);
    const isSidebarOpen = ref(true);

    function openSidePanel() {
        isSidePanelOpen.value = true;
    }

    function closeSidePanel() {
        isSidePanelOpen.value = false;
    }

    function openSidebar() {
        isSidebarOpen.value = true;
    }

    function closeSidebar() {
        isSidebarOpen.value = false;
    }

    return {
        isSidePanelOverlay,
        isSidePanelOpen,
        isSidebarOpen,
        openSidePanel,
        closeSidePanel,
        openSidebar,
        closeSidebar,
    };
});
