<template>
    <div class="setting-tag-skeleton h-full w-full relative" v-if="loading && status === 'init'">
        <SkeletonInit />
    </div>
    <div v-else class="setting-tag h-full w-full relative">
        <template v-if="checkValueTagEmpty">
            <div class="py-24p px-40p">
                <span class="font-heading text-24 font-semibold">{{ $t('setting.tag_list_title') }}</span>
                <div class="text-center absolute setting-tag__empty">
                    <embed
                        class="logo mx-auto w-120 h-120"
                        :src="require('../../images/data-table-empty.svg')"
                        alt="banner"
                    />
                    <span class="text-16 font-bold mt-12p mb-4p block">{{ $t('common.data_table_empty_title') }}</span>
                    <span class="text-14 text-neutrals-400 block">{{
                        $t('setting.tag_list_empty_create_subtitle')
                    }}</span>
                    <button-component
                        class="ml-auto mt-12p"
                        type="primary"
                        size="medium"
                        @click="isShowModalCreateTag = true"
                    >
                        <icon-comp class="mr-4p" name="plus" color="white"></icon-comp
                        >{{ $t('setting.tag_list_button_create') }}
                    </button-component>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="pt-24p px-40p pb-16p">
                <div class="flex mb-30p">
                    <span class="font-heading text-24 font-semibold">{{ $t('setting.tag_list_title') }}</span>
                    <button-component class="ml-auto" type="primary" size="medium" @click="isShowModalCreateTag = true">
                        <icon-comp class="mr-4p" name="plus" color="white"></icon-comp>
                        {{ $t('setting.tag_list_button_create') }}
                    </button-component>
                </div>
                <div class="flex justify-between items-center">
                    <div class="setting-tag__search">
                        <input-comp
                            class="flex-grow"
                            closeIcon
                            v-model="searchValue"
                            :placeholder="$t('setting.tag_list_placeholder_input_search')"
                            v-on:keyup.enter="onEnterSearch"
                        >
                            <template v-slot:prefix>
                                <icon-comp name="search"></icon-comp>
                            </template>
                        </input-comp>
                    </div>
                    <div class="setting-tag__button">
                        <Select
                            v-model="valueSelectUser"
                            showSearch
                            maxHeightList="180px"
                            :placeholder="$t('setting.tag_list_placeholder_select')"
                            titleDefault="Updated by"
                            @change="onChangeSelectUpdate"
                        >
                            <SelectPanel
                                v-for="(index, i) in optionSelect"
                                :key="i"
                                :value="index._id"
                                :name="index.username"
                                >{{ index.username }}</SelectPanel
                            >
                        </Select>
                    </div>
                    <div class="setting-tag__button">
                        <date-picker
                            type="range"
                            :dropdown="true"
                            :columns="2"
                            :placeholder="$t('setting.tag_list_placeholder_datepicker')"
                            @onChange="onChangeDate"
                        />
                    </div>
                </div>
            </div>
            <tab-component
                class="setting-tag__table h-full"
                v-model="tab"
                :tabs="tabs"
                :loading="status === 'filter' && loading"
                default-value="active"
                type="underline"
            >
                <template v-slot:loading>
                    <div class="flex items-center px-40p pb-16p">
                        <skeleton-box width="112px" classBgColor="bg-neutrals-50" />
                        <skeleton-box width="112px" classBgColor="bg-neutrals-50" class="ml-12p" />
                    </div>
                    <div class="py-28p px-40p border-t border-primary-10">
                        <skeleton-box width="132px" class="mb-24p" />
                        <SkeletonTable />
                    </div>
                </template>
                <div id="active" :class="[countTagActive == 0 ? 'h-screen relative' : '']">
                    <div v-show="loading || tagActive.length !== 0">
                        <div class="flex items-center mb-10p mt-20p">
                            <span class="text-14 text-neutrals-500">
                                <template v-if="selectedRowKeys.length > 0">
                                    <span class="font-medium text-neutrals-900">{{ selectedRowKeys.length }}</span>
                                    selected {{ selectedRowKeys.length > 1 ? `tags` : `tag` }} of
                                    <span class="font-medium">{{ countTagActive }}</span>
                                </template>
                                <template v-else>
                                    <span class="font-medium text-neutrals-900">{{ countTagActive }}</span>
                                    {{ countTagActive > 1 ? `tags` : `tag` }}
                                </template>
                                {{ isSearchFilter.length > 0 || isSearchText ? ' match' : '' }}
                            </span>
                            <button-component class="ml-8p" type="secondary" @click="showModalArchive = true"
                                >Archive</button-component
                            >
                        </div>
                        <new-table-component
                            class="setting-tag__data-table"
                            :loading="!next_page && loading"
                            :columns="columns"
                            :data-source="tagActive"
                            keyData="id"
                            :nextPage="next_page"
                            :loadingRow="isLoadMore"
                            :row-selection="{ selectedRowKeys: selectedRowKeysActive, onChange: onSelectChange }"
                            tableLayout="auto"
                            :scrollToBottom="onScrollToBottom"
                            id="manage-tag-active"
                        >
                            <template v-slot:loading>
                                <SkeletonTable />
                            </template>
                            <template v-slot:name="{ record }">
                                <div class="inline-block text-left flex flex-col text-14 tag-name">
                                    <TooltipComponent
                                        showByTruncate
                                        type="light"
                                        position="top"
                                        :content="record.name"
                                        v-if="record.name"
                                    >
                                        <span class="truncate font-normal">{{ record.name }}</span>
                                    </TooltipComponent>
                                </div>
                            </template>
                            <template v-slot:last_updated="{ record }">
                                <span class>{{ filters.formatTime(record.updated_at) }}</span>
                            </template>
                            <template v-slot:updated_by="{ record }">
                                <div
                                    class="whitespace-nowrap overflow-hidden flex items-center"
                                    v-if="record.updated_by"
                                >
                                    <template v-if="filters.convertNameUpdate(record.updated_by, userList) !== ''">
                                        <avatar-component
                                            v-if="
                                                filters.convertImgAvatar(record.updated_by, userList, envURL) === 'null'
                                            "
                                            :labelShow="false"
                                            :bgAvatar="filters.convertBgAvatar(record.updated_by, userList)"
                                            :label-avatar="filters.convertNameUpdate(record.updated_by, userList)"
                                            size="xs"
                                        />
                                        <avatar-component
                                            v-else
                                            :labelShow="false"
                                            :bgAvatar="filters.convertBgAvatar(record.updated_by, userList)"
                                            :label-avatar="filters.convertNameUpdate(record.updated_by, userList)"
                                            :image="filters.convertImgAvatar(record.updated_by, userList, envURL)"
                                            size="xs"
                                        />
                                        <TooltipComponent
                                            showByTruncate
                                            type="light"
                                            class="tooltip__updateBy"
                                            position="top"
                                            :content="filters.convertNameUpdate(record.updated_by, userList)"
                                        >
                                            <span class="truncate text-14 ml-12p update_by">{{
                                                filters.convertNameUpdate(record.updated_by, userList)
                                            }}</span>
                                        </TooltipComponent>
                                    </template>
                                    <template v-else>
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
                                    </template>
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
                            <template v-slot:conversation="{ record }">
                                <span class="text-primary-500">{{ record.total_conversations }}</span>
                            </template>
                            <template v-slot:action="{ record }">
                                <TooltipComponent content="Edit" position="top">
                                    <button-component
                                        @click="onEditTag(record)"
                                        type="subtle"
                                        size="small"
                                        icon="pen"
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
                            <template v-slot:conversationTitle>
                                <div
                                    @click="onClickSort('total_conversations')"
                                    class="cursor-pointer hover:text-primary-500"
                                    @mouseover="mouseOverSortIcon({ value: true, type: 'total_conversations' })"
                                    @mouseleave="mouseOverSortIcon({ value: false, type: 'total_conversations' })"
                                >
                                    <caret-down
                                        v-if="
                                            sortBy.name !== 'total_conversations' ||
                                            (sortBy.name == 'total_conversations' && !sortBy.type)
                                        "
                                        class="inline-block mr-8p icon-svg fill-current"
                                        :class="
                                            isHoverSortIcon.value && isHoverSortIcon.type == 'total_conversations'
                                                ? 'text-primary-500'
                                                : ''
                                        "
                                    ></caret-down>
                                    <icon-comp
                                        v-else-if="sortBy.name === 'total_conversations'"
                                        class="inline-block mr-8p"
                                        :name="`sort-${sortBy.type}`"
                                        color="primary-500"
                                    ></icon-comp>
                                    <span>Conversation</span>
                                </div>
                            </template>
                        </new-table-component>
                    </div>
                    <template v-if="!loading && tagActive.length === 0 && isSearchFilter.length == 0 && !isSearchText">
                        <div class="text-center absolute setting-tag__empty">
                            <embed
                                class="logo mx-auto w-120 h-120"
                                :src="require('../../images/data-table-empty.svg')"
                                alt="banner"
                            />
                            <span class="text-16 font-bold mt-12p mb-4p block">{{
                                $t('common.data_table_empty_title')
                            }}</span>
                            <span class="text-14 text-neutrals-400 block">{{
                                $t('setting.tag_list_empty_create_subtitle')
                            }}</span>
                        </div>
                    </template>
                    <template v-if="!loading && tagActive.length === 0 && isSearchFilter.length > 0">
                        <div class="w-full absolute setting-tag__empty">
                            <embed
                                class="logo mx-auto w-120 h-120"
                                :src="require('../../images/nodata-search.svg')"
                                alt="banner"
                            />
                            <div class="text-center">
                                <span class="text-neutrals-400 text-16 block">
                                    <span
                                        class="text-neutrals-900"
                                        v-html="$t('setting.tag_list_empty_search_filter')"
                                    ></span>
                                </span>
                            </div>
                        </div>
                    </template>
                    <template
                        v-if="
                            !loading && tagActive.length === 0 && isSearchFilter.length === 0 && isSearchText === true
                        "
                    >
                        <div class="w-full absolute setting-tag__empty">
                            <embed
                                class="logo mx-auto w-120 h-120"
                                :src="require('../../images/nodata-search.svg')"
                                alt="banner"
                            />
                            <div class="text-center">
                                <span class="text-neutrals-900 text-16 block">
                                    <span class="flex items-center justify-center"
                                        >Hmm, we didn’t find any result for “<span class="max-w-150 truncate">{{
                                            searchValue.trim()
                                        }}</span
                                        >” in Active tab.</span
                                    >
                                    <span>{{ $t('setting.tag_list_empty_search') }}</span>
                                </span>
                            </div>
                        </div>
                    </template>
                </div>
                <div id="archived" :class="[countTagArchive == 0 ? 'h-screen relative' : '']">
                    <div v-show="loading || tagArchived.length !== 0">
                        <div class="flex items-center mb-10p mt-20p">
                            <span class="text-14 text-neutrals-500">
                                <template v-if="selectedRowKeys.length > 0">
                                    <span class="font-medium text-neutrals-900">{{ selectedRowKeys.length }}</span>
                                    selected {{ selectedRowKeys.length > 1 ? `tags` : `tag` }} of
                                    <span class="font-medium">{{ countTagArchive }}</span>
                                </template>
                                <template v-else>
                                    <span class="font-medium text-neutrals-900">{{ countTagArchive }}</span>
                                    {{ countTagArchive > 1 ? `tags` : `tag` }}
                                </template>
                                {{ isSearchFilter.length > 0 || isSearchText ? ' match' : '' }}
                            </span>
                            <button-component class="ml-8p" type="secondary" @click="showModalUnArchive = true"
                                >Unarchive
                            </button-component>
                            <button-component
                                class="ml-8p font-medium"
                                type="destructive-sublte"
                                @click="showModalDelete = true"
                                >Delete</button-component
                            >
                        </div>
                        <new-table-component
                            class="setting-tag__data-table"
                            :loading="!next_page && loading"
                            :columns="columnsArchive"
                            :data-source="tagArchived"
                            keyData="id"
                            :nextPage="next_page"
                            :loadingRow="isLoadMore"
                            :row-selection="{ selectedRowKeys: selectedRowKeysArchive, onChange: onSelectChange }"
                            tableLayout="auto"
                            :scrollToBottom="onScrollToBottom"
                            id="manage-tag-archive"
                        >
                            <template v-slot:loading>
                                <SkeletonTable />
                            </template>
                            <template v-slot:name="{ record }">
                                <div class="inline-block text-left flex flex-col text-14 tag-name">
                                    <TooltipComponent
                                        showByTruncate
                                        type="light"
                                        position="top"
                                        :content="record.name"
                                        v-if="record.name"
                                    >
                                        <span class="truncate font-normal">{{ record.name }}</span>
                                    </TooltipComponent>
                                </div>
                            </template>
                            <template v-slot:last_updated="{ record }">
                                <span class>{{ filters.formatTime(record.updated_at) }}</span>
                            </template>
                            <template v-slot:updated_by="{ record }">
                                <div
                                    class="whitespace-nowrap overflow-hidden flex items-center"
                                    v-if="record.updated_by"
                                >
                                    <template v-if="filters.convertNameUpdate(record.updated_by, userList) !== ''">
                                        <avatar-component
                                            v-if="
                                                filters.convertImgAvatar(record.updated_by, userList, envURL) === 'null'
                                            "
                                            :labelShow="false"
                                            :bgAvatar="filters.convertBgAvatar(record.updated_by, userList)"
                                            :label-avatar="filters.convertNameUpdate(record.updated_by, userList)"
                                            size="xs"
                                        />
                                        <avatar-component
                                            v-else
                                            :labelShow="false"
                                            :bgAvatar="filters.convertBgAvatar(record.updated_by, userList)"
                                            :label-avatar="filters.convertNameUpdate(record.updated_by, userList)"
                                            :image="filters.convertImgAvatar(record.updated_by, userList, envURL)"
                                            size="xs"
                                        />
                                        <TooltipComponent
                                            showByTruncate
                                            type="light"
                                            class="tooltip__updateBy"
                                            position="top"
                                            :content="filters.convertNameUpdate(record.updated_by, userList)"
                                        >
                                            <span class="truncate text-14 ml-12p update_by">{{
                                                filters.convertNameUpdate(record.updated_by, userList)
                                            }}</span>
                                        </TooltipComponent>
                                    </template>
                                    <template v-else>
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
                                    </template>
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
                    </div>
                    <template
                        v-if="!loading && tagArchived.length === 0 && isSearchFilter.length == 0 && !isSearchText"
                    >
                        <div class="text-center absolute setting-tag__empty">
                            <embed
                                class="logo mx-auto w-120 h-120"
                                :src="require('../../images/data-table-empty.svg')"
                                alt="banner"
                            />
                            <span class="text-16 font-bold mt-12p mb-4p block">{{
                                $t('common.data_table_empty_title')
                            }}</span>
                            <span class="text-14 text-neutrals-400 block">{{
                                $t('setting.tag_list_empty_archive_subtitle')
                            }}</span>
                        </div>
                    </template>
                    <template v-if="!loading && tagArchived.length === 0 && isSearchFilter.length > 0">
                        <div class="w-full absolute setting-tag__empty">
                            <embed
                                class="logo mx-auto w-120 h-120"
                                :src="require('../../images/nodata-search.svg')"
                                alt="banner"
                            />
                            <div class="text-center">
                                <span class="text-neutrals-400 text-16 block">
                                    <span
                                        class="text-neutrals-900"
                                        v-html="$t('setting.tag_list_empty_search_filter')"
                                    ></span>
                                </span>
                            </div>
                        </div>
                    </template>
                    <template
                        v-if="
                            !loading && tagArchived.length === 0 && isSearchFilter.length === 0 && isSearchText === true
                        "
                    >
                        <div class="w-full absolute setting-tag__empty">
                            <embed
                                class="logo mx-auto w-120 h-120"
                                :src="require('../../images/nodata-search.svg')"
                                alt="banner"
                            />
                            <div class="text-center">
                                <span class="text-neutrals-900 text-16 block">
                                    <span class="flex items-center justify-center"
                                        >Hmm, we didn’t find any result for “<span class="max-w-150 truncate">{{
                                            searchValue.trim()
                                        }}</span
                                        >” in Archived tab.</span
                                    >
                                    <span>{{ $t('setting.tag_list_empty_search') }}</span>
                                </span>
                            </div>
                        </div>
                    </template>
                </div>
            </tab-component>
        </template>
        <modal-alert-component
            v-model:showModal="showModalAlert"
            width="496px"
            :title="$t('setting.tag_modal_alert_maximum_tag_title')"
            :content="$t('setting.tag_modal_alert_maximum_tag_content', { orgName: userStore.organization.name })"
            @onClickButton="reloadPage"
        />
        <setting-tag-modal-create v-model:showModal="isShowModalCreateTag" @created="createTagById" />
        <setting-tag-modal-edit
            v-model:showModal="isShowModalEditTag"
            :tag="selectedEditTagRecord"
            @edited="updateTagById"
        />
        <modal-archive
            v-model:showModal="showModalArchive"
            :totalArchive="selectedRowKeys.length > 0 ? selectedRowKeys.length : countTagActive"
            :selectArchive="selectedRowKeys.length > 0 ? selectedRowKeys : null"
            :filters="tagFilters"
            @archiveTag="updateListTag"
        />
        <modal-unarchive
            v-model:showModal="showModalUnArchive"
            :selectUnArchive="selectedRowKeys.length > 0 ? selectedRowKeys : null"
            :totalUnArchive="selectedRowKeys.length > 0 ? selectedRowKeys.length : countTagArchive"
            :filters="tagFilters"
            @unArchiveTag="updateListTag"
        />
        <modal-delete
            v-model:showModal="showModalDelete"
            :selectUnArchive="selectedRowKeys.length > 0 ? selectedRowKeys : null"
            :totalUnArchive="selectedRowKeys.length > 0 ? selectedRowKeys.length : countTagArchive"
            :filters="tagFilters"
            @deleteTag="updateListTag"
        />
        <modal-alert-component
            v-model:showModal="showModalAlertMoreTag"
            width="560px"
            :title="titleAlertMoreTag"
            :content="$t('setting.tag_modal_alert_more_tag')"
            @onClickButton="showModalAlertMoreTag = false"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, onMounted, reactive, computed, watch } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import SkeletonInit from '../../components/SettingTag/SettingTagSkeletonInit.vue';
