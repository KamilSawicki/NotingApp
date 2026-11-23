<script setup>
import { computed, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import NoteEditor from '@/components/notes/NoteEditor.vue';
import NoteFooter from '@/components/notes/NoteFooter.vue';
import NoteHeader from '@/components/notes/NoteHeader.vue';
import NotePreview from '@/components/notes/NotePreview.vue';
import NoteToolbar from '@/components/notes/NoteToolbar.vue';
import VersionBanner from '@/components/notes/VersionBanner.vue';
import SegmentedControl from '@/components/ui/SegmentedControl.vue';
import { t } from '@/i18n';
import { useNoteStore } from '@/stores/note';
import { useNotesStore } from '@/stores/notes';

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

const notesStore = useNotesStore();
const noteStore = useNoteStore();

const viewModes = [
    { value: 'edit', label: t('note.mode.edit') },
    { value: 'split', label: t('note.mode.split') },
    { value: 'preview', label: t('note.mode.preview') },
];
const viewMode = ref('split');
const editor = useTemplateRef('editor');

const summary = computed(() => notesStore.find(props.id));
const viewedVersion = computed(() => noteStore.viewedVersion);
const showEditor = computed(() => viewMode.value !== 'preview' && !viewedVersion.value);
const showPreview = computed(() => viewMode.value !== 'edit' || viewedVersion.value !== null);

watch(
    () => props.id,
    async (id) => {
        notesStore.select(id);
        await noteStore.load(id);
    },
    { immediate: true },
);

onUnmounted(() => {
    notesStore.select(null);
    noteStore.clear();
});
</script>

<template>
    <div v-if="summary && noteStore.note" class="note-view">
        <NoteHeader :note="summary" />

        <NoteToolbar :disabled="!showEditor" @command="editor?.run($event)">
            <template #end>
                <SegmentedControl v-model="viewMode" :options="viewModes" />
            </template>
        </NoteToolbar>

        <VersionBanner v-if="viewedVersion" />

        <div class="note-view__panes">
            <NoteEditor v-if="showEditor" ref="editor" />
            <NotePreview
                v-if="showPreview"
                :content="viewedVersion?.content ?? noteStore.note.content"
                :class="{ 'note-view__preview--split': showEditor }"
            />
        </div>

        <NoteFooter :note="summary" />
    </div>

    <p v-else-if="!summary" class="note-view__missing">{{ $t('note.not_found') }}</p>
</template>

<style lang="scss" scoped>
.note-view {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;

    &__panes {
        display: flex;
        flex: 1;
        min-height: 0;
    }

    &__preview--split {
        border-left: 1px solid var(--color-divider);
    }

    &__missing {
        margin: auto;
        color: var(--color-text-muted);
    }
}
</style>
