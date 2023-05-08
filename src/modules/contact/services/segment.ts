import { axios, urlFactory } from '@/plugins/axios';
import { AxiosPromise } from 'axios';

const cdpURL = urlFactory('cdp');

export default {
    getListSegMent(params: GetAttributeParams): AxiosPromise<Res<Segment>> {
        return axios({
            url: cdpURL + '/segments/es-search?group=1',
            method: 'get',
            params,
        });
    },
    getListNonDefaultSegment(params: any): AxiosPromise<Res<Segment>> {
        return axios({
            url: cdpURL + '/segments/es-search?group=3',
            method: 'get',
            params,
        });
    },
    editNonDefaultSegment(data: any, id: string): AxiosPromise<Res<Segment>> {
        return axios({
            url: `${cdpURL}/segments/${id}`,
            method: 'put',
            data,
        });
    },
    deleteNonDefaultSegment(data: any): AxiosPromise<Res<Segment>> {
        return axios({
            url: `${cdpURL}/segments`,
            method: 'delete',
            data,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },
    createSegment(segment: any): AxiosPromise {
        return axios({
            url: cdpURL + '/segments/multi',
            method: 'post',
            data: segment,
        });
    },
    updateSegment(segment: any, id: any): AxiosPromise {
        return axios({
            url: cdpURL + `/segments/${id}`,
            method: 'put',
            data: segment,
        });
    },
    updateMultiSegmentShowHide(data: any): AxiosPromise {
        return axios({
            url: cdpURL + `/segments`,
            method: 'put',
            data: data,
        });
    },
    getListSegmentCustom(params: any): AxiosPromise<Res<Segment>> {
        return axios({
            url: cdpURL + '/segments/es-search',
            method: 'get',
            params: params,
        });
    },
    getListSegmentBySearch(params: any): AxiosPromise {
        return axios({
            url: cdpURL + '/segments/es-search?show_hide_list=1',
            method: 'get',
            params: params,
        });
    },
    getCountSegmentCustom(): AxiosPromise {
        return axios({
            url: cdpURL + '/segments/count?group=3',
            method: 'post',
        });
    },
    getSegmentById(id: any): AxiosPromise {
        return axios({
            url: cdpURL + `/segments/${id}`,
            method: 'get',
        });
    },
};
