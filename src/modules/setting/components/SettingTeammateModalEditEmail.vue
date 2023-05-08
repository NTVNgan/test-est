<template>
    <modal-component v-model="showModalSync" :custom-class="'py-24p'" :width="'464px'" class="model-add-contact z-999">
        <template v-slot:header>
            <div class="flex">
                <span class="font-medium text-16">{{ $t('setting.teammate_modal_edit_email_title') }}</span>
            </div>
        </template>
        <template v-slot:body>
            <div class="px-32p">
                <span class="inline-block text-14 mb-4p font-medium">
                    {{ $t('setting.teammate_modal_edit_email_input_label') }}
                </span>
                <Input
                    :state="emailErrorMessage !== '' ? 'error' : 'primary'"
                    v-model.trim="emailValue"
                    type="text"
                    :placeholder="$t('setting.teammate_modal_edit_email_input_placeholder')"
                ></Input>
                <p class="text-error-3 text-14 mt-4p" v-if="emailErrorMessage !== ''">
                    {{ $t(`setting.invite_teammate_error_${emailErrorMessage}`) }}
                </p>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end">
                <Button class="mr-8p" type="outline" size="medium" @click="closeModal">
                    {{ $t('setting.teammate_modal_edit_email_button_cancel') }}
                </Button>
                <Button size="medium" :disabled="checkDisableButton || loading" @click="onSubmit">
                    {{ $t('setting.teammate_modal_edit_email_button_confirm') }}
                </Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, onMounted } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useTeammate } from '@/modules/setting/composables/useTeammate';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import { validateEmail } from '@/utils/validate';
import { routerPush } from '@/router';

export default defineComponent({
    name: 'SettingTeammateEditEmailModal',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        teammate: {
            type: Object,
            default: null,
        },
    },
    components: {
        Button,
        Input,
        ModalComponent,
    },
    setup(props, { emit }) {
        const { error, errorMessage, loading, editEmailTeammate } = useTeammate();
        const { addToast } = useToast();
        const emailCloneValue = ref<string>('');
        const emailValue = ref<string>('');
        const { t } = useI18n();
        const emitter: any = inject('emitter');

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const emailErrorMessage = computed(() => {
            if (emailValue.value !== '' && errorMessage.value) {
                return Object.keys(errorMessage.value)[0];
            }
            if (emailValue.value !== '' && !validateEmail(emailValue.value)) {
                return 'email_format_invalid';
            }
            return '';
        });
        const checkDisableButton = computed(() => {
            if (emailCloneValue.value === emailValue.value) {
                return true;
            }
            if (emailErrorMessage.value !== '') {
                return true;
            }
            if (!emailValue.value) {
                return true;
            }
            return '';
        });

        const closeModal = async () => {
            emit('close');
        };

        const onSubmit = async () => {
            if (checkDisableButton.value) return;
            const res = await editEmailTeammate({ email: emailValue.value }, props.teammate.id);
            if (error.value && errorMessage.value && Object.keys(errorMessage.value)[0] === 'user_activated') {
                closeModal();
                emit('showModalEditActivedEmail');
            }
            if (error.value && errorMessage.value && Object.keys(errorMessage.value)[0] === 'user_not_found') {
                closeModal();
                emit('showModalErrorDeletedRecord', 'edit');
            }
            if (!error.value) {
                addToast({
                    title: t('setting.teammate_modal_edit_email_toast_success'),
                    type: 'basic',
                    timeout: 3000,
                });
                emit('onEditEmail', res);
                closeModal();
            }
        };

        watch(
            () => props.showModal,
            () => {
                emailValue.value = props.teammate?.email;
                emailCloneValue.value = props.teammate?.email;
            },
            { deep: true },
        );
        watch(
            () => emailValue.value,
            () => {
                errorMessage.value = null;
            },
            { deep: true },
        );

        return {
            loading,
            emailValue,
            emailErrorMessage,
            showModalSync,
            checkDisableButton,
            closeModal,
            onSubmit,
        };
    },
});
</script>

<style lang="scss" scoped></style>
