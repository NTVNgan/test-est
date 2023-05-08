<template>
    <Toolbar :class="customToolbarClass" @format="handleFormat" @upload="handleUpload" :editor="editor"></Toolbar>
    <EditorContent class="mt-16p rounded-4p mb-16p" :editor="editor" />
    <div :key="bubbleLinkKey">
        <BubbleLink :editor="editor" />
    </div>
    <inbox-composer-upload-error
        headerTitle="Upload errors"
        v-model:errorData="filesUploadError"
        v-model:showUploadError="isShowUploadError"
    />
</template>

<script type="ts">
import { inject, unref, ref, onMounted } from 'vue';
import Toolbar from './Toolbar.vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import BubbleLink from './BubbleLink.vue';
// import customImage from './ImageCustomExtention/ImageCustomExtension.ts';
import { services } from '@/modules/inbox/services';
import { useI18n } from 'vue-i18n';
import { isActive } from '@tiptap/core';
import InboxComposerUploadError from '@/modules/inbox/components/InboxComposerUploadError.vue';
import CharacterCount from '@tiptap/extension-character-count';

export default {
    name: 'TextEditorComponent',
    components: {
        Toolbar,
        EditorContent,
        BubbleLink,
        InboxComposerUploadError,
    },
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        customToolbarClass: {
            type: String,
            default: '',
        },
        defaultData: {
            type: String,
        },
        featureType: {
            type: String,
            default: 'conversation',
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const envUserURL = process.env.VUE_APP_FILE_URL;
        const validImageType = ref(['image/jpeg', 'image/png', 'image/jpg']);
        const validFileSize = ref(10 * 1024 * 1024);
        const imagesUpload = ref(0);
        const bubbleLinkKey = ref(0);
        const imagesUploadSuccess = ref([]);
        const filesUploadError = ref([]);
        const isShowUploadError = ref(false);
        const emitter = inject('emitter');
        const { t } = useI18n();
        const CustomLink = Link.extend({
            priority: 1000,
        });

        emitter.on('ArticleScroll', (e) => {
            console.log({ e });
            bubbleLinkKey.value++;
        });

        const editor = useEditor({
            extensions: [
                StarterKit,
                Placeholder.configure({
                    placeholder: 'Start writing...',
                }),
                TextAlign.configure({
                    types: ['heading', 'paragraph', 'codeBlock', 'code'],
                }),
                Heading.configure({
                    levels: [1, 2, 3],
                }),
                CustomLink.configure({
                    openOnClick: false,
                }),
                CharacterCount.configure({
                    limit: 20000,
                }),
                Image,
            ],
            onUpdate: ({ editor }) => {
                emit('update:modelValue', editor.getHTML());
            },
        });
        const resetInputUpload = (id) => {
            const input = document.getElementById(id);
            input.value = '';
        };
        const checkValidImage = (file) => {
            if (file.size === 0) {
                return t('inbox.inbox_upload_file_error_empty');
            }
            if (!validImageType.value.includes(file.type) && file.size > validFileSize.value) {
                return t('inbox.inbox_upload_file_error_format_and_size');
            }
            if (!validImageType.value.includes(file.type)) {
                return t('inbox.inbox_upload_file_error_format');
            }
            if (file.size > validFileSize.value) {
                return t('inbox.inbox_upload_file_error_size');
            }
            return '';
        };
        const onAttachImage = async (files) => {
            const formData = new FormData();
            const headerParams = {
                'file-type': 2,
                'feature-type': props.featureType,
            };
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                if (imagesUpload.value < 20) {
                    if (checkValidImage(file) !== '') {
                        filesUploadError.value.unshift({
                            error: `${file.name} ${checkValidImage(file)}`,
                        });
                    } else {
                        imagesUpload.value++;
                        formData.append('file', file);
                    }
                } else {
                    filesUploadError.value.unshift({
                        error: `${file.name} ${t('inbox.inbox_upload_image_error_full')}`,
                    });
                }
            }
            if (filesUploadError.value.length) {
                isShowUploadError.value = true;
            }
            if (imagesUpload.value > 0 && imagesUpload.value <= 20) {
                const res = await services.uploadFile(formData, headerParams);
                if (!res.data.error) {
                    imagesUploadSuccess.value = res.data.data;
                    const imageList = imagesUploadSuccess.value.map((item) => {
                        return {
                            type: 'image',
                            attrs: {
                                src: `${envUserURL}/${item.url}`,
                            },
                        };
                    });
                    unref(editor).chain().focus().insertContent(imageList).run();
                }
            }
            resetInputUpload('upload-image-texteditor');
        };
        const handleFormat = ({ type }) => {
            const isTextAlignCenter = unref(editor).isActive({ textAlign: 'center' });

            switch (type) {
                case 'h0':
                    if (unref(editor).isActive('heading', { level: 1 }))
                        unref(editor).chain().focus().toggleHeading({ level: 1 }).run();
                    else if (unref(editor).isActive('heading', { level: 2 }))
                        unref(editor).chain().focus().toggleHeading({ level: 2 }).run();
                    break;
                case 'h1':
                    unref(editor).chain().focus().toggleHeading({ level: 1 }).run();
                    if (isTextAlignCenter) unref(editor).chain().focus().setTextAlign('center').run();
                    break;
                case 'h2':
                    unref(editor).chain().focus().toggleHeading({ level: 2 }).run();
                    if (isTextAlignCenter) unref(editor).chain().focus().setTextAlign('center').run();
                    break;
                case 'link':
                    unref(editor).commands.setLink({ href: '' });
                    // emitter.off('openLink');
                    emitter.emit('openLink');
                    break;
                case 'bold':
                    unref(editor).chain().focus().toggleBold().run();
                    break;
                case 'italic':
                    unref(editor).chain().focus().toggleItalic().run();
                    break;
                case 'code':
                    unref(editor).chain().focus().toggleCode().run();
                    break;
                case 'code-block':
                    unref(editor).chain().focus().toggleCodeBlock().run();
                    break;
                case 'align-left':
                    unref(editor).chain().focus().setTextAlign('left').run();
                    break;
                case 'align-center':
                    unref(editor).chain().focus().setTextAlign('center').run();
                    break;
                case 'list-ol':
                    unref(editor).chain().focus().toggleOrderedList().run();
                    break;
                case 'list-ul':
                    unref(editor).chain().focus().toggleBulletList().run();
                    break;
            }
        };
        const handleUpload = ({ files, type }) => {
            switch (type) {
                case 'image':
                    onAttachImage(files);
                    break;
            }
        };

        onMounted(() => {
            unref(editor).commands.setContent(props.defaultData);
        });

        return {
            handleFormat,
            handleUpload,
            editor,
            bubbleLinkKey,
            filesUploadError,
            isShowUploadError,
        };
    },
};
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
    h1 {
        font-size: 24px;
        line-height: 32px;
        font-weight: 600;
    }
    h2 {
        font-size: 16px;
        line-height: 24px;
        font-weight: 700;
    }
    outline: none;
    > * + * {
        margin-top: 0.75em;
    }

    a {
        text-decoration: underline;
        color: #3e6dda;
    }

    ul,
    ol {
        padding: 0 1rem;
    }

    ul {
        list-style-type: disc;
        ul {
            list-style-type: circle;
            ul {
                list-style-type: square;
            }
        }
    }

    ol {
        list-style: auto;
    }

    pre {
        background: #0d0d0d;
        color: #fff;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;

        code {
            color: inherit;
            padding: 0;
            background: none;
            font-size: 0.8rem;
        }
    }
    img {
        max-width: 100%;
        height: auto;
        border: 3px solid transparent;
    }
    &.ProseMirror-focused {
        img.ProseMirror-selectednode {
            border: 3px solid #3E6DDA;
        }
    }
}

/* Placeholder (at the top) */
.ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
}

/* Placeholder (on every new line) */
/*.ProseMirror p.is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}*/
</style>