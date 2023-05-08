<template>
    <div>
        <modal-component
            v-model="showModalSync"
            :custom-class="'py-24p'"
            :width="'560px'"
            class="model-add-contact z-999"
        >
            <template v-slot:header>
                <div class="flex">
                    <span class="font-medium text-16 ml-4p">
                        {{ $t('setting.canned_response_modal_change_cate_title') }}
                    </span>
                </div>
            </template>
            <template v-slot:body>
                <div class="pt-16p pb-8p text-14">
                    <span class="mb-8p px-32p block">
                        {{
                            countSelected > 1
                                ? 'This will move ' + countSelected + ' canned responses to the new category.'
                                : countSelected === 0
                                ? 'This will move canned responses to the new category.'
                                : 'This will move ' + countSelected + ' canned response to the new category.'
                        }}
                    </span>
                    <div class="px-24p">
                        <ListGroup
                            showSearch
                            v-model="valueSelect"
                            heightList="216px"
                            class="m-auto"
                            placeholderSearch="Search category"
                            :searchByAPI="true"
                            @changeTextSearch="changeTextSearch"
                            @scrollBottom="scrollBottom"
                            :clearTextSearch="true"
                            :isClear="isClear"
                        >
                            <list-item
                                v-for="(category, index) in categories"
                                :key="index"
                                type="default-blue"
                                :value="category.id"
                            >
                                {{ category.name }}
                            </list-item>
                        </ListGroup>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <Button class="mr-8p" type="outline" size="medium" @click="closeModalHide">{{
                        $t('setting.teammate_modal_edit_email_button_cancel')
                    }}</Button>
                    <Button size="medium" @click="clickSubmit" :disabled="onDisabledSubmit">Change</Button>
                </div>
            </template>
        </modal-component>
        <modal-component
            v-model="showModalResponse"
            :closeIcon="false"
            :custom-class="'py-24p'"
            :width="'508px'"
            class="model-add-contact z-999"
        >
            <template v-slot:body>
                <div class="px-24p pt-8p text-center text-14">
                    <p class="text-24 font-semibold capitalize font-heading">
                        {{ countSelected > 1 ? 'Unable To Change Categories' : 'Unable to Change category' }}
                    </p>
                    <p class="text-14 my-16p mx-30p">
                        {{
                            countSelected > 1
                                ? 'These categories have been deleted by another teammate.'
                                : 'This canned response has been deleted by another teammate.'
                        }}
                    </p>
                    <Button size="medium" @click="closeModalResponse">{{
                        $t('setting.canned_response_create_button_got_it')
                    }}</Button>
                </div>
            </template>
        </modal-component>
        <modal-component
            v-model="showModalResponseError"
            :closeIcon="false"
            :custom-class="'py-24p'"
            :width="'508px'"
            class="model-add-contact z-999"
        >
            <template v-slot:body>
                <div class="px-24p pt-8p text-center text-14">
                    <p class="text-24 font-semibold capitalize font-heading">
                        {{ $t('setting.canned_response_modal_change_cate_error_title') }}
                    </p>
                    <p class="text-14 my-16p mx-30p">
                        {{ $t('setting.canned_response_modal_change_cate_error_content') }}
                    </p>
                    <Button size="medium" @click="closeModalResponseError">{{
                        $t('setting.canned_response_create_button_got_it')
                    }}</Button>
                </div>
            </template>
        </modal-component>
        <modal-component
            v-model="showModalNoCategory"
            :closeIcon="false"
            :custom-class="'py-24p'"
            :width="'508px'"
            class="model-add-contact z-999"
        >
            <template v-slot:body>
                <div class="px-24p pt-8p text-center text-14">
                    <p class="text-24 font-semibold capitalize font-heading">
                        {{ $t('setting.canned_response_modal_change_cate_error_nocate_title') }}
                    </p>
                    <p class="text-14 my-16p mx-30p">
                        {{ $t('setting.canned_response_modal_change_cate_error_nocate_content_1') }}<br />
                        {{ $t('setting.canned_response_modal_change_cate_error_nocate_content_2') }}
                    </p>
                    <Button size="medium" @click="closeModalNoCategory">{{
                        $t('setting.canned_response_create_button_got_it')
                    }}</Button>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, watch } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import { store } from '@/store';
import { useCannedResponse } from '@/modules/setting/composables/useCannedResponse';
import { useToast } from '@/composables/useToast';
import ListGroup from '@/components/ui/ListComponent.vue';
import ListItem from '@/components/ui/ListItemComponent.vue';
import debounce from 'lodash/debounce';

