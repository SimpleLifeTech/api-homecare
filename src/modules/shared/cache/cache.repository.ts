import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Duration } from '../utils/duration';

@Injectable()
export class CacheRepository {
  constructor(@InjectRedis() public readonly client: Redis) {}

  async listAllKeys(keyParams?: string): Promise<string[]> {
    if (keyParams) {
      return await this.client.keys(keyParams);
    }
    return await this.client.keys('*');
  }

  async set<T>(key: string, data: T, expirationSeconds?: number, keepttl = false): Promise<void> {
    const expTime = expirationSeconds ?? Duration({ hours: 1 }).toSeconds();
    await this.client.set(key, JSON.stringify(data), 'EX', expTime);
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.client.get(key);
    if (result === null) return null;
    return JSON.parse(result) as T | null;
  }

  async getOrSet<T>(key: string, expirationSeconds: number, getter: () => Promise<T>): Promise<T> {
    const existingData = await this.get<T>(key);
    if (existingData !== null) return existingData;

    const getterResult = await getter();
    await this.set(key, getterResult, expirationSeconds);
    return getterResult;
  }

  async saveDataKeepTtl<T>(data: T, key: string): Promise<void> {
    await this.client.set(key, JSON.stringify(data), 'KEEPTTL');
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
