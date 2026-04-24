import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";
import type { MessageResponseDto, SendMessageRequest } from "./types/chat";

interface ChatRoomProps {
    conversationId: string;
    currentUserId: string; // Dùng ID để so sánh chính xác tin nhắn của mình
}

const ChatRoom: React.FC<ChatRoomProps> = ({
                                               conversationId,
                                               currentUserId,
                                           }) => {
    const [messages, setMessages] = useState<MessageResponseDto[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const stompClientRef = useRef<Stomp.Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null); // Để auto scroll

    // --- CẤU HÌNH TOKEN ---
    const HARDCODED_TOKEN =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBkYWJibGUuY29tIiwiaWF0IjoxNzY0NDEwNDAwLCJleHAiOjE3NjQ0MTIyMDB9.MNoJ6wrfmdBI5WxFqKWrqRPW6kpEBei9NSZuEqbwGUk";
    // ----------------------

    // 1. KẾT NỐI WEBSOCKET
    useEffect(() => {
        const socket = new SockJS("http://localhost:3366/ws");
        const client = Stomp.over(socket);
        client.debug = () => {}; // Tắt log debug cho gọn

        client.connect(
            {},
            () => {
                console.log(`Connected to Conversation: ${conversationId}`);

                // Subscribe kênh chat
                client.subscribe(
                    `/topic/conversation/${conversationId}`,
                    (messageOutput) => {
                        const newMessage: MessageResponseDto = JSON.parse(
                            messageOutput.body
                        );
                        setMessages((prev) => [...prev, newMessage]);
                    }
                );
            },
            (error) => {
                console.error("WebSocket Error:", error);
            }
        );

        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.disconnect(() => console.log("Disconnected"));
            }
        };
    }, [conversationId]);

    // 2. AUTO SCROLL XUỐNG DƯỚI KHI CÓ TIN MỚI
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 3. GỬI TIN NHẮN (GỌI API)
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const payload: SendMessageRequest = {
            conversationId: conversationId,
            content: inputMessage,
        };

        try {
            await axios.post("http://localhost:3366/api/chat/send-message", payload, {
                headers: {
                    Authorization: `Bearer ${HARDCODED_TOKEN}`,
                    "Content-Type": "application/json",
                },
            });
            setInputMessage(""); // Xóa ô nhập, KHÔNG cần setMessages thủ công vì WebSocket sẽ bắn về
        } catch (error) {
            console.error("Lỗi gửi tin:", error);
            alert("Gửi lỗi!");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h4>Chat Room: {conversationId.substring(0, 8)}...</h4>
            </div>

            {/* DANH SÁCH TIN NHẮN */}
            <div style={styles.messageList}>
                {messages.length === 0 && (
                    <div
                        style={{ textAlign: "center", color: "#888", marginTop: "20px" }}
                    >
                        Chưa có tin nhắn nào. Hãy nói "Hello"!
                    </div>
                )}

                {messages.map((msg) => {
                    const isMine = msg.sender.id === currentUserId;
                    return (
                        <div
                            key={msg.id}
                            style={{
                                ...styles.messageRow,
                                justifyContent: isMine ? "flex-end" : "flex-start",
                            }}
                        >
                            {/* Avatar người khác */}
                            {!isMine && (
                                <img
                                    src={msg.sender.avatar || "https://via.placeholder.com/30"}
                                    alt="avt"
                                    style={styles.avatar}
                                />
                            )}

                            <div
                                style={{
                                    ...styles.bubble,
                                    backgroundColor: isMine ? "#0084ff" : "#e4e6eb",
                                    color: isMine ? "#fff" : "#000",
                                }}
                            >
                                <div style={styles.messageContent}>{msg.content}</div>
                                <div
                                    style={{
                                        ...styles.messageTime,
                                        color: isMine ? "#e0e0e0" : "#666",
                                    }}
                                >
                                    {/* Format giờ đơn giản */}
                                    {new Date(msg.createdDate).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {/* Phần tử ẩn để scroll xuống */}
                <div ref={messagesEndRef} />
            </div>

            {/* KHUNG NHẬP LIỆU */}
            <div style={styles.inputArea}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Nhập tin nhắn..."
                    style={styles.input}
                />
                <button onClick={handleSendMessage} style={styles.sendButton}>
                    Gửi ➤
                </button>
            </div>
        </div>
    );
};

// CSS-in-JS
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: "100%",
        maxWidth: "600px",
        height: "500px",
        margin: "20px auto",
        border: "1px solid #ccc",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    header: {
        padding: "15px",
        borderBottom: "1px solid #eee",
        backgroundColor: "#f8f9fa",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        fontWeight: "bold",
    },
    messageList: {
        flex: 1,
        padding: "15px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    messageRow: {
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
    },
    avatar: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        objectFit: "cover",
    },
    bubble: {
        padding: "8px 12px",
        borderRadius: "18px",
        maxWidth: "70%",
        wordBreak: "break-word",
        fontSize: "14px",
        lineHeight: "1.4",
    },
    messageContent: {
        marginBottom: "2px",
    },
    messageTime: {
        fontSize: "10px",
        textAlign: "right",
    },
    inputArea: {
        padding: "10px",
        borderTop: "1px solid #eee",
        display: "flex",
        gap: "10px",
        backgroundColor: "#fff",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "20px",
        border: "1px solid #ddd",
        outline: "none",
    },
    sendButton: {
        padding: "10px 20px",
        borderRadius: "20px",
        border: "none",
        backgroundColor: "#0084ff",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default ChatRoom;
