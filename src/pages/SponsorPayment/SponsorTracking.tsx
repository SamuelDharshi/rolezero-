import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

interface SponsorData {
  address: string;
  totalSponsored: number;
  rolesSponsored: number;
  lastSponsorTime: number;
}

export const SponsorTracking: React.FC = () => {
  const { data: sponsors = [], isLoading } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async (): Promise<SponsorData[]> => {
      try {
        const stored = localStorage.getItem('sponsors');
        if (!stored) return [];
        return JSON.parse(stored);
      } catch {
        return [];
      }
    },
    refetchInterval: 30000,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Sponsor Tracking</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading sponsors...</p>
          </div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">No sponsors found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sponsors.map((sponsor, idx) => (
              <motion.div
                key={sponsor.address}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sponsor</span>
                    <p className="font-mono text-sm">{sponsor.address.slice(0, 10)}...</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Sponsored</span>
                    <p className="font-semibold">{sponsor.totalSponsored}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Roles Sponsored</span>
                    <p className="font-semibold">{sponsor.rolesSponsored}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Active</span>
                    <p className="text-sm">
                      {new Date(sponsor.lastSponsorTime * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
