<template>
    <div
        class="box-message-single flex items-center justify-end"
        :class="[position, type, position === 'right' ? '' : 'flex-row-reverse']"
        @mouseenter="hoverMessage()"
        @mouseleave="hideTool"
        :style="[
            {
                marginBottom: marginBottom + 'px',
            },
        ]"
    >
        <MessageSingleTool :hoverActive='hoverActive' :message='message' @clickDeleteMessage='clickDeleteMessage' @clickTagMessage='clickTagMessage'></MessageSingleTool>
        <div class="box-tooltip-message inline-block">
            <tooltip-component
                :position="position"
                type="dark"
                :content="message.created_at.toString()"
                :showInListMessage="true"
                :showTime="true"
                :classCustom="'inline-block'"
                :borderRadius="'20px'"
            >
                <div v-if="message.status === CONSTANTS.STATUS.DELETED">
                    <div
                        class="content-message-single inline-block message-deleted px-16p"
                        :class="message.is_whisper ? 'text-warning-2' : 'text-neutrals-500'"
                        :style="[
                            {
                                borderRadius: message.is_whisper ? '4px' : borderRadius,
                                border: message.is_whisper ? '1px solid #8B6500' : '1px solid #9B9BA8',
                            },
                        ]"
                    >
                        <div class="msg-content message inline-block" v-html="message.logDeleted"></div>
                    </div>
                </div>
                <template v-else>
                    <div
                        v-if="
                            message.type === CONSTANTS.MESSAGE_TYPE.IMAGE ||
                                message.type === CONSTANTS.MESSAGE_TYPE.FILE
                        "
                        class="content-message-single inline-block h-full image"
                    >
                        <InboxMessageDetailSingleOnlyImage
                            v-if="message.images.length > 0"
                            :position="position"
                            :images="message.images"
                            :is_whisper="message.is_whisper"
                            :class="
                                message.type === CONSTANTS.MESSAGE_TYPE.IMAGE ||
                                message.type === CONSTANTS.MESSAGE_TYPE.FILE
                                    ? message.images.length > 1
                                        ? message.is_whisper
                                            ? 'h-132'
                                            : 'h-120'
                                        : 'm-h-360'
                                    : ''
                            "
                        ></InboxMessageDetailSingleOnlyImage>
                        <InboxMessageDetailOnlyFile
                            v-if="!message.is_whisper && message.files.length > 0"
                            :position="position"
                            :files="message.files"
                            :is_whisper="message.is_whisper"
                            :class="message.images.length > 0 ? 'mt-2p' : ''"
                        ></InboxMessageDetailOnlyFile>
                    </div>
                    <div
                        v-else
                        class="content-message-single inline-block"
                        :class="{
                            'content-message-single__emoji-only p-0 text-black': isOnlyEmoji,
                            'px-16p py-10p': !isOnlyEmoji,
                            [background]: true,
                            'bg-warning-5 mgs-note': message.is_whisper,
                            [textColor]: true,
                        }"
                        :style="[
                            {
                                borderRadius: message.is_whisper ? '4px' : borderRadius,
                            },
                        ]"
                    >
                        <div
                            v-if="message.type === CONSTANTS.MESSAGE_TYPE.EMAIL"
                            class="flex items-center pb-10p text-14"
                        >
                            <tooltip-component
                                class="inline-block mr-10p "
                                type="dark"
                                position="top"
                                :content="
                                    position === 'right'
                                        ? $t('inbox.inbox_message_email_outcoming')
                                        : $t('inbox.inbox_message_email_incoming')
                                "
                                label="Tooltip"
                            >
                                <span
                                    @click="clickEmailMessage"
                                    class="flex items-center cursor-pointer icon-email-message"
                                >
                                    <icon-component name="Email" color="primary-50" />
                                </span>
                            </tooltip-component>
                            <span class="text-14 font-medium title-subject">
                                {{ message.meta && message.meta.subject ? message.meta.subject : 'No subject' }}
                            </span>
                        </div>
                        <div
                            class="msg-content message inline-block"
                            v-html="displayContent"
                            @click="clickMessage"
                            :class="{
                                'text-right': message.sender_type !== CUSTOMER && isOnlyEmoji,
                                'text-left': message.sender_type === CUSTOMER && isOnlyEmoji,
                                'bg-warning-5 emoji-note py-6p px-4p': message.is_whisper && isOnlyEmoji,
                            }"
                            :style="[
                                {
                                    borderRadius: message.is_whisper ? '4px' : borderRadius,
                                },
                            ]"
                        ></div>
                        <template v-if="message.type === CONSTANTS.MESSAGE_TYPE.EMAIL && message.images.length > 0 && message.sender_type === CONSTANTS.SENT_BY.USER">
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
                        <InboxMessageDetailFileInText
                            v-if="!message.is_whisper && message.files.length > 0"
                            :position="position"
                            :files="message.files"
                            :is_whisper="message.is_whisper"
                        ></InboxMessageDetailFileInText>
                        <div
                            class="block list-tag-message-type-text"
                            v-if="
                                message.type === CONSTANTS.MESSAGE_TYPE.TEXT && !isOnlyEmoji && tagWidthName.length > 0
                            "
                        >
                            <div
                                v-for="(tag, keyTag) in tagWidthName"
                                class="inline-block mt-8p mr-4p max-w-full"
                                :key="keyTag"
                            >
                                <Tag
                                    icon="tag-solid-10"
                                    :isClose="true"
                                    :classCustom="'text-neutrals-900 w-100% max-w-full bg-white max-h-24'"
                                    @close="onClickRemoveTag(tag)"
                                >
                                    <tooltip-component
                                        class="max-w-full"
                                        type="light"
                                        position="top"
                                        :content="tag.name"
                                        showByTruncate
                                    >
                                        <span class="truncate block">{{ tag.name }}</span>
                                    </tooltip-component>
                                </Tag>
                            </div>
                        </div>
                    </div>
                    <div class="block" v-if="showTag">
                        <div class="list-tag-message">
                            <div
                                v-for="(tag, keyTag) in tagWidthName"
                                class="inline-block mt-8p mr-4p max-w-full"
                                :key="keyTag"
                            >
                                <Tag
                                    icon="tag-solid-10"
                                    :isClose="true"
                                    :classCustom="'text-neutrals-900 w-100% max-w-full bg-white'"
                                    @close="onClickRemoveTag(tag)"
                                >
                                    <tooltip-component
                                        class="max-w-full"
                                        type="light"
                                        position="top"
                                        :content="tag.name"
                                        showByTruncate
                                    >
                                        <span class="truncate block">{{ tag.name }}</span>
                                    </tooltip-component>
                                </Tag>
                            </div>
                        </div>
                    </div>
                </template>
            </tooltip-component>
        </div>
        <div v-if="showAvatar" class="box-avatar-single">
            <avatar-component
                v-if="showAvatar"
                :labelShow="false"
                size="small"
                :label-avatar="message.username"
                :image="message.avatar_src"
                :bgAvatar="message.avatar_bg"
                :online="3"
                :userRemoved="message.user_removed"
                class="avatar-message"
            />
        </div>
    </div>
