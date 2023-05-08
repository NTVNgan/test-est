<template>
    <div
        class="box-item-conversation cursor-pointer items-center flex px-16p py-18p text-14 text-neutrals-900"
        @click="clickSubmenu(item)"
        :class="[index == menuActive ? 'router-link-exact-active' : '', checkConvoRemoved ? 'convo-removed' : '']"
    >
        <div class="pr-12p">
            <avatar-component
                :labelShow="false"
                size="medium"
                :label-avatar="item.customer.full_name"
                :image="item.customer.avatar_src ? envURL + '/' + item.customer.avatar_src : ''"
                :bgAvatar="item.customer.avatar_bg ? item.customer.avatar_bg : ''"
                :online="item.customer.online_status"
                :showImageTiny="true"
                :showBackgroundCompulsory="true"
            />
        </div>
        <div class="box-converstion-info" :class="!item.isSeen ? 'not-seen' : ''">
            <div class="box-name-time">
                <span class="flex-auto truncate name-content" :class="!item.isSeen ? 'font-bold' : 'font-normal'">
                    {{ item.customer.full_name }}
                </span>
                <span class="flex-auto time-content text-12">
                    {{ filters.formatTime(item.last_message.created_at, true) }}
                </span>
            </div>
            <template v-if="!showIndicatorTyping && !checkUserTypingNote">
                <template v-if="item.last_message.status === CONSTANTS.STATUS.DELETED">
                    <div v-if="item.last_message.is_whisper" class="last-message flex h-20">
                        <div v-if="item.last_message._auid !== user._id" class="last-message flex h-20 mgs-note">
                            <span class="mr-2p">
                                <tooltip-component
                                    :position="'top'"
                                    type="light"
                                    :content="userSendMessage.username"
                                    :borderRadius="'20px'"
                                >
                                    <avatar-component
                                        :labelShow="false"
                                        size="extra-small"
                                        :label-avatar="userFormat(item.last_message.sender_id, 'username')"
                                        :image="userFormat(item.last_message.sender_id, 'avatar_src')"
                                        :bgAvatar="userFormat(item.last_message.sender_id, 'avatar_bg')"
                                        :userRemoved="userFormat(item.last_message.sender_id, 'user_removed')"
                                    />
                                </tooltip-component>
                            </span>
                            <div class="truncate">{{ contentLogDelete(item.last_message) }}</div>
                        </div>
                        <div v-else class="last-message flex h-20 mgs-note">
                            <span>{{ $t('inbox.you') }}:&nbsp; </span>
                            <div class="truncate">{{ contentLogDelete(item.last_message) }}</div>
                        </div>
                    </div>
                    <div v-else class="last-message flex h-20">
                        <div class="truncate">
                            {{ userLogDelete(item.last_message._auid, 'username') }}
                            {{ contentLogDelete(item.last_message) }}
                        </div>
                    </div>
                </template>
                <template
                    v-else-if="
                        item.last_message &&
                            (item.last_message.type === CONSTANTS.MESSAGE_TYPE.IMAGE ||
                                item.last_message.type === CONSTANTS.MESSAGE_TYPE.FILE)
                    "
                >
                    <span v-if="!item.last_message.is_whisper" class="last-message flex h-20">
                        <div class="truncate">
                            {{ contentFormatImage }}
                        </div>
                    </span>
                    <template v-else>
                        <div
                            v-if="!item.last_message_send_by_me"
                            :class="item.last_message.is_whisper ? 'mgs-note' : ''"
                            class="last-message flex h-20"
                        >
                            <span class="mr-2p">
                                <tooltip-component
                                    :position="'top'"
                                    type="light"
                                    :content="userSendMessage.username"
                                    :borderRadius="'20px'"
                                >
                                    <avatar-component
                                        :labelShow="false"
                                        size="extra-small"
                                        :label-avatar="userFormat(item.last_message.sender_id, 'username')"
                                        :image="userFormat(item.last_message.sender_id, 'avatar_src')"
                                        :bgAvatar="userFormat(item.last_message.sender_id, 'avatar_bg')"
                                        :userRemoved="userFormat(item.last_message.sender_id, 'user_removed')"
                                    />
                                </tooltip-component>
                            </span>
                            <div class="truncate">{{ contentFormatImageNotName }}</div>
                        </div>
                        <div
                            v-else
                            class="last-message flex h-20"
                            :class="item.last_message.is_whisper ? 'mgs-note' : ''"
                        >
                            <span>{{ $t('inbox.you') }}:&nbsp; </span>
                            <div class="truncate">{{ contentFormatImageNotName }}</div>
                        </div>
                    </template>
                </template>
                <template v-else>
                    <template v-if="!item.last_message_send_by_me">
                        <span v-if="!item.last_message.is_whisper" class="last-message flex h-20" v-html="content">
                        </span>
                        <div
                            v-else
                            class="last-message flex h-20"
                            :class="item.last_message.is_whisper ? 'mgs-note' : ''"
                        >
                            <span class="mr-2p">
                                <tooltip-component
                                    :position="'top'"
                                    type="light"
                                    :content="userSendMessage.username"
                                    :borderRadius="'4px'"
                                >
                                    <avatar-component
                                        :labelShow="false"
                                        size="extra-small"
                                        :label-avatar="userFormat(item.last_message.sender_id, 'username')"
                                        :image="userFormat(item.last_message.sender_id, 'avatar_src')"
                                        :bgAvatar="userFormat(item.last_message.sender_id, 'avatar_bg')"
                                        :userRemoved="userFormat(item.last_message.sender_id, 'user_removed')"
                                    />
                                </tooltip-component>
                            </span>
                            <div v-html="content" class="truncate"></div>
                        </div>
                    </template>
                    <span v-else class="last-message flex h-20" :class="item.last_message.is_whisper ? 'mgs-note' : ''">
                        {{ $t('inbox.you') }}:&nbsp;
                        <div v-html="content" class="truncate"></div>
                    </span>
                </template>
            </template>
            <template v-else-if="checkUserTypingNote">
                <div class="typing-indicator note">
                    <div class="flex items-center">
                        <avatar-component
                            class="flex items-center avatar-typing"
                            v-for="user in userTypingLimit"
                            :labelShow="false"
                            :key="user._id"
                            :label-avatar="user.username"
                            :bgAvatar="user.avatar_bg"
                            size="extra-small"
                            :image="
                                user.avatar_src && user.avatar_src !== '' && user.avatar_src != null
                                    ? `${ENV_VUE_APP_FILE_URL}/${user.avatar_src}`
                                    : ''
                            "
                        />
                        <span class="avatar-typing-more bg-neutrals-100" v-if="userTypingInConvo.length > 2">
                            <span class="text-12">+{{ userTypingInConvo.length - 2 }}</span>
                        </span>
                        <div class="ticontainer inline-block ml-2p">
                            <div class="tiblock">
                                <div class="tidot dot-first"></div>
                                <div class="tidot dot-center"></div>
                                <div class="tidot dot-last"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="typing-indicator inline-block">
                    <div class="ticontainer">
                        <div class="tiblock">
                            <div class="tidot dot-first"></div>
                            <div class="tidot dot-center"></div>
                            <div class="tidot dot-last"></div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import { computed, inject, ref } from 'vue';
