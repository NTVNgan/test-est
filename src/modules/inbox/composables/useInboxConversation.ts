import { services } from '@/modules/inbox/services';
import { AxiosResponse } from 'axios';
import CONSTANTS from '@/modules/inbox/constants/constants';
import { routerPush } from '@/router';
import { computed, inject } from 'vue';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';
import { useInboxPushingHandler } from '@/modules/inbox/composables/useInboxPushingHandler';
import { useInboxGroupConversation } from '@/modules/inbox/composables/useInboxGroupConversations';
import { useInboxGroup } from '@/modules/inbox/composables/useInboxGroup';

export const useInboxConversation = () => {
    const emitter: any = inject('emitter');

    const { conversations } = useInboxGroupConversation({});
    const {
        setAddonConvoHandleReOpen,
        resetCacheConvoRemove,
        resetCacheConvoResolveAndReopen,
        cacheConvoResolveAndReopen,
    } = useInboxPushingHandler();
    const { conversationDetail } = useInboxConversationDetail();
    const { getGroups } = useInboxGroup();
    const currConversation = computed(() => conversations.value.find(u => u.id === conversationDetail.value._id));

    const updateStatusConversation = async (data: any, id: any): Promise<any> => {
        const res: AxiosResponse = await services.updateStatusConversation(data, id);
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const handlePushRouterAfterChangeStatusConvo = async (conversation: any) => {
        resetCacheConvoRemove();
        if (currConversation.value) {
            currConversation.value.status = CONSTANTS.CONVERSATION_STATUS.ACTIVATED;
            currConversation.value.id = currConversation.value._id;
        }
        setAddonConvoHandleReOpen(currConversation.value);
        await routerPush('InboxGroups', { name: 'all', conversation: conversation._id });
        emitter.emit('changeGroupName', 'all');
        resetCacheConvoResolveAndReopen();
    };

    const handleConvoActivePageInboxSearch = (indexRemove: any, caseConvo = false) => {
        const findIndexCurrentConvo = conversations.value.findIndex(c => c.id === conversationDetail.value._id);
        if (findIndexCurrentConvo > indexRemove || (caseConvo && findIndexCurrentConvo === indexRemove)) {
            emitter.emit('handleMenuActive', -1);
        }
    };

    const handleIncomingConverPageInboxSearch = async (data: any) => {
        if (
            data.last_message &&
            data.last_message.sent_by === CONSTANTS.SENT_BY.CUSTOMER &&
            conversationDetail.value.status === CONSTANTS.CONVERSATION_STATUS.RESOLVED
        ) {
            if (data.id === conversationDetail.value._id) {
                conversationDetail.value.status = CONSTANTS.CONVERSATION_STATUS.ACTIVATED;
                await handlePushRouterAfterChangeStatusConvo(conversationDetail.value);
                await new Promise(resolve => setTimeout(resolve, 100));
                await getGroups();
            } else {
                const findIndex = conversations.value.findIndex(c => c.id === data.id);
                if (findIndex > -1) {
                    conversations.value.splice(findIndex, 1);
                    handleConvoActivePageInboxSearch(findIndex);
                }
            }
        }
    };

    const updateConversations = (data: any) => {
        const findIndex = conversations.value.findIndex(c => c.id === data.id);
        if (findIndex > -1) {
            conversations.value[findIndex]['participants'] = data.participants;
        }
    };

    const checkNewMessageSendByCustomerAndConvoResolve = (inComingConvo: any) => {
        if (cacheConvoResolveAndReopen.value.length > 0) {
            const findIndex = cacheConvoResolveAndReopen.value.findIndex(
                (convo: any) => convo.convo_id === inComingConvo.convo_id,
            );
            if (findIndex > -1) {
                const findIndexConvo = conversations.value.findIndex(
                    (convo: any) => convo._id === inComingConvo.convo_id,
                );
                if (findIndexConvo > -1) {
                    conversations.value[findIndexConvo].status = CONSTANTS.CONVERSATION_STATUS.ACTIVATED;
                }
                if (conversationDetail.value._id === inComingConvo.convo_id)
                    conversationDetail.value.status = CONSTANTS.CONVERSATION_STATUS.ACTIVATED;
                cacheConvoResolveAndReopen.value.splice(findIndex, 1);
            }
        }
    };

    return {
        updateStatusConversation,
        handlePushRouterAfterChangeStatusConvo,
        handleIncomingConverPageInboxSearch,
        handleConvoActivePageInboxSearch,
        updateConversations,
        checkNewMessageSendByCustomerAndConvoResolve,
    };
};
