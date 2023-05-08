<template>
    <div class="h-full bg-white relative transition-all duration-300 ease-in-out w-100% box-list-conversation">
        <div class="overflow-hidden flex flex-col h-full">
            <div
                class="flex justify-between items-center align-center box-assign-message pr-24p pl-24p border-b border-neutrals-100 font-bold flex-none h-56"
            >
                <InboxMessageHeader :conversationDetail='conversationDetail' />
                <SelectAssign @change="changeValue" v-model="assignDefault" :blockAssign="isShowBlockInboxMessage" />
            </div>
            <div
                class="flex-1 flex flex-col border overflow-hidden"
                :class="!isDragFile ? 'border-transparent' : 'border-primary-500'"
                @dragenter="dragenter"
                @dragover="dragover"
                @dragleave="dragleave"
                @drop="drop"
            >
                <div class="flex-1 overflow-y-auto box-message">
                    <!-- <div class="bg-message"></div> -->
                    <InboxMessageList @changeSkeleton="changeSkeleton" :clickReadAll="clickReadAll"></InboxMessageList>
                    <InboxMessageAlert
                        :checkConvoRemoved='checkConvoRemoved' 
                        :showAlertChangedConvo='showAlertChangedConvo' 
                        :checkCustomerOnlineStatus='checkCustomerOnlineStatus'
                        :statusOnlineCustomer='statusOnlineCustomer'
                        :conversationDetail='conversationDetail'
                        @closeAlertConvoChanged='closeAlertConvoChanged'
                        @closeAlertCustomerOnlineStatus='closeAlertCustomerOnlineStatus'
                    />
                    <template v-if="showIndicatorNewMessage">
                        <div
                            class="indicator-new-message inline-block bg-neutrals-50 pt-6p pr-12p pb-6p pl-12p"
                            @click="readAllMessage"
                        >
                            <img class="logo mx-auto" src="../../images/arrow-down.svg" alt="banner" />
                            <span class="text-14 text-neutrals-900"
                                >{{ countNewMessage }}
                                {{
                                    countNewMessage === 1
                                        ? $t('inbox.inbox_indicator_new_message')
                                        : $t('inbox.inbox_indicator_new_messages')
                                }}</span
                            >
                        </div>
                    </template>
                </div>
                <!-- composer -->
                <template v-if="isShowBlockInboxMessage">
                    <div
                        class="composer-block py-36p px-70p border border-neutrals-100 mb-16p mx-24p width-fill text-center"
                    >
                        <p class="text-14 text-neutrals-200">
                            <template v-if="isShowArchiveMessage">
                                You can’t reply to this message because<br />
                                your teammate has just archived this contact.
                            </template>
                            <template v-else>
                                You can’t reply to this message because<br />
                                your teammate has just blocked this contact.
                            </template>
                        </p>
                    </div>
                </template>
                <template v-else>
                    <inbox-composer
                        @changeAssignedFromComposer="changeAssignedFromComposer"
                        @handleStatusCustomer="handleStatusCustomer"
                        class="mb-16p mx-24p bottom-0 width-fill"
                    />
                </template>
            </div>
        </div>
    </div>
    <div v-show="skeleton">
        <Skeleton />
    </div>
</template>

<script lang="ts">
import SelectAssign from '../InboxSelectAssign.vue';
import InboxMessageList from '@/modules/inbox/components/InboxMessage/InboxMessageList.vue';
import InboxComposer from '@/modules/inbox/components/InboxComposer.vue';
import Skeleton from '../../components/InboxSkeleton/InboxSkeletonMessage.vue';
import { ref, inject, computed, defineComponent, watch } from 'vue';
import { useInbox } from '@/modules/inbox/composables/useInbox';
import { store } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { routerPush } from '@/router';
import { useInboxPushingHandler } from '../../composables/useInboxPushingHandler';
import { useSocket } from '@/composables/useSocket';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';
import { useInboxGroup } from '@/modules/inbox/composables/useInboxGroup';
import { useInboxGroupConversation } from '@/modules/inbox/composables/useInboxGroupConversations';
import { useDragDropFile } from '@/modules/inbox/composables/useDragDropFile';
import InboxMessageHeader from '../InboxMessage/InboxMessage/InboxMessageHeader.vue';
import InboxMessageAlert from '../InboxMessage/InboxMessage/InboxMessageAlert.vue';
import CONSTANTS from '@/modules/inbox/constants/constants';
import { useInboxConversation } from '@/modules/inbox/composables/useInboxConversation';
import { useContact } from '@/modules/contact/composables/useContact';

