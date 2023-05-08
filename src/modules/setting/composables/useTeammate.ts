import { ref } from 'vue';
import { services } from '../services';
import { AxiosResponse } from 'axios';
import { useSocket } from '@/composables/useSocket';

export const useTeammate = () => {
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    const errorMessage = ref<string[] | Record<string, string> | string | null>(null);
    const teammates = ref<Teammate[] | null>(null)

    const getTeammatesByKeyword = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getTeammatesByKeyword(params);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                loading.value = false;
                error.value = resData.error;
                if (!params.q) teammates.value = resData.data
                return Promise.resolve(resData);
            } else {
                loading.value = false;
                error.value = resData.error;
                errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };
    const inviteTeammate = async (data: any): Promise<any> => {
        loading.value = true;
        return services.inviteTeammate(data).then((res: any) => {
            if (res) {
                const { data: resData } = res;
                if (!resData.error && resData.data) {
                    loading.value = false;
                    errorMessage.value = null;
                    error.value = resData.error;
                    return Promise.resolve(resData);
                } else {
                    loading.value = false;
                    error.value = resData.error;
                    errorMessage.value = resData.message;
                    return Promise.resolve(resData.message);
                }
            }
        }).catch((err: any) => {
            errorMessage.value = err.message;
            Promise.reject(err);
        });
    };

    const editEmailTeammate = async (data: any, id: string): Promise<any> => {
        loading.value = true;
        return services.editEmailTeammate(data, id).then((res: any) => {
            if (res) {
                const { data: resData } = res;
                if (!resData.error && resData.data) {
                    loading.value = false;
                    errorMessage.value = null;
                    error.value = resData.error;
                    return Promise.resolve(resData.data);
                } else {
                    loading.value = false;
                    error.value = resData.error;
                    errorMessage.value = resData.message;
                    return Promise.resolve(resData.message);
                }
            }
        }).catch((err: any) => {
            errorMessage.value = err.message;
            Promise.reject(err);
        });
    };

    const resendEmailTeammate = async (data: any): Promise<any> => {
        // loading.value = true;
        return services.resendEmailTeammate(data).then((res: any) => {
            if (res) {
                const { data: resData } = res;
                if (!resData.error) {
                    // loading.value = false;
                    // errorMessage.value = null;
                    // error.value = resData.error;
                    return Promise.resolve(resData);
                } else {
                    // loading.value = false;
                    // error.value = resData.error;
                    // errorMessage.value = resData.message;
                    return Promise.reject(resData.message);
                }
            }
        }).catch((err: any) => {
            errorMessage.value = err.message;
            throw err
            // Promise.reject(err);
        });
    };

    const getInviteTeammateList = async (): Promise<any> => {
        loading.value = true;
        return services.getInviteTeammateList().then((res: any) => {
            if (res) {
                const { data: resData } = res;
                if (!resData.error && resData.data) {
                    loading.value = false;
                    errorMessage.value = null;
                    error.value = resData.error;
                    return Promise.resolve(resData);
                } else {
                    loading.value = false;
                    error.value = resData.error;
                    errorMessage.value = resData.message;
                    return Promise.resolve(resData.message);
                }
            }
        }).catch((err: any) => {
            errorMessage.value = err.message;
            Promise.reject(err);
        });
    };

    return {
        loading,
        error,
        errorMessage,
        teammates,
        getTeammatesByKeyword,
        inviteTeammate,
        resendEmailTeammate,
        getInviteTeammateList,
        editEmailTeammate,
    }
}