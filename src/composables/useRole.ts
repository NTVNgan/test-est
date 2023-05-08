import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise, AxiosResponse } from 'axios';
import { computed, ref } from 'vue';

const authURL = urlFactory('auth');

const roles = ref<any>()

export const useRole = () => {
    const error = ref<boolean>(false);
    const errorMessage = ref<string[] | Record<string, string> | null>(null);
    const loading = ref<boolean>(false);

    const getRoleAPI = (): AxiosPromise<Res<any>> => {
        return axios({
            url: authURL + '/roles/search?simple=1',
            method: 'get',
        });
    };

    const getRole = async () => {
        loading.value = true;
        const res: AxiosResponse = await getRoleAPI();
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                roles.value = resData.data.data;
                loading.value = false;
                return resData.error;
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                roles.value = null;
                return resData.error;
            }
        }
    };


    return {
        roles,
        loading,
        error,
        errorMessage,
        getRole,
    };
}