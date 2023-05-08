<template>
    <div class="contacts-segment py-24p px-40p h-full w-full relative">
        <div class="text-24 font-semibold flex items-center justify-between">
            <template v-if="segment.group == 1 && contacts.length === 0 && segment.name === 'All'">
                <h2 class="text-24 font-heading">
                    {{ segment.name }}
                </h2>
            </template>
            <skeleton-box v-else-if="loading && status == 'init'" width="136px" />
            <template v-else-if="countConditionFilter !== 0 || (contacts.length !== 0 && countConditionFilter === 0)">
                <h2 v-if="segment.group == 1" class="text-24 font-heading">
                    {{ segment.name }}
                </h2>
                <Editable
                    v-else
                    class="pr-4p editable-name-segment"
                    width="500px"
                    classLabel="font-bold text-24"
                    editKey="name"
                    v-model:modelValue="segment.name"
                    v-model:activeKey="activeEditableKey"
                    :placeholder="'Enter segment name'"
                    :maxlength="30"
                    :error="validName"
                    :onSubmit="updateSegmentName"
                    :locked="!validAllField"
                    @changeValue="changeValueName"
                    :classError="'font-normal'"
                    :showTooltip="false"
                ></Editable>
                <button-component class="ml-auto" type="primary" size="medium" @click="toggleModal">
                    <icon-comp class="mr-4p" name="plus" color="white"></icon-comp>
                    {{ $t('contact.contact_list_button_add_contact') }}
                </button-component>
                <button-component class="ml-10p" type="outline" size="medium" @click="toggleModalImportContact">
                    <icon-comp class="mr-4p" name="InboxIn"></icon-comp>
                    {{ $t('contact.contact_list_button_import_contact') }}
                </button-component>
            </template>
        </div>
        <div class="mt-24p">
            <div class="mb-10p">
                <skeleton-box v-if="loading" width="80px" />
                <button-component
                    v-else-if="countConditionFilter !== 0 || (contacts.length !== 0 && countConditionFilter === 0)"
                    size="medium"
                    :count="countConditionFilter.toString()"
                    :type="countConditionFilter === 0 ? 'outline' : 'count'"
                    :icon="countConditionFilter === 0 ? 'filter' : ''"
                    @click="toggleDrawerFilter"
                >
                    Filter{{ countConditionFilter && countConditionFilter > 1 ? 's' : '' }}
                </button-component>
                <button-component
                    v-if="showBtnSaveSegment && !loading"
                    size="medium"
                    :type="'outline'"
                    class="ml-10p btn-save-segment"
                    :class="countConditionFilter == 0 ? 'no-filter' : ''"
                    :icon="'save'"
                    @click="toggleModalSaveSegment"
                >
                    Save segment
                </button-component>
            </div>
            <div class="flex justify-between items-center mb-10p relative">
                <skeleton-box v-if="loading && !next_page" width="86px" />
                <span
                    v-else-if="countConditionFilter !== 0 || (contacts.length !== 0 && countConditionFilter === 0)"
                    class="text-14"
                >
                    <span class="text-14">
                        <template v-if="selectedRowKeys.length === 0">
                            <b>{{ total ? total.toLocaleString() : 0 }}</b>
                            <span class="text-neutrals-400">
                                {{ ' ' + $t('contact.contact_list_text_contact') }}{{ total && total > 1 ? 's' : '' }}
                                {{ countConditionFilter !== 0 ? $t('contact.contact_list_text_contact_match') : '' }}
                                <template v-if="countConditionFilter !== 0">
                                    {{ $t('contact.contact_list_text_contact_of') + ' ' }}
                                    <span class="font-medium">
                                        {{ totalSegmentsAll.toLocaleString() }}
                                    </span>
                                </template>
                            </span>
                        </template>
                        <template v-else>
                            <b>{{ selectedRowKeys.length }}</b>
                            <span class="text-neutrals-400">
                                {{ ` ${selectedRowKeys.length > 1 ? 'contacts' : 'contact'} ${'selected of'} ` }}
                                <span class="font-medium">
                                    {{ total }}
                                </span>
                            </span>
                        </template>
                    </span>
                    <button-component
                        class="ml-8p"
                        @click="toggleModalArchive"
                        :disabled="!contacts.length"
                        type="secondary"
                        size="small"
                    >
                        Archive
                    </button-component>
                </span>
                <contact-list-config-dropdown
                    v-if="
                        !loading &&
                        (countConditionFilter !== 0 || (contacts.length !== 0 && countConditionFilter === 0))
                    "
                    class="absolute right-0"
                    @change="onModifyAttr"
                    :defaultValue="defaultAttributes"
                >
                    <template v-slot:default>
                        <button-component @click="openDropdown = true" type="subtle" isFocus icon="tools" />
                    </template>
                </contact-list-config-dropdown>
            </div>
        </div>
        <template v-if="loading && !next_page"> </template>
        <template v-else-if="contacts.length === 0 && countConditionFilter === 0">
            <div class="h-full w-full flex flex-col items-center -mt-24p absolute top-30% z-1 bg-white">
                <img class="logo mx-auto w-120 h-120" src="../images/no-data-table.svg" alt="banner" />
                <div class="text-center">
                    <span class="font-bold"> {{ $t('contact.contact_list_table_title_empty') }} </span><br />
                    <span class="text-neutrals-400 text-14">
                        {{ $t('contact.contact_list_table_description_empty') }}
                    </span>
                </div>
                <div class="flex flex-col text-center">
                    <button-component class="mt-12p justify-center" type="primary" size="medium" @click="toggleModal">
                        <icon-comp class="mr-4p" name="plus" color="white"></icon-comp>
                        {{ $t('contact.contact_list_button_add_contact') }}
                    </button-component>
                    <p class="text-14 text-neutrals-400 my-8p">or</p>
                    <button-component
                        class="justify-center"
                        type="outline"
                        size="medium"
                        @click="toggleModalImportContact"
                    >
                        <icon-comp class="mr-4p" name="InboxIn"></icon-comp>
                        {{ $t('contact.contact_list_button_import_contact') }}
                    </button-component>
                </div>
            </div>
        </template>
        <template v-else-if="contacts.length === 0 && countConditionFilter !== 0">
            <div class="h-full w-full flex flex-col items-center -mt-24p absolute top-30% z-1 bg-white">
                <img class="logo mx-auto w-120 h-120" src="../images/no-data.svg" alt="banner" />
                <div class="text-center">
                    <span class="text-neutrals-400 text-16">
                        {{ $t('contact.contact_list_table_description_filter_empty1') }}
                        <br />
                        {{ $t('contact.contact_list_table_description_filter_empty2') }}
                    </span>
                </div>
            </div>
        </template>
        <div v-show="loading || contacts.length !== 0" class="contacts-segment__data">
            <new-table-component
                class="contacts-segment__data-table"
                :loading="!next_page && loading"
                :loadingRow="next_page && loading"
                :columns="columns"
                :data-source="contacts"
                :scrollToBottom="onScrollToBottom"
                :nextPage="next_page"
                keyData="id"
                fixed
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                cellClass=" px-16p py-8p h-56"
                tableLayout="fixed"
                toolTipCell
            >
                <template v-slot:name="{ record }">
                    <router-link
                        class="block w-5/6"
                        :to="{
                            name: 'ContactDetail',
                            params: { contactId: record._id !== undefined ? record._id : record.id },
                        }"
                    >
                        <div class="whitespace-nowrap overflow-hidden flex items-center">
                            <avatar-component
                                :labelShow="false"
                                :label-avatar="record.full_name"
                                :bgAvatar="record.avatar_bg ? record.avatar_bg : '#3ED0DA'"
                                size="small"
                                :showBackgroundCompulsory="true"
                                :image="record.avatar_src ? `${envURL}${record.avatar_src}` : ''"
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
                                    :disabled="emailHover !== `segmentemail-${record.id}`"
                                >
                                    <span
                                        :id="`segmentemail-${record.id}`"
                                        class="font-normal truncate"
                                        @mouseover="isEllipsisActive(`segmentemail-${record.id}`)"
                                        >{{ record.email }}</span
                                    >
                                </TooltipComponent>
                            </div>
                        </div>
                    </router-link>
                </template>
                <template v-slot:first_seen="{ record }">
                    <span :class="!record.first_seen ? 'text-neutrals-300' : ''">
                        {{ record.first_seen ? filters.formatTime(record.first_seen, false) : 'Unknown' }}</span
                    >
                </template>
                <template v-slot:signed_up="{ record }">
                    <span :class="!record.signed_up ? 'text-neutrals-300' : ''">
                        {{ record.signed_up ? filters.formatTime(record.signed_up, false) : 'Unknown' }}</span
                    >
                </template>
                <template v-slot:last_seen="{ record }">
                    <span :class="!record.last_seen ? 'text-neutrals-300' : ''">
                        {{ record.last_seen ? filters.formatTime(record.last_seen, false) : 'Unknown' }}</span
                    >
                </template>
                <template v-slot:country="{ record }">
                    <span :class="!record.country ? 'text-neutrals-300' : ''">
                        {{ record.country ? getCountryName(record.country) : 'Unknown' }}</span
                    >
                </template>
                <template v-slot:browser="{ record }">
                    <span :class="!record.browser ? 'text-neutrals-300' : ''">
                        {{ record.browser ? record.browser : 'Unknown' }}</span
                    >
                </template>
                <template v-slot:phone="{ record }">
                    <span :class="!record.phone ? 'text-neutrals-300' : ''">
                        {{ record.phone ? record.phone : 'Unknown' }}</span
                    >
                </template>
                <template v-slot:browser_language="{ record }">
                    <span :class="!record.browser_language ? 'text-neutrals-300' : ''">
                        {{ record.browser_language ? getLanguagesName(record.browser_language) : 'Unknown' }}</span
                    >
                </template>
                <template v-slot:browser_version="{ record }">
                    <span :class="!record.browser_version ? 'text-neutrals-300' : ''">
                        {{ record.browser_version ? record.browser_version : 'Unknown' }}</span
                    >
                </template>
                <template v-slot:city="{ record }">
                    <span :class="!record.city ? 'text-neutrals-300' : ''">
                        {{ record.city ? record.city : 'Unknown' }}</span
                    >
                </template>
                <template v-slot:timezone="{ record }">
                    <span :class="!record.timezone ? 'text-neutrals-300' : ''">
                        {{ record.timezone ? record.timezone : 'Unknown' }}</span
                    >
                </template>
                <template v-slot:hash_id="{ record }">
                    {{ record.hash_id }}
                </template>
                <template v-slot:os="{ record }">
                    <span :class="!record.os ? 'text-neutrals-300' : ''">{{ record.os ? record.os : 'Unknown' }}</span>
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
                        <span>
                            {{ $t('contact.contact_list_table_title_signup') }}
                        </span>
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
                        <span>
                            {{ $t('contact.contact_list_table_title_firstseen') }}
                        </span>
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
        <modal-add-contact
            v-model:showModal="showModalAddContact"
            @close="toggleModal"
            @add-contact="refreshData"
        ></modal-add-contact>
        <modal-save-segment
            v-model:showModal="showModalSaveSegment"
            @close="toggleModalSaveSegment"
            @submitSegment="submitSegment"
            :currSegment="segment"
            :arrAttributeHide="arrAttributeHide"
            @showModalHiddenAttribute="showModalHiddenAttribute = true"
        ></modal-save-segment>
        <modal-archive-contact
            v-model:showModal="showModalArchiveContact"
            :has-filter="countConditionFilter > 0 && selectedRowKeys.length === 0"
            :data="dataArchiveContact"
            :total="totalArchiveContact"
            @close="toggleModalArchive"
            @archive-success="onArchiveSuccess"
            :sort_by="sortBy.type != null ? `${sortBy.name}.${sortBy.type}` : ''"
        ></modal-archive-contact>
        <modal-import-contact
            v-model:showModal="showModalImportContact"
            @close="toggleModalImportContact"
        ></modal-import-contact>
        <drawer-filter
            :key="drawerKey"
            v-model:showDrawer="showDrawerFilter"
            :filters="segment.conditions"
            @submitFitler="submitFitler"
        ></drawer-filter>
        <modal-hidden-attribute v-model:showModal="showModalHiddenAttribute"></modal-hidden-attribute>
    </div>
