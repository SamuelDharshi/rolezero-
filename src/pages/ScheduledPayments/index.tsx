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
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
          <div className="card text-center" style={{ padding: '60px' }}>
            <div className="icon-circle bg-surface flex-center mb-24" style={{ margin: '0 auto', width: '80px', height: '100px' }}>
              <Activity className="spin text-primary" size={40} />
            </div>
            <p className="text-secondary uppercase font-bold letter-2">Rescanning Epoch Threads...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scheduled-payments-page">
      <div className="ens-bg" />

      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        <header className="scheduled-header flex-between mb-40">
          <div>
            <div className="badge">Temporal Engine</div>
            <h1>Network Horizon</h1>
            <p className="text-secondary">Monitoring automated protocols across the decentralized neural mesh.</p>
          </div>
          
          <div className="flex-center gap-16">
            <div className="stat-pill card flex-center gap-12">
              <span className="text-xs uppercase font-bold letter-1 text-muted">Ready</span>
              <span className="font-bold text-success text-xl">{readyPayments.length}</span>
            </div>
            <div className="stat-pill card flex-center gap-12">
              <span className="text-xs uppercase font-bold letter-1 text-muted">Queued</span>
              <span className="font-bold text-primary text-xl">{upcomingPayments.length}</span>
            </div>
          </div>
        </header>

        {allPayments.length === 0 ? (
          <div className="empty-state text-center py-80">
            <div className="icon-circle flex-center mb-24 opacity-20" style={{ margin: '0 auto', width: '100px', height: '100px' }}>
              <Calendar size={50} />
            </div>
            <h3>Temporal Horizon is Empty</h3>
            <p className="text-secondary max-600 center mb-32">
              The temporal ledger detects no pending distribution events in the current orbital epoch.
            </p>
            <button onClick={() => navigate('/create')} className="btn btn-primary">
              Initialize Architecture
            </button>
          </div>
        ) : (
          <div className="horizon-layout">
            {readyPayments.length > 0 && (
              <section className="horizon-section mb-60">
                <div className="section-header flex-between mb-32 border-subtle-b pb-16">
                  <div className="flex-center gap-12">
                    <div className="section-icon flex-center bg-success-dim"><Zap size={20} className="text-success" /></div>
                    <h3 className="m-0">Executable Pipeline</h3>
                  </div>
                  <span className="text-xs font-bold text-success uppercase letter-2">STATE::OPTIMAL_SYNC</span>
                </div>

                <div className="horizon-grid">
                  {readyPayments.map((payment, idx) => (
                    <motion.div
                      key={`ready-${payment.chain}-${payment.roleId}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="horizon-card card clickable"
                      onClick={() => navigate(`/live/${payment.roleId}`)}
                    >
                      <div className="card-header flex-between mb-24">
                        <div className="flex-center gap-12">
                          <div className="icon-box bg-surface"><Clock size={18} /></div>
                          <div>
                            <h4 className="m-0 font-bold">{payment.roleName || 'Neural Role'}</h4>
                            <code className="text-xs text-muted mono">{payment.roleId.slice(0, 16).toUpperCase()}</code>
                          </div>
                        </div>
                        <span className={`badge-chain ${payment.chain}`}>{payment.chain.toUpperCase()}</span>
                      </div>

                      <div className="card-metrics card-dim mb-24">
                        <div className="metric-row flex-between">
                          <span className="text-xs uppercase font-bold text-muted">Endpoint</span>
                          <span className="mono text-sm">{shortenAddress(payment.recipient, 12)}</span>
                        </div>
                        <div className="metric-row flex-between">
                          <span className="text-xs uppercase font-bold text-muted">Magnitude</span>
                          <span className="font-bold text-success">
                            {(payment.amount / 1_000_000_000).toFixed(4)} <span className="text-xs opacity-60">SUI</span>
                          </span>
                        </div>
                      </div>

                      <button className="btn btn-secondary btn-full btn-sm">
                        <Terminal size={14} /> Monitor Execution
                      </button>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {upcomingPayments.length > 0 && (
              <section className="horizon-section">
                <div className="section-header flex-between mb-32 border-subtle-b pb-16">
                  <div className="flex-center gap-12">
                    <div className="section-icon flex-center"><Layers size={20} /></div>
                    <h3 className="m-0">Temporal Horizon</h3>
                  </div>
                  <span className="text-xs font-bold text-muted uppercase letter-2">STATE::QUEUED_STABLE</span>
                </div>

                <div className="horizon-grid">
                  {upcomingPayments.map((payment, idx) => (
                    <motion.div
                      key={`upcoming-${payment.chain}-${payment.roleId}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="horizon-card card clickable"
                      onClick={() => navigate(`/live/${payment.roleId}`)}
                    >
                      <div className="card-header flex-between mb-24">
                        <div className="flex-center gap-12">
                          <div className="icon-box bg-surface"><Calendar size={18} /></div>
                          <div>
                            <h4 className="m-0 font-bold">{payment.roleName || 'Archival Role'}</h4>
                            <code className="text-xs text-muted mono">{payment.roleId.slice(0, 16).toUpperCase()}</code>
                          </div>
                        </div>
                        <span className={`badge-chain ${payment.chain}`}>{payment.chain.toUpperCase()}</span>
                      </div>

                      <div className="card-metrics card-dim mb-24">
                        <div className="metric-row flex-between">
                          <span className="text-xs uppercase font-bold text-muted">Dispatch Epoch</span>
                          <span className="mono text-sm text-primary">{format(Number(payment.scheduledTime), 'MMM dd | HH:mm').toUpperCase()}</span>
                        </div>
                        <div className="metric-row flex-between">
                          <span className="text-xs uppercase font-bold text-muted">Magnitude</span>
                          <span className="font-bold">
                            {(payment.amount / 1_000_000_000).toFixed(4)} <span className="text-xs opacity-60">SUI</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex-center gap-8 text-xs font-bold text-muted opacity-60">
                        <Shield size={12} /> Immutable Logic Active
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            <section className="card stats-block mt-80 bg-surface-dim">
              <div className="flex-center gap-32">
                <div className="block-icon flex-center">
                  <Cpu size={48} className="text-primary" />
                </div>
                <div>
                  <h3>Neural Automation Kernel</h3>
                  <p className="text-secondary max-800 m-0">
                    The RoleZero execution kernel monitors all scheduled distributions with sub-millisecond precision. 
                    Protocols trigger atomic cross-chain dispatch cycles automatically when ledger time aligns with the release epoch.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
