<template>
    <div class="list-component bg-white rounded pb-8p" :class="[`list-component__` + typeList]">
        <div :class="{ 'px-8p pt-8p': $slots.title || showSearch || ($slots.button && typeList !== 'radio') }">
            <span v-if="$slots.title" class="text-14 text-neutrals-500 py-8p px-12p font-medium block">
                <slot name="title"></slot>
            </span>
            <div class="mb-8p" v-if="showSearch">
                <Input
                    ref="inputSearch"
                    v-model="textSearch"
                    :state="state"
                    type="text"
                    :placeholder="placeholderSearch"
                >
                    <template v-slot:prefix>
                        <icon-component width="13" height="14" name="Search"></icon-component>
                    </template>
                    <template v-slot:suffix>
                        <icon-component
                            v-show="textSearch"
                            class="cursor-pointer"
                            name="Times"
                            @click="textSearch = ''"
                        ></icon-component>
                    </template>
                </Input>
            </div>
        </div>
        <div
            ref="listComponent"
            class="scrollbar--transparent overflow-y-auto"
            :class="[$slots.title || showSearch || $slots.button ? 'px-8p' : 'p-8p', { 'pt-8p': typeList === 'radio' }]"
            :style="{ height: heightList, 'max-height': maxHeightList }"
            @scroll="handleScrollToBottom"
        >
            <span v-if="$slots.decription" class="text-12 text-primary-500 py-10p px-12p font-medium uppercase block">
                <slot name="decription"></slot>
            </span>
            <template v-if="!searchQuery.length">
                <p class="pt-8p px-12p text-14 text-neutrals-400">No data found</p>
            </template>
            <template v-else>
                <template v-if="typeList == 'checkbox'">
                    <template v-if="selectAll">
                        <div class="py-8p px-16p" v-if="!showBtnSelectAllClearAll">
                            <span class="text-14 font-medium text-neutrals-900">
                                {{ modelSelected.length }} selected
                            </span>
                            <Button size="medium" type="link" class="ml-8p" @click="checkAll">
                                <span>{{ updateCheckall ? 'Deselect all' : 'Select all' }}</span>
                            </Button>
                        </div>
                        <div class="py-4p pl-12p" v-else>
                            <span class="text-14 font-medium text-neutrals-900">{{ modelSelected.length }}</span>
                            <span class="text-14 font-medium text-neutrals-400">/{{ list.length }}</span>
                            <Button
                                size="medium"
                                type="destructive-link"
                                class="ml-8p float-right mt-2p"
                                @click="clickClearAll"
                            >
                                <span>Clear all</span>
                            </Button>
                            <Button size="medium" type="link" class="ml-8p float-right mt-2p" @click="clickCheckAll">
                                <span>Select all</span>
                            </Button>
                        </div>
                    </template>

                    <list-item
                        :type="item.props.type"
                        v-for="(item, i) in searchQuery"
                        :key="i"
                        :value="item.props.value"
                        :disabled="
                            item.children.default()[0].props.disabled
                                ? item.children.default()[0].props.disabled
                                : false
                        "
                    >
                        <CheckBox
                            :value="item.children.default()[0].props.value"
                            v-model="modelSelected"
                            :name="item.children.default()[0].props.name"
                            @change="updateCheckall"
                            @clickCheckbox="clickCheckbox"
                            :disabled="
                                item.children.default()[0].props.disabled
                                    ? item.children.default()[0].props.disabled
                                    : false
                            "
                        >
                            <template #title v-if="item.children.default()[0].children.title">
                                {{ item.children.default()[0].children.title()[0].children }}
                            </template>
                            <template v-slot:label>{{
                                item.children.default()[0].children.label()[0].children
                            }}</template>
                        </CheckBox>
                    </list-item>
                </template>
                <template v-else-if="typeList == 'radio'">
                    <list-item
                        :type="item.props.type"
                        v-for="(item, i) in searchQuery"
                        :key="i"
                        :value="item.props.valueRadio"
                        :active="modelValue === item.props.valueRadio"
                        :disabled="item.props.disabled"
                    >
                        <Radio
                            :valueRadio="item.children.default()[0].props.valueRadio"
                            v-model="modelSelected"
                            :nameRadio="item.children.default()[0].props.nameRadio"
                            :disabledRadio="item.props.disabled"
                            :isDatePicker="item.children.default()[0].props.isDatePicker"
                        >
                            <template v-slot:label>
                                {{ item.children.default()[0].children.label()[0].children }}
                            </template>
                            <template #custom v-if="item.children.default()[0].children.custom">
                                <div class="list-component--custom flex items-center mt-4p">
                                    <component :is="item.children.default()[0].children.custom"></component>
                                </div>
                            </template>
                        </Radio>
                    </list-item>
                </template>
                <template v-else>
                    <list-item
                        :type="item.props.type"
                        v-for="(item, i) in searchQuery"
                        :key="i"
                        :value="item.props.value"
                        :active="modelValue === item.props.value"
                        :activeSingle="item.props.activeSingle"
                        :typeActive="typeActive"
                        @click="!item.props.activeSingle ? chooseValue(item) : () => true"
                        :nameIcon="item.props.nameIcon"
                        :disabled="item.props.disabled"
                        @mouseover="onMouseover(item.props.value)"
                    >
                        <template #avatar v-if="item.props.type == 'avatar'">
                            <component :is="item.children.avatar"></component>
                        </template>
                        <component :is="item.children.default"></component>
                        <template #suffix v-if="item.children.suffix">
                            <component :is="item.children.suffix"></component>
                        </template>
                        <template #decription v-if="item.children.decription">
                            <component :is="item.children.decription"></component>
                        </template>
                    </list-item>
                </template>
            </template>
            <span v-if="$slots.loadmore" class="h-48 w-full flex items-center justify-center bg-white z-1">
                <slot name="loadmore"></slot>
            </span>
        </div>
        <div class="p-8p list-component__button text-center" v-if="$slots.button">
            <slot name="button"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, nextTick } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import ListItem from '@/components/ui/ListItemComponent.vue';
