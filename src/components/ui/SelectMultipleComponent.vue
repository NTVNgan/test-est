<template>
    <button class="custom-select-multiple-component" v-click-outside="closeOption">
        <div
            class="selected text-14 bg-white text-neutrals-900 pl-12p pr-4p outline-none flex items-center justify-between rounded border border-neutrals-200 hover:border-primary-500"
            :class="{ open: open, error: error, disabled: disabled }"
            @click="open = !open"
        >
            <div class="flex items-center">
                <!-- input select have value -->
                <slot v-if="selectedMultiple.length > 0">
                    <slot v-if="selectedIconLabel">
                        <icon-component
                            class="mr-8p"
                            :name="selectedIconLabel"
                            :color="disabled ? 'neutrals-300' : 'neutrals-900'"
                        />
                    </slot>
                    <slot v-if="selectedMultiple.length == 1">
                        <slot>{{ selectedMultiple[0].label }}</slot>
                    </slot>
                    <slot v-else>
                        <!-- selected == 2 -->
                        <slot v-if="selectedMultiple.length == 2">
                            <span
                                class="checked-multiple truncate qqq"
                                ref="lengthSearchMultiple"
                                :style="selectedIconLabel ? objMultiple.cssValueTwoIcon : objMultiple.cssValueTwo"
                            >
                                <slot v-for="(selected, i) in selectedMultiple" :key="i"
                                    >{{ selected.label }}<span class="comma mr-4p">,</span></slot
                                >
                            </span>
                        </slot>
                        <!-- selected > 2 -->
                        <slot v-else>
                            <span
                                class="checked-multiple truncate"
                                ref="lengthSearchMultiple"
                                :style="selectedIconLabel ? objMultiple.cssMultipleIcon : objMultiple.cssMultiple"
                            >
                                <slot v-for="(selected, i) in selectedMultiple" :key="i"
                                    >{{ selected.label }}<span class="comma mr-4p">,</span></slot
                                >
                            </span>
                        </slot>
                        <span
                            v-if="selectedMultiple.length > 2"
                            class="checked-plus text-12 bg-neutrals-100 px-6p rounded-10p font-medium"
                            :class="selectedIconLabel ? '' : 'ml-4p'"
                            >+ {{ numberMultiple }}</span
                        >
                    </slot>
                </slot>
                <!-- input select not value -->
                <slot v-else>
                    <icon-component
                        class="mr-8p"
                        v-if="selectedIconLabel"
                        :name="selectedIconLabel"
                        :color="disabled ? 'neutrals-300' : 'neutrals-900'"
                    />
                    Select
                </slot>
            </div>
            <icon-component name="angle-down" :color="disabled ? 'neutrals-300' : 'neutrals-900'" />
        </div>
        <span class="text-14 text-error-3 mt-4p block" v-if="error && errorText">{{ errorText }}</span>
        <div
            class="list-items rounded shadow-1p bg-white"
            v-if="open && !disabled"
            ref="heightList"
            :class="{ 'h-160': isMaxHeight }"
        >
            <div class="option-search pb-8p" v-if="showSearch">
                <Input v-model="textSearch" :state="state" type="text" :placeholder="'Enter keyword'">
                    <template v-slot:prefix>
                        <icon-comp width="13" height="14" name="Search"></icon-comp>
                    </template>
                </Input>
            </div>
            <slot v-if="!searchQuery.length">
                <span class="pt-10p pb-8p pl-8p pr-8p text-12 font-medium text-error-3">No matching found</span>
            </slot>
            <slot v-else>
                <CheckBox
                    v-model="valueOptionMultiple"
                    :typeCheckbox="'group'"
                    :nameGroupCheckbox="'checkbox'"
                    :optionGroupCheckbox="searchQuery"
                    @change="changeValue"
                >
                    <template v-slot:label="item">
                        <slot name="label" :item="item">{{ item }}</slot>
                    </template>
                </CheckBox>
            </slot>
        </div>
    </button>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive } from 'vue';
import IconComponent from './IconComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import CheckBox from '@/components/ui/CheckboxComponent.vue';

interface EventValue {
    label: string;
    value: string;
    icon: string;
    disabled: boolean;
}

