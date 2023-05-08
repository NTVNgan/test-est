<template>
    <div>
        <modal-component
            v-model="showModalSync"
            :custom-class="'py-24p'"
            :width="'560px'"
            class="model-add-contact z-999"
        >
            <template v-slot:header>
                <div class="flex">
                    <icon-component name="exclamation-circle" class="icon-recently cursor-pointer" color="error-3" />
                    <span class="font-medium text-16 ml-4p">
                        Delete {{ countSelected > 1 ? countSelected + ' ' : '' }}canned
                        {{ countSelected > 1 ? 'responses' : 'response' }}?
                    </span>
                </div>
            </template>
            <template v-slot:body>
                <div class="px-24p py-16p text-center text-14">
                    {{
                        countSelected > 1
                            ? 'These canned responses will be permanently removed from ' + workspaceName + '.'
                            : 'This canned response will be permanently removed from ' + workspaceName + '.'
                    }}
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex justify-end">
                    <Button class="mr-8p" type="outline" size="medium" @click="closeModalHide">{{
                        $t('setting.teammate_modal_edit_email_button_cancel')
                    }}</Button>
                    <Button size="medium" type="destructive" @click="clickDelete">Delete</Button>
                </div>
            </template>
        </modal-component>
        <modal-component
            v-model="showModalResponse"
            :closeIcon="false"
            :custom-class="'py-24p'"
            :width="'508px'"
            class="model-add-contact z-999"
        >
            <template v-slot:body>
                <div class="px-24p pt-8p text-center text-14">
                    <p class="text-24 font-semibold capitalize font-heading">
                        {{
                            countSelected > 1
                                ? 'Unable To Delete ' + countSelected + ' Canned Responses'
                                : 'Unable to Delete canned response'
                        }}
                    </p>
                    <p class="text-14 my-16p mx-30p">
                        {{
                            countSelected > 1
                                ? 'These canned responses have been deleted by another teammate.'
                                : 'This canned response has been deleted by another teammate.'
                        }}
                    </p>
                    <Button size="medium" @click="closeModalResponse">Got it</Button>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, onMounted } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { store } from '@/store';
import { useCannedResponse } from '@/modules/setting/composables/useCannedResponse';
import { useToast } from '@/composables/useToast';

export default defineComponent({
    name: 'SettingCannedResponseModalDelete',
    components: {
        ModalComponent,
        Button,
        IconComponent,
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
        countFilter: {
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
        available_everyone: {
            type: Boolean,
            default: false,
        },
        updated_from: {
            type: String,
            default: null,
        },
        updated_to: {
            type: String,
            default: null,
        },
    },
    setup(props, { emit }) {
        const { deleteMultipleCannedResponse } = useCannedResponse();
        const showModalResponse = ref<boolean>(false);
        const currentUser = computed(() => store.state.auth.user);
        const { addToast } = useToast();
        const workspaceName = computed(() => {
            if (
                typeof currentUser.value.workspace != 'undefined' &&
                typeof currentUser.value.workspace.name != 'undefined'
            )
                return currentUser.value.workspace.name;
            return '';
        });

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const countSelected = computed(() => {
            if (props.count === 0) return props.countFilter;
            else return props.count;
        });

        const closeModalHide = () => {
            emit('close');
        };

        const clickDelete = async () => {
            const listID = props.cannedResponses.length > 0 ? props.cannedResponses : [];
            let param;
            if (listID.length > 0) {
                param = {
                    ids: listID,
                };
            } else {
                param = {
                    filter: {
                        q: props.searchValue,
                        updated_by: props.valueSelectAuth,
                        cat_id: props.valueSelectCategory,
                        updated_at_from: props.updated_from,
                        updated_at_to: props.updated_to,
                        available: props.available,
                        available_everyone: props.available_everyone,
                    },
                };
            }
            const res = await deleteMultipleCannedResponse(param);
            if (!res.error) {
                if (res.data.deleted_count === 0) {
                    closeModalHide();
                    showModalResponse.value = true;
                } else {
                    let content = 'Detele ' + countSelected.value + ' canned responses successfully';
                    if (countSelected.value < 2)
                        content = 'Detele ' + countSelected.value + ' canned response successfully';
                    await new Promise(resolve => setTimeout(resolve, 300));
                    closeModalHide();
                    addToast({
                        title: content,
                        type: 'basic',
                        timeout: 3000,
                    });
                    emit('submitDelete', res.data.deleted_count);
                }
            }
        };

        const closeModalResponse = async () => {
            emit('submitDelete');
            await new Promise(resolve => setTimeout(resolve, 300));
            showModalResponse.value = false;
        };

        return {
            showModalSync,
            closeModalHide,
            clickDelete,
            showModalResponse,
            closeModalResponse,
            workspaceName,
            countSelected,
        };
    },
});
</script>
