<template>
    <div class="px-40p pb-24p overflow-y-auto scrollbar--transparent relative">
        <div class="flex justify-between h-60 sticky top-0 bg-white pt-24p z-999" >
            <button-component class="w-76" type="link" @click="onGoBack">
                <icon-component class="mr-4p" name="angle-left" color="primary-600" />
                <span> {{ $t('setting.canned_response_edit_button_back') }}</span>
            </button-component>
            <div class="flex w-146 justify-end" v-if="isModify && defaultCannedResponse">
                <button-component class="w-76 mr-8p" type="secondary" @click="onCancel">
                    {{ $t('setting.canned_response_create_button_cancel') }}
                </button-component>
                <button-component type="primary" :disabled="!isFilledData" @click="onEditCannedResponse">{{
                    $t('setting.canned_response_edit_button_save')
                }}</button-component>
            </div>
        </div>
        <div class="max-w-600 pt-48p mx-auto" v-if="defaultCannedResponse">
            <div v-click-outside="onClickOutsideInput">
                <span
                    class="
                        font-semibold
                        text-24
                        inline-block
                        max-w-full
                        cursor-pointer
                        truncate
                        border-b border-dashed border-neutrals-200
                        font-heading
                    "
                    :class="{ 'w-64 h-24': !response.name.trim().length }"
                    @click="onClickNameTitle"
                    v-if="!isEditName && response.name.trim() !== 0"
                    >{{ response.name }}</span
                >
                <input-component
                    :state="response.name.trim().length < 2 || (isError && errorCode === 'name') ? 'error' : ''"
                    ref="titleInput"
                    v-show="isEditName"
                    @keydown.enter="isEditName = false"
                    v-model="response.name"
                    :maxlength="200"
                />
                <span class="block text-error-3 text-14" v-if="response.name.trim().length < 2">
                    {{ $t('setting.canned_response_create_error_limit') }}
                </span>
                <span class="block text-error-3 text-14" v-else-if="isError && errorCode === 'name'">
                    {{ $t('setting.canned_response_create_error_exist') }}
                </span>
            </div>
            <div class="whitespace-nowrap overflow-hidden flex items-center mt-12p" v-if="userModified">
                <avatar-component
                    :labelShow="false"
                    :label-avatar="userModified.full_name"
                    :bgAvatar="userModified.avatar_bg ? userModified.avatar_bg : '#3ED0DA'"
                    size="medium"
                    :image="userModified.avatar_src ? `${envURL}${userModified.avatar_src}` : ''"
                    :showBackgroundCompulsory="true"
                />
                <div class="inline-block text-left flex flex-col text-14p ml-16p truncate">
                    <span class="truncate font-medium">{{ userModified.full_name }}</span>
                    <span :id="`segmentname-${userModified.id}`" class="font-normal truncate text-neutrals-400 text-14">
                        {{ $t('setting.canned_response_edit_user_updated') }} {{ ' ' + lastUpdateTime }}
                    </span>
                </div>
            </div>
            <div>
                <span class="inline-block text-14 mt-12p mb-4p font-medium">
                    {{ $t('setting.canned_response_create_sub_title_cate') }}
                </span>
                <!-- :error="type == 'error'"
                    :disabled="type == 'disable'" -->
                <select-component
                    v-model="response.category"
                    showSearch
                    maxHeightList="240px"
                    @change="onChangeSelectCategory"
                    :titleDefault="titleDefault"
                    @callData="onCallCateBySearch"
                    placeholder="Search category"
                    :loadMore="true"
                    :showTitleDefault="showTitleDefault"
                    :clearIcon="false"
                >
                    <select-panel v-if="noCateValue" :key="noCateValue.id" :value="noCateValue.id">
                        {{ noCateValue.name }}
                    </select-panel>
                    <!-- <select-panel v-if="cateDetailDefault" :key="cateDetailDefault.id" :value="cateDetailDefault.id">
                        {{ cateDetailDefault.name }}
                    </select-panel> -->
                    <template v-if="noCateValue">
                        <select-panel
                            v-for="(index, i) in categoriesSearched.filter((item) => item.id !== noCateValue.id)"
                            :key="i"
                            :value="index.id"
                        >
                            {{ index.name }}
                        </select-panel>
                    </template>
                    <template v-else>
                        <select-panel v-for="(index, i) in categoriesSearched" :key="i" :value="index.id">
                            {{ index.name }}
                        </select-panel>
                    </template>
                    <template #addon>
                        <button-component
                            :icon="'plus'"
                            positionIcon="left"
                            class="ml-8p"
                            type="primary"
                            @click="showModalCreateCate = true"
                        >
                            {{ $t('setting.canned_response_create_button_create') }}
                        </button-component>
                    </template>
                </select-component>
            </div>
            <div>
                <span class="inline-block text-14 mt-12p font-medium">
                    {{ $t('setting.canned_response_create_sub_title_content') }}
                </span>
                <card-component class="py-12p flex flex-col min-h-172" type="default">
                    <inbox-composer-contenteditable
                        class="min-h-full flex-grow"
                        type="canned_response"
                        :placeholder="$t('setting.canned_response_create_placeholder_content')"
                        ref="inboxContenteditable"
                        v-model="response.content"
                    />
                </card-component>
            </div>
            <div>
                <span class="inline-block text-14 mt-12p font-medium">
                    {{ $t('setting.canned_response_create_sub_title_shortcut') }}
                </span>
                <input-component
                    :state="(isError && errorCode === 'shortcut') || isErrorShortcut ? 'error' : ''"
                    v-model="response.shortcut"
                    :maxlength="100"
                    counter
                    :placeholder="$t('setting.canned_response_create_placeholder_shortcut')"
                >
                    <template v-slot:prefix> \ </template>
                </input-component>
                <span v-if="isErrorShortcut" class="block text-error-3 text-14">
                    {{ $t('setting.canned_response_create_error_shortcut') }}
                </span>
                <span v-else-if="isError && errorCode === 'shortcut' && isError" class="block text-error-3 text-14">
                    <template v-if="errorCode === 'shortcut'">
                        {{ $t('setting.canned_response_create_error_shortcut2') }}
                    </template>
                </span>
            </div>
            <div>
                <span class="inline-block text-14 mt-12p font-medium mb-12p">
                    {{ $t('setting.canned_response_create_sub_title_action') }}
                </span>
                <div class="flex flex-col">
                    <radio-component
                        :valueRadio="ACTION_TYPE.NOTHING"
                        v-model="response.action.type"
                        nameRadio="NOTHING"
                    >
                        <template v-slot:label>
                            {{ $t('setting.canned_response_create_action_value_no') }}
                        </template>
                    </radio-component>
                    <div class="flex items-center mb-14p mt-14p h-24">
                        <radio-component
                            class="mr-10p"
                            :valueRadio="ACTION_TYPE.REASSIGNED"
                            v-model="response.action.type"
                            nameRadio="REASSIGNED"
                        >
                            <template v-slot:label>
                                {{ $t('setting.canned_response_create_action_value_reassign') }}
                            </template>
                        </radio-component>
                        <template v-if="response.action.type == 2">
                            <select-component
                                class="w-288"
                                v-model="response.action.value"
                                showSearch
                                maxHeightList="148px"
                                titleDefault="Select teammate"
                                placeholder="Search teammate"
                                @change="onChangeSelectAssignedUser"
                                :showTitleDefault="isDeletedUserTeammateReassign"
                            >
                                <template v-if="isDeletedUserTeammateReassign" #titleDefault>
                                    <div class="flex">
                                        <div class="w-20 h-20 mr-8p">
                                            <img class="" src="../../images/deleted-avatar.svg" alt="deleted-avatar" />
                                        </div>
                                        <span> This teammate has been deleted </span>
                                    </div>
                                </template>
                                <select-panel v-for="(item, index) in userList" :key="index" :value="item._id">
                                    <template #icon>
                                        <avatar-component
                                            :labelShow="false"
                                            :label-avatar="item.full_name"
                                            :bgAvatar="item.avatar_bg ? item.avatar_bg : '#3ED0DA'"
                                            size="small"
                                            :showBackgroundCompulsory="true"
                                            :image="item.avatar_src ? `${envURL}${item.avatar_src}` : ''"
                                        />
                                    </template>
                                    {{ item.full_name }}
                                </select-panel>
                            </select-component>
                        </template>
                    </div>
                    <radio-component
                        class="mb-12p"
                        :valueRadio="ACTION_TYPE.RESOLVED"
                        v-model="response.action.type"
                        nameRadio="RESOLVED"
                    >
                        <template v-slot:label>
                            {{ $t('setting.canned_response_create_action_value_resolve') }}
                        </template>
                    </radio-component>
                </div>
            </div>
            <div>
                <span class="inline-block text-14 mt-12p font-medium mb-12p">
                    {{ $t('setting.canned_response_create_sub_title_available') }}
                </span>
                <radio-component class="mb-12p" valueRadio="everyone" v-model="response.available" nameRadio="Everyone">
                    <template v-slot:label>
                        {{ $t('setting.canned_response_create_available_value_everyone') }}
                    </template>
                </radio-component>
                <!-- <radio-component class="mb-12p" valueRadio="2" v-model="response.available" nameRadio="Specific">
                    <template v-slot:label>Specific team(s)</template>
                </radio-component> -->
                <radio-component valueRadio="self" v-model="response.available" nameRadio="Myself">
                    <template v-slot:label>
                        {{ $t('setting.canned_response_create_available_value_myself') }}
                    </template>
                </radio-component>
            </div>
        </div>
        <modal-warning
            v-model:showModal="showModalWarning"
            :errorCode="errorCode"
            @pushList="isChangeRoute = true"
            isEdit
        ></modal-warning>
        <modal-create-cate
            v-model:showModal="showModalCreateCate"
            @created="onHandleCreatedNewCate"
        ></modal-create-cate>
        <modal-component v-model="showModalConfirm">
            <template v-slot:header>
                <div class="flex">
                    <icon-component class="mr-4p" name="InfoCircle" color="primary-600" />
                    <span class="font-medium text-16">
                        <template v-if="isChangeRouteBy !== 'back'">
                            {{ $t('setting.canned_response_create_modal_confirm_title') }}
                        </template>
                        <template v-else>
                            {{ $t('setting.canned_response_edit_modal_confirm_title') }}
                        </template>
                    </span>
                </div>
            </template>
            <template v-slot:body>
                <div class="text-center text-14 px-32p">
                    <template v-if="isChangeRouteBy !== 'back'">
                        {{ $t('setting.canned_response_create_modal_confirm_description') }}
                    </template>
                    <template v-else>
                        {{ $t('setting.canned_response_edit_modal_confirm_description') }}
                    </template>
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <button-component type="secondary" class="mr-8p" @click="onCancelChangeRoute" size="medium">
                        <template v-if="isChangeRouteBy !== 'back'">
                            {{ $t('setting.canned_response_edit_modal_button_editing') }}
                        </template>
                        <template v-else>
                            {{ $t('setting.canned_response_edit_modal_button_stay') }}
                        </template>
                    </button-component>
                    <button-component type="primary" size="medium" @click="onDiscardChangeRoute">
                        <template v-if="isChangeRouteBy === 'back'">
                            {{ $t('setting.canned_response_edit_modal_button_leave') }}
                        </template>
                        <template v-else>
                            {{ $t('setting.canned_response_create_modal_confirm_button_discard') }}
                        </template>
                    </button-component>
                </div>
            </template>
        </modal-component>
        <modal-component :width="'512px'" v-model="showModalReachLimit" customClass="py-32p" :closeIcon="false">
            <template v-slot:body>
                <div class="flex flex-col justify-center">
                    <p class="text-24 font-semibold capitalize font-heading text-center">
                        <template v-if="errorCode == 'reach_limit'">
                            <p v-html="$t('setting.canned_response_create_modal_limit_description_cate')" />
                        </template>
                        <template v-else-if="errorCode == 'num_of_canres'">
                            <p v-html="$t('setting.canned_response_create_modal_limit_description_cr')" />
                        </template>
                        <template v-else>
                            {{ $t('setting.canned_response_edit_modal_limit_title') }}
                        </template>
                    </p>
                    <p class="text-14 my-16p text-14 text-center">
                        <template v-if="errorCode === 'category'">
                            <span v-html="$t('setting.canned_response_create_modal_limit_description_deleted')" />
                        </template>
                        <template v-else-if="errorCode === 'num_of_canres'">
                            {{
                                $t('setting.canned_response_create_modal_limit_cr_description_max', {
                                    number: userStore ? userStore.workspace.name : '',
                                })
                            }}
                        </template>
                        <template v-else-if="errorCode === 'reach_limit'">
                            {{
                                $t('setting.canned_response_create_modal_limit_description_max', {
                                    number: userStore ? userStore.workspace.name : '',
                                })
                            }}
                        </template>
                        <template v-else>
                            {{ $t('setting.canned_response_create_modal_limit_description_deleted') }}
                        </template>
                    </p>
                    <button-component class="self-center text-center" size="medium" @click="onCloseModalReachLimit">
                        {{ $t('setting.canned_response_create_button_got_it') }}
                    </button-component>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script>
