import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const authURL = urlFactory('auth');

export default {
    saveReceiving(id: string, data: any, mode: string | null): AxiosPromise<Res<any>> {
        return axios({
            url: authURL + `/workspaces/${id}/setting/email-incoming-ignore/${mode}`,
            method: 'put',
            data: data,
        });
    },
    saveSending(id: string, data: any): AxiosPromise<Res<any>> {
        return axios({
            url: authURL + `/workspaces/${id}/setting/`,
            method: 'put',
            data: data,
        });
    },
    getReceiving(id: string): AxiosPromise<Res<any>> {
        return axios({
            url: authURL + `/workspaces/${id}`,
            method: 'get',
        });
    },
};
