<template>
    <teleport to="#modal">
        <modal-component
            v-model="showModalSync"
            :custom-class="'py-24p'"
            :width="'464px'"
            :closeIcon="false"
            class="model-add-contact font-body text-center z-999"
        >
            <template v-slot:header>
                <span class="font-medium text-16"> Create category </span>
            </template>
            <template v-slot:body>
                <div class="flex mx-32p flex-col items-start">
                    <span class="inline-block text-14 mb-4p font-medium"> Category name </span>
                    <input-component
                        ref="valueInput"
                        class="w-full"
                        :state="isError ? 'error' : ''"
                        v-model="value"
                        :maxlength="100"
                        counter
                        :placeholder="'Enter category name'"
                        @keydown.enter="value.length === 0 ? onCreateCRCate() : null"
                    >
                    </input-component>
                    <span v-if="isError" class="block text-error-3 text-14 pt-4p">
                        Category name already exists. Please try another one.
                    </span>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end">
                    <button-component type="secondary" class="mr-8p" size="medium" @click="closeModal">
                        Cancel
                    </button-component>
                    <button-component
                        @click="onCreateCRCate"
                        type="primary"
                        class="mr-8p"
                        :disabled="value.trim().length < 2"
                        size="medium"
                    >
                        Create
                    </button-component>
                </div>
            </template>
        </modal-component>
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, reactive } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { router } from '@/router';
import { store } from '@/store';
import InputComponent from '@/components/ui/InputComponent.vue';
import { useCannedResponse } from '../composables/useCannedResponse';
import { useToast } from '@/composables/useToast';

export default defineComponent({
    name: 'SettingCannedResponseCategoiresModalCreateCate',
    components: {
        ButtonComponent,
        ModalComponent,
        InputComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:showModal', 'created'],
    setup(props, { emit }) {
        const valueInput: any = ref(null);
        const errorCode = ref('reach_limit');
        const isError = ref(false);
        const value = ref('');
        const { addToast } = useToast();
        const { createCannedResCategory } = useCannedResponse();
        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        watch(value, () => {
            isError.value = false;
        });

        const closeModal = () => {
            emit('update:showModal', false);
            value.value = '';
            isError.value = false;
        };

        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

        const onCreateCRCate = async () => {
            try {
                const data = await createCannedResCategory({ name: value.value.trim() });
                addToast({
                    title: 'Created new category successfully.',
                    type: 'basic',
                    timeout: 3000,
                });
                emit('created', data);
                closeModal();
            } catch (e) {
                isError.value = true;
                if (e.reach_limit) {
                    emit('created', false);
                    closeModal();
                }
            }
        };

        return {
            showModalSync,
            closeModal,
            value,
            isError,
            valueInput,
            onCreateCRCate,
            userStore,
            errorCode,
        };
    },
});
</script>