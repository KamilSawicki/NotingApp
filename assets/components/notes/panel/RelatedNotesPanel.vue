<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AiDeniedBadge from '@/components/notes/AiDeniedBadge.vue';
import NotePicker from '@/components/notes/NotePicker.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { t } from '@/i18n';
import { useNoteStore } from '@/stores/note';
import { AiAccess, useNotesStore } from '@/stores/notes';

const router = useRouter();
const notesStore = useNotesStore();
const noteStore = useNoteStore();

const openPicker = ref(null);

const note = computed(() => notesStore.find(noteStore.note.id));
const parent = computed(() => notesStore.find(note.value?.parentId));

const parentExcludeIds = computed(() => [
    note.value.id,
    ...notesStore.descendantIdsOf(note.value.id),
    ...(parent.value ? [parent.value.id] : []),
]);
const relatedExcludeIds = computed(() => [note.value.id, ...noteStore.note.relatedIds]);

function pathOf(relatedNote) {
    return notesStore.pathOf(relatedNote.id) || t('related.top_level');
}

function togglePicker(name) {
    openPicker.value = openPicker.value === name ? null : name;
}

function open(target) {
    router.push({ name: 'note', params: { id: target.id } });
}

function setParent(newParent) {
    notesStore.move(note.value.id, newParent.id);
    openPicker.value = null;
}

function addRelated(relatedNote) {
    noteStore.addRelated(relatedNote.id);
}
</script>

<template>
    <p class="related__description">{{ $t('related.description') }}</p>

    <div
        class="related__item related__item--parent"
        :class="{ 'related__item--static': !parent }"
        @click="parent && open(parent)"
    >
        <div class="related__text">
            <span class="related__title">{{ parent?.title ?? $t('related.no_parent') }}</span>
            <span class="related__path">{{ $t('related.parent') }}</span>
        </div>
        <AiDeniedBadge v-if="parent?.aiAccess === AiAccess.DENY" />
        <BaseButton
            variant="ghost"
            square
            :active="openPicker === 'parent'"
            :title="$t('related.change_parent')"
            :aria-label="$t('related.change_parent')"
            :aria-expanded="openPicker === 'parent'"
            @click.stop="togglePicker('parent')"
        >
            ✎
        </BaseButton>
        <BaseButton
            v-if="parent"
            variant="ghost"
            square
            :title="$t('related.remove_parent')"
            :aria-label="$t('related.remove_parent')"
            @click.stop="notesStore.move(note.id, null)"
        >
            ×
        </BaseButton>
    </div>
    <NotePicker v-if="openPicker === 'parent'" :exclude-ids="parentExcludeIds" @select="setParent" />

    <ul v-if="noteStore.relatedNotes.length" class="related__list">
        <li
            v-for="relatedNote in noteStore.relatedNotes"
            :key="relatedNote.id"
            class="related__item"
            @click="open(relatedNote)"
        >
            <div class="related__text">
                <span class="related__title">{{ relatedNote.title }}</span>
                <span class="related__path">{{ pathOf(relatedNote) }}</span>
            </div>
            <AiDeniedBadge v-if="relatedNote.aiAccess === AiAccess.DENY" />
            <BaseButton
                variant="ghost"
                square
                :title="$t('related.remove')"
                :aria-label="$t('related.remove')"
                @click.stop="noteStore.removeRelated(relatedNote.id)"
            >
                ×
            </BaseButton>
        </li>
    </ul>
    <p v-else class="related__empty">{{ $t('related.empty') }}</p>

    <NotePicker v-if="openPicker === 'related'" :exclude-ids="relatedExcludeIds" @select="addRelated" />

    <BaseButton size="md" @click="togglePicker('related')">
        {{ openPicker === 'related' ? $t('related.done') : $t('related.add') }}
    </BaseButton>
</template>

<style lang="scss" scoped>
.related {
    &__description {
        margin: 0;
        color: var(--color-text-muted);
        font-size: 12.5px;
        line-height: 1.5;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    &__item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 10px 10px 12px;
        border: 1px solid var(--color-border-subtle);
        border-radius: var(--radius-md);
        background: var(--color-surface);
        cursor: pointer;

        &:hover {
            border-color: var(--color-border-hover);
        }

        &--parent {
            background: var(--color-bg-sunken);
        }

        &--static {
            cursor: default;

            &:hover {
                border-color: var(--color-border-subtle);
            }

            .related__title {
                color: var(--color-text-muted);
                font-weight: 400;
            }
        }
    }

    &__text {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    &__title {
        overflow: hidden;
        font-size: 13.5px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__path {
        overflow: hidden;
        color: var(--color-text-muted);
        font-family: var(--font-mono);
        font-size: 11.5px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__empty {
        margin: 0;
        padding: 18px;
        border: 1px dashed var(--color-border);
        border-radius: var(--radius-md);
        color: var(--color-text-muted);
        font-size: 13px;
        text-align: center;
    }
}
</style>
