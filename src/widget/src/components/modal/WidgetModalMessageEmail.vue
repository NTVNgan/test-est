<template>
    <transition enter-active-class="duration-300" leave-active-class="duration-200">
        <div v-show="visible" id="modalEmailMessage" ref="modalEmailMessage" class="modal-email-message widget">
            <transition
                enter-active-class="duration-300 ease-out opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="duration-200 ease-in"
                leave-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div @click="confirm ? onCloseModal : () => true" v-show="visible" class="modal-email-message__layer">
                    <div class=""></div>
                </div>
            </transition>

            <transition
                enter-active-class="duration-300 ease-out opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="duration-200 ease-in"
                leave-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div v-show="visible" class="modal-email-message__content-wrapper">
                    <div class="modal-email-message__content">
                        <div class="modal-email-message__content-header">
                            <div class="modal-email-message__content-header-title">
                                {{
                                    message.sender_type === constants.SENT_BY.USER ? 'Outgoing email' : 'Incoming email'
                                }}
                            </div>
                            <div
                                class="modal-email-message__content-header-close modal-email-message__button"
                                tabindex="1"
                                @click="onCloseModal"
                            >
                                <Times name="Times" />
                            </div>
                        </div>
                        <div class="modal-email-message__body">
                            <div class="widget-modal-email-info flex text-neutrals-700 px-56p mb-34p">
                                <span class="block text-neutrals-900 mb-4p title-word-break text-14">
                                    <span class="font-medium mr-8p">{{ metaFromName }}</span>
                                    <span>&lt;{{ metaFromEmail }}</span>
                                </span>
                                <span class="block mb-6p text-12 title-word-break">
                                    <span class="truncate mr-8p">To:</span>
                                    <span>{{ message.meta ? message.meta.to : '' }}</span>
                                </span>
                                <transition
                                    enter-active-class="duration-300 ease-out opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="duration-200 ease-in"
                                    leave-class="opacity-100"
                                    leave-to-class="opacity-0"
                                >
                                    <div class="transition-all duration-300 ease-in-out text-12" v-show="showFullInfo">
                                        <span class="block mb-8p title-word-break">
                                            <span class="truncate mr-8p">Reply to:</span>
                                            <span>{{ message.meta ? message.meta.reply_to : '' }}</span>
                                        </span>
                                        <span class="block mb-8p title-word-break">
                                            <span class="truncate mr-8p">Subject:</span>
                                            <span>{{
                                                message.meta
                                                    ? message.meta.subject !== ''
                                                        ? message.meta.subject
                                                        : 'No subject'
                                                    : 'No subject'
                                            }}</span>
                                        </span>
                                        <span class="block mb-8p title-word-break">
                                            <span class="truncate mr-8p">Time:</span>
                                            <span>{{ metaTimeEmail }}</span>
                                        </span>
                                    </div>
                                </transition>
                                <span class="text-primary-500 cursor-pointer text-12" @click="toggleInfo">
                                    {{ !showFullInfo ? 'View more' : 'View less' }}
                                </span>
                            </div>
                            <div class="widget-modal-email-content text-14">
                                <div
                                    class="msg-content text-14"
                                    :class="!checkHasImageOutContent ? 'mb-32p min-h-80p' : ''"
                                    v-html="displayContent"
                                ></div>
                                <div
                                    v-if="
                                        message.type === constants.MESSAGE_TYPE.EMAIL &&
                                            message.images.length > 0 &&
                                            message.sender_type === constants.SENT_BY.USER
                                    "
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
                                <MessageDetailFileInText
                                    v-if="message.files && message.files.length > 0"
                                    class="content-modal-files pt-8p"
                                    :files="message.files"
                                    :truncate="false"
                                ></MessageDetailFileInText>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
import { defineComponent, computed, ref, onMounted, watch } from 'vue';
import Times from '../icons/TimesCustomColor.vue';
import { useInboxComposer } from '../../composables/useInboxComposer';
import constants from '../../constants/constants';
import MessageDetailFileInText from '../Message/MessageDetailFileInText.vue';

