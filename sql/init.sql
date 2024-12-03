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

 Date: 03/12/2024 13:09:46
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
INSERT INTO `rule_tree_node` VALUES (1, 'tree_lock', 'rule_lock', '限定用户已完成N次抽奖后解锁', '101:1 102:3 103:5 104:10', '2024-01-27 10:03:09', '2024-12-03 03:14:57');
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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of strategy
-- ----------------------------
INSERT INTO `strategy` VALUES (1, 1, '抽奖策略', 'rule_blacklist,rule_weight', '2024-10-22 12:19:42', '2024-10-23 02:36:38');
INSERT INTO `strategy` VALUES (2, 2, '策略2', 'rule_blacklist,rule_weight', '2024-10-28 05:29:33', '2024-10-28 05:29:36');
INSERT INTO `strategy` VALUES (3, 10006, '策略3', 'rule_blacklist,rule_weight', '2024-12-02 06:45:17', '2024-12-02 06:45:19');

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
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

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
INSERT INTO `strategy_award` VALUES (15, 10006, 101, '随机积分', NULL, 90, 79, 0.40, 'tree_lock', 1, '2024-10-17 06:12:49', '2024-12-03 03:25:00');
INSERT INTO `strategy_award` VALUES (16, 10006, 102, '5次使用', NULL, 20, 6, 0.30, 'tree_lock', 2, '2024-10-17 06:13:12', '2024-12-03 01:28:45');
INSERT INTO `strategy_award` VALUES (17, 10006, 103, '10次使用', NULL, 20, 10, 0.20, 'tree_lock', 2, '2024-10-17 06:13:12', '2024-12-03 02:43:26');
INSERT INTO `strategy_award` VALUES (18, 10006, 104, '20次使用', NULL, 10, 8, 0.10, 'tree_lock', 2, '2024-10-17 06:13:12', '2024-12-03 02:43:32');
INSERT INTO `strategy_award` VALUES (19, 10006, 100, '黑名单奖品', '1积分', 90000, 90000, 0.10, NULL, 0, '2024-11-29 01:42:27', '2024-12-02 08:16:42');

-- ----------------------------
-- Table structure for strategy_flow_record
-- ----------------------------
DROP TABLE IF EXISTS `strategy_flow_record`;
CREATE TABLE `strategy_flow_record`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户ID',
  `strategy_id` bigint(0) NOT NULL COMMENT '抽奖策略ID',
  `order_id` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '抽奖订单ID【作为幂等使用】',
  `award_id` int(0) NULL DEFAULT NULL COMMENT '奖品id',
  `node_desc` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '节点描述',
  `process_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '处理类型 chain或tree',
  `chain_process_result` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '责任链节点 处理结果 ALLOW放行 TAKE_OVER接管 ',
  `tree_process_result` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '抉择树节点 处理结果 ALLOW放行 TAKE_OVER接管 ',
  `rule_limit_value` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '树 节点连线结果',
  `current_node` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '当前节点',
  `next_node` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '下一个节点',
  `tree_id` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '规则树ID',
  `head` int(0) NULL DEFAULT 0 COMMENT '是否是head',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `update_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 316 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of strategy_flow_record
