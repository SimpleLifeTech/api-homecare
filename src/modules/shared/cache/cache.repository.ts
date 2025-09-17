import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

@Injectable()
export class CacheRepository {
  private defaultTtl = 3600; // 1 hora
  private defaultPrefix = '';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  setDefaultTtl(ttl: number) {
    this.defaultTtl = ttl;
  }

  setDefaultPrefix(prefix: string) {
    this.defaultPrefix = prefix;
  }

  private getPrefixedKey(key: string, prefix?: string): string {
    return `${prefix ?? this.defaultPrefix}${key}`;
  }

  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttl ?? this.defaultTtl;
    const prefixedKey = this.getPrefixedKey(key, options?.prefix);
    await this.cacheManager.set(prefixedKey, value, ttl );
  }

  async get<T>(key: string, prefix?: string): Promise<T | null> {
    const prefixedKey = this.getPrefixedKey(key, prefix);
    const value = await this.cacheManager.get<T>(prefixedKey);
    return value ?? null;
  }

  async del(key: string, prefix?: string): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key, prefix);
    await this.cacheManager.del(prefixedKey);
  }

  async clearByPrefix(prefix: string): Promise<void> {
    const stores = (this.cacheManager as any).stores as any[];
    for (const store of stores) {
      if (!store?.client) continue;
      const keys = await store.client.keys(`${prefix}*`);
      if (keys.length > 0) {
        await store.client.del(keys);
      }
    }
  }

  async clearAll(): Promise<void> {
    const stores = (this.cacheManager as any).stores as any[];
    for (const store of stores) {
      if (store?.client?.flushdb) {
        await store.client.flushdb();
      }
    }
  }
}
