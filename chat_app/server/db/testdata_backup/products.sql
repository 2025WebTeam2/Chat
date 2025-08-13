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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `products_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `seller_id` varchar(45) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `price` varchar(45) NOT NULL,
  `product_states` varchar(45) DEFAULT NULL,
  `selled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`products_id`),
  KEY `seller_id_idx` (`seller_id`),
  KEY `fk_products_category` (`category_id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `seller_id` FOREIGN KEY (`seller_id`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'신발','kimironsu','/uploads/1754827839657.jpg','10000','판매중',NULL,'2025-08-10 12:10:40',NULL,1),(2,'휴대폰','kimironsu','/uploads/1754829280595.jpg','80000','판매중',NULL,'2025-08-10 12:34:41',NULL,2),(3,'스마트폰','kimironsu','/uploads/1754890716035.jpg','33000','판매중',NULL,'2025-08-11 05:38:36',NULL,3),(4,'스마트폰','kimironsu','/uploads/1754890716795.jpg','33000','판매중',NULL,'2025-08-11 05:38:37',NULL,3),(5,'신발','test2','/uploads/1754890921802.jpg','12345','판매중',NULL,'2025-08-11 05:42:02',NULL,1),(6,'검정신발','kimironsu','/uploads/1754891162385.jpg','23232','판매중',NULL,'2025-08-11 05:46:02',NULL,1),(7,'운동화','kimironsu','/uploads/1754891361456.jpg','11111','판매중',NULL,'2025-08-11 05:49:21',NULL,1),(8,'신발','kimironsu','/uploads/1754891877841.jpg','333','판매중',NULL,'2025-08-11 05:57:58',NULL,1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-11 15:01:27
