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


    getUsers: async () => {

        set({ isUsersLoading: true });

        try {
            const res = await axiosInstance.get("/message/users")
            set({ users: res.data });

        } catch (error) {
            console.log("error in getting users", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            set({ isUsersLoading: false });
        }



    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true });

        try {

            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });

        } catch (error) {
            console.log("error in getting messages", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            set({
                isMessageLoading: false
            })
        }

    },
    sendMessages: async (messageData) => {
        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...get().messages, res.data] });

        } catch (error) {
            console.log("error in sendingMessages", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }

    },

    subscribeToMessages:()=>{
        const {selectedUser}=get();



        if(!selectedUser)return;

        const socket=useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId !== selectedUser._id) return;
            set({messages:[...get().messages,newMessage]});
        })

    },

    unsubscribeToMessages:()=>{
        

        const socket=useAuthStore.getState().socket;
        socket.off("newMessage");

       

    },

    setSelectedUsers: (selectedUser) => set({ selectedUser })
}))