import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import { useLocation, useParams } from "react-router-dom";

const ChatPage = () => {
    const { id: guideId } = useParams();
    const { state } = useLocation();
    const tourist = JSON.parse(localStorage.getItem("user"));

    const touristId = tourist?._id || null;
    const chatId = useRef(null); // We'll update this later when chat is set

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    const scrollRef = useRef();
    const socket = useRef(null);

    // Connect socket
    useEffect(() => {
        socket.current = io("http://localhost:8800");

        if (touristId) {
            socket.current.emit("add-user", touristId);
        }

        socket.current.on("msg-receive", (data) => {
            setArrivalMessage({ fromSelf: false, message: data.msg });
        });

        socket.current.on("typing", (typing) => {
            setIsTyping(typing);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [touristId]);

    // Handle arrival message
    useEffect(() => {
        if (arrivalMessage) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage]);

    // Create or get existing chat
    useEffect(() => {
        const getOrCreateChat = async () => {
            try {
                const res = await axios.post("http://localhost:8800/api/chat", {
                    touristId,
                    guideId,
                });
                setChat(res.data);
                chatId.current = res.data._id; // update chatId ref
            } catch (err) {
                console.error("Error creating chat:", err);
            }
        };

        if (touristId && guideId) {
            getOrCreateChat();
        }
    }, [touristId, guideId]);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (chatId.current) {
                    const res = await axios.get(`http://localhost:8800/api/message/${chatId.current}`);
                    setMessages(res.data);
                }
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };

        fetchMessages();
    }, [chat]); // re-run when chat changes (chat._id updated)

    // Send message
    const sendMessage = async () => {
        const trimmedMessage = newMessage.trim();
        if (!trimmedMessage) return;

        socket.current.emit("send-msg", {
            to: guideId,
            from: touristId,
            msg: trimmedMessage,
        });

        try {
            const res = await axios.post("http://localhost:8800/api/message", {
                chatId: chat?._id,
                senderId: touristId,
                text: trimmedMessage,
            });

            setMessages([...messages, { fromSelf: true, message: res.data.text }]);
            setNewMessage("");
            socket.current.emit("typing", false);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    // Handle typing
    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        socket.current.emit("typing", true);

        setTimeout(() => {
            socket.current.emit("typing", false);
        }, 2000);
    };

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat with {state?.guide?.name || "Guide"}</h2>
            </div>

            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        ref={scrollRef}
                        className={`chat-bubble ${msg.fromSelf ? "sent" : "received"}`}
                    >
                        {msg.message}
                    </div>
                ))}
                {isTyping && <p className="typing-indicator">Guide is typing...</p>}
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />
                <button onClick={sendMessage}>
                    <FiSend size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatPage;