import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { getFullnodeUrl } from '@mysten/sui/client';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { wagmiConfig } from '@/config/wagmi';
import { getSolanaEndpoint, useSolanaWallets } from '@/config/solana';
import { Header } from '@/components/Header/Header';
import { Home } from '@/pages/Home/Home';
import { CreateRole } from '@/pages/CreateRole/CreateRole';
import { RoleDashboard } from '@/pages/RoleDashboard/RoleDashboard';
import { RoleDashboardLive } from '@/pages/RoleDashboard/RoleDashboardLive';
import { RolesList } from '@/pages/RolesList/RolesList';
import { SponsorPayment } from '@/pages/SponsorPayment/SponsorPayment';
import { SponsorTracking } from '@/pages/SponsorPayment/SponsorTracking';
import { UserProfile } from '@/pages/UserProfile/UserProfile';
import { ENSSettings } from '@/pages/ENSSettings';
import { ENSShowcase } from '@/pages/ENSShowcase';
import { ScheduledPayments } from '@/pages/ScheduledPayments';
import { CompletedPayments } from '@/pages/CompletedPayments';
import { DiagnosticTool } from '@/pages/DiagnosticTool';
import { ToastContainer } from '@/components/Toast/Toast';
import { AutoExecutorStatus } from '@/components/AutoExecutorStatus';
import '@mysten/dapp-kit/dist/index.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import '@/styles/global.css';

const queryClient = new QueryClient();

// Network config for Sui
const { networkConfig: suiNetworkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

function App() {
  const solanaEndpoint = getSolanaEndpoint();
  const wallets = useSolanaWallets();

  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ConnectionProvider endpoint={solanaEndpoint}>
            <SolanaWalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                <SuiClientProvider networks={suiNetworkConfig} defaultNetwork="testnet">
                  <WalletProvider autoConnect={false}>
                    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                      <div className="app">
                        <Header />
                        <main>
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/create" element={<CreateRole />} />
                            <Route path="/roles" element={<RolesList />} />
                            <Route path="/scheduled" element={<ScheduledPayments />} />
                            <Route path="/completed" element={<CompletedPayments />} />
                            <Route path="/diagnostics" element={<DiagnosticTool />} />
                            <Route path="/ens-settings" element={<ENSSettings />} />
                            <Route path="/ens" element={<ENSShowcase />} />
                            <Route path="/role/:roleId" element={<RoleDashboard />} />
                            <Route path="/role/:roleId/live" element={<RoleDashboardLive />} />
                            <Route path="/sponsor/:roleId" element={<SponsorPayment />} />
                            <Route path="/sponsor/:roleId/track" element={<SponsorTracking />} />
                            <Route path="/profile" element={<UserProfile />} />
                          </Routes>
                        </main>
                        <ToastContainer />
                      </div>
                    </BrowserRouter>
                  </WalletProvider>
                </SuiClientProvider>
              </WalletModalProvider>
            </SolanaWalletProvider>
          </ConnectionProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
);
}

export default App;
