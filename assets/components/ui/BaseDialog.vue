<script setup>
import { onMounted, useTemplateRef } from 'vue';

defineProps({
    title: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['close']);

const dialog = useTemplateRef('dialog');

onMounted(() => dialog.value.showModal());

function onBackdropClick(event) {
    if (event.target === dialog.value) {
        emit('close');
    }
}
</script>

<template>
    <dialog ref="dialog" class="dialog" @close="emit('close')" @click="onBackdropClick">
        <div class="dialog__panel">
            <h2 class="dialog__title">{{ title }}</h2>
            <slot />
            <footer class="dialog__footer">
                <slot name="footer" />
            </footer>
        </div>
    </dialog>
</template>

<style lang="scss" scoped>
.dialog {
    width: 100%;
    max-width: 400px;
    padding: 0;
    border: none;
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    box-shadow: var(--shadow-dialog);
    color: var(--color-text);

    &::backdrop {
        background: var(--color-overlay);
    }

    &__panel {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 24px;
    }

    &__title {
        margin: 0;
        font-size: 17px;
        font-weight: 600;
    }

    &__footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 6px;
    }
}
</style>
