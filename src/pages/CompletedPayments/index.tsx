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
  TrendingUp, 
  Shield, 
  Activity, 
  Cpu, 
  Globe, 
  Zap,
  ArrowRight,
  Database,
  History,
  Terminal,
  Hash,
  ArrowUpRight,
  Clock,
  Layers,
  ShieldCheck
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
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
          <div className="card text-center" style={{ padding: '60px' }}>
            <div className="icon-circle bg-surface flex-center mb-24" style={{ margin: '0 auto', width: '80px', height: '100px' }}>
              <History className="spin text-success" size={40} />
            </div>
            <p className="text-secondary uppercase font-bold letter-2">Syncing Archival Shards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="completed-payments-page">
      <div className="ens-bg" />

      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        <header className="completed-header flex-between mb-40">
          <div>
            <div className="badge">Audit Trail</div>
            <h1>Archive Manifest</h1>
            <p className="text-secondary">Verified historical distribution records secured across the neural archival layer.</p>
          </div>
          
          <div className="flex-center gap-16">
            <div className="stat-pill card flex-center gap-12">
              <span className="text-xs uppercase font-bold letter-1 text-muted">Events</span>
              <span className="font-bold text-xl">{totalPayments}</span>
            </div>
            <div className="stat-pill card flex-center gap-12">
              <span className="text-xs uppercase font-bold letter-1 text-muted">Magnitude</span>
              <span className="font-bold text-primary text-xl">{totalAmount.toFixed(2)} <span className="text-xs">SUI</span></span>
            </div>
          </div>
        </header>

        {payments.length === 0 ? (
          <div className="empty-state text-center py-80">
            <div className="icon-circle flex-center mb-24 opacity-20" style={{ margin: '0 auto', width: '100px', height: '100px' }}>
              <History size={50} />
            </div>
            <h3>Archive is Silent</h3>
            <p className="text-secondary max-600 center mb-32">
              No distribution events have been recorded in the distributed neural ledger yet.
            </p>
            <button onClick={() => navigate('/create')} className="btn btn-primary">
              Initialize Dispatch
            </button>
          </div>
        ) : (
          <div className="archive-layout">
            <section className="card stats-block mb-40 bg-surface-dim">
              <div className="flex-center gap-32">
                <div className="block-icon flex-center bg-success-dim">
                  <Shield size={36} className="text-success" />
                </div>
                <div>
                  <h3 className="m-0">Integrity Manifest</h3>
                  <p className="text-secondary max-800 m-0 text-sm">
                    The RoleZero audit kernel monitors all distribution outcomes with cryptographic certainty. 
                    Every historical event is inscribed across a distributed neural ledger.
                  </p>
                </div>
              </div>
            </section>

            <div className="archive-grid">
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
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="archive-card card"
                    >
                      <div className="card-header flex-between mb-24">
                        <div className="flex-center gap-12">
                          <div className="icon-box bg-success-dim"><CheckCircle2 size={18} className="text-success" /></div>
                          <div>
                            <h4 className="m-0 font-bold">{payment.roleName || 'Protocol Event'}</h4>
                            <code className="text-xs text-muted mono">{payment.transactionHash.slice(0, 16).toUpperCase()}</code>
                          </div>
                        </div>
                        <span className={`badge-chain ${payment.chain}`}>{payment.chain?.toUpperCase() || 'SUI'}</span>
                      </div>

                      <div className="card-metrics card-dim mb-24">
                        <div className="metric-row flex-between">
                          <span className="text-xs uppercase font-bold text-muted">Endpoint</span>
                          <span className="mono text-sm">{shortenAddress(payment.recipient, 12)}</span>
                        </div>
                        <div className="metric-row flex-between">
                          <span className="text-xs uppercase font-bold text-muted">Magnitude</span>
                          <span className="font-bold text-success">
                            {amount} <span className="text-xs opacity-60">{payment.chain === 'sui' ? 'SUI' : 'USDC'}</span>
                          </span>
                        </div>
                        <div className="metric-row flex-between">
                          <span className="text-xs uppercase font-bold text-muted">Epoch Execution</span>
                          <span className="mono text-sm">{format(Number(payment.executedAt) || Date.now(), 'MMM dd | HH:mm').toUpperCase()}</span>
                        </div>
                      </div>

                      <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-full btn-sm no-underline"
                      >
                        <Terminal size={14} /> Query Blockchain Ledger
                      </a>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
