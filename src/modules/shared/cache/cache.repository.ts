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

  /**
   * Set the default time to live for cache entries.
   * 
   * @param ttl Time to live in seconds
   */
  setDefaultTtl(ttl: number) {
    this.defaultTtl = ttl;
  }

  /**
   * Set the default prefix for cache keys.
   * 
   * @param prefix Default prefix for cache keys
   */
  setDefaultPrefix(prefix: string) {
    this.defaultPrefix = prefix;
  }

  private getPrefixedKey(key: string, prefix?: string): string {
    return `${prefix ?? this.defaultPrefix}${key}`;
  }

  /**
   * Method to set a value in the cache with optional TTL and prefix.
   * 
   * @param key - The cache key
   * @param value - The value to be cached
   * @param options - Optional settings including TTL and prefix
   */
  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttl ?? this.defaultTtl;
    const prefixedKey = this.getPrefixedKey(key, options?.prefix);
    await this.cacheManager.set(prefixedKey, value, ttl );
  }

  /**
   * Method to get a value from the cache with an optional prefix.
   * 
   * @param key - The cache key
   * @param prefix - Optional prefix for the cache key
   * @returns The cached value or null if not found
   */
  async get<T>(key: string, prefix?: string): Promise<T | null> {
    const prefixedKey = this.getPrefixedKey(key, prefix);
    const value = await this.cacheManager.get<T>(prefixedKey);
    return value ?? null;
  }

  /**
   * Method to delete a value from the cache with an optional prefix.
   * 
   * @param key - The cache key
   * @param prefix - Optional prefix for the cache key
   */
  async del(key: string, prefix?: string): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key, prefix);
    await this.cacheManager.del(prefixedKey);
  }

  /**
   * Method to clear all cache entries that match a given prefix.
   * 
   * @param prefix - The prefix to match cache keys
   */
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

  /**
   * Method to clear all cache entries.
   */
  async clearAll(): Promise<void> {
    const stores = (this.cacheManager as any).stores as any[];
    for (const store of stores) {
      if (store?.client?.flushdb) {
        await store.client.flushdb();
      }
    }
  }
}
