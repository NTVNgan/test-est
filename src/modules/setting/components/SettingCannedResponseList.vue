<template>
    <div class="canned-response pb-24p pt-14p px-40p h-full w-full relative">
        <template
            v-if="
                status !== 'init' &&
                    cannedResponses.length === 0 &&
                    isSearchText === false &&
                    isSearchFilter.length === 0 &&
                    isLoading === false &&
                    isSearchByCate === false
            "
        >
            <div class="canned-response__empty relative top-30% h-full w-full flex flex-col items-center z-1 bg-white">
                <img class="logo mx-auto w-120 h-120" src="../images/attribute-empty.svg" alt="banner" />
                <div class="text-center">
                    <span class="font-bold block">{{ $t('setting.canned_response_empty_data_header') }}</span>
                    <span class="text-neutrals-400 text-14 mt-4p block">
                        {{ $t('setting.canned_response_empty_data_body') }}
                    </span>
                    <span class="block mt-12p">
                        <button-component
                            class="ml-auto"
                            type="primary"
                            size="medium"
                            @click="$router.push({ name: 'CannedResponseCreate' })"
                        >
                            <icon-comp class="mr-4p" name="plus" color="white"></icon-comp>
                            {{ $t('setting.canned_response_btn_create') }}
                        </button-component>
                    </span>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="flex mb-16p">
                <button-component
                    class="ml-auto"
                    type="primary"
                    size="medium"
                    @click="$router.push({ name: 'CannedResponseCreate' })"
                >
                    <icon-comp class="mr-4p" name="plus" color="white"></icon-comp>
                    {{ $t('setting.canned_response_btn_create') }}
                </button-component>
            </div>
            <div class="flex justify-between items-center">
                <div class="canned-response__search">
                    <input-comp
                        class="flex-grow"
                        closeIcon
                        placeholder="Search canned response"
                        v-model="searchValue"
                        v-on:keyup.enter="onEnterSearch"
                    >
                        <template v-slot:prefix>
                            <icon-comp name="search"></icon-comp>
                        </template>
                    </input-comp>
                </div>
                <div class="canned-response__button min-w-160">
                    <Select
                        v-model="valueSelectCategory"
                        showSearch
                        maxHeightList="240px"
                        @change="onChangeSelectCategory"
                        :titleDefault="titleCategoryFilterDefault"
                        @callData="onCallCateBySearch"
                        :loadMore="true"
                        :showTitleDefault="showTitleDefault"
                        :showTooltipSelectName="true"
                        placeholder="Search category"
                        :minWidth="'258px'"
                    >
                        <SelectPanel
                            v-for="(index, i) in categoriesSearched"
                            :key="i"
                            :value="index.id"
                            :selectedLabel="index.name"
                        >
                            {{ index.name }}
                        </SelectPanel>
                    </Select>
                </div>
                <div class="canned-response__date">
                    <date-picker
                        type="range"
                        :dropdown="true"
                        :columns="2"
                        @onChange="onChangeDate"
                        :placeholder="'Last updated'"
                    />
                </div>
                <div class="canned-response__button min-w-160" v-if="optionSelect.length">
                    <Select
                        v-model="valueSelectAuth"
                        titleDefault="Updated by"
                        showSearch
                        maxHeightList="240px"
                        @change="onChangeSelect"
                        placeholder="Search teammate"
                        :minWidth="'258px'"
                    >
                        <SelectPanel v-for="(index, i) in optionSelect" :key="i" :value="index._id">{{
                            index.username
                        }}</SelectPanel>
                    </Select>
                </div>
                <div class="canned-response__button min-w-160" v-if="optionSelectAvailableFor.length">
                    <Select
                        v-model="valueSelectAvailableFor"
                        showSearch
                        titleDefault="Available for"
                        maxHeightList="240px"
                        @change="onChangeSelectAvailableFor"
                        placeholder="Search subject"
                        :minWidth="'190px'"
                    >
                        <SelectPanel v-for="(index, i) in optionSelectAvailableFor" :key="i" :value="index.key">{{
                            index.name
                        }}</SelectPanel>
                    </Select>
                </div>
            </div>
            <div v-if="!isLoading" class="flex items-center mb-10p mt-20p">
                <span class="text-14 text-neutrals-500">
                    <template v-if="selectedRowKeys.length > 0">
                        <span class="font-medium text-neutrals-900">{{ selectedRowKeys.length }}</span>
                        {{ selectedRowKeys.length > 1 ? `canned responses` : `canned response` }}
                        selected of <span class="font-medium">{{ total }}</span>
                    </template>
                    <template v-else>
                        <span class="font-medium text-neutrals-900">{{ total }}</span>
                        {{ total > 1 ? `canned responses` : `canned response` }}
                    </template>
                    {{ isSearchFilter.length > 0 ? 'matched' : '' }}
                </span>
                <button-component
                    v-if="cannedResponses.length !== 0"
                    class="ml-16p"
                    type="secondary"
                    @click="clickChangeCategory"
                >
                    {{ $t('setting.canned_response_btn_change_category') }}
                </button-component>
                <button-component
                    v-if="cannedResponses.length !== 0"
                    class="ml-16p font-medium"
                    type="destructive-sublte"
                    @click="clickDeleteCategory"
                >
                    {{ $t('setting.canned_response_btn_delete') }}
                </button-component>
            </div>
            <div v-else class="flex items-center mb-26p mt-28p">
                <span class="text-14 text-neutrals-500">
                    <skeleton-box width="72px" :classBgColor="'bg-neutrals-100'" />
                </span>
            </div>
            <template v-if="cannedResponses.length !== 0 || isLoading">
                <new-table-component
                    class="canned-response__data-table"
                    :loading="!next_page && isLoading"
                    :columns="columns"
                    :data-source="cannedResponses"
                    keyData="id"
                    :nextPage="next_page"
                    :loadingRow="isLoadMore"
                    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    :scrollToBottom="onScrollToBottom"
                    tableLayout="auto"
                >
                    <template v-slot:loading>
                        <SettingCannedResponseTableSkeletonComponent />
                    </template>
                    <template v-slot:name="{ record }">
                        <div
                            @click="
                                $router.push({
                                    name: 'CannedResponseEdit',
                                    params: {
                                        id: record.id,
                                    },
                                })
                            "
                            class="cursor-pointer"
                        >
                            <div class="inline-block text-left flex flex-col text-14 attribute-description">
                                <span class="truncate font-medium">{{ record.name }}</span>
                                <span class="truncate font-normal" v-html="formatContent(record.content)"></span>
                            </div>
                            <div class="truncate border-radius-4">
                                <span class="bg-neutrals-100 text-12 tag-content font-normal truncate "
                                    >/{{ record.shortcut }}</span
                                >
                            </div>
                        </div>
                    </template>
                    <template v-slot:category="{ record }">
                        <span class>{{ record.cate_name }}</span>
                    </template>
                    <template v-slot:updated_at="{ record }">
                        <span>{{ filters.formatTime(record.updated_at) }}</span>
                    </template>
                    <template v-slot:updated_by="{ record }">
                        <div class="whitespace-nowrap overflow-hidden flex items-center" v-if="record._auid">
                            <avatar-component
                                v-if="convertImgAvatar(record._auid) === 'null'"
                                :labelShow="false"
                                :bgAvatar="convertBgAvatar(record._auid)"
                                :label-avatar="convertNameUpdate(record._auid)"
                                size="xs"
                            />
                            <avatar-component
                                v-else
                                :labelShow="false"
                                :bgAvatar="convertBgAvatar(record._auid)"
                                :label-avatar="convertNameUpdate(record._auid)"
                                :image="convertImgAvatar(record._auid)"
                                size="xs"
                            />
                            <span class="truncate text-14 ml-12p update_by">{{ convertNameUpdate(record._auid) }}</span>
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
                    <template v-slot:updated_atTitle>
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
                            <span> Last updated </span>
                        </div>
                    </template>
                    <template v-slot:used_countTitle>
                        <div
                            @click="onClickSort('used_count')"
                            class="cursor-pointer hover:text-primary-500"
                            @mouseover="mouseOverSortIcon({ value: true, type: 'used_count' })"
                            @mouseleave="mouseOverSortIcon({ value: false, type: 'used_count' })"
                        >
                            <caret-down
                                v-if="sortBy.name !== 'used_count' || (sortBy.name == 'used_count' && !sortBy.type)"
                                class="inline-block mr-8p icon-svg fill-current"
                                :class="
                                    isHoverSortIcon.value && isHoverSortIcon.type == 'used_count'
                                        ? 'text-primary-500'
                                        : ''
                                "
                            ></caret-down>
                            <icon-comp
                                v-else-if="sortBy.name === 'used_count'"
                                class="inline-block mr-8p"
                                :name="`sort-${sortBy.type}`"
                                color="primary-500"
                            ></icon-comp>
                            <span> Usage </span>
                        </div>
                    </template>
                    <template v-slot:available_ids="{ record }">
                        <span>
                            {{
                                record.available_everyone
                                    ? 'Everyone'
                                    : !record.available_ids || record.available_ids.length === 0
                                    ? ''
                                    : checkAvailable(record.available_ids)
                            }}
                        </span>
                    </template>
                    <template v-slot:used_count="{ record }">
                        <span>{{ record.used_count.toLocaleString() }}</span>
                    </template>
                </new-table-component>
            </template>
            <template
                v-if="!isLoading && cannedResponses.length === 0 && isSearchFilter.length > 0 && !isSelectCateDeleted"
            >
                <div class="flex items-center mb-10p mt-100p h-full w-full flex flex-col items-center bg-white">
                    <img class="logo mx-auto w-120 h-120" src="../images/nodata-search.svg" alt="banner" />
                    <div class="text-center">
                        <span class="text-neutrals-400 text-16 block">
                            <span class="flex items-center text-neutrals-900">
                                {{ $t('setting.canned_response_find_no_data') }}<br />
                                {{ $t('setting.canned_response_please_again') }}
                            </span>
                        </span>
                    </div>
                </div>
            </template>
            <template v-else-if="!isLoading && isSelectCateDeleted">
                <div class="flex items-center mb-10p mt-100p h-full w-full flex flex-col items-center bg-white">
                    <img class="logo mx-auto w-120 h-120" src="../images/cate-deleted.png" alt="banner" />
                    <div class="text-center">
                        <span class="text-neutrals-400 text-16 block">
                            <span class="flex items-center text-neutrals-900">
                                The chosen category has been deleted.<br />
                                Please try another category.
                            </span>
                        </span>
                    </div>
                </div>
            </template>
            <template
                v-else-if="
                    !isLoading &&
                        cannedResponses.length === 0 &&
                        isSearchFilter.length === 0 &&
                        isSearchText === true &&
                        !isSelectCateDeleted
                "
            >
                <div class="flex items-center mb-10p mt-100p h-full w-full flex flex-col items-center bg-white">
                    <img class="logo mx-auto w-120 h-120" src="../images/nodata-search.svg" alt="banner" />
                    <div class="text-center max-w-full">
                        <span class="text-neutrals-400 text-16 block">
                            <span class="flex items-center text-neutrals-900 truncate">
                                {{ $t('setting.canned_response_find_text_no_data') }} “{{ searchValue }}”
                            </span>
                            <span class="text-neutrals-900">{{
                                $t('setting.canned_response_please_again_keyword')
                            }}</span>
                        </span>
                    </div>
                </div>
            </template>
            <SettingCannedResponseModalDelete
                v-model:showModal="isShowModalDelete"
                :cannedResponses="selectedRowKeys"
                :count="selectedRowKeys.length"
                :searchValue="searchValue"
                :valueSelectAuth="valueSelectAuth"
                :updated_from="dateValue.start"
                :updated_to="dateValue.end"
                :available="valueSelectAvailableFor === 666 ? '' : valueSelectAvailableFor"
                :valueSelectCategory="valueSelectCategory"
                :countFilter="total"
                :available_everyone="valueSelectAvailableFor === null ? null : valueSelectAvailableFor === 666"
                @close="() => (isShowModalDelete = false)"
                @submitDelete="submitDelete"
            ></SettingCannedResponseModalDelete>
            <SettingCannedResponseModalChangeCategory
                v-model:showModal="isShowModalChangeCategory"
                :cannedResponses="selectedRowKeys"
                :count="selectedRowKeys.length"
                :searchValue="searchValue"
                :valueSelectAuth="valueSelectAuth"
                :updated_from="dateValue.start"
                :updated_to="dateValue.end"
                :available="valueSelectAvailableFor === 666 ? '' : valueSelectAvailableFor"
                :available_everyone="valueSelectAvailableFor === null ? null : valueSelectAvailableFor === 666"
                :valueSelectCategory="valueSelectCategory"
                :countFilter="total"
                @close="() => (isShowModalChangeCategory = false)"
                @submitChangeCategory="submitChangeCategory"
                @submitChangeCategoryError="submitChangeCategoryError"
            ></SettingCannedResponseModalChangeCategory>
            <SettingCannedResponseModalChangeCategoryError
                v-model:showModal="isShowModalChangeCategoryError"
                :cannedResponses="selectedRowKeys"
                :count="selectedRowKeys.length"
                :searchValue="searchValue"
                :valueSelectAuth="valueSelectAuth"
                :updated_from="dateValue.start"
                :updated_to="dateValue.end"
                :available="valueSelectAvailableFor === 666 ? '' : valueSelectAvailableFor"
                :available_everyone="valueSelectAvailableFor === null ? null : valueSelectAvailableFor === 666"
                :valueSelectCategory="valueSelectCategory"
                :countFilter="total"
                @close="() => (isShowModalChangeCategory = false)"
                @submitChangeCategory="submitChangeCategory"
                @submitChangeCategoryError="submitChangeCategoryError"
            ></SettingCannedResponseModalChangeCategoryError>
        </template>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import InputComp from '@/components/ui/InputComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import Select from '@/components/ui/SelectComponent.vue';
