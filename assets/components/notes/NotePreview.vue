<script setup>
import { computed, onUnmounted, watchEffect } from 'vue';
import { renderMarkdown } from '@/markdown';
import { useNoteStore } from '@/stores/note';
import { useStylesStore } from '@/stores/styles';
import { scopeCss } from '@/utils/scopeCss';

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
});

const noteStore = useNoteStore();
const stylesStore = useStylesStore();

const html = computed(() => renderMarkdown(props.content));

const previewId = crypto.randomUUID();
const scope = `.note-preview[data-preview="${previewId}"]`;
const sheet = new CSSStyleSheet();
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

watchEffect(() => {
    sheet.replaceSync(
        [stylesStore.appCss, stylesStore.userCss, noteStore.note?.css ?? '']
            .map((css) => scopeCss(css, scope))
            .join('\n'),
    );
});

onUnmounted(() => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter((adopted) => adopted !== sheet);
});
</script>

<template>
    <div class="note-preview" :data-preview="previewId">
        <!-- eslint-disable-next-line vue/no-v-html -- markdown-it escapes HTML in the content (html: false). -->
        <article class="note" v-html="html" />
    </div>
</template>

<style lang="scss" scoped>
.note-preview {
    flex: 1;
    min-width: 0;
    overflow: auto;

    .note {
        max-width: 740px;
        margin: 0 auto;
        padding: 32px 40px;
    }

    :deep(.note-hidden) {
        padding: 0 3px;
        border-radius: 3px;
        background: var(--color-hidden-bg);
        box-decoration-break: clone;
    }
}
</style>
