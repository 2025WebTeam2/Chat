-- ========================================
-- 1️⃣ category, users 테이블 (참조 대상)
-- ========================================
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    userid VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME NULL,
    PRIMARY KEY(id),
    UNIQUE KEY `userid_UNIQUE` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 2️⃣ products, keyword 테이블 (category, users 참조)
-- ========================================
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `products_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `seller_id` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `price` varchar(45) NOT NULL,
  `product_states` varchar(45) DEFAULT NULL,
  `selled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`products_id`),
  KEY `seller_id_idx` (`seller_id`),
  KEY `fk_products_category` (`category_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `fk_products_users` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  CONSTRAINT `fk_products_keyword` FOREIGN KEY (`products_id`) REFERENCES `products` (`products_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 3️⃣ test_user, test_products (테스트용) 
-- ========================================
-- DROP TABLE IF EXISTS test_user;
-- CREATE TABLE test_user (
--     user_id VARCHAR(45) NOT NULL,
--     username VARCHAR(45) NOT NULL,
--     created_at TIMESTAMP NOT NULL,
--     connection_date TIMESTAMP NOT NULL,
--     PRIMARY KEY (user_id)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DROP TABLE IF EXISTS test_products;
-- CREATE TABLE test_products (
--     id_test_products INT NOT NULL,
--     category VARCHAR(45) NOT NULL,
--     seller_id VARCHAR(45) NOT NULL,
--     title VARCHAR(45) NOT NULL,
--     price VARCHAR(45) NOT NULL,
--     created_at TIMESTAMP NOT NULL,
--     sell_date TIMESTAMP NULL DEFAULT NULL,
--     PRIMARY KEY (id_test_products),
--     KEY seller_id_idx (seller_id),
--     CONSTRAINT fk_test_products_seller FOREIGN KEY (seller_id) 
--         REFERENCES test_user(user_id) 
--         ON DELETE CASCADE 
--         ON UPDATE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- 4️⃣ 채팅 테이블
-- ========================================
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

DROP TABLE IF EXISTS `chat_rooms`;
CREATE TABLE `chat_rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(100) NOT NULL,
  `user1` int NOT NULL,
  `user2` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `exited_user` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_id` (`room_id`),
  CONSTRAINT `fk_chat_user1` FOREIGN KEY (`user1`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_user2` FOREIGN KEY (`user2`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_exited` FOREIGN KEY (`exited_user`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(100) NOT NULL,
  `sender` int NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_chat_sender` FOREIGN KEY (`sender`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
