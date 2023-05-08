<template>
    <div class="message-content" ref="boxAllMessage">
        <div class="content-null"></div>
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
                        :position="'right'"
                        :background="'#3E6DDA'"
                        :textColor="'#ffffff'"
                        :showAvatar="false"
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
    </div>
</template>

<script >
import { onMounted, ref, inject, watch, onUnmounted } from 'vue';
// // import { useSocket } from '@/composables/useSocket';
import MessageDetailSingle from './MessageDetailSingle.vue';
import MessageDetailGroup from './MessageDetailGroup.vue';
import MessageNotification from './MessageNotification.vue';
import { useInbox } from '../../composables/useInbox';
import constants from '../../constants/constants';

export default {
    name: 'MessageListDemoMode',
    components: { MessageDetailSingle, MessageDetailGroup, MessageNotification },
    emits: ['handleNewConvo'],
    setup(props, { attrs, slots, emit }) {
        const { messages, mergeMessageNew, formatDataConversationDetail } = useInbox(emit);
        const scroll = ref(0);
        const boxAllMessage = ref();

        const emitter = inject('emitter');

        const handleScrollToBottom = async (time) => {
            await new Promise((resolve) => setTimeout(resolve, time));
            if (boxAllMessage.value != null) boxAllMessage.value.scrollTop = boxAllMessage.value.scrollHeight;
        };

        const handleSendMessageDemo = async (data) => {
            const newMessage = await formatDataConversationDetail([data]);
            await mergeMessageNew(newMessage, true);
            handleScrollToBottom(100)
        };

        emitter.on('sendMessageDemo', handleSendMessageDemo);

        onUnmounted(() => {
            emitter.off('sendMessageDemo', handleSendMessageDemo);
        });

        const nextIsMessage = (key, list) => {
            if (key === list.length - 1) return '24';
            if (list[key + 1][0]['group'] === constants.message.MESSAGE) return '12';
            return '24';
        };

        return {
            messages,
            nextIsMessage,
            scroll,
            boxAllMessage,
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
<style>
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
</style>
