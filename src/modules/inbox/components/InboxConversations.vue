<template>
    <div
        class="
            h-full
            bg-white
            relative
            transition-all
            duration-300
            ease-in-out
            w-100%
            box-list-conversation
            rounded-tl-8p rounded-bl-8p
        "
    >
        <div class="overflow-hidden flex flex-col h-full">
            <div
                v-if="!skeletonListConversation && routeName !== 'InboxSearch'"
                class="
                    align-center
                    title-box-conversation
                    p-16p
                    pl-24p
                    border-b border-neutrals-100
                    font-bold
                    flex-none
                    h-56
                    flex
                "
            >
                <inbox-conversation-group-dropdown :heading="heading" />
            </div>
            <span v-if="!skeletonListConversation && routeName === 'InboxSearch'" class="text-14 pt-18p pb-18p pl-16p">
                <b>{{ total }}</b>
                <span class="text-neutrals-400"
                    >{{
                        total === 1
                            ? $t('inbox.inbox_res_search_conversation')
                            : $t('inbox.inbox_res_search_conversations')
                    }}
                    {{ $t('inbox.inbox_res_search_match') }}</span
                >
            </span>
            <div v-if="skeletonListConversation" class="skeleton-heading">
                <skeleton-box width="86px" height="8px" :classBgColor="'bg-neutrals-100'" />
            </div>
            <div
                class="submenu__wrapper overflow-y-auto flex-auto scrollbar--transparent rounded-bl-8p"
                :class="skeletonListConversation ? 'show-skeleton' : ''"
                ref="submenu"
                @scroll="handleScrollToBottom"
            >
                <div v-if="!skeletonListConversation" class="box-content">
                    <div
                        v-for="(item, index) in conversations"
                        class="relative w-max w-inherit"
                        :key="`submenu-${index}`"
                    >
                        <InboxConversationDetail
                            :routeName="routeName"
                            :item="item"
                            :groupName="groupName"
                            :index="index"
                            :menuActive="menuActive"
                            @updateMenuActive="updateMenuActive"
                        ></InboxConversationDetail>
                    </div>
                    <div v-if="loading" class="loading">
                        <Spinner size="small" color="#3E6DDA" />
                    </div>
                </div>
                <div v-else class="box-content">
                    <Skeleton />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref, watch } from 'vue';
import { router, routerPush } from '@/router';
import InboxConversationDetail from './InboxConversationDetail.vue';
import { useInbox } from '@/modules/inbox/composables/useInbox';
import { useInboxGroupConversation } from '@/modules/inbox/composables/useInboxGroupConversations';
import Spinner from '@/components/ui/Spinner.vue';
import { store } from '@/store';
import { useSocket } from '@/composables/useSocket';
import Skeleton from '../components/InboxSkeleton/InboxSkeletonConversations.vue';
import { useInboxPushingHandler } from '../composables/useInboxPushingHandler';
import { useRouter } from 'vue-router';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import InboxConversationGroupDropdown from './InboxConversationGroupDropdown.vue';
import CONSTANTS from '@/modules/inbox/constants/constants';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';
import { useInboxConversation } from '@/modules/inbox/composables/useInboxConversation';

