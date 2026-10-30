import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessageLoading: false,
    messageListener: null,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });
        } catch (error) {
            console.error("Error getting users:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        if (!userId) return;
        set({ isMessageLoading: true, messages: [] });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            if (get().selectedUser?._id === userId) {
                set({ messages: res.data });
            }
        } catch (error) {
            console.error("Error getting messages:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessages: async (messageData) => {
        const { selectedUser } = get();
        if (!selectedUser?._id) return;

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...get().messages, res.data] });
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
            throw error;
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;
        if (!selectedUser?._id || !socket) return;

        get().unsubscribeToMessages();

        const selectedUserId = selectedUser._id;
        const listener = (newMessage) => {
            if (newMessage.senderId !== selectedUserId) return;
            set({ messages: [...get().messages, newMessage] });
        };

        socket.on("newMessage", listener);
        set({ messageListener: listener });
    },

    unsubscribeToMessages: () => {
        const { socket } = useAuthStore.getState();
        const listener = get().messageListener;
        if (socket && listener) {
            socket.off("newMessage", listener);
        }
        set({ messageListener: null });
    },

    setSelectedUsers: (selectedUser) => set({ selectedUser, messages: [] })
}));
