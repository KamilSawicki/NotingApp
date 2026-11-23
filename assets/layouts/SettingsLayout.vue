<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
import { t } from '@/i18n';

const sections = [
    {
        heading: null,
        items: [
            {
                to: { name: 'settings-style' },
                label: t('settings.style.title'),
                description: t('settings.style.nav_description'),
            },
        ],
    },
    {
        heading: t('settings.administration'),
        items: [
            {
                to: { name: 'settings-app-style' },
                label: t('settings.app_style.title'),
                description: t('settings.app_style.nav_description'),
            },
            {
                to: { name: 'settings-users' },
                label: t('settings.users.title'),
                description: t('settings.users.nav_description'),
            },
        ],
    },
];
</script>

<template>
    <div class="settings-layout">
        <aside class="settings-layout__nav">
            <BaseButton variant="ghost" :to="{ name: 'home' }" class="settings-layout__back">{{
                $t('settings.back')
            }}</BaseButton>
            <h1 class="settings-layout__title">{{ $t('settings.title') }}</h1>

            <nav :aria-label="$t('settings.title')">
                <section v-for="(section, index) in sections" :key="index" class="settings-layout__section">
                    <h2 v-if="section.heading" class="settings-layout__heading">{{ section.heading }}</h2>
                    <RouterLink
                        v-for="item in section.items"
                        :key="item.label"
                        :to="item.to"
                        class="settings-layout__item"
                        active-class="settings-layout__item--active"
                    >
                        <span class="settings-layout__item-label">{{ item.label }}</span>
                        <span class="settings-layout__item-description">{{ item.description }}</span>
                    </RouterLink>
                </section>
            </nav>

            <a href="/logout" class="settings-layout__logout">{{ $t('settings.logout') }}</a>
        </aside>

        <main class="settings-layout__main">
            <RouterView />
        </main>
    </div>
</template>

<style lang="scss" scoped>
.settings-layout {
    display: flex;
    height: 100vh;
    overflow: hidden;

    &__nav {
        display: flex;
        flex: none;
        flex-direction: column;
        gap: 4px;
        width: var(--settings-nav-width);
        padding: 16px 10px;
        border-right: 1px solid var(--color-border-subtle);
        background: var(--color-bg-sunken);
    }

    &__back {
        align-self: flex-start;
        font-size: 13px;
    }

    &__title {
        margin: 0;
        padding: 10px 10px 12px;
        font-size: 18px;
        font-weight: 600;
    }

    &__section {
        display: flex;
        flex-direction: column;
    }

    &__heading {
        margin: 0;
        padding: 16px 10px 6px;
        color: var(--color-text-muted);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }

    &__item {
        display: flex;
        flex-direction: column;
        gap: 1px;
        padding: 8px 10px;
        border-radius: 7px;
        color: var(--color-text);
        text-decoration: none;

        &:hover {
            background: var(--color-hover);
            color: var(--color-text);
        }

        &--active,
        &--active:hover {
            background: var(--color-selected);
        }
    }

    &__item-label {
        font-size: 13.5px;
        font-weight: 500;
    }

    &__item-description {
        color: var(--color-text-muted);
        font-size: 11.5px;
    }

    &__logout {
        margin-top: auto;
        padding: 8px 10px;
        border-radius: 7px;
        color: var(--color-danger);
        font-size: 13px;
        text-decoration: none;

        &:hover {
            background: var(--color-danger-bg);
            color: var(--color-danger);
        }
    }

    &__main {
        flex: 1;
        min-width: 0;
        overflow: auto;
        background: var(--color-surface);
    }
}
</style>
