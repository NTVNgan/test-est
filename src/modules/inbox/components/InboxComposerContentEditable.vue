<template>
    <div class="composer-contenteditable flex flex-col" :class="is_whisper ? 'composer-note' : ''">
        <inbox-composer-caret-tooltip
            v-if="is_whisper"
            :show="userDataByKeyword.length > 0"
            v-model="keyWordMentionValues"
            :key="'mention' + tooltipKey"
            activeKeywords="@"
            classBase="w-320 max-h-356"
            @click-outside="onClickOutsideMention"
        >
            <inbox-composer-mention
                :key="tooltipKey + 'mention'"
                :users="userDataByKeyword"
                @select="onSelectMentionValue"
            />
        </inbox-composer-caret-tooltip>
        <inbox-composer-caret-tooltip
            v-else-if="!is_whisper"
            :show="cannedResponses.length > 0 && keyWordCannedValues !== null"
            v-model="keyWordCannedValues"
            activeKeywords="/"
            classBase="w-400 max-h-356"
            @click-outside="onClickOutsideCanned"
        >
            <inbox-composer-caret-canned-response :keyword="keyWordCannedValues" @select="onSelectCannedResponse" />
        </inbox-composer-caret-tooltip>
        <div class="flex-grow">
            <span
                class="px-16p text-14 text-neutrals-200 pointer-events-none"
                :class="[type === 'canned_response' ? 'fixed' : 'absolute', is_whisper ? 'text-neutrals-400' : '']"
                v-show="isShowPlaceholder"
                @click="onClickPlaceHolder"
                >{{
                    placeholder
                        ? placeholder
                        : is_whisper
                        ? 'Add note or @ to mention your teammate'
                        : $t('inbox.inbox_composer_placeholder')
                }}</span
            >
            <div
                class="ml-16p composer-contenteditable__contentedit flex-grow scrollbar--transparent"
                :class="{ 'max-h-285': type === 'conversation' }"
            >
                <div
                    id="lb-contenteditable"
                    class="composer-contenteditable__contentedit-div text-14 mr-16p outline-none"
                    ref="contenteditable"
                    contenteditable
                    @click.right="handleRightClick"
                    @copy="handleCopy"
                    @paste="handlePaste"
                    @input="onInput"
                    @keydown="handleKeydown"
                    @blur="handleBlur"
                    @keyup="handleKeyUp"
                    @click="handleClick"
                ></div>
            </div>
            <div
                v-if="filesUpload && type === 'conversation'"
                class="
                    ml-16p
                    pr-16p
                    mt-8p
                    composer-contenteditable__file-upload
                    flex-grow
                    scrollbar--transparent
                    overflow-y-auto
                    flex flex-wrap
                    gap-xs
                "
                :class="{ 'max-h-140': type === 'conversation' }"
            >
                <div
                    class="
                        h-44
                        inline-flex
                        items-center
                        justify-center
                        p-8p
                        border border-primary-50
                        bg-white
                        rounded-8p
                        max-w-full
                    "
                    v-for="(item, index) in filesUpload"
                    :key="'file-upload-' + index"
                >
                    <div
                        class="
                            h-28
                            w-28
                            relative
                            rounded-full
                            flex
                            items-center
                            justify-center
                            border border-primary-50
                        "
                        :class="
                            item.status === 'uploading' ? 'composer-contenteditable__file--uploading' : 'bg-primary-50'
                        "
                    >
                        <icon-component
                            name="file"
                            class="text-primary-100"
                            :color="item.status === 'uploading' ? 'primary-100' : 'primary-500'"
                        />
                        <span class="progress-left">
                            <span class="progress-bar"></span>
                        </span>
                        <span class="progress-right">
                            <span class="progress-bar"></span>
                        </span>
                    </div>
                    <div class="text-14 mx-8p flex-1 flex min-w-0" v-html="filters.truncateFileName(item.name)"></div>
                    <icon-component name="TimesRegular14" class="cursor-pointer" @click="removeFileUpload(index)" />
                </div>
            </div>
        </div>
        <div
            :class="{
                'self-end mt-12p px-16p flex': type === 'conversation',
                'self-center bg-neutrals-400 px-0p flex rounded-8p  flex-row-reverse w-64 h-32':
                    type === 'canned_response',
            }"
        >
            <Tooltip
                v-if="type === 'conversation' && !is_whisper"
                class="inline-flex text-neutrals-400"
                size="small"
                type="dark"
                position="top"
                :content="$t('inbox.inbox_composer_button_add_canned_tooltip')"
            >
                <new-dropdown-component
                    v-model="showDropdownCannedResponse"
                    width="560px"
                    class="icon-emoji w-36 h-36 flex items-center justify-center rounded block mr-4p"
                    :class="
                        is_whisper ? 'bg-warning-5' : showDropdownCannedResponse ? 'bg-primary-50' : 'bg-neutrals-50'
                    "
                    label="Tooltip"
                    position="top"
                    :paddingRange="4"
                    borderRadiusContent="4px"
                >
                    <template #content>
                        <InboxComposerDropdownCannedResponse
                            @close="onCloseDropdownCannedResponse"
                            @addCanned="addCanned"
                        />
                    </template>
                    <icon-component
                        name="CannedResponse"
                        :color="showDropdownCannedResponse ? 'primary-500' : 'neutrals-400'"
                    />
                </new-dropdown-component>
            </Tooltip>
            <Tooltip
                v-if="type === 'conversation' && !is_whisper"
                :class="{
                    'inline-flex text-neutrals-400 ': type === 'conversation',
                    'rounded-r-8p hover:bg-neutrals-300': type === 'canned_response',
                }"
                size="small"
                type="dark"
                position="top"
                :content="$t('inbox.inbox_composer_button_upload_file_tooltip')"
            >
                <label
                    for="upload-file-composer"
                    class="relative flex items-center justify-center rounded cursor-pointer focus:outline-none"
                    :class="{
                        'bg-neutrals-50 w-36 h-36 mr-4p hover:bg-neutrals-50': type === 'conversation',
                        'w-32 h-32 ': type === 'canned_response',
                        'bg-warning-5': is_whisper,
                    }"
                >
                    <icon-component name="PaperClip" :color="type === 'conversation' ? 'neutrals-400' : 'white'" />
                    <input
                        type="file"
                        class="w-px h-px opacity-0 overflow-hidden absolute"
                        id="upload-file-composer"
                        name="upload-file-composer"
                        accept=".pdf,.gif,.txt,.mp4,.mov,.csv,.docx,.doc,.zip,.xls,.xlsx"
                        multiple
                        @change="addFile"
                    />
                </label>
            </Tooltip>
            <Tooltip
                :class="{
                    'inline-flex text-neutrals-400 ': type === 'conversation',
                    'rounded-r-8p hover:bg-neutrals-300': type === 'canned_response',
                }"
                size="small"
                type="dark"
                position="top"
                :content="$t('inbox.inbox_composer_button_upload_image_tooltip')"
            >
                <label
                    for="upload-image-composer"
                    class="relative flex items-center justify-center rounded cursor-pointer focus:outline-none"
                    :class="{
                        'bg-neutrals-50 w-36 h-36 mr-4p hover:bg-neutrals-50': type === 'conversation',
                        'w-32 h-32 ': type === 'canned_response',
                        'bg-warning-5': is_whisper,
                    }"
                >
                    <icon-component
                        :name="type === 'conversation' ? 'ImageLight' : 'image'"
                        :color="type === 'conversation' ? 'neutrals-400' : 'white'"
                    />
                    <input
                        type="file"
                        class="w-px h-px opacity-0 overflow-hidden absolute"
                        id="upload-image-composer"
                        name="upload-image-composer"
                        accept=".png,.jpg,.jpeg"
                        multiple
                        @change="addImage"
                    />
                </label>
            </Tooltip>
            <Tooltip
                :class="{
                    'inline-flex text-neutrals-400 ': type === 'conversation',
                    'rounded-l-8p hover:bg-neutrals-300': type === 'canned_response',
                }"
                size="small"
                type="dark"
                position="top"
                :content="$t('inbox.inbox_composer_button_add_emoji_tooltip')"
            >
                <new-dropdown-component
                    v-if="type === 'conversation'"
                    v-model="showDropdownEmoji"
                    width="228px"
                    class="
                        icon-emoji
                        w-36
                        h-36
                        flex
                        items-center
                        justify-center
                        rounded
                        block
                        mr-4p
                        hover:bg-neutrals-50
                    "
                    :class="
                        is_whisper
                            ? showDropdownEmoji
                                ? 'bg-warning-4'
                                : 'bg-warning-5'
                            : showDropdownEmoji
                            ? 'bg-primary-50'
                            : 'bg-neutrals-50'
                    "
                    label="Tooltip"
                    position="top"
                    :paddingRange="8"
                    borderRadiusContent="8px"
                >
                    <template #content>
                        <EmojiPicker @add-emoji="addEmoji" />
                    </template>
                    <icon-component
                        name="emoji"
                        :color="showDropdownEmoji ? (is_whisper ? '#B4B4BE' : 'primary-500') : 'neutrals-400'"
                    />
                </new-dropdown-component>
                <new-dropdown-component
                    v-else
                    v-model="showDropdownEmoji"
                    width="228px"
                    class="icon-emoji w-32 h-32 flex items-center justify-center rounded block"
                    label="Tooltip"
                    position="top"
                    :paddingRange="8"
                    borderRadiusContent="8px"
                >
                    <template #content>
                        <EmojiPicker @add-emoji="addEmoji" />
                    </template>
                    <icon-component name="emoji" color="white" />
                </new-dropdown-component>
            </Tooltip>
            <button-component
                v-if="type === 'conversation'"
                icon="paper-plant"
                :disabled="disabledButtonSend || isUploadingFile"
                size="medium"
                @click="onSendMessage(false)"
                >{{ $t('inbox.inbox_composer_button_send') }}</button-component
            >
        </div>
        <inbox-composer-upload-error
            headerTitle="Upload errors"
            v-model:errorData="filesUploadError"
            v-model:showUploadError="isShowUploadError"
        />
        <modal-alert-component
            v-model:showModal="showModalAlertFullImage"
            width="496px"
            :title="'you’ve reached the maximum number of images'"
            :content="'Maximum 20 images per message.<br/ >Because of image limit, can not add the canned response.'"
            @onClickButton="showModalAlertFullImage = false"
        />
        <modal-alert-component
            v-model:showModal="isShowModalMaximumImage"
            width="496px"
            :title="$t('inbox.inbox_composer_modal_max_image_title')"
            :content="$t('inbox.inbox_composer_modal_max_image_subtitle')"
            @onClickButton="isShowModalMaximumImage = false"
        />
        <modal-alert-component
            v-model:showModal="isShowModalMaximumFile"
            width="496px"
            :title="$t('inbox.inbox_composer_modal_max_file_title')"
            :content="$t('inbox.inbox_composer_modal_max_file_subtitle')"
            @onClickButton="isShowModalMaximumFile = false"
        />
    </div>
