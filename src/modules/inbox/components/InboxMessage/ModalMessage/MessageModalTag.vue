<template>
    <div class="modal-tag-message">
        <modal-component
            v-model="showModalSync"
            :custom-class="'pb-8p body-modal-tag-message overflow-hidden'"
            :width="'560px'"
            :maxHeight="tags.length === 0 && textSearch === '' && !loading ? 'auto' : '536px'"
            class="model-add-contact z-999"
        >
            <template v-slot:header>
                <div class="flex">
                    <span class="font-medium text-16 ml-4p">
                        {{ $t('inbox.inbox_modal_tag_message_title') }}
                    </span>
                </div>
            </template>
            <template v-slot:body>
                <div class="pb-8p text-14">
                    <div
                        class="px-32p min-h-311p"
                        :class="isShowMaxTag || checkTagsHaveBeenUsed ? 'content-max-tag' : ''"
                    >
                        <div class="body-tag-selected-search pt-8p">
                            <Input
                                v-model="textSearch"
                                :state="state"
                                type="text"
                                :counter="true"
                                :placeholder="'Add tag'"
                                :inputModalTag="true"
                                :countItem="tagSelectedWidthName.length"
                                @keyup.enter="onEnterSearch"
                                :maxlength="100"
                            >
                                <template v-slot:prefix>
                                    <icon-component width="13" height="14" name="Tag"></icon-component>
                                </template>
                                <template v-slot:selectedItem>
                                    <div class="mx-12p content-tag-message">
                                        <div
                                            v-for="(tag, key) in tagSelectedWidthName"
                                            class="inline-block mb-8p mr-4p"
                                            :key="key"
                                        >
                                            <Tag
                                                :classCustom="'text-neutrals-900 w-100% max-w-full max-h-24'"
                                                :value="tag.name"
                                                icon="tag-solid-10"
                                                :isClose="true"
                                                @close="clearTag(tag)"
                                            >
                                                {{ tag.name }}
                                            </Tag>
                                        </div>
                                    </div>
                                </template>
                            </Input>
                        </div>
                        <div
                            v-if="
                                tags.length === 0 &&
                                    textSearch === '' &&
                                    !loading &&
                                    !isShowMaxTag &&
                                    !checkTagsHaveBeenUsed &&
                                    !waitingHandleTyping &&
                                    !callingDataTag
                            "
                            class="flex items-center justify-center h-full w-full flex flex-col items-center bg-white pt-70p pb-40p"
                        >
                            <img class="logo mx-auto" src="../../../images/no-tags.png" alt="banner" />
                            <div class="text-center">
                                <span class="block">
                                    <span class="text-center block text-16 text-neutrals-900 font-bold mb-4p">
                                        {{ $t('inbox.inbox_modal_empty_tag_title') }}
                                    </span>
                                    <span class="text-center block  text-14 text-neutrals-400">
                                        {{ $t('inbox.inbox_modal_empty_tag_body') }}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div
                            v-else-if="!isShowMaxTag && !checkTagsHaveBeenUsed"
                            class="scrollbar--transparent overflow-y-auto mt-16p body-tag-select"
                            :style="{ maxHeight: maxHeightSelect, minHeight: '152px' }"
                            @scroll="handleScrollToBottom"
                        >
                            <template v-if="tags.length === 0 && textSearch !== '' && !callingDataTag && !typingSearch">
                                <template v-if="textSearch.length > 1">
                                    <list-item
                                        :disabled="tagSelectedWidthName.length > 9"
                                        v-for="(tag, index) in tagBtnCreate"
                                        :key="index"
                                        type="default-blue"
                                        :value="tag.id"
                                        @click="onClickCreateTag"
                                        class="modal-btn-tag-create"
                                    >
                                        <span class="flex items-center">
                                            <icon-component
                                                name="plus"
                                                class="mr-6p"
                                                :color="tagSelectedWidthName.length > 9 ? 'primary-100' : 'primary-500'"
                                            ></icon-component>
                                            <span class="truncate"> {{ tag.name }}: "{{ textSearch }}" </span>
                                        </span>
                                    </list-item>
                                </template>
                            </template>
                            <template v-else>
                                <list-item
                                    :disabled="tagSelectedWidthName.length > 9"
                                    v-for="(tag, index) in tags"
                                    :key="index"
                                    type="default-blue"
                                    :value="tag.id"
                                    @click="selectTag(tag)"
                                    :truncateContent="false"
                                    class="modal-inbox-list-tag"
                                >
                                    {{ tag.name }}
                                </list-item>
                            </template>
                            <div v-if="loading" class="text-center">
                                <Spinner size="small" color="#3E6DDA" />
                            </div>
                        </div>
                        <template v-else-if="!isShowMaxTag && checkTagsHaveBeenUsed && !callingDataTag">
                            <div class="flex-1 relative min-h-172">
                                <span class="text-14 text-neutrals-300 text-center block error-max-tag">
                                    {{ $t('inbox.inbox_modal_tags_have_been_used') }}
                                </span>
                            </div>
                        </template>
                        <template v-else>
                            <div v-if="!callingDataTag" class="flex-1 relative min-h-172">
                                <span class="text-14 text-neutrals-300 text-center block error-max-tag ">
                                    {{ $t('inbox.inbox_modal_error_max_tags') }}<br />{{ workspaceName }}.
                                </span>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-between">
                    <button-component type="link">
                        <router-link :to="{ name: 'Tag' }" target="_blank" class="flex items-center">
                            {{ $t('inbox.inbox_modal_tag_link_to_manage_tag') }}
                            <icon-comp class="ml-4p" name="ExternalLikeSquareAlt" color="primary-500"></icon-comp>
                        </router-link>
                    </button-component>
                    <button-component size="medium" @click="clickSubmit" :disabled="onDisabledSubmit">
                        {{ $t('inbox.inbox_modal_tag_btn_apply') }}
                    </button-component>
                </div>
            </template>
        </modal-component>

        <modal-component
            v-model="showModalError"
            :closeIcon="false"
            :custom-class="'py-24p'"
            :width="'496px'"
            class="model-add-contact z-999"
        >
            <template v-slot:body>
                <div class="px-24p pt-8p text-center text-14">
                    <p class="text-24 font-semibold capitalize font-heading">
                        {{ $t('inbox.inbox_modal_tags_error_title') }}
                    </p>
                    <p class="text-14 my-16p mx-30p">
                        {{ $t('inbox.inbox_modal_tags_error_body') }}<br />
                        {{ $t('inbox.inbox_modal_tags_error_footer') }}
                    </p>
                    <ButtonComponent @click="onClickGotIt" size="medium">{{
                        $t('setting.canned_response_create_button_got_it')
                    }}</ButtonComponent>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { store } from '@/store';
