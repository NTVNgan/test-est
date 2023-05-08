<template>
    <modal-component
        v-model="showModalSync"
        :custom-class="'py-24p'"
        :width="'960px'"
        class="model-import-contact z-999"
    >
        <template v-slot:header>
            <div class="flex">
                <span class="font-medium text-16">{{ $t('contact.contact_import_modal_title') }}</span>
            </div>
        </template>
        <template v-slot:body>
            <div class="px-32p">
                <step-component
                    v-if="currentStep < 3"
                    align="horizontal"
                    type="number"
                    :steps="steps"
                    :currentStepIndex="Number(currentStep)"
                    class="pb-16p border-b border-neutrals-100"
                />
                <keep-alive>
                    <step-upload-file
                        v-if="currentStep === 0"
                        v-model:fileCSV="fileCSV"
                        v-model:errorCSVMsg="errorCSVMsg"
                    />
                </keep-alive>
                <step-attribute-mapping v-if="currentStep === 1" v-model:dataUpload="dataUpload" />
                <step-review
                    v-if="currentStep === 2"
                    :rowQuantity="dataUpload.total"
                    :attrQuantity="getTotalAttrMapping"
                />
                <step-finish v-if="currentStep === 3" />
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex justify-end">
                <button-component
                    v-if="currentStep === 1 || currentStep === 2"
                    class="mr-8p"
                    type="outline"
                    size="medium"
                    @click="onBack(currentStep)"
                >
                    {{ $t('contact.contact_import_modal_button_back') }}
                </button-component>
                <button-component
                    :disabled="checkDisabledButtonNext || loading"
                    size="medium"
                    @click="onSubmit(currentStep)"
                >
                    {{ getModalButtonName }}
                </button-component>
            </div>
        </template>
    </modal-component>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, watch } from 'vue';
import StepUploadFile from './ContactListModalImportContactUploadFile.vue';
import StepAttributeMapping from './ContactListModalImportContactAttributeMapping.vue';
import StepReview from './ContactListModalImportContactReview.vue';
import StepFinish from './ContactListModalImportContactFinish.vue';
import StepComponent from '@/components/ui/StepComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import { useContact } from '@/modules/contact/composables/useContact';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'ContactListModalImportContact',
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        ButtonComponent,
        ModalComponent,
        StepComponent,
        StepUploadFile,
        StepAttributeMapping,
        StepReview,
        StepFinish,
    },
    setup(props, { emit }) {
        const { t } = useI18n();
        const { uploadContact, importContact, error, errorMessage, loading } = useContact();
        const emitter: any = inject('emitter');

        const steps = [
            { label: t('contact.contact_import_modal_step_1') },
            { label: t('contact.contact_import_modal_step_2') },
            { label: t('contact.contact_import_modal_step_3') },
        ];
        const currentStep = ref(0);
        const fileCSV = ref<any>(null);
        const errorCSVMsg = ref<string>('');
        const dataUpload = ref<any>({});
        const dataMapAttr = ref<any>([]);

        const getModalButtonName = computed(() => {
            switch (currentStep.value) {
                case 2:
                    return t('contact.contact_import_modal_button_import');
                case 3:
                    return t('contact.contact_import_modal_button_got_it');
                default:
                    return t('contact.contact_import_modal_button_next');
            }
        });
        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const getListAttrSelected = computed(() => {
            if (!dataUpload.value.data) return null;
            return dataUpload.value.data.map((item: any) => {
                return item.attribute_id;
            });
        });
        const getTotalAttrMapping = computed(() => {
            if (!dataUpload.value.data) return null;
            const listAttr = dataUpload.value.data.filter((item: any) => item.attribute_id !== '');
            return listAttr.length;
        });
        const setDataImport = computed(() => {
            if (!dataUpload.value.data) return null;
            const formData = new FormData();
            const fileUpload = fileCSV.value;
            const dataMap = dataUpload.value.data.map((item: any) => {
                return { column: item.column, attribute_id: item.attribute_id };
            });
            formData.append('file', fileUpload);
            formData.append('maping', JSON.stringify(dataMap));
            formData.append('total', dataUpload.value.total);
            return formData;
        });
        const checkDisabledButtonNext = computed(() => {
            switch (currentStep.value) {
                case 0:
                    return fileCSV.value === null || errorCSVMsg.value !== '';
                case 1:
                    return (
                        !getListAttrSelected.value.includes('full_name') ||
                        !getListAttrSelected.value.includes('email') ||
                        !getListAttrSelected.value.includes('hash_id')
                    );
                default:
                    return false;
            }
        });

        const convertDataRowToColumn = (dataCSV: any) => {
            let dataConvert: any = [];
            dataConvert = dataCSV.header.reduce((arr: any, item: any, index: number) => {
                const comlumnValue: any = [];
                for (let data_i = 0; data_i < dataCSV.data.length; data_i++) {
                    comlumnValue.push(dataCSV.data[data_i].content[index]);
                }
                arr.push({
                    header: item,
                    column: dataCSV.column[index],
                    value: comlumnValue,
                    attribute_id: '',
                });
                return arr;
            }, []);
            return {
                total: dataCSV.total,
                _id: dataCSV._id,
                data: dataConvert,
            };
        };

        const onUploadFile = async () => {
            const data = new FormData();
            const file = fileCSV.value;
            data.append('file', file);
            const res = await uploadContact(data);
            if (!error.value) {
                errorCSVMsg.value = '';
                currentStep.value++;
                dataUpload.value = convertDataRowToColumn(res);
            }
            if (error.value && errorMessage.value && Object.keys(errorMessage.value)[0] === 'column_header_not_empty') {
                errorCSVMsg.value = t('contact.contact_import_modal_upload_file_error_missing_column');
            }
        };
        const onImportFile = async () => {
            await importContact(setDataImport.value);
            if (!error.value) {
                console.log('Done');
                currentStep.value++;
            }
        };
        const closeModal = async () => {
            emit('close');
        };
        const onBack = () => {
            currentStep.value--;
        };
        const onSubmit = (step: number) => {
            switch (step) {
                case 0:
                    onUploadFile();
                    break;
                case 1:
                    currentStep.value++;
                    break;
                case 2:
                    onImportFile();
                    break;
                default:
                    closeModal();
                    break;
            }
        };

        watch(
            () => props.showModal,
            () => {
                emitter.emit('resetImportContact');
                fileCSV.value = null;
                currentStep.value = 0;
            },
        );

        return {
            showModalSync,
            steps,
            currentStep,
            fileCSV,
            errorCSVMsg,
            dataUpload,
            getModalButtonName,
            dataMapAttr,
            getListAttrSelected,
            getTotalAttrMapping,
            checkDisabledButtonNext,
            closeModal,
            onBack,
            onSubmit,
            loading,
            setDataImport,
        };
    },
});
</script>

<style lang="scss" scoped></style>
