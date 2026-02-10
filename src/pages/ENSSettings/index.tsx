import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';

export const ENSSettings: React.FC = () => {
  const { address } = useAccount();
  const [ensName, setEnsName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');

  const handleSave = () => {
    if (!address) return;
    
    const settings = {
      ensName,
      avatar,
      twitter,
      github,
    };
    
    localStorage.setItem(`ens_settings_${address}`, JSON.stringify(settings));
    alert('ENS settings saved locally!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">ENS Settings</h1>

        {!address ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              Please connect your wallet to configure ENS settings
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ENS Name</label>
              <input
                type="text"
                value={ensName}
                onChange={(e) => setEnsName(e.target.value)}
                placeholder="yourname.eth"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Avatar URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Twitter</label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@username"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="username"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
