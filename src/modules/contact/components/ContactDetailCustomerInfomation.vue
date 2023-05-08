<template>
    <Card type="shadow" class="relative pt-45p pb-24p px-24p mb-32p">
        <Avatar
            class="absolute -top-32p"
            size="large"
            :label-avatar="contact.full_name"
            :image="contact.avatar_src ? envURL + '/' + contact.avatar_src : ''"
            :bgAvatar="contact.avatar_bg"
            :showImageTiny="true"
            :showBackgroundCompulsory="true"
        />
        <Editable
            classLabel="font-semibold text-24 font-heading"
            editKey="name"
            v-model:modelValue="contact.full_name"
            v-model:activeKey="activeEditableKey"
            :placeholder="$t('contact.contact_detail_customer_info_placeholder_name')"
            :maxlength="60"
            :error="validFullname"
            :onSubmit="updateCustomerInfo"
            :locked="!validAllField"
            :disabled="disableInfo"
        ></Editable>
        <Editable
            class="mt-8p"
            icon="Envelope"
            editKey="email"
            v-model:modelValue="contact.email"
            v-model:activeKey="activeEditableKey"
            :placeholder="$t('contact.contact_detail_customer_info_placeholder_email')"
            :error="validEmail"
            :emptyLabel="$t('contact.contact_detail_customer_info_btn_add_email')"
            :onSubmit="updateCustomerInfo"
            :locked="!validAllField"
            :disabled="disableInfo"
        ></Editable>
        <Editable
            class="mt-4p"
            icon="Phone"
            editKey="phone"
            v-model:modelValue="contact.phone"
            v-model:activeKey="activeEditableKey"
            :placeholder="$t('contact.contact_detail_customer_info_placeholder_phone')"
            :error="validPhone"
            :emptyLabel="$t('contact.contact_detail_customer_info_btn_add_phone')"
            :onSubmit="updateCustomerInfo"
            :locked="!validAllField"
            :disabled="disableInfo"
        ></Editable>
        <div class="editable flex items-stretch mt-4p" :class="{'disabled-address': disableInfo}">
            <div class="editable__composer flex items-center mr-4p py-8p">
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
        <contact-detail-modal-send-message
            v-model:showModal="showModalSendMessage"
            :convo="conVoByContact"
            :contact="contact"
            @close="onCloseModalSendMessage"
        />
        <div class="flex mt-16p">
            <Button type="primary" size="medium" class="w-full justify-center h-40" @click="sendMessage" :disabled="disableInfo">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15.5312 2.94141L4.15624 9.50391C3.19921 10.0508 3.28124 11.4453 4.29296 11.8555L7.43749 13.1406V15.4375C7.43749 16.7227 9.05077 17.2422 9.78905 16.2305L10.9922 14.6172L14.0547 15.875C14.2187 15.957 14.3828 15.9844 14.5469 15.9844C14.7656 15.9844 14.9844 15.9297 15.2031 15.8203C15.5586 15.6016 15.7773 15.2734 15.8594 14.8633L17.4726 4.28126C17.6367 3.18751 16.4609 2.39454 15.5312 2.94141ZM8.74999 15.4375V13.6875L9.73436 14.0977L8.74999 15.4375ZM14.5469 14.6719L10.3359 12.9219L14.1914 7.39844C14.4648 6.96094 13.918 6.46876 13.5351 6.82422L7.73827 11.8555L4.81249 10.625L16.1875 4.06251L14.5469 14.6719Z"
                        fill="white"
                    />
                </svg>
                <span class="ml-4p">
                    {{ $t('contact.contact_detail_customer_info_btn_send_message') }}
                </span>
            </Button>
            <Dropdown class="ml-8p btn-block" v-click-outside="closeOptionBlock" :disabled="disableInfo">
                <template v-slot:header>
                    <Button size="large" type="secondary" :disabled="disableInfo" icon="ellipsis" @click="openBlock = !openBlock"/>
                </template>
                <template v-slot:list>
                    <ul class="p-8p bg-white shadow-deep-1 rounded mt-6p" v-if="openBlock" @click="openBlock = false;">
                        <li class="flex py-8p px-12p hover:bg-neutrals-50 rounded" @click="popupArchive = !popupArchive;">
                            <icon-component name="archive" /><span class="text-14 text-neutrals-900 ml-8p w-84">Archive</span>
                        </li>
                        <li class="flex py-8p px-12p hover:bg-neutrals-50 rounded" @click="popupBlock = !popupBlock;">
                            <icon-component name="ban" /><span class="text-14 text-neutrals-900 ml-8p w-84">Block</span>
                        </li>
                    </ul>
                </template>
            </Dropdown>
        </div>
        <modal-component v-model="popupBlock" class="contact-detail__modal-block">
            <template v-slot:header>
                <div class="flex">
                    <icon-component class="mr-4p" name="ExclamationCircle" showClassText color="text-error-3" />
                    <span class="font-medium text-16"> Block contact?</span>
                </div>
            </template>
            <template v-slot:body>
                <div class="text-center text-14 px-32p">
                    This contact won't be able to message you anymore.
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <Button type="outline" class="mr-8p" size="medium" @click="popupBlock = false">
                        Cancel
                    </Button>
                    <Button type="destructive" size="medium" @click="blockContactDetailFunc">
                        Block
                    </Button>
                </div>
            </template>
        </modal-component>
        <modal-component v-model="popupArchive" class="contact-detail__modal-archive">
            <template v-slot:header>
                <div class="flex">
                    <icon-component class="mr-4p" name="ExclamationCircle" showClassText color="text-error-3" />
                    <span class="font-medium text-16"> Archive contact?</span>
                </div>
            </template>
            <template v-slot:body>
                <div class="text-center text-14 px-32p">
                    Contact will be temporarily hidden.<br />
                    However, they will still appear in Contact table once online.
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <Button type="outline" class="mr-8p" size="medium" @click="popupArchive = false">
                        Cancel
                    </Button>
                    <Button type="destructive" size="medium" @click="archiveContactDetailFunc">
                        Archive
                    </Button>
                </div>
            </template>
        </modal-component>
    </Card>
