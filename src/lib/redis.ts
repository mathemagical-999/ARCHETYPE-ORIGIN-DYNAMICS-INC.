import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Environment validation
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Redis client
export const redis = redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
    })
    : null;

// Rate limiters for different endpoints
export const rateLimiters = {
    // Waitlist: 5 requests per minute per IP
    waitlist: redisUrl && redisToken
        ? new Ratelimit({
            redis: new Redis({ url: redisUrl, token: redisToken }),
            limiter: Ratelimit.slidingWindow(5, '1 m'),
            analytics: true,
            prefix: 'ratelimit:waitlist',
        })
        : null,

    // Telemetry: 30 requests per minute per IP
    telemetry: redisUrl && redisToken
        ? new Ratelimit({
            redis: new Redis({ url: redisUrl, token: redisToken }),
            limiter: Ratelimit.slidingWindow(30, '1 m'),
            analytics: true,
            prefix: 'ratelimit:telemetry',
        })
        : null,

    // API: 60 requests per minute per IP (general)
    api: redisUrl && redisToken
        ? new Ratelimit({
            redis: new Redis({ url: redisUrl, token: redisToken }),
            limiter: Ratelimit.slidingWindow(60, '1 m'),
            analytics: true,
            prefix: 'ratelimit:api',
        })
        : null,

    // Auth: 10 requests per minute per IP (strict)
    auth: redisUrl && redisToken
        ? new Ratelimit({
            redis: new Redis({ url: redisUrl, token: redisToken }),
            limiter: Ratelimit.slidingWindow(10, '1 m'),
            analytics: true,
            prefix: 'ratelimit:auth',
        })
        : null,
};

// Helper to check if Redis is configured
export function isRedisConfigured(): boolean {
    return !!(redisUrl && redisToken);
}

// Cache helpers
export async function getCached<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
        return await redis.get<T>(key);
    } catch {
        return null;
    }
}

export async function setCached<T>(
    key: string,
    value: T,
    expirationSeconds: number = 300
): Promise<void> {
    if (!redis) return;
    try {
        await redis.setex(key, expirationSeconds, value);
    } catch {
        // Silently fail - caching is optional
    }
}

export async function deleteCached(key: string): Promise<void> {
    if (!redis) return;
    try {
        await redis.del(key);
    } catch {
        // Silently fail
    }
}
