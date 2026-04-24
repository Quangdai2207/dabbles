CREATE TABLE IF NOT EXISTS images (
                                      id VARCHAR(36) NOT NULL PRIMARY KEY,

    creator_id VARCHAR(36) NOT NULL,
    description TEXT,

    image_url TEXT NOT NULL,
    price DECIMAL(19, 2) DEFAULT 0.00,
    width INT NOT NULL,
    height INT NOT NULL,
    format VARCHAR(10),

    file_size BIGINT,

    like_count INT DEFAULT 0,
    is_public BOOLEAN DEFAULT false,
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
    );