<template>
    <button class="widget__button" @click="showWidgetBox()">
        <angle-down-icon v-if="isShowWidgetBox" />
        <times-icon v-else />
    </button>
</template>

<script>
import { defineComponent } from 'vue';
import TimesIcon from './icons/Comment.vue';
import AngleDownIcon from './icons/AngleDown.vue';
import { useToggleWidgetBox } from '../composables/useToggleWidgetBox';

export default defineComponent({
    name: 'WidgetButton',
    components: {
        TimesIcon,
        AngleDownIcon,
    },
    setup() {
        const { isShowWidgetBox, showWidgetBox } = useToggleWidgetBox();
        return {
            isShowWidgetBox,
            showWidgetBox,
        };
    },
});
</script>

<style lang="scss" scoped>
.widget__button {
    z-index: 99999;
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    background-color: #3e6dda;
    box-shadow: 0px 2px 30px rgba(14, 43, 148, 0.25);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    > svg {
        margin: 0 auto;
    }
    &:focus {
        outline: none;
    }
    &:hover {
        background-color: #2452bc;
    }
}
</style>
