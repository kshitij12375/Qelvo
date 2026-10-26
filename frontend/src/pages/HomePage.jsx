import React from 'react'
import { useChatStore } from '../store/useChatStore'
import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';


const HomePage = () => {

  const { selectedUser } = useChatStore();

  return (
    <main className="home-page">
      <Sidebar />

      <section className="chat-panel">
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </section>
    </main>
  )
}

export default HomePage
