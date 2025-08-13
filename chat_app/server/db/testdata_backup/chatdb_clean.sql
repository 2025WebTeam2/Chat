-- chat_messages 테이블
DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(100) NOT NULL,
  `sender` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `chat_messages` (`id`,`room_id`,`sender`,`message`,`sent_at`,`is_read`) VALUES
(201,'room-dd-dodo','dd','dddd','2025-07-27 09:34:03',0),
(202,'room-dd-dodo','dodo','dddd','2025-07-27 09:34:24',0),
(203,'room-dd-dodo','[안내]','dd님이 방을 나갔습니다.','2025-07-27 09:34:48',0),
(204,'room-dd-ddd','[안내]','dd님이 방을 나갔습니다.','2025-07-31 14:11:36',0),
(205,'room-dd-헤헤','[안내]','dd님이 방을 나갔습니다.','2025-07-31 14:33:04',0),
(206,'room-dd-ff','dd','안녕하세요','2025-07-31 14:33:18',0),
(207,'room-dd-ff','ff','네 안녕하세요','2025-07-31 14:34:02',0),
(208,'room-dd-ff','[안내]','dd님이 방을 나갔습니다.','2025-07-31 14:34:22',0),
(209,'room--dd','[안내]','님이 방을 나갔습니다.','2025-08-01 04:26:38',0);

-- chat_rooms 테이블
DROP TABLE IF EXISTS `chat_rooms`;
CREATE TABLE `chat_rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(100) NOT NULL,
  `user1` varchar(50) NOT NULL,
  `user2` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `exited_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_id` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 채팅방 데이터 없음, 필요하면 INSERT 추가

-- users 테이블 (chat용)
DROP TABLE IF EXISTS `chat_users`;
CREATE TABLE `chat_users` (
  `auto_id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id` varchar(50) NOT NULL,
  PRIMARY KEY (`auto_id`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `chat_users` (`auto_id`,`nickname`,`created_at`,`id`) VALUES
(1,'','2025-08-10 20:53:37','ff');
-- chat_messages 테이블
DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(100) NOT NULL,
  `sender` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `chat_messages` (`id`,`room_id`,`sender`,`message`,`sent_at`,`is_read`) VALUES
(201,'room-dd-dodo','dd','dddd','2025-07-27 09:34:03',0),
(202,'room-dd-dodo','dodo','dddd','2025-07-27 09:34:24',0),
(203,'room-dd-dodo','[안내]','dd님이 방을 나갔습니다.','2025-07-27 09:34:48',0),
(204,'room-dd-ddd','[안내]','dd님이 방을 나갔습니다.','2025-07-31 14:11:36',0),
(205,'room-dd-헤헤','[안내]','dd님이 방을 나갔습니다.','2025-07-31 14:33:04',0),
(206,'room-dd-ff','dd','안녕하세요','2025-07-31 14:33:18',0),
(207,'room-dd-ff','ff','네 안녕하세요','2025-07-31 14:34:02',0),
(208,'room-dd-ff','[안내]','dd님이 방을 나갔습니다.','2025-07-31 14:34:22',0),
(209,'room--dd','[안내]','님이 방을 나갔습니다.','2025-08-01 04:26:38',0);

-- chat_rooms 테이블
DROP TABLE IF EXISTS `chat_rooms`;
CREATE TABLE `chat_rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` varchar(100) NOT NULL,
  `user1` varchar(50) NOT NULL,
  `user2` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `exited_user` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_id` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 채팅방 데이터 없음, 필요하면 INSERT 추가

-- users 테이블 (chat용)
DROP TABLE IF EXISTS `chat_users`;
CREATE TABLE `chat_users` (
  `auto_id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id` varchar(50) NOT NULL,
  PRIMARY KEY (`auto_id`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `chat_users` (`auto_id`,`nickname`,`created_at`,`id`) VALUES
(1,'','2025-08-10 20:53:37','ff');
