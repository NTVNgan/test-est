import { ref } from 'vue';
import { services } from '../services';
import { AxiosResponse } from 'axios';


const contact = ref<any>();
const blockContactDetail = ref<any>();

export const useContact = () => {
    const error = ref<boolean>(false);
    const errorMessage = ref<string[] | Record<string, string> | null>(null);
    const loading = ref<boolean>(false);
    const data = ref<any>(null);
    const contacts = ref<Contact[]>([])

    const getContactByID = async (params: any) => {
        loading.value = true;
        const res: AxiosResponse = await services.getContactInfo(params);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                contact.value = resData.data;
                loading.value = false;
                return resData.error;
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                contact.value = null;
                return resData.error;
            }
        }
    };

    const getContactsBySegments = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getContactsBySegments(params);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
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

    const getContactsByKeyword = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getContactsByKeyword(params);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
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

    const getContactsByConditions = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getContactsByConditions(params);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
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

    const updateContact = async (contactData: Contact): Promise<Contact> => {
        loading.value = true;
        const res: AxiosResponse = await services.updateContactInfo(contactData);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                contact.value = resData.data;
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

    const createContact = async (contactData: any): Promise<Contact> => {
        loading.value = true;
        const res: AxiosResponse = await services.createContact(contactData);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                contact.value = resData.data;
                errorMessage.value = null;
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

    const getRecentPage = async (type: RecentPage['type'], contact_id: RecentPage['contact_id'], limit: number) => {
        loading.value = true;
        const response = {
            error: false,
            data: [],
        };
        try {
            await services.getRecentPage(type, contact_id, limit).then((res: AxiosResponse) => {
                const { data: resData } = res;
                response.error = resData.error;
                response.data = resData.data.data;
            });
            loading.value = false;
            return response;
        } catch (e) {
            errorMessage.value = e;
            loading.value = false;
            return response;
        }
    };

    const getAttributes = async (params: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getListAttribute(params);
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

    const getContactsSetting = async (): Promise<any> => {
        const res: AxiosResponse = await services.getContactsSetting();
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
        return Promise.reject("Shouldn't be reachable");
    };

    const updateContactsSetting = async (params: any): Promise<any> => {
        const res: AxiosResponse = await services.updateContactsSetting(params);
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
        return Promise.reject("Shouldn't be reachable");
    };

    const updateContactsToArchive = async (data: any, hasFilter = false): Promise<any> => {
        const res: AxiosResponse = !hasFilter ? await services.updateContactsToArchive(data) : await services.updateContactsToArchiveByFilter(data);
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
        return Promise.reject("Shouldn't be reachable");
    };

    const getConversationsByContact = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.getConversationsByContact(data);
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

    const blockContact = async (id: Contact["_id"], status: Contact["status"]): Promise<Contact> => {
        loading.value = true;
        const res: AxiosResponse = await services.blockContactDetail(id, status);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                blockContactDetail.value = resData.data;
                return Promise.resolve(resData.data);
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                blockContactDetail.value = null;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    const archiveContactDetail = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.archiveContactDetail(data);
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

    const uploadContact = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.uploadContact(data);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                loading.value = false;
                return Promise.resolve(resData.data);
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                loading.value = false;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };
    const importContact = async (data: any): Promise<any> => {
        loading.value = true;
        const res: AxiosResponse = await services.importContact(data);
        if (res) {
            const { data: resData } = res;
            if (!resData.error && resData.data) {
                error.value = resData.error;
                loading.value = false;
                return Promise.resolve(resData.data);
            } else {
                error.value = resData.error;
                errorMessage.value = resData.message;
                loading.value = false;
                return Promise.resolve(resData.message);
            }
        }
        loading.value = false;
        return Promise.reject("Shouldn't be reachable");
    };

    return {
        contact,
        blockContactDetail,
        loading,
        error,
        errorMessage,
        data,
        getContactByID,
        updateContact,
        getRecentPage,
        getAttributes,
        getContactsBySegments,
        getContactsByKeyword,
        createContact,
        getConversationsByContact,
        blockContact,
        getContactsByConditions,
        getContactsSetting,
        updateContactsSetting,
        updateContactsToArchive,
        archiveContactDetail,
        uploadContact,
        importContact,
    };
};
