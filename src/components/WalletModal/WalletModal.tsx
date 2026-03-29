import React from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useCurrentAccount, useConnectWallet, useWallets, useDisconnectWallet } from '@mysten/dapp-kit';
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  Power, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Globe,
  Smartphone,
  Fingerprint
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
        onClose();
      }
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
    }
  };

  const handlePhantomConnect = async () => {
    try {
      const phantomWallet = solanaWallets.find(w => w.adapter.name === 'Phantom');
      if (phantomWallet) {
        await phantomWallet.adapter.connect();
        onClose();
      } else {
        window.open('https://phantom.app/', '_blank');
      }
    } catch (error) {
      console.error('Failed to connect Phantom:', error);
    }
  };

  const handleSlushSuiConnect = async () => {
    try {
      if (!suiWallets || suiWallets.length === 0) {
        window.open('https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil', '_blank');
        return;
      }
      let wallet = suiWallets.find((w: any) => w.name === 'Slush' || w.name === 'Sui Wallet' || w.name === 'Sui');
      if (!wallet) wallet = suiWallets[0];
      connectSuiWallet({ wallet }, { onSuccess: () => onClose() });
    } catch (error) {
      console.error('Sui connection failed:', error);
    }
  };

  return (
    <div className="modal-overlay flex-center" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="card wallet-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header flex-between mb-24">
          <div className="flex-center gap-12">
            <div className="icon-box bg-primary-dim text-primary">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase letter-2 opacity-50 mb-2">Authentication_Gateway_v9.4_Secure</div>
              <h2 className="m-0 text-xl font-bold">Connect Node</h2>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon bg-surface">
            <X size={20} />
          </button>
        </div>

        <div className="wallet-options flex-column gap-16">
          {/* MetaMask / EVM */}
          <div 
            className={`wallet-choice card-dim p-16 flex-between clickable ${isEvmConnected ? 'active' : ''}`}
            onClick={isEvmConnected ? undefined : handleMetaMaskConnect}
          >
            <div className="flex-center gap-16">
              <div className="wallet-icon flex-center bg-white p-6 rounded-12">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" width="24" height="24" />
              </div>
              <div>
                <h3 className="m-0 text-sm font-bold">MetaMask (Arc)</h3>
                <span className="text-xs text-muted">Institutional Payroll Gateway</span>
              </div>
            </div>
            {isEvmConnected ? (
              <button onClick={(e) => { e.stopPropagation(); disconnectEvm(); }} className="btn-icon-sm text-error">
                <Power size={14} />
              </button>
            ) : (
              <ArrowRight size={16} className="text-muted" />
            )}
          </div>

          {/* Phantom / Solana */}
          <div 
            className={`wallet-choice card-dim p-16 flex-between clickable ${solanaPublicKey ? 'active' : ''}`}
            onClick={solanaPublicKey ? undefined : handlePhantomConnect}
          >
            <div className="flex-center gap-16">
              <div className="wallet-icon flex-center bg-surface p-6 rounded-12">
                <Zap size={20} className="text-secondary" />
              </div>
              <div>
                <h3 className="m-0 text-sm font-bold">Phantom (Solana)</h3>
                <span className="text-xs text-muted">Performance Neural Stack</span>
              </div>
            </div>
            {solanaPublicKey ? (
              <CheckCircle2 size={16} className="text-success" />
            ) : (
              <ArrowRight size={16} className="text-muted" />
            )}
          </div>

          {/* Slush / Sui */}
          <div 
            className={`wallet-choice card-dim p-16 flex-between clickable ${suiAccount ? 'active' : ''}`}
            onClick={suiAccount ? undefined : handleSlushSuiConnect}
          >
            <div className="flex-center gap-16">
              <div className="wallet-icon flex-center bg-primary-dim p-6 rounded-12">
                <Globe size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="m-0 text-sm font-bold">Sui Wallet (Operational)</h3>
                <span className="text-xs text-muted">Move Protocol Manifest v3.2</span>
              </div>
            </div>
            {suiAccount ? (
              <button onClick={(e) => { e.stopPropagation(); disconnectSuiWallet(); }} className="btn-icon-sm text-error">
                <Power size={14} />
              </button>
            ) : (
              <ArrowRight size={16} className="text-muted" />
            )}
          </div>
        </div>

        <div className="modal-footer mt-24 pt-24 border-subtle-t">
          <div className="footer-status flex-between opacity-50">
            <div className="flex-center gap-8 text-xs font-bold uppercase letter-1">
              <Activity size={14} /> Kernel Nominal
            </div>
            <div className="flex-center gap-12">
              <Fingerprint size={14} />
              <Smartphone size={14} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
