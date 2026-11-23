import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useMediaQuery } from '@/composables/useMediaQuery';

const PANEL_OVERLAY_WIDTH = 1200;

export const useLayoutStore = defineStore('layout', () => {
    const isSidePanelOverlay = useMediaQuery(`(max-width: ${PANEL_OVERLAY_WIDTH - 1}px)`);
    const isSidePanelOpen = ref(!isSidePanelOverlay.value);

    function toggleSidePanel() {
        isSidePanelOpen.value = !isSidePanelOpen.value;
    }

    function closeSidePanel() {
        isSidePanelOpen.value = false;
    }

    return { isSidePanelOverlay, isSidePanelOpen, toggleSidePanel, closeSidePanel };
});
