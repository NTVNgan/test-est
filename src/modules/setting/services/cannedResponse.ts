import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const chatURL = urlFactory('chat');

export default {
    getCategoryBySearch(params: any): AxiosPromise {
        return axios({
            url: chatURL + `/canres-categories/es-search`,
            method: 'get',
            params,
        });
    },
    getCannedResponseEs(params: any): AxiosPromise {
        return axios({
            url: chatURL + `/canres/list-es`,
            method: 'get',
            params,
        });
    },
    getCannedResponseById(id: any): AxiosPromise {
        return axios({
            url: chatURL + `/canres/${id}`,
            method: 'get',
        });
    },
    updateCannedResponseById({ id, ...data }: any): AxiosPromise {
        return axios({
            url: chatURL + `/canres/${id}`,
            method: 'put',
            data,
        });
    },
    createCannedRes(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + '/canres',
            method: 'post',
            data,
        });
    },
    changeCategoryCannedResponse(data: any): AxiosPromise {
        return axios({
            url: chatURL + `/canres/change-category`,
            method: 'post',
            data: data,
        });
    },
    deleteMultipleCannedResponse(data: any): AxiosPromise {
        return axios({
            url: chatURL + `/canres/delete`,
            method: 'post',
            data: data,
        });
    },
};