export default defineComponent({
    name: 'InboxMessage',
    components: { SelectAssign, InboxMessageList, InboxComposer, Skeleton, InboxMessageHeader, InboxMessageAlert },
    props: {
        assign: {
            type: String,
            default: '',
        },
    },
    emits: ['changeAssigned'],
    setup(props: any, { emit }: any) {
        const emitter: any = inject('emitter');
        const { skeleton, unAssignUserToConversation, assignUserToConversation, showAlertChangedConvo } = useInbox();
        const {
            setAddonConvo,
            changeNumberGroup,
            pushNumberGroup,
            currConvo,
            resetgroup,
            isSocketUpdateConvo,
            cacheConvoRemove,
            resetCacheConvoRemove,
        } = useInboxPushingHandler();
        const route = useRoute();
        const convoId: any = computed(() => route.params.conversation);
        const routeName: any = computed(() => route.params.name);
        const { _id: userId } = store.state.auth.user;
        const { socket } = useSocket();
        const isShowBlockInboxMessage = ref<boolean>(false);
        const checkCustomerOnlineStatus = ref<boolean>(false);
        const statusOnlineCustomer = ref('online');
        const isShowArchiveMessage = ref<boolean>(false);
        const {
            showIndicatorNewMessage,
            countNewMessage,
            conversationSelected,
            conversationDetail,
        } = useInboxConversationDetail();
        const clickReadAll = ref<number>(0);
        const router = useRouter();
        const { getGroups } = useInboxGroup();
        const { conversations } = useInboxGroupConversation({});
        const { isDragFile, dragenter, dragover, dragleave, drop } = useDragDropFile();
        const { handlePushRouterAfterChangeStatusConvo } = useInboxConversation();
        const { contact } = useContact();

        const changeSkeleton = (data: any) => {
            skeleton.value = data;
        };

        const readAllMessage = () => {
            clickReadAll.value++;
        };

        const changeAssignedFromComposer = (convoId: any) => {
            emit('changeAssigned', 'assign_to_you', convoId);
        };

        const changeValue = async (e: any) => {
            try {
                const assignCurrentUser = conversationDetail.value.participants.filter(
                    (p: any) => p.parti_type === 1,
                );
                let userIdAssign = userId;
                if (assignCurrentUser.length > 0) userIdAssign = assignCurrentUser[0]['parti_id'];
                if (router.currentRoute.value.name === 'InboxSearch') {
                    if (e.username === 'None') {
                        await unAssignUserToConversation(conversationSelected.value._id, userIdAssign);
                        emit('changeAssigned', 'None', conversationSelected.value._id);
                        resetgroup();
                    } else {
                        if (conversationDetail.value.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED) {
                            await handlePushRouterAfterChangeStatusConvo(conversationDetail.value);
                        }
                        if (e.username === 'You') {
                            await assignUserToConversation(conversationSelected.value._id, userId);
                            emit('changeAssigned', 'assign_to_you', conversationSelected.value._id);
                        } else {
                            await assignUserToConversation(conversationSelected.value._id, e.user_id);
                        }
                        resetgroup();
                        await new Promise(resolve => setTimeout(resolve, 100));
                        await getGroups();
                    }
                } else {
                    if (e.username === 'None' && routeName.value !== 'unassign') {
                        const checkConvoUnassign = conversationDetail.value.participants.filter(
                            par => par.parti_type == 1,
                        );
                        if (cacheConvoRemove.value.id === convoId.value && checkConvoUnassign.length < 1) {
                            routerPush('InboxGroups', { name: 'unassign', conversation: convoId.value });
                            changeNumberGroup(cacheConvoRemove.value.group, 'unassign');
                            pushNumberGroup(cacheConvoRemove.value.groupPush);
                            resetCacheConvoRemove();
                        } else {
                            isSocketUpdateConvo.value = false;
                            resetCacheConvoRemove();
                            setAddonConvo(currConvo.value);
                            const currentGroup = router.currentRoute.value.params.name;
                            routerPush('InboxGroups', { name: 'unassign', conversation: convoId.value });
                            await unAssignUserToConversation(convoId.value, userIdAssign);
                            let isCheckConvoAssginToYou = true;
                            if (assignCurrentUser.length > 0 && assignCurrentUser[0]['parti_id'] != userId)
                                isCheckConvoAssginToYou = false;
                            const findIndex = conversations.value.findIndex(c => c.id === convoId.value);
                            if (isCheckConvoAssginToYou || (findIndex > -1 && !isCheckConvoAssginToYou && currentGroup !== 'all')) {
                                changeNumberGroup('assign_to_you', 'unassign');
                            }
                            if (conversationDetail.value.participants.length > 0) {
                                conversationDetail.value.participants = conversationDetail.value.participants.filter(
                                    par => par.parti_type != 1,
                                );
                            }
                        }
                    } else if (e.username === 'You' && routeName.value !== 'assign_to_you') {
                        isSocketUpdateConvo.value = false;
                        if (conversationDetail.value.participants.length > 0) {
                            if (assignCurrentUser.length < 1) {
                                conversationDetail.value.participants.push({ parti_type: 1, parti_id: userId });
                            } else {
                                conversationDetail.value.participants.forEach((p: any) => {
                                    if (p.parti_type === 1 && p.parti_id != userId) {
                                        p.parti_id = userId;
                                        // isSocketUpdateConvo.value = true;
                                    }
                                });
                                if (routeName.value === 'all') {
                                    pushNumberGroup('unassign');
                                }
                            }
                        }
                        resetCacheConvoRemove();
                        setAddonConvo(currConvo.value);
                        routerPush('InboxGroups', { name: 'assign_to_you', conversation: convoId.value });
                        await assignUserToConversation(convoId.value, userId);
                        changeNumberGroup('unassign', 'assign_to_you');
                    } else if (e.username === 'None' && routeName.value === 'unassign') {
                        if (assignCurrentUser.length > 0) {
                            resetCacheConvoRemove();
                            await unAssignUserToConversation(convoId.value, userIdAssign);
                            // isSocketUpdateConvo.value = false;
                        }
                    } else {
                        let userAssign = e.user_id;
                        if (e.username == 'You') userAssign = userId;
                        if (conversationDetail.value.participants.length > 0) {
                            conversationDetail.value.participants.forEach((p: any) => {
                                if (p.parti_type === 1) {
                                    p.parti_id = userAssign;
                                }
                            });
                        }
                        if (e.username !== 'None' && assignCurrentUser.length < 1) {
                            conversationDetail.value.participants.push({ parti_type: 1, parti_id: e.user_id });
                        }
                        await assignUserToConversation(convoId.value, e.user_id);
                        if (routeName.value == 'assign_to_you' && e.username == 'You') {
                            const checkConvoInList = conversations.value.filter(c => c.id === convoId.value);
                            if (checkConvoInList.length > 0 && cacheConvoRemove.value.id != convoId.value)
                                changeNumberGroup('assign_to_you', 'unassign');
                        }
                        // changeNumberGroup('unassign', 'assign_to_you');
                    }
                }
            } catch (e) {
                console.log({ e });
            }
        };

        const assignDefault = computed(() => {
            if (props.assign === 'assign_to_you') return 'You';
            else return 'None';
        });

        const checkConvoRemoved = computed(() => {
            if (router.currentRoute.value.name != 'InboxGroups') return false;
            return router.currentRoute.value.params.conversation === cacheConvoRemove.value.id;
        });

        const closeAlertConvoChanged = () => {
            showAlertChangedConvo.value = false;
        };

        const closeAlertCustomerOnlineStatus = () => {
            checkCustomerOnlineStatus.value = false;
        };

        const handleStatusCustomer = (data: any) => {
            checkCustomerOnlineStatus.value = data.showAlert;
            statusOnlineCustomer.value = data.status;
        };

        emitter.on('changeAssignValue', (data: any) => {
            changeValue(data);
        });

        socket.on('incomingConversation', (data: any) => {
            emitter.emit('blockInbox', data);
            if (data.convo_id == conversationDetail.value._id) {
                if (data.status < 0) {
                    isShowBlockInboxMessage.value = true;
                } else {
                    isShowBlockInboxMessage.value = false;
                }
            } else {
                isShowBlockInboxMessage.value = false;
            }
        });

        socket.on('incomingContactStatus', (data: any) => {
            if (data.convo_id == conversationDetail.value._id || contact.value._id === data.contact_id) {
                if (data.contact_status == 2) {
                    isShowBlockInboxMessage.value = true;
                    isShowArchiveMessage.value = false;
                } else if (data.contact_status == 4) {
                    isShowBlockInboxMessage.value = true;
                    isShowArchiveMessage.value = true;
                } else if (data.contact_status == 1) {
                    isShowBlockInboxMessage.value = false;
                }
                emitter.emit('changeStatusContact', data);
            } else {
                isShowBlockInboxMessage.value = false;
            }
        });

        watch(
            () => convoId,
            () => {
                isShowBlockInboxMessage.value = false;
                checkCustomerOnlineStatus.value = false;
            },
            { deep: true },
        );

        watch(
            () => conversationDetail.value,
            (oldVal, newVal) => {
                if (oldVal._id !== newVal._id) {
                    isShowBlockInboxMessage.value = false;
                    isShowArchiveMessage.value = false;
                    checkCustomerOnlineStatus.value = false;
                }
            },
            { deep: true },
        );

        return {
            skeleton,
            changeValue,
            changeSkeleton,
            assignDefault,
            convoId,
            isShowBlockInboxMessage,
            showIndicatorNewMessage,
            countNewMessage,
            readAllMessage,
            clickReadAll,
            changeAssignedFromComposer,
            handleStatusCustomer,
            checkConvoRemoved,
            closeAlertConvoChanged,
            showAlertChangedConvo,
            isShowArchiveMessage,
            isDragFile,
            dragenter,
            dragover,
            dragleave,
            drop,
            checkCustomerOnlineStatus,
            statusOnlineCustomer,
            closeAlertCustomerOnlineStatus,
            conversationDetail,
        };
    },
});
</script>
<style lang="scss" scoped>
.box-list-conversation {
    position: relative;
    &:after {
        content: '';
        background-image: url(../../images/background-message-box.png);
        opacity: 0.1;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        z-index: 0;
    }
}
.box-assign-message {
    text-align: right;
    position: relative;
    background-color: #fff;
    z-index: 2;
}
.box-message {
    position: relative;
    padding-right: 0;

    .indicator-new-message {
        font-weight: 500;
        border-radius: 16px;
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        line-height: 18px;
        z-index: 9;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 2px 10px rgba(0, 0, 0, 0.1);

        img {
            display: inline-block;
            margin-right: 9px;
            image-rendering: pixelated;
        }
    }

    .indicator-new-message:hover {
        cursor: pointer;
    }
}
.composer-block {
    width: -webkit-fill-available;
}
</style>
