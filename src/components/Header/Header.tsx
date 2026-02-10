import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useAccount } from 'wagmi';
import { Wallet, Zap, User, BarChart3, Clock, CheckCircle, Settings } from 'lucide-react';
import { ProWalletModal } from '@/components/WalletModal/ProWalletModal';
import './Header.css';

export const Header: React.FC = () => {
  const suiAccount = useCurrentAccount();
  const { address: evmAddress } = useAccount();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const getDisplayAddress = () => {
    if (suiAccount?.address && evmAddress) {
      return 'Multi-Chain Connected';
    }
    if (suiAccount?.address) {
      return `Sui: ${suiAccount.address.slice(0, 6)}...${suiAccount.address.slice(-4)}`;
    }
    if (evmAddress) {
      return `Arc: ${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}`;
    }
    return 'Connect Wallet';
  };

  const isConnected = !!suiAccount?.address || !!evmAddress;
  const isMultiChain = !!suiAccount?.address && !!evmAddress;

  return (
    <>
      <header className="header">
        <div className="container header-container">
          <Link to="/" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">RoleZero</span>
            <span className="logo-badge">Pro</span>
          </Link>

          <nav className="nav">
            <button 
              onClick={() => navigate('/create')}
              className="nav-link nav-button"
            >
              <Zap size={16} />
              Create Role
            </button>
            <Link to="/ens" className="nav-link">
              <Settings size={16} />
              ENS
            </Link>
            <Link to="/roles" className="nav-link">
              <BarChart3 size={16} />
              My Roles
            </Link>
            <Link to="/scheduled" className="nav-link">
              <Clock size={16} />
              Scheduled
            </Link>
            <Link to="/completed" className="nav-link">
              <CheckCircle size={16} />
              Completed
            </Link>
            <Link to="/profile" className="nav-link">
              <User size={16} />
              Profile
            </Link>
          </nav>

          <div className="header-actions">
            {/* Single unified wallet button for ALL chains */}
            <button
              onClick={() => setModalOpen(true)}
              className={`wallet-btn ${isConnected ? 'connected' : ''} ${isMultiChain ? 'multi-chain' : ''}`}
            >
              <Wallet size={18} />
              <div className="wallet-info">
                <span className="wallet-text">{getDisplayAddress()}</span>
                {isMultiChain && (
                  <span className="wallet-badge">Multi-Chain ⚡</span>
                )}
                {isConnected && !isMultiChain && (
                  <span className="wallet-status">● Connected</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      <ProWalletModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
