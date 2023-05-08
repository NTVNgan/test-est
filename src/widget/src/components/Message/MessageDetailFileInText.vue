<template>
    <div class="msg-files flex widget">
        <div v-for="(file, key) in fileData" :key="key" class='flex max-w-full'>
            <div v-if="file.error" class="justify-end items-center single inline-flex mt-8p message-file-error">
                <File class='mr-4p error-icon-file' color='error-6' name='File' />
                <span class="truncate text-14 text-error-3">Can’t display this file. Please check your mailbox.</span>
            </div>
            <div v-else class="justify-end items-center single inline-flex clear-both mt-8p">
                <i class='mr-8p bg-primary-50 icon-file' style='height: 28px'>
                    <File class='icon-file px-4p py-4p' color='primary-500' name='File' />
                </i>
                <span class="truncate name-file text-14">{{ file.name_no_extension }}</span>
                <span class="extension-file text-14" :class="truncate ? 'truncate' : ''">.{{ file.file_extension }}</span>
                <a style="display: inherit" @click.prevent="onClickDownloadFile(file)">
                    <Download class='ml-8p mr-3p cursor-pointer icon-download' color='neutrals-900' name='Download' />
                </a>
            </div>
        </div>
    </div>
</template>

<script >
import { computed } from 'vue';
import File from '../icons/File.vue';
import Download from '../icons/Download.vue';
import { useInbox } from '../../composables/useInbox';

export default {
    name: 'MessageDetailFileInText',
    props: {
        files: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {},
        },
        truncate: {
            type: Boolean,
            default: true,
        },
    },
    components: {
        File,
        Download,
    },
    setup(props) {
        // eslint-disable-next-line no-undef
        const envURL = `${__process.env.VUE_APP_FILE_URL}`;
        const { downloadFile } = useInbox();

        const fileData = computed(() => {
            if (props.files.length < 1) return [];
            props.files.forEach((file) => {
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

        const onClickDownloadFile = async (file) => {
            await downloadFile(envURL + '/' + file.src, file.name);
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
.widget.msg-files {
    flex-flow: wrap;
    overflow: hidden;
    
    .max-w-full {
        max-width: 100%;
    }
    & > div {
        margin-right: 1px;
    }
    .icon-file {
        border-radius: 100%;
        fill: #3e6dda;
        box-sizing: initial; 
    }
    .error-icon-file {
        fill: #f29f8f;
    }
    .icon-download {
        fill: #141417;
    }

    .bg-primary-50 {
        --bg-opacity: 1;
        background-color: #e2ecff;
        background-color: rgba(226, 236, 255, var(--bg-opacity));
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .ml-8p {
        margin-left: 8px;
    }

    .mr-3p {
        margin-right: 3px;
    }

    .mr-8p {
        margin-right: 8px;
    }

    .py-4p {
        padding-top: 4px;
        padding-bottom: 4px;
    }

    .px-4p {
        padding-left: 4px;
        padding-right: 4px;
    }
    .single {
        padding: 7px 8px;
        border: 1px solid #e2ecff;
        border-radius: 12px;
        background-color: #ffffff;
        max-width: 100%;
        overflow: hidden;
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

    .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .bg-white {
        --bg-opacity: 1;
        background-color: #fff;
        background-color: rgba(255, 255, 255, var(--bg-opacity));
    }
    
    .items-center {
        align-items: center;
    }

    .inline-flex {
        display: inline-flex;
    }

    .justify-end {
        justify-content: flex-end;
    }
    .text-error-3 {
        color: #ec2b08;
    }
}
</style>
