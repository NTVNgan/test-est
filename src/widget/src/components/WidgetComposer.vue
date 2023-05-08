<template>
    <div>
        <!-- <WidgetComposerImageSlide @change="onChangeDataImageUpload"/> -->
        <WidgetComposerImageSlide v-if="!isDemoMode" />
        <div class="widget-composer__container" :class="{ 'none-img': hideIconImg }">
            <div class="widget-composer" :style="isDemoMode ? 'flex-grow: 1' : ''">
                <div class="widget-composer__wp">
                    <span class="widget-composer__wp-placeholder" v-if="isShowPlaceholder" @click="onClickPlaceHolder"
                        >Type your message...</span
                    >
                    <div
                        class="widget-composer__wp-contentedit"
                        id="linebase_composer"
                        ref="contenteditable"
                        contenteditable
                        @paste="handlePaste"
                        @input="onInput"
                        @keydown="handleKeydown"
                        @blur="handleBlur"
                    ></div>
                </div>
                <div
                    class="widget-composer__send-icon"
                    v-if="content.trim() || !isShowPlaceholder"
                    @click="onSendMessage"
                >
                    <paper-plane-icon />
                </div>
            </div>
            <Tooltip
                size="small"
                type="dark"
                position="top"
                content="Add an emoji"
                v-if="!isDemoMode || (isDemoMode && settings && settings.widget_behavior.compose_emoji)"
            >
                <new-dropdown-component
                    v-model="showDropdown"
                    width="228px"
                    :class="showDropdown && !isDemoMode ? 'icon-emoji' : ''"
                    label="Tooltip"
                    position="top-left"
                >
                    <Emoji class="widget-composer__emoji-btn" />
                    <template #content>
                        <EmojiPicker v-if="!isDemoMode" @add-emoji="addEmoji" :contactVisitor="contactVisitor" />
                    </template>
                </new-dropdown-component>
            </Tooltip>
            <WidgetComposerImage
                v-if="!isDemoMode || (isDemoMode && settings && settings.widget_behavior.upload_file)"
                :isDemoMode="isDemoMode"
            />
        </div>
    </div>
</template>

<script>
import PaperPlaneIcon from './icons/PaperPlane.vue';
import Emoji from './icons/Emoji.vue';
import { watch, ref, inject, onMounted, computed } from 'vue';
import CONSTANTS from '../constants/constants';
import NewDropdownComponent from './WidgetDropdown.vue';
import EmojiPicker from './emoji/index.ts';
import database, { dbName } from '../database.ts';
import Tooltip from './WidgetTooltip.vue';
import WidgetComposerImage from './WidgetComposerImage.vue';
import WidgetComposerImageSlide from './WidgetComposerImageSlide.vue';
import { useToggleWidgetBox } from '../composables/useToggleWidgetBox';

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

