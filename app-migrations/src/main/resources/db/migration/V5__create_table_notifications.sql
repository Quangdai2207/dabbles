-- Author: Phạm Minh Khang
-- Date: 202510082104
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    
    recipient_id VARCHAR(36) NOT NULL, -- Người nhận
    sender_id VARCHAR(36) NOT NULL, -- Người gửi
    content TEXT,
    
    -- Loại: 'NEW_MESSAGE', 'FRIEND_REQUEST', 'SYSTEM'
    type VARCHAR(50),
    
    -- ID tham chiếu (ví dụ ID của conversation hoặc ID user gửi kết bạn)
    reference_id VARCHAR(36),
    child_reference_id VARCHAR(36),
    
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);