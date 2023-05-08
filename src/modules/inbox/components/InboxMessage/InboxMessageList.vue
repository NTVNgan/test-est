<template>
    <div
        class="message-content scrollbar--transparent"
        :class="router.currentRoute.value.name === 'InboxSearch' ? 'in-search' : ''"
        ref="boxAllMessage"
        @scroll="handleScrollToTop"
    >
        <div v-if="loading" class="loading">
            <Spinner size="small" color="#3E6DDA" />
        </div>
        <div v-for="(groups, key) in messages" :key="key">
            <InboxMessageNotification
                :contentArr="[
                    {
                        text: key,
                        bold: true,
                    },
                ]"
                :isDate="true"
            ></InboxMessageNotification>
            <template v-for="(message, key) in groups" :key="key">
                <div v-if="message && message.length === 1 && message[0].format === 'message'">
                    <InboxMessageDetailSingle
                        :message="message[0]"
                        :position="message[0].sender_type === CONSTANTS.SENT_BY.CUSTOMER ? 'left' : 'right'"
                        :background="
                            message[0].sender_type === CONSTANTS.SENT_BY.CUSTOMER ? 'bg-neutrals-100' : 'bg-primary-50'
                        "
                        :textColor="
                            message[0].sender_type === CONSTANTS.SENT_BY.CUSTOMER ? 'text-neutrals-900' : 'text-black'
                        "
                        :showAvatar="message[0].sender_type == CONSTANTS.SENT_BY.USER ? true : false"
                        :margin-bottom="message[0]._id === lastMessageSeenByCustomer ? '4' : nextIsMessage(key, groups)"
                    ></InboxMessageDetailSingle>
                    <div
                        class="read-receipt"
                        v-if="
                            message[0].sender_type === CONSTANTS.SENT_BY.USER &&
                                message[0]._id === lastMessageSeenByCustomer
                        "
                    >
                        <img class="logo mx-auto inline-block" src="../../images/check-seen.svg" alt="banner" />
                        <span class="text-12">{{ $t('inbox.inbox_seen') }} {{ timeSeen }} </span>
                    </div>
                </div>
                <div v-if="message && message.length > 1">
                    <InboxMessageDetailGroup
                        :message="message"
                        :margin-bottom="nextIsMessage(key, groups)"
                    ></InboxMessageDetailGroup>
                </div>
                <div v-if="message && message.length === 1 && message[0].format === 'log'">
                    <InboxMessageNotification :contentArr="message[0].contentArr"></InboxMessageNotification>
                </div>
                <!--            </template>-->
            </template>
        </div>
        <div v-show="showIndicatorTyping || checkUserTypingNote" class="typing-indicator inline-block mb-16p">
            <div v-if="showIndicatorTyping" class="ticontainer inline-block">
                <div class="tiblock bg-neutrals-50">
                    <div class="tidot dot-first"></div>
                    <div class="tidot dot-center"></div>
                    <div class="tidot dot-last"></div>
                </div>
            </div>
            <div v-if="checkUserTypingNote" class="ticontainer inline-block user-note-typing">
                <div class="flex items-center">
                    <div class="ticontainer items-center flex mr-22p">
                        <div class="tiblock note bg-warning-5">
                            <div class="tidot dot-first"></div>
                            <div class="tidot dot-center"></div>
                            <div class="tidot dot-last"></div>
                        </div>
                    </div>
                    <avatar-component
                        class="flex items-center avatar-typing"
                        v-for="user in userTypingLimit"
                        :key="user._id"
                        :labelShow="false"
                        :label-avatar="user.username"
                        :bgAvatar="user.avatar_bg"
                        size="small"
                        :image="user.avatar_src ? `${envURL}/${user.avatar_src}` : ''"
                    />
                    <span class="avatar-typing-more bg-neutrals-100" v-if="userTypingInConvo.length > 2">
                        <span class="text-14">+{{ userTypingInConvo.length - 2 }}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import InboxMessageNotification from '@/modules/inbox/components/InboxMessage/InboxMessageNotification.vue';
import InboxMessageDetailSingle from '@/modules/inbox/components/InboxMessage/InboxMessageDetailSingle.vue';
import InboxMessageDetailGroup from '@/modules/inbox/components/InboxMessage/InboxMessageDetailGroup.vue';
import Spinner from '@/components/ui/Spinner.vue';
import { useSocket } from '@/composables/useSocket';
import { useRoute, useRouter } from 'vue-router';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';
import CONSTANTS from '../../constants/constants';
import { useInboxGroupConversation } from '@/modules/inbox/composables/useInboxGroupConversations';
import filters from '@/utils/filters';
import { useUser } from '@/modules/auth/composables/useUser';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import { store } from '@/store';

