import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { showToast } from '@/components/Toast/Toast';
import { 
  Globe, 
  Twitter, 
  Github, 
  Fingerprint, 
  ShieldCheck, 
  Activity, 
  Mail, 
  Briefcase, 
  DollarSign, 
  Terminal, 
  Image as ImageIcon 
} from 'lucide-react';
import './ENSSettings.css';

export const ENSSettings: React.FC = () => {
  const { address } = useAccount();
  const [ensName, setEnsName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (address) {
      const saved = localStorage.getItem(`ens_settings_${address}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setEnsName(parsed.ensName || '');
          setAvatar(parsed.avatar || '');
          setTwitter(parsed.twitter || '');
          setGithub(parsed.github || '');
        } catch (e) {
          console.error('Failed to parse ENS settings', e);
        }
      }
    }
  }, [address]);

  const handleSave = () => {
    if (!address) return;
    
    setIsSaving(true);
    
    setTimeout(() => {
      const settings = {
        ensName,
        avatar,
        twitter,
        github,
      };
      
      localStorage.setItem(`ens_settings_${address}`, JSON.stringify(settings));
      
      showToast({
        type: 'success',
        title: 'PROTOCOL SYNC COMPLETE',
        message: 'Your neural identity parameters have been updated across the local mesh.',
      });
      setIsSaving(false);
    }, 1200);
  };

  return (
    <div className="settings-page">
      <div className="ens-bg" />
      
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        <header className="settings-header flex-between mb-40">
          <div>
            <div className="badge">Config Management</div>
            <h1>Identity Manifest</h1>
            <p className="text-secondary">Configure how your operational persona appears across the RoleZero manifolds.</p>
          </div>
        </header>

        {!address ? (
          <div className="flex-center" style={{ minHeight: '60vh' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card text-center" style={{ maxWidth: '600px', padding: '60px' }}>
              <div className="icon-circle bg-surface flex-center mb-24" style={{ margin: '0 auto', width: '80px', height: '80px' }}>
                <Fingerprint size={40} className="text-secondary" />
              </div>
              <h2>Credentials Required</h2>
              <p className="text-secondary mb-32">Please connect an authorized EVM wallet to synchronize identity parameters with the neural mesh architecture.</p>
              <button className="btn btn-primary">Connect Wallet</button>
            </motion.div>
          </div>
        ) : (
          <div className="settings-grid">
            <div className="grid-main">
              <section className="card mb-32">
                <div className="section-header flex-center gap-12 mb-32">
                  <div className="section-icon flex-center"><Globe size={20} /></div>
                  <h3 className="m-0">ENS Nameplate Resolver</h3>
                </div>
                
                <div className="form-group">
                  <label>Resolved Name (.eth)</label>
                  <div className="input-with-icon">
                    <Globe size={18} className="text-muted" />
                    <input
                      type="text"
                      value={ensName}
                      onChange={(e) => setEnsName(e.target.value)}
                      placeholder="identity.eth"
                      className="mono"
                    />
                  </div>
                </div>
              </section>

              <section className="card mb-32">
                <div className="section-header flex-center gap-12 mb-32">
                  <div className="section-icon flex-center"><Terminal size={20} /></div>
                  <h3 className="m-0">Avatar Endpoint Sync</h3>
                </div>

                <div className="form-group">
                  <label>Avatar URL (IPFS/HTTP)</label>
                  <div className="input-with-icon">
                    <ImageIcon size={18} className="text-muted" />
                    <input
                      type="text"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://ipfs.io/ipfs/..."
                      className="mono"
                    />
                  </div>
                </div>
              </section>

              <section className="card">
                <div className="section-header flex-center gap-12 mb-32">
                  <div className="section-icon flex-center"><ShieldCheck size={20} /></div>
                  <h3 className="m-0">Neural Comm Links</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Twitter (X) ID</label>
                    <div className="input-with-icon">
                      <Twitter size={18} className="text-secondary" />
                      <input
                        type="text"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="@username"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Github Auth</label>
                    <div className="input-with-icon">
                      <Github size={18} className="text-muted" />
                      <input
                        type="text"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="grid-sidebar">
              <div className="sticky-sidebar">
                <section className="card mb-24">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn btn-primary btn-full py-16"
                  >
                    {isSaving ? <Activity className="spin" size={20} /> : <ShieldCheck size={20} />}
                    <span>{isSaving ? 'Syncing...' : 'Update Identity'}</span>
                  </button>
                  <p className="text-dim text-center text-xs uppercase font-bold letter-1 mt-16 leading-relaxed">
                    Identity parameters are stored locally and will propagate through the neural mesh.
                  </p>
                </section>

                <div className="card bg-surface-dim">
                  <div className="flex-center gap-12 mb-12">
                    <Activity size={18} className="text-primary" />
                    <h4 className="m-0 text-sm">Status: Operational</h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed m-0">
                    Your local mesh connection is active. All identity updates are secured using neural encryption protocols.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
