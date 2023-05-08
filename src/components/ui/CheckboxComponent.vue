<template>
    <div class="checkbox-component">
        <div v-if="typeCheckbox === 'group'">
            <div class="group-checkbox">
                <label
                    v-for="(item, i) in optionGroupCheckbox"
                    :key="i"
                    class="checkbox-item text-neutrals-900 text-14 outline-none py-8p px-12p"
                    :class="{ 'checkbox-item-checked': isChecked(item.value), 'checkbox-item-disabled': item.disable }"
                >
                    <input
                        type="checkbox"
                        class="checkbox-input"
                        :class="{ disabled: item.disable, checked: isChecked(item.value) }"
                        :value="item.value"
                        v-model="checkedCheckbox"
                        :name="nameGroupCheckbox"
                        :disabled="item.disable"
                    />

                    <!-- <span class="checkbox-text">{{ item.label }}</span> -->
                    <span class="checkbox-text">
                        <slot name="label" :item="item">{{ item }}</slot>
                    </span>
                    <span
                        class="checkmark w-17 h-17 border rounded border border-neutrals-400 bg-white"
                        :class="{ 'checkmark-checked': checkedCheckbox, 'checkmark-disabled': item.disable }"
                    ></span>
                </label>
            </div>
        </div>
        <div v-else>
            <label
                class="checkbox-item text-neutrals-900 text-14 outline-none"
                :class="{ 'checkbox-item-checked': checkedCheckbox, 'checkbox-item-disabled': disabledSingleCheckbox }"
                v-click-outside="closeTab"
            >
                <slot v-if="!checked">
                    <input
                        type="checkbox"
                        v-model="checkedCheckbox"
                        class="checkbox-input"
                        :class="{ checked: checkedCheckbox, disabled: disabledSingleCheckbox }"
                        :disabled="disabledSingleCheckbox"
                        :name="nameSingleCheckbox"
                        :value="valueSingleCheckbox"
                        @keyup.tab="checkTab = true"
                        @keydown.tab="checkTab = false"
                        @click="checkTab = false"
                    />
                    <div class="checkbox-text">
                        <slot name="label"></slot>
                    </div>
                    <span
                        class="checkmark w-17 h-17 border rounded border border-neutrals-400 bg-white"
                        :class="{
                            'checkmark-checked': checkedCheckbox,
                            'checkmark-disabled': disabledSingleCheckbox,
                            'check-focus': checkTab,
                        }"
                    ></span>
                </slot>
                <slot v-else>
                    <input
                        class="checkbox-input"
                        :class="{ disabled: disabledSingleCheckbox }"
                        :disabled="disabledSingleCheckbox"
                        :name="nameSingleCheckbox"
                        :value="valueSingleCheckbox"
                        type="checkbox"
                        :checked="checked"
                        @keyup.tab="checkTab = true"
                        @keydown.tab="checkTab = false"
                        @click="changeValueSingleSelect"
                    />
                    <div class="checkbox-text">
                        <slot name="label"></slot>
                    </div>
                    <span
                        class="checkmark w-17 h-17 border rounded border border-neutrals-400 bg-white"
                        :class="{
                            'checkmark-disabled': disabledSingleCheckbox,
                            'check-focus': checkTab,
                        }"
                    ></span>
                </slot>
            </label>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

interface DefaultValue {
    label: [string, number];
    value: any;
}
export default defineComponent({
    name: 'CheckboxComponent',
    props: {
        typeCheckbox: {
            type: String,
            default: '',
        },
        valueSingleCheckbox: {
            type: String,
            default: '',
        },
        nameSingleCheckbox: {
            type: String,
            default: '',
        },
        disabledSingleCheckbox: {
            type: Boolean,
            default: false,
        },
        nameGroupCheckbox: {
            type: String,
            default: '',
        },
        optionGroupCheckbox: Array,
        modelValue: {
            type: [Boolean, Array],
        },
        checked: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'change'],

    setup(props, { emit, slots }) {
        const checkedCheckbox = computed({
            get: () => {
                return props.modelValue;
            },
            set: value => {
                if (typeof props.modelValue == 'object') {
                    const arr1 = JSON.parse(JSON.stringify(props.optionGroupCheckbox)),
                        arr2 = JSON.parse(JSON.stringify(value));
                    const filteredList = arr1.filter((item: DefaultValue) => {
                        arr2.includes(item.value);
                    });
                    emit('change', filteredList);
                } else {
                    emit('change', value);
                }
                return emit('update:modelValue', value);
            },
        });
        const checkTab = ref(false),
            closeTab = () => {
                checkTab.value = false;
            };
        const changeValueSingleSelect = (e: any) => {
            emit('change', e.target.checked);
        };

        return {
            checkedCheckbox,
            checkTab,
            closeTab,
            changeValueSingleSelect,
        };
    },
    methods: {
        // eslint-disable-next-line
        isChecked: function(val: string) {
            if (typeof this.modelValue == 'object') return this.modelValue.includes(val);
        },
    },
});
</script>

<style lang="scss">
.checkbox-component {
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
        width: max-content;
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
            padding-left: 23px;
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
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            &::after {
                content: '';
                position: absolute;
                display: none;
                left: 5px;
                top: 2px;
                width: 6px;
                height: 9px;
                border: solid white;
                border-width: 0 2px 2px 0;
                -webkit-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
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
