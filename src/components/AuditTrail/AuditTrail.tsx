import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ExternalLink, Check, Clock, Database, Globe, Zap, Activity, Cpu, Search, CheckCircle2, Navigation, ArrowUpRight } from 'lucide-react';
import './AuditTrail.css';

interface Transaction {
  type: 'funding' | 'payment' | 'developer_fee' | 'return_leftover';
  timestamp: number;
  amount: string;
  from?: string;
  to?: string;
  txDigest: string;
  status: 'confirmed';
}

interface AuditTrailProps {
  roleId: string;
  developerFee: string;
  fundingHistory: Array<{
    donor: string;
    amount: string;
    timestamp: number;
    txDigest: string;
  }>;
  executedPayments: Array<{
    recipient: string;
    amount: string;
    timestamp: number;
    txDigest: string;
  }>;
  returnLeftoverTx?: {
    amount: string;
    timestamp: number;
    txDigest: string;
  };
}

export const AuditTrail: React.FC<AuditTrailProps> = ({
  roleId,
  developerFee,
  fundingHistory,
  executedPayments,
  returnLeftoverTx,
}) => {
  const allTransactions: Transaction[] = [
    ...(fundingHistory.length > 0 ? [{
      type: 'developer_fee' as const,
      timestamp: fundingHistory[0].timestamp,
      amount: developerFee,
      from: fundingHistory[0].donor,
      to: '0x7cd3...de547',
      txDigest: fundingHistory[0].txDigest,
      status: 'confirmed' as const,
    }] : []),
    ...fundingHistory.map(f => ({
      type: 'funding' as const,
      timestamp: f.timestamp,
      amount: f.amount,
      from: f.donor,
      to: roleId,
      txDigest: f.txDigest,
      status: 'confirmed' as const,
    })),
    ...executedPayments.map(p => ({
      type: 'payment' as const,
      timestamp: p.timestamp,
      amount: p.amount,
      from: roleId,
      to: p.recipient,
      txDigest: p.txDigest,
      status: 'confirmed' as const,
    })),
    ...(returnLeftoverTx ? [{
      type: 'return_leftover' as const,
      timestamp: returnLeftoverTx.timestamp,
      amount: returnLeftoverTx.amount,
      from: roleId,
      to: fundingHistory[0]?.donor || 'Sponsor',
      txDigest: returnLeftoverTx.txDigest,
      status: 'confirmed' as const,
    }] : []),
  ].sort((a, b) => b.timestamp - a.timestamp);

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount) / 1_000_000_000;
    return num.toFixed(4);
  };

  const formatAddress = (address: string) => {
    if (address.length < 10) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`.toUpperCase();
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'developer_fee': return 'PROTOCOL_FEE_OERATIONAL';
      case 'funding': return 'LIQUIDITY_INJECTION_NOMINAL';
      case 'payment': return 'DECENTRALIZED_PAYOUT_STABLE';
      case 'return_leftover': return 'RESERVE_REHAB_COMPLETE';
      default: return 'TRANSACTION_EVENT_SYNC';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'developer_fee': return 'purple';
      case 'funding': return 'green';
      case 'payment': return 'blue';
      case 'return_leftover': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="audit-trail">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="audit-trail-header">
        <div className="audit-trail-title">
          <div className="card" style={{ padding: '0.6rem', color: 'var(--sui-blue)', background: 'var(--bg-card)' }}>
             <Database size={24} />
          </div>
          <h3 className="cyber-glitch-text" style={{ fontSize: '1.75rem', fontWeight: 950 }}>ON-CHAIN AUDIT LOG</h3>
        </div>
        <p className="audit-trail-subtitle" style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-dim)', opacity: 0.8 }}>
          Complete protocol execution telemetry permanently etched into the SUI distributed ledger. All operations are atomic, immutable, and cryptographically verified.
        </p>
      </motion.div>

      {allTransactions.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="audit-trail-empty card card-glow" style={{ padding: '8rem', borderStyle: 'dashed', background: 'var(--bg-card)' }}>
          <Shield size={64} style={{ opacity: 0.1, marginBottom: '2rem' }} />
          <p style={{ fontSize: '1.25rem', fontWeight: 950, letterSpacing: '0.1em' }}>LEDGER_VOID_INITIALIZED</p>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Standing by for initial protocol event synchronization...</span>
        </motion.div>
      ) : (
        <div className="audit-trail-list">
          <AnimatePresence mode="popLayout">
            {allTransactions.map((tx, index) => (
              <motion.div 
                key={`${tx.txDigest}-${index}`} 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: index * 0.05 }}
                className={`audit-trail-item card card-glow color-${getTransactionColor(tx.type)}`}
                style={{ padding: '2.5rem 4rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '25px' }}
                whileHover={{ x: 10, borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="audit-trail-item-left">
                  <div className={`audit-trail-badge card badge-${getTransactionColor(tx.type)}`} style={{ width: '48px', height: '48px', borderRadius: '15px', background: 'var(--bg-main)' }}>
                    <Check size={20} strokeWidth={2.5} />
                  </div>
                  <div className="audit-trail-item-info">
                    <div className="audit-trail-item-label" style={{ fontSize: '1rem', fontWeight: 950, letterSpacing: '0.02em', color: 'var(--text-primary)' }}>
                      {getTransactionLabel(tx.type)}
                    </div>
                    <div className="audit-trail-item-details" style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 800 }}>
                      {tx.from && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Cpu size={14} /> FROM: {formatAddress(tx.from)}</span>}
                      {tx.to && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Navigation size={14} /> TO: {formatAddress(tx.to)}</span>}
                      <span className="audit-trail-time" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5 }}>
                        <Clock size={14} /> {new Date(tx.timestamp).toLocaleString().toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="audit-trail-item-right" style={{ gap: '4rem' }}>
                  <div className="audit-trail-amount" style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-primary)', textAlign: 'right', letterSpacing: '-0.02em' }}>
                    {formatAmount(tx.amount)} <span style={{ fontSize: '0.8rem', opacity: 0.4 }}>SUI</span>
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.1, background: 'var(--bg-main)', color: 'var(--sui-blue)', borderColor: 'var(--sui-blue)' }}
                    whileTap={{ scale: 0.9 }}
                    href={`https://suiscan.xyz/testnet/tx/${tx.txDigest}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="audit-trail-link card"
                    style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'transparent' }}
                  >
                    <ArrowUpRight size={20} strokeWidth={2.5} />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="audit-trail-footer" style={{ borderTop: '1px dashed var(--border-light)', paddingTop: '4rem', marginTop: '2rem' }}>
        <div className="audit-trail-stats" style={{ gap: '6rem' }}>
          <div className="audit-trail-stat">
            <span className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 950 }}>{fundingHistory.length}</span>
            <span className="stat-label" style={{ fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.2rem' }}>FUNDING_NODES</span>
          </div>
          <div className="audit-trail-stat">
            <span className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 950 }}>{executedPayments.length}</span>
            <span className="stat-label" style={{ fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.2rem' }}>PAYOUT_CYCLES</span>
          </div>
          <div className="audit-trail-stat">
            <span className="stat-value" style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--sui-blue)' }}>{allTransactions.length}</span>
            <span className="stat-label" style={{ fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.2rem' }}>TOTAL_TX_EVENTS</span>
          </div>
        </div>
        <div className="audit-trail-trust" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', opacity: 0.4 }}>
           <Globe size={18} />
           <span style={{ fontWeight: 950, letterSpacing: '0.1em', fontSize: '0.75rem' }}>DISTRIBUTED_LEDGER_SYNC: SUCCESS_100%</span>
        </div>
      </motion.div>
    </div>
  );
};
