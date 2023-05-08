<template>
    <transition-router-view />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import TransitionRouterView from '@/components/TransitionRouterView.vue'

export default defineComponent({
    name: 'Error',
    components: {
        TransitionRouterView
    },
});
</script>
