<template>
    <div class="radio-component">
        <label
            class="radio-group relative cursor-pointer group block"
            :class="[{ 'cursor-not-allowed': disabledRadio }, $slots.custom ? 'w-full' : 'w-max']"
            v-click-outside="closeTab"
        >
            <div class="flex items-center">
                <input
                    class="radio-group__input absolute opacity-0 h-0 w-0"
                    @keyup.tab="checkTab = true"
                    @keydown.tab="checkTab = false"
                    @click="checkTab = false"
                    type="radio"
                    :disabled="disabledRadio"
                    :value="valueRadio"
                    :class="{ checked: checkedRadio === valueRadio, disabled: disabledRadio }"
                    :checked="checkedRadio === valueRadio"
                    :name="nameRadio"
                    v-model="checkedRadio"
                />
                <span
                    class="
                        radio-group__checkmark
                        relative
                        left-0
                        w-16
                        h-16
                        border
                        rounded-50%
                        border-neutrals-400
                        bg-white
                    "
                    :class="[
                        { 'checkmark-checked': checkedRadio === valueRadio, 'radio-focus': checkTab },
                        disabledRadio ? 'checkmark-disabled' : 'group-hover:bg-neutrals-50',
                    ]"
                ></span>
                <span class="text-14 text-primary-900 content-radio pl-8p" :class="{ 'text-neutrals-300': disabledRadio }">
                    <slot name="label"></slot>
                </span>
            </div>
            <div class="content-radio ml-auto pl-8p">
                <slot name="decription"></slot>
            </div>
        </label>
        <div :class="isDatePicker ? '' : 'ml-24p'">
            <slot name="custom" v-if="$slots.custom && checkedRadio === valueRadio"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
    name: 'RadioComponent',
    props: {
        modelValue: {
            type: null,
        },
        valueRadio: {
            type: null,
        },
        disabledRadio: {
            type: Boolean,
            default: false,
        },
        nameRadio: {
            type: String,
            default: '',
        },
        isDatePicker: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'change', 'update:defaultValue'],
    setup(props, { emit }) {
        const checkTab = ref(false),
            closeTab = () => {
                checkTab.value = false;
            };
        const checkedRadio = computed({
            get: () => {
                return props.modelValue;
            },
            set: (value) => {
                // if (props.modelValue == undefined){
                //     emit('change', value === props.valueRadio);
                //     return emit('update:modelValue', value === props.valueRadio);

                // } else{
                //     emit('change', value);
                //     return emit('update:modelValue', value);
                // }
                emit('change', value);
                return emit('update:modelValue', value);
            },
        });

        return {
            checkTab,
            closeTab,
            checkedRadio,
        };
    },
});
</script>

<style lang="scss">
.radio-component {
    .radio-group {
        &__checkmark {
            &::before {
                content: '';
                width: 20px;
                height: 20px;
                border: 1px solid #3e6dda;
                position: absolute;
                left: -3px;
                top: -3px;
                border-radius: 50%;
                display: none;
            }
            &.radio-focus {
                &:before {
                    display: block;
                }
            }
            &.checkmark-disabled {
                border-color: #e9e9ec;
            }
        }
        &__input {
            & ~ .radio-group__checkmark {
                &::after {
                    content: '';
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    left: 50%;
                    top: 50%;
                    background: #3e6dda;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    display: none;
                }
            }
            &:checked {
                & ~ .radio-group__checkmark {
                    border-width: 2px;
                    border-color: #3e6dda;
                    &::after {
                        display: block;
                    }
                    &.radio-focus:before {
                        left: -4px;
                        top: -4px;
                    }
                }
                &:focus-visible {
                    & ~ .radio-group__checkmark::before {
                        left: -4px;
                        top: -4px;
                    }
                }
                &.disabled {
                    & ~ .radio-group__checkmark {
                        border-color: #7e9ee6;
                        &::after {
                            background: #7e9ee6;
                        }
                    }
                }
            }
            &:focus-visible {
                & ~ .radio-group__checkmark::before {
                    display: block;
                }
            }
        }
        &:hover {
            .radio-group__input {
                &:checked {
                    & ~ .radio-group__checkmark:not(.checkmark-disabled) {
                        background-color: #ffffff;
                        border-color: #12295e;
                        &::after {
                            background: #12295e;
                        }
                    }
                }
            }
        }
        .content-radio {
            width: calc(100% - 16px);
        }
    }
}
</style>
