import { mainnet, sepolia } from 'wagmi/chains';
import { http, createConfig, fallback } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Arc Testnet Chain Configuration
export const arcTestnet = {
  id: 93094681,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { 
      http: [
        'https://rpc.testnet.arc.network',
        'https://rpc-arc-testnet-7xd4wz1i3k.t.conduit.xyz',
        'https://arc-testnet.rpc.caldera.xyz/http'
      ] 
    },
    public: { 
      http: [
        'https://rpc.testnet.arc.network',
        'https://rpc-arc-testnet-7xd4wz1i3k.t.conduit.xyz'
      ] 
    },
  },
  blockExplorers: {
    default: { name: 'Arc Explorer', url: 'https://testnet.arcscan.io' },
  },
  testnet: true,
} as const;

// Wagmi Configuration - Simplified for hackathon (no WalletConnect Cloud required)
export const wagmiConfig = createConfig({
  chains: [arcTestnet, mainnet, sepolia],
  connectors: [
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [arcTestnet.id]: fallback([
      http('https://rpc.testnet.arc.network'),
      http('https://rpc-arc-testnet-7xd4wz1i3k.t.conduit.xyz'),
      http('https://arc-testnet.rpc.caldera.xyz/http')
    ]),
    // Use Cloudflare's free public RPC for ENS resolution (CORS-enabled)
    [mainnet.id]: http('https://cloudflare-eth.com'),
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
  },
  ssr: false, // Disable auto-reconnect on page load
});
