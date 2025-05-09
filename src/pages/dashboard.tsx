import { GetServerSideProps } from 'next';
import { getMetricStats } from '@/lib/metrics';

type Metric = {
  route: string;
  hits: number;
  misses: number;
  total: number;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const keys = ['users', 'posts', 'comments'];

  const metrics = await Promise.all(
    keys.map(async (key) => {
      const stats = await getMetricStats(key);
      return {
        route: key,
        ...stats,
      };
    })
  );

  return { props: { metrics } };
};

export default function MetricsSummary({ metrics }: { metrics: Metric[] }) {
  const sorted = [...metrics].sort((a, b) => b.total - a.total);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">📊 Metrics Summary</h1>
        <p className="text-sm text-gray-500 mb-6">
          This summary shows how Redis caching is performing across different routes.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white shadow-sm rounded-md">
            <thead className="bg-gray-100 text-left text-sm font-medium text-gray-600">
              <tr>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Hits</th>
                <th className="px-4 py-3">Misses</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Hit Rate</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m) => {
                const rate = m.total ? (m.hits / m.total) * 100 : 0;
                return (
                  <tr key={m.route} className="border-t border-gray-100 text-sm text-gray-800">
                    <td className="px-4 py-2 font-medium">{m.route}</td>
                    <td className="px-4 py-2">{m.hits}</td>
                    <td className="px-4 py-2">{m.misses}</td>
                    <td className="px-4 py-2">{m.total}</td>
                    <td className={`px-4 py-2 font-semibold ${rate >= 80 ? 'text-green-600' : rate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {rate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
