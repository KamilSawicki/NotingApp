<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';
</script>

<template>
    <div class="settings-page">
        <PageHeader :title="$t('settings.users.title')" :description="$t('settings.users.description')" />
    </div>
</template>

<style lang="scss" scoped>
.settings-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 1100px;
    padding: 32px 36px;
}
</style>
