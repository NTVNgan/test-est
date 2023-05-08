import { default as instance } from 'axios';
import storage from '@/utils/storage';
import { router } from '@/router';
export type url_types = "auth" | "cdp" | "chat"
import { store } from '@/store';
import { services } from '@/modules/auth/services';
import jwt from 'jsonwebtoken';
import { ref } from 'vue';

function handleHttpError(status: number, data: any) {
    // function handleHttpError(status, data) {
    if (status) {
        switch (status) {
            case 404:
                router.push({ name: 'Error404' });
                break;
            case 500:
                router.push({ name: 'Error500' });
                break;
            case 400:
                console.log('error Bad Request 400');
                break;
            case 401:
                store.commit('auth/LOGOUT');
                console.log('error Unauthorized 401');
                break;
            case 403:
                console.log('error Forbidden 403');
                break;
        }
    }
}

const AxiosConfig = {
    baseURL: process.env.VUE_APP_ROOT_API,
    timeout: 60 * 1000,
    validateStatus: function (status: number) {
        return status >= 200 && status <= 500;
    },
};

const showPopupOutSession = ref(false);

const axios = instance.create(AxiosConfig);
axios.interceptors.request.use(function (config) {
    //Optimize
    const user: { token: string } | null = storage.get('user');
    if (user) {
        const decode: any = jwt.decode(user.token);
        const id_store = store.state.auth.user && store.state.auth.user._id;
        const id_token = decode ? decode.data._id : '';
        if (id_store === id_token || store.state.auth.user === null) {
            showPopupOutSession.value = false;
            config.headers['accesstoken'] = `Bearer ${user.token}`;
            return config;
        }
        if (id_store !== id_token && store.state.auth.user !== null) {
            showPopupOutSession.value = true;
            return Promise.reject('error');
        }
    }
    return config;
});

axios.interceptors.response.use(
    async function (res) {
        const { status, data, config } = res;
        const { message, error } = data;
        if (error && (Object.prototype.hasOwnProperty.call(message, 'expired_token'))) {
            await services.refreshToken().then(async (res: any) => {
                const { data } = res;
                const { error, data: refreshTokenData } = data;
                if (!error) {
                    const token = refreshTokenData.access_token;
                    config.headers['accesstoken'] = `Bearer ${token}`;
                    storage.set('user', { token });
                    const decode: any = jwt.decode(token);
                    // const userData = {
                    //     token,
                    // };
                    await store.commit('auth/UPDATE_USER_AUTH', decode.data, { root: true });
                    return axios(config)
                } else {
                    store.commit('auth/LOGOUT');
                }
            })
        }
        if (error && (Object.prototype.hasOwnProperty.call(message, 'token_is_required'))) {
            store.commit('auth/LOGOUT');
        }
        handleHttpError(status, data);

        return res;
    },
    function (error) {
        return Promise.reject(error);
    },
);

const urlFactory = (type: url_types) => {
    return `${type}${process.env.VUE_APP_API_VER}`
}

export {
    axios,
    urlFactory,
    showPopupOutSession
}

