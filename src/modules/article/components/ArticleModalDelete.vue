<template>
    <modal-component v-model="showModalSync">
        <template v-slot:header>
            <div class="flex">
                <icon-component class="mr-4p" name="ExclamationCircle" color="error-3" />
                <span class="font-medium text-16">
                    Delete article?
                </span>
            </div>
        </template>
        <template v-slot:body>
            <div class="text-center text-14 px-32p">
                This article will be permanently removed and can’t be recovered.
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end">
                <button-component type="outline" @click="closeModal" class="mr-8p" size="medium">
                    {{ $t('setting.canned_response_create_button_cancel') }}
                </button-component>
                <button-component type="destructive" size="medium" @click="deleteArticle">
                    Delete
                </button-component>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, reactive, computed, inject } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useToast } from '@/composables/useToast';
import { useRoute, useRouter } from 'vue-router';
import { useArticle } from '../composables/useArticle';

export default defineComponent({
    name: 'Article Delete',
    components: {
        ModalComponent,
        ButtonComponent,
        IconComponent
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
        const { deleteArticleById } = useArticle();
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
        };

        const deleteArticle = async () => {
            try {
                const res = await deleteArticleById(route.params.id);
                addToast({
                    title: 'Deleted article successfully.',
                    type: 'basic',
                    timeout: 3000,
                });
                router.push({ name: 'Article' });
            } catch (e) {
                console.log(e);
                emitter.emit('warningDelete', 'delete');
            }
        }

        return {
            showModalSync,
            closeModal,
            deleteArticle
        }
    }
})
</script>