import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { showToast } from '@/components/Toast/Toast';
import { 
  User, 
  Shield, 
  Terminal, 
  Globe, 
  Twitter, 
  Github, 
  Link as LinkIcon, 
  Cpu, 
  Zap,
  Activity,
  AlertCircle,
  CheckCircle,
  Database,
  Fingerprint,
  Smartphone,
  Navigation,
  Layers,
  Search,
  ArrowRight,
  ShieldCheck,
  Timer,
  Layout,
  Grid,
  Award,
  Settings,
  Clock,
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
      
      <div className="container" style={{ maxWidth: '1800px', paddingTop: '150px' }}>
        <motion.div 
          initial={{ opacity: 0, y: -100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.4 }} 
          className="settings-header-manifold" 
          style={{ marginBottom: '22rem', textAlign: 'center' }}
        >
          <div className="hero-badge card card-glow" style={{ marginBottom: '8rem', fontSize: '1.25rem', letterSpacing: '0.8rem', padding: '1.5rem 6rem', width: 'fit-content', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--sui-blue)', border: '2px solid rgba(6, 182, 212, 0.4)', fontWeight: 950, borderRadius: '25px', boxShadow: '0 0 80px rgba(6, 182, 212, 0.3)', margin: '0 auto 10rem' }}>
            <div className="pulse" style={{ width: '18px', height: '18px', background: 'var(--sui-blue)', borderRadius: '50%', boxShadow: '0 0 25px var(--sui-blue)', marginRight: '4rem' }} />
            NEURAL_IDENTITY_v9.4_SECURE
          </div>
          <h1 className="cyber-glitch-text" style={{ fontSize: '15rem', fontWeight: 950, letterSpacing: '-0.0625em', margin: 0, lineHeight: 0.8 }}>
            IDENTITY_MANIFEST
          </h1>
          <p className="manifold-subtitle" style={{ fontSize: '4rem', color: 'var(--text-dim)', maxWidth: '1200px', fontWeight: 500, lineHeight: 1.6, opacity: 0.6, marginTop: '10rem', margin: '10rem auto 0' }}>
            Configure how your operational persona appears across the RoleZero decentralized architecture manifolds and global mesh endpoints.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 150 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="settings-manifold card card-glow"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '120px', padding: '18rem 15rem', boxShadow: '0 120px 240px rgba(0,0,0,0.7)', maxWidth: '1200px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}
        >
          <div className="card card-glow identity-visual-node" style={{ width: '320px', height: '320px', background: 'var(--bg-main)', border: '2px solid var(--border-light)', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15rem', color: 'var(--sui-blue)', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.8)' }}>
            <Fingerprint size={200} strokeWidth={1} />
          </div>

          {!address ? (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="connectivity-denied-manifold" style={{ textAlign: 'center' }}>
              <div className="card card-glow" style={{ padding: '12rem', borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '80px', border: '3px solid var(--error)', boxShadow: '0 0 100px rgba(239, 68, 68, 0.2)' }}>
                <AlertCircle size={150} style={{ marginBottom: '8rem', color: 'var(--error)' }} strokeWidth={1} />
                <h4 className="cyber-glitch-text" style={{ fontSize: '5rem', fontWeight: 950, color: 'var(--error)', letterSpacing: '0.8rem', textTransform: 'uppercase', marginBottom: '6rem', lineHeight: 1 }}>CREDENTIALS_REQUIRED</h4>
                <p style={{ fontSize: '3rem', color: 'var(--text-dim)', fontWeight: 500, lineHeight: 1.8, maxWidth: '800px', margin: '0 auto', opacity: 0.6 }}>Please connect an authorized EVM wallet to synchronize identity parameters with the neural mesh architecture.</p>
              </div>
            </motion.div>
          ) : (
            <div className="identity-form-manifold" style={{ display: 'flex', flexDirection: 'column', gap: '12rem' }}>
              <div className="form-group-unit" style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4rem', color: 'var(--text-dim)', fontSize: '2rem', fontWeight: 950, letterSpacing: '0.6rem', opacity: 0.5 }}>
                  <Globe size={48} color="var(--sui-blue)" /> 
                  <span>ENS_NAMEPLATE_RESOLVER</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={ensName}
                    onChange={(e) => setEnsName(e.target.value)}
                    placeholder="identity.eth"
                    className="identity-input-manifold card card-glow"
                    style={{ width: '100%', padding: '5.5rem 8rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '50px', color: 'white', fontSize: '3.5rem', fontWeight: 950, fontFamily: 'JetBrains Mono', outline: 'none', transition: 'all 0.5s', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}
                  />
                  <div style={{ position: 'absolute', right: '6rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }}>
                     <Layout size={64} />
                  </div>
                </div>
              </div>

              <div className="form-group-unit" style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4rem', color: 'var(--text-dim)', fontSize: '2rem', fontWeight: 950, letterSpacing: '0.6rem', opacity: 0.5 }}>
                  <Terminal size={48} color="var(--success)" />
                  <span>AVATAR_ENDPOINT_SYNC</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://ipfs.io/ipfs/..."
                    className="identity-input-manifold card card-glow"
                    style={{ width: '100%', padding: '5.5rem 8rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '50px', color: 'var(--success)', fontSize: '2.50rem', fontWeight: 900, fontFamily: 'JetBrains Mono', outline: 'none', transition: 'all 0.5s', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}
                  />
                  <div style={{ position: 'absolute', right: '6rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }}>
                     <ImageIcon size={64} />
                  </div>
                </div>
              </div>

              <div className="form-group-unit" style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4rem', color: 'var(--text-dim)', fontSize: '2rem', fontWeight: 950, letterSpacing: '0.6rem', opacity: 0.5 }}>
                  <Twitter size={48} color="#1da1f2" />
                  <span>NEURAL_FEED_X_LINK</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@username"
                    className="identity-input-manifold card card-glow"
                    style={{ width: '100%', padding: '5.5rem 8rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '50px', color: '#1da1f2', fontSize: '3.5rem', fontWeight: 950, fontFamily: 'JetBrains Mono', outline: 'none', transition: 'all 0.5s', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}
                  />
                  <div style={{ position: 'absolute', right: '6rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }}>
                     <Activity size={64} />
                  </div>
                </div>
              </div>

              <div className="form-group-unit" style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4rem', color: 'var(--text-dim)', fontSize: '2rem', fontWeight: 950, letterSpacing: '0.6rem', opacity: 0.5 }}>
                  <Github size={48} color="white" />
                  <span>CODE_REPOSITORY_AUTH</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="username"
                    className="identity-input-manifold card card-glow"
                    style={{ width: '100%', padding: '5.5rem 8rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '50px', color: 'white', fontSize: '3.5rem', fontWeight: 950, fontFamily: 'JetBrains Mono', outline: 'none', transition: 'all 0.5s', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}
                  />
                  <div style={{ position: 'absolute', right: '6rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }}>
                     <Cpu size={64} />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, background: 'var(--sui-blue)', color: 'white', boxShadow: '0 60px 120px rgba(6, 182, 212, 0.6)', borderColor: 'var(--sui-blue)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="btn-sync-identity card card-glow"
                disabled={isSaving}
                style={{ marginTop: '10rem', padding: '6.5rem', borderRadius: '50px', fontSize: '3rem', fontWeight: 950, letterSpacing: '0.8rem', background: 'transparent', border: '3px solid var(--sui-blue)', color: 'var(--sui-blue)', cursor: 'pointer', transition: 'all 0.6s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6rem' }}>
                  {isSaving ? <Activity size={80} className="spin" /> : <ShieldCheck size={80} strokeWidth={2.5} />}
                  <span>{isSaving ? 'SYNCHRONIZING...' : 'UPDATE_NEURAL_IDENTITY'}</span>
                </div>
              </motion.button>
              
              <div style={{ marginTop: '12rem', textAlign: 'center', opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5rem' }}>
                <Database size={64} />
                <span style={{ fontSize: '1.75rem', fontWeight: 950, letterSpacing: '1rem', textTransform: 'uppercase' }}>LOCAL_SECURE_STORAGE_v9.4_NOMINAL</span>
              </div>
            </div>
          )}
        </motion.div>

        <footer style={{ textAlign: 'center', marginTop: '35rem', opacity: 0.2, paddingBottom: '45rem', borderTop: '1px dashed var(--border-light)', paddingTop: '25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30rem', marginBottom: '25rem' }}>
            <Smartphone size={100} strokeWidth={0.5} />
            <ShieldCheck size={120} strokeWidth={0.5} />
            <Database size={120} strokeWidth={0.5} />
            <Layers size={100} strokeWidth={0.5} />
            <Fingerprint size={120} strokeWidth={0.5} />
            <Award size={100} strokeWidth={0.5} />
            <Settings size={120} strokeWidth={0.5} />
            <Grid size={100} strokeWidth={0.5} />
            <Timer size={120} strokeWidth={0.5} />
            <Cpu size={150} strokeWidth={0.5} />
            <Clock size={100} strokeWidth={0.5} />
            <Activity size={150} strokeWidth={0.5} />
          </div>
          <div style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '6rem', textTransform: 'uppercase' }}>CRYPTO_SHIELDED_MANIFEST_v9.4.0_FINAL_STABLE</div>
        </footer>
      </div>
    </div>
  );
};
