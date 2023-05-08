<template>
    <div class="text-center bg-white absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center">
        <img v-if="srcImg" :src="require('../' + srcImg + '')" :class="widthImg" class="mx-auto mb-32p img-response" />
        <div class="font-heading font-semibold text-32 text-primary-500 capitalize " v-if="$slots.title">
            <slot name="title"></slot>
        </div>
        <div v-if="$slots.body">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AuthResponve',
    props: {
        srcImg: { type: String },
        widthImg: {type: String}
    },
});
</script>
