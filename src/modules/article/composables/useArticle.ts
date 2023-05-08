import { ref } from 'vue';
import { services } from '../services';
import { AxiosResponse } from 'axios';

export const useArticle = () => {
    const loading = ref<boolean>(false);
    const loadingArticleDetail = ref<boolean>(false);
    const error = ref<boolean>(false);
    const errorMessage = ref<string[] | Record<string, string> | null>(null);

    const createArticleRes = async (data: any): Promise<Article> => {
        const res: AxiosResponse = await services.createArticle(data);
        if (res) {
            const { data: resData } = res;
            console.log({ resData });
            if (!resData.error) {
                return Promise.resolve(resData.data);
            } else {
                console.log('message ', resData.message);
                throw resData.message;
            }
        }

        return Promise.reject("Shouldn't be reachable");
    };

    const getArticleById = async (id: any, params: any): Promise<any> => {
        loadingArticleDetail.value = true;
        const res: AxiosResponse = await services.getArticleDetail(id, params);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                loadingArticleDetail.value = false;
                return Promise.resolve(resData.data);
            } else {
                loadingArticleDetail.value = false;
                console.log('message ', resData.message);
                throw resData.message;
            }
        }

        loadingArticleDetail.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const updateArticleById = async (id: any, data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.updateArticle(id, data);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                return Promise.resolve(resData.data);
            } else {
                console.log('message ', resData.message);
                throw resData.message;
            }
        }

        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const deleteArticleById = async (id: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.deleteArticle(id);
        if (res) {
            const { data: resData } = res;
            console.log({ resData });
            if (!resData.error && resData.data === null) {
                return Promise.resolve(resData.data);
            } else {
                console.log('message ', resData.message);
                throw resData.message;
            }
        }

        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const deleteMultiArticleById = async (params: any, data: any): Promise<any> => {
        // loading.value = true;
        const res: AxiosResponse = await services.deleteMultiArticle(params, data);
        if (res) {
            const { data: resData } = res;
            console.log({ resData });
            if (!resData.error && resData.data === null) {
                return Promise.resolve(resData.data);
            } else {
                console.log('message ', resData.message);
                throw resData.message;
            }
        }

        // loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const getArticleBySearch = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getArticleList(params);
        if (res) {
            const { data: resData } = res;
            if (resData) {
                loading.value = false;
                return Promise.resolve(resData);
            } else {
                loading.value = false;
                return Promise.resolve(resData);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };
    const getCollections = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getCollections(params);
        if (res) {
            const { data: resData } = res;
            if (resData) {
                loading.value = false;
                return Promise.resolve(resData);
            } else {
                loading.value = false;
                return Promise.resolve(resData);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };
    const getSectionByCollection = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getSectionByCollection(params);
        if (res) {
            const { data: resData } = res;
            if (resData) {
                loading.value = false;
                return Promise.resolve(resData);
            } else {
                loading.value = false;
                return Promise.resolve(resData);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        loading,
        loadingArticleDetail,
        error,
        errorMessage,
        createArticleRes,
        getArticleById,
        updateArticleById,
        deleteArticleById,
        getArticleBySearch,
        deleteMultiArticleById,
        getCollections,
        getSectionByCollection
    }
}