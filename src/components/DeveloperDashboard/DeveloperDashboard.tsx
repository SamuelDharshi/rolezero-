import React from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { 
  Terminal, 
  Cpu, 
  Database, 
  Shield, 
  Activity, 
  Settings, 
  Trash2, 
  Download, 
  Fingerprint,
  Smartphone,
  Navigation,
  Layers,
  Code,
  ShieldCheck,
  Zap,
  Globe,
  Award,
  AlertCircle,
  Hash,
  Activity as ActivityIcon,
  Search,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { showToast } from '@/components/Toast/Toast';

export const DeveloperDashboard: React.FC = () => {
  const { address: evmAddress } = useAccount();
  const suiAccount = useCurrentAccount();

  const handleClearCache = () => {
    localStorage.clear();
    showToast({
      title: 'CACHE_PURGED_SUCCESSFULLY',
      message: 'Persistent data layers have been reset to factory baseline.',
      type: 'success'
    });
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleExportData = () => {
    const data = {
      evm: evmAddress,
      sui: suiAccount?.address,
      timestamp: new Date().toISOString(),
      localStorage: { ...localStorage }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rolezero-ops-dump-${Date.now()}.json`;
    a.click();
    showToast({
      title: 'MANIFEST_EXPORT_COMPLETE',
      message: 'Operational manifest downloaded to secure local storage.',
      type: 'success'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="developer-dashboard-manifold card card-glow"
      style={{ padding: '15rem', background: 'var(--bg-card)', border: '2px solid var(--border-subtle)', borderRadius: '150px', maxWidth: '2500px', margin: '0 auto', boxShadow: '0 120px 240px rgba(0,0,0,0.95)' }}
    >
      <header style={{ marginBottom: '18rem', display: 'flex', alignItems: 'center', gap: '15rem' }}>
        <div className="card card-glow" style={{ padding: '8rem', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '100px', border: '2px solid var(--border-light)', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.85)' }}>
          <Cpu size={180} strokeWidth={1} />
        </div>
        <div>
          <div className="hero-badge card card-glow" style={{ marginBottom: '8rem', fontSize: '1.25rem', letterSpacing: '0.8rem', padding: '2.5rem 8rem', width: 'fit-content', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--sui-blue)', border: '2px solid rgba(6, 182, 212, 0.5)', fontWeight: 950, borderRadius: '35px', boxShadow: '0 0 80px rgba(6, 182, 212, 0.3)' }}>
            <div className="pulse" style={{ width: '22px', height: '22px', background: 'var(--sui-blue)', borderRadius: '50%', boxShadow: '0 0 35px var(--sui-blue)', marginRight: '5rem' }} />
            ADVANCED_PROTOCOL_CONTROL_UNIT_v9.4
          </div>
          <h2 className="cyber-glitch-text" style={{ fontSize: '13rem', fontWeight: 950, letterSpacing: '-0.0625em', margin: 0, lineHeight: 0.8 }}>CORE_OPS_TERMINAL</h2>
          <p style={{ fontSize: '4.5rem', color: 'var(--text-dim)', marginTop: '8rem', fontWeight: 500, lineHeight: 1.6, opacity: 0.6 }}>High-fidelity administrative kernel for real-time protocol orchestration and data persistence management across the distributed neural manifold.</p>
        </div>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(1100px, 1fr))', gap: '15rem' }}>
        {/* Connected Nodes */}
        <section className="card card-glow" style={{ padding: '15rem', background: 'var(--bg-main)', border: '2px solid var(--border-light)', borderRadius: '120px', boxShadow: '0 80px 160px rgba(0,0,0,0.7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8rem', marginBottom: '12rem' }}>
            <div className="card card-glow" style={{ padding: '4.5rem', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--sui-blue)', borderRadius: '50px', border: '2px solid var(--border-light)', boxShadow: '0 0 60px rgba(6, 182, 212, 0.2)' }}>
              <Fingerprint size={120} strokeWidth={1} />
            </div>
            <h3 className="cyber-glitch-text" style={{ fontSize: '6rem', fontWeight: 950, letterSpacing: '0.15rem', color: 'white' }}>AUTHENTICATED_NODES</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', textTransform: 'uppercase', opacity: 0.4 }}>EVM_IDENTITY_HASH</span>
              <div className="card card-glow" style={{ padding: '6rem 10rem', background: 'var(--bg-card)', border: '2.5rem solid var(--border-light)', borderRadius: '60px', fontFamily: 'JetBrains Mono', fontSize: '3.5rem', color: evmAddress ? 'white' : 'var(--text-dim)', fontWeight: 800, wordBreak: 'break-all', opacity: evmAddress ? 1 : 0.4, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)' }}>
                {evmAddress ? evmAddress.toUpperCase() : 'NODE_DISCONNECTED'}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', textTransform: 'uppercase', opacity: 0.4 }}>SUI_IDENTITY_HASH</span>
              <div className="card card-glow" style={{ padding: '6rem 10rem', background: 'var(--bg-card)', border: '2.5rem solid var(--border-light)', borderRadius: '60px', fontFamily: 'JetBrains Mono', fontSize: '3.5rem', color: suiAccount?.address ? 'white' : 'var(--text-dim)', fontWeight: 800, wordBreak: 'break-all', opacity: suiAccount?.address ? 1 : 0.4, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)' }}>
                {suiAccount?.address ? suiAccount.address.toUpperCase() : 'NODE_DISCONNECTED'}
              </div>
            </div>
          </div>
        </section>

        {/* Runtime Environment */}
        <section className="card card-glow" style={{ padding: '15rem', background: 'var(--bg-main)', border: '2px solid var(--border-light)', borderRadius: '120px', boxShadow: '0 80px 160px rgba(0,0,0,0.7)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8rem', marginBottom: '12rem' }}>
            <div className="card card-glow" style={{ padding: '4.5rem', background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', borderRadius: '50px', border: '2px solid var(--border-light)', boxShadow: '0 0 60px rgba(34, 197, 94, 0.2)' }}>
              <Activity size={120} strokeWidth={1} />
            </div>
            <h3 className="cyber-glitch-text" style={{ fontSize: '6rem', fontWeight: 950, letterSpacing: '0.15rem', color: 'white' }}>RUNTIME_TELEMETRY</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10rem', borderBottom: '1px dashed var(--border-light)' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', textTransform: 'uppercase', opacity: 0.4 }}>EXECUTION_MODE</span>
              <span className="cyber-glitch-text" style={{ fontSize: '4.5rem', fontWeight: 950, color: 'var(--success)', letterSpacing: '0.2rem' }}>STAGING_DEVELOPMENT</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10rem', borderBottom: '1px dashed var(--border-light)' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', textTransform: 'uppercase', opacity: 0.4 }}>PERSISTENCE_LAYER</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6rem' }}>
                 <HardDrive size={64} strokeWidth={1} color="var(--text-dim)" style={{ opacity: 0.5 }} />
                 <span style={{ fontSize: '4rem', fontWeight: 950, color: 'white', letterSpacing: '0.2rem' }}>LOCALSTORAGE_v9.4_SECURE</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', textTransform: 'uppercase', opacity: 0.4 }}>NEURAL_UPLINK</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6rem' }}>
                 <div className="pulse" style={{ width: '35px', height: '35px', background: 'var(--sui-blue)', borderRadius: '50%', boxShadow: '0 0 40px var(--sui-blue)' }} />
                 <span style={{ fontSize: '4rem', fontWeight: 950, color: 'var(--sui-blue)', letterSpacing: '0.2rem' }}>ACTIVE_NOMINAL_v9.4</span>
              </div>
            </div>
          </div>
        </section>

        {/* Administrative Overrides */}
        <section className="card card-glow" style={{ padding: '15rem', background: 'var(--bg-main)', border: '2px solid var(--border-light)', borderRadius: '150px', gridColumn: '1 / -1', boxShadow: '0 120px 240px rgba(0,0,0,0.85)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8rem', marginBottom: '15rem' }}>
            <div className="card card-glow" style={{ padding: '6rem', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--error)', borderRadius: '60px', border: '2px solid var(--border-light)', boxShadow: '0 0 100px rgba(239, 68, 68, 0.2)' }}>
              <Terminal size={150} strokeWidth={1} />
            </div>
            <h3 className="cyber-glitch-text" style={{ fontSize: '8rem', fontWeight: 950, letterSpacing: '0.2rem', color: 'white' }}>ADMINISTRATIVE_OVERRIDES</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(800px, 1fr))', gap: '15rem' }}>
            <motion.button
              whileHover={{ scale: 1.05, background: 'rgba(239, 68, 68, 0.15)', borderColor: 'var(--error)', boxShadow: '0 80px 160px rgba(239, 68, 68, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearCache}
              className="card card-glow btn-override"
              style={{ display: 'flex', alignItems: 'center', gap: '10rem', padding: '10rem 15rem', background: 'transparent', border: '4px solid var(--border-light)', borderRadius: '100px', color: 'var(--error)', fontWeight: 950, fontSize: '4.5rem', cursor: 'pointer', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', letterSpacing: '0.8rem' }}
            >
              <Trash2 size={130} strokeWidth={1.5} />
              <span>PURGE_PERSISTENT_CACHE</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, background: 'rgba(6, 182, 212, 0.15)', borderColor: 'var(--sui-blue)', boxShadow: '0 80px 160px rgba(6, 182, 212, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportData}
              className="card card-glow btn-override"
              style={{ display: 'flex', alignItems: 'center', gap: '10rem', padding: '10rem 15rem', background: 'transparent', border: '4px solid var(--border-light)', borderRadius: '100px', color: 'var(--sui-blue)', fontWeight: 950, fontSize: '4.5rem', cursor: 'pointer', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', letterSpacing: '0.8rem' }}
            >
              <Download size={130} strokeWidth={1.5} />
              <span>EXPORT_OPERATIONAL_MANIFEST</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.05)', borderColor: 'white' }}
              whileTap={{ scale: 0.95 }}
              className="card card-glow btn-override"
              style={{ display: 'flex', alignItems: 'center', gap: '10rem', padding: '10rem 15rem', background: 'transparent', border: '4px solid var(--border-light)', borderRadius: '100px', color: 'var(--text-dim)', fontWeight: 950, fontSize: '4.5rem', cursor: 'pointer', opacity: 0.2, letterSpacing: '0.8rem', filter: 'grayscale(1)' }}
              disabled
            >
              <Code size={130} strokeWidth={1} />
              <span>INITIALIZE_KERNEL_DEBUG</span>
            </motion.button>
          </div>
        </section>
      </div>

      <footer style={{ marginTop: '18rem', paddingTop: '15rem', borderTop: '2px dashed var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.15 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8rem', fontSize: '3rem', fontWeight: 950, letterSpacing: '0.8rem' }}>
          <Settings size={90} strokeWidth={0.5} />
          <span>OPS_KERNEL_v9.4.0_FINAL_STABLE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6rem', fontSize: '3rem', fontWeight: 950, letterSpacing: '0.8rem' }}>
          <ShieldCheck size={90} strokeWidth={0.5} />
          <div className="pulse" style={{ width: '35px', height: '35px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 30px var(--success)' }} />
          <span>NEURAL_UPLINK_STABLE</span>
        </div>
      </footer>
    </motion.div>
  );
};
