# 🔥 Next.js Redis Caching App

A full-featured Next.js application built for performance and scalability using **Redis** for server-side and client-side caching. Includes SSR, CSR, dynamic routing, metric tracking, and simulated state updates.

---

## 🚀 Features

- ✅ **Server-Side Rendering (SSR)** — `/users/[id]`, `/posts/[id]`
- ✅ **Client-Side Rendering (CSR)** — `/`(it has users)
- ✅ **Dynamic Routing** with per-resource caching
- ✅ **Redis Caching** with TTL + invalidation logic
- ✅ **Custom API Routes** for data abstraction
- ✅ **Performance Metrics Dashboard** — `/dashboard`

---

## 🧱 Stack

- [Next.js](https://nextjs.org/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📁 Project Structure

```txt
nextjs-app/
├── src/
│   ├── pages/
│   │   ├── index.tsx              # Home page (CSR)  
│   │   ├── posts   
│   │   │   ├── posts/[id].tsx 
│   │   ├── users   
│   │   │   ├── users/[id].tsx  
│   │   └── dashboard.tsx          # Metrics Summary
│   ├── pages/api/                 # Redis-backed API endpoints
│   ├── lib/                       # redis.ts, metrics.ts (Redis logic)
│   ├── styles/                    # Tailwind and custom component styles
├── docker-compose.yml
├── Dockerfile
├── .env.local
├── tsconfig.json
├── package.json
├── README.md ✅

---

## 🛠️ Local Setup

```bash
git clone https://github.com/your-username/nextjs-redis-app
cd nextjs-redis-app

# Clean install
rm -rf node_modules package-lock.json

# Start app + Redis via Docker
docker-compose up --build
```

Visit:
- http://localhost:3000/ — CSR users
- http://localhost:3000/users/:id — SSR user's profile
- http://localhost:3000/posts/:id — SSR with comments
- http://localhost:3000/dashboard — Redis metrics

---

## 📦 Redis Configuration

Environment variable in `docker-compose.yml`:

```env
REDIS_HOST=redis
```

In code:

```ts
const redis = new Redis({ host: process.env.REDIS_HOST || 'localhost' });
```

---

## 🧠 Caching Strategy

| Page     | Rendering | Redis Key | TTL |
|----------|-----------|-----------|-----|
| `/posts` | SSR | `posts` | 60s |
| `/`      | CSR | `users` | 60s |
| `/posts/[id]` | SSR | `comments:<id>` | 120s |
| `/users/[id]` | SSR | `comments:<id>` | 120s |


---

## 📊 Performance Testing

**SSR Timing:**
| Scenario | Time |
|----------|------|
| `/posts` (no cache) | ~300–600ms |
| `/posts` (cache) | ~50–120ms |

**CSR Timing (`console.log`)**
```bash
⏱️ /users fetch: 492ms
⏱️ /users fetch: 33ms (cached)
⏱️ /posts fetch: 412ms
⏱️ /posts fetch: 26ms (cached)
```

---

## 📈 Redis Metrics Dashboard

Track hit/miss/cache performance per route:

```
Route     | Hits | Misses | Total | Hit Rate
----------|------|--------|-------|---------
users     |   3  |   1    |   4   | 75%
posts     |   2  |   2    |   4   | 50%
comments  |   4  |   2    |   6   | 66%
```

---

## ⚖️ Scaling Strategy

To scale this app for production:

1. **Split architecture**
   - Separate **frontend (Next.js)** and **backend (API routes)** if needed
   - Deploy as microservices with CI/CD

2. **Use Redis Cluster**
   - Improve cache availability, eviction policies, sharding

3. **Edge Caching**
   - Use **Vercel Edge Functions** or **Cloudflare Workers** to serve SSR from edge locations

4. **Monitoring & Observability**
   - Add tools like **Grafana + Prometheus** to monitor Redis and API usage

5. **CDN & Image Optimizations**
   - Use Next.js Image component for lazy loading and CDN delivery

---
## ✅ Final Notes

- 💡 Redis caching drastically improves performance
- 🧠 Toggle logic shows real-world update pattern
- 📊 Metrics dashboard helps debug and optimize

Built with ❤️ for the internship assignment challenge.