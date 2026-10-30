import React, { useEffect, useRef } from 'react'
import { LoaderCircle } from 'lucide-react';
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useAuthStore } from '../store/useAuthStore';
import "../ui/ChatContainer.css";
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {
  const {
    messages,
    isMessageLoading,
    getMessages,
    selectedUser,
    subscribeToMessages,
    unsubscribeToMessages
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeToMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeToMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessageLoading) {
    return (
      <div className="chat-container chat-loading" aria-label="Loading messages">
        <LoaderCircle className="sidebar-spinner" />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <ChatHeader />
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId == authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className='chat-image avatar'>
              <img
                src={
                  message.senderId == authUser._id
                    ? authUser.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh8yCap-OFEzeJLnZAtzinq6qTDowXUNgKJpzN66oAneVnkpNz8hOoJcQ&s=10"
                    : selectedUser.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh8yCap-OFEzeJLnZAtzinq6qTDowXUNgKJpzN66oAneVnkpNz8hOoJcQ&s=10"
                }
                alt="User avatar"
              />
            </div>
            <div>
              <time>{formatMessageTime(message.createdAt)}</time>
            </div>
            <div className='chat-bubble'>
              {message.image && <img src={message.image} alt='attachment' />}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
