import {Body, Controller, Get, Param, Post, Query, Req, Request} from "@nestjs/common";
import {IRaffleService} from "apps/lottery-api/src/IRaffleService";
import {RaffleAwardListRequestDTO} from "apps/lottery-api/src/dto/RaffleAwardListRequestDTO";
import {AppResponse} from "apps/lottery-types/src/model/Response";
import {RaffleAwardListResponseDTO} from "apps/lottery-api/src/dto/RaffleAwardListResponseDTO";
import {RaffleResponseDTO} from "apps/lottery-api/src/dto/RaffleResponseDTO";
import {RaffleRequestDTO} from "apps/lottery-api/src/dto/RaffleRequestDTO";
import {DefaultRaffleStrategy} from "apps/lottery-domain/src/strategy/service/raffle/DefaultRaffleStrategy";
import {StrategyArmoryDispatch} from "apps/lottery-domain/src/strategy/service/armory/StrategyArmoryDispatch";
import {ResponseCode} from "apps/lottery-types/src/enums/ResponseCode";
import {StrategyAwardEntity} from "apps/lottery-domain/src/strategy/model/entity/StrategyAwardEntity";
import {RaffleAwardEntity} from "apps/lottery-domain/src/strategy/model/entity/RaffleAwardEntity";
import {StrategyRaffleFlowResponseDTO} from "apps/lottery-api/src/dto/StrategyRaffleFlowResponseDTO";
import {RaffleFlowService} from "apps/lottery-domain/src/strategy/service/raffle/RaffleFlowService";
import {RuleTreeResponseDTO} from "../../../lottery-api/src/dto/RuleTreeResponseDTO";
import {RuleTreeNodeLineResponseDTO} from "../../../lottery-api/src/dto/RuleTreeNodeLineResponseDTO";
import {RuleTreeNodeResponseDTO} from "../../../lottery-api/src/dto/RuleTreeNodeResponseDTO";
import {StrategyRuleEntity} from "../../../lottery-domain/src/strategy/model/entity/StrategyRuleEntity";
import {StrategyRuleDTO} from "../../../lottery-api/src/dto/StrategyRuleDTO";
import {StrategyRaffleFlowRecordDTO} from "../../../lottery-api/src/dto/StrategyRaffleFlowRecordDTO";
import {deepConvertMapsToObjects} from "../../../lottery-types/src/utils/MapToObj";


@Controller("api/v1/raffle/strategy")
export class IRaffleController implements IRaffleService {


    constructor(
        private readonly strategyArmoryService: StrategyArmoryDispatch,
        private readonly raffleAward: DefaultRaffleStrategy,
        private readonly raffleStrategy: DefaultRaffleStrategy,
        private readonly raffleFlow: RaffleFlowService,
    ) {
    }

    /**
     * 策略装配，将策略信息装配到缓存中
     */
    @Get("strategy_armory")
    async strategyArmory(@Query("strategyId") strategyId: number): Promise<AppResponse<boolean>> {
        try {
            console.info(`抽奖策略装配开始 strategyId:${strategyId}`);
            const armoryStatus = await this.strategyArmoryService.assembleLotteryStrategy(strategyId);
            const response = new AppResponse<boolean>();
            response.code = ResponseCode.SUCCESS.code;
            response.info = ResponseCode.SUCCESS.info;
            response.data = armoryStatus;
            return response;
        } catch (e) {
            console.error(e)
            console.info(`抽奖策略装配失败 strategyId:${strategyId}`);
            const response = new AppResponse<boolean>();
            response.code = ResponseCode.UN_ERROR.code;
            response.info = ResponseCode.UN_ERROR.info;
            response.data = false;
            return response;
        }

    }