export default defineComponent({
    name: 'Select Multi Component',
    components: {
        IconComponent,
        Input,
        IconComp,
        CheckBox,
    },
    props: {
        options: {
            type: Array,
            required: true,
            default: () => [],
        },
        // default: {
        //     type: String,
        //     required: false,
        //     default: null,
        // },
        modelValue: {
            type: Array,
        },
        error: {
            type: Boolean,
            default: false,
        },
        errorText: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        selectedIconLabel: {
            type: String,
            default: '',
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        showSearch: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['change', 'update:modelValue'],
    data() {
        return {
            open: false,
        };
    },
    setup(props, { emit }) {
        const selected = ref(!props.multiple && props.modelValue ? props.modelValue : '');
        const convertListOption = JSON.parse(JSON.stringify(props.options));

        const heightList = ref(null),
            textSearch = ref(''),
            state = ref('default'),
            lengthSearchMultiple = ref(null);

        const isMaxHeight = computed(() => {
            if (heightList.value) {
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                const height = (heightList as any).value.clientHeight;
                if (height > 160) return true;
                else return false;
            } else return false;
        });

        /*------- selected multiple checkbox ---------*/
        const objMultiple = computed(() => {
            const cssMultiple = reactive({
                    width: '122px',
                }),
                cssMultipleIcon = reactive({
                    width: '102px',
                }),
                cssValueTwo = reactive({
                    width: '155px',
                }),
                cssValueTwoIcon = reactive({
                    width: '130px',
                });

            return { cssMultiple, cssMultipleIcon, cssValueTwo, cssValueTwoIcon };
        });

        const selectedMultiple = computed(() => {
            if (props.modelValue) {
                const convertValue = JSON.parse(JSON.stringify(props.modelValue));
                if (convertValue.length > 0) {
                    const filteredList = convertListOption.filter((item: EventValue) =>
                        convertValue.includes(item.value),
                    );
                    return filteredList;
                } else return [];
            } else return [];
        });

        const searchQuery = computed(() => {
            return convertListOption.filter((item: EventValue) => {
                const res = item.label.toLowerCase().includes(textSearch.value.toLowerCase());
                return res;
            });
        });

        const valueOptionMultiple = computed({
            get: () => props.modelValue,
            set: (value) => {
                return emit('update:modelValue', value);
            },
        });

        const numberMultiple = computed(() => {
            const convert = JSON.parse(JSON.stringify(selectedMultiple.value));
            if (convert.length > 2) {
                return convert.slice(2).length;
            }
            return 0;
        });

        const changeValue = (e: object[]) => {
            emit('change', e);
        };

        return {
            objMultiple,
            selected,
            selectedMultiple,
            heightList,
            isMaxHeight,
            state,
            textSearch,
            searchQuery,
            valueOptionMultiple,
            lengthSearchMultiple,
            numberMultiple,
            changeValue,
        };
    },
    methods: {
        chooseValue(val: EventValue): void {
            if (Object.prototype.hasOwnProperty.call(val, 'disabled')) {
                if (this.selected == '') this.selected = '';
            } else {
                this.selected = val.label;
                this.open = false;
                const value = JSON.parse(JSON.stringify(val));
                this.$emit('change', value);
                this.textSearch = '';
            }
        },
        closeOption() {
            this.open = false;
            this.textSearch = '';
        },
    },
});
</script>

<style lang="scss" scoped>
.custom-select-multiple-component {
    position: relative;
    width: 100%;
    text-align: left;
    outline: none;
    &:focus {
        outline: none;
        .selected {
            border-color: #3e6dda;
        }
    }
    .selected {
        cursor: pointer;
        user-select: none;
        height: 36px;
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
        overflow: hidden;
        position: absolute;
        top: 40px;
        left: 0;
        right: 0;
        z-index: 1;
        padding: 8px;
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
        .item {
            cursor: pointer;
            user-select: none;
            outline: none;
            &.checked {
                background: #e2ecff;
            }
            &.disabled {
                color: #9b9ba8;
                background: transparent;
                cursor: not-allowed;
                &:active {
                    background: transparent;
                }
            }
            &:active {
                background: #e2ecff;
            }
        }
        .checkbox-item {
            width: 100%;
            cursor: pointer;
        }
    }
    .checked-multiple {
        .comma:last-child {
            display: none;
        }
    }
}
</style>
