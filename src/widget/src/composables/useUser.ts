import { services } from '@/services';
import { AxiosResponse } from 'axios';
export const useUser = () => {
    const getUserById = async (id: string): Promise<User> => {
        let res: null | AxiosResponse<Res<User>> = null;
        res = await services.getUserByID(id);
        if (res) {
            const { data: resData } = res;
            const { error, data } = resData;
            if (!error && data) {
                return Promise.resolve(data);
            } else if (error) {
                return Promise.reject(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    return { getUserById };
};
