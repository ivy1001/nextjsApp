// pages/users/[id].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
// This page demonstrates server-side rendering with caching using Redis.
type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: { street: string; city: string };
  company: { name: string };
};

type Post = {
  id: number;
  title: string;
  body: string;
};

export const getServerSideProps: GetServerSideProps<{
    user: User;
    fromCache: boolean;
  }> = async ({ params }) => {
    const id = params?.id;
  
    const res = await fetch(`http://localhost:3000/api/users`);
    const data = await res.json();
  
    const user = data.users.find((u: User) => String(u.id) === id);
  
    return {
      props: {
        user,
        fromCache: data.fromCache,
      },
    };
  };
  
 export default function UserProfile({ user, fromCache }: { user: User; fromCache: boolean }) {

  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);
  const postRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  useEffect(() => {
    if (profileRef.current) {
      gsap.from(profileRef.current, {
        opacity: 0,
        y: -20,
        duration: 1.5,
        ease: 'power2.out',
      });
    }
  
    fetch(`https://jsonplaceholder.typicode.com/users/${user.id}/posts`)
      .then((res) => res.json())
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
  
        // Animate all post cards from bottom with fade-in
        setTimeout(() => {
            gsap.fromTo(
              postRefs.current,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
              }
            );
          }, 50); // Wait just a bit for DOM to update
          
      });
  }, [user.id]);
  

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-6">
        
        {/* Profile Card */}
        <div ref={profileRef} className="card max-w-md mx-auto">
        <p className={`text-sm text-center mb-4 ${fromCache ? 'text-green-600' : 'text-red-600'}`}>
            Loaded from: {fromCache ? 'Redis Cache ✅' : 'API 🔄'}
        </p>
          <div className="avatar mx-auto">
            <Image
              src={`https://i.pravatar.cc/150?img=${user.id}`}
              alt={user.name}
              width={120}
              height={120}
              className="rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold mt-4 text-gray-900 text-center">
            {user.name}
          </h1>
          <p className="text-gray-600 text-center mb-4">{user.email}</p>
          <ul className="text-sm text-gray-700 space-y-1 mb-6">
            <li>
              <span className="font-medium">Phone:</span> {user.phone}
            </li>
            <li>
              <span className="font-medium">Website:</span> {user.website}
            </li>
            <li>
              <span className="font-medium">Company:</span>{' '}
              {user.company.name}
            </li>
            <li>
              <span className="font-medium">Address:</span>{' '}
              {user.address.street}, {user.address.city}
            </li>
          </ul>
          <button
            onClick={() => router.push('/')}
            className="btn-primary w-full"
          >
            ← Go Back
          </button>
        </div>

        {/* Posts Section */}
        <section className="mt-12 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Posts</h2>
            <button
              onClick={() => {
                setLoading(true);
                fetch(
                  `https://jsonplaceholder.typicode.com/users/${user.id}/posts`
                )
                  .then((res) => res.json())
                  .then((data: Post[]) => {
                    setPosts(data);
                    setLoading(false);
                  });
              }}
              className="btn-primary text-sm"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading posts...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post, i) => (
                <Link key={post.id} href={`/posts/${post.id}`} passHref legacyBehavior>
                    <a
                    ref={(el) => {
                        postRefs.current[i] = el;
                    }}
                    className="block card hover:bg-gray-50 transition"
                    >
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-700 text-sm">{post.body}</p>
                    </a>
                </Link>
                ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
