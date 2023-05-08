import Inbox from '@/modules/inbox/views/Inbox.vue';
import permissions from '@/constant/permissions'
import permissionsMiddleWare from '@/middlewares/permission'

const { MANAGE_INBOX, VIEW_INBOX } = permissions;

export default [
    {
        path: '/inbox',
        name: 'Inbox',
        component: Inbox,
        redirect: { name: 'InboxGroups' },
        meta: {
            permissions: [MANAGE_INBOX, VIEW_INBOX],
            middleware: [permissionsMiddleWare]
        },
        children: [
            {
                path: 'groups/:name?/:conversation?',
                name: 'InboxGroups',
                meta: {
                    permissions: [MANAGE_INBOX, VIEW_INBOX],
                    middleware: [permissionsMiddleWare]
                },
                component: () => import(/* webpackChunkName: "app-inbox" */ '@/modules/inbox/views/Inbox.vue'),
            },
            {
                path: 'search',
                name: 'InboxSearch',
                meta: {
                    permissions: [MANAGE_INBOX, VIEW_INBOX],
                    middleware: [permissionsMiddleWare]
                },
                component: () => import(/* webpackChunkName: "app-inbox" */ '@/modules/inbox/views/Inbox.vue'),
            },
            {
                path: '/:pathMatch(.*)*',
                redirect: { name: 'Error404' },
                component: () => import(/* webpackChunkName: "Error404" */ '@/modules/error/views/Error404.vue'),
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'Error404' },
        component: () => import(/* webpackChunkName: "Error404" */ '@/modules/error/views/Error404.vue'),
    },
];
