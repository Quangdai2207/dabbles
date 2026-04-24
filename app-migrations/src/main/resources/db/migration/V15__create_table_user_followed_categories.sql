CREATE TABLE IF NOT EXISTS user_followed_categories (
    user_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36) NOT NULL,

    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, category_id)
    );