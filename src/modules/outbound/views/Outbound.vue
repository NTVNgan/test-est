<template>
    <div class="flex-1 bg-white shadow-deep-1 rounded-l-8p">
        <transition-router-view />
    </div>
</template>

<script lang="ts">
import TransitionRouterView from '@/components/TransitionRouterView.vue';

export default {
    name: 'Outbound',
    setup() {
        return {};
    },
    components: {
        TransitionRouterView,
    },
};
</script>
