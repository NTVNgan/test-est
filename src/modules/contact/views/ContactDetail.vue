<template>
    <div
        class="
            contact-detail
            h-full
            w-full
            scrollbar--transparent
            overflow-y-auto
            bg-white
            shadow-deep-1
            rounded-l-8p
            relative
        "
    >
        <!-- <template v-if="!showPopupContact"> -->
        <div
            class="contact-detail__background"
            :class="{ 'contact-detail__background--skeleton': showSkeletonContact }"
            v-if="!showBlockContactDetail"
        ></div>
        <template v-if="windowPreviousHistoryRoute">
            <router-link v-if="!windowPreviousHistoryRoute.includes('/inbox/groups')" :to="{ name: 'ContactList' }">
                <Button type="link" class="absolute top-24p left-40p">
                    <icon-component name="ChevronLeft" color="primary-500"></icon-component>
                    <span class="text-14">Back</span>
                </Button>
            </router-link>
        </template>
        <template v-else>
            <router-link :to="{ name: 'ContactList' }">
                <Button type="link" class="absolute top-24p left-40p">
                    <icon-component name="ChevronLeft" color="primary-500"></icon-component>
                    <span class="text-14">Back</span>
                </Button>
            </router-link>
        </template>
        <template v-if="!showSkeletonContact && contact">
            <template v-if="!showBlockContactDetail">
                <div class="contact-detail__wrapper relative w-920 flex justify-between mx-auto mt-100p">
                    <div class="contact-detail__left w-368">
                        <ContactDetailCustomerInfomation
                            :disableInfo="blockInfoContactDetail"
                        ></ContactDetailCustomerInfomation>
                        <ContactDetailGeneralInfomation
                            :disableInfo="blockInfoContactDetail"
                        ></ContactDetailGeneralInfomation>
                        <ContactDetailRecentPage
                            :recentList="recentList"
                            :disableInfo="blockInfoContactDetail"
                        ></ContactDetailRecentPage>
                    </div>
                    <div class="contact-detail__right w-528">
                        <ContactDetailCustomerData
                            :attributes="listMapAttribute"
                            :disableInfo="blockInfoContactDetail"
                        ></ContactDetailCustomerData>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="contact-detail__block text-center absolute">
                    <template v-if="showPopupArchive">
                        <img class="m-auto" src="../images/img-archive.svg" />
                    </template>
                    <template v-else>
                        <img class="m-auto" src="../images/img-contact-block.svg" />
                    </template>
                    <h4 class="text-16 text-neutrals-900 font-bold pt-12p pb-4p">
                        <template v-if="showPopupArchive">
                        Uh oh, this contact has been archived
                        </template>
                        <template v-else>
                        Uh oh, this contact has been blocked 
                        </template>
                    </h4>
                    <span class="text-14 text-neutrals-400">You can't message them for now.</span>
                </div>
            </template>
        </template>
        <template v-else>
            <ContactDetailSekeleton />
        </template>
        <modal-component v-model="showPopup" class="contact-detail__modal-block text-center">
            <template v-slot:body>
                <div class="modal-body__content py-32p" v-click-outside="onCloseModal">
                    <template v-if="isBlockContact">
                        <img class="m-auto" src="../images/img-contact-block.svg" />
                        <h3 class="text-24 font-semibold text-neutrals-900 pt-16p pb-16p capitalize font-heading">
                            Contact blocked
                        </h3>
                        <p class="text-14 text-neutrals-900 pb-16p">
                            This contact is no longer available because <br />your teammate has just blocked them.
                        </p>
                        <div class="">
                            <Button size="medium" type="secondary" class="mr-8p">
                                <router-link :to="{ name: 'ContactList' }" class="text-14 font-medium text-neutrals-900">
                                    Back to Contact list
                                </router-link>
                            </Button>
                            <Button size="medium" @click="showPopup = false">
                                <span class="text-14 font-medium text-white">Stay on this page</span>
                            </Button>
                        </div>
                    </template>
                    <template v-else>
                        <img class="m-auto" src="../images/img-archive.svg" />
                        <h3 class="text-24 font-semibold text-neutrals-900 pt-16p pb-16p capitalize font-heading">
                            Contact Archived
                        </h3>
                        <p class="text-14 text-neutrals-900 pb-16p">
                            This contact is no longer available because <br />your teammate has just archived them.
                        </p>
                        <div class="">
                            <Button size="medium" type="secondary" class="mr-8p">
                                <router-link :to="{ name: 'ContactList' }" class="text-14 font-medium text-neutrals-900">
                                    Back to Contact list
                                </router-link>
                            </Button>
                            <Button size="medium" @click="showPopup = false">
                                <span class="text-14 font-medium text-white">Stay on this page</span>
                            </Button>
                        </div>
                    </template>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { ref, onMounted, computed, nextTick, inject, onUnmounted } from 'vue';
