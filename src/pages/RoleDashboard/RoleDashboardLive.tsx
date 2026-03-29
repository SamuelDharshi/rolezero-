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
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  ArrowDownLeft, 
  ArrowLeft, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  Cpu, 
  Database, 
  ExternalLink, 
  Fingerprint, 
  Hash, 
  Layers, 
  Loader2, 
  ShieldCheck, 
  Terminal, 
  Timer, 
  TrendingUp, 
  Zap, 
  ZapOff 
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

  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [isExtending, setIsExtending] = useState(false);

  const normalizeAddress = (addr: string) => addr?.toLowerCase().trim();
  const suiConnected = normalizeAddress(suiAccount?.address || '');
  const evmConnected = normalizeAddress(evmAddress || '');
  const creatorAddress = normalizeAddress(roleData?.creator || '');
  const isCreator = !!roleData && ((!!evmConnected && evmConnected === creatorAddress) || (!!suiConnected && suiConnected === creatorAddress));
  
  const isExpired = !!roleData && Date.now() > roleData.expiryTime;
  const isActive = !!roleData && typeof roleData.startTime === 'number' && !isExpired && Date.now() >= roleData.startTime;

  const { status: monitorStatus, toggleAutoExecute } = useAutoPaymentMonitor(roleData, isCreator, isActive);

  if (isLoading) {
    return (
      <div className="dashboard-live-page">
        <div className="ens-bg" />
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
          <div className="card text-center" style={{ padding: '60px' }}>
            <div className="icon-circle bg-surface flex-center mb-24" style={{ margin: '0 auto', width: '80px', height: '100px' }}>
              <Activity className="spin text-primary" size={40} />
            </div>
            <p className="text-secondary uppercase font-bold letter-2">Syncing Role Manifold...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !roleData) {
    return (
      <div className="dashboard-live-page">
        <div className="ens-bg" />
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
          <div className="card text-center" style={{ padding: '60px', maxWidth: '600px' }}>
            <div className="icon-circle bg-error-dim flex-center mb-24" style={{ margin: '0 auto', width: '80px', height: '100px', color: 'var(--error)' }}>
              <ZapOff size={40} />
            </div>
            <h2 className="text-error">Sync Failure</h2>
            <p className="text-secondary mb-32">The neural protocol gateway failed to retrieve the requested role definition.</p>
            <button onClick={() => navigate('/roles')} className="btn btn-secondary">Return to Registry</button>
          </div>
        </div>
      </div>
    );
  }

  if (suiAccount && !isCreator) {
    return (
      <div className="dashboard-live-page">
        <div className="ens-bg" />
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
          <div className="card text-center" style={{ padding: '60px', maxWidth: '600px' }}>
            <div className="icon-circle bg-error-dim flex-center mb-24" style={{ margin: '0 auto', width: '80px', height: '100px', color: 'var(--error)' }}>
              <ZapOff size={40} />
            </div>
            <h2 className="text-error">Access Denied</h2>
            <p className="text-secondary mb-32">The connected neural node is not authorized to access these secured control manifolds.</p>
            <div className="flex-center gap-12">
               <button onClick={() => navigate(`/sponsor/${roleId}`)} className="btn btn-primary">Sponsor Interface</button>
               <button onClick={() => navigate('/')} className="btn btn-secondary">Return Home</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleExtendExpiry = async () => {
    if (!newExpiryDate) return;
    const newExpiry = new Date(newExpiryDate).getTime();
    if (newExpiry <= roleData.expiryTime) {
      showToast({ type: 'error', title: 'INVALID EPOCH', message: 'Target epoch must be later than current expiration boundary.' });
      return;
    }
    setIsExtending(true);
    try {
      const result = await extendExpiry.mutateAsync(newExpiry);
      showToast({ type: 'success', title: 'EPOCH SHIFTED', message: 'Registry expiration boundary updated.', txDigest: result.digest });
      setNewExpiryDate('');
    } catch (err: any) {
      showToast({ type: 'error', title: 'EXTENSION FAILED', message: err.message || 'Reserve synchronization failed.' });
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

      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        <header className="dashboard-header flex-between mb-40">
          <div>
            <div className="flex-center gap-12 mb-8">
               <div className="badge">Operational Node</div>
               <span className={`status-pill ${isActive ? 'active' : isExpired ? 'expired' : 'pending'}`}>
                 {isActive ? 'System Live' : isExpired ? 'Depleted' : 'Queued'}
               </span>
            </div>
            <h1>{roleData.name.toUpperCase()}</h1>
            <p className="text-secondary mono text-xs opacity-60 uppercase letter-1">Manifest: {roleId}</p>
          </div>

          <div className="flex-center gap-12">
             <button 
                onClick={() => executePayments.mutate()} 
                disabled={executePayments.isPending || roleData.remainingBalance <= 0}
                className="btn btn-primary px-32 py-16"
              >
                {executePayments.isPending ? <Loader2 className="spin" size={18} /> : <Zap size={18} />}
                Authorize Dispatch
              </button>
              <button 
                onClick={() => navigate(`/sponsor/${roleId}`)}
                className="btn btn-secondary px-32 py-16"
              >
                <TrendingUp size={18} /> Inject Liquidity
              </button>
          </div>
        </header>

        <div className="stats-row grid-4 gap-20 mb-40">
            <div className="stat-card card p-24">
                <div className="text-xs font-bold text-muted uppercase letter-1 mb-8">Ingress Magnitude</div>
                <div className="text-3xl font-bold">{(totalFunding / 1_000_000_000).toFixed(4)} <span className="text-xs opacity-40">SUI</span></div>
            </div>
            <div className="stat-card card p-24">
                <div className="text-xs font-bold text-muted uppercase letter-1 mb-8">Egress Magnitude</div>
                <div className="text-3xl font-bold">{(totalPayments / 1_000_000_000).toFixed(4)} <span className="text-xs opacity-40">SUI</span></div>
            </div>
            <div className="stat-card card p-24">
                <div className="text-xs font-bold text-primary uppercase letter-1 mb-8">Available Reserves</div>
                <div className="text-3xl font-bold text-primary">{(roleData.remainingBalance / 1_000_000_000).toFixed(4)} <span className="text-xs opacity-40">SUI</span></div>
            </div>
            <div className="stat-card card p-24">
                <div className="text-xs font-bold text-secondary uppercase letter-1 mb-8">Depletion Epoch</div>
                <div className="text-2xl font-bold text-secondary">{format(roleData.expiryTime, 'MMM dd | HH:mm').toUpperCase()}</div>
            </div>
        </div>

        <div className="dashboard-grid">
          <div className="grid-main">
            <section className="card p-32 mb-32">
                <div className="section-header flex-between mb-32 pb-16 border-subtle-b">
                   <div className="flex-center gap-12">
                      <Terminal size={20} className="text-primary" />
                      <h3 className="m-0">Transaction Kernel</h3>
                   </div>
                   <div className="flex-center gap-8 text-xs font-bold text-primary">
                      <div className="pulse-dot" /> Live Telemetry
                   </div>
                </div>

                <div className="tx-stack flex-column gap-12">
                   {liveTransactions && liveTransactions.length > 0 ? (
                      liveTransactions.map((tx, idx) => (
                        <div key={idx} className="tx-item card-dim p-20 flex-between">
                           <div className="flex-center gap-16">
                              <div className={`icon-circle ${tx.type === 'funding' ? 'bg-success-dim text-success' : 'bg-primary-dim text-primary'}`}>
                                 {tx.type === 'funding' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                              </div>
                              <div>
                                 <div className="flex-center gap-12 mb-4">
                                    <span className={`badge-sm ${tx.type}`}>{tx.type.toUpperCase()}</span>
                                    <span className="text-xs text-muted mono">{format(tx.timestamp, 'HH:mm:ss')}</span>
                                 </div>
                                 <div className="text-xs mono opacity-60">
                                    {shortenAddress(tx.from, 12)} → {shortenAddress(tx.to || '', 12)}
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className={`text-xl font-bold ${tx.type === 'funding' ? 'text-success' : ''}`}>
                                 {tx.type === 'funding' ? '+' : '-'}{(tx.amount / 1_000_000_000).toFixed(4)}
                              </div>
                              <a href={`https://suiscan.xyz/testnet/tx/${tx.txDigest}`} target="_blank" rel="noreferrer" className="text-xs text-primary font-bold uppercase letter-1 no-underline mt-4 block">
                                 Audit Ledger <ExternalLink size={10} className="ml-4" />
                              </a>
                           </div>
                        </div>
                      ))
                   ) : (
                      <div className="empty-state text-center py-60 opacity-20">
                         <Activity size={48} className="mb-12" />
                         <p className="text-xs font-bold uppercase letter-2">Kernel Idle: Awaiting Activity Stream</p>
                      </div>
                   )}
                </div>
            </section>
          </div>

          <aside className="grid-sidebar">
            <section className="card p-24 mb-24">
                <div className="section-header flex-center gap-12 mb-20">
                   <Timer size={18} className="text-secondary" />
                   <h3 className="m-0 text-sm">Temporal Shift</h3>
                </div>
                <p className="text-xs text-secondary leading-relaxed mb-20">
                  Adjust the operational lifespan of this protocol architecture by shifting the expiration boundary.
                </p>
                <div className="form-group mb-20">
                   <label className="text-xs font-bold uppercase text-muted mb-8 block">New Expiration Epoch</label>
                   <input
                    type="datetime-local"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="p-12 w-full rounded-8 bg-surface border-subtle text-sm mono"
                  />
                </div>
                <button
                  onClick={handleExtendExpiry}
                  disabled={!newExpiryDate || isExtending}
                  className="btn btn-secondary btn-full py-12"
                >
                  {isExtending ? <Loader2 className="spin" size={16} /> : <Clock size={16} />}
                  Extend Epoch
                </button>
            </section>

            <section className="card p-24 bg-surface-dim">
                <div className="section-header flex-center gap-12 mb-3">
                   <Layers size={18} className="text-primary" />
                   <h3 className="m-0 text-sm">Registry Link</h3>
                </div>
                <p className="text-xs text-muted leading-relaxed mb-16">
                  Transmit this decentralized identifier to potential sponsors.
                </p>
                <div className="p-12 card-dim rounded-8 text-xs mono text-primary break-all mb-16">
                   {window.location.origin}/sponsor/{roleId}
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/sponsor/${roleId}`);
                    showToast({ type: 'success', title: 'Captured', message: 'Registry endpoint copied to clipboard manifest.' });
                  }}
                  className="btn btn-secondary btn-full btn-sm"
                >
                  <Fingerprint size={14} /> Copy Link
                </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};
