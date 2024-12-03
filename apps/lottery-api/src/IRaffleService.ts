import {AppResponse} from "apps/lottery-types/src/model/Response";
import {RaffleAwardListRequestDTO} from "./dto/RaffleAwardListRequestDTO";
import {RaffleAwardListResponseDTO} from "./dto/RaffleAwardListResponseDTO";
import {RaffleRequestDTO} from "./dto/RaffleRequestDTO";
import {RaffleResponseDTO} from "./dto/RaffleResponseDTO";
import {StrategyRaffleFlowResponseDTO} from "./dto/StrategyRaffleFlowResponseDTO";


/**
 * 抽奖服务接口
 */
export interface IRaffleService {


    /**
     * 策略装配接口
     * @param strategyId 策略ID
     * @return 装配结果
     */
    strategyArmory(strategyId:number): Promise<AppResponse<boolean>> ;


    /**
     * 查询抽奖奖品列表配置
     * @param requestDTO 抽奖奖品列表查询请求参数
     * @return 奖品列表数据
     */
    queryRaffleAwardList(requestDTO:RaffleAwardListRequestDTO):Promise<AppResponse<RaffleAwardListResponseDTO[]>>;

    /**
     * 随机抽奖接口
     * @param requestDTO 请求参数
     * @return 抽奖结果
     */
    randomRaffle(requestDTO:RaffleRequestDTO):Promise<AppResponse<RaffleResponseDTO>>;


    /**
     * 查询抽奖流程 责任链 -> 抉择树
     */
    queryStrategyRaffleFlow(orderId:string):Promise<AppResponse<StrategyRaffleFlowResponseDTO>>;


}