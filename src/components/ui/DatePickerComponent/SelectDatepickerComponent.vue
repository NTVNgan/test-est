<template>
    <button class="custom-select-datepicker-component" v-click-outside="closeOption">
        <div
            class="
                selected
                text-14
                bg-white
                text-neutrals-900
                h-36
                outline-none
                pl-12p
                pr-4p
                flex
                items-center
                justify-between
                rounded
                border border-neutrals-200
                hover:border-primary-500
            "
            @click="open = !open"
        >
            <slot name="title"></slot>
        </div>
        <div class="list-items shadow-2.5p z-10" v-show="open">
            <slot></slot>
        </div>
    </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'selectComp',
    props: {},
    setup() {
        // const valueDate = computed({
        //     get: () => props.modelValue,
        //     set: (value) => {
        //         return emit('update:modelValue', value);
        //     }
        // });

        const open = ref(false);

        const closeOption = () => {
            open.value = false;
        };

        return {
            // valueDate,
            open,
            closeOption,
        };
    },
});
</script>

<style lang="scss" scoped>
.custom-select-datepicker-component {
    position: relative;
    max-width: max-content;
    width: 100%;
    text-align: left;
    outline: none;
    max-width: 100%;
    &:focus {
        outline: none;
        .selected {
            border-color: #3e6dda;
        }
    }
    .selected {
        cursor: pointer;
        user-select: none;
        &.open {
            border-color: #3e6dda;
        }
        &:hover {
            box-shadow: 0 0 0 2px rgb(62 109 218 / 20%);
        }
        &.error {
            border-color: #ec2b08;
            box-shadow: 0 0 0 2px rgb(236 43 8 / 30%);
        }
        &.disabled {
            border-color: #e9e9ec;
            background-color: #f6f6f8;
            color: #9b9ba8;
            &:hover {
                box-shadow: none;
            }
        }
    }
    .list-items {
        border-radius: 4px;
        // box-shadow: 0px 2px 10px 0px #0000001a;
        // box-shadow: 0px 0px 2px 0px #00000033;
        background: white;
        min-width: fit-content;
        overflow: hidden;
        position: absolute;
        top: 40px;
        right: 0;
        overflow-y: auto;
        scrollbar-color: #e9e9ec #f6f6f8;
        &::-webkit-scrollbar {
            width: 16px;
        }
        &::-webkit-scrollbar-track {
            background: #f6f6f8;
            padding: 0 30px;
            width: 16px;
        }
        &::-webkit-scrollbar-thumb {
            background: #e9e9ec;
            border-radius: 8px;
            border: 4px solid #f6f6f8;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: #b4b4be;
        }
    }
}
</style>
