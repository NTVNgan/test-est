<template>
    <new-dropdown-component
        v-model="showNotification"
        class="ml-auto mr-6p"
        :paddingRange="6"
        width="385px"
        position="bottom-left"
    >
        <div
            class="relative h-36 w-36 flex items-center justify-center rounded-full hover:bg-neutrals-50"
            :class="showNotification ? 'bg-neutrals-50' : ''"
        >
            <icon-component
                :color="showNotification ? 'primary-500' : 'neutrals-500'"
                :name="showNotification ? 'bellSolid' : 'bell'"
            />
            <badge-notification-component
                v-if="unreadTotal > 0"
                class="absolute top-1p right-1p select-none"
                :count="unreadTotal"
            />
        </div>
        <template #content>
            <div class="noti__wrapper font-body flex flex-col">
                <div
                    class="
                        noti__header
                        h-56
                        px-24p
                        py-16p
                        flex
                        justify-between
                        items-center
                        border-b border-neutrals-100
                    "
                >
                    <h2 class="text-16 font-medium uppercase">
                        {{ $t('setting.notification_title') }}
                        <span v-if="notifications !== null && notifications.length && unreadTotal > 0">
                            ({{ unreadTotal }})
                        </span>
                    </h2>
                    <button-component
                        v-if="notifications !== null && notifications.length"
                        @click="onReadAllNotification"
                        type="link"
                    >
                        {{ $t('setting.notification_mark_all_read') }}
                    </button-component>
                </div>
                <div class="noti__body flex-1 overflow-y-auto scrollbar--transparent" @scroll="handleScrollToBottom">
                    <template v-if="notifications !== null && notifications.length">
                        <div
                            class="noti__item min-w-0 relative p-16p flex border-b border-neutrals-100 cursor-pointer"
                            v-for="(item, index) in notifications"
                            :key="'noti-' + index"
                            :class="{ 'bg-neutrals-50': item.status === status.UNREAD }"
                            @click="onReadNotification(item)"
                        >
                            <div class="noti__item--avatar w-40">
                                <avatar-component
                                    v-if="[type.NEW_CONVO, type.NEW_REPLY].includes(item.type)"
                                    size="medium"
                                    showImageTiny
                                    showBackgroundCompulsory
                                    :image="
                                        item.contact_sender_data && item.contact_sender_data.avatar_src
                                            ? envContactURL + '/' + item.contact_sender_data.avatar_src
                                            : ''
                                    "
                                    :label-avatar="item.contact_sender_data && item.contact_sender_data.full_name"
                                    :bgAvatar="item.contact_sender_data && item.contact_sender_data.avatar_bg"
                                />
                                <avatar-component
                                    v-if="
                                        [type.ASSIGNED, type.MENTIONED].includes(item.type) &&
                                        getUserInfoById(item.sender_id)
                                    "
                                    size="medium"
                                    :image="
                                        item.sender_id &&
                                        getUserInfoById(item.sender_id) &&
                                        getUserInfoById(item.sender_id).avatar_src
                                            ? envUserURL + '/' + getUserInfoById(item.sender_id).avatar_src
                                            : ''
                                    "
                                    :label-avatar="
                                        item.sender_id && getUserInfoById(item.sender_id)
                                            ? getUserInfoById(item.sender_id).username
                                            : ''
                                    "
                                    :bgAvatar="
                                        item.sender_id && getUserInfoById(item.sender_id)
                                            ? getUserInfoById(item.sender_id).avatar_bg
                                            : ''
                                    "
                                />
                                <avatar-component
                                    v-if="
                                        [type.ASSIGNED, type.MENTIONED].includes(item.type) &&
                                        !getUserInfoById(item.sender_id)
                                    "
                                    size="medium"
                                    userRemoved
                                />
                                <img
                                    v-if="
                                        [
                                            type.ARCHIVED,
                                            type.USER_DELETED,
                                            type.IMPORT_CONTACT,
                                            type.TRANSFER_CONVO,
                                        ].includes(item.type)
                                    "
                                    src="@/assets/images/logo-small.svg"
                                    alt="logo"
                                />
                            </div>
                            <div
                                class="noti__item--content flex flex-col pl-8p w-calc-100%-40p"
                                :class="{ 'pr-10p': item.status === status.UNREAD }"
                            >
                                <template v-if="item.type === type.NEW_CONVO">
                                    <h2 class="text-14" :class="{ 'font-medium': item.status === status.UNREAD }">
                                        {{ $t('setting.notification_new_conversation') }}
                                        <span class="text-primary-500">{{ item.contact_sender_data.full_name }}</span>
                                    </h2>
                                    <span
                                        class="h-16 w-full mt-8p text-12 inline-block text-neutrals-400 truncate"
                                        v-html="handleContent(item)"
                                    ></span>
                                    <p class="text-12 text-neutrals-300 mt-8p">
                                        {{ filters.formatTime(item.created_at, false) }}
                                    </p>
                                </template>
                                <template v-if="item.type === type.NEW_REPLY">
                                    <h2 class="text-14" :class="{ 'font-medium': item.status === status.UNREAD }">
                                        {{ $t('setting.notification_new_message') }}
                                        <span class="text-primary-500">{{ item.contact_sender_data.full_name }}</span>
                                    </h2>
                                    <span
                                        class="h-16 w-full mt-8p text-12 inline-block text-neutrals-400 truncate"
                                        v-html="handleContent(item)"
                                    ></span>
                                    <p class="text-12 text-neutrals-300 mt-8p">
                                        {{ filters.formatTime(item.created_at, false) }}
                                    </p>
                                </template>
                                <template v-if="item.type === type.ASSIGNED">
                                    <h2 class="text-14" :class="{ 'font-medium': item.status === status.UNREAD }">
                                        <span class="text-primary-500">
                                            {{
                                                getUserInfoById(item.sender_id)
                                                    ? getUserInfoById(item.sender_id).username
                                                    : item.sender_id
                                            }}
                                        </span>
                                        {{ $t('setting.notification_new_assign') }}
                                    </h2>
                                    <p class="text-12 text-neutrals-300 mt-8p">
                                        {{ filters.formatTime(item.created_at, false) }}
                                    </p>
                                </template>
                                <template v-if="item.type === type.ARCHIVED">
                                    <h2 class="text-14" :class="{ 'font-medium': item.status === status.UNREAD }">
                                        {{ $t('setting.notification_success_archive') }}
                                    </h2>
                                    <p class="text-12 text-neutrals-400 mt-8p">
                                        {{
                                            $t(
                                                `setting.notification_archive_${
                                                    item.body.archived_contact_total > 1 ? 'contacts' : 'contact'
                                                }`,
                                                {
                                                    quantity: item.body.archived_contact_total,
                                                },
                                            )
                                        }}
                                    </p>
                                    <p class="text-12 text-neutrals-300 mt-8p">
                                        {{ filters.formatTime(item.created_at, false) }}
                                    </p>
                                </template>
                                <template v-if="item.type === type.USER_DELETED">
                                    <h2 class="text-14" :class="{ 'font-medium': item.status === status.UNREAD }">
                                        {{ $t('setting.notification_success_transferred') }}
                                    </h2>
                                    <p class="text-12 text-neutrals-400 mt-8p">
                                        {{ $t('setting.notification_transferred_from') }}
                                        <span class="font-medium">
                                            {{
                                                getUserInfoById(item.body.deleted_user_id)
                                                    ? getUserInfoById(item.body.deleted_user_id).username
                                                    : item.body.deleted_user_id
                                            }}
                                        </span>
                                        {{ $t('setting.notification_transferred_to') }}
                                        <span class="font-medium">
                                            {{
                                                getUserInfoById(item.body.transfered_convo_user_id)
                                                    ? getUserInfoById(item.body.transfered_convo_user_id).username
                                                    : item.body.transfered_convo_user_id
                                            }}
                                        </span>
                                    </p>
                                    <p class="text-12 text-neutrals-300 mt-8p">
                                        {{ filters.formatTime(item.created_at, false) }}
                                    </p>
                                </template>
                                <template v-if="item.type === type.IMPORT_CONTACT">
                                    <h2 class="text-14" :class="{ 'font-medium': item.status === status.UNREAD }">
                                        {{ $t('setting.notification_import_contact') }}
                                    </h2>
                                    <p class="text-12 text-neutrals-400 mt-8p">
                                        {{
                                            $t(
                                                `setting.notification_new_${
                                                    item.body.imported_contact_total > 1 ? 'contacts' : 'contact'
                                                }_imported`,
                                                {
                                                    quantity: item.body.imported_contact_total,
                                                },
                                            )
                                        }},
                                        {{
                                            $t(
                                                `setting.notification_new_${
                                                    item.body.imported_contact_updated_total > 1
                                                        ? 'contacts'
                                                        : 'contact'
                                                }_updated`,
                                                {
                                                    quantity: item.body.imported_contact_updated_total,
                                                },
                                            )
                                        }},
                                        {{
                                            $t(
                                                `setting.notification_${
                                                    item.body.imported_contact_error_total > 1 ? 'errors' : 'error'
                                                }_found`,
                                                {
                                                    quantity: item.body.imported_contact_error_total,
                                                },
                                            )
                                        }}
                                    </p>
                                    <p class="text-12 text-neutrals-300 mt-8p">
                                        {{ filters.formatTime(item.created_at, false) }}
                                    </p>
                                </template>
                                <template v-if="item.type === type.TRANSFER_CONVO">
                                    <h2 class="text-14" :class="{ 'font-medium': item.status === status.UNREAD }">
                                        {{ $t('setting.notification_success_transferred') }}
                                    </h2>
                                    <p class="text-12 text-neutrals-400 mt-8p">
                                        {{ $t('setting.notification_receive_data_from') }}
                                        <span class="font-medium">
                                            {{
                                                getUserInfoById(item.body.deleted_user_id)
                                                    ? getUserInfoById(item.body.deleted_user_id).username
                                                    : item.body.deleted_user_id
                                            }}
                                        </span>
                                    </p>
                                    <p class="text-12 text-neutrals-300 mt-8p">
                                        {{ filters.formatTime(item.created_at, false) }}
                                    </p>
                                </template>
                                <template v-if="item.type === type.MENTIONED">
                                    <h2 class="text-14" :class="{ 'font-medium': item.status === status.UNREAD }">
                                        <span class="text-primary-500">
                                            {{
                                                getUserInfoById(item.sender_id)
                                                    ? getUserInfoById(item.sender_id).username
                                                    : item.sender_id
                                            }}
                                        </span>
                                        {{ $t('setting.notification_new_mention') }}
                                    </h2>
                                    <span
                                        class="h-16 w-full mt-8p text-12 inline-block text-neutrals-400 truncate"
                                        v-html="handleContent(item)"
                                    ></span>
                                    <p class="text-12 text-neutrals-300 mt-8p">
                                        {{ filters.formatTime(item.created_at, false) }}
                                    </p>
                                </template>
                            </div>
                            <div
                                v-if="item.status === status.UNREAD"
                                class="noti__dot absolute top-22p right-16p h-8 w-8 rounded-full bg-primary-500"
                            ></div>
                        </div>
                        <div v-if="loadingMore" class="h-48 w-full flex items-center justify-center bg-white z-1">
                            <Spinner size="small" color="#3E6DDA" />
                        </div>
                    </template>
                    <template v-else>
                        <div class="h-full flex flex-col items-center justify-center">
                            <img src="@/assets/images/empty-noti.svg" alt="logo" />
                            <p class="text-16 text-neutrals-400 text-center">
                                {{ $t('setting.notification_no_new_notification') }}
                            </p>
                        </div>
                    </template>
                </div>
                <div
                    class="noti__footer h-52 p-16p flex justify-between"
                    :class="{ 'border-t border-neutrals-100': notifications !== null && notifications.length }"
                >
                    <template v-if="notifications !== null && notifications.length">
                        <button-component type="link" @click="redirectNotificationSetting">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15.5317 9.25195L16.4067 8.75977C16.6528 8.62305 16.7895 8.32227 16.7074 8.02148C16.4067 6.87305 15.7778 5.83398 14.9574 4.98633C14.7387 4.79492 14.4106 4.74023 14.1645 4.87695L13.2895 5.39648C13.0707 5.23242 12.6606 4.98633 12.3871 4.87695V3.86523C12.3871 3.5918 12.1684 3.29102 11.8949 3.23633C10.7738 2.93555 9.54338 2.93555 8.42229 3.23633C8.1215 3.31836 7.9301 3.56445 7.9301 3.86523V4.87695C7.65666 4.98633 7.2465 5.23242 7.02775 5.39648L6.15275 4.87695C5.90666 4.74023 5.57854 4.79492 5.35979 4.98633C4.53947 5.83398 3.91057 6.87305 3.60979 8.02148C3.52775 8.32227 3.66447 8.62305 3.91057 8.75977L4.78557 9.25195C4.75822 9.41602 4.75822 9.63477 4.75822 9.77148C4.75822 9.93555 4.75822 10.1543 4.78557 10.291L3.91057 10.8105C3.66447 10.9473 3.52775 11.248 3.60979 11.5488C3.91057 12.6973 4.53947 13.7363 5.35979 14.584C5.57854 14.7754 5.90666 14.8301 6.15275 14.6934L7.02775 14.1738C7.2465 14.3379 7.65666 14.584 7.9301 14.6934V15.7051C7.9301 15.9785 8.14885 16.2793 8.42229 16.334C9.54338 16.6348 10.7738 16.6348 11.8949 16.334C12.1957 16.252 12.3871 16.0059 12.3871 15.7051V14.6934C12.6606 14.584 13.0707 14.3379 13.2895 14.1738L14.1645 14.6934C14.4106 14.8301 14.7387 14.7754 14.9574 14.584C15.7778 13.7363 16.4067 12.6973 16.7074 11.5488C16.7895 11.248 16.6528 10.9473 16.4067 10.8105L15.5317 10.291C15.559 9.96289 15.559 9.60742 15.5317 9.25195ZM14.0824 11.002L15.2856 11.6855C15.1215 12.1777 14.684 12.8887 14.3559 13.2715L13.1528 12.5879C12.2778 13.3262 12.1684 13.4082 11.0746 13.791V15.1855C10.8285 15.2129 10.4184 15.2676 10.1723 15.2676C9.89885 15.2676 9.48869 15.2129 9.2426 15.1855V13.791C8.14885 13.4082 8.01213 13.3262 7.16447 12.5879L5.96135 13.2715C5.63322 12.8887 5.19572 12.1777 5.03166 11.6855L6.23479 11.002C6.01604 9.85352 6.01604 9.7168 6.23479 8.56836L5.03166 7.88477C5.25041 7.31055 5.55119 6.76367 5.96135 6.29883L7.16447 6.98242C8.03947 6.24414 8.14885 6.16211 9.2426 5.7793V4.38477C9.48869 4.35742 9.89885 4.30273 10.1723 4.30273C10.4184 4.30273 10.8285 4.35742 11.0746 4.38477V5.7793C12.1684 6.16211 12.3051 6.24414 13.1528 6.98242L14.3559 6.29883C14.684 6.68164 15.1215 7.39258 15.2856 7.88477L14.0824 8.56836C14.3012 9.7168 14.3012 9.85352 14.0824 11.002ZM10.1723 7.14648C8.72307 7.14648 7.54729 8.34961 7.54729 9.77148C7.54729 11.2207 8.72307 12.3965 10.1723 12.3965C11.5942 12.3965 12.7973 11.2207 12.7973 9.77148C12.7973 8.34961 11.5942 7.14648 10.1723 7.14648ZM10.1723 11.084C9.434 11.084 8.85979 10.5098 8.85979 9.77148C8.85979 9.06055 9.434 8.45898 10.1723 8.45898C10.8832 8.45898 11.4848 9.06055 11.4848 9.77148C11.4848 10.5098 10.8832 11.084 10.1723 11.084Z"
                                    fill="#3E6DDA"
                                />
                            </svg>
                            <span class="ml-2p">{{ $t('setting.notification_notification_setting') }}</span>
                        </button-component>
                    </template>
                </div>
            </div>
        </template>
    </new-dropdown-component>
    <audio ref="notiAudio">
        <source src="@/assets/sound/notification/intuition-561.ogg" type="audio/ogg" />
        <source src="@/assets/sound/notification/intuition-561.mp3" type="audio/mpeg" />
    </audio>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, inject, onMounted } from 'vue';
