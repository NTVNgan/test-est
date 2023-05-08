<template>
    <div>
        <div class="flex justify-between">
            <label class="block text-sm font-normal text-neutrals-900 font-medium">{{ label }}</label>
            <slot name="optional" v-if="$slots.optional">dqwdw</slot>
        </div>
        <div class="mt-1 relative rounded-4 shadow-sm">
            <input
                ref="textfieldComp"
                type="text"
                :class="classInput"
                class="text-14 neutrals-900 rounded-4p placeholder-neutrals-500 transition-all ring h-36 px-12p py-8p block w-full pr-10 border focus:outline-none  sm:text-sm"
                :placeholder="placeholder"
                aria-invalid="true"
                v-model="data"
                :disabled="disabled"
            />
            <div v-if="data" class="cursor-pointer absolute inset-y-0 right-0 pr-10p flex items-center ">
                <icon-component @click="onClearText" name="times" width="8" height="8"></icon-component>
            </div>
        </div>
        <p class="mt-4p text-14 text-left flex" :class="classHint" v-if="$slots.hint"><slot name="hint"></slot></p>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import IconComponent from './IconComponent.vue';
export default defineComponent({
    components: {
        IconComponent,
    },
    props: {
        label: {
            type: String,
            default: '',
        },
        optional: {
            type: String,
            default: '',
        },
        state: {
            type: String,
            default: 'default',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: '',
        },
        closeIcon: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: String,
            default: '',
        },
    },
    mounted() {
        this.data = this.modelValue;
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const data = ref('');

        const textfieldComp = ref(null);

        const states = ['error', 'default'];

        const classInput = computed(() => {
            const state = {
                'ring-error border-error-3': props.state === 'error',
                'bg-neutrals-50 text-neutrals-300 border-neutrals-100': props.disabled,
                'ring-primary border-neutrals-100 focus:border-primary-500 hover:border-primary-500 hover:ring-4 hover:ring-primary-50':
                    (props.state === 'default' || !states.includes(props.state)) && !props.disabled,
            };
            return { ...state };
        });

        const classHint = computed(() => {
            return {
                'text-neutrals-400': props.state === 'default' || !states.includes(props.state),
                'text-error-3': props.state === 'error',
            };
        });

        const onClearText = () => {
            emit('update:modelValue', '');
            data.value = '';
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            const ref: any = textfieldComp.value;
            ref.focus();
        };

        watch(data, newValue => {
            emit('update:modelValue', newValue);
        });

        return {
            classInput,
            classHint,
            states,
            data,
            onClearText,
            textfieldComp,
        };
    },
});
</script>

<style lang="scss" scoped>
.ring-primary {
    &:hover {
        outline: 0;
        box-shadow: 0 0 0 2px #bfcef3;
    }
}
.ring-error {
    outline: 0;
    box-shadow: 0 0 0 2px #ffe5e5;
}
</style>
