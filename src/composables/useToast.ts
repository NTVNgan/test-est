import { ref } from 'vue';
import Toast from '@/types/toast';

const toasts = ref<Toast[]>([]);
const toastSingle = ref<Toast | null>();

export const useToast = () => {
    const removeToast = (toastId: string) => {
        const toastIndex = toasts.value.findIndex(toast => toast.id === toastId);
        toasts.value.splice(toastIndex, 1);
    };

    const removeToastSingle = () => {
        toastSingle.value = null;
    };

    const addToast = (toastData: any) => {
        if (toastData.single) {
            removeToastSingle();
            setTimeout(() => {
                toastSingle.value = {
                    ...toastData,
                    id: (Math.random().toString(36) + Date.now().toString(36)).substr(2),
                };
            }, 200);
            if (toastData.timeout) {
                setTimeout(() => {
                    removeToastSingle();
                }, toastData.timeout);
            }
        } else {
            const toast = {
                ...toastData,
                id: (Math.random().toString(36) + Date.now().toString(36)).substr(2),
            };
            toasts.value.unshift(toast);

            if (toastData.timeout) {
                setTimeout(() => {
                    removeToast(toast.id);
                }, toastData.timeout);
            }
        }
    };

    return { toasts, toastSingle, addToast, removeToast, removeToastSingle };
};
