<template>
    <div class="inbox-composer">
        <card-component class="py-12p flex flex-col h-full cursor-text" type="shadow" @click="contenteditable.focus()">
            <span
                class="px-16p text-14 absolute text-neutrals-200"
                v-if="isShowPlaceholder"
                @click="contenteditable.focus()"
                >Type your first message</span
            >
            <div class="ml-16p mr-4p inbox-composer__contentedit flex-grow">
                <div
                    class="text-14 mr-12p outline-none"
                    ref="contenteditable"
                    contenteditable
                    @paste="handlePaste"
                    @input="onInput"
                    @keydown="handleKeydown"
                ></div>
            </div>
            <div v-if="!isHideBtn" class="self-end mt-20p px-16p">
                <button-component icon="paper-plant" size="medium" :disabled="!content.trim()" @click="onSendMessage">{{
                    $t('inbox.inbox_composer_button_send')
                }}</button-component>
            </div>
        </card-component>
    </div>
</template>

<script type="ts">
import { ref, watch, computed, inject } from 'vue';
import CardComponent from '@/components/ui/CardComponent.vue';
import ButtonComponent from '@/components/ui/ButtonComponent.vue';
import { useSocket } from '@/composables/useSocket';
import { store } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { routerPush } from '@/router';
import { useInbox } from '@/modules/inbox/composables/useInbox';
import { useInboxPushingHandler } from '@/modules/inbox/composables/useInboxPushingHandler';
import CONSTANTS from '@/modules/inbox/constants/constants';

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
    name: 'ContactComposer',
    components: {
        ButtonComponent,
        CardComponent,
    },
    props: {
        isHideBtn: {
            default: false,
        },
    },
    emits: ['update:modelValue', 'change'],

    setup(props, { emit }) {
        const { assignUserToConversation } = useInbox();
        const { socket } = useSocket();
        const content = ref('');
        const isShowPlaceholder = ref(true);
        const contenteditable = ref(null);
        const user = computed(() => store.state.auth.user);
        const router = useRouter();
        const route = useRoute();
        const { org_id, workspace_id, _id: sender_id, username: sender, avatar_bg, avatar_src } = user.value;
        const convo_id = computed(() => route.params.conversation);
        const group_name = computed(() => route.params.name);
        const convoId = computed(() => route.params.conversation);
        const emitter = inject('emitter');
        const onInput = (e) => {
            content.value = e.target.innerText;
            emit('update:modelValue', content.value);
            isShowPlaceholder.value = !content.value;
        };

        const onSendMessage = async () => {
            // if (content.value.trim()) {
            //     const currConvoTemp = currConvo.value;
            //     if (currConvoTemp) {
            //         currConvoTemp.last_message.content = contenteditable.value.innerText.trim();
            //         currConvoTemp.last_message.created_at = new Date();
            //         currConvoTemp.last_message_send_by_me = true;
            //         if (group_name.value === 'unassign') {
            //             // emitter.emit('changeAssignValue', 'You');
            //             await socket.emit('takeConversation', { convo_id: convo_id.value });
            //             setAddonConvo(currConvoTemp);
            //             await routerPush('InboxGroups', { name: 'assign_to_you', conversation: convoId.value });
            //             changeNumberGroup('unassign', 'assign_to_you');
            //         } else {
            //             console.log('is_assigned', currConvo.value.is_assigned);
            //             if (
            //                 Object.prototype.hasOwnProperty.call(currConvo.value, 'is_assigned') &&
            //                 !currConvo.value.is_assigned
            //             )
            //                 await socket.emit('takeConversation', { convo_id: convo_id.value });
            //             // moveExistConvoToTopConversations(currConvoTemp);
            //         }
            //     }
            //     const params = {
            //         org_id,
            //         workspace_id,
            //         convo_id: convo_id.value,
            //         content: contenteditable.value.innerText.trim(),
            //         sender_id,
            //         sender_type: CONSTANTS.SENT_BY.USER,
            //         sender,
            //         avatar_bg,
            //         username: sender,
            //         avatar_src: avatar_src != '' ? `${process.env.VUE_APP_FILE_URL}/${avatar_src}` : '',
            //         is_whisper: false,
            //         is_new_convo: route.query.is_clone !== undefined ? route.query.is_clone : false,
            //     };
            //     await socket.emit('sendMessage', params, (data) => console.log('Message Send', { data }));
            //     content.value = '';
            //     contenteditable.value.textContent = '';
            //     isShowPlaceholder.value = true;
            // }
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

        const handleKeydown = (event) => {
            // if (event.keyCode === 13 && !event.shiftKey) {
            //     event.returnValue = false;
            //     onSendMessage();
            // }
        };

        const refreshComposer = () => {
            content.value = '';
            contenteditable.value.textContent = '';
            setCaret(contenteditable.value, 0);
            isShowPlaceholder.value = true;
        };

        emitter.on('closeModalSendMessage', () => {
            refreshComposer();
        });

        return {
            onInput,
            content,
            onSendMessage,
            contenteditable,
            isShowPlaceholder,
            handleKeydown,
            convo_id,
            handlePaste,
            refreshComposer,
        };
    },
};
</script>

<style lang="scss">
.inbox-composer {
    width: -webkit-fill-available;
    display: block;
    max-height: 360px;
    z-index: 1;
    &__contentedit {
        min-width: 100px;
        max-height: 260px;
        overflow-wrap: break-word;
        overflow-y: auto;
        word-break: break-all;
        cursor: auto;
        > div {
            min-height: 37px;
        }
        &::-webkit-scrollbar {
            width: 8px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;

            width: 16px;
        }
        &::-webkit-scrollbar-thumb {
            background: #e9e9ec;
            border-radius: 8px;
            // border: 4px solid #f6f6f8;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: #b4b4be;
        }
    }
}
</style>
