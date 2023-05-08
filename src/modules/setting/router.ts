import permissions from '@/constant/permissions';
import permissionsMiddleWare from '@/middlewares/permission';

const {
    INVITE_MANAGE_TEAMMATE,
    INSTALL_WIDGET,
    MANAGE_CONTACTS,
    MANAGE_ATTRIBUTE,
    MANAGE_DATA_TAGS_SEGMENT,
    MANAGE_CHAT_WIDGET_SETTINGS,
} = permissions;

export default [
    {
        path: '/setting',
        name: 'Setting',
        meta: {
            permissions: [
                INVITE_MANAGE_TEAMMATE,
                INSTALL_WIDGET,
                MANAGE_CONTACTS,
                MANAGE_ATTRIBUTE,
                MANAGE_DATA_TAGS_SEGMENT,
                MANAGE_CHAT_WIDGET_SETTINGS,
            ],
            middleware: [permissionsMiddleWare],
        },
        component: () => import(/* webpackChunkName: "Setting" */ '@/modules/setting/views/Setting.vue'),
        redirect: { name: 'SettingInstallation' },
        children: [
            {
                path: 'installation',
                name: 'SettingInstallation',
                meta: {
                    permissions: [INSTALL_WIDGET],
                    middleware: [permissionsMiddleWare],
                },
                component: () =>
                    import(
                        /* webpackChunkName: "SettingInstallation" */ '@/modules/setting/views/SettingInstallation.vue'
                    ),
            },
            {
                path: 'chat-widget',
                name: 'SettingChatWidget',
                meta: {
                    permissions: [MANAGE_CHAT_WIDGET_SETTINGS],
                    middleware: [permissionsMiddleWare],
                },
                component: () =>
                    import(/* webpackChunkName: "SettingChatWidget" */ '@/modules/setting/views/SettingChatWidget.vue'),
            },
            {
                path: 'teammates',
                name: 'SettingTeammates',
                meta: {
                    permissions: [INVITE_MANAGE_TEAMMATE],
                    middleware: [permissionsMiddleWare],
                },
                component: () =>
                    import(/* webpackChunkName: "SettingTeammate" */ '@/modules/setting/views/SettingTeammate.vue'),
            },
            {
                path: 'workspace_data',
                name: 'WorkspaceData',
                meta: {
                    permissions: [MANAGE_CONTACTS, MANAGE_DATA_TAGS_SEGMENT, MANAGE_ATTRIBUTE],
                    middleware: [permissionsMiddleWare],
                },
                component: () =>
                    import(/* webpackChunkName: "SettingTeammate" */ '@/components/TransitionRouterView.vue'),
                redirect: { name: 'ImportHistory' },
                children: [
                    {
                        path: 'import_history',
                        name: 'ImportHistory',
                        meta: {
                            permissions: [MANAGE_CONTACTS],
                            middleware: [permissionsMiddleWare],
                        },
                        component: () =>
                            import(
                                /* webpackChunkName: "ImportHistory" */ '@/modules/setting/views/SettingWorkspaceData/SettingImportHistory.vue'
                            ),
                    },
                    {
                        path: 'contact_attribute',
                        name: 'ContactAttribute',
                        meta: {
                            permissions: [MANAGE_ATTRIBUTE],
                            middleware: [permissionsMiddleWare],
                        },
                        component: () =>
                            import(
                                /* webpackChunkName: "ContactAttribute" */ '@/modules/setting/views/SettingWorkspaceData/SettingContactAttribute.vue'
                            ),
                    },
                    {
                        path: 'tag',
                        name: 'Tag',
                        component: () =>
                            import(
                                /* webpackChunkName: "ContactAttribute" */ '@/modules/setting/views/SettingWorkspaceData/SettingTag.vue'
                            ),
                    },
                    {
                        path: 'contact-segment',
                        name: 'ContactSegment',
                        meta: {
                            permissions: [MANAGE_DATA_TAGS_SEGMENT],
                            middleware: [permissionsMiddleWare],
                        },
                        component: () =>
                            import(
                                /* webpackChunkName: "ContactSegment" */ '@/modules/setting/views/SettingWorkspaceData/SettingContactSegment.vue'
                            ),
                    },

                    {
                        path: 'canned-responses',
                        name: 'CannedResponses',
                        meta: {
                            permissions: [MANAGE_CONTACTS],
                            middleware: [permissionsMiddleWare],
                        },
                        component: () =>
                            import(/* webpackChunkName: "SettingTeammate" */ '@/components/TransitionRouterView.vue'),
                        redirect: { name: 'CannedResponsesList' },
                        children: [
                            {
                                path: 'list',
                                name: 'CannedResponsesList',
                                meta: {
                                    permissions: [MANAGE_CONTACTS],
                                    middleware: [permissionsMiddleWare],
                                },
                                component: () =>
                                    import(
                                        /* webpackChunkName: "CannedResponseCreate" */ '@/modules/setting/views/SettingWorkspaceData/SettingCannedResponses.vue'
                                    ),
                            },
                            {
                                path: 'create',
                                name: 'CannedResponseCreate',
                                meta: {
                                    permissions: [MANAGE_CONTACTS],
                                    middleware: [permissionsMiddleWare],
                                },
                                component: () =>
                                    import(
                                        /* webpackChunkName: "CannedResponseCreate" */ '@/modules/setting/views/SettingWorkspaceData/SettingCannedResponseCreate.vue'
                                    ),
                            },
                            {
                                path: 'edit/:id',
                                name: 'CannedResponseEdit',
                                meta: {
                                    permissions: [MANAGE_CONTACTS],
                                    middleware: [permissionsMiddleWare],
                                },
                                component: () =>
                                    import(
                                        /* webpackChunkName: "CannedResponseCreate" */ '@/modules/setting/views/SettingWorkspaceData/SettingCannedResponseEdit.vue'
                                    ),
                            },
                        ],
                    },
                ],
            },
            {
                path: 'email_configuration',
                name: 'SettingEmailConfiguration',
                component: () =>
                    import(/* webpackChunkName: "SettingEmailConfiguration" */ '@/modules/setting/views/SettingEmailConfiguration/SettingEmailConfiguration.vue'),
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'Error404' },
        component: () => import(/* webpackChunkName: "Error404" */ '@/modules/error/views/Error404.vue'),
    },
];
