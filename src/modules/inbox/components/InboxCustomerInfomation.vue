<template>
    <div class="py-24p px-16p mb-8p bg-white rounded-4p border border-solid border-neutrals-100">
        <div class="flex items-start">
            <Avatar
                size="medium"
                :label-avatar="contact.full_name"
                :image="contact.avatar_src ? envURL + '/' + contact.avatar_src : ''"
                :bgAvatar="contact.avatar_bg"
                :online="contact.online_status"
                :showImageTiny="true"
                :showBackgroundCompulsory="true"
            />
            <Editable
                class="ml-4p pl-12p pr-4p"
                width="calc(100% - 44px)"
                classLabel="font-bold text-16"
                editKey="name"
                v-model:modelValue="contact.full_name"
                v-model:activeKey="activeEditableKey"
                :placeholder="$t('inbox.inbox_customer_info_placeholder_name')"
                :maxlength="60"
                :error="validFullname"
                :onSubmit="updateCustomerInfo"
                :locked="!validAllField"
                :disabled="disableInfo"
            ></Editable>
        </div>
        <Editable
            class="mt-4p pl-12p pr-4p"
            icon="Envelope"
            editKey="email"
            v-model:modelValue="contact.email"
            v-model:activeKey="activeEditableKey"
            :placeholder="$t('inbox.inbox_customer_info_placeholder_email')"
            :error="validEmail"
            :emptyLabel="$t('inbox.inbox_customer_info_btn_add_email')"
            :onSubmit="updateCustomerInfo"
            :locked="!validAllField"
            :disabled="disableInfo"
        ></Editable>
        <Editable
            class="mt-4p pl-12p pr-4p"
            icon="Phone"
            editKey="phone"
            v-model:modelValue="contact.phone"
            v-model:activeKey="activeEditableKey"
            :placeholder="$t('inbox.inbox_customer_info_placeholder_phone')"
            :error="validPhone"
            :emptyLabel="$t('inbox.inbox_customer_info_btn_add_phone')"
            :onSubmit="updateCustomerInfo"
            :locked="!validAllField"
            :disabled="disableInfo"
        ></Editable>
        <div class="editable flex items-stretch mt-4p" :class="{'disabled-address': disableInfo}">
            <div class="editable__composer flex items-center mr-4p pl-12p pr-4p py-8p">
                <Icon name="MapMarker" color="neutrals-400"></Icon>
                <Tooltip
                    class="editable__address ml-8p"
                    size="small"
                    type="light"
                    position="top"
                    showByTruncate
                    :content="contactAddress"
                    :timeout="1000"
                >
                    <span class="truncate text-14 block w-full">
                        {{ contactAddress }}
                    </span>
                </Tooltip>
            </div>
        </div>
        <router-link :to="{ path: disableInfo ? '' : `/contact/detail/${contact._id}` }">
            <Button type="outline" size="medium" class="w-full justify-center mt-16p button-edit" :disabled="disableInfo">{{
                $t('inbox.inbox_customer_info_btn_view_details')
            }}</Button>
        </router-link>
    </div>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue';
import Avatar from '@/components/ui/AvatarComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Icon from '@/components/ui/IconComponent.vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import Editable from '@/components/ui/Editable.vue';
import { useContact } from '@/modules/contact/composables/useContact';
import { useToast } from '@/composables/useToast';
import { useCountriesList } from '@/composables/useCountriesList';
import { useI18n } from 'vue-i18n';
import { validateEmail, validatePhoneNumber } from '@/utils/validate';
import filters from '@/utils/filters';
import { useInboxGroupConversation } from '@/modules/inbox/composables/useInboxGroupConversations';

