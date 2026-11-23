<script setup>
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';

defineProps({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    confirmLabel: {
        type: String,
        required: true,
    },
    cancelLabel: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
    <BaseDialog :title="title" @close="emit('cancel')">
        <p class="confirm__message">{{ message }}</p>
        <template #footer>
            <BaseButton size="md" autofocus @click="emit('cancel')">{{ cancelLabel }}</BaseButton>
            <BaseButton variant="danger" size="md" @click="emit('confirm')">{{ confirmLabel }}</BaseButton>
        </template>
    </BaseDialog>
</template>

<style lang="scss" scoped>
.confirm__message {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 13.5px;
    line-height: 1.5;
}
</style>
