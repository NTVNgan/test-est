<template>
    <div class="input-tiptap">
        <div class="flex justify-between mb-4p">
            <label class="block text-14 font-normal text-neutrals-900 font-medium">{{ label }}</label>
            <div
                class="flex input-tiptap__tool"
                :class="{ 'input-tiptap__tool--open': showButtonTool || showDropdownEmoji || showDropdownAttribute }"
            >
                <tooltip-component
                    class="inline-flex text-neutrals-400"
                    size="small"
                    type="dark"
                    position="top"
                    content="Add an emoji"
                >
                    <new-dropdown-component
                        v-model="showDropdownEmoji"
                        width="228px"
                        class="
                            input-tiptap__dropdown-tool
                            w-20
                            h-20
                            flex
                            items-center
                            justify-center
                            rounded-l-4p
                            hover:bg-neutrals-300
                        "
                        :class="showDropdownEmoji ? 'bg-neutrals-600' : 'bg-neutrals-400'"
                        label="Tooltip"
                        position="top-left"
                        :paddingRange="4"
                        borderRadiusContent="8px"
                    >
                        <template #content>
                            <EmojiPicker frequentlyDBKey="widgetSetingEmoji" @add-emoji="addEmoji" />
                        </template>
                        <icon-component name="EmojiRegular12" color="white" />
                    </new-dropdown-component>
                </tooltip-component>
                <tooltip-component
                    class="inline-flex text-neutrals-400"
                    size="small"
                    type="dark"
                    position="top"
                    content="Add an attribute"
                >
                    <new-dropdown-component
                        v-model="showDropdownAttribute"
                        width="204px"
                        class="
                            input-tiptap__dropdown-tool
                            w-20
                            h-20
                            flex
                            items-center
                            justify-center
                            rounded-r-4p
                            hover:bg-neutrals-300
                        "
                        :class="showDropdownAttribute ? 'bg-neutrals-600' : 'bg-neutrals-400'"
                        label="Tooltip"
                        position="top-right"
                        :paddingRange="4"
                        borderRadiusContent="8px"
                    >
                        <template #content>
                            <list-component
                                class="mt-24p font-body language-list--selected"
                                v-model="variantSelected"
                                heightList="188px"
                                showSearch
                                placeholderSearch="Search attribute"
                            >
                                <list-item-component
                                    v-for="(item, index) in variantList"
                                    :key="'variant-' + index"
                                    :value="item"
                                >
                                    {{ item.name }}
                                </list-item-component>
                            </list-component>
                        </template>
                        <icon-component name="AttributeRegular12" color="transparent" />
                    </new-dropdown-component>
                </tooltip-component>
            </div>
            <slot name="optional" v-if="$slots.optional"></slot>
        </div>
        <div
            :class="[classInputContainer, { 'input-tiptap__input--focus': showDropdownEmoji || showDropdownAttribute }]"
            class="input-tiptap__input text-14 arrow-off relative rounded-4p flex items-baseline border transition"
            :style="[
                {
                    minHeight: height,
                },
            ]"
        >
            <div v-if="$slots.prefix" class="inset-y-0 ml-12p mr-8p flex items-center text-neutrals-500">
                <slot name="prefix"></slot>
            </div>
            <div
                class="relative w-fill min-w-0"
                :class="{
                    'pl-12p': !$slots.prefix,
                    'pr-12p': !counter && !$slots.suffix && !(closeIcon && valueSync && type !== 'number'),
                }"
            >
                <EditorContent
                    class="
                        input-tiptap__editor
                        neutrals-900
                        transition-all
                        ring
                        py-7p
                        pl-0
                        block
                        w-full
                        focus:outline-none
                        text-14
                    "
                    :editor="editor"
                />
            </div>
            <div
                v-if="counter"
                class="inset-y-0 right-0 ml-8p flex items-center"
                :class="(closeIcon && valueSync && type !== 'number') || $slots.suffix ? 'mr-8p' : 'mr-12p'"
            >
                <span
                    :class="[disabled ? 'text-neutrals-300' : 'text-neutrals-500']"
                    v-if="editor && counter && type !== 'number'"
                    >{{ `${editor.storage.characterCount.characters()}/${maxlength}` }}</span
                >
            </div>
            <div
                v-else-if="closeIcon && valueSync && type !== 'number'"
                class="inset-y-0 right-0 ml-8p mr-4p flex items-center w-8p"
            >
                <icon-component class="cursor-pointer" @click.stop.prevent="onClearText" name="times"></icon-component>
            </div>
            <div
                :class="(closeIcon && valueSync && type !== 'number') || counter ? 'mr-8p' : 'mr-12p'"
                v-if="$slots.suffix"
                class="inset-y-0 ml-8p flex items-center text-neutrals-500"
            >
                <slot v-if="$slots.suffix" name="suffix"></slot>
            </div>
        </div>
        <p class="mt-4p text-14 text-left flex" v-if="$slots.hint"><slot name="hint"></slot></p>
        <div :key="bubbleVariantFallbackKey">
            <BubbleVariantFallback :editor="editor" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, unref, watch, inject, nextTick } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { store } from '@/store';
