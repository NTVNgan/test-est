
import { ref } from 'vue';

const isCallImcomingSocket = ref(false);
const isCallImcomingConversation = ref(false);


export const useInboxSocket = () => {

    return {
        isCallImcomingSocket,
        isCallImcomingConversation
    }
}