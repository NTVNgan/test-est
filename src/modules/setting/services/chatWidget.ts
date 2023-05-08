import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const authURL = urlFactory('auth');

export default {
    getTimezone(params: any): AxiosPromise<Res<any>> {
        return axios({
            url: authURL + `/time-zone/search`,
            method: 'get',
            params,
        });
    },
    getWidgetSetting(): AxiosPromise<Res<any>> {
        return axios({
            url: authURL + `/widget-settings`,
            method: 'get',
        });
    },
    updateWidgetSetting(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: authURL + `/widget-settings`,
            method: 'put',
            data,
        });
    },
};
