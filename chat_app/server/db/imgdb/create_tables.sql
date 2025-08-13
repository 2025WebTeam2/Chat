
--2 
-- category 테이블
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- keyword 테이블
DROP TABLE IF EXISTS `keyword`;
CREATE TABLE `keyword` (
  `keyword_id` int NOT NULL AUTO_INCREMENT,
  `products_id` int NOT NULL,
  `object` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`keyword_id`),
  KEY `products_id_idx` (`products_id`),
  CONSTRAINT `fk_products_keyword` FOREIGN KEY (`products_id`) REFERENCES `test_products` (`id_test_products`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- test_user 테이블
DROP TABLE IF EXISTS test_user;
CREATE TABLE test_user (
    user_id VARCHAR(45) NOT NULL,
    username VARCHAR(45) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    connection_date TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- test_products 테이블
DROP TABLE IF EXISTS test_products;
CREATE TABLE test_products (
    id_test_products INT NOT NULL,
    category VARCHAR(45) NOT NULL,
    seller_id VARCHAR(45) NOT NULL,
    title VARCHAR(45) NOT NULL,
    price VARCHAR(45) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    sell_date TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id_test_products),
    KEY seller_id_idx (seller_id),
    CONSTRAINT fk_test_products_seller FOREIGN KEY (seller_id) 
        REFERENCES test_user(user_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- users 테이블 (서비스용)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    userid VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE users
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE users
ADD COLUMN last_login DATETIME NULL AFTER email;


-- 2️⃣ chatdb 테이블 (imgdb 안에서 사용히게 합침)
DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(100) NOT NULL,
  `sender` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `chat_rooms`;
CREATE TABLE `chat_rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(100) NOT NULL,
  `user1` varchar(50) NOT NULL,
  `user2` varchar(50) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `exited_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_id` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `chat_users`;
CREATE TABLE `chat_users` (
  `auto_id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(50) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `id` varchar(50) NOT NULL,
  PRIMARY KEY (`auto_id`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

