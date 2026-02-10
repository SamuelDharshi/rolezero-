import React from 'react';
import { motion } from 'framer-motion';
import { useScheduledPayments } from '@/hooks/useScheduledPayments';
import { useArcScheduledPayments } from '@/hooks/useArcRoles';
import { formatTimestamp, getRoleStatus } from '@/utils/dateUtils';
import { Clock, Calendar, Wallet, ArrowRight, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';
import './ScheduledPayments.css';

export const ScheduledPayments: React.FC = () => {
  const { data: suiPayments = [], isLoading: suiLoading } = useScheduledPayments();
  const { data: arcPayments = [], isLoading: arcLoading } = useArcScheduledPayments();

  const allPayments = [...suiPayments, ...arcPayments].sort(
    (a, b) => a.scheduledTime - b.scheduledTime
  );

  const isLoading = suiLoading || arcLoading;

  // Categorize payments
  const readyPayments = allPayments.filter(p => !p.executed && Date.now() >= p.scheduledTime);
  const upcomingPayments = allPayments.filter(p => !p.executed && Date.now() < p.scheduledTime);

  return (
    <div className="scheduled-payments-page">
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
              <Clock size={48} />
            </div>
            <div>
              <h1>Scheduled Payments</h1>
              <p className="subtitle">Monitor and manage upcoming automatic payments</p>
            </div>
          </div>
          
          {!isLoading && (
            <div className="header-stats">
              <div className="stat-pill ready">
                <div className="stat-value">{readyPayments.length}</div>
                <div className="stat-label">Ready Now</div>
              </div>
              <div className="stat-pill upcoming">
                <div className="stat-value">{upcomingPayments.length}</div>
                <div className="stat-label">Upcoming</div>
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
              <p>Loading scheduled payments...</p>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        ) : allPayments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="empty-state"
          >
            <div className="empty-icon">
              <Calendar size={80} />
            </div>
            <h2>No Scheduled Payments</h2>
            <p>You don't have any scheduled payments yet. Create a payment role to get started!</p>
            <MovingBorderButton
              onClick={() => window.location.href = '/create'}
              borderRadius="1rem"
              className="cta-button"
            >
              <ArrowRight size={18} className="mr-2" />
              Create Payment Role
            </MovingBorderButton>
          </motion.div>
        ) : (
          <>
            {/* Ready Payments */}
            {readyPayments.length > 0 && (
              <div className="payments-section">
                <div className="section-header ready-header">
                  <div className="section-title">
                    <div className="pulse-icon"></div>
                    <h2>⚡ Ready for Execution</h2>
                  </div>
                  <span className="badge badge-ready">{readyPayments.length} Ready</span>
                </div>

                <div className="payments-grid">
                  {readyPayments.map((payment, idx) => (
                    <motion.div
                      key={`ready-${payment.chain}-${payment.roleId}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="payment-card ready-card"
                    >
                      <div className="card-header">
                        <div className="card-title">
                          <Wallet size={20} />
                          <h3>{payment.roleName || 'Payment Role'}</h3>
                        </div>
                        <div className="chain-badge">
                          {payment.chain.toUpperCase()}
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="info-row">
                          <span className="label">Recipient</span>
                          <span className="value mono">{payment.recipient.slice(0, 10)}...{payment.recipient.slice(-6)}</span>
                        </div>

                        <div className="info-row">
                          <span className="label">Amount</span>
                          <span className="value amount">
                            {typeof payment.amount === 'number' 
                              ? (payment.amount / 1_000_000_000).toFixed(4)
                              : payment.amount
                            } {payment.chain === 'sui' ? 'SUI' : 'USDC'}
                          </span>
                        </div>

                        <div className="info-row">
                          <span className="label">Scheduled</span>
                          <span className="value">{formatTimestamp(payment.scheduledTime)}</span>
                        </div>

                        <div className="info-row">
                          <span className="label">Status</span>
                          <span className="status-badge ready-status">
                            <span className="pulse-dot"></span>
                            Ready to Execute
                          </span>
                        </div>
                      </div>

                      <div className="card-footer">
                        <button className="btn-execute">
                          <AlertCircle size={16} />
                          Awaiting Auto-Execution
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Payments */}
            {upcomingPayments.length > 0 && (
              <div className="payments-section">
                <div className="section-header upcoming-header">
                  <div className="section-title">
                    <Clock size={24} />
                    <h2>📅 Upcoming Payments</h2>
                  </div>
                  <span className="badge badge-upcoming">{upcomingPayments.length} Scheduled</span>
                </div>

                <div className="payments-grid">
                  {upcomingPayments.map((payment, idx) => {
                    const timeUntil = payment.scheduledTime - Date.now();
                    const daysUntil = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
                    const hoursUntil = Math.floor((timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                    return (
                      <motion.div
                        key={`upcoming-${payment.chain}-${payment.roleId}-${idx}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (readyPayments.length + idx) * 0.05 }}
                        className="payment-card upcoming-card"
                      >
                        <div className="card-header">
                          <div className="card-title">
                            <Calendar size={20} />
                            <h3>{payment.roleName || 'Payment Role'}</h3>
                          </div>
                          <div className="chain-badge">
                            {payment.chain.toUpperCase()}
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="info-row">
                            <span className="label">Recipient</span>
                            <span className="value mono">{payment.recipient.slice(0, 10)}...{payment.recipient.slice(-6)}</span>
                          </div>

                          <div className="info-row">
                            <span className="label">Amount</span>
                            <span className="value amount">
                              {typeof payment.amount === 'number'
                                ? (payment.amount / 1_000_000_000).toFixed(4)
                                : payment.amount
                              } {payment.chain === 'sui' ? 'SUI' : 'USDC'}
                            </span>
                          </div>

                          <div className="info-row">
                            <span className="label">Scheduled For</span>
                            <span className="value">{formatTimestamp(payment.scheduledTime)}</span>
                          </div>

                          <div className="info-row">
                            <span className="label">Time Until</span>
                            <span className="value countdown">
                              {daysUntil > 0 && `${daysUntil}d `}
                              {hoursUntil}h
                            </span>
                          </div>
                        </div>

                        <div className="card-footer">
                          <button className="btn-view">
                            <ExternalLink size={16} />
                            View Role Details
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="info-banner"
            >
              <div className="info-icon">
                <Clock size={24} />
              </div>
              <div className="info-content">
                <h4>🤖 Automatic Execution</h4>
                <p>
                  Our 30-second auto-executor monitors all scheduled payments. When the scheduled time arrives,
                  payments execute automatically - no manual action required!
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
