<template>
    <div class="article-edit h-full pb-20p">
        <template v-if="loadingArticleDetail">
            <LoadingScreen />
        </template>
        <template v-else>
            <template v-if="!isEmpty">
                <div class="pt-22p px-40p">
                    <button-component type="link" @click="backToArticle('back')">
                        <icon-component class="mr-4p" name="angle-left" color="primary-600" />Back
                    </button-component>
                    <div class="pt-16p flex items-center justify-between">
                        <div class="w-168 flex">
                            <SelectCustom v-model="valueVisibility" styleSelect="tick" @change="changeVisibility">
                                <template v-slot:label>
                                    <button-component class="w-168 h-36 pr-4p btn-visibility" type="outline">
                                        <span>Visibility: {{ selectedValue }}</span>
                                        <icon-component class="ml-4p" name="AngleDown" color="neutrals-900" />
                                    </button-component>
                                </template>
                                <SelectPanel v-for="(index, i) in optionSelect" :key="i" :value="index.value">{{
                                    index.label
                                }}</SelectPanel>
                            </SelectCustom>
                            <ArticleSettingDrawer
                                v-model:collection="article.collection"
                                v-model:section="article.section"
                            />
                        </div>
                        <div class="flex items-center">
                            <span class="text-14 text-neutrals-400 mr-8p" :class="{ hidden: !isShowBtn }"
                                >Unsaved changes</span
                            >
                            <button-component
                                class="h-36"
                                type="outline"
                                :class="{ hidden: !isShowBtn }"
                                @click="backToArticle('unsave')"
                                >Cancel</button-component
                            >
                            <button-component
                                class="h-36 mx-8p"
                                :class="{ hidden: !isShowBtn }"
                                type="primary"
                                :disabled="disableSave"
                                @click="editArticleDetail"
                                >Save</button-component
                            >
                            <button-component class="w-92 h-36" type="outline" @click="isShowModalDelete = true">
                                <icon-component class="mr-4p" name="Trash" color="neutrals-900" />Delete
                            </button-component>
                        </div>
                    </div>
                </div>
                <div class="mt-40p scrollbar--transparent overflow-y-auto article-edit__article">
                    <div class="max-w-720 mx-auto">
                        <div v-click-outside="onClickOutsideInput">
                            <TooltipComponent
                                showByTruncate
                                type="light"
                                position="top"
                                :content="article.title"
                                v-if="!isEditName && article.title.trim() !== 0"
                            >
                                <span
                                    class="
                                        font-heading font-semibold
                                        text-32
                                        inline-block
                                        max-w-full
                                        cursor-pointer
                                        truncate
                                        border-b border-dashed border-neutrals-200
                                        cursor-text
                                    "
                                    :class="{ 'w-64 h-24': !article.title.trim().length }"
                                    @click="onClickNameTitle"
                                    >{{ article.title }}</span
                                >
                            </TooltipComponent>
                            <input-component
                                class="mt-2p"
                                :state="article.title.trim().length < 1 || isError ? 'error' : ''"
                                ref="titleInput"
                                v-show="isEditName"
                                @keydown.enter="isEditName = false"
                                v-model="article.title"
                                :maxlength="100"
                            />
                            <span class="block text-error-3 text-14" v-if="article.title.trim().length < 1">{{
                                $t('article.article_error_required_name')
                            }}</span>
                            <span class="block text-error-3 text-14" v-else-if="isError">{{
                                $t('article.article_error_exisits_name')
                            }}</span>
                        </div>
                        <div class="mt-16p mb-24p min-h-68">
                            <textarea
                                v-model="article.summary"
                                class="resize-none text-14 w-full border-none outline-none min-h-40"
                                maxlength="150"
                                placeholder="Summarize (Optional)"
                                ref="articleSummary"
                            />
                            <span v-if="article.summary" class="text-14 text-neutrals-500 block"
                                >{{ article.summary.length }}/150</span
                            >
                        </div>
                        <div class="flex items-center">
                            <avatar-component
                                v-if="convertImgAvatar(article.updated_by) === 'null'"
                                :labelShow="false"
                                :bgAvatar="convertBgAvatar(article.updated_by)"
                                :label-avatar="convertNameUpdate(article.updated_by)"
                                size="medium"
                            />
                            <avatar-component
                                v-else
                                :labelShow="false"
                                :bgAvatar="convertBgAvatar(article.updated_by)"
                                :label-avatar="convertNameUpdate(article.updated_by)"
                                :image="convertImgAvatar(article.updated_by)"
                                size="medium"
                            />
                            <div class="info-user ml-8p">
                                <span class="text-14 font-medium block">
                                    {{ convertNameUpdate(article.updated_by) }}
                                </span>
                                <span class="text-14 text-neutrals-300">Last updated: {{ getLastUpdate }}</span>
                            </div>
                        </div>
                        <text-editor
                            v-if="status !== 'init'"
                            customToolbarClass="sticky top-0 z-10 mt-16p"
                            v-model="article.body"
                            :defaultData="article.body"
                            featureType="article"
                            :key="textEditorKey"
                        />
                    </div>
                </div>
                <ModalDiscard v-model:showModal="isShowModalWarning" @discard="returnDefault"></ModalDiscard>
                <ModalUnsave
                    v-model:showModal="isShowModalUnsave"
                    @discard="returnDefault"
                    @saveArticle="editArticleDetail('back')"
                ></ModalUnsave>
                <ModalDelete v-model:showModal="isShowModalDelete"></ModalDelete>
                <ModalDeleteWarning v-model:showModal="isShowModalDeleteWarning"></ModalDeleteWarning>
            </template>
            <template v-else>
                <div class="pt-22p px-40p">
                    <button-component type="link" @click="backToArticle('back')">
                        <icon-component class="mr-4p" name="angle-left" color="primary-600" />Back
                    </button-component>
                    <div class="article-edit__empty">
                        <embed
                            class="logo mx-auto w-120 h-120"
                            :src="require('../images/article-detail-empty.svg')"
                            alt="banner"
                        />
                        <span class="text-16 font-bold mt-12p block">{{
                            $t('article.article_error_has_been_delete')
                        }}</span>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, reactive, computed, unref, inject } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import SelectPanel from '@/components/ui/SelectPanel.vue';
