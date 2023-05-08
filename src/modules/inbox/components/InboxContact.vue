<template>
    <template v-if="!showSkeletonContact && contact">
        <div class="bg-neutrals-50 p-8p">
            <inbox-customer-infomation :disableInfo="disableInfoConvo" />
            <DrapDrop multiple :activeIndex="[1, 3, 5]" v-model:activeKey="activeKey">
                <accordion-tab :key="1" :header="$t('inbox.inbox_customer_info_accordion_general_infomation')">
                    <inbox-accordion-general-infomation />
                </accordion-tab>
                <accordion-tab :key="3" :header="$t('inbox.inbox_customer_info_accordion_customer_data')">
                    <template #tool>
                        <Dropdown>
                            <template #header>
                                <div ref="dropdownButtonEl">
                                    <div class="p-12p text-center">
                                        <Tooltip
                                            size="small"
                                            position="top"
                                            :content="$t('inbox.inbox_customer_data_dropdown_attribute_tooltip')"
                                        >
                                            <Button
                                                @click.stop.prevent="toggleDropdown"
                                                :disabled="!listMapAttribute.length"
                                                type="subtle"
                                                size="small"
                                                icon="Tools"
                                                isFocus
                                            ></Button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </template>
                            <template #list>
                                <teleport to="#dropdown">
                                    <div
                                        ref="dropdownEl"
                                        v-click-outside="toggleDropdown"
                                        v-if="showDropdown"
                                        :style="{
                                            right: dropdownRight !== 'auto' ? `${dropdownRight}px` : dropdownRight,
                                            left: dropdownLeft !== 'auto' ? `${dropdownLeft}px` : dropdownLeft,
                                            top: dropdownTop !== 'auto' ? `${dropdownTop}px` : dropdownTop,
                                            bottom: dropdownBottom !== 'auto' ? `${dropdownBottom}px` : dropdownBottom,
                                        }"
                                        class="
                                            fixed
                                            z-999
                                            bg-white
                                            text-14
                                            font-body
                                            rounded-4p
                                            shadow-deep-1
                                            w-256
                                            h-328
                                            py-8p
                                        "
                                    >
                                        <div class="px-8p">
                                            <p class="text-neutrals-500 font-medium py-8p px-12p">
                                                {{ $t('inbox.inbox_customer_data_dropdown_attribute_title') }}
                                            </p>
                                            <Input
                                                v-model="searchAttributeValue"
                                                :placeholder="$t('inbox.inbox_placeholder_search')"
                                            >
                                                <template v-slot:prefix>
                                                    <Icon name="search"></Icon>
                                                </template>
                                            </Input>
                                        </div>
                                        <div class="px-8p mt-8p h-232 overflow-y-auto scrollbar--transparent">
                                            <div
                                                class="
                                                    text-neutrals-500
                                                    py-8p
                                                    pl-12p
                                                    pr-4p
                                                    flex
                                                    items-center
                                                    justify-between
                                                "
                                            >
                                                <span class="font-normal text-neutrals-900">
                                                    <span class="inline-block font-medium text-14">
                                                        {{ selectedAttributes.length }}
                                                    </span>
                                                    <span class="inline-block text-neutrals-400 text-14"
                                                        >/{{ attributesSearch.length }}</span
                                                    >
                                                </span>
                                                <span>
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        @click="onSelectAllAttribute('select')"
                                                    >
                                                        {{ $t('inbox.inbox_select_all') }}
                                                    </Button>
                                                    <Button
                                                        class="ml-4p"
                                                        type="destructive-link"
                                                        size="small"
                                                        @click="onSelectAllAttribute('clear')"
                                                    >
                                                        {{ $t('inbox.inbox_clear_all') }}
                                                    </Button>
                                                </span>
                                            </div>
                                            <template v-if="!attributesSearch.length">
                                                <p class="pt-8p px-12p text-14 text-neutrals-400">No data found</p>
                                            </template>
                                            <div
                                                v-else
                                                v-for="attribute in attributesSearch"
                                                :key="attribute"
                                                class="
                                                    flex
                                                    items-center
                                                    text-14
                                                    p-8p
                                                    hover:bg-neutrals-50
                                                    cursor-pointer
                                                "
                                            >
                                                <CheckBox
                                                    v-model="attribute.selected"
                                                    @change="onSelectAttribute(attribute.id)"
                                                    :nameSingleCheckbox="`attribute-${attribute.name}`"
                                                />
                                                <div
                                                    class="grid grid-cols-2 w-calc-100%-25p ml-2p"
                                                    @click="onSelectAttribute(attribute.id)"
                                                >
                                                    <Tooltip
                                                        class="pr-4p inline-flex text-neutrals-400"
                                                        size="small"
                                                        type="light"
                                                        position="top"
                                                        showByTruncate
                                                        :content="attribute.name.toString()"
                                                        :timeout="1000"
                                                    >
                                                        <span class="truncate inline-block w-full">
                                                            {{ attribute.name }}
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip
                                                        class="pl-4p inline-flex"
                                                        size="small"
                                                        type="light"
                                                        position="top"
                                                        showByTruncate
                                                        :content="attribute.value.toString()"
                                                        :timeout="1000"
                                                    >
                                                        <span class="truncate inline-block w-full">
                                                            {{
                                                                attribute.datatype === 3
                                                                    ? filters.formatTime(attribute.value, false)
                                                                    : attribute.value
                                                            }}
                                                        </span>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </teleport>
                            </template>
                        </Dropdown>
                    </template>
                    <inbox-accordion-customer-data :attributes="selectedAttributes" />
                </accordion-tab>
                <accordion-tab :key="5" :header="$t('inbox.inbox_customer_inf_accordion_recent_page_view')">
                    <inbox-accordion-recent-page :recentList="recentList" />
                </accordion-tab>
            </DrapDrop>
        </div>
    </template>
    <template v-else>
        <div class="bg-neutrals-50 p-8p h-full">
            <SkeletonCustomerInfo />
        </div>
    </template>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch, nextTick, inject, onUnmounted } from 'vue';
