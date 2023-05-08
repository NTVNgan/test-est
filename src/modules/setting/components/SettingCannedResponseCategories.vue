<template>
    <div class="canned-category pb-24p pt-14p px-40p h-full w-full relative">
        <div class="flex mb-16p">
            <button-component class="ml-auto" type="primary" size="medium" @click="isShowModalCreate = true">
                <icon-comp class="mr-4p" name="plus" color="white"></icon-comp>Create category
            </button-component>
        </div>
        <div class="flex justify-between items-center">
            <div class="canned-category__search">
                <input-comp
                    class="flex-grow"
                    closeIcon
                    v-model="searchValue"
                    placeholder="Search category name"
                    v-on:keyup.enter="onEnterSearch"
                >
                    <template v-slot:prefix>
                        <icon-comp name="search"></icon-comp>
                    </template>
                </input-comp>
            </div>
            <div class="canned-category__button">
                <Select
                    v-model="valueSelectUser"
                    showSearch
                    maxHeightList="180px"
                    titleDefault="Updated by"
                    placeholder="Search teammate"
                    @change="onChangeSelectUpdate"
                >
                    <SelectPanel v-for="(index, i) in optionSelectUser" :key="i" :value="index._id">
                        {{ index.username }}
                    </SelectPanel>
                </Select>
            </div>
            <div class="canned-category__button">
                <date-picker
                    type="range"
                    :dropdown="true"
                    :columns="2"
                    @onChange="onChangeDate"
                    :placeholder="'Last updated'"
                />
            </div>
        </div>
        <div v-if="!loading || cannedCategories.length !== 0" class="flex items-center mb-10p mt-20p">
            <span class="text-14 text-neutrals-500">
                <template v-if="selectedRowKeys.length > 0 && cannedCategories.length !== 0">
                    <span class="font-medium text-neutrals-900">{{ selectedRowKeys.length }}</span>
                    {{ selectedRowKeys.length > 1 ? `categories` : `category` }}
                    selected of
                    <span class="font-medium">{{ total }}</span>
                </template>
                <template v-else>
                    <span class="font-medium text-neutrals-900">{{ total }}</span>
                    {{ total > 1 ? `categories` : `category` }}
                </template>
                {{ isSearchFilter.length > 0 || isSearchText ? 'matched' : '' }}
            </span>
            <button-component
                class="ml-16p font-medium"
                type="destructive-sublte"
                @click="onDeleteCategory"
                v-if="cannedCategories.length !== 0"
                >Delete</button-component
            >
        </div>
        <template v-else>
            <skeleton-box width="72px" class="mt-28p mb-26p" />
        </template>
        <div v-show="loading || cannedCategories.length !== 0">
            <new-table-component
                class="canned-category__data-table"
                :loading="!next_page && loading"
                :loadingRow="isLoadMore"
                :columns="columns"
                keyData="id"
                :data-source="cannedCategories"
                :nextPage="next_page"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                :scrollToBottom="onScrollToBottom"
                tableLayout="auto"
                id="canned-response-cate-table"
            >
                <template v-slot:loading>
                    <SkeletonTable />
                </template>
                <template v-slot:name="{ record }">
                    <TooltipComponent
                        showByTruncate
                        type="light"
                        position="top"
                        :content="record.name"
                        v-if="record.name"
                    >
                        <span class="truncate font-normal mt-2p block">{{ record.name }}</span>
                    </TooltipComponent>
                </template>
                <template v-slot:last_updated="{ record }">
                    <span>{{ filters.formatTime(record.updated_at) }}</span>
                </template>
                <template v-slot:last_updatedTitle>
                    <div
                        @click="onClickSort('updated_at')"
                        class="cursor-pointer hover:text-primary-500"
                        @mouseover="mouseOverSortIcon({ value: true, type: 'updated_at' })"
                        @mouseleave="mouseOverSortIcon({ value: false, type: 'updated_at' })"
                    >
                        <caret-down
                            v-if="sortBy.name !== 'updated_at' || (sortBy.name == 'updated_at' && !sortBy.type)"
                            class="inline-block mr-8p icon-svg fill-current"
                            :class="
                                isHoverSortIcon.value && isHoverSortIcon.type == 'updated_at' ? 'text-primary-500' : ''
                            "
                        ></caret-down>
                        <icon-comp
                            v-else-if="sortBy.name === 'updated_at'"
                            class="inline-block mr-8p"
                            :name="`sort-${sortBy.type}`"
                            color="primary-500"
                        ></icon-comp>
                        <span>Last updated</span>
                    </div>
                </template>
                <template v-slot:updated_by="{ record }">
                    <div class="whitespace-nowrap overflow-hidden flex items-center" v-if="record.updated_by">
                        <avatar-component
                            v-if="convertImgAvatar(record.updated_by) === 'null'"
                            :labelShow="false"
                            :bgAvatar="convertBgAvatar(record.updated_by)"
                            :label-avatar="convertNameUpdate(record.updated_by)"
                            size="xs"
                        />
                        <avatar-component
                            v-else
                            :labelShow="false"
                            :bgAvatar="convertBgAvatar(record.updated_by)"
                            :label-avatar="convertNameUpdate(record.updated_by)"
                            :image="convertImgAvatar(record.updated_by)"
                            size="xs"
                        />
                        <span class="truncate text-14 ml-12p update_by">
                            {{ convertNameUpdate(record.updated_by) }}
                        </span>
                    </div>
                    <div class="flex items-center" v-else>
                        <div
                            class="
                                w-20
                                h-20
                                border-solid border-neutrals-200
                                rounded-50%
                                bg-neutrals-200
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <img class="img-default w-7 h-10" src="@/assets/images/vector.png" />
                        </div>
                        <span class="truncate text-14 ml-12p">Unknown</span>
                    </div>
                </template>
                <template v-slot:canned_responses="{ record }">
                    <router-link
                        :to="{
                            name: 'CannedResponses',
                            query: { cate_id: record.id },
                        }"
                        target="_blank"
                        class="text-primary-500 text-14"
                        >{{ record.canned_response_total }}</router-link
                    >
                </template>
                <template v-slot:canned_responsesTitle>
                    <div
                        @click="onClickSort('canned_response_total')"
                        class="cursor-pointer hover:text-primary-500"
                        @mouseover="mouseOverSortIcon({ value: true, type: 'canned_response_total' })"
                        @mouseleave="mouseOverSortIcon({ value: false, type: 'canned_response_total' })"
                    >
                        <caret-down
                            v-if="
                                sortBy.name !== 'canned_response_total' ||
                                    (sortBy.name == 'canned_response_total' && !sortBy.type)
                            "
                            class="inline-block mr-8p icon-svg fill-current"
                            :class="
                                isHoverSortIcon.value && isHoverSortIcon.type == 'canned_response_total'
                                    ? 'text-primary-500'
                                    : ''
                            "
                        ></caret-down>
                        <icon-comp
                            v-else-if="sortBy.name === 'canned_response_total'"
                            class="inline-block mr-8p"
                            :name="`sort-${sortBy.type}`"
                            color="primary-500"
                        ></icon-comp>
                        <span>Canned responses</span>
                    </div>
                </template>
                <template v-slot:action="{ record }">
                    <TooltipComponent content="Edit" position="top">
                        <button-component
                            v-if="record.id !== dataNoCategory.id"
                            @click="onEditCategory(record)"
                            type="subtle"
                            size="small"
                            icon="pen"
                        ></button-component>
                    </TooltipComponent>
                </template>
            </new-table-component>
        </div>
        <template v-if="!loading && cannedCategories.length === 0 && isSearchFilter.length > 0">
            <div class="flex items-center mb-10p mt-100p h-full w-full flex flex-col items-center bg-white">
                <img class="logo mx-auto w-120 h-120" src="../images/nodata-search.svg" alt="banner" />
                <div class="text-center">
                    <span class="text-neutrals-400 text-16 block">
                        <span class="flex items-center text-neutrals-900">
                            Hmm, there is no category match your filter.
                            <br />Please try again.
                        </span>
                    </span>
                </div>
            </div>
        </template>
        <template
            v-else-if="
                !loading && cannedCategories.length === 0 && isSearchFilter.length === 0 && isSearchText === true
            "
        >
            <div class="flex items-center mb-10p mt-100p h-full w-full flex flex-col items-center bg-white">
                <img class="logo mx-auto w-120 h-120" src="../images/nodata-search.svg" alt="banner" />
                <div class="text-center max-w-full">
                    <span class="text-neutrals-400 text-16 block">
                        <span class="flex items-center text-neutrals-900 truncate"
                            >Hmm, we didn’t find any result for “{{ searchValue }}”</span
                        >
                        <span class="text-neutrals-900">Please try another keyword.</span>
                    </span>
                </div>
            </div>
        </template>
        <modal-edit-category
            @edited="onEditCategorySuccess"
            v-model:showModal="showModalEdit"
            :category="selectedEditCategoryRecord"
        />
        <modal-delete-category
            v-model:showModal="showModalDelete"
            :categoryIds="selectedRowKeys"
            :categoryFilters="categoryFilters"
            :total="totalSelectedCategoryIds"
            :cannedCategories="cannedCategories"
            @submitDelete="submitDelete"
        />
        <CannedCateCreate v-model:showModal="isShowModalCreate" @created="createCannedCate"></CannedCateCreate>
        <ModalWarning v-model:showModal="isShowModalWarning"></ModalWarning>
        <modal-component :width="'512px'" v-model="showModalReachLimit" customClass="py-32p" :closeIcon="false">
            <template v-slot:body>
                <div class="flex flex-col justify-center">
                    <p
                        v-html="$t('setting.canned_response_create_modal_limit_description_cate')"
                        class="text-24 font-semibold capitalize font-heading text-center"
                    ></p>
                    <p class="text-14 my-16p text-14 text-center">
                        {{
                            $t('setting.canned_response_create_modal_limit_description_max', {
                                number: userStore ? userStore.workspace.name : '',
                            })
                        }}
                    </p>
                    <button-component
                        class="self-center text-center"
                        size="medium"
                        @click="showModalReachLimit = false"
                    >
                        {{ $t('setting.canned_response_create_button_got_it') }}
                    </button-component>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, onMounted, reactive, computed } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import ModalEditCategory from './SettingCannedResponseCategoiresModalEditCate.vue';
