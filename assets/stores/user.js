import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const UserRole = Object.freeze({
    ADMIN: 'admin',
    USER: 'user',
});

const SAMPLE_USER = { id: 'u1', name: 'Anna Kowal', login: 'anna', role: UserRole.ADMIN };

export const useUserStore = defineStore('user', () => {
    const user = ref(SAMPLE_USER);

    const isAdmin = computed(() => user.value.role === UserRole.ADMIN);

    return { user, isAdmin };
});
