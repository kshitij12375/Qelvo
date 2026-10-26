import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import { X } from 'lucide-react';
import "../ui/ChatHeader.css";



const ChatHeader = () => {
    const { selectedUser, setSelectedUsers } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const isOnline = onlineUsers.includes(selectedUser._id);


    return (
        <div className="chat-header">

            <div className="chat-header-avatar">
                <img
                    src={selectedUser.profilePic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh8yCap-OFEzeJLnZAtzinq6qTDowXUNgKJpzN66oAneVnkpNz8hOoJcQ&s=10'} alt={selectedUser.fullName} />
                {isOnline && <span className="presence-indicator" aria-label="Online" />}
            </div>

            <div className="chat-header-details">
                <h3>{selectedUser.fullName}</h3>
                <p className={`chat-header-status ${isOnline ? 'is-online' : ''}`}>
                    {isOnline ? 'Online' : 'Offline'}
                </p>
            </div>

            <button
                className="chat-header-close"
                onClick={() => setSelectedUsers(null)}
            >
                <X />
            </button>

        </div>
    )
}

export default ChatHeader
