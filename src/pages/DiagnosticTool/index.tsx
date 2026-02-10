import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useCurrentAccount } from '@mysten/dapp-kit';

export const DiagnosticTool: React.FC = () => {
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  const suiAccount = useCurrentAccount();
  const [testResults, setTestResults] = useState<string[]>([]);

  const runDiagnostics = () => {
    const results: string[] = [];
    
    results.push(`✓ EVM Wallet: ${evmConnected ? 'Connected' : 'Not Connected'}`);
    results.push(`✓ EVM Address: ${evmAddress || 'N/A'}`);
    results.push(`✓ Sui Wallet: ${suiAccount ? 'Connected' : 'Not Connected'}`);
    results.push(`✓ Sui Address: ${suiAccount?.address || 'N/A'}`);
    
    // Check localStorage
    const arcRoles = localStorage.getItem('arcRoles');
    const completedPayments = localStorage.getItem('completedPayments');
    results.push(`✓ Arc Roles Stored: ${arcRoles ? 'Yes' : 'No'}`);
    results.push(`✓ Completed Payments: ${completedPayments ? 'Yes' : 'No'}`);
    
    setTestResults(results);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Diagnostic Tool</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
          <button
            onClick={runDiagnostics}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Run Diagnostics
          </button>
        </div>

        {testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm"
          >
            {testResults.map((result, idx) => (
              <div key={idx} className="mb-2">
                {result}
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
