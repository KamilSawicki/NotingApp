<script setup>
import { computed, ref } from 'vue';
import AiDeniedBadge from '@/components/notes/AiDeniedBadge.vue';
import { AiAccess, useNotesStore } from '@/stores/notes';

const props = defineProps({
    query: {
        type: String,
        default: '',
    },
});

const notesStore = useNotesStore();
const expandedIds = ref(new Set());

const normalizedQuery = computed(() => props.query.trim().toLowerCase());

function matches(note) {
    return (
        !normalizedQuery.value ||
        note.title.toLowerCase().includes(normalizedQuery.value) ||
        notesStore.childrenOf(note.id).some(matches)
    );
}

function isExpanded(note) {
    return normalizedQuery.value !== '' || expandedIds.value.has(note.id);
}

const rows = computed(() => {
    const result = [];

    const walk = (parentId, depth) => {
        for (const note of notesStore.childrenOf(parentId)) {
            if (!matches(note)) {
                continue;
            }

            const hasChildren = notesStore.childrenOf(note.id).length > 0;
            const expanded = hasChildren && isExpanded(note);
            result.push({ note, depth, hasChildren, expanded });

            if (expanded) {
                walk(note.id, depth + 1);
            }
        }
    };
    walk(null, 0);

    return result;
});

function toggle(note) {
    const ids = new Set(expandedIds.value);

    if (ids.has(note.id)) {
        ids.delete(note.id);
    } else {
        ids.add(note.id);
    }

    expandedIds.value = ids;
}
</script>

<template>
    <ul v-if="rows.length" class="note-tree" role="tree">
        <li
            v-for="row in rows"
            :key="row.note.id"
            class="note-tree__row"
            :class="{
                'note-tree__row--selected': row.note.id === notesStore.selectedId,
                'note-tree__row--ai-denied': row.note.aiAccess === AiAccess.DENY,
            }"
            :style="{ '--depth': row.depth }"
            role="treeitem"
            :aria-level="row.depth + 1"
            :aria-expanded="row.hasChildren ? row.expanded : undefined"
            :aria-selected="row.note.id === notesStore.selectedId"
            @click="notesStore.select(row.note.id)"
        >
            <button
                v-if="row.hasChildren"
                type="button"
                class="note-tree__toggle"
                :aria-label="$t(row.expanded ? 'note_tree.collapse' : 'note_tree.expand')"
                @click.stop="toggle(row.note)"
            >
                {{ row.expanded ? '▾' : '▸' }}
            </button>
            <span v-else class="note-tree__toggle" />

            <span class="note-tree__title">{{ row.note.title }}</span>

            <AiDeniedBadge v-if="row.note.aiAccess === AiAccess.DENY" />
        </li>
    </ul>

    <p v-else class="note-tree__empty">
        {{ normalizedQuery ? $t('note_tree.no_matches') : $t('note_tree.empty') }}
    </p>
</template>

<style lang="scss" scoped>
.note-tree {
    display: flex;
    flex-direction: column;
    gap: 1px;
    margin: 0;
    padding: 0;
    list-style: none;

    &__row {
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: 30px;
        margin: 0 8px;
        padding: 0 6px 0 calc(4px + var(--depth) * 16px);
        border-radius: var(--radius-sm);
        font-size: 13.5px;
        cursor: pointer;

        &:hover {
            background: var(--color-hover);
        }

        &--selected,
        &--selected:hover {
            background: var(--color-selected);
            font-weight: 600;
        }

        &--ai-denied {
            color: var(--color-text-secondary);
        }
    }

    &__toggle {
        display: flex;
        flex: none;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 20px;
        padding: 0;
        border: none;
        background: transparent;
        color: var(--color-text-faint);
        font-size: 10px;
        cursor: pointer;
    }

    &__title {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__empty {
        margin: 12px 16px;
        color: var(--color-text-muted);
        font-size: 13px;
    }
}
</style>
