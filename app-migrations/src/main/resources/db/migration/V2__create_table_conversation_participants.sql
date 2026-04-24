-- Author: Phạm Minh Khang
-- Date: 202510082102
CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    
    -- Thời điểm vào nhóm
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Quyền: 'MEMBER' hoặc 'ADMIN' (cho nhóm)
    role VARCHAR(20) DEFAULT 'MEMBER',
    
    -- Dùng để tính số tin nhắn chưa đọc (Unread count)
    last_read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_left BOOLEAN DEFAULT FALSE,
    deleted_message_at DATETIME,
    -- Khóa chính tổ hợp
    PRIMARY KEY (conversation_id, user_id)
);