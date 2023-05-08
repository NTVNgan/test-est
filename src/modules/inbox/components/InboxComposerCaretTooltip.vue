<template>
    <teleport to="#tooltip">
        <div
            :id="baseId"
            ref="tooltipCaret"
            class="tooltip-caret bg-white shadow-2p py-8p rounded-4p font-body"
            :class="[
                show && !!(keyWordValues[activeKeywords] && keyWordValues[activeKeywords].length > 0)
                    ? 'inline-block'
                    : 'hidden',
                classBase,
            ]"
        >
            <div class="px-8p" v-if="show" v-click-outside-caret-tooltip="clickOutsideContent">
                <div class="bg-neutrals-100 rounded-4p p-8p text-12 text-neutrals-400 flex items-center mb-8p">
                    <icon-component name="tips" color="neutrals-400" class="mr-4p" />
                    <span class="font-bold">Arrows key </span>
                    <span class="text-16 flex items-center mx-4p mb-2p">
                        <img class="mr-2p m" :src="require('../assets/ic_arrow_up.svg')" alt="" />
                        <img class="ml-2p" :src="require('../assets/ic_arrow_down.svg')" alt="" />
                    </span>
                    <span class="mr-16p">to navigate</span>
                    <span><span class="font-bold">Enter</span> to select </span>
                </div>
            </div>
            <slot></slot>
        </div>
    </teleport>
</template>

<script lang="ts">
import { ref, watch, computed, inject, onMounted, nextTick } from 'vue';
import IconComponent from '@/components/ui/IconComponent.vue';
import { useCaretDropDown } from '@/modules/inbox/composables/useCaretDropDown';
import { isNull } from 'lodash';

export default {
    name: 'InboxComposerCaretTooltip',
    components: {
        IconComponent,
    },
    props: {
        modelValue: {
            type: null,
        },
        baseId: {
            default: 'tooltipCaret',
        },
        keywords: {
            default: ['/','@'],
        },
        activeKeywords: {
            default: '@',
        },
        show: {
            type: Boolean,
            default: true,
        },
        classBase: {
            type: String,
            default: 'w-320',
        },
    },
    emits: ['update:modelValue', 'click-outside'],
    setup(props: any, { emit }: any) {
        const tooltipCaret = ref<any>(null);
        const emitter: any = inject('emitter');
        const keyWordValues: any = ref({});
        const { toggleTooltip, updateKeyWordText }: any = useCaretDropDown();

        const handleCaret = async (e: any, contenteditable: any) => {
            await toggleTooltip(e, contenteditable, tooltipCaret.value, props.activeKeywords);
            keyWordValues.value = await updateKeyWordText(e, contenteditable, props.keywords).value;
            emit('update:modelValue', keyWordValues.value[props.activeKeywords]);
            // await nextTick();
            // if (tooltipCaret.value) {
            //     const calcHeight = window.getComputedStyle(tooltipCaret.value).getPropertyValue('height');
            //     tooltipCaret.value.style.top = `calc(${tooltipCaret.value.style.top} - ${calcHeight})`;
            //     tooltipCaret.value.style.top = `calc(${tooltipCaret.value.style.top} + 20px)`;
            // }
        };

        const clickOutsideContent = () => {
            emit('click-outside');
        };

        // emitter.on('contentBlur', () => {
        //     keyWordValues.value = {};
        // });

        emitter.on('contentKeyUp', async ({ e, contenteditable }: any) => {
            await handleCaret(e, contenteditable);
        });

        emitter.on('contentClick', async ({ e, contenteditable }: any) => {
            await handleCaret(e, contenteditable);
        });

        // emitter.on('contentClickOutside', () => {
        //     console.log('hello', keyWordValues.value[props.activeKeywords]);
        //     if (keyWordValues.value[props.activeKeywords]) {
        //         emit('update:modelValue', null);
        //     }
        // });

        return {
            keyWordValues,
            tooltipCaret,
            clickOutsideContent,
        };
    },
};
</script>

<style>
.tooltip-caret {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9999;
    /* transform: translate(7%, -60%); */
}
</style>