import database, { dbName } from '@/database';
import IconComponent from './IconComponent.vue';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import NewDropdownComponent from '@/components/ui/NewDropdownComponent.vue';
import TooltipComponent from '@/components/ui/TooltipComponent.vue';
import ListComponent from '@/components/ui/ListComponent.vue';
import ListItemComponent from '@/components/ui/ListItemComponent.vue';
import EmojiPicker from '@/components/emoji';
import { Variant } from '@/components/ui/TextEditorComponent/VariantExtention/VariantExtention';
import BubbleVariantFallback from '@/components/ui/TextEditorComponent/BubbleVariantFallback.vue';
import { useAttribute } from '@/modules/setting/composables/useContactAttribute';
import CharacterCount from '@tiptap/extension-character-count';
export default defineComponent({
    name: 'InputTiptapComponent',
    components: {
        IconComponent,
        TooltipComponent,
        NewDropdownComponent,
        ListComponent,
        ListItemComponent,
        EmojiPicker,
        EditorContent,
        BubbleVariantFallback,
    },
    props: {
        label: {
            type: String,
            default: '',
        },
        state: {
            type: String,
            default: 'default',
        },
        type: {
            type: String,
            default: 'text',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: '',
        },
        closeIcon: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: String,
            default: '',
        },
        counter: {
            type: Boolean,
            default: false,
        },
        maxlength: {
            type: Number,
            default: undefined,
        },
        height: {
            type: String,
            default: 'auto',
        },
        preventEnter: {
            type: Boolean,
            default: false,
        },
        defaultData: {
            type: String,
            default: '',
        },
        variantList: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const editorTextLength = ref<number>(0);
        const textfieldComp = ref<any>(null);
        const states = ['error', 'default'];
        const isShowPassword = ref<boolean>(false);
        const showDropdownEmoji = ref<boolean>(false);
        const showDropdownAttribute = ref<boolean>(false);
        const showButtonTool = ref<boolean>(false);
        const isShowDropList = ref<boolean>(false);
        const variantSelected = ref<string>('');
        const bubbleVariantFallbackKey = ref<number>(0);
        const emitter: any = inject('emitter');

        const { checkAttributeAvailable, error } = useAttribute();

        const classInputContainer = computed(() => {
            const state = {
                'ring-error border-error-3': props.state === 'error',
                'bg-white': !props.disabled,
                'bg-neutrals-50 cursor-not-allowed pointer-events-none': props.disabled,
                'ring-primary border-neutrals-200 focus-within:border-primary-500 hover:border-primary-500 hover:ring-4 hover:ring-primary-50':
                    (props.state === 'default' || !states.includes(props.state)) && !props.disabled,
            };

            return { ...state };
        });
        const classInput = computed(() => {
            const state = {
                ' placeholder-neutrals-500 text-neutrals-900': !props.disabled,
                ' placeholder-neutrals-300 text-neutrals-300': props.disabled,
            };
            return {
                ...state,
            };
        });
        const valueSync = computed({
            get(): string {
                return props.modelValue;
            },
            set(value: string) {
                emit('update:modelValue', value);
            },
        });
        const user = computed(() => store.state.auth.user);

        const editor = useEditor({
            extensions: [
                StarterKit,
                Placeholder.configure({
                    placeholder: props.placeholder,
                }),
                Variant.configure({
                    IconAttributes: {
                        src: '../../img/icon-attribute.svg',
                    },
                }),
                CharacterCount.configure({
                    limit: props.maxlength,
                }),
            ],
            editorProps: {
                handleDOMEvents: {
                    keydown: (view, event) => {
                        if (event.key === 'Enter' && props.preventEnter) {
                            event.preventDefault();
                        }
                        return false;
                    },
                },
            },
            onUpdate: async ({ editor }) => {
                await nextTick();
                emit('update:modelValue', editor.getHTML());
            },
            onFocus: () => {
                showButtonTool.value = true;
            },
            onBlur: ({ event }) => {
                if ((event.relatedTarget as Element)?.classList.contains('input-tiptap__dropdown-tool')) {
                    showButtonTool.value = true;
                } else {
                    showButtonTool.value = false;
                }
            },
        });
        const onPressed = (type: string) => {
            let temp: number = parseInt(valueSync.value);
            if (!temp) temp = 0;
            temp = type === 'down' ? temp - 1 : temp + 1;
            emit('update:modelValue', temp);
            valueSync.value = temp.toString();
        };

        const onClearText = () => {
            emit('update:modelValue', '');
            valueSync.value = '';
            const ref: any = textfieldComp.value;
            ref.focus();
        };
        const count = (names: any) => names.reduce((a: any, b: any) => ({ ...a, [b]: (a[b] || 0) + 1 }), {});
        const duplicates = (dict: any) => Object.keys(dict).filter((a: any) => dict[a] > 5);
        const saveToIndexedDB = async (emojis: any) => {
            const emojiDB: any = await database.getItem(dbName.widgetSetingEmojiCount);
            const widgetSetingEmojiDB: any = await database.getItem(dbName.widgetSetingEmoji);

            const userEmojiBD = emojiDB ? emojiDB[user.value._id] : [];
            let widgetSetingUserEmojiDB = widgetSetingEmojiDB ? widgetSetingEmojiDB[user.value._id] : [];

            if (widgetSetingUserEmojiDB.length > 0) {
                if (!widgetSetingUserEmojiDB.includes(emojis)) {
                    userEmojiBD.unshift(emojis);
                    emojiDB[user.value._id] = userEmojiBD;
                    database.setItem(dbName.widgetSetingEmojiCount, emojiDB);
                    const numberDup = duplicates(count(userEmojiBD));

                    widgetSetingEmojiDB[user.value._id] = numberDup;
                    database.setItem(dbName.widgetSetingEmoji, widgetSetingEmojiDB);
                } else {
                    widgetSetingUserEmojiDB = widgetSetingUserEmojiDB.filter((item: any) => item !== emojis);
                    widgetSetingUserEmojiDB.unshift(emojis);

                    widgetSetingEmojiDB[user.value._id] = widgetSetingUserEmojiDB;
                    database.setItem(dbName.widgetSetingEmoji, widgetSetingEmojiDB);
                }
            } else {
                userEmojiBD.unshift(emojis);
                emojiDB[user.value._id] = userEmojiBD;
                database.setItem(dbName.widgetSetingEmojiCount, emojiDB);
                const numberDup = duplicates(count(userEmojiBD));

                widgetSetingEmojiDB[user.value._id] = numberDup;
                database.setItem(dbName.widgetSetingEmoji, widgetSetingEmojiDB);
            }
        };
        const addEmoji = (val: any) => {
            saveToIndexedDB(val.unified);
            const codepointArray = val.unified.split('-').map((item: any) => `0x${item}`);
            const emojiText: any = String.fromCodePoint(...codepointArray);
            if (
                (props.maxlength && editor.value.storage.characterCount.characters() < props.maxlength) ||
                !props.maxlength
            ) {
                editor.value
                    .chain()
                    .focus()
                    .insertContent(emojiText)
                    .run();
            }
        };

        onMounted(() => {
            editor.value.commands.setContent(props.modelValue);
        });

        watch(
            () => variantSelected.value,
            async (newVal: any) => {
                if (!['organization_name', 'workspace_name'].includes(newVal._id)) {
                    const checkAttribute = await checkAttributeAvailable({ attributes: [newVal._id] });
                    if (!error.value) {
                        editor.value
                            .chain()
                            .focus()
                            .addVariant(unref(newVal), checkAttribute[0].available_at_all_contacts)
                            .run();
                        showDropdownAttribute.value = false;
                    }
                } else {
                    editor.value
                        .chain()
                        .focus()
                        .addVariant(unref(newVal), true)
                        .run();
                    showDropdownAttribute.value = false;
                }
            },
            { deep: true },
        );
        watch(
            () => showDropdownEmoji.value,
            (newVal: boolean) => {
                if (newVal) {
                    showButtonTool.value = false;
                }
            },
            { deep: true, immediate: true },
        );
        watch(
            () => showDropdownAttribute.value,
            (newVal: boolean) => {
                if (newVal) {
                    showButtonTool.value = false;
                }
            },
            { deep: true, immediate: true },
        );

        emitter.on('updateInputComponentTiptap', async () => {
            await nextTick();
            editor.value.commands.setContent(props.modelValue);
            // const currentTextLength = editor.value.state.doc.textBetween(
            //     0,
            //     editor.value.state.doc.content.size,
            //     ' ',
            // ).length;
            // editorTextLength.value = currentTextLength;
        });

        return {
            editor,
            classInput,
            classInputContainer,
            states,
            onClearText,
            textfieldComp,
            onPressed,
            isShowPassword,
            valueSync,
            editorTextLength,
            addEmoji,
            showDropdownEmoji,
            showDropdownAttribute,
            showButtonTool,
            isShowDropList,
            variantSelected,
            bubbleVariantFallbackKey,
        };
    },
});
</script>

