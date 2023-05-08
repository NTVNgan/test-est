import permissions from '@/constant/permissions'
import permissionsMiddleWare from '@/middlewares/permission'

const { MANAGE_CONTACTS } = permissions;
export default [
    {
        path: '/contact',
        name: 'Contact',
        redirect: { name: 'ContactList' },
        meta: {
            permissions: [MANAGE_CONTACTS],
            middleware: [permissionsMiddleWare]
        },
        component: () => import(/* webpackChunkName: "Contact" */ '@/modules/contact/views/Contact.vue'),
        children: [
            {
                path: 'list/',
                name: 'ContactList',
                meta: {
                    permissions: [MANAGE_CONTACTS],
                    middleware: [permissionsMiddleWare]
                },
                component: () =>
                    import(/* webpackChunkName: "ContactList" */ '@/modules/contact/views/ContactList.vue'),
                children: [
                    {
                        path: 'segment/:segmentId?',
                        name: 'ContactListBySegment',
                        query: { showFilter: false },
                        meta: {
                            permissions: [MANAGE_CONTACTS],
                            middleware: [permissionsMiddleWare]
                        },
                        component: () =>
                            import(/* webpackChunkName: "ContactListBySegment" */ '@/modules/contact/components/ContactListBySegment.vue'),
                    },
                    {
                        path: 'search',
                        name: 'ContactListBySearch',
                        meta: {
                            permissions: [MANAGE_CONTACTS],
                            middleware: [permissionsMiddleWare]
                        },
                        component: () =>
                            import(/* webpackChunkName: "ContactListBySearch" */ '@/modules/contact/components/ContactListBySearch.vue'),
                    },
                ]
            },
            {
                path: 'detail/:contactId?',
                name: 'ContactDetail',
                meta: {
                    permissions: [MANAGE_CONTACTS],
                    middleware: [permissionsMiddleWare]
                },
                component: () =>
                    import(/* webpackChunkName: "ContactDetail" */ '@/modules/contact/views/ContactDetail.vue'),
            },
        ],
    },
];