export default {
    name: 'InboxCustomerInfo',
    components: {
        Avatar,
        Button,
        Icon,
        Tooltip,
        Editable,
    },
    props: {
        disableInfo: {
            type: Boolean,
            default: false
        }
    },
    setup(props: any, { emit }: any) {
        const { contact, updateContact, error, errorMessage } = useContact();
        const contactClone = ref(JSON.parse(JSON.stringify(contact.value)));
        const { addToast } = useToast();
        const { getCountryName } = useCountriesList();
        const { t } = useI18n();
        const activeEditableKey = ref('');
        const { updateCustomerInListConvo } = useInboxGroupConversation({ props, emit });
        const envURL = process.env.VUE_APP_CONTACT_AVATAR_URL;

        const contactAddress = computed(() => {
            let address = '';
            if (contact.value.timezone) {
                address += `${filters.formatAMPM(
                    new Date().toLocaleString('en-US', { timeZone: contact.value.timezone }),
                )} • `;
            }
            if (contact.value.city) {
                address += `${contact.value.city}`;
                if (contact.value.country) {
                    address += ', ';
                }
            }
            if (contact.value.country) {
                address += `${getCountryName(contact.value.country)}`;
            }
            if (!contact.value.local_time && !contact.value.city && !contact.value.country) {
                address = t('inbox.inbox_text_unknown');
            }
            return address;
        });
        const validFullname = computed(() => {
            if (5 >= contact.value.full_name.length || contact.value.full_name.length > 60) {
                return 'invalid_name';
            }
            return '';
        });
        const validEmail = computed(() => {
            if (
                activeEditableKey.value !== '' &&
                errorMessage.value &&
                Object.keys(errorMessage.value)[0] === 'email_is_exists'
            ) {
                return 'email_is_exists';
            }
            if (contactClone.value.email && contact.value.email && !validateEmail(contact.value.email)) {
                return 'invalid_email';
            }
            if (contactClone.value.email && !contact.value.email) {
                return 'invalid_email';
            }
            if (!contactClone.value.email) {
                if (!contact.value.email) {
                    return '';
                }
                if (contact.value.email !== '' && !validateEmail(contact.value.email)) {
                    return 'invalid_email';
                }
            }
            return '';
        });
        const validPhone = computed(() => {
            if (contact.value.phone && !validatePhoneNumber(contact.value.phone)) {
                return 'invalid_phone';
            }
            return '';
        });
        const validAllField = computed(
            () => validFullname.value === '' && validEmail.value === '' && validPhone.value === '',
        );

        const showSuccessMessage = (title: string) => {
            addToast({
                title,
                type: 'basic',
                timeout: 3000,
            });
        };
        const updateCustomerInfo = async () => {
            const res = await updateContact(contact.value);
            if (!error.value) {
                if (contactClone.value.full_name !== res.full_name) {
                    showSuccessMessage(t('inbox.inbox_customer_info_toast_name_changed_successful'));
                }
                if (contactClone.value.email !== res.email) {
                    showSuccessMessage(t('inbox.inbox_customer_info_toast_email_changed_successful'));
                }
                if (contactClone.value.phone !== res.phone) {
                    showSuccessMessage(t('inbox.inbox_customer_info_toast_phone_changed_successful'));
                }
                activeEditableKey.value = '';
                contactClone.value = JSON.parse(JSON.stringify(res));
                updateCustomerInListConvo(res);
            }
        };

        watch(
            () => contact,
            () => {
                errorMessage.value = null;
            },
            { deep: true },
        );

        

        return {
            contactClone,
            contact,
            contactAddress,
            updateCustomerInfo,
            error,
            validFullname,
            validEmail,
            validPhone,
            validAllField,
            activeEditableKey,
            envURL,
        };
    },
};
</script>

<style lang="scss" scoped>
.editable {
    &__composer {
        width: calc(100% - 22px);
        height: 36px;
        &::v-deep(.editable__address) {
            width: calc(100% - 28px);
        }
        &::v-deep(.disabled){
            &::before{
                display: none;
            }
        }
    }
    &.disabled-address{
        color: #B4B4BE;
        i {
            &::v-deep(.icon-svg){
                color: #B4B4BE;
            }
        }
    }
}
.button-edit{
    border: 1px solid #E9E9EC;
    >*{
        color: #9B9BA8;
    }
}
</style>
