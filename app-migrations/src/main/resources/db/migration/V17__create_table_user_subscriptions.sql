-- Author: Phạm Minh Khang
-- Date: 202510082115
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(36) NOT NULL,
    plan_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    plan_duration INTEGER NOT NULL,
    start_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME NOT NULL,

    -- 1:Active, 2:Expired, 3:Cancelled
    status SMALLINT NOT NULL,

    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
    );