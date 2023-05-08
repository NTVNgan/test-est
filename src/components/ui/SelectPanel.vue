<template>
    <slot></slot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SelectPanel',
    props: {
        icon: null,
        disabled: {
            type: Boolean,
            default: false,
        },
        value: null,
        name: {
            type: String,
            default: '',
        },
        selectedLabel: {
            type: String,
            default: '',
        },
    },
});
</script>