import SkeletonTable from '../../components/SettingTag/SettingTagSkeletonTable.vue';
import SettingTagModalCreate from '../../components/SettingTag/SettingTagModalCreate.vue';
import SettingTagModalEdit from '../../components/SettingTag/SettingTagModalEdit.vue';
import Select from '@/components/ui/SelectComponent.vue';
import SelectPanel from '@/components/ui/SelectPanel.vue';
import InputComp from '@/components/ui/InputComponent.vue';
import DatePicker from '@/components/ui/DatePickerComponent/index.vue';
import NewTableComponent from '@/components/ui/NewTableComponent.vue';
import { columnItem } from '@/types/table';
import TabComponent from '@/components/ui/TabComponent.vue';
import { useUser } from '@/modules/auth/composables/useUser';
import filters from '@/utils/filters';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import { useTag } from '@/modules/setting/composables/useTag';
import debounce from 'lodash/debounce';
import ModalAlertComponent from '@/components/ui/ModalAlertComponent.vue';
import { store } from '@/store';
import CaretDown from '@/components/icons/CaretDown.vue';
import ModalArchive from '../../components/SettingTag/SettingTagModalArchive.vue';
import ModalUnarchive from '../../components/SettingTag/SettingTagModalUnarchive.vue';
import ModalDelete from '../../components/SettingTag/SettingTagModalDelete.vue';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';

