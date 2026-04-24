CREATE TABLE IF NOT EXISTS images_categories (
    image_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36) NOT NULL,

    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (image_id, category_id)
    );