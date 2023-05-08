<template>
    <div class="modal-email-message">
        <modal-component
            v-model="showModalSync"
            :custom-class="
                'body-modal-email-message overflow-hidden scrollbar--transparent overflow-y-auto mb-40p pb-0p'
            "
            :width="'600px'"
            class="z-999"
            :max-height="'456px'"
        >
            <template v-slot:header>
                <div class="flex">
                    <span class="font-medium text-16 ml-4p">
                        {{
                            message.sender_type === CONSTANTS.SENT_BY.CUSTOMER
                                ? $t('inbox.inbox_message_email_incoming')
                                : $t('inbox.inbox_message_email_outcoming')
                        }}
                    </span>
                </div>
            </template>
            <template v-slot:body>
                <div class="email-info flex text-neutrals-700 px-56p mb-34p">
                    <span class="block text-neutrals-900 mb-4p text-14 overflow-x-hidden title-word-break">
                        <span class="font-medium mr-8p">{{ metaFromName }}</span>
                        <span>&lt;{{ metaFromEmail }}</span>
                    </span>
                    <span class="block mb-6p text-12 overflow-x-hidden title-word-break">
                        <span class="truncate mr-8p">To:</span>
                        <span>{{ message.meta ? message.meta.to : '' }}</span>
                    </span>
                    <transition name="toggle-content">
                        <div class="transition-all duration-300 ease-in-out text-12" v-if="showFullInfo">
                            <span class="block mb-8p overflow-x-hidden title-word-break">
                                <span class="truncate mr-8p">Reply to:</span>
                                <span>{{ message.meta ? message.meta.reply_to : '' }}</span>
                            </span>
                            <span class="block mb-8p overflow-x-hidden title-word-break">
                                <span class="truncate mr-8p">Subject:</span>
                                <span>{{
                                    message.meta
                                        ? message.meta.subject !== ''
                                            ? message.meta.subject
                                            : 'No subject'
                                        : 'No subject'
                                }}</span>
                            </span>
                            <span class="block mb-8p overflow-x-hidden title-word-break">
                                <span class="truncate mr-8p">Time:</span>
                                <span>{{ metaTimeEmail }}</span>
                            </span>
                        </div>
                    </transition>
                    <span class="text-primary-500 cursor-pointer text-12" @click="toggleInfo">
                        {{ !showFullInfo ? 'View more' : 'View less' }}
                    </span>
                </div>
                <div class="email-content text-14">
                    <div
                        class="msg-content block px-80p"
                        :class="!checkHasImageOutContent ? 'pb-32p min-h-112' : ''"
                        v-html="displayContent"
                    ></div>
                    <div
                        v-if="message.type === CONSTANTS.MESSAGE_TYPE.EMAIL && message.images.length > 0 && message.sender_type === CONSTANTS.SENT_BY.USER"
                        :class="checkHasImageOutContent ? 'mb-32p px-80p' : ''"
                    >
                        <div v-for="(image, key) in message.images" :key="key">
                            <img
                                v-if="!image.includeContent"
                                class="object-cover w-inherit multi cursor-pointer"
                                :src="envURL + '/' + image.src"
                                alt=""
                            />
                        </div>
                    </div>
                    <InboxMessageDetailFileInText
                        v-if="message.files && message.files.length > 0"
                        class="content-modal-files pt-8p"
                        :files="message.files"
                        :truncate="false"
                    ></InboxMessageDetailFileInText>
                </div>
            </template>
        </modal-component>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import ModalComponent from '@/components/ui/ModalComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import InboxMessageDetailFileInText from '../InboxMessageDetailFileInText.vue';
import { useInboxComposer } from '@/modules/inbox/composables/useInboxComposer';
import CONSTANTS from '../../../constants/constants';

export default defineComponent({
    name: 'MessageModalEmail',
    components: {
        ModalComponent,
        // ButtonComponent,
        InboxMessageDetailFileInText,
    },
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        message: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {
                content: '',
                images: [],
            },
        },
    },
    setup(props, { emit }) {
        const { decodeContent } = useInboxComposer();
        const showFullInfo = ref<boolean>(false);
        const envURL = process.env.VUE_APP_FILE_URL;

        const showModalSync = computed({
            get(): boolean {
                return props.showModal;
            },
            set(value: boolean) {
                emit('update:showModal', value);
            },
        });

        const content = computed(() => {
            return decodeContent(props.message.content, 'message');
        });

        const metaFromName = computed(() => {
            if (props.message.meta && props.message.meta.from) {
                const findLastIndex = props.message.meta.from.lastIndexOf('<');
                if (findLastIndex < 0) return props.message.meta.from;
                return props.message.meta.from.slice(0, findLastIndex);
            }
            return '';
        });

        const metaFromEmail = computed(() => {
            if (props.message.meta && props.message.meta.from) {
                const nameArr = props.message.meta.from.split('<');
                if (nameArr.length > 1) return nameArr[nameArr.length - 1];
                return '';
            }
            return '';
        });

        const metaTimeEmail = computed(() => {
            if (props.message.created_at) {
                const timeDate = new Date(props.message.created_at).toUTCString();
                const offset = new Date(props.message.created_at).getTimezoneOffset(),
                    o = Math.abs(offset);
                const timeZone =
                    (offset < 0 ? '+' : '-') +
                    ('00' + Math.floor(o / 60)).slice(-2) +
                    ':' +
                    ('00' + (o % 60)).slice(-2);
                return timeDate.slice(0, -3) + ' (UTC' + timeZone + ')';
            }
            return '';
        });

        const displayContent = computed(() => {
            const result = content.value.replaceAll('img-emoji', `img-emoji transform -translate-y-px`);
            return result.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
        });

        const checkHasImageOutContent = computed(() => {
            if (typeof props.message.images !== 'undefined' && props.message.images.length > 0) {
                let isCheck = false;
                props.message.images.forEach((image: any) => {
                    if (!image.includeContent) isCheck = true;
                });
                return isCheck;
            }
            return false;
        });

        const toggleInfo = () => {
            showFullInfo.value = !showFullInfo.value;
        };

        watch(
            () => showModalSync,
            () => {
                showFullInfo.value = false;
            },
            { deep: true },
        );

        return {
            toggleInfo,
            checkHasImageOutContent,
            showModalSync,
            showFullInfo,
            displayContent,
            CONSTANTS,
            metaFromName,
            metaFromEmail,
            metaTimeEmail,
            envURL,
        };
    },
});
</script>
<style lang="scss" scoped>
.modal-email-message {
    :deep(.body-modal-email-message) {
        padding-bottom: 0;
        margin-top: 40px;

        .content-modal-files {
            border-top: 1px dashed #b4b4be;
            margin-left: 56px;
            margin-right: 56px;
        }
    }

    .email-info {
        flex-direction: column;
    }

    .title-word-break {
        word-break: break-word;
    }
}
</style>
<style lang="scss">
.modal-email-message {
    .msg-content {
        width: 100%;
        word-break: break-word;

        .gmail_quote {
            display: none;
        }

        ol {
            display: block;
            list-style-type: decimal;
            margin-block-start: 1em;
            margin-block-end: 1em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            padding-inline-start: 40px;
        }

        ul {
            display: block;
            list-style-type: disc;
            margin-block-start: 1em;
            margin-block-end: 1em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            padding-inline-start: 40px;
        }
        
    }
}

.content-modal-files.msg-files > div {
    margin-right: 1px;
}
.content-modal-files.msg-files .name-file {
    max-width: inherit;
}
.content-modal-files.msg-files .extension-file {
    max-width: inherit;
}
</style>