    /**
     * 查询奖品列表
     */
    @Post("query_raffle_award_list")
    async queryRaffleAwardList(@Body() requestDTO: RaffleAwardListRequestDTO): Promise<AppResponse<RaffleAwardListResponseDTO[]>> {

        try {
            console.info(`查询抽奖奖品列表开始 requestDTO:${requestDTO}`);
            // 查询奖品配置
            const strategyAwardEntities: StrategyAwardEntity[] = await this.raffleAward.queryRaffleStrategyAwardList(requestDTO.strategyId);
            const raffleAwardListResponseDTOS: RaffleAwardListResponseDTO[] = [];

            for (let strategyAwardEntity of strategyAwardEntities) {
                const responseDTO = new RaffleAwardListResponseDTO();
                responseDTO.awardId = strategyAwardEntity.awardId;
                responseDTO.awardTitle = strategyAwardEntity.awardTitle;
                responseDTO.awardSubtitle = strategyAwardEntity.awardSubtitle;
                responseDTO.sort = strategyAwardEntity.sort;
                raffleAwardListResponseDTOS.push(responseDTO);
            }
            const response = new AppResponse<RaffleAwardListResponseDTO[]>();
            response.code = ResponseCode.SUCCESS.code;
            response.info = ResponseCode.SUCCESS.info;
            response.data = raffleAwardListResponseDTOS;
            console.info(`查询抽奖奖品列表完成 requestDTO:${requestDTO},response:${response}`);
            return response;
        } catch (e) {
            console.error(e)
            console.info(`查询抽奖奖品列表失败 requestDTO:${requestDTO}`);
            const response = new AppResponse<null>();
            response.code = ResponseCode.UN_ERROR.code;
            response.info = ResponseCode.UN_ERROR.info;
            return response;
        }
    }


    /**
     * 随机抽奖接口
     */
    @Post("random_raffle")
    async randomRaffle(@Body() requestDTO: RaffleRequestDTO): Promise<AppResponse<RaffleResponseDTO>> {

        try {
            console.info(`随机抽奖开始 strategyId: ${requestDTO.strategyId}`);
            // 调用抽奖接口
            const raffleAwardEntity: RaffleAwardEntity = await this.raffleStrategy.performRaffle({
                userId: requestDTO.userId,
                strategyId: requestDTO.strategyId,
                orderId:requestDTO.orderId
            })
            const response = new AppResponse<RaffleResponseDTO>()
            response.code = ResponseCode.SUCCESS.code;
            response.info = ResponseCode.SUCCESS.info;

            response.data = {
                awardId: raffleAwardEntity.awardId,
                awardIndex: raffleAwardEntity.sort
            };
            console.info(`随机抽奖完成 strategyId: ${requestDTO.strategyId} response: ${JSON.stringify(response)}`);
            return response;
        } catch (e) {
            console.error(e)
            console.error(`随机抽奖失败 strategyId：${requestDTO.strategyId}`);

            const response = new AppResponse<null>();
            response.code = ResponseCode.UN_ERROR.code;
            response.info = ResponseCode.UN_ERROR.info;
            return response
        }
    }

    /**
     * 随机抽奖接口
     */
    @Get("raffle_flow")
    async queryStrategyRaffleFlow(@Query("orderId") orderId: string): Promise<AppResponse<StrategyRaffleFlowResponseDTO>> {
        //1. 查询订单是否存在
        const strategyFlowRecordEntities = await this.raffleFlow.queryStrategyFlowRecordList(orderId);

        if(strategyFlowRecordEntities.length== 0){
            const response = new AppResponse<null>();
            response.code = ResponseCode.UN_ERROR.code;
            response.info = ResponseCode.UN_ERROR.info;
            return response;
        }
        //2. 查询抉择树
        //2.1 该流程是否走了抉择树
        const treeRecord = strategyFlowRecordEntities.filter(item => item.processType == "tree");
        let ruleTreeResponseDTO:RuleTreeResponseDTO = null; //RuleTreeResponseDTO
        if(treeRecord.length != 0){
            const flowRecordEntity = treeRecord[0];
            ruleTreeResponseDTO = await this.getTreeResponseDTO(flowRecordEntity.treeId);
        }

        //3. 查询责任链
        //3.1 获取当前订单的 策略id
        const strategyId = strategyFlowRecordEntities[0].strategyId;
        //3.2 查询当前策略对象，找到策略上配置的 责任链规则
        const strategyEntity =await this.raffleFlow.queryStrategyByStrategyId(strategyId);
        const chainRuleModelNames = strategyEntity.getRuleModels();
        //3.3 查询该策略下所有的 责任链规则，按照策略规则排序 最后处理default策略
        const strategyRuleEntities =await this.raffleFlow.queryStrategyRuleList(strategyId);
        const map = new Map<string, StrategyRuleEntity>();
        strategyRuleEntities.forEach(item => map.set(item.ruleModel, item));
        const strategyRuleDTOS : StrategyRuleDTO[] = [];
        for (let modelName of chainRuleModelNames) {
            const ruleEntity:StrategyRuleEntity = map.get(modelName);
            const strategyRuleDTO = new StrategyRuleDTO()
            strategyRuleDTO.strategyId = ruleEntity.strategyId;
            strategyRuleDTO.awardId = ruleEntity.awardId;
            strategyRuleDTO.ruleType = ruleEntity.ruleType;
            strategyRuleDTO.ruleModel = ruleEntity.ruleModel;
            strategyRuleDTO.ruleValue = ruleEntity.ruleValue;
            strategyRuleDTO.ruleDesc = ruleEntity.ruleDesc;
            strategyRuleDTOS.push(strategyRuleDTO)
        }
        //3.3 处理责任链中的默认策略
        const strategyRuleDTO = new StrategyRuleDTO();
        strategyRuleDTO.strategyId = strategyId;
        strategyRuleDTO.ruleType = 1;
        strategyRuleDTO.ruleModel = "rule_default";
        strategyRuleDTO.ruleDesc = "随机抽奖";
        strategyRuleDTOS.push(strategyRuleDTO)
        //4. 封装返回结果
        const strategyFlowRecordDTOS :StrategyRaffleFlowRecordDTO[]=  strategyFlowRecordEntities.map(item=>{
           const res = new StrategyRaffleFlowRecordDTO()
            res.userId = item.userId;
            res.strategyId = item.strategyId;
            res.orderId = item.orderId;
            res.awardId = item.awardId;
            res.nodeDesc = item.nodeDesc;
            res.processType = item.processType;
            res.chainProcessResult = item.chainProcessResult;
            res.treeProcessResult = item.treeProcessResult;
            res.ruleLimitValue = item.ruleLimitValue;
            res.currentNode = item.currentNode;
            res.nextNode = item.nextNode;
            res.head = item.head;
            res.treeId = item.treeId;
           return res;
        })

        const responseDTO = new StrategyRaffleFlowResponseDTO();

        responseDTO.strategyRaffleFlowRecords = strategyFlowRecordDTOS;

        responseDTO.tree = deepConvertMapsToObjects(ruleTreeResponseDTO);
        responseDTO.chain = strategyRuleDTOS;


        const response = new AppResponse<StrategyRaffleFlowResponseDTO>();
        response.code = ResponseCode.SUCCESS.code;
        response.info = ResponseCode.SUCCESS.info;
        response.data = responseDTO;
        return response;
    }

