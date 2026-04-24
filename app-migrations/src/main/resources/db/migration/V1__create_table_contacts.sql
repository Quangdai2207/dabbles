-- Author: Phạm Minh Khang
-- Date: 202510082105
CREATE TABLE IF NOT EXISTS contacts (
    user_id VARCHAR(36) NOT NULL,
    contact_user_id VARCHAR(36) NOT NULL,
    
    -- Trạng thái: 1:PENDING (Chờ), 2:ACCEPTED (Bạn bè), 3:BLOCKED (Chặn)
    status SMALLINT NOT NULL,
    
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,

    -- Vẫn giữ khóa chính tổ hợp để tránh trùng lặp dữ liệu (1 cặp chỉ lưu 1 lần)
    PRIMARY KEY (user_id, contact_user_id)
);