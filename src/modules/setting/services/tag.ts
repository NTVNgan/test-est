import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const chatURL = urlFactory('chat')

export default {
    createTag(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/tags`,
            method: 'post',
            data,
        });
    },
    getTags(params: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/tags`,
            method: 'get',
            params,
        });
    },
    editTag(data: any, id: string): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/tags/${id}`,
            method: 'put',
            data,
        });
    },
    getTag(params: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/tags/es-search`,
            method: 'get',
            params,
        });
    },
    archiveTagById(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/tags/archive-by-ids`,
            method: 'put',
            data,
        });
    },
    archiveTagByFilter(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/tags/archive-by-filter`,
            method: 'put',
            data,
        });
    },
    unarchiveTagById(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/tags/unarchive-by-ids`,
            method: 'put',
            data,
        });
    },
    unarchiveTagByFilter(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/tags/unarchive-by-filter`,
            method: 'put',
            data,
        });
    },
    deleteTagById(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/tags/delete-by-ids`,
            method: 'put',
            data,
        });
    },
    delteTagByFilter(data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/tags/delete-by-filter`,
            method: 'put',
            data,
        });
    },
    getTagById(id: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/tags/` + id,
            method: 'get',
        });
    },
};
