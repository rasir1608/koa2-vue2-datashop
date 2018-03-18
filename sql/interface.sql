CREATE DATABASE IF NOT EXISTS `datashop`;
USE `datashop`;

CREATE TABLE IF NOT EXISTS `interface` (
  `id` int(11) NOT NULL AUTO_INCREMENT comment "接口ID",
  `name` varchar(255) NOT NULL comment "接口名称",
  `url` varchar(255) NOT NULL comment "接口url",
  `method` varchar(10) NOT NULL DEFAULT "GET" comment "请求方法",
  `ContentType` varchar(255) DEFAULT "application/x-www-form-urlencoded; charset=UTF-8" comment "接口头部设置",
  `creator` int(11) NOT NULL comment "接口创建者",
  `oprator` int(11) NOT NULL comment "接口修改者",
  `request` text comment "接口请求信息",
  `respones` text comment "接口返回信息",
  `systemId` int(11) NOT NULL comment "接口所属系统ID",
  `remark` varchar(255) comment "接口备注",
  `createdAt` timestamp comment "接口创建时间",
  `updatedAt` timestamp comment "接口修改时间",
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

DELETE FROM `interface`;