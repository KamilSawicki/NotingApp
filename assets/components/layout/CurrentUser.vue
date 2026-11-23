<script setup>
import UserAvatar from '@/components/ui/UserAvatar.vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
    <div class="current-user">
        <UserAvatar :name="userStore.user.name" />
        <div class="current-user__text">
            <span class="current-user__name">{{ userStore.user.name }}</span>
            <span class="current-user__role">{{ $t(`user.roles.${userStore.user.role}`) }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.current-user {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;

    &__text {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    &__name {
        overflow: hidden;
        font-size: 13px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__role {
        color: var(--color-text-muted);
        font-size: 11.5px;
    }
}
</style>
