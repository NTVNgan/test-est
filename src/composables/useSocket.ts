import { reactive, ref } from 'vue';
import { io, Socket } from 'socket.io-client';

let socket: Socket | any = reactive<any>({});
const socketConnected = ref<boolean>(false); // socket connection status

export const useSocket = () => {
    const installSocket = (data: any) => {
        const { _id: user_id, org_id, workspace_id } = data
        const socketUrl = `${process.env.VUE_APP_SOCKET_URL}`

        const option: any = {
            query: {
                org_id,
                workspace_id,
                user_id
            },
            resource: 'socket.io',
            transports: ['websocket'],
            forceNew: true,
            upgrade: false,
        };

        socket = io(socketUrl, option);

        /**
         * Catch disconnect event
         * @param err string
         *  • "io server disconnect": The server has forcefully disconnected the socket with socket.disconnect()
         *  • "io client disconnect": The socket was manually disconnected using socket.disconnect()
         *  • "ping timeout": The server did not send a PING within the pingInterval + pingTimeout range
         *  • "transport close": The connection was closed (example: the user has lost connection, or the network was changed from WiFi to 4G)
         *  • "transport error": The connection has encountered an error (example: the server was killed during a HTTP long-polling cycle)
         */
        socket.on('disconnect', (err: string) => {
            // SHOW ERROR CONNECTION POPUP
            if (err === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                socket.connect();
            }
            socketConnected.value = socket.connected; // false
            console.log(`[SOCKET][${socket.connected}][${socket.id}] Disconnected:`, err);
        });

        // CONNECT
        socket.on('connect', () => {
            // HIDE ERROR CONNECTION POPUP
            socketConnected.value = socket.connected; // true
            console.log(`[SOCKET][${socket.connected}][${socket.id}] Connected`); // true
        });
        socket.on('connect_error', (err: Error) => {
            socketConnected.value = socket.connected; // false
            console.log(`[SOCKET][${socket.connected}][${socket.id}] Connect error due to: ${err.message}`);
        });

        // RECONNECT
        socket.on('reconnect', (attempt: number) => {
            // HIDE ERROR CONNECTION POPUP
            socketConnected.value = socket.connected; // true
            console.log(`[SOCKET][${socket.connected}][${socket.id}] Reconnected after ${attempt} attempt(s)`);
        });
        socket.on('reconnect_attempt', (attempt: number) => {
            console.log(`[SOCKET][${socket.connected}][${socket.id}] Reconnecting attempt: ${attempt}`);
        });
        socket.on('reconnect_error', (err: Error) => {
            socketConnected.value = socket.connected; // false
            console.log(`[SOCKET][${socket.connected}][${socket.id}] Reconnect error due to:`, err);
        });
        socket.on('reconnect_failed', (err: Error) => {
            socketConnected.value = socket.connected; // false
            console.log(`[SOCKET][${socket.connected}][${socket.id}] Reconnect failed:`, err);
        });

        // socket.emit('joinRoom', {room_id: workspace_id});

        return Promise.resolve(socket)
    }

    const clearSocket = () => {
        if (Object.keys(socket).length !== 0 && typeof socket.constructor === 'function') {
            socket.disconnect();
            socket = {};
        }
    }

    return { socket, socketConnected, installSocket, clearSocket };
}
