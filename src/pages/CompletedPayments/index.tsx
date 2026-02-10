import React from 'react';
import { motion } from 'framer-motion';
import { useCompletedPayments } from '@/hooks/useCompletedPayments';
import { formatTimestamp } from '@/utils/dateUtils';
import { CheckCircle2, ExternalLink, Wallet, Calendar, Loader2, PartyPopper, TrendingUp } from 'lucide-react';
import './CompletedPayments.css';

export const CompletedPayments: React.FC = () => {
  const { data: payments = [], isLoading } = useCompletedPayments();

  // Calculate stats
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => {
    const amount = typeof p.amount === 'number' ? p.amount / 1_000_000_000 : parseFloat(p.amount) || 0;
    return sum + amount;
  }, 0);

  return (
    <div className="completed-payments-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-header"
        >
          <div className="header-content">
            <div className="header-icon">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h1>Completed Payments</h1>
              <p className="subtitle">Track your payment history and transaction records</p>
            </div>
          </div>
          
          {!isLoading && totalPayments > 0 && (
            <div className="header-stats">
              <div className="stat-pill">
                <div className="stat-value">{totalPayments}</div>
                <div className="stat-label">Total Payments</div>
              </div>
              <div className="stat-pill">
                <div className="stat-value">{totalAmount.toFixed(2)}</div>
                <div className="stat-label">Total Paid</div>
              </div>
            </div>
          )}
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="loading-state"
          >
            <div className="loading-container">
              <Loader2 size={64} className="spin" />
              <p>Loading completed payments...</p>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        ) : payments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="empty-state"
          >
            <div className="empty-icon">
              <Calendar size={80} />
            </div>
            <h2>No Completed Payments Yet</h2>
            <p>Your payment history will appear here once payments are executed.</p>
            <div className="empty-cta">
              <PartyPopper size={20} />
              <span>Start making payments to see your transaction history!</span>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Success Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="success-banner"
            >
              <div className="success-icon">
                <TrendingUp size={24} />
              </div>
              <div className="success-content">
                <h4>🎉 Payment History</h4>
                <p>
                  All payments executed successfully! Every transaction is recorded on-chain and
                  verifiable on the blockchain explorer.
                </p>
              </div>
            </motion.div>

            {/* Payments Grid */}
            <div className="payments-grid">
              {payments.map((payment, idx) => {
                const amount = typeof payment.amount === 'number'
                  ? (payment.amount / 1_000_000_000).toFixed(4)
                  : payment.amount;

                const explorerUrl = payment.chain === 'sui'
                  ? `https://suiscan.xyz/testnet/tx/${payment.transactionHash}`
                  : `https://explorer.${payment.chain}.com/tx/${payment.transactionHash}`;

                return (
                  <motion.div
                    key={payment.id || `${payment.transactionHash}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="payment-card"
                  >
                    {/* Success Ribbon */}
                    <div className="success-ribbon">
                      <CheckCircle2 size={16} />
                      <span>Completed</span>
                    </div>

                    <div className="card-header">
                      <div className="card-title">
                        <Wallet size={20} />
                        <h3>{payment.roleName || 'Payment Role'}</h3>
                      </div>
                      <div className="chain-badge">
                        {payment.chain?.toUpperCase() || 'SUI'}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="info-row">
                        <span className="label">Recipient</span>
                        <span className="value mono">
                          {payment.recipient.slice(0, 10)}...{payment.recipient.slice(-6)}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="label">Amount Paid</span>
                        <span className="value amount">
                          {amount} {payment.chain === 'sui' ? 'SUI' : 'USDC'}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="label">Executed At</span>
                        <span className="value">
                          {formatTimestamp(payment.executedAt)}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="label">Transaction</span>
                        <span className="value mono tx-hash">
                          {payment.transactionHash.slice(0, 10)}...
                        </span>
                      </div>
                    </div>

                    <div className="card-footer">
                      <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-explorer"
                      >
                        <ExternalLink size={16} />
                        View on Explorer
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Timeline View (Optional Alternative) */}
            <details className="timeline-section">
              <summary className="timeline-toggle">
                <Calendar size={20} />
                <span>View as Timeline</span>
              </summary>
              
              <div className="timeline">
                {payments.map((payment, idx) => (
                  <motion.div
                    key={`timeline-${payment.id}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="timeline-item"
                  >
                    <div className="timeline-marker">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h4>{payment.roleName || 'Payment'}</h4>
                        <span className="timeline-time">
                          {formatTimestamp(payment.executedAt)}
                        </span>
                      </div>
                      <div className="timeline-details">
                        <span>{typeof payment.amount === 'number'
                          ? (payment.amount / 1_000_000_000).toFixed(4)
                          : payment.amount
                        } {payment.chain === 'sui' ? 'SUI' : 'USDC'}</span>
                        <span>→</span>
                        <span className="mono">{payment.recipient.slice(0, 10)}...</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
};
