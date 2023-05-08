<template>
    <div>
        <modal-component
            v-model="showModalSync"
            :closeIcon="false"
            :custom-class="'py-24p'"
            :width="'508px'"
            class="model-add-contact z-999"
        >
            <template v-slot:body>
                <div class="px-24p pt-8p text-center text-14">
                    <p class="text-24 font-semibold capitalize font-heading">
                        {{ $t('setting.canned_response_modal_change_cate_error_title') }}
                    </p>
                    <p class="text-14 my-16p mx-30p">
                        {{ $t('setting.canned_response_modal_change_cate_error_content') }}
                    </p>
                    <Button size="medium" @click="closeModalNoCategory">{{
                        $t('setting.canned_response_create_button_got_it')
                    }}</Button>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import { store } from '@/store';
import { useRouter } from 'vue-router';
import { useCannedResponse } from '@/modules/setting/composables/useCannedResponse';

export default defineComponent({
    name: 'SettingCannedResponseModalChangeCategoryError',
    components: {
        ModalComponent,
        Button,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        cannedResponses: {
            type: Array,
            default: () => [],
        },
        count: {
            type: Number,
            default: 0,
        },
        searchValue: {
            type: String,
            default: null,
        },
        valueSelectAuth: {
            type: String,
            default: null,
        },
        valueSelectCategory: {
            type: String,
            default: null,
        },
        available: {
            type: String,
            default: null,
        },
        updated_from: {
            type: String,
            default: null,
        },
        updated_to: {
            type: String,
            default: null,
        },
        countFilter: {
            type: Number,
            default: 0,
        },
        available_everyone: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const showModalResponse = ref<boolean>(false);
        const showModalResponseError = ref<boolean>(false);
        const showModalNoCategory = ref<boolean>(false);
        const currentUser = computed(() => store.state.auth.user);
        const valueSelect = ref<string>('');
        const workspaceName = computed(() => {
            if (typeof currentUser.value.workspace.name != 'undefined') return currentUser.value.workspace.name;
            return '';
        });
        const router = useRouter();
        const { searchCategory } = useCannedResponse();

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const closeModalNoCategory = async () => {
            const data = await searchCategory({ type: 1 });
            if (!data.error) {
                if (data.data.length > 0) {
                    await router.push({ name: 'CannedResponses', query: { cate_id: data.data[0]['id'] } });
                    location.reload();
                }
            } else {
                await router.push({ name: 'CannedResponses' });
                location.reload();
            }
        };

        return {
            showModalSync,
            showModalResponse,
            showModalResponseError,
            showModalNoCategory,
            workspaceName,
            valueSelect,
            closeModalNoCategory,
        };
    },
});
</script>
