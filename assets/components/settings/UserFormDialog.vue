<script setup>
import { computed, ref } from 'vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import FormField from '@/components/ui/FormField.vue';
import SegmentedControl from '@/components/ui/SegmentedControl.vue';
import { t } from '@/i18n';
import { UserRole } from '@/stores/user';
import { useUsersStore } from '@/stores/users';

const props = defineProps({
    user: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(['close']);

const usersStore = useUsersStore();

const isNew = computed(() => props.user === null);
const form = ref({
    name: props.user?.name ?? '',
    login: props.user?.login ?? '',
    role: props.user?.role ?? UserRole.USER,
    password: '',
    passwordRepeat: '',
});
const error = ref('');

const roleOptions = [
    { value: UserRole.USER, label: t('user.roles.user') },
    { value: UserRole.ADMIN, label: t('user.roles.admin') },
];

function validate() {
    const { name, login, password, passwordRepeat } = form.value;

    if (!name.trim() || !login.trim()) {
        return t('users.form.errors.required');
    }
    if (isNew.value && !password) {
        return t('users.form.errors.password_required');
    }
    if (password !== passwordRepeat) {
        return t('users.form.errors.password_mismatch');
    }
    if (usersStore.isLoginTaken(login.trim(), props.user?.id)) {
        return t('users.form.errors.login_taken');
    }

    return '';
}

async function save() {
    error.value = validate();

    if (error.value) {
        return;
    }

    const data = { name: form.value.name.trim(), login: form.value.login.trim(), role: form.value.role };

    if (isNew.value) {
        await usersStore.create(data);
    } else {
        await usersStore.update(props.user.id, data);
    }

    emit('close');
}
</script>

<template>
    <BaseDialog
        :title="isNew ? $t('users.form.title_new') : $t('users.form.title_edit')"
        :width="440"
        @close="emit('close')"
    >
        <form id="user-form" class="user-form" novalidate @submit.prevent="save">
            <FormField :label="$t('user.name.label', {}, 'fields')">
                <BaseInput v-model="form.name" autocomplete="off" autofocus />
            </FormField>
            <FormField :label="$t('user.login.label', {}, 'fields')">
                <BaseInput v-model="form.login" monospace autocomplete="off" />
            </FormField>
            <FormField :label="$t('user.role.label', {}, 'fields')">
                <SegmentedControl v-model="form.role" :options="roleOptions" class="user-form__roles" />
            </FormField>
            <div class="user-form__passwords">
                <FormField
                    :label="
                        isNew ? $t('user.password.label', {}, 'fields') : $t('user.password.new_label', {}, 'fields')
                    "
                >
                    <BaseInput
                        v-model="form.password"
                        type="password"
                        autocomplete="new-password"
                        :placeholder="isNew ? '' : $t('user.password.unchanged', {}, 'fields')"
                    />
                </FormField>
                <FormField :label="$t('user.password_repeat.label', {}, 'fields')">
                    <BaseInput v-model="form.passwordRepeat" type="password" autocomplete="new-password" />
                </FormField>
            </div>
            <p v-if="error" class="user-form__error" role="alert">{{ error }}</p>
        </form>

        <template #footer>
            <BaseButton size="md" @click="emit('close')">{{ $t('users.form.cancel') }}</BaseButton>
            <BaseButton variant="primary" size="md" type="submit" form="user-form">
                {{ $t('users.form.save') }}
            </BaseButton>
        </template>
    </BaseDialog>
</template>

<style lang="scss" scoped>
.user-form {
    display: flex;
    flex-direction: column;
    gap: 14px;

    &__roles {
        :deep(.segmented__option) {
            flex: 1;
            height: 30px;
            font-size: 12.5px;
        }
    }

    &__passwords {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    &__error {
        margin: 0;
        color: var(--color-danger);
        font-size: 13px;
    }
}
</style>