import SelectPanel from '@/components/ui/SelectPanel.vue';
import NewTableComponent from '@/components/ui/NewTableComponent.vue';
import { columnItem } from '@/types/table';
import DatePicker from '@/components/ui/DatePickerComponent/index.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import { useUser } from '@/modules/auth/composables/useUser';
import filters from '@/utils/filters';
import debounce from 'lodash/debounce';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import { useCannedResponse } from '@/modules/setting/composables/useCannedResponse';
import CaretDown from '@/components/icons/CaretDown.vue';
import { store } from '@/store';
import SettingCannedResponseModalDelete from '@/modules/setting/components/SettingCannedResponseModalDelete.vue';
import SettingCannedResponseModalChangeCategory from '@/modules/setting/components/SettingCannedResponseModalChangeCategory.vue';
import SettingCannedResponseModalChangeCategoryError from '@/modules/setting/components/SettingCannedResponseModalChangeCategoryError.vue';
import SettingCannedResponseTableSkeletonComponent from './SettingCannedResponseTableSkeletonComponent.vue';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import { useRouter } from 'vue-router';
import { useSocket } from '@/composables/useSocket';

interface DateFormat {
    start: string | null;
    end: string | null;
}

export default defineComponent({
    name: 'SettingCannedResponseList',
    components: {
        InputComp,
        IconComp,
        ButtonComponent,
        Select,
        SelectPanel,
        NewTableComponent,
        DatePicker,
        AvatarComponent,
        SettingCannedResponseTableSkeletonComponent,
        CaretDown,
        SettingCannedResponseModalDelete,
        SettingCannedResponseModalChangeCategory,
        SkeletonBox,
        SettingCannedResponseModalChangeCategoryError,
        // TooltipComponent,
    },
    props: {
        tabCR: {
            type: Number,
            default: 0,
        },
        tabActive: {
            type: String,
            default: ''
        }
    },
    setup(props: any) {
        const valueSelectAuth = ref<string | null>(null);
        const valueSelectCategory = ref<any>(null);
        const searchValue = ref<string>('');
        const titleCategoryFilterDefault = ref<string>('Category');
        const showTitleDefault = ref(false);
        const dateValue = ref<DateFormat>({
            start: null,
            end: null,
        });
        const { userList } = useUser();
        const next_page = ref<any>(null);
        const isLoadMore = ref(false);
        const isLoading = ref(false);
        const selectedRowKeys = ref<any>([]);
        const status = ref<string>('init');
        const envURL = process.env.VUE_APP_FILE_URL;
        const isHoverSortIcon = ref({});
        const isSearchText = ref<boolean>(false);
        const isShowModalDelete = ref<boolean>(false);
        const isShowModalChangeCategory = ref<boolean>(false);
        const isShowModalChangeCategoryError = ref<boolean>(false);
        const isSearchFilter = ref<any>([]);
        const isSearchByEnter = ref<boolean>(false);
        const isSearchByCate = ref<boolean>(false);
        const isSelectCateDeleted = ref<boolean>(false);
        const optionSelect = ref<any>([]);
        const valueSelectAvailableFor = ref<string | null | number>(null);
        const user = computed(() => store.state.auth.user);
        const optionSelectAvailableFor = ref<any>([
            {
                name: 'Everyone',
                key: 666,
            },
            {
                name: 'Myself only',
                key: user.value._id,
            },
        ]);
        const defaultColumns: columnItem[] = [
            {
                title: 'Canned Response',
                dataIndex: 'name',
                slots: {
                    title: 'nameTitle',
                },
                scopedSlots: { customRender: 'name' },
                width: '100%',
                minWidth: '290px',
                maxWidth: '290px',
            },
            {
                title: 'Category',
                dataIndex: 'category',
                slots: {
                    title: 'categoryTitle',
                },
                scopedSlots: { customRender: 'category' },
                width: '100%',
                minWidth: '160px',
                maxWidth: '160px',
            },
            {
                title: 'Last updated',
                dataIndex: 'updated_at',
                slots: {
                    title: 'updated_atTitle',
                },
                scopedSlots: { customRender: 'updated_at' },
                width: '100%',
                minWidth: '160px',
                maxWidth: '160px',
            },
            {
                title: 'Updated by',
                dataIndex: 'updated_by',
                slots: {
                    title: 'updated_byTitle',
                },
                scopedSlots: { customRender: 'updated_by' },
                width: '100%',
                minWidth: '160px',
                maxWidth: '160px',
            },
            {
                title: 'Available for',
                dataIndex: 'available_ids',
                slots: {
                    title: 'nameCategory1Title',
                },
                scopedSlots: { customRender: 'available_ids' },
                width: '100%',
                minWidth: '160px',
                maxWidth: '160px',
            },
            {
                title: 'Usage',
                dataIndex: 'used_count',
                slots: {
                    title: 'used_countTitle',
                },
                scopedSlots: { customRender: 'used_count' },
                minWidth: '99px',
                maxWidth: '99px',
            },
        ];
        const columns = ref<columnItem[]>(defaultColumns);
        const {
            cannedResponses,
            getCannedResponse,
            searchCategory,
            cateDeleted,
            getCategoryById,
        } = useCannedResponse();
        const contactAttributeShow = ref<any>([]);
        const contactAttributeHidden = ref<any>([]);
        const total = ref<number>(0);
        const sortBy = reactive({
            name: '',
            type: '',
        });
        const categoriesSearched = ref<Array<any>>([]);
        const next_page_category = ref<any>(null);
        const { socket } = useSocket();

        socket.on('canrescat.delete.complete', (data: any) => {
            cateDeleted.value.push(data.data.category_id);
        });

        const checkAvailable = computed(() => {
            return (data: any) => {
                if (typeof user.value._id === 'undefined') return '';
                const findUser = data.findIndex((available: any) => available.id === user.value._id);
                if (findUser > -1) return 'Myself only';
                return '';
            };
        });
        const router = useRouter();

        const formatContent = computed(() => {
            return (content: any) => {
                if (typeof content === 'object') return '';
                const iconImage =
                    ' <svg class="inline-block" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M15.6875 5.25H4.3125C3.57422 5.25 3 5.85156 3 6.5625V14.4375C3 15.1758 3.57422 15.75 4.3125 15.75H15.6875C16.3984 15.75 17 15.1758 17 14.4375V6.5625C17 5.85156 16.3984 5.25 15.6875 5.25ZM4.48965 8.16394C4.48965 7.42614 5.05977 6.82248 5.83111 6.82248C6.56892 6.82248 7.17258 7.42614 7.17258 8.16394C7.17258 8.93528 6.56892 9.5054 5.83111 9.5054C5.05977 9.5054 4.48965 8.93528 4.48965 8.16394ZM5.26829 14.1776C4.99215 14.1776 4.76829 13.9537 4.76829 13.6776V12.5678L6.07621 11.2599C6.2439 11.0922 6.47865 11.0922 6.64634 11.2599L7.9878 12.5678L11.9787 8.57697C12.1463 8.40929 12.3811 8.40929 12.5488 8.57697L15.5 11.4947V13.6776C15.5 13.9537 15.2761 14.1776 15 14.1776H5.26829Z" fill="#828292"/>\n' +
                    '</svg> ';
                let res = content
                    .replaceAll('&lt;', '<')
                    .replaceAll('&gt;', '>')
                    .replaceAll('<br>', '');
                res = res
                    .replace(/<svg[^>]*>/g, '')
                    .replace(/<path[^>]*>/g, '')
                    .replace(/<br[^>]*>/g, '')
                    .replace(/<p[^>]*>/g, '')
                    .replace(/<\/svg[^>]*>/g, '')
                    .replace(/<\/p[^>]*>/g, '')
                    .replace(/<\/path[^>]*>/g, '')
                    .replace(/<img[^>]*>/g, '<has<img>>')
                    .replace(/<div[^>]*>/g, '')
                    .replace(/<\/div[^>]*>/g, '');

                return res.replace(/(<has<img>>)\1+/g, '$1').replace(/<has<img>>/g, iconImage);
            };
        });

        const onSelectChange = (selectedRowKeysChange: any) => {
            selectedRowKeys.value = selectedRowKeysChange;
        };

        const checkZero = (val: any) => {
            if (val.toString().length == 1) {
                val = '0' + val;
            }
            return val;
        };

        const refreshData = () => {
            status.value = 'init';
            next_page.value = null;
            total.value = 0;
            cannedResponses.value = [];
            selectedRowKeys.value = [];
        };

        const onSearchCannedResponse = async function() {
            const sort_by = sortBy.type != '' ? `${sortBy.name}.${sortBy.type}` : '';
            isLoading.value = true;
            const data = await getCannedResponse({
                q: searchValue.value,
                sort_by,
                updated_by: valueSelectAuth.value,
                cat_id: valueSelectCategory.value,
                updated_at_from: dateValue.value.start,
                updated_at_to: dateValue.value.end,
                next_page: next_page.value,
                available: valueSelectAvailableFor.value === 666 ? '' : valueSelectAvailableFor.value,
                available_everyone:
                    valueSelectAvailableFor.value === null ? null : valueSelectAvailableFor.value === 666,
            });
            isLoading.value = false;
            cannedResponses.value = [...cannedResponses.value, ...data.data];
            total.value = data.total;
            next_page.value = data.next_page;
            status.value = 'done';
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

        const onScrollToBottom = async () => {
            if (next_page.value && !isLoadMore.value) {
                status.value = 'load';
                isLoadMore.value = true;
                await onSearchCannedResponse();
                isLoadMore.value = false;
            }
        };

        const mouseOverSortIcon = (value: { type: string; value: boolean }) => {
            isHoverSortIcon.value = value;
        };

        const handleSeachContactWithNewSort = debounce(() => {
            refreshData();
            onSearchCannedResponse();
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

        const onEnterSearch = debounce(e => {
            status.value = 'search';
            if (searchValue.value === '') {
                isSearchText.value = false;
            } else {
                isSearchText.value = true;
            }
            refreshData();
            isSearchByEnter.value = true;
            onSearchCannedResponse();
        }, 0);

        const onCallCateBySearch = async (val: any) => {
            console.log(val);
            if (!val.push) {
                categoriesSearched.value = [];
                next_page_category.value = null;
                const data = await searchCategory({ q: val.text, next_page: next_page_category.value, type: 3 });
                const dataNo = await searchCategory({ q: val.text, next_page: next_page_category.value, type: 1 });
                if (!data.error) {
                    next_page_category.value = data.next_page;
                    if (val.push) {
                        categoriesSearched.value = [...categoriesSearched.value, ...data.data];
                    } else {
                        // categoriesSearched.value = data.data;
                        categoriesSearched.value = dataNo.data.concat(categoriesSearched.value);
                        categoriesSearched.value = [...categoriesSearched.value, ...data.data];
                    }
                }
            } else {
                if (next_page_category.value == null) return;
                const data = await searchCategory({ q: val.text, next_page: next_page_category.value, type: 3 });
                if (!data.error) {
                    next_page_category.value = data.next_page;
                    // if (val.push) categoriesSearched.value = [...categoriesSearched.value, ...data.data];
                    // else categoriesSearched.value = data.data;
                    categoriesSearched.value = [...categoriesSearched.value, ...data.data];
                }
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

        const onChangeSelect = debounce(e => {
            status.value = 'search';
            isSearchText.value = false;
            if (valueSelectAuth.value == null) filterFlag('auth', false);
            else {
                filterFlag('auth', true);
                //isSearchText.value = true;
            }
            refreshData();
            onSearchCannedResponse();
        }, 0);

        const onChangeSelectCategory = debounce(e => {
            status.value = 'search';
            isSearchText.value = false;
            showTitleDefault.value = false;
            if (valueSelectCategory.value == null) filterFlag('cate', false);
            else {
                filterFlag('cate', true);
                //isSearchText.value = true;
            }
            refreshData();
            onSearchCannedResponse();
        }, 0);

        const onChangeSelectAvailableFor = debounce(e => {
            status.value = 'search';
            isSearchText.value = false;
            if (valueSelectAvailableFor.value == null) {
                filterFlag('availableFor', false);
            } else {
                filterFlag('availableFor', true);
            }
            refreshData();
            onSearchCannedResponse();
        }, 0);

        const convertDate = (val: Date) => {
            const day = val.getDate();
            const month = val.getMonth() + 1;
            const year = val.getFullYear();
            return year + '-' + checkZero(month) + '-' + checkZero(day);
        };

        const convertType = (val: number) => {
            switch (val) {
                case 1:
                    return 'Text';
                case 3:
                    return 'Date';
                case 5:
                    return 'Number';
                case 7:
                    return 'Boolean';
            }
        };

        const onChangeDate = (val: any) => {
            status.value = 'search';
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
            onSearchCannedResponse();
        };

        const clickChangeCategory = async () => {
            if (cateDeleted.value.length > 0 && valueSelectCategory.value != null) {
                const findCate = cateDeleted.value.findIndex((cate: any) => cate === valueSelectCategory.value);
                if (findCate > -1) isShowModalChangeCategoryError.value = true;
                else isShowModalChangeCategory.value = true;
            } else {
                isShowModalChangeCategory.value = true;
            }
        };

        const clickDeleteCategory = async () => {
            isShowModalDelete.value = true;
        };

        const submitDelete = async (numberDeleteRecord: any) => {
            isLoading.value = true;
            let timeOut = 500;
            if (numberDeleteRecord > 50) timeOut = 1000;
            if (numberDeleteRecord > 100) timeOut = 1500;
            if (numberDeleteRecord > 150) timeOut = 2300;
            if (numberDeleteRecord > 170) timeOut = 3000;
            if (numberDeleteRecord > 250) timeOut = 6000;
            if (numberDeleteRecord > 300) timeOut = 7000;
            if (numberDeleteRecord > 400) timeOut = 10000;
            await new Promise(resolve => setTimeout(resolve, timeOut));
            refreshData();
            await onSearchCannedResponse();
        };

        const submitChangeCategory = async (numberChangeRecord: any) => {
            isLoading.value = true;
            let timeOut = 500;
            if (numberChangeRecord > 50) timeOut = 1000;
            if (numberChangeRecord > 100) timeOut = 1500;
            if (numberChangeRecord > 150) timeOut = 2300;
            if (numberChangeRecord > 170) timeOut = 3000;
            if (numberChangeRecord > 250) timeOut = 6000;
            if (numberChangeRecord > 300) timeOut = 7000;
            if (numberChangeRecord > 400) timeOut = 10000;
            await new Promise(resolve => setTimeout(resolve, timeOut));
            refreshData();
            selectedRowKeys.value = [];
            await onSearchCannedResponse();
        };

        const submitChangeCategoryError = async (idsError: any) => {
            refreshData();
            await onSearchCannedResponse();
            // if (idsError.length > 0) {
            //     idsError.forEach((idError: any) => {
            //         const indexRow = selectedRowKeys.value.findIndex((s: any) => s === idError);
            //         if (indexRow > -1) selectedRowKeys.value.splice(indexRow, 1);
            //         const indexCR = cannedResponses.value.findIndex(
            //             (cannedResponse: any) => cannedResponse.id === idError,
            //         );
            //         if (indexCR > -1) cannedResponses.value.splice(indexCR, 1);
            //     });
            // }
        };

        const checkFilter = async () => {
            const queryData = router.currentRoute.value.query;
            if (queryData.cate_id && queryData.cate_id != '') {
                const cateDetail = await getCategoryById(queryData.cate_id);
                if (cateDetail.error) {
                    await router.push({ name: 'CannedResponses' });
                    location.reload();
                } else {
                    cateDetail.data.id = cateDetail.data._id;
                    const findCate = categoriesSearched.value.findIndex((cate: any) => cate.id === cateDetail.data._id);
                    if (findCate < 0) {
                        titleCategoryFilterDefault.value = cateDetail.data.name;
                        showTitleDefault.value = true;
                    }
                }
                filterFlag('cate', true);
                valueSelectCategory.value = queryData.cate_id;
                isSearchByCate.value = true;
            }
        };

        onMounted(async () => {
            await onCallCateBySearch({ text: '', push: false });
            await checkFilter();
            refreshData();
            await onSearchCannedResponse();
            optionSelect.value = [...userList.value];
        });

        watch(
            () => valueSelectAuth.value,
            (newVal: any) => {
                if (newVal === '') {
                    valueSelectAuth.value = null;
                    filterFlag('auth', false);
                    refreshData();
                    onSearchCannedResponse();
                }
            },
        );

        watch(
            () => valueSelectCategory.value,
            (newVal: any) => {
                isSelectCateDeleted.value = false;
                if (newVal === '') {
                    showTitleDefault.value = false;
                    titleCategoryFilterDefault.value = 'Category';
                    router.replace({ name: 'CannedResponses' });
                    valueSelectCategory.value = null;
                    isSearchByCate.value = false;
                    filterFlag('cate', false);
                    refreshData();
                    onSearchCannedResponse();
                } else {
                    router.replace({ name: 'CannedResponses', query: { cate_id: newVal } });
                    const findCate = cateDeleted.value.findIndex((cate: any) => cate === newVal);
                    if (findCate > -1) isSelectCateDeleted.value = true;
                }
            },
        );

        watch(
            () => valueSelectAvailableFor.value,
            (newVal: any) => {
                if (newVal === '') {
                    valueSelectAvailableFor.value = null;
                    filterFlag('availableFor', false);
                    refreshData();
                    onSearchCannedResponse();
                }
            },
        );

        watch(
            searchValue,
            debounce(newVal => {
                status.value = 'search';
                if (newVal) {
                    if (!isSearchByEnter.value) {
                        refreshData();
                        onSearchCannedResponse();
                    } else {
                        isSearchByEnter.value = false;
                        status.value = 'init';
                    }
                    isSearchText.value = true;
                } else {
                    isSearchText.value = false;
                    refreshData();
                    onSearchCannedResponse();
                }
            }, 2000),
        );

        watch(
            () => props.tabCR,
            () => {
                refreshData();
                onSearchCannedResponse();
            },
        );

        // watch(
        //     () => props.tabActive,
        //     async (val) => {
        //         if (props.tabActive === 'canned_responses'){
        //             refreshData();
        //             onSearchCannedResponse();
        //         }
        //     }
        // )

        return {
            filters,
            valueSelectAuth,
            valueSelectCategory,
            optionSelect,
            contactAttributeShow,
            contactAttributeHidden,
            columns,
            dateValue,
            onSelectChange,
            onChangeDate,
            searchValue,
            total,
            next_page,
            convertNameUpdate,
            isLoadMore,
            onScrollToBottom,
            onEnterSearch,
            refreshData,
            onChangeSelect,
            selectedRowKeys,
            clickChangeCategory,
            convertType,
            status,
            convertBgAvatar,
            convertImgAvatar,
            envURL,
            isHoverSortIcon,
            onClickSort,
            isSearchText,
            isSearchFilter,
            isSearchByEnter,
            cannedResponses,
            optionSelectAvailableFor,
            valueSelectAvailableFor,
            onChangeSelectAvailableFor,
            sortBy,
            mouseOverSortIcon,
            checkAvailable,
            onCallCateBySearch,
            categoriesSearched,
            onChangeSelectCategory,
            isShowModalDelete,
            isShowModalChangeCategory,
            isShowModalChangeCategoryError,
            clickDeleteCategory,
            submitDelete,
            submitChangeCategory,
            submitChangeCategoryError,
            isLoading,
            formatContent,
            isSearchByCate,
            titleCategoryFilterDefault,
            showTitleDefault,
            isSelectCateDeleted,
        };
    },
});
</script>

<style lang="scss">
.tag-content {
    padding: 3px 8px;
    border-radius: 4px;
}
.border-radius-4 {
    border-radius: 4px;
}
.canned-response {
    &__button {
        width: 20%;
        margin-right: 8px;
        &.loading {
            margin-right: 48px;
        }
        &:last-child {
            margin-right: 0;
        }
    }
    &__date {
        min-width: 240px;
        margin-right: 8px;
        &.loading {
            margin-right: 48px;
        }
        &:last-child {
            margin-right: 0;
        }
    }
    &__search {
        width: calc(100% - 40% - 8px);
        margin-right: 8px;
        &.loading {
            width: calc(100% - 40% - 48px);
            margin-right: 48px;
        }
    }
    &__table {
        .tab-content {
            tr {
                td:last-child {
                    text-overflow: inherit;
                }
            }
        }
        .update_by {
            width: 116px;
        }
        .attribute-description {
            width: calc(100% - 57px);
        }
    }
    .custom-select-component {
        max-width: 100%;
    }
    &__emty {
        transform: translate(-50%, -30%);
        height: max-content;
    }
}
@media (max-width: 1440px) {
    .canned-response {
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
.canned-response__data-table {
    max-height: calc(100vh - 361px);
    overflow: auto;
}
</style>
<style>
.canned-response__date div.selected {
    border-color: rgba(180, 180, 190, var(--border-opacity));
}
</style>
