import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import { type MessageResponseDto } from './types/conversation';

interface Props {
    token: string;
    conversationId: string;
    onExit: () => void;
}

const ChatWindow: React.FC<Props> = ({ token, conversationId, onExit }) => {
    const [messages, setMessages] = useState<MessageResponseDto[]>([]);
    const [inputMessage, setInputMessage] = useState('');

    const stompClientRef = useRef<Stomp.Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. BIẾN CỜ ĐỂ KIỂM TRA COMPONENT CÒN SỐNG KHÔNG
    const isMountedRef = useRef(true);

    // Đánh dấu component đã chết khi unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => { isMountedRef.current = false; };
    }, []);

    // --- HÀM MARK AS READ ---
    const markAsRead = async () => {
        // CHẶN: Nếu đã thoát rồi thì đừng gọi API nữa
        if (!isMountedRef.current) return;

        try {
            await axios.put(
                `http://localhost:3366/api/conversation/mark-as-read/${conversationId}`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            console.log("✅ Đã đánh dấu đã đọc");
        } catch (error) {
            console.error("Lỗi mark as read:", error);
        }
    };

    // --- LOAD LỊCH SỬ ---
    useEffect(() => {
        if (!conversationId || !token) return;

        const fetchHistory = async () => {
            try {
                setMessages([]);
                const response = await axios.get(
                    'http://localhost:3366/api/chat/message-of-conversation',
                    {
                        params: { conversationId },
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                    }
                );
                if (response.data.isSuccess && isMountedRef.current) {
                    setMessages(response.data.data);
                }
            } catch (error) {
                console.error("Lỗi tải lịch sử:", error);
            }
        };

        fetchHistory();
        markAsRead(); // Gọi lần đầu khi vào

    }, [conversationId, token]);

    // --- WEBSOCKET LOGIC ---
    useEffect(() => {
        if (!token || !conversationId) return;

        const socket = new SockJS('http://localhost:3366/ws');
        const client = Stomp.over(socket);
        client.debug = () => {};

        // Lưu client vào ref ngay lập tức
        stompClientRef.current = client;

        client.connect({ 'Authorization': `Bearer ${token}` }, () => {
            // Kiểm tra zombie lần 1
            if (!isMountedRef.current) {
                client.disconnect(() => {});
                return;
            }

            console.log(`✅ Socket Connected: ${conversationId}`);

            client.subscribe(`/topic/conversation/${conversationId}`, (messageOutput) => {
                // Kiểm tra zombie lần 2: Nếu đã thoát, TUYỆT ĐỐI KHÔNG XỬ LÝ GÌ CẢ
                if (!isMountedRef.current) return;

                const newMessage: MessageResponseDto = JSON.parse(messageOutput.body);

                setMessages((prev) => {
                    const isExist = prev.some((msg) => msg.id === newMessage.id);
                    if (isExist) return prev;
                    return [...prev, newMessage];
                });

                // Chỉ mark read nếu user vẫn đang mở cửa sổ này
                markAsRead();
            });
        }, (err) => {
            console.log("Socket error or disconnect");
        });

        // --- CLEANUP FUNCTION QUAN TRỌNG ---
        return () => {
            // Ngắt kết nối ngay lập tức khi thoát
            if (stompClientRef.current) {
                const clientToDisconnect = stompClientRef.current;
                stompClientRef.current = null; // Xóa ref để tránh dùng lại

                if (clientToDisconnect.connected) {
                    clientToDisconnect.disconnect(() => {
                        console.log("🛑 Disconnected Chat Socket");
                    });
                } else if (socket.readyState !== WebSocket.CLOSED) {
                    // Nếu đang connecting dở dang thì đóng socket thô luôn
                    socket.close();
                }
            }
        };
    }, [conversationId, token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
        try {
            await axios.post(
                'http://localhost:3366/api/chat/send-message',
                { conversationId: conversationId, content: inputMessage },
                { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            if (isMountedRef.current) setInputMessage('');
        } catch (error) {
            console.error("Gửi lỗi:", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span>Chat Room</span>
                    <span style={{fontSize: '10px', color: '#aaa'}}>{conversationId.substring(0, 8)}...</span>
                </div>
                <button onClick={onExit} style={styles.exitBtn}>Quay lại</button>
            </div>

            <div style={styles.messageList}>
                {messages.length === 0 && (
                    <div style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>
                        Chưa có tin nhắn.
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={msg.id || index} style={styles.messageItem}>
                        <div style={styles.senderName}>{msg.sender.name}</div>
                        <div style={styles.messageContent}>{msg.content}</div>
                        <div style={styles.time}>{new Date(msg.createdDate).toLocaleTimeString()}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={styles.inputArea}>
                <input
                    style={styles.input}
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Nhập tin nhắn..."
                    autoFocus
                />
                <button onClick={handleSendMessage} style={styles.sendButton}>Gửi</button>
            </div>
        </div>
    );
};

// ... (Giữ nguyên phần styles) ...
const styles: { [key: string]: React.CSSProperties } = {
    container: { maxWidth: '600px', margin: '20px auto', border: '1px solid #333', borderRadius: '8px', padding: '20px', backgroundColor: '#1e1e1e', color: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', height: '500px', display: 'flex', flexDirection: 'column' },
    header: { paddingBottom: '10px', borderBottom: '1px solid #444', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },
    exitBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
    messageList: { flex: 1, overflowY: 'auto', marginBottom: '15px', border: '1px solid #333', borderRadius: '8px', padding: '15px', backgroundColor: '#000' },
    messageItem: { padding: '10px 15px', backgroundColor: '#333', borderRadius: '15px', marginBottom: '10px', maxWidth: '85%', color: '#fff', border: '1px solid #444' },
    senderName: { fontWeight: 'bold', fontSize: '11px', color: '#aaa', marginBottom: '4px', textTransform: 'uppercase' },
    messageContent: { fontSize: '14px', lineHeight: '1.4', wordBreak: 'break-word' },
    time: { fontSize: '10px', color: '#666', textAlign: 'right', marginTop: '4px' },
    inputArea: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '12px', boxSizing: 'border-box', backgroundColor: '#2d2d2d', color: '#fff', border: '1px solid #444', borderRadius: '5px', outline: 'none' },
    sendButton: { padding: '0 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default ChatWindow;