import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '@/lib/redis';
import { incrementMetric } from '@/lib/metrics';

// This reduces the number of requests made to the external API and improves performance by serving cached data quickly.
// The API route is defined in this file, and it uses the`redis` instance created in the `src/lib/redis.ts` file to interact with the Redis database

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const key = 'posts';
    const cached = await redis.get(key);

  if (cached) {
    await incrementMetric(key, 'hit');
    return res.status(200).json({ posts: JSON.parse(cached), fromCache: true });
  }

  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();

  await redis.set('posts', JSON.stringify(data), 'EX', 60);// This API route fetches posts from an external API and caches the result in Redis for 60 seconds.
  await incrementMetric(key, 'miss');
  res.status(200).json(data);
}
