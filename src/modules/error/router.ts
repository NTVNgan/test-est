export default [
    {
        path: '/error',
        redirect: { name: 'Error' },
        component: () => import(/* webpackChunkName: "Error" */ '@/modules/error/views/Error.vue'),
        meta: { layout: 'ErrorLayout' },
        children: [
            {
                path: 'sample',
                name: 'Error',
                component: () =>
                    import(/* webpackChunkName: "ErrorSample" */ '@/modules/error/views/ErrorSample.vue'),
            },
            {
                path: '404',
                name: 'Error404',
                component: () =>
                    import(/* webpackChunkName: "Error404" */ '@/modules/error/views/Error404.vue'),
            },
            {
                path: '500',
                name: 'Error500',
                component: () =>
                    import(/* webpackChunkName: "Error500" */ '@/modules/error/views/Error500.vue'),
            },
            {
                path: 'access-dennied',
                name: 'ErrorAccessDenied',
                component: () =>
                    import(/* webpackChunkName: "Error500" */ '@/modules/error/views/ErrorAccessDenied.vue'),
            },
        ],
    },
]