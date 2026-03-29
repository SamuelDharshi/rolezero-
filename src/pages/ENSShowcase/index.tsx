import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useEnsName, useEnsAvatar } from 'wagmi';
import { useEnsDeFiProfile } from '@/hooks/useEnsDeFiProfile';
import { 
  User, 
  Wallet, 
  Globe, 
  Shield, 
  Zap, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Activity,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Mail,
  Twitter,
  Terminal,
  ArrowUpRight
} from 'lucide-react';
import './ENSShowcase.css';

export const ENSShowcase: React.FC = () => {
  const { address } = useAccount();
  const { data: ensNameRaw } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1,
  });

  const ensName: string | undefined = typeof ensNameRaw === 'string' ? ensNameRaw : undefined;

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    chainId: 1,
  });

  const { profile, hasProfile } = useEnsDeFiProfile(ensName);

  return (
    <div className="ens-page">
      <div className="ens-bg" />

      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        {!address ? (
          <div className="flex-center" style={{ minHeight: '60vh' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card flex-center gap-32"
              style={{ padding: '40px 50px', maxWidth: '900px', width: '100%' }}
            >
              <div className="icon-circle bg-surface flex-center" style={{ width: '80px', height: '80px', borderRadius: '20px', flexShrink: 0 }}>
                <Wallet size={36} className="text-secondary" />
              </div>
              <div className="flex-1">
                <h2 className="m-0 text-xl font-bold">Authentication Required</h2>
                <p className="text-secondary m-0 mt-8 leading-relaxed">
                  Please connect your EVM wallet to view your identity profile and payment preferences.
                </p>
              </div>
              <button className="btn btn-primary px-32 py-16 font-bold whitespace-nowrap" style={{ minWidth: '180px' }}>
                Connect Wallet
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="profile-layout">
            {/* Profile Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="profile-header card"
            >
              <div className="profile-banner" />
              <div className="profile-content">
                <div className="avatar-wrapper">
                  {ensAvatar ? (
                    <img src={ensAvatar} alt="ENS Avatar" className="profile-avatar border-glow" />
                  ) : (
                    <div className="profile-avatar flex-center bg-surface border-glow">
                      <User size={64} className="text-muted" />
                    </div>
                  )}
                  {ensName && (
                    <div className="verified-badge flex-center">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
                
                <div className="profile-info">
                  <div className="flex-center gap-12 mb-8">
                    <h1 className="m-0">{ensName || 'Anonymous node'}</h1>
                    {hasProfile && (
                      <span className="badge-sync flex-center gap-4">
                        <Sparkles size={12} /> DeFi Sync
                      </span>
                    )}
                  </div>
                  <code className="text-muted mono text-sm">{address}</code>
                  
                  {ensName && (
                    <a 
                      href={`https://app.ens.domains/${ensName}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ens-link flex-center gap-8 mt-16 text-secondary"
                    >
                      <Globe size={16} /> app.ens.domains <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Profile Grid */}
            <div className="profile-grid mt-32">
              {/* Left Column: Preferences */}
              <div className="grid-main">
                {hasProfile ? (
                  <section className="profile-section card">
                    <div className="section-header flex-center gap-12 mb-32">
                      <div className="section-icon flex-center"><DollarSign size={20} /></div>
                      <h3 className="m-0">Payment Preferences</h3>
                    </div>
                    
                    <div className="prefs-grid">
                      {[
                        { label: 'Asset', value: profile.preferredToken, icon: Zap },
                        { label: 'Frequency', value: profile.paymentFrequency, icon: Calendar },
                        { label: 'Min Amount', value: profile.minPaymentAmount ? `$${profile.minPaymentAmount}` : null, icon: Activity },
                        { label: 'Network', value: profile.defaultNetwork, icon: Globe },
                        { label: 'Execution', value: profile.autoExecute === 'true' ? 'Auto' : 'Manual', icon: Cpu },
                      ].filter(p => p.value).map((pref, i) => (
                        <div key={i} className="pref-card card">
                          <div className="flex-center gap-12">
                            <pref.icon size={18} className="text-primary" />
                            <div>
                              <span className="pref-label">{pref.label}</span>
                              <span className="pref-value">{pref.value}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : (
                  <section className="profile-section card empty-state text-center">
                    <p className="text-secondary">No DeFi preferences found for this ENS name.</p>
                    <button className="btn btn-secondary btn-sm">Configure Profile</button>
                  </section>
                )}

                {(profile.title || profile.company || profile.rate) && (
                  <section className="profile-section card mt-32">
                    <div className="section-header flex-center gap-12 mb-32">
                      <div className="section-icon flex-center"><Briefcase size={20} /></div>
                      <h3 className="m-0">Professional Manifest</h3>
                    </div>
                    
                    <div className="manifest-list">
                      {profile.title && (
                        <div className="manifest-item flex-between">
                          <span className="text-muted font-bold uppercase letter-1 text-xs">Title</span>
                          <span className="font-bold">{profile.title}</span>
                        </div>
                      )}
                      {profile.company && (
                        <div className="manifest-item flex-between">
                          <span className="text-muted font-bold uppercase letter-1 text-xs">Company</span>
                          <span className="font-bold">{profile.company}</span>
                        </div>
                      )}
                      {profile.rate && (
                        <div className="manifest-item flex-between">
                          <span className="text-muted font-bold uppercase letter-1 text-xs">Base Rate</span>
                          <span className="text-success font-bold text-xl">${profile.rate}<span className="text-muted text-sm">/hr</span></span>
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column: Channels */}
              <div className="grid-sidebar">
                <section className="profile-section card">
                  <div className="section-header flex-center gap-12 mb-24">
                    <div className="section-icon flex-center"><Globe size={20} /></div>
                    <h3 className="m-0">Connect</h3>
                  </div>
                  
                  <div className="social-list">
                    {profile.twitter && (
                      <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-item card flex-between">
                        <div className="flex-center gap-12">
                          <Twitter size={18} className="text-primary" />
                          <span>Twitter</span>
                        </div>
                        <ArrowUpRight size={14} className="text-muted" />
                      </a>
                    )}
                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className="social-item card flex-between">
                        <div className="flex-center gap-12">
                          <Mail size={18} className="text-success" />
                          <span>Email</span>
                        </div>
                        <ArrowUpRight size={14} className="text-muted" />
                      </a>
                    )}
                    {profile.discord && (
                      <div className="social-item card flex-between">
                        <div className="flex-center gap-12">
                          <Terminal size={18} className="text-secondary" />
                          <span>Discord</span>
                        </div>
                        <span className="text-xs font-mono">{profile.discord}</span>
                      </div>
                    )}
                    {!profile.twitter && !profile.email && !profile.discord && (
                      <p className="text-muted text-sm text-center">No social links provided.</p>
                    )}
                  </div>
                </section>

                <div className="card mt-24 bg-surface-dim">
                  <div className="flex-center gap-12 mb-12">
                    <ShieldCheck size={20} className="text-primary" />
                    <h4 className="m-0 text-sm">Identity Secured</h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    This profile is resolved using L1 Ethereum neural nodes. All preferences are immutable until updated on-chain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
