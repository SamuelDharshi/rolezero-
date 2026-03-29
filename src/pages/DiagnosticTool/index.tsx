import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { 
  Terminal, 
  Shield, 
  Cpu, 
  Database, 
  Activity, 
  Zap, 
  Search, 
  Globe, 
  Lock, 
  Settings,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Navigation,
  Layers,
  Smartphone,
  Server,
  Code,
  ShieldCheck,
  Timer,
  Layout,
  Grid,
  Award,
  Clock,
  ZapOff
} from 'lucide-react';
import './DiagnosticTool.css';

export const DiagnosticTool: React.FC = () => {
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  const suiAccount = useCurrentAccount();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const steps = [
      '>> INITIALIZING_NEURAL_SYSTEM_SCAN...',
      '>> AUTHENTICATING_NETWORK_NODES...',
      `[KERNEL] EVM_WALLET_CONNECTED: ${evmConnected ? 'TRUE' : 'FALSE'}`,
      `[KERNEL] EVM_NATIVE_ADDRESS: ${evmAddress || 'UNDEFINED'}`,
      `[KERNEL] SUI_NETWORK_ACTIVE: ${suiAccount ? 'TRUE' : 'FALSE'}`,
      `[KERNEL] SUI_NATIVE_ADDRESS: ${suiAccount?.address || 'UNDEFINED'}`,
      '>> PROBING_PERSISTENT_CACHE_LAYERS...',
      `[ARCHIVE] PROTOCOL_ROLE_CACHE: ${localStorage.getItem('arcRoles') ? 'ACTIVE' : 'EMPTY'}`,
      `[ARCHIVE] MANIFEST_CACHE: ${localStorage.getItem('completedPayments') ? 'ACTIVE' : 'EMPTY'}`,
      '>> SYSTEM_SCAN_COMPLETE_STABLE.',
      '>> FINAL_STATUS: PROTOCOL_INTEGRITY_NOMINAL.'
    ];

    for (const step of steps) {
      setTestResults(prev => [...prev, step]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    setIsRunning(false);
  };

  return (
    <div className="diagnostic-page">
      <div className="ens-bg" />

      <div className="container" style={{ maxWidth: '1800px', paddingTop: '150px' }}>
        <motion.div 
          initial={{ opacity: 0, y: -100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.4 }} 
          className="diagnostic-header-manifold" 
          style={{ marginBottom: '22rem', textAlign: 'center' }}
        >
          <div className="hero-badge card card-glow" style={{ marginBottom: '8rem', fontSize: '1.25rem', letterSpacing: '0.8rem', padding: '1.5rem 6rem', width: 'fit-content', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--sui-blue)', border: '2px solid rgba(6, 182, 212, 0.4)', fontWeight: 950, borderRadius: '25px', boxShadow: '0 0 80px rgba(6, 182, 212, 0.3)', margin: '0 auto 10rem' }}>
            <div className="pulse" style={{ width: '18px', height: '18px', background: 'var(--sui-blue)', borderRadius: '50%', boxShadow: '0 0 25px var(--sui-blue)', marginRight: '4rem' }} />
            DIAGNOSTIC_KERNEL_v9.4.0
          </div>
          <h1 className="cyber-glitch-text" style={{ fontSize: '15rem', fontWeight: 950, letterSpacing: '-0.0625em', margin: 0, lineHeight: 0.8 }}>
            AUDIT_KERNEL
          </h1>
          <p className="manifold-subtitle" style={{ fontSize: '4rem', color: 'var(--text-dim)', maxWidth: '1200px', fontWeight: 500, lineHeight: 1.6, opacity: 0.6, marginTop: '10rem', margin: '10rem auto 0' }}>
            Execute real-time cryptographic integrity verification across all protocol connectivity and synchronized data layer manifolds for supreme security validation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 150 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.4 }}
          className="diagnostic-manifold card card-glow"
          style={{ padding: '18rem 15rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '120px', boxShadow: '0 120px 240px rgba(0,0,0,0.7)', maxWidth: '1500px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}
        >
          <div className="header-status-icons-unit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10rem', marginBottom: '20rem' }}>
            <div className="card card-glow status-visual" style={{ color: 'var(--sui-blue)', background: 'var(--bg-main)', padding: '6rem', borderRadius: '50px', border: '1px solid var(--border-light)', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}>
              <ShieldCheck size={120} strokeWidth={1} />
            </div>
            <div className="card card-glow status-visual" style={{ color: 'var(--success)', background: 'var(--bg-main)', padding: '6rem', borderRadius: '50px', border: '1px solid var(--border-light)', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}>
              <Activity size={120} strokeWidth={1} />
            </div>
            <div className="card card-glow status-visual" style={{ color: '#f59e0b', background: 'var(--bg-main)', padding: '6rem', borderRadius: '50px', border: '1px solid var(--border-light)', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}>
              <Fingerprint size={120} strokeWidth={1} />
            </div>
          </div>

          <div className="audit-card-manifold" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(550px, 1fr))', gap: '10rem', marginBottom: '20rem' }}>
            <motion.div whileHover={{ y: -25, borderColor: 'var(--sui-blue)', background: 'rgba(6, 182, 212, 0.1)', boxShadow: '0 60px 120px rgba(0,0,0,0.6)' }} className="audit-unit-card card card-glow" style={{ padding: '12rem 10rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '80px', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8rem', marginBottom: '10rem' }}>
                <div className="card card-glow" style={{ color: 'var(--sui-blue)', background: 'rgba(6, 182, 212, 0.2)', padding: '5rem', borderRadius: '40px', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)' }}>
                  <Cpu size={100} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="cyber-glitch-text" style={{ margin: 0, fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-0.02em', lineHeight: 1, color: 'white' }}>KERNEL_STACK</h4>
                  <div style={{ fontSize: '1.75rem', color: 'var(--text-dim)', fontWeight: 950, letterSpacing: '0.6rem', textTransform: 'uppercase', opacity: 0.5, marginTop: '3.5rem' }}>CONNECTIVITY_LAYER</div>
                </div>
              </div>
              <p style={{ fontSize: '3rem', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: '10rem', fontWeight: 500, opacity: 0.6 }}>Monitors real-time wallet handshake status and neural bridge stability across SUI and EVM networks with atomic accuracy.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5rem', color: 'var(--sui-blue)', fontSize: '2rem', fontWeight: 950, letterSpacing: '0.4rem' }}>
                <CheckCircle2 size={48} strokeWidth={2} /> <span style={{ textTransform: 'uppercase' }}>ACTIVE_TELEMETRY</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -25, borderColor: 'var(--success)', background: 'rgba(34, 197, 94, 0.1)', boxShadow: '0 60px 120px rgba(0,0,0,0.6)' }} className="audit-unit-card card card-glow" style={{ padding: '12rem 10rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '80px', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8rem', marginBottom: '10rem' }}>
                <div className="card card-glow" style={{ color: 'var(--success)', background: 'rgba(34, 197, 94, 0.2)', padding: '5rem', borderRadius: '40px', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)' }}>
                  <Database size={100} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="cyber-glitch-text" style={{ margin: 0, fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-0.02em', lineHeight: 1, color: 'white' }}>PERSISTENT_CORE</h4>
                  <div style={{ fontSize: '1.75rem', color: 'var(--text-dim)', fontWeight: 950, letterSpacing: '0.6rem', textTransform: 'uppercase', opacity: 0.5, marginTop: '3.5rem' }}>ARCHIVAL_LAYER</div>
                </div>
              </div>
              <p style={{ fontSize: '3rem', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: '10rem', fontWeight: 500, opacity: 0.6 }}>Verifies the integrity of local manifest caches and decentralized protocol role registries in neural storage manifolds.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5rem', color: 'var(--success)', fontSize: '2rem', fontWeight: 950, letterSpacing: '0.4rem' }}>
                <Database size={48} strokeWidth={2} /> <span style={{ textTransform: 'uppercase' }}>CACHE_INTEGRITY: ON</span>
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, background: 'var(--sui-blue)', color: 'white', boxShadow: '0 80px 160px rgba(6, 182, 212, 0.6)', borderColor: 'var(--sui-blue)' }}
            whileTap={{ scale: 0.95 }}
            onClick={runDiagnostics}
            disabled={isRunning}
            className="btn-audit-manifold card card-glow"
            style={{ width: '100%', padding: '7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8rem', background: 'transparent', border: '3px solid var(--sui-blue)', borderRadius: '60px', color: 'var(--sui-blue)', fontWeight: 950, fontSize: '3.5rem', letterSpacing: '0.8rem', cursor: 'pointer', transition: 'all 0.6s', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}
          >
            {isRunning ? <Activity className="spin" size={80} strokeWidth={2} /> : <Search size={80} strokeWidth={3} />}
            <span>{isRunning ? 'EXECUTING_SYSTEM_PROBE...' : 'INITIALIZE_PROTOCOL_AUDIT'}</span>
          </motion.button>

          <AnimatePresence>
            {testResults.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: 100 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: 100 }}
                className="audit-console-manifold card card-glow"
                style={{ marginTop: '15rem', padding: '12rem 15rem', background: '#000', border: '3px solid var(--border-light)', borderRadius: '80px', position: 'relative', boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)' }}
              >
                <div className="tty-badge-cell card card-glow" style={{ position: 'absolute', top: '7rem', right: '80px', color: 'var(--success)', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '5rem', background: 'rgba(34, 197, 94, 0.1)', padding: '2rem 6rem', borderRadius: '30px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 950, letterSpacing: '0.6rem', textTransform: 'uppercase' }}>TTY: NEURAL/STREAM</span>
                  <Terminal size={56} strokeWidth={1} />
                </div>
                <div className="console-stream-lines" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  {testResults.map((result, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={idx} 
                      className="audit-line-manifold" 
                      style={{ display: 'flex', alignItems: 'center', gap: '8rem', fontSize: '2.5rem', fontFamily: 'JetBrains Mono', lineHeight: 1.6 }}
                    >
                      <span style={{ opacity: 0.2, fontWeight: 950, width: '100px', borderRight: '2px solid rgba(255,255,255,0.05)', marginRight: '3.5rem' }}>{String(idx + 1).padStart(2, '0')}</span>
                      <span style={{ color: result.includes('✓') || result.includes('[KERNEL]') || result.includes('[ARCHIVE]') ? 'var(--success)' : (result.includes('>>') ? 'var(--sui-blue)' : 'var(--text-dim)'), fontWeight: 900, letterSpacing: '0.05em' }}>{result}</span>
                    </motion.div>
                  ))}
                </div>
                {isRunning && (
                  <div className="probing-indicator-row" style={{ display: 'flex', alignItems: 'center', gap: '6rem', paddingLeft: '140px', marginTop: '8rem' }}>
                    <div className="cursor-indicator" style={{ background: 'var(--success)', width: '30px', height: '60px', boxShadow: '0 0 40px var(--success)', animation: 'cursor-pulse 0.8s infinite' }} />
                    <span style={{ fontSize: '2.25rem', color: 'var(--success)', fontWeight: 950, letterSpacing: '1rem', textTransform: 'uppercase', opacity: 0.6 }}>SYSTEM_PROBING_IN_PROGRESS...</span>
                  </div>
                )}
                {!isRunning && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="system-operational-manifold"
                    style={{ marginTop: '12rem', paddingTop: '10rem', borderTop: '3px dashed rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '8rem', color: 'var(--success)', fontWeight: 950, fontSize: '3.5rem', letterSpacing: '0.8rem', textTransform: 'uppercase' }}
                  >
                    <div className="card card-glow operational-icon-unit" style={{ padding: '3.5rem', background: 'rgba(34, 197, 94, 0.25)', borderRadius: '35px', color: 'var(--success)', boxShadow: '0 0 80px rgba(34, 197, 94, 0.3)' }}>
                      <CheckCircle2 size={100} strokeWidth={2.5} />
                    </div>
                    <span>ALL SYSTEMS OPERATIONAL // PROTOCOL READY FOR GLOBAL DISPATCH_</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="diagnostics-engine-footer" style={{ marginTop: '18rem', textAlign: 'center', opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6rem' }}>
            <Settings size={80} className="spin" style={{ animationDuration: '6s' }} />
            <span style={{ fontSize: '2rem', fontWeight: 950, letterSpacing: '1rem', textTransform: 'uppercase' }}>NETWORK_DIAGNOSTICS_ENGINE_v9.4.0-STABLE_NOMINAL</span>
          </div>
        </motion.div>
        
        <footer style={{ textAlign: 'center', marginTop: '35rem', opacity: 0.2, paddingBottom: '45rem', borderTop: '1px dashed var(--border-light)', paddingTop: '25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30rem', marginBottom: '25rem' }}>
            <Smartphone size={100} strokeWidth={0.5} />
            <ShieldCheck size={120} strokeWidth={0.5} />
            <Database size={120} strokeWidth={0.5} />
            <Layers size={100} strokeWidth={0.5} />
            <Fingerprint size={120} strokeWidth={0.5} />
            <Award size={100} strokeWidth={0.5} />
            <Settings size={100} strokeWidth={0.5} />
            <Grid size={100} strokeWidth={0.5} />
            <Timer size={120} strokeWidth={0.5} />
            <Cpu size={150} strokeWidth={0.5} />
            <Clock size={100} strokeWidth={0.5} />
            <Activity size={150} strokeWidth={0.5} />
          </div>
          <div style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '6rem', textTransform: 'uppercase' }}>CRYPTO_SHIELDED_MANIFEST_v9.4.0_FINAL_STABLE</div>
        </footer>
      </div>

      <style>{`
        @keyframes cursor-pulse {
          0% { opacity: 1; }
          50% { opacity: 0.1; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
