<template>
    <div class="h-372 flex flex-col mt-24p">
        <p class="text-14 mb-2p" v-html="$t('contact.contact_import_modal_upload_file_description1')"></p>
        <p class="text-14 mb-2p" v-html="$t('contact.contact_import_modal_upload_file_description2')"></p>
        <p class="text-14">
            {{ $t('contact.contact_import_modal_upload_file_description3') }}
            <button-component type="link">
                <a href="https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes" target="_blank">
                    {{ $t('contact.contact_import_modal_upload_file_button_country_code') }}
                </a>
            </button-component>
            <button-component type="link">
                <a href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes" target="_blank">
                    {{ $t('contact.contact_import_modal_upload_file_button_browser_language_code') }}
                </a>
            </button-component>
        </p>
        <div class="flex-1 flex items-center mt-16p">
            <dropzone-component
                uploadType="file"
                name="files"
                id="csv"
                v-model="fileInfoCSV"
                :infoFile="fileCSVSync"
                :error="errorCSV"
                @onChange="uploadCSV"
                @closeAlert="errorCSV = false"
            >
                <template v-slot:messageError>
                    <p>{{ errorCSVMsgSync }}</p>
                </template>
                <template v-slot:image>
                    <icon-component name="CloudDownloadAlt" color="neutrals-500" />
                </template>
                <template v-slot:button>
                    <span
                        class="font-medium text-14 text-neutrals-900 shadow-innner-button-add rounded py-8p px-16p block"
                        >{{ $t('contact.contact_import_modal_upload_dropzone_button') }}</span
                    >
                </template>
                <template v-slot:text>
                    <p class="text-14 text-neutrals-500 font-medium mb-8p">
                        {{ $t('contact.contact_import_modal_upload_dropzone_title') }}
                    </p>
                    <p
                        class="text-12 text-neutrals-500"
                        v-html="$t('contact.contact_import_modal_upload_dropzone_description')"
                    ></p>
                </template>
            </dropzone-component>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, inject, onMounted, onUnmounted, watch } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import DropzoneComponent from '@/components/ui/DropzoneComponent.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'ContactListModalImportContactUploadFile',
    props: {
        fileCSV: {
            type: [Object, File],
            default: null,
        },
        errorCSVMsg: {
            type: String,
            default: '',
        },
    },
    components: {
        ButtonComponent,
        IconComponent,
        DropzoneComponent,
    },
    setup(props, { emit }) {
        const { t } = useI18n();
        const emitter: any = inject('emitter');

        const errorCSV = ref<boolean>(false);
        const fileInfoCSV = ref<any>();

        const fileCSVSync = computed({
            get(): any {
                return props.fileCSV;
            },
            set(value: any) {
                emit('update:fileCSV', value);
            },
        });
        const errorCSVMsgSync = computed({
            get(): any {
                return props.errorCSVMsg;
            },
            set(value: any) {
                emit('update:errorCSVMsg', value);
            },
        });

        const resetData = () => {
            errorCSVMsgSync.value = '';
            fileCSVSync.value = null;
            fileInfoCSV.value = '';
        };

        const uploadCSV = (file: File) => {
            if (file.name.toLowerCase().lastIndexOf('.csv') === -1 && file.size > 20971520) {
                errorCSVMsgSync.value = t('contact.contact_import_modal_upload_file_error_file_format_and_size');
                return;
            }
            if (file.name.toLowerCase().lastIndexOf('.csv') === -1) {
                errorCSVMsgSync.value = t('contact.contact_import_modal_upload_file_error_file_format');
                return;
            }
            if (file.size > 20971520) {
                errorCSVMsgSync.value = t('contact.contact_import_modal_upload_file_error_file_size');
                return;
            }
            if (file.size === 0) {
                errorCSVMsgSync.value = t('contact.contact_import_modal_upload_file_error_file_size_empty');
                return;
            }
            errorCSVMsgSync.value = '';
            fileCSVSync.value = file;
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (event: any) => {
                fileInfoCSV.value = event.target.result;
            };
        };

        watch(
            () => errorCSVMsgSync.value,
            (newVal: string) => {
                if (newVal !== '') {
                    errorCSV.value = true;
                } else {
                    errorCSV.value = false;
                }
            },
        );
        watch(
            () => fileInfoCSV.value,
            (newVal: string) => {
                if (newVal === '') {
                    fileCSVSync.value = null;
                    errorCSVMsgSync.value = '';
                    errorCSV.value = false;
                }
            },
        );

        onMounted(() => {
            emitter.on('resetImportContact', resetData);
        });

        onUnmounted(() => {
            emitter.off('resetImportContact', resetData);
        });

        return {
            errorCSV,
            fileCSVSync,
            fileInfoCSV,
            errorCSVMsgSync,
            uploadCSV,
        };
    },
});
</script>

<style lang="scss" scoped></style>
