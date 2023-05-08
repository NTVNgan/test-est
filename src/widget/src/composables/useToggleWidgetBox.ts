import { ref } from 'vue';

const isShowWidgetBox = ref(false);

export const useToggleWidgetBox = () => {
    const showWidgetBox = () => {
        isShowWidgetBox.value = !isShowWidgetBox.value;
    };

    return { isShowWidgetBox, showWidgetBox };
};
