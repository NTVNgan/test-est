export default [
    {
        path: '/signin',
        name: 'SignIn',
        component: () => import(/* webpackChunkName: "auth-sign-in" */ '@/modules/auth/views/AuthSignIn.vue'),
        meta: { transition: 'slide-fade-right', layout: 'AuthLayout' },
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: () => import(/* webpackChunkName: "auth-signup" */ '@/modules/auth/views/AuthSignUp.vue'),
        meta: { transition: 'slide-fade-right', layout: 'AuthLayout' },
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () =>
            import(/* webpackChunkName: "auth-forgot-pass" */ '@/modules/auth/views/AuthForgotPassword.vue'),
        meta: { transition: 'slide-fade-right', layout: 'AuthLayout' },
    },
    {
        path: '/set-new-password',
        name: 'SetNewPassword',
        component: () => import(/* webpackChunkName: "auth-new-pass" */ '@/modules/auth/views/AuthSetNewPassword.vue'),
        meta: { transition: 'slide-fade-right', layout: 'AuthLayout' },
    },
    {
        path: '/setting-org',
        name: 'InputCompanyName',
        component: () => import(/* webpackChunkName: "auth-forgot-pass" */ '@/modules/auth/views/AuthOrgName.vue'),
        meta: { transition: 'slide-fade-right', layout: 'AuthLayout' },
    },
    {
        path: '/create-password',
        name: 'CreatePassword',
        component: () => import(/* webpackChunkName: "auth-signup" */ '@/modules/auth/views/AuthCreatePassword.vue'),
        meta: { transition: 'slide-fade-right', layout: 'AuthLayout' },
    },
    {
        path: '/invite-teammate',
        name: 'InviteTeammate',
        component: () =>
            import(/* webpackChunkName: "auth-invite-teammate" */ '@/modules/auth/views/AuthInviteTeammate.vue'),
        meta: { transition: 'slide-fade-right', layout: 'AuthLayout' },
    },
    {
        path: '',
        redirect: { name: 'SignIn' },
        component: () => import(/* webpackChunkName: "auth-sign-in" */ '@/modules/auth/views/AuthSignIn.vue'),
        meta: { transition: 'slide-fade-right', layout: 'AuthLayout' },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'Error404' },
        component: () => import(/* webpackChunkName: "Error404" */ '@/modules/error/views/Error404.vue'),
    },
];
