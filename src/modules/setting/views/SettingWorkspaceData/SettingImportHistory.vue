<template>
    <div class="setting-teammate py-24p px-40p h-full w-full relative">
        <div class="text-24 font-semibold flex items-center justify-between mb-24p">
            <h2 class="text-24 font-heading">{{ $t('setting.import_history_title') }}</h2>
        </div>
        <template v-if="importHistories.length !== 0 || loading">
            <div class="setting-teammate__data">
                <new-table-component
                    class="setting-import-history__data-table"
                    :loading="!next_page && loading"
                    :loadingRow="isLoadMore"
                    :columns="columns"
                    :data-source="importHistories"
                    :nextPage="next_page"
                    :scrollToBottom="onScrollToBottom"
                    fixed
                    tableLayout="fixed"
                >
                    <template v-slot:loading>
                        <setting-import-history-table-skeleton-component />
                    </template>
                    <template v-slot:name="{ record }">
                        <TooltipComponent showByTruncate type="light" position="top" :content="record.file_name">
                            <span class="truncate font-normal block">{{
                                record.file_name ? record.file_name : ''
                            }}</span>
                        </TooltipComponent>
                    </template>
                    <template v-slot:date_created="{ record }">
                        <span class="truncate">{{ record.created_at ? formatDate(record.created_at) : '' }}</span>
                    </template>
                    <template v-slot:imported_by="{ record }">
                        <div class="whitespace-nowrap overflow-hidden flex items-center td-avatar">
                            <avatar-component
                                :labelShow="false"
                                :label-avatar="record.full_name"
                                :bgAvatar="record.avatar_bg"
                                size="small"
                                :image="record.avatar_src"
                                :userRemoved="record.user_removed"
                            />
                            <div class="inline-block text-left flex flex-col text-14p ml-16p truncate">
                                <TooltipComponent
                                    showByTruncate
                                    type="light"
                                    position="top"
                                    :content="record.full_name"
                                >
                                    <span class="truncate font-normal block">{{
                                        record.full_name ? record.full_name : ''
                                    }}</span>
                                </TooltipComponent>
                            </div>
                        </div>
                    </template>
                    <template v-slot:new_contact="{ record }">
                        <span class="truncate">{{ record.success_created }}</span>
                    </template>
                    <template v-slot:updated_contact="{ record }">
                        <span class="truncate">{{ record.success_updated }}</span>
                    </template>
                    <template v-slot:error="{ record }">
                        <span
                            class="truncate text-error-3"
                            :class="record.error > 0 ? 'cursor-pointer' : ''"
                            @click="onToggleErrorDetail(record)"
                            >{{ record.error }}</span
                        >
                    </template>
                </new-table-component>
            </div>
        </template>
        <template v-else-if="!loading && importHistories.length === 0">
            <div class="setting-teammate__no-data relative flex flex-col justify-center items-center">
                <div class="w-inherit">
                    <img class="logo mx-auto w-120 h-120" src="@/modules/setting/images/nodata.svg" alt="banner" />
                    <div class="text-center w-min truncate">
                        {{ $t('setting.import_history_no_data_title') }}
                    </div>
                </div>
            </div>
        </template>
        <modal-error-detail
            v-model:showModal="isShowEditEmail"
            @close="() => (isShowEditEmail = false)"
            :idHistoryImport="idHistoryImport"
        />
    </div>
</template>

<script lang="ts">
import NewTableComponent from '@/components/ui/NewTableComponent.vue';
import { ref, computed, onMounted, inject } from 'vue';
import { columnItem } from '@/types/table';
import SettingImportHistoryTableSkeletonComponent from '../../components/SettingImportHistoryTableSkeletonComponent.vue';
import { STATUS as STATUS_USER } from '@/constant/user';
import { useI18n } from 'vue-i18n';
import { store } from '@/store';
import { useImportHistory } from '@/modules/setting/composables/useImportHistory';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import ModalErrorDetail from '../../components/SettingImportHistoryModalErrorDetail.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';

export default {
    name: 'SettingImportHistory',
    components: {
        SettingImportHistoryTableSkeletonComponent,
        NewTableComponent,
        AvatarComponent,
        ModalErrorDetail,
        TooltipComponent,
    },
    setup() {
        const { t } = useI18n();
        const defaultColumns: columnItem[] = [
            {
                title: t('setting.import_table_file_name'),
                dataIndex: 'name',
                scopedSlots: { customRender: 'name' },
                width: '255px',
            },
            {
                title: t('setting.import_table_date_created'),
                dataIndex: 'date_created',
                scopedSlots: { customRender: 'date_created' },
                width: '152px',
            },
            {
                title: t('setting.import_table_imported_by'),
                dataIndex: 'imported_by',
                scopedSlots: { customRender: 'imported_by' },
                width: '240px',
            },
            {
                title: t('setting.import_table_new_contact'),
                dataIndex: 'new_contact',
                scopedSlots: { customRender: 'new_contact' },
                width: '128px',
            },
            {
                title: t('setting.import_table_updated_contact'),
                dataIndex: 'updated_contact',
                scopedSlots: { customRender: 'updated_contact' },
                width: '160px',
            },
            {
                title: t('setting.import_table_error'),
                dataIndex: 'error',
                scopedSlots: { customRender: 'error' },
                width: '104px',
            },
        ];
        const status = ref('init');
        const importHistories = ref<any>([]);
        const columns = ref<columnItem[]>(defaultColumns);
        const next_page = ref(null);
        const total = ref(null);
        const idHistoryImport = ref('');
        const isLoadMore = ref(false);
        const { loading, getImportHistory } = useImportHistory();
        const envURL = `${process.env.VUE_APP_CONTACT_AVATAR_URL}/`;
        const userStore = computed(() => {
            return store.state.auth.user;
        });
        const isShowEditEmail = ref(false);
        const emitter: any = inject('emitter');

        const onGetImportHistory = async function () {
            const data = await getImportHistory({
                next_page: next_page.value,
            });
            importHistories.value = [...importHistories.value, ...data.data];
            next_page.value = data.next_page;
            total.value = data.total;
            status.value = 'loaded';
            return Promise.resolve();
        };

        const onToggleErrorDetail = (error: any) => {
            if (error.error < 1) return;
            isShowEditEmail.value = true;
            idHistoryImport.value = error._id;
            emitter.emit('clickErrorImport', error._id);
        };

        const formatDate = computed(() => {
            return (date: any) => {
                return new Date(date).toLocaleDateString();
            };
        });

        const onScrollToBottom = async () => {
            if (next_page.value && !isLoadMore.value && next_page.value !== '') {
                isLoadMore.value = true;
                await onGetImportHistory();
                isLoadMore.value = false;
            }
        };

        onMounted(async () => {
            await onGetImportHistory();
        });

        return {
            loading,
            columns,
            importHistories,
            status,
            next_page,
            total,
            isLoadMore,
            envURL,
            STATUS_USER,
            userStore,
            onScrollToBottom,
            isShowEditEmail,
            idHistoryImport,
            onToggleErrorDetail,
            formatDate,
        };
    },
};
</script>

<style lang="scss">
.setting-teammate {
    height: 100%;
    &__no-data {
        top: calc(30% - 114px);
        width: -webkit-fill-available;
    }
    &__data {
        &-table {
            max-height: calc(100vh - 279px);
            overflow: auto;
            // overflow: auto;
        }
    }
}
.setting-import-history__data-table {
    max-height: calc(100vh - 279px);
    overflow: auto;

    .td-avatar {
        padding-top: 4px;
        padding-bottom: 3px;
    }
}
</style>
