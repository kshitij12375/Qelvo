import React from 'react'
import "../ui/NoChatSelected.css"
import { MessageSquare } from 'lucide-react'

const NoChatSelected = () => {
  return (
    <div className='noChat'>
      <h1>Welcome to Qelvo</h1>
      <MessageSquare />
      <p>Select a conversation from the sidebar to start the chatting</p>

    </div>
  )
}

export default NoChatSelected
