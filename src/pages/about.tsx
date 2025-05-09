export default function About() {
    return (
      <main className="min-h-screen bg-white text-gray-900 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-700 mb-4">About This Project</h1>
  
          <p className="text-gray-700 leading-relaxed mb-6">
            This application was built as part of a frontend internship challenge to showcase modern web development skills using <strong>Next.js</strong>, <strong>Redis</strong>, and performance optimization techniques.
          </p>
  
          <p className="text-gray-700 leading-relaxed mb-6">
            It demonstrates a mix of <strong>server-side rendering (SSR)</strong> and <strong>client-side rendering (CSR)</strong>, along with dynamic routing and API integration. Redis is used to cache frequently accessed data such as users, posts, and comments, reducing redundant API calls and improving load performance.
          </p>
  
          <p className="text-gray-700 leading-relaxed mb-6">
            The app includes a <strong>metrics dashboard</strong> to track cache hit/miss ratios and uses <strong>TTL-based caching strategies</strong> to gracefully handle frequently changing datasets.
          </p>
  
          <p className="text-gray-700 leading-relaxed">
            Built with performance, scalability, and maintainability in mind — this project serves as a real-world demonstration of full-stack frontend capability with smart caching.
          </p>
        </div>
      </main>
    );
  }
  