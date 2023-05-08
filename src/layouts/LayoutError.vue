<template>
    <div class="h-full flex flex-col bg-gray-100 relative">
        <div class="flex justify-between items-center px-24p pt-12p">
            <img src="@/assets/images/logo.svg" alt="logo" />
        </div>
        <transition-router-view />
    </div>
</template>

<script lang="ts">
import TransitionRouterView from '@/components/TransitionRouterView.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'LayoutError',
    components: {
        TransitionRouterView,
    }
})
</script>
