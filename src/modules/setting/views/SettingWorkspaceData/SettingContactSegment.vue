<template>
    <div class="setting-segment py-24p px-40p h-full w-full relative">
        <div class="text-24 font-semibold flex items-center justify-between mb-32p">
            <h2 class="text-24 font-heading">{{ $t('setting.contact_segment_title') }}</h2>
        </div>
        <!-- empty page -->
        <template v-if="status === 'empty'">
            <div class="h-full w-full flex flex-col items-center -mt-24p absolute left-0 top-30% z-1 bg-white">
                <img class="logo mx-auto w-120 h-120" src="../../images/segment-empty.svg" alt="banner" />
                <div class="text-center">
                    <span class="font-bold">{{ $t('setting.contact_segment_empty_title') }}</span> <br />
                    <span class="text-neutrals-400 text-14">
                        {{ $t('setting.contact_segment_empty_subtitle') }}
                    </span>
                </div>
            </div>
        </template>
        <template v-if="status !== 'empty'">
            <!-- header page -->
            <template v-if="loading && status !== 'searching'">
                <div class="pt-12p mb-56p">
                    <skeleton-box width="205px" />
                </div>
                <div class="mb-36p">
                    <skeleton-box width="430px" />
                </div>
                <div class="mb-22p">
                    <skeleton-box width="112px" />
                </div>
            </template>
            <template v-if="!loading || status === 'searching'">
                <input-component
                    class="flex-grow"
                    v-model="searchValue"
                    closeIcon
                    v-on:keyup.enter="onEnterSearch"
                    :placeholder="$t('setting.contact_segment_search_placeholder')"
                >
                    <template v-slot:prefix>
                        <icon-component name="search"></icon-component>
                    </template>
                </input-component>
                <div class="h-32 flex items-center text-14 my-10p">
                    <template v-if="status === 'searching'">
                        <skeleton-box width="112px" />
                    </template>
                    <template v-else>
                        <template v-if="selectedRowKeys.length === 0">
                            <b>{{ total ? total : 0 }}</b> &nbsp;
                            <span class="text-neutrals-400">
                                {{ $t(`setting.contact_segment_text_${total > 1 ? 'segments' : 'segment'}`) }}
                            </span>
                            <span v-if="['search-empty', 'search'].includes(status)" class="text-neutrals-400">
                                &nbsp;{{ $t('setting.contact_segment_text_matched') }}
                            </span>
                        </template>
                        <template v-else>
                            <b>{{ selectedRowKeys.length }}</b> &nbsp;
                            <span class="text-neutrals-400">
                                {{
                                    $t(
                                        `setting.contact_segment_text_${
                                            selectedRowKeys.length > 1 ? 'segments' : 'segment'
                                        }`,
                                    )
                                }}
                                {{ $t('setting.contact_segment_text_selected_of') }}
                                <span class="font-medium"> {{ total }}</span>
                            </span>
                        </template>
                        <button-component
                            v-if="segmentsNonDefault.length"
                            class="ml-8p"
                            type="destructive-sublte"
                            size="small"
                            @click="showDeleteSegmentModal"
                        >
                            {{ $t('setting.contact_segment_button_delete') }}
                        </button-component>
                    </template>
                </div>
            </template>
            <!-- body page -->
            <template v-if="status === 'search-empty'">
                <div class="h-full w-full flex flex-col items-center -mt-24p absolute left-0 top-30% z-1 bg-white">
                    <div class="px-40p w-full">
                        <img class="logo mx-auto w-120 h-120" src="@/modules/contact/images/no-data.svg" alt="banner" />
                        <div
                            class="text-center w-min truncate"
                            v-html="$t('setting.contact_segment_search_empty', { searchValue })"
                        ></div>
                    </div>
                </div>
            </template>
            <template v-if="segmentsNonDefault.length || loading">
                <new-table-component
                    class="setting-segment__data-table"
                    :loading="!next_page && loading"
                    :columns="tableColumns"
                    :data-source="segmentsNonDefault"
                    :nextPage="next_page"
                    tableLayout="auto"
                    keyData="id"
                    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                >
                    <template v-slot:loading>
                        <setting-contact-segment-table-skeleton-component />
                    </template>
                    <template v-slot:name="{ record }">
                        <tooltip-component
                            class="w-calc-100%-50p"
                            showByTruncate
                            type="light"
                            position="top"
                            :content="record.name"
                        >
                            <span class="font-normal text-left truncate flex-1 flex">{{ record.name }}</span>
                        </tooltip-component>
                    </template>
                    <template v-slot:count_contact="{ record }">
                        {{ filters.formatNumberWithCommas(record.count_contact) }}
                    </template>
                    <template v-slot:number_of_filters="{ record }">
                        <button-component type="link">
                            <router-link
                                :to="{
                                    name: 'ContactListBySegment',
                                    params: { segmentId: record.id },
                                    query: { showFilter: true },
                                }"
                            >
                                {{ record.number_of_filters }}
                            </router-link>
                        </button-component>
                    </template>
                    <template v-slot:action="{ record }">
                        <tooltip-component position="top" :content="$t('setting.contact_segment_tooltip_edit')">
                            <button-component
                                @click="showEditSegmentModal(record)"
                                type="subtle"
                                size="medium"
                                icon="pen"
                            ></button-component>
                        </tooltip-component>
                    </template>
                </new-table-component>
            </template>
        </template>
        <modal-edit-segment
            :segment="selectedEditSegment"
            v-model:showModal="isShowEditSegment"
            @close="() => (isShowEditSegment = false)"
        />
        <modal-delete-segment
            :segmentIds="selectedRowKeys"
            :total="totalSelectedSegmentIds"
            :filter="segmentFilters"
            v-model:showModal="isShowDeleteSegment"
            @close="() => (isShowDeleteSegment = false)"
        />
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, inject, watch } from 'vue';
import InputComponent from '@/components/ui/InputComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import NewTableComponent from '@/components/ui/NewTableComponent.vue';
import SkeletonBox from '@/components/ui/SkeletonBox.vue';
import ModalEditSegment from '../../components/SettingContactSegmentModalEditSegment.vue';
import ModalDeleteSegment from '../../components/SettingContactSegmentModalDeleteSegment.vue';
import SettingContactSegmentTableSkeletonComponent from '../../components/SettingContactSegmentTableSkeletonComponent.vue';
import debounce from 'lodash/debounce';
import { columnItem } from '@/types/table';
import { useSegment } from '@/modules/contact/composables/useSegment';
import filters from '@/utils/filters';
import { useI18n } from 'vue-i18n';
import { routerPush } from '@/router';

