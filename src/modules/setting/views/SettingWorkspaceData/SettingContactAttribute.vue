<template>
    <div class="contact-attribute py-24p px-40p h-full w-full relative">
        <template v-if="loading && status === 'init'">
            <SkeletonInit />
        </template>
        <template v-else>
            <template v-if="checkValueAttributeEmpty">
                <h2 class="text-24 font-heading font-semibold">{{ $t('setting.contact_attribute_title') }}</h2>
                <div
                    class="
                        contact-attribute__emty
                        h-full
                        w-full
                        flex flex-col
                        items-center
                        -mt-56p
                        absolute
                        top-30%
                        left-1/2
                        z-1
                        bg-white
                    "
                >
                    <img class="logo mx-auto w-120 h-120" src="../../images/attribute-empty.svg" alt="banner" />
                    <div class="text-center">
                        <span class="font-bold">{{ $t('common.data_table_empty_title') }}</span
                        ><br />
                        <span class="text-neutrals-400 text-14">
                            {{ $t('setting.contact_attribute_create_subtitle_empty') }}
                        </span>
                    </div>
                </div>
            </template>
            <template v-else>
                <h2 class="text-24 font-heading font-semibold">{{ $t('setting.contact_attribute_title') }}</h2>
                <div class="flex justify-between items-center my-24p">
                    <div class="contact-attribute__search">
                        <input-comp
                            class="flex-grow"
                            closeIcon
                            :placeholder="$t('setting.contact_attribute_placeholder_search')"
                            v-model="searchValue"
                            v-on:keyup.enter="onEnterSearch"
                        >
                            <template v-slot:prefix>
                                <icon-comp name="search"></icon-comp>
                            </template>
                        </input-comp>
                    </div>
                    <div class="contact-attribute__button">
                        <Select
                            v-model="valueSelect"
                            showSearch
                            maxHeightList="240px"
                            @change="onChangeSelect"
                            :titleDefault="$t('setting.contact_attribute_placeholder_select')"
                        >
                            <SelectPanel v-for="(index, i) in optionSelect" :key="i" :value="index._id">{{
                                index.username
                            }}</SelectPanel>
                        </Select>
                    </div>
                    <div class="contact-attribute__button">
                        <date-picker
                            type="range"
                            :dropdown="true"
                            :columns="2"
                            @onChange="onChangeDate"
                            :placeholder="$t('setting.contact_attribute_placeholder_date')"
                        />
                    </div>
                </div>
                <tab-component
                    class="contact-attribute__table h-full"
                    v-model="tab"
                    :tabs="tabs"
                    :loading="status === 'filter' && loading"
                    default-value="show"
                    type="underline"
                >
                    <template v-slot:loading>
                        <skeleton-box width="112px" />
                        <skeleton-box width="72px" class="mt-46p" />
                        <div class="pt-22p">
                            <SkeletonTable />
                        </div>
                    </template>
                    <div id="show" :class="[countAttributeShow == 0 ? 'h-screen	relative' : 'pt-22p']">
                        <div v-show="loading || contactAttributeShow.length !== 0">
                            <div class="flex items-center mb-10p">
                                <span class="text-14 text-neutrals-500">
                                    <template v-if="selectedRowKeys.length > 0">
                                        <span class="font-medium text-neutrals-900">{{ selectedRowKeys.length }}</span>
                                        {{ selectedRowKeys.length > 1 ? `attributes` : `attribute` }}
                                        selected of <span class="font-medium">{{ countAttributeShow }}</span>
                                    </template>
                                    <template v-else>
                                        <span class="font-medium text-neutrals-900">{{ countAttributeShow }}</span>
                                        {{ countAttributeShow > 1 ? `attributes` : `attribute` }}
                                    </template>
                                    <!-- {{ isSearchFilter ? 'match' : '' }} -->
                                    {{ isSearchFilter.length > 0 || isSearchText ? ' match' : '' }}
                                </span>
                                <button-component class="ml-16p" type="secondary" @click="hideAttribute"
                                    >Hide</button-component
                                >
                            </div>
                            <new-table-component
                                class="contacts-segment__data-table"
                                :loading="!next_page && loading"
                                :columns="columns"
                                :data-source="contactAttributeShow"
                                keyData="id"
                                :nextPage="next_page"
                                :loadingRow="isLoadMore"
                                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                                :scrollToBottom="onScrollToBottom"
                                tableLayout="auto"
                            >
                                <template v-slot:loading>
                                    <SkeletonTable />
                                </template>
                                <template v-slot:name="{ record }">
                                    <div class="inline-block text-left flex flex-col text-14 attribute-description">
                                        <span class="truncate font-medium">{{ record.name }}</span>
                                        <TooltipComponent
                                            showByTruncate
                                            type="light"
                                            position="top"
                                            :content="record.description"
                                            v-if="record.description"
                                        >
                                            <span class="truncate font-normal mt-2p">{{ record.description }}</span>
                                        </TooltipComponent>
                                    </div>
                                </template>
                                <template v-slot:type_name="{ record }">
                                    <span class>{{ convertType(record.datatype) }}</span>
                                </template>
                                <template v-slot:last_updated="{ record }">
                                    <span>{{ filters.formatTime(record.updated_at) }}</span>
                                </template>
                                <template v-slot:updated_by="{ record }">
                                    <div
                                        class="whitespace-nowrap overflow-hidden flex items-center"
                                        v-if="record._auid"
                                    >
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
                                        <span class="truncate text-14 ml-12p update_by">{{
                                            convertNameUpdate(record._auid)
                                        }}</span>
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
                                <template v-slot:action="{ record }">
                                    <TooltipComponent content="Edit" position="top">
                                        <button-component
                                            type="subtle"
                                            size="small"
                                            icon="pen"
                                            @click="onToggleEditEmail(record)"
                                        ></button-component>
                                    </TooltipComponent>
                                </template>

                                <template v-slot:last_updatedTitle>
                                    <div
                                        @click="onClickSort('updated_at')"
                                        class="cursor-pointer hover:text-primary-500"
                                        @mouseover="mouseOverSortIcon({ value: true, type: 'updated_at' })"
                                        @mouseleave="mouseOverSortIcon({ value: false, type: 'updated_at' })"
                                    >
                                        <caret-down
                                            v-if="
                                                sortBy.name !== 'updated_at' ||
                                                (sortBy.name == 'updated_at' && !sortBy.type)
                                            "
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
                            </new-table-component>
                        </div>
                        <template v-if="!loading && contactAttributeShow.length == 0 && isSearchFilter.length > 0">
                            <div
                                class="
                                    contact-attribute__emty
                                    h-full
                                    w-full
                                    flex flex-col
                                    items-center
                                    absolute
                                    top-30%
                                    left-1/2
                                    z-1
                                    bg-white
                                "
                            >
                                <img
                                    class="logo mx-auto w-120 h-120"
                                    src="../../images/nodata-search.svg"
                                    alt="banner"
                                />
                                <div class="text-center">
                                    <span class="text-16" v-html="$t('setting.contact_attribute_empty_filter')"></span>
                                </div>
                            </div>
                        </template>
                        <template
                            v-if="
                                !loading &&
                                contactAttributeShow.length == 0 &&
                                isSearchFilter.length === 0 &&
                                isSearchText == true
                            "
                        >
                            <div
                                class="
                                    contact-attribute__emty
                                    h-full
                                    w-full
                                    flex flex-col
                                    items-center
                                    absolute
                                    top-30%
                                    left-1/2
                                    z-1
                                    bg-white
                                "
                            >
                                <img
                                    class="logo mx-auto w-120 h-120"
                                    src="../../images/nodata-search.svg"
                                    alt="banner"
                                />
                                <div class="text-center">
                                    <span class="text-neutrals-400 text-16 block">
                                        <span class="flex items-center"
                                            >Hmm, we didn’t find any result for “<span class="max-w-150 truncate">{{
                                                searchValue.trim()
                                            }}</span
                                            >” in <span class="capitalize">&nbsp;{{ tab }}&nbsp;</span>tab.</span
                                        >
                                        <span>{{ $t('setting.contact_attribute_empty_search') }}</span>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div id="hide" :class="[countAttributeHidden == 0 ? 'h-screen	relative' : 'pt-22p']">
                        <template v-if="contactAttributeHidden.length !== 0 || loading">
                            <div class="flex items-center mb-10p">
                                <span class="text-14 text-neutrals-500">
                                    <template v-if="selectedRowKeys.length > 0">
                                        <span class="font-medium text-neutrals-900">{{ selectedRowKeys.length }}</span>
                                        {{ selectedRowKeys.length > 1 ? `attributes` : `attribute` }}
                                        selected of <span class="font-medium">{{ countAttributeHidden }}</span>
                                    </template>
                                    <template v-else>
                                        <span class="font-medium text-neutrals-900">{{ countAttributeHidden }}</span>
                                        {{ countAttributeHidden > 1 ? `attributes` : `attribute` }}
                                    </template>
                                    <!-- {{ isSearchFilter ? 'match' : '' }} -->
                                    {{ isSearchFilter.length > 0 || isSearchText ? ' match' : '' }}
                                </span>
                                <button-component class="ml-16p" type="secondary" @click="showAttribute"
                                    >Show</button-component
                                >
                            </div>
                            <new-table-component
                                class="contacts-segment__data-table"
                                :loading="!next_page && loading"
                                :columns="columns"
                                :data-source="contactAttributeHidden"
                                keyData="id"
                                :nextPage="next_page"
                                :loadingRow="isLoadMore"
                                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                                :scrollToBottom="onScrollToBottom"
                                tableLayout="auto"
                            >
                                <template v-slot:loading>
                                    <SkeletonTable />
                                </template>
                                <template v-slot:name="{ record }">
                                    <div class="inline-block text-left flex flex-col text-14 attribute-description">
                                        <span class="truncate font-medium">{{ record.name }}</span>
                                        <TooltipComponent
                                            showByTruncate
                                            type="light"
                                            position="top"
                                            :content="record.description"
                                            v-if="record.description"
                                        >
                                            <span class="truncate font-normal mt-2p">{{ record.description }}</span>
                                        </TooltipComponent>
                                    </div>
                                </template>
                                <template v-slot:type_name="{ record }">
                                    <span class>{{ convertType(record.datatype) }}</span>
                                </template>
                                <template v-slot:last_updated="{ record }">
                                    <span class>{{ filters.formatTime(record.updated_at) }}</span>
                                </template>
                                <template v-slot:updated_by="{ record }">
                                    <div
                                        class="whitespace-nowrap overflow-hidden flex items-center"
                                        v-if="record._auid"
                                    >
                                        <avatar-component
                                            v-if="convertImgAvatar(record._auid) === 'null'"
                                            :labelShow="false"
                                            :bgAvatar="convertBgAvatar(record._auid)"
                                            :label-avatar="convertNameUpdate(record._auid)"
                                            size="xs"
                                            class="111"
                                        />
                                        <avatar-component
                                            v-else
                                            :labelShow="false"
                                            :bgAvatar="convertBgAvatar(record._auid)"
                                            :label-avatar="convertNameUpdate(record._auid)"
                                            :image="convertImgAvatar(record._auid)"
                                            size="xs"
                                        />
                                        <span class="truncate text-14 ml-12p update_by">{{
                                            convertNameUpdate(record._auid)
                                        }}</span>
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

                                <template v-slot:last_updatedTitle>
                                    <div
                                        @click="onClickSort('updated_at')"
                                        class="cursor-pointer hover:text-primary-500"
                                        @mouseover="mouseOverSortIcon({ value: true, type: 'updated_at' })"
                                        @mouseleave="mouseOverSortIcon({ value: false, type: 'updated_at' })"
                                    >
                                        <caret-down
                                            v-if="
                                                sortBy.name !== 'updated_at' ||
                                                (sortBy.name == 'updated_at' && !sortBy.type)
                                            "
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
                            </new-table-component>
                        </template>
                        <template
                            v-if="
                                !loading &&
                                contactAttributeHidden.length === 0 &&
                                isSearchFilter.length == 0 &&
                                !isSearchText
                            "
                            >2222</template
                        >
                        <template v-if="!loading && contactAttributeHidden.length == 0 && isSearchFilter.length > 0">
                            <div
                                class="
                                    contact-attribute__emty
                                    h-full
                                    w-full
                                    flex flex-col
                                    items-center
                                    absolute
                                    top-30%
                                    left-1/2
                                    z-1
                                    bg-white
                                "
                            >
                                <img
                                    class="logo mx-auto w-120 h-120"
                                    src="../../images/nodata-search.svg"
                                    alt="banner"
                                />
                                <div class="text-center">
                                    <span class="text-16" v-html="$t('setting.contact_attribute_empty_filter')"></span>
                                </div>
                            </div>
                        </template>
                        <template
                            v-if="
                                !loading &&
                                contactAttributeHidden.length == 0 &&
                                isSearchFilter.length === 0 &&
                                isSearchText == true
                            "
                        >
                            <div
                                class="
                                    contact-attribute__emty
                                    h-full
                                    w-full
                                    flex flex-col
                                    items-center
                                    absolute
                                    top-30%
                                    left-1/2
                                    z-1
                                    bg-white
                                "
                            >
                                <img
                                    class="logo mx-auto w-120 h-120"
                                    src="../../images/nodata-search.svg"
                                    alt="banner"
                                />
                                <div class="text-center">
                                    <span class="text-neutrals-400 text-16 block">
                                        <span class="flex items-center"
                                            >Hmm, we didn’t find any result for “<span class="max-w-150 truncate">{{
                                                searchValue.trim()
                                            }}</span
                                            >” in <span class="capitalize">&nbsp;{{ tab }}&nbsp;</span>tab.</span
                                        >
                                        <span>{{ $t('setting.contact_attribute_empty_search') }}</span>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </div>
                </tab-component>
            </template>
        </template>
        <modal-edit-attribute
            v-model:showModal="isShowModalEdit"
            :attribute="selectedEditRecord"
            @close="() => (isShowModalEdit = false)"
        ></modal-edit-attribute>
        <modal-segment-attribute
            v-model:showModal="isShowModalAttributeSegment"
            :segment="selectedSegment"
            :attribute="selectedRowKeys"
            :allAttributeShow="countAttributeShow"
            :next_page="next_page_segment"
            @updateListSegment="updateListSegment"
            :keyword="searchValue"
            :auid="valueSelect"
            :updated_from="dateValue.start"
            :updated_to="dateValue.end"
            @close="() => (isShowModalAttributeSegment = false)"
        ></modal-segment-attribute>
        <modal-hide-attribute
            v-model:showModal="isShowModalAttributeHide"
            :attribute="selectedRowKeys"
            :countAttributeShow="countAttributeShow"
            :keyword="searchValue"
            :auid="valueSelect"
            :updated_from="dateValue.start"
            :updated_to="dateValue.end"
            @close="() => (isShowModalAttributeHide = false)"
        ></modal-hide-attribute>
        <modal-show-attribute
            v-model:showModal="isShowModalAttributeShow"
            :attribute="selectedRowKeys"
            :countAttributeHide="countAttributeHidden"
            :keyword="searchValue"
            :auid="valueSelect"
            :updated_from="dateValue.start"
            :updated_to="dateValue.end"
            @close="() => (isShowModalAttributeShow = false)"
        ></modal-show-attribute>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUpdated, inject, computed, reactive, toRefs } from 'vue';
