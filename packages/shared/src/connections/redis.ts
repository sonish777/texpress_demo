/* eslint-disable no-console */
import { Redis } from 'ioredis';
import { RedisConfig } from 'shared/configs';
import { ConsoleLogger } from 'shared/logger';
import Container from 'typedi';

class RedisConnection {
    public readonly client: Redis;
    private static _instance: RedisConnection;
    private readonly logger: ConsoleLogger = Container.get(ConsoleLogger);

    private constructor(public readonly ttl: number) {
        this.client = new Redis(String(process.env.REDIS_URL));
        this.client.on('connect', () => {
            this.logger.log('Redis connection established successfully');
        });
        this.client.on('error', (error) => {
            this.logger.error('Error connecting to Redis', error);
        });
    }

    public static get instance() {
        if (!RedisConnection._instance) {
            RedisConnection._instance = new this(RedisConfig.TTL);
        }
        return RedisConnection._instance;
    }
}

export const redisConnection = RedisConnection.instance;
