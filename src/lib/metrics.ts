import redis from './redis';

export async function incrementMetric(key: string, type: 'hit' | 'miss') {
  const baseKey = `metrics:${key}`;
  await redis.incr(`${baseKey}:${type}`);
  await redis.incr(`${baseKey}:total`);
}

export async function getMetricStats(key: string) {
  const [hits, misses, total] = await Promise.all([
    redis.get(`metrics:${key}:hit`),
    redis.get(`metrics:${key}:miss`),
    redis.get(`metrics:${key}:total`),
  ]);

  return {
    hits: parseInt(hits || '0', 10),
    misses: parseInt(misses || '0', 10),
    total: parseInt(total || '0', 10),
  };
}
