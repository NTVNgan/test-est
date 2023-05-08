/* eslint-disable prettier/prettier */
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
                    <span class="font-medium text-16 ml-4p"
                        >Archive {{ totalArchive > 1 ? totalArchive + ` tags` : totalArchive + ` tag` }}?</span
                    >
                </div>
            </template>
            <template v-slot:body>
                <div class="px-24p py-16p text-center text-14">
                    {{ totalArchive > 1 ? `These tags` : `This tag` }} {{ $t('setting.tag_modal_archive_content') }}
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <Button class="mr-8p" type="outline" size="medium" @click="closeModalShow">{{
                        $t('setting.tag_modal_button_cancel')
                    }}</Button>
                    <Button size="medium" type="destructive" @click="archiveTag">{{
                        $t('setting.tag_modal_archive_button_archive')
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
import { useTag } from '@/modules/setting/composables/useTag';
// import { useToast } from '@/composables/useToast';
import ModalError from '../../components/SettingTag/SettingTagModalError.vue';

export default defineComponent({
    name: 'SettingTagModalArchive',
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
        totalArchive: {
            type: Number,
            default: 0,
        },
        selectArchive: {
            type: Array,
            default: () => [],
        },
        filters: {
            type: Object,
            default: null,
        },
    },
    setup(props, { emit }) {
        const { archiveTagById, archiveTagByFilter } = useTag();
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

        const checkFilters = () => {
            if (
                props.filters.q == '' &&
                [props.filters.updated_at_from, props.filters.updated_at_to, props.filters.updated_by].every(
                    x => x == null,
                )
            ) {
                return null;
            }
        };

        const checkMoreTag = computed(() => {
            if (props.totalArchive > 1) return `${props.totalArchive} tags`;
            return `${props.totalArchive} tag`;
        });

        const archiveTag = async () => {
            if (checkFilters() !== null && props.selectArchive === null) {
                try {
                    await archiveTagByFilter(props.filters);
                    // addToast({
                    //     title: `Archive ${checkMoreTag.value} successfully`,
                    //     type: 'basic',
                    //     timeout: 3000,
                    // });

                    emit('archiveTag', { total: props.totalArchive, type: 'archive' });
                } catch (e) {
                    const errorKey = Object.keys(e)[0];
                    if (errorKey == 'tags_has_been_archived_by_another_user' || errorKey == 'tag_does_not_exist') isShowModalError.value = true;
                }
            } else {
                try {
                    await archiveTagById({ tag_ids: props.selectArchive === null ? null : props.selectArchive });
                    // addToast({
                    //     title: `Archive ${checkMoreTag.value} successfully`,
                    //     type: 'basic',
                    //     timeout: 3000,
                    // });
                    emit('archiveTag', { total: props.totalArchive, type: 'archive' });
                } catch (e) {
                    const errorKey = Object.keys(e)[0];
                    if (errorKey == 'tags_has_been_archived_by_another_user' || errorKey == 'tag_does_not_exist') isShowModalError.value = true;
                }
            }
            emit('update:showModal');
        };

        return {
            showModalSync,
            closeModalShow,
            archiveTag,
            isShowModalError,
        };
    },
});
</script>
