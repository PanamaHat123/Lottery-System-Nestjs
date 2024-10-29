import {IRedisService} from "./IRedisService.interface";
import {Injectable} from "@nestjs/common";
import {InjectRedis} from "@nestjs-modules/ioredis";
import Redis from 'ioredis';
import {deepConvertMapsToObjects} from "apps/lottery-types/src/utils/MapToObj";
@Injectable()
export class RedisService implements IRedisService{

    constructor(
        @InjectRedis() private readonly client: Redis
    ) {
    }

    async getValue(key: string): Promise<any> {
        if (!key || key === '*') return null;
        let res = await this.client.get(key);
        res = this.processOutData(res) as any;
        return res;
    }

    private processOutData(res:any):any {
        if (null == res || '' == res) {
            return null
        } else if (res.includes("{") || res.includes("[")) {
            return JSON.parse(res)
        } else if (isNaN(parseInt(res))) {
            return res
        }
        return +res
    }

    async setValue<T>(key: string, val: T, ttl?: number): Promise<string> {
        const data = this.processInData(val);
        if (!ttl) return this.client.set(key, data);
        return this.client.set(key, data, 'PX', ttl);
    }

    private processInData<T>(val: T) {
        val = deepConvertMapsToObjects(val as any) as T
        const data = JSON.stringify(val);
        return data;
    }

    setValueAndExpired<T>(key: string, value: T, expired: number): void {
    }


    /* ----------------------- hash ----------------------- */

    /**
     * hash 设置 key 下单个 field value
     * @param key
     * @param field 属性
     * @param value 值
     */
    async hset(key: string, field: string, value: string): Promise<string | number | null> {
        if (!key || !field) return null;
        return await this.client.hset(key, field, value);
    }

    /**
     * hash 设置 key 下多个 field value
     * @param key
     * @param data
     * @params expire 单位 秒
     */
    async hmset(key: string, data: Record<string, string | number | boolean>, expire?: number): Promise<number | any> {
        if (!key || !data) return 0;
        const result = await this.client.hmset(key, data);
        if (expire) {
            await this.client.expire(key, expire);
        }
        return result;
    }

    /**
     * hash 获取单个 field 的 value
     * @param key
     * @param field
     */
    async hget(key: string, field: string): Promise<number | string | null> {
        if (!key || !field) return 0;
        return this.client.hget(key, field);
    }

    /**
     * hash 获取 key 下所有field 的 value
     * @param key
     */
    async hvals(key: string): Promise<string[]> {
        if (!key) return [];
        return this.client.hvals(key);
    }

    async hGetAll(key: string): Promise<Record<string, string>> {
        return this.client.hgetall(key);
    }
    /**
     * hash 删除 key 下 一个或多个 fields value
     * @param key
     * @param fields
     */
    async hdel(key: string, fields: string | string[]): Promise<string[] | number> {
        if (!key || fields.length === 0) return 0;
        return this.client.hdel(key, ...fields);
    }

    /**
     * hash 删除 key 下所有 fields value
     * @param key
     */
    async hdelAll(key: string): Promise<string[] | number> {
        if (!key) return 0;
        const fields = await this.client.hkeys(key);
        if (fields.length === 0) return 0;
        return await this.hdel(key, fields);
    }

    /* -----------   list 相关操作 ------------------ */

    /**
     * 获取列表长度
     * @param key
     */
    async lLength(key: string): Promise<number> {
        if (!key) return 0;
        return this.client.llen(key);
    }

    /**
     * 通过索引设置列表元素的值
     * @param key
     * @param index
     * @param val
     */
    async lSet(key: string, index: number, val: string): Promise<'OK' | null> {
        if (!key || index < 0) return null;
        return this.client.lset(key, index, val);
    }

    /**
     * 通过索引获取 列表中的元素
     * @param key
     * @param index
     */
    async lIndex(key: string, index: number): Promise<string | null> {
        if (!key || index < 0) return null;
        return this.client.lindex(key, index);
    }

    /**
     * 获取列表指定范围内的元素
     * @param key
     * @param start 开始位置， 0 是开始位置
     * @param stop 结束位置， -1 返回所有
     */
    async lRange(key: string, start: number, stop: number): Promise<string[] | null> {
        if (!key) return null;
        return this.client.lrange(key, start, stop);
    }

    /**
     * 将一个或多个值插入到列表头部
     * @param key
     * @param val
     */
    async lLeftPush(key: string, ...val: string[]): Promise<number> {
        if (!key) return 0;
        return this.client.lpush(key, ...val);
    }

