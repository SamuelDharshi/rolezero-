import React from 'react';
import { SUPPORTED_CHAINS, ChainType } from '@/config/arc';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Globe, Shield, CheckCircle2, Navigation, Layers, Cpu, Database } from 'lucide-react';
import './ChainSelector.css';

interface ChainSelectorProps {
  selectedChain: ChainType;
  onChange: (chain: ChainType) => void;
  disabled?: boolean;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({
  selectedChain,
  onChange,
  disabled = false
}) => {
  return (
    <div className="chain-selector">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
        <div className="card" style={{ padding: '0.6rem', color: 'var(--sui-blue)', background: 'var(--bg-card)' }}>
          <Layers size={18} />
        </div>
        <label className="chain-selector-label" style={{ fontWeight: 950, letterSpacing: '0.15em' }}>DEPLOYMENT_KERNEL_MANIFOLD</label>
      </div>
      
      <div className="chain-options">
        {Object.entries(SUPPORTED_CHAINS).map(([key, chain]) => {
          const chainKey = key as ChainType;
          const isSelected = selectedChain === chainKey;
          const isDisabled = disabled || !chain.status.includes('Active');

          const getIcon = () => {
            if (chainKey === 'sui') return <Zap size={22} />;
            if (chainKey === 'arc') return <Activity size={22} />;
            if (chainKey === 'solana') return <Globe size={22} />;
            return <Shield size={22} />;
          };

          return (
            <motion.button
              key={key}
              type="button"
              whileHover={!isDisabled ? { scale: 1.02, y: -5 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={`chain-option card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && onChange(chainKey)}
              disabled={isDisabled}
              style={{ background: isSelected ? 'rgba(6, 182, 212, 0.05)' : 'var(--bg-card)', padding: '2.5rem', border: '1px solid var(--border-subtle)', borderRadius: '25px', position: 'relative', overflow: 'hidden' }}
            >
              <div className="chain-option-header">
                <div className={`chain-icon card ${isSelected ? 'pulse' : ''}`} style={{ width: '48px', height: '48px', borderRadius: '15px', background: isSelected ? 'var(--sui-blue)' : 'var(--bg-main)', color: isSelected ? 'white' : 'var(--text-dim)', border: `1px solid ${isSelected ? 'var(--sui-blue)' : 'var(--border-light)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getIcon()}
                </div>
                <div>
                  <span className="chain-name" style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>{chain.name}</span>
                  <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: chain.status.includes('Active') ? 'var(--success)' : '#f59e0b' }} />
                    <span className={`chain-status status-${chain.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.65rem', fontWeight: 950, color: chain.status.includes('Active') ? 'var(--success)' : '#f59e0b' }}>
                      {chain.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="chain-features" style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, lineHeight: 1.6 }}>
                 {chainKey === 'sui' && '💎 SUI: HIGH-SPEED SETTLEMENT L1'}
                 {chainKey === 'arc' && '🌐 ARC: INSTITUTIONAL USDC NATIVE'}
                 {chainKey === 'solana' && '⟠ SOL: CROSS-CHAIN LIQUIDITY MESH'}
              </div>

              {isDisabled && chain.status.includes('Coming Soon') && (
                <div className="coming-soon-note card" style={{ padding: '0.6rem 1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 950, color: '#f59e0b', marginTop: '2.5rem', display: 'inline-block' }}>
                  CORE_INTEGRATION_PENDING
                </div>
              )}
              
              {isSelected && (
                <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', color: 'var(--sui-blue)' }}>
                  <CheckCircle2 size={18} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      <p className="chain-selector-help" style={{ borderTop: '1px dashed var(--border-light)', paddingTop: '2rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontStyle: 'italic', opacity: 0.7, fontWeight: 500 }}>
        {selectedChain === 'sui' && <><Zap size={14} color="var(--sui-blue)" /> SYSTEM_MSG: Sui manifold operational. Optimized for high-frequency neural distribution.</>}
        {selectedChain === 'arc' && <><Activity size={14} color="#f59e0b" /> SYSTEM_MSG: Arc connectivity experimental. Enabling institutional liquidity bridges.</>}
        {selectedChain === 'solana' && <><Globe size={14} color="#8b5cf6" /> SYSTEM_MSG: Solana mesh standby. Cross-chain synchronization ready.</>}
      </p>
    </div>
  );
};
