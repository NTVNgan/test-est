<template>
    <div class="flex flex-1 min-w-0">
        <submenu-component
            :showCount="false"
            :heading="$t('setting.setting_title')"
            :navLink="permissionSubmenu"
            :showSubmenu="true"
            @change="clickSubMenu"
        />
        <div class="h-full min-w-0 flex-1 flex bg-white shadow-deep-1 rounded-l-8p relative">
            <div class="w-100% h-full relative flex flex-col">
                <transition-router-view />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import SubmenuComponent from '@/components/ui/SubmenuComponent.vue';
import { computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import TransitionRouterView from '@/components/TransitionRouterView.vue';
import { store } from '@/store';
import { useSocket } from '@/composables/useSocket';
import { useRouter } from 'vue-router';
import permissions from '@/constant/permissions';

const {
    INVITE_MANAGE_TEAMMATE,
    INSTALL_WIDGET,
    MANAGE_CONTACTS,
    MANAGE_ATTRIBUTE,
    MANAGE_DATA_TAGS_SEGMENT,
    MANAGE_CHAT_WIDGET_SETTINGS,
} = permissions;

export default {
    name: 'Setting',
    components: {
        SubmenuComponent,
        TransitionRouterView,
    },
    setup() {
        const { t } = useI18n();
        const currentUser = computed(() => store.state.auth.user);

        const workspaceName = computed(() => {
            if (typeof currentUser.value.workspace.name != 'undefined') return currentUser.value.workspace.name;
            return '';
        });

        const routeList = ref<Array<any>>([
            {
                label: t('setting.installation_title'),
                name: 'SettingInstallation',
                permissions: [INSTALL_WIDGET],
            },
            {
                label: t('setting.chat_widget_title'),
                name: 'SettingChatWidget',
                permissions: [MANAGE_CHAT_WIDGET_SETTINGS],
            },
            {
                label: workspaceName.value + ' data',
                name: 'WorkspaceData',
                expand: false,
                submenu: [
                    {
                        label: 'Import History',
                        name: 'ImportHistory',
                        permissions: [MANAGE_CONTACTS],
                    },
                    {
                        label: 'Contact Attributes',
                        name: 'ContactAttribute',
                        permissions: [MANAGE_ATTRIBUTE],
                    },
                    {
                        label: 'Tags',
                        name: 'Tag',
                        permissions: [],
                    },
                    {
                        label: t('setting.contact_segment_title'),
                        name: 'ContactSegment',
                        permissions: [MANAGE_DATA_TAGS_SEGMENT],
                    },
                    {
                        label: 'Canned Responses',
                        name: 'CannedResponses',
                        permissions: [MANAGE_CONTACTS],
                    },
                ],
                childOfSubmenu: [
                    { name: 'CannedResponsesList' },
                    { name: 'CannedResponseCreate' },
                    { name: 'CannedResponseEdit' },
                ],
                permissions: [MANAGE_CONTACTS, MANAGE_ATTRIBUTE],
            },
            {
                label: t('setting.teammates_title'),
                name: 'SettingTeammates',
                permissions: [INVITE_MANAGE_TEAMMATE],
            },
            {
                label: 'Email configuration',
                name: 'SettingEmailConfiguration',
                permissions: [INSTALL_WIDGET],
            },
        ]);

        const { socket } = useSocket();
        const router = useRouter();
        const emitter: any = inject('emitter');

        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        const permissionSubmenu = computed(() => {
            if (!userStore.value) return [];
            else if (userStore.value?.permission_group && !userStore.value.is_root) {
                const allowFeauture = Object.values(userStore.value.permission_group);
                const menu = routeList.value.filter((sidebarItem: any) =>
                    sidebarItem.permissions.some((permission: any) => allowFeauture.includes(permission)),
                );
                if (menu.length > 0) {
                    menu.forEach((m: any) => {
                        if (m.submenu) {
                            m.submenu = m.submenu.filter((sidebarItem: any) => {
                                if (sidebarItem.permissions.length === 0) return true;
                                return sidebarItem.permissions.some((permission: any) =>
                                    allowFeauture.includes(permission),
                                );
                            });
                        }
                    });
                }
                return menu;
            } else return routeList.value;
        });

        const clickSubMenu = (data: any, index: any) => {
            const labelMenuClicked = permissionSubmenu.value[index]['label'];
            const findIndexMenu = routeList.value.findIndex((r: any) => r.label === labelMenuClicked);
            if (
                typeof routeList.value[findIndexMenu] != 'undefined' &&
                typeof routeList.value[findIndexMenu]['expand'] != 'undefined'
            )
                routeList.value[findIndexMenu]['expand'] = !routeList.value[findIndexMenu]['expand'];
        };

        emitter.on('dotStatusUser', (data: any) => {
            const params = {
                workspace_id: store.state.auth.user.workspace_id,
                user_id: store.state.auth.user._id,
            };
            if (data === 5) {
                socket.emit('sendIdleStatus', params);
            } else if (data === 1) {
                socket.emit('sendOnlineStatus', params);
            }
        });

        return {
            routeList,
            clickSubMenu,
            permissionSubmenu,
        };
    },
};
</script>
