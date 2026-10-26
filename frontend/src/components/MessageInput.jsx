import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import "../ui/MessageInput.css";

const MessageInput = () => {

    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const fileInputRef = useRef(null);
    const { sendMessages } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file.type.startsWith("image/")) {
            return toast.error("please select an image file");


        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }

        reader.readAsDataURL(file);

    }

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleSendMessages = async (e) => {

        e.preventDefault();
        try {
            await sendMessages({
                text: text.trim(),
                image: imagePreview
            })

            setText("");
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (error) {
            console.log("Failed to send message ", error);
        }




    }


    return (
        <div className="message-input">

            {imagePreview && (
                <div className="message-input-preview">
                    <img className="message-input-preview-image" src={imagePreview} />
                    <button className="message-input-remove-image" onClick={removeImage}> <X /> </button>
                </div>
            )}

            <form className="message-input-form" onSubmit={handleSendMessages}>

                <input className="message-input-text" type='text' value={text} onChange={(e) => { setText(e.target.value) }} />
                <input type='file' className='message-input-file hidden' accept='image/*' ref={fileInputRef} onChange={handleImageChange} />
                <button className="message-input-attach" type='button' onClick={() => fileInputRef.current?.click()}> <Image /> </button>
                <button type='submit' disabled={!text.trim() && !imagePreview}><Send /></button>


            </form>

        </div>
    )
}

export default MessageInput
