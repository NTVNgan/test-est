<template>
    <div>
        <div class="flex justify-between" :class="{'mb-4p': $slots.label}">
            <label class="block text-sm font-normal text-neutrals-900 font-medium">{{ label }}</label>
            <slot name="optional" v-if="$slots.optional">dqwdw</slot>
        </div>
        <div
            :class="classInputContainer"
            class="input-comp text-14 arrow-off relative rounded-4p flex border transition"
            :style="[
                {
                    flexWrap: $slots.selectedItem ? 'wrap' : '',
                },
            ]"
        >
            <div v-if="$slots.prefix" class="inset-y-0 ml-12p mr-8p flex items-center text-neutrals-500">
                <slot name="prefix"></slot>
            </div>
            <div
                class="relative w-fill"
                :class="{
                    'pl-12p': !$slots.prefix,
                    'pr-12p': !counter && !$slots.suffix && !(closeIcon && valueSync && type !== 'number'),
                }"
                :style="[
                    {
                        flex: $slots.selectedItem ? '1' : '',
                    },
                ]"
            >
                <template v-if="textarea">
                    <textarea
                        ref="textfieldComp"
                        :type="type === 'password' ? passwordType : type"
                        :class="classInput"
                        class="
                            neutrals-900
                            transition-all
                            ring
                            py-7p
                            pl-0
                            block
                            w-full
                            focus:outline-none
                            sm:text-sm
                            resize-none
                        "
                        :placeholder="placeholder"
                        aria-invalid="true"
                        :maxlength="maxlength"
                        v-model="valueSync"
                        :disabled="disabled"
                        :autocomplete="type === 'password' ? 'on' : 'off'"
                        :style="{ height: heightTextarea + 'px' }"
                    />
                </template>
                <template v-else>
                    <input
                        ref="textfieldComp"
                        :type="type === 'password' ? passwordType : type"
                        :class="classInput"
                        class="neutrals-900 transition-all ring py-7p pl-0 block w-full focus:outline-none sm:text-sm"
                        :placeholder="placeholder"
                        aria-invalid="true"
                        :maxlength="maxlength"
                        v-model="valueSync"
                        :disabled="disabled"
                        :autocomplete="type === 'password' ? 'on' : 'off'"
                    />
                </template>
            </div>
            <template v-if="type !== 'password'">
                <div
                    v-if="counter && inputModalTag"
                    class="inset-y-0 right-0 ml-8p flex items-center"
                    :class="(closeIcon && valueSync && type !== 'number') || $slots.suffix ? 'mr-12p' : 'mr-12p'"
                >
                    <span
                        :class="[disabled ? 'text-neutrals-300' : 'text-neutrals-500', textarea ? 'h-full pt-8p' : '']"
                        v-if="counter && type !== 'number'"
                    >
                        {{ countItem }}/10
                    </span>
                </div>
                <div
                    v-else-if="counter"
                    class="inset-y-0 right-0 ml-8p flex items-center"
                    :class="(closeIcon && valueSync && type !== 'number') || $slots.suffix ? 'mr-8p' : 'mr-12p'"
                >
                    <span
                        :class="[disabled ? 'text-neutrals-300' : 'text-neutrals-500', textarea ? 'h-full pt-8p' : '']"
                        v-if="counter && type !== 'number'"
                        >{{ `${valueSync.length}/${maxlength}` }}</span
                    >
                </div>
                <div
                    v-else-if="closeIcon && valueSync && type !== 'number'"
                    class="inset-y-0 right-0 ml-8p mr-4p flex items-center w-8p"
                >
                    <icon-component
                        class="cursor-pointer"
                        @click.stop.prevent="onClearText"
                        name="times"
                    ></icon-component>
                </div>
                <div
                    :class="(closeIcon && valueSync && type !== 'number') || counter ? 'mr-8p' : 'mr-12p'"
                    v-if="$slots.suffix"
                    class="inset-y-0 ml-8p flex items-center text-neutrals-500"
                >
                    <slot v-if="$slots.suffix" name="suffix"></slot>
                </div>
                <div
                    v-if="type === 'number' && !$slots.suffix"
                    class="absolute ml-8p inset-y-0 right-0 pr-2p flex items-center"
                >
                    <stepper
                        v-if="stepper"
                        @pressed="onPressed"
                        :disabled="disabled"
                        :disabledUp="disabledUp"
                        :disabledDown="disabledDown"
                    ></stepper>
                </div>
            </template>
            <template v-else>
                <div v-if="valueSync" class="input__suffix-password inset-y-0 right-0 mx-8p flex items-center w-8p">
                    <tooltip-component type="light" :content="!isShowPassword ? 'Show' : 'Hide'">
                        <icon-component
                            class="cursor-pointer"
                            @click="() => (isShowPassword = !isShowPassword)"
                            :name="!isShowPassword ? 'eye' : 'eye-slash'"
                            :color="disabled ? 'neutrals-300' : ''"
                        ></icon-component>
                    </tooltip-component>
                </div>
            </template>
            <div v-if="$slots.selectedItem" class="inset-y-0 flex items-center text-neutrals-500 w-100%">
                <slot name="selectedItem"></slot>
            </div>
        </div>
        <p class="mt-4p text-14 text-left flex" v-if="$slots.hint"><slot name="hint"></slot></p>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import IconComponent from './IconComponent.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import Stepper from '@/components/ui/StepperComponent.vue';
