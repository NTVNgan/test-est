<template>
    <div class="relative">
        <div
            class="absolute text-neutrals-500"
            v-if="content.trim().length == 0 && isShowPlaceHolder"
            @click="onClickPlaceHolder"
        >
            Start writing...
        </div>
        <div
            id="lb-article-contenteditable"
            class="composer-contenteditable__contentedit-div text-14 mr-16p outline-none"
            ref="articleContenteditable"
            contenteditable
            @click="onClickPlaceHolder"
            @input="onInput"
            @keydown="handleKeydown"
            @keyup="handleKeyup"
            @blur="handleBlur"
        ></div>
    </div>
</template>

<script lang="ts">
import { ref, inject } from 'vue';

function setCaret(el: any, pos: any) {
    const range = document.createRange();
    const sel: any = window.getSelection();
    range.setStart(el, pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

export default {
    name: 'ArticleContenteditable',
    emits: ['update:modelValue'],
    setup(props: any, { emit }: any) {
        const articleContenteditable = ref<any>(null);
        const content = ref('');
        const isShowPlaceHolder = ref(true);
        const emitter: any = inject('emitter');

        emitter.on('updateDefaultArticle', (bodyContent: any) => {
            articleContenteditable.value.innerHTML = bodyContent;
            content.value = articleContenteditable.value.innerText;
            if (content.value.trim().length > 0) isShowPlaceHolder.value = false;
        });

        const onInput = (e: any) => {
            content.value = e.target.innerText;
            emit('update:modelValue', articleContenteditable.value.innerHTML);
        };

        const onClickPlaceHolder = () => {
            isShowPlaceHolder.value = false;
            articleContenteditable.value.focus();
        };

        const handleBlur = (e: any) => {
            if (e.target.innerText.trim().length === 0) isShowPlaceHolder.value = true;
        };

        const handleKeydown = (e: any) => {
            if (e.target.innerText.length >= 10) {
                e.target.innerText = e.target.innerText.substring(0, e.target.innerText.length - 1);
                e.preventDefault();
            }
        };

        const handleKeyup = (e: any) => {
            if (e.target.innerText.length >= 10) {
                e.preventDefault();
            }
        };

        return {
            articleContenteditable,
            onInput,
            content,
            isShowPlaceHolder,
            onClickPlaceHolder,
            handleBlur,
            handleKeydown,
            handleKeyup,
        };
    },
};
</script>

<style>
</style>