import CheckBox from '@/components/ui/CheckboxCustom.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import Radio from '@/components/ui/RadioButtonComponent.vue';

export default defineComponent({
    name: 'ListComponent',
    components: {
        IconComponent,
        Input,
        ListItem,
        CheckBox,
        Button,
        Radio,
    },
    props: {
        modelValue: null,
        activeSingle: {
            type: Boolean,
            default: false,
        },
        showSearch: {
            type: Boolean,
            default: false,
        },
        typeActive: {
            type: String,
            default: 'active',
        },
        typeSearch: {
            type: String,
            default: 'value',
        },
        typeList: {
            type: String,
            default: 'default',
        },
        heightList: {
            type: String,
            default: 'auto',
        },
        maxHeightList: {
            type: String,
            default: 'unset',
        },
        selectAll: {
            type: Boolean,
            defautl: false,
        },
        showBtnSelectAllClearAll: {
            type: Boolean,
            default: false,
        },
        placeholderSearch: {
            type: String,
            default: '',
        },
        searchByAPI: {
            type: Boolean,
            default: false,
        },
        blockList: {
            type: Array,
            default: () => [],
        },
        isClear: {
            type: Number,
            default: 0,
        },
        clearTextSearch: {
            type: Boolean,
            default: false,
        },
    },
    emits: [
        'change',
        'update:modelValue',
        'changeTextSearch',
        'clickCheckbox',
        'selectAllOrClearAll',
        'scrollBottom',
        'onMouseEnterItem',
    ],
    setup(props, { emit, slots }) {
        const textSearch = ref<any>('');
        const state = ref<string>('default');
        const isCheckAll = ref<boolean>(false);
        const listAll = ref<any>([]);
        const isBlockItem = ref<boolean>(false);
        const inputSearch = ref<any>();
        const listComponent = ref<any>();

        const isListItem = (child: any) => {
            return child.type.name === 'ListItem';
        };

        const list = computed(() => {
            const list: object[] = [];
            (slots as any).default().forEach((child: any) => {
                if (isListItem(child)) {
                    list.push(child);
                } else if (Array.isArray(child.children) && child.children?.length > 0) {
                    child.children?.forEach((nestedChild: any) => {
                        if (isListItem(nestedChild)) {
                            list.push(nestedChild);
                        }
                    });
                }
            });
            return list;
        });

        const searchQuery = computed(() => {
            return (list as any).value.filter((item: any) => {
                if (props.searchByAPI) return true;
                let search;
                if (props.typeSearch === 'decription') {
                    search = item.children.decription()[0].children;
                } else {
                    if (item.props.type == 'checkbox' || item.props.type == 'radio') {
                        search = item.children.default()[0].children.label()[0].children;
                    } else {
                        search = item.children.default()[0].children;
                    }
                }
                const res = search.toLowerCase().includes(textSearch.value.toLowerCase());
                return res;
            });
        });

        const chooseValue = (val: any) => {
            if (val.props != null && !Object.prototype.hasOwnProperty.call(val.props, 'disabled')) {
                emit('update:modelValue', val.props.value);
                const value = {
                    value: val.props.value,
                    label: val.children.default()[0].children,
                    decription: val.children.decription ? val.children.decription()[0].children : null,
                    imageAvatar: val.children.avatar ? val.children.avatar()[0].props.image : null,
                    bgAvatar: val.children.avatar ? val.children.avatar()[0].props.bgAvatar : null,
                    nameIcon: val.props.nameIcon ? val.props.nameIcon : null,
                };
                emit('change', value);
            }
        };

        const updateCheckall = computed(() => {
            if ((list as any).value.length == (props.modelValue as any).length) {
                return true;
            } else {
                return false;
            }
        });

        const checkAll = () => {
            isCheckAll.value = (updateCheckall as any).value;
            isCheckAll.value = !isCheckAll.value;
            // const isLength = (searchQuery as any).value.length == (list as any).value.length;
            // listAll.value = isLength ? [] : props.modelValue;
            listAll.value = [];
            if (isCheckAll.value) {
                (list as any).value.forEach((lang: any) => {
                    if (!listAll.value.includes(lang.children.default()[0].props.value)) {
                        listAll.value.push(lang.children.default()[0].props.value);
                    }
                });
            } else {
                const arrayDisable = (list as any).value.filter((item: any) => {
                    return item.children.default()[0].props.disabled;
                });
                arrayDisable.forEach((lang: any) => {
                    if (!listAll.value.includes(lang.children.default()[0].props.value)) {
                        listAll.value.push(lang.children.default()[0].props.value);
                    }
                });
            }
            emit('update:modelValue', listAll.value);
            emit('selectAllOrClearAll', 'selectAll');
        };

        const clickCheckAll = () => {
            isCheckAll.value = (updateCheckall as any).value;
            isCheckAll.value = !isCheckAll.value;
            listAll.value = [];
            if (isCheckAll.value) {
                (list as any).value.forEach((lang: any) => {
                    if (!listAll.value.includes(lang.children.default()[0].props.value)) {
                        listAll.value.push(lang.children.default()[0].props.value);
                    }
                });
                if (props.blockList.length === 0) {
                    emit('update:modelValue', listAll.value);
                }
                emit('selectAllOrClearAll', 'selectAll');
            }
        };

        const clickClearAll = () => {
            listAll.value = [];
            const arrayDisable = (list as any).value.filter((item: any) => {
                return item.children.default()[0].props.disabled;
            });
            arrayDisable.forEach((lang: any) => {
                if (!listAll.value.includes(lang.children.default()[0].props.value)) {
                    listAll.value.push(lang.children.default()[0].props.value);
                }
            });
            if (props.blockList.length === 0) {
                emit('update:modelValue', listAll.value);
            }
            emit('selectAllOrClearAll', 'clearAll');
        };

        const clickCheckbox = (val: any) => {
            emit('clickCheckbox', val);
            if (props.blockList.length > 0) {
                if (props.blockList.includes(val)) {
                    isBlockItem.value = true;
                } else {
                    isBlockItem.value = false;
                }
            } else {
                isBlockItem.value = false;
            }
        };

        const modelSelected = computed({
            get: () => {
                return props.modelValue;
            },
            set: (value) => {
                if (!isBlockItem.value) {
                    return emit('update:modelValue', value);
                }
            },
        });

        const handleScrollToBottom = async (target: any) => {
            if (!props.searchByAPI) return;
            if (target.target.scrollTop + target.target.clientHeight >= target.target.scrollHeight) {
                emit('scrollBottom', textSearch.value);
            }
        };

        const onMouseover = (value: any) => {
            emit('onMouseEnterItem', value);
        };

        watch(textSearch, (newValue) => {
            emit('changeTextSearch', newValue);
        });

        watch(
            () => props.isClear,
            () => {
                if (props.clearTextSearch) textSearch.value = '';
            },
            { deep: true },
        );

        onMounted(async () => {
            if (inputSearch.value) {
                await nextTick();
                inputSearch.value.textfieldComp.focus();
            }
        });

        return {
            textSearch,
            state,
            list,
            isListItem,
            searchQuery,
            chooseValue,
            modelSelected,
            isCheckAll,
            listAll,
            checkAll,
            updateCheckall,
            clickClearAll,
            clickCheckAll,
            clickCheckbox,
            isBlockItem,
            handleScrollToBottom,
            onMouseover,
            inputSearch,
            listComponent,
        };
    },
});
</script>

<style lang="scss" scoped>
.list-component {
    &__button:deep {
        * {
            width: 100%;
        }
    }
}
</style>
