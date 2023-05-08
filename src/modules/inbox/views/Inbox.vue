<template>
    <div class="flex flex-1 min-w-0">
        <submenu-component
            :loading="skeletonListGroup"
            @change="clickSubmenu"
            :showCount="true"
            :heading="$t('inbox.inbox_title')"
            :navLinkParams="routeList"
            :linkWithParams="true"
            v-model="showSubmenu"
            :hideDefaultContent="isOpenFilter"
        >
            <template v-slot:header-addon>
                <div class="flex">
                    <div class="relative">
                        <div
                            class="
                                absolute
                                right-0
                                text-white
                                bg-primary-400
                                rounded-full
                                h-16
                                w-16
                                text-12 text-center
                                right-6p
                            "
                            v-if="filterCount"
                        >
                            {{ filterCount }}
                        </div>
                        <button-component
                            @click="onClickFilter"
                            class="mr-8p"
                            :active="isOpenFilter"
                            type="subtle"
                            icon="filter"
                        />
                    </div>
                    <button-component
                        :key="compKey"
                        @click="onClickSearch"
                        :active="router.currentRoute.value.name === 'InboxSearch'"
                        type="subtle"
                        icon="search"
                    />
                </div>
            </template>
            <template v-slot:content>
                <InboxFilter
                    v-show="isOpenFilter"
                    :key="compKey"
                    @close="isOpenFilter = false"
                    @apply-filter="onApplyFilter"
                />
            </template>
        </submenu-component>

        <div
            v-show="router.currentRoute.value.name === 'InboxSearch' || conversations.length !== 0 || !noMessage"
            class="h-full min-w-0 flex-1 flex flex-wrap bg-white shadow-deep-1 rounded-l-8p relative z-0 shadow-custom"
        >
            <div v-if="isSearch" class="w-full pt-10p pl-32p pr-36p box-search-convo">
                <div class="flex items-center">
                    <input-comp
                        class="flex-grow"
                        v-model="searchValue"
                        closeIcon
                        v-on:keyup.enter="onEnterSearch"
                        placeholder="Search by customer name or email