    /**
     * 将一个值或多个值插入到已存在的列表头部
     * @param key
     * @param val
     */
    async lLeftPushIfPresent(key: string, ...val: string[]): Promise<number> {
        if (!key) return 0;
        return this.client.lpushx(key, ...val);
    }

    /**
     * 如果 pivot 存在，则在 pivot 前面添加
     * @param key
     * @param pivot
     * @param val
     */
    async lLeftInsert(key: string, pivot: string, val: string): Promise<number> {
        if (!key || !pivot) return 0;
        return this.client.linsert(key, 'BEFORE', pivot, val);
    }

    /**
     * 如果 pivot 存在，则在 pivot 后面添加
     * @param key
     * @param pivot
     * @param val
     */
    async lRightInsert(key: string, pivot: string, val: string): Promise<number> {
        if (!key || !pivot) return 0;
        return this.client.linsert(key, 'AFTER', pivot, val);
    }

    /**
     * 在列表中添加一个或多个值
     * @param key
     * @param val
     */
    async lRightPush(key: string, ...val: string[]): Promise<number> {
        if (!key) return 0;
        return this.client.lpush(key, ...val);
    }

    /**
     * 为已存在的列表添加一个或多个值
     * @param key
     * @param val
     */
    async lRightPushIfPresent(key: string, ...val: string[]): Promise<number> {
        if (!key) return 0;
        return this.client.rpushx(key, ...val);
    }

    /**
     * 移除并获取列表第一个元素
     * @param key
     */
    async lLeftPop(key: string): Promise<string> {
        if (!key) return null;
        const result = await this.client.blpop(key);
        return result.length > 0 ? result[0] : null;
    }

    /**
     * 移除并获取列表最后一个元素
     * @param key
     */
    async lRightPop(key: string): Promise<string> {
        if (!key) return null;
        const result = await this.client.brpop(key);
        return result.length > 0 ? result[0] : null;
    }

    /**
     * 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除
     * @param key
     * @param start
     * @param stop
     */
    async lTrim(key: string, start: number, stop: number): Promise<'OK' | null> {
        if (!key) return null;
        return this.client.ltrim(key, start, stop);
    }

    /**
     * 移除列表元素
     * @param key
     * @param count
     * count > 0 ：从表头开始向表尾搜索，移除与 value 相等的元素，数量为 count；
     * count < 0 ：从表尾开始向表头搜索，移除与 value 相等的元素，数量为 count 的绝对值；
     * count = 0 ： 移除表中所有与 value 相等的值
     * @param val
     */
    async lRemove(key: string, count: number, val: string): Promise<number> {
        if (!key) return 0;
        return this.client.lrem(key, count, val);
    }

    /**
     * 移除列表最后一个元素，并将该元素添加到另一个裂膏并返回
     * 如果列表没有元素会阻塞队列直到等待超时或发现可弹出元素为止
     * @param sourceKey
     * @param destinationKey
     * @param timeout
     */
    async lPoplPush(sourceKey: string, destinationKey: string, timeout: number): Promise<string> {
        if (!sourceKey || !destinationKey) return null;
        return this.client.brpoplpush(sourceKey, destinationKey, timeout);
    }

    /**
     * 删除全部缓存
     * @returns
     */
    async reset() {
        return this.client.reset();
    }

    async isExists(cacheKey: string):Promise<boolean> {
        const result = await this.client.exists(cacheKey)
        return result === 1
    }
    async incrementAtomicLong(key: string, incrementBy: number): Promise<number> {
        // 使用INCRBY命令来原子地增加键的值
        const newValue = await this.client.incrby(key, incrementBy);
        return newValue;
    }

    async decrementAtomicLong(key: string, decrementBy: number): Promise<number> {
        // 使用DECRBY命令来原子地减少键的值
        const newValue = await this.client.decrby(key, decrementBy);
        return newValue;
    }

    async setNx(lockKey: string,expireTimeMs?: number): Promise<boolean> {
        let res = false;
        if(!expireTimeMs){
            const r = await this.client.setnx(lockKey,'1');
            res = r === 1
        }else{
            //todo
            res = false
        }
        return res;
    }

    async addToArray(key: string, value: any): Promise<void>{
        value = this.processInData(value);
        await this.client.lpush(key,value);
    }

    async popArray(key: string): Promise<any>{
       const res = await this.client.rpop(key);
       return this.processOutData(res);
    }

}