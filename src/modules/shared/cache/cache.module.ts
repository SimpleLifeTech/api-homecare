import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';

import { CacheRepository } from './cache.repository';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        options: {
          connectTimeout: 30000,
          tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
          username: process.env.REDIS_USERNAME,
          password: process.env.REDIS_PASSWORD,
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        },
      }),
    }),
  ],
  providers: [CacheRepository],
  exports: [CacheRepository],
})
export class CacheRepositoryModule {}
