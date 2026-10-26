import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useAuthStore } from '../store/useAuthStore';
import "../ui/ChatContainer.css";
import { formatMessageTime } from '../lib/utils';
const ChatContainer = () => {

  const { messages, isMessagesLoading, getMessages, selectedUser,subscribeToMessages, unsubscribeToMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef=useRef(null);



  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return ()=>  unsubscribeToMessages();
  }, [selectedUser._id, getMessages ,subscribeToMessages, unsubscribeToMessages]);

  useEffect(()=>{
   if(messageEndRef.current){
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
   }

  },[messages]);



  if (isMessagesLoading) {
    return (
      <aside className="sidebar sidebar-loading" aria-label="Contacts">
        <Loader className="sidebar-spinner" aria-label="Loading contacts" />
      </aside>
    )
  }

  return (
    <div className="chat-container">

      <ChatHeader />

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message._id} className={`chat ${message.senderId == authUser._id ? "chat-end" : "chat-start"}`}>
            <div className='chat-image avatar'>
              <img
                src={message.senderId == authUser._id ? authUser.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh8yCap-OFEzeJLnZAtzinq6qTDowXUNgKJpzN66oAneVnkpNz8hOoJcQ&s=10" : selectedUser.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh8yCap-OFEzeJLnZAtzinq6qTDowXUNgKJpzN66oAneVnkpNz8hOoJcQ&s=10"} />

            </div>

            <div>
              <time>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className='chat-bubble'>
              {message.image && (

                <img src={message.image} alt='attachment' />

              )}
              {message.text && (
                <p>{message.text}</p>
              )}
            </div>
          </div>
        ))



        }
        <div ref={messageEndRef} />
      </div>

      <MessageInput />

    </div>
  )
}

export default ChatContainer
