import { ref } from 'vue';
import { services } from '@/modules/profile/services';
import { AxiosResponse } from 'axios';

export const useProfile = () => {
    const errorMessage = ref<Array<string> | null>(null);
    const loading = ref<boolean>(false);

    const updatePassword = async (data: ChangePasswordForm) => {
        loading.value = true;
        const response = {
            error: false,
            message: {},
        };
        try {
            await services.changePassword(data).then((res: AxiosResponse) => {
                const { data } = res;
                const { error, message } = data;
                response.error = error;
                response.message = message;
            });
            loading.value = false;
            return response;
        } catch (e) {
            errorMessage.value = e;
            loading.value = false;
            return response;
        }
    };

    const updateAvatarByID = async (id: string, avatar: object): Promise<User> => {
        loading.value = true;
        let res: null | AxiosResponse<Res<User>> = null;
        res = await services.updateAvatarByID(id, avatar);
        if (res) {
            const { data: resData } = res;
            const { error, data } = resData;
            if (!error && data) {
                return Promise.resolve(data);
            } else if (error) {
                return Promise.reject(resData.message);
            }
            loading.value = false;
        } else {
            loading.value = false;
        }
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        loading,
        updatePassword,
        errorMessage,
        updateAvatarByID,
    };
};
