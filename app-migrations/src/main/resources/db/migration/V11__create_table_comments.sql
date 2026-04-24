-- Author: Phạm Minh Khang
-- Date: 202510082115
CREATE TABLE IF NOT EXISTS comments (
                                        id VARCHAR(36) NOT NULL,
    image_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,

    parent_id VARCHAR(36) NULL,
    content TEXT NOT NULL,

    like_count INT DEFAULT 0,

    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
    );