</template>

<script>
import { ref, watch, computed, inject, onMounted, nextTick } from 'vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import NewDropdownComponent from '@/components/ui/NewDropdownComponent.vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import EmojiPicker from '@/components/emoji';
import Tooltip from '@/components/ui/TooltipComponent.vue';
import InboxComposerUploadError from './InboxComposerUploadError.vue';
import InboxComposerCaretTooltip from './InboxComposerCaretTooltip.vue';
import InboxComposerDropdownCannedResponse from './InboxComposerDropdownCannedResponse.vue';
import InboxComposerCaretCannedResponse from './InboxComposerCaretCannedResponse.vue';
import ModalAlertComponent from '@/components/ui/ModalAlertComponent.vue';
import database, { dbName } from '@/database';
import { useRouter } from 'vue-router';
import { useSocket } from '@/composables/useSocket';
import { store } from '@/store';
import { useInboxConversationDetail } from '@/modules/inbox/composables/useInboxConversationDetail';
import { useInboxAttachCannedResponse } from '@/modules/inbox/composables/useInboxAttachCannedResponse';
import { useInboxAttachFile } from '@/modules/inbox/composables/useInboxAttachFile';
import { useEmoji } from '@/modules/inbox/composables/useEmoji';
import { useCannedResponse } from '@/modules/setting/composables/useCannedResponse';
import InboxComposerMention from './InboxComposerMention.vue';
import CONSTANTS from '../constants/constants';
import { useUser } from '@/modules/auth/composables/useUser';
import debounce from 'lodash/debounce';
import filters from '@/utils/filters';
import { useContact } from '@/modules/contact/composables/useContact';