-- ----------------------------
INSERT INTO `strategy_flow_record` VALUES (213, 'system', 10006, '11100011', NULL, '黑名单放行,userId:system', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-02 08:18:21', '2024-12-02 08:18:21');
INSERT INTO `strategy_flow_record` VALUES (214, 'system', 10006, '11100011', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-02 08:18:21', '2024-12-02 08:18:21');
INSERT INTO `strategy_flow_record` VALUES (215, 'system', 10006, '11100011', 102, '默认Logic节点，进行抽奖，奖品id:102', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-02 08:18:21', '2024-12-02 08:18:21');
INSERT INTO `strategy_flow_record` VALUES (216, 'system', 1, '11100011', NULL, '黑名单放行,userId:system', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-02 08:21:07', '2024-12-02 08:21:07');
INSERT INTO `strategy_flow_record` VALUES (217, 'system', 1, '11100011', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-02 08:21:07', '2024-12-02 08:21:07');
INSERT INTO `strategy_flow_record` VALUES (218, 'yxb', 10006, '27854880', 100, '黑名单接管,userId:yxb', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-02 08:24:14', '2024-12-02 08:24:14');
INSERT INTO `strategy_flow_record` VALUES (219, 'yxb2', 10006, '27925294', NULL, '黑名单放行,userId:yxb2', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-02 08:25:25', '2024-12-02 08:25:25');
INSERT INTO `strategy_flow_record` VALUES (220, 'yxb2', 10006, '27925294', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-02 08:25:25', '2024-12-02 08:25:25');
INSERT INTO `strategy_flow_record` VALUES (221, 'yxb2', 10006, '27925294', 101, '默认Logic节点，进行抽奖，奖品id:101', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-02 08:25:25', '2024-12-02 08:25:25');
INSERT INTO `strategy_flow_record` VALUES (222, 'yxb2', 10006, '29873339', NULL, '黑名单放行,userId:yxb2', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-02 08:57:53', '2024-12-02 08:57:53');
INSERT INTO `strategy_flow_record` VALUES (223, 'yxb2', 10006, '29873339', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-02 08:57:53', '2024-12-02 08:57:53');
INSERT INTO `strategy_flow_record` VALUES (224, 'yxb2', 10006, '29873339', 102, '默认Logic节点，进行抽奖，奖品id:102', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-02 08:57:53', '2024-12-02 08:57:53');
INSERT INTO `strategy_flow_record` VALUES (225, 'yxb2', 10006, '29873339', 102, NULL, 'tree', 'ALLOW', NULL, 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-02 08:57:53', '2024-12-02 08:57:53');
INSERT INTO `strategy_flow_record` VALUES (226, 'yxb2', 10006, '29873339', 102, NULL, 'tree', 'ALLOW', NULL, 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-02 08:57:54', '2024-12-02 08:57:54');
INSERT INTO `strategy_flow_record` VALUES (227, 'yxb2', 10006, '30176505', NULL, '黑名单放行,userId:yxb2', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-02 09:02:56', '2024-12-02 09:02:56');
INSERT INTO `strategy_flow_record` VALUES (228, 'yxb2', 10006, '30176505', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-02 09:02:56', '2024-12-02 09:02:56');
INSERT INTO `strategy_flow_record` VALUES (229, 'yxb2', 10006, '30176505', 102, '默认Logic节点，进行抽奖，奖品id:102', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-02 09:02:56', '2024-12-02 09:02:56');
INSERT INTO `strategy_flow_record` VALUES (230, 'yxb2', 10006, '30176505', 102, NULL, 'tree', 'ALLOW', NULL, 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-02 09:02:57', '2024-12-02 09:02:57');
INSERT INTO `strategy_flow_record` VALUES (231, 'yxb2', 10006, '30176505', 102, '库存扣减: 库存扣减成功', 'tree', 'ALLOW', NULL, 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-02 09:02:57', '2024-12-02 09:02:57');
INSERT INTO `strategy_flow_record` VALUES (232, 'yxb2', 10006, '30687453', NULL, '黑名单放行,userId:yxb2', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-02 09:11:27', '2024-12-02 09:11:27');
INSERT INTO `strategy_flow_record` VALUES (233, 'yxb2', 10006, '30687453', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-02 09:11:27', '2024-12-02 09:11:27');
INSERT INTO `strategy_flow_record` VALUES (234, 'yxb2', 10006, '30687453', 101, '默认Logic节点，进行抽奖，奖品id:101', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-02 09:11:27', '2024-12-02 09:11:27');
INSERT INTO `strategy_flow_record` VALUES (235, 'yxb2', 10006, '30687453', 101, '次数锁: 用户抽奖次数: 10 ,已达到, 规则次数: 1; 奖品id：101', 'tree', 'ALLOW', NULL, 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-02 09:11:27', '2024-12-02 09:11:27');
INSERT INTO `strategy_flow_record` VALUES (236, 'yxb2', 10006, '30687453', 101, '库存扣减: 库存扣减成功', 'tree', 'ALLOW', NULL, 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-02 09:11:28', '2024-12-02 09:11:28');
INSERT INTO `strategy_flow_record` VALUES (237, 'yxb2', 10006, '87053848', NULL, '黑名单放行,userId:yxb2', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 00:50:52', '2024-12-03 00:50:52');
INSERT INTO `strategy_flow_record` VALUES (238, 'yxb2', 10006, '87053848', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 00:50:52', '2024-12-03 00:50:52');
INSERT INTO `strategy_flow_record` VALUES (239, 'yxb2', 10006, '87053848', 103, '默认Logic节点，进行抽奖，奖品id:103', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 00:50:52', '2024-12-03 00:50:52');
INSERT INTO `strategy_flow_record` VALUES (240, 'yxb2', 10006, '87053848', 103, '次数锁: 用户抽奖次数: 10 ,已达到, 规则次数: 1; 奖品id：103', 'tree', 'ALLOW', NULL, 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-03 00:50:52', '2024-12-03 00:50:52');
INSERT INTO `strategy_flow_record` VALUES (241, 'yxb2', 10006, '87053848', 103, '库存扣减: 库存扣减成功', 'tree', 'ALLOW', NULL, 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-03 00:50:53', '2024-12-03 00:50:53');
INSERT INTO `strategy_flow_record` VALUES (242, 'yxb2', 10006, '89325542', NULL, '黑名单放行,userId:yxb2', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 01:28:44', '2024-12-03 01:28:44');
INSERT INTO `strategy_flow_record` VALUES (243, 'yxb2', 10006, '89325542', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 01:28:44', '2024-12-03 01:28:44');
INSERT INTO `strategy_flow_record` VALUES (244, 'yxb2', 10006, '89325542', 102, '默认Logic节点，进行抽奖，奖品id:102', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 01:28:44', '2024-12-03 01:28:44');
INSERT INTO `strategy_flow_record` VALUES (245, 'yxb2', 10006, '89325542', 102, '次数锁: 用户抽奖次数: 10 ,已达到, 规则次数: 1; 奖品id：102', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-03 01:28:44', '2024-12-03 01:28:44');
INSERT INTO `strategy_flow_record` VALUES (246, 'yxb2', 10006, '89325542', 102, '库存扣减: 库存扣减成功', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-03 01:28:44', '2024-12-03 01:28:44');
INSERT INTO `strategy_flow_record` VALUES (247, 'yy', 10006, '93039268', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:30:42', '2024-12-03 02:30:42');
INSERT INTO `strategy_flow_record` VALUES (248, 'yy', 10006, '93039268', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 02:30:42', '2024-12-03 02:30:42');
INSERT INTO `strategy_flow_record` VALUES (249, 'yy', 10006, '93039268', 104, '默认Logic节点，进行抽奖，奖品id:104', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 02:30:43', '2024-12-03 02:30:43');
INSERT INTO `strategy_flow_record` VALUES (250, 'yy', 10006, '93039268', 104, '次数锁: 用户抽奖次数: 10 ,已达到, 规则次数: 1; 奖品id：104', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-03 02:30:43', '2024-12-03 02:30:43');
INSERT INTO `strategy_flow_record` VALUES (251, 'yy', 10006, '93039268', 104, '库存扣减: 库存扣减成功', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-03 02:30:43', '2024-12-03 02:30:43');
INSERT INTO `strategy_flow_record` VALUES (252, 'yy', 10006, '93188641', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:33:11', '2024-12-03 02:33:11');
INSERT INTO `strategy_flow_record` VALUES (253, 'yy', 10006, '93188641', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 02:33:11', '2024-12-03 02:33:11');
INSERT INTO `strategy_flow_record` VALUES (254, 'yy', 10006, '93188641', 101, '默认Logic节点，进行抽奖，奖品id:101', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 02:33:11', '2024-12-03 02:33:11');
INSERT INTO `strategy_flow_record` VALUES (255, 'yy', 10006, '93188641', 101, '次数锁: 用户抽奖次数: 10 ,已达到, 规则次数: 1; 奖品id：101', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-03 02:33:12', '2024-12-03 02:33:12');
INSERT INTO `strategy_flow_record` VALUES (256, 'yy', 10006, '93188641', 101, '库存扣减: 库存扣减成功', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-03 02:33:12', '2024-12-03 02:33:12');
INSERT INTO `strategy_flow_record` VALUES (257, 'yxb', 10006, '93188641', 100, '黑名单接管,userId:yxb', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:33:40', '2024-12-03 02:33:40');
INSERT INTO `strategy_flow_record` VALUES (258, 'yxb', 10006, '93188641', 100, '黑名单接管,userId:yxb', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:38:30', '2024-12-03 02:38:30');
INSERT INTO `strategy_flow_record` VALUES (259, 'yxb', 10006, '93536714', 100, '黑名单接管,userId:yxb', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:38:59', '2024-12-03 02:38:59');
INSERT INTO `strategy_flow_record` VALUES (260, 'yxb', 10006, '93543795', 100, '黑名单接管,userId:yxb', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:39:06', '2024-12-03 02:39:06');
INSERT INTO `strategy_flow_record` VALUES (261, 'yxb', 10006, '93760384', 100, '黑名单接管,userId:yxb', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:42:42', '2024-12-03 02:42:42');
INSERT INTO `strategy_flow_record` VALUES (262, 'yxb2', 10006, '93760384', NULL, '黑名单放行,userId:yxb2', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:42:52', '2024-12-03 02:42:52');
INSERT INTO `strategy_flow_record` VALUES (263, 'yxb2', 10006, '93760384', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 02:42:53', '2024-12-03 02:42:53');
INSERT INTO `strategy_flow_record` VALUES (264, 'yxb2', 10006, '93760384', 103, '默认Logic节点，进行抽奖，奖品id:103', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 02:42:53', '2024-12-03 02:42:53');
INSERT INTO `strategy_flow_record` VALUES (265, 'yxb2', 10006, '93760384', 103, '次数锁: 用户抽奖次数: 10 ,已达到, 规则次数: 1; 奖品id：103', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-03 02:42:53', '2024-12-03 02:42:53');
INSERT INTO `strategy_flow_record` VALUES (266, 'yxb2', 10006, '93760384', 103, '库存扣减: 库存扣减成功', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-03 02:42:53', '2024-12-03 02:42:53');
INSERT INTO `strategy_flow_record` VALUES (267, 'yy', 10006, '93799010', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:43:21', '2024-12-03 02:43:21');
INSERT INTO `strategy_flow_record` VALUES (268, 'yy', 10006, '93799010', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 02:43:21', '2024-12-03 02:43:21');
INSERT INTO `strategy_flow_record` VALUES (269, 'yy', 10006, '93799010', 103, '默认Logic节点，进行抽奖，奖品id:103', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 02:43:21', '2024-12-03 02:43:21');
INSERT INTO `strategy_flow_record` VALUES (270, 'yy', 10006, '93799010', 103, '次数锁: 用户抽奖次数: 10 ,已达到, 规则次数: 1; 奖品id：103', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-03 02:43:21', '2024-12-03 02:43:21');
INSERT INTO `strategy_flow_record` VALUES (271, 'yy', 10006, '93799010', 103, '库存扣减: 库存扣减成功', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-03 02:43:21', '2024-12-03 02:43:21');
INSERT INTO `strategy_flow_record` VALUES (272, 'yy', 10006, '93799010', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:43:29', '2024-12-03 02:43:29');
INSERT INTO `strategy_flow_record` VALUES (273, 'yy', 10006, '93799010', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 02:43:29', '2024-12-03 02:43:29');
INSERT INTO `strategy_flow_record` VALUES (274, 'yy', 10006, '93799010', 104, '默认Logic节点，进行抽奖，奖品id:104', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 02:43:29', '2024-12-03 02:43:29');
INSERT INTO `strategy_flow_record` VALUES (275, 'yy', 10006, '93799010', 104, '次数锁: 用户抽奖次数: 10 ,已达到, 规则次数: 1; 奖品id：104', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-03 02:43:30', '2024-12-03 02:43:30');
INSERT INTO `strategy_flow_record` VALUES (276, 'yy', 10006, '93799010', 104, '库存扣减: 库存扣减成功', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-03 02:43:30', '2024-12-03 02:43:30');
INSERT INTO `strategy_flow_record` VALUES (277, 'yy', 10006, '93799010', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:43:39', '2024-12-03 02:43:39');
INSERT INTO `strategy_flow_record` VALUES (278, 'yy', 10006, '93799010', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 02:43:39', '2024-12-03 02:43:39');
INSERT INTO `strategy_flow_record` VALUES (279, 'yy', 10006, '93799010', 100, '默认Logic节点，进行抽奖，奖品id:100', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 02:43:39', '2024-12-03 02:43:39');
INSERT INTO `strategy_flow_record` VALUES (280, 'yxb', 10006, '93828312', 100, '黑名单接管,userId:yxb', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 02:43:51', '2024-12-03 02:43:51');
INSERT INTO `strategy_flow_record` VALUES (281, 'yy', 10006, '95977170', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:19:39', '2024-12-03 03:19:39');
INSERT INTO `strategy_flow_record` VALUES (282, 'yy', 10006, '95977170', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:19:39', '2024-12-03 03:19:39');
INSERT INTO `strategy_flow_record` VALUES (283, 'yy', 10006, '95977170', 103, '默认Logic节点，进行抽奖，奖品id:103', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 03:19:39', '2024-12-03 03:19:39');
INSERT INTO `strategy_flow_record` VALUES (284, 'yy', 10006, '95977170', 103, '次数锁: 用户抽奖次数: 1 ,未达到, 规则次数: 5; 奖品id：103', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_lock', 'rule_luck_award', 'tree_lock', 1, '2024-12-03 03:19:40', '2024-12-03 03:19:40');
INSERT INTO `strategy_flow_record` VALUES (285, 'yy', 10006, '95977170', 101, '兜底奖品: 101', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_luck_award', NULL, 'tree_lock', 0, '2024-12-03 03:19:40', '2024-12-03 03:19:40');
INSERT INTO `strategy_flow_record` VALUES (286, 'yy', 10006, '96018922', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:20:21', '2024-12-03 03:20:21');
INSERT INTO `strategy_flow_record` VALUES (287, 'yy', 10006, '96018922', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:20:21', '2024-12-03 03:20:21');
INSERT INTO `strategy_flow_record` VALUES (288, 'yy', 10006, '96018922', 104, '默认Logic节点，进行抽奖，奖品id:104', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 03:20:21', '2024-12-03 03:20:21');
INSERT INTO `strategy_flow_record` VALUES (289, 'yy', 10006, '96018922', 104, '次数锁: 用户抽奖次数: 1 ,未达到, 规则次数: 10; 奖品id：104', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_lock', 'rule_luck_award', 'tree_lock', 1, '2024-12-03 03:20:21', '2024-12-03 03:20:21');
INSERT INTO `strategy_flow_record` VALUES (290, 'yy', 10006, '96018922', 101, '兜底奖品: 101', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_luck_award', NULL, 'tree_lock', 0, '2024-12-03 03:20:21', '2024-12-03 03:20:21');
INSERT INTO `strategy_flow_record` VALUES (291, 'yy', 10006, '96018922', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:20:36', '2024-12-03 03:20:36');
INSERT INTO `strategy_flow_record` VALUES (292, 'yy', 10006, '96018922', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:20:36', '2024-12-03 03:20:36');
INSERT INTO `strategy_flow_record` VALUES (293, 'yy', 10006, '96018922', 102, '默认Logic节点，进行抽奖，奖品id:102', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 03:20:36', '2024-12-03 03:20:36');
INSERT INTO `strategy_flow_record` VALUES (294, 'yy', 10006, '96018922', 102, '次数锁: 用户抽奖次数: 1 ,未达到, 规则次数: 3; 奖品id：102', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_lock', 'rule_luck_award', 'tree_lock', 1, '2024-12-03 03:20:36', '2024-12-03 03:20:36');
INSERT INTO `strategy_flow_record` VALUES (295, 'yy', 10006, '96018922', 101, '兜底奖品: 101', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_luck_award', NULL, 'tree_lock', 0, '2024-12-03 03:20:36', '2024-12-03 03:20:36');
INSERT INTO `strategy_flow_record` VALUES (296, 'yy', 10006, '96018922', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:20:45', '2024-12-03 03:20:45');
INSERT INTO `strategy_flow_record` VALUES (297, 'yy', 10006, '96018922', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:20:45', '2024-12-03 03:20:45');
INSERT INTO `strategy_flow_record` VALUES (298, 'yy', 10006, '96018922', 103, '默认Logic节点，进行抽奖，奖品id:103', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 03:20:45', '2024-12-03 03:20:45');
INSERT INTO `strategy_flow_record` VALUES (299, 'yy', 10006, '96018922', 103, '次数锁: 用户抽奖次数: 1 ,未达到, 规则次数: 5; 奖品id：103', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_lock', 'rule_luck_award', 'tree_lock', 1, '2024-12-03 03:20:45', '2024-12-03 03:20:45');
INSERT INTO `strategy_flow_record` VALUES (300, 'yy', 10006, '96018922', 101, '兜底奖品: 101', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_luck_award', NULL, 'tree_lock', 0, '2024-12-03 03:20:45', '2024-12-03 03:20:45');
INSERT INTO `strategy_flow_record` VALUES (301, 'yy', 10006, '96053899', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:20:56', '2024-12-03 03:20:56');
INSERT INTO `strategy_flow_record` VALUES (302, 'yy', 10006, '96053899', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:20:56', '2024-12-03 03:20:56');
INSERT INTO `strategy_flow_record` VALUES (303, 'yy', 10006, '96053899', 102, '默认Logic节点，进行抽奖，奖品id:102', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 03:20:56', '2024-12-03 03:20:56');
INSERT INTO `strategy_flow_record` VALUES (304, 'yy', 10006, '96053899', 102, '次数锁: 用户抽奖次数: 1 ,未达到, 规则次数: 3; 奖品id：102', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_lock', 'rule_luck_award', 'tree_lock', 1, '2024-12-03 03:20:56', '2024-12-03 03:20:56');
INSERT INTO `strategy_flow_record` VALUES (305, 'yy', 10006, '96053899', 101, '兜底奖品: 101', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_luck_award', NULL, 'tree_lock', 0, '2024-12-03 03:20:56', '2024-12-03 03:20:56');
INSERT INTO `strategy_flow_record` VALUES (306, 'yy', 10006, '96066874', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:21:08', '2024-12-03 03:21:08');
INSERT INTO `strategy_flow_record` VALUES (307, 'yy', 10006, '96066874', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:21:09', '2024-12-03 03:21:09');
INSERT INTO `strategy_flow_record` VALUES (308, 'yy', 10006, '96066874', 102, '默认Logic节点，进行抽奖，奖品id:102', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 03:21:09', '2024-12-03 03:21:09');
INSERT INTO `strategy_flow_record` VALUES (309, 'yy', 10006, '96066874', 102, '次数锁: 用户抽奖次数: 1 ,未达到, 规则次数: 3; 奖品id：102', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_lock', 'rule_luck_award', 'tree_lock', 1, '2024-12-03 03:21:09', '2024-12-03 03:21:09');
INSERT INTO `strategy_flow_record` VALUES (310, 'yy', 10006, '96066874', 101, '兜底奖品: 101', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_luck_award', NULL, 'tree_lock', 0, '2024-12-03 03:21:09', '2024-12-03 03:21:09');
INSERT INTO `strategy_flow_record` VALUES (311, 'yy', 10006, '96080754', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:21:22', '2024-12-03 03:21:22');
INSERT INTO `strategy_flow_record` VALUES (312, 'yy', 10006, '96080754', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:21:22', '2024-12-03 03:21:22');
INSERT INTO `strategy_flow_record` VALUES (313, 'yy', 10006, '96080754', 101, '默认Logic节点，进行抽奖，奖品id:101', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 03:21:23', '2024-12-03 03:21:23');
INSERT INTO `strategy_flow_record` VALUES (314, 'yy', 10006, '96080754', 101, '次数锁: 用户抽奖次数: 1 ,已达到, 规则次数: 1; 奖品id：101', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-03 03:21:23', '2024-12-03 03:21:23');
INSERT INTO `strategy_flow_record` VALUES (315, 'yy', 10006, '96080754', 101, '库存扣减: 库存扣减成功  awardId: 101', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-03 03:21:23', '2024-12-03 03:21:23');
INSERT INTO `strategy_flow_record` VALUES (316, 'yy', 10006, '96292331', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:24:58', '2024-12-03 03:24:58');
INSERT INTO `strategy_flow_record` VALUES (317, 'yy', 10006, '96292331', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:24:58', '2024-12-03 03:24:58');
INSERT INTO `strategy_flow_record` VALUES (318, 'yy', 10006, '96292331', 101, '默认Logic节点，进行抽奖，奖品id:101', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 03:24:58', '2024-12-03 03:24:58');
INSERT INTO `strategy_flow_record` VALUES (319, 'yy', 10006, '96292331', 101, '次数锁: 用户抽奖次数: 1 ,已达到, 规则次数: 1; 奖品id：101', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_lock', 'rule_stock', 'tree_lock', 1, '2024-12-03 03:24:58', '2024-12-03 03:24:58');
INSERT INTO `strategy_flow_record` VALUES (320, 'yy', 10006, '96292331', 101, '库存扣减: 库存扣减成功  awardId: 101', 'tree', NULL, 'ALLOW', 'ALLOW', 'rule_stock', NULL, 'tree_lock', 0, '2024-12-03 03:24:58', '2024-12-03 03:24:58');
INSERT INTO `strategy_flow_record` VALUES (321, 'yy', 10006, '96300299', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:25:09', '2024-12-03 03:25:09');
INSERT INTO `strategy_flow_record` VALUES (322, 'yy', 10006, '96300299', NULL, '权重放行-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:1000', 'chain', 'ALLOW', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:25:10', '2024-12-03 03:25:10');
INSERT INTO `strategy_flow_record` VALUES (323, 'yy', 10006, '96300299', 102, '默认Logic节点，进行抽奖，奖品id:102', 'chain', 'ALLOW', NULL, NULL, 'rule_default', NULL, NULL, 0, '2024-12-03 03:25:10', '2024-12-03 03:25:10');
INSERT INTO `strategy_flow_record` VALUES (324, 'yy', 10006, '96300299', 102, '次数锁: 用户抽奖次数: 1 ,未达到, 规则次数: 3; 奖品id：102', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_lock', 'rule_luck_award', 'tree_lock', 1, '2024-12-03 03:25:10', '2024-12-03 03:25:10');
INSERT INTO `strategy_flow_record` VALUES (325, 'yy', 10006, '96300299', 101, '兜底奖品: 101', 'tree', NULL, 'TAKE_OVER', 'TAKE_OVER', 'rule_luck_award', NULL, 'tree_lock', 0, '2024-12-03 03:25:10', '2024-12-03 03:25:10');
INSERT INTO `strategy_flow_record` VALUES (326, 'yy', 10006, '96312121', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:30:15', '2024-12-03 03:30:15');
INSERT INTO `strategy_flow_record` VALUES (327, 'yy', 10006, '96312121', 103, '权重接管-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:4000', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:30:15', '2024-12-03 03:30:15');
INSERT INTO `strategy_flow_record` VALUES (328, 'yy', 10006, '96617644', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:31:54', '2024-12-03 03:31:54');
INSERT INTO `strategy_flow_record` VALUES (329, 'yy', 10006, '96617644', 102, '权重接管-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:4000;awardId:102', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:31:54', '2024-12-03 03:31:54');
INSERT INTO `strategy_flow_record` VALUES (330, 'yy', 10006, '96716550', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:35:52', '2024-12-03 03:35:52');
INSERT INTO `strategy_flow_record` VALUES (331, 'yy', 10006, '96716550', 104, '权重接管-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:4000;awardId:104', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:35:52', '2024-12-03 03:35:52');
INSERT INTO `strategy_flow_record` VALUES (332, 'yy', 10006, '96962444', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:36:05', '2024-12-03 03:36:05');
INSERT INTO `strategy_flow_record` VALUES (333, 'yy', 10006, '96962444', 103, '权重接管-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:4000;awardId:103', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:36:05', '2024-12-03 03:36:05');
INSERT INTO `strategy_flow_record` VALUES (334, 'yy', 10006, '96996524', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:36:39', '2024-12-03 03:36:39');
INSERT INTO `strategy_flow_record` VALUES (335, 'yy', 10006, '96996524', 104, '权重接管-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:4000;awardId:104', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:36:39', '2024-12-03 03:36:39');
INSERT INTO `strategy_flow_record` VALUES (336, 'yy', 10006, '97050362', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:37:33', '2024-12-03 03:37:33');
INSERT INTO `strategy_flow_record` VALUES (337, 'yy', 10006, '97050362', 102, '权重接管-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:4000;awardId:102', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:37:33', '2024-12-03 03:37:33');
INSERT INTO `strategy_flow_record` VALUES (338, 'yy', 10006, '97114192', NULL, '黑名单放行,userId:yy', 'chain', 'ALLOW', NULL, NULL, 'rule_blacklist', 'rule_weight', NULL, 1, '2024-12-03 03:38:36', '2024-12-03 03:38:36');
INSERT INTO `strategy_flow_record` VALUES (339, 'yy', 10006, '97114192', 104, '权重接管-权重配置:4000:102,103,104,105 5000:102,103,104,105,106,107 6000:102,103,104,105,106,107,108;当前权重:4000;awardId:104', 'chain', 'TAKE_OVER', NULL, NULL, 'rule_weight', 'rule_default', NULL, 0, '2024-12-03 03:38:36', '2024-12-03 03:38:36');

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
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of strategy_rule
-- ----------------------------
INSERT INTO `strategy_rule` VALUES (15, 10006, NULL, 1, 'rule_weight', '4000:102,103 5000:102,103,104 6000:103,104', '抽奖花费积分达成', '2024-10-11 05:44:41', '2024-12-03 03:39:49');
INSERT INTO `strategy_rule` VALUES (16, 10006, NULL, 1, 'rule_blacklist', '100:user001,user002,user003,yxb', '黑名单用户,1积分', '2024-10-11 05:45:32', '2024-11-29 02:11:10');

SET FOREIGN_KEY_CHECKS = 1;
