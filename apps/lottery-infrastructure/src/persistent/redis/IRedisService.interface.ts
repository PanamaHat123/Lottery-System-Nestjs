

export interface IRedisService  {
    /**
     * 设置指定 key 的值
     *
     * @param key   键
     * @param value 值
     */
    setValue<T>(key: string, value: T): void;

    /**
     * 设置指定 key 的值并指定过期时间
     *
     * @param key     键
     * @param value   值
     * @param expired 过期时间
     */
    setValueAndExpired<T>(key: string, value: T, expired: number): void;

    /**
     * 获取指定 key 的值
     *
     * @param key 键
     * @return 值
     */
    getValue<T>(key: string): Promise<T>;
}