export default {
    name: 'InboxMessageList',
    components: {
        InboxMessageNotification,
        InboxMessageDetailSingle,
        InboxMessageDetailGroup,
        Spinner,
        AvatarComponent,
    },
    props: {
        clickReadAll: {
            type: Number,
            default: 0,
        },
    },
    emits: ['changeSkeleton'],
    setup(props: any, { emit }: any) {
        const boxAllMessage = ref();
        const envURL = process.env.VUE_APP_FILE_URL;
        const { userList } = useUser();
        const loading = ref<boolean>(false);
        const mountedDone = ref<boolean>(false);
        const showIndicatorTyping = ref<boolean>(false);
        const user = computed(() => store.state.auth.user);
        const { socket } = useSocket();
        const router = useRouter();
        const emitter: any = inject('emitter');
        const scrollHeightValue = ref<number>(0);
        const timeCheck = ref(0);
        const route = useRoute();
        const routeName: any = computed(() => route.params.name);
        const {
            messages,
            callData,
            nextPage,
            conversationId,
            formatDataConversationDetail,
            mergeMessageNew,
            showIndicatorNewMessage,
            countNewMessage,
            conversationSelected,
            idFakeNewMessage,
            lastMessageSeenByCustomer,
            timeSeenLastMessage,
            updateSeenMessage,
            userTyping,
            handleMessageDeleted,
            conversationDetail,
        } = useInboxConversationDetail();

        const { conversations, updateStatusRead, convoTyping } = useInboxGroupConversation({});

        const userTypingLimit = computed(() => {
            if (
                typeof userTyping.value[conversationId.value] === 'undefined' ||
                userTyping.value[conversationId.value].length < 1
            )
                return [];
            return userTyping.value[conversationId.value].slice(0, 2);
        });

        const userTypingInConvo = computed(() => {
            if (
                typeof userTyping.value[conversationId.value] === 'undefined' ||
                userTyping.value[conversationId.value].length < 1
            )
                return [];
            return userTyping.value[conversationId.value];
        });

        const handleScrollKeepPosition = async () => {
            // await new Promise(resolve => setTimeout(resolve, 100));
            if (boxAllMessage.value != null) {
                boxAllMessage.value.scrollTop = boxAllMessage.value.scrollHeight - scrollHeightValue.value;
                scrollHeightValue.value = boxAllMessage.value.scrollHeight;
            }
        };

        // bottom boxchat
        const handleScrollToBottom = async (time: any) => {
            conversations.value.forEach(convo => {
                if (convo.id === conversationId.value) {
                    updateStatusRead(convo.id, 'read');
                }
            });
            await new Promise(resolve => setTimeout(resolve, time));
            if (boxAllMessage.value != null) boxAllMessage.value.scrollTop = boxAllMessage.value.scrollHeight;
        };

        const initInbox = () => {
            //conversationId
            let conversation = router.currentRoute.value.params.conversation;
            if (typeof conversation !== 'string' && conversation != undefined) conversation = conversation[0];
            if (conversation != undefined && conversation != '') conversationId.value = conversation;
        };

        const nextIsMessage = (key: any, list: any) => {
            if (key === list.length - 1) return '24';
            if (list[key + 1][0]['group'] === CONSTANTS.GROUP.MESSAGE) return '12';
            return '24';
        };

        const resetIndicator = () => {
            countNewMessage.value = 0;
            showIndicatorNewMessage.value = false;
            handleScrollToBottom(0);
        };

        onMounted(async () => {
            initInbox();
            if (conversationId.value == '') {
                mountedDone.value = true;
                return;
            }
            //check is clone
            const currRouter = router.currentRoute.value.query;
            if (currRouter && Object.prototype.hasOwnProperty.call(currRouter, 'is_clone')) {
                emit('changeSkeleton', false);
                let conversation = router.currentRoute.value.params.conversation;
                if (typeof conversation !== 'string' && conversation != undefined) conversation = conversation[0];
                conversationId.value = conversation;
                return;
            } else {
                emit('changeSkeleton', true);
                await callData(false, true);
                emit('changeSkeleton', false);
                handleScrollToBottom(100);
                mountedDone.value = true;
            }
        });

        const idFake = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                // eslint-disable-next-line prefer-const
                const r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        };

        const timeSeen = computed(() => {
            if (timeCheck.value > -1) return filters.formatTime(timeSeenLastMessage.value, false, true);
            return '';
        });

        const updateTimeSeen = () => {
            timeCheck.value++;
        };

        const checkUserTypingNote = computed(() => {
            if (
                userTyping.value === null ||
                typeof userTyping.value[conversationId.value] === 'undefined' ||
                userTyping.value[conversationId.value].length < 1
            )
                return false;
            return true;
        });

        const handleUserTypingInNote = async (data: any) => {
            if (data.sender_id === user.value._id) return;
            if (data.type === 'stop') {
                if (userTyping.value === null || typeof userTyping.value[data.convo_id] === 'undefined') return;
                const findIndex = userTyping.value[data.convo_id].findIndex((user: any) => user._id === data.sender_id);
                if (findIndex < 0) return;
                userTyping.value[data.convo_id].splice(findIndex, 1);
            } else {
                const findIndexInUser = userList.value.findIndex((user: any) => user._id === data.sender_id);
                if (findIndexInUser < 0) return;
                if (userTyping.value === null || typeof userTyping.value[data.convo_id] === 'undefined') {
                    userTyping.value[data.convo_id] = [];
                    userTyping.value[data.convo_id].push(userList.value[findIndexInUser]);
                } else {
                    const findIndex = userTyping.value[data.convo_id].findIndex(
                        (user: any) => user._id === data.sender_id,
                    );
                    if (findIndex > -1) return;
                    userTyping.value[data.convo_id].push(userList.value[findIndexInUser]);
                }
                if (
                    boxAllMessage.value.scrollTop + boxAllMessage.value.clientHeight >=
                    boxAllMessage.value.scrollHeight
                ) {
                    await handleScrollToBottom(100);
                }
            }
        };

        setInterval(updateTimeSeen, 60000);

        socket.off('incomingMessage').on('incomingMessage', async (data: any) => {
            // tao fake id de show last seen
            data._id = idFake();
            console.log('incomingMessage', { data });
            let convoId = conversationId.value;
            if (router.currentRoute.value.name === 'InboxSearch') convoId = conversationSelected.value._id;
            if (convoId == data.convo_id) {
                // if (
                //     data.sender_type === CONSTANTS.SENT_BY.USER &&
                //     data.group === CONSTANTS.message.MESSAGE &&
                //     !data.is_whisper
                // ) {
                //     idFakeNewMessage.value = data._id;
                // }
                // check xem scroll co dang o duoi cung khong
                let isCheckBottom = false;
                if (
                    boxAllMessage.value.scrollTop + boxAllMessage.value.clientHeight >=
                        boxAllMessage.value.scrollHeight ||
                    (data.sender_type == CONSTANTS.SENT_BY.USER && data.sender_id === user.value._id)
                ) {
                    countNewMessage.value = 0;
                    isCheckBottom = true;
                    showIndicatorNewMessage.value = false;
                } else {
                    countNewMessage.value++;
                    showIndicatorNewMessage.value = true;
                }
                const newMessage = await formatDataConversationDetail([data]);
                await mergeMessageNew(newMessage);
                if (isCheckBottom) handleScrollToBottom(0);
            }
        });

        socket.off('incomingSeenMessage').on('incomingSeenMessage', async (data: any) => {
            updateSeenMessage();
        });

        socket.off('message.delete.complete').on('message.delete.complete', async (data: any) => {
            if (conversationDetail.value._id === data.convo_id) {
                await handleMessageDeleted(data.data);
            }
        });

        emitter.on('changeConversation', async (data: any) => {
            if (data == undefined) return;
            conversationSelected.value = data;
            emit('changeSkeleton', true);
            nextPage.value = '';
            conversationId.value = data.id;
            mountedDone.value = false;
            await callData(false, true);
            handleScrollToBottom(50);
            await new Promise(resolve => setTimeout(resolve, 50));
            emit('changeSkeleton', false);
            await new Promise(resolve => setTimeout(resolve, 100));
            mountedDone.value = true;
        });

        const handleScrollToTop = async (target: any) => {
            if (target.target.scrollTop + target.target.clientHeight >= target.target.scrollHeight) {
                countNewMessage.value = 0;
                showIndicatorNewMessage.value = false;
                await new Promise(resolve => setTimeout(resolve, 200));
                conversations.value.forEach(convo => {
                    if (convo.id == conversationId.value) {
                        updateStatusRead(convo.id, 'read');
                    }
                });
            }
            emitter.emit('hideTooltip');
            if (nextPage.value == '' || nextPage.value == null || nextPage.value == 'null' || !mountedDone.value)
                return;
            scrollHeightValue.value = target.target.scrollHeight;
            if (target.target.scrollTop == 0) {
                loading.value = true;
                await callData(true, false);
                loading.value = false;
                handleScrollKeepPosition();
            }
        };

        emitter.on('assignDefault', () => {
            const currRouter = router.currentRoute.value.query;
            if (currRouter && Object.prototype.hasOwnProperty.call(currRouter, 'is_clone')) {
                emit('changeSkeleton', false);
                return;
            }
            emit('changeSkeleton', true);
        });

        socket.off('message.typing').on('message.typing', async (data: any) => {
            if (data.data.is_whisper) {
                await handleUserTypingInNote(data.data);
            } else {
                if (routeName.value == 'unassign') return;
                if (data.data.sender_type === 2) {
                    emitter.emit('messageTyping', data);
                    if (data.data.type === 'start') {
                        if (
                            boxAllMessage.value.scrollTop + boxAllMessage.value.clientHeight >=
                            boxAllMessage.value.scrollHeight
                        ) {
                            handleScrollToBottom(100);
                        }
                        if (convoTyping.value.indexOf(data.data.convo_id) < 0)
                            convoTyping.value.push(data.data.convo_id);
                    } else {
                        if (convoTyping.value.indexOf(data.data.convo_id) > -1)
                            convoTyping.value.splice(convoTyping.value.indexOf(data.data.convo_id), 1);
                    }
                    if (data.data.convo_id === conversationId.value) {
                        showIndicatorTyping.value = data.data.type === 'start';
                    }
                }
            }
        });

        watch(
            () => props.clickReadAll,
            async () => {
                resetIndicator();
            },
        );

        watch(router.currentRoute, async () => {
            showIndicatorTyping.value = convoTyping.value.indexOf(conversationId.value) > -1;
        });

        onUnmounted(() => {
            messages.value = {};
            emit('changeSkeleton', true);
        });

        return {
            messages,
            handleScrollToBottom,
            handleScrollKeepPosition,
            handleScrollToTop,
            boxAllMessage,
            loading,
            CONSTANTS,
            nextIsMessage,
            countNewMessage,
            showIndicatorNewMessage,
            router,
            lastMessageSeenByCustomer,
            timeSeenLastMessage,
            filters,
            timeSeen,
            showIndicatorTyping,
            userList,
            envURL,
            userTyping,
            checkUserTypingNote,
            userTypingInConvo,
            userTypingLimit,
        };
    },
};
</script>
<style lang="scss" scoped>
.message-content {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    padding: 16px 8px 0 24px;
    height: 100%;
    overflow-y: auto;
}
.message-content.in-search {
    // height: calc(100vh - 249px - 56px);
}
.loading {
    height: 48px;
    top: 0;
    width: 100%;
    z-index: 1;
    text-align: center;
    left: 0;
    position: absolute;
    background: #ffffff;
    opacity: 0.5;

    :deep(.spinner) {
        margin-top: 14px;
    }
}
.read-receipt {
    text-align: right;
    margin-right: 40px;
    color: #00c850;
    line-height: 16px;
    margin-bottom: 12px;

    img {
        margin-right: 8px;
        image-rendering: pixelated;
    }
}

.typing-indicator {
    margin-top: auto;

    .tiblock {
        align-items: center;
        display: flex;
        padding: 16px;
        width: auto;
        border-radius: 20px;
    }

    .user-note-typing {
        float: right;
        .tiblock {
            border: 1px solid #ffd466;
            border-radius: 4px;
        }
        .avatar-typing-more {
            width: 32px;
            height: 32px;
            border-radius: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
            margin-left: -14px;
        }

        .avatar-typing:not(:first-child) {
            margin-left: -14px;
        }
    }

    .ticontainer .tidot {
        background-color: #90949c;
    }

    .tidot {
        -webkit-animation: mercuryTypingAnimation 1s infinite ease-in-out;
        border-radius: 50%;
        display: inline-block;
        height: 8px;
        margin-right: 4px;
        width: 8px;
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
            height: 8px;
            width: 8px;
        }
        28% {
            -webkit-transform: translateY(-5px);
            height: 8px;
            width: 8px;
        }
        44% {
            -webkit-transform: translateY(0px);
            height: 8px;
            width: 8px;
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
</style>
