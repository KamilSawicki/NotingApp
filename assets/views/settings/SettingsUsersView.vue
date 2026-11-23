<script setup>
import { computed, ref } from 'vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import UserFormDialog from '@/components/settings/UserFormDialog.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import UserAvatar from '@/components/ui/UserAvatar.vue';
import { formatDateTime, t } from '@/i18n';
import { UserRole, useUserStore } from '@/stores/user';
import { useUsersStore } from '@/stores/users';

const userStore = useUserStore();
const usersStore = useUsersStore();

const editedUser = ref(undefined);
const userToDelete = ref(null);

const deleteMessage = computed(() =>
    userToDelete.value ? t('users.delete.message', { login: userToDelete.value.login }) : '',
);

async function deleteUser() {
    const { id } = userToDelete.value;

    userToDelete.value = null;
    await usersStore.remove(id);
}
</script>

<template>
    <div class="settings-page">
        <PageHeader :title="$t('settings.users.title')" :description="$t('settings.users.description')">
            <template #actions>
                <BaseButton variant="primary" size="md" @click="editedUser = null">{{ $t('users.add') }}</BaseButton>
            </template>
        </PageHeader>

        <table class="users">
            <colgroup>
                <col class="users__col-name" />
                <col class="users__col-login" />
                <col class="users__col-role" />
                <col class="users__col-last-login" />
                <col class="users__col-actions" />
            </colgroup>
            <thead>
                <tr>
                    <th>{{ $t('users.columns.name') }}</th>
                    <th>{{ $t('users.columns.login') }}</th>
                    <th>{{ $t('users.columns.role') }}</th>
                    <th>{{ $t('users.columns.last_login') }}</th>
                    <th>
                        <span class="users__hidden-label">{{ $t('users.columns.actions') }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in usersStore.users" :key="user.id">
                    <td>
                        <div class="users__person">
                            <UserAvatar :name="user.name" :size="28" />
                            <span class="users__name">
                                {{ user.name }}
                                <span v-if="user.id === userStore.user.id" class="users__self">
                                    {{ $t('users.self') }}
                                </span>
                            </span>
                        </div>
                    </td>
                    <td class="users__login">{{ user.login }}</td>
                    <td>
                        <span class="users__role" :class="{ 'users__role--admin': user.role === UserRole.ADMIN }">
                            {{ $t(`user.roles.${user.role}`) }}
                        </span>
                    </td>
                    <td class="users__last-login">
                        {{ user.lastLoginAt ? formatDateTime(user.lastLoginAt) : $t('users.never') }}
                    </td>
                    <td>
                        <div class="users__actions">
                            <BaseButton @click="editedUser = user">{{ $t('users.edit') }}</BaseButton>
                            <BaseButton
                                v-if="user.id !== userStore.user.id"
                                class="users__delete"
                                @click="userToDelete = user"
                            >
                                {{ $t('users.delete.button') }}
                            </BaseButton>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <UserFormDialog v-if="editedUser !== undefined" :user="editedUser" @close="editedUser = undefined" />

        <ConfirmDialog
            v-if="userToDelete"
            :title="$t('users.delete.title')"
            :message="deleteMessage"
            :confirm-label="$t('users.delete.confirm')"
            :cancel-label="$t('users.form.cancel')"
            @confirm="deleteUser"
            @cancel="userToDelete = null"
        />
    </div>
</template>

<style lang="scss" scoped>
.settings-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 960px;
    padding: 32px 36px;
}

.users {
    width: 100%;
    overflow: hidden;
    border: 1px solid var(--color-divider);
    border-radius: 10px;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;

    &__col-role {
        width: 140px;
    }

    &__col-actions {
        width: 170px;
    }

    th,
    td {
        padding: 12px 16px;
        border-bottom: 1px solid var(--color-divider);
        text-align: left;
        vertical-align: middle;
    }

    tbody tr:last-child td {
        border-bottom: none;
    }

    th {
        padding-top: 10px;
        padding-bottom: 10px;
        background: var(--color-bg);
        color: var(--color-text-muted);
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    &__hidden-label {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }

    &__person {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
    }

    &__name {
        overflow: hidden;
        font-size: 13.5px;
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__self {
        color: var(--color-text-muted);
        font-weight: 400;
    }

    &__login {
        overflow: hidden;
        color: var(--color-text-secondary);
        font-family: var(--font-mono);
        font-size: 12.5px;
        text-overflow: ellipsis;
    }

    &__role {
        padding: 2px 8px;
        border-radius: var(--radius-pill);
        background: var(--color-hover);
        color: var(--color-text-secondary);
        font-size: 11.5px;
        font-weight: 500;

        &--admin {
            background: var(--color-css-user-bg);
            color: var(--color-css-user);
        }
    }

    &__last-login {
        color: var(--color-text-muted);
        font-size: 12.5px;
    }

    &__actions {
        display: flex;
        justify-content: flex-end;
        gap: 6px;
    }

    &__delete {
        color: var(--color-danger);

        &:hover {
            border-color: var(--color-danger);
            color: var(--color-danger);
        }
    }
}
</style>