"
                    >
                        <template v-slot:prefix>
                            <icon-comp name="search"></icon-comp>
                        </template>
                    </input-comp>
                    <button-component class="ml-16p" @click="onClickCancel" type="link"
                        ><span class="text-primary-500 font-bold">Cancel</span></button-component
                    >
                </div>
                <template v-if="status === 'init'">
                    <div class="h-full flex flex-col items-center">
                        <div class="relative logo-search-inbox">
                            <img class="logo mx-auto" src="../images/no-data.svg" alt="banner" />
                        </div>
                    </div>
                </template>
                <template
                    v-if="
                        !['init', 'searching'].includes(status) &&
                        conversations.length === 0 &&
                        router.currentRoute.value.name === 'InboxSearch' &&
                        searchValue.length > 0 &&
                        filterCount == 0
                    "
                >
                    <div class="h-full flex flex-col items-center">
                        <div class="relative logo-search-inbox">
                            <img class="logo mx-auto w-120 h-120" src="../images/no-data.svg" alt="banner" />
                            <div
                                class="text-center search-no-data-message"
                                v-html="$t('inbox.inbox_searched_no_data', { searchedValue })"
                            ></div>
                        </div>
                    </div>
                </template>
                <template
                    v-else-if="
                        !['init', 'searching'].includes(status) &&
                        conversations.length === 0 &&
                        (searchValue.length > 0 || status=='search') &&
                        router.currentRoute.value.name === 'InboxSearch'
                    "
                >
                    <div class="h-full flex flex-col items-center">
                        <div class="relative logo-search-inbox">
                            <img class="logo mx-auto w-120 h-120" src="../images/no-data.svg" alt="banner" />
                            <div class="text-center search-no-data-message">
                                It’s still a bit quiet here, isn’t it?
                                <br />Let’s reset search conditions to view your preferred results.
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <div
                v-show="
                    !isSearch ||
                    status === 'searching' ||
                    (['search', 'filter'].includes(status) && conversations.length !== 0)
                "
                class="w-1/4 h-full"
                :class="['search', 'filter'].includes(status) ? 'h-in-page-search' : ''"
            >
                <inbox-conversations
                    :callAPIGroupsDone="!skeletonListGroup"
                    :groupName="groupName"
                    :heading="heading"
                    :key="key"
                    :countChange="key"
                    @checkDataNull="updateStatusDataNull"
                    :routeName="['search', 'filter'].includes(status) ? 'InboxSearch' : 'InboxGroups'"
                    :total="total"
                    :searchValue="searchValue"
                    :filterData="filterData"
                    @changeTotalConversation="changeTotalConversation"
                ></inbox-conversations>
            </div>
            <div v-show="blockInboxByContact" class="w-3/4 relative">
                <div class="inbox__block text-center absolute">
                    <template v-if="archiveInboxByContact">
                        <img class="m-auto" src="../images/img-archive.svg" />
                    </template>
                    <template v-else>
                        <img class="m-auto" src="../images/img-contact-block.svg" />
                    </template>
                    <h4 class="text-16 text-neutrals-900 font-bold pt-12p pb-4p">
                        <template v-if="archiveInboxByContact"> Uh oh, this contact has been archived </template>
                        <template v-else> Uh oh, this contact has been blocked </template>
                    </h4>
                    <span class="text-14 text-neutrals-400">You can't message them for now.</span>
                </div>
            </div>
            <div
                v-show="!blockInboxByContact"
                class="h-full min-w-0 flex-1 flex flex-wrap bg-white rounded-l-8p relative z-0"
                :class="checkConvoChangedStatus ? 'convo-changed-status' : ''"
            >
                <div
                    v-show="
                        !isSearch ||
                        status === 'searching' ||
                        (['search', 'filter'].includes(status) && conversations.length !== 0)
                    "
                    class="w-2/3 h-full relative flex flex-col"
                    :class="['search', 'filter'].includes(status) ? 'h-in-page-search' : ''"
                >
                    <div class="flex-grow box-mess-composer h-full">
                        <InboxMessage
                            @changeAssigned="changeAssigned"
                            :assign="router.currentRoute.value.name !== 'InboxSearch' ? groupName : assigned"
                        ></InboxMessage>
                    </div>
                </div>
                <ScrollbarComponent
                    v-show="
                        !isSearch ||
                        status === 'searching' ||
                        (['search', 'filter'].includes(status) && conversations.length !== 0)
                    "
                    class="w-1/3 h-full bg-neutrals-50"
                    :class="['search', 'filter'].includes(status) ? 'h-in-page-search' : ''"
                >
                    <InboxContact />
                </ScrollbarComponent>
            </div>
        </div>
        <InboxNoData
            v-show="noMessage && conversations.length === 0 && router.currentRoute.value.name !== 'InboxSearch'"
        ></InboxNoData>
        <image-slider
            v-if="router.currentRoute.value.params.conversation"
            v-model="showImageSlider"
            :activeImageId="selectedImageId"
            :convoId="router.currentRoute.value.params.conversation"
        ></image-slider>
        <MessageModalDelete
            v-model:showModal="isShowModalDeleteMessage"
            :message="messageDetailDelete"
            @close="() => (isShowModalDeleteMessage = false)"
        ></MessageModalDelete>
        <MessageModalTag
            v-model:showModal="isShowModalTagMessage"
            :tagsInMessage="tagsInMessage"
            :messageClickedData="messageClickedData"
            @close="() => (isShowModalTagMessage = false)"
        ></MessageModalTag>
        <MessageModalEmail
            v-model:showModal="isShowModalEmailMessage"
            :message="messageClickedData"
            @close="() => (isShowModalEmailMessage = false)"
        ></MessageModalEmail>
        <MessageModalConfirmSendEmail
            v-model:showModal="isShowModalConfirmSendEmail"
            :typeConfirmSendEmail="typeConfirmSendEmail"
            @close="() => (isShowModalConfirmSendEmail = false)"
        ></MessageModalConfirmSendEmail>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, inject, provide, onUnmounted, computed } from 'vue';
