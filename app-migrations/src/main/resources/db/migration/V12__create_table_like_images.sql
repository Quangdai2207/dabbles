CREATE TABLE IF NOT EXISTS like_images (
    user_id VARCHAR(36) NOT NULL,
    image_id VARCHAR(36) NOT NULL,

    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, image_id)
    );