<template>
    <teleport to="#modal">
        <modal-component
            v-model="showModalSync"
            :custom-class="'py-24p'"
            :width="'464px'"
            @close="closeModal"
            class="model-add-contact font-body text-center z-999"
        >
            <template v-slot:header>
                <span class="font-medium text-16">{{ $t('setting.tag_modal_create_title') }}</span>
            </template>
            <template v-slot:body>
                <div class="flex mx-32p flex-col items-start">
                    <span class="inline-block text-14 mb-4p font-medium">
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
                    <button-component
                        @click="onCreateTag"
                        type="primary"
                        :disabled="errorCode !== '' || !inputValue"
                        size="medium"
                    >
                        {{ $t('setting.tag_modal_button_create') }}
                    </button-component>
                </div>
            </template>
        </modal-component>
        <modal-alert-component
            v-model:showModal="showModalAlert"
            width="496px"
            :title="$t('setting.tag_modal_alert_maximum_tag_title')"
            :content="$t('setting.tag_modal_alert_maximum_tag_content', { orgName: userStore.organization.name })"
            @onClickButton="showModalAlert = false"
        />
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import InputComponent from '@/components/ui/InputComponent.vue';
import ModalAlertComponent from '@/components/ui/ModalAlertComponent.vue';
import { store } from '@/store';
import { useTag } from '../../composables/useTag';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'SettingTagModalCreate',
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
    },
    emits: ['update:showModal', 'created'],
    setup(props, { emit }) {
        const inputValue = ref<string>('');
        const showModalAlert = ref<boolean>(false);
        const { addToast } = useToast();
        const { createTag, error, errorMessage } = useTag();
        const { t } = useI18n();
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
        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        const closeModal = () => {
            emit('update:showModal', false);
            inputValue.value = '';
            errorMessage.value = null;
        };
        const onCreateTag = async () => {
            if (errorCode.value) return;
            const data = await createTag({ name: inputValue.value });
            if (!error.value) {
                addToast({
                    title: t('setting.tag_modal_create_toast_successful'),
                    type: 'basic',
                    timeout: 3000,
                });
                emit('created', data);
                closeModal();
            } else {
                console.log('111');
                if (
                    error.value &&
                    errorMessage.value !== null &&
                    Object.keys(errorMessage.value)[0] === 'reach_limit'
                ) {
                    emit('update:showModal', false);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    showModalAlert.value = true;
                    inputValue.value = '';
                }
            }
        };

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
            errorMessage,
            showModalAlert,
            closeModal,
            onCreateTag,
        };
    },
});
</script>
