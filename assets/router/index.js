import { createRouter, createWebHistory } from 'vue-router';
import NotesLayout from '@/layouts/NotesLayout.vue';
import HomeView from '@/views/HomeView.vue';

export default createRouter({
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
                },
                {
                    path: 'users',
                    name: 'settings-users',
                    component: () => import('@/views/settings/SettingsUsersView.vue'),
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