import ModalDeleteCategory from './SettingCannedResponseCategoiresModalDeleteCate.vue';
import InputComp from '@/components/ui/InputComponent.vue';
import Select from '@/components/ui/SelectComponent.vue';
import SelectPanel from '@/components/ui/SelectPanel.vue';
import DatePicker from '@/components/ui/DatePickerComponent/index.vue';
import { useUser } from '@/modules/auth/composables/useUser';
import NewTableComponent from '@/components/ui/NewTableComponent.vue';
import { columnItem } from '@/types/table';
import { useCannedResponse } from '@/modules/setting/composables/useCannedResponse';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import filters from '@/utils/filters';
import debounce from 'lodash/debounce';
import SkeletonTable from './SettingCannedResponseCategoriesSkeletonTable.vue';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import CannedCateCreate from './SettingCannedResponseCategoiresModalCreateCate.vue';
import CaretDown from '@/components/icons/CaretDown.vue';
import ModalWarning from './SettingCannedResponseCategoriesModalWarning.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { store } from '@/store';

interface DateFormat {
    start: string | null;
    end: string | null;
}

export default defineComponent({
    name: 'Canned Responses Category',
    components: {
        ButtonComponent,
        IconComp,
        InputComp,
        Select,
        SelectPanel,
        DatePicker,
        NewTableComponent,
        TooltipComponent,
        AvatarComponent,
        ModalEditCategory,
        ModalDeleteCategory,
        SkeletonTable,
        SkeletonBox,
        CannedCateCreate,
        CaretDown,
        ModalWarning,
        ModalComponent,
    },
    props: {
        tabActive: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const showModalReachLimit = ref(false);
        const showModalCreate = ref(false);
        const showModalEdit = ref(false);
        const showModalDelete = ref(false);
        const selectedEditCategoryRecord = ref<Teammate | null>(null);
        const valueSelectUser = ref<string | null>(null);
        const optionSelectUser = ref<any>([]);
        const { userList } = useUser();
        const cannedCategories = ref<any>([]);
        const selectedRowKeys = ref<any>([]);
        const next_page = ref<any>(null);
        const searchValue = ref<string>('');
        const total = ref<number>(0);
        const envURL = process.env.VUE_APP_FILE_URL;
        const isLoadMore = ref(false);
        const isSearchText = ref<boolean>(false);
        const isSearchFilter = ref<any>([]);
        const isSearchByEnter = ref<boolean>(false);
        const isShowModalCreate = ref<boolean>(false);
        const isShowModalWarning = ref<boolean>(false);
        const isHaveCannedResInCategory = ref<boolean>(false);
        const { getCannedCategoryBySearch, deleteCannedResponseCategory, loading, error } = useCannedResponse();
        const isHoverSortIcon = ref({});
        const dateValue = ref<DateFormat>({
            start: null,
            end: null,
        });
        const sortBy = reactive({
            name: '',
            type: '',
        });
        const status = ref<string>('init');
        const userStore = computed(() => {
            return store.state.auth.user;
        });
        const defaultColumns: columnItem[] = [
            {
                title: 'Category',
                dataIndex: 'name',
                slots: {
                    title: 'nameTitle',
                },
                scopedSlots: { customRender: 'name' },
                width: '100%',
                minWidth: '506px',
                maxWidth: '506px',
            },
            {
                title: 'Last updated',
                dataIndex: 'last_updated',
                slots: {
                    title: 'last_updatedTitle',
                },
                scopedSlots: { customRender: 'last_updated' },
                minWidth: '180px',
            },
            {
                title: 'Updated by',
                dataIndex: 'updated_by',
                slots: {
                    title: 'updated_byTitle',
                },
                scopedSlots: { customRender: 'updated_by' },
                minWidth: '180px',
                maxWidth: '180px',
            },
            {
                title: 'Canned responses',
                dataIndex: 'canned_responses',
                slots: {
                    title: 'canned_responsesTitle',
                },
                scopedSlots: { customRender: 'canned_responses' },
                minWidth: '184px',
            },
            {
                title: ' ',
                dataIndex: 'action',
                slots: {
                    title: 'actionTitle',
                },
                scopedSlots: { customRender: 'action' },
                minWidth: '52px',
            },
        ];
        const columns = ref<columnItem[]>(defaultColumns);
        const dataNoCategory = ref<any>({});

        const totalSelectedCategoryIds = computed(() => {
            return selectedRowKeys.value.length ? selectedRowKeys.value.length : total.value;
        });
        const categoryFilters = computed(() => {
            return {
                q: searchValue.value,
                updated_at_from: dateValue.value.start,
                updated_at_to: dateValue.value.end,
                updated_by: valueSelectUser.value,
            };
        });

        const onSelectChange = (selectedRowKeysChange: any) => {
            selectedRowKeys.value = selectedRowKeysChange;
        };

        const refreshData = () => {
            next_page.value = null;
            total.value = 0;
            cannedCategories.value = [];
            selectedRowKeys.value = [];
        };

        const checkZero = (val: any) => {
            if (val.toString().length == 1) {
                val = '0' + val;
            }
            return val;
        };

        const convertDate = (val: Date) => {
            const day = val.getDate();
            const month = val.getMonth() + 1;
            const year = val.getFullYear();
            return year + '-' + checkZero(month) + '-' + checkZero(day);
        };

        const onSearchCannedCategories = async () => {
            const sort_by = sortBy.type != '' ? `${sortBy.name}.${sortBy.type}` : null;
            const data = await getCannedCategoryBySearch({
                q: searchValue.value,
                sort_by,
                per_page: 20,
                updated_at_from: dateValue.value.start,
                updated_at_to: dateValue.value.end,
                updated_by: valueSelectUser.value,
                next_page: next_page.value,
                type: 3,
            });
            cannedCategories.value = [...cannedCategories.value, ...data.data];
            total.value = data.total;
            next_page.value = data.next_page;
        };

        const getNocategory = async () => {
            const data = await getCannedCategoryBySearch({type: 1});
            dataNoCategory.value = data.data[0];
            // cannedCategories.value = [...cannedCategories.value, ...data.data];
            cannedCategories.value = data.data.concat(cannedCategories.value)
        }

        const convertNameUpdate = (record: string) => {
            if (record) {
                const name = userList.value.filter((value: any) => {
                    return value._id === record;
                });
                if (name.length < 1) return '';
                return name[0].username;
            } else {
                return '';
            }
        };

        const convertBgAvatar = (record: string) => {
            if (record) {
                const name = userList.value.filter((value: any) => {
                    return value._id === record;
                });
                if (name.length < 1) return '';
                return name[0].avatar_bg;
            } else {
                return '';
            }
        };

        const convertImgAvatar = (record: string) => {
            if (record) {
                const name = userList.value.filter((value: any) => {
                    return value._id === record;
                });
                if (name.length > 0) {
                    if (name[0].avatar_src) {
                        return envURL + '/' + name[0].avatar_src;
                    } else {
                        return 'null';
                    }
                }
            } else {
                return '';
            }
        };

        const onScrollToBottom = async () => {
            if (next_page.value && !isLoadMore.value) {
                isLoadMore.value = true;
                await onSearchCannedCategories();
                isLoadMore.value = false;
            }
        };

        const filterFlag = (val: any, push: any) => {
            if (push) {
                const findIndex = isSearchFilter.value.findIndex((f: any) => f === val);
                if (findIndex > -1) return;
                isSearchFilter.value.push(val);
            } else {
                const findIndex = isSearchFilter.value.findIndex((f: any) => f === val);
                if (findIndex < 0) return;
                isSearchFilter.value.splice(findIndex, 1);
            }
        };

        const onEnterSearch = debounce(e => {
            // status.value = 'search';
            if (searchValue.value === '') {
                isSearchText.value = false;
            } else {
                isSearchText.value = true;
            }
            refreshData();
            isSearchByEnter.value = true;
            onSearchCannedCategories();
        }, 0);

        const onChangeSelectUpdate = debounce(e => {
            isSearchText.value = false;
            if (valueSelectUser.value == null) {
                filterFlag('auth', false);
            } else {
                filterFlag('auth', true);
                // isSearchText.value = true;
            }
            refreshData();
            onSearchCannedCategories();
        }, 0);

        const onChangeDate = async (val: any) => {
            if (val != null) {
                dateValue.value = {
                    start: convertDate(val.start),
                    end: convertDate(val.end),
                };
                filterFlag('date', true);
                refreshData();
                onSearchCannedCategories();
            } else {
                dateValue.value = {
                    start: null,
                    end: null,
                };
                filterFlag('date', false);
                refreshData();
                await getNocategory();
                await onSearchCannedCategories();
                total.value = total.value + 1;
            }
        };

        const onEditCategory = (record: any) => {
            showModalEdit.value = true;
            selectedEditCategoryRecord.value = record;
        };
        const onEditCategorySuccess = (data: any) => {
            const indexCate = cannedCategories.value.findIndex((cate: any) => cate.id === data._id);
            if (indexCate !== -1) {
                cannedCategories.value[indexCate].name = data.name;
            }
        };

        const onDeleteCategory = async () => {
            showModalDelete.value = true;
        };

        const handleSeachContactWithNewSort = debounce(() => {
            refreshData();
            onSearchCannedCategories();
        }, 200);

        const onClickSort = (sortName: any) => {
            const { name, type } = toRefs(sortBy);
            if (name.value !== sortName) {
                name.value = sortName;
                type.value = 'desc';
            } else {
                if (type.value == 'desc') {
                    type.value = 'asc';
                } else if (type.value == 'asc') {
                    type.value = 'desc';
                } else if (!type.value) type.value = 'desc';
            }
            handleSeachContactWithNewSort();
        };

        const mouseOverSortIcon = (value: { type: string; value: boolean }) => {
            isHoverSortIcon.value = value;
        };

        const createCannedCate = async (value: any) => {
            if (value !== false) {
                refreshData();
                await getNocategory();
                await onSearchCannedCategories();
                total.value = total.value + 1;
            } else {
                showModalReachLimit.value = true;
                // isShowModalWarning.value = true;
            }
        };
        const submitDelete = async () => {
            refreshData();
            await onSearchCannedCategories();
        };

        onMounted(async () => {
            refreshData();
            await getNocategory();
            await onSearchCannedCategories();
            total.value = total.value + 1;
            optionSelectUser.value = [...userList.value];
        });

        watch(
            () => valueSelectUser.value,
            async (newVal: any) => {
                if (newVal === '') {
                    valueSelectUser.value = null;
                    isSearchText.value = true;
                    filterFlag('auth', false);
                    refreshData();
                    await getNocategory();
                    await onSearchCannedCategories();
                    total.value = total.value + 1;
                }
            },
        );

        watch(
            searchValue,
            debounce(async (newVal: any) => {
                // status.value = 'search';
                if (newVal) {
                    if (!isSearchByEnter.value) {
                        refreshData();
                        onSearchCannedCategories();
                    } else {
                        isSearchByEnter.value = false;
                    }
                    isSearchText.value = true;
                } else {
                    isSearchText.value = false;
                    refreshData();
                    await getNocategory();
                    await onSearchCannedCategories();
                    total.value = total.value + 1;
                }
            }, 2000),
        );

        // watch(
        //     () => props.tabActive,
        //     async (val) => {
        //         if (props.tabActive === 'categories'){
        //             refreshData();
        //             await getNocategory();
        //             await onSearchCannedCategories();
        //             optionSelectUser.value = [...userList.value];
        //         }
        //     }
        // )

        return {
            showModalReachLimit,
            valueSelectUser,
            optionSelectUser,
            cannedCategories,
            columns,
            onSelectChange,
            selectedRowKeys,
            next_page,
            searchValue,
            dateValue,
            convertDate,
            total,
            refreshData,
            onChangeDate,
            sortBy,
            convertNameUpdate,
            convertBgAvatar,
            convertImgAvatar,
            envURL,
            filters,
            isLoadMore,
            onScrollToBottom,
            onChangeSelectUpdate,
            onEnterSearch,
            showModalCreate,
            showModalEdit,
            showModalDelete,
            onEditCategory,
            onDeleteCategory,
            selectedEditCategoryRecord,
            totalSelectedCategoryIds,
            categoryFilters,
            isHaveCannedResInCategory,
            loading,
            isSearchText,
            isSearchFilter,
            isSearchByEnter,
            isShowModalCreate,
            onClickSort,
            mouseOverSortIcon,
            isHoverSortIcon,
            createCannedCate,
            isShowModalWarning,
            userStore,
            onEditCategorySuccess,
            submitDelete,
            getNocategory,
            dataNoCategory,
            status,
        };
    },
});
</script>

<style lang="scss">
.canned-category {
    &__button {
        width: 20%;
        margin-right: 8px;
        &:last-child {
            margin-right: 0;
        }
    }
    &__search {
        width: calc(100% - 40% - 8px);
        margin-right: 8px;
    }
    .update_by{
        width: calc(100% - 32px);
    }
}
@media (max-width: 1440px) {
    .canned-category {
        &__button {
            width: 258px;
        }
        &__search {
            width: calc(100% - 258px - 258px - 16px);
            &.loading {
                width: calc(100% - 258px - 258px - 96px);
            }
        }
    }
}
.canned-category__data-table {
    max-height: calc(100vh - 361px);
    overflow: auto;
}
</style>
