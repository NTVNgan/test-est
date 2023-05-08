<template>
    <div class="h-full flex flex-col bg-gray-100">
        <header-component>
            <layout-app-dropdown-notification />
            <dropdown-component v-click-outside="hideInfo" class="dropdown-header">
                <template v-slot:header>
                    <button
                        @click="toggleInfo"
                        class="
                            avatar-user
                            h-36
                            w-36
                            p-2p
                            rounded-50%
                            hover:bg-neutrals-50
                            focus:bg-neutrals-100 focus:outline-none
                        "
                    >
                        <template v-if="userStore && userStore.avatar_src">
                            <avatar-component
                                :image="envURL + '/' + userStore.avatar_src"
                                size="small"
                                :bgAvatar="userStore && userStore.avatar_bg"
                                :online="userStore && isStatusDot"
                            />
                        </template>
                        <template v-else>
                            <avatar-component
                                size="small"
                                :label-avatar="userStore && userStore.username"
                                :bgAvatar="userStore && userStore.avatar_bg"
                                :online="userStore && isStatusDot"
                            />
                        </template>
                    </button>
                </template>
                <template v-slot:list>
                    <div
                        class="w-244 top-100 right-0 z-999 rounded-4p shadow-deep-1 bg-white focus:outline-none"
                        role="none"
                        v-if="showInfo"
                    >
                        <div class="avatar-user p-16p border-b">
                            <template v-if="userStore && userStore.avatar_src">
                                <avatar-component
                                    :image="envURL + '/' + userStore.avatar_src"
                                    size="medium"
                                    :bgAvatar="userStore && userStore.avatar_bg"
                                    :label-avatar="userStore.username"
                                    label-show
                                    :online="userStore && isStatusDot"
                                />
                            </template>
                            <template v-else>
                                <avatar-component
                                    size="medium"
                                    :label-avatar="userStore && userStore.username"
                                    :bgAvatar="userStore && userStore.avatar_bg"
                                    label-show
                                    :online="userStore && isStatusDot"
                                />
                            </template>
                        </div>
                        <div class="py-12p px-20p border-b">
                            <p class="text-14 text--break font-medium">
                                {{ userStore && userStore.organization.name }}
                            </p>
                            <p class="text-12 text--break">{{ userStore && userStore.workspace.name }}</p>
                        </div>
                        <div class="pl-8p pr-8p pt-14p pb-8p">
                            <router-link
                                :to="{ name: 'ProfileAccountDetail' }"
                                class="
                                    flex
                                    items-center
                                    outline-none
                                    item
                                    block
                                    px-12p
                                    py-8p
                                    text-14 text-neutrals-900
                                    rounded
                                    border border-primary-transparent
                                    hover:bg-neutrals-50
                                "
                                role="menuitem"
                                @click="showInfo = false"
                            >
                                <icon-component class="mr-12p" name="person" color="neutrals-500" />Your account
                            </router-link>
                            <a
                                class="
                                    flex
                                    items-center
                                    outline-none
                                    item
                                    block
                                    px-12p
                                    py-8p
                                    text-14 text-primary-500
                                    rounded
                                    border border-primary-transparent
                                    hover:bg-neutrals-50
                                "
                                role="menuitem"
                                @click="clickLogout"
                            >
                                <icon-component class="mr-12p" name="sign-out" color="primary-500" />Log out
                            </a>
                        </div>
                    </div>
                </template>
            </dropdown-component>
        </header-component>
        <div class="flex flex-1 content__wrapper">
            <sidebar-component :navLink="permissionSidebar" />
            <transition-router-view v-if="userStore" />
        </div>
        <layout-auth-modal-roles-change v-if="isShowRolesChange" :role="roleChange" />
        <div class="popup-session absolute w-full h-full" v-if="isShowPopupSession">
            <modal-component :closeIcon="false" confirm v-model="pictureSingleType">
                <template v-slot:body>
                    <div class="flex flex-col items-center">
                        <span class="font-heading font-semibold text-24 mt-8p">Oops!</span>
                        <div class="text-14 text-center mt-16p">
                            We notice a new login.
                            <br />You can continue working with your new account.
                        </div>
                        <div class="flex justify-end mt-16p">
                            <button-comp size="medium" @click="reloadPage">Got it</button-comp>
                        </div>
                    </div>
                </template>
            </modal-component>
        </div>
    </div>
