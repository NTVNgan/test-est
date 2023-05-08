import { ref } from 'vue';
import { services } from '../services';
import { AxiosResponse } from 'axios';

const cannedResponses = ref<Array<any>>([]);
const cateDeleted = ref<any>([]);
export const useCannedResponse = () => {
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);
    const errorMessage = ref<string[] | Record<string, string> | string | null>(null);

    const getCannedResponse = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getCannedResponseEs(params);
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

    const getCannedResponseById = async (id: any): Promise<any> => {
        const res: AxiosResponse = await services.getCannedResponseById(id);
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData.data);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const searchCategory = async (params: any): Promise<any> => {
        const res: AxiosResponse = await services.getCategoryBySearch(params);
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const deleteMultipleCannedResponse = async (params: any): Promise<any> => {
        const res: AxiosResponse = await services.deleteMultipleCannedResponse(params);
        // const res = {
        //     data: {
        //         data: {
        //             deleted_count: 0,
        //             deleted_ids: [],
        //             invalid_ids: ['6155270712612a2b5d792861', '61556b167d24eb9443110e55'],
        //         },
        //         error: false,
        //         message: 'Message default',
        //     },
        // };
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const changeCategoryCannedResponse = async (params: any): Promise<any> => {
        const res: AxiosResponse = await services.changeCategoryCannedResponse(params);
        // const res = {
        //     data: {
        //         data: {
        //             deleted_count: 0,
        //             deleted_ids: [],
        //             invalid_ids: ['6155270712612a2b5d792861', '61556b167d24eb9443110e55'],
        //         },
        //         error: true,
        //         message: 'Message default',
        //     },
        // };
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const editContactAttribute = async (id: string, data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.editContactAttribute(id, data);
        if (res) {
            const { data: resData } = res;
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

    const changeAttribute = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.changeAttribute(params);
        if (res) {
            const { data: resData } = res;
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

    const createCannedRes = async (data: any): Promise<Contact> => {
        loading.value = true;
        const res: AxiosResponse = await services.createCannedRes(data);
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

    const createCannedResCategory = async (data: any): Promise<Contact> => {
        console.log('createCannedRes');
        loading.value = true;
        console.log({ data });
        const res: AxiosResponse = await services.createCannedResCategory(data);
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

    const updateCannedResponseById = async (data: any): Promise<Contact> => {
        console.log('editCannedResponse');
        loading.value = true;
        console.log({ data });
        const res: AxiosResponse = await services.updateCannedResponseById(data);
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
    const updateCannedResponseCateById = async (data: any, id: string): Promise<any> => {
        loading.value = true;
        return services
            .updateCannedResponseCateById(data, id)
            .then((res: any) => {
                if (res) {
                    const { data: resData } = res;
                    if (!resData.error && resData.data) {
                        loading.value = false;
                        errorMessage.value = null;
                        error.value = resData.error;
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

    const getCannedCategoryBySearch = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getCategoryBySearch(params);
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

    const deleteCannedResponseCategory = async (data: any): Promise<any> => {
        loading.value = true;
        return services
            .deleteCannedResponseCategory(data)
            .then((res: any) => {
                if (res) {
                    const { data: resData } = res;
                    if (!resData.error && resData.data) {
                        loading.value = false;
                        errorMessage.value = null;
                        error.value = resData.error;
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

    const getCategoryById = async (id: any): Promise<any> => {
        const res: AxiosResponse = await services.getCategoryById(id);
        if (res) {
            return Promise.resolve(res.data);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        loading,
        error,
        errorMessage,
        cannedResponses,
        getCannedResponse,
        editContactAttribute,
        updateCannedResponseById,
        changeAttribute,
        createCannedRes,
        searchCategory,
        deleteMultipleCannedResponse,
        getCannedResponseById,
        changeCategoryCannedResponse,
        createCannedResCategory,
        updateCannedResponseCateById,
        getCannedCategoryBySearch,
        deleteCannedResponseCategory,
        cateDeleted,
        getCategoryById,
    };
};
