CREATE TABLE IF NOT EXISTS wallet_transactions (
    id VARCHAR(36) NOT NULL,
    wallet_id VARCHAR(36) NOT NULL,
    fee_id VARCHAR(36) ,
    payment_id VARCHAR(36) ,
    amount DECIMAL(19, 2) NOT NULL,
    fee_amount DECIMAL(19, 2) DEFAULT 0.00,
    fee_percent DECIMAL(19,2) DEFAULT 0.00,
    net_received_amount DECIMAL(19, 2) DEFAULT 0.00,
    balance_after DECIMAL(19,2),
    transaction_type VARCHAR(60) NOT NULL,
    reference_id VARCHAR(36),

    description TEXT,

    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);