import filters from '@/utils/filters';
import { useInboxPushingHandler } from '@/modules/inbox/composables/useInboxPushingHandler';
import { useInboxComposer } from '@/modules/inbox/composables/useInboxComposer';
import CONSTANTS from '@/modules/inbox/constants/constants';
import { store } from '@/store';
import { useI18n } from 'vue-i18n';
import { useUser } from '@/modules/auth/composables/useUser';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';

export default {
    name: 'InboxConversationDetailSearch',
    components: {
        AvatarComponent,
        TooltipComponent,
    },
    props: {
        item: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {},
        },
        groupName: {
            type: String,
            default: '',
        },
        routeName: {
            type: String,
            default: 'InboxGroups',
        },
        menuActive: {
            type: Number,
            default: 0,
        },
        index: {
            type: Number,
            default: 0,
        },
    },
    emits: ['clickSubmenuInboxSearch'],
    setup(props: any, { emit }: any) {
        const { decodeContent } = useInboxComposer();
        const emitter: any = inject('emitter');
        const envURL = process.env.VUE_APP_CONTACT_AVATAR_URL;
        const ENV_VUE_APP_FILE_URL = process.env.VUE_APP_FILE_URL;
        const { cacheConvoRemove, cacheConvoResolveAndReopen } = useInboxPushingHandler();
        const clickSubmenu = (item: any) => {
            emit('clickSubmenuInboxSearch', item);
        };
        const { t } = useI18n();
        const showIndicatorTyping = ref<boolean>(false);
        const user = computed(() => store.state.auth.user);
        const { _id: currentUserId } = user.value;
        const { userList } = useUser();
        const userSendMessage = ref({ username: '' });
        const { userTyping, contentMessageDeletedInConvoList } = useInboxConversationDetail();

        const userTypingLimit = computed(() => {
            if (typeof userTyping.value[props.item.id] === 'undefined' || userTyping.value[props.item.id].length < 1)
                return [];
            return userTyping.value[props.item.id].slice(0, 2);
        });

        const checkConvoRemoved = computed(() => {
            if (props.item.id === cacheConvoRemove.value.id) return true;
            if (cacheConvoResolveAndReopen.value.length > 0) {
                const findIndex = cacheConvoResolveAndReopen.value.findIndex(
                    (convo: any) => convo.convo_id === props.item.id,
                );
                return findIndex > -1;
            }
            return false;
        });

        const userTypingInConvo = computed(() => {
            if (typeof userTyping.value[props.item.id] === 'undefined' || userTyping.value[props.item.id].length < 1)
                return [];
            return userTyping.value[props.item.id];
        });

        const checkUserTypingNote = computed(() => {
            if (
                userTyping.value === null ||
                typeof userTyping.value[props.item.id] === 'undefined' ||
                userTyping.value[props.item.id].length < 1
            )
                return false;
            return true;
        });

        const content = computed(() => {
            if (typeof props.item.last_message.content === 'object') return '';
            let contentLastMessage;
            if (typeof props.item.last_message.content === 'undefined') contentLastMessage = '';
            else contentLastMessage = props.item.last_message.content;
            if (props.item.last_message.type === CONSTANTS.MESSAGE_TYPE.EMAIL) {
                const contentArr = contentLastMessage.split('<div class="gmail_quote"');
                if (contentArr.length > 0) contentLastMessage = contentArr[0];
            }
            const iconImage =
                ' <svg class="inline-block" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                '<path fill-rule="evenodd" clip-rule="evenodd" d="M15.6875 5.25H4.3125C3.57422 5.25 3 5.85156 3 6.5625V14.4375C3 15.1758 3.57422 15.75 4.3125 15.75H15.6875C16.3984 15.75 17 15.1758 17 14.4375V6.5625C17 5.85156 16.3984 5.25 15.6875 5.25ZM4.48965 8.16394C4.48965 7.42614 5.05977 6.82248 5.83111 6.82248C6.56892 6.82248 7.17258 7.42614 7.17258 8.16394C7.17258 8.93528 6.56892 9.5054 5.83111 9.5054C5.05977 9.5054 4.48965 8.93528 4.48965 8.16394ZM5.26829 14.1776C4.99215 14.1776 4.76829 13.9537 4.76829 13.6776V12.5678L6.07621 11.2599C6.2439 11.0922 6.47865 11.0922 6.64634 11.2599L7.9878 12.5678L11.9787 8.57697C12.1463 8.40929 12.3811 8.40929 12.5488 8.57697L15.5 11.4947V13.6776C15.5 13.9537 15.2761 14.1776 15 14.1776H5.26829Z" fill="#828292"/>\n' +
                '</svg> ';
            let res = decodeContent(
                typeof contentLastMessage === 'object' || !contentLastMessage ? '' : contentLastMessage,
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
                .replace(/<\/div[^>]*>/g, '')
                .replace(/<table[^>]*>/g, '')
                .replace(/<\/table[^>]*>/g, '');
            const attachments = props.item.last_message.attachments;
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
        });

        const contentFormatImage = computed(() => {
            const content = props.item.last_message.attachments;
            if (Array.isArray(content)) {
                // const checkHasFile = content.findIndex(
                //     (file: any) => file.type === CONSTANTS.MESSAGE_ATTACHMENT_TYPE.FILE,
                // );
                let countFile = 0;
                content.forEach((file: any) => {
                    if (file.type === CONSTANTS.MESSAGE_ATTACHMENT_TYPE.FILE) countFile++;
                });
                const countImage = content.length;
                let text = t('inbox.inbox_last_message_images', { countImage });
                if (countFile > 0) {
                    text = t('inbox.inbox_last_message_files', { count: countFile });
                }
                if (countImage === 1 && countFile === 0) {
                    text = t('inbox.inbox_noti_image');
                } else if (countFile === 1) {
                    text = t('inbox.inbox_last_message_file');
                }

                if (props.item.last_message.sender_type === CONSTANTS.SENT_BY.USER) {
                    text = t('inbox.you') + ' ' + text + '.';
                } else {
                    if (typeof props.item.customer.full_name != 'undefined') {
                        text = props.item.customer.full_name + ' ' + text + '.';
                    }
                }
                return text;
            }
            return '';
        });

        const contentFormatImageNotName = computed(() => {
            const content = props.item.last_message.attachments;
            if (Array.isArray(content)) {
                const countImage = content.length;
                let text = t('inbox.inbox_last_message_images', { countImage });
                if (countImage === 1) text = t('inbox.inbox_noti_image');
                return text;
            }
            return '';
        });

        const formatContent = (content: any) => {
            return content
                .replace(/<br\s*\/?>/gi, ' ')
                .replaceAll('&nbsp;', ' ')
                .replaceAll('&lt;', '<')
                .replaceAll('&gt;', '>');
        };

        const checkSeenByMe = computed(() => {
            return (data: any) => {
                if (data.last_message_send_by_me) return true;
                if (
                    data.last_message.sender_type == CONSTANTS.SENT_BY.USER &&
                    currentUserId === data.last_message.sender_id
                ) {
                    return true;
                }
                return false;
            };
        });

        const userFormat = computed(() => {
            return (idUser: any, field: any) => {
                const user = userList.value.find((u: any) => u._id === idUser);
                if (!user) {
                    if (field === 'user_removed') return true;
                    return '';
                }
                if (user != userSendMessage.value) userSendMessage.value = user;
                if (field === 'avatar_src') {
                    if (user.avatar_src !== '' && user.avatar_src !== null) {
                        return `${process.env.VUE_APP_FILE_URL}/${user.avatar_src}`;
                    } else return '';
                }
                if (field === 'avatar_bg') {
                    if (user.avatar_bg != undefined) {
                        return user.avatar_bg;
                    } else return '';
                }
                return user[field];
            };
        });

        const contentLogDelete = (data: any) => {
            return contentMessageDeletedInConvoList(data);
        };

        const userLogDelete = computed(() => {
            return (idUser: any, field: any) => {
                if (user.value._id === idUser && field === 'username') return 'You';
                const userFind = userList.value.find((u: any) => u._id === idUser);
                if (!userFind) {
                    if (field === 'user_removed') return true;
                    return '';
                }
                if (field === 'avatar_src') {
                    if (userFind.avatar_src !== '' && userFind.avatar_src !== null) {
                        return `${process.env.VUE_APP_FILE_URL}/${userFind.avatar_src}`;
                    } else return '';
                }
                if (field === 'avatar_bg') {
                    if (userFind.avatar_bg != undefined) {
                        return userFind.avatar_bg;
                    } else return '';
                }
                return userFind[field];
            };
        });

        emitter.on('messageTyping', async (data: any) => {
            if (data.data.convo_id === props.item.id) {
                showIndicatorTyping.value = data.data.type === 'start';
            }
        });

        return {
            clickSubmenu,
            formatContent,
            filters,
            envURL,
            ENV_VUE_APP_FILE_URL,
            cacheConvoRemove,
            decodeContent,
            content,
            showIndicatorTyping,
            checkSeenByMe,
            contentFormatImage,
            CONSTANTS,
            contentFormatImageNotName,
            userFormat,
            userLogDelete,
            contentLogDelete,
            userSendMessage,
            userList,
            userTypingLimit,
            userTypingInConvo,
            checkUserTypingNote,
            user,
            checkConvoRemoved,
        };
    },
};
</script>

