import { services } from '../services';
import { AxiosResponse } from 'axios';
import { ref } from 'vue';

const org = ref<any>();

export const useOrg = () => {
    const loadingUpdateOrg = ref<boolean>(false);

    const getOrg = async (id: string): Promise<any> => {
        loadingUpdateOrg.value = true;

        const res: AxiosResponse = await services.getOrg(id);
        if (res) {
            const { data: resData } = res;
            const { error, data } = resData;
            loadingUpdateOrg.value = false;
            if (!error && data) {
                org.value = data;
                return Promise.resolve(data);
            } else if (error) {
                return Promise.reject(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };
    const updateOrg = async (data: OrgUpdateForm): Promise<User> => {
        loadingUpdateOrg.value = true;

        let res: null | AxiosResponse<Res<User>> = null;
        res = await services.updateOrg(data);
        if (res) {
            const { data: resData } = res;
            const { error, data } = resData;
            loadingUpdateOrg.value = false;
            if (!error && data) {
                org.value = data;
                return Promise.resolve(data);
            } else if (error) {
                return Promise.reject(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        org,
        getOrg,
        updateOrg,
        loadingUpdateOrg,
        // user: computed(() => store.state.auth)
    };
};