export default {
    name: 'SettingContactSegment',
    components: {
        NewTableComponent,
        TooltipComponent,
        InputComponent,
        IconComponent,
        ButtonComponent,
        ModalEditSegment,
        ModalDeleteSegment,
        SettingContactSegmentTableSkeletonComponent,
        SkeletonBox,
    },
    setup() {
        const { t } = useI18n();
        const searchValue = ref<string | null>('');
        const tableColumns: columnItem[] = [
            {
                title: t('setting.contact_segment_table_header_name'),
                dataIndex: 'name',
                scopedSlots: { customRender: 'name' },
                width: '100%',
                minWidth: '406px',
                maxWidth: '406px',
            },
            {
                title: t('setting.contact_segment_table_header_contact_number'),
                dataIndex: 'count_contact',
                scopedSlots: { customRender: 'count_contact' },
                minWidth: '180px',
            },
            {
                title: t('setting.contact_segment_table_header_filter_number'),
                dataIndex: 'number_of_filters',
                scopedSlots: { customRender: 'number_of_filters' },
                minWidth: '180px',
            },
            {
                title: '',
                dataIndex: 'action',
                scopedSlots: { customRender: 'action' },
                minWidth: '52px',
            },
        ];
        const selectedRowKeys = ref<any>([]);
        const total = ref<any>(null);
        const next_page = ref(null);
        const isSearchByEnter = ref<boolean>(false);
        const isShowEditSegment = ref<boolean>(false);
        const isShowDeleteSegment = ref<boolean>(false);
        const selectedEditSegment = ref<Segment | null>(null);
        const status = ref('init');

        const { segmentsNonDefault, getListNonDefaultSegment, loading } = useSegment();
        const emitter: any = inject('emitter');

        const totalSelectedSegmentIds = computed(() => {
            return selectedRowKeys.value.length ? selectedRowKeys.value.length : total.value;
        });
        const selectedSegmentIds = computed(() => {
            return { segment_ids: selectedRowKeys.value };
        });
        const segmentFilters = computed(() => {
            return {
                q: searchValue.value,
            };
        });

        const refreshData = () => {
            next_page.value = null;
            total.value = null;
            segmentsNonDefault.value = [];
            selectedRowKeys.value = [];
        };
        const onSearchSegment = async (q: string | null) => {
            if (q !== searchValue.value) {
                refreshData();
                searchValue.value = q;
            }
            status.value = 'searching';
            const res = await getListNonDefaultSegment({
                q,
                per_page: 200,
                is_setting: 1,
            });
            if (!res.error) {
                if (q) {
                    status.value = res.total === 0 ? 'search-empty' : 'search';
                } else {
                    status.value = res.total === 0 ? 'empty' : 'init';
                }
                total.value = res.total;
            }
        };
        const onEnterSearch = debounce(e => {
            refreshData();
            isSearchByEnter.value = true;
            onSearchSegment(searchValue.value);
        }, 0);
        const onSelectChange = (selectedRowKeysChange: any) => {
            console.log('selectedRowKeys changed: ', selectedRowKeysChange);
            selectedRowKeys.value = selectedRowKeysChange;
        };
        const showDeleteSegmentModal = () => {
            console.log('isShowDeleteSegment');
            isShowDeleteSegment.value = true;
        };
        const deletedSegment = () => {
            selectedRowKeys.value = [];
            total.value = segmentsNonDefault.value.length;
            if (!segmentsNonDefault.value.length) {
                status.value = 'empty';
            }
        };
        const showEditSegmentModal = (segment: Segment) => {
            console.log('isShowEditSegment');
            isShowEditSegment.value = true;
            selectedEditSegment.value = segment;
        };
        const toContactList = (segmentId: string) => {
            console.log('isShowEditSegment');
            routerPush('ContactListBySegment', { segmentId });
        };
        watch(
            searchValue,
            debounce((newVal: any) => {
                if (newVal) {
                    if (!isSearchByEnter.value) {
                        refreshData();
                        onSearchSegment(newVal);
                    } else {
                        isSearchByEnter.value = false;
                    }
                } else {
                    refreshData();
                    onSearchSegment(newVal);
                }
            }, 2000),
        );

        onMounted(async () => {
            await onSearchSegment(searchValue.value);
        });

        return {
            searchValue,
            segmentsNonDefault,
            selectedRowKeys,
            total,
            loading,
            next_page,
            onEnterSearch,
            onSelectChange,
            tableColumns,
            showDeleteSegmentModal,
            showEditSegmentModal,
            isShowEditSegment,
            isShowDeleteSegment,
            selectedEditSegment,
            selectedSegmentIds,
            totalSelectedSegmentIds,
            toContactList,
            status,
            deletedSegment,
            filters,
            segmentFilters,
        };
    },
};
</script>

<style lang="scss">
.setting-segment {
    height: 100%;
    &__data {
        &-table {
            max-height: calc(100vh - 251px);
            overflow: auto;
        }
    }
}
</style>
