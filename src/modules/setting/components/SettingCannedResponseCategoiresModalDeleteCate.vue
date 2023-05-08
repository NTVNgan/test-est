<template>
    <teleport to="#modal">
        <modal-component
            v-model="showModalSync"
            :custom-class="'pt-32p pb-24p'"
            :width="'560px'"
            class="model-add-contact font-body z-999"
        >
            <template v-slot:header>
                <div class="flex items-center">
                    <icon-component class="mr-4p" name="exclamation-circle" color="error-3" />
                    <span class="font-medium text-16">
                        {{
                            total === 1
                                ? $t('setting.canned_response_cate_modal_delete_title_singular')
                                : $t('setting.canned_response_cate_modal_delete_title_plural', { total })
                        }}
                    </span>
                </div>
            </template>
            <template v-slot:body>
                <div class="px-24p" v-if="isHaveCannedResInCategory">
                    <div class="px-8p text-14">
                        {{
                            total === 1
                                ? $t('setting.canned_response_cate_modal_delete_description1_singular', {
                                      workspaceName: userStore.workspace.name,
                                  })
                                : $t('setting.canned_response_cate_modal_delete_description1_plural', {
                                      workspaceName: userStore.workspace.name,
                                  })
                        }}
                    </div>
                    <ListGroup
                        showSearch
                        v-model="transferCategoryId"
                        heightList="216px"
                        :placeholderSearch="$t('setting.canned_response_cate_modal_delete_placeholder_search')"
                        :searchByAPI="true"
                        typeActive="selected"
                        @changeTextSearch="changeTextSearch"
                        @scrollBottom="onScrollToBottom"
                    >
                        <list-item v-for="(category, index) in categories" :key="index" :value="category.id">
                            {{ category.name }}
                        </list-item>
                    </ListGroup>
                </div>
                <div v-else class="px-24p py-8p text-14 text-center">
                    {{
                        total === 1
                            ? $t('setting.canned_response_cate_modal_delete_description2_singular', {
                                  workspaceName: userStore.workspace.name,
                              })
                            : $t('setting.canned_response_cate_modal_delete_description2_plural', {
                                  workspaceName: userStore.workspace.name,
                              })
                    }}
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end">
                    <button-component type="outline" class="mr-8p" size="medium" @click="closeModal">
                        {{ $t('setting.canned_response_cate_modal_delete_button_cancel') }}
                    </button-component>
                    <button-component @click="onDeleteCRCate" type="destructive" class="mr-8p" size="medium">
                        {{ $t('setting.canned_response_cate_modal_delete_button_delete') }}
                    </button-component>
                </div>
            </template>
        </modal-component>
        <modal-alert-component
            v-model:showModal="showModalAlert"
            width="496px"
            :title="$t('setting.canned_response_cate_modal_alert_title')"
            :content="$t('setting.canned_response_cate_modal_alert_content')"
            @onClickButton="reloadPage"
        />
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ModalAlertComponent from '@/components/ui/ModalAlertComponent.vue';
import ListGroup from '@/components/ui/ListComponent.vue';
import ListItem from '@/components/ui/ListItemComponent.vue';
import { store } from '@/store';
import { useCannedResponse } from '../composables/useCannedResponse';
import { useToast } from '@/composables/useToast';
import debounce from 'lodash/debounce';

