<template>
    <div class="checkbox-component-custom">
        <template v-if="!checked">
            <label
                class="checkbox-item text-neutrals-900 text-14 outline-none cursor-pointer"
                :class="{ 'checkbox-item-checked': checkedCheckbox, 'checkbox-item-disabled': disabled }"
            >
                <input
                    type="checkbox"
                    class="checkbox-input"
                    :class="{ checked: checkValue, disabled: disabled }"
                    :value="value"
                    :disabled="disabled"
                    :name="name"
                    v-model="checkedCheckbox"
                    @keyup.tab="checkTab = true"
                    @keydown.tab="checkTab = false"
                    @click="checkTab = false"
                />
                <span
                    class="checkmark w-16 h-16 border rounded-4p border border-neutrals-400 bg-white relative"
                    :class="{
                        'checkmark-checked': checkValue,
                        'checkmark-disabled': disabled,
                        'check-focus': checkTab,
                    }"
                ></span>
                <div
                    class="checkbox-text"
                    :class="{ 'grid grid-cols-2 items-center': $slots.title, 'w-full': $slots.title || $slots.title }"
                >
                    <Tooltip
                        class="pr-3p inline-flex text-neutrals-400"
                        size="small"
                        type="light"
                        position="top"
                        showByTruncate
                        :content="$slots.title()[0].children"
                        :timeout="1000"
                        v-if="$slots.title"
                    >
                        <span class="truncate text-14 text-neutrals-400">
                            <slot name="title"></slot>
                        </span>
                    </Tooltip>
                    <Tooltip
                        class="w-full inline-flex text-neutrals-400"
                        size="small"
                        type="light"
                        position="top"
                        showByTruncate
                        :content="$slots.label()[0].children"
                        :timeout="1000"
                        v-if="$slots.label"
                        :class="{ 'pl-3p': $slots.title }"
                    >
                        <span
                            class="truncate text-14 block"
                            :class="[disabled ? 'text-neutrals-300' : 'text-neutrals-900']"
                        >
                            <slot name="label"></slot>
                        </span>
                    </Tooltip>
                </div>
            </label>
        </template>
        <template v-else>
            <label
                class="checkbox-item text-neutrals-900 text-14 outline-none cursor-pointer"
                :class="{ 'checkbox-item-checked': checked, 'checkbox-item-disabled': disabled }"
            >
                <input
                    type="checkbox"
                    class="checkbox-input"
                    :class="{ checked: checked, disabled: disabled }"
                    :value="value"
                    :disabled="disabled"
                    :name="name"
                    :checked="checked"
                    @keyup.tab="checkTab = true"
                    @keydown.tab="checkTab = false"
                    @click="checkTab = false"
                />
                <span
                    class="checkmark w-16 h-16 border rounded-4p border border-neutrals-400 bg-white relative"
                    :class="{
                        'checkmark-checked': checked || indeterminate,
                        'checkmark-disabled': disabled,
                        'check-focus': checkTab,
                        'checkmark--indeterminate': indeterminate,
                    }"
                ></span>
                <div
                    class="checkbox-text"
                    :class="{ 'grid grid-cols-2 items-center': $slots.title, 'w-full': $slots.title || $slots.title }"
                >
                    <span v-if="$slots.title" class="text-14 text-neutrals-400">
                        <slot name="title"></slot>
                    </span>
                    <span
                        v-if="$slots.label"
                        class="text-14"
                        :class="[disabled ? 'text-neutrals-300' : 'text-neutrals-900']"
                    >
                        <slot name="label"></slot>
                    </span>
                </div>
            </label>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import Tooltip from '@/components/ui/TooltipComponent.vue';
export default defineComponent({
    name: 'CheckboxCustom',
    components: {
        Tooltip,
    },
    props: {
        value: {
            type: String,
            default: '',
        },
        modelValue: {
            type: null,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            default: '',
        },
        checked: {
            type: Boolean,
            default: false,
        },
        indeterminate: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'change', 'clickCheckbox'],
    setup(props, { emit }) {
        const checkTab = ref(false);
        const checkedCheckbox = computed({
            get: () => {
                return props.modelValue;
            },
            set: (value) => {
                emit('change', value);
                emit('clickCheckbox', props.value);
                return emit('update:modelValue', value);
            },
        });

        const checkValue = computed(() => {
            if (props.modelValue) {
                const isCheck = props.modelValue.includes(props.value);
                return isCheck;
            }
            return '';
        });

        return {
            checkTab,
            checkedCheckbox,
            checkValue,
        };
    },
});
</script>

<style lang="scss" scroped>
.checkbox-component-custom {
    .group-checkbox {
        .checkbox-item {
            .checkmark {
                left: 12px;
            }
            .checkbox-input:focus-visible ~ .checkmark::before {
                content: '';
                width: 21px;
                height: 21px;
                border: 1px solid #3e6dda;
                background: transparent;
                position: absolute;
                left: -3px;
                top: -3px;
                border-radius: 4px;
            }
        }
    }
    .checkbox-item {
        display: flex;
        align-items: center;
        position: relative;
        width: 100%;
        &:not(.checkbox-item-disabled) {
            &:hover {
                .checkbox-input ~ .checkmark {
                    background-color: #f6f6f8;
                }
                .checkbox-input {
                    &.checked ~ .checkmark {
                        background-color: #1b3d8d;
                        border-color: #1b3d8d;
                    }
                }
            }
        }
        .checkbox-text {
            padding-left: 8px;
            width: calc(100% - 17px - 8px);
        }
        .checkbox-input {
            & ~ .check-focus.checkmark::before {
                content: '';
                width: 21px;
                height: 21px;
                border: 1px solid #3e6dda;
                background: transparent;
                position: absolute;
                left: -3px;
                top: -3px;
                border-radius: 4px;
            }
            & ~ .check-focus.checkmark-disabled::before {
                display: none;
            }
            &.checked {
                & ~ .checkmark {
                    background-color: #3e6dda;
                    border-color: #3e6dda;
                    &:after {
                        display: block;
                    }
                }
            }
        }
        .checkbox-input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }
        .checkmark {
            // position: absolute;
            // top: 50%;
            // left: 0;
            // transform: translateY(-50%);
            &::after {
                content: '';
                position: absolute;
                display: none;
                left: 4px;
                top: 2px;
                width: 6px;
                height: 9px;
                border: solid white;
                border-width: 0 2px 2px 0;
                -webkit-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
            }
            &--indeterminate {
                &::after {
                    top: 50%;
                    left: 50%;
                    width: 8px;
                    height: 2px;
                    background-color: white;
                    border: 0;
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                    content: ' ';
                }
            }
        }
        &-disabled {
            color: #9b9ba8;
            cursor: not-allowed;
            .checkmark-disabled {
                border-color: #e9e9ec;
            }
            &:hover {
                .checkbox-input ~ .checkmark-disabled {
                    background-color: #ffffff;
                }
            }
            .checkbox-input.checked {
                & ~ .checkmark-disabled {
                    background-color: #bfcef3;
                    border-color: #bfcef3;
                    &:after {
                        display: block;
                    }
                }
            }
        }
    }
}
</style>