import ScrollbarComponent from '@/components/ui/ScrollbarComponent.vue';
import InboxContact from '../components/InboxContact.vue';
import InboxMessage from '../components/InboxMessage/InboxMessage.vue';
import SubmenuComponent from '@/components/ui/SubmenuComponent.vue';
import { routerPush } from '@/router';
import { useInboxGroup } from '@/modules/inbox/composables/useInboxGroup';
import { useInboxPushingHandler } from '@/modules/inbox/composables/useInboxPushingHandler';
import InboxConversations from '../components/InboxConversations.vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useI18n } from 'vue-i18n';
import InboxNoData from '@/modules/inbox/components/InboxNoData.vue';
import { useInboxGroupConversation } from '../composables/useInboxGroupConversations';
import { useSocket } from '@/composables/useSocket';
import { useToast } from '@/composables/useToast';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import InputComp from '@/components/ui/InputComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import debounce from 'lodash/debounce';
import { useInbox } from '@/modules/inbox/composables/useInbox';
import { store } from '@/store';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';
import ImageSlider from '@/components/ui/ImageSliderComponent/ImageSliderComponent.vue';
import MessageModalDelete from '@/modules/inbox/components/InboxMessage/ModalMessage/MessageModalDelete.vue';
import MessageModalTag from '@/modules/inbox/components/InboxMessage/ModalMessage/MessageModalTag.vue';
import MessageModalEmail from '@/modules/inbox/components/InboxMessage/ModalMessage/MessageModalEmail.vue';
import MessageModalConfirmSendEmail from '@/modules/inbox/components/InboxMessage/ModalMessage/MessageModalConfirmSendEmail.vue';
import { useTag } from '@/modules/setting/composables/useTag';
import { useInboxTag } from '@/modules/inbox/composables/useInboxTag';
import { useUser } from '@/modules/auth/composables/useUser';
import InboxFilter from '@/modules/inbox/components/InboxFilter.vue';
import CONSTANTS from '../constants/constants.js';
import { useInboxConversation } from '@/modules/inbox/composables/useInboxConversation';

