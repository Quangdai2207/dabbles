-- Author: Phạm Minh Khang
-- Date: 202510082115
CREATE TABLE IF NOT EXISTS subscription_plans (
    id VARCHAR(36) NOT NULL,

    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',

    -- Thời hạn: 30 ngày, 365 ngày...
    duration_days INT NOT NULL,

    -- Mô tả các quyền lợi (VD: Upload không giới hạn)
    description TEXT NULL,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    );