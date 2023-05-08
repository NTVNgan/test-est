import { services } from '@/modules/inbox/services';
import { AxiosResponse } from 'axios';
import CONSTANTS from '../constants/constants';
import { ref } from 'vue';

const skeleton = ref<boolean>(true);
const showSkeletonContact = ref<boolean>(true);
const groupNameHistory = ref('');
const showAlertChangedConvo = ref(false);

export const useInbox = () => {
    const errorRes = ref<boolean>(false);

    const getAssignUser = async (exclude: any): Promise<any> => {
        let res: null | AxiosResponse<Res<any>> = null;
        res = await services.getInboxUser(exclude);
        if (res) {
            const { data: resData } = res;
            const { error, data } = resData;
            if (!error && data) {
                errorRes.value = false;
                return Promise.resolve(data);
            } else if (error) {
                errorRes.value = true;
                return Promise.resolve(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const assignUserToConversation = async (convoId: string, assignedId: string): Promise<any> => {
        let res: null | AxiosResponse<Res<any>> = null;
        res = await services.assignUserToConversation(convoId, assignedId);
        if (res) {
            const { data: resData } = res;
            const { error, data } = resData;
            if (!error && data) {
                return Promise.resolve(data);
            } else if (error) {
                return Promise.reject(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const unAssignUserToConversation = async (convoId: string, assignedId: string): Promise<any> => {
        let res: null | AxiosResponse<Res<any>> = null;
        res = await services.unAssignUserToConversation(convoId, assignedId);
        if (res) {
            const { data: resData } = res;
            const { error, data } = resData;
            if (!error && data) {
                return Promise.resolve(data);
            } else if (error) {
                return Promise.reject(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const formatDataConversationList = async (data: Array<any>, currentUser: any) => {
        return data.filter(async m => {
            if (m.last_message == undefined || m.last_message == 'null') {
                m.last_message = {
                    content: '',
                    sender_id: '',
                    sender_type: '',
                    created_at: '',
                };
            }
            if (m.customer.online_status == undefined) m.customer.online_status = CONSTANTS.ONLINE_STATUS.OFFLINE;
            m.isSeen = m.read_users.length > 0 && m.read_users.includes(currentUser._id);
            m.last_message_send_by_me = false;
            if (m.last_message.sender_type == CONSTANTS.SENT_BY.USER) {
                m.isSeen = true;
                m.last_message_send_by_me = currentUser._id === m.last_message.sender_id;
            }
            return m;
        });
    };

    const getConversations = async (groupId: any, nextPage: any, currentUser: any) => {
        const response = {
            error: false,
            next_page: '',
            data: [],
        };
        try {
            if (nextPage == null || nextPage == 'null') nextPage = '';
            await services.getConversations(groupId, nextPage).then((res: any) => {
                const { data } = res;
                const { error } = data;
                response.error = error;
                response.data = data.data;
                response.next_page = data.next_page;
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            response.data = await formatDataConversationList(response.data, currentUser);
            return response;
        } catch (e) {
            return response;
        }
    };
    const getConversation = async (conversationId: string) => {
        const response: any = {
            error: false,
            next_page: '',
            data: null,
        };
        try {
            await services.getConversation(conversationId).then((res: any) => {
                const { data } = res;
                const { error } = data;
                response.error = error;
                response.data = data.data;
            });
            return response;
        } catch (e) {
            return response;
        }
    };

    const updateSkeletonConvoDetail = (data: any) => {
        skeleton.value = data;
    };

    const updateSkeletonContact = (data: any) => {
        showSkeletonContact.value = data;
    };

    return {
        getAssignUser,
        getConversations,
        getConversation,
        formatDataConversationList,
        assignUserToConversation,
        unAssignUserToConversation,
        skeleton,
        updateSkeletonConvoDetail,
        showSkeletonContact,
        updateSkeletonContact,
        groupNameHistory,
        errorRes,
        showAlertChangedConvo,
    };
};