import Button from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ContactDetailCustomerInfomation from '../components/ContactDetailCustomerInfomation.vue';
import ContactDetailGeneralInfomation from '../components/ContactDetailGeneralInfomation.vue';
import ContactDetailRecentPage from '../components/ContactDetailRecentPage.vue';
import ContactDetailCustomerData from '../components/ContactDetailCustomerData.vue';
import ContactDetailSekeleton from '../components/ContactDetailSekeleton.vue';
import { useContact } from '@/modules/contact/composables/useContact';
import { useRoute, useRouter } from 'vue-router';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useSocket } from '@/composables/useSocket';
import { routerPush } from '@/router';
import { useToast } from '@/composables/useToast';
import { store } from '@/store';

export default {
    name: 'ContactDetail',
    components: {
        Button,
        IconComponent,
        ContactDetailCustomerInfomation,
        ContactDetailGeneralInfomation,
        ContactDetailRecentPage,
        ContactDetailCustomerData,
        ContactDetailSekeleton,
        ModalComponent,
    },
    setup() {
        const attributeList = ref<any>();
        const recentList = ref<any>([]);
        const showSkeletonContact = ref<boolean>(true);
        const { socket } = useSocket();
        const showPopup = ref<boolean>(false);
        const blockInfoContactDetail = ref<boolean>(false);
        const emitter: any = inject('emitter');
        const { addToast, removeToast, removeToastSingle } = useToast();
        const isBlockContact = ref<boolean>(false);

        const { contact, getContactByID, getRecentPage, getAttributes, error, blockContact, blockContactDetail } =
            useContact();
        const route = useRoute();
        const contactId: any = computed(() => route.params.contactId);

        const listMapAttribute = computed(() => {
            if (contact.value && attributeList.value) {
                return contact.value.attributes.reduce((filtered: any, item: any, index: number) => {
                    const findIdIndex = attributeList.value.data.findIndex(
                        (attribute: any) => attribute._id === item.id,
                    );
                    if (((item.value !== '' && item.value !== null) || typeof item.value === 'boolean') && findIdIndex > -1) {
                        filtered.push({
                            ...item,
                            name: attributeList.value.data[findIdIndex].name,
                            datatype: attributeList.value.data[findIdIndex].datatype,
                        });
                    }
                    return filtered.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
                }, []);
            }
            return [];
        });

        const showBlockContactDetail = ref<boolean>(false);

        const showPopupContact = () => {
            if (contact.value && contact.value.status === 2) {
                showBlockContactDetail.value = true;
            } else if (contact.value && contact.value.status === 4) {
                showBlockContactDetail.value = true;
            } else if (contact.value && contact.value.status === 1) {
                showBlockContactDetail.value = false;
            }
        };

        const onCloseModal = () => {
            if (showPopup.value === true){
                showPopup.value = false;
            }
        };

        socket.on('incomingContactStatus', (data: any) => {
            if (data.contact_id == contact.value._id && data.contact_status == 2) {
                showPopup.value = true;
                blockInfoContactDetail.value = true;
                isBlockContact.value = true;
            } else if (data.contact_id == contact.value._id && data.contact_status == 4){
                showPopup.value = true;
                blockInfoContactDetail.value = true;
                isBlockContact.value = false;
            } else if (data.contact_id == contact.value._id && data.contact_status == 1) {
                showPopup.value = false;
                blockInfoContactDetail.value = false;
                isBlockContact.value = false;
                showBlockContactDetail.value = false;
            }
        });


        const showPopupArchive = computed(() => {
            if (contact.value && contact.value.status === 4) {
                return true;
            }
            return false;
        });

        const getAttributeInfomation = async () => {
            const res = await getAttributes({
                page: 1,
                limit: 200,
                show: 1
            });
            if (!error.value && res) {
                attributeList.value = res;
            }
        };
        const getRecentPageList = async (contactId: string) => {
            const response = await getRecentPage(1, contactId, 15);
            recentList.value = response.data;
        };

        onMounted(async () => {
            showSkeletonContact.value = true;
            const result = await Promise.all([
                getContactByID(contactId.value),
                getRecentPageList(contactId.value),
                getAttributeInfomation(),
            ]);
            if (result[0]) {
                routerPush('Error404');
            }
            showSkeletonContact.value = false;
            showPopupContact();
        });

        onUnmounted(() => {
            emitter.off('emitBlockContact');
        });

        return {
            route,
            contact,
            recentList,
            attributeList,
            showSkeletonContact,
            listMapAttribute,
            showPopupContact,
            showPopup,
            blockInfoContactDetail,
            windowPreviousHistoryRoute: window.history.state.back,
            isBlockContact,
            showPopupArchive,
            showBlockContactDetail,
            onCloseModal,
        };
    },
};
</script>

<style lang="scss" scoped>
.contact-detail {
    &__background {
        position: absolute;
        width: 100%;
        height: 152px;
        background-image: url(../images/background-contact-detail.png);
        filter: grayscale(1);
        z-index: 0;
        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: rgba(250, 250, 250, 0.9);
        }
        &--skeleton {
            &::after {
                background-color: #f6f6f8;
            }
        }
    }
    &__block {
        top: 30%;
        left: 50%;
        transform: translate(-50%, -30%);
    }
    &__modal-block {
        :deep(i) {
            display: none;
        }
        :deep(.modal-body) {
            padding: 0;
        }
    }
}
</style>