interface DateFormat {
    start: string | null;
    end: string | null;
}

export default defineComponent({
    name: 'Tag',
    components: {
        ButtonComponent,
        IconComp,
        Select,
        SelectPanel,
        InputComp,
        DatePicker,
        TabComponent,
        NewTableComponent,
        SkeletonTable,
        SkeletonInit,
        TooltipComponent,
        AvatarComponent,
        SettingTagModalCreate,
        SettingTagModalEdit,
        ModalAlertComponent,
        CaretDown,
        ModalArchive,
        ModalUnarchive,
        ModalDelete,
        SkeletonBox,
    },
    setup() {
        const valueSelectUser = ref<string | null>(null);
        const searchValue = ref<string>('');
        const dateValue = ref<DateFormat>({
            start: null,
            end: null,
        });
        const envURL = process.env.VUE_APP_FILE_URL;
        const optionSelect = ref<any>([]);
        const { userList } = useUser();
        const countTagActive = ref<number>(0);
        const countTagArchive = ref<number>(0);
        const tagActive = ref<any>([]);
        const tagArchived = ref<any>([]);
        const tab = ref<string>('active');
        const tabs = ref<any>([
            { key: 'active', name: 'Active (' + countTagActive.value + ')' },
            { key: 'archived', name: 'Archived (' + countTagArchive.value + ')' },
        ]);
        const next_page = ref<any>(null);
        const isLoadMore = ref(false);
        const status = ref<string>('init');
        const isSearchText = ref<boolean>(false);
        const isSearchFilter = ref<any>([]);
        const isSearchByEnter = ref<boolean>(false);
        const isHoverSortIcon = ref({});
        const selectedRowKeys = ref<any>([]);
        const selectedRowKeysActive = ref<any>([]);
        const selectedRowKeysArchive = ref<any>([]);
        const defaultColumns: columnItem[] = [
            {
                title: 'Tag name',
                dataIndex: 'name',
                slots: {
                    title: 'nameTitle',
                },
                scopedSlots: { customRender: 'name' },
                width: '100%',
                minWidth: '426px',
                maxWidth: '426px',
            },
            {
                title: 'Last updated',
                dataIndex: 'last_updated',
                slots: {
                    title: 'last_updatedTitle',
                },
                scopedSlots: { customRender: 'last_updated' },
                minWidth: '180px',
                maxWidth: '180px',
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
                title: 'Conversation',
                dataIndex: 'conversation',
                slots: {
                    title: 'conversationTitle',
                },
                scopedSlots: { customRender: 'conversation' },
                minWidth: '180px',
                maxWidth: '180px',
            },
            {
                title: ' ',
                dataIndex: 'action',
                slots: {
                    title: 'actionTitle',
                },
                scopedSlots: { customRender: 'action' },
                minWidth: '52px',
                maxWidth: '52px',
            },
        ];
        const columns = ref<columnItem[]>(defaultColumns);
        const defaultColumnsArchive: columnItem[] = [
            {
                title: 'Tag name',
                dataIndex: 'name',
                slots: {
                    title: 'nameTitle',
                },
                scopedSlots: { customRender: 'name' },
                width: '100%',
                minWidth: '436px',
                maxWidth: '436px',
            },
            {
                title: 'Last updated',
                dataIndex: 'last_updated',
                slots: {
                    title: 'last_updatedTitle',
                },
                scopedSlots: { customRender: 'last_updated' },
                minWidth: '180px',
                maxWidth: '180px',
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
        ];
        const columnsArchive = ref<columnItem[]>(defaultColumnsArchive);
        const isShowModalCreateTag = ref<boolean>(false);
        const isShowModalEditTag = ref<boolean>(false);
        const showModalAlert = ref<boolean>(false);
        const showModalArchive = ref<boolean>(false);
        const showModalUnArchive = ref<boolean>(false);
        const showModalDelete = ref<boolean>(false);
        const showModalAlertMoreTag = ref<boolean>(false);
        const selectedEditTagRecord = ref<any>(null);
        const checkValueTagEmpty = ref<boolean>(false);
        const titleAlertMoreTag = ref<string>('');

        const { getTagByKeyWord, loading, tags } = useTag();
        const sortBy = reactive({
            name: 'updated_at',
            type: 'desc',
            typeActive: 'desc',
            typeArchived: 'desc',
        });

        const onSelectChange = (selectedRowKeysChange: any) => {
            if (tab.value == 'active') {
                selectedRowKeysActive.value = selectedRowKeysChange;
                selectedRowKeys.value = selectedRowKeysActive.value;
            } else {
                selectedRowKeysArchive.value = selectedRowKeysChange;
                selectedRowKeys.value = selectedRowKeysArchive.value;
            }
            // selectedRowKeys.value = selectedRowKeysChange;
        };

        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        const refreshData = () => {
            if (status.value === 'sort') {
                if (tab.value === 'active') {
                    next_page.value = null;
                    tagActive.value = [];
                } else if (tab.value === 'archived') {
                    next_page.value = null;
                    tagArchived.value = [];
                }
            } else {
                next_page.value = null;
                countTagActive.value = 0;
                countTagArchive.value = 0;
                tagActive.value = [];
                tagArchived.value = [];
                selectedRowKeysActive.value = [];
                selectedRowKeysArchive.value = [];
                selectedRowKeys.value = [];
            }
        };

        const convertStatusTab = computed(() => {
            if (status.value == 'sort' || status.value == 'load') {
                if (tab.value === 'active') return 1;
                else return 2;
            } else {
                return null;
            }
        });

        const onSearchTags = async () => {
            const sort_by = sortBy.type != '' ? `${sortBy.name}.${sortBy.type}` : null;
            const data = await getTagByKeyWord({
                q: searchValue.value,
                status: convertStatusTab.value,
                updated_at_from: dateValue.value.start,
                updated_at_to: dateValue.value.end,
                updated_by: valueSelectUser.value,
                next_page: next_page.value,
                sort_by: sort_by,
                mode: convertStatusTab.value == null ? null : 'aio',
            });

            if (status.value == 'sort' || status.value == 'load') {
                if (tab.value == 'active') {
                    tagActive.value = [...tagActive.value, ...data.data];
                } else {
                    tagArchived.value = [...tagArchived.value, ...data.data];
                }
                next_page.value = data.next_page;
            } else {
                tagActive.value = [...tagActive.value, ...data.data.active.data];
                countTagActive.value = data.data.active.total;
                tagArchived.value = [...tagArchived.value, ...data.data.archived.data];
                countTagArchive.value = data.data.archived.total;
                if (status.value == 'init') {
                    if (countTagActive.value === 0 && countTagArchive.value === 0) checkValueTagEmpty.value = true;
                    else checkValueTagEmpty.value = false;
                }

                if (tab.value === 'active') {
                    next_page.value = data.data.active.next_page;
                } else {
                    next_page.value = data.data.archived.next_page;
                }
            }

            tabs.value = [
                { key: 'active', name: 'Active (' + countTagActive.value + ')' },
                { key: 'archived', name: 'Archived (' + countTagArchive.value + ')' },
            ];
        };
        const onEditTag = (record: any) => {
            isShowModalEditTag.value = true;
            selectedEditTagRecord.value = record;
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
            } else {
                isSearchText.value = true;
            }
            refreshData();
            isSearchByEnter.value = true;
            onSearchTags();
        }, 0);

        const onChangeSelectUpdate = debounce((e) => {
            status.value = 'filter';
            isSearchText.value = false;
            if (valueSelectUser.value == null) filterFlag('auth', false);
            else {
                filterFlag('auth', true);
            }
            refreshData();
            onSearchTags();
        }, 0);

        const onChangeDate = (val: any) => {
            status.value = 'filter';
            if (val != null) {
                dateValue.value = {
                    start: filters.convertDate(val.start),
                    end: filters.convertDate(val.end),
                };
                filterFlag('date', true);
                isSearchText.value = false;
            } else {
                dateValue.value = {
                    start: null,
                    end: null,
                };
                filterFlag('date', false);
                isSearchText.value = true;
            }
            refreshData();
            onSearchTags();
        };

        const mouseOverSortIcon = (value: { type: string; value: boolean }) => {
            isHoverSortIcon.value = value;
        };

        const handleSeachContactWithNewSort = debounce(() => {
            refreshData();
            onSearchTags();
        }, 200);

        const onClickSort = (sortName: any) => {
            status.value = 'sort';
            const { name, type, typeActive, typeArchived } = toRefs(sortBy);
            if (name.value !== sortName) {
                name.value = sortName;
                type.value = 'desc';
            } else {
                if (tab.value === 'active') {
                    if (type.value == 'desc') {
                        typeActive.value = 'asc';
                        type.value = 'asc';
                    } else if (type.value == 'asc') {
                        typeActive.value = 'desc';
                        type.value = 'desc';
                    } else if (!type.value) {
                        typeActive.value = 'desc';
                        type.value = 'desc';
                    }
                } else {
                    if (type.value == 'desc') {
                        typeArchived.value = 'asc';
                        type.value = 'asc';
                    } else if (type.value == 'asc') {
                        typeArchived.value = 'desc';
                        type.value = 'desc';
                    } else if (!type.value) {
                        typeArchived.value = 'desc';
                        type.value = 'desc';
                    }
                }
            }
            handleSeachContactWithNewSort();
        };

        const reloadPage = () => {
            location.reload();
        };

        const createTagById = (data: any) => {
            if (checkValueTagEmpty.value) {
                status.value = 'init';
            } else {
                status.value = 'filter';
            }
            refreshData();
            onSearchTags();
        };

        const tagFilters = computed(() => {
            return {
                q: searchValue.value,
                updated_at_from: dateValue.value.start,
                updated_at_to: dateValue.value.end,
                updated_by: valueSelectUser.value,
                status: showModalDelete.value ? 2 : null,
            };
        });

        const updateListTag = (data: any) => {
            if (data.type == 'archive') titleAlertMoreTag.value = 'Archive process needs a few minutes';
            if (data.type == 'unarchive') titleAlertMoreTag.value = 'Unarchive process needs a few minutes ';
            if (data.type == 'delete') titleAlertMoreTag.value = 'Delete process needs a few minutes';
            showModalAlertMoreTag.value = true;
        };

        const updateTagById = (data: any) => {
            if (tab.value === 'active') {
                const objIndex = tagActive.value.findIndex((obj: any) => obj.id == data._id);
                tagActive.value[objIndex].name = data.name;
                tagActive.value[objIndex].updated_at = data.updated_at;
                tagActive.value[objIndex].updated_by = data.updated_by;
            }
        };

        const onScrollToBottom = async () => {
            if (next_page.value && !isLoadMore.value) {
                status.value = 'load';
                isLoadMore.value = true;
                await onSearchTags();
                isLoadMore.value = false;
            }
        };

        onMounted(async () => {
            optionSelect.value = userList.value;
            await onSearchTags();
        });

        watch(
            () => valueSelectUser.value,
            (newVal: any) => {
                if (newVal === '') {
                    valueSelectUser.value = null;
                    isSearchText.value = true;
                    filterFlag('auth', false);
                    refreshData();
                    onSearchTags();
                }
            },
        );

        watch(
            searchValue,
            debounce((newVal: any) => {
                status.value = 'filter';
                if (newVal) {
                    if (!isSearchByEnter.value) {
                        refreshData();
                        onSearchTags();
                    } else {
                        isSearchByEnter.value = false;
                    }
                    isSearchText.value = true;
                } else {
                    isSearchText.value = false;
                    refreshData();
                    onSearchTags();
                }
            }, 1000),
        );

        watch(
            () => tab.value,
            () => {
                // selectedRowKeys.value = [];
                if (tab.value === 'active') {
                    sortBy.type = sortBy.typeActive;
                    selectedRowKeys.value = selectedRowKeysActive.value;
                    if (status.value == 'load' || status.value == 'sort')
                        next_page.value = (tags.value as any).next_page;
                    else next_page.value = (tags.value as any).data.active.next_page;
                } else {
                    sortBy.type = sortBy.typeArchived;
                    selectedRowKeys.value = selectedRowKeysArchive.value;
                    if (status.value == 'load' || status.value == 'sort')
                        next_page.value = (tags.value as any).next_page;
                    else next_page.value = (tags.value as any).data.archived.next_page;
                }
            },
        );

        return {
            valueSelectUser,
            searchValue,
            dateValue,
            optionSelect,
            tabs,
            tab,
            countTagActive,
            countTagArchive,
            next_page,
            tagActive,
            tagArchived,
            isLoadMore,
            selectedRowKeys,
            onSelectChange,
            columns,
            filters,
            isSearchFilter,
            loading,
            status,
            refreshData,
            sortBy,
            isShowModalCreateTag,
            isShowModalEditTag,
            onEditTag,
            selectedEditTagRecord,
            isSearchText,
            isSearchByEnter,
            isHoverSortIcon,
            onEnterSearch,
            checkValueTagEmpty,
            onChangeSelectUpdate,
            onChangeDate,
            onClickSort,
            mouseOverSortIcon,
            userStore,
            reloadPage,
            showModalAlert,
            showModalArchive,
            showModalUnArchive,
            showModalDelete,
            userList,
            envURL,
            createTagById,
            tagFilters,
            updateListTag,
            convertStatusTab,
            updateTagById,
            onScrollToBottom,
            tags,
            columnsArchive,
            showModalAlertMoreTag,
            titleAlertMoreTag,
            selectedRowKeysActive,
            selectedRowKeysArchive,
        };
    },
});
</script>

<style lang="scss">
.setting-tag {
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
            margin: 0 40px;
        }
        .tab-component__header {
            border-bottom: 1px solid #e0e0e0;
            .tab {
                position: relative;
                &__bar {
                    position: absolute;
                    bottom: -2px;
                }
                &__name {
                    height: 42px;
                }
            }
        }
        .tab-content {
            padding: 0 40px;
        }
    }
    .custom-select-component {
        max-width: 100%;
    }
    &__empty {
        top: 30%;
        left: 50%;
        transform: translate(-50%, -30%);
    }
    &__filter-empty {
        top: 30%;
        left: 50%;
        transform: translate(-50%, -30%);
        position: absolute;
    }
    .tooltip__updateBy {
        width: calc(100% - 32px);
    }
}
@media (max-width: 1440px) {
    .setting-tag {
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
.setting-tag__data-table {
    max-height: calc(100vh - 335px);
    overflow: auto;
}
</style>
