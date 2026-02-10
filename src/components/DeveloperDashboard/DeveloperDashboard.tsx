import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useCurrentAccount } from '@mysten/dapp-kit';

export const DeveloperDashboard: React.FC = () => {
  const { address: evmAddress } = useAccount();
  const suiAccount = useCurrentAccount();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mt-6"
    >
      <h2 className="text-2xl font-bold mb-4">Developer Dashboard</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Connected Wallets</h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-4 space-y-2">
            <div>
              <span className="font-medium">EVM Address:</span>
              <span className="ml-2 font-mono text-sm">
                {evmAddress || 'Not connected'}
              </span>
            </div>
            <div>
              <span className="font-medium">Sui Address:</span>
              <span className="ml-2 font-mono text-sm">
                {suiAccount?.address || 'Not connected'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Environment</h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-4">
            <p className="text-sm">
              <span className="font-medium">Mode:</span> Development
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Clear LocalStorage
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