const useEmoji = (lastEditRange, contenteditable) => {
    const positionEmoji = (position) => {
        const width = 5200 / 2652;
        console.log({ width, position });
        return width * position + '%';
    };

    const prepareEmoji = (val) => {
        console.log({ val });
        const positionX = positionEmoji(val.sheet_x);
        const positionY = positionEmoji(val.sheet_y);
        // const r = decodeURIComponent(val.unified.replace('-',' ').replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
        const codepointArray = val.unified.split('-').map((item) => `0x${item}`);
        // console.log({codepointArray})
        // console.log(String.fromCodePoint(...codepointArray))
        const emojiText = String.fromCodePoint(...codepointArray);
        const blankTextNodeInside = document.createTextNode(emojiText);
        const spanNodeInside = document.createElement('span');
        spanNodeInside.contentEditable = false;
        const spanNode = document.createElement('span');
        // spanNode.style.backgroundPosition = `${positionX} ${positionY} `;
        spanNode.contentEditable = false;
        spanNode.dataset.text = emojiText;
        spanNode.dataset.code = val.unified;
        spanNode.style.paddingRight = '1px';
        spanNode.style.backgroundImage = 'none';
        // spanNode.style.transform="translateY(-4px)";
        spanNode.dataset.positionX = positionX;
        spanNode.dataset.positionY = positionY;
        spanNode.classList.add('img-emoji');
        // spanNode.classList.add('img-emoji-compose');
        spanNode.appendChild(blankTextNodeInside);
        spanNode.appendChild(spanNodeInside);
        spanNode.appendChild(blankTextNodeInside);
        return val.category === 'Skin Tones' ? spanNode : blankTextNodeInside;
    };

    const insertEmoji = (val) => {
        const emojiNode = prepareEmoji(val);
        console.log('emoji', lastEditRange.value);
        if (lastEditRange.value !== null) {
            const { startContainer, startOffset } = lastEditRange.value;
            console.log('emoji', startContainer.className);
            if (startContainer.className && startContainer.className.includes('widget-composer__wp-contentedit')) {
                if (startContainer.childNodes.length === 0 || startContainer.childNodes.length == startOffset) {
                    contenteditable.value.appendChild(emojiNode);
                    setCaret(
                        contenteditable.value,
                        Array.from(contenteditable.value.childNodes).indexOf(emojiNode) + 1,
                    );
                } else {
                    startContainer.insertBefore(emojiNode, startContainer.childNodes[startOffset]);
                    setCaret(startContainer, startOffset + 1);
                }
            } else {
                if (startContainer.nodeName === '#text') {
                    const parentNode = startContainer.parentElement;
                    if (parentNode.className === 'mention' && startOffset === 0) {
                        const parentMentionNode = parentNode.parentElement;
                        parentMentionNode.insertBefore(emojiNode, parentNode);
                        setCaret(parentMentionNode, Array.from(parentMentionNode.childNodes).indexOf(emojiNode) + 1);
                    } else {
                        parentNode.className === 'mention' && (parentNode.className = '');
                        // Split node to 2 child node
                        const childNodeStart = document.createTextNode(startContainer.nodeValue.slice(0, startOffset));
                        const childNodeEnd = document.createTextNode(
                            startContainer.nodeValue.slice(startOffset, startContainer.nodeValue.length),
                        );
                        parentNode.insertBefore(childNodeStart, startContainer);
                        parentNode.insertBefore(emojiNode, startContainer);
                        parentNode.insertBefore(childNodeEnd, startContainer);
                        parentNode.removeChild(startContainer);
                        Array.from(parentNode.childNodes).indexOf(emojiNode);
                        setCaret(parentNode, Array.from(parentNode.childNodes).indexOf(emojiNode) + 1);
                    }
                }
                if (startContainer.nodeName === 'SPAN') {
                    startContainer.insertBefore(emojiNode, startContainer.childNodes[startOffset]);
                    setCaret(startContainer, startOffset + 1);
                }
            }
        } else {
            contenteditable.value.appendChild(emojiNode);
            setCaret(contenteditable.value, Array.from(contenteditable.value.childNodes).indexOf(emojiNode) + 1);
        }
    };
    return { insertEmoji };
};

const setCusorToLast = () => {
    const el = document.getElementById('linebase_composer');
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.addRange(range);
    el.focus();
};

