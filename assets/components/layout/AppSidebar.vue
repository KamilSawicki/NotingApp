<script setup>
import { ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BrandLogo from '@/components/ui/BrandLogo.vue';
import CurrentUser from '@/components/layout/CurrentUser.vue';
import NoteTree from '@/components/notes/NoteTree.vue';

const query = ref('');
</script>

<template>
    <aside class="sidebar">
        <header class="sidebar__header">
            <BrandLogo class="sidebar__brand" />
            <BaseButton square :title="$t('sidebar.new_root_note')">+</BaseButton>
        </header>

        <div class="sidebar__search">
            <input
                v-model="query"
                type="search"
                class="sidebar__search-input"
                :placeholder="$t('sidebar.search.placeholder', {}, 'fields')"
            />
        </div>

        <nav class="sidebar__tree" :aria-label="$t('sidebar.tree_label')">
            <NoteTree :query="query" />
        </nav>

        <footer class="sidebar__footer">
            <CurrentUser class="sidebar__user" />
            <BaseButton :to="{ name: 'settings' }">{{ $t('sidebar.settings') }}</BaseButton>
        </footer>
    </aside>
</template>

<style lang="scss" scoped>
.sidebar {
    display: flex;
    flex: none;
    flex-direction: column;
    width: var(--sidebar-width);
    min-height: 0;
    border-right: 1px solid var(--color-border-subtle);
    background: var(--color-bg-sunken);

    &__header {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 16px 16px 12px;
    }

    &__brand {
        flex: 1;
    }

    &__search {
        padding: 0 12px 10px;
    }

    &__search-input {
        width: 100%;
        height: 32px;
        padding: 0 10px;
        border: 1px solid var(--color-divider);
        border-radius: 7px;
        outline: none;
        background: var(--color-surface);
        font-size: 13px;

        &:focus {
            border-color: var(--color-accent);
        }
    }

    &__tree {
        flex: 1;
        overflow: auto;
        padding: 2px 0 12px;
    }

    &__footer {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-top: 1px solid var(--color-border-subtle);
    }

    &__user {
        flex: 1;
    }
}
</style>