</template>

<script lang="ts">
import { useAuth } from '@/modules/auth/composables/useAuth';
import { ref, computed, watch, inject, onMounted, provide } from 'vue';
import HeaderComponent from '@/components/ui/HeaderComponent.vue';
import SidebarComponent from '@/components/ui/SidebarComponent.vue';
import TransitionRouterView from '@/components/TransitionRouterView.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import DropdownComponent from '@/components/ui/DropdownComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { RouterLink } from '@/types/router-name';
import { store } from '@/store';
import { useRouter } from 'vue-router';
import { useSocket } from '@/composables/useSocket';
import LayoutAuthModalRolesChange from '@/components/LayoutAuthModalRolesChange.vue';
import LayoutAppDropdownNotification from '@/components/LayoutAppDropdownNotification.vue';
import { showPopupOutSession } from '@/plugins/axios';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ButtonComp from '@/components/ui/ButtonComponent.vue';
import { useRole } from '@/composables/useRole';
import { useSocketAction } from '@/composables/useSocketAction';
import permissions from '@/constant/permissions';
const { INVITE_MANAGE_TEAMMATE, INSTALL_WIDGET, MANAGE_INBOX, VIEW_INBOX, MANAGE_CONTACTS, MANAGE_ATTRIBUTE } =
    permissions;

