<template>
    <widget-composer @send="onSendMessage" @click="clickInComposer" :typingFunc="readAllMessage" />
</template>

<script>
import { watch, ref, inject, onMounted } from 'vue';
import constants from '../constants/constants';
import { useInbox } from '../composables/useInbox';
import WidgetComposer from './WidgetComposer.vue';

export default {
    name: 'WidgetComposerContainer',
    components: {
        WidgetComposer,
    },
    props: {
        modelValue: String, // previously was `value: String`
        isNewConvo: Boolean,
    },
    emits: ['handleOldConvo', 'update:modelValue'],
    setup(props, { attrs, slots, emit }) {
        const socket = inject('socket');
        const {
            org_id,
            workspace_id,
            conversation_id,
            _id: sender_id,
            full_name,
            avatar_bg,
            avatar_src,
        } = inject('contact');
        const { countNewMessage, showIndicatorNewMessage, messages } = useInbox();
        const isDemoMode = inject('isDemoMode');
        const emitter = inject('emitter');

        const onSendMessage = async (content) => {
            if (content) {
                if (content.type == '') {
                    console.log('hello');
                    const paramsText = {
                        org_id,
                        workspace_id,
                        convo_id: conversation_id,
                        sender_id,
                        type: 1,
                        content: content.content,
                        attachments: [],
                        sender_type: constants.SENT_BY.CUSTOMER,
                        full_name,
                        avatar_src,
                        avatar_bg,
                        is_new_convo: props.isNewConvo,
                    };
                    const paramsImg = {
                        org_id,
                        workspace_id,
                        convo_id: conversation_id,
                        sender_id,
                        type: 3,
                        content: '',
                        attachments: content.attachments,
                        sender_type: constants.SENT_BY.CUSTOMER,
                        full_name,
                        avatar_src,
                        avatar_bg,
                        is_new_convo: props.isNewConvo,
                    };
                    socket.emit('sendMessage', paramsText, (data) => console.log('Message Send', { data }));
                    await new Promise((resolve) => setTimeout(resolve, 200));
                    socket.emit('sendMessage', paramsImg, (data) => console.log('Message Send', { data }));
                } else {
                    const params = {
                        org_id,
                        workspace_id,
                        convo_id: conversation_id,
                        sender_id,
                        // content: content,
                        type: content.type,
                        content: content.content,
                        attachments: content.attachments,
                        sender_type: constants.SENT_BY.CUSTOMER,
                        full_name,
                        avatar_src,
                        avatar_bg,
                        is_new_convo: props.isNewConvo,
                    };
                    if (!isDemoMode) {
                        socket.emit('sendMessage', params, (data) => console.log('Message Send', { data }));
                    } else {
                        console.log('send nè', params);
                        params.created_at = new Date();
                        params.format = 'message';
                        params.group = 1;
                        const data = {};
                        emitter.emit('sendMessageDemo', params);
                    }
                }
                if (props.isNewConvo) {
                    emit('handleNewConvo');
                }
            }
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

        const readAllMessage = () => {
            showIndicatorNewMessage.value = false;
            countNewMessage.value = 0;
            const checkLassMessageSendByUser = checkLassMessage();
            if (checkLassMessageSendByUser) {
                const params = {
                    convo_id: conversation_id,
                    sender_id,
                };
                socket.emit('seenMessage', params, (data) => console.log('seenMessage', { data }));
            }
        };

        const clickInComposer = () => {
            !isDemoMode && readAllMessage();
        };

        return {
            onSendMessage,
            //     content,
            //     onInput,
            //     handleKeydown,
            //     isShowPlaceholder,
            //     contenteditable,
            //     handlePaste,
            clickInComposer,
            readAllMessage,
            //     clickInComposerSpan,
        };
    },
};
</script>

<style lang="scss">
.widget-composer {
    // width: -webkit-fill-available;
    display: flex;
    max-height: 180px;
    z-index: 1;
    position: relative;
    background: #f2f2f2;
    border-radius: 20px;
    padding: 10px 16px;
    box-sizing: border-box;
    // min-height: 40px;
    width: calc(100% - 48px - 48px);
    margin-right: 8px;
    &__send-icon {
        height: 20px;
        position: relative;
        align-self: flex-end;
        cursor: pointer;
        > div {
            position: absolute;
            bottom: 0;
        }
    }
    &__wp {
        flex-grow: 1;
        margin-right: 8px;
        max-height: 160px;
        overflow-wrap: break-word;
        overflow-y: auto;
        word-break: break-all;
        cursor: auto;
        &-placeholder {
            position: absolute;
            color: #828292;
            font-size: 14px;
            line-height: 20px;
        }
        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;
            padding: 0 30px;
            width: 6px;
        }
        &::-webkit-scrollbar-thumb {
            background: transparent;

            border-radius: 8px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: transparent;
        }
        &:hover {
            &::-webkit-scrollbar {
                width: 6px;
            }
            &::-webkit-scrollbar-track {
                background: transparent;
                padding: 0 30px;
                width: 6px;
            }
            &::-webkit-scrollbar-thumb {
                background: #b4b4be;
                border-radius: 8px;
            }
            &::-webkit-scrollbar-thumb:hover {
                background: #b4b4be;
            }
        }
    }
}
</style>
