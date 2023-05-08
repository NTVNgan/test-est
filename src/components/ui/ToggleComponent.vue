<template>
    <button
        type="button"
        :class="classBtn"
        class="bg-gray-200 relative inline-flex flex-shrink-0 border-2 border-transparent rounded-14p cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-pressed="false"
        @click="onPressed"
    >
        <span class="sr-only">Use setting </span>
        <span
            aria-hidden="true"
            :class="classPoint"
            class=" pointer-events-none inline-block rounded-full bg-white shadow-1p transform transition ease-in-out duration-200"
        ></span>
    </button>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';

export default defineComponent({
    props: {
        modelValue: {
            type: Boolean,
        },
        size: {
            type: String,
            default: 'large',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
        const state: any = ref(props.modelValue);

        const classBtn = computed(() => {
            return {
                'w-36 h-20': props.size === 'medium',
                'w-48 h-28': props.size === 'large',
                'bg-success-3': state.value,
                'bg-neutrals-100': !state.value,
                'opacity-30 cursor-not-allowed pointer-events-none': props.disabled,
            };
        });

        const classPoint = computed(() => {
            return {
                'w-16 h-16': props.size === 'medium',
                'w-24 h-24': props.size === 'large',
                'translate-x-0': !state.value,
                'translate-x-16p': state.value && props.size === 'medium',
                'translate-x-20p': state.value && props.size === 'large',
                'pointer-events-none': props.disabled,
            };
        });

        const onPressed = () => {
            state.value = !state.value;
            emit('update:modelValue', state.value);
            emit('change', state.value);
        };

        watch(
            () => props.modelValue,
            newVal => {
                if (newVal !== state.value) {
                    state.value = newVal;
                }
            },
        );

        return { classBtn, classPoint, state, onPressed };
    },
});
</script>
