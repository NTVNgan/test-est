import { ref, inject, computed } from 'vue';
import { useInbox } from '@/modules/inbox/composables/useInbox';
import { store } from '@/store';
import { router } from '@/router';
import { services } from '@/modules/inbox/services';

const conversations = ref<Array<any>>([]);
const skeletonListConversation = ref<boolean>(true);
const nextPageSearch = ref<string>('');
const noMessage = ref<boolean>(false);
const convoTyping = ref<Array<any>>([]);

export const useInboxGroupConversation = ({ props, emit }: any = null) => {
    const { getConversations, formatDataConversationList } = useInbox();
    const emitter: any = inject('emitter');
    const nextPage = ref<string>('');

    const user = computed(() => store.state.auth.user);

    const getConversationList = async (isPush: any, groupName: any) => {
        if (!isPush) nextPage.value = '';
        if (router.currentRoute.value.name === 'InboxSearch') return;
        const response = await getConversations(groupName, nextPage.value, user.value);
        if (groupName != router.currentRoute.value.params.name) return;
        if (!response.error) {
            if (isPush) conversations.value = [...conversations.value, ...response.data];
            else {
                conversations.value = response.data;
                if (conversations.value.length < 1) {
                    emitter.emit('checkNodataMessage', true);
                } else emitter.emit('checkNodataMessage', false);
            }
            nextPage.value = response.next_page;
        }
        // load not conversation in param => push conversation first data
        if (conversations.value.length > 0) {
            let conversation = router.currentRoute.value.params.conversation;
            if (!isPush) {
                const currentConversation = conversations.value.find(item => item.id === conversation);
                emitter.emit('changeConversation', currentConversation);
            }
            if (typeof conversation !== 'string' && conversation != undefined) conversation = conversation[0];
            // if (conversation == undefined || conversation == '' || props.countChange > 0) {
            if (conversation == undefined || conversation == '') {
                if (router.currentRoute.value.name != 'InboxGroups') return;
                router.replace({
                    name: 'InboxGroups',
                    params: { name: groupName, conversation: conversations.value[0]['id'] },
                });
                emitter.emit('changeConversation', conversations.value[0]);
            }
        }
    };

    const updateCustomerInListConvo = (customer: any) => {
        const foundIndex = conversations.value.findIndex(c => c.customer.id == customer._id);
        if (foundIndex > -1) {
            conversations.value[foundIndex]['customer']['avatar_bg'] = customer.avatar_bg;
            conversations.value[foundIndex]['customer']['avatar_src'] = customer.avatar_src;
            conversations.value[foundIndex]['customer']['full_name'] = customer.full_name;
        }
    };

    const updateStatusOnlineCustomer = (data: any) => {
        const foundIndex = conversations.value.findIndex(c => c.customer.id == data._id);
        if (foundIndex > -1) {
            conversations.value[foundIndex]['customer']['online_status'] = data.online_status;
        }
    };

    const updateSkeletonListConversation = (data: any) => {
        skeletonListConversation.value = data;
    };

    const searchConversation = async (
        param: any,
        nextPage: any,
        status: number | null = null,
        tags: string[] | null = null,
    ) => {
        const response = {
            error: false,
            next_page: '',
            data: [],
            total: 0,
        };
        try {
            if (nextPage == null || nextPage == 'null') nextPage = '';
            await services.searchConversation(param, nextPage, status, tags).then((res: any) => {
                const { data } = res;
                const { error } = data;
                response.error = error;
                response.data = data.data;
                response.next_page = data.next_page;
                if (data.total != null) response.total = data.total;
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            response.data = await formatDataConversationList(response.data, user.value);
            return response;
        } catch (e) {
            return response;
        }
    };

    const updateListConversation = (data: any, isPush: any) => {
        if (isPush) conversations.value = [...conversations.value, ...data];
        else conversations.value = data;
    };

    const updateStatusRead = async (convoId: string, action: string) => {
        try {
            let check = false;
            conversations.value.forEach(c => {
                if (c.id === convoId && ((c.isSeen && action === 'read') || (!c.isSeen && action === 'unread')))
                    check = true;
            });
            if (check) return;
            if (action === 'unread') {
                conversations.value.forEach(c => {
                    if (c.id === convoId && action === 'unread') c.isSeen = false;
                });
            } else {
                await services.updateReadStatusConversation(convoId, action).then((res: any) => {
                    conversations.value.forEach(c => {
                        if (c.id === convoId && action === 'read') c.isSeen = true;
                        if (c.id === convoId && action === 'unread') c.isSeen = false;
                    });
                });
            }
        } catch (e) {
            console.log({ e });
            return e;
        }
    };

    return {
        conversations,
        getConversationList,
        nextPage,
        updateCustomerInListConvo,
        updateStatusOnlineCustomer,
        skeletonListConversation,
        updateSkeletonListConversation,
        searchConversation,
        updateListConversation,
        nextPageSearch,
        updateStatusRead,
        noMessage,
        convoTyping,
    };
};
