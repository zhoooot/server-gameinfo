import { FactoryProvider } from "@nestjs/common";
import Redis from "ioredis";

export const redisClientFactory: FactoryProvider<Redis> = {
    provide: 'REDIS',
    useFactory: async () => {
        const client = new Redis({
            host: 'localhost',
            port: 6379,
        });
        client.on('connect', () => {
            console.log('Redis client connected');
        });

        client.on('error', (err) => {
            console.log(`Something went wrong ${err}`);
        });

        return client;
    },
    inject: [],
};