/**
 * Arc Chain Configuration
 * 
 * Arc is Circle's purpose-built EVM-compatible L1 blockchain with native USDC support,
 * perfect for cross-chain payroll and treasury operations.
 */

// Import Arc testnet from main wagmi config
import { arcTestnet } from './wagmi';

// Contract Addresses on Arc Testnet (Updated with verified contracts)
export const ARC_USDC_ADDRESS = '0x036CbD53842c5426634e7929541ec2318f3dCF7e' as const;
export const ARC_PAYMENT_ROLE_ADDRESS = '0xA53Bce7c4a9d7F2fc582A55A819644c6871FBC81' as const;

// Developer configuration for fee collection
export const ARC_DEVELOPER_ADDRESS = '0x7cd3b3519b8f7e5033cc3b4ce7ce846c9cd507ed47991cf44bf097895a7de547' as const;
export const ARC_DEVELOPER_FEE_PERCENT = 0.01; // 1% fee for sustainability
export const ARC_MIN_PAYMENT_AMOUNT = 0.01; // Minimum 0.01 USDC

// Arc network configuration for better connectivity
export const ARC_RPC_ENDPOINTS = [
  'https://rpc.testnet.arc.network',
  'https://rpc-arc-testnet-7xd4wz1i3k.t.conduit.xyz',
  'https://arc-testnet.rpc.caldera.xyz/http'
] as const;

export const SUPPORTED_CHAINS = {
  sui: {
    name: 'Sui',
    icon: '🔷',
    description: 'High-performance blockchain for smart contracts with Move language',
    color: '#4da6ff',
    status: '✅ Active'
  },
  arc: {
    name: 'Arc',
    icon: '⭕',
    description: 'Circle\'s L1 blockchain with native USDC for institutional payments',
    color: '#00d4ff',
    status: '🟡 Available'
  },
  solana: {
    name: 'Solana',
    icon: '🔮',
    description: 'Fast blockchain for wallet connections and cross-chain bridging',
    color: '#14f195',
    status: '🔗 Wallets'
  }
} as const;

// Export the chain config for component use
export { arcTestnet };

export type ChainType = keyof typeof SUPPORTED_CHAINS;
