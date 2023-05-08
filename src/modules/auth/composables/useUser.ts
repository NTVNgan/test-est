import { computed, ref } from 'vue';
import { store } from '@/store';
import { services } from '../services';
import { AxiosResponse } from 'axios';

const userList = ref<Array<any>>([]);
const emailSendingLimit = ref(0);

export const useUser = () => {
    const user = computed(() => store.state.auth.user);
    const getRootUser = async (): Promise<User> => {
        let res: null | AxiosResponse<Res<User>> = null;
        res = await services.getRootUser();
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

    const getUserList = async (): Promise<User[]> => {
        let res: null | AxiosResponse<Res<User[]>> = null;
        res = await services.getUsers();
        if (res) {
            const { data: resData } = res;
            const { error, data } = resData;
            if (!error && data) {
                userList.value = data;
                return Promise.resolve(userList.value);
            } else if (error) {
                return Promise.reject(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

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

    const updateUserByID = async (id: string, data: any): Promise<User> => {
        let res: null | AxiosResponse<Res<User>> = null;
        res = await services.updateUserByID(id, data);
        if (res) {
            const { data: resData } = res;
            const { error, data } = resData;
            if (!error && data) {
                return Promise.resolve(data);
            } else if (error) {
                console.log(resData);
                return Promise.reject(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const updateUser = async (data: any): Promise<User> => {
        let res: null | AxiosResponse<Res<User>> = null;
        res = await services.updateUser(data);
        if (res) {
            const { data: resData } = res;
            const { error, data } = resData;
            if (!error && data) {
                return Promise.resolve(data);
            } else if (error) {
                console.log(resData);
                return Promise.reject(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const deleteUserByID = async (id: string, data: any): Promise<User> => {
        let res: null | AxiosResponse<Res<User>> = null;
        res = await services.deleteUserByID(id, data);
        if (res) {
            const { data: resData } = res;
            const { error } = resData;
            if (!error) {
                return Promise.resolve(data);
            } else if (error) {
                throw resData.message;
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const signup = async (data: SignupForm): Promise<SignupResponse> => {
        let res: any | AxiosResponse<Res<SignupResponse>> = null;
        res = await services.signup(data);
        if (res) {
            const { data: resData } = res;
            const { error, data } = resData;
            if (!error && data) {
                return Promise.resolve(data);
            } else if (error && data){
                return Promise.resolve(data)
            } else if (error) {
                return Promise.reject(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const sendEmailActive = async (data: SendEmailActive): Promise<{ data: string }> => {
        let res: null | AxiosResponse<Res<{ data: string }>> = null;
        res = await services.sendEmailActiveAccount(data);
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
    const getWorkspaceInfo = async () => {
        if (typeof user.value.workspace_id != 'undefined') {
            const res: AxiosResponse = await services.getSettingWorkspace(user.value.workspace_id);
            if (res) {
                return Promise.resolve(res.data);
            }
            return Promise.reject("Shouldn't be reachable");
        }
    };

    return {
        getUserById,
        getUserList,
        user: computed(() => store.state.auth),
        updateUserByID,
        updateUser,
        signup,
        sendEmailActive,
        userList,
        deleteUserByID,
        getRootUser,
        getWorkspaceInfo,
        emailSendingLimit,
    };
};