export default {
    name: 'LayoutApp',
    components: {
        LayoutAppDropdownNotification,
        LayoutAuthModalRolesChange,
        SidebarComponent,
        HeaderComponent,
        TransitionRouterView,
        AvatarComponent,
        DropdownComponent,
        IconComponent,
        ModalComponent,
        ButtonComp,
    },
    setup() {
        const sidebarNav = ref<RouterLink[]>([
            {
                label: 'Inbox',
                name: 'Inbox',
                icon: 'Inbox',
                permissions: [MANAGE_INBOX, VIEW_INBOX],
            },
            {
                label: 'Contact',
                name: 'Contact',
                icon: 'Person',
                permissions: [MANAGE_CONTACTS],
            },
            {
                label: 'Articles',
                name: 'Article',
                icon: 'Book',
                permissions: [MANAGE_CONTACTS],
            },
            {
                label: 'Settings',
                name: 'Setting',
                icon: 'Cog',
                permissions: [INVITE_MANAGE_TEAMMATE, INSTALL_WIDGET, MANAGE_CONTACTS, MANAGE_ATTRIBUTE],
            },
        ]);
        const emitter: any = inject('emitter');
        const envURL = process.env.VUE_APP_FILE_URL;
        const router = useRouter();
        const { socket, clearSocket } = useSocket();
        const isShowRolesChange = ref(false);
        const isShowPopupSession = ref(false);
        const pictureSingleType = ref(true);
        const roleChange = ref(null);
        const { roles, loading: loadingRoute, getRole } = useRole();
        const { logout, error, loading } = useAuth();
        const { dispatchIncomingRoleChangeSocket, addActionRoleChange } = useSocketAction();
        const showInfo = ref(false);
        const toggleInfo = () => {
            showInfo.value = !showInfo.value;
        };

        const hideInfo = () => {
            showInfo.value = false;
        };

        const clickLogout = () => {
            clearSocket();
            emitter.all.clear();
            logout();
        };

        const reloadPage = () => {
            location.reload();
        };

        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        const permissionSidebar = computed(() => {
            //NOTE: the else if (userStore.value.permission_group.length > 0) statement below is just for testing (FLB-920), remove it when testing done
            if (!userStore.value) return [];
            else if (userStore.value?.permission_group && !userStore.value.is_root) {
                const allowFeauture = Object.values(userStore.value.permission_group);
                return sidebarNav.value.filter((sidebarItem: any) =>
                    sidebarItem.permissions.some((permission: any) => allowFeauture.includes(permission)),
                );
            } else return sidebarNav.value;
        });

        const timer = ref<any>(60 * 10);

        const isStatusDot = ref<number>(userStore.value && userStore.value.online_status);

        emitter.on('dotStatusIncommingMessage', (data: number) => {
            if (data) {
                if (timer.value == 'time it') {
                    emitter.emit('dotStatusUser', 1);
                }
            }
            // emitter.emit('dotStatusUser', data);
            isStatusDot.value = data;
            timer.value = 60 * 10;
        });

        onMounted(async () => {
            setInterval(() => {
                if (typeof timer.value == 'number') {
                    timer.value -= 1;
                }
            }, 1000);

            if (userStore.value) {
                // socket.off('incomingUserOnlineStatus').on('incomingUserOnlineStatus', (data: any) => {
                //     isStatusDot.value = data.online_status;
                // });
                await dispatchIncomingRoleChangeSocket();
                addActionRoleChange((data: any) => {
                    isShowRolesChange.value =
                        userStore.value._id === data.user_id && userStore.value.workspace_id === data.workspace_id;
                });
                emitter.on('changeRoles', ({ role_id }: any) => {
                    isShowRolesChange.value = roleChange.value = roles.value.find(
                        (item: any) => item._id === role_id,
                    ).name;
                });
                // socket.off('incomingRoleChange').on('incomingRoleChange', (data: any) => {});
                // socket.off('user.delete.complete').on('user.delete.complete', (data: any) => {
                //     console.log('user.delete.complete',{data,userStore})
                //     console.log(userStore.value._id,data.data.user_id)
                //     if (userStore.value._id === data.data.user_id) logout();
                // });
            }
        });

        emitter.on('sendStatusUser', (data: number) => {
            // console.log('sendStatusUser', data);
            isStatusDot.value = data;
        });

        watch(
            () => timer.value,
            (newVal) => {
                if (newVal < 0) {
                    timer.value = 'time it';
                    isStatusDot.value = 5;
                    emitter.emit('dotStatusUser', 5);
                }
            },
        );

        watch(router.currentRoute, () => {
            if (timer.value == 'time it') {
                emitter.emit('dotStatusUser', 1);
                isStatusDot.value = 1;
            } else {
                isStatusDot.value = 1;
            }
            timer.value = 60 * 10;
        });

        watch(
            () => showPopupOutSession.value,
            (newVal) => {
                isShowPopupSession.value = newVal;
                console.log('showPopupOutSession', showPopupOutSession);
            },
        );

        return {
            logout,
            showInfo,
            toggleInfo,
            hideInfo,
            sidebarNav,
            userStore,
            clickLogout,
            envURL,
            isStatusDot,
            timer,
            isShowRolesChange,
            isShowPopupSession,
            pictureSingleType,
            reloadPage,
            roleChange,
            permissionSidebar,
            // minutesAndSeconds
        };
    },
};
</script>

<style lang="scss">
.header__noti {
    :deep(svg) {
        fill: #6b6b7b !important;
    }
}
.content__wrapper {
    height: calc(100% - 58px);
}
.avatar-user {
    .avatar-content {
        img {
            border-radius: 50%;
            width: 100%;
        }
    }
}
.dropdown-header {
    .content-dropdown {
        right: 0;
    }
}
.popup-session {
    z-index: 999;
    .bg-white {
        width: 480px !important;
    }
}
.text--break {
    word-break: break-word;
    word-wrap: break-word;
}
</style>
