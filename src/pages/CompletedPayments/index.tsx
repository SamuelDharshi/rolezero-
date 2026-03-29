import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompletedPayments } from '@/hooks/useCompletedPayments';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ExternalLink, 
  Wallet, 
  Calendar, 
  Loader2, 
  TrendingUp, 
  Shield, 
  Activity, 
  Cpu, 
  Globe, 
  Zap,
  ArrowRight,
  Database,
  History,
  Check,
  Search,
  Terminal,
  Award,
  Hash,
  ArrowUpRight,
  Clock,
  Layers,
  Navigation,
  Smartphone,
  Fingerprint,
  Grid,
  ShieldCheck,
  Timer,
  Layout
} from 'lucide-react';
import { shortenAddress } from '@/utils/ens';
import './CompletedPayments.css';

export const CompletedPayments: React.FC = () => {
  const navigate = useNavigate();
  const { data: payments = [], isLoading } = useCompletedPayments();

  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => {
    const amount = typeof p.amount === 'number' ? p.amount / 1_000_000_000 : parseFloat(p.amount) || 0;
    return sum + amount;
  }, 0);

  if (isLoading) {
    return (
      <div className="completed-payments-page">
        <div className="ens-bg" />
        <div className="container" style={{ maxWidth: '1800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <div className="card card-glow loading-node-unit" style={{ width: '450px', height: '450px', borderRadius: '150px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid var(--border-light)', boxShadow: '0 0 200px rgba(34, 197, 94, 0.4)' }}>
             <History className="spin" size={250} color="var(--success)" strokeWidth={1} />
          </div>
          <p style={{ letterSpacing: '2rem', fontWeight: 950, fontSize: '4.5rem', color: 'var(--success)', marginTop: '15rem', textTransform: 'uppercase', opacity: 0.8 }}>SYNCING_ARCHIVAL_SHARDS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="completed-payments-page">
      <div className="ens-bg" />

      <div className="container" style={{ maxWidth: '1800px', paddingTop: '150px' }}>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.4 }}
          className="completed-header-manifold"
          style={{ marginBottom: '22rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px dashed var(--border-light)', paddingBottom: '150px' }}
        >
          <div style={{ display: 'flex', gap: '15rem', alignItems: 'flex-end' }}>
            <div className="header-visual-unit card card-glow" style={{ width: '380px', height: '380px', borderRadius: '120px', background: 'var(--bg-card)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-subtle)', boxShadow: '0 0 200px rgba(34, 197, 94, 0.4)', flexShrink: 0 }}>
              <Database size={220} strokeWidth={1} />
            </div>
            <div>
              <div className="hero-badge card card-glow" style={{ marginBottom: '6rem', fontSize: '1.25rem', letterSpacing: '0.8rem', padding: '2rem 7rem', width: 'fit-content', background: 'rgba(34, 197, 94, 0.2)', color: 'var(--success)', border: '2px solid rgba(34, 197, 94, 0.5)', fontWeight: 950, borderRadius: '35px', boxShadow: '0 0 80px rgba(34, 197, 94, 0.3)' }}>
                <div className="pulse" style={{ width: '18px', height: '18px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 25px var(--success)', marginRight: '4rem' }} />
                ARCHIVAL_MANIFEST_STABLE_v9.4
              </div>
              <h1 className="cyber-glitch-text" style={{ fontSize: '15rem', fontWeight: 950, marginBottom: '0', letterSpacing: '-0.0625em', margin: 0, lineHeight: 0.8 }}>ARCHIVE_MANIFEST</h1>
              <p className="manifold-subtitle" style={{ fontSize: '4.5rem', color: 'var(--text-dim)', maxWidth: '1600px', fontWeight: 500, letterSpacing: '0.025em', lineHeight: 1.6, opacity: 0.6, marginTop: '10rem' }}>Verified historical distribution records secured across the decentralized neural archival layer with sub-epoch precision.</p>
            </div>
          </div>
          
          <div className="status-stats-row" style={{ display: 'flex', gap: '12rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.98, x: 100 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.3 }} className="stat-pill-manifold card card-glow" style={{ padding: '8rem 12rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '80px', textAlign: 'center', boxShadow: '0 60px 120px rgba(0,0,0,0.7)' }}>
              <div className="stat-value cyber-glitch-text" style={{ color: 'white', fontSize: '15rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1 }}>{totalPayments}</div>
              <div className="stat-label" style={{ fontSize: '2.25rem', fontWeight: 950, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1rem', marginTop: '5rem', opacity: 0.4 }}>VERIFIED_EVENTS</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.98, x: 100 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.4 }} className="stat-pill-manifold card card-glow" style={{ padding: '8rem 12rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '80px', textAlign: 'center', boxShadow: '0 60px 120px rgba(0,0,0,0.7)' }}>
              <div className="stat-value cyber-glitch-text" style={{ color: 'var(--sui-blue)', fontSize: '15rem', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1 }}>{totalAmount.toFixed(2)}</div>
              <div className="stat-label" style={{ fontSize: '2.25rem', fontWeight: 950, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1rem', marginTop: '5rem', opacity: 0.4 }}>AGGREGATE_MAGNITUDE</div>
            </motion.div>
          </div>
        </motion.div>

        {payments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 150 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="empty-temporal-manifold card card-glow"
            style={{ padding: '45rem 25rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '150px', textAlign: 'center', marginBottom: '45rem', boxShadow: '0 150px 300px rgba(0,0,0,0.8)' }}
          >
            <div className="card card-glow" style={{ width: '550px', height: '550px', background: 'var(--bg-main)', border: '2px solid var(--border-light)', borderRadius: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18rem', color: 'var(--text-dim)', opacity: 0.1, boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)' }}>
              <History size={350} strokeWidth={0.5} />
            </div>
            <h2 className="cyber-glitch-text" style={{ fontSize: '18rem', fontWeight: 950, marginBottom: '15rem', letterSpacing: '-0.04em', margin: 0, lineHeight: 0.8 }}>SILENT_ARCHIVE</h2>
            <p style={{ fontSize: '5.5rem', color: 'var(--text-dim)', marginBottom: '30rem', maxWidth: '1800px', margin: '10rem auto 30rem', lineHeight: 1.8, fontWeight: 500, opacity: 0.4 }}>No distribution events have been recorded in the distributed neural ledger. Execute a protocol dispatch to populate the global manifest layers.</p>
            <motion.button 
              whileHover={{ scale: 1.05, filter: 'brightness(1.2)', boxShadow: '0 150px 300px rgba(34, 197, 94, 0.8)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create')}
              className="btn btn-primary card card-glow"
              style={{ padding: '9rem 45rem', fontSize: '5rem', fontWeight: 950, letterSpacing: '1.2rem', borderRadius: '100px', border: 'none', cursor: 'pointer', background: 'var(--success)', color: 'white', transition: 'all 0.8s', display: 'flex', alignItems: 'center', gap: '10rem', margin: '0 auto', boxShadow: '0 100px 200px rgba(34, 197, 94, 0.6)' }}
            >
              <Zap size={140} strokeWidth={3} />
              <span>INITIALIZE_DISPATCH</span>
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '45rem', marginBottom: '55rem' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 200 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              className="automation-kernel-manifold card card-glow"
              style={{ padding: '30rem 25rem', borderRadius: '200px', background: 'var(--bg-card)', border: '2px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '25rem', alignItems: 'center', boxShadow: '0 180px 360px rgba(0,0,0,0.9)' }}
            >
              <div className="kernel-icon-cell card card-glow" style={{ width: '450px', height: '450px', background: 'var(--bg-main)', border: '2px solid var(--border-light)', borderRadius: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', flexShrink: 0, boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)' }}>
                <Shield size={350} strokeWidth={0.5} />
              </div>
              <div className="kernel-content-cell">
                <h4 className="cyber-glitch-text" style={{ fontSize: '13rem', fontWeight: 950, letterSpacing: '-0.04em', marginBottom: '10rem', color: 'white', lineHeight: 0.8 }}>INTEGRITY_MANIFEST</h4>
                <p style={{ color: 'var(--text-dim)', fontSize: '5.5rem', lineHeight: 1.8, marginBottom: '22rem', fontWeight: 500, opacity: 0.5, maxWidth: '2200px' }}>
                  The RoleZero audit kernel monitors all distribution outcomes with cryptographic certainty. 
                  Every historical event is inscribed across a distributed neural ledger, ensuring 
                  mathematical transparency and permanent accessibility for all network participants.
                </p>
                <div style={{ display: 'flex', gap: '30rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10rem' }}>
                    <div className="card card-glow" style={{ padding: '5rem', background: 'rgba(34, 197, 94, 0.25)', color: 'var(--success)', borderRadius: '60px', border: '2px solid var(--border-light)', boxShadow: '0 0 80px rgba(34, 197, 94, 0.4)' }}>
                      <CheckCircle2 size={120} strokeWidth={1} />
                    </div>
                    <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1rem', marginBottom: '4rem', opacity: 0.4 }}>ASSURANCE_LAYER</div>
                      <div className="cyber-glitch-text" style={{ fontSize: '6rem', fontWeight: 950, color: 'white', lineHeight: 1 }}>IMMUTABLE_LOGS_v9.4</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10rem' }}>
                    <div className="card card-glow" style={{ padding: '5rem', background: 'rgba(6, 182, 212, 0.25)', color: 'var(--sui-blue)', borderRadius: '60px', border: '2px solid var(--border-light)', boxShadow: '0 0 80px rgba(6, 182, 212, 0.4)' }}>
                      <Search size={120} strokeWidth={1} />
                    </div>
                    <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1rem', marginBottom: '4rem', opacity: 0.4 }}>AUDIT_KERNEL</div>
                      <div className="cyber-glitch-text" style={{ fontSize: '6rem', fontWeight: 950, color: 'white', lineHeight: 1 }}>TRACEABLE_ORIGIN_SYNC</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="protocol-trigger-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(1300px, 1fr))', gap: '22rem' }}>
              <AnimatePresence mode="popLayout">
                {payments.map((payment, idx) => {
                  const amount = typeof payment.amount === 'number'
                    ? (payment.amount / 1_000_000_000).toFixed(4)
                    : payment.amount;

                  const explorerUrl = payment.chain === 'sui'
                    ? `https://suiscan.xyz/testnet/tx/${payment.transactionHash}`
                    : `https://explorer.${payment.chain}.com/tx/${payment.transactionHash}`;

                  return (
                    <motion.div
                      key={`${payment.transactionHash}-${idx}`}
                      initial={{ opacity: 0, y: 150, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -60, scale: 1.03, borderColor: 'var(--success)', background: 'rgba(34, 197, 94, 0.15)', boxShadow: '0 150px 300px rgba(0,0,0,0.9)' }}
                      transition={{ delay: idx % 4 * 0.15, ease: [0.16, 1, 0.3, 1], duration: 1.6 }}
                      className="temporal-card-manifold card card-glow"
                      style={{ padding: '22rem 18rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '150px', position: 'relative', overflow: 'hidden', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 100px 200px rgba(0,0,0,0.7)' }}
                    >
                      <div className="success-ribbon card card-glow" style={{ position: 'absolute', top: '10rem', right: '120px', padding: '3.5rem 100px', fontSize: '2.25rem', fontWeight: 950, borderRadius: '50px', background: 'rgba(34, 197, 94, 0.25)', color: 'var(--success)', border: '4px solid rgba(34, 197, 94, 0.7)', display: 'flex', alignItems: 'center', gap: '8rem', letterSpacing: '0.8rem', boxShadow: '0 0 100px rgba(34, 197, 94, 0.4)', zIndex: 1 }}>
                        <CheckCircle2 size={80} strokeWidth={3} />
                        <span>VERIFIED</span>
                      </div>

                      <div className="trigger-card-header" style={{ marginBottom: '18rem', marginTop: '10rem', position: 'relative', zIndex: 1 }}>
                        <div className="trigger-title-cell" style={{ display: 'flex', alignItems: 'center', gap: '10rem' }}>
                          <div className="card card-glow" style={{ padding: '6rem', background: 'var(--bg-main)', color: 'var(--success)', borderRadius: '60px', border: '2px solid var(--border-light)', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.8)' }}>
                             <ArrowUpRight size={150} strokeWidth={1} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
                            <h3 className="cyber-glitch-text" style={{ fontSize: '8rem', fontWeight: 950, margin: 0, letterSpacing: '-0.025em', color: 'white', lineHeight: 1.1 }}>{payment.roleName?.toUpperCase() || 'PROTOCOL_EVENT'}</h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.6rem', fontFamily: 'JetBrains Mono', opacity: 0.4 }}>HASH: {payment.transactionHash.slice(0, 32).toUpperCase()}</div>
                          </div>
                        </div>
                        <div className="chain-indicator-badge card card-glow" style={{ background: payment.chain === 'sui' ? 'var(--sui-blue)' : '#f59e0b', color: 'white', fontWeight: 950, border: 'none', padding: '4.5rem 100px', borderRadius: '50px', fontSize: '3rem', marginTop: '15rem', display: 'inline-block', letterSpacing: '0.8rem', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
                          {payment.chain?.toUpperCase() || 'SUI_MAINNET'}
                        </div>
                      </div>

                      <div className="trigger-card-analytics" style={{ background: 'var(--bg-main)', padding: '18rem 150px', borderRadius: '120px', border: '2px solid var(--border-light)', marginBottom: '18rem', position: 'relative', zIndex: 1, boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12rem', borderBottom: '1px dashed var(--border-light)', paddingBottom: '10rem' }}>
                          <span style={{ fontSize: '2.25rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '1rem', textTransform: 'uppercase', opacity: 0.4 }}>ENDPOINT</span>
                          <span style={{ fontSize: '4.5rem', fontWeight: 950, fontFamily: 'JetBrains Mono', color: 'white' }}>{shortenAddress(payment.recipient, 20).toUpperCase()}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12rem', borderBottom: '1px dashed var(--border-light)', paddingBottom: '10rem' }}>
                          <span style={{ fontSize: '2.25rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '1rem', textTransform: 'uppercase', opacity: 0.4 }}>MAGNITUDE</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8rem' }}>
                             <TrendingUp size={130} color="var(--success)" strokeWidth={1.5} />
                             <span className="cyber-glitch-text" style={{ color: 'var(--success)', fontSize: '11rem', fontWeight: 950, letterSpacing: '-0.03em', lineHeight: 1 }}>
                              {amount} <span style={{ fontSize: '4.5rem', opacity: 0.5, fontWeight: 950, letterSpacing: '0.4rem' }}>{payment.chain === 'sui' ? 'SUI' : 'USDC'}</span>
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12rem', borderBottom: '1px dashed var(--border-light)', paddingBottom: '10rem' }}>
                          <span style={{ fontSize: '2.25rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '1.25rem', textTransform: 'uppercase', opacity: 0.4 }}>EPOCH_EXECUTION</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8rem' }}>
                            <Calendar size={100} color="var(--sui-blue)" strokeWidth={1.5} />
                            <span style={{ fontSize: '4rem', fontWeight: 950, fontFamily: 'JetBrains Mono', color: 'white' }}>{format(Number(payment.executedAt) || Date.now(), 'MMM dd | HH:mm').toUpperCase()}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '2.25rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '1.25rem', textTransform: 'uppercase', opacity: 0.4 }}>PROOF_HASH</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8rem', color: 'var(--text-dim)', opacity: 0.3 }}>
                            <Hash size={80} />
                            <span style={{ fontSize: '3rem', fontWeight: 950, fontFamily: 'JetBrains Mono' }}>{payment.transactionHash.slice(0, 48).toUpperCase()}...</span>
                          </div>
                        </div>
                      </div>

                      <motion.a
                        whileHover={{ scale: 1.05, background: 'var(--sui-blue)', color: 'white', borderColor: 'var(--sui-blue)', boxShadow: '0 100px 200px rgba(6, 182, 212, 0.6)', filter: 'brightness(1.2)' }}
                        whileTap={{ scale: 0.95 }}
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary card card-glow"
                        style={{ background: 'transparent', fontWeight: 950, fontSize: '3.5rem', padding: '7rem', borderRadius: '70px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10rem', color: 'var(--text-dim)', border: '4px solid var(--border-light)', letterSpacing: '0.8rem', cursor: 'pointer', transition: 'all 0.6s', position: 'relative', zIndex: 1, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)' }}
                      >
                        <Terminal size={100} strokeWidth={2} />
                        <span>QUERY_BLOCKCHAIN_LEDGER</span>
                      </motion.a>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <details className="automation-kernel-manifold card card-glow" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-card)', border: '2px solid var(--border-subtle)', borderRadius: '200px', marginBottom: '55rem', boxShadow: '0 180px 360px rgba(0,0,0,0.9)' }}>
              <summary style={{ border: 'none', background: 'none', padding: '25rem', display: 'flex', alignItems: 'center', gap: '20rem', cursor: 'pointer', outline: 'none' }}>
                <div className="kernel-icon-cell card card-glow" style={{ width: '350px', height: '350px', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '100px', border: '2px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 120px rgba(0,0,0,0.9)' }}>
                  <History size={180} strokeWidth={1} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                  <span className="cyber-glitch-text" style={{ fontWeight: 950, fontSize: '11rem', letterSpacing: '0.05em', color: 'white', lineHeight: 1 }}>TEMPORAL_ARCHIVAL_STREAM</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10rem', fontSize: '3rem', fontWeight: 950, color: 'var(--text-dim)', opacity: 0.4, letterSpacing: '1rem', textTransform: 'uppercase' }}>
                    <Activity size={80} className="pulse" /> REGISTRY::STABLE_NOMINAL_SYNCED_v9.4
                  </div>
                </div>
              </summary>
              
              <div className="temporal-stream-container" style={{ padding: '0 25rem 35rem', display: 'flex', flexDirection: 'column', gap: '25rem' }}>
                {payments.map((payment, idx) => (
                  <motion.div
                    key={`timeline-${idx}`}
                    initial={{ opacity: 0, x: -150 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.12, ease: [0.16, 1, 0.3, 1], duration: 1.4 }}
                    className="temporal-shard-shard"
                    style={{ display: 'flex', gap: '20rem', position: 'relative' }}
                  >
                    <div className="shard-marker-unit card card-glow" style={{ width: '250px', height: '250px', borderRadius: '50%', background: 'var(--bg-main)', border: '6px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', flexShrink: 0, boxShadow: '0 60px 120px rgba(0,0,0,0.8)', zIndex: 2, position: 'relative' }}>
                      <div className="marker-accent-glow" style={{ width: '130px', height: '130px', borderRadius: '50%', background: 'currentColor', opacity: 0.15, position: 'absolute' }} />
                      {idx === 0 ? <Zap className="pulse" size={130} strokeWidth={3} /> : <Check size={130} strokeWidth={3} />}
                    </div>
                    <div className="shard-data-manifold card card-glow" style={{ background: 'rgba(34, 197, 94, 0.12)', padding: '18rem', border: '2px solid var(--border-light)', borderRadius: '150px', flex: 1, transition: 'all 0.8s', position: 'relative', overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.6)' }}>
                      <div className="shard-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12rem' }}>
                        <h4 className="cyber-glitch-text" style={{ margin: 0, fontSize: '9rem', fontWeight: 950, letterSpacing: '-0.025em', color: 'white', lineHeight: 1 }}>{payment.roleName?.toUpperCase() || 'NEURAL_DISPATCH'}</h4>
                        <div className="shard-timestamp card card-glow" style={{ display: 'flex', alignItems: 'center', gap: '8rem', fontSize: '3rem', fontWeight: 950, color: 'var(--text-dim)', background: 'var(--bg-card)', padding: '4.5rem 100px', borderRadius: '50px', border: '1px solid var(--border-subtle)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', fontFamily: 'JetBrains Mono' }}>
                          <Clock size={64} />
                          {format(Number(payment.executedAt) || Date.now(), 'MMM dd | HH:mm:ss').toUpperCase()}
                        </div>
                      </div>
                      <div style={{ fontSize: '5rem', color: 'var(--text-dim)', lineHeight: 1.8, fontWeight: 500, opacity: 0.5 }}>
                        Verified autonomous distribution of <span style={{ color: 'var(--success)', fontWeight: 950 }}>{typeof payment.amount === 'number'
                          ? (payment.amount / 1_000_000_000).toFixed(4)
                          : payment.amount
                        } {payment.chain === 'sui' ? 'SUI' : 'USDC'}</span> to terminal endpoint <span style={{ fontFamily: 'JetBrains Mono', color: 'white', fontWeight: 950, background: 'rgba(255,255,255,0.15)', padding: '2rem 6rem', borderRadius: '50px', border: '2px solid rgba(255,255,255,0.1)' }}>{payment.recipient.toUpperCase()}</span> hash matching registry manifold with cryptographic certainty at sub-epoch precision.
                      </div>
                      <div style={{ marginTop: '15rem', display: 'flex', alignItems: 'center', gap: '10rem', fontSize: '3rem', fontWeight: 950, color: 'var(--sui-blue)', opacity: 0.4, letterSpacing: '1rem', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
                         <Cpu size={90} strokeWidth={1} /> KERNEL_DISPATCH_CONFIRMED :: {payment.transactionHash.slice(0, 64).toUpperCase()}...
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </details>

            <footer style={{ textAlign: 'center', opacity: 0.15, borderTop: '2px dashed var(--border-light)', paddingTop: '45rem', paddingBottom: '55rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '35rem', marginBottom: '35rem' }}>
                <Smartphone size={150} strokeWidth={0.5} />
                <History size={180} strokeWidth={0.5} />
                <Layers size={150} strokeWidth={0.5} />
                <Fingerprint size={150} strokeWidth={0.5} />
                <Shield size={150} strokeWidth={0.5} />
                <Globe size={150} strokeWidth={0.5} />
                <Award size={150} strokeWidth={0.5} />
                <Grid size={150} strokeWidth={0.5} />
                <Timer size={180} strokeWidth={0.5} />
                <Database size={180} strokeWidth={0.5} />
                <Cpu size={180} strokeWidth={0.5} />
                <Clock size={150} strokeWidth={0.5} />
              </div>
              <div style={{ fontWeight: 950, letterSpacing: '8rem', fontSize: '7rem', textTransform: 'uppercase' }}>ARCHIVAL_INTEGRITY_SYNC_v9.4.0_FINAL_STABLE</div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};
