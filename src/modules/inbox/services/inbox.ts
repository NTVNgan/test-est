import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const authURL = urlFactory('auth');
const cdpURL = urlFactory('cdp');
const chatURL = urlFactory('chat');

export default {
    getInboxGroups(): AxiosPromise<Res<Groups>> {
        return axios({
            url: chatURL + '/conversations/count',
            method: 'get',
        });
    },
    getInboxUser(exclude: any): AxiosPromise<Res<any>> {
        return axios({
            url: authURL + '/users/',
            method: 'get',
            params: {
                exclude: exclude,
            },
        });
    },
    getConversations(groupId: any, nextPage: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/conversations/es-search?group=' + groupId + '&next_page=' + nextPage,
            method: 'get',
        });
    },
    getConversation(contactId: string): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/conversations/${contactId}`,
            method: 'get',
        });
    },
    getConversationDetail(convoId: any, nextPage: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/conversations/' + convoId + '/messages?next_page=' + nextPage,
            method: 'get',
        });
    },
    assignUserToConversation(convoId: string, assignedId: string): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/conversations/assign',
            method: 'post',
            data: {
                conversation_id: convoId,
                assigned_id: assignedId,
            },
        });
    },
    unAssignUserToConversation(convoId: string, assignedId: string): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/conversations/unassign',
            method: 'post',
            data: {
                conversation_id: convoId,
                user_id: assignedId,
            },
        });
    },
    searchConversation(param: any, nextPage: any, status: any = null, tags: any = null): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/conversations/es-search',
            method: 'get',
            params: {
                q: param,
                next_page: nextPage,
                status,
                tags
            }
        });
    },
    updateReadStatusConversation(convoId: string, action: string): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/conversations/' + convoId + '/' + action,
            method: 'put',
        });
    },
    getImagesByConvo({ convoId, activeId, nextPage = null, prevPage = null }: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/conversations/' + convoId + '/media',
            method: 'get',
            params: {
                type: 2,
                active_id: activeId,
                next_page: nextPage,
                prev_page: prevPage,
            },
        });
    },
    uploadFile(data: any, headers: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/utils/upload',
            method: 'post',
            data,
            headers: headers,
        });
    },
    cloneFile(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/utils/upload?is_clone=1',
            method: 'post',
            data,
        });
    },
    deleteMessage(messageId: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/messages/' + messageId,
            method: 'delete',
        });
    },
    handleTagOfMessage(data: any, messageId: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/messages/' + messageId + '/tags',
            method: 'put',
            data: data,
        });
    },
    downloadFile(url: any): AxiosPromise<Res<any>> {
        return axios({
            url: url,
            method: 'get',
            responseType: 'blob',
        });
    },
    getMessageDetail(id: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/messages/' + id,
            method: 'get',
        });
    },
    updateStatusConversation(data: any, conversationId: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/conversations/change-status/' + conversationId,
            method: 'put',
            data: data,
        });
    },
};
