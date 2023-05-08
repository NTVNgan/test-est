import { useSocket } from '@/composables/useSocket';
import { ref } from 'vue';

export const useSocketAction = () => {
    const { socket } = useSocket();
    const incomingRoleChangeAction = ref<any>([])

    const dispatchIncomingRoleChangeSocket = () => {
        socket.off('incomingUserOnlineStatus').on('incomingUserOnlineStatus', (data: any) => {
            if (incomingRoleChangeAction.value.length)
                incomingRoleChangeAction.value.forEach((item: any) => item(data))
        })
    }

    const addActionRoleChange = (action: any) => {
        incomingRoleChangeAction.value.push(action)
    }   

    return {
        dispatchIncomingRoleChangeSocket,
        addActionRoleChange
    }
}