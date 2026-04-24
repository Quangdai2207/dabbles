-- Author: Phạm Minh Khang
-- Date: 202510082101
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    
    -- Tên nhóm chat (NULL nếu là chat 1-1)
    name VARCHAR(255),
    
    -- Loại: 'PRIVATE' hoặc 'GROUP'
    type VARCHAR(20) NOT NULL DEFAULT 'PRIVATE',
    
    avatar TEXT,
    
    -- Dùng để sắp xếp inbox: khi có tin nhắn mới, update cột này
    last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);