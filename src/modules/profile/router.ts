export default [
    {
        path: '/profile',
        redirect: { name: 'ProfileAccountDetail' },
        component: () => import(/* webpackChunkName: "app-profile" */ '@/modules/profile/views/Profile.vue'),
        children: [
            {
                path: 'account-default',
                name: 'ProfileAccountDetail',
                component: () =>
                    import(
                        /* webpackChunkName: "app-profile-account" */ '@/modules/profile/views/ProfileAccountDetail.vue'
                    ),
            },
            {
                path: 'notification',
                name: 'ProfileNotification',
                component: () =>
                    import(
                        /* webpackChunkName: "app-profile-noti" */ '@/modules/profile/views/ProfileNotification.vue'
                    ),
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'Error404' },
        component: () =>
            import(/* webpackChunkName: "Error404" */ '@/modules/error/views/Error404.vue'),
    },
];