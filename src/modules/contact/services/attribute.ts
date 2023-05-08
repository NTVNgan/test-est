import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const cdpURL = urlFactory('cdp')

export default {
    getListAttribute(params: GetAttributeParams): AxiosPromise<Res<any>> {
        return axios({
            url: cdpURL + '/contacts/attributes/',
            method: 'get',
            params,
        });
    },
};
