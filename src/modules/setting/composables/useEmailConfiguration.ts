import { ref } from 'vue';
import { services } from '../services';
import { AxiosResponse } from 'axios';

export const useEmailConfig = () => {
    const loading = ref<boolean>(false);
    const dataEmail = ref<any>(null);
    // const error = ref<boolean>(false);
    // const errorMessage = ref<string[] | Record<string, string> | null>(null);

    const saveReceiving = async (id: string, data: any, mode: string | null): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.saveReceiving(id, data, mode);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                dataEmail.value = resData.data;
                return Promise.resolve(resData.data);
            } else {
                console.log('message ', resData.message);
                throw resData.message;
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const saveSending = async (id: string, data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.saveSending(id, data);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                dataEmail.value = resData.data;
                return Promise.resolve(resData.data);
            } else {
                console.log('message ', resData.message);
                throw resData.message;
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const getReceiving = async (id: string): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getReceiving(id);
        if (res) {
            const { data: resData } = res;
            if (resData) {
                return Promise.resolve(resData);
            } else {
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        saveReceiving,
        getReceiving,
        saveSending,
        dataEmail,
    };
};
