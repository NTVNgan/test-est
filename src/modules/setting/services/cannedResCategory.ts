import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const authURL = urlFactory('auth');
const cdpURL = urlFactory('cdp');
const chatURL = urlFactory('chat');

export default {
    getCannedResCategories(): AxiosPromise<Res<Groups>> {
        return axios({
            url: chatURL + '/conversations/count',
            method: 'get',
        });
    },
    createCannedResCategory(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/canres-categories',
            method: 'post',
            data,
        });
    },
    updateCannedResponseCateById(data: any, id: string): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/canres-categories/${id}`,
            method: 'put',
            data,
        });
    },
    deleteCannedResponseCategory(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/canres-categories/`,
            method: 'delete',
            data,
        });
    },
    getCategoryById(id: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/canres-categories/${id}`,
            method: 'get',
        });
    },
};
