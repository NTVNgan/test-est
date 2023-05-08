<template>
    <div>
        <modal-component v-model="showModalSync" :custom-class="'py-24p'" :width="'596px'" class="model-add-contact z-1" @close="closeModal">
            <template v-slot:header>
                <div class="flex">
                    <span class="font-medium text-16">Send a message</span>
                </div>
            </template>
            <template v-slot:body>
                <div class="text-14 px-32p font-medium flex items-center">
                    <Avatar
                        size="medium"
                        :label-avatar="contact.full_name"
                        :image="contact.avatar_src ? envURL + '/' + contact.avatar_src : ''"
                        :bgAvatar="contact.avatar_bg"
                        :showImageTiny="true"
                        :showBackgroundCompulsory="true"
                    />
                    <span class="ml-16p break-all">{{ contact.full_name }}</span>
                </div>
                <contact-composer v-model="messageValue" :is-hide-btn="true" class="mt-16p mx-32p h-232 w-532" />
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <button-component
                        type="outline"
                        class="mr-8p px-16p w-75 flex justify-center"
                        size="outline"
                        @click="closeModal"
                    >
                        Cancel
                    </button-component>
                    <button-component
                        type="primary"
                        class="w-80 justify-center"
                        size="medium"
                        :disabled="!messageValue.trim()"
                        @click="onSendMessage(true)"
                    >
                        Send
                    </button-component>
                </div>
            </template>
        </modal-component>
        
        <modal-component
            v-model="confirmSendMessage"
            :width="'496px'"
            :custom-class="'pt-32p'"
            class="z-999"
            :max-height="'495px'"
            :closeIcon="false"
        >
            <template v-slot:body>
                <div class="text-neutrals-700">
                    <span class="block text-neutrals-900 text-center">
                        <div class="pb-12p">
                            <span class="font-heading font-semibold text-24" style="text-transform: capitalize;">
                                Customer offline
                            </span>
                        </div>
                        <div class="pb-12p">
                            <span class="text-14">
                                This message could be sent as an email.
                                <br />
                                Sending via email keeps customer updated when they’re offline.
                            </span>
                        </div>
                        <div>
                            <ButtonComponent
                                class="mr-4p"
                                size="medium"
                                type="secondary"
                                @click="onSendMessage(false)"
                            >
                                {{ $t('inbox.inbox_modal_confirm_send_email_send_message') }}
                            </ButtonComponent>
                            <ButtonComponent @click="onSendEmail" class="ml-4p" size="medium">
                                Send email
                            </ButtonComponent>
                        </div>
                    </span>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch ,inject} from 'vue';
import Avatar from '@/components/ui/AvatarComponent.vue';
import ContactComposer from '@/modules/contact/components/ContactComposer.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useSocket } from '@/composables/useSocket';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import { routerPush } from '@/router';
import { useInboxPushingHandler } from '@/modules/inbox/composables/useInboxPushingHandler';
import { store } from '@/store';
import CONSTANTS from '@/modules/inbox/constants/constants';

export default defineComponent({
    name: 'ContactDetailtModalSendMessage',
    components: {
        // Input,
        ContactComposer,
        ButtonComponent,
        Avatar,
        ModalComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        convo: {
            default: null,
        },
        contact: {
            default: null,
        },
    },
    emits: ['update:modelValue', 'update:showModal', 'change', 'close'],
    setup(props: any, { emit }) {
        const { socket } = useSocket();
        const inputSendMessage = ref(null);
        const { addToast } = useToast();
        const { t } = useI18n();
        const envURL = process.env.VUE_APP_CONTACT_AVATAR_URL;
        const messageValue = ref('');
        const isShowPlaceholder = ref(true);
        const confirmSendMessage = ref(false);
        const isSendEmail = ref(false);
        const emitter: any = inject('emitter');
        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });
        
        const {
            changeNumberGroup,
            setAddonConvo,
            currConvo,
            detectConvoGroup,
            isOnGetNewConversations,
            isPushRouteFromAnotherPage,
            messageConversationCache,
        } = useInboxPushingHandler();
        const user = computed(() => store.state.auth.user);
        const { org_id, workspace_id, _id: sender_id, username: sender, full_name, avatar_bg, avatar_src } = user.value;

        const closeModal = async () => {
            emit('close');
            emitter.emit('closeModalSendMessage')
            messageValue.value = '';
        };

        const idFake = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                // eslint-disable-next-line prefer-const
                const r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        };

        const onSendMessage = async (checkOnline: any) => {
            const content = messageValue.value.trim();
            if (checkOnline && props.contact.online_status === 3 && props.contact.email !== '' && props.contact !== null && props.contact !== 'null') {
                confirmSendMessage.value = true;
                return;
            }
            if (content) {
                const currConvo: any = {
                    _id: props.convo._id,
                    last_message: {
                        content,
                        created_at: new Date(),
                        sender_type: 1,
                        sender_id: sender_id,
                        sent_by: 1,
                    },
                    created_at: null,
                    customer: {
                        avatar_bg: props.contact.avatar_bg,
                        avatar_src: props.contact.avatar_src,
                        full_name: props.contact.full_name,
                        id: props.convo.customer_id,
                        online_status: 3,
                        status: 1,
                    },
                    isSeen: true,
                    is_pinned: false,
                    last_message_send_by_me: true,
                    ord_id: props.contact.org_id,
                    status: 1,
                    id: props.convo._id,
                };
                setAddonConvo(currConvo);
                isOnGetNewConversations.value = true;
                isPushRouteFromAnotherPage.value = false;
                await socket.emit('takeConversation', { convo_id: props.convo._id });
                const params = {
                    org_id,
                    workspace_id,
                    convo_id: props.convo._id,
                    content,
                    sender_id,
                    sender_type: CONSTANTS.SENT_BY.USER,
                    sender,
                    full_name,
                    avatar_bg,
                    username: sender,
                    avatar_src: avatar_src != '' && avatar_src !== null ? `${process.env.VUE_APP_FILE_URL}/${avatar_src}` : '',
                    is_whisper: false,
                    is_new_convo: true,
                    fake_id: idFake(),
                    type: isSendEmail.value ? CONSTANTS.MESSAGE_TYPE.EMAIL : CONSTANTS.MESSAGE_TYPE.TEXT,
                };
                await socket.emit('sendMessage', params, (data: any) => console.log('Message Send', { data }));
                await routerPush('InboxGroups', { name: 'assign_to_you', conversation: props.convo._id });

                messageConversationCache.value = [
                    {
                        avatar_bg,
                        content: sender_id,
                        created_at: new Date(),
                        group: 2,
                        convo_id: props.convo._id,
                        org_id,
                        status: 1,
                        type: 4,
                        sender_id,
                    },
                    {
                        avatar_bg,
                        content,
                        created_at: new Date(),
                        group: 1,
                        convo_id: props.convo._id,
                        org_id,
                        status: 1,
                        type: 1,
                        sender_id,
                    },
                ];
            }
        };
        
        const onSendEmail = () => {
            isSendEmail.value = true;
            onSendMessage(false);
        }

        return {
            closeModal,
            envURL,
            inputSendMessage,
            messageValue,
            onSendMessage,
            confirmSendMessage,
            showModalSync,
            onSendEmail,
        };
    },
});
</script>

<style lang="scss" scoped></style>
