import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const authURL = urlFactory('auth')

export default {
    login(data: LoginForm): AxiosPromise<any> {
        return axios({
            url: authURL + '/authentication/login',
            method: 'post',
            data,
        });
    },
    logout() {
        return axios({
            url: authURL + '/authentication/logout',
            method: 'post',
        });
    },
    refreshToken() {
        return axios({
            url: authURL + '/authentication/refresh-token',
            method: 'post',
        });
    },
    forgotPassword(data: ForgotPassword): AxiosPromise {
        return axios({
            url: authURL + '/users/password/reset',
            method: 'post',
            data,
        });
    },
    verifyLinkSetNewPass(urlParams: string): AxiosPromise {
        return axios({
            url: authURL + `/users/password/reset?${urlParams}`,
            method: 'get',
        });
    },
    resetNewPass(data: ResetNewPass): AxiosPromise {
        return axios({
            url: authURL + `/users/password/reset?${data.urlParams}`,
            method: 'put',
            data: {
                password: data.password,
            },
        });
    },
    signup(data: SignupForm): AxiosPromise<SignupResponse> {
        return axios({
            url: authURL + '/users/sign-up',
            method: 'post',
            data,
        });
    },
    sendEmailActiveAccount(data: SendEmailActive): AxiosPromise {
        return axios({
            url: authURL + '/users/send-mail-active-account',
            method: 'post',
            data,
        });
    },
    createPassTeamate(data: CreatePassForm): AxiosPromise {
        return axios({
            url: authURL + '/users/create-password',
            method: 'post',
            data,
        })
    },
    getFeatureRoles(): AxiosPromise {
        return axios({
            url: authURL + `/roles/list-feature`,
            method: 'get',
        });
    },

};
