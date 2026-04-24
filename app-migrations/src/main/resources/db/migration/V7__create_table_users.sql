-- Author: Phạm Minh Khang
-- Date: 202510082107

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL PRIMARY KEY, -- UUID dạng chuỗi
    username VARCHAR(50),
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    avatar TEXT,
    
    password VARCHAR(255),
    
    role_id VARCHAR(36),
    warning smallint DEFAULT 0,
    bio TEXT DEFAULT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    
    is_active BOOLEAN NOT NULL,
    date_of_birth DATE,
    
    created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