export default defineComponent({
    name: 'Inbox',
    components: {
        ScrollbarComponent,
        SubmenuComponent,
        InboxConversations,
        InboxMessage,
        InboxContact,
        InboxNoData,
        InboxFilter,
        ButtonComponent,
        InputComp,
        IconComp,
        ImageSlider,
        MessageModalDelete,
        MessageModalTag,
        MessageModalEmail,
        MessageModalConfirmSendEmail,
    },
    setup(props: any, { emit }: any) {
        const isShowModalDeleteMessage = ref<boolean>(false);
        const showImageSlider = ref<boolean>(false);
        const selectedImageId = ref<any>(null);
        const router = useRouter();
        const groupName = ref<any>('');
        const heading = ref<string>('');
        const key = ref<number>(0);
        const { t } = useI18n();
        const { getGroups, inboxGroup, titleGroup } = useInboxGroup();
        const { getTagPageMessage } = useTag();
        const { allTag } = useInboxTag();
        const { getWorkspaceInfo, emailSendingLimit } = useUser();
        const {
            conversations,
            updateStatusOnlineCustomer,
            updateSkeletonListConversation,
            searchConversation,
            updateListConversation,
            getConversationList,
            nextPageSearch,
            nextPage,
            noMessage,
        } = useInboxGroupConversation({
            props,
            emit,
        });
        const {
            routeGroupList,
            onListenIncomingConversation,
            onListenIncomingConversationPageSearch,
            group,
            addonConvo,
            resetgroup,
            currConvo,
            mergeNumberGroupToActualGroup,
            mountedInbox,
            resetCacheConvoRemove,
            resetgroupNotSetimeout,
            cacheConvoResolveAndReopen,
            cacheConvoRemove,
            changeNumberGroup,
            pushNumberGroup,
            pushAddonConvoHandleReOpen,
            resetCacheConvoResolveAndReopen,
        } = useInboxPushingHandler();
        const skeletonListGroup = ref<boolean>(true);
        const emitter: any = inject('emitter');
        const oldLabelClick = ref<string>('');
        const { addToast, removeToastSingle } = useToast();
        const { socket } = useSocket();
        const compKey = ref(0);
        const isSearch = ref<boolean>(false);
        const route = useRoute();
        const searchValue = ref('');
        const status = ref('init');
        const isSearchByEnter = ref(false);
        const searchedValue = ref('');
        const assigned = ref('');
        const showSubmenu = ref(true);
        const total = ref(0);
        const { updateSkeletonConvoDetail, updateSkeletonContact, groupNameHistory, showAlertChangedConvo } =
            useInbox();
        const { conversationDetail, conversationId, handleMessageFakeId } = useInboxConversationDetail();
        const { handleIncomingConverPageInboxSearch, updateConversations, checkNewMessageSendByCustomerAndConvoResolve } = useInboxConversation();
        const messageDetailDelete = ref({});
        const tagsInMessage = ref();
        const isShowModalTagMessage = ref<boolean>(false);
        const isShowModalEmailMessage = ref<boolean>(false);
        const isShowModalConfirmSendEmail = ref<boolean>(false);
        const messageClickedData = ref();
        const typeConfirmSendEmail = ref('confirm');

        const isOpenFilter = ref<boolean>(false);
        const filterData = ref({ status: null });
        const filterStatus = ref<null | string>(null);
        const onClickFilter = () => {
            isOpenFilter.value = !isOpenFilter.value;
        };

        emitter.on('onClickImage', (data: any) => {
            showImageSlider.value = true;
            selectedImageId.value = data;
        });

        provide('showSubmenu', showSubmenu);

        provide('groupName', groupName);

        const initInbox = () => {
            // groupId
            let group = router.currentRoute.value.params.name;
            if (typeof group !== 'string' && group != undefined) group = group[0];
            if (group != undefined && group && group != '') {
                groupName.value = group;
                if (group in titleGroup) heading.value = titleGroup[group];
                else heading.value = group;
            } else {
                router.replace({ name: 'InboxGroups', params: { name: 'assign_to_you' } });
                groupName.value = 'assign_to_you';
                heading.value = titleGroup[groupName.value];
            }
        };

        const initSearch = () => {
            isSearch.value = true;
        };

        const initTags = async () => {
            const response = await getTagPageMessage({ per_page: 500, select: ['name'] });
            if (!response.error) {
                allTag.value = response.data.active.data;
            }
        };

        onMounted(async () => {
            await initTags();
            mountedInbox.value = false;
            emitter.emit('assignDefault', groupName.value);
            if (router.currentRoute.value.name == 'InboxSearch') initSearch();
            else initInbox();
            // get data from api
            skeletonListGroup.value = true;
            await getGroups();
            skeletonListGroup.value = false;
            await new Promise((resolve) => setTimeout(resolve, 500));
            mountedInbox.value = true;
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const workspaceInfo = await getWorkspaceInfo();
            if (
                workspaceInfo.data &&
                workspaceInfo.data.setting &&
                workspaceInfo.data.setting.email_sending_alert_limit
            ) {
                emailSendingLimit.value = workspaceInfo.data.setting.email_sending_alert_limit;
            }
            showAlertChangedConvo.value = true;
        });

        const checkConvoChangedStatus = computed(() => {
            if (cacheConvoResolveAndReopen.value.length > 0) {
                const findIndex = cacheConvoResolveAndReopen.value.findIndex(
                    (convo: any) =>
                        convo.action === 'yourself_resolve' && convo.convo_id === conversationDetail.value._id,
                );
                return findIndex > -1;
            }
            return false;
        });

        const clickSubmenu = (item: any) => {
            if (oldLabelClick.value != item.label && oldLabelClick.value != '') noMessage.value = false;
            groupName.value = item.params.name;
            heading.value = item.label;
            emitter.emit('assignDefault', groupName.value);
            oldLabelClick.value = item.label;
            resetCacheConvoRemove();
            resetgroupNotSetimeout();
            getGroups();
        };

        const updateStatusDataNull = (item: any) => {
            noMessage.value = item;
        };

        emitter.on('checkNodataMessage', (data: any) => {
            noMessage.value = data;
        });
        
        const changeTotalConversation = (data: any) => {
            total.value = total.value + data;
        };

        const onClickSearch = () => {
            isSearch.value = !isSearch.value;
            if (route.name !== 'InboxSearch') {
                if (cacheConvoRemove.value.id != '') {
                    changeNumberGroup(cacheConvoRemove.value.group, 'unassign');
                    if (cacheConvoRemove.value.groupPush != '') pushNumberGroup(cacheConvoRemove.value.groupPush);
                    resetCacheConvoRemove();
                }
                mergeNumberGroupToActualGroup();
                let group = router.currentRoute.value.params.name;
                if (typeof group !== 'string' && group != undefined) group = group[0];
                if (group != undefined && group && group != '') groupNameHistory.value = group;
                routerPush('InboxSearch');
            } else {
                if (groupNameHistory.value == '') router.go(-1);
                else routerPush('InboxGroups', { name: groupNameHistory.value });
                filterData.value = { status: null };
            }
            isOpenFilter.value = false;
        };

        const onClickCancel = () => {
            isSearch.value = !isSearch.value;
            if (groupNameHistory.value == '') {
                router.go(-1);
            } else {
                routerPush('InboxGroups', { name: groupNameHistory.value });
                filterData.value = { status: null };
            }
            //  else if (isHasFilter) {
            //     return;
            // }
        };

        const refreshData = () => {
            nextPageSearch.value = '';
            total.value = 0;
            updateListConversation([], false);
        };

        const filterCount = computed(() => {
            if (filterData.value.status) {
                return 1;
            }
            return 0;
        });

        const onSearchConvo = async (q: any, statusValue: any = null, tag: string[] | null = []) => {
            console.log('onSearchConvo');
            if (statusValue) {
                statusValue = statusValue === 'open' ? CONSTANTS.STATUS.ACTIVATED : CONSTANTS.STATUS.RESOLVED;
            }

            if (q !== searchedValue.value) {
                refreshData();
                searchedValue.value = q;
            }
            if (q || status || (tag && tag.length > 0) || filterCount.value >= 1) {
                updateSkeletonListConversation(true);
                updateSkeletonConvoDetail(true);
                updateSkeletonContact(true);
                status.value = 'searching';
                const data = await searchConversation(q, nextPageSearch.value, statusValue, tag);
                updateSkeletonListConversation(false);
                updateSkeletonContact(false);
                status.value = 'search';
                updateListConversation(data.data, false);
                if (data.data.length > 0) emitter.emit('changeConversation', data.data[0]);
                nextPageSearch.value = data.next_page;
                total.value = data.total;
            }
        };

        const onApplyFilter = async (data: any) => {
            status.value = 'search';
            filterData.value.status = data.status;
            // if (route.name !== 'InboxSearch') {
            //     isFilterOnly.value = true;
            // }
            mergeNumberGroupToActualGroup();
            let group = router.currentRoute.value.params.name;
            if (typeof group !== 'string' && group != undefined) group = group[0];
            if (group != undefined && group && group != '') groupNameHistory.value = group;
            await routerPush('InboxSearch');
            nextPageSearch.value = '';
            await onSearchConvo(searchValue.value, data.status);
            isOpenFilter.value = false;
            isSearch.value = true;
            resetCacheConvoResolveAndReopen();
            resetCacheConvoRemove();
            await getGroups();
        };

        const changeAssigned = (data: any, convoId: any) => {
            assigned.value = data;
            conversations.value.forEach((conversation) => {
                if (conversation.id === convoId) conversation.assigned = !conversation.assigned;
            });
        };  
        
        const resetDataInit = () => {
            isSearch.value = false;
            searchedValue.value = '';
            searchValue.value = '';
            status.value = 'init';
            nextPageSearch.value = '';
            nextPage.value = '';
        };

        const handleChangeRouterSearchToInbox = async (newValue: any) => {
            filterData.value = { status: null };
            const btn = document.getElementById('button-compo');
            if (btn != null) {
                btn.focus();
            }
            resetDataInit();
            updateListConversation([], false);
            let groupName = newValue.params.name;
            if (typeof groupName !== 'string' && groupName != undefined) groupName = groupName[0];
            if (groupName !== undefined && groupName !== '') {
                updateSkeletonListConversation(true);
                if (groupName !== 'all') updateSkeletonConvoDetail(true);
                await getConversationList(false, groupName);
                updateSkeletonListConversation(false);
            }
        };

        emitter.on('changeConversation', async (data: any) => {
            if (router.currentRoute.value.name === 'InboxSearch') {
                if (data.assigned) assigned.value = 'assign_to_you';
                else assigned.value = 'None';
            }
        });

        const onEnterSearch = debounce((e) => {
            refreshData();
            isSearchByEnter.value = true;
            const status = filterData.value.status ? filterData.value.status : null;
            onSearchConvo(searchValue.value, status);
        }, 200);

        // emitter.on('reloadSubmenu', () => {
        //     key.value++;
        // })

        socket.off('incomingConversation').on('incomingConversation', (data: any) => {
            if (data && data.last_message.sender) {
                emitter.emit('dotStatusIncommingMessage', 1);
            }

            if (
                (data.participants && router.currentRoute.value.name == 'InboxGroups') ||
                router.currentRoute.value.name == 'InboxSearch'
            ) {
                if (router.currentRoute.value.name === 'InboxSearch') {
                    // toggle event have change status contact
                    if (data.event_convo_type !== 'toggle') {
                        groupName.value = '';
                        onListenIncomingConversationPageSearch(data);
                        handleIncomingConverPageInboxSearch(data);
                        updateConversations(data);
                    }
                } else {
                    onListenIncomingConversation(data, groupName.value);
                }
                if (data.last_message && data.last_message.group == CONSTANTS.GROUP.MESSAGE && data.last_message.sender_type === CONSTANTS.SENT_BY.CUSTOMER) checkNewMessageSendByCustomerAndConvoResolve(data);
                if (conversationDetail.value._id === data.id) {
                    conversationDetail.value.participants = data.participants;
                }
            }

            if (data && data.last_message && typeof data.last_message.fake_id !== 'undefined') {
                handleMessageFakeId(data.last_message);
            }
        });

        emitter.on('changeGroupName', (data: any) => {
            groupName.value = data;
        });

        watch(showImageSlider, (val) => {
            if (!val) {
                selectedImageId.value = null;
            }
        });

        watch(
            searchValue,
            debounce((newVal) => {
                if (newVal || filterCount.value > 0) {
                    if (!isSearchByEnter.value) {
                        const status = filterData.value.status ? filterData.value.status : null;
                        onSearchConvo(newVal, status);
                    } else {
                        isSearchByEnter.value = false;
                    }
                } else {
                    // conversations.value = [];
                    status.value = 'init';
                }
                emitter.emit('resetComposer');
            }, 2000),
        );

        watch(router.currentRoute, async (newValue, oldValue) => {
            showAlertChangedConvo.value = true;
            if (router.currentRoute.value.name == 'InboxGroups') {
                isOpenFilter.value = false;
                compKey.value++;
                let group = router.currentRoute.value.params.name;
                if (typeof group !== 'string' && group != undefined) group = group[0];
                if (group == undefined || group == '') routerPush('InboxGroups', { name: 'assign_to_you' });
                if (heading.value !== titleGroup[group]) heading.value = titleGroup[group];
                await new Promise((resolve) => setTimeout(resolve, 100));
                groupName.value = router.currentRoute.value.params.name;
            }
            if (newValue.name == 'InboxGroups' && oldValue.name == 'InboxSearch') {
                await handleChangeRouterSearchToInbox(newValue);
            } else if (newValue.name == 'InboxSearch') {
                resetCacheConvoResolveAndReopen();
                resetCacheConvoRemove();
            }
            await pushAddonConvoHandleReOpen();
        });

        watch(conversations, async () => {
            if (router.currentRoute.value.name == 'InboxSearch') return;
            if (router.currentRoute.value.name == 'InboxGroups' && conversations.value.length == 0) return;
            const group = router.currentRoute.value.params.name;
            const listNameInbox = ['assign_to_you', 'unassign', 'all'];
            if (!listNameInbox.includes(group as string)) routerPush('Error404');
        });

        socket.on('disconnect', (err: string) => {
            if (err === 'io server disconnect') {
                addToast({
                    single: true,
                    title: t('common.socket_offline'),
                    type: 'basic',
                    icon: 'ExclamationCircle',
                    iconColor: 'neutrals-500',
                    timeout: 3000,
                });
            }
        });

        // socket.on('connect', () => {
        //     removeToastSingle();
        // });

        // socket.on('reconnect', () => {
        //     removeToastSingle();
        // });

        socket.off('incomingContactOnlineStatus').on('incomingContactOnlineStatus', async (data: any) => {
            updateStatusOnlineCustomer(data);
            emitter.emit('checkOnlineCustomer', data);
        });

        onUnmounted(() => {
            emitter.all.clear();
            mountedInbox.value = false;
        });

        const blockInboxByContact = ref<boolean>(false);
        const archiveInboxByContact = ref<boolean>(false);

        emitter.on('blockInbox', (value: number) => {
            if (value == 2) {
                blockInboxByContact.value = true;
                archiveInboxByContact.value = false;
            } else if (value == 4) {
                archiveInboxByContact.value = true;
                blockInboxByContact.value = true;
            } else {
                archiveInboxByContact.value = false;
                blockInboxByContact.value = false;
            }
        });

        emitter.on('onClickDeleteMessage', (data: any) => {
            messageDetailDelete.value = data;
            isShowModalDeleteMessage.value = true;
        });

        emitter.on('onClickTagMessage', (data: any) => {
            tagsInMessage.value = [];
            if (typeof data.tags != 'undefined') tagsInMessage.value = data.tags;
            messageClickedData.value = data;
            isShowModalTagMessage.value = true;
        });

        emitter.on('onClickEmailMessage', (data: any) => {
            messageClickedData.value = data;
            isShowModalEmailMessage.value = true;
        });

        emitter.on('showModalConfirmSendEmail', (data: any) => {
            isShowModalConfirmSendEmail.value = true;
            typeConfirmSendEmail.value = data.type;
        });

        onBeforeRouteLeave(() => {
            resetgroup();
        });

        return {
            filterData,
            onApplyFilter,
            onClickFilter,
            filterStatus,
            inboxGroup,
            routeList: routeGroupList,
            titleGroup,
            heading,
            groupName,
            key,
            t,
            initInbox,
            clickSubmenu,
            updateStatusDataNull,
            skeletonListGroup,
            noMessage,
            group,
            addonConvo,
            resetgroup,
            currConvo,
            conversations,
            compKey,
            onClickSearch,
            isSearch,
            searchValue,
            onClickCancel,
            onEnterSearch,
            status,
            router,
            searchedValue,
            total,
            assigned,
            changeAssigned,
            blockInboxByContact,
            showSubmenu,
            archiveInboxByContact,
            conversationId,
            showImageSlider,
            selectedImageId,
            messageDetailDelete,
            isShowModalDeleteMessage,
            isShowModalTagMessage,
            isShowModalEmailMessage,
            tagsInMessage,
            messageClickedData,
            isShowModalConfirmSendEmail,
            typeConfirmSendEmail,
            isOpenFilter,
            filterCount,
            checkConvoChangedStatus,
            changeTotalConversation,
        };
    },
});
</script>
<style lang="scss" scoped>
.shadow-custom {
    box-shadow: -2px 2px 4px 0px rgb(0 0 0 / 7%);
}
.h-in-page-search {
    height: calc(100% - 56px);
}
.logo-search-inbox {
    top: calc(30% - 56px);
}
.box-mess-composer {
    border-right: 1px solid #e9e9ec;
}
.box-search-convo {
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 9px;

    &::v-deep input {
        padding-top: 7px;
        padding-bottom: 7px;
    }
}
.inbox__block {
    top: 30%;
    left: 50%;
    transform: translate(-50%, -30%);
}
.search-no-data-message {
    word-break: break-all;
}
</style>
<style lang='scss'>
.convo-changed-status::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #f6f6f8;
    opacity: 0.5;
    z-index: 11;
}
</style>