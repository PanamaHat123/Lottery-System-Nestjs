import {Body, Controller, Get, Param, Post, Query, Req, Request} from "@nestjs/common";
import {IRaffleService} from "apps/lottery-api/src/IRaffleService";
import {RaffleAwardListRequestDTO} from "apps/lottery-api/src/dto/RaffleAwardListRequestDTO";
import {AppResponse} from "apps/lottery-types/src/model/Response";
import {RaffleAwardListResponseDTO} from "apps/lottery-api/src/dto/RaffleAwardListResponseDTO";
import {RaffleResponseDTO} from "apps/lottery-api/src/dto/RaffleResponseDTO";
import {RaffleRequestDTO} from "apps/lottery-api/src/dto/RaffleRequestDTO";
import {DefaultRaffleStrategy} from "apps/lottery-domain/src/strategy/service/raffle/DefaultRaffleStrategy";
import {StrategyArmoryDispatch} from "apps/lottery-domain/src/strategy/service/armory/StrategyArmoryDispatch";
import {ResponseCode} from "../../../lottery-types/src/enums/ResponseCode";
import {StrategyAwardEntity} from "../../../lottery-domain/src/strategy/model/entity/StrategyAwardEntity";
import {RaffleAwardEntity} from "../../../lottery-domain/src/strategy/model/entity/RaffleAwardEntity";


@Controller("api/v1/raffle")
export class IRaffleController implements IRaffleService {


    constructor(
        private readonly strategyArmoryService: StrategyArmoryDispatch,
        private readonly raffleAward: DefaultRaffleStrategy,
        private readonly raffleStrategy: DefaultRaffleStrategy,
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
                userId: "system",
                strategyId: requestDTO.strategyId
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


}