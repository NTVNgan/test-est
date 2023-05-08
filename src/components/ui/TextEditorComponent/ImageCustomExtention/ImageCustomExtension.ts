import { Node, mergeAttributes } from '@tiptap/core';

export interface ImageCustomOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        imageCustom: {
            /**
             * Add image loading
             */
            addImageLoading: () => ReturnType;
        };
    }
}

export const ImageCustom = Node.create<ImageCustomOptions>({
    name: 'imageCustom',

    inline: false,

    group: 'block',

    draggable: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            name: {
                default: null,
                parseHTML: element => element.getAttribute('data-name'),
                renderHTML: attributes => {
                    if (!attributes.name) {
                        return {};
                    }
                    return {
                        'data-name': attributes.name,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(
                { class: 'w-320 h-180 composer-contenteditable__image composer-contenteditable__image--loading' },
                HTMLAttributes,
            ),
            ['div', { class: 'spinner spinner--small', style: '--spinerColor: #3e6dda' }, ['div'], ['div'], ['div']],
        ];
    },

    addCommands() {
        return {
            addImageLoading: () => ({ commands }) => {
                return commands.insertContent([
                    {
                        type: 'imageCustom',
                    },
                ]);
            },
        };
    },
});
