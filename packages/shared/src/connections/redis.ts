/* eslint-disable no-console */
import { createClient, RedisClientType } from 'redis';
import { Redis } from 'ioredis';
import { RedisConfig } from 'shared/configs';
import { ConsoleLogger } from 'shared/logger';
import Container from 'typedi';

class RedisConnection {
    public readonly client: Redis;
    private static _instance: RedisConnection;
    private readonly logger: ConsoleLogger = Container.get(ConsoleLogger);

    private constructor(public readonly ttl: number) {
        console.log("(process.env.REDIS_URL):", String(process.env.REDIS_URL))
        // this.client = createClient({
        //     url: String(process.env.REDIS_URL) || `redis://${RedisConfig.Host}:${RedisConfig.Port}`,
        //     legacyMode: process.env.NODE_ENV !== 'test',
        // });
        this.client = new Redis(String(process.env.REDIS_URL));
        this.client.on('connect', () => {
            this.logger.log('Redis connection established successfully')
        });
        this.client.on('error', (error) => {
            this.logger.error('Error connecting to Redis', error)
        })
        // this.client
        //     .connect()
        //     .then(() =>
        //         this.logger.log('Redis connection established successfully')
        //     )
        //     .catch((error) =>
        //         this.logger.error('Error connecting to Redis', error)
        //     );
    }

    public static get instance() {
        if (!RedisConnection._instance) {
            RedisConnection._instance = new this(RedisConfig.TTL);
        }
        return RedisConnection._instance;
    }
}

export const redisConnection = RedisConnection.instance;
