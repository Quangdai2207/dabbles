-- Author: Phạm Minh Khang
-- Date: 202510082115
CREATE TABLE IF NOT EXISTS payments (
                                    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,

    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    reference_id VARCHAR(36),
    transaction_type VARCHAR(60) NOT NULL,

    -- Cổng thanh toán: 1:Paypal, 3:Momo, 4:VNPAY
    gateway SMALLINT NOT NULL,

    -- Mã giao dịch từ cổng thanh toán trả về (để đối soát)
    transaction_ref_id VARCHAR(255) NULL,
    -- Trạng thái: 0:Failed, 1:Pending, 2:Success, 3:Canceled
    status SMALLINT NOT NULL,

    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    );