import InputComp from '@/components/ui/InputComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import TabComponent from '@/components/ui/TabComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import Select from '@/components/ui/SelectComponent.vue';
import SelectPanel from '@/components/ui/SelectPanel.vue';
import NewTableComponent from '@/components/ui/NewTableComponent.vue';
import { columnItem } from '@/types/table';
import DatePicker from '@/components/ui/DatePickerComponent/index.vue';
import { useAttribute } from '@/modules/setting/composables/useContactAttribute';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import ModalEditAttribute from '../../components/SettingAttributeModalEdit.vue';
import ModalSegmentAttribute from '../../components/SettingAttributeModalSegment.vue';
import { useUser } from '@/modules/auth/composables/useUser';
import filters from '@/utils/filters';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import SkeletonTable from '../../components/SettingAttributeSkeletonTable.vue';
import debounce from 'lodash/debounce';
import ModalHideAttribute from '../../components/SettingAttributeModalHide.vue';
import ModalShowAttribute from '../../components/SettingAttributeModalShow.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import SkeletonInit from '../../components/SettingAttributeSkeleton.vue';
import CaretDown from '@/components/icons/CaretDown.vue';

interface DateFormat {
    start: string | null;
    end: string | null;
}

export default defineComponent({
    name: 'ContactAtrribute',
    components: {
        InputComp,
        IconComp,
        TabComponent,
        ButtonComponent,
        Select,
        SelectPanel,
        NewTableComponent,
        DatePicker,
        AvatarComponent,
        ModalEditAttribute,
        ModalSegmentAttribute,
        SkeletonBox,
        SkeletonTable,
        ModalHideAttribute,
        ModalShowAttribute,
        TooltipComponent,
        SkeletonInit,
        CaretDown,
    },
    setup() {
        const tab = ref<string>('show');
        const valueSelect = ref<string | null>(null);
        const searchValue = ref<string>('');
        const dateValue = ref<DateFormat>({
            start: null,
            end: null,
        });
        const isShowModalEdit = ref<boolean>(false);
        const isShowModalAttributeHide = ref<boolean>(false);
        const isShowModalAttributeSegment = ref<boolean>(false);
        const isShowModalAttributeShow = ref<boolean>(false);
        const selectedEditRecord = ref<Attribute | null>(null);
        const selectedSegment = ref<any>([]);
        const { userList } = useUser();
        const next_page = ref<any>(null);
        const next_page_segment = ref<any>(null);
        const isLoadMore = ref(false);
        const emitter: any = inject('emitter');
        const selectedRowKeys = ref<any>([]);
        const checkValueAttributeEmpty = ref<boolean>(false);
        const status = ref<string>('init');
        const envURL = process.env.VUE_APP_FILE_URL;
        const isSearchText = ref<boolean>(false);
        // const isSearchFilter = ref<boolean>(false);
        const isSearchFilter = ref<any>([]);
        const isSearchByEnter = ref<boolean>(false);
        const isHoverSortIcon = ref({});
        const sortBy = reactive({
            name: 'updated_at',
            type: 'desc',
            typeShow: 'desc',
            typeHide: 'desc',
        });

        const optionSelect = ref<any>([]);

        const defaultColumns: columnItem[] = [
            {
                title: 'Attribute name',
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
                title: 'Type',
                dataIndex: 'type_name',
                slots: {
                    title: 'type_nameTitle',
                },
                scopedSlots: { customRender: 'type_name' },
                minWidth: '100px',
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
            },
            {
                title: ' ',
                dataIndex: 'action',
                slots: {
                    title: 'actionTitle',
                },
                scopedSlots: { customRender: 'action' },
                minWidth: '60px',
            },
        ];
        const columns = ref<columnItem[]>(defaultColumns);

        const { attribute, getContactAttributeByKeyWord, getSegmentByIdAttribute, loading } = useAttribute();
        const contactAttributeShow = ref<any>([]);
        const contactAttributeHidden = ref<any>([]);
        const countAttributeShow = ref<number>(0);
        const countAttributeHidden = ref<number>(0);
        const tabs = ref<any>([
            { key: 'show', name: 'Show (' + countAttributeShow.value + ')' },
            { key: 'hide', name: 'Hidden (' + countAttributeHidden.value + ')' },
        ]);

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
            if (status.value === 'sort') {
                if (tab.value === 'show') {
                    next_page.value = null;
                    contactAttributeShow.value = [];
                } else if (tab.value === 'hide') {
                    next_page.value = null;
                    contactAttributeHidden.value = [];
                }
            } else {
                next_page.value = null;
                countAttributeShow.value = 0;
                countAttributeHidden.value = 0;
                contactAttributeShow.value = [];
                contactAttributeHidden.value = [];
            }
        };

        const onSearchAttributes = async function (q: string | null, show: number | null) {
            const sort_by = sortBy.type != '' ? `${sortBy.name}.${sortBy.type}` : null;
            const data = await getContactAttributeByKeyWord({
                q,
                show,
                sort_by: sort_by,
                _auid: valueSelect.value,
                updated_at_from: dateValue.value.start,
                updated_at_to: dateValue.value.end,
                next_page: next_page.value,
            });

            if (status.value == 'sort' || status.value == 'load') {
                if (tab.value == 'show') {
                    contactAttributeShow.value = [...contactAttributeShow.value, ...data.data];
                } else {
                    contactAttributeHidden.value = [...contactAttributeHidden.value, ...data.data];
                }
                next_page.value = data.next_page;
            } else {
                contactAttributeShow.value = [...contactAttributeShow.value, ...data.show.data];
                countAttributeShow.value = data.show.total;
                contactAttributeHidden.value = [...contactAttributeHidden.value, ...data.hide.data];
                countAttributeHidden.value = data.hide.total;
                if (status.value == 'init') {
                    if (countAttributeShow.value === 0 && countAttributeHidden.value === 0)
                        checkValueAttributeEmpty.value = true;
                    else checkValueAttributeEmpty.value = false;
                }

                if (tab.value === 'show') {
                    next_page.value = data.show.next_page;
                } else {
                    next_page.value = data.hide.next_page;
                }
            }

            tabs.value = [
                { key: 'show', name: 'Show (' + countAttributeShow.value + ')' },
                { key: 'hide', name: 'Hidden (' + countAttributeHidden.value + ')' },
            ];
        };

        const onToggleEditEmail = (record: Attribute) => {
            isShowModalEdit.value = true;
            selectedEditRecord.value = record;
        };

        const convertNameUpdate = (record: string) => {
            if (record) {
                const name = userList.value.filter((value: any) => {
                    return value._id === record;
                });
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
                if (name[0].avatar_src != null) {
                    return envURL + '/' + name[0].avatar_src;
                } else {
                    return 'null';
                }
            } else {
                return '';
            }
        };

        const onScrollToBottom = async () => {
            if (next_page.value && !isLoadMore.value) {
                status.value = 'load';
                isLoadMore.value = true;
                await onSearchAttributes(searchValue.value, tab.value === 'show' ? 1 : 2);
                isLoadMore.value = false;
            }
        };

        const mouseOverSortIcon = (value: { type: string; value: boolean }) => {
            isHoverSortIcon.value = value;
        };

        const onClickSort = (sortName: any) => {
            status.value = 'sort';
            const { name, type, typeShow, typeHide } = toRefs(sortBy);
            if (name.value !== sortName) {
                name.value = sortName;
                type.value = 'desc';
            } else {
                if (tab.value === 'show') {
                    if (type.value == 'desc' && typeShow.value == 'desc') {
                        typeShow.value = 'asc';
                        type.value = 'asc';
                    } else if (type.value == 'asc' && typeShow.value == 'asc') {
                        typeShow.value = 'desc';
                        type.value = 'desc';
                    } else if (!type.value && !typeShow.value) {
                        typeShow.value = 'desc';
                        type.value = 'desc';
                    }
                } else {
                    if (type.value == 'desc' && typeHide.value == 'desc') {
                        typeHide.value = 'asc';
                        type.value = 'asc';
                    } else if (type.value == 'asc' && typeHide.value == 'asc') {
                        typeHide.value = 'desc';
                        type.value = 'desc';
                    } else if (!type.value && !typeHide.value) {
                        typeHide.value = 'desc';
                        type.value = 'desc';
                    }
                }
                refreshData();
                onSearchAttributes(searchValue.value, tab.value === 'show' ? 1 : 2);
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

        const onEnterSearch = debounce((e) => {
            status.value = 'filter';
            if (searchValue.value === '') {
                isSearchText.value = false;
                // isSearchFilter.value = false;
            } else {
                isSearchText.value = true;
                // isSearchFilter.value = true;
            }
            refreshData();
            isSearchByEnter.value = true;
            onSearchAttributes(searchValue.value, null);
        }, 0);

        const onChangeSelect = debounce((e) => {
            status.value = 'filter';
            isSearchText.value = false;
            // if (valueSelect.value == null) isSearchFilter.value = false;
            // else isSearchFilter.value = true;
            if (valueSelect.value == null) filterFlag('auth', false);
            else {
                filterFlag('auth', true);
            }
            refreshData();
            onSearchAttributes(searchValue.value, null);
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
            status.value = 'filter';
            if (val !== null) {
                const date = {
                    start: convertDate(val.start),
                    end: convertDate(val.end),
                };
                dateValue.value = date;
                filterFlag('date', true);
                isSearchText.value = false;
            } else {
                const date = {
                    start: null,
                    end: null,
                };
                dateValue.value = date;
                filterFlag('date', false);
                isSearchText.value = true;
            }
            refreshData();
            onSearchAttributes(searchValue.value, null);
        };

        const hideAttribute = async () => {
            selectedSegment.value = [];
            const res = await getSegmentByIdAttribute({ attribute: selectedRowKeys.value, show: true });
            if (res.data.length > 0) {
                selectedSegment.value = [...selectedSegment.value, ...res.data];
                isShowModalAttributeSegment.value = true;
                next_page_segment.value = res.next_page;
            } else {
                isShowModalAttributeHide.value = true;
            }
        };

        const showAttribute = async () => {
            isShowModalAttributeShow.value = true;
        };

        const updateListSegment = (val: any) => {
            selectedSegment.value = [...selectedSegment.value, ...val.data];
            next_page_segment.value = val.next_page;
        };

        emitter.on('updateAttribute', (val: any) => {
            if (tab.value === 'show') {
                const objIndex = contactAttributeShow.value.findIndex((obj: any) => obj.id == val._id);
                contactAttributeShow.value[objIndex].name = val.name;
                contactAttributeShow.value[objIndex].description = val.description;
                contactAttributeShow.value[objIndex].updated_at = val.updated_at;
                contactAttributeShow.value[objIndex]._auid = val._auid;
            }
        });

        onMounted(async () => {
            await onSearchAttributes('', null);
            optionSelect.value = userList.value;
            // const userEmpty = {
            //     username: 'Updated by',
            //     _id: null
            // };
            // if (optionSelect.value[0].username !== 'Updated by')
            //     optionSelect.value.unshift(userEmpty);
        });

        watch(
            searchValue,
            debounce((newVal) => {
                status.value = 'filter';
                if (newVal) {
                    if (!isSearchByEnter.value) {
                        refreshData();
                        onSearchAttributes(newVal, null);
                    } else {
                        isSearchByEnter.value = false;
                        // status.value = 'init';
                    }
                    isSearchText.value = true;
                    // isSearchFilter.value = true;
                } else {
                    isSearchText.value = false;
                    // isSearchFilter.value = false;
                    refreshData();
                    onSearchAttributes(newVal, null);
                }
            }, 2000),
        );

        watch(
            () => tab.value,
            (newVal: any) => {
                selectedRowKeys.value = [];
                if (tab.value === 'show') {
                    sortBy.type = sortBy.typeShow;
                    next_page.value = (attribute.value as any).show.next_page;
                } else {
                    sortBy.type = sortBy.typeHide;
                    next_page.value = (attribute.value as any).hide.next_page;
                }
            },
        );

        watch(
            () => valueSelect.value,
            (newVal: any) => {
                if (newVal === '') {
                    // status.value = 'search';
                    valueSelect.value = null;
                    isSearchText.value = true;
                    filterFlag('auth', false);
                    refreshData();
                    onSearchAttributes(searchValue.value, null);
                }
            },
        );

        return {
            filters,
            tabs,
            tab,
            valueSelect,
            optionSelect,
            contactAttributeShow,
            contactAttributeHidden,
            columns,
            dateValue,
            onSelectChange,
            onChangeDate,
            attribute,
            searchValue,
            isShowModalEdit,
            onToggleEditEmail,
            selectedEditRecord,
            countAttributeShow,
            countAttributeHidden,
            loading,
            next_page,
            convertNameUpdate,
            isLoadMore,
            onScrollToBottom,
            onEnterSearch,
            refreshData,
            onChangeSelect,
            selectedRowKeys,
            hideAttribute,
            isShowModalAttributeHide,
            isShowModalAttributeSegment,
            isShowModalAttributeShow,
            showAttribute,
            checkValueAttributeEmpty,
            selectedSegment,
            convertType,
            status,
            convertBgAvatar,
            convertImgAvatar,
            envURL,
            isHoverSortIcon,
            onClickSort,
            next_page_segment,
            updateListSegment,
            isSearchText,
            isSearchFilter,
            isSearchByEnter,
            mouseOverSortIcon,
            sortBy,
        };
    },
});
</script>

<style lang="scss">
.contact-attribute {
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
    &__search {
        width: calc(100% - 40% - 8px);
        margin-right: 8px;
        &.loading {
            width: calc(100% - 40% - 48px);
            margin-right: 48px;
        }
    }
    &__table {
        nav {
            width: 232px;
        }
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
    .contact-attribute {
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
.contacts-segment__data-table {
    max-height: calc(100vh - 331px);
    overflow: auto;
}
</style>