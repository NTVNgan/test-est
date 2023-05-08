import { ref } from 'vue';
import { services } from '../services';
import { AxiosResponse } from 'axios';

export const useChatWidget = () => {
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    const errorMessage = ref<string[] | Record<string, string> | string | null>(null);

    const getTimezone = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getTimezone(params);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                return Promise.resolve(resData.data);
            } else {
                throw resData.message;
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const getWidgetSetting = async (): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getWidgetSetting();
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                console.log('resData', resData.data);
                return Promise.resolve(resData.data);
            } else {
                console.log('message ', resData.message);
                throw resData.message;
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const updateWidgetSetting = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.updateWidgetSetting(data);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                return Promise.resolve(resData.data);
            } else {
                console.log('message ', resData.message);
                throw resData.message;
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        loading,
        error,
        errorMessage,
        getTimezone,
        getWidgetSetting,
        updateWidgetSetting,
    }
}