<template>
    <div class="inbox-composer">
        <card-component class="flex flex-col pb-12p pt-8p" type="shadow" :class="tab === 'note' ? 'bg-warning-5' : ''">
            <div class="pb-12p pl-8p flex justify-between items-center">
                <tab-component
                    class="inbox-composer-tab-note"
                    v-model:modelValue="tab"
                    :tabs="tabs"
                    default-value="reply"
                    @change="onChangeTab"
                    :type="'pill'"
                >
                </tab-component>
                <div v-if="tab === 'reply'" class="flex">
                    <span class="text-14 text-neutrals-500 mr-10p">Send email</span>
                    <toggle-comp class="mr-10p" :disabled="checkEmailContact" v-model="isSendEmail" :size="'medium'"></toggle-comp>
                </div>
            </div>
            <inbox-composer-contenteditable
                @click="onClickContentEditableComposer"
                :is_whisper="tab === 'note'"
                :isSendEmail="isSendEmail"
                :tab="tab"
                @send="onSendMessage"
            />
        </card-component>
    </div>
</template>

<script type="ts">
import { ref, watch, computed, inject } from 'vue';
import CardComponent from '@/components/ui/CardComponent.vue';
import ToggleComp from '@/components/ui/ToggleComponent.vue';
// import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useSocket } from '@/composables/useSocket';
import { store } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { router, routerPush } from '@/router';
import { useInbox } from '@/modules/inbox/composables/useInbox';
import { useInboxPushingHandler } from '../composables/useInboxPushingHandler';
import CONSTANTS from '../constants/constants';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';
import { useInboxGroupConversation } from '@/modules/inbox/composables/useInboxGroupConversations';
import { useInboxGroup } from '@/modules/inbox/composables/useInboxGroup';
import { useInboxComposer } from '../composables/useInboxComposer';
import { useDragDropFile } from '@/modules/inbox/composables/useDragDropFile';
import InboxComposerContenteditable from './InboxComposerContentEditable.vue';
import TabComponent from '@/components/ui/TabComponent.vue';
import { useContact } from '@/modules/contact/composables/useContact';
import { useInboxConversation } from '@/modules/inbox/composables/useInboxConversation';

const escapeHTML = (text) => {
    return text.replace(/[<>]/g, function (match, pos, originalText) {
        switch (match) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
        }
    });
};

