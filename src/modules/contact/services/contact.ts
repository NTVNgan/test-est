import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const cdpURL = urlFactory('cdp');
const chatURL = urlFactory('chat');
const authURL = urlFactory('auth');

export default {
    getContactInfo(id: string): AxiosPromise<Res<Contact>> {
        return axios({
            url: cdpURL + `/contacts/${id}`,
            method: 'get',
        });
    },
    updateContactInfo(contact: Contact): AxiosPromise<Res<Contact>> {
        return axios({
            url: cdpURL + `/contacts/${contact._id}`,
            method: 'put',
            data: contact,
        });
    },
    blockContactDetail(id: Contact['_id'], status: Contact['status']): AxiosPromise<Res<Contact>> {
        return axios({
            url: cdpURL + `/contacts/${id}`,
            method: 'put',
            data: {
                status: status,
            },
        });
    },
    createContact(contact: any): AxiosPromise<Res<Contact>> {
        return axios({
            url: cdpURL + '/contacts/',
            method: 'post',
            data: contact,
        });
    },
    getRecentPage(
        type: RecentPage['type'],
        contact_id: RecentPage['contact_id'],
        limit: number,
    ): AxiosPromise<Res<Groups>> {
        return axios({
            url: cdpURL + '/contact-activities/',
            method: 'get',
            params: {
                type: type,
                contact_id: contact_id,
                limit: limit,
            },
        });
    },
    getListAttribute(params: any): AxiosPromise<Res<any>> {
        return axios({
            url: cdpURL + '/contacts/attributes/',
            method: 'get',
            params,
        });
    },
    getContactsBySegments({ id, next_page, per_page, sort_by }: any): AxiosPromise<Res<Contact>> {
        return axios({
            url: cdpURL + `/segments/${id}/contacts`,
            method: 'get',
            params: {
                next_page,
                per_page,
                sort_by,
            },
        });
    },
    getContactsByKeyword(params: any): AxiosPromise<Res<Contact>> {
        return axios({
            url: cdpURL + `/contacts/es-search`,
            method: 'get',
            params,
        });
    },
    getContactsByConditions(data: any): AxiosPromise<Res<Contact>> {
        return axios({
            url: cdpURL + `/contacts/es-search`,
            method: 'post',
            data,
        });
    },
    getConversationsByContact(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/conversations`,
            method: 'post',
            data,
        });
    },
    getContactsSetting(): any {
        return axios({
            url: authURL + `/users/setting-contact`,
            method: 'get',
        });
    },
    updateContactsSetting(data: any): any {
        return axios({
            url: authURL + `/users/setting-contact`,
            method: 'put',
            data,
        });
    },
    updateContactsToArchive(data: any): any {
        return axios({
            url: cdpURL + `/contacts/update-status-to-archive-by-ids`,
            method: 'put',
            data,
        });
    },
    updateContactsToArchiveByFilter(data: any): any {
        return axios({
            url: cdpURL + `/contacts/update-status-to-archive-by-filter`,
            method: 'put',
            data,
        });
    },
    archiveContactDetail(data: any): any {
        return axios({
            url: cdpURL + `/contacts/update-status-to-archive-by-id`,
            method: 'put',
            data,
        });
    },
    uploadContact(data: any): any {
        return axios({
            url: cdpURL + `/import-data/contact/get-header-file`,
            method: 'post',
            data,
        });
    },
    importContact(data: any): any {
        return axios({
            url: cdpURL + `/import-data/contact`,
            method: 'post',
            data,
        });
    },
};
