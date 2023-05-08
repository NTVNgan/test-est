import { ref } from 'vue';
import { services } from '../services';
import { AxiosResponse } from 'axios';

export const useTag = () => {
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    const errorMessage = ref<string[] | Record<string, string> | null>(null);
    const tags = ref<Attribute[] | null>(null);

    const getTagByKeyWord = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getTag(params);
        if (res) {
            const { data: resData } = res;
            if (resData) {
                loading.value = false;
                if (!params.q) tags.value = resData
                return Promise.resolve(resData);
            } else {
                loading.value = false;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const getTags = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getTags(params);
        if (res) {
            const { data: resData } = res;
            if (resData) {
                loading.value = false;
                return Promise.resolve(resData);
            } else {
                loading.value = false;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const createTag = async (data: any): Promise<any> => {
        console.log('createTag');
        loading.value = true;
        console.log({ data });
        const res: AxiosResponse = await services.createTag(data);
        if (res) {
            const { data: resData } = res;
            console.log({ resData });
            if (!resData.error && resData.data) {
                error.value = resData.error;
                return Promise.resolve(resData.data);
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };
    const editTag = async (data: any, id: string): Promise<any> => {
        console.log('editTag');
        loading.value = true;
        console.log({ data });
        const res: AxiosResponse = await services.editTag(data, id);
        if (res) {
            const { data: resData } = res;
            console.log({ resData });
            if (!resData.error && resData.data) {
                error.value = resData.error;
                return Promise.resolve(resData.data);
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };
    const archiveTagById = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.archiveTagById(data);
        if (res) {
            const { data: resData } = res;
            console.log({ resData });
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
    const archiveTagByFilter = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.archiveTagByFilter(data);
        if (res) {
            const { data: resData } = res;
            console.log({ resData });
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
    const unarchiveTagById = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.unarchiveTagById(data);
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
    const unarchiveTagByFilter = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.unarchiveTagByFilter(data);
        if (res) {
            const { data: resData } = res;
            console.log({ resData });
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
    const deleteTagById = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.deleteTagById(data);
        if (res) {
            const { data: resData } = res;
            console.log({ resData });
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
    const deleteTagByFilter = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.delteTagByFilter(data);
        if (res) {
            const { data: resData } = res;
            console.log({ resData });
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

    const getTagPageMessage = async (params: any): Promise<any> => {
        const res: AxiosResponse = await services.getTag(params);
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const getTagById = async (id: any): Promise<any> => {
        const res: AxiosResponse = await services.getTagById(id);
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const createTagPageMessage = async (data: any): Promise<any> => {
        const res: AxiosResponse = await services.createTag(data);
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        loading,
        error,
        errorMessage,
        tags,
        getTagByKeyWord,
        createTag,
        editTag,
        archiveTagById,
        archiveTagByFilter,
        deleteTagById,
        deleteTagByFilter,
        getTags,
        unarchiveTagById,
        unarchiveTagByFilter,
        getTagPageMessage,
        createTagPageMessage,
        getTagById,
    };
};
