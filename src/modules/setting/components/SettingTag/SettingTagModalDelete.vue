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
                    <icon-component name="exclamation-circle" class="icon-recently cursor-pointer" color="error-3" />
                    <span class="font-medium text-16 ml-4p">
                        <template v-if="selectUnArchive != null">
                            Delete
                            {{
                                selectUnArchive.length > 1
                                    ? selectUnArchive.length + ` tags`
                                    : selectUnArchive.length + ` tag`
                            }}?
                        </template>
                        <template v-else>
                            Delete {{ totalUnArchive > 1 ? totalUnArchive + ` tags` : totalUnArchive + ` tag` }}?
                        </template>
                    </span>
                </div>
            </template>
            <template v-slot:body>
                <div class="px-24p py-16p text-center text-14">
                    <template v-if="totalUnArchive > 1">
                        <span
                            v-html="
                                $t('setting.tag_modal_delete_more_tag_content', {
                                    workspaceName: userStore.workspace.name,
                                })
                            "
                        ></span>
                    </template>
                    <template v-else>
                        <span
                            v-html="
                                $t('setting.tag_modal_delete_tag_content', { workspaceName: userStore.workspace.name })
                            "
                        ></span>
                    </template>
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <Button class="mr-8p" type="outline" size="medium" @click="closeModalShow">{{
                        $t('setting.tag_modal_button_cancel')
                    }}</Button>
                    <Button size="medium" type="destructive" @click="deleteTag">{{
                        $t('setting.tag_modal_button_delete')
                    }}</Button>
                </div>
            </template>
        </modal-component>
        <modal-error v-model:showModal="isShowModalError" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { store } from '@/store';
// import { useToast } from '@/composables/useToast';
import { useTag } from '@/modules/setting/composables/useTag';
import ModalError from '../../components/SettingTag/SettingTagModalError.vue';

export default defineComponent({
    name: 'SettingTagModalDelete',
    components: {
        ModalComponent,
        Button,
        IconComponent,
        ModalError,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        selectUnArchive: {
            type: Array,
            default: () => [],
        },
        totalUnArchive: {
            type: Number,
            default: 0,
        },
        filters: {
            type: Object,
            default: null,
        },
    },
    setup(props, { emit }) {
        const { deleteTagById, deleteTagByFilter } = useTag();
        // const { addToast } = useToast();
        const isShowModalError = ref<boolean>(false);

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set() {
                emit('update:showModal');
            },
        });

        const closeModalShow = () => {
            emit('update:showModal');
        };

        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        const checkFilters = () => {
            if (
                props.filters.q == '' &&
                [props.filters.updated_at_from, props.filters.updated_at_to, props.filters.updated_by].every(
                    (x) => x == null,
                )
            ) {
                return null;
            }
        };

        const checkMoreTag = computed(() => {
            if (props.selectUnArchive != null) {
                if (props.totalUnArchive > 1) return `${props.totalUnArchive} tags`;
                return `${props.totalUnArchive} tag`;
            } else {
                if (props.totalUnArchive > 1) return `all ${props.totalUnArchive} tags`;
                return `all ${props.totalUnArchive} tag`;
            }
        });

        const deleteTag = async () => {
            if (checkFilters() !== null && props.selectUnArchive === null) {
                try {
                    await deleteTagByFilter(props.filters);
                    // addToast({
                    //     title: `Delete ${checkMoreTag.value} successfully`,
                    //     type: 'basic',
                    //     timeout: 3000,
                    // });
                    emit('deleteTag', { total: props.totalUnArchive, type: 'delete' });
                } catch (e) {
                    const errorKey = Object.keys(e)[0];
                    if (errorKey == 'tags_has_been_deleted_by_another_user' || errorKey == 'tag_does_not_exist')
                        isShowModalError.value = true;
                }
            } else {
                try {
                    await deleteTagById({
                        tag_ids: props.selectUnArchive === null ? null : props.selectUnArchive,
                    });
                    // addToast({
                    //     title: `Delete ${checkMoreTag.value} successfully`,
                    //     type: 'basic',
                    //     timeout: 3000,
                    // });
                    emit('deleteTag', { total: props.totalUnArchive, type: 'delete' });
                } catch (e) {
                    const errorKey = Object.keys(e)[0];
                    if (errorKey == 'tags_has_been_deleted_by_another_user' || errorKey == 'tag_does_not_exist')
                        isShowModalError.value = true;
                }
            }
            emit('update:showModal');
        };

        return {
            showModalSync,
            closeModalShow,
            userStore,
            deleteTag,
            isShowModalError,
        };
    },
});
</script>