function setCaret(el, pos) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(el, pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

export default {
    name: 'InboxComposer',
    components: {
        // ButtonComponent,
        CardComponent,
        InboxComposerContenteditable,
        TabComponent,
        ToggleComp,
    },
    emits: ['changeAssignedFromComposer', 'handleStatusCustomer'],
    setup(props, { emit }) {
        const { assignUserToConversation } = useInbox();
        const { isSendEmail } = useInboxComposer();
        const { contact } = useContact();
        const { socket } = useSocket();
        const content = ref('');
        const isShowPlaceholder = ref(true);
        const contenteditable = ref(null);
        const user = computed(() => store.state.auth.user);
        const router = useRouter();
        const route = useRoute();
        const { org_id, workspace_id, _id: sender_id, username: sender, full_name, avatar_bg, avatar_src } = user.value;
        const convo_id = computed(() => route.params.conversation);
        const group_name = computed(() => route.params.name);
        const convoId = computed(() => route.params.conversation);
        const emitter = inject('emitter');
        const {
            moveExistConvoToTopConversations,
            setAddonConvo,
            changeNumberGroup,
            currConvo,
            resetgroup,
            isSocketUpdateConvo,
            resetCacheConvoRemove,
            resetCacheConvoResolveAndReopen,
        } = useInboxPushingHandler();
        const { conversations, updateStatusRead } = useInboxGroupConversation({});
        const { showIndicatorNewMessage, countNewMessage, conversationSelected, conversationDetail } =
            useInboxConversationDetail();
        const { changeNumberGroupInSearch } = useInboxGroup();
        const showDropdown = ref(false);
        const tabs = ref([
            { key: 'reply', name: 'Reply' },
            { key: 'note', name: 'Note' },
        ]);
        const tab = ref('reply');
        const { handlePushRouterAfterChangeStatusConvo } = useInboxConversation();
        
        // const onInput = (e) => {
        //     content.value = e.target.innerText;
        //     isShowPlaceholder.value = !content.value;
        // };

        const idFake = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                // eslint-disable-next-line prefer-const
                const r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        };
        const handleSendMessageInConvoResolve = async () => {
            if (tab.value !== 'note') {
                await socket.emit('takeConversation', { convo_id: conversationDetail.value._id });
                await handlePushRouterAfterChangeStatusConvo(conversationDetail.value);
            }
        }

        const onSendMessage = async (data) => {
            if (data) {
                const currConvoTemp = currConvo.value;
                let convoID = convo_id.value;
                const assignCurrentUser = conversationDetail.value.participants.filter((p) => p.parti_type === 1);
                if (router.currentRoute.value.name === 'InboxSearch') {
                    convoID = conversationDetail.value._id;
                    if (assignCurrentUser.length < 1) {
                        if (tab.value !== 'note') {
                            await socket.emit('takeConversation', { convo_id: convoID });
                            emit('changeAssignedFromComposer', convoID);
                            if (conversationDetail.value.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED) {
                                await handlePushRouterAfterChangeStatusConvo(conversationDetail.value);
                            }
                        }
                    } else if(assignCurrentUser.length > 0 && assignCurrentUser[0]['parti_id'] != sender_id) {
                        if (tab.value !== 'note') {
                            await socket.emit('takeConversation', { convo_id: convoID });
                            emit('changeAssignedFromComposer', convoID);
                            if (conversationDetail.value.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED) {
                                await handlePushRouterAfterChangeStatusConvo(conversationDetail.value);
                            }
                        }
                    } else if (conversationDetail.value.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED) {
                        await handleSendMessageInConvoResolve();
                    }
                } else {
                    if (
                        route.query.is_clone !== undefined &&
                        route.query.is_clone &&
                        !currConvo.value.last_message.content
                    ) {
                        if (tab.value !== 'note') {
                            await socket.emit('takeConversation', { convo_id: convo_id.value });
                        }
                    }
                    let checkTakeConversation = false;
                    if (currConvoTemp) {
                        currConvoTemp.last_message.content = data.msgContent;
                        currConvoTemp.last_message.created_at = new Date();
                        currConvoTemp.last_message_send_by_me = true;
                        if (group_name.value === 'unassign') {
                            if (tab.value !== 'note') {
                                await socket.emit('takeConversation', { convo_id: convo_id.value });
                                await new Promise((resolve) => setTimeout(resolve, 200));
                                checkTakeConversation = true;
                                if (assignCurrentUser.length > 0 && assignCurrentUser[0]['parti_id'] != sender_id) {
                                    conversationDetail.value.participants.forEach((par) => {
                                        if (par.parti_type === 1) par.parti_id = sender_id;
                                    });
                                }
                                setAddonConvo(currConvoTemp);
                                await routerPush('InboxGroups', { name: 'assign_to_you', conversation: convoId.value });
                            }
                        } else if (group_name.value === 'all') {
                            if (tab.value !== 'note' && ((assignCurrentUser.length > 0 && assignCurrentUser[0]['parti_id'] != sender_id) || assignCurrentUser.length === 0)) {
                                if (conversationDetail.value.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED) {
                                    await socket.emit('takeConversation', { convo_id: convo_id.value });
                                    checkTakeConversation = true;
                                    await new Promise((resolve) => setTimeout(resolve, 200));
                                    conversationDetail.value.participants.forEach((par) => {
                                        if (par.parti_type === 1) par.parti_id = sender_id;
                                    });
                                    setAddonConvo(currConvoTemp);
                                    resetCacheConvoResolveAndReopen();
                                    await routerPush('InboxGroups', {
                                        name: 'all',
                                        conversation: convoId.value
                                    });
                                } else {
                                    await socket.emit('takeConversation', { convo_id: convo_id.value });
                                    checkTakeConversation = true;
                                    await new Promise((resolve) => setTimeout(resolve, 200));
                                    conversationDetail.value.participants.forEach((par) => {
                                        if (par.parti_type === 1) par.parti_id = sender_id;
                                    });
                                    setAddonConvo(currConvoTemp);
                                    resetCacheConvoResolveAndReopen();
                                    await routerPush('InboxGroups', {
                                        name: 'assign_to_you',
                                        conversation: convoId.value
                                    });
                                }
                            }
                        } else {
                            console.log('is_assigned', currConvo.value.is_assigned);
                            if (conversationDetail.value.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED) {
                                await handleSendMessageInConvoResolve();
                            }
                            if (
                                Object.prototype.hasOwnProperty.call(currConvo.value, 'is_assigned') &&
                                !currConvo.value.is_assigned
                            )
                                if (tab.value !== 'note') {
                                    await socket.emit('takeConversation', { convo_id: convo_id.value });
                                }
                        }
                    }
                    if (
                        assignCurrentUser.length > 0 &&
                        assignCurrentUser[0]['parti_id'] != sender_id &&
                        !checkTakeConversation
                    ) {
                        // take Conversation
                        if (tab.value !== 'note') {
                            await socket.emit('takeConversation', { convo_id: convo_id.value });
                            resetCacheConvoRemove();
                            conversationDetail.value.participants.forEach((par) => {
                                if (par.parti_type === 1) par.parti_id = sender_id;
                            });
                            if (group_name.value === 'unassign' || group_name.value === 'all')
                                await routerPush('InboxGroups', { name: 'assign_to_you', conversation: convo_id.value });
                        }
                    }
                    if (conversationDetail.value.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED) {
                        await handlePushRouterAfterChangeStatusConvo(conversationDetail.value);
                    }
                }
                const params = {
                    org_id,
                    workspace_id,
                    convo_id: convoID,
                    content: data.content,
                    type: data.type,
                    attachments: data.attachments,
                    canned_responses: data.canned_responses,
                    sender_id,
                    sender_type: CONSTANTS.SENT_BY.USER,
                    sender,
                    full_name,
                    avatar_bg,
                    username: sender,
                    fake_id: idFake(),
                    avatar_src:
                        avatar_src !== '' && avatar_src !== null ? `${process.env.VUE_APP_FILE_URL}/${avatar_src}` : '',
                    is_whisper: tab.value === 'note',
                    is_new_convo: route.query.is_clone !== undefined ? route.query.is_clone : false,
                };

                await socket.emit('sendMessage', params, (data) => console.log('Message Send', { data }));

            }
        };

        const handlePaste = (event) => {
            event.preventDefault();
            if (!(event.clipboardData && event.clipboardData.items)) {
                return false;
            }
            const items = event.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    const URLObj = window.URL || window.webkitURL;
                    const source = URLObj.createObjectURL(blob);
                    this.uploadSingleFile(blob);
                    // if (blob.size === 0) {
                    //   return false;
                    // }
                    // this.$emit('image-paste', blob);
                    // return false;
                }
            }
            const text = event.clipboardData.getData('text/plain') || '';

            document.execCommand('insertText', false, escapeHTML(text));
            // this.$nextTick(() => {
            //     this.composerScrolldown();
            // });
        };

        const handleKeydown = (event) => {
            // if (event.keyCode === 13 && !event.shiftKey) {
            //     event.returnValue = false;
            //     onSendMessage();
            // }
        };

        const resetIndicatorNewMessage = () => {
            showIndicatorNewMessage.value = false;
            countNewMessage.value = 0;
            let convoID = '';
            if (router.currentRoute.value.name === 'InboxSearch') convoID = conversationSelected.value._id;
            else {
                convoID = router.currentRoute.value.params.conversation;
                if (typeof convoID !== 'string' && convoID != undefined) convoID = convoID[0];
            }
            conversations.value.forEach((convo) => {
                if (convo.id === convoID) {
                    updateStatusRead(convo.id, 'read');
                }
            });
        };

        const checkEmailContact = computed(() => {
            if (contact.value && typeof contact.value.email != 'undefined') {
                return contact.value.email == null || contact.value.email == '';
            }
            return false
        });

        // Refactor
        const onClickContentEditableComposer = () => {
            resetIndicatorNewMessage();
        };
        //

        const clickInComposer = () => {
            resetIndicatorNewMessage();
        };

        const clickInComposerSpan = () => {
            contenteditable.value.focus();
            resetIndicatorNewMessage();
        };

        const handleTitleTab = () => {
            if (isSendEmail.value) {
                tabs.value.forEach((tab) => {
                    if (tab.key === 'reply') tab.name = 'Reply by email'
                })
            } else {
                tabs.value.forEach((tab) => {
                    if (tab.key === 'reply') tab.name = 'Reply'
                })
            }
        }

        const onChangeTab = (value) => {
            // if (value.key === 'note') {
            //     tabs.value.forEach((tab) => {
            //         if (tab.key === 'reply') tab.name = 'Reply'
            //     })
            // } else {
            //     handleTitleTab()
            // }
        };

        const handleStatusOnlineContact = () => {
            isSendEmail.value = contact.value.online_status === CONSTANTS.ONLINE_STATUS.OFFLINE;
            if (contact.value && typeof contact.value.email != 'undefined') {
                if (contact.value.email === null || contact.value.email === 'null' || contact.value.email == '') isSendEmail.value = false;
            }
        };

        emitter.on('newDataContact', () => {
            handleStatusOnlineContact()
        });

        emitter.on('checkOnlineCustomer', (data) => {
            if (contact.value._id === data._id) {
                if (data.online_status === CONSTANTS.ONLINE_STATUS.OFFLINE && !isSendEmail.value) {
                    emit('handleStatusCustomer', { showAlert: true, status: 'offline' });
                } else if (data.online_status === CONSTANTS.ONLINE_STATUS.ONLINE && isSendEmail.value) {
                    emit('handleStatusCustomer', { showAlert: true, status: 'online' });
                } else {
                    emit('handleStatusCustomer', { showAlert: false, status: 'online' });
                }
                if (data.online_status === CONSTANTS.ONLINE_STATUS.ONLINE) {
                    contact.value.total_sent_email = 0
                }
            }
        });

        watch(content, () => {
            resetIndicatorNewMessage();
        });

        watch(isSendEmail, () => {
            handleTitleTab()
            emit('handleStatusCustomer', {showAlert: false, status: 'online'});
        });

        watch(router.currentRoute, (newVal) => {
            console.log('currentRoute', newVal);
            if (newVal.query.tab === 'note') {
                tab.value = 'note';
            } else {
                tab.value = 'reply';
            }
        });

        return {
            // onInput,
            content,
            onSendMessage,
            contenteditable,
            isShowPlaceholder,
            handleKeydown,
            convo_id,
            handlePaste,
            clickInComposer,
            clickInComposerSpan,
            onClickContentEditableComposer,
            tabs,
            tab,
            onChangeTab,
            isSendEmail,
            contact,
            checkEmailContact,
        };
    },
};
</script>

<style lang="scss">
.inbox-composer {
    width: -webkit-fill-available;
    display: block;
    max-height: 540px;
    z-index: 1;
    &__contentedit {
        min-width: 100px;
        max-height: 260px;
        overflow-wrap: break-word;
        overflow-y: auto;
        word-break: break-all;
        cursor: auto;
        > div {
            min-height: 37px;
        }
        &::-webkit-scrollbar {
            width: 8px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;

            width: 16px;
        }
        &::-webkit-scrollbar-thumb {
            background: #e9e9ec;
            border-radius: 8px;
            // border: 4px solid #f6f6f8;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: #b4b4be;
        }
    }

    :deep(.inbox-composer-tab-note) {
        nav {
            a.selected-tab {
                font-weight: 500;
            }
        }
    }
}
</style>
<style lang="scss">
.inbox-composer-tab-note {
    nav {
        a {
            color: #6b6b7b;
        }
        a.selected-tab {
            font-weight: 500;
            color: #8b6500;
            background: #ffd466;
            border-radius: 4px;
        }
        a.selected-tab.reply {
            color: #3e6dda;
            background: #f6f6f8;
        }
    }
}
</style>
