import {axios, urlFactory} from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const authURL = urlFactory('auth');

export default {
    getOrg(id: string): AxiosPromise<any> {
        return axios({
            url: authURL+'/organizations/search/' + id,
            method: 'get',
        });
    },
    updateOrg(data: OrgUpdateForm): AxiosPromise<LoginResponse> {
        const { id, ...dataBody } = data;
        return axios({
            url: authURL+'/workspaces/init-name',
            method: 'put',
            data: dataBody,
        });
    },
};
