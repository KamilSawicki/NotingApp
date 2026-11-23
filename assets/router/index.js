import { createRouter, createWebHistory } from 'vue-router';
import NotesLayout from '@/layouts/NotesLayout.vue';
import HomeView from '@/views/HomeView.vue';
import { useUserStore } from '@/stores/user';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: NotesLayout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView,
                },
            ],
        },
        {
            path: '/settings',
            component: () => import('@/layouts/SettingsLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'settings',
                    redirect: { name: 'settings-style' },
                },
                {
                    path: 'style',
                    name: 'settings-style',
                    component: () => import('@/views/settings/SettingsStyleView.vue'),
                },
                {
                    path: 'app-style',
                    name: 'settings-app-style',
                    component: () => import('@/views/settings/SettingsAppStyleView.vue'),
                    meta: { requiresAdmin: true },
                },
                {
                    path: 'users',
                    name: 'settings-users',
                    component: () => import('@/views/settings/SettingsUsersView.vue'),
                    meta: { requiresAdmin: true },
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue'),
        },
    ],
});

router.beforeEach((to) => {
    if (to.meta.requiresAdmin && !useUserStore().isAdmin) {
        return { name: 'settings-style' };
    }
});

export default router;
