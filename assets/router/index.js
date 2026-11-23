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
                {
                    path: 'notes/:id',
                    name: 'note',
                    component: () => import('@/views/NoteView.vue'),
                    props: true,
                },
            ],
        },
        {
            path: '/settings',
            component: () => import('@/layouts/SettingsLayout.vue'),
            meta: { requiresAdmin: true },
            children: [
                {
                    path: '',
                    name: 'settings',
                    redirect: { name: 'settings-users' },
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

router.beforeEach((to) => {
    if (to.matched.some((route) => route.meta.requiresAdmin) && !useUserStore().isAdmin) {
        return { name: 'home' };
    }
});

export default router;
