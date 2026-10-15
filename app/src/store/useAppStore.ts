import { create } from "zustand"
import { sendNotification } from "../tools/handle-notification"

export interface Notification {
    sender_id: string
    receiver_id: string
    post_id: string
    text: string
    time: string
    read: boolean
}

interface AppState {
    isAI: boolean;
    isProfile: boolean
    isNotiOpen: boolean
    notifications: Notification[]

    openAI: () => void;
    openProfile: () => void
    openNotification: () => void
    handleNotification: (notification: Notification) => void
}

const useAppStore = create<AppState>((set, get) => ({
    isAI: false,
    isProfile: false,
    isNotiOpen: false,
    notifications: [],

    openAI: () => set({ isAI: !get().isAI }),
    openProfile: () => set({ isProfile: !get().isProfile }),
    openNotification: () => set({ isNotiOpen: !get().isNotiOpen }),
    handleNotification: (notification: Notification) => {
        sendNotification("/icons/man.png", notification.text)
        console.log(notification)
    }

}))

export default useAppStore