<template>
    <teleport to="#modal">
        <modal-component
            v-model="showModalSync"
            :custom-class="'py-24p'"
            :width="'464px'"
            class="model-add-contact font-body text-center z-999"
        >
            <template v-slot:header>
                <span class="font-medium text-16">{{ $t('setting.tag_modal_edit_title') }}</span>
            </template>
            <template v-slot:body>
                <div class="flex mx-32p flex-col items-start">
                    <span class="text-14 block text-neutrals-500 mb-10p">{{
                        $t('setting.tag_modal_edit_decription')
                    }}</span>
                    <span class="inline-block text-14 mb-10p font-medium">
                        {{ $t('setting.tag_modal_input_label') }}
                    </span>
                    <input-component
                        class="w-full"
                        :state="errorCode ? 'error' : ''"
                        v-model.trim="inputValue"
                        :maxlength="100"
                        counter
                        :placeholder="$t('setting.tag_modal_input_placeholder')"
                        @keydown.enter="inputValue.length === 0 ? onCreateCRCate() : null"
                    >
                    </input-component>
                    <span v-if="errorCode !== ''" class="block text-error-3 text-14 pt-4p">
                        {{ $t(`setting.tag_modal_input_error_${errorCode}`) }}
                    </span>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end">
                    <button-component type="outline" class="mr-8p" size="medium" @click="closeModal">
                        {{ $t('setting.tag_modal_button_cancel') }}
                    </button-component>
                    <button-component @click="onEditTag" type="primary" :disabled="checkDisableButton" size="medium">
                        {{ $t('setting.tag_modal_button_apply') }}
                    </button-component>
                </div>
            </template>
        </modal-component>
        <modal-error v-model:showModal="isShowModalError" />
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import InputComponent from '@/components/ui/InputComponent.vue';
import { store } from '@/store';
import { useTag } from '../../composables/useTag';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
import ModalError from '../../components/SettingTag/SettingTagModalError.vue';

export default defineComponent({
    name: 'SettingTagModalEdit',
    components: {
        ButtonComponent,
        ModalComponent,
        InputComponent,
        ModalError,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        tag: {
            type: Object,
            default: null,
        },
    },
    emits: ['update:showModal', 'edited'],
    setup(props, { emit }) {
        const inputValue = ref<string>('');
        const inputValueClone = ref<string>('');
        const { addToast } = useToast();
        const { editTag, error, errorMessage } = useTag();
        const { t } = useI18n();
        const isShowModalError = ref<boolean>(false);

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });
        const errorCode = computed(() => {
            if (inputValue.value && inputValue.value.length < 2) {
                return 'length';
            }
            if (errorMessage.value !== null && Object.keys(errorMessage.value)[0] === 'name_exists') {
                return 'name_exists';
            }
            return '';
        });
        const checkDisableButton = computed(() => {
            if (inputValueClone.value === inputValue.value) {
                return true;
            }
            if (inputValue.value && inputValue.value.length < 2) {
                return true;
            }
            if (errorCode.value) {
                return true;
            }
            if (inputValue.value == '') {
                return true;
            }
            return false;
        });
        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        const closeModal = () => {
            emit('update:showModal', false);
            inputValue.value = '';
            errorMessage.value = null;
        };
        const onEditTag = async () => {
            if (errorCode.value) return;
            const data = await editTag({ name: inputValue.value }, props.tag?.id);
            if (!error.value) {
                addToast({
                    title: t('setting.tag_modal_edit_toast_successful'),
                    type: 'basic',
                    timeout: 3000,
                });
                emit('edited', data);
                closeModal();
            } else {
                if (
                    error.value &&
                    errorMessage.value !== null &&
                    Object.keys(errorMessage.value)[0] !== 'name_exists'
                ) {
                    emit('update:showModal', false);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    isShowModalError.value = true;
                }
            }
        };
        watch(
            () => props.showModal,
            () => {
                inputValue.value = props.tag?.name;
                inputValueClone.value = props.tag?.name;
            },
            { deep: true },
        );
        watch(
            () => inputValue.value,
            () => {
                errorMessage.value = null;
            },
            { deep: true },
        );

        return {
            showModalSync,
            inputValue,
            userStore,
            errorCode,
            checkDisableButton,
            closeModal,
            onEditTag,
            isShowModalError,
        };
    },
});
</script>