</template>

<script lang="ts">
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import { computed, toRefs, watch, inject, ref } from 'vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';
import { useInboxComposer } from '../../composables/useInboxComposer';
import CONSTANTS from '../../constants/constants';
import InboxMessageDetailSingleOnlyImage from './InboxMessageDetailSingleOnlyImage.vue';
import InboxMessageDetailOnlyFile from './InboxMessageDetailOnlyFile.vue';
import InboxMessageDetailFileInText from './InboxMessageDetailFileInText.vue';
const { CUSTOMER } = CONSTANTS.SENT_BY;
import IconComponent from '@/components/ui/IconComponent.vue';
import Tag from '@/components/ui/TagComponent.vue';
import { useInboxTag } from '@/modules/inbox/composables/useInboxTag';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';
import MessageSingleTool from '@/modules/inbox/components/InboxMessage/InboxMessageDetailSingle/MessageSingleTool.vue';

export default {
    name: 'InboxMessageDetailSingle',
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
    },
    components: {
        TooltipComponent,
        AvatarComponent,
        InboxMessageDetailSingleOnlyImage,
        InboxMessageDetailOnlyFile,
        InboxMessageDetailFileInText,
        IconComponent,
        Tag,
        MessageSingleTool,
    },
    setup(props: any) {
        const { updateTagOfMessage, conversationDetail } = useInboxConversationDetail();
        const { allTag, handleTagOfMessage } = useInboxTag();
        const { message } = toRefs(props);
        const { decodeContent } = useInboxComposer();
        const emitter: any = inject('emitter');
        const hoverActive = ref<boolean>(false);
        const envURL = process.env.VUE_APP_FILE_URL;

        const removeEmojis = (string: string) => {
            const regex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
            return string.replace(regex, '');
        };

        const tagWidthName = computed(() => {
            if (props.message.tags && props.message.tags.length > 0) {
                const res: any[] = [];
                props.message.tags.forEach((tagSelect: any) => {
                    const findIndex = allTag.value.findIndex((tag: any) => tag.id === tagSelect);
                    if (findIndex > -1) res.push(allTag.value[findIndex]);
                });
                return res;
            }
            return [];
        });

        const content = computed(() => {
            return decodeContent(message.value.content, 'message');
        });
        const isOnlyEmoji = computed(() => {
            if (message.value.format !== 'message' || message.value.type === CONSTANTS.MESSAGE_TYPE.EMAIL) {
                return false;
            }
            if (message.value.files && message.value.files.length > 0) return false;
            const ele = document.createElement('div');
            ele.innerHTML = removeEmojis(content.value);
            return removeEmojis(content.value).length === 0;
        });

        const showTag = computed(() => {
            if (tagWidthName.value.length < 1) return false;
            if (props.message.type === CONSTANTS.MESSAGE_TYPE.TEXT && isOnlyEmoji.value) return true;
            return (
                (props.message.type === CONSTANTS.MESSAGE_TYPE.IMAGE ||
                    props.message.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                props.message.files.length > 0
            );
        });

        const checkShowTagBtn = computed(() => {
            if (props.message.type === CONSTANTS.MESSAGE_TYPE.EMAIL) return false;
            return !(
                (props.message.type === CONSTANTS.MESSAGE_TYPE.IMAGE ||
                    props.message.type === CONSTANTS.MESSAGE_TYPE.FILE) &&
                props.message.images.length > 0
            );
        });

        const displayContent = computed(() => {
            const result = isOnlyEmoji.value
                ? content.value.replaceAll('img-emoji', `img-emoji img-emoji-only w-40 h-40 m-2p`)
                : content.value.replaceAll('img-emoji', `img-emoji transform -translate-y-px`);
            return result.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
        });

        const clickMessage = (e: any) => {
            if (e.target.matches('img')) {
                const imageId = e.target.getAttribute('data-img-id');
                console.log('image-Id-1', imageId);
                emitter.emit('onClickImage', imageId);
            }
        };

        const hoverMessage = () => {
            hoverActive.value = true;
        };

        const hideTool = () => {
            hoverActive.value = false;
        };

        const clickDeleteMessage = () => {
            emitter.emit('onClickDeleteMessage', props.message);
        };

        const clickTagMessage = () => {
            emitter.emit('onClickTagMessage', props.message);
        };

        const clickEmailMessage = () => {
            emitter.emit('onClickEmailMessage', props.message);
        };

        const onClickRemoveTag = async (clickTag: any) => {
            const data = {
                tags: [clickTag.id],
                mode: 'remove',
            };
            const res = await handleTagOfMessage(data, props.message._id);
            if (!res.error) {
                await updateTagOfMessage(res.data.tags, props.message._id);

                if (data.tags.length > 0) {
                    data.tags.forEach((tag: any) => {
                        const findIndex = conversationDetail.value.tags.findIndex((t: any) => t === tag);
                        if (findIndex > -1) conversationDetail.value.tags.splice(findIndex, 1);
                    });
                }
            } else {
                console.log('res', res);
            }
        };

        const clickImage = (image: any) => {
            emitter.emit('onClickImage', image._id);
        };

        return {
            content,
            isOnlyEmoji,
            displayContent,
            CUSTOMER,
            test: removeEmojis(content.value) === '',
            clickMessage,
            CONSTANTS,
            hoverMessage,
            hideTool,
            hoverActive,
            clickDeleteMessage,
            clickTagMessage,
            clickEmailMessage,
            onClickRemoveTag,
            tagWidthName,
            showTag,
            checkShowTagBtn,
            envURL,
            clickImage,
        };
    },
};
</script>
<style lang="scss" scoped>
.box-message-single :deep(.tooltip-component) {
    width: auto;
}
.avatar-message {
    overflow: initial;
    :deep(.avatar-content) {
        bottom: 4px;
    }
}
.box-message-single.right {
    text-align: right;
}
.box-message-single.single {
    display: flex;

    .box-tooltip-message {
        width: auto;
    }
}
.box-tooltip-message :deep(.inline-block) {
    display: inline-block;
}
.m-h-360 {
    max-height: 360px;
}
.box-message-single {
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;

    .icon-email-message {
        :deep(svg) {
            color: #fff0;
        }

        :deep(.icon-error) {
            path {
                stroke: #f29f8f;
            }
        }
    }

    .list-tag-message {
        max-width: 392px;
        background: #e2ecff;
        border-radius: 20px;
        padding: 2px 12px 10px 16px;
        text-align: left;
        margin-top: -10px;
        display: inline-block;
    }

    .message-deleted {
        padding-top: 9px;
        padding-bottom: 9px;
    }

    .tool-message {
        span {
            border-radius: 4px;
        }
    }

    .mgs-note {
        border: 1px solid #ffd466;
    }

    .tooltip-component {
        display: inline-block;
    }

    .content-message-single {
        max-width: 392px;
        text-align: left;

        .msg-content {
            max-width: 360px;
        }
        &__emoji-only {
            background: none !important;
            font-size: 32px;
            line-height: 40px;
            .msg-content {
                background: white !important;
                & > .img-emoji {
                    width: 40px !important;
                    height: 40px !important;
                }
            }
            .msg-content.emoji-note {
                background-color: #fff6d6 !important;
            }
        }
    }

    &.left.group {
        .content-message-single.image {
            display: block;
            flex-direction: column;
        }
    }
    &.right.group {
        .content-message-single.image {
            display: flex;
            margin: 0 0 0 auto;
            justify-content: end;
            flex-direction: column;
        }
    }

    .box-avatar-single {
        width: 40px;
        align-self: flex-end;
        .avatar-message {
            margin-left: 8px;
            display: inline-block;
            vertical-align: bottom;
            &::v-deep img {
                width: 100%;
                object-fit: cover;
            }
        }
    }
    .msg-content {
        // display: grid;
        word-break: break-word;
        :deep(.composer-contenteditable__overlay) {
            display: none;
        }
        :deep(.composer-contenteditable__image) {
            .composer-contenteditable__btn-delete {
                display: none;
            }
            img {
                cursor: pointer;
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
    width: 40px !important;
    height: 40px !important;
}
.title-subject {
    word-break: break-word;
}
</style>
<style lang="scss">
.box-message-single .msg-content .mention {
    cursor: inherit;
}

.box-message-single .msg-content .gmail_quote {
    display: none;
}

.box-message-single .msg-content img:hover {
    cursor: pointer;
}

.msg-content .gmail_signature > div > table > tbody > tr > td {
    padding-left: 0 !important;
    display: block;
    clear: both;
    width: 100%;
}

.msg-content .gmail_signature > div > table > tbody > tr > td > table > tbody > tr > td {
    width: 50%;
}
</style>
