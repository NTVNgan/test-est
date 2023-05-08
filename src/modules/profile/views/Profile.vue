<template>
    <div class="flex flex-1">
        <submenu-component :heading="$t('slp.profile_submenu_title')" :navLink="routeList" />
        <div class="flex-1 bg-white shadow-deep-1 rounded-l-8p">
            <transition-router-view />
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue';
import SubmenuComponent from '@/components/ui/SubmenuComponent.vue';
import TransitionRouterView from '@/components/TransitionRouterView.vue';
import { RouterLink } from '@/types/router-name';
import { store } from '@/store';
import { useSocket } from '@/composables/useSocket';
import { useRouter } from 'vue-router';

export default {
    name: 'AccountDetail',
    setup() {
        const routeList = ref<RouterLink[]>([
            {
                label: 'Account Details',
                name: 'ProfileAccountDetail',
            },
            {
                label: 'Notifications',
                name: 'ProfileNotification',
            },
        ]);
        const { socket } = useSocket();
        const router = useRouter();
        const emitter: any = inject('emitter');

        emitter.on('dotStatusUser', (data: any) => {
            const params = {
                workspace_id: store.state.auth.user.workspace_id,
                user_id: store.state.auth.user._id,
            }
            if(data === 5){
                socket.emit('sendIdleStatus', params);
            } else if (data === 1) {
                socket.emit('sendOnlineStatus', params);
            }
        })

        return {
            routeList,
        };
    },
    components: {
        SubmenuComponent,
        TransitionRouterView,
    },
};
</script>
