<template>
    <modal-component
        v-model="showModalSync"
        :custom-class="'py-32p'"
        :width="'512px'"
        :closeIcon="false"
        class="model-add-contact text-center z-999"
    >
        <template v-slot:body>
            <p class="text-24 font-semibold capitalize font-heading">you’ve reached the maximum number of categories</p>
            <p class="text-14 my-16p">
                Maximum 1000 canned responses in {{userStore.workspace.name}}.
            </p>
            <Button size="medium" @click="closeModal"> Got it </Button>
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
    name: 'ContactListModalSaveSegment',
    components: {
        Button,
        ModalComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        errorCode: {
            type: String,
            default: null,
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
            if (props.errorCode === 'category') reloadPage();
            else router.push({ name: 'CannedResponses' });
        };

        return {
            showModalSync,
            reloadPage,
            onCloseModal,
            closeModal,
            userStore
        };
    },
});
</script>