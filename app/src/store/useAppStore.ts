import { create } from "zustand";
import socket from "../services/socket-sevice";

export interface Notification {
    _id: string;
    sender_id: string;
    receiver_id: string;
    post_id: string;
    text: string;
    time: string;
    read: boolean;
}

export interface AIMessage {
    id: string;
    sender: "bot" | "user";
    text: string;
    time: string;
}

export interface SecretPeer {
    alias: string;
    feeling: string;
    role: string;
    avatar: string;
}

export interface SecretMessage {
    id: string;
    senderID: string;
    senderAlias: string;
    text: string;
    time: string;
    isMe: boolean;
}

interface AppState {
    isAI: boolean;
    isProfile: boolean;
    isNotiOpen: boolean;
    notifications: Notification[];
    onlineCount: number;

    // AI Chat State
    activeChatTab: "ai" | "secret";
    aiMessages: AIMessage[];
    isAITyping: boolean;

    // Secret Chat State
    secretStatus: "idle" | "searching" | "matched" | "ended";
    secretPeer: SecretPeer | null;
    secretRoomID: string | null;
    secretMessages: SecretMessage[];
    secretPeerTyping: boolean;

    // Actions
    openAI: () => void;
    openProfile: () => void;
    openNotification: () => void;
    setOnlineCount: (count: number) => void;
    setActiveChatTab: (tab: "ai" | "secret") => void;

    // Notifications Actions
    handleNotification: (notification: Notification[]) => void;
    readNotification: (notiID: string) => void;
    deleteNotification: (notiID: string) => void;
    clearAllNotifications: () => void;

    // AI Chat Actions
    sendAIMessage: (text: string) => void;
    addAIMessage: (msg: AIMessage) => void;
    setAITyping: (typing: boolean) => void;

    // Secret Chat Actions
    startSecretMatch: (feeling?: string) => void;
    cancelSecretMatch: () => void;
    sendSecretMessage: (text: string) => void;
    leaveSecretChat: () => void;
    setSecretMatched: (roomID: string, peer: SecretPeer) => void;
    setSecretStatus: (status: "idle" | "searching" | "matched" | "ended") => void;
    addSecretMessage: (msg: SecretMessage) => void;
    setSecretPeerTyping: (isTyping: boolean) => void;
}

const useAppStore = create<AppState>((set, get) => ({
    isAI: false,
    isProfile: false,
    isNotiOpen: false,
    notifications: [],
    onlineCount: 1,

    // AI Chat
    activeChatTab: "ai",
    aiMessages: [
        {
            id: "initial_bot_msg",
            sender: "bot",
            text: "Hey! How is your health and mood today? I'm Echo Mind, your compassionate listener. If you need someone to talk to, I can also match you with an anonymous peer supporter for a secret chat! 💙🌿",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
    ],
    isAITyping: false,

    // Secret Chat
    secretStatus: "idle",
    secretPeer: null,
    secretRoomID: null,
    secretMessages: [],
    secretPeerTyping: false,

    openAI: () => set({ isAI: !get().isAI }),
    openProfile: () => set({ isProfile: !get().isProfile }),
    openNotification: () => set({ isNotiOpen: !get().isNotiOpen }),
    setOnlineCount: (count: number) => set({ onlineCount: count }),
    setActiveChatTab: (tab: "ai" | "secret") => set({ activeChatTab: tab }),

    handleNotification: (notification: Notification[]) => {
        set({ notifications: notification || [] });
    },

    readNotification: (notiID: string): void => {
        const { notifications } = get();
        const updatedNoti = notifications.map((noti) => {
            if (noti._id === notiID) {
                return { ...noti, read: true };
            }
            return noti;
        });
        set({ notifications: updatedNoti });
        socket.emit("read-notification", notiID);
    },

    deleteNotification: (notiID: string): void => {
        const { notifications } = get();
        const updatedNoti = notifications.filter((noti) => noti?._id !== notiID);
        set({ notifications: updatedNoti });
        socket.emit("delete-notification", notiID);
    },

    clearAllNotifications: (): void => {
        const { notifications } = get();
        notifications.forEach((n) => socket.emit("delete-notification", n._id));
        set({ notifications: [] });
    },

    // AI Chat
    sendAIMessage: (text: string): void => {
        if (!text.trim()) return;

        const userMsg: AIMessage = {
            id: `usr_${Date.now()}`,
            sender: "user",
            text: text.trim(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        const currentMessages = [...get().aiMessages, userMsg];
        set({ aiMessages: currentMessages, isAITyping: true });

        // Build history for backend AI
        const history = currentMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
        }));

        socket.emit("ai:message", { message: text.trim(), history }, (response: any) => {
            if (response?.text) {
                const botMsg: AIMessage = {
                    id: `bot_${Date.now()}`,
                    sender: "bot",
                    text: response.text,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                };
                set((state) => ({
                    aiMessages: [...state.aiMessages, botMsg],
                    isAITyping: false,
                }));
            }
        });
    },

    addAIMessage: (msg: AIMessage): void => {
        set((state) => ({
            aiMessages: [...state.aiMessages, msg],
            isAITyping: false,
        }));
    },

    setAITyping: (typing: boolean): void => {
        set({ isAITyping: typing });
    },

    // Secret Chat
    startSecretMatch: (feeling?: string): void => {
        set({
            secretStatus: "searching",
            secretPeer: null,
            secretRoomID: null,
            secretMessages: [],
            activeChatTab: "secret",
        });
        socket.emit("secret:find-match", { feeling: feeling || "Normal" });
    },

    cancelSecretMatch: (): void => {
        set({ secretStatus: "idle" });
        socket.emit("secret:cancel-match");
    },

    sendSecretMessage: (text: string): void => {
        const { secretRoomID } = get();
        if (!secretRoomID || !text.trim()) return;
        socket.emit("secret:send-message", { roomID: secretRoomID, text: text.trim() });
    },

    leaveSecretChat: (): void => {
        socket.emit("secret:leave-chat");
        set({
            secretStatus: "idle",
            secretPeer: null,
            secretRoomID: null,
            secretMessages: [],
        });
    },

    setSecretMatched: (roomID: string, peer: SecretPeer): void => {
        set({
            secretStatus: "matched",
            secretRoomID: roomID,
            secretPeer: peer,
            activeChatTab: "secret",
            secretMessages: [
                {
                    id: "sys_matched",
                    senderID: "system",
                    senderAlias: "System",
                    text: `Connected with ${peer.alias} (${peer.feeling}). This secret chat is completely anonymous. Share freely! 💙`,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    isMe: false,
                },
            ],
        });
    },

    setSecretStatus: (status: "idle" | "searching" | "matched" | "ended"): void => {
        set({ secretStatus: status });
    },

    addSecretMessage: (msg: SecretMessage): void => {
        set((state) => ({
            secretMessages: [...state.secretMessages, msg],
        }));
    },

    setSecretPeerTyping: (isTyping: boolean): void => {
        set({ secretPeerTyping: isTyping });
    },
}));

export default useAppStore;