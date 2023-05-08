<template>
    <modal-component v-model="showModalSync" width="512px">
        <template v-slot:body>
            <div class="text-center px-56p">
                <span class="text-24 block font-semibold capitalize">
                    Unable to {{numberDelete > 1 ? `Delete ${numberDelete} articles` : `Delete article`}}
                </span>
                <span class="text-14 block py-16p">
                    <template v-if="numberDelete > 1">
                        Therse articles have been deleted by another teammate.
                    </template>
                    <template v-else>
                        This article has been deleted by another teammate.
                    </template>
                </span>
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
    name: 'Article Delete Multi Edit',
    components: {
        ModalComponent,
        ButtonComponent,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        numberDelete: {
            type: Number,
            default: 0
        }
    },
    setup(props, { emit }) {
        const { addToast } = useToast();
        const route = useRoute();
        const router = useRouter();
        const emitter: any = inject('emitter');

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
            location.reload();
        };

        return {
            showModalSync,
            closeModal,
        }
    }
})
</script>