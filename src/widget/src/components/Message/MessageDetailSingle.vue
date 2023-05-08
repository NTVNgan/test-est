<template>
    <div
        class="box-message-single"
        :class="[position, type]"
        :style="[
            {
                marginBottom: marginBottom + 'px',
            },
        ]"
    >
        <div class="box-avatar-single">
            <avatar-component
                v-if="showAvatar"
                :labelShow="false"
                size="small"
                :label-avatar="messageUpdate.username"
                :image="messageUpdate.avatar_src"
                :bgAvatar="messageUpdate.avatar_bg"
                :online="3"
                :userRemoved="messageUpdate.user_removed"
                class="avatar-message"
            />
        </div>
        <div
            class="box-content-message"
            :class="
                message.type === constants.MESSAGE_TYPE.IMAGE || message.type === constants.MESSAGE_TYPE.FILE
                    ? message.images.length > 1
                        ? 'h-76'
                        : 'm-h-304'
                    : ''
            "
        >
            <tooltip-component
                :position="'left'"
                :position-left-or-right="position"
                type="dark"
                :content="message.created_at.toString()"
                :showInListMessage="true"
                :showTime="true"
                :scroll="scroll"
                :timeout="400"
            >
                <div v-if="message.status === constants.STATUS.DELETED">
                    <div
                        class="content-message-single message-deleted px-16p py-10p"
                        :style="[
                            {
                                borderRadius: borderRadius,
                            },
                        ]"
                    >
                        <div class="msg-content" v-html="message.logDeleted"></div>
                    </div>
                </div>
                <template v-else>
                    <div
                        v-if="
                            message.type !== constants.MESSAGE_TYPE.IMAGE &&
                            message.type !== constants.MESSAGE_TYPE.FILE
                        "
                        class="content-message-single"
                        :class="{
                            'content-message-single__emoji-only': isOnlyEmoji,
                        }"
                        :style="[
                            {
                                background: background,
                                color: textColor,
                                borderRadius: borderRadius,
                            },
                        ]"
                    >
                        <div
                            v-if="message.type === constants.MESSAGE_TYPE.EMAIL"
                            class="flex email-icon items-center mb-8p text-16"
                        >
                            <tooltip-component
                                :position="'top'"
                                type="dark"
                                :content="position === 'right' ? 'Ingoing email' : 'Outgoing email'"
                                :showInListMessage="true"
                                :scroll="scroll"
                                :timeout="400"
                            >
                                <span
                                    @click="clickEmailMessage"
                                    class="flex items-center cursor-pointer icon-email-message mr-10p"
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                                            :stroke="position === 'right' ? '#ffffff' : '#7194E4'"
                                            stroke-width="1.3"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M22 6L12 13L2 6"
                                            :stroke="position === 'right' ? '#ffffff' : '#7194E4'"
                                            stroke-width="1.3"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </span>
                            </tooltip-component>
                            <span class="text-14 font-medium title-subject">
                                {{ message.meta && message.meta.subject ? message.meta.subject : 'No subject' }}
                            </span>
                        </div>
                        <div class="msg-email-input" v-if="message.email">
                            <span> Your email </span>
                            <span>
                                {{ message.email }}
                            </span>
                        </div>
                        <div
                            class="msg-content"
                            :class="message.email ? 'msg-content--email-input' : ''"
                            @click="clickMessage"
                            v-html="displayContent"
                        ></div>
                        <template
                            v-if="
                                message.type === constants.MESSAGE_TYPE.EMAIL &&
                                message.images.length > 0 &&
                                message.sender_type === constants.SENT_BY.USER
                            "
                        >
                            <div v-for="(image, key) in message.images" :key="key">
                                <img
                                    v-if="!image.includeContent"
                                    @click="clickImage(image)"
                                    class="object-cover w-inherit multi cursor-pointer"
                                    :src="envURL + '/' + image.src"
                                    alt=""
                                />
                            </div>
                        </template>
                    </div>
                    <div v-else-if="!isDemoMode" class="content-message-image h-full image">
                        <MessageDetailSingleOnlyImage
                            :position="position"
                            :images="message.images"
                        ></MessageDetailSingleOnlyImage>
                    </div>
                </template>
            </tooltip-component>
        </div>
    </div>
</template>

<script>
import TooltipComponent from '../WidgetTooltipMessage.vue';
import { computed, toRefs, inject } from 'vue';
import AvatarComponent from '../WidgetAvatar';
import filters from '../../utils/filters';
import { useInbox } from '../../composables/useInbox';
import { useInboxComposer } from '../../composables/useInboxComposer';
import MessageDetailSingleOnlyImage from './MessageDetailSingleOnlyImage.vue';
import constants from '../../constants/constants';

