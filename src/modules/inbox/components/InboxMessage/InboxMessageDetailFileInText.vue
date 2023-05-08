<template>
    <div class="msg-files flex">
        <div v-for="(file, key) in fileData" :key="key" class='flex max-w-full'>
            <div v-if="file.error" class="justify-end items-center single inline-flex mt-8p message-file-error">
                <icon-component class="mr-4p" name="File" color="error-6" />
                <span class="truncate text-14 text-error-3">{{ $t('inbox.inbox_message_email_file_error') }}</span>
            </div>
            <div v-else class="justify-end items-center single inline-flex clear-both mt-8p">
                <icon-component class="mr-8p px-4p py-4p bg-primary-50 icon-file" name="File" color="primary-500" />
                <span class="truncate name-file text-14">{{ file.name_no_extension }}</span>
                <span class=" extension-file text-14" :class="truncate ? 'truncate' : ''">.{{ file.file_extension }}</span>
                <a style="display: inherit" @click.prevent="onClickDownloadFile(file)">
                    <icon-component class="ml-8p mr-3p cursor-pointer" name="Download" color="neutrals-900" />
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, inject } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';

export default {
    name: 'InboxMessageDetailFileInText',
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
        truncate: {
            type: Boolean,
            default: true,
        },
    },
    components: {
        IconComponent,
    },
    setup(props: any) {
        const envURL = process.env.VUE_APP_FILE_URL;
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
            onClickDownloadFile,
            envURL,
        };
    },
};
</script>
<style lang="scss" scoped>
.msg-files {
    flex-flow: wrap;
    .icon-file {
        border-radius: 100%;
    }
    .single {
        padding: 7px 8px;
        border: 1px solid #e2ecff;
        border-radius: 12px;
        background-color: #ffffff;
        max-width: 100%;
    }
    .name-file {
        max-width: 246px;
    }
    .extension-file {
        max-width: 35px;
    }

    .message-file-error {
        border: 1px solid #ffe6e6;
    }
}
</style>
