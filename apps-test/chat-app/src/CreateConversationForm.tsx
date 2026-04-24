import React, { useState } from 'react';
import axios from 'axios';
import { ConversationType, type CreateConversationRequest } from './types/conversation';

// 1. Cập nhật Interface Props để nhận token từ App.tsx
interface Props {
    onConversationCreated?: (conversation: any) => void;
    token: string; // <-- QUAN TRỌNG: Nhận token từ cha truyền xuống
}

const CreateConversationForm: React.FC<Props> = ({ onConversationCreated, token }) => {
    const [type, setType] = useState<ConversationType>("PRIVATE"); // Dùng string "PRIVATE" để tránh lỗi enum
    const [groupName, setGroupName] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [userEmails, setUserEmails] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleAddEmail = () => {
        if (!emailInput.trim()) return;
        if (type === "PRIVATE" && userEmails.length >= 1) {
            setError("Chat riêng tư chỉ được mời 1 người.");
            return;
        }
        if (userEmails.includes(emailInput.trim())) {
            setError("Email này đã được thêm.");
            return;
        }
        setUserEmails([...userEmails, emailInput.trim()]);
        setEmailInput('');
        setError('');
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        setUserEmails(userEmails.filter(email => email !== emailToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (userEmails.length === 0) {
            setError("Vui lòng mời ít nhất một người.");
            return;
        }
        if (type === "GROUP" && !groupName.trim()) {
            setError("Vui lòng nhập tên nhóm.");
            return;
        }

        const payload: CreateConversationRequest = {
            type: type,
            userEmails: userEmails,
            name: type === "GROUP" ? groupName : undefined
        };

        try {
            setIsLoading(true);

            // 2. Dùng token từ props thay vì hardcode
            const response = await axios.post(
                'http://localhost:3366/api/conversation/create-conversation',
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // <-- SỬ DỤNG TOKEN TỪ PROPS
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.isSuccess) {
                setSuccessMsg("Tạo thành công!");
                setUserEmails([]);
                setGroupName('');
                if (onConversationCreated) {
                    setTimeout(() => {
                        onConversationCreated(response.data.data);
                    }, 1000);
                }
            } else {
                setError(response.data.errorMessage || "Có lỗi xảy ra.");
            }

        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(err.response.data.errorMessage || "Lỗi server.");
            } else {
                setError("Không thể kết nối đến server.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h3 style={{color: '#333'}}>Tạo cuộc trò chuyện mới</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label>Loại trò chuyện:</label>
                    <select
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value as any);
                            setUserEmails([]);
                        }}
                        style={styles.input}
                    >
                        <option value="PRIVATE">Chat Riêng (1-1)</option>
                        <option value="GROUP">Chat Nhóm</option>
                    </select>
                </div>

                {type === "GROUP" && (
                    <div style={styles.formGroup}>
                        <label>Tên nhóm:</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Nhập tên nhóm..."
                            style={styles.input}
                        />
                    </div>
                )}

                <div style={styles.formGroup}>
                    <label>Mời thành viên (Email):</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="user@example.com"
                            style={styles.input}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                        />
                        <button type="button" onClick={handleAddEmail} style={styles.addButton}>Thêm</button>
                    </div>
                </div>

                {userEmails.length > 0 && (
                    <div style={styles.emailList}>
                        {userEmails.map((email, index) => (
                            <span key={index} style={styles.emailTag}>
                                {email} <button type="button" onClick={() => handleRemoveEmail(email)} style={styles.removeBtn}>×</button>
                            </span>
                        ))}
                    </div>
                )}

                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                {successMsg && <div style={{ color: 'green', marginTop: '10px' }}>{successMsg}</div>}

                <button type="submit" style={styles.submitButton} disabled={isLoading}>
                    {isLoading ? "Đang xử lý..." : "Tạo cuộc trò chuyện"}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: { maxWidth: '500px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' },
    form: { display: 'flex', flexDirection: 'column' as 'column', gap: '15px' },
    formGroup: { display: 'flex', flexDirection: 'column' as 'column', gap: '5px', textAlign: 'left' as 'left', color: '#333' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 },
    addButton: { padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    emailList: { display: 'flex', flexWrap: 'wrap' as 'wrap', gap: '5px' },
    emailTag: { backgroundColor: '#e9ecef', padding: '5px 10px', borderRadius: '15px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', color: '#333' },
    removeBtn: { background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' as 'bold' },
    submitButton: { padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }
};

export default CreateConversationForm;