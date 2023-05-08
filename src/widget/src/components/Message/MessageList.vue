<template>
    <div class="message-content" ref="boxAllMessage" @scroll="handleScrollToTop">
        <div class="content-null"></div>
        <div v-if="loading" class="loading">
            <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div v-for="(groups, key) in messages" :key="key">
            <MessageNotification
                :contentArr="[
                    {
                        text: key,
                        bold: true,
                    },
                ]"
                :isDate="true"
            ></MessageNotification>
            <template v-for="(message, key) in groups" :key="key">
                <div v-if="message && message.length === 1 && message[0].format === 'message'">
                    <MessageDetailSingle
                        :message="message[0]"
                        :position="message[0].sender_type !== constants.SENT_BY.CUSTOMER ? 'left' : 'right'"
                        :background="message[0].sender_type !== constants.SENT_BY.CUSTOMER ? '#F6F6F8' : '#3E6DDA'"
                        :textColor="message[0].sender_type !== constants.SENT_BY.CUSTOMER ? '#141417' : '#ffffff'"
                        :showAvatar="message[0].sender_type === constants.SENT_BY.USER ? true : false"
                        :margin-bottom="nextIsMessage(key, groups)"
                        :scroll="scroll"
                    ></MessageDetailSingle>
                </div>
                <div v-if="message && message.length > 1">
                    <MessageDetailGroup
                        :message="message"
                        :margin-bottom="nextIsMessage(key, groups)"
                        :scroll="scroll"
                    ></MessageDetailGroup>
                </div>
            </template>
        </div>
        <div v-show="showIndicatorTyping" class="typing-indicator inline-block">
            <div class="ticontainer inline-block">
                <div class="tiblock">
                    <div class="tidot dot-first"></div>
                    <div class="tidot dot-center"></div>
                    <div class="tidot dot-last"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script >
import { onMounted, ref, inject, watch } from 'vue';
// // import { useSocket } from '@/composables/useSocket';
import MessageDetailSingle from './MessageDetailSingle.vue';
import MessageDetailGroup from './MessageDetailGroup.vue';
import MessageNotification from './MessageNotification.vue';
import { useInbox } from '../../composables/useInbox';
import constants from '../../constants/constants';