import InboxCustomerInfomation from '../components/InboxCustomerInfomation.vue';
import InboxAccordionGeneralInfomation from '../components/InboxAccordionGeneralInfomation.vue';
import InboxAccordionCustomerData from '../components/InboxAccordionCustomerData.vue';
import InboxAccordionRecentPage from '../components/InboxAccordionRecentPage.vue';
import SkeletonCustomerInfo from '../components/InboxSkeleton/InboxSkeletonCustomerInfo.vue';
import DrapDrop from '@/components/ui/AccordionDrapDrop.vue';
import AccordionTab from '@/components/ui/AccordionPanel.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import Icon from '@/components/ui/IconComponent.vue';
import Dropdown from '@/components/ui/DropdownComponent.vue';
import CheckBox from '@/components/ui/CheckboxComponent.vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import { useContact } from '@/modules/contact/composables/useContact';
import { useInbox } from '@/modules/inbox/composables/useInbox';
import { useUser } from '@/modules/auth/composables/useUser';
import { store } from '@/store';
import { useRouter, useRoute } from 'vue-router';
import { routerPush } from '@/router';
import { useSocket } from '@/composables/useSocket';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';
import { useToast } from '@/composables/useToast';
import filters from '@/utils/filters';

export default defineComponent({
    name: 'InboxContact',
    components: {
        InboxCustomerInfomation,
        InboxAccordionGeneralInfomation,
        InboxAccordionCustomerData,
        InboxAccordionRecentPage,
        SkeletonCustomerInfo,
        DrapDrop,
        AccordionTab,
        Button,
        Dropdown,
        Input,
        Icon,
        CheckBox,
        Tooltip,
    },
    setup() {
        const activeKey = ref<number[]>([]);
        const attributeList = ref<any>();
        const recentList = ref<any>([]);
        const searchAttributeValue = ref<string>('');
        const showDropdown = ref<boolean>(false);
        const selectedAttributesId = ref<string[]>([]);

        const dropdownEl = ref<HTMLElement>();
        const dropdownButtonEl = ref<HTMLElement>();
        const dropdownRight = ref<number | string>(0);
        const dropdownLeft = ref<number | string>('auto');
        const dropdownTop = ref<number | string>(0);
        const dropdownBottom = ref<number | string>('auto');

        const { error, contact, getContactByID, getRecentPage, getAttributes } = useContact();
        const { getConversation, showSkeletonContact } = useInbox();
        const { updateUser } = useUser();
        const route = useRoute();
        const emitter: any = inject('emitter');
        const router = useRouter();
        const disableInfoConvo = ref<boolean>(false);
        const { socket } = useSocket();
        const convoId: any = computed(() => route.params.conversation);
        const { lastMessageSeenByCustomer, timeSeenLastMessage, conversationDetail } = useInboxConversationDetail();
        const userStore = store.state.auth.user;
        const currGroup = computed(() => (route.params.name ? route.params.name : ''));
        const arrAttributeHide = ref<any>([]);
        const { addToast } = useToast();

        const listMapAttribute = computed(() => {
            if (contact.value && attributeList.value) {
                return contact.value.attributes.reduce((filtered: any, item: any, index: number) => {
                    const findIdIndex = attributeList.value.data.findIndex(
                        (attribute: any) => attribute._id === item.id,
                    );
                    if (
                        ((item.value !== '' && item.value !== null) || typeof item.value === 'boolean') &&
                        findIdIndex > -1
                    ) {
                        filtered.push({
                            ...item,
                            name: attributeList.value.data[findIdIndex].name,
                            datatype: attributeList.value.data[findIdIndex].datatype,
                            selected:
                                userStore.pin_attribute.length > 0 ? userStore.pin_attribute.includes(item.id) : true,
                        });
                    }
                    return filtered.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
                }, []);
            }
            return [];
        });
        const attributesIds = computed(() => {
            return listMapAttribute.value.map((item: any) => item.id);
        });
        const selectedAttributes = computed(() => {
            return listMapAttribute.value.filter((item: any) => item.selected);
        });
        const attributesSearch = computed(() => {
            if (searchAttributeValue.value !== '') {
                return listMapAttribute.value.filter((item: any) => {
                    const searchName = searchAttributeValue.value.toLowerCase();
                    const itemName = item.name.toLowerCase();
                    return itemName.toLowerCase().includes(searchName);
                });
            }
            return listMapAttribute.value;
        });
        const checkSelectAllAttribute = computed(
            () => selectedAttributesId.value.length - 1 === listMapAttribute.value.length,
        );

        const updateCustomerOnlineStatus = (data: any) => {
            if (contact.value._id === data._id) {
                contact.value.online_status = data.online_status;
            }
        };
        const getUserActiveKey = () => {
            if (userStore.custom_data_sort.length === 0) {
                activeKey.value = [1, 3, 5];
            } else {
                activeKey.value = userStore.custom_data_sort;
            }
        };
        const setPositionDropdown = () => {
            if (dropdownEl.value && dropdownButtonEl.value) {
                const accordionHeaderEl: any = dropdownButtonEl.value.closest('.accordion-header');
                const rangeBottomToScreen = window.innerHeight - accordionHeaderEl.getBoundingClientRect().top;
                if (rangeBottomToScreen < dropdownEl.value.getBoundingClientRect().height) {
                    dropdownTop.value = 'auto';
                    dropdownBottom.value = 4;
                } else {
                    dropdownTop.value = accordionHeaderEl.getBoundingClientRect().top;
                }
                dropdownLeft.value = accordionHeaderEl.getBoundingClientRect().left - dropdownEl.value.offsetWidth - 4; // margin right 4px
            }
        };
        const setSelectedAttribute = () => {
            if (!userStore.pin_attribute.length) {
                selectedAttributesId.value = ['null', ...JSON.parse(JSON.stringify(attributesIds.value))];
            }
            if (userStore.pin_attribute.length > 0) {
                selectedAttributesId.value = JSON.parse(JSON.stringify(userStore.pin_attribute));
            }
        };
        const updateCustomDataSort = async (activeKey: number[]) => {
            const userData: User = await updateUser({
                custom_data_sort: activeKey,
            });
            if (userData) {
                userStore.custom_data_sort = userData.custom_data_sort;
            }
        };
        const updateSelectedAttribute = async () => {
            const userData: User = await updateUser({
                pin_attribute: selectedAttributesId.value,
            });
            if (userData) {
                userStore.pin_attribute = userData.pin_attribute;
            }
        };
        const toggleDropdown = async () => {
            showDropdown.value = !showDropdown.value;
            await nextTick();
            setPositionDropdown();
        };

        socket.on('attribute.showhide.complete', (data: any) => {
            console.log('attribute.showhide.complete', data);
            if (data.data.show === false) {
                arrAttributeHide.value = data.data.ids;
            }
        });

        const onSelectAttribute = (id: string) => {
            if (arrAttributeHide.value.length > 0) {
                const findSegment = attributesIds.value.filter((item: any) => {
                    return arrAttributeHide.value.includes(item);
                });
                const findIdIndex = findSegment.findIndex((item_id: string) => item_id === id);
                if (findIdIndex !== -1) {
                    if (findSegment.length == 1) {
                        addToast({
                            title: 'This attribute has been hidden by another teammate.',
                            type: 'basic',
                            timeout: 3000,
                        });
                    } else if (findSegment.length > 1) {
                        addToast({
                            title: 'Some attributes has been hidden by another teammate.',
                            type: 'basic',
                            timeout: 3000,
                        });
                    }
                } else {
                    const findIdIndex = selectedAttributesId.value.findIndex((item_id: string) => item_id === id);
                    if (findIdIndex === -1) {
                        selectedAttributesId.value.push(id);
                    } else {
                        selectedAttributesId.value.splice(findIdIndex, 1);
                    }
                    updateSelectedAttribute();
                }
            } else {
                const findIdIndex = selectedAttributesId.value.findIndex((item_id: string) => item_id === id);
                if (findIdIndex === -1) {
                    selectedAttributesId.value.push(id);
                } else {
                    selectedAttributesId.value.splice(findIdIndex, 1);
                }
                updateSelectedAttribute();
            }
        };
        const onSelectAllAttribute = (type: string) => {
            if (arrAttributeHide.value.length > 0) {
                addToast({
                    title: 'Some attributes has been hidden by another teammate.',
                    type: 'basic',
                    timeout: 3000,
                });
            } else {
                for (let index = 0; index < listMapAttribute.value.length; index++) {
                    listMapAttribute.value[index].selected = checkSelectAllAttribute.value;
                }
                if (type === 'clear') {
                    selectedAttributesId.value = ['null'];
                } else {
                    selectedAttributesId.value = ['null', ...JSON.parse(JSON.stringify(attributesIds.value))];
                }
                updateSelectedAttribute();
            }
        };
        const getCustomerInfo = async (contactId: string) => {
            showSkeletonContact.value = true;
            const resError = await getContactByID(contactId);
            if (!resError) {
                showSkeletonContact.value = false;
            }
        };
        const getAttributeInfomation = async () => {
            const res = await getAttributes({
                page: 1,
                limit: 200,
                show: 1,
            });
            if (!error.value && res) {
                attributeList.value = res;
            }
        };
        const getRecentPageList = async (contactId: string) => {
            const response = await getRecentPage(1, contactId, 15);
            recentList.value = response.data;
        };

        const checkCurrentGroup = async (data: any) => {
            if (typeof data.participants == 'undefined') return;
            const userInConvo = data.participants.filter((p: any) => p.parti_type === 1);
            const currentGroup = router.currentRoute.value.params.name;
            if (userInConvo.length == 0 && currGroup.value !== 'unassign' && currentGroup !== 'all') {
                routerPush('InboxGroups', { name: 'unassign', conversation: data._id });
            } else if (userInConvo.length > 0 && currGroup.value !== 'assign_to_you' && currentGroup !== 'all') {
                if (userInConvo[0].parti_id === userStore._id) {
                    routerPush('InboxGroups', { name: 'assign_to_you', conversation: data._id });
                } else routerPush('InboxGroups', { name: 'all', conversation: data._id });
            } else if (userInConvo.length > 0 && currGroup.value === 'assign_to_you' && userInConvo[0].parti_id !== userStore._id) {
                routerPush('InboxGroups', { name: 'all', conversation: data._id });
            }
        };

        const initContact = async (convoId: any) => {
            showSkeletonContact.value = true;
            const res = await getConversation(convoId);
            if (!res.error) {
                conversationDetail.value = res.data;
                if (route.name == 'InboxGroups') await checkCurrentGroup(res.data);
                if (res.data.participants && res.data.participants.length > 0) {
                    const seenByCustomer = res.data.participants.filter((p: any) => p.parti_type === 3);
                    if (
                        seenByCustomer.length > 0 &&
                        seenByCustomer[0].last_seen_msg_id != null &&
                        seenByCustomer[0].last_seen_msg_at != null
                    ) {
                        lastMessageSeenByCustomer.value = seenByCustomer[0].last_seen_msg_id;
                        timeSeenLastMessage.value = seenByCustomer[0].last_seen_msg_at;
                    }
                }
                if (!res.data.has_message) routerPush('Error404');
                const findContact = res.data.participants.find((item: any) => item.parti_type === 3);
                if (findContact) {
                    await getContactByID(findContact.parti_id);
                    await getRecentPageList(findContact.parti_id);
                    setSelectedAttribute();
                    showSkeletonContact.value = false;
                    emitter.emit('newDataContact');
                }
            } else {
                routerPush('Error404');
            }
        };

        socket.on('incomingConversation', (data: any) => {
            emitter.emit('blockInbox', data);
            if (data.convo_id == conversationDetail.value._id) {
                if (data.status < 0) {
                    disableInfoConvo.value = true;
                } else {
                    disableInfoConvo.value = false;
                }
            } else {
                disableInfoConvo.value = false;
            }
        });

        socket.on('incomingContactStatus', (data: any) => {
            emitter.emit('blockInbox', data);
            if (data.convo_id == conversationDetail.value._id) {
                if (data.contact_status == 2 || data.contact_status == 4) {
                    disableInfoConvo.value = true;
                } else if (data.contact_status == 1) {
                    disableInfoConvo.value = false;
                }
            } else {
                disableInfoConvo.value = false;
            }
        });

        watch(
            () => contact.value && contact.value.status,
            (status, oldVal) => {
                emitter.emit('blockInbox', status);
            },
            { deep: true },
        );

        emitter.on('changeConversation', async (data: any) => {
            if (router.currentRoute.value.name === 'InboxSearch') await initContact(data.id);
        });

        watch(
            () => activeKey.value,
            newVal => {
                updateCustomDataSort(newVal);
            },
        );

        watch(
            () => route.params.conversation,
            newVal => {
                if (route.name == 'InboxGroups' && newVal) {
                    initContact(newVal);
                }
                disableInfoConvo.value = false;
                showDropdown.value = false;
            },
            { immediate: true },
        );

        watch(
            () => conversationDetail.value,
            (oldVal, newVal) => {
                if (oldVal._id !== newVal._id) disableInfoConvo.value = false;
            },
            { deep: true },
        );

        onMounted(async () => {
            // await getAttributeInfomation();
            // // setSelectedAttribute();
            // getUserActiveKey();
            const currRouter = router.currentRoute.value.query;
            if (currRouter && Object.prototype.hasOwnProperty.call(currRouter, 'is_clone')) {
                await getCustomerInfo((contact as any).value._id);
                await getRecentPageList((contact as any).value._id);
                setSelectedAttribute();
            }
            await getAttributeInfomation();
            getUserActiveKey();
            emitter.on('checkOnlineCustomer', updateCustomerOnlineStatus);
        });

        onUnmounted(() => {
            emitter.off('checkOnlineCustomer', updateCustomerOnlineStatus);
        });

        return {
            activeKey,
            userStore,
            dropdownEl,
            dropdownButtonEl,
            showSkeletonContact,
            contact,
            showDropdown,
            toggleDropdown,
            recentList,
            searchAttributeValue,
            attributeList,
            attributesIds,
            checkSelectAllAttribute,
            onSelectAttribute,
            onSelectAllAttribute,
            selectedAttributes,
            selectedAttributesId,
            attributesSearch,
            listMapAttribute,
            dropdownRight,
            dropdownLeft,
            dropdownTop,
            dropdownBottom,
            disableInfoConvo,
            convoId,
            arrAttributeHide,
            filters,
        };
    },
});
</script>
<style lang="scss">
:deep(.button__dropdown) {
    outline: none !important;
    transition: none !important;
}
</style>
