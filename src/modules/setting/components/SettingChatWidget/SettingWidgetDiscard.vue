<template>
    <modal-component v-model="showModalSync">
        <template v-slot:header>
            <div class="flex">
                <icon-component class="mr-4p" name="InfoCircle" color="primary-600" />
                <span class="font-medium text-16">
                    {{ $t('setting.canned_response_create_modal_confirm_title') }}
                </span>
            </div>
        </template>
        <template v-slot:body>
            <div class="text-center text-14 px-32p">Are you sure you want to discard all changes?</div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end">
                <button-component type="outline" @click="closeModal" class="mr-8p" size="medium">
                    {{ $t('setting.canned_response_create_button_cancel') }}
                </button-component>
                <button-component type="primary" @click="discardModal" size="medium">
                    {{ $t('setting.canned_response_create_modal_confirm_button_discard') }}
                </button-component>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useToast } from '@/composables/useToast';

export default defineComponent({
    name: 'Article Discard',
    components: {
        ModalComponent,
        ButtonComponent,
        IconComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const { addToast } = useToast();

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const closeModal = () => {
            emit('update:showModal', false);
        };

        const discardModal = () => {
            emit('discard', false);
            emit('update:showModal', false);
            addToast({
                title: 'All changes are discarded',
                type: 'basic',
                timeout: 3000,
            });
        };

        return {
            showModalSync,
            closeModal,
            discardModal,
        };
    },
});
</script>