import { Node, mergeAttributes } from '@tiptap/core';

export interface VariantOptions {
    HTMLAttributes: Record<string, any>;
    IconAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        variant: {
            /**
             * Add a variant
             */
            addVariant: (variant: any, available: boolean) => ReturnType;
        };
    }
}

export const Variant = Node.create<VariantOptions>({
    name: 'variant',

    inline: true,

    atom: true,

    group: 'inline',

    addOptions() {
        return {
            HTMLAttributes: {},
            IconAttributes: {},
        };
    },

    addAttributes() {
        return {
            class: {
                default: 'input-tiptap__variant',
            },
            id: {
                default: null,
                parseHTML: element => element.getAttribute('data-id'),
                renderHTML: attributes => {
                    if (!attributes.id) {
                        return {};
                    }
                    return {
                        'data-id': attributes.id,
                    };
                },
            },
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
            fallback: {
                default: null,
                parseHTML: element => element.getAttribute('data-fallback'),
                renderHTML: attributes => {
                    if (!attributes.fallback) {
                        return {};
                    }
                    return {
                        'data-fallback': attributes.fallback,
                    };
                },
            },
            available: {
                default: null,
                parseHTML: element => element.getAttribute('data-available'),
                renderHTML: attributes => {
                    if (!attributes.available) {
                        return {};
                    }
                    return {
                        'data-available': attributes.available,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [{ tag: 'span[data-fallback]' }];
    },

    renderHTML({ node, HTMLAttributes }) {
        if (node.attrs.available === 'true') {
            return [
                'span',
                mergeAttributes(
                    { 'data-fallback': '', 'data-available': node.attrs.available },
                    this.options.HTMLAttributes,
                    HTMLAttributes,
                ),
                ['img', this.options.IconAttributes],
                `${node.attrs.name}`,
            ];
        } else {
            return [
                'span',
                mergeAttributes(
                    { 'data-fallback': '', 'data-available': node.attrs.available },
                    this.options.HTMLAttributes,
                    HTMLAttributes,
                ),
                ['strong', {}, '!'],
                ['img', this.options.IconAttributes],
                `${node.attrs.name}`,
            ];
        }
    },

    renderText({ node }) {
        return `${node.attrs.name}`;
    },

    addCommands() {
        return {
            addVariant: (variant: any, available: boolean) => ({ commands }) => {
                return commands.insertContent([
                    {
                        type: 'variant',
                        attrs: { id: variant._id, name: variant.name, available: available.toString() },
                    },
                ]);
            },
        };
    },

    addKeyboardShortcuts() {
        return {
            Backspace: () =>
                this.editor.commands.command(({ tr, state }) => {
                    let isMention = false;
                    const { selection } = state;
                    const { empty, anchor } = selection;

                    if (!empty) {
                        return false;
                    }

                    state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
                        if (node.type.name === this.name) {
                            isMention = true;
                            tr.insertText('', pos, pos + node.nodeSize);

                            return false;
                        }
                    });

                    return isMention;
                }),
        };
    },
});