export default defineComponent({
    components: {
        IconComponent,
        TooltipComponent,
        Stepper,
    },
    props: {
        label: {
            type: String,
            default: '',
        },
        state: {
            type: String,
            default: 'default',
        },
        type: {
            type: String,
            default: 'text',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        disabledUp: {
            type: Boolean,
            default: false,
        },
        disabledDown: {
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
        stepper: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: [String, Number],
            default: '',
        },
        counter: {
            type: Boolean,
            default: false,
        },
        maxlength: {
            type: Number,
            default: undefined,
        },
        textarea: {
            type: Boolean,
            default: false,
        },
        inputModalTag: {
            type: Boolean,
            default: false,
        },
        heightTextarea: {
            type: Number,
            default: 76,
        },
        countItem: {
            type: Number,
            default: 0,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const valueSync = computed({
            get(): any {
                return props.modelValue;
            },
            set(value: any) {
                emit('update:modelValue', value);
            },
        });

        const textfieldComp = ref<any>(null);

        const states = ['error', 'default'];

        const classInputContainer = computed(() => {
            const state = {
                'ring-error border-error-3': props.state === 'error',
                'bg-white': !props.disabled,
                'bg-neutrals-50 cursor-not-allowed pointer-events-none': props.disabled,
                'ring-primary border-neutrals-200 focus-within:border-primary-500 hover:border-primary-500 hover:ring-4  hover:ring-primary-50':
                    (props.state === 'default' || !states.includes(props.state)) && !props.disabled,
            };

            return { ...state };
        });

        const isShowPassword = ref(false);

        const passwordType = computed(() => {
            return isShowPassword.value ? 'text' : 'password';
        });

        const classInput = computed(() => {
            const state = {
                ' placeholder-neutrals-500 text-neutrals-900': !props.disabled,
                ' placeholder-neutrals-300 text-neutrals-300': props.disabled,
            };
            return {
                ...state,
            };
        });

        const onPressed = (type: string) => {
            let temp: number = parseInt(valueSync.value);
            if (!temp) temp = 0;
            temp = type === 'down' ? temp - 1 : temp + 1;
            emit('update:modelValue', temp);
            valueSync.value = temp.toString();
        };

        const onClearText = () => {
            emit('update:modelValue', '');
            valueSync.value = '';
            const ref: any = textfieldComp.value;
            ref.focus();
        };

        const onSelectAll = () => {
            textfieldComp.value?.focus();
            textfieldComp.value?.select();
        };

        return {
            classInput,
            classInputContainer,
            states,
            onClearText,
            textfieldComp,
            onPressed,
            isShowPassword,
            passwordType,
            valueSync,
            onSelectAll,
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

.arrow-off {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type='number'] {
        -moz-appearance: textfield;
    }
}
.input-comp {
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px white inset !important;
    }
}
</style>
