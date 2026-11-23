<script setup>
import { computed } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { formatDateTime, t } from '@/i18n';
import { countWords } from '@/markdown';
import { useNoteStore } from '@/stores/note';
import { useUserStore } from '@/stores/user';

const noteStore = useNoteStore();
const userStore = useUserStore();

function formatDifference(difference) {
    return difference >= 0 ? `+${difference}` : `\u2212${-difference}`;
}

const entries = computed(() => {
    const versions = noteStore.note.versions;
    const current = {
        id: null,
        label: t('versions.current'),
        meta: t('versions.now', { words: t('note.words', { count: countWords(noteStore.note.content) }) }),
        diff: null,
    };

    return [
        current,
        ...versions.map((version, index) => {
            const words = countWords(version.content);
            const previous = versions[index + 1];
            const difference = previous ? words - countWords(previous.content) : null;

            return {
                id: version.id,
                label: formatDateTime(version.createdAt),
                meta: t('versions.meta', { author: version.authorName, words: t('note.words', { count: words }) }),
                diff: difference === null ? t('versions.created') : formatDifference(difference),
                diffModifier: difference === null || difference >= 0 ? 'added' : 'removed',
            };
        }),
    ];
});

const activeId = computed(() => noteStore.viewedVersion?.id ?? null);
</script>

<template>
    <p class="versions__description">{{ $t('versions.description') }}</p>
    <BaseButton size="md" @click="noteStore.saveVersion(userStore.user.name)">{{ $t('versions.save') }}</BaseButton>

    <ul class="versions__list">
        <li
            v-for="entry in entries"
            :key="entry.id ?? 'current'"
            class="versions__entry"
            :class="{
                'versions__entry--active': entry.id === activeId,
                'versions__entry--current': entry.id === null,
            }"
            @click="noteStore.viewVersion(entry.id)"
        >
            <span class="versions__dot" />
            <div class="versions__text">
                <span class="versions__label">{{ entry.label }}</span>
                <span class="versions__meta">{{ entry.meta }}</span>
            </div>
            <span v-if="entry.diff" class="versions__diff" :class="`versions__diff--${entry.diffModifier}`">
                {{ entry.diff }}
            </span>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.versions {
    &__description {
        margin: 0;
        color: var(--color-text-muted);
        font-size: 12.5px;
        line-height: 1.5;
    }

    &__list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    &__entry {
        display: flex;
        gap: 12px;
        padding: 10px 10px 10px 4px;
        border-radius: var(--radius-md);
        cursor: pointer;

        &:hover {
            background: var(--color-hover-subtle);
        }

        &--active,
        &--active:hover {
            background: var(--color-selected);
        }
    }

    &__dot {
        flex: none;
        width: 9px;
        height: 9px;
        margin: 5px 2px 0 6px;
        border: 1.5px solid var(--color-border-hover);
        border-radius: 50%;
        background: var(--color-surface);

        .versions__entry--current & {
            border-color: var(--color-accent);
            background: var(--color-accent);
        }
    }

    &__text {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    &__label {
        font-size: 13px;
        font-weight: 500;
    }

    &__meta {
        color: var(--color-text-muted);
        font-family: var(--font-mono);
        font-size: 11.5px;
    }

    &__diff {
        flex: none;
        padding-top: 2px;
        font-family: var(--font-mono);
        font-size: 11px;

        &--added {
            color: var(--color-diff-added);
        }

        &--removed {
            color: var(--color-diff-removed);
        }
    }
}
</style>
