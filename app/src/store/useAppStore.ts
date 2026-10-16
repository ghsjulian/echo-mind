import { create } from "zustand"
import { sendNotification } from "../tools/handle-notification"

export interface Notification {
    _id: string
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
    handleNotification: (notification: Notification[]) => void
    readNotification: (notiID: string) => void
    deleteNotification: (notiID: string) => void
}

const useAppStore = create<AppState>((set, get) => ({
    isAI: false,
    isProfile: false,
    isNotiOpen: false,
    notifications: [],

    openAI: () => set({ isAI: !get().isAI }),
    openProfile: () => set({ isProfile: !get().isProfile }),
    openNotification: () => set({ isNotiOpen: !get().isNotiOpen }),
    handleNotification: (notification: Notification[]) => {
        set({ notifications: notification })
        // Display the first notification on device 
        // This will be added latter
    },
    readNotification: (notiID: string): void => {
        const { notifications } = get()
        const updatedNoti = notifications.map((noti) => {
            if (noti._id === notiID || notiID === noti._id) {
                return {
                    ...noti,
                    read: true
                };
            }
            return noti;
        });
        set({ notifications: updatedNoti })
    },
    deleteNotification: (notiID: string): void => {
        const { notifications } = get()
        const updatedNoti = notifications.filter((noti) => noti?._id !== notiID || notiID !== noti?._id)
        set({ notifications: updatedNoti })
    }
}))

export default useAppStore