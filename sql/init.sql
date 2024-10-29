/*
 Navicat Premium Data Transfer

 Source Server         : 京东云
 Source Server Type    : MySQL
 Source Server Version : 80035
 Source Host           : 117.72.91.25:3306
 Source Schema         : big-market-nest

 Target Server Type    : MySQL
 Target Server Version : 80035
 File Encoding         : 65001

 Date: 29/10/2024 09:42:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for award
-- ----------------------------
DROP TABLE IF EXISTS `award`;
CREATE TABLE `award`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `award_id` int(0) NOT NULL COMMENT '抽奖奖品ID - 内部流转使用',
  `award_key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '奖品对接标识 - 每一个都是一个对应的发奖策略',
  `award_config` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '奖品配置信息',
  `award_desc` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '奖品内容描述',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_award_id`(`award_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '奖品表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of award
-- ----------------------------
INSERT INTO `award` VALUES (1, 101, 'user_credit_random', '1,100', '用户积分【优先透彻规则范围，如果没有则走配置】', '2023-12-09 11:07:06', '2023-12-09 11:21:31');
INSERT INTO `award` VALUES (2, 102, 'openai_use_count', '3', 'OpenAI 增加使用次数', '2023-12-09 11:07:06', '2024-10-23 08:46:32');
INSERT INTO `award` VALUES (3, 103, 'openai_use_count', '5', 'OpenAI 增加使用次数', '2023-12-09 11:07:06', '2024-10-23 08:46:35');
INSERT INTO `award` VALUES (4, 104, '241028_activity_one', '1', '4090显卡', '2023-12-09 11:07:06', '2024-10-28 05:34:39');
INSERT INTO `award` VALUES (5, 105, '241028_activity_two', '2', '4080显卡', '2023-12-09 11:07:06', '2024-10-28 05:35:55');
INSERT INTO `award` VALUES (6, 106, '241028_activity_three', '3', '鼠标键盘套装', '2023-12-09 11:07:06', '2024-10-28 05:35:56');
INSERT INTO `award` VALUES (7, 107, '241028_activity_four', '4', '抗噪耳机', '2023-12-09 11:07:06', '2024-10-28 05:36:06');
INSERT INTO `award` VALUES (22, 108, '241028_activity_five', '5', '鼠标垫', '2023-12-09 11:07:06', '2024-10-28 05:36:13');
INSERT INTO `award` VALUES (23, 100, 'black_user', '1', '黑名单积分', '2024-10-28 05:38:29', '2024-10-28 05:39:03');

-- ----------------------------
-- Table structure for rule_tree
-- ----------------------------
DROP TABLE IF EXISTS `rule_tree`;
CREATE TABLE `rule_tree`  (
  `id` bigint(0) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `tree_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则树ID',
  `tree_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则树名称',
  `tree_desc` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '规则树描述',
  `tree_root_rule_key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则树根入口规则',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_tree_id`(`tree_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rule_tree
-- ----------------------------
INSERT INTO `rule_tree` VALUES (1, 'tree_lock', '规则树', '规则树', 'rule_lock', '2024-01-27 10:01:59', '2024-02-03 10:39:54');

-- ----------------------------
-- Table structure for rule_tree_node
-- ----------------------------
DROP TABLE IF EXISTS `rule_tree_node`;
CREATE TABLE `rule_tree_node`  (
  `id` bigint(0) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `tree_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则树ID',
  `rule_key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则Key',
  `rule_desc` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则描述',
  `rule_value` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '规则比值',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rule_tree_node
-- ----------------------------
INSERT INTO `rule_tree_node` VALUES (1, 'tree_lock', 'rule_lock', '限定用户已完成N次抽奖后解锁', '1', '2024-01-27 10:03:09', '2024-10-21 07:44:08');
INSERT INTO `rule_tree_node` VALUES (2, 'tree_lock', 'rule_luck_award', '兜底奖品随机积分', '101:1,100', '2024-01-27 10:03:09', '2024-10-17 09:14:11');
INSERT INTO `rule_tree_node` VALUES (3, 'tree_lock', 'rule_stock', '库存扣减规则', NULL, '2024-01-27 10:04:43', '2024-02-03 10:40:21');

-- ----------------------------
-- Table structure for rule_tree_node_line
-- ----------------------------
DROP TABLE IF EXISTS `rule_tree_node_line`;
CREATE TABLE `rule_tree_node_line`  (
  `id` bigint(0) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `tree_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则树ID',
  `rule_node_from` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则Key节点 From',
  `rule_node_to` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '规则Key节点 To',
  `rule_limit_type` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '限定类型；1:=;2:>;3:<;4:>=;5<=;6:enum[枚举范围];',
  `rule_limit_value` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '限定值（到下个节点）',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rule_tree_node_line
-- ----------------------------
INSERT INTO `rule_tree_node_line` VALUES (1, 'tree_lock', 'rule_lock', 'rule_stock', 'EQUAL', 'ALLOW', '2024-02-03 10:40:25', '2024-02-03 10:40:25');
INSERT INTO `rule_tree_node_line` VALUES (2, 'tree_lock', 'rule_lock', 'rule_luck_award', 'EQUAL', 'TAKE_OVER', '2024-02-03 10:40:25', '2024-02-03 10:40:26');
INSERT INTO `rule_tree_node_line` VALUES (3, 'tree_lock', 'rule_stock', 'rule_luck_award', 'EQUAL', 'TAKE_OVER', '2024-02-03 10:40:25', '2024-02-03 10:40:27');

-- ----------------------------
-- Table structure for strategy
-- ----------------------------
DROP TABLE IF EXISTS `strategy`;
CREATE TABLE `strategy`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `strategy_id` int(0) NOT NULL COMMENT '抽奖策略ID',
  `strategy_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '抽奖策略描述',
  `rule_models` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '策略模型',
  `create_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of strategy
-- ----------------------------
INSERT INTO `strategy` VALUES (1, 1, '抽奖策略', 'rule_blacklist,rule_weight', '2024-10-22 12:19:42', '2024-10-23 02:36:38');
INSERT INTO `strategy` VALUES (2, 2, '策略2', 'rule_blacklist,rule_weight', '2024-10-28 05:29:33', '2024-10-28 05:29:36');

-- ----------------------------
-- Table structure for strategy_award
-- ----------------------------
DROP TABLE IF EXISTS `strategy_award`;
CREATE TABLE `strategy_award`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `strategy_id` int(0) NOT NULL COMMENT '抽奖策略ID',
  `award_id` int(0) NULL DEFAULT NULL COMMENT '抽奖奖品ID-内部流转使用',
  `award_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '抽奖奖品标题',
  `award_subtitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '抽奖奖品副标题',
  `award_count` int(0) NULL DEFAULT NULL COMMENT '奖品库存总量',
  `award_count_surplus` int(0) NULL DEFAULT NULL COMMENT '奖品库存剩余',
  `award_rate` decimal(4, 2) NULL DEFAULT NULL COMMENT '奖品中奖率',
  `rule_models` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '规则模型，rule配置的模型同步到此表',
  `sort` int(0) NULL DEFAULT NULL COMMENT '排序',
  `create_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of strategy_award
-- ----------------------------
INSERT INTO `strategy_award` VALUES (1, 1, 101, '随机积分', '1-1000积分', 100, 93, 0.50, 'tree_lock', 1, '2024-10-22 15:07:50', '2024-10-28 05:18:37');
INSERT INTO `strategy_award` VALUES (2, 1, 102, '3次使用', NULL, 50, 46, 0.40, 'tree_lock', 2, '2024-10-22 14:47:47', '2024-10-28 05:18:43');
INSERT INTO `strategy_award` VALUES (3, 1, 103, '5次使用', NULL, 20, 17, 0.10, 'tree_lock', 3, '2024-10-23 02:01:42', '2024-10-28 05:27:55');
INSERT INTO `strategy_award` VALUES (4, 2, 104, '一等奖', NULL, 10, 9, 0.10, 'tree_lock', 1, '2024-10-23 02:01:42', '2024-10-28 09:22:59');
INSERT INTO `strategy_award` VALUES (5, 2, 105, '二等奖', NULL, 20, 18, 0.20, 'tree_lock', 2, '2024-10-23 02:01:42', '2024-10-28 07:26:37');
INSERT INTO `strategy_award` VALUES (6, 2, 106, '三等奖', NULL, 30, 29, 0.30, 'tree_lock', 3, '2024-10-23 02:01:42', '2024-10-28 05:46:59');
INSERT INTO `strategy_award` VALUES (7, 2, 107, '四等奖', NULL, 40, 36, 0.40, 'tree_lock', 4, '2024-10-23 02:01:42', '2024-10-28 07:23:37');
INSERT INTO `strategy_award` VALUES (8, 2, 108, '五等奖', NULL, 50, 47, 0.50, 'tree_lock', 5, '2024-10-23 02:01:42', '2024-10-28 06:59:05');

-- ----------------------------
-- Table structure for strategy_rule
-- ----------------------------
DROP TABLE IF EXISTS `strategy_rule`;
CREATE TABLE `strategy_rule`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `strategy_id` int(0) NOT NULL COMMENT '抽奖策略ID',
  `award_id` int(0) NULL DEFAULT NULL COMMENT '抽奖奖品ID【规则类型为策略，则不需要奖品ID】',
  `rule_type` tinyint(0) NOT NULL DEFAULT 0 COMMENT '抽象规则类型；1-策略规则、2-奖品规则',
  `rule_model` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '抽奖规则类型【rule_random - 随机值计算、rule_lock - 抽奖几次后解锁、rule_luck_award - 幸运奖(兜底奖品)】',
  `rule_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '抽奖规则比值',
  `rule_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '抽奖规则描述',
  `create_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of strategy_rule
-- ----------------------------
INSERT INTO `strategy_rule` VALUES (1, 1, NULL, 1, 'rule_weight', '4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108', '抽奖花费积分达成', '2024-10-11 05:44:41', '2024-10-12 11:23:16');
INSERT INTO `strategy_rule` VALUES (2, 1, NULL, 1, 'rule_blacklist', '100:user001,user002,user003', '黑名单用户,1积分', '2024-10-11 05:45:32', '2024-10-14 06:34:49');
INSERT INTO `strategy_rule` VALUES (4, 2, NULL, 1, 'rule_weight', '6000:104,105 5000:105,106 4000:107,108', '抽奖花费积分达成', '2024-10-11 05:44:41', '2024-10-28 05:37:40');
INSERT INTO `strategy_rule` VALUES (5, 2, NULL, 1, 'rule_blacklist', '100:user001,user002,user003', '黑名单用户,1积分', '2024-10-11 05:45:32', '2024-10-14 06:34:49');

SET FOREIGN_KEY_CHECKS = 1;
