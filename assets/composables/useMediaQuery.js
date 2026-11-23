import { onScopeDispose, ref } from 'vue';

export function useMediaQuery(query) {
    const mediaQuery = window.matchMedia(query);
    const matches = ref(mediaQuery.matches);

    const onChange = (event) => {
        matches.value = event.matches;
    };

    mediaQuery.addEventListener('change', onChange);
    onScopeDispose(() => mediaQuery.removeEventListener('change', onChange));

    return matches;
}