</template>

<script>
import IconComp from '@/components/ui/IconComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import NewTableComponent from '@/components/ui/NewTableComponent.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import CaretDown from '@/components/icons/CaretDown.vue';
import Editable from '@/components/ui/Editable.vue';
import ContactListConfigDropdown from './ContactListConfigDropdown.vue';
import ModalAddContact from './ContactListModalAddContact.vue';
import ModalSaveSegment from './ContactListModalSaveSegment.vue';
import ModalArchiveContact from './ContactListModalArchiveContact.vue';
import ModalImportContact from './ContactModalImportContact/ContactListModalImportContact.vue';
import DrawerFilter from './ContactListDrawerFilter.vue';
import { useContact } from '../composables/useContact';
import { useSegment } from '../composables/useSegment';
import { useRoute } from 'vue-router';
import { useCountriesList } from '@/composables/useCountriesList';
import { ref, reactive, toRefs, watch, provide, inject, onMounted, computed, nextTick } from 'vue';
import filters from '@/utils/filters';
import debounce from 'lodash/debounce';
import { useI18n } from 'vue-i18n';
import { useToast } from '@/composables/useToast';
import ModalHiddenAttribute from './ContactListModalHiddenAttribute.vue';
import { useSocket } from '@/composables/useSocket';
import { useRouter } from 'vue-router';

