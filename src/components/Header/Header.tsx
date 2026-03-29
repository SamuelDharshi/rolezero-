import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useAccount } from 'wagmi';
import { 
  Wallet, 
  Zap, 
  User, 
  LayoutDashboard, 
  PlusCircle, 
  Globe,
  Settings,
  ChevronDown,
  History,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProWalletModal } from '@/components/WalletModal/ProWalletModal';
import './Header.css';

export const Header: React.FC = () => {
  const suiAccount = useCurrentAccount();
  const { address: evmAddress } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDisplayAddress = () => {
    if (suiAccount?.address && evmAddress) {
      return 'Multi-Stack';
    }
    if (suiAccount?.address) {
      return `${suiAccount.address.slice(0, 6)}...${suiAccount.address.slice(-4)}`;
    }
    if (evmAddress) {
      return `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}`;
    }
    return 'Connect Wallet';
  };

  const isConnected = !!suiAccount?.address || !!evmAddress;

  const navItems = [
    { label: 'Protocols', path: '/roles', icon: LayoutDashboard },
    { label: 'Create', path: '/create', icon: PlusCircle },
    { label: 'History', path: '/completed', icon: History },
    { label: 'Identity', path: '/ens', icon: Globe },
    { label: 'Settings', path: '/scheduled', icon: Settings },
  ];

  return (
    <>
      <header className={`header-main ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          <Link to="/" className="logo-group">
            <div className="logo-icon flex-center">
              <Zap size={24} strokeWidth={2.5} />
            </div>
            <div className="logo-text">
              <span className="brand-name">Rolezero</span>
              <span className="brand-tag">v9.4.0</span>
            </div>
          </Link>

          <nav className="nav-group">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="header-active-tab"
                    className="nav-active-indicator"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="actions-group">
            <button 
              onClick={() => setModalOpen(true)}
              className={`wallet-btn ${isConnected ? 'connected' : ''}`}
            >
              <div className="wallet-icon-wrapper flex-center">
                {isConnected ? <ShieldCheck size={20} /> : <Wallet size={20} />}
              </div>
              <div className="wallet-info">
                <span className="addr-text mono">{getDisplayAddress()}</span>
                <span className="status-text flex-center">
                  <span className={`status-dot ${isConnected ? 'status-active' : 'status-idle'}`} />
                  {isConnected ? 'Active' : 'Offline'}
                </span>
              </div>
              <ChevronDown size={16} className="chevron" />
            </button>
            
            <button 
              onClick={() => navigate('/profile')}
              className="user-profile-btn flex-center"
            >
              <User size={20} />
              <div className="activity-badge">
                <Activity size={10} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <ProWalletModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

