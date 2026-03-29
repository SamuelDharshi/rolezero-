import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useAccount } from 'wagmi';
import { useRoleData } from '@/hooks/useRoleData';
import { useLiveTransactions } from '@/hooks/useLiveTransactions';
import { useExtendExpiry } from '@/hooks/useExtendExpiry';
import { useExecuteExpiry } from '@/hooks/useExecuteExpiry';
import { useExecutePayments } from '@/hooks/useExecutePayments';
import { useAutoPaymentMonitor } from '@/hooks/useAutoPaymentMonitor';
import { showToast } from '@/components/Toast/Toast';
import { AutoExecutorStatus } from '@/components/AutoExecutorStatus';
import { formatTimestamp } from '../../utils/dateUtils';
import { SkeletonDashboard } from '@/components/Skeleton/Skeleton';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Wallet, 
  ExternalLink,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  Play,
  Terminal,
  Activity,
  Zap,
  Copy,
  Hash,
  Cpu,
  Globe,
  Database,
  Search,
  Check,
  Award,
  ZapOff,
  Shield,
  ArrowLeft,
  Navigation,
  Layers,
  Fingerprint,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  ArrowDownLeft,
  Trash2,
  Grid,
  Timer
} from 'lucide-react';
import { shortenAddress } from '@/utils/ens';
import { getTokenIcon } from '@/utils/token';
import './RoleDashboardLive.css';

