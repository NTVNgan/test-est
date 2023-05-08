import { ref } from 'vue';
import { services } from '../services';

export const useNotification = () => {
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    const errorMessage = ref<string[] | Record<string, string> | string | null>(null);
    const notifications = ref<any>(null);
    const unreadTotal = ref<number>(0);

    const getNotifications = async (params: any): Promise<any> => {
        loading.value = true;
        return services
            .getNotifications(params)
            .then((res: any) => {
                if (res) {
                    const { data: resData } = res;
                    if (!resData.error && resData.data) {
                        loading.value = false;
                        errorMessage.value = null;
                        error.value = resData.error;
                        if (params.next === '') {
                            notifications.value = resData.data.data;
                        } else {
                            notifications.value = [...notifications.value, ...resData.data.data];
                        }
                        if (!params.next) {
                            unreadTotal.value = resData.data.unread_total;
                        }
                        return Promise.resolve(resData.data);
                    } else {
                        loading.value = false;
                        error.value = resData.error;
                        errorMessage.value = resData.message;
                        return Promise.resolve(resData.message);
                    }
                }
            })
            .catch((err: any) => {
                errorMessage.value = err.message;
                Promise.reject(err);
            });
    };
    const updateStatusNotificationById = (id: string) => {
        const findIndex = notifications.value.findIndex((item: any) => item._id === id);
        if (findIndex !== -1) {
            notifications.value[findIndex].status = 2;
        }
    };
    const updateAllStatusNotification = () => {
        for (let index = 0; index < notifications.value.length; index++) {
            const notification = notifications.value[index];
            if (notification.status !== 2) {
                notification.status = 2;
            }
        }
    };
    const readNotifications = async (id: any): Promise<any> => {
        loading.value = true;
        return services
            .readNotifications(id)
            .then((res: any) => {
                if (res) {
                    const { data: resData } = res;
                    if (!resData.error && resData.data) {
                        loading.value = false;
                        errorMessage.value = null;
                        error.value = resData.error;
                        if (id === 'all') {
                            updateAllStatusNotification();
                        } else {
                            updateStatusNotificationById(resData.data._id);
                        }
                        return Promise.resolve(resData.data);
                    } else {
                        loading.value = false;
                        error.value = resData.error;
                        errorMessage.value = resData.message;
                        return Promise.resolve(resData.message);
                    }
                }
            })
            .catch((err: any) => {
                errorMessage.value = err.message;
                Promise.reject(err);
            });
    };

    return {
        loading,
        error,
        errorMessage,
        notifications,
        unreadTotal,
        getNotifications,
        readNotifications,
    };
};
