import React from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useEnsName, useEnsAvatar } from 'wagmi';
import { useEnsDeFiProfile } from '@/hooks/useEnsDeFiProfile';
import { 
  User, 
  Wallet, 
  Globe, 
  Shield, 
  Zap, 
  Award,
  Twitter,
  Mail,
  Briefcase,
  DollarSign,
  Calendar,
  Settings,
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import './ENSShowcase.css';

export const ENSShowcase: React.FC = () => {
  const { address } = useAccount();
  const { data: ensNameRaw } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1,
  });

  // Normalize ENS name to `string | undefined` (wagmi may return `null`)
  const ensName: string | undefined = typeof ensNameRaw === 'string' ? ensNameRaw : undefined;

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    chainId: 1,
  });

  const { profile, hasProfile } = useEnsDeFiProfile(ensName);

  return (
    <div className="ens-page">
      {/* Gradient Background */}
      <div className="ens-bg"></div>

      <div className="ens-container">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="ens-hero"
        >
          <div className="ens-hero-icon">
            <Globe size={56} strokeWidth={2.5} />
          </div>
          <h1 className="ens-hero-title">ENS Integration</h1>
          <p className="ens-hero-subtitle">
            Decentralized identity meets DeFi payment preferences
          </p>
        </motion.div>

        {!address ? (
          /* Not Connected State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ens-connect-card"
          >
            <div className="ens-connect-icon">
              <Wallet size={72} strokeWidth={1.5} />
            </div>
            <h2>Connect Your Wallet</h2>
            <p>Connect an EVM wallet to view your ENS profile and payment preferences</p>
          </motion.div>
        ) : (
          <>
            {/* Main Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="ens-profile-section"
            >
              {/* Avatar & Name */}
              <div className="ens-profile-main">
                <div className="ens-avatar-wrapper">
                  {ensAvatar ? (
                    <img src={ensAvatar} alt="ENS Avatar" className="ens-avatar" />
                  ) : (
                    <div className="ens-avatar-placeholder">
                      <User size={56} strokeWidth={1.5} />
                    </div>
                  )}
                  {ensName && (
                    <div className="ens-verified-badge">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>

                <div className="ens-profile-details">
                  <h2 className="ens-display-name">
                    {ensName || 'No ENS Name'}
                  </h2>
                  <p className="ens-address">
                    {address.slice(0, 10)}...{address.slice(-8)}
                  </p>
                  {ensName && (
                    <a
                      href={`https://app.ens.domains/${ensName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ens-external-link"
                    >
                      <ExternalLink size={14} />
                      <span>View on ENS.domains</span>
                    </a>
                  )}
                </div>
              </div>

              {/* DeFi Profile Badge */}
              {hasProfile && (
                <div className="ens-defi-badge">
                  <Sparkles size={18} />
                  <span>DeFi Profile Active</span>
                </div>
              )}
            </motion.div>

            {/* Payment Preferences */}
            {hasProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="ens-section"
              >
                <div className="ens-section-header">
                  <DollarSign size={24} />
                  <h3>Payment Preferences</h3>
                </div>

                <div className="ens-prefs-grid">
                  {profile.preferredToken && (
                    <div className="ens-pref-item">
                      <div className="ens-pref-label">Preferred Token</div>
                      <div className="ens-pref-value">{profile.preferredToken}</div>
                    </div>
                  )}

                  {profile.paymentFrequency && (
                    <div className="ens-pref-item">
                      <div className="ens-pref-label">Payment Frequency</div>
                      <div className="ens-pref-value">{profile.paymentFrequency}</div>
                    </div>
                  )}

                  {profile.minPaymentAmount && (
                    <div className="ens-pref-item">
                      <div className="ens-pref-label">Minimum Amount</div>
                      <div className="ens-pref-value">${profile.minPaymentAmount}</div>
                    </div>
                  )}

                  {profile.autoExecute && (
                    <div className="ens-pref-item">
                      <div className="ens-pref-label">Auto-Execute</div>
                      <div className="ens-pref-value">
                        {profile.autoExecute === 'true' ? 'Enabled ✓' : 'Disabled'}
                      </div>
                    </div>
                  )}

                  {profile.timezone && (
                    <div className="ens-pref-item">
                      <div className="ens-pref-label">Timezone</div>
                      <div className="ens-pref-value">{profile.timezone}</div>
                    </div>
                  )}

                  {profile.defaultNetwork && (
                    <div className="ens-pref-item">
                      <div className="ens-pref-label">Default Network</div>
                      <div className="ens-pref-value">{profile.defaultNetwork.toUpperCase()}</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Professional Info */}
            {(profile.title || profile.company || profile.rate) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="ens-section"
              >
                <div className="ens-section-header">
                  <Briefcase size={24} />
                  <h3>Professional Information</h3>
                </div>

                <div className="ens-info-list">
                  {profile.title && (
                    <div className="ens-info-row">
                      <span className="ens-info-label">Title</span>
                      <span className="ens-info-value">{profile.title}</span>
                    </div>
                  )}

                  {profile.company && (
                    <div className="ens-info-row">
                      <span className="ens-info-label">Company</span>
                      <span className="ens-info-value">{profile.company}</span>
                    </div>
                  )}

                  {profile.rate && (
                    <div className="ens-info-row">
                      <span className="ens-info-label">Hourly Rate</span>
                      <span className="ens-info-value">${profile.rate}/hr</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Social Links */}
            {(profile.twitter || profile.email || profile.discord) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="ens-section"
              >
                <div className="ens-section-header">
                  <Globe size={24} />
                  <h3>Social & Contact</h3>
                </div>

                <div className="ens-social-grid">
                  {profile.twitter && (
                    <a
                      href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ens-social-link"
                    >
                      <Twitter size={20} />
                      <span>{profile.twitter}</span>
                    </a>
                  )}

                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="ens-social-link">
                      <Mail size={20} />
                      <span>{profile.email}</span>
                    </a>
                  )}

                  {profile.discord && (
                    <div className="ens-social-link">
                      <Globe size={20} />
                      <span>{profile.discord}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="ens-features"
            >
              <h3 className="ens-features-title">Why ENS Integration Matters</h3>

              <div className="ens-features-grid">
                <div className="ens-feature-card blue">
                  <User size={28} />
                  <h4>Human-Readable</h4>
                  <p>Use alice.eth instead of 0x addresses</p>
                </div>

                <div className="ens-feature-card green">
                  <Shield size={28} />
                  <h4>Decentralized</h4>
                  <p>Own your identity on Ethereum</p>
                </div>

                <div className="ens-feature-card purple">
                  <DollarSign size={28} />
                  <h4>Payment Prefs</h4>
                  <p>Set token & frequency once</p>
                </div>

                <div className="ens-feature-card orange">
                  <Zap size={28} />
                  <h4>Auto-Fill</h4>
                  <p>Forms populate automatically</p>
                </div>

                <div className="ens-feature-card pink">
                  <Globe size={28} />
                  <h4>Multi-Chain</h4>
                  <p>Works across blockchains</p>
                </div>

                <div className="ens-feature-card teal">
                  <Award size={28} />
                  <h4>Composable</h4>
                  <p>Any DeFi app can read it</p>
                </div>
              </div>
            </motion.div>

            {/* Technical Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="ens-tech-note"
            >
              <Settings size={24} />
              <div>
                <h4>How It Works</h4>
                <p>
                  We query <strong>16 ENS text records</strong> using wagmi hooks like{' '}
                  <code>useEnsText</code>. Custom <code>defi.*</code> namespace stores
                  payment preferences on Ethereum mainnet.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
