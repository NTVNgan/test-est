import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const authURL = urlFactory('auth')

export default {
    getTeammatesByKeyword(params: any): AxiosPromise<Res<Teammate>> {
        return axios({
            url: authURL + `/users/es-search`,
            method: 'get',
            params
        });
    },
    inviteTeammate(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: authURL + '/users/invite',
            method: 'post',
            data
        });
    },
    editEmailTeammate(data: any, id: string): AxiosPromise<Res<any>> {
        return axios({
            url: authURL + '/users/invite/' + id,
            method: 'put',
            data
        });
    },
    resendEmailTeammate(id: string): AxiosPromise<Res<any>> {
        return axios({
            url: authURL + '/users/invite/' + id,
            method: 'post',
        });
    },
    getInviteTeammateList() {
        return axios({
            url: authURL + '/tokens/invite-not-use',
            method: 'get',
        });
    }
};
