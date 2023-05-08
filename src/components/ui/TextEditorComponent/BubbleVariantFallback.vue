<template>
    <BubbleMenu
        :key="bubbleKey"
        :editor="editor"
        v-if="editor"
        :shouldShow="shouldShowBubble"
        :tippyOptions="{ hideOnClick: 'toggle', onClickOutside }"
    >
        <div
            class="bubble-varriant flex bg-neutrals-900 text-neutrals-300 px-8p py-4p divide-x items-center rounded-4p"
        >
            <div class="flex items-center w-320">
                <input
                    ref="inputEl"
                    class="bg-neutrals-900 outline-none text-14 w-full"
                    placeholder="Add fallback"
                    v-model="fallback"
                />
            </div>
            <div class="bubble-varriant__triangle"></div>
        </div>
    </BubbleMenu>
</template>

<script>
import { unref, ref } from 'vue';
import { BubbleMenu } from '@tiptap/vue-3';
import { isActive, getNodeAttributes } from '@tiptap/core';

export default {
    name: 'BubbleVariantFallback',
    components: {
        BubbleMenu,
    },
    props: ['editor'],
    setup(props) {
        const fallback = ref('');
        const inputEl = ref(null);
        const show = ref(false);
        const bubbleKey = ref(0);

        const shouldShowBubble = ({ state }) => {
            const attrs = getNodeAttributes(state, 'variant');
            fallback.value = attrs.fallback;
            if (['organization_name', 'workspace_name'].includes(attrs.id)) return false;
            const check = isActive(state, 'variant');
            return check;
        };

        const onClickOutside = () => {
            bubbleKey.value = bubbleKey.value + 1;
            unref(props.editor).commands.updateAttributes('variant', { fallback: fallback.value });
        };

        return {
            fallback,
            inputEl,
            show,
            shouldShowBubble,
            onClickOutside,
            bubbleKey,
        };
    },
};
</script>

<style lang="scss">
.bubble-varriant {
    position: relative;
    border-radius: 4px;
    color: white;
    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-top-color: #141417;
        border-bottom: 0;
        margin-left: -6px;
        margin-bottom: -6px;
        transform: translateY(-1px);
    }
}
</style>
