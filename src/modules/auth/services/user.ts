import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';
const authURL = urlFactory('auth')

export default {
    getRootUser(): AxiosPromise<Res<User>> {
        return axios({
            url: authURL + '/users/search/me',
            method: 'get',
        });
    },
    getUsers(): AxiosPromise<Res<User[]>> {
        return axios({
            url: authURL + '/users/',
            method: 'get',
        });
    },
    getUserByID(id: string): AxiosPromise<Res<User>> {
        return axios({
            url: authURL + '/users/search/' + id,
            method: 'get',
        });
    },
    updateUserByID(id: string, data: any): AxiosPromise<Res<User>> {
        return axios({
            url: authURL + '/users/' + id,
            method: 'put',
            data: data,
        });
    },
    updateUser(data: any): AxiosPromise<Res<User>> {
        return axios({
            url: authURL + '/users/me',
            method: 'put',
            data: data,
        });
    },
    deleteUserByID(id: string, data: any): AxiosPromise<Res<User>> {
        return axios({
            url: authURL + '/users/' + id,
            method: 'delete',
            data: data,
        });
    },
    activeAccount(data: { user_id: string; hash: string }) {
        return axios({
            url: authURL + '/users/active-account',
            method: 'post',
            params: data
        });
    },
    activeInvateMail(data: {user_id: string; hash: string}){
        return axios({
            url: authURL + '/users/invite/check',
            method: 'get',
            params: data
        });
    },
    getSettingWorkspace(workspace_id: any) {
        return axios({
            url: authURL + '/workspaces/' + workspace_id,
            method: 'get',
        });
    }
};
