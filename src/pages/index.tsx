import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
//page demonstrates client-side rendering with caching using Redis.
type User = {
  id: number;
  name: string;
  email: string;
};

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [fromCache, setFromCache] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const start = performance.now();
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        console.timeEnd('User fetch');
        // const end = performance.now();
        // console.log(`Data fetched in ${end - start}ms`);
        setUsers(data.users);
        setFromCache(data.fromCache);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-700">CacheBuddy</h1>
          <nav className="flex gap-6 text-sm font-medium">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/about" className="nav-link">About</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">👥 Cached Users (CSR)</h2>
          {fromCache !== null && (
            <p className={`status-tag ${fromCache ? 'status-cache' : 'status-api'}`}>
              Loaded from: {fromCache ? 'Redis Cache ✅' : 'API 🔄'}
            </p>
          )}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <div key={user.id} className="user-card fade-in">
                <div className="user-avatar overflow-hidden">
                  <Image
                    src={`https://i.pravatar.cc/150?img=${user.id}`}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <h2 className="text-lg font-semibold mb-1">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{user.email}</p>
                <Link
                  href={`/users/${user.id}`}
                  className="btn-view-profile"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t text-sm text-gray-500 text-center py-4">
        © {new Date().getFullYear()} CacheBuddy • Powered by Next.js + Redis
      </footer>
    </div>
  );
}