const escapeHTML = (text) => {
    return text.replace(/[<>]/g, function (match, pos, originalText) {
        switch (match) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
        }
    });
};

function setCaret(el, pos) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(el, pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

export default {
    name: 'InboxComposerContentEditable',
    props: {
        placeholder: {
            type: String,
            default: null,
        },
        tab: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'conversation',
        },
        is_whisper: {
            type: Boolean,
            default: false,
        },
        isSendEmail: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        InboxComposerMention,
        InboxComposerCaretTooltip,
        ButtonComponent,
        NewDropdownComponent,
        IconComponent,
        EmojiPicker,
        Tooltip,
        InboxComposerUploadError,
        InboxComposerDropdownCannedResponse,
        ModalAlertComponent,
        InboxComposerCaretCannedResponse,
    },
    emits: ['send', 'blur', 'update:modelValue'],
    setup(props, { emit }) {
        const validTotalFileSizeSendEmail = ref(25 * 1024 * 1024);
        const { contact } = useContact();
        const envURL = `${process.env.VUE_APP_FILE_URL}/`;
        const tooltipKey = ref(0);
        const content = ref('');
        const contentNote = ref('');
        const isShowPlaceholder = ref(true);
        const disabledButtonSend = ref(true);
        const isNote = ref(true);
        const contenteditable = ref(null);
        const keyWordMentionValues = ref(null);
        const keyWordCannedValues = ref(null);
        const lastEditRange = ref(null);
        const router = useRouter();
        const user = computed(() => store.state.auth.user);
        const { insertEmoji } = useEmoji(lastEditRange, contenteditable, setCaret);
        const showDropdownEmoji = ref(false);
        const showDropdownCannedResponse = ref(false);
        const { org_id, workspace_id, _id: sender_id } = user.value;
        const { socket } = useSocket();
        const isTyping = ref(false);
        const { conversationDetail } = useInboxConversationDetail();
        const {
            imagesUpload,
            filesUploadError,
            isShowModalMaximumImage,
            isShowUploadError,
            onAttachImage,
            resetImageMargin,
            resetImageDataIndex,
            setButtonDeleteFunction,
            filesUpload,
            onAttachFile,
            isShowModalMaximumFile,
            onDropFile,
            getSizeImagesInComposer,
        } = useInboxAttachFile(lastEditRange, contenteditable);
        const { onAttachCannedResponse, cannedUsed, showModalAlertFullImage } = useInboxAttachCannedResponse(
            lastEditRange,
            contenteditable,
        );
        const { cannedResponses } = useCannedResponse();
        const emitter = inject('emitter');
        const { userList, getUserList, emailSendingLimit } = useUser();

        const isUploadingFile = computed(() => filesUpload.value.some((item) => item.status === 'uploading'));

        const prepareMention = (val) => {
            const spanWrapperNode = document.createElement('span');
            spanWrapperNode.classList.add(
                'composer-contenteditable__mention',
                'text-primary-500',
                'bg-neutrals-100',
                'cursor-pointer',
                'rounded-2p',
            );
            const spanNode = document.createElement('span');
            spanNode.innerText = '@' + val.full_name;
            spanNode.dataset.mentionId = '@{u:' + val._id + '}';
            spanNode.contentEditable = false;
            spanNode.dataset.mentionName = val.full_name;
            spanWrapperNode.appendChild(spanNode);
            return spanWrapperNode;
        };

        const insertMention = (val) => {
            const mentionNode = prepareMention(val);
            const emptyNodeText = document.createTextNode('\u00A0');

            if (lastEditRange.value !== null && lastEditRange.value.startContainer.id !== 'lb-contenteditable') {
                const { startContainer, startOffset } = lastEditRange.value;
                if (startContainer.nodeName === '#text') {
                    const parentNode = startContainer.parentElement;
                    // Tách node thành 2 node con
                    const childNodeStart = document.createTextNode(startContainer.nodeValue.slice(0, startOffset + 1));
                    const childNodeEnd = document.createTextNode(
                        startContainer.nodeValue.slice(startOffset + 1, startContainer.nodeValue.length),
                    );
                    parentNode.insertBefore(childNodeStart, startContainer);
                    parentNode.insertBefore(mentionNode, startContainer);
                    parentNode.insertBefore(childNodeEnd, startContainer);
                    parentNode.removeChild(startContainer);
                }
                if (startContainer.nodeName === 'SPAN') {
                    startContainer.insertBefore(mentionNode, startContainer.childNodes[startOffset]);
                }
            } else {
                contenteditable.value.appendChild(mentionNode);
            }

            //Clear @ and value typing for mention searching
            const parentMentionNode = mentionNode.parentNode;
            const nodeAfterMention =
                parentMentionNode.childNodes[Array.from(parentMentionNode.childNodes).indexOf(mentionNode) - 1];
            const lastIndex = nodeAfterMention.nodeValue.lastIndexOf('@');
            nodeAfterMention.nodeValue = nodeAfterMention.nodeValue.substr(0, lastIndex);

            //Add span mới sau mention
            if (
                parentMentionNode.childNodes[Array.from(parentMentionNode.childNodes).indexOf(mentionNode) + 1] !==
                undefined
            ) {
                parentMentionNode.insertBefore(
                    emptyNodeText,
                    parentMentionNode.childNodes[Array.from(parentMentionNode.childNodes).indexOf(mentionNode) + 1],
                );
            } else {
                parentMentionNode.appendChild(emptyNodeText);
            }
            setCaret(emptyNodeText, 1);
        };

        //MENTION DATA AND KEYWORDS VALUE
        const userDataByKeyword = ref([]);

        const onSelectMentionValue = (item) => {
            tooltipKey.value++;
            insertMention(item);
            userDataByKeyword.value = [];
            keyWordMentionValues.value = null;
        };

        const onGetUserDataByKeyword = async () => {
            if (keyWordMentionValues.value) {
                const data = await getUserList();
                const keywords = keyWordMentionValues.value.replace('@', '');
                console.log(keywords);
                if (keywords.length > 0) {
                    return data.filter(
                        (item) =>
                            item.full_name &&
                            item.full_name.toLowerCase().includes(keywords.toLowerCase()) &&
                            item._id !== user.value._id,
                    );
                } else {
                    return data.filter((item) => item._id !== user.value._id);
                }
            }
        };

        watch(
            keyWordMentionValues,
            debounce(async (newVal, oldVal) => {
                if (oldVal !== newVal && newVal) {
                    isShowPlaceholder.value = false;
                    userDataByKeyword.value = await onGetUserDataByKeyword();
                }
            }, 500),
        );

        const onClickOutsideMention = () => {
            console.log('ouside');
            keyWordMentionValues.value = null;
            userDataByKeyword.value = [];
        };
        const onClickOutsideCanned = () => {
            console.log('onClickOutsideCanned');
            keyWordCannedValues.value = null;
            cannedResponses.value = [];
        };
        const recountImageUpload = () => {
            const listImageNode = contenteditable.value.getElementsByClassName('composer-contenteditable__image');
            console.log('recountImageUpload', listImageNode);
            imagesUpload.value = listImageNode.length;
        };

        ////

        const isTextComposerBlank = () => {
            return (
                !contenteditable.value.innerText.trim().length &&
                !String(contenteditable.value.innerHTML).includes('img-emoji') &&
                !String(contenteditable.value.innerHTML).includes('composer-contenteditable__image')
            );
        };

        const getCursorPos = () => {
            lastEditRange.value = window.getSelection().getRangeAt(0);
        };

        const handleKeyUp = (e) => {
            emitter.emit('contentKeyUp', { e, contenteditable: contenteditable.value });
        };

        const handleClick = (e) => {
            console.log({ e });
            emitter.emit('contentClick', { e, contenteditable: contenteditable.value });
        };

        const handleBlur = () => {
            if (!contenteditable.value) {
                return;
            }
            getCursorPos();
            if (lastEditRange.value !== null) {
                const { startContainer } = lastEditRange.value;
                // nếu trong contenteditable chỉ còn thẻ br thì clear luôn để hiện placeholder
                if (
                    startContainer.className &&
                    startContainer.className.includes('composer-contenteditable__contentedit-div') &&
                    startContainer.childNodes.length === 1 &&
                    startContainer.childNodes[0].nodeName === 'BR'
                ) {
                    startContainer.childNodes[0].remove();
                }
            }
            const inputContent = contenteditable.value.innerHTML;
            isShowPlaceholder.value = !inputContent.length;
            disabledButtonSend.value = !inputContent.length && !filesUpload.value.length;
            // if (!inputContent.length) {
            //     isShowPlaceholder.value = true;
            //     disabledButtonSend.value = true;
            // } else {
            //     isShowPlaceholder.value = false;
            //     disabledButtonSend.value = false;
            // }
            emit('blur');
            emitter.emit('contentBlur');
        };

        // const handleClickOutside = () => {
        //     emitter.emit('contentClickOutside');
        // };

        const handlePaste = (event) => {
            console.log('handlePaste', event.clipboardData);
            event.preventDefault();
            if (!(event.clipboardData && event.clipboardData.items)) {
                return false;
            }
            if (event.clipboardData.files.length > 0) {
                onAttachImage(event.clipboardData.files, props.type);
                isShowPlaceholder.value = false;
                disabledButtonSend.value = false;
                return;
            }
            const items = event.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    const URLObj = window.URL || window.webkitURL;
                    const source = URLObj.createObjectURL(blob);
                    this.uploadSingleFile(blob);
                    // if (blob.size === 0) {
                    //   return false;
                    // }
                    // this.$emit('image-paste', blob);
                    // return false;
                }
            }
            const text = event.clipboardData.getData('text/plain') || '';

            document.execCommand('insertText', false, escapeHTML(text));
            // this.$nextTick(() => {
            //     this.composerScrolldown();
            // });
        };

        let timeout;
        const userTyping = () => {
            // eslint-disable-next-line prefer-const
            const assignCurrentUser = conversationDetail.value.participants.filter((p) => p.parti_type === 1);
            if (assignCurrentUser.length < 1) return;
            if (assignCurrentUser[0].parti_id !== sender_id && !props.is_whisper) return;
            clearTimeout(timeout);
            const params = {
                org_id,
                workspace_id,
                convo_id: conversationDetail.value._id,
                sender_id,
                type: 'start',
                sender_type: 1,
                is_whisper: props.is_whisper,
            };
            if (contenteditable.value.innerHTML.length === 0) {
                params.type = 'stop';
                isTyping.value = false;
                socket.emit('message.typing', params, function (data) {
                    console.log(data); // callback
                });
                return;
            }
            if (!isTyping.value) {
                socket.emit('message.typing', params, function (data) {
                    console.log(data); // callback
                });
                isTyping.value = true;
            }
            // eslint-disable-next-line prefer-const
            timeout = setTimeout(() => {
                params.type = 'stop';
                isTyping.value = false;
                socket.emit('message.typing', params, function (data) {
                    console.log(data); // callback
                });
            }, 2000);
        };

        const onInput = (e) => {
            userTyping();

            e.target.querySelectorAll('span.label.highlight').forEach(function (el) {
                el.classList.remove('highlight');
            });

            if (!props.is_whisper) content.value = e.target.innerText;
            else contentNote.value = e.target.innerText;
            isShowPlaceholder.value = !contenteditable.value.innerHTML.replace(/^(<br>|\n)*/, '').length;
            disabledButtonSend.value =
                !contenteditable.value.innerHTML.replace(/^(&nbsp;|\s)|(<br>|\n)*/, '').length &&
                !filesUpload.value.length;
            getCursorPos();
            resetImageMargin();
            // set 1 dòng mới nếu như typing trong div thuộc allowClasslist
            const { startContainer } = lastEditRange.value;
            const allowClassList = ['composer-contenteditable__image-wrapper', 'composer-contenteditable__mention'];
            const isAllowClass = allowClassList.some((item) => startContainer.parentNode.className.includes(item));
            if (startContainer.nodeName === '#text' && isAllowClass) {
                contenteditable.value.insertBefore(startContainer, startContainer.parentNode.nextSibling);
                setCaret(
                    contenteditable.value,
                    Array.from(contenteditable.value.childNodes).indexOf(startContainer) + 1,
                );
            }
            emit('update:modelValue', contenteditable.value.innerHTML);
        };

        const handleKeydown = (event) => {
            if (userDataByKeyword.value.length > 0) {
                emitter.emit('contentKeyDown', event);
                if (event.shiftKey && event.keyCode === 13) event.preventDefault();
            }

            if (cannedResponses.value.length > 0 && keyWordCannedValues.value) {
                emitter.emit('contentKeyDownCaretCannedResponse', event);
            }

            if (
                (event.keyCode === 38 && event.key == 'ArrowUp') ||
                (event.keyCode === 13 && !event.shiftKey) ||
                (event.keyCode === 40 && event.key == 'ArrowDown')
            ) {
                event.preventDefault();
            }

            // event.keyCode [8: Backspace, 46: Delete, 13: Enter]
            getCursorPos();
            if (lastEditRange.value !== null) {
                const { startContainer } = lastEditRange.value;
                // console.log({ value: lastEditRange.value });
                if (event.keyCode === 8 || event.keyCode === 46) {
                    window.setTimeout(() => {
                        const s = window.getSelection();
                        const r = s.getRangeAt(0);
                        const el = r.startContainer;
                        // Check if the current element is the .label
                        if (el.classList && el.classList[0].includes('composer-contenteditable__mention')) {
                            event.preventDefault();
                            el.remove();
                        }
                    }, 0);
                    console.log(startContainer, 'startContainer');

                    // check thẻ <br> khi delete img và canned cuối cùng làm ko show placeholder đc
                    if (
                        startContainer.className &&
                        startContainer.className.includes('composer-contenteditable__contentedit-div') &&
                        startContainer.childNodes.length === 1 &&
                        startContainer.childNodes[0].nodeName === 'BR'
                    ) {
                        startContainer.childNodes[0].remove();
                        isShowPlaceholder.value = true;
                        disabledButtonSend.value = true;
                    }

                    if (startContainer.className === 'composer-contenteditable__image') {
                        const indexImageDom = startContainer.getAttribute('data-img-index');
                        imagesUpload.value--;
                        if (startContainer.previousSibling !== null) {
                            setCaret(
                                startContainer.parentNode.previousSibling,
                                Array.from(startContainer.parentNode.previousSibling).length,
                            );
                        } else {
                            setCaret(contenteditable.value, 0);
                        }
                        startContainer.parentNode.remove();
                        resetImageDataIndex();
                    }
                    if (startContainer.parentNode.className === 'composer-contenteditable__image') {
                        const indexImageDom = startContainer.parentNode.getAttribute('data-img-index');
                        imagesUpload.value--;
                        if (startContainer.previousSibling !== null) {
                            setCaret(
                                startContainer.parentNode.parentNode.previousSibling,
                                Array.from(startContainer.parentNode.parentNode.previousSibling).length,
                            );
                        } else {
                            setCaret(contenteditable.value, 0);
                        }
                        startContainer.parentNode.parentNode.remove();
                        resetImageDataIndex();
                    }
                    if (
                        startContainer.className &&
                        startContainer.className.includes('composer-contenteditable__image-wrapper')
                    ) {
                        event.returnValue = false;
                        const imgDom = startContainer.querySelector('.composer-contenteditable__image');
                        if (imgDom) {
                            const indexImageDom = imgDom.getAttribute('data-img-index');
                            console.log(indexImageDom, 'check 03');
                            imagesUpload.value--;
                        }
                        if (startContainer.previousSibling !== null) {
                            setCaret(startContainer.previousSibling, Array.from(startContainer.previousSibling).length);
                        } else {
                            setCaret(contenteditable.value, 0);
                        }
                        startContainer.remove();
                        resetImageDataIndex();
                    }
                    setTimeout(() => {
                        recountImageUpload();
                    }, 100);
                }
                if (event.keyCode === 13 && event.shiftKey) {
                    if (startContainer.parentNode.className.includes('composer-contenteditable__image-wrapper')) {
                        event.returnValue = false;
                        const brNode = document.createElement('br');
                        contenteditable.value.insertBefore(brNode, startContainer.parentNode.nextSibling);
                        setCaret(brNode, 0);
                        resetImageMargin();
                    }
                    if (
                        startContainer.parentNode.parentNode.className.includes(
                            'composer-contenteditable__image-wrapper',
                        )
                    ) {
                        event.returnValue = false;
                        const brNode = document.createElement('br');
                        contenteditable.value.insertBefore(brNode, startContainer.parentNode.parentNode.nextSibling);
                        setCaret(brNode, 0);
                        resetImageMargin();
                    }
                }
            }
            window.setTimeout(() => {
                emit('update:modelValue', contenteditable.value.innerHTML);
            }, 0);
        };
        const handleCopy = async (event) => {
            // copy Image
            const { ClipboardItem } = window;
            if (event.target.className === 'composer-contenteditable__overlay') {
                const imageIndex = event.target.parentNode.getAttribute('data-img-index');
                const reader = new FileReader();
                const c = document.createElement('canvas');
                const ctx = c.getContext('2d');
                reader.onload = (event) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = event.target.result;
                    img.onload = () => {
                        c.width = img.naturalWidth; // update canvas size to match image
                        c.height = img.naturalHeight;
                        ctx.drawImage(img, 0, 0); // draw in image
                        c.toBlob(
                            (blob) => {
                                const data = [
                                    new ClipboardItem({
                                        'image/png': new Blob([blob], { type: 'image/png' }),
                                    }),
                                ];
                                navigator.clipboard.write(data).then(
                                    () => {
                                        console.log('Copied to clipboard successfully!');
                                    },
                                    () => {
                                        console.error('Unable to write to clipboard. :-(');
                                    },
                                );
                            },
                            'image/*',
                            0.75,
                        );
                    };
                };
                reader.readAsDataURL(imagesUpload.value[imageIndex]);
            }
            console.log('hello');
            emit('update:modelValue', contenteditable.value.innerHTML);
        };
        const handleRightClick = (event) => {
            // copy Image
            if (event.target.className === 'composer-contenteditable__overlay') {
                event.target.classList += 'hidden';
            }
        };

        const count = (names) => names.reduce((a, b) => ({ ...a, [b]: (a[b] || 0) + 1 }), {});

        const duplicates = (dict) => Object.keys(dict).filter((a) => dict[a] > 5);

        const saveToIndexedDB = async (emojis) => {
            const emojiDB = await database.getItem(dbName.listEmoji);
            const chatEmojiDB = await database.getItem(dbName.emoji);

            const userEmojiBD = emojiDB ? emojiDB[user.value._id] : [];
            let chatUserEmojiBD = chatEmojiDB ? chatEmojiDB[user.value._id] : [];

            if (chatUserEmojiBD.length > 0) {
                if (!chatUserEmojiBD.includes(emojis)) {
                    // emojis.forEach((emoji) => {
                    //     // const numberDupCopy = duplicates(count(userEmojiBD));
                    //     // const index = numberDupCopy.findIndex((o) => o === emoji);
                    //     // console.log(index);
                    //     // if (index > -1) {
                    //     //     userEmojiBD.splice(index, 1)
                    //     // }

                    //     userEmojiBD.unshift(emoji);
                    //     emojiDB[user.value._id] = userEmojiBD;
                    //     database.setItem(dbName.listEmoji, emojiDB);
                    // });
                    userEmojiBD.unshift(emojis);
                    emojiDB[user.value._id] = userEmojiBD;
                    database.setItem(dbName.listEmoji, emojiDB);
                    const numberDup = duplicates(count(userEmojiBD));

                    chatEmojiDB[user.value._id] = numberDup;
                    database.setItem(dbName.emoji, chatEmojiDB);
                } else {
                    chatUserEmojiBD = chatUserEmojiBD.filter((item) => item !== emojis);
                    chatUserEmojiBD.unshift(emojis);

                    chatEmojiDB[user.value._id] = chatUserEmojiBD;
                    database.setItem(dbName.emoji, chatEmojiDB);
                }
            } else {
                userEmojiBD.unshift(emojis);
                emojiDB[user.value._id] = userEmojiBD;
                database.setItem(dbName.listEmoji, emojiDB);
                const numberDup = duplicates(count(userEmojiBD));

                chatEmojiDB[user.value._id] = numberDup;
                database.setItem(dbName.emoji, chatEmojiDB);
            }
        };

        const insertHandler = async (val, type = '') => {
            emit('update:modelValue', contenteditable.value?.innerHTML);
            switch (type) {
                case 'emoji':
                    // code block
                    saveToIndexedDB(val.unified);
                    insertEmoji(val);
                    isShowPlaceholder.value = false;
                    disabledButtonSend.value = false;
                    return emit('update:modelValue', contenteditable.value?.innerHTML);
                case 'image':
                    await onAttachImage(val.target.files, props.type);
                    isShowPlaceholder.value = false;
                    disabledButtonSend.value = false;
                    return emit('update:modelValue', contenteditable.value?.innerHTML);
                case 'canned':
                    await onAttachCannedResponse(val);
                    setButtonDeleteFunction();
                    recountImageUpload();
                    isShowPlaceholder.value = false;
                    disabledButtonSend.value = false;
                    return emit('update:modelValue', contenteditable.value?.innerHTML);
                case 'file':
                    await onAttachFile(val.target.files, props.type);
                    disabledButtonSend.value = false;
                    return emit('update:modelValue', contenteditable.value?.innerHTML);

                // case "cache":
                //   // code block
                //   return this.recoverTextInCache(val);
                // case "text":
                //   // code block
                //   return this.insertText(val);
                // case "mention":
                //   // code block
                //   return this.insertMention(val);
            }
        };

        const addEmoji = (val) => {
            insertHandler(val, 'emoji');
        };
        const addImage = (val) => {
            insertHandler(val, 'image');
        };
        const addFile = (val) => {
            console.log(val.target.files, 'val nè');
            insertHandler(val, 'file');
        };
        const addCanned = (val) => {
            insertHandler(val, 'canned');
            showDropdownCannedResponse.value = false;
        };

        const removeNodeImage = (contentNode) => {
            const listImageNode = contentNode.getElementsByClassName('composer-contenteditable__image');
            if (listImageNode.length > 0) {
                for (let index = 0; index < listImageNode.length; index++) {
                    const itemImageDom = listImageNode[index];
                    if (props.type === 'conversation') {
                        const btnDelete = itemImageDom.querySelector('.composer-contenteditable__btn-delete');
                        btnDelete.remove();
                        const overlay = itemImageDom.querySelector('.composer-contenteditable__overlay');
                        overlay.remove();
                        itemImageDom.removeAttribute('data-img-index');
                    }
                    itemImageDom.style.height = null;
                    itemImageDom.style.width = null;
                }
            }
        };
        const recheckImageUpload = (contentNode) => {
            const imgUpload = [];
            const listImageNode = contentNode.getElementsByClassName('composer-contenteditable__image');
            if (listImageNode.length > 0) {
                for (let index = 0; index < listImageNode.length; index++) {
                    const itemImageDom = listImageNode[index];
                    const imgEl = itemImageDom.querySelector('img');
                    imgUpload.push({
                        id: imgEl.getAttribute('data-img-id'),
                        name: imgEl.alt,
                        url: imgEl.src.replace(envURL, ''),
                    });
                }
            }
            return imgUpload;
        };
        const onSendMessage = confirmSendEmail => {
            const contentNode = contenteditable.value.cloneNode(true);
            const isTextBlank = isTextComposerBlank();
            removeNodeImage(contentNode);
            const imgUpload = recheckImageUpload(contentNode);
            console.log(imgUpload);

            const msgData = {
                type: '',
                content: '',
                attachments: [],
                canned_responses: [],
            };

            //check type message
            if (!isTextBlank || filesUpload.value.length > 0) {
                if (props.isSendEmail && contact.value.total_sent_email >= emailSendingLimit.value && !confirmSendEmail && props.tab === 'reply') {
                    emitter.emit('showModalConfirmSendEmail', { type: 'confirm' });
                    return;
                }
                if (props.isSendEmail && props.tab === 'reply') {
                    let sizeImages = getSizeImagesInComposer();
                    if(!Number.isInteger(sizeImages)) sizeImages = 0;
                    let sizeFiles = 0;
                    if (filesUpload.value.length > 0) {
                        sizeFiles = filesUpload.value
                            .map(o => o.size)
                            .reduce((a, c) => {
                                return a + c;
                            });
                    }
                    if (sizeFiles + sizeImages > validTotalFileSizeSendEmail.value) {
                        emitter.emit('showModalConfirmSendEmail', { type: 'max-size' });
                        return;
                    }
                }
                // const value = standardizedText(contentNode);
                if (contentNode.innerText === '' && imgUpload.length > 0 && filesUpload.value.length === 0) {
                    msgData.type = CONSTANTS.MESSAGE_TYPE.IMAGE;
                    if (props.isSendEmail) msgData.content = contentNode.innerHTML;
                } else if (contentNode.innerText === '' && filesUpload.value.length > 0) {
                    msgData.type = CONSTANTS.MESSAGE_TYPE.FILE;
                } else {
                    msgData.type = CONSTANTS.MESSAGE_TYPE.TEXT;
                    msgData.content = contentNode.innerHTML;
                }
                if (imgUpload.length > 0) {
                    const attactmentUploaded = imgUpload.map((item) => {
                        return {
                            type: CONSTANTS.MESSAGE_ATTACHMENT_TYPE.IMAGE,
                            _id: item.id,
                            name: item.name,
                            src: item.url,
                        };
                    });
                    msgData.attachments = [...msgData.attachments, ...attactmentUploaded];
                }
                if (filesUpload.value.length > 0) {
                    const attactmentUploaded = filesUpload.value.map((item) => {
                        return {
                            type: CONSTANTS.MESSAGE_ATTACHMENT_TYPE.FILE,
                            _id: item.id,
                            name: item.name,
                            src: item.url,
                        };
                    });
                    msgData.attachments = [...msgData.attachments, ...attactmentUploaded];
                }
                if (cannedUsed.value.length) {
                    msgData.canned_responses = cannedUsed.value;
                }
                if (props.isSendEmail && !props.is_whisper) msgData.type = CONSTANTS.MESSAGE_TYPE.EMAIL;
                console.log(msgData, 'msgData');
                emit('send', msgData);
                if (!props.is_whisper) content.value = '';
                else contentNote.value = '';
                props.type === 'conversation' && (contenteditable.value.textContent = '');
                imagesUpload.value = 0;
                filesUpload.value = [];
                isShowPlaceholder.value = props.type === 'conversation';
                disabledButtonSend.value = props.type === 'conversation';
                if (props.isSendEmail && props.tab === 'reply') {
                    contact.value.total_sent_email++
                }
                // addArrEmoji();

                // const textContent = this.$refs.inputbox.textContent.trim();
                // if (value.length) emit('send', String(value));
                // clearTimeout(this.typingTimeout);
                // this.stopTyping();
            }
            return { msgData, imgUpload };
        };

        emitter.on('confirmSendEmail', () => {
            onSendMessage(true);
        });

        emitter.on('confirmSendMessageInApp', () => {
            onSendMessage(true);
        });

        const onSetImageDefault = () => {
            recountImageUpload();
            setButtonDeleteFunction();
        };

        const onClickPlaceHolder = () => {
            contenteditable.value.focus();
        };
        const resetContenteditable = () => {
            content.value = '';
            contentNote.value = '';
            contenteditable.value.textContent = '';
            isShowPlaceholder.value = true;
            disabledButtonSend.value = true;
            isShowUploadError.value = false;
            filesUploadError.value = [];
            filesUpload.value = [];
            imagesUpload.value = 0;
            setCaret(contenteditable.value, 0);
        };
        const onCloseDropdownCannedResponse = () => {
            showDropdownCannedResponse.value = false;
        };
        const onSelectCannedResponse = (item) => {
            tooltipKey.value++;
            console.log('select canned nè', item);
            addCanned(item);
            keyWordCannedValues.value = null;
            cannedResponses.value = [];
        };
        const removeFileUpload = (index) => {
            filesUpload.value.splice(index, 1);
            if (!filesUpload.value.length && isTextComposerBlank()) {
                disabledButtonSend.value = true;
            }
        };

        // watch(lastEditRange, () => {
        //     console.log({ lastEditRange });
        // });

        watch(imagesUpload, () => {
            console.log('update', contenteditable.value?.innerHTML);
            emit('update:modelValue', contenteditable.value?.innerHTML);
        });

        watch(router.currentRoute, (newVal, oldVal) => {
            if (
                oldVal.params.conversation !== undefined &&
                newVal.params.conversation !== undefined &&
                oldVal.params.conversation !== newVal.params.conversation
            ) {
                resetContenteditable();
                tooltipKey.value = tooltipKey.value + 1;
            } else if (
                oldVal.params.name !== undefined &&
                newVal.params.name !== undefined &&
                oldVal.params.name !== newVal.params.name
            ) {
                resetContenteditable();
                tooltipKey.value = tooltipKey.value + 1;
            }
            if (newVal.name === 'InboxSearch') {
                resetContenteditable();
            }

        });
        watch(
            () => showDropdownCannedResponse.value,
            (newVal) => {
                onClickOutsideCanned();
            },
        );

        emitter.on('onDropFileInbox', async (file) => {
            if (!props.is_whisper) {
                await onDropFile(file, props.type);
                await nextTick();
                isShowPlaceholder.value = isTextComposerBlank();
                if ((!filesUpload.value.length && !isTextComposerBlank()) || filesUpload.value.length) {
                    disabledButtonSend.value = false;
                } else {
                    disabledButtonSend.value = true;
                }
            } else {
                onAttachImage(file, props.type);
                isShowPlaceholder.value = false;
                disabledButtonSend.value = false;
            }
        });
        emitter.on('resetComposer', () => {
            resetContenteditable();
        });

        onMounted(() => {
            setCaret(contenteditable.value, 0);
        });

        watch(
            () => props.is_whisper,
            () => {
                if (!props.is_whisper) {
                    contentNote.value = contenteditable.value.innerHTML;
                    contenteditable.value.innerHTML = content.value;
                } else {
                    content.value = contenteditable.value.innerHTML;
                    contenteditable.value.innerHTML = contentNote.value;
                }
                isShowPlaceholder.value = contenteditable.value.innerHTML === '';
                disabledButtonSend.value = contenteditable.value.innerHTML === '';
                isShowUploadError.value = false;
                if (contenteditable.value.innerHTML === '') setCaret(contenteditable.value, 0);
                filesUploadError.value = [];
                filesUpload.value = [];
                onSetImageDefault();
            },
        );

        return {
            onSetImageDefault,
            handleCopy,
            handleRightClick,
            handlePaste,
            onInput,
            handleKeydown,
            onClickPlaceHolder,
            content,
            isShowPlaceholder,
            onSendMessage,
            contenteditable,
            getCursorPos,
            handleBlur,
            lastEditRange,
            addEmoji,
            showDropdownEmoji,
            onAttachImage,
            isShowModalMaximumImage,
            isShowUploadError,
            imagesUpload,
            addImage,
            handleKeyUp,
            handleClick,
            keyWordMentionValues,
            isNote,
            showDropdownCannedResponse,
            userDataByKeyword,
            tooltipKey,
            onSelectMentionValue,
            addCanned,
            cannedUsed,
            showModalAlertFullImage,
            cannedResponses,
            keyWordCannedValues,
            onSelectCannedResponse,
            disabledButtonSend,
            userList,
            onCloseDropdownCannedResponse,
            onClickOutsideMention,
            onClickOutsideCanned,
            addFile,
            filesUpload,
            isShowModalMaximumFile,
            filesUploadError,
            filters,
            removeFileUpload,
            isUploadingFile,
        };
    },
};
</script>

