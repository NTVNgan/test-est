<template>
    <slot></slot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AccordionTab',
    props: {
        header: null,
        icon: null,
        tool: Boolean,
        disabled: Boolean,
        key: [Number, String],
        count: {
            type: Number,
            default: 1,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
});
</script>
