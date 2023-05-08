import { ref } from 'vue';
import { services } from '../services';
import { AxiosResponse } from 'axios';
import { useUser } from '@/modules/auth/composables/useUser';
import CONSTANTS from '@/modules/inbox/constants/constants';
import filters from '@/utils/filters';

export const useImportHistory = () => {
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    const errorMessage = ref<string[] | Record<string, string> | string | null>(null);
    const importHistories = ref<Teammate[] | null>(null);
    const { userList, getUserById } = useUser();

    const findUserById = async (userId: any) => {
        try {
            if (userId == null) return '';
            const user = await userList.value.filter(u => u._id == userId);
            if (user.length > 0) {
                return user[0];
            } else {
                const userData = await getUserById(userId);
                if (userData == undefined) return '';
                userList.value.push(userData);
                return userData;
            }
        } catch (e) {
            return {
                avatar_bg: 'rgb(123, 97, 255)',
                avatar_src: 'no-user.png',
                created_at: '',
                email: '',
                first_name: '',
                full_name: '',
                last_name: 'null',
                username: userId,
                user_removed: true,
            };
        }
    };

    const updateDataListWidthUserInfo = async (data: any): Promise<any> => {
        for (const m of data) {
            m.avatar_src = '';
            m.avatar_bg = '';
            const user = await findUserById(m._auid);
            m.full_name = user.username;
            if (user.avatar_src !== '' && user.avatar_src !== null)
                m.avatar_src = `${process.env.VUE_APP_FILE_URL}/${user.avatar_src}`;
            if (user.avatar_bg != undefined) m.avatar_bg = user.avatar_bg;
            if (typeof user.user_removed != undefined && user.user_removed) m.user_removed = true;
        }
        return data;
    };

    const getImportHistory = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getImportHistory(params);
        // const res = {
        //     data: {
        //         data: [
        //             {
        //                 _id: '123321',
        //                 org_id: '1231231',
        //                 workspace_id: '1231ed12d',
        //                 _auid: '60dadcd39a3ccb406cf948f3',
        //                 type: '2', // contact
        //                 file_name: 'ahihi bất ngờ',
        //                 url: 'nànakll',
        //                 success_created: 12,
        //                 success_updated: 10,
        //                 error: 2, // tong so row loi
        //                 status: 1, // new , runing, done
        //                 maping: [{ column: '1212', attribute_id: '12d12d' }],
        //                 sent_mail_at: '2021-07-23T09:12:23.002Z',
        //                 updated_at: '2021-07-23T09:12:23.002Z',
        //                 created_at: '2021-07-23T09:12:23.002Z',
        //             },
        //         ],
        //         error: false,
        //         message: 'Message default',
        //         next_page: 'ô la ta',
        //     },
        // };
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                if (!Array.isArray(resData.data)) resData.data = [];
                else resData.data = await updateDataListWidthUserInfo(resData.data);
                // resData.data.reverse();
                loading.value = false;
                error.value = resData.error;
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

    const getImportHistoryErrorDetail = async (params: any): Promise<any> => {
        const res: AxiosResponse = await services.getErrorDetail(params);
        // const res = {
        //     data: {
        //         data: [
        //             {
        //                 _auid: '12',
        //                 org_id: 'string',
        //                 workspace_id: 'string',
        //                 im_id: 'string',
        //                 type: 1,
        //                 row: 1,
        //                 column: 2,
        //                 value: 'mixed',
        //                 updated_at: '2021-07-23T09:12:23.002Z',
        //                 created_at: '2021-07-23T09:12:23.002Z',
        //             },
        //             {
        //                 _auid: '12',
        //                 org_id: 'string',
        //                 workspace_id: 'string',
        //                 im_id: 'string',
        //                 type: 1,
        //                 row: 3,
        //                 column: 4,
        //                 value: 'mixed',
        //                 updated_at: '2021-07-23T09:12:23.002Z',
        //                 created_at: '2021-07-23T09:12:23.002Z',
        //             },
        //         ],
        //         error: false,
        //         message: 'Message default',
        //     },
        // };
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                return Promise.resolve(resData);
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const getImportHistoryErrorCount = async (params: any): Promise<any> => {
        const res: AxiosResponse = await services.getErrorCount(params);
        // const res = {
        //     data: {
        //         data: {
        //             1: 11,
        //             3: 31,
        //             5: 51,
        //             7: 71,
        //             9: 91,
        //             11: 111,
        //         },
        //         error: false,
        //         message: 'Message default',
        //     },
        // };
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                return Promise.resolve(resData);
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        }
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        loading,
        error,
        errorMessage,
        importHistories,
        getImportHistory,
        getImportHistoryErrorDetail,
        getImportHistoryErrorCount,
    };
};