</template>

<script lang="ts">
import { ref, computed, watch, inject } from 'vue';
import Avatar from '@/components/ui/AvatarComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Card from '@/components/ui/CardComponent.vue';
import Icon from '@/components/ui/IconComponent.vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import Editable from '@/components/ui/Editable.vue';
import { useContact } from '@/modules/contact/composables/useContact';
import { useToast } from '@/composables/useToast';
import { useCountriesList } from '@/composables/useCountriesList';
import { useI18n } from 'vue-i18n';
import { validateEmail, validatePhoneNumber } from '@/utils/validate';
import filters from '@/utils/filters';
import { routerPush } from '@/router';
import { useInbox } from '@/modules/inbox/composables/useInbox';
import { store } from '@/store';
import { useInboxPushingHandler } from '@/modules/inbox/composables/useInboxPushingHandler';
import { useRouter } from 'vue-router';
import ContactDetailModalSendMessage from './ContactDetailModalSendMessage.vue';
import Dropdown from '@/components/ui/DropdownComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';

export default {
    name: 'ContactDetailCustomerInfo',
    components: {
        Avatar,
        Button,
        Card,
        Icon,
        Tooltip,
        Editable,
        ContactDetailModalSendMessage,
        Dropdown,
        IconComponent,
        ModalComponent
    },
    props: {
        disableInfo: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const { contact, updateContact, error, errorMessage, getConversationsByContact, blockContact, blockContactDetail, archiveContactDetail } = useContact();
        const contactClone = ref(JSON.parse(JSON.stringify(contact.value)));
        const { addToast, removeToast } = useToast();
        const { getCountryName } = useCountriesList();
        const { t } = useI18n();
        const activeEditableKey = ref('');
        const envURL = process.env.VUE_APP_CONTACT_AVATAR_URL;
        const { assignUserToConversation } = useInbox();
        const { _id: userId } = store.state.auth.user;
        const { changeNumberGroup, setAddonConvo, currConvo, detectConvoGroup } = useInboxPushingHandler();
        const router = useRouter();
        const showModalSendMessage = ref(false);
        const conVoByContact = ref(null);
        const openBlock = ref<boolean>(false);
        const popupBlock = ref<boolean>(false);
        const popupArchive = ref<boolean>(false);

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
                address = t('contact.contact_detail_text_unknown');
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
                single: true,
            });
        };

        const updateCustomerInfo = async () => {
            const res = await updateContact(contact.value);
            if (!error.value) {
                if (contactClone.value.full_name !== res.full_name) {
                    showSuccessMessage(t('contact.contact_detail_customer_info_toast_name_changed_successful'));
                }
                if (contactClone.value.email !== res.email) {
                    showSuccessMessage(t('contact.contact_detail_customer_info_toast_email_changed_successful'));
                }
                if (contactClone.value.phone !== res.phone) {
                    showSuccessMessage(t('contact.contact_detail_customer_info_toast_phone_changed_successful'));
                }
                activeEditableKey.value = '';
                contactClone.value = JSON.parse(JSON.stringify(res));
            }
        };

        const onCloseModalSendMessage = () => {
            showModalSendMessage.value = false;
        };

        const sendMessage = async () => {
            const res = await getConversationsByContact({
                workspace_id: contact.value.workspace_id,
                contact_id: contact.value._id,
                org_id: contact.value.org_id,
                last_message: true,
            });
            if (res) {
                console.log(res.last_message, 'res.last_message');
                if (res.last_message !== null) {
                    // setAddonConvo(res);
                    const isCheckGroup = detectConvoGroup(res);
                    console.log(res._id, 'res._id', isCheckGroup);
                    if (isCheckGroup === 'assign_to_you') {
                        routerPush('InboxGroups', { name: 'assign_to_you', conversation: res._id });
                    } else if (isCheckGroup === 'unassign') {
                        routerPush('InboxGroups', { name: 'unassign', conversation: res._id });
                    }
                } else {
                    conVoByContact.value = res;
                    showModalSendMessage.value = true;
                }
            }
        };

        const closeOptionBlock = () => {
            openBlock.value = false;
        };

        const undoBlockContactToast = async () => {
            const res = await blockContact(blockContactDetail.value._id, 1);
            if (!error.value){
                addToast({
                    title: 'Undo successfully',
                    type: 'basic',
                    timeout: 6000,
                    single: true,
                });
            }
        };

        const blockContactDetailFunc = async () => {
            routerPush('ContactListBySegment');
            const res = await blockContact(contact.value._id, 2);
            if (!error.value){
                addToast({
                    title: 'Blocked contact successfully',
                    type: 'basic',
                    btnLabel: 'Undo',
                    timeout: 6000,
                    single: true,
                    btnFunction: undoBlockContactToast,
                });
            };
        };

        const archiveContactDetailFunc = async() => {
            routerPush('ContactListBySegment');
            const data = {
                contact_id: contact.value._id,
            }
            const res = await archiveContactDetail(data);
            if (!error.value){
                addToast({
                    title: 'Archived contact successfully',
                    type: 'basic',
                    timeout: 6000,
                    single: true,
                });
            };
        }

        watch(
            () => contact.value,
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
            errorMessage,
            validFullname,
            validEmail,
            validPhone,
            validAllField,
            activeEditableKey,
            envURL,
            sendMessage,
            showModalSendMessage,
            onCloseModalSendMessage,
            conVoByContact,
            openBlock,
            closeOptionBlock,
            popupBlock,
            popupArchive,
            blockContactDetailFunc,
            undoBlockContactToast,
            archiveContactDetailFunc,
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
.contact-detail__modal-block{
    z-index: 1;
}
</style>
