<template>
    <modal-component v-model="showModalSync" width="512px">
        <template v-slot:body>
            <div class="text-center px-56p">
                <span class="text-24 block font-semibold capitalize">
                    <template v-if="!typeBtn">
                        Unable to save Article
                    </template>
                    <template v-else>
                        Unable to Delete article
                    </template>
                </span>
                <span class="text-14 block py-16p">This article has been deleted by another teammate.</span>
                <button-component type="primary" size="medium" @click="closeModal">
                    Got it
                </button-component>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, reactive, computed, inject } from 'vue';
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
        const emitter: any = inject('emitter');
        const typeBtn = ref<boolean>(false);

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
            router.push({ name: 'Article' }); 
        };

        emitter.on('warningDelete', (val: string) => {
            if(val === 'delete')
                typeBtn.value = true;
            else
                typeBtn.value = false;
        })

        return {
            showModalSync,
            closeModal,
            userStore,
            typeBtn
        }
    }
})
</script>