<template>
    <div class="modal-confirm-send-mail">
        <modal-component
            v-model="showModalSync"
            :width="'563px'"
            :custom-class="'pt-32p'"
            class="z-999"
            :max-height="'495px'"
            :closeIcon="false"
        >
            <template v-slot:body>
                <div class="text-neutrals-700">
                    <span class="block text-neutrals-900 text-center">
                        <div class="pb-14p">
                            <span class="font-heading font-semibold text-24" style="text-transform: capitalize;">
                                {{
                                    typeConfirmSendEmail === 'confirm'
                                        ? $t('inbox.inbox_modal_confirm_send_email_title_confirm')
                                        : $t('inbox.inbox_modal_confirm_send_email_title_max_size')
                                }}
                            </span>
                        </div>
                        <div class="pb-14p">
                            <span v-if="typeConfirmSendEmail === 'confirm'" class="text-14">
                                {{ $t('inbox.inbox_modal_confirm_send_email_content_confirm') }}
                            </span>
                            <span v-else class="text-14">
                                {{ $t('inbox.inbox_modal_confirm_send_email_content_1_max_size') }}
                                <br />
                                {{ $t('inbox.inbox_modal_confirm_send_email_content_2_max_size') }}
                            </span>
                        </div>
                        <div>
                            <ButtonComponent
                                v-if="typeConfirmSendEmail === 'confirm'"
                                class="mr-4p"
                                size="medium"
                                type="secondary"
                                @click="clickSubmitEmail"
                            >
                                {{ $t('inbox.inbox_modal_confirm_send_email_send_anyway') }}
                            </ButtonComponent>
                            <ButtonComponent
                                v-else
                                class="mr-4p"
                                size="medium"
                                type="secondary"
                                @click="clickSubmitSendMessage"
                            >
                                {{ $t('inbox.inbox_modal_confirm_send_email_send_message') }}
                            </ButtonComponent>
                            <ButtonComponent class="ml-4p" size="medium" @click="closeModalHide">
                                {{ $t('inbox.inbox_modal_confirm_send_email_got_it') }}
                            </ButtonComponent>
                        </div>
                    </span>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, inject } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useInboxComposer } from '@/modules/inbox/composables/useInboxComposer';

export default defineComponent({
    name: 'MessageModalConfirmSendEmail',
    components: {
        ModalComponent,
        ButtonComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        typeConfirmSendEmail: {
            type: String,
            default: 'confirm',
        },
    },
    setup(props, { emit }) {
        const { isSendEmail } = useInboxComposer();
        const showFullInfo = ref<boolean>(false);
        const emitter: any = inject('emitter');
        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const clickSubmitEmail = () => {
            emit('close');
            emitter.emit('confirmSendEmail');
        };

        const clickSubmitSendMessage = async () => {
            isSendEmail.value = false;
            await new Promise(resolve => setTimeout(resolve, 100));
            emit('close');
            emitter.emit('confirmSendMessageInApp');
        };

        const closeModalHide = () => {
            emit('close');
        };

        watch(
            () => showModalSync,
            () => {
                showFullInfo.value = false;
            },
            { deep: true },
        );

        return {
            showModalSync,
            showFullInfo,
            closeModalHide,
            clickSubmitEmail,
            clickSubmitSendMessage,
        };
    },
});
</script>
<style lang="scss" scoped>
.modal-confirm-send-mail {
}
</style>
