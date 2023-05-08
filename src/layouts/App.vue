<template>
    <component :is="layout">
        <router-view />
    </component>
    <toast-component />
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, computed, onMounted, inject, watch } from 'vue';
import ToastComponent from '@/components/ui/ToastComponent.vue';
import { useRoute } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { useI18n } from 'vue-i18n';
export default defineComponent({
    components: {
        ToastComponent,
        AppLayout: defineAsyncComponent(() => import('./LayoutApp.vue' /* webpackChunkName: "LayoutApp" */)),
        AuthLayout: defineAsyncComponent(() => import('./LayoutAuth.vue' /* webpackChunkName: "LayoutApp" */)),
        ErrorLayout: defineAsyncComponent(() => import('./LayoutError.vue' /* webpackChunkName: "LayoutApp" */)),
    },
    setup() {
        const emitter: any = inject('emitter');
        const defaultLayout = 'AppLayout';
        const route = useRoute();
        const { addToast } = useToast();
        const { t } = useI18n();

        const layout = computed(() => route.meta.layout || defaultLayout);

        onMounted(() => {
            window.addEventListener('online', () => {
                emitter.emit('isOnline', true);
                addToast({
                    single: true,
                    title: t('common.internet_onine'),
                    type: 'basic',
                    icon: 'Wifi',
                    iconColor: 'success-3',
                    timeout: 3000,
                });
            });
            window.addEventListener('offline', () => {
                emitter.emit('isOnline', false);
                addToast({
                    single: true,
                    title: t('common.internet_offline'),
                    type: 'basic',
                    icon: 'WifiSlash',
                    iconColor: 'neutrals-400',
                    timeout: 3000,
                });
            });
        });

        return {
            layout,
        };
    },
});
</script>

<style lang="scss">
#app {
    font-family: 'Roboto', 'sans-serif';
    font-weight: 400;
    color: #141417;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
    overflow: hidden;
}
</style>
