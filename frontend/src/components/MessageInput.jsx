import React, { useRef, useState } from 'react'
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useChatStore } from '../store/useChatStore';
import "../ui/MessageInput.css";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessages } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessages = async (e) => {
        e.preventDefault();

        if (!text.trim() && !imagePreview) return;

        await sendMessages({
            text: text.trim(),
            image: imagePreview
        });

        setText("");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="message-input">
            {imagePreview && (
                <div className="message-input-preview">
                    <img className="message-input-preview-image" src={imagePreview} alt="Selected attachment" />
                    <button type="button" className="message-input-remove-image" onClick={removeImage}>
                        <X />
                    </button>
                </div>
            )}

            <form className="message-input-form" onSubmit={handleSendMessages}>
                <input
                    className="message-input-text"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write a message..."
                />
                <input
                    type="file"
                    className="message-input-file hidden"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />
                <button className="message-input-attach" type="button" onClick={() => fileInputRef.current?.click()}>
                    <Image />
                </button>
                <button type="submit" disabled={!text.trim() && !imagePreview}>
                    <Send />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
