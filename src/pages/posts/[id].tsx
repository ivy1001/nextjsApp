// pages/posts/[id].tsx
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import redis from '@/lib/redis'
import '../../styles/global.css'
interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface Comment {
  id: number
  name: string
  email: string
  body: string
}

export const getServerSideProps: GetServerSideProps<{
  post: Post
  comments: Comment[]
  fromCache: boolean
}> = async ({ params }) => {
  const id = params?.id
  const postKey = `post:${id}`
  const commentsKey = `comments:${id}`

  const [cachedPost, cachedComments] = await Promise.all([
    redis.get(postKey),
    redis.get(commentsKey),
  ])

  if (cachedPost && cachedComments) {
    return {
      props: {
        post: JSON.parse(cachedPost),
        comments: JSON.parse(cachedComments),
        fromCache: true,
      },
    }
  }

  const [postRes, commentsRes] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`),
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`),
  ])
  const post = await postRes.json()
  const comments = await commentsRes.json()

  await redis.set(postKey, JSON.stringify(post), 'EX', 120)
  await redis.set(commentsKey, JSON.stringify(comments), 'EX', 120)

  return {
    props: {
      post,
      comments,
      fromCache: false,
    },
  }
}

export default function PostPage({
  post,
  comments,
  fromCache,
}: {
  post: Post
  comments: Comment[]
  fromCache: boolean
}) {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Back Link */}
        <Link
          href={`/users/${post.userId}`}
          className="btn-back inline-block mb-6 text-sm"
        >
          ← Back to Author
        </Link>

        {/* Post Card */}
        <article className="card max-w-3xl mx-auto mb-10">
          <p className={`text-sm mb-4 ${fromCache ? 'text-green-600' : 'text-red-600'}`}>
            Loaded from: {fromCache ? 'Redis Cache ✅' : 'API 🔄'}
          </p>
          <h1 className="text-3xl font-bold text-purple-700 mb-4">{post.title}</h1>
          <p className="text-gray-700 leading-relaxed">{post.body}</p>
        </article>

        {/* Comments Section */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Comments ({comments.length})
          </h2>
          <div className="space-y-6">
            {comments.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-gray-200 rounded-xl p-6 flex space-x-4 hover:shadow-sm transition"
              >
                <div className="avatar w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <Image
                    src={`https://i.pravatar.cc/100?img=${c.id}`}
                    alt={c.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{c.email}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