export default {
    name: 'MessageDetailSingle',
    props: {
        message: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {},
        },
        position: {
            type: String,
            default: 'left',
        },
        background: {
            type: String,
            default: '#f6f6f8',
        },
        textColor: {
            type: String,
            default: '#141417',
        },
        marginBottom: {
            type: String,
            default: '24',
        },
        showAvatar: {
            type: Boolean,
            default: false,
        },
        borderRadius: {
            type: String,
            default: '20px',
        },
        type: {
            type: String,
            default: 'single',
        },
        scroll: {
            type: Number,
            default: 0,
        },
    },
    components: {
        TooltipComponent,
        AvatarComponent,
        MessageDetailSingleOnlyImage,
    },
    setup(props) {
        const { message } = toRefs(props);
        const { updateInfoUserInMessage } = useInbox();
        const { decodeContent } = useInboxComposer();
        const onOpenImageGallery = inject('onOpenImageGallery');
        const onOpenModalMessageEmail = inject('onOpenModalMessageEmail');
        const isDemoMode = inject('isDemoMode');
        let envURL;

        if (!isDemoMode) {
            // eslint-disable-next-line no-undef
            envURL = `${__process.env.VUE_APP_FILE_URL}`;
        }

        const content = computed(() => {
            return decodeContent(message.value.content, 'message');
        });

        const removeEmojis = (string) => {
            const regex =
                /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
            return string.replace(regex, '');
        };

        const isOnlyEmoji = computed(() => {
            if (message.value.format !== 'message' || message.value.type === constants.MESSAGE_TYPE.EMAIL) {
                return false;
            }
            const ele = document.createElement('div');
            ele.innerHTML = removeEmojis(content.value);
            return ele.innerText.length === 0;
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

        const messageUpdate = computed(() => {
            return updateInfoUserInMessage(message.value);
        });

        const clickMessage = (e) => {
            if (e.target.matches('img')) {
                const imageId = e.target.getAttribute('data-img-id');
                console.log('imageId', imageId);
                onOpenImageGallery(imageId);
            }
        };

        const clickImage = (image) => {
            onOpenImageGallery(image._id);
        };

        const clickEmailMessage = () => {
            onOpenModalMessageEmail(props.message);
        };

        return {
            content,
            filters,
            messageUpdate,
            displayContent,
            clickMessage,
            clickEmailMessage,
            isOnlyEmoji,
            constants,
            envURL,
            clickImage,
            isDemoMode,
        };
    },
};
</script>
<style lang="scss" scoped>
.h-full {
    height: 100%;
}
.box-message-single :deep(.tooltip-component) {
    width: auto;
}
.avatar-message :deep(.avatar-content) {
    bottom: 4px;
    img {
        height: 30px;
    }
}

.box-message-single.right {
    text-align: right;
}
.box-message-single.single {
    display: flex;

    .box-content-message {
        //width: calc(100% - 40px);
        width: 100%;
    }
}
.h-76 {
    height: 76px;
}
.m-h-304 {
    max-height: 304px;
}
.box-message-single {
    font-size: 14px;
    line-height: 20px;
    clear: both;
    float: none !important;

    .email-icon {
        :deep(.tooltip-component) {
            display: flex;
        }
    }

    .message-deleted {
        border: 1px solid #b4b4be;
        color: #6b6b7b;
        padding: 9px 16px !important;
    }

    .box-content-message {
        display: grid;
        max-width: 236px;
    }

    .tooltip-component {
        display: inline-block;
    }

    .inline-block {
        display: inline-block;
    }

    &.right {
        display: flex;
        margin: 0 0 0 auto;
        justify-content: end;
    }

    .content-message-single {
        padding: 10px 16px;
        display: inline-block;
        text-align: left;
        &__emoji-only {
            line-height: 40px;
            font-size: 32px;
            background: none !important;
            padding: 0px !important;
            color: unset !important;
        }
    }

    .box-avatar-single {
        width: 40px;
        align-self: flex-end;

        .avatar-message {
            margin-right: 8px;
            display: inline-block;
            vertical-align: bottom;
        }
    }
    .msg-content {
        word-break: break-word;
        max-width: 204px;
        overflow: hidden;

        &--email-input {
            width: 204px;
        }

        :deep(.composer-contenteditable__overlay) {
            display: none;
        }

        :deep(.composer-contenteditable__image) {
            .composer-contenteditable__btn-delete {
                display: none;
            }
            img {
                cursor: pointer;
                max-width: 100%;
            }
        }

        :deep(div) {
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
}
.img-emoji-only {
    width: 40px;
    height: 40px;
    margin-right: 2px;
    margin-left: 2px;
    margin-top: 4px;
}
</style>
<style lang="scss">
.linebase-widget {
    .box-message-single .tooltip-component .d-block {
        display: inline-block;
    }

    .box-message-single img {
        max-width: 100%;
        height: auto;
    }

    .msg-content .gmail_quote {
        display: none;
    }

    .flex {
        display: flex;
    }

    .items-center {
        align-items: center;
    }

    .mr-10p {
        margin-right: 10px;
    }

    .mb-8p {
        margin-bottom: 8px;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .text-14 {
        font-size: 14px;
        line-height: 20px;
    }

    .msg-content {
        .mb-8p {
            margin-bottom: 8px;
        }

        .mt-8p {
            margin-top: 8px;
        }
    }

    .title-subject {
        word-break: break-word;
        font-weight: 500;
    }

    .box-message-single .msg-content .gmail_signature > div > table > tbody > tr > td,
    .box-message-single .msg-content .gmail_signature > div > table > tbody > tr > td > table > tbody > tr > td {
        padding-left: 0 !important;
        display: block;
        clear: both;
        width: 100%;
    }

    .msg-content .gmail_signature td {
        border: initial;
        padding: 0;
    }

    .msg-email-input {
        display: flex;
        flex-direction: column;
        background-color: #5e85e0;
        border-radius: 12px;
        margin-bottom: 10px;
        padding: 8px;
        span:nth-child(1) {
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            color: #bfcef3;
        }
        span:nth-child(2) {
            font-weight: 500;
            font-size: 12px;
            line-height: 16px;
            color: #e2ecff;
        }
    }
}
</style>
