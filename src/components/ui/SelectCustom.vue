<template>
    <button class="custom-select-component" v-click-outside="closeOption">
        <div
            :class="{ open: open, error: error, disabled: disabled }"
            @click="open = !open"
        >
            <slot name="label"></slot>
        </div>
        <span class="text-14 text-error-3 mt-4p block" v-if="error && errorText">{{ errorText }}</span>
        <div
            class="list-items rounded shadow-1p bg-white"
            v-if="open && !disabled"
            ref="heightList"
            :class="{ 'h-160': isMaxHeight }"
        >
            <div class="option-search pb-8p" v-if="showSearch">
                <Input
                    v-model="textSearch"
                    :state="state"
                    type="text"
                    :placeholder="'Enter keyword'"
                >
                    <template v-slot:prefix>
                        <icon-component width="13" height="14" name="Search"></icon-component>
                    </template>
                </Input>
            </div>
            <template v-if="!searchQuery.length">
                <span
                    class="pt-10p pb-8p pl-8p pr-8p text-12 font-medium text-error-3"
                >No matching found</span>
            </template>
            <template v-else>
                <ul>
                    <li
                        class="item text-neutrals-900 py-8p px-12p hover:bg-neutrals-50 rounded"
                        v-for="(item, i) in searchQuery"
                        :key="i"
                        :class="[{'checked': selected === item.props.value, 'disabled': item.props && item.props.disabled}, styleSelected]"
                        @click="chooseValue(item)"
                    >
                        <span class="flex items-center text-14">
                            <icon-component
                                v-if="item.props && item.props.icon"
                                class="item-icon mr-8p"
                                :name="item.props.icon"
                                :color="item.props.disabled ? 'neutrals-300' : 'neutrals-900'"
                            />
                            <div class="mr-8p item-icon" v-if="item.children && item.children.icon" >
                                <component :is="item.children.icon"></component>
                            </div>
                            <div class="item-content truncate" :class="{'font-medium': selected === item.props.value}">
                                <component :is="item"></component>
                            </div>
                        </span>
                        <icon-component
                            v-if="selected === item.props.value && styleSelect == 'tick'"
                            name="check"
                            color="primary-500"
                        ></icon-component>
                    </li>
                </ul>
            </template>
        </div>
    </button>
</template>

<script lang="ts">
import { defineComponent, computed, ref, inject } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import Input from '@/components/ui/InputComponent.vue';

export default defineComponent({
    name: 'Select Component',
    props: {
        options: {
            type: Array,
            // required: true,
            default: () => [],
        },
        modelValue: null,
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
        showSearch: {
            type: Boolean,
            default: false,
        },
        styleSelect: {
            type: String,
            default: '',
        },
    },
    components: {
        IconComponent,
        Input,
    },
    emits: ['change', 'update:modelValue'],
    setup(props, { emit, slots }) {
        const open = ref<boolean>(false);
        const selected = ref<any>(props.modelValue ? props.modelValue : null);
        const textSearch = ref('');
        const state = ref('default');
        const heightList = ref(null);
        const emitter: any = inject('emitter');

        /*  methos  */
        const closeOption = () => {
            open.value = false;
        };

        const isAccordionTab = (child: any) => {
            return child.type.name === 'SelectPanel';
        };

        const checkTypeSelect = (val: any) => {
            if (val.avatar().length > 0) {
                return true;
            } else return false;
        };

        const list = computed(() => {
            const list: object[] = [];
            (slots as any).default().forEach((child: any) => {
                if (isAccordionTab(child)) {
                    list.push(child);
                } else if (child.children.length > 0) {
                    child.children.forEach((nestedChild: any) => {
                        if (isAccordionTab(nestedChild)) {
                            list.push(nestedChild);
                        }
                    });
                }
            });
            return list;
        });

        const styleSelected = computed(() => {
            switch (props.styleSelect) {
                case 'tick':
                    return 'tick flex items-center justify-center';
                default:
                    return 'bg';
            }
        });

        const selectedIcon = computed(() => {
            if (selected.value && props.selectedIconLabel) {
                const iconItem = (list as any).value.filter((value: any) => {
                    if (typeof selected.value == 'string') {
                        return value.props.value == selected.value;
                    } else {
                        return value.props.value == selected.value()[0].children;
                    }
                });
                return iconItem[0].props && iconItem[0].props.icon ? iconItem[0].props.icon : iconItem[0].children.icon;
            } else {
                return '';
            }
        });

        const selectedValue = computed(() => {
            if (selected.value) {
                const value = (list as any).value.filter((value: any) => {
                    return value.props.value == selected.value;
                });
                return value[0].props && value[0].props.value ? value[0].children.default()[0].children : '';
            } else return '';
        });

        const chooseValue = (val: any) => {
            if (
                val.props != null &&
                Object.prototype.hasOwnProperty.call(val.props, 'disabled') &&
                val.props.disabled === true
            ) {
                if (selected.value == null) selected.value = null;
            } else {
                selected.value = val.props.value;
                emit('update:modelValue', val.props.value);
                open.value = false;
                emit('change', val.children.default());
            }
        };

        const searchQuery = computed(() => {
            return (list as any).value.filter((item: any) => {
                const search = item.children.default()[0].children;
                const res = search.toLowerCase().includes(textSearch.value.toLowerCase());
                return res;
            });
        });

        const isMaxHeight = computed(() => {
            if (heightList.value) {
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                const height = (heightList as any).value.clientHeight;
                console.log(height);
                if (height > 160) return true;
                else return false;
            } else return false;
        });

        emitter.on('updateSelectArticle', (status: any) => {
            if (status === 1) selected.value = 'published'
            else selected.value = 'draft'
        })

        return {
            open,
            closeOption,
            list,
            selected,
            chooseValue,
            textSearch,
            searchQuery,
            checkTypeSelect,
            state,
            heightList,
            isMaxHeight,
            selectedIcon,
            styleSelected,
            selectedValue,
        };
    },
});
</script>

<style lang="scss">
.custom-select-component {
    position: relative;
    // max-width: 200px;
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
            // &.checked {
            //     background: #e2ecff;
            // }
            >span{
                word-break: break-word;
                width: 100%;
            }
            &.bg {
                &.checked {
                    background: #e2ecff;
                }
                &:active {
                    background: #e2ecff;
                }
            }
            &.tick{
                &.checked{
                    color: #3E6DDA;
                }
            }
            &.disabled {
                color: #9b9ba8;
                background: transparent;
                cursor: not-allowed;
                &:active {
                    background: transparent;
                }
                .item-icon{
                    svg{
                        color: #9B9BA8;
                    }
                }
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
