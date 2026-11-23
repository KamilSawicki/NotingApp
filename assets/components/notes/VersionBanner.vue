<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
import { formatDateTime } from '@/i18n';
import { useNoteStore } from '@/stores/note';
import { useUserStore } from '@/stores/user';

const noteStore = useNoteStore();
const userStore = useUserStore();
</script>

<template>
    <div class="version-banner" role="status">
        <span class="version-banner__title">{{ $t('note.version_banner.title') }}</span>
        <span class="version-banner__meta">
            {{
                $t('note.version_banner.meta', {
                    date: formatDateTime(noteStore.viewedVersion.createdAt),
                    author: noteStore.viewedVersion.authorName,
                })
            }}
        </span>
        <BaseButton variant="primary" @click="noteStore.restoreViewedVersion(userStore.user.name)">
            {{ $t('note.version_banner.restore') }}
        </BaseButton>
        <BaseButton @click="noteStore.viewVersion(null)">{{ $t('note.version_banner.close') }}</BaseButton>
    </div>
</template>

<style lang="scss" scoped>
.version-banner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--color-divider);
    background: var(--color-bg-sunken);

    &__title {
        font-size: 13px;
        font-weight: 500;
    }

    &__meta {
        flex: 1;
        min-width: 0;
        color: var(--color-text-muted);
        font-family: var(--font-mono);
        font-size: 12.5px;
    }
}
</style>
