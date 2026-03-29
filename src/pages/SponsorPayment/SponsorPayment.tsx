import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useFundRole } from '@/hooks/useFundRole';
import { useRoleData } from '@/hooks/useRoleData';
import { useSponsorTracking } from '@/hooks/useSponsorTracking';
import { showToast } from '@/components/Toast/Toast';
import { shortenAddress } from '@/utils/ens';
import { formatTimestamp } from '@/utils/dateUtils';
import { SkeletonDashboard } from '@/components/Skeleton/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Wallet, 
  AlertCircle,
  Terminal,
  Activity,
  Zap,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Cpu,
  Globe,
  Database,
  Search,
  Check,
  Award,
  TrendingUp,
  History,
  Shield,
  ZapOff,
  Hash,
  ArrowUpRight,
  Clock,
  ArrowDownLeft,
  Key,
  Navigation,
  Calendar,
  Smartphone,
  Layers,
  Fingerprint,
  CheckCircle2,
  Grid,
  ShieldCheck,
  Timer,
  Layout,
  Smartphone as Phone,
  ArrowRight
} from 'lucide-react';
import './SponsorPayment.css';

export const SponsorPayment: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { data: roleData, isLoading, error } = useRoleData(roleId);
  const fundRole = useFundRole(roleId || '');
  const { sponsorships } = useSponsorTracking(roleId || '');

  const [amount, setAmount] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txDigest, setTxDigest] = useState('');

  if (isLoading) return (
    <div className="sponsor-page">
      <div className="ens-bg" />
      <div className="container" style={{ maxWidth: '1800px', paddingTop: '150px' }}>
        <SkeletonDashboard />
      </div>
    </div>
  );

  if (error || !roleData) {
    return (
      <div className="sponsor-page">
        <div className="ens-bg" />
        <div className="container" style={{ maxWidth: '1800px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <motion.div initial={{ opacity: 0, scale: 0.98, y: 150 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.4 }} className="card card-glow sync-error-manifold" style={{ maxWidth: '1600px', textAlign: 'center', borderColor: 'var(--error)', padding: '25rem 15rem', background: 'var(--bg-card)', borderRadius: '120px', boxShadow: '0 120px 240px rgba(239, 68, 68, 0.4)' }}>
            <div className="card card-glow error-icon-unit" style={{ width: '350px', height: '350px', background: 'rgba(239, 68, 68, 0.15)', border: '2px solid var(--error)', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12rem', color: 'var(--error)', boxShadow: '0 0 150px rgba(239, 68, 68, 0.4)' }}>
              <AlertCircle size={220} strokeWidth={1} />
            </div>
            <h2 className="cyber-glitch-text" style={{ fontSize: '13rem', color: 'var(--error)', fontWeight: 950, marginBottom: '10rem', letterSpacing: '-0.04em', margin: 0, lineHeight: 0.8 }}>SYNC_FAILURE</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '4.5rem', marginBottom: '20rem', maxWidth: '1300px', margin: '8rem auto 20rem', lineHeight: 1.8, fontWeight: 500, opacity: 0.6 }}>The protocol manifold could not retrieve the specified role record from the decentralized manifold registry. Connection sequence terminated across the orbital layer.</p>
            <motion.button 
              whileHover={{ scale: 1.05, background: 'var(--bg-main)', borderColor: 'white', color: 'white', boxShadow: '0 60px 120px rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')} 
              className="btn btn-secondary card card-glow" 
              style={{ padding: '6rem 12rem', fontWeight: 950, background: 'transparent', letterSpacing: '0.8rem', fontSize: '3.5rem', border: '3px solid var(--border-light)', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8rem', cursor: 'pointer', margin: '0 auto', transition: 'all 0.6s' }}
            >
              <Navigation size={80} strokeWidth={2} />
              <span>RETURN_TO_REGISTRY</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleSponsor = async () => {
    if (!account) {
      showToast({ type: 'error', title: 'IDENTITY AUTH FAILED', message: 'Neural nodes must be connected to authorize liquidity injection' });
      return;
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      showToast({ type: 'error', title: 'INVALID MAGNITUDE', message: 'Specify a valid volumetric magnitude for protocol injection' });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await fundRole.mutateAsync(value);
      setTxDigest(result.digest);
      setShowSuccess(true);
      showToast({ type: 'success', title: 'INJECTION SYNCED', message: 'Operational reserves have been updated on the decentralized ledger', txDigest: result.digest });
      setAmount('1');
    } catch (err: any) {
      showToast({ type: 'error', title: 'INJECTION ABORTED', message: err.message || 'Reserve synchronization failed - temporal lock active' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="sponsor-page">
      <div className="ens-bg" />
      
      <div className="container" style={{ maxWidth: '1800px', paddingTop: '150px' }}>
        <motion.div 
          initial={{ opacity: 0, y: -100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.4 }}
          className="sponsor-header-manifold"
          style={{ marginBottom: '22rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px dashed var(--border-light)', paddingBottom: '15rem' }}
        >
          <div style={{ display: 'flex', gap: '15rem', alignItems: 'flex-end' }}>
            <div className="header-icon-visual card card-glow" style={{ width: '380px', height: '380px', borderRadius: '120px', background: 'var(--bg-card)', color: 'var(--sui-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-subtle)', boxShadow: '0 0 200px rgba(6, 182, 212, 0.4)', flexShrink: 0 }}>
              <TrendingUp size={220} strokeWidth={1} />
            </div>
            <div>
              <div className="hero-badge card card-glow" style={{ marginBottom: '10rem', fontSize: '1.25rem', letterSpacing: '1rem', padding: '2rem 6rem', width: 'fit-content', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--sui-blue)', border: '2px solid rgba(6, 182, 212, 0.5)', fontWeight: 950, borderRadius: '35px', display: 'flex', alignItems: 'center', gap: '6rem', boxShadow: '0 0 80px rgba(6, 182, 212, 0.3)' }}>
                <div className="pulse" style={{ width: '18px', height: '18px', background: 'var(--sui-blue)', borderRadius: '50%', boxShadow: '0 0 25px var(--sui-blue)' }} />
                RESERVE_INJECTION_MODULE_v9.4_FINAL
              </div>
              <h1 className="cyber-glitch-text" style={{ fontSize: '15rem', fontWeight: 950, marginBottom: '10rem', letterSpacing: '-0.0625em', margin: 0, lineHeight: 0.8 }}>RESERVE_INJECTION</h1>
              <p className="manifold-subtitle" style={{ fontSize: '4.5rem', color: 'var(--text-dim)', maxWidth: '1600px', fontWeight: 500, letterSpacing: '0.025em', lineHeight: 1.6, opacity: 0.5, marginTop: '10rem' }}>Inject precise liquidity magnitudes to operationalize role definitions and sustain autonomous distribution cycles across the decentralized neural mesh layers.</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.05)', borderColor: 'white', color: 'white', boxShadow: '0 80px 160px rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)} 
            className="btn btn-secondary card card-glow" 
            style={{ padding: '6.5rem 12rem', fontSize: '3rem', fontWeight: 950, background: 'transparent', letterSpacing: '0.8rem', borderRadius: '60px', color: 'var(--text-dim)', transition: 'all 0.6s', display: 'flex', alignItems: 'center', gap: '8rem', border: '3px solid var(--border-light)', cursor: 'pointer', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)' }}
          >
            <ArrowLeft size={100} strokeWidth={2} />
            <span>EXIT_INJECTION_MODULE</span>
          </motion.button>
        </motion.div>

        <div className="injection-manifold-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1000px', gap: '15rem', marginBottom: '35rem' }}>
          <div className="injection-main-manifold">
            <motion.div 
              initial={{ opacity: 0, x: -150 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1], duration: 1.4 }} 
              className="card card-glow" 
              style={{ padding: '20rem 15rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '150px', boxShadow: '0 120px 240px rgba(0,0,0,0.8)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12rem', marginBottom: '22rem', paddingBottom: '15rem', borderBottom: '1px dashed var(--border-light)' }}>
                <div className="card card-glow" style={{ padding: '6rem', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '60px', border: '2px solid var(--border-light)', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)' }}>
                  <Key size={150} strokeWidth={1} />
                </div>
                <div>
                  <h3 className="cyber-glitch-text" style={{ margin: 0, fontSize: '11rem', fontWeight: 950, letterSpacing: '-0.02em', lineHeight: 0.8 }}>PROTOCOL_AUTHORIZATION</h3>
                  <div style={{ fontSize: '3rem', color: 'var(--text-dim)', fontWeight: 950, letterSpacing: '1.2rem', textTransform: 'uppercase', marginTop: '8rem', opacity: 0.4 }}>SYNC_NODE: {roleId?.slice(0, 32).toUpperCase()}</div>
                </div>
              </div>
              
              <div className="injection-input-unit" style={{ marginBottom: '25rem' }}>
                <label style={{ fontWeight: 950, letterSpacing: '1.5rem', fontSize: '3rem', marginBottom: '12rem', display: 'block', textTransform: 'uppercase', color: 'var(--text-dim)', opacity: 0.4, marginLeft: '5rem' }}>VOLUMETRIC_MAGNITUDE</label>
                <div className="amount-input-manifold card card-glow" style={{ padding: '15rem 20rem', background: 'var(--bg-main)', border: '3px solid var(--border-light)', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '15rem', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)' }}>
                  <div className="pulse-radial-glow" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.15), transparent 70%)', pointerEvents: 'none' }} />
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.1"
                    min="0"
                    disabled={isProcessing}
                    style={{ fontSize: '25rem', fontWeight: 950, background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', lineHeight: 1, letterSpacing: '-0.04em' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4.5rem' }}>
                    <span className="token-suffix cyber-glitch-text" style={{ fontSize: '11rem', fontWeight: 950, color: 'var(--sui-blue)', letterSpacing: '0.2em', opacity: 1, lineHeight: 1 }}>SUI</span>
                    <div className="pulse" style={{ width: '50px', height: '50px', background: 'var(--sui-blue)', borderRadius: '50%', boxShadow: '0 0 80px var(--sui-blue)' }} />
                  </div>
                </div>
              </div>

              <div className="role-telemetry-manifold" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15rem', marginTop: '18rem' }}>
                <div className="tele-unit-card card card-glow" style={{ padding: '12rem 10rem', background: 'rgba(6, 182, 212, 0.15)', borderRadius: '100px', border: '3px solid rgba(6, 182, 212, 0.5)', textAlign: 'left', boxShadow: '0 60px 120px rgba(0,0,0,0.5)' }}>
                  <div style={{ color: 'var(--sui-blue)', fontWeight: 950, fontSize: '2rem', letterSpacing: '1rem', marginBottom: '6rem', textTransform: 'uppercase', opacity: 0.5 }}>TARGET_PROTOCOL</div>
                  <div className="cyber-glitch-text" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 950, fontSize: '7rem', wordBreak: 'break-all', lineHeight: 1, color: 'white' }}>{roleData.name}</div>
                </div>
                <div className="tele-unit-card card card-glow" style={{ padding: '12rem 10rem', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '100px', border: '3px solid rgba(34, 197, 94, 0.5)', textAlign: 'left', boxShadow: '0 60px 120px rgba(0,0,0,0.5)' }}>
                  <div style={{ color: 'var(--success)', fontWeight: 950, fontSize: '2rem', letterSpacing: '1rem', marginBottom: '6rem', textTransform: 'uppercase', opacity: 0.5 }}>RESERVE_CAPACITY</div>
                  <div className="cyber-glitch-text" style={{ color: 'var(--success)', fontWeight: 950, fontSize: '9rem', lineHeight: 1 }}>{(roleData.remainingBalance / 1_000_000_000).toFixed(4)} <span style={{ fontSize: '3.5rem', opacity: 0.5, fontWeight: 950, letterSpacing: '0.4rem' }}>SUI</span></div>
                </div>
                <div className="tele-unit-card card card-glow" style={{ padding: '12rem 10rem', background: 'var(--bg-main)', borderRadius: '80px', border: '2px solid var(--border-light)', textAlign: 'left', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)' }}>
                  <div style={{ fontWeight: 950, fontSize: '1.75rem', letterSpacing: '0.8rem', marginBottom: '6rem', color: 'var(--text-dim)', textTransform: 'uppercase', opacity: 0.4 }}>GENESIS_EPOCH</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6rem', fontSize: '3.5rem', fontWeight: 950, color: 'white', opacity: 0.7 }}>
                     <Clock size={80} color="var(--sui-blue)" strokeWidth={1} />
                     <span style={{ letterSpacing: '0.05em' }}>{formatTimestamp(roleData.startTime).toUpperCase()}</span>
                  </div>
                </div>
                <div className="tele-unit-card card card-glow" style={{ padding: '12rem 10rem', background: 'var(--bg-main)', borderRadius: '80px', border: '2px solid var(--border-light)', textAlign: 'left', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)' }}>
                  <div style={{ fontWeight: 950, fontSize: '1.75rem', letterSpacing: '0.8rem', marginBottom: '6rem', color: 'var(--text-dim)', textTransform: 'uppercase', opacity: 0.4 }}>DEPLETION_THRESHOLD</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6rem', fontSize: '3.5rem', fontWeight: 950, color: 'white', opacity: 0.7 }}>
                     <Calendar size={80} color="rgba(239, 68, 68, 0.7)" strokeWidth={1} />
                     <span style={{ letterSpacing: '0.05em' }}>{formatTimestamp(roleData.expiryTime).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 120px 240px rgba(6, 182, 212, 0.8)', filter: 'brightness(1.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSponsor}
                disabled={isProcessing || !account}
                className="btn btn-primary card card-glow"
                style={{ width: '100%', padding: '8rem', height: 'auto', background: 'var(--sui-blue)', border: 'none', borderRadius: '80px', color: 'white', fontWeight: 950, fontSize: '5rem', marginTop: '22rem', letterSpacing: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10rem', boxShadow: '0 100px 200px rgba(6, 182, 212, 0.6)', cursor: 'pointer', transition: 'all 0.6s' }}
              >
                {isProcessing ? <Activity className="spin" size={130} strokeWidth={1} /> : <Zap size={130} strokeWidth={2} />}
                <span>{isProcessing ? 'SYNCHRONIZING...' : 'AUTHORIZE_INJECTION'}</span>
              </motion.button>
              
              {!account && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8rem', marginTop: '12rem', opacity: 0.6, color: 'var(--error)' }}>
                  <ZapOff size={80} strokeWidth={1.5} />
                  <div style={{ textTransform: 'uppercase', letterSpacing: '1.2rem', fontSize: '2.5rem', fontWeight: 950 }}>
                    NEURAL_AUTH_REQUIRED: CONNECT_NODE_TO_PROCEED
                  </div>
                </motion.div>
              )}
            </motion.div>

            <div style={{ marginTop: '25rem', display: 'flex', alignItems: 'center', gap: '12rem', opacity: 0.2, borderTop: '1px dashed var(--border-light)', paddingTop: '20rem', paddingLeft: '15rem' }}>
              <ShieldCheck size={320} strokeWidth={1} color="var(--text-dim)" />
              <div style={{ fontSize: '4rem', color: 'var(--text-dim)', fontWeight: 500, lineHeight: 1.8, maxWidth: '1600px' }}>
                All injections are mathematically non-reversible and atomically bounded to the target protocol identity across the decentralized neural ledger manifold layers. Integrity verified by sub-epoch precision checks at the orbital connectivity ring.
              </div>
            </div>
          </div>

          <div className="injection-side-manifold" style={{ display: 'flex', flexDirection: 'column', gap: '15rem' }}>
            <motion.div 
              initial={{ opacity: 0, x: 150 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1], duration: 1.4 }} 
              className="card card-glow" 
              style={{ padding: '15rem 12rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '120px', boxShadow: '0 100px 200px rgba(0,0,0,0.7)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15rem', borderBottom: '1px dashed var(--border-light)', paddingBottom: '10rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10rem' }}>
                  <div className="card card-glow" style={{ padding: '4.5rem', background: 'rgba(34, 197, 94, 0.2)', color: 'var(--success)', borderRadius: '45px', border: '2px solid var(--border-light)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.7)' }}>
                    <Activity size={130} strokeWidth={1} />
                  </div>
                  <h3 className="cyber-glitch-text" style={{ textTransform: 'uppercase', letterSpacing: '0.8rem', margin: 0, fontSize: '6rem', fontWeight: 950, color: 'white', lineHeight: 1 }}>TELEMETRY</h3>
                </div>
                <div className="live-telemetry-pill card card-glow" style={{ padding: '2.5rem 8rem', background: 'rgba(34, 197, 94, 0.25)', border: '3px solid rgba(34, 197, 94, 0.7)', color: 'var(--success)', fontSize: '2rem', fontWeight: 950, letterSpacing: '0.8rem', borderRadius: '45px', display: 'flex', alignItems: 'center', gap: '5rem', boxShadow: '0 0 60px rgba(34, 197, 94, 0.4)' }}>
                  <div className="pulse" style={{ width: '32px', height: '32px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 45px var(--success)' }} />
                  <span>LIVE_FEED</span>
                </div>
              </div>

              <p style={{ fontSize: '4rem', color: 'var(--text-dim)', marginBottom: '20rem', fontWeight: 500, lineHeight: 1.8, opacity: 0.5 }}>Recent reserve adjustments synchronized with the decentralized neural ledger manifolds across global node clusters.</p>

              <div className="telemetry-feed-stack" style={{ display: 'flex', flexDirection: 'column', gap: '10rem' }}>
                {sponsorships && sponsorships.length > 0 ? (
                  sponsorships.map((sponsor, idx) => (
                    <motion.div 
                      key={`${sponsor.address}-${idx}`} 
                      initial={{ opacity: 0, x: 150 }} 
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 + 0.6, ease: [0.16, 1, 0.3, 1], duration: 1.2 }}
                      className="telemetry-item card card-glow"
                      style={{ background: 'var(--bg-main)', border: '2px solid var(--border-light)', padding: '10rem', borderRadius: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.6s', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6rem' }}>
                        <div className="card card-glow" style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--success)', border: 'none', boxShadow: '0 0 50px var(--success)' }} />
                        <div style={{ fontSize: '4rem', fontWeight: 950, fontFamily: 'JetBrains Mono', color: 'white', letterSpacing: '0.05em' }}>{shortenAddress(sponsor.address, 20).toUpperCase()}</div>
                      </div>
                      <div className="cyber-glitch-text" style={{ fontWeight: 950, color: 'var(--success)', fontSize: '6rem', letterSpacing: '-0.02em', lineHeight: 1 }}>+{(sponsor.total).toFixed(2)}_SUI</div>
                    </motion.div>
                  ))
                ) : (
                  <div className="empty-telemetry-state-cell card card-glow" style={{ padding: '35rem 10rem', textAlign: 'center', border: '6px dashed var(--border-light)', borderRadius: '100px', color: 'var(--text-dim)', fontSize: '3.5rem', fontWeight: 950, background: 'rgba(6, 182, 212, 0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15rem', boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)' }}>
                    <div className="card card-glow" style={{ width: '380px', height: '380px', borderRadius: '120px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-light)', opacity: 0.05, boxShadow: 'inset 0 0 80px rgba(0,0,0,0.8)' }}>
                       <Activity size={250} strokeWidth={0.5} />
                    </div>
                    <div style={{ letterSpacing: '1.2rem', textTransform: 'uppercase', opacity: 0.3, lineHeight: 1.6 }}>KERNEL_IDLE:<br/>NO_ACTIVITY_STREAM_DETECTED</div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '25rem', borderTop: '1px dashed var(--border-light)', paddingTop: '15rem' }}>
                <motion.button 
                  whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.05)', borderColor: 'white', color: 'white', boxShadow: '0 80px 160px rgba(0,0,0,0.7)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/live/${roleId}`)} 
                  className="btn btn-secondary card card-glow" 
                  style={{ width: '100%', gap: '8rem', justifyContent: 'center', padding: '8rem', fontWeight: 950, background: 'rgba(255,255,255,0.03)', fontSize: '4rem', letterSpacing: '0.8rem', borderRadius: '60px', border: '3px solid var(--border-light)', color: 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.6s', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)' }}
                >
                  <ArrowRight size={100} strokeWidth={2} />
                  <span>EXIT_OPERATIONAL_HANDLER</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="success-overlay-manifold" 
            style={{ position: 'fixed', inset: 0, background: 'rgba(5, 6, 8, 0.99)', backdropFilter: 'blur(150px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30rem' }}
          >
            <motion.div 
              initial={{ scale: 0.7, y: 400, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.6, opacity: 0 }} 
              transition={{ type: 'spring', damping: 50, stiffness: 200 }}
              className="success-modal-manifold card card-glow" 
              style={{ maxWidth: '1800px', width: '100%', textAlign: 'center', border: '3px solid var(--success)', background: 'var(--bg-card)', padding: '30rem 20rem', borderRadius: '150px', boxShadow: '0 0 400px rgba(34, 197, 94, 0.6)' }}
            >
              <div className="card card-glow success-icon-visual" style={{ width: '450px', height: '450px', background: 'rgba(34, 197, 94, 0.25)', border: '3px solid var(--success)', borderRadius: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15rem', boxShadow: '0 0 200px rgba(34, 197, 94, 0.9)', color: 'var(--success)' }}>
                <CheckCircle2 size={320} strokeWidth={1} className="pulse" />
              </div>
              <h2 className="cyber-glitch-text" style={{ fontSize: '15rem', fontWeight: 950, marginBottom: '12rem', color: 'white', letterSpacing: '-0.0625em', margin: 0, lineHeight: 0.8 }}>INJECTION_OK</h2>
              <div style={{ fontSize: '5rem', marginBottom: '20rem', color: 'var(--text-dim)', lineHeight: 1.6, fontWeight: 500, maxWidth: '1400px', margin: '12rem auto 20rem', opacity: 0.6 }}>The protocol operational reserves have been successfully synchronized with the new liquidity magnitude injection.</div>
              
              <div className="sync-hash-manifold card card-glow" style={{ background: 'var(--bg-main)', padding: '12rem', borderRadius: '100px', border: '3px solid var(--border-light)', marginBottom: '22rem', textAlign: 'left', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 120px rgba(0,0,0,0.9)' }}>
                <div className="diagonal-decoration" style={{ position: 'absolute', top: 0, right: 0, width: '500px', height: '500px', background: 'radial-gradient(circle at top right, rgba(6, 182, 212, 0.25), transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10rem', fontSize: '3rem', color: 'var(--text-dim)', fontWeight: 950, textTransform: 'uppercase', marginBottom: '10rem', opacity: 0.4 }}>
                  <Hash size={100} color="var(--sui-blue)" strokeWidth={1} />
                  <span style={{ letterSpacing: '1.2rem' }}>SYNCHRONIZATION_HASH</span>
                </div>
                <div className="cyber-glitch-text" style={{ fontSize: '4.5rem', color: 'var(--sui-blue)', wordBreak: 'break-all', fontWeight: 950, letterSpacing: '0.08em', display: 'block', lineHeight: 1.4, fontFamily: 'JetBrains Mono' }}>{txDigest.toUpperCase()}</div>
              </div>

              <div style={{ display: 'flex', gap: '15rem' }}>
                <motion.button 
                  whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.05)', borderColor: 'white', color: 'white', boxShadow: '0 80px 160px rgba(0,0,0,0.7)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSuccess(false)} 
                  className="btn btn-secondary card card-glow" 
                  style={{ flex: 1, padding: '8rem', fontWeight: 950, fontSize: '4.5rem', background: 'transparent', border: '4px solid var(--border-light)', color: 'var(--text-dim)', letterSpacing: '0.8rem', borderRadius: '80px', cursor: 'pointer', transition: 'all 0.6s', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)' }}
                >
                  NEW_INJECTION
                </motion.button>
                <motion.a 
                  whileHover={{ scale: 1.05, boxShadow: '0 150px 300px rgba(34, 197, 94, 0.9)', filter: 'brightness(1.2)' }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://suiscan.xyz/testnet/tx/${txDigest}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary" 
                  style={{ flex: 1, textDecoration: 'none', background: 'var(--success)', padding: '8rem', fontWeight: 950, fontSize: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10rem', color: 'white', letterSpacing: '0.8rem', borderRadius: '80px', transition: 'all 0.6s', boxShadow: '0 100px 200px rgba(34, 197, 94, 0.7)' }}
                >
                  <Globe size={130} strokeWidth={2} />
                  <span>AUDIT_LEDGER</span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <footer style={{ textAlign: 'center', marginTop: '45rem', opacity: 0.2, paddingBottom: '45rem', borderTop: '1px dashed var(--border-light)', paddingTop: '35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30rem', marginBottom: '25rem' }}>
          <Phone size={120} strokeWidth={0.5} />
          <Database size={150} strokeWidth={0.5} />
          <Layers size={120} strokeWidth={0.5} />
          <Fingerprint size={120} strokeWidth={0.5} />
          <Award size={120} strokeWidth={0.5} />
          <Grid size={120} strokeWidth={0.5} />
          <Shield size={150} strokeWidth={0.5} />
          <Cpu size={150} strokeWidth={0.5} />
          <Timer size={150} strokeWidth={0.5} />
          <Clock size={120} strokeWidth={0.5} />
          <Search size={120} strokeWidth={0.5} />
          <Activity size={150} strokeWidth={0.5} />
        </div>
        <div style={{ fontWeight: 950, letterSpacing: '6rem', fontSize: '6rem', textTransform: 'uppercase' }}>RESERVE_ENGINE_v9.4.0_FINAL_STABLE_ORBIT</div>
      </footer>
    </div>
  );
};