export default defineComponent({
    name: 'SettingCannedResponseCategoiresModalDeleteCate',
    components: {
        IconComponent,
        ButtonComponent,
        ModalComponent,
        ListGroup,
        ListItem,
        ModalAlertComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        categoryIds: {
            type: Array,
            default: () => [],
        },
        cannedCategories: {
            type: Array,
            default: () => [],
        },
        categoryFilters: {
            type: Object,
        },
        total: {
            type: Number,
            default: 0,
        },
    },
    emits: ['update:showModal', 'created', 'submitDelete'],
    setup(props, { emit }) {
        const { addToast } = useToast();
        const { deleteCannedResponseCategory, getCannedCategoryBySearch, errorMessage, error } = useCannedResponse();
        const showModalAlert = ref<boolean>(false);
        const isHaveCannedResInCategory = ref<boolean>(true);
        const searchCategoryValue = ref<string>('');
        const transferCategoryId = ref<string>('');
        const searchValue = ref<string>('');
        const next_page = ref<any>(null);
        const categories = ref<any>([]);
        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });
        const userStore = computed(() => {
            return store.state.auth.user;
        });
        const checkDeleteAll = computed(() => {
            return (
                !props.categoryFilters?.q &&
                !props.categoryFilters?.updated_at_from &&
                !props.categoryFilters?.updated_at_to &&
                !props.categoryFilters?.updated_by
            );
        });
        const reloadPage = () => {
            location.reload();
        };
        const clearData = () => {
            next_page.value = null;
            categories.value = [];
        };
        const changeTextSearch = async (val: any) => {
            searchValue.value = val;
        };

        const closeModal = () => {
            emit('update:showModal', false);
        };
        const selectNoCategory = () => {
            const findCate = categories.value.find(
                (cate: any) => cate.name.toLowerCase() === 'no category' || cate.type === 1,
            );
            if (findCate) transferCategoryId.value = findCate.id;
        };
        const onDeleteCRCate = async () => {
            const formData: any = {};
            if (props.categoryIds.length) {
                formData.ids = props.categoryIds;
            } else {
                formData.filters = props.categoryFilters;
            }
            if (transferCategoryId.value) {
                formData.transfer_id = transferCategoryId.value;
            }
            await deleteCannedResponseCategory(formData);
            if (!error.value) {
                addToast({
                    title: 'Deleted category successfully.',
                    type: 'basic',
                    timeout: 3000,
                });
                closeModal();
                emit('submitDelete');
            } else {
                emit('update:showModal', false);
                await new Promise(resolve => setTimeout(resolve, 300));
                showModalAlert.value = true;
            }
        };
        const onSearchCannedCategories = async function() {
            const formData: any = {
                per_page: 20,
                next_page: next_page.value,
                destination_q: searchValue.value,
            };
            if (props.categoryIds.length) {
                formData.exclude_ids = props.categoryIds;
                formData.is_reversed = 1;
            } else {
                if (checkDeleteAll.value) {
                    formData.type = 1;
                } else {
                    formData.is_reversed = 1;
                    formData.q = props.categoryFilters?.q;
                    formData.updated_at_from = props.categoryFilters?.updated_at_from;
                    formData.updated_at_to = props.categoryFilters?.updated_at_to;
                    formData.updated_by = props.categoryFilters?.updated_by;
                }
            }
            const data = await getCannedCategoryBySearch(formData);
            categories.value = [...categories.value, ...data.data];
            next_page.value = data.next_page;
            selectNoCategory();
        };
        const onScrollToBottom = async () => {
            if (next_page.value) {
                await onSearchCannedCategories();
            }
        };
        const checkHaveCannedResInCategory = async () => {
            if (props.categoryIds.length) {
                isHaveCannedResInCategory.value = props.categoryIds.some((id: any) => {
                    const cate: any = props.cannedCategories.find((cate: any) => cate.id === id);
                    return cate.canned_response_total > 0;
                });
            } else {
                // call api check: nếu có canned trong list thì return true
                const formData = {
                    filters: props.categoryFilters,
                    check: true,
                };
                await deleteCannedResponseCategory(formData);
                isHaveCannedResInCategory.value = error.value;
            }
        };

        watch(
            searchValue,
            debounce(newVal => {
                clearData();
                onSearchCannedCategories();
            }, 2000),
        );
        watch(
            () => props.showModal,
            async (newVal: boolean) => {
                if (!newVal) {
                    categories.value = [];
                    transferCategoryId.value = '';
                    searchValue.value = '';
                } else {
                    await checkHaveCannedResInCategory();
                    if (isHaveCannedResInCategory.value) {
                        // call api get list cate còn lại
                        await onSearchCannedCategories();
                    }
                }
            },
            { deep: true },
        );

        return {
            categories,
            transferCategoryId,
            searchCategoryValue,
            showModalSync,
            showModalAlert,
            userStore,
            closeModal,
            onDeleteCRCate,
            reloadPage,
            changeTextSearch,
            onScrollToBottom,
            isHaveCannedResInCategory,
            checkDeleteAll,
        };
    },
});
</script>
