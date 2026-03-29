import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScheduledPayments } from '@/hooks/useScheduledPayments';
import { useArcScheduledPayments } from '@/hooks/useArcRoles';
import { formatTimestamp } from '@/utils/dateUtils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Calendar, 
  Wallet, 
  ArrowRight, 
  Loader2, 
  ExternalLink, 
  Activity, 
  Zap, 
  TrendingUp, 
  Shield, 
  Cpu, 
  Globe, 
  Plus,
  Terminal,
  Database,
  Search,
  Check,
  Award,
  ZapOff,
  Hash,
  Navigation,
  Layers,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  Fingerprint,
  Grid,
  ShieldCheck,
  Timer,
  Layout
} from 'lucide-react';
import { shortenAddress } from '@/utils/ens';
import './ScheduledPayments.css';

export const ScheduledPayments: React.FC = () => {
  const navigate = useNavigate();
  const { data: suiPayments = [], isLoading: suiLoading } = useScheduledPayments();
  const { data: arcPayments = [], isLoading: arcLoading } = useArcScheduledPayments();

  const allPayments = [...suiPayments, ...arcPayments].sort(
    (a, b) => Number(a.scheduledTime) - Number(b.scheduledTime)
  );

  const isLoading = suiLoading || arcLoading;

  const readyPayments = allPayments.filter(p => !p.executed && Date.now() >= Number(p.scheduledTime));
  const upcomingPayments = allPayments.filter(p => !p.executed && Date.now() < Number(p.scheduledTime));

  if (isLoading) {
    return (
      <div className="scheduled-payments-page">
        <div className="ens-bg" />
        <div className="container" style={{ maxWidth: '1800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <div className="card card-glow" style={{ width: '280px', height: '280px', borderRadius: '80px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', boxShadow: '0 0 100px rgba(6, 182, 212, 0.2)' }}>
             <Activity className="spin" size={180} color="var(--sui-blue)" strokeWidth={1} />
          </div>
          <p style={{ letterSpacing: '1.5rem', fontWeight: 950, fontSize: '3rem', color: 'var(--sui-blue)', marginTop: '10rem', textTransform: 'uppercase', opacity: 0.8 }}>RESCANNING_TEMPORAL_LAYERS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scheduled-payments-page">
      <div className="ens-bg" />

      <div className="container" style={{ maxWidth: '1800px', paddingTop: '150px' }}>
        <motion.div
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.4 }}
          className="scheduled-header-manifold"
          style={{ marginBottom: '18rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px dashed var(--border-light)', paddingBottom: '12rem' }}
        >
          <div style={{ display: 'flex', gap: '10rem', alignItems: 'flex-end' }}>
            <div className="header-visual-unit card card-glow" style={{ width: '300px', height: '300px', borderRadius: '100px', background: 'var(--bg-card)', color: 'var(--sui-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)', boxShadow: '0 0 150px rgba(6, 182, 212, 0.25)', flexShrink: 0 }}>
              <Clock size={180} strokeWidth={1} />
            </div>
            <div>
              <div className="hero-badge card card-glow" style={{ marginBottom: '5rem', fontSize: '1.25rem', letterSpacing: '0.6rem', padding: '1.5rem 5rem', width: 'fit-content', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--sui-blue)', border: '2px solid rgba(6, 182, 212, 0.4)', fontWeight: 950, borderRadius: '25px', boxShadow: '0 0 60px rgba(6, 182, 212, 0.2)' }}>
                <div className="pulse" style={{ width: '15px', height: '15px', background: 'var(--sui-blue)', borderRadius: '50%', boxShadow: '0 0 20px var(--sui-blue)', marginRight: '3.5rem' }} />
                TEMPORAL_HORIZON_ACTIVE
              </div>
              <h1 className="cyber-glitch-text" style={{ fontSize: '13rem', fontWeight: 950, marginBottom: '0', letterSpacing: '-0.0625em', margin: 0, lineHeight: 0.8 }}>NETWORK_HORIZON</h1>
              <p className="manifold-subtitle" style={{ fontSize: '3.5rem', color: 'var(--text-dim)', maxWidth: '1400px', fontWeight: 500, letterSpacing: '0.025em', lineHeight: 1.6, opacity: 0.8, marginTop: '8rem' }}>Real-time monitoring of automated protocol triggers and scheduled distributions across the decentralized neural mesh manifolds.</p>
            </div>
          </div>
          
          <div className="status-stats-row" style={{ display: 'flex', gap: '8rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.98, x: 80 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.3 }} className="stat-pill-manifold card card-glow" style={{ padding: '6rem 10rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '60px', textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
              <div className="stat-value cyber-glitch-text" style={{ color: 'var(--success)', fontSize: '10rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1 }}>{readyPayments.length}</div>
              <div className="stat-label" style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.6rem', marginTop: '3.5rem', opacity: 0.5 }}>READY_DISPATCH</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.98, x: 80 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.4 }} className="stat-pill-manifold card card-glow" style={{ padding: '6rem 10rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '60px', textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
              <div className="stat-value cyber-glitch-text" style={{ color: 'var(--sui-blue)', fontSize: '10rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1 }}>{upcomingPayments.length}</div>
              <div className="stat-label" style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.6rem', marginTop: '3.5rem', opacity: 0.5 }}>TEMPORAL_QUEUE</div>
            </motion.div>
          </div>
        </motion.div>

        {allPayments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="empty-temporal-manifold card card-glow"
            style={{ padding: '30rem 20rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '120px', textAlign: 'center', marginBottom: '25rem', boxShadow: '0 100px 200px rgba(0,0,0,0.6)' }}
          >
            <div className="card card-glow" style={{ width: '380px', height: '380px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15rem', color: 'var(--text-dim)', opacity: 0.1, boxShadow: 'inset 0 0 80px rgba(0,0,0,0.7)' }}>
              <Calendar size={250} strokeWidth={0.5} />
            </div>
            <h2 className="cyber-glitch-text" style={{ fontSize: '12rem', fontWeight: 950, marginBottom: '10rem', letterSpacing: '-0.04em', margin: 0, lineHeight: 1 }}>LEDGER_VOID_INITIALIZED</h2>
            <p style={{ fontSize: '4rem', color: 'var(--text-dim)', marginBottom: '18rem', maxWidth: '1400px', margin: '6rem auto 18rem', lineHeight: 1.8, fontWeight: 500, opacity: 0.8 }}>The temporal ledger detects no pending distribution events in the current orbital epoch. Configure a role protocol to schedule automated dispatches across the mesh.</p>
            <motion.button 
              whileHover={{ scale: 1.05, filter: 'brightness(1.1)', boxShadow: '0 80px 160px rgba(6, 182, 212, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create')}
              className="btn btn-primary"
              style={{ padding: '6rem 20rem', fontSize: '3rem', fontWeight: 950, letterSpacing: '0.6rem', borderRadius: '60px', border: 'none', cursor: 'pointer', background: 'var(--sui-blue)', color: 'white', transition: 'all 0.5s', display: 'flex', alignItems: 'center', gap: '6rem', margin: '0 auto', boxShadow: '0 60px 120px rgba(6, 182, 212, 0.4)' }}
            >
              <Plus size={80} strokeWidth={3} />
              <span>INITIALIZE_ARCHITECTURE</span>
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30rem', marginBottom: '35rem' }}>
            {readyPayments.length > 0 && (
              <div className="temporal-manifold-section">
                <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '150px', borderBottom: '1px dashed var(--border-light)', paddingBottom: '8rem' }}>
                  <div className="manifold-title-unit" style={{ display: 'flex', alignItems: 'center', gap: '8rem' }}>
                    <div className="card card-glow" style={{ padding: '4rem', background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', borderRadius: '45px', border: '1px solid var(--border-light)', boxShadow: '0 0 50px rgba(34, 197, 94, 0.1)' }}>
                      <Zap size={100} strokeWidth={1} />
                    </div>
                    <h2 className="cyber-glitch-text" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 950, fontSize: '8rem', margin: 0, lineHeight: 1 }}>EXECUTABLE_PIPELINE</h2>
                  </div>
                  <div className="card card-glow" style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--success)', letterSpacing: '0.6rem', background: 'rgba(34, 197, 94, 0.2)', padding: '2.5rem 8rem', borderRadius: '35px', border: '2px solid rgba(34, 197, 94, 0.5)', boxShadow: '0 0 30px rgba(34, 197, 94, 0.2)' }}>STATE::OPTIMAL_SYNC</div>
                </div>

                <div className="protocol-trigger-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(750px, 1fr))', gap: '12rem' }}>
                  {readyPayments.map((payment, idx) => (
                    <motion.div
                      key={`ready-${payment.chain}-${payment.roleId}-${idx}`}
                      initial={{ opacity: 0, y: 80, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -30, scale: 1.03, borderColor: 'var(--success)', background: 'rgba(34, 197, 94, 0.08)', boxShadow: '0 80px 160px rgba(0,0,0,0.7)' }}
                      transition={{ delay: idx * 0.08, ease: [0.16, 1, 0.3, 1], duration: 1 }}
                      className="temporal-card-manifold card card-glow"
                      style={{ padding: '12rem 10rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '100px', position: 'relative', overflow: 'hidden', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 60px 120px rgba(0,0,0,0.5)' }}
                    >
                      <div className="card-dynamic-radial" style={{ position: 'absolute', top: 0, right: 0, width: '450px', height: '450px', background: 'radial-gradient(circle at top right, rgba(34, 197, 94, 0.15), transparent 75%)', pointerEvents: 'none', zIndex: 0 }} />
                      
                      <div className="trigger-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12rem', position: 'relative', zIndex: 1 }}>
                        <div className="trigger-title-cell" style={{ display: 'flex', alignItems: 'center', gap: '6rem' }}>
                          <div className="card card-glow" style={{ padding: '3.5rem', background: 'var(--bg-main)', color: 'var(--success)', borderRadius: '40px', border: '1px solid var(--border-light)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)' }}>
                            <Fingerprint size={96} strokeWidth={1} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <h3 className="cyber-glitch-text" style={{ fontSize: '5rem', fontWeight: 950, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1, color: 'white' }}>{payment.roleName?.toUpperCase() || 'NEURAL_ROLE'}</h3>
                            <span style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.4rem', fontFamily: 'JetBrains Mono', opacity: 0.5 }}>HASH_ID: {payment.roleId.slice(0, 24).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="chain-indicator-badge card card-glow" style={{ background: payment.chain === 'sui' ? 'var(--sui-blue)' : '#f59e0b', color: 'white', fontWeight: 950, padding: '2.5rem 60px', borderRadius: '25px', fontSize: '1.75rem', letterSpacing: '0.5rem', boxShadow: '0 15px 40px rgba(0,0,0,0.3)' }}>
                          {payment.chain.toUpperCase()}
                        </div>
                      </div>

                      <div className="trigger-card-analytics" style={{ background: 'var(--bg-main)', padding: '10rem 8rem', borderRadius: '70px', border: '1px solid var(--border-light)', marginBottom: '12rem', position: 'relative', zIndex: 1, boxShadow: 'inset 0 0 80px rgba(0,0,0,0.7)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8rem', borderBottom: '1px dashed var(--border-light)', paddingBottom: '6rem' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.6rem', textTransform: 'uppercase', opacity: 0.5 }}>ENDPOINT</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 950, fontFamily: 'JetBrains Mono', color: 'white' }}>{shortenAddress(payment.recipient, 20).toUpperCase()}</span>
                            <motion.a whileHover={{ scale: 1.25, color: 'var(--sui-blue)' }} href={`https://suiscan.xyz/testnet/address/${payment.recipient}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-dim)', opacity: 0.6 }}>
                               <ExternalLink size={48} strokeWidth={1} />
                            </motion.a>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8rem', borderBottom: '1px dashed var(--border-light)', paddingBottom: '6rem' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.6rem', textTransform: 'uppercase', opacity: 0.5 }}>MAGNITUDE</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
                             <TrendingUp size={72} color="var(--success)" strokeWidth={1.5} />
                             <span className="cyber-glitch-text" style={{ color: 'var(--success)', fontSize: '7rem', fontWeight: 950, letterSpacing: '-0.02em', lineHeight: 1 }}>
                              {typeof payment.amount === 'number' 
                                ? (payment.amount / 1_000_000_000).toFixed(4)
                                : payment.amount
                              } <span style={{ fontSize: '2.5rem', opacity: 0.6, fontWeight: 950, letterSpacing: '0.2rem' }}>{payment.chain === 'sui' ? 'SUI' : 'USDC'}</span>
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', textTransform: 'uppercase', opacity: 0.5 }}>DESIGNATION</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', fontWeight: 950, color: 'var(--success)', fontSize: '3rem', letterSpacing: '0.2rem' }}>
                            <CheckCircle2 size={64} strokeWidth={1} /> <span className="cyber-glitch-text">VALIDATED_READY</span>
                          </div>
                        </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.05, background: 'var(--success)', color: 'white', boxShadow: '0 60px 120px rgba(34, 197, 94, 0.4)', borderColor: 'var(--success)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/live/${payment.roleId}`)}
                        className="btn-trigger-action"
                        style={{ width: '100%', padding: '4.5rem', fontSize: '2.25rem', fontWeight: 950, gap: '5rem', background: 'transparent', color: 'var(--success)', borderRadius: '45px', border: '3px solid var(--success)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '0.6rem', transition: 'all 0.5s', position: 'relative', zIndex: 1, boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
                      >
                        <Terminal size={56} strokeWidth={2} />
                        <span>MONITOR_AUTO_EXECUTION</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {upcomingPayments.length > 0 && (
              <div className="temporal-manifold-section">
                <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '150px', borderBottom: '1px dashed var(--border-light)', paddingBottom: '8rem' }}>
                  <div className="manifold-title-unit" style={{ display: 'flex', alignItems: 'center', gap: '8rem' }}>
                    <div className="card card-glow" style={{ padding: '4rem', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--sui-blue)', borderRadius: '45px', border: '1px solid var(--border-light)', boxShadow: '0 0 50px rgba(6, 182, 212, 0.1)' }}>
                      <Layers size={100} strokeWidth={1} />
                    </div>
                    <h2 className="cyber-glitch-text" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 950, fontSize: '8rem', margin: 0, lineHeight: 1 }}>TEMPORAL_HORIZON</h2>
                  </div>
                  <div className="card card-glow" style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.6rem', background: 'rgba(255, 255, 255, 0.08)', padding: '2.5rem 8rem', borderRadius: '35px', border: '2px solid var(--border-light)', boxShadow: '0 0 30px rgba(255,255,255,0.05)' }}>STATE::QUEUED_STABLE</div>
                </div>

                <div className="protocol-trigger-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(750px, 1fr))', gap: '12rem' }}>
                  {upcomingPayments.map((payment, idx) => (
                    <motion.div
                      key={`upcoming-${payment.chain}-${payment.roleId}-${idx}`}
                      initial={{ opacity: 0, y: 80, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -30, scale: 1.03, borderColor: 'var(--sui-blue)', background: 'rgba(6, 182, 212, 0.08)', boxShadow: '0 80px 160px rgba(0,0,0,0.7)' }}
                      transition={{ delay: idx * 0.08, ease: [0.16, 1, 0.3, 1], duration: 1 }}
                      className="temporal-card-manifold card card-glow"
                      style={{ padding: '12rem 10rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '100px', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative', overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.5)' }}
                    >
                      <div className="card-dynamic-radial" style={{ position: 'absolute', top: 0, right: 0, width: '450px', height: '450px', background: 'radial-gradient(circle at top right, rgba(6, 182, 212, 0.15), transparent 75%)', pointerEvents: 'none', zIndex: 0 }} />
                      
                      <div className="trigger-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12rem', position: 'relative', zIndex: 1 }}>
                        <div className="trigger-title-cell" style={{ display: 'flex', alignItems: 'center', gap: '6rem' }}>
                          <div className="card card-glow" style={{ padding: '3.5rem', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '40px', border: '1px solid var(--border-light)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)' }}>
                            <Clock size={96} strokeWidth={1} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <h3 className="cyber-glitch-text" style={{ fontSize: '5rem', fontWeight: 950, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1, color: 'white' }}>{payment.roleName?.toUpperCase() || 'ARCHIVAL_ROLE'}</h3>
                            <span style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.4rem', fontFamily: 'JetBrains Mono', opacity: 0.5 }}>HASH_ID: {payment.roleId.slice(0, 24).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="chain-indicator-badge card card-glow" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-dim)', fontWeight: 950, padding: '2.5rem 60px', borderRadius: '25px', fontSize: '1.75rem', letterSpacing: '0.5rem', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)' }}>{payment.chain.toUpperCase()}</div>
                      </div>

                      <div className="trigger-card-analytics" style={{ background: 'var(--bg-main)', padding: '10rem 8rem', borderRadius: '70px', border: '1px solid var(--border-light)', marginBottom: '12rem', position: 'relative', zIndex: 1, boxShadow: 'inset 0 0 80px rgba(0,0,0,0.7)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8rem', borderBottom: '1px dashed var(--border-light)', paddingBottom: '6rem' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.6rem', textTransform: 'uppercase', opacity: 0.5 }}>ENDPOINT</span>
                          <span style={{ fontSize: '2.5rem', fontWeight: 950, fontFamily: 'JetBrains Mono', color: 'white' }}>{shortenAddress(payment.recipient, 20).toUpperCase()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8rem', borderBottom: '1px dashed var(--border-light)', paddingBottom: '6rem' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.6rem', textTransform: 'uppercase', opacity: 0.5 }}>MAGNITUDE</span>
                          <span className="cyber-glitch-text" style={{ fontSize: '6rem', fontWeight: 950, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>
                            {typeof payment.amount === 'number'
                              ? (payment.amount / 1_000_000_000).toFixed(4)
                              : payment.amount
                            } <span style={{ fontSize: '2.25rem', opacity: 0.6, fontWeight: 950, letterSpacing: '0.2rem' }}>{payment.chain === 'sui' ? 'SUI' : 'USDC'}</span>
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', textTransform: 'uppercase', opacity: 0.5 }}>DISPATCH_EPOCH</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', color: 'var(--sui-blue)', fontWeight: 950, fontSize: '2.5rem', fontFamily: 'JetBrains Mono' }}>
                            <Calendar size={48} strokeWidth={1.5} />
                            <span>{format(Number(payment.scheduledTime), 'MMM dd | HH:mm').toUpperCase()}</span>
                          </div>
                        </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.05, background: 'rgba(6, 182, 212, 0.15)', borderColor: 'var(--sui-blue)', color: 'var(--sui-blue)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/live/${payment.roleId}`)}
                        className="btn-trigger-action-secondary"
                        style={{ width: '100%', padding: '4rem', fontSize: '2rem', fontWeight: 950, gap: '4rem', background: 'transparent', letterSpacing: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--border-light)', borderRadius: '40px', color: 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.5s', position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                      >
                        <Navigation size={48} strokeWidth={1.5} />
                        <span>INSPECT_PARAMETERS</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 150 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              className="automation-kernel-manifold card card-glow"
              style={{ padding: '18rem 15rem', borderRadius: '120px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '15rem', alignItems: 'center', boxShadow: '0 100px 200px rgba(0,0,0,0.7)' }}
            >
              <div className="kernel-icon-cell card card-glow" style={{ width: '320px', height: '320px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sui-blue)', flexShrink: 0, boxShadow: 'inset 0 0 100px rgba(0,0,0,0.7)' }}>
                <Cpu size={220} strokeWidth={0.5} />
              </div>
              <div className="kernel-content-cell">
                <h4 className="cyber-glitch-text" style={{ fontSize: '9rem', fontWeight: 950, letterSpacing: '-0.04em', marginBottom: '6rem', color: 'white', lineHeight: 1.1 }}>NEURAL_AUTOMATION_KERNEL</h4>
                <p style={{ color: 'var(--text-dim)', fontSize: '3.5rem', lineHeight: 1.8, marginBottom: '12rem', fontWeight: 500, opacity: 0.8 }}>
                  The RoleZero execution kernel monitors all scheduled distributions with sub-millisecond precision. 
                  When the ledger block time aligns with the scheduled release epoch, the protocol triggers atomic 
                  cross-chain dispatch cycles without manual intervention. All automation is decentralized and secured by the kernel manifold.
                </p>
                <div style={{ display: 'flex', gap: '20rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6rem' }}>
                    <div className="card card-glow" style={{ padding: '3.5rem', background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', borderRadius: '40px', border: '1px solid var(--border-light)', boxShadow: '0 0 50px rgba(34, 197, 94, 0.2)' }}>
                      <Shield size={80} strokeWidth={1} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.6rem', marginBottom: '2.5rem', opacity: 0.5 }}>INTEGRITY_SHIELD</div>
                      <div className="cyber-glitch-text" style={{ fontSize: '4rem', fontWeight: 950, color: 'white', lineHeight: 1 }}>IMMUTABLE_LOGIC_v4.5</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6rem' }}>
                    <div className="card card-glow" style={{ padding: '3.5rem', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--sui-blue)', borderRadius: '40px', border: '1px solid var(--border-light)', boxShadow: '0 0 50px rgba(6, 182, 212, 0.2)' }}>
                      <Globe size={80} strokeWidth={1} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.6rem', marginBottom: '2.5rem', opacity: 0.5 }}>MESH_CONNECTIVITY</div>
                      <div className="cyber-glitch-text" style={{ fontSize: '4rem', fontWeight: 950, color: 'white', lineHeight: 1 }}>CROSS-CHAIN_HYPER_SYNC</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        <footer style={{ textAlign: 'center', opacity: 0.2, borderTop: '1px dashed var(--border-light)', paddingTop: '25rem', paddingBottom: '35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '25rem', marginBottom: '18rem' }}>
            <Smartphone size={100} strokeWidth={0.5} />
            <Database size={120} strokeWidth={0.5} />
            <Activity className="pulse" size={120} strokeWidth={0.5} />
            <Fingerprint size={100} strokeWidth={0.5} />
            <Grid size={100} strokeWidth={0.5} />
            <Shield size={100} strokeWidth={0.5} />
            <Award size={100} strokeWidth={0.5} />
            <Timer size={120} strokeWidth={0.5} />
            <Cpu size={120} strokeWidth={0.5} />
            <Clock size={100} strokeWidth={0.5} />
            <Globe size={100} strokeWidth={0.5} />
            <Layout size={100} strokeWidth={0.5} />
          </div>
          <div style={{ fontWeight: 950, letterSpacing: '5rem', fontSize: '4rem', textTransform: 'uppercase' }}>NEURAL_HORIZON_MONITOR_v9.2.0_STABLE_NOMINAL</div>
        </footer>
      </div>
    </div>
  );
};
