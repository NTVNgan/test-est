<template>
    <div class="contacts-search py-10p px-32p h-full w-full">
        <div class="flex items-center">
            <input-comp
                class="flex-grow"
                v-model="searchValue"
                closeIcon
                v-on:keyup.enter="onEnterSearch"
                :placeholder="$t('contact.contact_list_search_placeholder')"
            >
                <template v-slot:prefix>
                    <icon-comp name="search"></icon-comp>
                </template>
            </input-comp>
            <button-component class="ml-16p" @click="onClickCancel" type="link"
                ><span class="text-primary-500 font-bold">{{
                    $t('contact.contact_list_modal_btn_cancel')
                }}</span></button-component
            >
        </div>
        <template v-if="status === 'init'">
            <div class="contacts-search__no-data relative flex flex-col justify-center items-center">
                <div>
                    <img class="logo mx-auto" src="../images/no-data.svg" alt="banner" />
                </div>
            </div>
        </template>
        <span v-else-if="contacts.length === 0" class="inline-block mt-16p text-14">
            <b>{{ total.toLocaleString() }}</b>
            <span class="text-neutrals-400"> contact matched</span>
        </span>
        <div
            class="contacts-search__data mt-30p"
            v-if="status == 'searching' || (status === 'search' && contacts.length !== 0)"
        >
            <div class="flex justify-between items-center mb-16p">
                <skeleton-box v-if="loading" width="86px" />
                <span v-else class="text-14">
                    <b>{{ total.toLocaleString() }}</b>
                    <span class="text-neutrals-400">{{ total === 1 ? ' contact' : ' contacts' }} match</span>
                </span>
                <contact-list-config-dropdown @change="onModifyAttr">
                    <template v-slot:default>
                        <button-component @click="openDropdown = true" type="subtle" isFocus icon="tools" />
                    </template>
                </contact-list-config-dropdown>
            </div>
            <new-table-component
                class="contacts-search__data-table"
                :loading="!next_page && loading"
                :loadingRow="next_page && loading"
                :columns="columns"
                :data-source="contacts"
                :scrollToBottom="onScrollToBottom"
                :nextPage="next_page"
                keyData="id"
                fixed
                cellClass=" px-16p py-8p h-56"
                tableLayout="fixed"
                toolTipCell
            >
                <template v-slot:name="{ record }">
                    <router-link :to="{ name: 'ContactDetail', params: { contactId: record.id } }" class="w-5/6">
                        <div class="whitespace-nowrap overflow-hidden flex items-center">
                            <avatar-component
                                :labelShow="false"
                                :label-avatar="record.full_name"
                                :bgAvatar="record.avatar_bg ? record.avatar_bg : '#3ED0DA'"
                                size="small"
                                :image="record.avatar_src ? `${envURL}${record.avatar_src}` : ''"
                                :showBackgroundCompulsory="true"
                            />
                            <div class="inline-block text-left flex flex-col text-14p ml-16p truncate">
                                 <TooltipComponent
                                    :content="record.full_name"
                                    position="top"
                                    type="light"
                                    :disabled="emailHover !== `segmentname-${record.id}`"
                                >
                                    <span
                                        :id="`segmentname-${record.id}`"
                                        @mouseover="isEllipsisActive(`segmentname-${record.id}`)"
                                        class="truncate"
                                        >{{ record.full_name }}</span
                                    >
                                </TooltipComponent>
                                <TooltipComponent
                                    :content="record.email"
                                    position="top"
                                    type="light"
                                    :disabled="emailHover !== `segmentname-${record.id}`"
                                >
                                    <span
                                        :id="`segmentname-${record.id}`"
                                        class="font-normal truncate"
                                        @mouseover="isEllipsisActive(`segmentname-${record.id}`)"
                                        >{{ record.email }}</span
                                    >
                                </TooltipComponent>
                            </div>
                        </div>
                    </router-link>
                </template>
                <template v-slot:first_seen="{ record }">
                    <span :class="!record.first_seen ? 'text-neutrals-300' : ''">{{
                        record.first_seen ? filters.formatTime(record.first_seen, false) : 'Unknown'
                    }}</span>
                </template>
                <template v-slot:signed_up="{ record }">
                    <span :class="!record.signed_up ? 'text-neutrals-300' : ''">{{
                        record.signed_up ? filters.formatTime(record.signed_up, false) : 'Unknown'
                    }}</span>
                </template>
                <template v-slot:last_seen="{ record }">
                    <span :class="!record.last_seen ? 'text-neutrals-300' : ''">{{
                        record.last_seen ? filters.formatTime(record.last_seen, false) : 'Unknown'
                    }}</span>
                </template>
                <template v-slot:country="{ record }">
                    <span :class="!record.country ? 'text-neutrals-300' : ''">{{
                        record.country ? getCountryName(record.country) : 'Unknown'
                    }}</span>
                </template>
                <template v-slot:browser="{ record }">
                    <span :class="!record.browser ? 'text-neutrals-300' : ''">{{
                        record.browser ? record.browser : 'Unknown'
                    }}</span>
                </template>
                <template v-slot:phone="{ record }">
                    <span :class="!record.phone ? 'text-neutrals-300' : ''">{{
                        record.phone ? record.phone : 'Unknown'
                    }}</span>
                </template>
                <template v-slot:browser_language="{ record }">
                    <span :class="!record.browser_language ? 'text-neutrals-300' : ''">{{
                        record.browser_language ? getLanguagesName(record.browser_language) : 'Unknown'
                    }}</span>
                </template>
                <template v-slot:browser_version="{ record }">
                    <span :class="!record.browser_version ? 'text-neutrals-300' : ''">{{
                        record.browser_version ? record.browser_version : 'Unknown'
                    }}</span>
                </template>
                <template v-slot:city="{ record }">
                    <span :class="!record.city ? 'text-neutrals-300' : ''">{{
                        record.city ? record.city : 'Unknown'
                    }}</span>
                </template>
                <template v-slot:timezone="{ record }">
                    <span :class="!record.timezone ? 'text-neutrals-300' : ''">{{
                        record.timezone ? record.timezone : 'Unknown'
                    }}</span>
                </template>
                <template v-slot:hash_id="{ record }">
                    {{ record.hash_id }}
                </template>
                <template v-slot:os="{ record }">
                    <span :class="!record.os ? 'text-neutrals-300' : ''"> {{ record.os ? record.os : 'Unknown' }}</span>
                </template>
                <template v-for="(item, index) in dynamicAttrList" :key="index" v-slot:[item]="{ record, type }">
                    <span :class="record[item] === undefined ? 'text-neutrals-300' : ''">
                        <template v-if="type == 3">
                            {{ record[item] !== undefined ? filters.formatTime(record[item], false) : 'Unknown' }}
                        </template>
                        <template v-else>
                            {{ record[item] !== undefined ? record[item] : 'Unknown' }}
                        </template>
                    </span>
                </template>
                <template v-slot:signed_upTitle>
                    <div
                        @click="onClickSort('signed_up')"
                        class="cursor-pointer hover:text-primary-500"
                        @mouseover="mouseOverSortIcon({ value: true, type: 'signed_up' })"
                        @mouseleave="mouseOverSortIcon({ value: false, type: 'signed_up' })"
                    >
                        <caret-down
                            v-if="sortBy.name !== 'signed_up' || (sortBy.name == 'signed_up' && !sortBy.type)"
                            class="inline-block mr-8p icon-svg fill-current"
                            :class="
                                isHoverSortIcon.value && isHoverSortIcon.type == 'signed_up' ? 'text-primary-500' : ''
                            "
                        ></caret-down>
                        <icon-comp
                            v-else-if="sortBy.name === 'signed_up'"
                            class="inline-block mr-8p"
                            :name="`sort-${sortBy.type}`"
                            color="primary-500"
                        ></icon-comp>
                        <span> {{ $t('contact.contact_list_table_title_signup') }}</span>
                    </div>
                </template>
                <template v-slot:first_seenTitle>
                    <div
                        @click="onClickSort('first_seen')"
                        class="cursor-pointer hover:text-primary-500"
                        @mouseover="mouseOverSortIcon({ value: true, type: 'first_seen' })"
                        @mouseleave="mouseOverSortIcon({ value: false, type: 'first_seen' })"
                    >
                        <caret-down
                            v-if="sortBy.name !== 'first_seen' || (sortBy.name == 'first_seen' && !sortBy.type)"
                            class="inline-block mr-8p icon-svg fill-current"
                            :class="
                                isHoverSortIcon.value && isHoverSortIcon.type == 'first_seen' ? 'text-primary-500' : ''
                            "
                        ></caret-down>
                        <icon-comp
                            v-else-if="sortBy.name === 'first_seen'"
                            class="inline-block mr-8p"
                            :name="`sort-${sortBy.type}`"
                            color="primary-500"
                        ></icon-comp>
                        <span> {{ $t('contact.contact_list_table_title_firstseen') }}</span>
                    </div>
                </template>
                <template v-slot:visitTitle>
                    <div
                        @click="onClickSort('visit')"
                        class="cursor-pointer hover:text-primary-500"
                        @mouseover="mouseOverSortIcon({ value: true, type: 'visit' })"
                        @mouseleave="mouseOverSortIcon({ value: false, type: 'visit' })"
                    >
                        <caret-down
                            v-if="sortBy.name !== 'visit' || (sortBy.name == 'visit' && !sortBy.type)"
                            class="inline-block mr-8p icon-svg fill-current"
                            :class="isHoverSortIcon.value && isHoverSortIcon.type == 'visit' ? 'text-primary-500' : ''"
                        ></caret-down>
                        <icon-comp
                            v-else-if="sortBy.name === 'visit'"
                            class="inline-block mr-8p"
                            :name="`sort-${sortBy.type}`"
                            color="primary-500"
                        ></icon-comp>
                        <span> {{ $t('contact.contact_list_table_title_sessions') }}</span>
                    </div>
                </template>
            </new-table-component>
        </div>
        <template v-else-if="!['init', 'seaching'].includes(status) && contacts.length === 0">
            <div class="contacts-search__no-data relative flex flex-col justify-center items-center">
                <div>
                    <img class="logo mx-auto w-120 h-120" src="../images/no-data.svg" alt="banner" />
                    <div class="text-center">
                        {{ $t('contact.contact_list_search_title_empty', { searchedValue }) }}<br />
                        {{ $t('contact.contact_list_search_title2_empty') }}
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import NewTableComponent from '@/components/ui/NewTableComponent.vue';
import InputComp from '@/components/ui/InputComponent.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import ContactListConfigDropdown from './ContactListConfigDropdown.vue';
import { useContact } from '../composables/useContact';
import { useCountriesList } from '@/composables/useCountriesList';
import { ref, watch, reactive, toRefs, onActivated, inject, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { countries } from 'countries-list';
import CaretDown from '@/components/icons/CaretDown.vue';
import filters from '@/utils/filters';
import debounce from 'lodash/debounce';
import { useI18n } from 'vue-i18n';

export default {
    name: 'ContactListBySearch',
    components: {
        SkeletonBox,
        InputComp,
        ButtonComponent,
        IconComp,
        AvatarComponent,
        CaretDown,
        ContactListConfigDropdown,
        NewTableComponent,
        TooltipComponent,
    },
    emits: ['cancelSearch'],
    setup(props, root) {
        const { t } = useI18n();
        const emailHover = ref(null);
        const defaultColumns = [
            {
                title: t('contact.contact_list_table_title_name'),
                dataIndex: 'name',
                slots: {
                    title: 'nameTitle',
                },
                scopedSlots: { customRender: 'name' },
                width: '320px',
            },
        ];
        const status = ref('init');
        const searchValue = ref('');
        const searchedValue = ref('');
        const contacts = ref([]);
        const router = useRouter();
        const { getCountryName, getLanguagesName } = useCountriesList();
        const route = useRoute();
        const columns = ref(defaultColumns);
        const envURL = `${process.env.VUE_APP_CONTACT_AVATAR_URL}/`;
        const { getContactsByKeyword, loading, updateContactsSetting } = useContact();
        const isSearchByEnter = ref(false);
        const next_page = ref(null);
        const total = ref(null);
        const isLoadMore = ref(false);
        const sortBy = reactive({
            name: 'signed_up',
            type: 'desc',
        });
        const isHoverSortIcon = ref(false);
        const openDropdown = ref(false);
        const currColumnValueIndex = computed(() => columns.value.map((item) => item.dataIndex));
        const attributes = inject('attributes');
        const contactSetting = inject('contactSetting');
        const statusInitContactListData = inject('statusInitContactListData');

        const dynamicAttrList = computed(() => {
            return attributes.list
                ? attributes.list.value
                      .filter((item) => item.created_at !== undefined)
                      .map((item) => 'attr_' + item._id)
                : [];
        });

        const mouseOverSortIcon = (value) => {
            isHoverSortIcon.value = value;
        };

        const refreshData = () => {
            next_page.value = null;
            total.value = null;
            contacts.value = [];
        };

        const onClickCancel = () => {
            router.go(-1);
        };

        onActivated(() => {
            refreshData();
            searchValue.value = '';
        });

        const onGetDisplayAtrr = async () => {
            const defaultAtrr = ['phone', 'country', 'signed_up', 'last_seen'];
            let data = contactSetting.list.value;
            data = data !== null ? data : defaultAtrr;

            columns.value = [
                ...columns.value,
                ...data.map((item) => {
                    const _item = item;
                    item.includes('attr_') && (item = item.replace('attr_', ''));
                    const attribute = attributes.list.value.find((atribute) => {
                        return atribute._id === item;
                    });

                    if (!attribute && item === 'full_name') return columns.value[0];
                    else {
                        const _id = item === _item ? item : _item;
                        return {
                            title: attribute.name,
                            dataIndex: _id,
                            slots: {
                                title: _id + 'Title',
                            },
                            scopedSlots: { customRender: _id },
                            width: attribute.dataIndex === 'name' ? '320px' : null,
                            type: attribute.datatype ? attribute.datatype : null,
                        };
                    }
                }),
            ];
        };

        const onSearchContact = async function (q) {
            if (q !== searchedValue.value) {
                refreshData();
                searchedValue.value = q;
            }
            if (q) {
                status.value = 'searching';
                const sort_by = sortBy.type != null ? `${sortBy.name}.${sortBy.type}` : '';
                const data = await getContactsByKeyword({ q, next_page: next_page.value, per_page: 20, sort_by });
                status.value = 'search';

                contacts.value = [...contacts.value, ...data.data];
                // contacts.value = [...contacts.value, ...dummyData];
                next_page.value = data.next_page;
                total.value = data.total;
            }
        };

        const onEnterSearch = debounce((e) => {
            refreshData();
            isSearchByEnter.value = true;
            onSearchContact(searchValue.value);
        }, 200);

        const onUpdateSettingContact = () => {
            const data = [...new Set(columns.value.map((item) => item.dataIndex).filter((item) => item !== 'name'))];
            updateContactsSetting(data);
            contactSetting.list.value = data;
        };

        const onScrollToBottom = async () => {
            if (next_page.value && !isLoadMore.value) {
                isLoadMore.value = true;
                await onSearchContact(searchValue.value);
                isLoadMore.value = false;
            }
        };

        const handleSeachContactWithNewSort = debounce(() => {
            if (searchedValue.value) {
                refreshData();
                onSearchContact(searchedValue.value);
            }
        }, 200);

        const onClickSort = (sortName) => {
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

        const onModifyAttr = (data) => {
            if (data.type === 'plus') {
                const newColumnsValue = {
                    title: data.value.name,
                    dataIndex: data.value.created_at ? 'attr_' + data.value._id : data.value._id,
                    slots: {
                        title: data.value._id + 'Title',
                    },
                    scopedSlots: { customRender: data.value.created_at ? 'attr_' + data.value._id : data.value._id },
                };
                columns.value = [...columns.value, newColumnsValue];
            } else if (data.type === 'sub') {
                columns.value = columns.value.filter((item) =>
                    data.value.created_at
                        ? 'attr_' + data.value._id !== item.dataIndex
                        : data.value._id !== item.dataIndex,
                );
            } else if (data.type === 'all') {
                columns.value = data.value.reduce((accumulator, curVal) => {
                    if (!['full_name', 'email'].includes(curVal._id))
                        return [
                            ...accumulator,
                            {
                                title: curVal.name,
                                dataIndex: curVal.created_at ? 'attr_' + curVal._id : curVal._id,
                                slots: {
                                    title: curVal._id + 'Title',
                                },
                                scopedSlots: { customRender: curVal.created_at ? 'attr_' + curVal._id : curVal._id },
                                width: curVal.dataIndex === 'name' ? '320px' : null,
                            },
                        ];
                    else return accumulator;
                }, defaultColumns);
            } else {
                columns.value = [
                    {
                        title: 'Full name & Email',
                        dataIndex: 'name',
                        slots: {
                            title: 'nameTitle',
                        },
                        scopedSlots: { customRender: 'name' },
                        width: '320px',
                    },
                ];
            }
            onUpdateSettingContact();
        };

        const isEllipsisActive = (id) => {
            const e = document.getElementById(id);
            if (e.offsetWidth < e.scrollWidth) emailHover.value = id;
        };

        onMounted(async () => {
            statusInitContactListData.value === 'done' && onGetDisplayAtrr();
        });

        watch(
            searchValue,
            debounce((newVal) => {
                if (newVal) {
                    if (!isSearchByEnter.value) {
                        onSearchContact(newVal);
                    } else {
                        isSearchByEnter.value = false;
                    }
                } else {
                    contacts.value = [];
                    status.value = 'init';
                }
            }, 2000),
        );

        watch(statusInitContactListData, (value) => {
            if (value === 'done') {
                onGetDisplayAtrr();
            }
        });

        return {
            dynamicAttrList,
            onEnterSearch,
            status,
            searchValue,
            onClickCancel,
            contacts,
            columns,
            envURL,
            filters,
            loading,
            searchedValue,
            next_page,
            total,
            onScrollToBottom,
            mouseOverSortIcon,
            isHoverSortIcon,
            onClickSort,
            sortBy,
            countries,
            onModifyAttr,
            openDropdown,
            getCountryName,
            getLanguagesName,
            isEllipsisActive,
            emailHover,
        };
    },
};
</script>

<style lang="scss" scoped>
.contacts-search {
    height: 100%;
    &__no-data {
        top: calc(30% - 40px);
    }
    &__data {
        &-table {
            max-height: calc(100vh - 200px);
            overflow-x: auto;
        }
    }
}
</style>