<style lang="scss">
.composer-contenteditable {
    &__contentedit {
        min-width: 100px;
        overflow-wrap: break-word;
        overflow-y: auto;
        word-break: break-all;
        cursor: auto;
        > div {
            min-height: 37px;
        }
    }
    &__image {
        max-width: 100%;
        position: relative;
        display: inline-block;
        vertical-align: top;
        .composer-contenteditable__btn-delete {
            display: flex;
            position: absolute;
            top: 6px;
            right: 6px;
            width: 16px;
            height: 16px;
            align-items: center;
            justify-content: center;
            background-color: #ffffff;
            border-radius: 50%;
            cursor: pointer;
            filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.3));
            z-index: 2;
            opacity: 0;
        }
        .composer-contenteditable__overlay {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(255, 255, 255, 0.5);
            z-index: 1;
            opacity: 0;
        }
        &:hover {
            .composer-contenteditable__overlay,
            .composer-contenteditable__btn-delete {
                opacity: 1;
            }
        }
        &--loading {
            border: 1px solid #e9e9ec;
            background-color: #f6f6f8;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    &__file {
        &--uploading {
            position: relative;
            &:after {
                content: '';
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 1px solid #e2ecff;
                position: absolute;
                top: 0;
                left: 0;
            }
            & > span {
                width: 50%;
                height: 100%;
                overflow: hidden;
                position: absolute;
                top: 0;
                z-index: 1;
            }
            .progress-left {
                left: 0;
            }
            .progress-bar {
                width: 100%;
                height: 100%;
                background: none;
                border-width: 1px;
                border-style: solid;
                border-color: #3e6dda;
                position: absolute;
                top: 0;
            }
            .progress-left .progress-bar {
                left: 100%;
                border-top-right-radius: 80px;
                border-bottom-right-radius: 80px;
                border-left: 0;
                -webkit-transform-origin: center left;
                transform-origin: center left;
                animation: progress-left 1.5s linear forwards 1.8s;
            }
            .progress-right {
                right: 0;
            }
            .progress-right .progress-bar {
                left: -100%;
                border-top-left-radius: 80px;
                border-bottom-left-radius: 80px;
                border-right: 0;
                -webkit-transform-origin: center right;
                transform-origin: center right;
                animation: progress-right 1.8s linear forwards;
            }
        }
    }
}
.img-emoji-compose {
    background: none !important;
}
.composer-note {
    .composer-contenteditable__contentedit.scrollbar--transparent::-webkit-scrollbar-thumb {
        border: 4px solid #fff6d6;
    }
}
span.mention.highlight {
    background: #e1ecf4;
    border: 1px dotted #39739d;
}
@keyframes progress-right {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
    }
}
@keyframes progress-left {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(170deg);
        transform: rotate(170deg);
    }
}
</style>
