<template>
    <button v-bind="$attrs" class="custom-select-component select__button" ref="selectButtonEl">
        <div
            class="
                selected
                text-14
                bg-white
                text-neutrals-900
                pl-12p
                pr-4p
                outline-none
                flex
                items-center
                justify-between
                rounded
                border border-neutrals-200
                hover:border-primary-500
            "
            :class="{ open: open, error: error, disabled: disabled }"
            @click="showSelectList"
        >
            <div class="flex items-center custom-select-component__selected">
                <template v-if="selected !== null && !showTitleDefault">
                    <template v-if="typeof selectedIcon == 'string'">
                        <icon-component
                            class="mr-8p"
                            v-if="selectedIcon"
                            :name="selectedIcon"
                            :classColor="disabled ? 'neutrals-300' : 'neutrals-900'"
                        />
                    </template>
                    <div v-else class="icon-selected mr-8p" :color="disabled ? 'neutrals-300' : 'neutrals-900'">
                        <component :is="selectedIcon"></component>
                    </div>
                    <TooltipComponent
                        class="w-100%"
                        showByTruncate
                        type="light"
                        position="top"
                        :content="selectedValue"
                    >
                        <span class="truncate block">{{ selectedValue }}</span>
                    </TooltipComponent>
                </template>
                <template v-else>
                    <template v-if="selectedValue">
                        <TooltipComponent
                            class="w-100%"
                            showByTruncate
                            type="light"
                            position="top"
                            :content="selectedValue"
                        >
                            <span class="truncate block">{{ selectedValue }}</span>
                        </TooltipComponent>
                    </template>
                    <template v-else>
                        <icon-component
                            class="mr-8p"
                            v-if="selectedIconLabel"
                            :name="selectedIconLabel"
                            :color="disabled ? 'neutrals-300' : 'neutrals-900'"
                        />
                        <TooltipComponent
                            class="w-100%"
                            showByTruncate
                            type="light"
                            position="top"
                            :content="titleDefault"
                        >
                            <div class="block truncate" v-if="$slots.titleDefault">
                                <slot name="titleDefault"></slot>
                            </div>
                            <span v-else class="block truncate">{{ titleDefault }}</span>
                        </TooltipComponent>
                    </template>
                </template>
            </div>
            <template v-if="(!removeSelected && !showTitleDefault) || isShowIconDown">
                <icon-component name="angle-down" :color="disabled ? 'neutrals-300' : 'neutrals-900'" />
            </template>
        </div>
        <template v-if="(removeSelected || (selected && showTitleDefault)) && clearIcon">
            <icon-component
                class="remove-value absolute top-1/2 right-8p w-20 h-20"
                name="times"
                :color="disabled ? 'neutrals-300' : 'neutrals-900'"
                @click.stop.prevent="removeValueSelect"
            />
        </template>
        <template v-else-if="!(removeSelected && showTitleDefault) && removeSelected">
            <icon-component
                class="remove-value absolute top-1/2 right-8p w-20 h-20"
                name="angle-down"
                :color="disabled ? 'neutrals-300' : 'neutrals-900'"
            />
        </template>
        <span class="text-14 text-error-3 mt-4p block" v-if="error && errorText">{{ errorText }}</span>
    </button>
    <teleport to="#select">
        <div
            ref="selectListEl"
            v-click-outside-teleport="closeOption"
            v-if="open && !disabled"
            class="list-items fixed z-999 rounded shadow-1p bg-white text-14 font-body pb-8p"
            :style="{
                right: selectListRight !== 'auto' ? `${selectListRight}px` : selectListRight,
                left: selectListLeft !== 'auto' ? `${selectListLeft}px` : selectListLeft,
                top: selectListTop !== 'auto' ? `${selectListTop}px` : selectListTop,
                bottom: selectListBottom !== 'auto' ? `${selectListBottom}px` : selectListBottom,
                minWidth: minWidth,
            }"
        >
            <div class="option-search p-8p flex items-center" v-if="showSearch">
                <Input
                    class="flex-grow"
                    @click.stop.prevent="() => true"
                    v-model="textSearch"
                    :state="state"
                    type="text"
                    :placeholder="placeholder"
                >
                    <template v-slot:prefix>
                        <icon-component width="13" height="14" name="Search"></icon-component>
                    </template>
                    <template v-slot:suffix>
                        <icon-component
                            v-show="textSearch"
                            class="cursor-pointer"
                            name="Times"
                            @click="textSearch = null"
                        ></icon-component>
                    </template>
                </Input>
                <slot name="addon"></slot>
            </div>
            <div
                class="px-8p scrollbar--transparent overflow-y-auto"
                :class="isEmpty || !searchQuery.length ? 'flex flex-col justify-center' : ''"
                :style="{ height: heightList, 'max-height': maxHeightList }"
                @scroll="handleScrollToBottom"
            >
                <template v-if="isEmpty && $slots.empty">
                    <p class="pt-8p px-20p text-14 text-neutrals-400 text-center"><slot name="empty"></slot></p>
                </template>
                <template v-else-if="!searchQuery.length">
                    <p class="pt-8p px-20p text-14 text-neutrals-400 text-center">No data found.</p>
                </template>
                <template v-else>
                    <ul>
                        <li
                            class="cursor-pointer py-8p px-12p rounded"
                            v-for="(item, i) in searchQuery"
                            :key="i"
                            :class="[
                                { 'bg-primary-50': selected === item.props.value },
                                item.props && item.props.disabled
                                    ? 'text-neutrals-300 bg-transparent cursor-not-allowed'
                                    : 'text-neutrals-900 hover:bg-neutrals-50',
                                styleSelected,
                            ]"
                            @click.stop.prevent="chooseValue(item)"
                        >
                            <span class="flex items-center w-full break-words text-14">
                                <icon-component
                                    v-if="item.props && item.props.icon"
                                    class="item-icon mr-8p"
                                    :name="item.props.icon"
                                    :classColor="item.props.disabled ? 'text-neutrals-300' : 'neutrals-900'"
                                />
                                <div class="mr-8p item-icon" v-if="item.children && item.children.icon">
                                    <component :is="item.children.icon"></component>
                                </div>
                                <TooltipComponent
                                    class="w-100%"
                                    showByTruncate
                                    type="light"
                                    position="right"
                                    :content="item.props.name"
                                    :paddingRight="12"
                                >
                                    <div class="item-content truncate">
                                        <component :is="item"></component>
                                    </div>
                                </TooltipComponent>
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
        </div>
    </teleport>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import debounce from 'lodash/debounce';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';

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
        maxHeightList: {
            type: String,
            default: 'unset',
        },
        heightList: {
            type: String,
            default: 'auto',
        },
        titleDefault: {
            type: String,
            default: 'Select',
        },
        placeholder: {
            type: String,
            default: 'Enter keyword',
        },
        loadMore: {
            type: Boolean,
            default: false,
        },
        showTitleDefault: {
            type: Boolean,
            default: false,
        },
        clearIcon: {
            type: Boolean,
            default: true,
        },
        showTooltipSelectName: {
            type: Boolean,
            default: false,
        },
        minWidth: {
            type: String,
            default: 'initial',
        },
        selectedLabel: {
            type: String,
            default: 'name',
        },
        isShowIconDown: {
            type: Boolean,
            default: false,
        },
        isEmpty: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        IconComponent,
        Input,
        TooltipComponent,
    },
    emits: ['change', 'isShow', 'update:modelValue', 'callData'],
    setup(props, { emit, slots }) {
        const open = ref<boolean>(false);
        // const selected = ref<any>(props.modelValue ? props.modelValue : null);
        const selected = computed({
            get(): any {
                return props.modelValue;
            },
            set(value: any) {
                emit('update:modelValue', value);
            },
        });
        const textSearch = ref('');
        const state = ref('default');
        const selectButtonEl = ref<HTMLElement>();
        const selectListEl = ref<HTMLElement>();
        const selectListRight = ref<number | string>('auto');
        const selectListLeft = ref<number | string>('auto');
        const selectListTop = ref<number | string>('auto');
        const selectListBottom = ref<number | string>('auto');
        const removeSelected = ref<boolean>(false);
        const selectedLabel = ref<string>('');

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
                    return 'flex items-center justify-center';
                default:
                    return '';
            }
        });

        const selectedIcon = computed(() => {
            // if (selected.value && props.selectedIconLabel) {
            if (selected.value) {
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

        const selectedValue: any = computed(() => {
            if (selected.value !== null) {
                const value = (list as any).value.filter((value: any) => {
                    return value.props.value == selected.value;
                });
                if (value.length < 1) return selectedLabel.value;
                // if (selected.value === ''){
                //     console.log(value[0]);
                //     return null;
                //     // return value[0].props ? value[0].children.default()[0].children : '';
                // } else {
                return (value[0].props && value[0].props.value !== null) || typeof value[0].props.value !== 'undefined'
                    ? value[0].children.default()[0].children
                    : '';
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
                selectedLabel.value = val.props.selectedLabel;
                open.value = false;
                emit('change', val.children.default());
            }
        };

        const searchQuery = computed(() => {
            return (list as any).value.filter((item: any) => {
                if (props.loadMore) return true;
                console.log(item.children.default());
                const search = item.children.default()[0].children;
                const res = search.toLowerCase().includes(textSearch.value.toLowerCase());
                return res;
            });
        });

        const isMaxHeight = computed(() => {
            if (selectListEl.value) {
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                const height = (selectListEl as any).value.clientHeight;
                if (height > props.maxHeightList) return true;
                else return false;
            } else return false;
        });

        const setPositionDropdown = () => {
            if (selectListEl.value && selectButtonEl.value) {
                const DropdownHeight = selectListEl.value?.offsetHeight;
                const rangeBottomToScreen = window.innerHeight - selectButtonEl.value.getBoundingClientRect().bottom;
                selectListLeft.value = selectButtonEl.value.getBoundingClientRect().left;
                if (rangeBottomToScreen < selectListEl.value.getBoundingClientRect().height) {
                    selectListTop.value = selectButtonEl.value.getBoundingClientRect().top - DropdownHeight - 4;
                    selectListBottom.value = 'auto';
                    // selectListTop.value = 'auto';
                    // selectListBottom.value = selectButtonEl.value.getBoundingClientRect().top;
                } else {
                    selectListTop.value = selectButtonEl.value.getBoundingClientRect().bottom + 4;
                    selectListBottom.value = 'auto';
                }
                selectListEl.value.style.width = `${selectButtonEl.value.getBoundingClientRect().width}px`;
            }
        };
        const showSelectList = async () => {
            open.value = !open.value;
            await nextTick();
            setPositionDropdown();
        };

        const removeValueSelect = () => {
            removeSelected.value = false;
            open.value = false;
            emit('update:modelValue', null);
        };

        const handleScrollToBottom = async (target: any) => {
            if (!props.loadMore) return;
            if (target.target.scrollTop + target.target.clientHeight >= target.target.scrollHeight) {
                emit('callData', { text: textSearch.value, push: true });
            }
        };

        watch(
            () => open.value,
            (newVal: any) => {
                setTimeout(async () => {
                    await nextTick();
                    emit('isShow', newVal);
                    textSearch.value = '';
                }, 0);
            },
        );

        watch(
            textSearch,
            debounce((newVal) => {
                emit('callData', { text: newVal, push: false });
            }, 2000),
        );

        watch(
            () => selectedValue.value,
            (newVal: any) => {
                if (newVal) removeSelected.value = true;
            },
        );

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
            selectListEl,
            selectButtonEl,
            isMaxHeight,
            selectedIcon,
            styleSelected,
            selectedValue,
            selectListRight,
            selectListLeft,
            selectListTop,
            selectListBottom,
            showSelectList,
            removeValueSelect,
            removeSelected,
            handleScrollToBottom,
        };
    },
});
</script>

<style lang="scss">
.icon-selected {
    .avatar-content {
        width: 20px;
        height: 20px;
        font-size: 10px;
        line-height: 16px;
    }
}
.select__button {
    max-width: unset;
}
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
        .item {
            cursor: pointer;
            user-select: none;
            outline: none;
            // &.checked {
            //     background: #e2ecff;
            // }
            > span {
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
            &.tick {
                &.checked {
                    color: #3e6dda;
                }
            }
            &.disabled {
                color: #9b9ba8;
                background: transparent;
                cursor: not-allowed;
                &:active {
                    background: transparent;
                }
                .item-icon {
                    svg {
                        color: #9b9ba8;
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
    .remove-value {
        transform: translateY(-50%);
    }
    &__selected {
        width: calc(100% - 24px);
    }
}
</style>
