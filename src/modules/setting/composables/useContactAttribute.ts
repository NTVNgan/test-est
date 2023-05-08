import { ref } from 'vue';
import { services } from '../services';
import { AxiosResponse } from 'axios';

export const useAttribute = () => {
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    const errorMessage = ref<string[] | Record<string, string> | null>(null);
    const attribute = ref<Attribute[] | null>(null);

    const getContactAttributeByKeyWord = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getContactAttribute(params);
        if (res) {
            const { data: resData } = res;
            if (resData) {
                loading.value = false;
                // error.value = resData.error;
                if (!params.q) attribute.value = resData;
                return Promise.resolve(resData);
            } else {
                loading.value = false;
                // error.value = resData.error;
                // errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const editContactAttribute = async (id: string, data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.editContactAttribute(id, data);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                return Promise.resolve(resData.data);
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const getSegmentByIdAttribute = async (data: any): Promise<any> => {
        const res: AxiosResponse = await services.getSegmentByIdAttribute(data);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                return Promise.resolve(resData.data);
            } else {
                loading.value = false;
                error.value = resData.error;
                errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const changeAttribute = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.changeAttribute(params);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                return Promise.resolve(resData.data);
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const checkAttributeAvailable = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.checkAttributeAvailable(params);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                return Promise.resolve(resData.data);
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        loading,
        error,
        errorMessage,
        attribute,
        getContactAttributeByKeyWord,
        editContactAttribute,
        getSegmentByIdAttribute,
        changeAttribute,
        checkAttributeAvailable,
    };
};
