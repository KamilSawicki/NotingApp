import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useNotesStore } from '@/stores/notes';

const API_ARCHITECTURE = `# API architecture

The **Symfony** backend exposes a REST API for the Vue frontend and an MCP server for the AI agent.

## Authentication

OAuth 2.1 with a BFF session for the frontend. Staging test account: #[hidden](qa-admin / Tr0ub4dor&3)(Staging credentials)

> The AI agent never receives fragments marked as sensitive.

## Endpoints

- \`GET /api/notes\` — the user's note tree
- \`PATCH /api/notes/{id}\` — saves the content and the AI mode
- \`POST /api/notes/{id}/links\` — related notes

PDF service key: #[hidden](pdf_sk_8f3a91c2e7)(PDF service API key)

## To decide

1. Note versioning
2. Attachment size limit
`;

const SAMPLE_NOTES = {
    n1: { content: '# Projects\n\nCurrent projects and documentation.\n' },
    n2: { content: '# NotingApp\n\n**Vue** frontend, **Symfony** backend, AI agent through MCP.\n' },
    n3: {
        content: API_ARCHITECTURE,
        css: 'h2 { color: #8a4b2a; }\nblockquote { font-style: italic; }',
        relatedIds: ['n5', 'n10'],
        versions: [
            {
                id: 'v3',
                createdAt: '2026-11-21T16:40:00+01:00',
                authorName: 'Anna Kowal',
                content: API_ARCHITECTURE.slice(0, API_ARCHITECTURE.indexOf('## To decide')).replace(
                    /\nPDF service key:[^\n]*\n/,
                    '\n',
                ),
            },
            {
                id: 'v2',
                createdAt: '2026-11-19T11:05:00+01:00',
                authorName: 'Anna Kowal',
                content: API_ARCHITECTURE.slice(0, API_ARCHITECTURE.indexOf('## Endpoints')),
            },
            {
                id: 'v1',
                createdAt: '2026-11-17T09:30:00+01:00',
                authorName: 'Anna Kowal',
                content: '# API architecture\n\nThe **Symfony** backend exposes a REST API.\n',
            },
        ],
    },
    n4: { content: '# Q1 roadmap\n\n- PDF export\n- More AI access modes\n' },
    n5: {
        content:
            '# MCP server\n\nThe agent sees only notes with **Full access**.\n\n- Sensitive fragments are cut out before sending\n- The mode is checked on every request\n',
        relatedIds: ['n3'],
    },
    n6: { content: '# Personal\n' },
    n7: {
        content:
            '# Health\n\nTest results: #[hidden](cholesterol 182 mg/dl)(Test result)\n\nNext appointment in January.\n',
    },
    n8: { content: '# Home finances\n\nAccount: #[hidden](PL61 1090 1014 0000 0712 1981 2874)(Account number)\n' },
    n9: { content: '# Meetings\n' },
    n10: {
        content: '# Sprint review\n\n- Note tree demo\n- MCP decisions\n',
        relatedIds: ['n3'],
    },
    n11: { content: '# Recipes\n\n## Sour rye soup\n\nSourdough starter, white sausage, marjoram.\n' },
};

export const useNoteStore = defineStore('note', () => {
    const notesStore = useNotesStore();

    const note = ref(null);
    const viewedVersionId = ref(null);

    const relatedNotes = computed(() =>
        (note.value?.relatedIds ?? []).map((id) => notesStore.find(id)).filter(Boolean),
    );

    const viewedVersion = computed(
        () => note.value?.versions.find((version) => version.id === viewedVersionId.value) ?? null,
    );

    async function load(id) {
        const sample = SAMPLE_NOTES[id] ?? { content: '' };

        viewedVersionId.value = null;
        note.value = structuredClone({
            id,
            content: sample.content,
            css: sample.css ?? '',
            relatedIds: sample.relatedIds ?? [],
            versions: sample.versions ?? [],
        });
    }

    function clear() {
        note.value = null;
        viewedVersionId.value = null;
    }

    function updateContent(content) {
        note.value.content = content;
    }

    function updateCss(css) {
        note.value.css = css;
    }

    function addRelated(id) {
        if (id !== note.value.id && !note.value.relatedIds.includes(id)) {
            note.value.relatedIds.push(id);
        }
    }

    function removeRelated(id) {
        note.value.relatedIds = note.value.relatedIds.filter((relatedId) => relatedId !== id);
    }

    function saveVersion(authorName) {
        note.value.versions.unshift({
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            authorName,
            content: note.value.content,
        });
    }

    function viewVersion(id) {
        viewedVersionId.value = id;
    }

    function restoreViewedVersion(authorName) {
        const version = viewedVersion.value;

        if (version) {
            saveVersion(authorName);
            note.value.content = version.content;
            viewedVersionId.value = null;
        }
    }

    return {
        note,
        relatedNotes,
        viewedVersion,
        load,
        clear,
        updateContent,
        updateCss,
        addRelated,
        removeRelated,
        saveVersion,
        viewVersion,
        restoreViewedVersion,
    };
});
