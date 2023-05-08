<template>
    <div class="content-error text-center absolute top-1/2 left-1/2">
        <img v-if="srcImg" class="m-auto" :src="require('../' + srcImg + '')" />
        <div class="capitalize font-heading text-24 text-neutrals-900 font-semibold pt-16p pb-12p" v-if="$slots.title">
            <slot name="title"></slot>
        </div>
        <div v-if="$slots.body">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: '404',
    props: {
        srcImg: { type: String },
    },
});
</script>

<style lang="scss">
.content-error{
    transform: translate(-50%, -50%);
}
</style>
