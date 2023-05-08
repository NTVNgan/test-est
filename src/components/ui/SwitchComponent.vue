<template>
    <button
        type="button"
        :class="classBtn"
        class="p-1p inline-flex items-center rounded-14p cursor-pointer border-2 border-white outline-none focus:outline-none transition-colors ease-in-out duration-200"
        aria-pressed="false"
    >
        <span
            v-for="(item, index) in switchs"
            :key="'switch' + index"
            @click="onPressed(item.value)"
            class="text-12 font-bold px-4p py-1p min-w-33 rounded-14p transition-colors ease-in-out duration-200"
            :class="[classPoint(item.value), { 'ml-1p': index > 0 }]"
        >
            {{ item.label }}
        </span>
    </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'secondary',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        switchs: {
            type: Array,
            default: () => [],
        },
    },
    setup(props, { emit }) {
        const valueSync = computed({
            get(): string {
                return props.modelValue;
            },
            set(value: string) {
                emit('update:modelValue', value);
            },
        });

        const classBtn = computed(() => {
            return {
                'bg-primary-100 hover:border-primary-100 hover:bg-primary-50': props.type === 'primary',
                'bg-neutrals-100 hover:border-neutrals-100 hover:bg-neutrals-50': props.type === 'secondary',
                'opacity-30 cursor-not-allowed pointer-events-none': props.disabled,
            };
        });

        const classPoint = (value: string) => {
            return {
                'bg-white text-primary-500 shadow-deep-1': props.type === 'primary' && valueSync.value === value,
                'text-primary-300': props.type === 'primary' && valueSync.value !== value,
                'bg-white text-neutrals-900 shadow-deep-1': props.type === 'secondary' && valueSync.value === value,
                'text-neutrals-300': props.type === 'secondary' && valueSync.value !== value,
                'pointer-events-none': props.disabled,
            };
        };

        const onPressed = (value: string) => {
            valueSync.value = value;
        };

        return { classBtn, classPoint, valueSync, onPressed };
    },
});
</script>

<style lang="scss" scoped></style>