import SelectCustom from '@/components/ui/SelectCustom.vue';
import InputComponent from '@/components/ui/InputComponent.vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import { store } from '@/store';
import { useArticle } from '../composables/useArticle';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useUser } from '@/modules/auth/composables/useUser';
import { useToast } from '@/composables/useToast';
import filters from '@/utils/filters';
import ModalDiscard from '../components/ArticleModalDiscard.vue';
import ModalUnsave from '../components/ArticleModalUnsave.vue';
import ModalDelete from '../components/ArticleModalDelete.vue';
import ModalDeleteWarning from '../components/ArticleModalDeleteWarningDetail.vue';
import LoadingScreen from '@/modules/auth/components/AuthLoadingScreen.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import TextEditor from '@/components/ui/TextEditorComponent/TextEditorComponent.vue';
import ArticleSettingDrawer from '../components/ArticleSettingDrawer.vue';

export default defineComponent({
    name: 'Articles Edit',
    components: {
        ButtonComponent,
        IconComponent,
        SelectPanel,
        SelectCustom,
        InputComponent,
        AvatarComponent,
        ModalDiscard,
        ModalUnsave,
        ModalDelete,
        ModalDeleteWarning,
        LoadingScreen,
        TooltipComponent,
        TextEditor,
        ArticleSettingDrawer,
    },
    setup() {
        const status = ref('init');
        const articleBody = ref<any>(null);
        const articleSummary = ref<any>(null);
        const isEditName = ref<boolean>(false);
        const isError = ref<boolean>(false);
        const defaultArticle = ref<any>(null);
        const isShowBtn = ref<boolean>(false);
        const isShowModalWarning = ref<boolean>(false);
        const isShowModalUnsave = ref<boolean>(false);
        const isShowModalDelete = ref<boolean>(false);
        const isShowModalDeleteWarning = ref<boolean>(false);
        const isEmpty = ref<boolean>(false);
        const titleInput = ref<any>(null);
        const textEditorKey = ref<any>(0);
        const article = ref<any>({
            title: 'Untitled Article',
            summary: '',
            body: '',
            status: 2,
            updated_at: '',
            updated_by: '',
            collection: null,
            section: null,
        });
        const valueVisibility = ref<any>('draft');
        const optionSelect = reactive<object[]>([
            { label: 'Published', value: 'published' },
            { label: 'Draft', value: 'draft' },
        ]);
        const { getArticleById, error, errorMessage, createArticleRes, updateArticleById, loadingArticleDetail } =
            useArticle();
        const route = useRoute();
        const router = useRouter();
        const { userList } = useUser();
        const envURL = process.env.VUE_APP_FILE_URL;
        const { addToast } = useToast();
        const emitter: any = inject('emitter');
        const routerTo = ref<any>('');

        const selectedValue = computed(() => {
            if (valueVisibility.value) {
                const value = (optionSelect as any).filter((value: any) => {
                    return value.value == valueVisibility.value;
                });
                return value[0].label;
            } else return '';
        });

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

        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        const disableSave = computed(() => {
            if (article.value.title == '') return true;
            return false;
        });

        const convertNameUpdate = (record: string) => {
            if (record) {
                const name = userList.value.filter((value: any) => {
                    return value._id === record;
                });
                if (name.length < 1) return '';
                return name[0].username;
            } else {
                return '';
            }
        };

        const convertBgAvatar = (record: string) => {
            if (record) {
                const name = userList.value.filter((value: any) => {
                    return value._id === record;
                });
                if (name.length < 1) return '';
                return name[0].avatar_bg;
            } else {
                return '';
            }
        };

        const convertImgAvatar = (record: string) => {
            if (record) {
                const name = userList.value.filter((value: any) => {
                    return value._id === record;
                });
                if (name.length > 0) {
                    if (name[0].avatar_src != null) {
                        return envURL + '/' + name[0].avatar_src;
                    } else {
                        return 'null';
                    }
                }
            } else {
                return '';
            }
        };

        const changeVisibility = () => {
            if (valueVisibility.value === 'draft') {
                article.value.status = 2;
            } else {
                article.value.status = 1;
            }
        };

        const monthDiff = (dateFrom: any, dateTo: any) => {
            return dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear());
        };

        const getLastUpdate = computed(() => {
            if (article.value) {
                const yearArticle = new Date(article.value.updated_at).getFullYear();
                const monthArticle = new Date(article.value.updated_at).getMonth() + 1;
                const countMonth = monthDiff(
                    new Date(yearArticle, monthArticle),
                    new Date(new Date().getFullYear(), new Date().getMonth() + 1),
                );
                if (countMonth < 12) {
                    return (
                        new Date(article.value.updated_at).toString().slice(4, 10) +
                        filters.showFormatAMPM(article.value.updated_at, false, false, true)
                    );
                } else {
                    return (
                        new Date(article.value.updated_at).toString().slice(4, 10) +
                        ', ' +
                        yearArticle +
                        filters.showFormatAMPM(article.value.updated_at, false, false, true)
                    );
                }
            }
            return '';
        });

        const getArticleDetail = async () => {
            try {
                const res = await getArticleById(route.params.id, { check: false });
                const {
                    title,
                    summary,
                    status,
                    body,
                    updated_at,
                    updated_by,
                    collection_id: collection,
                    section_id: section,
                } = res;
                defaultArticle.value = {
                    title,
                    summary,
                    status,
                    body,
                    updated_at,
                    updated_by,
                    collection,
                    section,
                };
                article.value = {
                    title,
                    summary,
                    status,
                    body,
                    updated_at,
                    updated_by,
                    collection,
                    section,
                };
                if (article.value.status === 2) valueVisibility.value = 'draft';
                else valueVisibility.value = 'published';
                emitter.emit('updateSelectArticle', status);
            } catch (e) {
                const errorKey = Object.keys(e)[0];
                if (errorKey == 'not_found') isEmpty.value = true;
            }
        };

        const editArticleDetail = async (type: string) => {
            if (article.value.title) {
                const { title, summary, body, status, collection: collection_id, section: section_id } = unref(article);
                try {
                    const res = await updateArticleById(route.params.id, {
                        title,
                        summary,
                        body,
                        status,
                        collection_id,
                        section_id
                    });
                    isShowBtn.value = false;
                    addToast({
                        title: 'Article is saved',
                        type: 'basic',
                        timeout: 3000,
                    });
                    isError.value = false;
                    defaultArticle.value = JSON.parse(JSON.stringify(article.value));
                    if (type == 'back') {
                        if (routerTo.value) router.push({ name: routerTo.value });
                        else router.push({ name: 'Article' });
                    }
                } catch (e) {
                    const errorKey = Object.keys(e)[0];
                    if (errorKey == 'title_exists') isError.value = true;
                    if (errorKey == 'article_not_exists') {
                        emitter.emit('warningDelete', 'save');
                        isShowModalDeleteWarning.value = true;
                    }
                }
            }
        };

        const returnDefault = (value: boolean) => {
            console.log('value', value);
            if (value) {
                if (routerTo.value) router.push({ name: routerTo.value });
                else router.push({ name: 'Article' });
            } else {
                isError.value = false;
            }
            if (defaultArticle.value.status === 2) valueVisibility.value = 'draft';
            else valueVisibility.value = 'published';
            article.value = JSON.parse(JSON.stringify(defaultArticle.value));
            emitter.emit('updateSelectArticle', defaultArticle.value.status);
            textEditorKey.value++;
        };

        const backToArticle = (val: any) => {
            if (isShowBtn.value) {
                if (val === 'unsave') isShowModalWarning.value = true;
                else isShowModalUnsave.value = true;
            } else {
                router.push({ name: 'Article' });
            }
        };

        emitter.on('warningDelete', (val: string) => {
            if (val === 'delete') {
                isShowModalDelete.value = false;
                isShowModalDeleteWarning.value = true;
            }
        });

        onMounted(async () => {
            await getArticleDetail();
            articleSummary.value.addEventListener('keydown', function (e: any) {
                const keyCode = e.which || e.keyCode;
                if ((keyCode === 13 && e.shiftKey) || keyCode === 13) {
                    e.preventDefault();
                }
            });
            status.value = 'loaded';
        });

        watch(
            article,
            () => {
                isShowBtn.value = JSON.stringify(article.value) !== JSON.stringify(defaultArticle.value);
            },
            { deep: true },
        );

        onBeforeRouteLeave((to, from, next) => {
            // isShowModalUnsave.value = true;
            if (isShowBtn.value) {
                isShowModalUnsave.value = true;
                routerTo.value = to.name;
            } else {
                next();
            }
        });

        return {
            textEditorKey,
            titleInput,
            isEditName,
            onClickOutsideInput,
            article,
            selectedValue,
            optionSelect,
            valueVisibility,
            onClickNameTitle,
            isError,
            userStore,
            defaultArticle,
            isShowBtn,
            envURL,
            convertNameUpdate,
            convertBgAvatar,
            convertImgAvatar,
            editArticleDetail,
            getLastUpdate,
            filters,
            isShowModalWarning,
            returnDefault,
            isShowModalUnsave,
            backToArticle,
            changeVisibility,
            isShowModalDelete,
            isShowModalDeleteWarning,
            isEmpty,
            loadingArticleDetail,
            articleBody,
            articleSummary,
            status,
            disableSave,
        };
    },
});
</script>

<style lang="scss" scoped>
.article-edit .btn-visibility :deep(.flex) {
    justify-content: space-between;
    width: 100%;
}
.article-edit {
    &__article {
        height: calc(100% - 103px - 40px);
    }
    &__empty {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -30%);
    }
    textarea::placeholder {
        font-size: 14px;
        line-height: 20px;
        color: #6b6b7b;
    }
}
</style>
