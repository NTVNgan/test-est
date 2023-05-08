<template>
    <i>
        <component class="icon-svg fill-current" :is="name" :color="color"></component>
    </i>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
export default defineComponent({
    props: {
        type: {
            type: String,
            default: '',
        },
        name: {
            type: String,
        },
        color: {
            type: String,
            default: 'black',
        },
    },
    components: {
        Times: defineAsyncComponent(() => import('./icons/Comment.vue')),
        AngleDown: defineAsyncComponent(() => import('../components/icons/AngleDown.vue')),
        Comments: defineAsyncComponent(() => import('../components/icons/Comments.vue')),
        PaperPlane: defineAsyncComponent(() => import('../components/icons/PaperPlane.vue')),
    },
    setup() {
        return {};
    },
});
</script>
