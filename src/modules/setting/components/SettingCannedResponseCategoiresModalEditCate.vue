<template>
    <teleport to="#modal">
        <modal-component
            v-model="showModalSync"
            :custom-class="'py-24p'"
            :width="'464px'"
            class="text-center font-body z-999"
        >
            <template v-slot:header>
                <span class="font-medium text-16">{{ $t('setting.canned_response_cate_modal_edit_title') }}</span>
            </template>
            <template v-slot:body>
                <div class="flex mx-32p flex-col items-start">
                    <span class="inline-block text-14 mb-4p font-medium">{{ $t('setting.canned_response_cate_modal_edit_label') }}</span>
                    <input-component
                        class="w-full"
                        :state="errorMessage !== null && Object.keys(errorMessage)[0] === 'name_exists' ? 'error' : ''"
                        v-model.trim="categoryNameValue"
                        :maxlength="100"
                        counter
                        :placeholder="$t('setting.canned_response_cate_modal_edit_placeholder')"
                        @keydown.enter="onEditCRCate"
                    >
                    </input-component>
                    <span
                        v-if="errorMessage !== null && Object.keys(errorMessage)[0] === 'name_exists'"
                        class="block text-14 text-error-3"
                    >
                        {{ $t('setting.canned_response_cate_modal_edit_error_name_exists') }}
                    </span>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end">
                    <button-component type="secondary" class="mr-8p" size="medium" @click="closeModal">
                        {{ $t('setting.canned_response_cate_modal_edit_button_cancel') }}
                    </button-component>
                    <button-component
                        @click="onEditCRCate"
                        type="primary"
                        class="mr-8p"
                        :disabled="checkDisableButton"
                        size="medium"
                    >
                        {{ $t('setting.canned_response_cate_modal_edit_button_apply') }}
                    </button-component>
                </div>
            </template>
        </modal-component>
        <modal-alert-component
            v-model:showModal="showModalAlert"
            width="496px"
            :title="$t('setting.canned_response_cate_modal_alert_title')"
            :content="$t('setting.canned_response_cate_modal_alert_content')"
            @onClickButton="reloadPage"
        />
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import InputComponent from '@/components/ui/InputComponent.vue';
import ModalAlertComponent from '@/components/ui/ModalAlertComponent.vue';
import { useCannedResponse } from '../composables/useCannedResponse';
import { useToast } from '@/composables/useToast';

export default defineComponent({
    name: 'SettingCannedResponseCategoiresModalEditCate',
    components: {
        ButtonComponent,
        ModalComponent,
        InputComponent,
        ModalAlertComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        category: {
            type: Object,
            default: null,
        },
    },
    emits: ['update:showModal', 'edited'],
    setup(props, { emit }) {
        const showModalAlert = ref<boolean>(false);
        const categoryNameValue = ref<string>('');
        const categoryNameCloneValue = ref<string>('');
        const { addToast } = useToast();
        const { updateCannedResponseCateById, errorMessage, error } = useCannedResponse();
        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });
        const checkDisableButton = computed(() => {
            if (categoryNameCloneValue.value === categoryNameValue.value) {
                return true;
            }
            if (errorMessage.value !== null && Object.keys(errorMessage.value)[0] === 'name_exists') {
                return true;
            }
            if (categoryNameValue.value.length < 2) {
                return true;
            }
            return false;
        });

        const closeModal = () => {
            emit('update:showModal', false);
        };
        const reloadPage = () => {
            location.reload();
        };
        const onEditCRCate = async () => {
            if (checkDisableButton.value) return;
            const data = await updateCannedResponseCateById(
                { name: categoryNameValue.value, type: 3, order: 3, status: 1 },
                props.category.id,
            );
            if (!error.value) {
                addToast({
                    title: 'Edited category successfully.',
                    type: 'basic',
                    timeout: 3000,
                });
                emit('edited', data);
                closeModal();
            }
            if (error.value && errorMessage.value !== null && Object.keys(errorMessage.value)[0] !== 'name_exists') {
                emit('update:showModal', false);
                await new Promise(resolve => setTimeout(resolve, 300));
                showModalAlert.value = true;
            }
        };
        watch(
            () => props.showModal,
            () => {
                categoryNameValue.value = props.category?.name;
                categoryNameCloneValue.value = props.category?.name;
            },
            { deep: true },
        );
        watch(
            () => categoryNameValue.value,
            () => {
                errorMessage.value = null;
            },
            { deep: true },
        );

        return {
            showModalAlert,
            showModalSync,
            categoryNameValue,
            errorMessage,
            checkDisableButton,
            closeModal,
            reloadPage,
            onEditCRCate,
        };
    },
});
</script>
