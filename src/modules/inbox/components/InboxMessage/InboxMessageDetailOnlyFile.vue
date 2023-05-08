<template>
    <div class="msg-files flex justify-end">
        <template v-if="fileData.length === 1">
            <div
                class="justify-end items-center single inline-flex clear-both"
                :class="position !== 'left' ? 'float-right' : ''"
            >
                <icon-component class="mr-8p px-4p py-4p bg-primary-50 icon-file" name="File" color="primary-500" />
                <span class="truncate name-file text-14">{{ fileData[0]['name_no_extension'] }}</span>
                <span class="truncate extension-file text-14">.{{ fileData[0]['file_extension'] }}</span>
                <a style="display: inherit" @click.prevent="onClickDownloadFile(fileData[0])">
                    <icon-component class="ml-8p mr-3p cursor-pointer" name="Download" color="neutrals-900" />
                </a>
            </div>
        </template>
        <template v-else>
            <div class="group clear-both flex" :class="position !== 'left' ? 'float-right' : ''">
                <div v-for="(file, key) in fileData" :key="key" class="inline-flex items-center item-group">
                    <icon-component class="mr-8p px-4p py-4p bg-primary-50 icon-file" name="File" color="primary-500" />
                    <span class="truncate text-14">{{ file.name_no_extension }}</span>
                    <span class="extension-file text-14">.{{ file.file_extension }}</span>
                    <a class="ml-auto" style="display: inherit" @click.prevent="onClickDownloadFile(file)">
                        <icon-component
                            class="ml-auto ml-8p mr-3p cursor-pointer"
                            name="Download"
                            color="neutrals-900"
                        />
                    </a>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { computed, inject } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';

export default {
    name: 'InboxMessageDetailOnlyFile',
    props: {
        files: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {},
        },
        position: {
            type: String,
            default: '',
        },
        is_whisper: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        IconComponent,
    },
    setup(props: any) {
        const envURL = process.env.VUE_APP_FILE_URL;
        const emitter: any = inject('emitter');
        const { downloadFile } = useInboxConversationDetail();

        const fileData = computed(() => {
            if (props.files.length < 1) return [];
            props.files.forEach((file: any) => {
                file.file_extension = '';
                file.name_no_extension = '';
                if (typeof file.name != 'undefined') {
                    const nameArr = file.name.split('.');
                    if (nameArr.length > 1) file.file_extension = nameArr[nameArr.length - 1];
                    const findLastIndex = file.name.lastIndexOf('.');
                    file.name_no_extension = file.name.slice(0, findLastIndex);
                }
            });
            return props.files;
        });

        const clickImage = (image: any) => {
            emitter.emit('onClickImage', image._id);
        };

        const onClickDownloadFile = async (file: any) => {
            const response = await downloadFile(envURL + '/' + file.src);
            const urlCreator = window.URL || window.webkitURL;
            const imageUrl = urlCreator.createObjectURL(response.data);
            const tag = document.createElement('a');
            tag.href = imageUrl;
            tag.download = file.name;
            document.body.appendChild(tag);
            tag.click();
            document.body.removeChild(tag);
        };

        return {
            fileData,
            clickImage,
            envURL,
            onClickDownloadFile,
        };
    },
};
</script>
<style lang="scss" scoped>
.msg-files {
    .icon-file {
        border-radius: 100%;
    }
    .single {
        padding: 7px 8px;
        border: 1px solid #e2ecff;
        border-radius: 12px;
        background-color: #ffffff;
    }
    .name-file {
        max-width: 187px;
    }
    .extension-file {
        max-width: 35px;
    }
    .group {
        width: 296px;
        border: 1px solid #e2ecff;
        border-radius: 20px;
        background-color: #ffffff;
        padding: 10px 16px;
        flex-direction: column;
        overflow: hidden;

        .item-group:not(:last-child) {
            padding-bottom: 8px;
            margin-bottom: 8px;
            border-bottom: 1px solid #e2ecff;
        }
    }
}
</style>
