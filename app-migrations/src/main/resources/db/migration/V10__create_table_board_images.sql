CREATE TABLE IF NOT EXISTS boards_images (
    board_id VARCHAR(36) NOT NULL,
    image_id VARCHAR(60) NOT NULL,

    added_by_user_id VARCHAR(36) NOT NULL,

    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (board_id, image_id)
);