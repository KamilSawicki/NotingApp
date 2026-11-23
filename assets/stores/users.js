import { ref } from 'vue';
import { defineStore } from 'pinia';
import { UserRole, useUserStore } from '@/stores/user';

const SAMPLE_USERS = [
    { id: 'u1', name: 'Anna Kowal', login: 'anna', role: UserRole.ADMIN, lastLoginAt: '2026-11-23T09:12:00+01:00' },
    { id: 'u2', name: 'Piotr Nowak', login: 'piotr', role: UserRole.USER, lastLoginAt: '2026-11-22T17:40:00+01:00' },
    {
        id: 'u3',
        name: 'Marta Zielińska',
        login: 'marta',
        role: UserRole.USER,
        lastLoginAt: '2026-11-18T08:05:00+01:00',
    },
];

export const useUsersStore = defineStore('users', () => {
    const userStore = useUserStore();

    const users = ref(SAMPLE_USERS);

    function isLoginTaken(login, exceptId = null) {
        return users.value.some((user) => user.login === login && user.id !== exceptId);
    }

    async function create({ name, login, role }) {
        users.value.push({ id: crypto.randomUUID(), name, login, role, lastLoginAt: null });
    }

    async function update(id, { name, login, role }) {
        const user = users.value.find((item) => item.id === id);

        Object.assign(user, { name, login, role });

        if (id === userStore.user.id) {
            Object.assign(userStore.user, { name, login, role });
        }
    }

    async function remove(id) {
        users.value = users.value.filter((user) => user.id !== id);
    }

    return { users, isLoginTaken, create, update, remove };
});
