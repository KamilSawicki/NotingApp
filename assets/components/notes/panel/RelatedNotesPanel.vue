<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import AiDeniedBadge from '@/components/notes/AiDeniedBadge.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { t } from '@/i18n';
import { useNoteStore } from '@/stores/note';
import { AiAccess, useNotesStore } from '@/stores/notes';

const MAX_RESULTS = 8;

const router = useRouter();
const notesStore = useNotesStore();
const noteStore = useNoteStore();

const isAdding = ref(false);
const query = ref('');

function pathOf(note) {
    return (
        notesStore
            .ancestorsOf(note.id)
            .map((ancestor) => ancestor.title)
            .join(' / ') || t('related.top_level')
    );
}

const candidates = computed(() => {
    const normalizedQuery = query.value.trim().toLowerCase();

    return notesStore.notes
        .filter(
            (note) =>
                note.id !== noteStore.note.id &&
                !noteStore.note.relatedIds.includes(note.id) &&
                note.title.toLowerCase().includes(normalizedQuery),
        )
        .slice(0, MAX_RESULTS);
});

function open(note) {
    router.push({ name: 'note', params: { id: note.id } });
}

function add(note) {
    noteStore.addRelated(note.id);
    query.value = '';
}
</script>

<template>
    <p class="related__description">{{ $t('related.description') }}</p>

    <ul v-if="noteStore.relatedNotes.length" class="related__list">
        <li v-for="note in noteStore.relatedNotes" :key="note.id" class="related__item" @click="open(note)">
            <div class="related__text">
                <span class="related__title">{{ note.title }}</span>
                <span class="related__path">{{ pathOf(note) }}</span>
            </div>
            <AiDeniedBadge v-if="note.aiAccess === AiAccess.DENY" />
            <BaseButton
                variant="ghost"
                square
                :title="$t('related.remove')"
                @click.stop="noteStore.removeRelated(note.id)"
            >
                ×
            </BaseButton>
        </li>
    </ul>
    <p v-else class="related__empty">{{ $t('related.empty') }}</p>

    <div v-if="isAdding" class="related__picker">
        <input
            v-model="query"
            type="search"
            class="related__search"
            :placeholder="$t('related.search.placeholder', {}, 'fields')"
        />
        <ul v-if="candidates.length" class="related__results">
            <li v-for="note in candidates" :key="note.id">
                <button type="button" class="related__result" @click="add(note)">
                    <span class="related__title">{{ note.title }}</span>
                    <span class="related__path">{{ pathOf(note) }}</span>
                </button>
            </li>
        </ul>
        <p v-else class="related__no-results">{{ $t('related.no_results') }}</p>
    </div>

    <BaseButton size="md" @click="isAdding = !isAdding">
        {{ isAdding ? $t('related.done') : $t('related.add') }}
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

    &__list,
    &__results {
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

    &__picker {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 8px;
        border: 1px solid var(--color-accent-soft);
        border-radius: var(--radius-md);
        background: var(--color-surface);
    }

    &__search {
        height: 32px;
        padding: 0 10px;
        border: 1px solid var(--color-divider);
        border-radius: var(--radius-sm);
        outline: none;
        font-size: 13px;

        &:focus {
            border-color: var(--color-accent);
        }
    }

    &__results {
        gap: 0;
        max-height: 220px;
        overflow: auto;
    }

    &__result {
        display: flex;
        flex-direction: column;
        gap: 1px;
        width: 100%;
        padding: 7px 8px;
        border: none;
        border-radius: var(--radius-sm);
        background: transparent;
        color: var(--color-text);
        text-align: left;
        cursor: pointer;

        &:hover {
            background: var(--color-hover-subtle);
        }

        .related__title {
            font-size: 13px;
            font-weight: 400;
        }
    }

    &__no-results {
        margin: 4px 8px;
        color: var(--color-text-muted);
        font-size: 12.5px;
    }
}
</style>