    async getTreeResponseDTO(treeId:string):Promise<RuleTreeResponseDTO>{
        const ruleTreeVO = await this.raffleFlow.queryRuleTree(treeId);
        let treeNodeMapDTO = new Map<string,RuleTreeNodeResponseDTO>();
        for (let key of ruleTreeVO.treeNodeMap.keys()) {
            let value = ruleTreeVO.treeNodeMap.get(key);
            const treeNodeLineVOList = value.treeNodeLineVOList;
            const treeNodeLineDTOList = [];
            if(treeNodeLineVOList){
                treeNodeLineVOList.forEach(treeNodeLine=>{
                    const nodeLineResponseDTO = new RuleTreeNodeLineResponseDTO();
                    nodeLineResponseDTO.treeId = treeNodeLine.treeId;
                    nodeLineResponseDTO.ruleLimitType = treeNodeLine.ruleLimitType;
                    nodeLineResponseDTO.ruleLimitValue = treeNodeLine.ruleLimitValue;
                    nodeLineResponseDTO.ruleNodeFrom = treeNodeLine.ruleNodeFrom;
                    nodeLineResponseDTO.ruleNodeTo = treeNodeLine.ruleNodeTo;
                    treeNodeLineDTOList.push(nodeLineResponseDTO);
                })
            }

            const ruleTreeNodeResponseDTO = new RuleTreeNodeResponseDTO();
            ruleTreeNodeResponseDTO.ruleKey = value.ruleKey;
            ruleTreeNodeResponseDTO.ruleDesc = value.ruleDesc;
            ruleTreeNodeResponseDTO.ruleValue = value.ruleValue;
            ruleTreeNodeResponseDTO.treeId = value.treeId;
            ruleTreeNodeResponseDTO.treeNodeLineList = treeNodeLineDTOList;
            treeNodeMapDTO.set(key,ruleTreeNodeResponseDTO);
        }
        const responseDTO = new RuleTreeResponseDTO();
        responseDTO.treeId = ruleTreeVO.treeId;
        responseDTO.treeName = ruleTreeVO.treeName;
        responseDTO.treeDesc = ruleTreeVO.treeDesc;
        responseDTO.treeRootRuleNode = ruleTreeVO.treeRootRuleNode;
        responseDTO.treeNodeMap = treeNodeMapDTO;
        return responseDTO;
    }



}