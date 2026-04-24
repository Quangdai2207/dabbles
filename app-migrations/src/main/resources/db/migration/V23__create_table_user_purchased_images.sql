CREATE TABLE IF NOT EXISTS user_purchased_images (
    image_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,

    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (image_id, user_id)
    );