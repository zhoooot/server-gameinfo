import { FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_URL } from 'src/config';

export const redisClientFactory: FactoryProvider<Redis> = {
<<<<<<< HEAD
  provide: 'REDIS',
  useFactory: async () => {
    const client = new Redis(REDIS_URL);
    client.on('connect', () => {
      console.log('Redis client connected');
    });
=======
    provide: 'REDIS',
    useFactory: async () => {
        const client = new Redis({
            host: 'localhost',
            port: 6390,
        });
        client.on('connect', () => {
            console.log('Redis client connected');
        });
>>>>>>> e436c00 (Safe place)

    client.on('error', (err) => {
      console.log(`Something went wrong ${err}`);
    });

    return client;
  },
  inject: [],
};