const sortableList = ['signed_up', 'visit', 'first_seen'].map((item) => item + 'Title');

export default {
    name: 'ContactListBySegment',
    components: {
        ButtonComponent,
        IconComp,
        NewTableComponent,
        AvatarComponent,
        CaretDown,
        SkeletonBox,
        ModalAddContact,
        ModalArchiveContact,
        ModalImportContact,
        ContactListConfigDropdown,
        DrawerFilter,
        ModalSaveSegment,
        Editable,
        TooltipComponent,
        ModalHiddenAttribute,
    },
    // props: ['segment'],
    emits: ['cancelSearch'],
    setup(props, { emit }) {
        const { socket } = useSocket();
        const { t } = useI18n();
        const emailHover = ref(null);
        const defaultValueNameColumn = {
            title: t('contact.contact_list_table_title_name'),
            dataIndex: 'name',
            slots: {
                title: 'nameTitle',
            },
            scopedSlots: { customRender: 'name' },
            width: '320px',
        };
        const defaultColumns = [defaultValueNameColumn];
        const status = ref('init');
        const contacts = ref([]);
        const route = useRoute();
        const segmentId = computed(() => route.params.segmentId);
        const columns = ref(defaultColumns);
        const envURL = `${process.env.VUE_APP_CONTACT_AVATAR_URL}/`;
        const { getCountryName, getLanguagesName } = useCountriesList();
        const {
            getContactsBySegments,
            getContactsByConditions,
            updateContactsSetting,
            updateContactsToArchive,
            loading,
        } = useContact();
        const { updateSegmentTotal, segments, updateSegmentNameCustom, totalContactFilterDone } = useSegment();
        const next_page = ref(null);
        const total = ref(null);
        const drawerKey = ref(0);
        const isLoadMore = ref(false);
        const openDropdown = ref(false);
        const showModalAddContact = ref(false);
        const showModalSaveSegment = ref(false);
        const showModalArchiveContact = ref(false);
        const showModalImportContact = ref(false);
        const showDrawerFilter = ref(false);
        const showBtnSaveSegment = ref(false);
        const defaultAttributes = ref(null);
        const showModalHiddenAttribute = ref(false);
        const apiCalling = ref(false);
        const sortBy = reactive({
            name: 'signed_up',
            type: 'desc',
        });
        const router = useRouter();
        const { addToast } = useToast();
        const isHoverSortIcon = ref({});
        const segment = inject('selectedSegment');
        const contactSetting = inject('contactSetting');
        const emitter = inject('emitter');
        const attributes = inject('attributes');
        const statusInitContactListData = inject('statusInitContactListData');
        const conditions = ref(null);
        const activeEditableKey = ref('');
        const errorName = ref('');
        const arrAttributeHide = ref([]);
        const totalSegmentsAll = computed(() =>
            segments.value ? segments.value.find((item) => item.name === 'All').count_contact : 0,
        );
        const countConditionFilter = computed(() => {
            let count = 0;
            if (segment.value.conditions !== null && segment.value.conditions.groups.length) {
                for (let index = 0; index < segment.value.conditions.groups.length; index++) {
                    const element = segment.value.conditions.groups[index];
                    count += element.conditions.length;
                }
            }
            return count;
        });
        const currColumnValueIndex = computed(() => columns.value.map((item) => item.dataIndex));
        const mouseOverSortIcon = (value) => {
            isHoverSortIcon.value = value;
        };
        const isModifyFilter = ref(false);
        const selectedRowKeys = ref([]);

        const refreshData = () => {
            status.value = 'init';
            next_page.value = null;
            total.value = null;
            contacts.value = [];
        };

        const submitSegment = () => {
            showBtnSaveSegment.value = false;
        };

        const dynamicAttrList = computed(() => {
            return attributes.list
                ? attributes.list.value
                      .filter((item) => item.created_at !== undefined)
                      .map((item) => 'attr_' + item._id)
                : [];
        });

        const totalArchiveContact = computed(() => {
            if (countConditionFilter.value === 0 && selectedRowKeys.value.length === 0) return totalSegmentsAll.value;
            else
                return countConditionFilter.value > 0 && selectedRowKeys.value.length === 0
                    ? total.value
                    : selectedRowKeys.value.length;
        });

        const dataArchiveContact = computed(() => {
            const isUpdateByFilter = countConditionFilter.value > 0 && selectedRowKeys.value.length === 0;
            return isUpdateByFilter
                ? { filters: conditions.value, sort_by: sortBy.type != null ? `${sortBy.name}.${sortBy.type}` : '' }
                : { contact_ids: selectedRowKeys.value };
        });

        const onArchiveSuccess = () => {
            // selectedRowKeys.value = [];
        };

        const onGetContact = async function () {
            const id = segment.value._id;
            const sort_by = sortBy.type != null ? `${sortBy.name}.${sortBy.type}` : '';
            const data = (await !isModifyFilter.value)
                ? await getContactsBySegments({
                      id,
                      next_page: next_page.value,
                      sort_by,
                      per_page: 20,
                  })
                : await getContactsByConditions({
                      next_page: next_page.value,
                      sort_by,
                      per_page: 20,
                      filters: conditions.value,
                  });
            contacts.value = [...contacts.value, ...data.data];
            next_page.value = data.next_page;
            total.value = data.total;
            totalContactFilterDone.value = data.total;
            !isModifyFilter.value && updateSegmentTotal(segment.value._id, data.total);
            status.value = 'loaded';
            return Promise.resolve();
        };

        const onGetDisplayAtrr = async () => {
            const defaultAtrr = ['phone', 'country', 'signed_up', 'last_seen'];
            let data = contactSetting.list.value;
            data = data !== null ? data : defaultAtrr;

            columns.value = [
                ...columns.value,
                ...data.map((item) => {
                    const _item = item;
                    const isDynamicAttr = item.includes('attr_');
                    isDynamicAttr && (item = item.replace('attr_', ''));
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

        const handleGetContactByConditions = (value) => {
            conditions.value = value;
            isModifyFilter.value = true;
            refreshData();
            onGetContact();
        };

        const initData = async () => {
            if (segment.value) {
                await onGetContact();
            }
        };

        const isEllipsisActive = (id) => {
            const e = document.getElementById(id);
            if (e.offsetWidth < e.scrollWidth) emailHover.value = id;
        };

        onMounted(async () => {
            statusInitContactListData.value === 'done' && onGetDisplayAtrr();
            await initData();
            if (route.query.showFilter === 'true') {
                showDrawerFilter.value = true;
            }
        });

        const onScrollToBottom = async () => {
            if (next_page.value && !isLoadMore.value) {
                isLoadMore.value = true;
                await onGetContact();
                isLoadMore.value = false;
            }
        };

        const handleSeachContactWithNewSort = debounce(() => {
            refreshData();
            onGetContact();
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

        const onUpdateSettingContact = () => {
            const data = [...new Set(columns.value.map((item) => item.dataIndex).filter((item) => item !== 'name'))];
            updateContactsSetting(data);
            contactSetting.list.value = data;
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
                columns.value = data.value.reduce(
                    (accumulator, curVal) => {
                        if (
                            // !currColumnValueIndex.value.includes(curVal._id) &&
                            !['full_name', 'email'].includes(curVal._id)
                        )
                            return [
                                ...accumulator,
                                {
                                    title: curVal.name,
                                    dataIndex: curVal.created_at ? 'attr_' + curVal._id : curVal._id,
                                    slots: {
                                        title: curVal._id + 'Title',
                                    },
                                    scopedSlots: {
                                        customRender: curVal.created_at ? 'attr_' + curVal._id : curVal._id,
                                    },
                                    width: curVal.dataIndex === 'name' ? '320px' : null,
                                },
                            ];
                        else return accumulator;
                    },
                    [defaultValueNameColumn],
                );
            } else {
                columns.value = [defaultValueNameColumn];
            }
            onUpdateSettingContact();
        };

        const toggleModal = () => {
            showModalAddContact.value = !showModalAddContact.value;
        };

        const toggleModalSaveSegment = () => {
            showModalSaveSegment.value = !showModalSaveSegment.value;
        };

        const toggleModalImportContact = () => {
            showModalImportContact.value = !showModalImportContact.value;
        };

        const toggleModalArchive = () => {
            showModalArchiveContact.value = !showModalArchiveContact.value;
        };

        const toggleDrawerFilter = () => {
            showDrawerFilter.value = !showDrawerFilter.value;
        };

        const validName = computed(() => {
            if (segment.value.name.length > 30) {
                return 'invalid_name';
            }
            if (segment.value.name.length < 1) {
                return 'null';
            }
            if (errorName.value === 'name_exists') {
                return 'name_exists_segment';
            }
            return '';
        });

        const validAllField = computed(() => validName.value === '');

        const updateSegmentName = async () => {
            if (apiCalling.value) return;
            apiCalling.value = true;
            const res = await updateSegmentNameCustom(segment.value);
            apiCalling.value = false;
            if (!res.error) {
                addToast({
                    title: 'Saved segment name successfully',
                    type: 'basic',
                    timeout: 3000,
                });
                activeEditableKey.value = '';
            } else {
                errorName.value = '';
                for (let index = 0; index < Object.keys(res.message).length; index++) {
                    const errorKey = Object.keys(res.message)[index];
                    if (errorKey === 'name_exists') {
                        errorName.value = 'name_exists';
                    }
                }
            }
        };

        const changeValueName = async () => {
            errorName.value = '';
        };

        socket.on('attribute.showhide.complete', (data) => {
            if (data.data.show === false) {
                arrAttributeHide.value = data.data.ids;
            }
        });

        provide(
            'arrAttributeHide',
            computed(() => arrAttributeHide.value),
        );

        emitter.on('clickValueCheckbox', (value) => {
            if (value) {
                if (arrAttributeHide.value.length > 0) {
                    const findIdIndex = arrAttributeHide.value.includes(value);
                    if (findIdIndex) {
                        addToast({
                            title: 'This attribute has been hidden by another teammate.',
                            type: 'basic',
                            timeout: 3000,
                        });
                    }
                }
            } else {
                if (arrAttributeHide.value.length > 0) {
                    addToast({
                        title: 'Some attributes has been hidden by another teammate.',
                        type: 'basic',
                        timeout: 3000,
                    });
                }
            }
        });

        const submitFitler = (filter) => {
            if (arrAttributeHide.value.length > 0) {
                const listFilter = filter.groups[0].conditions;
                const convertList = listFilter.map((item) => {
                    const convertItem = Object.keys(item)[0];
                    return convertItem.replace('attr_', '').split(':')[0];
                });
                const findSegment = convertList.some((item) => arrAttributeHide.value.includes(item));
                if (findSegment) {
                    showModalHiddenAttribute.value = true;
                }
            } else {
                segment.value.conditions = filter;
                handleGetContactByConditions(filter);
                showBtnSaveSegment.value = true;
            }
        };

        const onSelectChange = (selectedRowKeysChange) => {
            console.log('selectedRowKeys changed: ', selectedRowKeysChange);
            selectedRowKeys.value = selectedRowKeysChange;
        };

        watch(segment, async (newVal, prevVal) => {
            conditions.value = segment.value.conditions;
            await refreshData();
            isModifyFilter.value = false;
            JSON.stringify(newVal) !== JSON.stringify(prevVal) && (await initData());
            showBtnSaveSegment.value = false;
        });

        watch(statusInitContactListData, (value) => {
            if (value === 'done') {
                onGetDisplayAtrr();
            }
        });

        watch(countConditionFilter, (value) => {
            selectedRowKeys.value = [];
        });

        watch(activeEditableKey, (value) => {
            if (value === '') errorName.value = '';
        });

        watch(router.currentRoute, () => {
            activeEditableKey.value = '';
        });

        return {
            attributes,
            dynamicAttrList,
            refreshData,
            selectedRowKeys,
            onSelectChange,
            statusInitContactListData,
            drawerKey,
            contacts,
            columns,
            envURL,
            filters,
            loading,
            next_page,
            total,
            onScrollToBottom,
            mouseOverSortIcon,
            isHoverSortIcon,
            onClickSort,
            sortBy,
            totalSegmentsAll,
            segment,
            openDropdown,
            onModifyAttr,
            getCountryName,
            getLanguagesName,
            showDrawerFilter,
            toggleModal,
            showModalAddContact,
            showModalSaveSegment,
            showModalArchiveContact,
            toggleDrawerFilter,
            sortableList,
            status,
            handleGetContactByConditions,
            countConditionFilter,
            submitFitler,
            isModifyFilter,
            defaultAttributes,
            currColumnValueIndex,
            toggleModalArchive,
            dataArchiveContact,
            totalArchiveContact,
            onArchiveSuccess,
            showModalImportContact,
            toggleModalImportContact,
            toggleModalSaveSegment,
            showBtnSaveSegment,
            submitSegment,
            updateSegmentName,
            validAllField,
            validName,
            activeEditableKey,
            isEllipsisActive,
            emailHover,
            changeValueName,
            showModalHiddenAttribute,
            arrAttributeHide,
        };
    },
};
</script>

<style lang="scss" scoped>
.contacts-segment {
    height: 100%;
    &__data {
        &-table {
            max-height: calc(100vh - 250px);
            overflow: auto;
            // overflow: auto;
        }
    }
}
.btn-save-segment.no-filter {
    :deep(.icon-comp) {
        position: initial;
        padding-top: 3px;
        padding-bottom: 4px;
    }
    :deep(div) {
        margin-left: 11px;
    }
}
.btn-save-segment {
    position: relative;

    :deep(.icon-comp) {
        position: absolute;
        bottom: 11px;
    }
    :deep(div) {
        margin-left: 24px;
    }
}
.editable-name-segment {
    :deep(.editable__composer) {
        width: auto !important;
    }
    :deep(.editable__composer--is-edit) {
        width: 336px;
    }
    :deep(.editable__button--show) {
        width: auto;
        margin: 2px 0 0 8px;
    }
}
</style>