<style lang="scss" scoped>
.convo-removed::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #f6f6f8;
    opacity: 0.5;
}

.box-list-conversation.convo-removed {
    position: relative;
}

.box-list-conversation {
    border-right: 1px solid #e9e9ec;

    .box-item-conversation {
        border-left: 2px solid #ffffff;
    }

    .box-item-conversation:hover {
        border-color: #f6f6f8;
        background-color: #f6f6f8;
    }

    .mgs-note > div {
        background: #fff6d6;
        border: 0.5px solid #ffd466;
        padding-left: 2px;
        padding-right: 2px;
        border-radius: 2px;
    }

    .box-item-conversation.router-link-exact-active {
        border-color: #3e6dda;
        background-color: #f6f6f8;
    }

    .box-converstion-info {
        width: calc(100% - 40px - 12px);
        height: 40px;

        .name-content {
            width: 55%;
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .time-content {
            width: 40%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .box-name-time {
            width: 100%;
            height: 20px;
            display: block;
            margin-bottom: 4px;
            margin-top: -1px;

            .time-content {
                float: right;
                color: #828292;
                text-align: right;
                line-height: 20px;
            }
        }
    }

    .last-message {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 96%;
        color: #828292;
    }

    .box-converstion-info.not-seen {
        .last-message,
        .time-content {
            color: #141417;
            font-weight: 500;
        }
    }

    .typing-indicator {
        margin-top: 10px;

        .tiblock {
            align-items: center;
            display: flex;
            width: auto;
            background: #f6f6f8;
            border-radius: 20px;
        }

        .ticontainer .tidot {
            background-color: #90949c;
        }

        .tidot {
            -webkit-animation: mercuryTypingAnimation 1s infinite ease-in-out;
            border-radius: 50%;
            display: inline-block;
            height: 6px;
            margin-right: 4px;
            width: 6px;
        }

        .tidot.dot-first {
            background: #bfcef3;
        }

        .tidot.dot-center {
            background: #98b1eb;
        }

        .tidot.dot-last {
            background: #5e85e0;
            margin-right: 0;
        }

        @-webkit-keyframes mercuryTypingAnimation {
            0% {
                -webkit-transform: translateY(0px);
                height: 6px;
                width: 6px;
            }
            28% {
                -webkit-transform: translateY(-5px);
                height: 6px;
                width: 6px;
            }
            44% {
                -webkit-transform: translateY(0px);
                height: 6px;
                width: 6px;
            }
        }

        .tidot:nth-child(1) {
            -webkit-animation-delay: 200ms;
        }

        .tidot:nth-child(2) {
            -webkit-animation-delay: 300ms;
        }

        .tidot:nth-child(3) {
            -webkit-animation-delay: 400ms;
        }
    }

    .typing-indicator.note {
        margin-top: 0;

        .ticontainer {
            padding: 6px 4px;
            background: #fff6d6;
            border: 0.5px solid #ffd466;
            border-radius: 2px;
        }

        .avatar-typing-more {
            width: 20px;
            height: 20px;
            border-radius: 100%;
            margin-left: -9px;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .avatar-typing:not(:first-child) {
            margin-left: -9px;
        }
    }
}
</style>
<style>
.box-converstion-info .last-message .mention,
.box-converstion-info .last-message span.composer-contenteditable__mention {
    background: none;
    color: inherit;
}
</style>
