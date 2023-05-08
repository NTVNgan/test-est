import { useContact } from '@/modules/contact/composables/useContact';

export const useManageVariable = () => {
    const { contact } = useContact();

    const clearVariable = () => {
        contact.value = null;
    };

    return { clearVariable };
};
