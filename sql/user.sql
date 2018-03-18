-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        5.7.15-log - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


CREATE DATABASE IF NOT EXISTS `datashop` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `datashop`;

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT comment '用户id',
  `account` char(50) NOT NULL comment '用户账号',
  `user_name` char(50) NOT NULL comment '用户姓名',
  `password` char(128) NOT NULL comment '密码',
  `systems` varchar(255) comment '用户拥有权限的系统id',
  `kind` int(11) DEFAULT 1 comment '用户权限 1普通用户，2系统管理员，3项目管理员',
  `createdAt` timestamp comment '创建时间',
  `updatedAt` timestamp comment '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`account`,`user_name`, `password`) VALUES
	('rasir','molunerfinn', '$2a$10$x3f0Y2SNAmyAfqhKVAV.7uE7RHs3FDGuSYw.LlZhOFoyK7cjfZ.Q6');
INSERT INTO `user` (`account`,`user_name`, `password`) VALUES
  ('rasir2','admin', '$2a$10$x3f0Y2SNAmyAfqhKVAV.7uE7RHs3FDGuSYw.LlZhOFoyK7cjfZ.Q6');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
