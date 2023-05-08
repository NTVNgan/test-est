<template>
    <modal-component
        v-model="showModalSync"
        :custom-class="'py-32p'"
        :width="'512px'"
        :closeIcon="false"
        class="model-add-contact text-center z-999"
    >
        <template v-slot:body>
            <p class="text-24 font-semibold capitalize font-heading" v-if="isEdit">Unable To Save Canned Response</p>
            <p class="text-24 font-semibold capitalize font-heading" v-else>Unable To Create Canned Response</p>
            <p class="text-14 my-16p">
                <template v-if="errorCode === 'category'">
                    The chosen category has been deleted by another teammate.<br />
                    Please choose another one.
                </template>
                <template v-else-if="errorCode === 'num_of_canres'">
                    Maximum 1000 canned responses in {{ userStore.workspace.name }}.
                </template>
                <template v-else> This canned response has been deleted by another teammate. </template>
            </p>
            <Button size="medium" @click="onCloseModal"> Got it </Button>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, reactive } from 'vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { router } from '@/router';
import { store } from '@/store';

export default defineComponent({
    name: 'SettingCannedResponseCreateModalWarning',
    components: {
        Button,
        ModalComponent,
    },
    emits: ['update:showModal', 'pushList'],
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        errorCode: {
            type: String,
            default: null,
        },
        isEdit: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
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

        const reloadPage = () => {
            location.reload();
        };
        const userStore: any = computed(() => {
            return store.state.auth.user;
        });
        const onCloseModal = () => {
            // if (props.errorCode === 'category') reloadPage();
            if (props.errorCode === 'category') {
                // reloadPage();
                emit('update:showModal', false);
            } else {
                emit('pushList');
                router.push({ name: 'CannedResponses' });
            }
        };

        return {
            showModalSync,
            reloadPage,
            onCloseModal,
            closeModal,
            userStore,
        };
    },
});
</script>