<style lang="scss" scoped>
.input-tiptap {
    :deep(.ProseMirror) {
        outline: none;
        .input-tiptap__variant {
            display: inline-block;
            height: 20px;
            padding-left: 4px;
            padding-right: 6px;
            margin: 0 4px;
            background: #e9e9ec;
            border: 1px solid #555562;
            color: #555562;
            border-radius: 4px;
            white-space: nowrap;
            -webkit-box-decoration-break: clone;
            -webkit-user-modify: read-only;
            img {
                display: inline;
                vertical-align: top;
                width: auto;
                margin-right: 2px;
            }
            &[data-available='false'] {
                img {
                    margin-left: 2px;
                }
            }
            &[data-available='false'][data-fallback=''] {
                color: #ec2b08;
                border-color: #ec2b08;
                background: #ffe5e5;
                img {
                    filter: invert(68%) sepia(91%) saturate(327%) hue-rotate(312deg) brightness(97%) contrast(96%);
                }
            }
        }
    }
    :deep(.ProseMirror p.is-empty:first-child::before) {
        content: attr(data-placeholder);
        float: left;
        color: #adb5bd;
        pointer-events: none;
        height: 0;
    }
    .input-tiptap__tool {
        display: none;
    }
    // &:hover {
    //     .input-tiptap__tool {
    //         display: flex;
    //     }
    // }
    .input-tiptap__tool--open {
        display: flex;
    }
}
.ring-primary {
    &:hover {
        outline: 0;
        box-shadow: 0 0 0 2px #bfcef3;
    }
}
.ring-error {
    outline: 0;
    box-shadow: 0 0 0 2px #ffe5e5;
}

.arrow-off {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type='number'] {
        -moz-appearance: textfield;
    }
}
.input-tiptap__input {
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px white inset !important;
    }
    &--focus {
        border: 1px solid #3e6dda;
    }
}
</style>
