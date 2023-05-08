<template>
    <modal-component
        v-model="showModalSync"
        :custom-class="'py-24p'"
        :width="'464px'"
        class="model-add-contact z-999"
    >
        <template v-slot:header>
            <div class="flex">
                <span class="font-medium text-16">{{ $t('setting.contact_attribute_modal_title') }}</span>
            </div>
        </template>
        <template v-slot:body>
            <div class="px-32p">
                <div class="mb-12p">
                    <span class="text-14 font-medium mb-4p block">{{ $t('setting.contact_attribute_modal_title_input') }}</span>
                    <Input v-model.trim="infoAttribute.name" type="text" counter :maxlength="30"></Input>
                    <p
                        class="text-error-3 text-14 mt-4p"
                        v-if="attributeNameError"
                    >{{ $t('setting.contact_attribute_modal_error_exists') }}</p>
                </div>
                <div>
                    <span class="text-14 font-medium mb-4p block">{{ $t('setting.contact_attribute_modal_title_description') }}</span>
                    <Input
                        v-model.trim="infoAttribute.description"
                        textarea
                        type="text"
                        counter
                        :maxlength="50"
                        placeholder="Enter description"
                    ></Input>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end">
                <Button
                    class="mr-8p"
                    type="outline"
                    size="medium"
                    @click="closeModal"
                >{{ $t('setting.teammate_modal_edit_email_button_cancel') }}</Button>
                <Button size="medium" :disabled="disableButtonSave || !infoAttribute.name" @click="saveModal">{{ $t('setting.contact_attribute_modal_button_apply') }}</Button>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch, onMounted } from 'vue';
import Input from '@/components/ui/InputComponent.vue';
import Button from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useAttribute } from '@/modules/setting/composables/useContactAttribute';
import { useToast } from '@/composables/useToast';

export default defineComponent({
    name: 'SettingAttributeModalEdit',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        attribute: {
            type: Object,
            default: null,
        },
    },
    components: {
        Button,
        Input,
        ModalComponent,
    },
    setup(props, { emit }) {
        const attributeNameError = ref<boolean>(false);
        const { error, errorMessage, loading, editContactAttribute } = useAttribute();
        const { addToast } = useToast();
        const infoAttribute = ref<any>({
            name: '',
            description: ''
        });
        const infoAttributeClone = ref<any>({});
        const disableButtonSave = ref<boolean>(true);
        const emitter: any = inject('emitter');

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const closeModal = async () => {
            emit('close');
        };

        const saveModal = async () => {
            const res = await editContactAttribute(props.attribute?.id, {name: infoAttribute.value.name, description: infoAttribute.value.description});
            if (!error.value) {
                addToast({
                    title: 'Attribute successfully updated',
                    type: 'basic',
                    timeout: 3000,
                });
                emitter.emit('updateAttribute', res);
                closeModal();
            } else {
                if (errorMessage && !Object.prototype.hasOwnProperty.call(errorMessage, 'name_is_exists')){
                    attributeNameError.value = true;
                }
                disableButtonSave.value = true;
            }
        };

        watch(
            () => props.showModal,
            () => {
                attributeNameError.value = false;
                infoAttribute.value.name = props.attribute.name;
                infoAttribute.value.description = props.attribute.description;
                infoAttributeClone.value = JSON.parse(JSON.stringify(infoAttribute.value));
            },
            { deep: true },
        );

        watch(infoAttribute, () => {
            disableButtonSave.value = !(JSON.stringify(infoAttribute.value) !== JSON.stringify(infoAttributeClone.value))
        }, { deep: true });

        return {
            showModalSync,
            attributeNameError,
            closeModal,
            saveModal,
            infoAttribute,
            infoAttributeClone,
            disableButtonSave,
        }
    }
})
</script>