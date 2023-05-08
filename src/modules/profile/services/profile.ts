import {axios, urlFactory} from '@/plugins/axios';
import { AxiosPromise } from 'axios';
const authURL = urlFactory('auth')

export default {
    changePassword(data: ChangePasswordForm): AxiosPromise<Res<ChangePasswordResponse>> {
        return axios({
            url: authURL+'/users/password/change',
            method: 'post',
            data,
        });
    },
    updateAvatarByID(id: string, avatar: object): AxiosPromise<Res<User>>{
        return axios({
            url: authURL+'/users/avatar/'+ id,
            method: 'put',
            data: avatar,
        });
    },
};
