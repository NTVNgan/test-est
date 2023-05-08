<template>
    <template v-if="loading && status === 'init'">
        <div class="py-36p px-40p article">
            <SkeletonList />
        </div>
    </template>
    <template v-else>
        <div class="article py-22p px-40p h-full w-full relative">
            <template v-if="checkValueArticleEmpty">
                <span class="font-heading text-24 font-semibold">{{ $t('article.article_title') }}</span>
                <div class="text-center absolute article__empty">
                    <embed
                        class="logo mx-auto w-120 h-120"
                        :src="require('../images/article-list-empty.svg')"
                        alt="banner"
                    />
                    <span class="text-16 font-bold mt-12p mb-4p block">{{ $t('common.data_table_empty_title') }}</span>
                    <span class="text-14 text-neutrals-400 block">{{
                        $t('article.article_data_table_empty_subtitle')
                    }}</span>
                    <button-component class="ml-auto mt-12p" type="primary" size="medium" @click="checkLimitCreate">
                        <icon-comp class="mr-4p" name="plus" color="white"></icon-comp
                        >{{ $t('article.article_btn_create') }}
                    </button-component>
                </div>
            </template>
            <template v-else>
                <div class="flex mb-30p">
                    <span class="font-heading text-24 font-semibold">{{ $t('article.article_title') }}</span>
                    <button-component class="ml-auto" type="primary" size="medium" @click="checkLimitCreate">
                        <icon-comp class="mr-4p" name="plus" color="white"></icon-comp
                        >{{ $t('article.article_btn_create') }}
                    </button-component>
                </div>
                <div class="flex justify-between items-center">
                    <div class="article__search">
                        <input-comp
                            class="flex-grow"
                            closeIcon
                            v-model="searchValue"
                            :placeholder="$t('article.article_placeholder_input_search')"
                            v-on:keyup.enter="onEnterSearch"
                        >
                            <template v-slot:prefix>
                                <icon-comp name="search"></icon-comp>
                            </template>
                        </input-comp>
                    </div>
                    <div class="article__button">
                        <Select
                            v-model="valueSelectUser"
                            showSearch
                            maxHeightList="240px"
                            titleDefault="Updated by"
                            :placeholder="$t('article.article_placeholder_select')"
                            @change="onChangeSelectUpdate"
                        >
                            <SelectPanel v-for="(index, i) in optionSelectUser" :key="i" :value="index._id">{{
                                index.username
                            }}</SelectPanel>
                        </Select>
                    </div>
                    <div class="article__button">
                        <date-picker
                            type="range"
                            :dropdown="true"
                            :columns="2"
                            :placeholder="$t('article.article_placeholder_datepicker')"
                            @onChange="onChangeDate"
                        />
                    </div>
                </div>
                <div v-if="!loading || articleList.length !== 0" class="flex items-center my-16p">
                    <span class="text-14 text-neutrals-500">
                        <template v-if="selectedRowKeys.length > 0 && articleList.length !== 0">
                            <span class="font-medium text-neutrals-900">{{ selectedRowKeys.length }}</span>
                            {{ selectedRowKeys.length > 1 ? `articles` : `article` }}
                            selected of
                            <span class="font-medium">{{ total }}</span>
                        </template>
                        <template v-else>
                            <span class="font-medium text-neutrals-900">{{ total }}</span>
                            {{ total > 1 ? `articles` : `article` }}
                        </template>
                        {{ isSearchFilter.length > 0 || isSearchText ? 'matched' : '' }}
                    </span>
                    <button-component
                        v-if="articleList.length !== 0"
                        @click="deleteMulti"
                        class="ml-16p font-medium"
                        type="destructive-sublte"
                        >Delete</button-component
                    >
                </div>
                <div v-else class="my-24p">
                    <skeleton-box width="132px" />
                </div>
                <div v-show="loading || articleList.length !== 0">
                    <new-table-component
                        class="article__data-table"
                        :loading="!next_page && loading"
                        :loadingRow="isLoadMore"
                        :columns="columns"
                        keyData="id"
                        :data-source="articleList"
                        :nextPage="next_page"
                        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                        :scrollToBottom="onScrollToBottom"
                        tableLayout="auto"
                    >
                        <template v-slot:loading>
                            <SkeletonTable />
                        </template>
                        <template v-slot:name="{ record }">
                            <TooltipComponent showByTruncate type="light" position="top" :content="record.title">
                                <span class="truncate font-normal mt-2p block">{{ record.title }}</span>
                            </TooltipComponent>
                        </template>
                        <template v-slot:status="{ record }">
                            <badge-chip
                                v-if="convertStatus(record.status) === 'Published'"
                                status="success"
                                :content="convertStatus(record.status)"
                            />
                            <badge-chip v-else status="warning" :content="convertStatus(record.status)" />
                        </template>
                        <template v-slot:collection>
                            <span></span>
                        </template>
                        <template v-slot:section>
                            <span></span>
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
                                <span class="truncate text-14 ml-12p update_by">{{
                                    convertNameUpdate(record.updated_by)
                                }}</span>
                            </div>
                            <div class="flex items-center" v-else>
                                <div
                                    class="w-20 h-20 border-solid border-neutrals-200 rounded-50% bg-neutrals-200 flex items-center justify-center"
                                >
                                    <img class="img-default w-7 h-10" src="@/assets/images/vector.png" />
                                </div>
                                <span class="truncate text-14 ml-12p">Unknown</span>
                            </div>
                        </template>
                        <template v-slot:last_updated="{ record }">
                            <span class="truncate block">{{ filters.formatTime(record.updated_at) }}</span>
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
                                        isHoverSortIcon.value && isHoverSortIcon.type == 'updated_at'
                                            ? 'text-primary-500'
                                            : ''
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
                        <template v-slot:action="{ record }">
                            <TooltipComponent content="Edit" position="top">
                                <button-component
                                    type="subtle"
                                    size="small"
                                    icon="pen"
                                    @click="checkArticleDetail(record.id)"
                                ></button-component>
                            </TooltipComponent>
                        </template>
                    </new-table-component>
                </div>
                <template v-if="!loading && articleList.length === 0 && isSearchFilter.length > 0">
                    <div class="flex items-center mb-10p mt-100p h-full w-full flex flex-col items-center bg-white">
                        <embed
                            class="logo mx-auto w-120 h-120"
                            :src="require('../images/nodata-search.svg')"
                            alt="banner"
                        />
                        <div class="text-center">
                            <span class="text-neutrals-400 text-16 block">
                                <span
                                    class="flex items-center text-neutrals-900"
                                    v-html="$t('article.article_data_table_empty_search_filter')"
                                ></span>
                            </span>
                        </div>
                    </div>
                </template>
                <template
                    v-if="!loading && articleList.length === 0 && isSearchFilter.length === 0 && isSearchText === true"
                >
                    <div class="flex items-center mb-10p mt-100p h-full w-full flex flex-col items-center bg-white">
                        <embed
                            class="logo mx-auto w-120 h-120"
                            :src="require('../images/nodata-search.svg')"
                            alt="banner"
                        />
                        <div class="text-center max-w-full">
                            <span class="text-neutrals-400 text-16 block">
                                <span class="flex items-center text-neutrals-900 truncate">{{
                                    $t('article.article_data_table_empty_search', { searchValue: searchValue })
                                }}</span>
                                <span class="text-neutrals-900">Please try another keyword.</span>
                            </span>
                        </div>
                    </div>
                </template>
                <ModalLimit v-model:showModal="isShowModalLimit"></ModalLimit>
            </template>
            <ModalDelete
                v-model:showModal="isShowModalDelete"
                :totalDelete="selectedRowKeys.length > 0 ? selectedRowKeys.length : total"
                :idArticle="selectedRowKeys"
                @submitDelete="submitDelete"
                :filters="articleFilters"
            ></ModalDelete>
            <ModalEditWarning v-model:showModal="isShowModalEditWarning"></ModalEditWarning>
            <ModalDeleteMultiSelect
                v-model:showModal="isShowModalDeleteSelectWarning"
                :numberDelete="selectedRowKeys.length"
            ></ModalDeleteMultiSelect>
        </div>
    </template>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, onMounted, reactive, computed } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import Select from '@/components/ui/SelectComponent.vue';
