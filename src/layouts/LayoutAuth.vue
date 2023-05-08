<template>
    <div class="h-full flex bg-gray-100">
        <auth-intro />
        <div class="auth__wrapper flex flex-1 bg-white overflow-x-hidden overflow-y-auto scrollbar">
            <transition-router-view />
        </div>
    </div>
</template>

<script lang="ts">
import AuthIntro from '@/modules/auth/components/AuthIntro.vue';
import TransitionRouterView from '@/components/TransitionRouterView.vue';
import { useAuth } from '../modules/auth/composables/useAuth';
import { useRoute } from 'vue-router';
import { ref } from 'vue';

export default {
    name: 'LayoutAuth',
    components: {
        AuthIntro,
        TransitionRouterView,
    },
    setup() {
        const { logout } = useAuth();
        const { query } = useRoute();
        const { hash, id: userId }: any = query;
        const isErrorActive = ref(false);

        if (hash && userId) isErrorActive.value = true;

        return { logout, isErrorActive };
    },
};
</script>

<style lang="scss" scoped></style>
