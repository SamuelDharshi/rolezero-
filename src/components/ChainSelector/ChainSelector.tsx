import React from 'react';
import { SUPPORTED_CHAINS, ChainType } from '@/config/arc';
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
      <label className="chain-selector-label">Deployment Chain</label>
      <div className="chain-options">
        {Object.entries(SUPPORTED_CHAINS).map(([key, chain]) => {
          const chainKey = key as ChainType;
          const isSelected = selectedChain === chainKey;
          const isDisabled = disabled || !chain.status.includes('Active');

          return (
            <button
              key={key}
              type="button"
              className={`chain-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && onChange(chainKey)}
              disabled={isDisabled}
            >
              <div className="chain-option-header">
                <span className="chain-icon">{chain.icon}</span>
                <span className="chain-name">{chain.name}</span>
                <span className={`chain-status status-${chain.status.toLowerCase().replace(' ', '-')}`}>
                  {chain.status}
                </span>
              </div>
              <div className="chain-features">
                {/* Features would be added to the config if needed */}
              </div>
              {isDisabled && chain.status.includes('Coming Soon') && (
                <div className="coming-soon-note">
                  🚧 Integration in progress
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="chain-selector-help">
        {selectedChain === 'sui' && '💎 Sui is currently active with full feature support'}
        {selectedChain === 'arc' && '🌐 Arc integration coming soon - will enable USDC-native payroll'}
        {selectedChain === 'solana' && '⟠ Solana wallet support for cross-chain operations'}
      </p>
    </div>
  );
};
