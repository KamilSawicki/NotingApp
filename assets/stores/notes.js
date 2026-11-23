import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const AiAccess = Object.freeze({
    FULL: 'full',
    DENY: 'deny',
});

const SAMPLE_NOTES = [
    { id: 'n1', title: 'Projects', parentId: null, aiAccess: AiAccess.FULL },
    { id: 'n2', title: 'NotingApp', parentId: 'n1', aiAccess: AiAccess.FULL },
    { id: 'n3', title: 'API architecture', parentId: 'n2', aiAccess: AiAccess.FULL },
    { id: 'n4', title: 'Q1 roadmap', parentId: 'n2', aiAccess: AiAccess.FULL },
    { id: 'n5', title: 'MCP server', parentId: 'n1', aiAccess: AiAccess.FULL },
    { id: 'n6', title: 'Personal', parentId: null, aiAccess: AiAccess.DENY },
    { id: 'n7', title: 'Health', parentId: 'n6', aiAccess: AiAccess.DENY },
    { id: 'n8', title: 'Home finances', parentId: 'n6', aiAccess: AiAccess.DENY },
    { id: 'n9', title: 'Meetings', parentId: null, aiAccess: AiAccess.FULL },
    { id: 'n10', title: '2026-11-18 Sprint review', parentId: 'n9', aiAccess: AiAccess.FULL },
    { id: 'n11', title: 'Recipes', parentId: null, aiAccess: AiAccess.FULL },
];

export const useNotesStore = defineStore('notes', () => {
    const notes = ref(SAMPLE_NOTES);
    const selectedId = ref(null);

    const childrenByParentId = computed(() => {
        const children = new Map();

        for (const note of notes.value) {
            if (!children.has(note.parentId)) {
                children.set(note.parentId, []);
            }
            children.get(note.parentId).push(note);
        }

        return children;
    });

    const notesById = computed(() => new Map(notes.value.map((note) => [note.id, note])));

    function childrenOf(parentId) {
        return childrenByParentId.value.get(parentId) ?? [];
    }

    function find(id) {
        return notesById.value.get(id) ?? null;
    }

    function ancestorsOf(id) {
        const ancestors = [];
        let parent = find(find(id)?.parentId);

        while (parent) {
            ancestors.unshift(parent);
            parent = find(parent.parentId);
        }

        return ancestors;
    }

    function pathOf(id) {
        return ancestorsOf(id)
            .map((ancestor) => ancestor.title)
            .join(' / ');
    }

    function descendantIdsOf(id) {
        const ids = new Set();
        const walk = (parentId) => {
            for (const child of childrenOf(parentId)) {
                ids.add(child.id);
                walk(child.id);
            }
        };
        walk(id);

        return ids;
    }

    function move(id, parentId) {
        const note = find(id);

        if (note && parentId !== id && !descendantIdsOf(id).has(parentId)) {
            note.parentId = parentId;
        }
    }

    function create(title) {
        const note = { id: crypto.randomUUID(), title, parentId: null, aiAccess: AiAccess.FULL };

        notes.value.push(note);

        return note;
    }

    function remove(id) {
        const removedIds = new Set([id, ...descendantIdsOf(id)]);

        notes.value = notes.value.filter((note) => !removedIds.has(note.id));

        return removedIds;
    }

    function select(id) {
        selectedId.value = id;
    }

    function rename(id, title) {
        const note = find(id);

        if (note) {
            note.title = title;
        }
    }

    return {
        notes,
        selectedId,
        childrenOf,
        find,
        ancestorsOf,
        pathOf,
        descendantIdsOf,
        select,
        rename,
        move,
        create,
        remove,
    };
});
