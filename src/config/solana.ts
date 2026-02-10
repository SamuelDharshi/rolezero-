import { useMemo } from 'react';
// Solana wallet adapter configuration (currently unused but ready for integration)
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Solana network configuration
export const SOLANA_NETWORK = WalletAdapterNetwork.Devnet; // Change to Mainnet for production

// Get RPC endpoint
export const getSolanaEndpoint = () => {
  // You can replace this with your own RPC endpoint (e.g., from Alchemy, QuickNode, etc.)
  return clusterApiUrl(SOLANA_NETWORK);
};

// Hook to get configured wallets
export const useSolanaWallets = () => {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // Add more Solana wallets here if needed:
      // new SolflareWalletAdapter(),
      // new SolletWalletAdapter(),
    ],
    []
  );

  return wallets;
};
