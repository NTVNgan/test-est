import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const cdpURL = urlFactory('cdp');

export default {
    getContactAttribute(params: any): AxiosPromise<Res<Attribute>> {
        return axios({
            url: cdpURL + `/contacts/attributes/es-search`,
            method: 'get',
            params,
        });
    },
    editContactAttribute(id: string, data: any): AxiosPromise<Res<Attribute>> {
        return axios({
            url: cdpURL + `/contacts/attributes/${id}`,
            method: 'put',
            data: data,
        });
    },
    getSegmentByIdAttribute(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: cdpURL + `/segments/simple`,
            method: 'post',
            data,
        });
    },
    changeAttribute(data: any): AxiosPromise<Res<Attribute>> {
        return axios({
            url: cdpURL + `/contacts/attributes/show-hide`,
            method: 'post',
            data,
        });
    },
    checkAttributeAvailable(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: cdpURL + `/contacts/attributes/check-variant`,
            method: 'post',
            data,
        });
    },
};
