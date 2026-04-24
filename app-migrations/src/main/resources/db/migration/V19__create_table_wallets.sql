
CREATE TABLE IF NOT EXISTS wallets (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,

    balance DECIMAL(19, 2) DEFAULT 0.0000,

    -- Đơn vị tiền tệ: 'USD', 'VND'
    currency VARCHAR(3) DEFAULT 'USD',

    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,

    -- Khóa chính
    PRIMARY KEY (id)
);