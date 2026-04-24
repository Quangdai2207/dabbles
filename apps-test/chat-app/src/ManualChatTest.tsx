import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import { type MessageResponseDto } from './types/conversation';

interface Props {
    prefillToken?: string;
    prefillConversationId?: string;
}

const ManualChatTest: React.FC<Props> = ({ prefillToken, prefillConversationId }) => {
    // 1. Config lưu Token và ID hiện tại
    const [config, setConfig] = useState({
        token: prefillToken || '',
        conversationId: prefillConversationId || ''
    });

    // 2. Trạng thái đã vào phòng chưa
    // Khởi tạo: Nếu có sẵn prop ID và Token thì set luôn là TRUE
    const [isJoined, setIsJoined] = useState<boolean>(!!(prefillToken && prefillConversationId));

    const [messages, setMessages] = useState<MessageResponseDto[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const stompClientRef = useRef<Stomp.Client | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- 3. QUAN TRỌNG: TỰ ĐỘNG JOIN KHI CHỌN TỪ MENU ---
    // Mỗi khi props prefillConversationId thay đổi (người dùng bấm vào list bên trái)
    useEffect(() => {
        if (prefillConversationId && prefillToken) {
            console.log("🔄 Phát hiện ID mới, đang chuyển phòng:", prefillConversationId);

            // Cập nhật lại config ngay lập tức
            setConfig({
                token: prefillToken,
                conversationId: prefillConversationId
            });

            // Xóa tin nhắn cũ để tránh nhầm lẫn
            setMessages([]);

            // Bắt buộc setJoined = true để hiển thị màn hình chat
            setIsJoined(true);
        }
    }, [prefillConversationId, prefillToken]);

    // --- 4. WebSocket Logic (Chỉ chạy khi isJoined = true) ---
    useEffect(() => {
        if (!isJoined) return;

        // Nếu socket cũ còn kết nối, ngắt trước khi tạo cái mới
        if (stompClientRef.current?.connected) {
            stompClientRef.current.disconnect(() => console.log("Ngắt kết nối cũ..."));
        }

        const socket = new SockJS('http://localhost:3366/ws'); // Check lại port backend
        const client = Stomp.over(socket);
        client.debug = () => {}; // Tắt log debug cho gọn

        client.connect(
            { 'Authorization': `Bearer ${config.token.trim()}` },
            () => {
                console.log(`✅ Đã kết nối phòng: ${config.conversationId}`);

                // TODO: Gọi API lấy lịch sử tin nhắn ở đây nếu có (GET /api/chat/history/...)

                client.subscribe(`/topic/conversation/${config.conversationId}`, (messageOutput) => {
                    const newMessage: MessageResponseDto = JSON.parse(messageOutput.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            },
            (error) => {
                console.error('❌ WebSocket Error:', error);
                // Nếu lỗi thì ko đá ra ngoài, chỉ log lỗi để user biết
            }
        );

        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.disconnect(() => console.log("Disconnected Chat"));
            }
        };
    }, [isJoined, config.conversationId, config.token]); // Chạy lại khi config thay đổi

    // Auto scroll xuống cuối
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
        try {
            await axios.post(
                'http://localhost:3366/api/chat/send-message',
                { conversationId: config.conversationId, content: inputMessage },
                { headers: { 'Authorization': `Bearer ${config.token.trim()}`, 'Content-Type': 'application/json' } }
            );
            setInputMessage('');
        } catch (error: any) {
            console.error("Gửi lỗi:", error);
            alert("Gửi thất bại!");
        }
    };

    // --- MÀN HÌNH NHẬP TAY (Chỉ hiện khi isJoined = false) ---
    if (!isJoined) {
        return (
            <div style={styles.container}>
                <h3 style={{textAlign: 'center', color: '#fff'}}>Chat Thủ Công</h3>
                <div style={styles.formGroup}>
                    <label>Conversation ID:</label>
                    <input
                        style={styles.input}
                        value={config.conversationId}
                        onChange={e => setConfig({...config, conversationId: e.target.value})}
                        placeholder="Nhập ID cuộc trò chuyện..."
                    />
                </div>
                <div style={styles.formGroup}>
                    <label>Token:</label>
                    <textarea
                        style={{...styles.input, height: '80px', fontSize: '12px', fontFamily: 'monospace'}}
                        value={config.token}
                        onChange={e => setConfig({...config, token: e.target.value})}
                        placeholder="Bearer token..."
                    />
                </div>
                <button style={styles.button} onClick={() => {
                    if(config.token && config.conversationId) setIsJoined(true);
                    else alert("Vui lòng nhập đủ thông tin!");
                }}>Vào Chat</button>
            </div>
        );
    }

    // --- MÀN HÌNH CHAT ROOM (Khi isJoined = true) ---
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span>Room: {config.conversationId.substring(0, 8)}...</span>
                <button onClick={() => {
                    setIsJoined(false);
                    setMessages([]);
                }} style={styles.exitBtn}>Thoát</button>
            </div>

            <div style={styles.messageList}>
                {messages.length === 0 && (
                    <div style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>
                        Hãy bắt đầu cuộc trò chuyện.
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} style={styles.messageItem}>
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
                />
                <button onClick={handleSendMessage} style={styles.sendButton}>Gửi</button>
            </div>
        </div>
    );
};

// CSS Dark Mode
const styles: { [key: string]: React.CSSProperties } = {
    container: { maxWidth: '600px', margin: '20px auto', border: '1px solid #333', borderRadius: '8px', padding: '20px', backgroundColor: '#1e1e1e', color: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' },
    formGroup: { marginBottom: '15px' },
    input: { width: '100%', padding: '12px', marginTop: '5px', boxSizing: 'border-box', backgroundColor: '#2d2d2d', color: '#fff', border: '1px solid #444', borderRadius: '5px', outline: 'none' },
    button: { width: '100%', padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    header: { paddingBottom: '15px', borderBottom: '1px solid #444', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '16px' },
    exitBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
    messageList: { height: '400px', overflowY: 'auto', marginBottom: '15px', border: '1px solid #333', borderRadius: '8px', padding: '15px', backgroundColor: '#000' },
    messageItem: { padding: '10px 15px', backgroundColor: '#333', borderRadius: '15px', marginBottom: '10px', maxWidth: '85%', color: '#fff', border: '1px solid #444' },
    senderName: { fontWeight: 'bold', fontSize: '11px', color: '#aaa', marginBottom: '4px', textTransform: 'uppercase' },
    messageContent: { fontSize: '14px', lineHeight: '1.4', wordBreak: 'break-word' },
    time: { fontSize: '10px', color: '#666', textAlign: 'right', marginTop: '4px' },
    inputArea: { display: 'flex', gap: '10px' },
    sendButton: { padding: '0 25px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default ManualChatTest;