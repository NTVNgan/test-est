<template>
    <div class="p-16p">
        <div>
            <label>Single</label>
            <drop-zone
                v-model="imageSingle"
                name="handleSingle"
                id="single"
                @onChange="testChange"
                :error="errorImage"
                @closeAlert="errorImage = false"
            >
                <template v-slot:messageError>
                    <p>Failed to upload photo.</p>
                </template>
                <template v-slot:image>
                    <icon-component :name="'CloudDownloadAlt'" color="neutrals-500" />
                </template>
                <template v-slot:button>
                    <span
                        class="font-medium text-14 text-neutrals-900 shadow-innner-button-add rounded py-8p px-16p block"
                        >Add file</span
                    >
                </template>
                <template v-slot:text>
                    <span class="text-14 text-neutrals-500 font-medium block mb-8p">or drop files here to upload</span>
                    <span class="block text-12 text-neutrals-500">Please only upload JPG,PNG or JPEG type</span>
                </template>
            </drop-zone>
        </div>

        <div class="mt-32p">
            <label>Multiple</label>
            <drop-zone
                multiple
                v-model="imageMultiple"
                name="files[]"
                id="multi"
                @onChange="changeMultiple"
                :error="errorImageMulti"
                @closeAlert="errorImageMulti = false"
            >
                <template v-slot:messageError>
                    <p>Failed to upload photo.</p>
                </template>
                <template v-slot:image>
                    <icon-component :name="'CloudDownloadAlt'" color="neutrals-500" />
                </template>
                <template v-slot:button>
                    <span
                        class="font-medium text-14 text-neutrals-900 shadow-innner-button-add rounded py-8p px-16p block"
                        >Add file</span
                    >
                </template>
                <template v-slot:text>
                    <span class="text-14 text-neutrals-500 font-medium block mb-8p">or drop files here to upload</span>
                    <span class="block text-12 text-neutrals-500">Please only upload JPG,PNG or JPEG type</span>
                </template>
            </drop-zone>
        </div>
        <div class="mt-32p">
            <label>Upload file .CSV</label>
            <drop-zone
                v-model="fileCSV"
                name="files"
                uploadType="file"
                :infoFile="fileInfoCSV"
                id="csv"
                @onChange="uploadCSV"
                :error="errorCSV"
                @closeAlert="errorCSV = false"
            >
                <template v-slot:messageError>
                    <p>Failed to upload.</p>
                </template>
                <template v-slot:image>
                    <icon-component :name="'CloudDownloadAlt'" color="neutrals-500" />
                </template>
                <template v-slot:button>
                    <span
                        class="font-medium text-14 text-neutrals-900 shadow-innner-button-add rounded py-8p px-16p block"
                        >Add file</span
                    >
                </template>
                <template v-slot:text>
                    <span class="text-14 text-neutrals-500 font-medium block mb-8p">or drop files here to upload</span>
                    <span class="block text-12 text-neutrals-500">
                        Only <strong>CSV</strong> file with max size of 20MB
                    </span>
                </template>
            </drop-zone>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DropZone from '@/components/ui/DropzoneComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';

interface FileItem {
    name: string;
    type?: string;
    size: number;
}
export default defineComponent({
    name: 'Dropzone',
    components: {
        DropZone,
        IconComponent,
    },
    setup() {
        const imageSingle = ref(),
            errorImage = ref(false),
            imageMultiple = ref([]),
            errorImageMulti = ref(false),
            arrayImage = ref([]);

        const errorCSV = ref<boolean>(false);
        const fileInfoCSV = ref<any>();
        const fileCSV = ref<any>();

        const uploadCSV = (file: File) => {
            if (file.name.toLowerCase().lastIndexOf('.csv') === -1) {
                errorCSV.value = true;
                return;
            } else {
                errorCSV.value = false;
                fileInfoCSV.value = file;
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = (event: any) => {
                    fileCSV.value = event.target.result;
                };
            }
        };

        const testChange = (info: FileItem) => {
            const isJpgOrPng = info.type === 'image/jpeg' || info.type === 'image/png' || info.type === 'image/jpg';
            if (!isJpgOrPng) {
                errorImage.value = true;
                return;
            } else {
                errorImage.value = false;
                const reader = new FileReader();
                reader.onload = e => {
                    // console.log(e.target?.result, 1);
                    imageSingle.value = e.target?.result;
                };
                reader.readAsDataURL(info as any);
            }
        };

        const changeMultiple = (info: FileItem) => {
            const listType = ['image/jpeg', 'image/png', 'image/jpg'];
            const input = info as any;
            // for (let i = 0; i < input.files.length; i++) {
            //     const img = input.files[i]
            //     const type = (img as any).type
            //     if ( listType.indexOf( type ) === -1 ) {
            //         errorImageMulti.value = "Failed to upload photo."
            //         return;
            //     }

            //     const reader = new FileReader();
            //     reader.onload = (e: any) => {
            //         (imageMultiple as any).value.push(e.target.result);
            //     }
            //     reader.readAsDataURL(input.files[i]);
            // }

            Array.from(input.files).forEach((img, index) => {
                const type = (img as any).type;
                if (listType.indexOf(type) === -1) {
                    errorImageMulti.value = true;
                    return;
                }
                (arrayImage as any).value.push(img);
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    (imageMultiple as any).value.push(e.target.result);
                };
                reader.readAsDataURL(input.files[index]);
            });
        };

        return {
            imageSingle,
            errorImage,
            imageMultiple,
            errorImageMulti,
            testChange,
            changeMultiple,
            arrayImage,
            errorCSV,
            uploadCSV,
            fileCSV,
            fileInfoCSV,
        };
    },
});
</script>

<style lang="scss">
.dropzone-component {
    width: 512px;
}
</style>
