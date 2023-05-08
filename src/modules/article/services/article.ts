import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const chatURL = urlFactory('chat');

export default {
    createArticle(data: any): AxiosPromise<Res<Article>> {
        return axios({
            url: chatURL + '/articles',
            method: 'post',
            data,
        });
    },
    updateArticle(id: string, data: any): AxiosPromise<Res<Article>> {
        return axios({
            url: chatURL + `/articles/${id}`,
            method: 'put',
            data,
        });
    },
    deleteArticle(id: string): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/articles/${id}`,
            method: 'delete',
        });
    },
    getArticleDetail(id: string, params: any): AxiosPromise<Res<Article>> {
        return axios({
            url: chatURL + `/articles/${id}`,
            method: 'get',
            params,
        });
    },
    getArticleList(params: any): AxiosPromise<Res<Article>> {
        return axios({
            url: chatURL + `/articles/es-search`,
            method: 'get',
            params,
        });
    },
    deleteMultiArticle(check: any, data: any): AxiosPromise<Res<any>> {
        return axios({
            url: chatURL + `/articles/?check=${check}`,
            method: 'delete',
            data,
        });
    },
    getCollections(params: any): AxiosPromise<Res<any>> {
        console.log({params})
        return axios({
            url: chatURL + `/article-colls`,
            method: 'get',
            params,
        });
    },
    getSectionByCollection(params: any): AxiosPromise<Res<any>> {
        console.log({params})
        return axios({
            url: chatURL + `/article-sections`,
            method: 'get',
            params,
        });
    },
};
