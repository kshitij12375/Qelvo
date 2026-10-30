import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ||
    (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingUp: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.error("Error in checkAuth:", error);
            set({ authUser: null });
            get().disconnectSocket();
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            console.error("Error in signup:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingUp: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            console.error("Error in login:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isLoggingUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            get().disconnectSocket();
            set({ authUser: null, onlineUsers: [] });
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Error in logout:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/updateProfile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        if (socket) socket.disconnect();

        const newSocket = io(SOCKET_URL, { withCredentials: true });
        newSocket.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }));
        newSocket.on("connect_error", (error) => {
            console.error("Socket connection failed:", error.message);
        });

        set({ socket: newSocket });
    },

    disconnectSocket: () => {
        const { socket } = get();
        socket?.disconnect();
        set({ socket: null, onlineUsers: [] });
    }
}));
