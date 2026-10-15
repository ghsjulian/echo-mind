import { io } from 'socket.io-client';
import type { User } from '../store/useAPI';
import { url } from '../libs/axios-api';


const user: User = JSON.parse(localStorage.getItem("echomind-user") as string) || null
export const socket = io(url, {
    auth: { userID: user?.user_id },
    autoConnect: false,
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export const connectSocket = (): void => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = (): void => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export default socket