<template>
    <modal-component v-model="showModalSync" :custom-class="'py-24p'" :width="'464px'" class="model-add-contact z-999">
        <template v-slot:header>
            <div class="flex">
                <span class="font-medium text-16">{{ $t('setting.contact_segment_modal_edit_title') }}</span>
            </div>
        </template>
        <template v-slot:body>
            <div class="px-32p">
                <label class="mb-4p font-medium text-14">{{ $t('setting.contact_segment_modal_edit_label') }}</label>
                <Input
                    :state="errorMessage !== null ? 'error' : 'primary'"
                    v-model.trim="segmentNameValue"
                    counter
                    :maxlength="30"
                    type="text"
                    :placeholder="$t('setting.contact_segment_modal_edit_placeholder')"
                ></Input>
                <p class="text-error-3 text-14 mt-4p" v-if="errorMessage !== null">
                    {{ $t('setting.contact_segment_modal_edit_error_name_exists') }}
                </p>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end">
                <Button class="mr-8p" type="outline" size="medium" @click="closeModal">
                    {{ $t('setting.contact_segment_modal_edit_button_cancel') }}
                </Button>
                <Button size="medium" :disabled="checkDisableButton || loading" @click="onSubmit">
                    {{ $t('setting.contact_segment_modal_edit_button_apply') }}
                </Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, onMounted } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useSegment } from '@/modules/contact/composables/useSegment';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'SettingContactSegmentModalEditSegment',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        segment: {
            type: Object,
            default: null,
        },
    },
    components: {
        Button,
        Input,
        ModalComponent,
    },
    setup(props, { emit }) {
        const { error, errorMessage, loading, editNonDefaultSegment } = useSegment();
        const { addToast } = useToast();
        const segmentNameCloneValue = ref<string>('');
        const segmentNameValue = ref<string>('');
        const { t } = useI18n();

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });
        const checkDisableButton = computed(() => {
            if (segmentNameCloneValue.value === segmentNameValue.value) {
                return true;
            }
            if (errorMessage.value !== null) {
                return true;
            }
            if (!segmentNameValue.value) {
                return true;
            }
            return '';
        });

        const closeModal = async () => {
            emit('close');
        };

        const onSubmit = async () => {
            if (checkDisableButton.value) return;
            await editNonDefaultSegment({ name: segmentNameValue.value }, props.segment.id);
            if (!error.value) {
                addToast({
                    title: t('setting.contact_segment_modal_edit_toast_success'),
                    type: 'basic',
                    timeout: 3000,
                });
                closeModal();
            }
        };

        watch(
            () => props.showModal,
            () => {
                segmentNameValue.value = props.segment?.name;
                segmentNameCloneValue.value = props.segment?.name;
            },
            { deep: true },
        );
        watch(
            () => segmentNameValue.value,
            () => {
                errorMessage.value = null;
            },
            { deep: true },
        );

        return {
            loading,
            segmentNameValue,
            errorMessage,
            showModalSync,
            checkDisableButton,
            closeModal,
            onSubmit,
        };
    },
});
</script>

<style lang="scss" scoped></style>
