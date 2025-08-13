-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: testdata
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `test_user`
--

DROP TABLE IF EXISTS `test_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_user` (
  `user_id` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL,
  `connection_date` timestamp NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='테스트 데이터 유저\n회원가입은 아예 빼고 시간쪽만 만들어서 신규 생성자, 접속일자 등을 체크하기 위해 만듬\nconnection_date 를 최근접속 일자로 했지만\n접속한 날짜(접속할 때 마다 기록)로 할지, 아님 컬럼2개를 만들지는 고려해야 함';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_user`
--

LOCK TABLES `test_user` WRITE;
/*!40000 ALTER TABLE `test_user` DISABLE KEYS */;
INSERT INTO `test_user` VALUES ('alice01','김민준','2024-07-03 00:15:00','2024-07-15 04:30:00'),('brian02','이서연','2024-07-09 23:00:00','2024-08-05 01:20:00'),('carol03','박지훈','2024-08-01 05:25:00','2024-09-10 06:45:00'),('derek04','최윤서','2024-08-20 02:10:00','2024-09-25 07:05:00'),('elena05','정하늘','2024-09-04 22:45:00','2024-09-30 23:55:00'),('felix06','한예은','2024-09-15 01:30:00','2024-12-12 08:00:00'),('grace07','오준호','2024-10-01 07:00:00','2024-11-15 10:40:00'),('henry08','서지민','2024-10-20 03:20:00','2024-12-01 05:00:00'),('irene09','문채원','2024-11-05 06:10:00','2024-11-30 07:45:00'),('jack10','장서우','2024-11-25 00:05:00','2025-01-01 01:30:00'),('karen11','김도윤','2024-12-10 04:50:00','2025-01-15 05:30:00'),('leo12','이하은','2024-12-31 23:30:00','2025-03-03 02:15:00'),('mia13','박준영','2025-01-20 01:00:00','2025-04-01 00:45:00'),('noah14','최다은','2025-02-10 05:40:00','2025-05-10 06:10:00'),('olivia15','정수아','2025-03-05 00:20:00','2025-06-01 03:00:00'),('peter16','한서준','2025-03-25 02:10:00','2025-06-20 05:35:00'),('queen17','오지훈','2025-04-09 22:55:00','2025-06-15 09:00:00'),('ryan18','서하은','2025-05-01 04:30:00','2025-06-30 11:45:00'),('sofia19','문예진','2025-05-14 23:15:00','2025-06-10 00:00:00'),('tom20','장민서','2025-06-01 01:10:00','2025-06-30 02:30:00');
/*!40000 ALTER TABLE `test_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-11 15:01:26
