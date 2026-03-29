import React from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useCurrentAccount, useConnectWallet, useWallets, useDisconnectWallet } from '@mysten/dapp-kit';
import { 
  X, 
  Wallet, 
  Info, 
  Shield, 
  Activity, 
  Globe, 
  Zap, 
  Cpu, 
  Search, 
  CheckCircle2, 
  Navigation, 
  ArrowUpRight, 
  Power, 
  ExternalLink,
  ShieldCheck,
  Database,
  Fingerprint,
  Award,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      if (suiAccount?.address) {
        onClose();
        return;
      }
      
      if (!suiWallets || suiWallets.length === 0) {
        window.open('https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil', '_blank');
        return;
      }
      
      let wallet = suiWallets.find((w: any) => w.name === 'Slush' || w.name === 'Sui Wallet' || w.name === 'Sui');
      if (!wallet) wallet = suiWallets[0];
      
      connectSuiWallet(
        { wallet },
        {
          onSuccess: () => onClose(),
          onError: (err: any) => console.error('❌ Sui connection failed:', err)
        }
      );
      
    } catch (error: any) {
      console.error('❌ EXCEPTION in handleSlushSuiConnect:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(30px)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="ens-wallet-modal card card-glow" 
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '60px', width: '1300px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        <div className="ens-modal-header" style={{ padding: '6rem 8rem', borderBottom: '1px dashed var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3.5rem' }}>
            <div className="card" style={{ padding: '1.75rem', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '25px', border: '1px solid var(--border-light)' }}>
              <ShieldCheck size={48} strokeWidth={2.5} />
            </div>
            <div>
              <div className="hero-badge card" style={{ marginBottom: '1.5rem', fontSize: '0.8rem', letterSpacing: '0.3em', padding: '0.6rem 2rem' }}>
                <span className="pulse-dot"></span>
                AUTHENTICATION_GATEWAY_v9.4_SECURE
              </div>
              <h2 className="cyber-glitch-text" style={{ margin: 0, fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-0.04em' }}>CONNECT_NODE</h2>
            </div>
          </div>
          <motion.button 
            whileHover={{ rotate: 90, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}
            className="ens-close-btn card" 
            onClick={onClose} 
            style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'transparent', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', transition: 'all 0.3s' }}
          >
            <X size={40} strokeWidth={2.5} />
          </motion.button>
        </div>

        <div className="ens-modal-content" style={{ display: 'grid', gridTemplateColumns: '1fr 500px' }}>
          <div className="ens-wallet-list" style={{ padding: '8rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            {/* MetaMask / Arc */}
            <motion.div 
               whileHover={{ x: 15, borderColor: 'var(--sui-blue)', background: 'rgba(6, 182, 212, 0.05)' }}
               className="ens-wallet-item card card-glow"
               style={{ padding: '4rem 5rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '35px', display: 'flex', alignItems: 'center', gap: '4rem', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer' }}
            >
              <div className="ens-wallet-icon card" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
                  <path d="M32.958 3.958l-11.25 8.334 2.083-4.959 9.167-3.375z" fill="#E17726"/>
                  <path d="M7.042 3.958l11.166 8.417-1.958-5.042-9.208-3.375z" fill="#E27625"/>
                  <path d="M28.125 27.083l-3 4.584 6.417 1.791 1.833-6.291-5.25-.084z" fill="#E27625"/>
                  <path d="M31.583 16.375l-6.333-1.875 1.917 2.708-2.709 5.292 3.584-.042h5.333l-1.792-6.083z" fill="#CC6228"/>
                  <path d="M20.875 21.083l.417-7.25 1.875-5.125h-8.334l1.875 5.125.417 7.25.167 2.167.042 5h1.5l.041-5 .167-2.167z" fill="#F5841F"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <span className="ens-wallet-name" style={{ fontSize: '2rem', fontWeight: 950, letterSpacing: '0.05em' }}>METAMASK (ARC)</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '1rem', display: 'block', letterSpacing: '0.1em' }}>NATIVE_USDC_INSTITUTIONAL_PAYROLL_GATEWAY</span>
                {isEvmConnected && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '2rem' }}>
                    <div className="pulse" style={{ width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 15px var(--success)' }} />
                    <span style={{ fontSize: '1.1rem', color: 'var(--success)', fontWeight: 950, fontFamily: 'JetBrains Mono' }}>
                      {evmAddress?.slice(0, 12).toUpperCase()}...{evmAddress?.slice(-8).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {!isEvmConnected ? (
                <motion.button 
                  whileHover={{ scale: 1.05, filter: 'brightness(1.1)', boxShadow: '0 20px 40px rgba(6, 182, 212, 0.3)' }}
                  onClick={handleMetaMaskConnect}
                  className="btn btn-primary"
                  style={{ padding: '1.5rem 4rem', background: 'var(--sui-blue)', color: 'white', border: 'none', borderRadius: '15px', fontSize: '1rem', fontWeight: 950, cursor: 'pointer', letterSpacing: '0.15em' }}
                >
                  CONNECT
                </motion.button>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderColor: 'var(--error)' }}
                  onClick={() => disconnectEvm()}
                  className="card"
                  style={{ padding: '1.5rem 4rem', background: 'var(--bg-main)', color: 'var(--text-dim)', border: '1px solid var(--border-light)', borderRadius: '15px', fontSize: '1rem', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', letterSpacing: '0.15em' }}
                >
                  <Power size={20} /> <span>CLOSE</span>
                </motion.button>
              )}
            </motion.div>

            {/* Phantom / Solana */}
            <motion.div 
               whileHover={{ x: 15, borderColor: '#8b5cf6', background: 'rgba(139, 92, 246, 0.05)' }}
               className="ens-wallet-item card card-glow"
               style={{ padding: '4rem 5rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '35px', display: 'flex', alignItems: 'center', gap: '4rem', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer' }}
            >
              <div className="ens-wallet-icon card" style={{ background: '#1c1c1c', padding: '1.5rem', borderRadius: '20px', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 128 128" fill="none">
                  <path d="M105.025 3.53613C92.9121 -1.11191 78.4844 -0.888672 64 7.77832C49.5156 -0.888672 35.0879 -1.11191 22.9746 3.53613C8.32812 9.30566 0 22.6416 0 42.7041V85.6924C0 97.6934 9.73438 107.428 21.7354 107.428C33.7363 107.428 43.4707 97.6934 43.4707 85.6924V74.4248C43.4707 72.9092 44.7012 71.6787 46.2168 71.6787C47.7324 71.6787 48.9629 72.9092 48.9629 74.4248V85.6924C48.9629 97.6934 58.6973 107.428 70.6982 107.428C82.6992 107.428 92.4336 97.6934 92.4336 85.6924V42.7041C92.4336 38.5586 89.3135 35.1504 85.168 34.7793C84.7969 34.7793 84.4258 34.7793 84.0547 34.7793C75.1426 34.7793 67.9492 27.5859 67.9492 18.6738C67.9492 16.7871 66.3457 15.1836 64.459 15.1836C62.5723 15.1836 60.9688 16.7871 60.9688 18.6738C60.9688 27.5859 53.7754 34.7793 44.8633 34.7793C44.4922 34.7793 44.1211 34.7793 43.75 34.7793C39.6045 35.1504 36.4844 38.5586 36.4844 42.7041V85.6924C36.4844 94.0469 30.0898 100.812 21.7354 100.812C13.3809 100.812 6.98633 94.4258 6.98633 85.6924V42.7041C6.98633 23.0176 15.2686 12.1113 27.8301 7.40723C41.5723 2.33203 57.2656 9.17773 64 15.5547C70.7344 9.17773 86.4277 2.33203 100.17 7.40723C112.731 12.1113 121.014 23.0176 121.014 42.7041V85.6924C121.014 97.6934 111.279 107.428 99.2783 107.428C87.2773 107.428 77.543 97.6934 77.543 85.6924V74.4248C77.543 72.9092 78.7734 71.6787 80.2891 71.6787C81.8047 71.6787 83.0352 72.9092 83.0352 74.4248V85.6924C83.0352 94.0469 89.4297 100.812 97.7842 100.812C106.139 100.812 112.533 94.4258 112.533 85.6924V42.7041C128 22.6416 119.672 9.30566 105.025 3.53613Z" fill="url(#phantom_gradient_modal_cy)"/>
                  <defs>
                    <linearGradient id="phantom_gradient_modal_cy" x1="0" y1="0" x2="128" y2="128">
                      <stop stopColor="#8b5cf6"/>
                      <stop offset="1" stopColor="#551BF9"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <span className="ens-wallet-name" style={{ fontSize: '2rem', fontWeight: 950, letterSpacing: '0.05em' }}>PHANTOM (SOLANA)</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '1rem', display: 'block', letterSpacing: '0.1em' }}>SOLANA_PERFORMANCE_LAYER_NEURAL_STACK</span>
                {solanaPublicKey && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '2rem' }}>
                    <div className="pulse" style={{ width: '10px', height: '10px', background: '#8b5cf6', borderRadius: '50%', boxShadow: '0 0 15px #8b5cf6' }} />
                    <span style={{ fontSize: '1.1rem', color: '#8b5cf6', fontWeight: 950, fontFamily: 'JetBrains Mono' }}>
                      {solanaPublicKey.toString().slice(0, 12).toUpperCase()}...{solanaPublicKey.toString().slice(-8).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <motion.button 
                whileHover={!solanaPublicKey ? { scale: 1.05, filter: 'brightness(1.1)', boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)' } : {}}
                onClick={handlePhantomConnect}
                disabled={!!solanaPublicKey}
                className="btn"
                style={{ padding: '1.5rem 4rem', background: solanaPublicKey ? 'var(--bg-main)' : 'var(--sui-blue)', color: 'white', border: solanaPublicKey ? '1px solid var(--border-light)' : 'none', borderRadius: '15px', fontSize: '1rem', fontWeight: 950, cursor: solanaPublicKey ? 'default' : 'pointer', opacity: solanaPublicKey ? 0.6 : 1, letterSpacing: '0.15em' }}
              >
                {solanaPublicKey ? 'VERIFIED' : 'CONNECT'}
              </motion.button>
            </motion.div>

            {/* Slush / Sui */}
            <motion.div 
               whileHover={{ x: 15, borderColor: 'var(--success)', background: 'rgba(34, 197, 94, 0.05)' }}
               className="ens-wallet-item card card-glow"
               style={{ padding: '4rem 5rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '35px', display: 'flex', alignItems: 'center', gap: '4rem', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer' }}
            >
              <div className="ens-wallet-icon card" style={{ background: '#0a0a0a', padding: '1.5rem', borderRadius: '20px', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
                  <path d="M70 25C70 25 62 20 50 20C38 20 30 25 30 25C30 25 25 30 25 40C25 50 30 55 30 55L40 65C40 65 45 70 50 75C55 70 60 65 60 65L70 55C70 55 75 50 75 40C75 30 70 25 70 25Z" fill="url(#slush_gradient_modal_cy)"/>
                  <defs>
                    <linearGradient id="slush_gradient_modal_cy" x1="25" y1="20" x2="75" y2="75" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#4DA2FF"/>
                      <stop offset="50%" stopColor="#2B7FE8"/>
                      <stop offset="100%" stopColor="#1E5CCE"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <span className="ens-wallet-name" style={{ fontSize: '2rem', fontWeight: 950, letterSpacing: '0.05em' }}>SLUSH (SUI)</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 800, marginTop: '1rem', display: 'block', letterSpacing: '0.1em' }}>SUI_MOVE_OPERATIONAL_MANIFEST_v3.2</span>
                {suiAccount && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '2rem' }}>
                    <div className="pulse" style={{ width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 15px var(--success)' }} />
                    <span style={{ fontSize: '1.1rem', color: 'var(--success)', fontWeight: 950, fontFamily: 'JetBrains Mono' }}>
                      {suiAccount.address.slice(0, 12).toUpperCase()}...{suiAccount.address.slice(-8).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {!suiAccount ? (
                <motion.button 
                   whileHover={{ scale: 1.05, filter: 'brightness(1.1)', boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3)' }}
                   onClick={(e) => handleSlushSuiConnect(e)}
                   className="btn"
                   style={{ padding: '1.5rem 4rem', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '15px', fontSize: '1rem', fontWeight: 950, cursor: 'pointer', letterSpacing: '0.15em' }}
                >
                  CONNECT
                </motion.button>
              ) : (
                <motion.button 
                   whileHover={{ scale: 1.05, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderColor: 'var(--error)' }}
                   onClick={() => disconnectSuiWallet()}
                   className="card"
                   style={{ padding: '1.5rem 4rem', background: 'var(--bg-main)', color: 'var(--text-dim)', border: '1px solid var(--border-light)', borderRadius: '15px', fontSize: '1rem', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.5rem', letterSpacing: '0.15em' }}
                >
                  <Power size={20} /> <span>CLOSE</span>
                </motion.button>
              )}
            </motion.div>
          </div>

          <div className="ens-info-panel" style={{ padding: '8rem', background: 'rgba(255, 255, 255, 0.01)', borderLeft: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--sui-blue)', marginBottom: '5rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>MULTI_CHAIN_KERNEL_OPS</h3>
            
            <div className="card card-glow" style={{ padding: '4rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '30px', marginBottom: '6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
                <Zap size={24} color="var(--sui-blue)" strokeWidth={3} />
                <span style={{ fontSize: '1rem', fontWeight: 950, color: 'white', letterSpacing: '0.05em' }}>SELECT_PROTOCOL_MANIFOLD:</span>
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 600, lineHeight: 2, fontFamily: 'JetBrains Mono' }}>
                • <strong style={{ color: 'var(--sui-blue)' }}>ARC (METAMASK)</strong>: USDC_MGMT<br/>
                • <strong style={{ color: 'var(--success)' }}>SUI (SLUSH)</strong>: NEURAL_STACK<br/>
                • MULTIPLE_NODES_ACTIVE_NOMINAL.
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
              <div className="ens-info-item" style={{ display: 'flex', gap: '2.5rem' }}>
                <div className="ens-info-icon card" style={{ width: '64px', height: '64px', border: '1px solid var(--border-light)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--sui-blue)', flexShrink: 0 }}>
                  <Globe size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '1rem', letterSpacing: '0.05em' }}>NEURAL_IDENTITY</h4>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-dim)', fontWeight: 500, opacity: 0.8 }}>Atomic handshake authorization for cross-chain registry access and identity resolution.</p>
                </div>
              </div>

              <div className="ens-info-item" style={{ display: 'flex', gap: '2.5rem' }}>
                <div className="ens-info-icon card" style={{ width: '64px', height: '64px', border: '1px solid var(--border-light)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--success)', flexShrink: 0 }}>
                  <Database size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '1rem', letterSpacing: '0.05em' }}>DISTRIBUTED_ASSETS</h4>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-dim)', fontWeight: 500, opacity: 0.8 }}>Authorize real-time synchronization of decentralized assets across all operational manifolds.</p>
                </div>
              </div>

              <div className="ens-info-item" style={{ display: 'flex', gap: '2.5rem' }}>
                <div className="ens-info-icon card" style={{ width: '64px', height: '64px', border: '1px solid var(--border-light)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: '#8b5cf6', flexShrink: 0 }}>
                  <Fingerprint size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '1rem', letterSpacing: '0.05em' }}>CRYPTOGRAPHIC_SECURE</h4>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-dim)', fontWeight: 500, opacity: 0.8 }}>End-to-end encrypted session persistence with zero-knowledge credential verification.</p>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '5rem', borderTop: '1px dashed var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Activity size={24} />
                <span style={{ fontSize: '0.85rem', fontWeight: 950, letterSpacing: '0.3em' }}>KERNEL_STATUS: NOMINAL</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Smartphone size={18} />
                <Award size={18} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
