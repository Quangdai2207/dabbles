import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { type ConversationResponseDto } from './types/conversation';

interface Props {
    token: string;
    onSelectConversation: (conversationId: string) => void;
    // Thêm prop này để App có thể ra lệnh reload list khi thoát chat
    refreshTrigger?: number;
}

const ConversationList: React.FC<Props> = ({ token, onSelectConversation, refreshTrigger }) => {
    const [conversations, setConversations] = useState<ConversationResponseDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (token) {
            fetchConversations();
        }
    }, [token, refreshTrigger]); // Reload khi token đổi HOẶC refreshTrigger đổi

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                'http://localhost:3366/api/conversation/conversation-of-user',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.isSuccess) {
                const sorted = response.data.data.sort((a: ConversationResponseDto, b: ConversationResponseDto) =>
                    new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
                );
                setConversations(sorted);
            } else {
                setError(response.data.errorMessage);
            }
        } catch (err) {
            console.error(err);
            // setError("Lỗi tải danh sách."); // Có thể comment lại cho đỡ rối
        } finally {
            setLoading(false);
        }
    };

    const getDisplayName = (conv: ConversationResponseDto) => {
        if (conv.type === "GROUP") return conv.name || "Nhóm không tên";
        const other = conv.participants && conv.participants.length > 0 ? conv.participants[0] : null;
        return other ? other.name : "Chat riêng";
    };

    return (
        <div style={styles.container}>
            <h3 style={{textAlign: 'center', borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0}}>
                Hộp thư đến
            </h3>

            {loading && <div style={{textAlign: 'center', fontSize: '12px', color: '#888'}}>Đang cập nhật...</div>}

            <div style={styles.list}>
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        style={styles.item}
                        onClick={() => onSelectConversation(conv.id)}
                    >
                        <div style={styles.avatar}>
                            {getDisplayName(conv).charAt(0).toUpperCase()}
                        </div>

                        <div style={styles.info}>
                            <div style={styles.topRow}>
                                <div style={styles.name}>{getDisplayName(conv)}</div>
                                <div style={styles.time}>
                                    {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                </div>
                            </div>

                            <div style={styles.bottomRow}>
                                <div style={styles.meta}>
                                    <span style={styles.typeBadge}>{conv.type}</span>
                                </div>

                                {/* --- HIỂN THỊ SỐ TIN NHẮN CHƯA ĐỌC --- */}
                                {conv.unreadMessageCount > 0 && (
                                    <div style={styles.badge}>
                                        {conv.unreadMessageCount > 99 ? '99+' : conv.unreadMessageCount}
                                    </div>
                                )}
                                {/* --------------------------------------- */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        borderRadius: '8px',
        padding: '15px',
        border: '1px solid #333',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as 'column',
        boxSizing: 'border-box' as 'border-box'
    },
    list: { flex: 1, overflowY: 'auto' as 'auto', marginTop: '10px', paddingRight: '5px' },
    item: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderBottom: '1px solid #333',
        cursor: 'pointer',
        transition: 'background 0.2s',
        backgroundColor: '#252525',
        marginBottom: '8px',
        borderRadius: '8px'
    },
    avatar: {
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginRight: '15px',
        fontSize: '20px',
        flexShrink: 0
    },
    info: { flex: 1, minWidth: 0 },
    topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
    bottomRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    name: { fontWeight: 'bold', fontSize: '15px', whiteSpace: 'nowrap' as 'nowrap', overflow: 'hidden' as 'hidden', textOverflow: 'ellipsis' as 'ellipsis', marginRight: '10px' },
    time: { fontSize: '11px', color: '#888', whiteSpace: 'nowrap' as 'nowrap' },
    meta: { fontSize: '12px', color: '#aaa' },
    typeBadge: { backgroundColor: '#333', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', textTransform: 'uppercase' as 'uppercase', color: '#aaa' },

    // Style cho chấm đỏ
    badge: {
        backgroundColor: '#ff3b30', // Màu đỏ
        color: 'white',
        fontSize: '11px',
        fontWeight: 'bold',
        borderRadius: '10px',
        padding: '2px 8px',
        minWidth: '18px',
        textAlign: 'center' as 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }
};

export default ConversationList;