<template>
    <modal-component
        v-model="showModalSync"
        :custom-class="'py-24p'"
        :width="'560px'"
        class="z-999"
        :closeIcon="!isDeleteSuccess"
    >
        <template v-if="!isDeleteSuccess" v-slot:header>
            <div class="flex">
                <icon-component class="mr-4p" name="InfoCircle" color="error-3" />
                <span class="font-medium text-16">
                    {{
                        total > 1
                            ? $t('setting.contact_segment_modal_delete_plural_title', { total })
                            : $t('setting.contact_segment_modal_delete_singular_title')
                    }}
                </span>
            </div>
        </template>
        <template v-slot:body>
            <div v-if="isDeleteSuccess" class="px-24p pt-8p mx-auto text-center">
                <div class="font-semibold font-heading text-24">
                    {{ $t('setting.contact_segment_modal_delete_process_title') }}
                </div>
                <div class="text-14 my-16p" v-html="$t('setting.contact_segment_modal_delete_process_subtitle')"></div>
                <Button size="medium" @click="closeModal">
                    {{ $t('setting.contact_segment_modal_delete_button_got_it') }}
                </Button>
            </div>
            <template v-else>
                <div
                    v-if="total === 1"
                    class="px-24p py-16p text-center text-14"
                    v-html="$t('setting.contact_segment_modal_delete_singular_content')"
                ></div>
                <div v-else class="px-24p py-16p text-center text-14">
                    {{
                        $t('setting.contact_segment_modal_delete_plural_content', {
                            workspaceName: userStore.workspace.name,
                        })
                    }}
                </div>
            </template>
        </template>
        <template v-if="!isDeleteSuccess" v-slot:footer>
            <div class="flex justify-end">
                <Button class="mr-8p" type="outline" size="medium" @click="closeModal">
                    {{ $t('setting.contact_segment_modal_delete_button_cancel') }}
                </Button>
                <Button size="medium" type="destructive" @click="onSubmit">
                    {{ $t('setting.contact_segment_modal_delete_button_delete') }}
                </Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, onMounted } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useSegment } from '@/modules/contact/composables/useSegment';
import { useI18n } from 'vue-i18n';
import { useToast } from '@/composables/useToast';
import { store } from '@/store';

export default defineComponent({
    name: 'SettingContactSegmentModalDeleteSegment',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        segmentIds: {
            type: Object,
        },
        filter: {
            type: Object,
        },
        total: {
            type: Number,
            default: 0,
        },
    },
    components: {
        Button,
        IconComponent,
        ModalComponent,
    },
    setup(props, { emit }) {
        const isDeleteSuccess = ref<boolean>(false);
        const emitter: any = inject('emitter');
        const { t } = useI18n();
        const { addToast } = useToast();
        const { segmentsNonDefault, deleteNonDefaultSegment, error } = useSegment();

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

        const closeModal = async () => {
            emit('close');
            window.setTimeout(() => (isDeleteSuccess.value = false), 500);
        };

        const onSubmit = async () => {
            try {
                const formData: any = {
                    segment_ids: props.segmentIds,
                };
                if (props.filter?.q && !formData.segment_ids.length) {
                    formData.filter = props.filter;
                }
                await deleteNonDefaultSegment(formData);
                if (!error.value) {
                    addToast({
                        title:
                            props.total > 1
                                ? t('setting.contact_segment_modal_delete_plural_toast_success', { total: props.total })
                                : t('setting.contact_segment_modal_delete_singular_toast_success', { total: props.total }),
                        type: 'basic',
                        timeout: 3000,
                    });
                    isDeleteSuccess.value = true;
                }
            } catch (e) {
                console.log('error archive contact :', e);
            }
        };

        return {
            showModalSync,
            closeModal,
            onSubmit,
            isDeleteSuccess,
            userStore,
        };
    },
});
</script>

<style lang="scss" scoped></style>
