CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) NOT NULL,

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) NOT NULL, -- VD: 'anh-nghe-thuat', 'thien-nhien'
    description TEXT NULL,

    is_featured BOOLEAN DEFAULT FALSE, -- Đưa lên trang chủ

    is_deleted boolean DEFAULT FALSE,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
    );