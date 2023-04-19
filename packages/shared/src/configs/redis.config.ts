import config from 'config';

export const RedisConfig = {
    Protocol: process.env.REDIS_PROTOCOL || 'http',
    Host: process.env.REDIS_HOST || config.get<string>('redis.host'),
    Port: process.env.REDIS_PORT || config.get<number>('redis.port'),
    Username:
        process.env.REDIS_USERNAME || config.get<string>('redis.username'),
    Password:
        process.env.REDIS_PASSWORD || config.get<string>('redis.password'),
    TTL:
        Number(process.env.REDIS_TTL) ||
        config.get<number>('redis.ttl') ||
        1800, // 30 minutes
};
