// src/pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '@/lib/redis';
import { incrementMetric } from '@/lib/metrics';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = 'users';
  const cached = await redis.get(key);

    if (cached) {
        await incrementMetric('users', 'hit');
        return res.status(200).json({ users: JSON.parse(cached), fromCache: true });
    }

  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await response.json();

  await redis.set(key, JSON.stringify(users), 'EX', 60);
  await incrementMetric('users', 'miss');
  res.status(200).json({
    users,
    fromCache: false,
  });
}
