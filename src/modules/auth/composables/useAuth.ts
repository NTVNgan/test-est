import { ref } from 'vue';
import { store } from '@/store';
import { services } from '../services';

const featureRoles = ref<any>(null);

export const useAuth = () => {
    const error = ref<Record<string, string> | null>(null);
    const loading = ref<boolean>(false);
    const data = ref<object>({});

    const login = async (data: LoginForm) => {
        loading.value = true;
        try {
            await store.dispatch('auth/login', data);
            loading.value = false;
        } catch (e) {
            error.value = e;
            loading.value = false;
        }
    };
    const logout = async () => {
        loading.value = true;
        try {
            await store.dispatch('auth/logout');
            loading.value = false;
        } catch (e) {
            error.value = e;
            loading.value = false;
        }
    };
    const forgotPassword = async (data: ForgotPassword) => {
        loading.value = true;
        try {
            await store.dispatch('auth/forgotPassword', data);
            loading.value = false;
            error.value = null;
        } catch (e) {
            error.value = e;
            loading.value = false;
        }
    };
    const verifyLinkSetNewPass = async (urlParams: string) => {
        loading.value = true;
        try {
            await store.dispatch('auth/verifyLinkSetNewPass', urlParams);
            loading.value = false;
            error.value = null;
        } catch (e) {
            error.value = e;
            loading.value = false;
        }
    };
    const resetNewPass = async (data: ResetNewPass) => {
        loading.value = true;
        try {
            await store.dispatch('auth/resetNewPass', data);
            loading.value = false;
            error.value = null;
        } catch (e) {
            error.value = e;
            loading.value = false;
        }
    };
    const cretePassTeamate = async (data: CreatePassForm) => {
        loading.value = true;
        try {
            await store.dispatch('auth/createPassTeamate', data);
            loading.value = false;
            error.value = null;
        } catch (e) {
            error.value = e;
            loading.value = false;
        }
    };
    const getFeatureRoles = async () => {
        loading.value = true;
        let res: any = null;
        res = await services.getFeatureRoles();
        if (res) {
            const { data: resData }: any = res;
            const { error, data } = resData;
            if (!error && data) {
                featureRoles.value = data;
                return Promise.resolve(data);
            } else if (error) {
                throw resData.message
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        loading,
        login,
        logout,
        forgotPassword,
        verifyLinkSetNewPass,
        resetNewPass,
        error,
        data,
        cretePassTeamate,
        getFeatureRoles,
        featureRoles
    };
};
