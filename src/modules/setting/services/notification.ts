import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const chatURL = urlFactory('chat')

export default {
    getNotifications(params: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/notifications`,
            method: 'get',
            params
        });
    },
    readNotifications(notificationId: string): AxiosPromise<Res<any>> {
        if (notificationId === 'all') {
            return axios({
                url: chatURL + `/notifications/read`,
                method: 'put',
            });
        }
        return axios({
            url: chatURL + `/notifications/read`,
            method: 'put',
            data: {
                notification_id: notificationId,
            }
        });
    },
};
