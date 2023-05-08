<template>
    <div class="dropdown-canned font-body">
        <div class="h-48 py-8p px-12p flex items-center justify-between border-b border-neutrals-100">
            <p class="text-16 font-medium">{{ $t('inbox.inbox_composer_canned_responses_title') }}</p>
            <button-component class="ml-auto" type="primary" size="small" @click="onCloseDropdown">
                <router-link :to="{ name: 'CannedResponseCreate' }" target="_blank" class="flex items-center">
                    <icon-comp class="mr-4p" name="plus" color="white"></icon-comp>
                    {{ $t('inbox.inbox_composer_canned_responses_button_create') }}
                </router-link>
            </button-component>
        </div>
        <div class="p-8p border-b border-neutrals-100">
            <input-comp
                class="mb-8p"
                closeIcon
                :placeholder="$t('inbox.inbox_composer_canned_responses_input_search_placeholder')"
                v-model="searchValue"
                v-on:keyup.enter="onEnterSearch"
            >
                <template v-slot:prefix>
                    <icon-comp name="search"></icon-comp>
                </template>
            </input-comp>
            <div class="flex">
                <select-component
                    class="mr-4p select-canned__category"
                    v-model="valueSelectCategory"
                    showSearch
                    maxHeightList="148px"
                    @change="onChangeSelectCategory"
                    :titleDefault="$t('inbox.inbox_composer_canned_responses_select_category_placeholder')"
                    @callData="onCallCateBySearch"
                    :loadMore="true"
                    :placeholder="$t('inbox.inbox_composer_canned_responses_select_category_search_placeholder')"
                >
                    <select-panel
                        v-for="(item, index) in categoriesSearched"
                        :key="'cate-' + index"
                        :value="item.id"
                        :selectedLabel="item.name"
                    >
                        {{ item.name }}
                    </select-panel>
                </select-component>
                <select-component
                    class="ml-4p select-canned__available"
                    v-model="valueSelectAvailableFor"
                    showSearch
                    :titleDefault="$t('inbox.inbox_composer_canned_responses_select_available_placeholder')"
                    maxHeightList="148px"
                    @change="onChangeSelectAvailableFor"
                    :placeholder="$t('inbox.inbox_composer_canned_responses_select_available_search_placeholder')"
                >
                    <select-panel
                        v-for="(item, index) in optionSelectAvailableFor"
                        :key="'available-' + index"
                        :value="item.key"
                        >{{ item.name }}</select-panel
                    >
                </select-component>
            </div>
        </div>
        <div class="h-256 flex items-center justify-center">
            <template v-if="isLoading">
                <InboxComposerDropdownCannedResponseSkeleton />
            </template>
            <template v-else>
                <template v-if="cannedResponses.length">
                    <div class="w-232 h-full">
                        <ListGroup
                            class="h-full canned__list"
                            v-model="cannedResponseValue"
                            heightList="100%"
                            @onMouseEnterItem="showContentCannedResponse"
                            :searchByAPI="true"
                            @scrollBottom="onScrollToBottom"
                        >
                            <list-item
                                type="default-blue"
                                :value="item"
                                v-for="item in cannedResponses"
                                :key="`canned-response-${item.id}`"
                            >
                                /{{ item.shortcut }}
                                <template #decription>
                                    <span class="block truncate" v-html="formatContent(item.content)"></span>
                                </template>
                            </list-item>
                            <template #loadmore v-if="isLoadMore">
                                <Spinner size="small" color="#3E6DDA" />
                            </template>
                        </ListGroup>
                    </div>
                    <div class="w-328 h-full py-8p border-l border-neutrals-100">
                        <div
                            class="canned--preview h-full px-8p overflow-y-auto scrollbar--transparent"
                            v-html="cannedResponseContent"
                        ></div>
                    </div>
                </template>
                <template v-else-if="!cannedResponses.length && isSearchFilter && !isCateDeleted">
                    <div class="flex items-center justify-center h-full w-full flex flex-col items-center bg-white">
                        <img class="logo mx-auto w-120 h-120" src="../images/no-data.svg" alt="banner" />
                        <div class="text-center">
                            <span class="text-neutrals-400 text-16 block">
                                <span
                                    class="flex items-center text-neutrals-900"
                                    v-html="$t('inbox.inbox_composer_canned_responses_filter_no_data')"
                                >
                                </span>
                            </span>
                        </div>
                    </div>
                </template>
                <template v-else-if="!cannedResponses.length && !isSearchFilter && isSearchText && !isCateDeleted">
                    <div
                        class="
                            flex
                            items-center
                            justify-center
                            h-full
                            w-full
                            flex flex-col
                            items-center
                            bg-white
                            px-24p
                        "
                    >
                        <img class="logo mx-auto w-120 h-120" src="../images/no-data.svg" alt="banner" />
                        <div class="text-center max-w-full">
                            <span class="text-neutrals-400 text-16 block">
                                <span class="text-neutrals-900 truncate w-min block">
                                    {{ $t('inbox.inbox_composer_canned_responses_filter_text_no_data') }} “{{
                                        searchValue
                                    }}”.
                                </span>
                                <span class="text-neutrals-900">{{
                                    $t('inbox.inbox_composer_canned_responses_filter_please_again_keyword')
                                }}</span>
                            </span>
                        </div>
                    </div>
                </template>
                <template
                    v-else-if="
                        status === 'init' &&
                        !cannedResponses.length &&
                        !isSearchFilter &&
                        !isSearchText &&
                        !isCateDeleted
                    "
                >
                    <div class="flex items-center justify-center h-full w-full flex flex-col items-center bg-white">
                        <FolderEmptyImage></FolderEmptyImage>
                        <div class="text-center">
                            <span class="font-bold block text-16">{{
                                $t('inbox.inbox_composer_canned_responses_empty_title')
                            }}</span>
                            <span class="text-neutrals-400 text-14 mt-4p block">
                                {{ $t('inbox.inbox_composer_canned_responses_empty_content') }}
                            </span>
                        </div>
                    </div>
                </template>
                <template v-else-if="!cannedResponses.length && isCateDeleted">
                    <div class="flex items-center justify-center h-full w-full flex flex-col items-center bg-white">
                        <ItemDeleteImage></ItemDeleteImage>
                        <div class="text-center text-16">
                            <p class="text-neutrals-900">
                                {{ $t('inbox.inbox_composer_canned_responses_deleted_title') }}
                            </p>
                            <p class="text-neutrals-900">
                                {{ $t('inbox.inbox_composer_canned_responses_deleted_content') }}
                            </p>
                        </div>
                    </div>
                </template>
            </template>
        </div>
        <div class="h-44 py-12p px-16p bg-neutrals-50">
            <button-component type="link">
                <router-link :to="{ name: 'CannedResponsesList' }" target="_blank" class="flex items-center">
                    {{ $t('inbox.inbox_composer_canned_responses_link_to_manage') }}
                    <icon-comp class="ml-4p" name="ExternalLikeSquareAlt" color="primary-500"></icon-comp>
                </router-link>
            </button-component>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import InputComp from '@/components/ui/InputComponent.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import SelectComponent from '@/components/ui/SelectComponent.vue';
