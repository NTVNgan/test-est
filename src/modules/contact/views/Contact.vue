<template>
    <div class="flex flex-1 min-w-0">
        <div class="w-full h-full min-w-0 flex-1 flex bg-white relative">
            <transition-router-view />
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue';
import TransitionRouterView from '@/components/TransitionRouterView.vue';
import { store } from '@/store';
import { useSocket } from '@/composables/useSocket';

export default {
    name: 'Contact',
    components: {
        TransitionRouterView,
    },
    setup() {
        const { socket } = useSocket();
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
        }
    }
};
</script>