export default defineComponent({
    name: 'WidgetModalMessageEmail',
    components: {
        Times,
        MessageDetailFileInText,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        width: {
            type: [String, Number],
            default: '560px',
        },
        customClass: {
            type: String,
            default: 'py-40p',
        },
        closeIcon: {
            type: Boolean,
            default: true,
        },
        confirm: {
            type: Boolean,
            default: false,
        },
        messageData: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {
                content: '',
                format: '',
            },
        },
    },
    emits: ['update:modelValue', 'close'],
    setup(props, { emit }) {
        const { decodeContent } = useInboxComposer();
        const message = ref({
            format: '',
            content: '',
            files: [],
            images: [],
        });
        const showFullInfo = ref(false);
        const onResetData = () => {
            message.value = {
                format: '',
                content: '',
                files: [],
                images: [],
            };
            showFullInfo.value = false;
        };
        // eslint-disable-next-line no-undef
        const envURL = `${__process.env.VUE_APP_FILE_URL}`;

        const visible = computed({
            get: () => props.modelValue,
            set: value => emit('update:modelValue', value),
        });

        const content = computed(() => {
            return decodeContent(message.value.content, 'message');
        });

        const removeEmojis = string => {
            const regex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
            return string.replace(regex, '');
        };

        const isOnlyEmoji = computed(() => {
            if (message.value.format !== 'message') {
                return false;
            }
            const ele = document.createElement('div');
            ele.innerHTML = removeEmojis(content.value);
            return ele.innerText.length === 0;
        });

        const metaFromName = computed(() => {
            if (message.value.meta && message.value.meta.from) {
                const findLastIndex = message.value.meta.from.lastIndexOf('<');
                if (findLastIndex < 0) return message.value.meta.from;
                return message.value.meta.from.slice(0, findLastIndex);
            }
            return '';
        });

        const metaFromEmail = computed(() => {
            if (message.value.meta && message.value.meta.from) {
                const nameArr = message.value.meta.from.split('<');
                if (nameArr.length > 1) return nameArr[nameArr.length - 1];
                return '';
            }
            return '';
        });

        const metaTimeEmail = computed(() => {
            if (message.value.created_at) {
                const timeDate = new Date(message.value.created_at).toUTCString();
                const offset = new Date(message.value.created_at).getTimezoneOffset(),
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
            if (isOnlyEmoji.value) {
                return content.value
                    .replaceAll('&lt;', '<')
                    .replaceAll('&gt;', '>')
                    .replaceAll('img-emoji', `img-emoji img-emoji-only`)
                    .replaceAll('style="', `style=" margin-right:2px; margin-left:2px; margin-top:4px;`);
            } else return content.value.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
        });

        const checkHasImageOutContent = computed(() => {
            if (message.value.images && message.value.images.length > 0) {
                let isCheck = false;
                message.value.images.forEach(image => {
                    if (!image.includeContent) isCheck = true;
                });
                return isCheck;
            }
            return false;
        });

        const toggleInfo = () => {
            showFullInfo.value = !showFullInfo.value;
        };

        const onCloseModal = () => {
            emit('update:modelValue', !visible.value);
            emit('close');
            visible.value = !visible.value;
        };

        onMounted(async () => {
            if (props.messageData) {
                message.value = props.messageData;
                console.log('message.value', message.value);
            }
        });

        watch(
            () => visible,
            () => {
                if (visible.value) {
                    if (props.messageData) {
                        message.value = props.messageData;
                    }
                } else {
                    onResetData();
                }
            },
            { deep: true },
        );

        return {
            visible,
            showFullInfo,
            message,
            displayContent,
            constants,
            onCloseModal,
            toggleInfo,
            metaTimeEmail,
            metaFromEmail,
            metaFromName,
            checkHasImageOutContent,
            envURL,
        };
    },
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.duration {
    &-200 {
        transition-duration: 200ms;
    }

    &-300 {
        transition-duration: 300ms;
    }
}

.ease {
    &-out {
        transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }

    &-in {
        transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
    }
}

.opacity {
    &-0 {
        opacity: 0;
    }

    &-100 {
        opacity: 1;
    }
}

.translate {
    &-y {
        &-0 {
            transform: translateY(0px);
        }

        &-4 {
            transform: translateY(1rem);
        }
    }
}

.modal-email-message {
    max-height: calc(100vh);
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    color: #141417;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;

    .title-word-break {
        word-break: break-word;
    }

    .widget-modal-email-content {
        .msg-content {
            margin-left: 80px;
            margin-right: 80px;
            color: #111111;
            display: block;
        }
        .min-h-80p {
            min-height: 80px;
        }
    }

    &__layer {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition-property: opacity;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;

        & > div {
            position: absolute;
            color: #e9e9ec;
            transition-property: all;
            background: rgba(20, 20, 23, 0.9);
            backdrop-filter: blur(5px);
            width: 100vw;
            height: 100vh;
            opacity: 0.6;
        }
    }

    &__content-wrapper {
        width: 600px;
        margin: 0 auto;
        overflow: hidden;
        background-color: #ffffff;
        position: relative;
        border-radius: 4px;
    }

    &__content {
        padding-top: 8px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        &-header {
            display: flex;
            font-size: 14px;
            line-height: 20px;
            color: #e9e9ec;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e9e9ec;
            padding: 8px 24px 16px 24px;

            &-close {
                border-radius: 4px;
            }

            &-title {
                font-weight: 500;
                font-size: 16px;
                line-height: 24px;
                color: #141417;
            }

            &-time {
                > i {
                    margin-right: 4px;
                }

                display: flex;
                align-items: center;
            }
        }
    }

    &__button {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        svg {
            fill: #828292;
        }
    }

    .modal-email-message__body {
        max-height: 456px;
        margin-bottom: 40px;
        margin-top: 40px;
        overflow-y: auto;

        &::-webkit-scrollbar {
            cursor: pointer;
            width: 16px;
        }

        &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 16px 16px transparent;
            border: solid 4px transparent;
        }

        &::-webkit-scrollbar-thumb {
            box-shadow: inset 0 0 16px 16px #b4b4be;
            border: solid 4px transparent;
            border-radius: 16px;
        }

        .widget-modal-email-info {
            flex-direction: column;
        }
    }

    .px-56p {
        padding-left: 56px;
        padding-right: 56px;
    }

    .pt-40p {
        padding-top: 40px;
    }

    .mb-34p {
        margin-bottom: 34px;
    }

    .mb-8p {
        margin-bottom: 8px;
    }

    .mb-6p {
        margin-bottom: 6px;
    }

    .mb-4p {
        margin-bottom: 4px;
    }
    .mt-8p {
        margin-top: 8px;
    }
    .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .mr-8p {
        margin-right: 8px;
    }

    .px-80p {
        padding-left: 80px;
        padding-right: 80px;
    }
    .mb-32p {
        margin-bottom: 32px;
    }

    .inline-block {
        display: inline-block;
    }

    .block {
        display: block;
    }

    .text-neutrals-900 {
        --text-opacity: 1;
        color: #141417;
        color: rgba(20, 20, 23, var(--text-opacity));
    }

    .text-neutrals-700 {
        --text-opacity: 1;
        color: #3f3f49;
        color: rgba(63, 63, 73, var(--text-opacity));
    }

    .font-medium {
        font-weight: 500;
    }

    .text-primary-500 {
        --text-opacity: 1;
        color: #3e6dda;
        color: rgba(62, 109, 218, var(--text-opacity));
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .text-12 {
        font-size: 12px;
        line-height: 16px;
    }
}
</style>
<style lang="scss">
.widget.modal-email-message {
    img {
        max-width: 100%;
        height: auto;
    }

    .mb-8p {
        margin-bottom: 8px;
    }

    .mt-8p {
        margin-top: 8px;
    }

    .msg-content {
        width: calc(100% - 160px);
        word-break: break-word;
        .gmail_quote {
            display: none;
        }
        img {
            max-width: 100%;
            height: auto;
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

    .pt-8p {
        padding-top: 8px;
    }
}

.widget.modal-email-message .content-modal-files {
    border-top: 1px dashed #b4b4be;
    margin-left: 56px;
    margin-right: 56px;
}
.widget.content-modal-files.msg-files .name-file {
    max-width: inherit;
}

.widget.content-modal-files.msg-files .extension-file {
    max-width: inherit;
}

.widget.modal-email-message .msg-content .gmail_signature > div > table > tbody > tr > td {
    padding-left: 0 !important;
    display: block;
    clear: both;
    width: 100%;
}

.widget.modal-email-message .msg-content .gmail_signature > div > table > tbody > tr > td > table > tbody > tr > td {
    width: 50%;
}
</style>