import SelectPanel from '@/components/ui/SelectPanel.vue';
import ListGroup from '@/components/ui/ListComponent.vue';
import ListItem from '@/components/ui/ListItemComponent.vue';
import Spinner from '@/components/ui/Spinner.vue';
import InboxComposerDropdownCannedResponseSkeleton from './InboxComposerDropdownCannedResponseSkeleton.vue';
import ItemDeleteImage from '../images/item-deleted.vue';
import FolderEmptyImage from '../images/folder-empty.vue';
import debounce from 'lodash/debounce';
import { store } from '@/store';
import { useSocket } from '@/composables/useSocket';
import { useCannedResponse } from '@/modules/setting/composables/useCannedResponse';

export default {
    name: 'InboxComposerDropdownCannedResponse',
    props: {},
    components: {
        InputComp,
        IconComp,
        ButtonComponent,
        SelectComponent,
        SelectPanel,
        ListGroup,
        ListItem,
        InboxComposerDropdownCannedResponseSkeleton,
        ItemDeleteImage,
        FolderEmptyImage,
        Spinner,
    },
    emits: ['addCanned', 'close'],
    setup(props: any, { emit }: any) {
        const status = ref<string>('init');
        const searchValue = ref<string>('');
        const cannedResponseValue = ref<any>(null);
        const cannedResponseContent = ref<string>('');
        const valueSelectCategory = ref<any>(null);
        const categoriesSearched = ref<Array<any>>([]);
        const next_page = ref<any>(null);
        const next_page_category = ref<any>(null);
        const isLoading = ref(false);
        const isLoadMore = ref(false);
        const isSearchText = ref<boolean>(false);
        const isSearchByEnter = ref<boolean>(false);
        const isCateDeleted = ref<boolean>(false);
        const noCateValue = ref(null);
        const valueSelectAvailableFor = ref<string | null | number>(null);
        const user = computed(() => store.state.auth.user);
        const listCateDeleted = ref<any>([]);
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
        const { cannedResponses, getCannedResponse, searchCategory } = useCannedResponse();
        const { socket } = useSocket();

        const isSearchFilter = computed(() => valueSelectCategory.value || valueSelectAvailableFor.value);
        const formatContent = computed(() => {
            return (content: any) => {
                if (typeof content === 'object') return '';
                const iconImage =
                    ' <svg class="inline-block" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M15.6875 5.25H4.3125C3.57422 5.25 3 5.85156 3 6.5625V14.4375C3 15.1758 3.57422 15.75 4.3125 15.75H15.6875C16.3984 15.75 17 15.1758 17 14.4375V6.5625C17 5.85156 16.3984 5.25 15.6875 5.25ZM4.48965 8.16394C4.48965 7.42614 5.05977 6.82248 5.83111 6.82248C6.56892 6.82248 7.17258 7.42614 7.17258 8.16394C7.17258 8.93528 6.56892 9.5054 5.83111 9.5054C5.05977 9.5054 4.48965 8.93528 4.48965 8.16394ZM5.26829 14.1776C4.99215 14.1776 4.76829 13.9537 4.76829 13.6776V12.5678L6.07621 11.2599C6.2439 11.0922 6.47865 11.0922 6.64634 11.2599L7.9878 12.5678L11.9787 8.57697C12.1463 8.40929 12.3811 8.40929 12.5488 8.57697L15.5 11.4947V13.6776C15.5 13.9537 15.2761 14.1776 15 14.1776H5.26829Z" fill="#828292"/>\n' +
                    '</svg> ';
                let res = content.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('<br>', '');
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

        const onCloseDropdown = () => {
            emit('close');
        };
        const showContentCannedResponse = (data: any) => {
            cannedResponseContent.value = data.content;
        };
        const refreshData = () => {
            next_page.value = null;
            cannedResponses.value = [];
        };
        const onSearchCannedResponse = async () => {
            isLoading.value = true;
            const data = await getCannedResponse({
                q: searchValue.value,
                cat_id: valueSelectCategory.value,
                next_page: next_page.value,
                available: valueSelectAvailableFor.value === 666 ? '' : valueSelectAvailableFor.value,
                available_everyone:
                    valueSelectAvailableFor.value === null ? null : valueSelectAvailableFor.value === 666,
            });
            isLoading.value = false;
            cannedResponses.value = [...cannedResponses.value, ...data.data];
            if (cannedResponses.value.length > 0) {
                cannedResponseContent.value = cannedResponses.value[0].content;
            }
            next_page.value = data.next_page;
        };
        const onLoadmoreCannedResponse = async () => {
            isLoadMore.value = true;
            const data = await getCannedResponse({
                q: searchValue.value,
                cat_id: valueSelectCategory.value,
                next_page: next_page.value,
                available: valueSelectAvailableFor.value === 666 ? '' : valueSelectAvailableFor.value,
                available_everyone:
                    valueSelectAvailableFor.value === null ? null : valueSelectAvailableFor.value === 666,
            });
            isLoadMore.value = false;
            cannedResponses.value = [...cannedResponses.value, ...data.data];
            next_page.value = data.next_page;
        };
        const onGetNoCateValue = async () => {
            try {
                const dataNoCate = await searchCategory({ type: 1 });
                categoriesSearched.value = dataNoCate.data.concat(categoriesSearched.value);
            } catch (e) {
                console.log(e);
            }
        };
        const onCallCateBySearch = async (val: any) => {
            if (!val.push) {
                categoriesSearched.value = [];
                next_page_category.value = null;
            } else {
                if (next_page_category.value == null) return;
            }
            if (!val.text && !val.push) {
                await onGetNoCateValue();
                const res = await searchCategory({ q: val.text, next_page: next_page_category.value, type: 3 });
                if (!res.error) {
                    next_page_category.value = res.next_page;
                    categoriesSearched.value = [...categoriesSearched.value, ...res.data];
                }
            } else {
                const res = await searchCategory({ q: val.text, next_page: next_page_category.value });
                if (!res.error) {
                    next_page_category.value = res.next_page;
                    categoriesSearched.value = [...categoriesSearched.value, ...res.data];
                }
            }
        };

        const onEnterSearch = debounce((e) => {
            if (searchValue.value === '') {
                isSearchText.value = false;
            } else {
                isSearchText.value = true;
            }
            refreshData();
            isSearchByEnter.value = true;
            onSearchCannedResponse();
        }, 0);
        const onChangeSelectCategory = debounce((e) => {
            isSearchText.value = false;
            if (!listCateDeleted.value.includes(valueSelectCategory.value)) {
                refreshData();
                onSearchCannedResponse();
                isCateDeleted.value = false;
            } else {
                cannedResponses.value = [];
                isCateDeleted.value = true;
            }
        }, 0);
        const onChangeSelectAvailableFor = debounce((e) => {
            isSearchText.value = false;
            refreshData();
            onSearchCannedResponse();
        }, 0);
        const onScrollToBottom = async () => {
            if (next_page.value) {
                await onLoadmoreCannedResponse();
            }
        };

        watch(
            searchValue,
            debounce((newVal) => {
                if (newVal) {
                    if (!isSearchByEnter.value) {
                        status.value = 'searching';
                        isLoading.value = true;
                        refreshData();
                        onSearchCannedResponse();
                    } else {
                        isSearchByEnter.value = false;
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
            () => valueSelectCategory.value,
            (newVal: any) => {
                if (newVal === '') {
                    valueSelectCategory.value = null;
                    refreshData();
                    onSearchCannedResponse();
                }
            },
        );
        watch(
            () => valueSelectAvailableFor.value,
            (newVal: any) => {
                if (newVal === '') {
                    valueSelectAvailableFor.value = null;
                    refreshData();
                    onSearchCannedResponse();
                }
            },
        );
        watch(
            () => cannedResponseValue.value,
            (newVal: any) => {
                if (newVal !== null) {
                    emit('addCanned', newVal);
                }
            },
        );

        socket.on('canrescat.delete.complete', (data: any) => {
            listCateDeleted.value.push(data.data.category_id);
        });

        onMounted(async () => {
            status.value = 'init';
            refreshData();
            await onSearchCannedResponse();
            await onCallCateBySearch({ text: '', push: false });
            cannedResponseValue.value = null;
        });

        return {
            status,
            searchValue,
            isLoading,
            valueSelectCategory,
            valueSelectAvailableFor,
            categoriesSearched,
            optionSelectAvailableFor,
            isSearchFilter,
            isSearchText,
            onEnterSearch,
            onChangeSelectCategory,
            onChangeSelectAvailableFor,
            onCallCateBySearch,
            noCateValue,
            cannedResponses,
            cannedResponseValue,
            formatContent,
            showContentCannedResponse,
            cannedResponseContent,
            listCateDeleted,
            isCateDeleted,
            onCloseDropdown,
            onScrollToBottom,
            isLoadMore,
        };
    },
};
</script>

<style lang="scss">
.canned--preview {
    .composer-contenteditable__image {
        width: auto !important;
        min-height: auto !important;
    }
    .composer-contenteditable__overlay,
    .composer-contenteditable__btn-delete {
        display: none !important;
    }
}
.canned__list {
    padding-top: 8px;
    .scrollbar--transparent.overflow-y-auto {
        padding: 0 8px;
    }
}
.select-canned__category {
    width: 316px !important;
}
.select-canned__available {
    width: 220px !important;
}
</style>
