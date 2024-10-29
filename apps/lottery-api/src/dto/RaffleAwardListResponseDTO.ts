
/*
   抽奖奖品列表，应答对象
 */
export class RaffleAwardListResponseDTO {
    // 奖品ID
    awardId:number;
    // 奖品标题
    awardTitle:string;
    // 奖品副标题【抽奖1次后解锁】
    awardSubtitle:string;
    // 排序编号
    sort:number;

}