export default defineComponent({
    name: 'SettingCannedResponseModalChangeCategory',
    components: {
        ModalComponent,
        Button,
        ListGroup,
        ListItem,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        cannedResponses: {
            type: Array,
            default: () => [],
        },
        count: {
            type: Number,
            default: 0,
        },
        searchValue: {
            type: String,
            default: null,
        },
        valueSelectAuth: {
            type: String,
            default: null,
        },
        valueSelectCategory: {
            type: String,
            default: null,
        },
        available: {
            type: String,
            default: null,
        },
        updated_from: {
            type: String,
            default: null,
        },
        updated_to: {
            type: String,
            default: null,
        },
        countFilter: {
            type: Number,
            default: 0,
        },
        available_everyone: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const { changeCategoryCannedResponse } = useCannedResponse();
        const showModalResponse = ref<boolean>(false);
        const showModalResponseError = ref<boolean>(false);
        const showModalNoCategory = ref<boolean>(false);
        const currentUser = computed(() => store.state.auth.user);
        const { addToast } = useToast();
        const valueSelect = ref<string>('');
        const textSearch = ref<string>('');
        const next_page = ref<any>(null);
        const isClear = ref<any>(0);
        const noCate = ref<any>({});
        const { searchCategory } = useCannedResponse();
        const workspaceName = computed(() => {
            if (typeof currentUser.value.workspace.name != 'undefined') return currentUser.value.workspace.name;
            return '';
        });
        const categories = ref<any>([]);
        const cannedResponseError = ref<any>([]);

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const countSelected = computed(() => {
            if (props.count === 0) return props.countFilter;
            else return props.count;
        });

        const onDisabledSubmit = computed(() => {
            return valueSelect.value === '';
        });

        const clearData = () => {
            next_page.value = null;
            categories.value = [];
        };

        const onCallCateBySearch = async (val: any) => {
            const data = await searchCategory({ q: val, next_page: next_page.value });
            if (!data.error) {
                next_page.value = data.next_page;
                if (val === '' && noCate.value.id) {
                    const cateList = data.data.filter((cate: any) => cate.id != noCate.value.id);
                    if (categories.value.length === 0) {
                        cateList.unshift(noCate.value);
                        categories.value = cateList;
                    } else categories.value = [...categories.value, ...cateList];
                } else {
                    categories.value = [...categories.value, ...data.data];
                }
            }
        };

        const closeModalHide = () => {
            emit('close');
        };

        const changeTextSearch = async (val: any) => {
            textSearch.value = val;
        };

        const scrollBottom = async (val: any) => {
            if (next_page.value) await onCallCateBySearch(val);
        };

        const clickSubmit = async () => {
            const listID = props.cannedResponses.length > 0 ? props.cannedResponses : [];
            let param;
            if (listID.length > 0) {
                param = {
                    category_id: valueSelect.value,
                    ids: listID,
                };
            } else {
                param = {
                    category_id: valueSelect.value,
                    filter: {
                        q: props.searchValue,
                        updated_by: props.valueSelectAuth,
                        updated_at_from: props.updated_from,
                        updated_at_to: props.updated_to,
                        available: props.available,
                        cat_id: props.valueSelectCategory,
                        available_everyone: props.available_everyone,
                    },
                };
            }
            const res = await changeCategoryCannedResponse(param);
            if (!res.error) {
                emit('submitChangeCategory', res.data.updated_count);
                await new Promise(resolve => setTimeout(resolve, 300));
                closeModalHide();
                addToast({
                    title: 'Changed category successfully',
                    type: 'basic',
                    timeout: 3000,
                });
            } else {
                // const messages = {
                //     invalid_ids: ['615414835dcffe789af75694', '615414835dcffe789af75694', '6154153149d95a79c15435e5'],
                // };
                cannedResponseError.value = [];
                if ('invalid_ids' in res.message) {
                    if (res.message.invalid_ids.length === props.count || props.count === 0) {
                        showModalResponse.value = true;
                        closeModalHide();
                    } else {
                        cannedResponseError.value = res.message.invalid_ids;
                        showModalResponseError.value = true;
                        closeModalHide();
                    }
                } else if ('category_id' in res.message) {
                    showModalNoCategory.value = true;
                }
            }
        };

        const closeModalResponse = () => {
            location.reload();
        };

        const closeModalResponseError = () => {
            emit('submitChangeCategoryError', cannedResponseError.value);
            showModalResponseError.value = false;
        };

        const handleNoCategory = async () => {
            const data = await searchCategory({ type: 1 });
            if (!data.error) {
                if (data.data.length > 0) {
                    data.data[0]['_id'] = data.data[0]['id'];
                    noCate.value = data.data[0];
                    // categories.value.push(data.data[0]);
                }
            }
        };

        const closeModalNoCategory = async () => {
            clearData();
            isClear.value++;
            await onCallCateBySearch(textSearch.value);
            await new Promise(resolve => setTimeout(resolve, 100));
            showModalNoCategory.value = false;
            if (noCate.value.id) {
                valueSelect.value = noCate.value.id;
            }
        };

        onMounted(async () => {
            await handleNoCategory();
        });

        watch(
            textSearch,
            debounce(newVal => {
                clearData();
                onCallCateBySearch(newVal);
            }, 2000),
        );

        watch(
            () => showModalSync,
            () => {
                clearData();
                isClear.value++;
                if (showModalSync.value) onCallCateBySearch('');
                else {
                    valueSelect.value = '';
                }
            },
            { deep: true },
        );

        return {
            showModalSync,
            closeModalHide,
            clickSubmit,
            onDisabledSubmit,
            showModalResponse,
            showModalResponseError,
            showModalNoCategory,
            closeModalResponse,
            workspaceName,
            valueSelect,
            changeTextSearch,
            scrollBottom,
            categories,
            closeModalResponseError,
            closeModalNoCategory,
            countSelected,
            isClear,
        };
    },
});
</script>
