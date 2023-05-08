import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';
const authURL = urlFactory('auth');

export default {
    search(workspace_id: string): AxiosPromise<Res<SearchResponse>> {
        return axios({
            url: authURL + '/workspaces/search/' + workspace_id,
            method: 'get',
        });
    },
    update(workspace_id: string, dataBody: object): AxiosPromise<Res<SearchResponse>> {
        return axios({
            url: authURL + '/workspaces/update/' + workspace_id,
            method: 'put',
            data: dataBody,
        });
    },
};
