<template>
    <div class="article-create h-full pb-20p">
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
                    <ArticleSettingDrawer v-model:collection="article.collection" v-model:section="article.section" />
                </div>
                <div class="flex items-center">
                    <span class="text-14 text-neutrals-400 mr-8p">Unsaved changes</span>
                    <button-component class="h-36" type="outline" @click="backToArticle('unsave')"
                        >Cancel</button-component
                    >
                    <button-component
                        class="h-36 ml-8p"
                        @click="onCreateArticle"
                        :disabled="article.title.trim().length < 1"
                        type="primary"
                        >Save</button-component
                    >
                </div>
            </div>
        </div>
        <div class="mt-40p scrollbar--transparent overflow-y-auto article-create__article">
            <div class="max-w-720 mx-auto">
                <div v-click-outside="onClickOutsideInput">
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
                        v-if="!isEditName && article.title.trim() !== 0"
                        >{{ article.title }}</span
                    >
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
                    <template v-if="userStore && userStore.avatar_src">
                        <avatar-component
                            :image="envURL + '/' + userStore.avatar_src"
                            size="medium"
                            :bgAvatar="userStore && userStore.avatar_bg"
                            :label-avatar="userStore.username"
                        />
                    </template>
                    <template v-else>
                        <avatar-component
                            size="medium"
                            :label-avatar="userStore && userStore.username"
                            :bgAvatar="userStore && userStore.avatar_bg"
                        />
                    </template>
                    <div class="info-user ml-8p truncate">
                        <span class="text-14 font-medium block truncate">{{ userStore && userStore.username }}</span>
                        <span class="text-14 text-neutrals-300 block">Last updated: {{ getLastUpdate }}</span>
                    </div>
                </div>
                <text-editor
                    customToolbarClass="sticky top-0 z-10 mt-16p"
                    featureType="article"
                    v-model="article.body"
                />
            </div>
        </div>
        <ModalDiscard v-model:showModal="isShowModalWarning" @discard="returnDefault"></ModalDiscard>
        <ModalUnsave
            v-model:showModal="isShowModalUnsave"
            @discard="returnDefault"
            @saveArticle="onCreateArticle"
        ></ModalUnsave>
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
import { useToast } from '@/composables/useToast';
import ModalDiscard from '../components/ArticleModalDiscard.vue';
import ModalUnsave from '../components/ArticleModalUnsave.vue';
import { useRouter } from 'vue-router';
import TextEditor from '@/components/ui/TextEditorComponent/TextEditorComponent.vue';
import ArticleSettingDrawer from '../components/ArticleSettingDrawer.vue';

export default defineComponent({
    name: 'Articles Create',
    components: {
        ButtonComponent,
        IconComponent,
        SelectPanel,
        SelectCustom,
        InputComponent,
        AvatarComponent,
        ModalDiscard,
        ModalUnsave,
        TextEditor,
        ArticleSettingDrawer,
    },
    setup() {
        const articleBody = ref<any>(null);
        const articleSummary = ref<any>(null);
        const isEditName = ref(false);
        const isError = ref(false);
        const envURL = process.env.VUE_APP_FILE_URL;
        const { createArticleRes } = useArticle();
        const isShowModalWarning = ref<boolean>(false);
        const isShowModalUnsave = ref<boolean>(false);
        const router = useRouter();
        const valueVisibility = ref<any>('draft');
        const titleInput = ref<any>(null);
        const optionSelect = reactive<object[]>([
            { label: 'Published', value: 'published' },
            { label: 'Draft', value: 'draft' },
        ]);

        const article = ref<any>({
            title: 'Untitled Article',
            summary: '',
            body: '',
            status: 2,
            collection: null,
            section: null,
        });
        const defaultArticle = ref<any>({
            title: 'Untitled article',
            summary: '',
            body: '',
            status: 2,
            collection: null,
            section: null,
        });

        const { addToast } = useToast();
        const isChangeData = ref<boolean>(false);
        const emitter: any = inject('emitter');

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

        const changeVisibility = () => {
            if (valueVisibility.value === 'draft') {
                article.value.status = 2;
            } else {
                article.value.status = 1;
            }
        };

        const getLastUpdate = computed(() => {
            const time = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });
            return new Date().toString().slice(4, 10) + ', ' + time;
        });

        const returnDefault = (value: boolean) => {
            if (value) {
                router.push({ name: 'Article' });
            } else {
                isError.value = false;
            }
            article.value = JSON.parse(JSON.stringify(defaultArticle.value));
            if (defaultArticle.value.status == 2) valueVisibility.value = 'draft';
            else valueVisibility.value = 'published';
        };

        const onCreateArticle = async () => {
            const { title, summary, body, status, collection: collection_id, section: section_id } = unref(article);
            try {
                const res = await createArticleRes({
                    title,
                    summary,
                    body,
                    status,
                    check: false,
                    collection_id,
                    section_id,
                });
                addToast({
                    title: 'Created article successfully',
                    type: 'basic',
                    timeout: 3000,
                });
                defaultArticle.value = JSON.parse(JSON.stringify(article.value));
                isError.value = false;
                router.push({ name: 'Article' });
            } catch (e) {
                const errorKey = Object.keys(e)[0];
                if (errorKey == 'title_exists') isError.value = true;
            }
        };

        const backToArticle = (val: any) => {
            if (isChangeData.value) {
                if (val === 'unsave') isShowModalWarning.value = true;
                else isShowModalUnsave.value = true;
            } else {
                router.push({ name: 'Article' });
            }
        };

        onMounted(() => {
            articleSummary.value.addEventListener('keydown', function (e: any) {
                const keyCode = e.which || e.keyCode;
                if ((keyCode === 13 && e.shiftKey) || keyCode === 13) {
                    e.preventDefault();
                }
            });
            const textEditorEl = document.getElementsByClassName('article-create__article');

            textEditorEl[0].addEventListener('scroll', (e) => {
                emitter.emit('ArticleScroll', e);
            });
        });

        watch(
            article,
            () => {
                isChangeData.value = JSON.stringify(article.value) !== JSON.stringify(defaultArticle.value);
            },
            { deep: true },
        );

        return {
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
            onCreateArticle,
            changeVisibility,
            isShowModalWarning,
            isShowModalUnsave,
            returnDefault,
            defaultArticle,
            isChangeData,
            backToArticle,
            getLastUpdate,
            envURL,
            articleBody,
            articleSummary,
        };
    },
});
</script>

<style lang="scss" scoped>
.article-create .btn-visibility :deep(.flex) {
    justify-content: space-between;
    width: 100%;
}
.article-create {
    &__article {
        height: calc(100% - 103px - 40px);
    }
    textarea::placeholder {
        font-size: 14px;
        line-height: 20px;
        color: #6b6b7b;
    }
}
</style>