import { ref, unref, computed, onMounted, watch } from 'vue';
import debounce from 'lodash/debounce';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import CardComponent from '@/components/ui/CardComponent.vue';
import InputComponent from '@/components/ui/InputComponent.vue';
import SelectComponent from '@/components/ui/SelectComponent.vue';
import SelectPanel from '@/components/ui/SelectPanel.vue';
import InboxComposerContenteditable from '@/modules/inbox/components/InboxComposerContentEditable.vue';
import RadioComponent from '@/components/ui/RadioButtonComponent.vue';
import ModalWarning from '../../components/SettingCannedResponseCreateModalWarning.vue';
import ModalCreateCate from '../../components/SettingCannedResponseCategoiresModalCreateCate.vue';
import { useCannedResponse } from '../../composables/useCannedResponse';
import { useToast } from '@/composables/useToast';
import { onBeforeRouteLeave } from 'vue-router';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from '@/modules/auth/composables/useUser';
import { store } from '@/store';
import filters from '@/utils/filters';

const ACTION_TYPE = {
    NOTHING: 0,
    RESOLVED: 1,
    REASSIGNED: 2,
};

export default {
    name: 'SettingCannedResponseCreate',
    components: {
        AvatarComponent,
        CardComponent,
        SelectComponent,
        ButtonComponent,
        InputComponent,
        SelectPanel,
        InboxComposerContenteditable,
        ModalWarning,
        RadioComponent,
        ModalComponent,
        IconComponent,
        ModalCreateCate,
    },
    setup() {
        const envURL = `${process.env.VUE_APP_FILE_URL}/`;
        const envImageURL = `${process.env.VUE_APP_IMAGE_URL}/`;
        const showTitleDefault = ref(false);
        const { userList, getUserList, getUserById } = useUser();
        const defaultCannedResponse = ref(null);
        const next_page_category = ref(null);
        const showModalCreateCate = ref(false);
        const showModalReachLimit = ref(false);
        const showModalWarning = ref(false);
        const showModalConfirm = ref(false);
        const isChangeRoute = ref(false);
        const isChangeRouteBy = ref(null);
        const titleDefault = ref('No category');
        const toRouteName = ref(null);
        const { updateCannedResponseById, searchCategory, getCannedResponseById, getCategoryById } =
            useCannedResponse();
        const categoriesSearched = ref([]);
        const response = ref({
            name: 'Untitle Canned Response',
            category: null,
            available: '',
            content: '',
            shortcut: '',
            action: { type: ACTION_TYPE.NOTHING, value: null },
        });
        const isSearchFilter = ref(false);
        const inboxContenteditable = ref(null);
        const status = ref('init');
        const cateDetailDefault = ref(null);
        const isSearchAttribute = ref(false);
        const route = useRoute();
        const router = useRouter();
        const isEditName = ref(false);
        const isError = ref(false);
        const errorCode = ref(null);
        const userModified = ref(null);
        const lastUpdateTime = ref('');
        const noCateValue = ref(null);
        const titleInput = ref(null);

        getUserList();

        const isDeletedUserTeammateReassign = computed(() => {
            // console.log('isDeletedUserTeammateReassign')
            // if (defaultCannedResponse.value && defaultCannedResponse.value.action && userList.value) {
            //     console.log('nè',!!userList.value.find((user) => user._id === defaultCannedResponse.value.action.value))
            // }
            return !!(
                defaultCannedResponse.value &&
                defaultCannedResponse.value.action &&
                userList.value &&
                !userList.value.find((user) => user._id === defaultCannedResponse.value.action.value)
            );
        });

        const onHandleCreatedNewCate = (value) => {
            if (!value) {
                showModalReachLimit.value = true;
                errorCode.value = 'reach_limit';
            } else {
                const newRecord = {
                    name: value.name,
                    id: value._id,
                };
                response.value.category = value._id;
                categoriesSearched.value = [newRecord, ...categoriesSearched.value];
            }
        };

        watch(
            () => response.value.name,
            () => {
                isError.value = false;
            },
        );

        watch(
            () => response.value.shortcut,
            () => {
                isError.value = false;
            },
        );

        const recoverDataImageSuccessForComposer = () => {
            const data = [];
            const imageDivEls = document.getElementsByClassName('composer-contenteditable__image');
            console.log({ imageDivEls, inboxContenteditable });
            console.log(Array.from(imageDivEls));
            Object.entries([...imageDivEls]).forEach(([key, val]) => {
                const imageNode = val.querySelector('img');
                data.push({
                    id: imageNode.dataset.imgId,
                    name: imageNode.alt,
                    url: imageNode.src.replace(envURL, ''),
                });
                console.log(data); // the name of the current key.
                console.log({ val }); // the value of the current key.
            });
            inboxContenteditable.value && inboxContenteditable.value.onSetImageDefault();
        };

        const userStore = computed(() => {
            return store.state.auth.user;
        });

        const onChangeSelectAssignedUser = (value) => {
            console.log('value', { value });
        };

        const onGoBack = () => {
            router.go(-1);
            isChangeRouteBy.value = 'back';
        };
        const onCancel = () => {
            router.push({ name: 'CannedResponses' });
            isChangeRouteBy.value = 'cancel';
        };
        const isErrorName = computed(() => {
            if (
                isError.value &&
                (response.value.name <= 2 || response.value.name > 200 || errorCode.value === 'name')
            ) {
                return true;
            }
            return false;
        });

        const getUserModified = async (id) => {
            try {
                const data = await getUserById(id);
                userModified.value = data;
            } catch (e) {
                console.log({ e });
            }
        };

        const onGetNoCateValue = async () => {
            try {
                const data = await searchCategory({ type: 1 });
                noCateValue.value = data.data[0];
                response.value.category = noCateValue.value.id;
            } catch (e) {
                console.log(e);
            }
        };

        const getCannedResponse = async () => {
            try {
                const res = await getCannedResponseById(route.params.id);

                const { name, category, available_ids, content, shortcut, updated_at, action } = res;
                const available = available_ids.length === 0 ? 'everyone' : 'self';
                const defaultAction = JSON.parse(JSON.stringify(action));
                defaultCannedResponse.value = {
                    name,
                    category,
                    available,
                    content,
                    shortcut,
                    action: defaultAction,
                };
                response.value = {
                    name,
                    category,
                    available,
                    content,
                    shortcut,
                    action,
                };

                const cateDetail = await getCategoryById(category);
                console.log({ cateDetail });
                if (cateDetail.error) {
                    console.log('cateDetail', cateDetail);
                } else {
                    cateDetail.data.id = cateDetail.data._id;
                    const findCate = categoriesSearched.value.findIndex((cate) => cate.id === cateDetail.data._id);
                    if (findCate < 0) {
                        cateDetailDefault.value = cateDetail.data;
                        titleDefault.value = cateDetail.data.name;
                        showTitleDefault.value = true;
                    }
                }

                await getUserModified(res._auid);
                lastUpdateTime.value = filters.formatTime(updated_at, false);
                inboxContenteditable.value.contenteditable.innerHTML = content;
                inboxContenteditable.value.contenteditable.blur();
                inboxContenteditable.value.isShowPlaceholder = false;
            } catch (e) {
                isChangeRoute.value = true;
                router.replace({ name: 'Error404' });
            }
        };

        const isErrorShortcut = computed(() => {
            const format = /^[A-Za-z0-9]*$/;

            if (!response.value.shortcut.match(format)) {
                return true;
                // } else if (isError.value && (!response.value.shortcut || errorCode.value === 'shortcut')) {
                //     return true;
            } else {
                return false;
            }
        });

        const isFilledData = computed(() => {
            const { name, category, available, content, shortcut } = unref(response);
            return !!(
                (name.trim().length >= 2 || name.trim().length <= 200) &&
                category &&
                available.length > 0 &&
                content.length > 0 &&
                shortcut.length > 0 &&
                !isErrorShortcut.value
            );
        });

        const isModify = computed(() => {
            if (response.value && defaultCannedResponse.value) {
                const { name, category, available, content, shortcut, action } = unref(response);
                const {
                    name: defaultName,
                    category: defaultCategory,
                    available: defaultAvailable,
                    content: defaultContent,
                    shortcut: defaultShortcut,
                    action: defaultAction,
                } = unref(defaultCannedResponse);
                return !(
                    name == defaultName &&
                    category == defaultCategory &&
                    available == defaultAvailable &&
                    content == defaultContent &&
                    shortcut == defaultShortcut &&
                    action.type == defaultAction.type &&
                    action.value == defaultAction.value
                );
            }
            return false;
        });

        const { addToast } = useToast();

        const onChangeSelectCategory = debounce((e) => {
            status.value = 'search';
            isSearchAttribute.value = false;
            showTitleDefault.value = false;
            if (response.value.category == null) isSearchFilter.value = false;
            else isSearchFilter.value = true;
        }, 0);

        const onCallCateBySearch = async (val) => {
            if (!val.push) {
                categoriesSearched.value = [];
                next_page_category.value = null;
            } else {
                if (next_page_category.value == null) return;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const data = await searchCategory({ q: val.text, next_page: next_page_category.value });
            if (!data.error) {
                next_page_category.value = data.next_page;
                if (val.push) categoriesSearched.value = [...categoriesSearched.value, ...data.data];
                else categoriesSearched.value = data.data;
            }
        };

        const onClickOutsideInput = () => {
            if (isEditName.value) {
                isEditName.value = false;
            }
        };

        const onClickNameTitle = () => {
            window.setTimeout(() => {
                isEditName.value = true;
                window.setTimeout(() => {
                    titleInput.value.onSelectAll();
                }, 1);
            }, 0);
        };

        const onDiscardChangeRoute = () => {
            router.push({ name: toRouteName.value });
        };

        const onCancelChangeRoute = () => {
            toRouteName.value = null;
            showModalConfirm.value = false;
            isChangeRouteBy.value = null;
        };

        const onEditCannedResponse = async () => {
            if (isFilledData.value) {
                const { msgData, imgUpload } = inboxContenteditable.value.onSendMessage();
                const attachments = imgUpload.map((item) => {
                    const { id, name, url } = item;
                    return Object.assign(
                        { type: 1 },
                        {
                            _id: id,
                            name,
                            src: url,
                        },
                    );
                });
                const content = attachments.length > 0 && !msgData.content ? response.value.content : msgData.content;

                const { name, category, available, shortcut, action } = unref(response);
                const available_ids =
                    available === 'self'
                        ? [
                              {
                                  type: 1,
                                  id: userStore.value._id,
                              },
                          ]
                        : [];

                try {
                    const res = await updateCannedResponseById({
                        name: name.trim(),
                        category,
                        content,
                        shortcut,
                        available_ids,
                        id: route.params.id,
                        attachments,
                        action,
                    });
                    isChangeRoute.value = true;
                    addToast({
                        title: 'Updated canned response successfully',
                        type: 'basic',
                        timeout: 3000,
                    });
                    router.push({ name: 'CannedResponses' });
                } catch (e) {
                    const errorKey = Object.keys(e)[0];
                    if (['id', 'category', 'num_of_canres'].includes(errorKey)) {
                        showModalWarning.value = true;
                        if (response.value.category) {
                            categoriesSearched.value = categoriesSearched.value.filter(
                                (item) => item.id !== response.value.category,
                            );
                        }
                        response.value.category = noCateValue.value.id;
                    }
                    isError.value = true;
                    errorCode.value = Object.keys(e)[0];
                }
            } else {
                isError.value = true;
            }
            // if (isFilledData) {

            // }
        };

        const onCloseModalReachLimit = () => {
            showModalReachLimit.value = false;
            if (!['category', 'num_of_canres', 'reach_limit'].includes(errorCode.value)) {
                router.push({ name: 'CannedResponses' });
            }
        };

        onMounted(async () => {
            await onGetNoCateValue();
            await onCallCateBySearch({ text: '', push: false });
            await getCannedResponse();
            await recoverDataImageSuccessForComposer();
            status.value = 'done';
        });

        onBeforeRouteLeave((to, from, next) => {
            // cancel the navigation and stay on the same page
            if (isChangeRoute.value) return next();
            if (isModify.value && !toRouteName.value) {
                showModalConfirm.value = true;
                toRouteName.value = to.name;
                return false;
            } else return next();
        });

        watch(
            () => response.value.category,
            (newVal) => {
                if (newVal === '') {
                    showTitleDefault.value = false;
                    titleDefault.value = 'Category';
                }
            },
        );

        return {
            isDeletedUserTeammateReassign,
            userList,
            titleInput,
            onCloseModalReachLimit,
            onHandleCreatedNewCate,
            onCallCateBySearch,
            onChangeSelectCategory,
            response,
            isEditName,
            onClickOutsideInput,
            onClickNameTitle,
            categoriesSearched,
            isFilledData,
            onEditCannedResponse,
            inboxContenteditable,
            errorCode,
            isError,
            showModalWarning,
            showModalConfirm,
            isChangeRoute,
            onDiscardChangeRoute,
            onCancelChangeRoute,
            isErrorShortcut,
            isErrorName,
            route,
            defaultCannedResponse,
            userModified,
            envURL,
            isModify,
            onGoBack,
            onCancel,
            showModalCreateCate,
            isChangeRouteBy,
            showModalReachLimit,
            lastUpdateTime,
            noCateValue,
            status,
            userStore,
            titleDefault,
            cateDetailDefault,
            showTitleDefault,
            ACTION_TYPE,
            onChangeSelectAssignedUser,
        };
    },
};
</script>

<style></style>
