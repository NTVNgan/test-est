<template>
    <BubbleMenu
        :key="bubbleKey"
        :editor="editor"
        v-if="editor"
        :shouldShow="shouldShowBubble"
        :tippyOptions="{ hideOnClick: 'toggle', onClickOutside }"
    >
        <div class="bubble-link flex bg-neutrals-900 text-neutrals-300 px-8p py-4p divide-x items-center rounded-4p">
            <div class="flex items-center w-206">
                <IconComponent class="mr-8p" name="link" color="neutrals-300" />
                <div
                    @click="onClickLink"
                    :class="{
                        'cursor-pointer': !isEdit,
                    }"
                >
                    <input
                        ref="inputEl"
                        class="bg-neutrals-900 outline-none text-14 text-white"
                        placeholder="Add link"
                        v-model="link"
                        :disabled="!isEdit && link"
                    />
                </div>
            </div>
            <div class="flex divide-x border-neutrals-400">
                <template v-if="!isEdit">
                    <div class="text-14 ml-8p block cursor-pointer text-white" @click="onClickEdit">Edit</div>
                    <div class="text-14 ml-8p pl-8p block cursor-pointer text-white" @click="onClickDelete">Delete</div>
                </template>
                <template v-else>
                    <div class="text-14 ml-8p block cursor-pointer text-white" @click="onClickAdd">Save</div>
                </template>
            </div>
            <div class="bubble-link__triangle"></div>
        </div>
    </BubbleMenu>
</template>

<script>
import { unref, ref, inject } from 'vue';
import { BubbleMenu } from '@tiptap/vue-3';
import IconComponent from '@/components/ui/IconComponent.vue';
import { isActive } from '@tiptap/core';

export default {
    name: 'BubbleLink',
    components: {
        BubbleMenu,
        IconComponent,
    },
    props: ['editor'],
    setup(props) {
        const emitter = inject('emitter');
        const link = ref('');
        const inputEl = ref(null);
        const isEdit = ref(false);
        const show = ref(false);
        const bubbleKey = ref(0);
        emitter.on('openLink', () => {
            link.value = null;
            show.value = true;
            isEdit.value = true;
            inputEl.value && inputEl.value.focus();
        });

        const shouldShowBubble = ({ editor, state }) => {
            window.setTimeout(() => {
                link.value = editor.getAttributes('link').href;
                if (link.value) isEdit.value = false;
            });
            const check = isActive(state, 'link');
            console.log(link.value);
            return check;
        };

        const onClickAdd = () => {
            const indexHttp = link.value.toLowerCase().indexOf('http://');
            const indexHttps = link.value.toLowerCase().indexOf('https://');

            if ((indexHttp !== 0 && indexHttps !== 0) || !link.value.trim()) {
                link.value = `${indexHttps == 0 ? 'https://' : 'http://'}${link.value}`;
            }

            if (show.value) unref(props.editor).commands.setLink({ href: link.value });
            else {
                unref(props.editor).chain().focus().extendMarkRange('link').setLink({ href: link.value }).run();
            }
            isEdit.value = false;
            show.value = false;
        };

        const onClickEdit = () => {
            isEdit.value = true;
            inputEl.value.focus();
        };
        const onClickDelete = () => {
            unref(props.editor).commands.unsetLink();
            show.value = false;
        };

        const onClickLink = () => {
            if (!isEdit.value && link.value.trim().length) {
                window.open(link.value, '_blank');
            }
        };

        const onClickOutside = () => {
            bubbleKey.value = bubbleKey.value + 1;
        };

        return {
            shouldShowBubble,
            link,
            onClickAdd,
            onClickEdit,
            onClickDelete,
            inputEl,
            isEdit,
            show,
            onClickLink,
            onClickOutside,
            bubbleKey,
        };
    },
};
</script>

<style lang="scss">
.bubble-link {
    position: relative;
    border-radius: 0.4em;
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