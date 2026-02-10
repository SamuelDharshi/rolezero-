import React from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useCurrentAccount, useConnectWallet, useWallets, useDisconnectWallet } from '@mysten/dapp-kit';
import { X, Wallet, Info } from 'lucide-react';
import './WalletModal.css';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connect, connectors } = useConnect();
  const { isConnected: isEvmConnected, address: evmAddress } = useAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const { publicKey: solanaPublicKey, wallets: solanaWallets } = useSolanaWallet();
  const suiAccount = useCurrentAccount();
  const { mutate: connectSuiWallet } = useConnectWallet();
  const { mutate: disconnectSuiWallet } = useDisconnectWallet();
  const suiWallets = useWallets();

  if (!isOpen) return null;

  const handleMetaMaskConnect = async () => {
    try {
      const win = window as any;
      if (!win.ethereum) {
        window.open('https://metamask.io/download/', '_blank');
        return;
      }
      
      const connector = connectors.find((c: any) => c.id === 'injected' || c.id === 'metaMask');
      if (connector) {
        await connect({ connector });
        console.log('✅ MetaMask connected for Arc');
      }
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
    }
  };

  const handlePhantomConnect = async () => {
    try {
      const win = window as any;
      const phantomProvider = win.phantom?.solana;
      
      if (!phantomProvider) {
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const phantomWallet = solanaWallets.find(w => w.adapter.name === 'Phantom');
      if (phantomWallet) {
        await phantomWallet.adapter.connect();
        console.log('✅ Phantom connected for Solana');
      }
    } catch (error) {
      console.error('Failed to connect Phantom:', error);
    }
  };

  const handleSlushSuiConnect = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      console.log('=== SLUSH-SUI WALLET CONNECTION START ===');
      console.log('Current suiAccount:', suiAccount);
      console.log('Available suiWallets:', suiWallets);
      
      if (suiAccount?.address) {
        console.log('Already connected to Sui wallet');
        onClose();
        return;
      }
      
      if (!suiWallets || suiWallets.length === 0) {
        console.error('No Sui wallets detected');
        const goToDownload = confirm('No Sui wallet extension found.\n\nWould you like to install the Sui Wallet extension?');
        if (goToDownload) {
          window.open('https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil', '_blank');
        }
        return;
      }
      
      // Find Slush or Sui Wallet specifically (exclude Phantom)
      let wallet = suiWallets.find((w: any) => w.name === 'Slush' || w.name === 'Sui Wallet' || w.name === 'Sui');
      
      // If not found, try to find any non-Phantom wallet
      if (!wallet) {
        wallet = suiWallets.find((w: any) => w.name !== 'Phantom' && !w.name.includes('Phantom'));
      }
      
      // If still not found, use the first one
      if (!wallet) {
        wallet = suiWallets[0];
      }
      
      console.log('Attempting connection to:', wallet.name);
      
      connectSuiWallet(
        { wallet },
        {
          onSuccess: () => {
            console.log('✅ SUCCESS: Sui wallet connected');
            onClose();
          },
          onError: (err: any) => {
            console.error('❌ ERROR: Sui connection failed:', err);
          }
        }
      );
      
    } catch (error: any) {
      console.error('❌ EXCEPTION in handleSlushSuiConnect:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ens-wallet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ens-modal-header">
          <h2>Connect a Wallet</h2>
          <button className="ens-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="ens-modal-content">
          {/* Left Side - Wallet List */}
          <div className="ens-wallet-list">
            {/* METAMASK FOR ARC BLOCKCHAIN */}
            <div className="ens-wallet-item" style={{position: 'relative'}}>
              <div className="ens-wallet-icon">
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                  <path d="M32.958 3.958l-11.25 8.334 2.083-4.959 9.167-3.375z" fill="#E17726"/>
                  <path d="M7.042 3.958l11.166 8.417-1.958-5.042-9.208-3.375z" fill="#E27625"/>
                  <path d="M28.125 27.083l-3 4.584 6.417 1.791 1.833-6.291-5.25-.084z" fill="#E27625"/>
                  <path d="M31.583 16.375l-6.333-1.875 1.917 2.708-2.709 5.292 3.584-.042h5.333l-1.792-6.083z" fill="#CC6228"/>
                  <path d="M20.875 21.083l.417-7.25 1.875-5.125h-8.334l1.875 5.125.417 7.25.167 2.167.042 5h1.5l.041-5 .167-2.167z" fill="#F5841F"/>
                </svg>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <span className="ens-wallet-name">MetaMask (Arc)</span>
                <span style={{fontSize: '12px', color: '#888', marginTop: '2px'}}>Native USDC Support</span>
                {isEvmConnected && (
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px'}}>
                    <span style={{color: 'green', fontSize: '10px'}}>●</span>
                    <span style={{fontSize: '11px', color: 'green', fontWeight: 'bold'}}>
                      {evmAddress?.slice(0, 6)}...{evmAddress?.slice(-4)}
                    </span>
                  </div>
                )}
              </div>
              {!isEvmConnected ? (
                <button 
                  onClick={handleMetaMaskConnect}
                  style={{
                    marginLeft: 'auto',
                    background: 'linear-gradient(to right, #007bff, #0056b3)',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Connect
                </button>
              ) : (
                <button 
                  onClick={() => { disconnectEvm(); console.log('🔌 MetaMask disconnected'); }}
                  style={{
                    marginLeft: 'auto',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Disconnect
                </button>
              )}
            </div>

            {/* PHANTOM FOR SOLANA */}
            <div className="ens-wallet-item" style={{position: 'relative'}}>
              <div className="ens-wallet-icon">
                <svg width="28" height="28" viewBox="0 0 128 128" fill="none">
                  <path d="M105.025 3.53613C92.9121 -1.11191 78.4844 -0.888672 64 7.77832C49.5156 -0.888672 35.0879 -1.11191 22.9746 3.53613C8.32812 9.30566 0 22.6416 0 42.7041V85.6924C0 97.6934 9.73438 107.428 21.7354 107.428C33.7363 107.428 43.4707 97.6934 43.4707 85.6924V74.4248C43.4707 72.9092 44.7012 71.6787 46.2168 71.6787C47.7324 71.6787 48.9629 72.9092 48.9629 74.4248V85.6924C48.9629 97.6934 58.6973 107.428 70.6982 107.428C82.6992 107.428 92.4336 97.6934 92.4336 85.6924V42.7041C92.4336 38.5586 89.3135 35.1504 85.168 34.7793C84.7969 34.7793 84.4258 34.7793 84.0547 34.7793C75.1426 34.7793 67.9492 27.5859 67.9492 18.6738C67.9492 16.7871 66.3457 15.1836 64.459 15.1836C62.5723 15.1836 60.9688 16.7871 60.9688 18.6738C60.9688 27.5859 53.7754 34.7793 44.8633 34.7793C44.4922 34.7793 44.1211 34.7793 43.75 34.7793C39.6045 35.1504 36.4844 38.5586 36.4844 42.7041V85.6924C36.4844 94.0469 30.0898 100.812 21.7354 100.812C13.3809 100.812 6.98633 94.4258 6.98633 85.6924V42.7041C6.98633 23.0176 15.2686 12.1113 27.8301 7.40723C41.5723 2.33203 57.2656 9.17773 64 15.5547C70.7344 9.17773 86.4277 2.33203 100.17 7.40723C112.731 12.1113 121.014 23.0176 121.014 42.7041V85.6924C121.014 97.6934 111.279 107.428 99.2783 107.428C87.2773 107.428 77.543 97.6934 77.543 85.6924V74.4248C77.543 72.9092 78.7734 71.6787 80.2891 71.6787C81.8047 71.6787 83.0352 72.9092 83.0352 74.4248V85.6924C83.0352 94.0469 89.4297 100.812 97.7842 100.812C106.139 100.812 112.533 94.4258 112.533 85.6924V42.7041C128 22.6416 119.672 9.30566 105.025 3.53613Z" fill="url(#phantom_gradient)"/>
                  <defs>
                    <linearGradient id="phantom_gradient" x1="0" y1="0" x2="128" y2="128">
                      <stop stopColor="#534BB1"/>
                      <stop offset="1" stopColor="#551BF9"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <span className="ens-wallet-name">Phantom (Solana)</span>
                <span style={{fontSize: '12px', color: '#888', marginTop: '2px'}}>Solana Ecosystem</span>
                {solanaPublicKey && (
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px'}}>
                    <span style={{color: 'green', fontSize: '10px'}}>●</span>
                    <span style={{fontSize: '11px', color: 'green', fontWeight: 'bold'}}>
                      {solanaPublicKey.toString().slice(0, 6)}...{solanaPublicKey.toString().slice(-4)}
                    </span>
                  </div>
                )}
              </div>
              <button 
                onClick={handlePhantomConnect}
                disabled={!!solanaPublicKey}
                style={{
                  marginLeft: 'auto',
                  background: solanaPublicKey ? '#6c757d' : 'linear-gradient(to right, #534BB1, #551BF9)',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  cursor: solanaPublicKey ? 'not-allowed' : 'pointer',
                  opacity: solanaPublicKey ? 0.6 : 1
                }}
              >
                {solanaPublicKey ? 'Connected' : 'Connect'}
              </button>
            </div>

            {/* SUI WALLET */}
            <div className="ens-wallet-item" style={{position: 'relative'}}>
              <div className="ens-wallet-icon">
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" rx="20" fill="#000000"/>
                  <path d="M70 25C70 25 62 20 50 20C38 20 30 25 30 25C30 25 25 30 25 40C25 50 30 55 30 55L40 65C40 65 45 70 50 75C55 70 60 65 60 65L70 55C70 55 75 50 75 40C75 30 70 25 70 25Z" fill="url(#slush_gradient)"/>
                  <path d="M45 35L55 35C60 35 65 40 65 45L65 50C65 55 60 60 55 60L45 60C40 60 35 55 35 50L35 45C35 40 40 35 45 35Z" fill="#000000" opacity="0.3"/>
                  <defs>
                    <linearGradient id="slush_gradient" x1="25" y1="20" x2="75" y2="75" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#4DA2FF"/>
                      <stop offset="50%" stopColor="#2B7FE8"/>
                      <stop offset="100%" stopColor="#1E5CCE"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <span className="ens-wallet-name">Slush-SUI Wallet</span>
                <span style={{fontSize: '12px', color: '#888', marginTop: '2px'}}>Sui Blockchain</span>
                {suiAccount && (
                  <div style={{display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px'}}>
                    <span style={{color: 'green', fontSize: '10px'}}>●</span>
                    <span style={{fontSize: '11px', color: 'green', fontWeight: 'bold'}}>
                      {suiAccount.address.slice(0, 6)}...{suiAccount.address.slice(-4)}
                    </span>
                  </div>
                )}
              </div>
              {!suiAccount ? (
                <button 
                  onClick={(e) => handleSlushSuiConnect(e)}
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{
                    marginLeft: 'auto',
                    background: 'linear-gradient(to right, #4DA2FF, #1E5CCE)',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Connect
                </button>
              ) : (
                <button 
                  onClick={() => { disconnectSuiWallet(); console.log('🔌 Sui wallet disconnected'); }}
                  style={{
                    marginLeft: 'auto',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Disconnect
                </button>
              )}
            </div>
            
          </div>

          {/* Right Side - Info Panel */}
          <div className="ens-info-panel">
            <h3>Multi-Chain Payroll System</h3>
            
            <div className="ens-info-item" style={{marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px'}}>
              <div style={{fontSize: '13px', fontWeight: 'bold', color: '#333', marginBottom: '6px'}}>
                🚀 Choose Your Blockchain:
              </div>
              <div style={{fontSize: '11px', color: '#666', lineHeight: '1.4'}}>
                • Arc (MetaMask): USDC-native, institutional payroll<br/>
                • Sui (Slush): SUI tokens, DeFi-optimized<br/>
                • Both wallets can coexist safely!
              </div>
            </div>
            
            <div className="ens-info-item">
              <div className="ens-info-icon">
                <Wallet size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h4>Easy Login</h4>
                <p>No need to create new accounts and passwords for every website. Just connect your wallet and get going.</p>
              </div>
            </div>

            <div className="ens-info-item">
              <div className="ens-info-icon">
                <Info size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h4>Store your Digital Assets</h4>
                <p>Send, receive, store, and display digital assets like NFTs & coins.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
