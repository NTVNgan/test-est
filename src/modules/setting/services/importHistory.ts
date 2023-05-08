import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const cdpURL = urlFactory('cdp');

export default {
    getImportHistory(params: any): AxiosPromise<Res<Teammate>> {
        return axios({
            url: cdpURL + `/import-data`,
            method: 'get',
            params,
        });
    },
    getErrorDetail(params: any): AxiosPromise<Res<Teammate>> {
        return axios({
            url: cdpURL + `/import-error`,
            method: 'get',
            params,
        });
    },
    getErrorCount(params: any): AxiosPromise<Res<Teammate>> {
        return axios({
            url: cdpURL + `/import-error/count-error`,
            method: 'get',
            params,
        });
    },
};
