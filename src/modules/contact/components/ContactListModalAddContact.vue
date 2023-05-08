<template>
    <modal-component v-model="showModalSync" :custom-class="'py-24p'" :width="'464px'" class="model-add-contact z-999">
        <template v-slot:header>
            <div class="flex">
                <span class="font-medium text-16">{{ $t('contact.contact_list_modal_add_contact_header') }}</span>
            </div>
        </template>
        <template v-slot:body>
            <div class="px-32p">
                <form>
                    <!-- full name section -->
                    <div class="inline-block text-14 mb-4p font-medium">
                        {{ $t('contact.contact_list_modal_fullname_label') }}
                    </div>
                    <Input
                        :state="fullnameValue && invalidFullname ? 'error' : 'primary'"
                        v-model.trim="fullnameValue"
                        :maxlength="60"
                        type="text"
                        :placeholder="$t('contact.contact_list_modal_fullname_placeholder')"
                    >
                    </Input>
                    <div v-if="fullnameValue && invalidFullname" class="text-error-3 text-14 mt-4p">
                        {{ $t('contact.contact_list_modal_error_invalid_name') }}
                    </div>
                    <!-- email section -->
                    <div class="inline-block text-14 mb-4p font-medium mt-24p">
                        {{ $t('contact.contact_list_modal_email_label') }}
                    </div>
                    <Input
                        :state="emailValue && invalidEmail ? 'error' : 'primary'"
                        v-model="emailValue"
                        type="text"
                        :placeholder="$t('contact.contact_list_modal_email_placeholder')"
                    >
                    </Input>
                    <div v-if="emailValue && invalidEmail" class="text-error-3 text-14 mt-4p">
                        {{ $t(`contact.contact_list_modal_error_${invalidEmail}`) }}
                    </div>
                    <!-- customer id section -->
                    <div class="inline-block text-14 mb-4p font-medium mt-24p">
                        {{ $t('contact.contact_list_modal_customer_id_label') }}
                        <span class="text-neutrals-200">({{ $t('contact.contact_list_modal_customer_id_label_optional') }})</span>
                    </div>
                    <Input
                        :state="customerIdValue && invalidCustomerId ? 'error' : 'primary'"
                        v-model.trim="customerIdValue"
                        type="text"
                        :maxlength="100"
                        :placeholder="$t('contact.contact_list_modal_customer_id_placeholder')"
                    >
                    </Input>
                    <div v-if="customerIdValue && invalidCustomerId" class="text-error-3 text-14 mt-4p">
                        {{ $t('contact.contact_list_modal_error_customer_id_is_exists') }}
                    </div>
                </form>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end">
                <Button class="mr-8p" type="outline" size="medium" @click="closeModal">
                    {{ $t('contact.contact_list_modal_btn_cancel') }}
                </Button>
                <Button size="medium" :disabled="onDisabledSubmit" @click="onSubmit">
                    {{ $t('contact.contact_list_modal_btn_add') }}
                </Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useContact } from '@/modules/contact/composables/useContact';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import { validateEmail } from '@/utils/validate';
import { routerPush } from '@/router';

export default defineComponent({
    name: 'ContactListModalAddContact',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        Button,
        Input,
        ModalComponent,
    },
    setup(props, { emit }) {
        const fullnameValue = ref<string>('');
        const emailValue = ref<string>('');
        const customerIdValue = ref<string>('');
        const errorMessageEmail = ref<string>('');
        const errorMessageCustomerId = ref<string>('');
        const { createContact, error, errorMessage } = useContact();
        const { addToast } = useToast();
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

        const invalidFullname = computed(() => {
            if (fullnameValue.value !== '') {
                return 5 >= fullnameValue.value.length || fullnameValue.value.length > 60;
            }
            return false;
        });
        const invalidEmail = computed(() => {
            if (emailValue.value !== '' && errorMessage.value && errorMessageEmail.value === 'email_is_exists') {
                return 'email_is_exists';
            }
            if (!emailValue.value) {
                return '';
            }
            if (emailValue.value !== '' && !validateEmail(emailValue.value)) {
                return 'invalid_email';
            }
            return '';
        });
        const invalidCustomerId = computed(() => {
            if (
                customerIdValue.value !== '' &&
                errorMessage.value &&
                errorMessageCustomerId.value === 'hash_id_is_used'
            ) {
                return true;
            }
            if (!customerIdValue.value) {
                return false;
            }
            return false;
        });
        const onDisabledSubmit = computed(() => {
            if (fullnameValue.value === '' || emailValue.value === '') {
                return true;
            }
            if (fullnameValue.value !== '' && emailValue.value !== '') {
                if (invalidFullname.value || invalidEmail.value !== '') {
                    return true;
                }
                if (customerIdValue.value && invalidCustomerId.value && errorMessage.value) {
                    return true;
                }
            }
            return false;
        });

        const closeModal = async () => {
            emit('close');
        };
        const onSubmit = async () => {
            const newContact: any = {
                email: emailValue.value,
                full_name: fullnameValue.value,
                hash_id: customerIdValue.value,
            };
            const res = await createContact(newContact);
            if (errorMessage.value !== null && Object.keys(errorMessage.value)) {
                for (let index = 0; index < Object.keys(errorMessage.value).length; index++) {
                    const errorKey = Object.keys(errorMessage.value)[index];
                    if (errorKey === 'email_is_exists') {
                        errorMessageEmail.value = Object.keys(errorMessage.value)[index];
                    }
                    if (errorKey === 'hash_id_is_used') {
                        errorMessageCustomerId.value = Object.keys(errorMessage.value)[index];
                    }
                }
                return;
            }
            if (!error.value) {
                const contact: any = res;
                addToast({
                    title: t('contact.contact_list_modal_toast_contact_added_successful'),
                    type: 'basic',
                    timeout: 3000,
                });
                if (contact.hash_id) {
                    routerPush('ContactDetail', { contactId: contact._id });
                }
                closeModal();
            }
        };
        watch(
            () => emailValue.value,
            () => {
                if (errorMessageEmail.value) {
                    errorMessageEmail.value = '';
                }
            },
            { deep: true },
        );
        watch(
            () => customerIdValue.value,
            () => {
                if (errorMessageCustomerId.value) {
                    errorMessageCustomerId.value = '';
                }
            },
            { deep: true },
        );
        watch(
            () => props.showModal,
            () => {
                fullnameValue.value = '';
                emailValue.value = '';
                customerIdValue.value = '';
            },
            { deep: true },
        );

        return {
            errorMessage,
            fullnameValue,
            emailValue,
            customerIdValue,
            invalidFullname,
            invalidEmail,
            invalidCustomerId,
            onDisabledSubmit,
            showModalSync,
            errorMessageEmail,
            errorMessageCustomerId,
            closeModal,
            onSubmit,
        };
    },
});
</script>

<style lang="scss" scoped></style>
