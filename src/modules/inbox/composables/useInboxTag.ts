import { services } from '@/modules/inbox/services';
import { AxiosResponse } from 'axios';
import { ref } from 'vue';
import { useTag } from '@/modules/setting/composables/useTag';

const allTag = ref<any>([]);

export const useInboxTag = () => {
    const { getTagById } = useTag();

    const handleTagOfMessage = async (data: any, messageId: any): Promise<any> => {
        const res: AxiosResponse = await services.handleTagOfMessage(data, messageId);
        if (res) {
            const { data: resData } = res;
            return Promise.resolve(resData);
        }
        return Promise.reject("Shouldn't be reachable");
    };

    const updateTagAll = async (data: any): Promise<any> => {
        allTag.value.push(data);
    };

    const getInfoNewTag = async (id: any): Promise<any> => {
        const findIndex = allTag.value.findIndex((tag: any) => tag.id === id);
        if (findIndex > -1) return;
        const newTag = await getTagById(id);
        if (!newTag.error && newTag.data.status === 1) {
            allTag.value.push({ id: newTag.data._id, name: newTag.data.name });
        }
    };

    return {
        handleTagOfMessage,
        updateTagAll,
        getInfoNewTag,
        allTag,
    };
};
