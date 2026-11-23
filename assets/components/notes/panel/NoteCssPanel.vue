<script setup>
import { computed, ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { t } from '@/i18n';
import { useNoteStore } from '@/stores/note';
import { useStylesStore } from '@/stores/styles';
import { countCssRules } from '@/utils/scopeCss';

const noteStore = useNoteStore();
const stylesStore = useStylesStore();

const previewedLevel = ref(null);

const levels = computed(() => [
    {
        number: 1,
        name: t('note_css.level.app'),
        details: t('note_css.shared', { rules: t('note_css.rules', { count: countCssRules(stylesStore.appCss) }) }),
        previewCss: stylesStore.appCss,
        modifier: 'app',
    },
    {
        number: 2,
        name: t('note_css.level.user'),
        details: t('note_css.all_my_notes', {
            rules: t('note_css.rules', { count: countCssRules(stylesStore.userCss) }),
        }),
        editTo: { name: 'settings-style' },
        modifier: 'user',
    },
]);

const noteRules = computed(() => t('note_css.rules', { count: countCssRules(noteStore.note.css) }));
</script>

<template>
    <section class="note-css">
        <h3 class="note-css__heading">{{ $t('note_css.cascade') }}</h3>

        <div v-for="level in levels" :key="level.number" class="note-css__level">
            <div class="note-css__row">
                <span class="note-css__number" :class="`note-css__number--${level.modifier}`">{{ level.number }}</span>
                <div class="note-css__text">
                    <span class="note-css__name">{{ level.name }}</span>
                    <span class="note-css__details">{{ level.details }}</span>
                </div>
                <BaseButton v-if="level.editTo" :to="level.editTo">{{ $t('note_css.edit') }}</BaseButton>
                <BaseButton
                    v-if="level.previewCss !== undefined"
                    :active="previewedLevel === level.number"
                    :aria-expanded="previewedLevel === level.number"
                    @click="previewedLevel = previewedLevel === level.number ? null : level.number"
                >
                    {{ $t('note_css.preview') }}
                </BaseButton>
            </div>
            <pre v-if="previewedLevel === level.number" class="note-css__code">{{ level.previewCss }}</pre>
        </div>

        <div class="note-css__level note-css__level--note">
            <div class="note-css__row">
                <span class="note-css__number note-css__number--note">{{ levels.length + 1 }}</span>
                <div class="note-css__text">
                    <span class="note-css__name">{{ $t('note_css.level.note') }}</span>
                    <span class="note-css__details">{{ $t('note_css.optional', { rules: noteRules }) }}</span>
                </div>
            </div>
            <textarea
                class="note-css__editor"
                :value="noteStore.note.css"
                :aria-label="$t('note_css.level.note')"
                :placeholder="$t('note.css.placeholder', {}, 'fields')"
                spellcheck="false"
                @input="noteStore.updateCss($event.target.value)"
            />
        </div>
    </section>
</template>

<style lang="scss" scoped>
.note-css {
    display: flex;
    flex-direction: column;
    gap: 6px;

    &__heading {
        margin: 0;
        color: var(--color-text-muted);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }

    &__level {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid var(--color-border-subtle);
        border-radius: var(--radius-md);
        background: var(--color-surface);

        &--note {
            border-color: var(--color-css-note-border);

            .note-css__row {
                border-bottom: 1px solid var(--color-css-note-bg);
            }
        }
    }

    &__row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 10px;
    }

    &__code {
        max-height: 240px;
        margin: 0;
        padding: 10px 12px;
        overflow: auto;
        border-top: 1px solid var(--color-border-subtle);
        color: var(--color-text-secondary);
        font-family: var(--font-mono);
        font-size: 12px;
        line-height: 1.6;
        white-space: pre-wrap;
    }

    &__number {
        display: flex;
        flex: none;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 5px;
        font-family: var(--font-mono);
        font-size: 11px;
        font-weight: 600;

        &--app {
            background: var(--color-css-app-bg);
            color: var(--color-css-app);
        }

        &--user {
            background: var(--color-css-user-bg);
            color: var(--color-css-user);
        }

        &--note {
            background: var(--color-css-note-bg);
            color: var(--color-css-note);
        }
    }

    &__text {
        display: flex;
        flex: 1;
        flex-direction: column;
        min-width: 0;
    }

    &__name {
        font-size: 13px;
        font-weight: 500;
    }

    &__details {
        color: var(--color-text-muted);
        font-size: 11.5px;
    }

    &__editor {
        min-height: 120px;
        padding: 10px 12px;
        border: none;
        outline: none;
        background: transparent;
        font-family: var(--font-mono);
        font-size: 12.5px;
        line-height: 1.6;
        resize: vertical;
    }
}
</style>