export default {
    name: 'MessageList',
    components: { MessageNotification, MessageDetailSingle, MessageDetailGroup },
    emits: ['handleNewConvo'],
    props: ['isShowWidgetBox', 'clickReadAll'],
    setup(props, { attrs, slots, emit }) {
        const {
            formatDataConversationDetail,
            callData,
            messages,
            nextPage,
            mergeMessageNew,
            countNewMessage,
            showIndicatorNewMessage,
            handleMessageDeleted,
        } = useInbox(emit);
        const boxAllMessage = ref();
        const loading = ref(false);
        const socket = inject('socket');
        const scrollHeightValue = ref(0);
        const scroll = ref(0);
        const { conversation_id, _id: sender_id } = inject('contact');
        const showIndicatorTyping = ref(false);

        const handleScrollToBottomScreen = async () => {
            // await new Promise(resolve => setTimeout(resolve, 100));
            if (boxAllMessage.value != null) {
                boxAllMessage.value.scrollTop = boxAllMessage.value.scrollHeight - scrollHeightValue.value + 50;
                scrollHeightValue.value = boxAllMessage.value.scrollHeight;
            }
        };

        const handleScrollToBottom = async time => {
            await new Promise(resolve => setTimeout(resolve, time));
            if (boxAllMessage.value != null) boxAllMessage.value.scrollTop = boxAllMessage.value.scrollHeight;
        };

        const checkLassMessage = () => {
            if (Object.values(messages.value).length > 0) {
                const lastMessage = Object.values(messages.value)[Object.values(messages.value).length - 1];
                if (
                    lastMessage[lastMessage.length - 1].slice(-1) !== undefined &&
                    lastMessage[lastMessage.length - 1].slice(-1)[0].sender_type === constants.SENT_BY.USER
                ) {
                    return true;
                }
            }
            return false;
        };

        const readAll = () => {
            countNewMessage.value = 0;
            showIndicatorNewMessage.value = false;
            const checkLassMessageSendByUser = checkLassMessage();
            if (checkLassMessageSendByUser) {
                const params = {
                    convo_id: conversation_id,
                    sender_id,
                };
                socket.emit('seenMessage', params, data => console.log('seenMessage', { data }));
            }
        };

        const resetIndicator = () => {
            readAll();
            handleScrollToBottom(0);
        };

        onMounted(async () => {
            await callData(false);
            handleScrollToBottom(100);
        });

        socket.on('incomingMessage', async data => {
            console.log('incomingMessage', { data });
            if (data.group == constants.GROUP.LOG) return;
            let isCheckBottom = false;
            if (
                boxAllMessage.value.scrollTop + boxAllMessage.value.clientHeight >= boxAllMessage.value.scrollHeight ||
                data.sender_type == constants.SENT_BY.CUSTOMER
            ) {
                readAll();
                isCheckBottom = true;
            } else {
                countNewMessage.value++;
                showIndicatorNewMessage.value = true;
            }
            const newMessage = await formatDataConversationDetail([data]);
            await mergeMessageNew(newMessage);
            if (isCheckBottom) handleScrollToBottom(0);
        });

        socket.off('message.typing').on('message.typing', async data => {
            if (data.data.sender_type === 1 && !data.data.is_whisper) {
                if (data.data.convo_id === conversation_id) {
                    if (
                        data.data.type === 'start' &&
                        boxAllMessage.value.scrollTop + boxAllMessage.value.clientHeight >=
                            boxAllMessage.value.scrollHeight
                    ) {
                        handleScrollToBottom(100);
                    }
                    showIndicatorTyping.value = data.data.type === 'start';
                }
            }
        });

        socket.off('message.delete.complete').on('message.delete.complete', async data => {
            if (data.convo_id === conversation_id) {
                await handleMessageDeleted(data.data);
            }
        });

        const handleScrollToTop = async target => {
            if (target.target.scrollTop + target.target.clientHeight >= target.target.scrollHeight) {
                readAll();
            }
            scroll.value++;
            if (nextPage.value == '' || nextPage.value == null || nextPage.value == 'null') return;
            scrollHeightValue.value = target.target.scrollHeight;
            if (target.target.scrollTop == 0) {
                loading.value = true;
                await new Promise(resolve => setTimeout(resolve, 1000));
                await callData(true);
                loading.value = false;
                handleScrollToBottomScreen();
            }
        };

        const nextIsMessage = (key, list) => {
            if (key === list.length - 1) return '24';
            if (typeof list[key + 1] === 'undefined' || list[key + 1].length < 1 || typeof list[key + 1][0]['group'] === 'undefined') return '24';
            if (list[key + 1][0]['group'] === constants.GROUP.MESSAGE) return '12';
            return '24';
        };

        watch(
            () => props.isShowWidgetBox,
            () => {
                handleScrollToBottom(100);
            },
        );

        watch(
            () => props.clickReadAll,
            async () => {
                resetIndicator();
            },
        );

        return {
            messages,
            handleScrollToBottom,
            handleScrollToBottomScreen,
            handleScrollToTop,
            boxAllMessage,
            loading,
            nextPage,
            constants,
            nextIsMessage,
            scroll,
            showIndicatorTyping,
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
    padding: 0;
    height: 100%;
    overflow-y: auto;
    padding-right: 12px;

    .content-null {
        padding: 10px 0;
    }
}
.loading {
    height: 18px;
    top: 0;
    width: 100%;
    z-index: 1;
    text-align: center;
    left: 0;
    margin-bottom: 20px;
    margin-top: 8px;
}
// .message-content::-webkit-scrollbar {
//     width: 8px;
// }
// /* Track */
// .message-content::-webkit-scrollbar-track {
//     background: #ffffff;
//     margin: 0 30px;
// }
// /* Handle */
// .message-content::-webkit-scrollbar-thumb {
//     background: #e9e9ec;
//     border: 4px solid transparent;
//     border-radius: 4px;
// }
// /* Handle on hover */
// .message-content::-webkit-scrollbar-thumb:hover {
//     background: #c3c3c3;
// }
.inline-block {
    display: inline-block;
}
.typing-indicator {
    margin-top: auto;

    .tiblock {
        align-items: center;
        display: flex;
        padding: 16px;
        width: auto;
        background: #f6f6f8;
        border-radius: 20px;
        margin-bottom: 0;
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
<style lang='scss'>
.linebase-widget {
    .message-content .lds-ring {
        display: inline-block;
        position: relative;
        width: 18px;
        height: 18px;
    }

    .message-content .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 18px;
        height: 18px;
        border: 2px solid #3e6dda;
        border-radius: 50%;
        -webkit-animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #3e6dda transparent transparent transparent;
    }

    .message-content .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
    }

    .message-content .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
    }

    .message-content .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
    }

    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
}
</style>