export const RoleDashboardLive: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const suiAccount = useCurrentAccount();
  const { address: evmAddress } = useAccount();
  const { data: roleData, isLoading, error } = useRoleData(roleId);
  const { data: liveTransactions, isLoading: txLoading } = useLiveTransactions(roleId);
  const extendExpiry = useExtendExpiry(roleId || '');
  const executePayments = useExecutePayments(roleId || '', roleData?.remainingBalance || 0);
  const executeExpiry = useExecuteExpiry(roleId || '', roleData?.remainingBalance || 0);

  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [isExtending, setIsExtending] = useState(false);

  const normalizeAddress = (addr: string) => addr?.toLowerCase().trim();
  const suiConnected = normalizeAddress(suiAccount?.address || '');
  const evmConnected = normalizeAddress(evmAddress || '');
  const creatorAddress = normalizeAddress(roleData?.creator || '');
  const isCreator = !!roleData && ((!!evmConnected && evmConnected === creatorAddress) || (!!suiConnected && suiConnected === creatorAddress)) ? true : false;
  
  const isExpired = !!roleData && Date.now() > roleData.expiryTime;
  const isActive = !!roleData && typeof roleData.startTime === 'number' && !isExpired && Date.now() >= roleData.startTime;

  const { status: monitorStatus, toggleAutoExecute } = useAutoPaymentMonitor(roleData, isCreator, isActive);

  if (isLoading) return <SkeletonDashboard />;

  if (error || !roleData) {
    return (
      <div className="dashboard-live-page">
        <div className="ens-bg" />
        <div className="container" style={{ maxWidth: '1800px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <motion.div initial={{ opacity: 0, scale: 0.98, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="card card-glow" style={{ maxWidth: '1400px', textAlign: 'center', borderColor: 'var(--error)', padding: '20rem 12rem', background: 'var(--bg-card)', borderRadius: '100px', boxShadow: '0 80px 160px rgba(239, 68, 68, 0.2)' }}>
            <div className="card card-glow" style={{ width: '280px', height: '280px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--error)', borderRadius: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10rem', color: 'var(--error)', boxShadow: '0 0 120px rgba(239, 68, 68, 0.3)' }}>
              <AlertCircle size={180} strokeWidth={1} />
            </div>
            <h2 className="cyber-glitch-text" style={{ fontSize: '11rem', color: 'var(--error)', marginBottom: '8rem', fontWeight: 950, letterSpacing: '-0.04em', margin: 0, lineHeight: 1 }}>SYNC_FAILURE</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '3.5rem', marginBottom: '15rem', maxWidth: '1100px', margin: '6rem auto 15rem', lineHeight: 1.8, fontWeight: 500, opacity: 0.8 }}>The neural protocol gateway failed to retrieve the requested role definition from the decentralized manifold registry. Check hash integrity or retry dispatch.</p>
            <motion.button 
              whileHover={{ scale: 1.05, background: 'var(--bg-main)', borderColor: 'white', color: 'white', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/roles')} 
              className="btn btn-secondary card card-glow" 
              style={{ padding: '4.5rem 10rem', fontWeight: 950, letterSpacing: '0.6rem', background: 'transparent', border: '2px solid var(--border-light)', fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '6rem', margin: '0 auto', borderRadius: '45px', cursor: 'pointer', transition: 'all 0.4s' }}
            >
              <Terminal size={64} strokeWidth={1.5} />
              <span>RETURN_TO_GLOBAL_REGISTRY</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Access control
  if (suiAccount && !isCreator) {
    return (
      <div className="dashboard-live-page">
        <div className="ens-bg" />
        <div className="container" style={{ maxWidth: '1800px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <motion.div initial={{ opacity: 0, scale: 0.98, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="card card-glow" style={{ maxWidth: '1400px', textAlign: 'center', borderColor: 'var(--error)', padding: '20rem 12rem', background: 'var(--bg-card)', borderRadius: '100px', boxShadow: '0 80px 160px rgba(239, 68, 68, 0.2)' }}>
            <div className="card card-glow" style={{ width: '280px', height: '280px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--error)', borderRadius: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10rem', color: 'var(--error)', boxShadow: '0 0 120px rgba(239, 68, 68, 0.3)' }}>
              <ZapOff size={180} strokeWidth={1} />
            </div>
            <h2 className="cyber-glitch-text" style={{ fontSize: '11rem', color: 'var(--error)', marginBottom: '8rem', fontWeight: 950, letterSpacing: '-0.04em', margin: 0, lineHeight: 1 }}>ACCESS_DENIED</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '3.5rem', marginBottom: '15rem', maxWidth: '1100px', margin: '6rem auto 15rem', lineHeight: 1.8, fontWeight: 500, opacity: 0.8 }}>Operational credentials required. The connected neural node ({shortenAddress(suiAccount.address)}) is not authorized to access these secured control manifolds or manipulate temporal buffers.</p>
            <div style={{ display: 'flex', gap: '10rem', justifyContent: 'center' }}>
              <motion.button whileHover={{ scale: 1.05, filter: 'brightness(1.2)', boxShadow: '0 60px 120px rgba(6, 182, 212, 0.6)' }} whileTap={{ scale: 0.95 }} onClick={() => navigate(`/sponsor/${roleId}`)} className="btn btn-primary" style={{ padding: '4.5rem 10rem', fontWeight: 950, letterSpacing: '0.6rem', fontSize: '2.5rem', background: 'var(--sui-blue)', color: 'white', border: 'none', borderRadius: '45px', cursor: 'pointer', transition: 'all 0.5s' }}>SPONSOR_INTERFACE</motion.button>
              <motion.button whileHover={{ scale: 1.05, background: 'var(--bg-main)', color: 'white', borderColor: 'white', boxShadow: '0 40px 80px rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/')} className="btn btn-secondary card card-glow" style={{ padding: '4.5rem 10rem', fontWeight: 950, letterSpacing: '0.6rem', background: 'transparent', border: '2px solid var(--border-light)', fontSize: '2.5rem', borderRadius: '45px', color: 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.5s' }}>RESTART_KERNEL</motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleExtendExpiry = async () => {
    if (!newExpiryDate) return;
    const newExpiry = new Date(newExpiryDate).getTime();
    if (newExpiry <= roleData.expiryTime) {
      showToast({ type: 'error', title: 'INVALID EPOCH', message: 'Target epoch must be later than current expiration boundary' });
      return;
    }
    setIsExtending(true);
    try {
      const result = await extendExpiry.mutateAsync(newExpiry);
      showToast({ type: 'success', title: 'EPOCH SHIFTED', message: 'Registry expiration boundary updated', txDigest: result.digest });
      setNewExpiryDate('');
    } catch (err: any) {
      showToast({ type: 'error', title: 'EXTENSION FAILED', message: err.message || 'Reserve synchronization failed - temporal lock active' });
    } finally {
      setIsExtending(false);
    }
  };

  const totalFunding = liveTransactions?.filter(tx => tx.type === 'funding' && tx.status === 'success').reduce((sum, tx) => sum + tx.amount, 0) || 0;
  const totalPayments = liveTransactions?.filter(tx => tx.type === 'payment' && tx.status === 'success').reduce((sum, tx) => sum + tx.amount, 0) || 0;

  return (
    <div className="dashboard-live-page">
      <div className="ens-bg" />
      
      {isCreator && monitorStatus && (
        <AutoExecutorStatus
          isMonitoring={monitorStatus.isMonitoring}
          autoExecuteEnabled={monitorStatus.autoExecuteEnabled}
          readyCount={monitorStatus.readyCount}
          onToggle={toggleAutoExecute}
        />
      )}

      <div className="container" style={{ maxWidth: '1800px', paddingTop: '150px' }}>
        <motion.div initial={{ opacity: 0, y: -80 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.4 }} className="dashboard-header-manifold" style={{ marginBottom: '18rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px dashed var(--border-light)', paddingBottom: '12rem' }}>
          <div className="header-info">
            <div className="hero-badge card card-glow" style={{ marginBottom: '8rem', fontSize: '1.25rem', letterSpacing: '0.8rem', padding: '1.5rem 5rem', width: 'fit-content', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--sui-blue)', border: '2px solid rgba(6, 182, 212, 0.4)', fontWeight: 950, borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '5rem', boxShadow: '0 0 60px rgba(6, 182, 212, 0.2)' }}>
              <div className="pulse" style={{ width: '15px', height: '15px', background: 'var(--sui-blue)', borderRadius: '50%', boxShadow: '0 0 20px var(--sui-blue)' }} />
              LIVE_TELEMETRY_CORE_OPS_v9.4.0
            </div>
            <h1 className="cyber-glitch-text" style={{ fontSize: '13rem', fontWeight: 950, letterSpacing: '-0.0625em', margin: 0, lineHeight: 0.8 }}>{roleData.name.toUpperCase()}</h1>
            <div className="role-meta" style={{ display: 'flex', alignItems: 'center', gap: '10rem', marginTop: '10rem' }}>
              <div className={`status-badge-manifold card card-glow ${isActive ? 'active' : isExpired ? 'expired' : 'pending'}`} style={{ display: 'flex', alignItems: 'center', gap: '6rem', padding: '3rem 8rem', background: 'var(--bg-card)', borderRadius: '45px', border: `3px solid ${isActive ? 'var(--success)' : isExpired ? 'var(--error)' : 'var(--sui-blue)'}`, boxShadow: `0 0 80px ${isActive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(6, 182, 212, 0.2)'}` }}>
                <div className="pulse" style={{ width: '30px', height: '30px', borderRadius: '50%', background: isActive ? 'var(--success)' : isExpired ? 'var(--error)' : 'var(--sui-blue)', boxShadow: `0 0 40px ${isActive ? 'var(--success)' : isExpired ? 'var(--error)' : 'var(--sui-blue)'}` }} />
                <span style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '0.6rem', color: isActive ? 'var(--success)' : isExpired ? 'var(--error)' : 'var(--sui-blue)' }}>{isActive ? 'OPERATIONAL' : isExpired ? 'OFFLINE' : 'QUEUED'}</span>
              </div>
              <span style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-dim)', opacity: 0.5, fontFamily: 'JetBrains Mono', letterSpacing: '0.3rem' }}>MANIFEST_ID: {roleId?.toUpperCase()}</span>
              {roleData.token && (
                <span className="token-badge-manifold card card-glow" style={{ padding: '3rem 8rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '45px', display: 'flex', alignItems: 'center', gap: '6rem', fontWeight: 950, boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
                  <div className="card card-glow" style={{ padding: '2rem', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '25px', border: '1px solid var(--border-light)', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)' }}>
                    {getTokenIcon(roleData.token)}
                  </div>
                  <span style={{ fontSize: '2.5rem', letterSpacing: '0.5rem', color: 'white' }}>{roleData.token.toUpperCase().split('::').pop()}</span>
                </span>
              )}
            </div>
          </div>

          <div className="header-actions" style={{ display: 'flex', gap: '8rem' }}>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 80px 160px rgba(34, 197, 94, 0.6)', filter: 'brightness(1.1)' }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => executePayments.mutate()} 
              disabled={executePayments.isPending || roleData.remainingBalance <= 0}
              className="btn btn-primary"
              style={{ minWidth: '850px', background: 'var(--success)', color: 'white', padding: '6rem 12rem', fontWeight: 950, fontSize: '3rem', letterSpacing: '0.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8rem', border: 'none', cursor: 'pointer', transition: 'all 0.5s', boxShadow: '0 60px 120px rgba(34, 197, 94, 0.4)' }}
            >
              {executePayments.isPending ? <Loader2 className="spin" size={100} /> : <Zap size={100} strokeWidth={3} />}
              <span>{executePayments.isPending ? 'EXECUTING_PIPELINE...' : 'AUTHORIZE_GLOBAL_DISPATCH'}</span>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05, background: 'rgba(6, 182, 212, 0.1)', borderColor: 'var(--sui-blue)', color: 'white', boxShadow: '0 60px 120px rgba(6, 182, 212, 0.4)' }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/sponsor/${roleId}`)}
              className="btn btn-secondary card card-glow"
              style={{ padding: '6rem 12rem', fontWeight: 950, fontSize: '3rem', background: 'transparent', color: 'var(--text-dim)', letterSpacing: '0.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8rem', border: '3px solid var(--border-light)', cursor: 'pointer', transition: 'all 0.5s' }}
            >
              <TrendingUp size={100} strokeWidth={2} />
              <span>INJECT_LIQUIDITY</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="telemetry-stats-manifold" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10rem', marginBottom: '25rem' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.2, duration: 1.2 }} className="tele-stat-card card card-glow" style={{ padding: '12rem 10rem', background: 'var(--bg-card)', borderRadius: '100px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '8rem', alignItems: 'center', boxShadow: '0 80px 160px rgba(0,0,0,0.6)' }}>
            <div className="stat-icon-unit card card-glow" style={{ width: '220px', height: '220px', background: 'var(--bg-main)', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', border: '1px solid var(--border-light)', flexShrink: 0, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}><ArrowDownLeft size={120} strokeWidth={1} /></div>
            <div>
              <div className="stat-value cyber-glitch-text" style={{ fontSize: '10rem', fontWeight: 950, letterSpacing: '-0.04em', color: 'white', lineHeight: 1 }}>{(totalFunding / 1_000_000_000).toFixed(4)}</div>
              <div className="stat-label" style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', textTransform: 'uppercase', marginTop: '3.5rem', opacity: 0.5 }}>INGRESS_MAGNITUDE</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.3, duration: 1.2 }} className="tele-stat-card card card-glow" style={{ padding: '12rem 10rem', background: 'var(--bg-card)', borderRadius: '100px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '8rem', alignItems: 'center', boxShadow: '0 80px 160px rgba(0,0,0,0.6)' }}>
            <div className="stat-icon-unit card card-glow" style={{ width: '220px', height: '220px', background: 'var(--bg-main)', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', border: '1px solid var(--border-light)', flexShrink: 0, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}><ArrowUpRight size={120} strokeWidth={1} /></div>
            <div>
              <div className="stat-value cyber-glitch-text" style={{ fontSize: '10rem', fontWeight: 950, letterSpacing: '-0.04em', color: 'white', lineHeight: 1 }}>{(totalPayments / 1_000_000_000).toFixed(4)}</div>
              <div className="stat-label" style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', textTransform: 'uppercase', marginTop: '3.5rem', opacity: 0.5 }}>EGRESS_MAGNITUDE</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.4, duration: 1.2 }} className="tele-stat-card card card-glow" style={{ padding: '12rem 10rem', background: 'var(--bg-card)', borderRadius: '100px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '8rem', alignItems: 'center', boxShadow: '0 80px 160px rgba(0,0,0,0.6)' }}>
            <div className="stat-icon-unit card card-glow" style={{ width: '220px', height: '220px', background: 'var(--bg-main)', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sui-blue)', border: '1px solid var(--border-light)', flexShrink: 0, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}><Database size={120} strokeWidth={1} /></div>
            <div>
              <div className="stat-value cyber-glitch-text" style={{ fontSize: '10rem', fontWeight: 950, color: 'var(--sui-blue)', letterSpacing: '-0.04em', lineHeight: 1 }}>{(roleData.remainingBalance / 1_000_000_000).toFixed(4)}</div>
              <div className="stat-label" style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', textTransform: 'uppercase', marginTop: '3.5rem', opacity: 0.5 }}>AVAILABLE_RESERVES</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.2 }} className="tele-stat-card card card-glow" style={{ padding: '12rem 10rem', background: 'var(--bg-card)', borderRadius: '100px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '8rem', alignItems: 'center', boxShadow: '0 80px 160px rgba(0,0,0,0.6)' }}>
            <div className="stat-icon-unit card card-glow" style={{ width: '220px', height: '220px', background: 'var(--bg-main)', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', border: '1px solid var(--border-light)', flexShrink: 0, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}><Clock size={120} strokeWidth={1} /></div>
            <div>
              <div className="stat-value cyber-glitch-text" style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-0.02em', color: '#f59e0b', lineHeight: 1 }}>{format(roleData.expiryTime, 'MMM dd, HH:mm').toUpperCase()}</div>
              <div className="stat-label" style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', textTransform: 'uppercase', marginTop: '3.5rem', opacity: 0.5 }}>DEPLETION_EPOCH</div>
            </div>
          </motion.div>
        </div>

        <div className="dashboard-operational-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 850px', gap: '15rem', marginBottom: '35rem' }}>
          <div className="kernel-stream-manifold">
            <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 1.4 }} className="card card-glow" style={{ padding: '15rem 12rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '120px', boxShadow: '0 100px 200px rgba(0,0,0,0.7)' }}>
              <div className="card-header" style={{ marginBottom: '18rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-light)', paddingBottom: '12rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10rem' }}>
                  <div className="card card-glow" style={{ padding: '4.5rem', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '50px', border: '1px solid var(--border-light)', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.7)' }}>
                    <Terminal size={120} strokeWidth={1} />
                  </div>
                  <h3 className="cyber-glitch-text" style={{ fontSize: '9rem', fontWeight: 950, letterSpacing: '-0.04em', textTransform: 'uppercase', margin: 0, lineHeight: 0.8 }}>TRANSACTION_KERNEL</h3>
                </div>
                <div className="live-indicator-cell" style={{ display: 'flex', alignItems: 'center', gap: '6rem', fontSize: '2.25rem', fontWeight: 950, letterSpacing: '0.8rem', color: 'var(--sui-blue)', opacity: 0.8 }}>
                  <div className="pulse" style={{ width: '40px', height: '40px', background: 'var(--sui-blue)', borderRadius: '50%', boxShadow: '0 0 80px var(--sui-blue)' }} />
                  <span>REAL-TIME_TELEMETRY</span>
                </div>
              </div>

              <div className="kernel-events-stack" style={{ display: 'flex', flexDirection: 'column', gap: '10rem' }}>
                {liveTransactions && liveTransactions.length > 0 ? (
                  liveTransactions.map((tx, idx) => (
                    <motion.div 
                      key={`${tx.txDigest}-${idx}`}
                      initial={{ opacity: 0, scale: 0.98, x: -100 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx % 6 * 0.1, ease: [0.16, 1, 0.3, 1], duration: 1 }}
                      className={`kernel-tx-shard card card-glow ${tx.type}`}
                      style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', padding: '12rem', borderRadius: '80px', display: 'grid', gridTemplateColumns: '220px 1fr 650px', gap: '12rem', alignItems: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.7)' }}
                    >
                      <div className="tx-icon-visual card card-glow" style={{ width: '220px', height: '220px', background: 'var(--bg-card)', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tx.type === 'funding' ? 'var(--success)' : 'var(--sui-blue)', border: '1px solid var(--border-light)', boxShadow: `0 0 50px ${tx.type === 'funding' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(6, 182, 212, 0.2)'}` }}>
                        {tx.type === 'funding' ? <ArrowDownLeft size={120} strokeWidth={1} /> : tx.type === 'payment' ? <ArrowUpRight size={120} strokeWidth={1} /> : <Activity size={120} strokeWidth={1} />}
                      </div>
                      <div className="tx-telemetry-meta">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6rem', marginBottom: '8rem' }}>
                          <span className="card card-glow" style={{ fontSize: '1.75rem', fontWeight: 950, padding: '2rem 6rem', background: tx.type === 'funding' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(6, 182, 212, 0.15)', color: tx.type === 'funding' ? 'var(--success)' : 'var(--sui-blue)', borderRadius: '25px', letterSpacing: '0.6rem', border: `2px solid ${tx.type === 'funding' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(6, 182, 212, 0.4)'}` }}>{tx.type.toUpperCase()}</span>
                          <span style={{ fontSize: '2.5rem', color: 'var(--text-dim)', fontWeight: 900, fontFamily: 'JetBrains Mono', opacity: 0.5 }}>{format(tx.timestamp, 'HH:mm:ss:SSS')}</span>
                        </div>
                        <div className="tx-endpoint-manifold" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', fontSize: '2.5rem', fontWeight: 950, fontFamily: 'JetBrains Mono', marginBottom: '8rem' }}>
                          <div style={{ display: 'flex', gap: '5rem', alignItems: 'center' }}>
                            <span style={{ opacity: 0.3, letterSpacing: '0.2rem' }}>ORIGIN:</span>
                            <span style={{ color: 'white' }}>{shortenAddress(tx.from, 32).toUpperCase()}</span>
                          </div>
                          {tx.to && <div style={{ display: 'flex', gap: '5rem', alignItems: 'center' }}>
                            <span style={{ opacity: 0.3, letterSpacing: '0.2rem' }}>TARGET:</span>
                            <span style={{ color: 'var(--sui-blue)' }}>{shortenAddress(tx.to, 32).toUpperCase()}</span>
                          </div>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5rem', opacity: 0.2, letterSpacing: '0.4rem' }}>
                          <Hash size={48} />
                          <span style={{ fontSize: '2rem', fontFamily: 'JetBrains Mono', fontWeight: 800 }}>AUDIT_HASH: {tx.txDigest.toUpperCase()}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="cyber-glitch-text" style={{ fontSize: '8rem', fontWeight: 950, color: tx.type === 'funding' ? 'var(--success)' : 'white', marginBottom: '8rem', letterSpacing: '-0.06em', lineHeight: 1 }}>
                          {tx.type === 'funding' ? '+' : '-'}{(tx.amount / 1_000_000_000).toFixed(4)} <span style={{ fontSize: '2.5rem', opacity: 0.5 }}>SUI</span>
                        </div>
                        <motion.a 
                          whileHover={{ scale: 1.05, color: 'white', background: 'var(--sui-blue)', borderColor: 'var(--sui-blue)', boxShadow: '0 40px 80px rgba(6, 182, 212, 0.4)' }}
                          whileTap={{ scale: 0.95 }}
                          href={`https://suiscan.xyz/testnet/tx/${tx.txDigest}`} 
                          target="_blank" rel="noreferrer" 
                          className="card card-glow"
                          style={{ background: 'var(--bg-main)', padding: '3.5rem 8rem', borderRadius: '35px', fontSize: '2rem', fontWeight: 950, color: 'var(--sui-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6rem', justifyContent: 'center', letterSpacing: '0.5rem', border: '2px solid var(--border-light)', width: 'fit-content', marginLeft: 'auto', transition: 'all 0.4s', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)' }}
                        >
                          AUDIT_STATE_LEDGER <ExternalLink size={40} strokeWidth={2} />
                        </motion.a>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="empty-kernel-state" style={{ padding: '40rem 0', textAlign: 'center', border: '3px dashed var(--border-light)', borderRadius: '120px', background: 'rgba(6, 182, 212, 0.05)', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.7)' }}>
                    <Activity size={320} style={{ opacity: 0.1, marginBottom: '15rem' }} className="pulse" color="var(--sui-blue)" strokeWidth={0.5} />
                    <p style={{ letterSpacing: '1.5rem', fontWeight: 950, fontSize: '3.5rem', color: 'var(--text-dim)', opacity: 0.5 }}>KERNEL_IDLE: AWAITING_PROTOCOL_ACTIVITY_STREAM...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="control-manifold-stack" style={{ display: 'flex', flexDirection: 'column', gap: '15rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.98, x: 100 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.7, duration: 1.4 }} className="control-manifold-card card card-glow" style={{ padding: '15rem 12rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '120px', boxShadow: '0 100px 200px rgba(0,0,0,0.7)' }}>
              <div className="card-header" style={{ marginBottom: '12rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8rem' }}>
                  <div className="card card-glow" style={{ padding: '4.5rem', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '50px', border: '1px solid var(--border-light)', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.7)' }}>
                    <Calendar size={120} strokeWidth={1} />
                  </div>
                  <h3 className="cyber-glitch-text" style={{ fontSize: '7rem', fontWeight: 950, letterSpacing: '-0.02em', textTransform: 'uppercase', margin: 0, lineHeight: 0.8 }}>TEMPORAL_SHIFT</h3>
                </div>
              </div>
              
              <p style={{ fontSize: '3.5rem', color: 'var(--text-dim)', marginBottom: '15rem', lineHeight: 1.8, fontWeight: 500, opacity: 0.8 }}>
                Adjust the operational lifespan of this protocol architecture. Epoch extension ensures uninterrupted autonomous distribution cycles across the neural manifold registry.
              </p>

              <div className="current-temporal-anchor card card-glow" style={{ marginBottom: '15rem', padding: '12rem 10rem', borderLeft: '15px solid var(--sui-blue)', background: 'var(--bg-main)', borderRadius: '80px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.8)' }}>
                 <div style={{ fontSize: '2rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: '6rem', color: 'var(--text-dim)', letterSpacing: '0.8rem', opacity: 0.5 }}>ACTIVE_EXPIRATION_EPOCH</div>
                 <div className="cyber-glitch-text" style={{ fontSize: '8rem', fontWeight: 950, letterSpacing: '-0.04em', marginBottom: '6rem', color: 'white', lineHeight: 1 }}>{format(roleData.expiryTime, 'MMM dd, yyyy').toUpperCase()}</div>
                 <div style={{ fontSize: '3.5rem', color: 'var(--sui-blue)', fontWeight: 950, fontFamily: 'JetBrains Mono', letterSpacing: '0.2rem' }}>{format(roleData.expiryTime, 'HH:mm:ss')} (BLOCK_TIME)</div>
              </div>

              <div className="new-temporal-input-unit">
                <label style={{ fontSize: '2rem', fontWeight: 950, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '1rem', marginLeft: '3.5rem', opacity: 0.5 }}>TARGET_DEPLOYMENT_EPOCH</label>
                <input
                  type="datetime-local"
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  className="datetime-input card card-glow"
                  style={{ width: '100%', padding: '7rem 8rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '60px', color: 'white', marginTop: '8rem', fontWeight: 950, fontSize: '3.5rem', fontFamily: 'JetBrains Mono', outline: 'none', transition: 'all 0.5s', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05, background: 'var(--sui-blue)', color: 'white', boxShadow: '0 80px 160px rgba(6, 182, 212, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExtendExpiry}
                disabled={!newExpiryDate || isExtending || !suiAccount}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '15rem', padding: '7rem', fontWeight: 950, fontSize: '3.5rem', letterSpacing: '0.8rem', background: 'transparent', border: '3px solid var(--sui-blue)', color: 'var(--sui-blue)', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8rem', cursor: 'pointer', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}
              >
                {isExtending ? <Activity className="spin" size={100} /> : <Timer size={100} strokeWidth={2} />}
                <span>{isExtending ? 'SHIFTING_BOUNDS...' : 'EXTEND_EPOCH'}</span>
              </motion.button>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.98, x: 100 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.8, duration: 1.4 }} className="control-manifold-card card card-glow" style={{ padding: '15rem 12rem', background: 'linear-gradient(135deg, rgba(82, 121, 230, 0.15), rgba(6, 182, 212, 0.1))', border: '1px solid rgba(82, 121, 230, 0.4)', borderRadius: '120px', boxShadow: '0 100px 200px rgba(0,0,0,0.7)' }}>
              <div className="card-header" style={{ marginBottom: '12rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10rem' }}>
                  <div className="card card-glow" style={{ padding: '4.5rem', background: 'rgba(82, 121, 230, 0.2)', color: '#82b3ef', borderRadius: '50px', border: '1px solid rgba(82, 121, 230, 0.4)', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.7)' }}>
                    <Layers size={120} strokeWidth={1} />
                  </div>
                  <h3 className="cyber-glitch-text" style={{ fontSize: '7rem', fontWeight: 950, letterSpacing: '-0.02em', textTransform: 'uppercase', margin: 0, lineHeight: 0.8 }}>REGISTRY_LINK</h3>
                </div>
              </div>
              <p style={{ fontSize: '3.5rem', color: 'var(--text-dim)', marginBottom: '15rem', fontWeight: 500, lineHeight: 1.8, opacity: 0.8 }}>
                Transmit this decentralized identifier to potential sponsors to initialize liquidity ingress cycles and maintain manifest integrity.
              </p>
              <div className="card card-glow" style={{ background: 'rgba(0,0,0,0.85)', padding: '7rem 10rem', borderRadius: '60px', fontSize: '3rem', fontFamily: 'JetBrains Mono', wordBreak: 'break-all', color: '#82b3ef', marginBottom: '15rem', border: '1px solid rgba(82, 121, 230, 0.3)', fontWeight: 800, letterSpacing: '0.05em', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)' }}>
                {window.location.protocol}//{window.location.host}/sponsor/{roleId}
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, background: 'rgba(82, 121, 230, 0.4)', borderColor: '#82b3ef', boxShadow: '0 80px 160px rgba(82, 121, 230, 0.5)' }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/sponsor/${roleId}`);
                  showToast({ type: 'success', title: 'CAPTURED', message: 'Registry endpoint copied to clipboard manifest' });
                }}
                className="card card-glow" 
                style={{ width: '100%', background: 'rgba(82, 121, 230, 0.2)', border: '1px solid rgba(82, 121, 230, 0.5)', color: '#82b3ef', padding: '7rem', fontWeight: 950, fontSize: '3.5rem', letterSpacing: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8rem', transition: 'all 0.5s', borderRadius: '60px', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}
              >
                <Fingerprint size={100} strokeWidth={1} />
                <span>COPY_REPLICANT_LINK</span>
              </motion.button>
            </motion.div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8rem', opacity: 0.4, paddingLeft: '12rem', marginTop: '10rem' }}>
              <ShieldCheck size={120} strokeWidth={1} />
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '1.5rem', color: 'white' }}>SECURED_BY_ROLEZERO_v9.4_KERNEL</p>
            </div>
          </div>
        </div>

        <footer style={{ marginTop: '40rem', textAlign: 'center', opacity: 0.2, borderTop: '1px dashed var(--border-light)', paddingTop: '30rem', paddingBottom: '45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '25rem', marginBottom: '25rem' }}>
            <Smartphone size={100} strokeWidth={0.5} />
            <Globe size={120} strokeWidth={0.5} />
            <Database size={120} strokeWidth={0.5} />
            <Award size={100} strokeWidth={0.5} />
            <Navigation size={100} strokeWidth={0.5} />
            <Grid size={100} strokeWidth={0.5} />
            <Shield size={120} strokeWidth={0.5} />
            <Cpu size={120} strokeWidth={0.5} />
            <Clock size={100} strokeWidth={0.5} />
            <Timer size={120} strokeWidth={0.5} />
            <Activity size={120} strokeWidth={0.5} />
            <Search size={100} strokeWidth={0.5} />
          </div>
          <div style={{ fontWeight: 950, letterSpacing: '6rem', fontSize: '4.5rem', textTransform: 'uppercase' }}>OPERATIONAL_SUPREMACY_v9.4.0_FINAL_STABLE_NOMINAL</div>
        </footer>
      </div>
    </div>
  );
};
