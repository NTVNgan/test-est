<template>
    <modal-component v-model="showModalSync" width="496px">
        <template v-slot:body>
            <div class="text-center px-56p">
                <span class="text-24 block font-semibold capitalize">you’ve reached the maximum number of articles</span>
                <span class="text-14 block py-16p">Maximum 500 articles in {{userStore && userStore.workspace.name}}.</span>
                <button-component type="primary" size="medium" @click="closeModal">
                    Got it
                </button-component>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, reactive, computed } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useToast } from '@/composables/useToast';
import { useRoute, useRouter } from 'vue-router';
import { store } from '@/store';

export default defineComponent({
    name: 'Article Delete',
    components: {
        ModalComponent,
        ButtonComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const { addToast } = useToast();
        const route = useRoute();
        const router = useRouter();

        const userStore: any = computed(() => {
            return store.state.auth.user;
        });

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

        return {
            showModalSync,
            closeModal,
            userStore
        }
    }
})
</script>