export default {
    name: 'WidgetComposer',
    components: {
        PaperPlaneIcon,
        Emoji,
        NewDropdownComponent,
        EmojiPicker,
        Tooltip,
        WidgetComposerImage,
        WidgetComposerImageSlide,
    },
    props: {
        typingFunc: {
            type: Function,
            default: null,
        },
        test: {
            type: Number,
            default: null,
        },
    },
    emits: ['send', 'blur', 'update:modelValue'],
    setup(props, { attrs, slots, emit }) {
        const content = ref('');
        const isShowPlaceholder = ref(true);
        const isTyping = ref(false);
        const contenteditable = ref(null);
        const lastEditRange = ref(null);
        const socket = inject('socket');
        const { org_id, workspace_id, conversation_id, _id: sender_id } = inject('contact');
        const showDropdown = ref(false);
        const { insertEmoji } = useEmoji(lastEditRange, contenteditable);
        const contactInfoID = ref();
        const emitter = inject('emitter');
        const contactVisitor = ref('');
        const valueFileImage = ref([]);
        const convertTagImg = ref([]);
        const hideIconImg = ref(false);
        const { isShowWidgetBox } = useToggleWidgetBox();
        const isDemoMode = inject('isDemoMode');
        const settings = inject('settingWidgetValues');

        watch(isShowWidgetBox, () => {
            if (isShowWidgetBox) contenteditable.value.focus();
        });

        emitter.on('contactId', async (data) => {
            if (data) {
                contactInfoID.value = data;
                contactVisitor.value = data;
            }
        });

        const standardizedText = (contentNode) => {
            contentNode.innerText.trim();
            //Phân tách content
            const content = Array.from(contentNode.childNodes).reduce((arr, cur) => {
                let text;
                if (cur.nodeName === 'SPAN' && cur.className !== 'img-emoji' && cur.className !== 'mention') {
                    text = this.standardizedText(cur);
                } else if (cur.className == 'mention' && cur.innerText) {
                    text = `@<user/${cur.dataset.mentionId}>⌈⌊${cur.innerText}⌉⌋`;
                } else if (cur.nodeName == 'DIV' && !cur.className) {
                    text = '<br>' + cur.innerHTML;
                }
                //Trường hợp thẻ span trả về text, nếu trong đó có thẻ br trả về thẻ br
                else if (cur.nodeName == 'SPAN' && cur.className !== 'img-emoji') {
                    const node = document.createElement('input');
                    node.innerText = cur.innerText;
                    text = Array.from(cur.childNodes).reduce((arr, cur) => {
                        return `${arr}${cur.nodeName !== 'BR' ? `${cur.data && cur.data}` : '<br>'}`;
                    }, '');
                }
                //Trường hợp thẻ br
                else if (cur.nodeName == 'BR') text = '<br>';
                //Trường hợp text
                else if (cur.nodeName == '#text') {
                    text = escapeHTML(cur.data);
                }
                //Trường hợp emoji
                else if (cur.className == 'img-emoji') {
                    let positionX, positionY;
                    //Vị trí position có thể nằm trong dataset hoặc style tùy vào phần contentNode lấy từ đâu
                    if (cur.dataset.positionX && cur.dataset.positionY) {
                        positionX = cur.dataset.positionX;
                        positionY = cur.dataset.positionY;
                    } else {
                        positionX = cur.style.backgroundPositionX;
                        positionY = cur.style.backgroundPositionY;
                    }
                    text = `▄▄▄U+${cur.dataset['code']},${positionX},${positionY}▄▄▄`;
                }
                return `${arr}${text}`;
            }, '');
            return String(content);
        };

        const isTextComposerBlank = () => {
            return (
                !contenteditable.value.innerText.trim().length &&
                !String(contenteditable.value.innerHTML).includes('img-emoji')
            );
        };

        const getCursorPos = () => {
            lastEditRange.value = window.getSelection().getRangeAt(0);
        };

        const handleBlur = () => {
            if (!contenteditable.value) {
                return;
            }
            getCursorPos();
            const inputContent = contenteditable.value.innerHTML;
            if (!inputContent.length) {
                if (valueFileImage.value.length > 0) {
                    isShowPlaceholder.value = false;
                } else {
                    isShowPlaceholder.value = true;
                }
            } else {
                isShowPlaceholder.value = false;
            }
            emit('blur');
        };

        const handlePaste = (event) => {
            event.preventDefault();
            if (!(event.clipboardData && event.clipboardData.items)) {
                return false;
            }
            const items = event.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    const URLObj = window.URL || window.webkitURL;
                    const source = URLObj.createObjectURL(blob);
                    // this.uploadSingleFile(blob);
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

        const count = (names) => names.reduce((a, b) => ({ ...a, [b]: (a[b] || 0) + 1 }), {});

        const duplicates = (dict) => Object.keys(dict).filter((a) => dict[a] > 5);

        const saveToIndexedDB = async (emojis) => {
            const emojiDB = await database.getItem(dbName.listEmoji);
            const chatEmojiDB = await database.getItem(dbName.emoji);

            const userEmojiBD = emojiDB ? emojiDB[contactInfoID.value] : [];
            let chatUserEmojiBD = chatEmojiDB ? chatEmojiDB[contactInfoID.value] : [];

            if (chatUserEmojiBD.length > 0) {
                if (!chatUserEmojiBD.includes(emojis)) {
                    userEmojiBD.unshift(emojis);
                    emojiDB[contactInfoID.value] = userEmojiBD;
                    database.setItem(dbName.listEmoji, emojiDB);
                    const numberDup = duplicates(count(userEmojiBD));

                    chatEmojiDB[contactInfoID.value] = numberDup;
                    database.setItem(dbName.emoji, chatEmojiDB);
                } else {
                    chatUserEmojiBD = chatUserEmojiBD.filter((item) => item !== emojis);
                    chatUserEmojiBD.unshift(emojis);

                    chatEmojiDB[contactInfoID.value] = chatUserEmojiBD;
                    database.setItem(dbName.emoji, chatEmojiDB);
                }
            } else {
                userEmojiBD.unshift(emojis);
                emojiDB[contactInfoID.value] = userEmojiBD;
                database.setItem(dbName.listEmoji, emojiDB);
                const numberDup = duplicates(count(userEmojiBD));

                chatEmojiDB[contactInfoID.value] = numberDup;
                database.setItem(dbName.emoji, chatEmojiDB);
            }
        };

        const convertImage = () => {
            const tagImg = valueFileImage.value.map((img) => {
                return {
                    _id: img.id,
                    name: img.name,
                    src: img.url,
                    type: CONSTANTS.MESSAGE_ATTACHMENT_TYPE.IMAGE,
                };
            });
            convertTagImg.value = tagImg;
        };

        emitter.on('valueFile', (data) => {
            valueFileImage.value = data;
            convertImage();
            if (data.length > 0) {
                isShowPlaceholder.value = false;
                contenteditable.value.focus();
            } else {
                isShowPlaceholder.value = true;
            }
        });

        const onSendMessage = () => {
            const contentNode = contenteditable.value.cloneNode(true);
            const isTextBlank = isTextComposerBlank();
            const msgData = {
                type: '',
                content: '',
                attachments: [],
            };

            if (!isTextBlank) {
                const value = standardizedText(contentNode);

                if (valueFileImage.value.length == 0 && value) {
                    msgData.type = 1;
                    msgData.content = value;
                } else if (valueFileImage.value.length > 0 && value) {
                    msgData.attachments = convertTagImg.value;
                    msgData.content = value;
                    msgData.type = '';
                }

                // var textContent = this.$refs.inputbox.textContent.trim();
                // if (value.length) emit('send', String(value));
                if (value.length) emit('send', msgData);
                // clearTimeout(this.typingTimeout);
                // this.stopTyping();
            } else {
                if (valueFileImage.value.length > 0) {
                    msgData.type = 3;
                    msgData.attachments = convertTagImg.value;

                    emit('send', msgData);
                }
            }
            valueFileImage.value = [];
            content.value = '';
            contenteditable.value.textContent = '';
            isShowPlaceholder.value = true;
            hideIconImg.value = false;
            emitter.emit('closeSlideWidget', true);
        };

        let timeout;
        const customerTyping = () => {
            // eslint-disable-next-line prefer-const
            props.typingFunc && props.typingFunc();

            clearTimeout(timeout);
            const params = {
                org_id,
                workspace_id,
                convo_id: conversation_id,
                sender_id,
                type: 'start',
                sender_type: 2,
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
            !isDemoMode && customerTyping();
            if (e.keyCode === 13 && !e.shiftKey) {
                e.returnValue = false;
                onSendMessage();
            }
            content.value = e.target.innerText;
            isShowPlaceholder.value = !contenteditable.value.innerHTML.length;
            // getCursorPos();
        };

        const handleKeydown = (event) => {
            if (event.keyCode === 13 && !event.shiftKey) {
                event.returnValue = false;
                onSendMessage();
                showDropdown.value = false;
            }
        };

        const insertHandler = (val, type = '') => {
            isShowPlaceholder.value = false;
            switch (type) {
                case 'emoji':
                    // code block
                    saveToIndexedDB(val.unified);
                    return insertEmoji(val);
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
            const dummy = {
                name: 'FACE THROWING A KISS',
                unified: '1F618',
                non_qualified: null,
                docomo: 'E726',
                au: 'EACF',
                softbank: 'E418',
                google: 'FE32C',
                image: '1f618.png',
                sheet_x: 30,
                sheet_y: 48,
                short_name: 'kissing_heart',
                short_names: ['kissing_heart'],
                text: null,
                texts: [':*', ':-*'],
                category: 'Smileys & People',
                sort_order: 14,
                added_in: '6.0',
                has_img_apple: true,
                has_img_google: true,
                has_img_twitter: true,
                has_img_emojione: true,
                has_img_facebook: true,
                has_img_messenger: true,
            };
            insertHandler(val, 'emoji');
            isShowPlaceholder.value = false;
        };

        const onClickPlaceHolder = () => {
            contenteditable.value.focus();
        };

        emitter.on('dnoneIcon', (data) => {
            hideIconImg.value = data;
        });

        watch(content, () => {
            !isDemoMode && customerTyping();
        });

        return {
            isDemoMode,
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
            showDropdown,
            contactInfoID,
            contactVisitor,
            valueFileImage,
            convertImage,
            convertTagImg,
            hideIconImg,
            settings,
            // onChangeDataImageUpload
        };
    },
};
</script>

<style lang="scss">
.widget-composer {
    display: flex;
    // width: -webkit-fill-available;
    display: flex;
    max-height: 180px;
    z-index: 1;
    position: relative;
    background: #f2f2f2;
    border-radius: 20px;
    padding: 10px 16px;
    box-sizing: border-box;
    width: calc(100% - 48px);
    margin-right: 8px;
    &__container {
        display: flex;
        align-items: center;
        padding: 0 16px;
        // min-height: 40px;
        .dropdown__title {
            width: 40px;
            height: 100%;
            text-align: center;
            margin: 0px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgb(242, 242, 242);
            cursor: pointer;
            border-radius: 50%;
            &.icon-emoji {
                background: #fff6d6;
                .widget-composer__emoji-btn {
                    > path {
                        fill: #ffb800;
                    }
                }
            }
        }
        .tooltip__title {
            height: 40px;
        }
        &.none-img {
            .widget-composer {
                width: calc(100% - 48px);
            }
        }
    }
    &__emoji-btn {
        cursor: pointer;
        width: 20px;
        height: 20px;
    }
    &__send-icon {
        height: 20px;
        position: relative;
        align-self: flex-end;
        cursor: pointer;
        > div {
            position: absolute;
            bottom: 0;
        }
    }
    &__attach-border {
        width: 40px;
        height: 100%;
        text-align: center;
        margin: 0px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f2f2f2;
        cursor: pointer;
        border-radius: 50%;
    }
    &__wp {
        flex-grow: 1;
        margin-right: 8px;
        max-height: 160px;
        overflow-wrap: break-word;
        overflow-y: auto;
        word-break: break-all;
        cursor: auto;
        &-placeholder {
            position: absolute;
            color: #828292;
            font-size: 14px;
            line-height: 20px;
            pointer-events: none;
        }
        &-contentedit {
            // width: 100%;
            font-size: 14px;
            line-height: 20px;
            outline: none;
            overflow-wrap: break-word;
            // overflow-y: auto;
            word-break: break-word;
            cursor: auto;
            margin-right: 8px;
            // > div {
            //     min-height: 37px;
            // }
        }
        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;
            padding: 0 30px;
            width: 6px;
        }
        &::-webkit-scrollbar-thumb {
            background: transparent;

            border-radius: 8px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: transparent;
        }
        &:hover {
            &::-webkit-scrollbar {
                width: 6px;
            }
            &::-webkit-scrollbar-track {
                background: transparent;
                padding: 0 30px;
                width: 6px;
            }
            &::-webkit-scrollbar-thumb {
                background: #b4b4be;
                border-radius: 8px;
            }
            &::-webkit-scrollbar-thumb:hover {
                background: #b4b4be;
            }
        }
    }
}
.img-emoji {
    width: 16px;
    height: 16px;
    transform: translateY(-2px);
    margin-bottom: -6px;
    object-fit: cover;
    display: inline-block;
    background-size: 5200%;
    background-image: var(--linebase-resource-url);
    &-only {
        width: 40px !important;
        height: 40px !important;
    }
}
</style>
