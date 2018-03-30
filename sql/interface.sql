CREATE DATABASE IF NOT EXISTS `datashop`;
USE `datashop`;

CREATE TABLE IF NOT EXISTS `interface` (
  `id` int(11) NOT NULL AUTO_INCREMENT comment "接口ID",
  `rid` varchar(10) DEFAULT NULL comment '接口rid',
  `name` varchar(255) NOT NULL comment "接口名称",
  `url` varchar(255) NOT NULL comment "接口url",
  `method` varchar(10) NOT NULL DEFAULT "GET" comment "请求方法",
  `contentType` varchar(255) DEFAULT "application/x-www-form-urlencoded; charset=UTF-8" comment "接口头部设置",
  `creatorRid` varchar(8) NOT NULL comment "接口创建者",
  `opratorRid` varchar(8) NOT NULL comment "接口修改者",
  `request` text comment "接口请求信息",
  `response` text comment "接口返回信息",
  `systemRid` varchar(10) NOT NULL comment "接口所属系统ID",
  `remark` varchar(255) comment "接口备注",
  `createdAt` timestamp comment "接口创建时间",
  `updatedAt` timestamp comment "接口修改时间",
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

DELETE FROM `interface`;