import { useToast } from '@/composables/useToast';
import ListItem from '@/components/ui/ListItemComponent.vue';
import debounce from 'lodash/debounce';
import IconComponent from '@/components/ui/IconComponent.vue';
import Input from '@/components/ui/InputComponent.vue';
import { useTag } from '@/modules/setting/composables/useTag';
import Tag from '@/components/ui/TagComponent.vue';
import Spinner from '@/components/ui/Spinner.vue';
import IconComp from '@/components/ui/IconComponent.vue';
import { useInboxTag } from '@/modules/inbox/composables/useInboxTag';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';
import { useInbox } from '@/modules/inbox/composables/useInbox';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'MessageModalTag',
    components: {
        ModalComponent,
        ButtonComponent,
        ListItem,
        Input,
        IconComponent,
        Tag,
        Spinner,
        IconComp,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        tagsInMessage: {
            type: Array,
            default: () => [],
        },
        messageClickedData: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {},
        },
    },
    setup(props, { emit }) {
        const { getTagPageMessage, createTagPageMessage, getTags } = useTag();
        const { handleTagOfMessage, allTag, updateTagAll, getInfoNewTag } = useInboxTag();
        const { conversationDetail, updateTagOfMessage, getMessageDetail } = useInboxConversationDetail();
        const { getConversation } = useInbox();
        const currentUser = computed(() => store.state.auth.user);
        const textSearch = ref<string>('');
        const maxHeightSelect = ref<string>('259px');
        const next_page = ref<any>(null);
        const workspaceName = computed(() => {
            if (typeof currentUser.value.workspace.name != 'undefined') return currentUser.value.workspace.name;
            return '';
        });
        const tagsFromAPI = ref<any>([]);
        const tagsOfMessage = ref<any>([]);
        const tagBtnCreate = ref<any>([{ id: '-1', name: 'Create new tag' }]);
        const tagsSelected = ref<any>([]);
        const conversationCurrentDataInShowModal = ref<any>({});
        const state = ref<string>('default');
        const loading = ref<boolean>(false);
        const callingDataTag = ref<boolean>(false);
        const waitingHandleTyping = ref<boolean>(false);
        const typingSearch = ref<boolean>(false);
        const isShowMaxTag = ref<boolean>(false);
        const showModalError = ref<boolean>(false);
        const { addToast } = useToast();
        const { t } = useI18n();

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const onDisabledSubmit = computed(() => {
            return tagsSelected.value.length > 10 || (tagsSelected.value.length < 1 && props.tagsInMessage.length < 1);
        });

        const tagSelectedWidthName = computed(() => {
            if (tagsSelected.value.length > 0) {
                const res: any[] = [];
                tagsSelected.value.forEach((tagSelect: any) => {
                    const findIndex = allTag.value.findIndex((tag: any) => tag.id === tagSelect);
                    if (findIndex > -1) res.push(allTag.value[findIndex]);
                });
                return res;
            }
            return [];
        });

        const tags = computed(() => {
            return tagsFromAPI.value.filter((tag: any) => {
                let checkInConversation = -1;
                if (typeof conversationCurrentDataInShowModal.value.tags !== 'undefined') {
                    checkInConversation = conversationCurrentDataInShowModal.value.tags.findIndex(
                        (tagOfMessage: any) => tagOfMessage === tag.id,
                    );
                }

                let checkInTagSelected = -1;
                if (tagsSelected.value.length > 0) {
                    checkInTagSelected = tagsSelected.value.findIndex((tagSelect: any) => tagSelect === tag.id);
                }
                return checkInConversation <= -1 && checkInTagSelected <= -1;
            });
        });

        const checkTagsHaveBeenUsed = computed(() => {
            if (tagsFromAPI.value.length > 0 && tags.value.length === 0) {
                if (textSearch.value === '') return true;
                else {
                    let isCheckHasTag = false;
                    tagsFromAPI.value.forEach((tag: any) => {
                        if (tag.name === textSearch.value) isCheckHasTag = true;
                    });
                    return isCheckHasTag;
                }
            }
            return false;
        });

        const clearData = () => {
            next_page.value = null;
            tagsFromAPI.value = [];
            isShowMaxTag.value = false;
        };

        const onCallData = async (val: any) => {
            callingDataTag.value = true;
            const data = await getTagPageMessage({ q: val, next_page: next_page.value });
            if (!data.error && !data.data.active.error) {
                const tagActive = data.data.active;
                next_page.value = tagActive.next_page;
                tagsFromAPI.value = [...tagsFromAPI.value, ...tagActive.data];
                if (tagsFromAPI.value.length === 0) {
                    const resTotal = await getTags({ total_only: true });
                    if (!resTotal.error && resTotal.data.total > 499) {
                        isShowMaxTag.value = true;
                    }
                }
            }
            loading.value = false;
            callingDataTag.value = false;
            waitingHandleTyping.value = false;
            typingSearch.value = false;
        };

        const closeModalHide = () => {
            emit('close');
        };

        const clickSubmit = async () => {
            const data = {
                tags: tagsSelected.value,
            };
            const res = await handleTagOfMessage(data, props.messageClickedData._id);
            if (!res.error) {
                await updateTagOfMessage(tagsSelected.value, props.messageClickedData._id);
                await new Promise(resolve => setTimeout(resolve, 100));
                const res = await getConversation(props.messageClickedData.convo_id);
                if (!res.error) {
                    conversationDetail.value = res.data;
                }
                closeModalHide();
            } else {
                if (Object.prototype.hasOwnProperty.call(res.message, 'invalid_tag_ids')) {
                    closeModalHide();
                    let content = t('inbox.inbox_modal_tags_toast_error_tag');
                    if (tagsSelected.value.length > 1) content = t('inbox.inbox_modal_tags_toast_error_tags');
                    addToast({
                        title: content,
                        type: 'basic',
                        timeout: 6000,
                    });
                } else showModalError.value = true;
            }
        };

        const handleHeightBodyModal = () => {
            const searchElement: any = document.getElementsByClassName('body-tag-selected-search')[0];
            const selectElement: any = document.getElementsByClassName('body-tag-select')[0];
            if (searchElement && selectElement) {
                if (searchElement.clientHeight + selectElement.clientHeight + 16 + 16 > 536) {
                    const newHeight = 536 - searchElement.clientHeight - 16 - 16;
                    maxHeightSelect.value = newHeight + 'px';
                } else {
                    let newHeight = 536 - searchElement.clientHeight - 16 - 16;
                    if (newHeight > 259) newHeight = 259;
                    maxHeightSelect.value = newHeight + 'px';
                }
            }
        };

        const selectTag = async (tag: any) => {
            if (tagsSelected.value.length > 9) return;
            const findIndex = tagsSelected.value.findIndex((tagsSelect: any) => tagsSelect === tag.id);
            if (findIndex > -1) return;
            tagsSelected.value.push(tag.id);
            await new Promise(resolve => setTimeout(resolve, 100));
            handleHeightBodyModal();
        };

        const onClickCreateTag = async () => {
            if (tagsSelected.value.length > 9) return;
            const res = await createTagPageMessage({ name: textSearch.value });
            if (!res.error) {
                const newTag = res.data;
                await updateTagAll({ id: newTag._id, name: newTag.name });
                await new Promise(resolve => setTimeout(resolve, 100));
                await onCallData(textSearch.value);
                await new Promise(resolve => setTimeout(resolve, 100));
                if (tags.value.length > 0) {
                    const findIndexTag = tags.value.findIndex((tag: any) => tag.name === textSearch.value);
                    if (findIndexTag > -1) tagsSelected.value.push(tags.value[findIndexTag].id);
                }
            } else {
                if (Object.prototype.hasOwnProperty.call(res.message, 'name_exists')) {
                    await onCallData(textSearch.value);
                    await new Promise(resolve => setTimeout(resolve, 100));
                    if (tags.value.length > 0) {
                        const findIndexTag = tags.value.findIndex((tag: any) => tag.name === textSearch.value);
                        if (findIndexTag > -1) {
                            await getInfoNewTag(tags.value[findIndexTag].id);
                            tagsSelected.value.push(tags.value[findIndexTag].id);
                        }
                    }
                } else {
                    isShowMaxTag.value = true;
                }
            }
        };

        const clearTag = async (tag: any) => {
            const findIndex = tagsSelected.value.findIndex((t: any) => t === tag.id);
            if (findIndex > -1) tagsSelected.value.splice(findIndex, 1);

            if (typeof conversationCurrentDataInShowModal.value.tags !== 'undefined') {
                const findIndexInConvo = conversationCurrentDataInShowModal.value.tags.findIndex(
                    (tagOfMessage: any) => tagOfMessage === tag.id,
                );
                if (findIndexInConvo > -1) conversationCurrentDataInShowModal.value.tags.splice(findIndexInConvo, 1);
            }

            await new Promise(resolve => setTimeout(resolve, 200));
            handleHeightBodyModal();
        };

        const handleScrollToBottom = async (target: any) => {
            if (target.target.scrollTop + target.target.clientHeight >= target.target.scrollHeight) {
                if (next_page.value) {
                    loading.value = true;
                    await onCallData(textSearch.value);
                }
            }
        };

        const handleTagWithIds = async (ids: any) => {
            ids.forEach((id: any) => {
                const findIndex = allTag.value.findIndex((tag: any) => tag.id === id);
                if (findIndex > -1) tagsOfMessage.value.push(allTag.value[findIndex]);
            });
        };

        const onClickGotIt = async () => {
            clearData();
            await onCallData(textSearch.value);
            const res = await getConversation(props.messageClickedData.convo_id);
            if (!res.error) {
                conversationDetail.value = res.data;
                conversationCurrentDataInShowModal.value = JSON.parse(JSON.stringify(res.data));
            }
            const messageDetail = await getMessageDetail(props.messageClickedData._id);
            if (!messageDetail.error) {
                tagsSelected.value = JSON.parse(JSON.stringify(messageDetail.data.tags));
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            showModalError.value = false;
        };

        const onEnterSearch = async () => {
            if (
                !isShowMaxTag.value &&
                !checkTagsHaveBeenUsed.value &&
                !callingDataTag.value &&
                tags.value.length === 0 &&
                textSearch.value !== '' &&
                textSearch.value.length > 1
            ) {
                await onClickCreateTag();
            }
        };

        watch(
            textSearch,
            debounce(newVal => {
                if (!(!newVal || newVal.trim().length === 0)) {
                    clearData();
                    typingSearch.value = false;
                    onCallData(newVal);
                }
            }, 2000),
        );

        watch(
            () => textSearch,
            () => {
                typingSearch.value = true;
                if (textSearch.value == '') {
                    waitingHandleTyping.value = true;
                }
            },
            { deep: true },
        );

        watch(
            () => showModalSync,
            () => {
                clearData();
                if (showModalSync.value) {
                    tagsSelected.value = JSON.parse(JSON.stringify(props.tagsInMessage));
                    conversationCurrentDataInShowModal.value = JSON.parse(JSON.stringify(conversationDetail.value));
                    onCallData('');
                    handleTagWithIds(props.tagsInMessage);
                } else {
                    tagsSelected.value = [];
                    textSearch.value = '';
                }
            },
            { deep: true },
        );

        return {
            showModalSync,
            closeModalHide,
            clickSubmit,
            onDisabledSubmit,
            workspaceName,
            tags,
            state,
            textSearch,
            tagsSelected,
            selectTag,
            clearTag,
            maxHeightSelect,
            handleScrollToBottom,
            loading,
            callingDataTag,
            tagBtnCreate,
            onClickCreateTag,
            tagSelectedWidthName,
            tagsFromAPI,
            isShowMaxTag,
            checkTagsHaveBeenUsed,
            showModalError,
            onClickGotIt,
            onEnterSearch,
            waitingHandleTyping,
            typingSearch,
        };
    },
});
</script>
<style lang="scss" scoped>
.min-h-311p {
    min-height: 311px;
    overflow: hidden;
}
.content-max-tag {
    display: flex;
    flex-direction: column;

    .error-max-tag {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 50%;
        width: 100%;
    }
}
.modal-tag-message {
    .content-tag-message {
        max-width: calc(100% - 24px);

        & > div {
            max-width: 100%;
        }

        .content-tag {
            height: 16px;
        }

        .btn-clear :deep(svg) {
            width: 12px;
            height: 12px;
        }
    }
    :deep(.modal-btn-tag-create) {
        & > div:not(.disable) {
            background-color: #e2ecff;
        }
    }
}
.modal-inbox-list-tag {
    :deep(.content) {
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
    }
}
</style>
