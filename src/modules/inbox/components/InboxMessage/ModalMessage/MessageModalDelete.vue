<template>
    <div>
        <modal-component
            v-model="showModalSync"
            :custom-class="'py-24p'"
            :width="'560px'"
            class="model-add-contact z-999"
        >
            <template v-slot:header>
                <div class="flex">
                    <icon-component name="exclamation-circle" class="icon-recently cursor-pointer" color="error-3" />
                    <span class="font-medium text-16 ml-4p">
                        {{
                            message.is_whisper
                                ? $t('inbox.inbox_modal_delete_message_note_title')
                                : $t('inbox.inbox_modal_delete_message_title')
                        }}
                    </span>
                </div>
            </template>
            <template v-slot:body>
                <div class="px-24p py-16p text-center text-14">
                    {{
                        message.is_whisper
                            ? $t('inbox.inbox_modal_delete_message_note_body_content')
                            : $t('inbox.inbox_modal_delete_message_body_content')
                    }}
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <Button class="mr-8p" type="outline" size="medium" @click="closeModalHide">{{
                        $t('setting.teammate_modal_edit_email_button_cancel')
                    }}</Button>
                    <Button size="medium" type="destructive" @click="clickDelete">
                        {{ $t('inbox.inbox_modal_delete_message_submit') }}
                    </Button>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, onMounted } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useToast } from '@/composables/useToast';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';

export default defineComponent({
    name: 'MessageModalDelete',
    components: {
        ModalComponent,
        Button,
        IconComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        message: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {},
        },
    },
    setup(props, { emit }) {
        const { deleteMessage, handleMessageDeleted, conversationDetail } = useInboxConversationDetail();

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const closeModalHide = () => {
            emit('close');
        };

        const clickDelete = async () => {
            const res = await deleteMessage(props.message._id);
            if (!res.error) {
                if (props.message.tags && props.message.tags.length > 0) {
                    props.message.tags.forEach((tag: any) => {
                        const findIndex = conversationDetail.value.tags.findIndex((t: any) => t === tag);
                        if (findIndex > -1) conversationDetail.value.tags.splice(findIndex, 1);
                    });
                }

                emit('close');
                // await handleMessageDeleted(props.message);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            emit('close');
        };

        return {
            showModalSync,
            closeModalHide,
            clickDelete,
        };
    },
});
</script>