import SelectPanel from '@/components/ui/SelectPanel.vue';
import DatePicker from '@/components/ui/DatePickerComponent/index.vue';
import { useUser } from '@/modules/auth/composables/useUser';
import NewTableComponent from '@/components/ui/NewTableComponent.vue';
import { columnItem } from '@/types/table';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import filters from '@/utils/filters';
import InputComp from '@/components/ui/InputComponent.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import { useArticle } from '../composables/useArticle';
import SkeletonList from '../components/ArticleListSkeleton.vue';
import BadgeChip from '@/components/ui/BadgeChipComponent.vue';
import SkeletonTable from '../components/ArticleListSkeletonTable.vue';
import debounce from 'lodash/debounce';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import CaretDown from '@/components/icons/CaretDown.vue';
import ModalLimit from '../components/ArticleModalLimit.vue';
import { useRouter } from 'vue-router';
import ModalDelete from '../components/ArticleModalDeleteMulti.vue';
import ModalEditWarning from '../components/ArticleModalDeleteMultiEditWarning.vue';
import ModalDeleteMultiSelect from '../components/ArticleModalDeleteMultiSelectWarning.vue';

interface DateFormat {
    start: string | null;
    end: string | null;
}

export default defineComponent({
    name: 'Articles',
    components: {
        ButtonComponent,
        IconComp,
        Select,
        SelectPanel,
        DatePicker,
        NewTableComponent,
        TooltipComponent,
        InputComp,
        AvatarComponent,
        SkeletonList,
        BadgeChip,
        SkeletonTable,
        SkeletonBox,
        CaretDown,
        ModalLimit,
        ModalDelete,
        ModalEditWarning,
        ModalDeleteMultiSelect,
    },
    setup() {
        const searchValue = ref<string>('');
        const valueSelectUser = ref<string | null>(null);
        const optionSelectUser = ref<any>([]);
        const { userList } = useUser();
        const selectedRowKeys = ref<any>([]);
        const isLoadMore = ref(false);
        const next_page = ref<any>(null);
        const articleList = ref<any>([]);
        const envURL = process.env.VUE_APP_FILE_URL;
        const { getArticleBySearch, deleteMultiArticleById, loading, getArticleById, createArticleRes } = useArticle();
        const checkValueArticleEmpty = ref<boolean>(false);
        const dateValue = ref<DateFormat>({
            start: null,
            end: null,
        });
        const total = ref<number>(0);
        const sortBy = reactive({
            name: 'updated_at',
            type: 'desc',
        });
        const status = ref<string>('init');
        const isSearchText = ref<boolean>(false);
        const isSearchFilter = ref<any>([]);
        const isSearchByEnter = ref<boolean>(false);
        const isHoverSortIcon = ref({});
        const isShowModalLimit = ref<boolean>(false);
        const isShowModalDelete = ref<boolean>(false);
        const isShowModalEditWarning = ref<boolean>(false);
        const isShowModalDeleteSelectWarning = ref<boolean>(false);
        const router = useRouter();

        const defaultColumns: columnItem[] = [
            {
                title: 'Title',
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
                title: 'Status',
                dataIndex: 'status',
                slots: {
                    title: 'statusTitle',
                },
                scopedSlots: { customRender: 'status' },
                minWidth: '96px',
            },
            {
                title: 'Collection',
                dataIndex: 'collection',
                slots: {
                    title: 'collectionTitle',
                },
                scopedSlots: { customRender: 'collection' },
                minWidth: '140px',
            },
            {
                title: 'Section',
                dataIndex: 'section',
                slots: {
                    title: 'sectionTitle',
                },
                scopedSlots: { customRender: 'section' },
                minWidth: '140px',
            },
            {
                title: 'Updated by',
                dataIndex: 'updated_by',
                slots: {
                    title: 'updated_byTitle',
                },
                scopedSlots: { customRender: 'updated_by' },
                minWidth: '140px',
                maxWidth: '140px',
            },
            {
                title: 'Last updated',
                dataIndex: 'last_updated',
                slots: {
                    title: 'last_updatedTitle',
                },
                scopedSlots: { customRender: 'last_updated' },
                minWidth: '160px',
                maxWidth: '160px',
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

        const onSelectChange = (selectedRowKeysChange: any) => {
            selectedRowKeys.value = selectedRowKeysChange;
        };

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
                    if (name[0].avatar_src != null) {
                        return envURL + '/' + name[0].avatar_src;
                    } else {
                        return 'null';
                    }
                }
            } else {
                return '';
            }
        };

        const refreshData = () => {
            next_page.value = null;
            total.value = 0;
            articleList.value = [];
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

        const onSearchArticle = async () => {
            const sort_by = sortBy.type != '' ? `${sortBy.name}.${sortBy.type}` : null;
            const data = await getArticleBySearch({
                q: searchValue.value,
                updated_at_from: dateValue.value.start,
                updated_at_to: dateValue.value.end,
                updated_by: valueSelectUser.value,
                next_page: next_page.value,
                sort_by: sort_by,
            });

            articleList.value = [...articleList.value, ...data.data];
            total.value = data.total;
            next_page.value = data.next_page;
            if (status.value == 'init' || status.value == 'delete') {
                if (articleList.value.length === 0) checkValueArticleEmpty.value = true;
                else checkValueArticleEmpty.value = false;
            }
        };

        const convertStatus = (val: number) => {
            if (val === 1) return 'Published';
            else return 'Draft';
        };

        const onScrollToBottom = async () => {
            status.value = 'loading';
            if (next_page.value && !isLoadMore.value) {
                isLoadMore.value = true;
                await onSearchArticle();
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
            status.value = 'sort';
            if (searchValue.value === '') {
                isSearchText.value = false;
            } else {
                isSearchText.value = true;
            }
            refreshData();
            isSearchByEnter.value = true;
            onSearchArticle();
        }, 0);

        const onChangeSelectUpdate = debounce(e => {
            status.value = 'sort';
            isSearchText.value = false;
            if (valueSelectUser.value == null) filterFlag('auth', false);
            else {
                filterFlag('auth', true);
            }
            refreshData();
            onSearchArticle();
        }, 0);

        const onChangeDate = (val: any) => {
            status.value = 'sort';
            isSearchText.value = false;
            if (val != null) {
                dateValue.value = {
                    start: convertDate(val.start),
                    end: convertDate(val.end),
                };
                filterFlag('date', true);
            } else {
                dateValue.value = {
                    start: null,
                    end: null,
                };
                filterFlag('date', false);
            }
            refreshData();
            onSearchArticle();
        };

        const handleSeachContactWithNewSort = debounce(() => {
            refreshData();
            onSearchArticle();
        }, 200);

        const onClickSort = (sortName: any) => {
            status.value = 'sort';
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

        const checkLimitCreate = async () => {
            try {
                const res = await createArticleRes({ check: true });
                router.push({ name: 'ArticleCreate' });
            } catch (e) {
                const errorKey = Object.keys(e)[0];
                if (errorKey === 'reach_limit') isShowModalLimit.value = true;
            }
        };

        const articleFilters = computed(() => {
            return {
                q: searchValue.value,
                updated_at_from: dateValue.value.start,
                updated_at_to: dateValue.value.end,
                updated_by: valueSelectUser.value,
            };
        });

        const deleteMulti = async () => {
            try {
                if (selectedRowKeys.value.length > 0) {
                    const res = await deleteMultiArticleById(true, { ids: selectedRowKeys.value });
                } else {
                    const res = await deleteMultiArticleById(true, { filters: articleFilters.value });
                }
                isShowModalDelete.value = true;
            } catch (e) {
                const errorKey = Object.keys(e)[0];
                if (errorKey == 'ids_not_exist') isShowModalDeleteSelectWarning.value = true;
            }
        };

        const submitDelete = async (val: boolean) => {
            refreshData();
            await onSearchArticle();
        };

        const checkArticleDetail = async (val: string) => {
            try {
                const res = await getArticleById(val, { check: true });
                router.push({
                    name: 'ArticleEdit',
                    params: {
                        id: val,
                    },
                });
            } catch (e) {
                const errorKey = Object.keys(e)[0];
                if (errorKey == 'not_found') isShowModalEditWarning.value = true;
            }
        };

        onMounted(async () => {
            await onSearchArticle();
            optionSelectUser.value = [...userList.value];
        });

        watch(
            () => valueSelectUser.value,
            (newVal: any) => {
                if (newVal === '') {
                    valueSelectUser.value = null;
                    filterFlag('auth', false);
                    refreshData();
                    onSearchArticle();
                }
            },
        );

        watch(
            searchValue,
            debounce((newVal: any) => {
                status.value = 'sort';
                if (newVal) {
                    if (!isSearchByEnter.value) {
                        refreshData();
                        onSearchArticle();
                    } else {
                        isSearchByEnter.value = false;
                    }
                    isSearchText.value = true;
                } else {
                    isSearchText.value = false;
                    refreshData();
                    onSearchArticle();
                }
            }, 1000),
        );

        return {
            searchValue,
            valueSelectUser,
            optionSelectUser,
            selectedRowKeys,
            onSelectChange,
            isLoadMore,
            next_page,
            columns,
            articleList,
            filters,
            convertNameUpdate,
            convertBgAvatar,
            convertImgAvatar,
            envURL,
            onSearchArticle,
            dateValue,
            total,
            loading,
            convertStatus,
            onScrollToBottom,
            refreshData,
            sortBy,
            status,
            onChangeSelectUpdate,
            onChangeDate,
            checkValueArticleEmpty,
            isSearchText,
            onEnterSearch,
            isSearchFilter,
            isSearchByEnter,
            onClickSort,
            mouseOverSortIcon,
            isHoverSortIcon,
            isShowModalLimit,
            checkLimitCreate,
            deleteMulti,
            isShowModalDelete,
            submitDelete,
            articleFilters,
            checkArticleDetail,
            isShowModalEditWarning,
            isShowModalDeleteSelectWarning,
        };
    },
});
</script>

<style lang="scss">
.article {
    &__button {
        width: 20%;
        margin-right: 8px;
        .custom-select-component {
            max-width: 100%;
        }
    }
    &__search {
        width: calc(100% - 40% - 8px);
        margin-right: 8px;
    }
    &__empty {
        top: 30%;
        left: 50%;
        transform: translate(-50%, -30%);
    }
    .table-component {
        .update_by {
            width: calc(100% - 32px);
        }
    }
}
@media (max-width: 1440px) {
    .article {
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
.article__data-table {
    max-height: calc(100vh - 252px);
    overflow: auto;
}
</style>