import NewDropdownComponent from '@/components/ui/NewDropdownComponent.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import BadgeNotificationComponent from '@/components/ui/BadgeNotificationComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import Spinner from '@/components/ui/Spinner.vue';
import { status, type, senderType } from '@/constant/notification';
import { routerPush } from '@/router';
import { useNotification } from '@/modules/setting/composables/useNotification';
import { useUser } from '@/modules/auth/composables/useUser';
import { useInboxComposer } from '@/modules/inbox/composables/useInboxComposer';
import { useSocket } from '@/composables/useSocket';
import { useRoute, useRouter } from 'vue-router';
import { store } from '@/store';
import filters from '@/utils/filters';
import { useAuth } from '@/modules/auth/composables/useAuth';
import CONSTANTS from '@/modules/inbox/constants/constants';
import { useI18n } from 'vue-i18n';
export default defineComponent({
    name: 'LayoutAppDropdownNotification',
    components: {
        NewDropdownComponent,
        BadgeNotificationComponent,
        IconComponent,
        ButtonComponent,
        AvatarComponent,
        Spinner,
    },
    setup() {
        const { getNotifications, readNotifications, notifications, unreadTotal, error, loading } = useNotification();
        const { decodeContent } = useInboxComposer();
        const { userList, getUserList } = useUser();
        const { socketConnected } = useSocket();
        const route = useRoute();
        const router = useRouter();
        const emitter: any = inject('emitter');

        const envContactURL = process.env.VUE_APP_CONTACT_AVATAR_URL;
        const envUserURL = process.env.VUE_APP_FILE_URL;
        const showNotification = ref<boolean>(false);
        const loadingMore = ref<boolean>(false);
        const nextPage = ref<string>('');
        const notiAudio = ref<any>();
        const { logout } = useAuth();
        const { t } = useI18n();

        const routeConvoId: any = computed(() => route.params.conversation);

        const userStore = computed(() => {
            return store.state.auth.user;
        });

        const decodeMessageContent = (content: string) => {
            return decodeContent(content);
        };

        const handleContent = computed(() => {
            return (item: any) => {
                if (item.body.message_type === CONSTANTS.MESSAGE_TYPE.IMAGE) {
                    const content = item.body.message_attachments;
                    if (Array.isArray(content)) {
                        const countImage = content.length;
                        let text = t('inbox.inbox_last_message_images', { countImage });
                        if (countImage === 1) text = t('inbox.inbox_noti_image');
                        text = item.contact_sender_data.full_name + ' ' + text;
                        return text + '.';
                    }
                    return decodeMessageContent(item.body.message_content);
                } else {
                    if (typeof item.body.message_content === 'object') return '';
                    const iconImage =
                        ' <svg class="inline-block" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                        '<path fill-rule="evenodd" clip-rule="evenodd" d="M15.6875 5.25H4.3125C3.57422 5.25 3 5.85156 3 6.5625V14.4375C3 15.1758 3.57422 15.75 4.3125 15.75H15.6875C16.3984 15.75 17 15.1758 17 14.4375V6.5625C17 5.85156 16.3984 5.25 15.6875 5.25ZM4.48965 8.16394C4.48965 7.42614 5.05977 6.82248 5.83111 6.82248C6.56892 6.82248 7.17258 7.42614 7.17258 8.16394C7.17258 8.93528 6.56892 9.5054 5.83111 9.5054C5.05977 9.5054 4.48965 8.93528 4.48965 8.16394ZM5.26829 14.1776C4.99215 14.1776 4.76829 13.9537 4.76829 13.6776V12.5678L6.07621 11.2599C6.2439 11.0922 6.47865 11.0922 6.64634 11.2599L7.9878 12.5678L11.9787 8.57697C12.1463 8.40929 12.3811 8.40929 12.5488 8.57697L15.5 11.4947V13.6776C15.5 13.9537 15.2761 14.1776 15 14.1776H5.26829Z" fill="#828292"/>\n' +
                        '</svg> ';
                    let res = decodeContent(
                        typeof item.body.message_content === 'object' || !item.body.message_content
                            ? ''
                            : item.body.message_content,
                    )
                        .replaceAll('&lt;', '<')
                        .replaceAll('&gt;', '>')
                        .replaceAll('img-emoji', `img-emoji transform -translate-y-px`)
                        .replaceAll('<br>', '');

                    res = res
                        .replace(/<svg[^>]*>/g, '')
                        .replace(/<path[^>]*>/g, '')
                        .replace(/<br[^>]*>/g, '')
                        .replace(/<p[^>]*>/g, '')
                        .replace(/<\/svg[^>]*>/g, '')
                        .replace(/<\/p[^>]*>/g, '')
                        .replace(/<\/path[^>]*>/g, '')
                        .replace(/<img[^>]*>/g, '<has<img>>')
                        .replace(/<div[^>]*>/g, '')
                        .replace(/<\/div[^>]*>/g, '');
                    const attachments = item.body.message_attachments;
                    if (Array.isArray(attachments)) {
                        const checkHasFile = attachments.findIndex(
                            (file: any) => file.type === CONSTANTS.MESSAGE_ATTACHMENT_TYPE.FILE,
                        );
                        if (checkHasFile > -1) {
                            return (
                                res.replace(/(<has<img>>)\1+/g, '$1').replace(/<has<img>>/g, iconImage) +
                                '<svg class="inline-block" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                                '<path d="M10.875 6.71875V3H5.40625C5.02344 3 4.75 3.30078 4.75 3.65625V16.3438C4.75 16.7266 5.02344 17 5.40625 17H14.5938C14.9492 17 15.25 16.7266 15.25 16.3438V7.375H11.5312C11.1484 7.375 10.875 7.10156 10.875 6.71875ZM15.25 6.33594C15.25 6.17188 15.168 6.00781 15.0586 5.87109L12.3789 3.19141C12.2422 3.08203 12.0781 3 11.9141 3H11.75V6.5H15.25V6.33594Z" fill="#828292"/>\n' +
                                '</svg>'
                            );
                        }
                    }
                    return res.replace(/(<has<img>>)\1+/g, '$1').replace(/<has<img>>/g, iconImage);
                }
            };
        });

        const getNewUserList = async () => {
            await getUserList();
        };
        const getUserInfoById = (id: string) => {
            const findUser = userList.value.find((item: any) => item._id === id);
            if (findUser) {
                return findUser;
            }
            return null;
        };
        const getListNotification = async (nextPageId: string) => {
            const res = await getNotifications({
                limit: 20,
                next: nextPageId,
            });
            if (!error.value) {
                nextPage.value = res.next;
                // if (!nextPageId) {
                //     unreadTotal.value = res.unread_total;
                // }
            }
        };
        const handleScrollToBottom = async (target: any) => {
            if (!nextPage.value) return;
            if (target.target.scrollTop + target.target.clientHeight >= target.target.scrollHeight) {
                if (notifications.value.length < 20) return;
                loadingMore.value = true;
                await getListNotification(nextPage.value);
                loadingMore.value = false;
            }
        };
        const onReadNotification = async (notification: any) => {
            if (loading.value) return;
            if (notification.status === 1) {
                await readNotifications(notification._id);
                if (!error.value) {
                    unreadTotal.value--;
                }
            }
            if ([type.NEW_CONVO, type.NEW_REPLY, type.ASSIGNED, type.MENTIONED].includes(notification.type)) {
                // sample group
                const convoGroupName = notification.type == type.NEW_CONVO ? 'unassign' : 'assign_to_you';
                if (routeConvoId.value !== notification.convo_id) {
                    if (notification.type === type.MENTIONED) {
                        router.push({
                            name: 'InboxGroups',
                            params: { name: convoGroupName, conversation: notification.convo_id },
                            query: { tab: 'note' },
                        });
                    } else {
                        routerPush('InboxGroups', { name: convoGroupName, conversation: notification.convo_id });
                    }
                    emitter.emit('changeConversation', { id: notification.convo_id });
                }
                showNotification.value = false;
            }
        };
        const onReadAllNotification = async () => {
            await readNotifications('all');
            if (!error.value) {
                unreadTotal.value = 0;
            }
        };

        const redirectNotificationSetting = () => {
            routerPush('ProfileNotification');
            showNotification.value = false;
        };

        watch(unreadTotal, () => {
            document.title = `${unreadTotal.value > 0 ? '(' + unreadTotal.value + ') Linebase' : 'Linebase'}`;
        });

        watch(
            () => showNotification.value,
            (newVal: boolean) => {
                if (newVal) {
                    getListNotification('');
                }
            },
        );
        watch(
            () => userStore.value,
            (newVal: any) => {
                if (newVal !== null) {
                    getListNotification('');
                }
            },
        );

        watch(
            () => socketConnected.value,
            (newVal: boolean) => {
                if (newVal) {
                    const { socket } = useSocket();
                    socket.off('incomingNotification').on('incomingNotification', (data: any) => {
                        console.log('------------------ incomingNotification ---------------------------', data);
                        notifications.value.unshift(data.data);
                        unreadTotal.value++;
                        if (userStore.value.notification_setting.alert_sound) {
                            notiAudio.value.play();
                        }
                    });
                    socket.off('user.update.complete').on('user.update.complete', (data: any) => {
                        // console.log(
                        //     data.data._id === store.state.auth.user._id,
                        //     data.data.role_ids[0] === store.state.auth.user.role_ids[0],
                        //     data.workspace_id === store.state.auth.user.workspace_id,
                        // );
                        const findUser = userList.value.find((item: any) => item._id === data.data._id);
                        if (data.data._id !== store.state.auth.user._id && !findUser) {
                            getNewUserList();
                        }
                        if (
                            data.data._id === store.state.auth.user._id &&
                            data.data.role_ids[0] !== store.state.auth.user.role_ids[0] &&
                            data.workspace_id === store.state.auth.user.workspace_id
                        ) {
                            console.log('changeRoles');
                            emitter.emit('changeRoles', { role_id: data.data.role_ids[0] });
                        }
                    });
                    socket.off('user.delete.complete').on('user.delete.complete', (data: any) => {
                        console.log('noti user.update.complete', data);
                        if (data.data.user_id !== store.state.auth.user._id) {
                            getNewUserList();
                        } else {
                            store.commit('auth/LOGOUT');
                        }
                    });
                }
            },
        );

        onMounted(() => {
            if (userStore.value) {
                getListNotification('');
            }
        });

        return {
            envContactURL,
            envUserURL,
            filters,
            status,
            type,
            senderType,
            userList,
            notifications,
            showNotification,
            loadingMore,
            unreadTotal,
            handleScrollToBottom,
            getUserInfoById,
            decodeMessageContent,
            onReadNotification,
            onReadAllNotification,
            redirectNotificationSetting,
            routeConvoId,
            notiAudio,
            handleContent,
        };
    },
});
</script>

<style lang="scss" scoped>
.noti__wrapper {
    height: 608px;
    @media screen and (max-height: 700px) {
        height: calc(100vh - 100px);
    }
}
:deep(.img-emoji) {
    margin-bottom: -4px;
}
</style>
