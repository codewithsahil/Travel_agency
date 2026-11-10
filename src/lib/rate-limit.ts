/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Limitation: counters live in this server process only. On serverless or multi-instance hosting each
 * instance keeps its own counters, so treat this as a speed bump and put a shared limiter (WAF rule,
 * Upstash/Redis) in front for real traffic. See SECURITY_RECOMMENDATIONS.md.
 */

type Bucket = { count: number; resetAt: number }

const MAX_KEYS = 5_000
const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  // Keep memory bounded: drop expired buckets first, then the oldest one if still full.
  if (buckets.size >= MAX_KEYS) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
    if (buckets.size >= MAX_KEYS) {
      const oldest = buckets.keys().next().value
      if (oldest !== undefined) buckets.delete(oldest)
    }
  }

  let bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs }
    buckets.set(key, bucket)
  }
  bucket.count += 1

  return {
    ok: bucket.count <= limit,
    retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  }
}
