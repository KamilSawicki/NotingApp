<script setup>
import { computed, ref } from 'vue';
import { t } from '@/i18n';
import { useNotesStore } from '@/stores/notes';

const MAX_RESULTS = 8;

const props = defineProps({
    excludeIds: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['select']);

const notesStore = useNotesStore();
const query = ref('');

const results = computed(() => {
    const normalizedQuery = query.value.trim().toLowerCase();

    return notesStore.notes
        .filter((note) => !props.excludeIds.includes(note.id) && note.title.toLowerCase().includes(normalizedQuery))
        .slice(0, MAX_RESULTS);
});

function select(note) {
    query.value = '';
    emit('select', note);
}
</script>

<template>
    <div class="note-picker">
        <input
            v-model="query"
            type="search"
            class="note-picker__search"
            :placeholder="$t('related.search.placeholder', {}, 'fields')"
        />
        <ul v-if="results.length" class="note-picker__results">
            <li v-for="note in results" :key="note.id">
                <button type="button" class="note-picker__result" @click="select(note)">
                    <span class="note-picker__title">{{ note.title }}</span>
                    <span class="note-picker__path">{{ notesStore.pathOf(note.id) || t('related.top_level') }}</span>
                </button>
            </li>
        </ul>
        <p v-else class="note-picker__no-results">{{ $t('related.no_results') }}</p>
    </div>
</template>

<style lang="scss" scoped>
.note-picker {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    border: 1px solid var(--color-accent-soft);
    border-radius: var(--radius-md);
    background: var(--color-surface);

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
        display: flex;
        flex-direction: column;
        max-height: 220px;
        margin: 0;
        padding: 0;
        overflow: auto;
        list-style: none;
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
    }

    &__title {
        font-size: 13px;
    }

    &__path {
        color: var(--color-text-muted);
        font-family: var(--font-mono);
        font-size: 11px;
    }

    &__no-results {
        margin: 4px 8px;
        color: var(--color-text-muted);
        font-size: 12.5px;
    }
}
</style>