export default defineComponent({
    name: 'InboxConversations',
    components: {
        InboxConversationDetail,
        Spinner,
        Skeleton,
        SkeletonBox,
        InboxConversationGroupDropdown,
    },
    props: {
        heading: {
            type: String,
            default: '',
        },
        groupName: {
            type: String,
            default: '',
        },
        countChange: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            default: 0,
        },
        callAPIGroupsDone: {
            type: Boolean,
            default: false,
        },
        routeName: {
            type: String,
            default: 'InboxGroups',
        },
        searchValue: {
            type: String,
            default: '',
        },
        filterData: {
            default: { status: null },
        },
    },
    emits: ['checkDataNull', 'changeTotalConversation'],
    setup(props: any, { emit }: any) {
        const isShowSubmenu = ref(true);
        const loading = ref<boolean>(false);
        const menuActive = ref<number>(0);
        const { _id: userId } = store.state.auth.user;
        const { conversationDetail } = useInboxConversationDetail();
        const { handleConvoActivePageInboxSearch } = useInboxConversation();
        const {
            conversations,
            getConversationList,
            nextPage,
            skeletonListConversation,
            nextPageSearch,
            searchConversation,
            updateListConversation,
        } = useInboxGroupConversation({
            props,
            emit,
        });
        const {
            checkAddonConvo,
            isOnGetNewConversations,
            checkIncomingConversationCache,
            cacheConvoRemove,
            cacheConvoResolveAndReopen,
            changeNumberGroup,
            resetCacheConvoRemove,
            pushNumberGroup,
            mergeNumberGroupToActualGroup,
        } = useInboxPushingHandler();
        const emitter: any = inject('emitter');
        const router = useRouter();
        const { socket } = useSocket();

        onMounted(async () => {
            skeletonListConversation.value = true;
            if (props.countChange > 0) {
                await getConversationList(false, props.groupName);
                skeletonListConversation.value = false;
            }
        });

        const handleScrollToBottom = async (target: any) => {
            if (props.routeName === 'InboxSearch') {
                if (nextPageSearch.value == '' || nextPageSearch.value == null || nextPageSearch.value == 'null')
                    return;
                if (target.target.scrollTop + target.target.clientHeight >= target.target.scrollHeight) {
                    const status =
                        props.filterData.status === 'open' ? CONSTANTS.STATUS.ACTIVATED : CONSTANTS.STATUS.RESOLVED;
                    loading.value = true;
                    const data = await searchConversation(props.searchValue, nextPageSearch.value, status, null);
                    updateListConversation(data.data, true);
                    nextPageSearch.value = data.next_page;
                    loading.value = false;
                }
            } else {
                if (nextPage.value == '' || nextPage.value == null || nextPage.value == 'null') return;
                if (target.target.scrollTop + target.target.clientHeight >= target.target.scrollHeight) {
                    loading.value = true;

                    await getConversationList(true, props.groupName);
                    // await callData(true);
                    loading.value = false;
                }
            }
        };

        const handleCacheConvoResolveAndReopen = async (page = 'inbox') => {
            let noHandleClearData = false;
            if (cacheConvoResolveAndReopen.value.length > 0) {
                let isCheckHandlePageSearch = false;
                let indexConvoRemovedPageSearch = -1;
                await new Promise(resolve => setTimeout(resolve, 200));
                const findIndexCurrentConvo = conversations.value.findIndex(c => c.id === conversationDetail.value._id);
                cacheConvoResolveAndReopen.value.forEach((cacheConvo: any) => {
                    if (cacheConvo.action === 'someone_reopen') {
                        if (page !== 'inbox') {
                            const findIndex = conversations.value.findIndex(c => c.id === cacheConvo.convo_id);
                            if (findIndex > -1) {
                                conversations.value.splice(findIndex, 1);
                                emit('changeTotalConversation', -1);
                            }
                        }
                    } else {
                        const findIndex = conversations.value.findIndex(c => c.id === cacheConvo.convo_id);
                        if (findIndex > -1) {
                            if (page === 'inbox') {
                                changeNumberGroup('all', 'unassign');
                                changeNumberGroup(cacheConvo.group, 'unassign');
                                conversations.value.splice(findIndex, 1);
                            } else {
                                // page search
                                if (findIndexCurrentConvo === findIndex) {
                                    noHandleClearData = true;
                                    return;
                                }
                                if (cacheConvo.action === 'yourself_resolve') {
                                    changeNumberGroup('all', 'unassign');
                                    const userInConvo = conversations.value[findIndex]['participants'].filter((p: any) => p.parti_type === 1);
                                    if (userInConvo.length < 1) {
                                        changeNumberGroup('unassign', 'unassign');
                                    } else {
                                        if (userInConvo[0]['parti_id'] === userId) changeNumberGroup('assign_to_you', 'unassign');
                                    }
                                    mergeNumberGroupToActualGroup();
                                    conversations.value.splice(findIndex, 1);
                                    emit('changeTotalConversation', -1);
                                    isCheckHandlePageSearch = true;
                                    indexConvoRemovedPageSearch = findIndex;
                                }
                            }
                        }
                    }
                });
                if (isCheckHandlePageSearch && indexConvoRemovedPageSearch > -1) {
                    await new Promise(resolve => setTimeout(resolve, 400));
                    handleConvoActivePageInboxSearch(indexConvoRemovedPageSearch, true);
                }
            }
            if (!noHandleClearData) cacheConvoResolveAndReopen.value = [];
        };

        const updateMenuActive = async (data: any) => {
            menuActive.value = data;
            emitter.emit('resetComposer');
            if (props.groupName === 'all') resetCacheConvoRemove();
            if (router.currentRoute.value.name === 'InboxSearch') await handleCacheConvoResolveAndReopen('search');
        };

        const updateIndexMenuActive = (data: any) => {
            menuActive.value = menuActive.value + data;
        };

        const handleReopenConversation = (data: any) => {
            if (data.convo_id === conversationDetail.value._id) {
                conversationDetail.value.status = data.status;
                if (data._auid !== userId) {
                    const action = 'someone_reopen';
                    const findIndex = cacheConvoResolveAndReopen.value.findIndex(
                        (convo: any) => convo.convo_id == data.convo_id,
                    );
                    if (findIndex < 0) {
                        cacheConvoResolveAndReopen.value.push({
                            convo_id: data.convo_id,
                            action: action,
                            group: '',
                        });
                    } else cacheConvoResolveAndReopen.value[findIndex]['action'] = action;
                }
            }
        };

        const handleResolveConversation = (data: any) => {
            const userHandleConvo = conversationDetail.value.participants.filter(par => par.parti_type == 1);
            if (data.convo_id === conversationDetail.value._id) {
                conversationDetail.value.status = data.status;
                let action = 'someone_resolve';
                if (data._auid === userId) action = 'yourself_resolve';
                const findIndex = cacheConvoResolveAndReopen.value.findIndex(
                    (convo: any) => convo.convo_id == data.convo_id,
                );
                if (findIndex < 0) {
                    let group = 'assign_to_you';
                    if (userHandleConvo.length < 1) group = 'unassign';
                    cacheConvoResolveAndReopen.value.push({
                        convo_id: data.convo_id,
                        action: action,
                        group: group,
                    });
                } else cacheConvoResolveAndReopen.value[findIndex]['action'] = action;
            } else {
                const findIndex = conversations.value.findIndex(c => c.id === data.convo_id);
                if (findIndex > -1) {
                    if (router.currentRoute.value.name === 'InboxSearch') {
                        emit('changeTotalConversation', -1);
                        handleConvoActivePageInboxSearch(findIndex);
                    }
                    conversations.value.splice(findIndex, 1);
                    changeNumberGroup('all', 'unassign');
                    if (userHandleConvo.length < 1) changeNumberGroup('unassign', 'unassign');
                    mergeNumberGroupToActualGroup();
                }
            }
        };

        socket.on('incomingStatusConversation', (data: any) => {
            if (data.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED) {
                handleResolveConversation(data);
            } else {
                handleReopenConversation(data);
            }
            if (data.convo_id === conversationDetail.value._id) {
                conversationDetail.value.status = data.status;
            }
        });

        emitter.on('handleMenuActive', (data: any) => {
            updateIndexMenuActive(data);
        });

        watch(router.currentRoute, async (newVal, oldVal) => {
            if (newVal.name == 'InboxGroups' && oldVal.name == 'InboxGroups') {
                const groupNew = newVal.params.name;
                const groupOld = oldVal.params.name;
                if (groupNew != undefined && groupNew != '') {
                    emitter.emit('changeGroupName', groupNew);

                    if (groupNew != groupOld) {
                        skeletonListConversation.value = true;
                        nextPage.value = '';
                        isOnGetNewConversations.value = true;
                        await getConversationList(false, groupNew);
                        await checkAddonConvo();
                        checkIncomingConversationCache();
                        skeletonListConversation.value = false;
                        if (cacheConvoRemove.value.id != '') {
                            changeNumberGroup(cacheConvoRemove.value.group, 'unassign');
                            if (cacheConvoRemove.value.groupPush != '')
                                pushNumberGroup(cacheConvoRemove.value.groupPush);
                            resetCacheConvoRemove();
                        }
                    } else {
                        let conversation = router.currentRoute.value.params.conversation;
                        if (typeof conversation !== 'string' && conversation != undefined)
                            conversation = conversation[0];
                        if (conversation == undefined || conversation == '') {
                            if (conversations.value.length > 0) {
                                router.replace({
                                    name: 'InboxGroups',
                                    params: {
                                        name: props.groupName,
                                        conversation: conversations.value[0]['id'],
                                    },
                                });
                                emitter.emit('changeConversation', conversations.value[0]);
                            }
                        }
                        if (cacheConvoRemove.value.id != '' && cacheConvoRemove.value.action !== 'handleInGroupAll') {
                            const findIndex = conversations.value.findIndex(c => c.id === cacheConvoRemove.value.id);
                            if (findIndex > -1) conversations.value.splice(findIndex, 1);
                            changeNumberGroup(cacheConvoRemove.value.group, 'unassign');
                            if (cacheConvoRemove.value.groupPush != '')
                                pushNumberGroup(cacheConvoRemove.value.groupPush);
                            resetCacheConvoRemove();
                        } else {
                            await handleCacheConvoResolveAndReopen();
                        }
                    }
                }
            }
        });
        watch(
            () => props.callAPIGroupsDone,
            async (newVal: boolean) => {
                if (newVal) {
                    // await callData(false);
                    skeletonListConversation.value = true;
                    await getConversationList(false, props.groupName);
                    //check is_clone
                    // const currRouter = router.currentRoute.value.query;
                    await checkAddonConvo();
                    await checkIncomingConversationCache();
                    skeletonListConversation.value = false;
                }
            },
        );

        watch(
            () => props.routeName,
            () => {
                menuActive.value = 0;
            },
        );

        return {
            skeletonListConversation,
            isShowSubmenu,
            conversations,
            loading,
            handleScrollToBottom,
            getConversationList,
            menuActive,
            updateMenuActive,
        };
    },
});
</script>

<style lang="scss" scoped>
.submenu__wrapper {
    height: calc(100vh - 57px - 56px - 32px - 20px);
    // &::-webkit-scrollbar {
    //     width: 16px;
    // }
    // &::-webkit-scrollbar-track {
    //     background: #f6f6f8;
    //     padding: 0 30px;
    //     width: 16px;
    // }
    // &::-webkit-scrollbar-thumb {
    //     background: #e9e9ec;
    //     border-radius: 8px;
    //     border: 4px solid #f6f6f8;
    // }
    // &::-webkit-scrollbar-thumb:hover {
    //     background: #b4b4be;
    // }
}
.submenu__tooltip[data-show-tooltip='false'] {
    :deep(.tooltip-component__inner) {
        visibility: hidden;
    }
}
.box-list-conversation {
    border-right: 1px solid #e9e9ec;
    .last-message {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        width: 96%;
        color: #828292;
    }
    .show-skeleton {
        overflow: hidden;
    }
    .skeleton-heading {
        padding: 30px 0 16px 16px;
    }
    .loading {
        position: absolute;
        height: 48px;
        bottom: 0;
        width: 100%;
        z-index: 1;
        background: #ffffff;
        text-align: center;

        .spinner {
            position: relative;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>
