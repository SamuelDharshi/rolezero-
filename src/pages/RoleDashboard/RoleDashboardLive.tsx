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
  Play
} from 'lucide-react';
import { shortenAddress } from '@/utils/ens';
import { getTokenIcon } from '@/utils/token';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';
import './RoleDashboardLive.css';

export const RoleDashboardLive: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const suiAccount = useCurrentAccount();
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { data: roleData, isLoading, error } = useRoleData(roleId);
  const { data: liveTransactions, isLoading: txLoading } = useLiveTransactions(roleId);
  const extendExpiry = useExtendExpiry(roleId || '');
  const executePayments = useExecutePayments(roleId || '', roleData?.remainingBalance || 0);
  const executeExpiry = useExecuteExpiry(roleId || '', roleData?.remainingBalance || 0);

  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [isExtending, setIsExtending] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Calculate isCreator and isActive BEFORE calling useAutoPaymentMonitor (must be before conditional returns)
  const normalizeAddress = (addr: string) => addr?.toLowerCase().trim();
  const suiConnected = normalizeAddress(suiAccount?.address || '');
  const evmConnected = normalizeAddress(evmAddress || '');
  const creatorAddress = normalizeAddress(roleData?.creator || '');
  // Check BOTH EVM and Sui wallets - user might have either connected
  const isCreator = !!roleData && ((!!evmConnected && evmConnected === creatorAddress) || (!!suiConnected && suiConnected === creatorAddress)) ? true : false;
  
  const isExpired = !!roleData && Date.now() > roleData.expiryTime;
  const isActive = !!roleData && typeof roleData.startTime === 'number' && !isExpired && Date.now() >= roleData.startTime;

  // Auto-payment monitor for automatic execution
  const { status: monitorStatus, toggleAutoExecute } = useAutoPaymentMonitor(roleData, isCreator, isActive);

  // NOW safe to have conditional returns (all hooks called above)
  if (isLoading) {
    return <SkeletonDashboard />;
  }

  if (error || !roleData) {
    return (
      <div className="container dashboard-error">
        <h2>Error Loading Role</h2>
        <p>{error?.message || 'Role not found'}</p>
        <MovingBorderButton
          borderRadius="1.5rem"
          onClick={() => navigate('/')}
          className="bg-slate-900 text-white border-slate-800"
          containerClassName="h-12 w-48"
        >
          Back to Home
        </MovingBorderButton>
      </div>
    );
  }

  // Debug logging for access control
  console.log('🔐 ACCESS CONTROL CHECK:');
  console.log('Connected Sui Wallet:', suiAccount?.address);
  console.log('Connected EVM Wallet:', evmAddress);
  console.log('Role Creator:', roleData.creator);
  console.log('Normalized Sui:', suiConnected);
  console.log('Normalized EVM:', evmConnected);
  console.log('Normalized Creator:', creatorAddress);
  console.log('Is Creator?', isCreator);
  console.log('Sui Match:', suiConnected === creatorAddress);
  console.log('EVM Match:', evmConnected === creatorAddress);

  // ACCESS CONTROL: Only creator can view dashboard
  // Sponsors should only see payment page, not dashboard
  if (suiAccount && !isCreator) {
    return (
      <div className="container dashboard-error">
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
          border: '2px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '1.5rem',
          padding: '3rem',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            background: 'rgba(239, 68, 68, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <AlertCircle size={50} style={{color: '#ef4444'}} />
          </div>
          
          <h2 style={{fontSize: '1.75rem', marginBottom: '1rem', color: '#ef4444'}}>
            Dashboard Access Not Allowed
          </h2>
          
          <p style={{fontSize: '1.125rem', marginBottom: '0.5rem'}}>
            This dashboard is only for the role creator.
          </p>
          
          <p style={{fontSize: '0.875rem', opacity: 0.8, marginBottom: '1rem'}}>
            As a sponsor, you can fund this role using the payment page.
          </p>
          
          <details style={{marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', textAlign: 'left', fontSize: '0.75rem', fontFamily: 'monospace'}}>
            <summary style={{cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 'bold'}}>🔍 Debug Info</summary>
            <div style={{opacity: 0.9, wordBreak: 'break-all'}}>
              <p><strong>Your Wallet:</strong> {suiAccount?.address}</p>
              <p><strong>Creator Wallet:</strong> {roleData.creator}</p>
              <p><strong>Match:</strong> <span style={{color: isCreator ? '#10b981' : '#ef4444', fontWeight: 'bold'}}>{isCreator ? '✅ YES (You are creator)' : '❌ NO (Different wallet)'}</span></p>
            </div>
          </details>
          
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <MovingBorderButton
              borderRadius="0.75rem"
              onClick={() => navigate(`/sponsor/${roleId}`)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              containerClassName="h-12 w-48"
            >
              Go to Payment Page
            </MovingBorderButton>
            
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleExtendExpiry = async () => {
    if (!newExpiryDate) return;

    const newExpiry = new Date(newExpiryDate).getTime();
    if (newExpiry <= roleData.expiryTime) {
      showToast({
        type: 'error',
        title: 'Invalid Expiry Date',
        message: 'New expiry must be later than current expiry',
      });
      return;
    }

    setIsExtending(true);
    try {
      const result = await extendExpiry.mutateAsync(newExpiry);
      showToast({
        type: 'success',
        title: 'Expiry Extended!',
        message: `Expiry time updated to ${format(newExpiry, 'MMM d, yyyy HH:mm')}`,
        txDigest: result.digest,
      });
      setNewExpiryDate('');
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Failed to Extend',
        message: err.message || 'Could not extend expiry time',
      });
    } finally {
      setIsExtending(false);
    }
  };

  const getTotalFunding = () => {
    return liveTransactions
      ?.filter(tx => tx.type === 'funding' && tx.status === 'success')
      .reduce((sum, tx) => sum + tx.amount, 0) || 0;
  };

  const getTotalPayments = () => {
    return liveTransactions
      ?.filter(tx => tx.type === 'payment' && tx.status === 'success')
      .reduce((sum, tx) => sum + tx.amount, 0) || 0;
  };

  const getPendingCount = () => {
    return liveTransactions?.filter(tx => tx.status === 'pending').length || 0;
  };

  return (
    <div className="container dashboard-live-page">
      {/* Auto-Execute Status Indicator */}
      {isCreator && monitorStatus && (
        <AutoExecutorStatus
          isMonitoring={monitorStatus.isMonitoring}
          autoExecuteEnabled={monitorStatus.autoExecuteEnabled}
          readyCount={monitorStatus.readyCount}
          onToggle={toggleAutoExecute}
        />
      )}
      
      {/* Critical Warning Banner - Recipient Mismatch */}
      {suiAccount && roleData.payments.some(p => 
        p.recipient !== suiAccount.address && 
        !roleData.executedPayments.some(ep => ep.recipient === p.recipient)
      ) && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
          border: '2px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'start',
          gap: '1rem'
        }}>
          <AlertCircle size={32} style={{color: '#ef4444', flexShrink: 0}} />
          <div>
            <h3 style={{color: '#ef4444', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold'}}>
              ⚠️ Warning: Payment Recipients Don't Match Your Wallet!
            </h3>
            <p style={{marginBottom: '0.5rem'}}>
              Some scheduled payments are set to go to <strong>different addresses</strong>, not your connected wallet.
            </p>
            <p style={{fontSize: '0.875rem', opacity: 0.9}}>
              When you execute payments, funds will be sent to the recipient addresses listed below, NOT to your wallet ({shortenAddress(suiAccount.address, 8)}).
            </p>
            <div style={{marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem'}}>
              {roleData.payments.filter(p => !roleData.executedPayments.some(ep => ep.recipient === p.recipient)).map((p, i) => (
                <div key={i} style={{marginBottom: '0.5rem', fontSize: '0.875rem'}}>
                  Payment #{i+1}: <code>{shortenAddress(p.recipient, 10)}</code> - {(p.amount / 1_000_000_000).toFixed(4)} SUI
                  {p.recipient === suiAccount.address ? 
                    <span style={{color: '#10b981', marginLeft: '0.5rem'}}>✅ Your wallet</span> : 
                    <span style={{color: '#ef4444', marginLeft: '0.5rem'}}>❌ Different wallet</span>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-info">
          <h1>{roleData.name}</h1>
          <div className="role-meta">
            <span className={`status-badge ${isActive ? 'active' : isExpired ? 'expired' : 'pending'}`}>
              {isActive ? '🟢 Active' : isExpired ? '🔴 Expired' : '🟡 Pending'}
            </span>
            <span className="role-id">ID: {shortenAddress(roleId || '', 6)}</span>
            {roleData.token && (
              <span className="token-badge">
                {getTokenIcon(roleData.token)} {roleData.token}
              </span>
            )}
          </div>
        </div>

        <div className="header-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <MovingBorderButton
            borderRadius="1.5rem"
            onClick={() => executePayments.mutate()}
            disabled={executePayments.isPending || roleData.remainingBalance <= 0}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
            containerClassName="h-12 w-56"
          >
            {executePayments.isPending ? (
              <>
                <Loader2 size={18} className="spin mr-2" />
                Executing...
              </>
            ) : (
              <>
                <Play size={18} className="mr-2" />
                Execute Payments Now
              </>
            )}
          </MovingBorderButton>
          
          <MovingBorderButton
            borderRadius="1.5rem"
            onClick={() => {
              const sponsorUrl = `${window.location.origin}/sponsor/${roleId}`;
              navigator.clipboard.writeText(sponsorUrl);
              alert('✅ Sponsor link copied to clipboard!\n\nShare this link with sponsors:\n' + sponsorUrl);
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            containerClassName="h-12 w-56"
          >
            <ExternalLink size={18} className="mr-2" />
            Copy Sponsor Link
          </MovingBorderButton>
          
          <MovingBorderButton
            borderRadius="1.5rem"
            onClick={() => navigate(`/sponsor/${roleId}`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            containerClassName="h-12 w-48"
          >
            <TrendingUp size={18} className="mr-2" />
            Sponsor Now
          </MovingBorderButton>
        </div>
      </div>

      {/* Live Stats Grid */}
      <div className="live-stats-grid">
        <div className="stat-card card gradient-blue">
          <div className="stat-icon">
            <ArrowDownRight size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Funded</div>
            <div className="stat-value">{(getTotalFunding() / 1_000_000_000).toFixed(4)} SUI</div>
            <div className="stat-sublabel">{liveTransactions?.filter(tx => tx.type === 'funding').length || 0} transactions</div>
          </div>
        </div>

        <div className="stat-card card gradient-purple">
          <div className="stat-icon">
            <ArrowUpRight size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Payments</div>
            <div className="stat-value">{(getTotalPayments() / 1_000_000_000).toFixed(4)} SUI</div>
            <div className="stat-sublabel">{liveTransactions?.filter(tx => tx.type === 'payment').length || 0} executed</div>
          </div>
        </div>

        <div className="stat-card card gradient-green">
          <div className="stat-icon">
            <Wallet size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Current Balance</div>
            <div className="stat-value">{(roleData.remainingBalance / 1_000_000_000).toFixed(4)} SUI</div>
            <div className="stat-sublabel">Available now</div>
          </div>
        </div>

        <div className="stat-card card gradient-orange">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Expires</div>
            <div className="stat-value">{formatTimestamp(roleData.expiryTime, 'MMM d, yyyy')}</div>
            <div className="stat-sublabel">{formatTimestamp(roleData.expiryTime, 'HH:mm:ss')}</div>
          </div>
        </div>
      </div>

      {/* Shareable Sponsor Link Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
        border: '2px solid rgba(168, 85, 247, 0.3)',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
          <div style={{flex: 1, minWidth: '300px'}}>
            <h3 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
              <ExternalLink size={20} />
              <span>Share with Sponsors</span>
            </h3>
            <p style={{fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.75rem'}}>
              Copy and share this link with sponsors so they can fund this role
            </p>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              wordBreak: 'break-all',
              border: '1px solid rgba(168, 85, 247, 0.3)'
            }}>
              {window.location.origin}/sponsor/{roleId}
            </div>
          </div>
          <MovingBorderButton
            borderRadius="0.75rem"
            onClick={() => {
              const sponsorUrl = `${window.location.origin}/sponsor/${roleId}`;
              navigator.clipboard.writeText(sponsorUrl);
              showToast({
                type: 'success',
                title: 'Link Copied!',
                message: 'Sponsor link copied to clipboard. Share it with sponsors to receive funding.',
              });
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            containerClassName="h-12 w-40"
          >
            <ExternalLink size={16} className="mr-2" />
            Copy Link
          </MovingBorderButton>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-main-grid">


        {/* Completed Payments Section */}
        {roleData.executedPayments.length > 0 && (
          <div className="card completed-payments-card">
            <div className="card-header">
              <h3>
                <CheckCircle size={20} style={{color: '#10b981'}} />
                Completed Payments
              </h3>
              <span className="badge" style={{background: '#10b981', color: 'white', fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '1rem'}}>
                {roleData.executedPayments.length} Executed
              </span>
            </div>

            <div className="payments-list">
              {roleData.executedPayments.map((payment, index) => {
                const executedDate = new Date(payment.timestamp);
                
                return (
                  <div key={index} className="payment-item" style={{background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
                    <div className="payment-info">
                      <div className="payment-recipient">
                        <CheckCircle size={16} style={{color: '#10b981'}} />
                        {shortenAddress(payment.recipient)}
                      </div>
                      <div className="payment-time">
                        ✅ Executed: {format(executedDate, 'MMM d, yyyy HH:mm:ss')}
                      </div>
                    </div>
                    
                    <div className="payment-amount" style={{color: '#10b981'}}>
                      {(payment.amount / 1_000_000_000).toFixed(4)} SUI
                    </div>

                    <div className="payment-status">
                      <a
                        href={`https://suiscan.xyz/testnet/tx/${payment.txDigest}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="badge badge-ready"
                        style={{background: '#10b981', color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem'}}
                      >
                        View TX <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Live Transaction Feed */}
        <div className="card live-transactions-card">
          <div className="card-header">
            <h3>
              <RefreshCw size={20} className={txLoading ? 'spin' : ''} />
              Live Transaction Feed
            </h3>
            <span className="live-indicator">
              <span className="pulse"></span>
              Live
            </span>
          </div>

          {!liveTransactions || liveTransactions.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={48} />
              <p>No transactions yet</p>
              <p className="text-sm">Transactions will appear here in real-time</p>
            </div>
          ) : (
            <div className="transactions-feed">
              {liveTransactions.map((tx, index) => (
                <div key={`${tx.txDigest}-${index}`} className={`transaction-item ${tx.type} ${tx.status}`}>
                  <div className="tx-icon">
                    {tx.status === 'success' && <CheckCircle size={20} />}
                    {tx.status === 'pending' && <Loader2 size={20} className="spin" />}
                    {tx.status === 'failed' && <XCircle size={20} />}
                  </div>

                  <div className="tx-content">
                    <div className="tx-type-badge">
                      {tx.type === 'funding' ? (
                        <span className="badge badge-funding">📥 Funding Received</span>
                      ) : tx.type === 'payment' ? (
                        <span className="badge badge-payment">📤 Payment Sent</span>
                      ) : (
                        <span className="badge badge-created">🎉 Role Created</span>
                      )}
                    </div>

                    <div className="tx-addresses">
                      <span className="from">
                        <Wallet size={14} />
                        From: {shortenAddress(tx.from)}
                      </span>
                      {tx.to && (
                        <>
                          <span className="arrow">→</span>
                          <span className="to">
                            To: {shortenAddress(tx.to)}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="tx-details">
                      {tx.amount > 0 && (
                        <span className="tx-amount">
                          {tx.type === 'funding' ? '+' : tx.type === 'payment' ? '-' : ''}
                          {(tx.amount / 1_000_000_000).toFixed(4)} SUI
                        </span>
                      )}
                      <span className="tx-time">
                        {format(tx.timestamp, 'HH:mm:ss')}
                      </span>
                    </div>

                    <a
                      href={`https://suiexplorer.com/txblock/${tx.txDigest}?network=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tx-link"
                    >
                      View Details <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className={`tx-status-indicator ${tx.status}`}></div>
                </div>
              ))}
            </div>
          )}

          {getPendingCount() > 0 && (
            <div className="pending-banner">
              <Loader2 size={16} className="spin" />
              {getPendingCount()} transaction{getPendingCount() > 1 ? 's' : ''} pending...
            </div>
          )}
        </div>

        {/* ⚡ Decentralized Payment Execution */}
        {isActive && roleData.payments.some(p => 
          !roleData.executedPayments.some(ep => ep.recipient === p.recipient && ep.amount === p.amount)
        ) && (
          <div className="card payment-execution-card" style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '2px solid rgba(99, 102, 241, 0.3)'
          }}>
            <div className="card-header">
              <h3 style={{color: '#6366F1'}}>
                <Play size={20} />
                ⚡ Permissionless Execution
              </h3>
              <span className="badge" style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                DECENTRALIZED
              </span>
            </div>

            <div style={{marginBottom: '1rem', padding: '1rem'}}>
              <p style={{marginBottom: '0.5rem', color: '#6366F1', fontWeight: 600, fontSize: '1.1rem'}}>
                ✨ Anyone Can Execute Ready Payments
              </p>
              <p style={{fontSize: '0.875rem', opacity: 0.9, marginBottom: '1rem'}}>
                This is a <strong>permissionless system</strong> - no centralized bots needed!
                When payments are ready, anyone can execute them directly on the blockchain.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}>
                  <div style={{fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    Scheduled
                  </div>
                  <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#6366F1'}}>
                    {roleData.payments.filter(p => 
                      !roleData.executedPayments.some(ep => ep.recipient === p.recipient && ep.amount === p.amount)
                    ).length}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <div style={{fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    Ready Now
                  </div>
                  <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#22c55e'}}>
                    {roleData.payments.filter(p => 
                      !roleData.executedPayments.some(ep => ep.recipient === p.recipient && ep.amount === p.amount) &&
                      Date.now() >= p.scheduledTime
                    ).length}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{fontSize: '2rem'}}>⚡</div>
              <div style={{flex: 1}}>
                <div style={{fontWeight: 700, marginBottom: '0.5rem', color: '#6366F1'}}>
                  How Permissionless Execution Works:
                </div>
                <ul style={{fontSize: '0.875rem', lineHeight: '1.6', marginLeft: '1.25rem', opacity: 0.95}}>
                  <li>Any wallet can execute ready payments - no special privileges needed</li>
                  <li>Payments only execute if scheduled time has passed (enforced by smart contract)</li>
                  <li>Fully decentralized - no bots, no servers, no downtime</li>
                  <li>Executor pays only gas fees (~0.001 SUI) and can be anyone</li>
                  <li>View execution history in the <strong>Completed Payments</strong> page</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Execute Expiry - Return Leftover Funds */}
        {isExpired && roleData.remainingBalance > 0 && (
          <div className="card" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: '2px solid #34d399'}}>
            <div className="card-header">
              <h3 style={{color: '#fff'}}>
                <CheckCircle size={20} />
                Return Leftover Funds
              </h3>
            </div>

            <div style={{padding: '1.5rem'}}>
              <div style={{marginBottom: '1rem', color: 'rgba(255,255,255,0.95)', lineHeight: '1.6'}}>
                <p style={{marginBottom: '0.75rem', fontWeight: 600, fontSize: '1.1rem'}}>
                  ✅ This role has expired with leftover funds
                </p>
                <p style={{marginBottom: '0.5rem'}}>
                  <strong>Leftover Balance:</strong> {(roleData.remainingBalance / 1_000_000_000).toFixed(4)} SUI
                </p>
                <p style={{marginBottom: '0.5rem'}}>
                  <strong>Recipient:</strong> {roleData.leftoverRecipient.substring(0, 8)}...{roleData.leftoverRecipient.substring(roleData.leftoverRecipient.length - 6)}
                </p>
                <p style={{fontSize: '0.875rem', opacity: 0.9, marginTop: '0.75rem', marginBottom: '0.5rem'}}>
                  💡 <strong>How it works:</strong> This triggers the smart contract to return leftover funds to the leftover recipient. 
                  You only pay a small gas fee (~0.001 SUI).
                </p>
              </div>
              <MovingBorderButton
                borderRadius="0.75rem"
                onClick={() => executeExpiry.mutate()}
                disabled={executeExpiry.isPending}
                className="bg-white text-green-600"
                containerClassName="h-12 w-full"
              >
                {executeExpiry.isPending ? (
                  <>
                    <Loader2 className="spin mr-2" size={16} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-2" />
                    Return Leftover Funds Now
                  </>
                )}
              </MovingBorderButton>
            </div>
          </div>
        )}

        {/* Extend Expiry Time - Available to Everyone */}
        <div className="card expiry-card">
          <div className="card-header">
            <h3>
              <Calendar size={20} />
              Extend Expiry Time
            </h3>
            {!isCreator && (
              <span className="badge badge-info" style={{marginLeft: 'auto', fontSize: '0.75rem', padding: '0.25rem 0.5rem'}}>
                Anyone can extend
              </span>
            )}
          </div>

          <div className="expiry-content">
            <div className="current-expiry">
              <label>Current Expiry:</label>
              <div className="expiry-value">
                {formatTimestamp(roleData.expiryTime, 'PPP p')}
              </div>
              <div className={`expiry-status ${isExpired ? 'expired' : isActive ? 'active' : 'upcoming'}`} style={{marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 600}}>
                {isExpired ? '❌ Expired' : isActive ? '✅ Active' : '⏳ Not Started'}
              </div>
            </div>

            <div className="new-expiry-input">
              <label htmlFor="newExpiry">New Expiry Date & Time:</label>
              <input
                type="datetime-local"
                id="newExpiry"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                min={formatTimestamp(roleData.expiryTime, "yyyy-MM-dd'T'HH:mm")}
                className="datetime-input"
              />
            </div>

            <MovingBorderButton
              borderRadius="0.75rem"
              onClick={handleExtendExpiry}
              disabled={!newExpiryDate || isExtending || !suiAccount}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full"
              containerClassName="w-full"
            >
              {isExtending ? (
                <>
                  <Loader2 size={18} className="spin mr-2" />
                  Extending...
                </>
              ) : !suiAccount ? (
                <>
                  <Wallet size={18} className="mr-2" />
                  Connect Wallet to Extend
                </>
              ) : (
                <>
                  <Clock size={18} className="mr-2" />
                  Extend Expiry
                </>
              )}
            </MovingBorderButton>

            <p className="helper-text">
              💡 {isCreator ? 'As creator, you can extend the expiry time' : 'Anyone can extend the expiry time to keep this role active longer'}
            </p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="security-notice card">
        <AlertCircle size={20} />
        <div>
          <strong>Secure & Live:</strong> All transactions are verified on the Sui blockchain. 
          Data updates every 3 seconds for real-time monitoring. Sponsor payments appear instantly.
        </div>
        <button 
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          style={{
            marginLeft: 'auto',
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '0.5rem',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          {showDebugInfo ? '🔍 Hide Debug' : '🔍 Show Debug Info'}
        </button>
      </div>

      {/* Debug Panel */}
      {showDebugInfo && (
        <div className="card" style={{
          background: 'rgba(0,0,0,0.5)',
          border: '2px solid #fbbf24',
          padding: '1.5rem'
        }}>
          <h3 style={{color: '#fbbf24', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            🔍 Debug Information
          </h3>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem'}}>
            <div>
              <strong style={{color: '#fbbf24'}}>Connection:</strong>
              <div>Wallet Connected: {suiAccount ? '✅ Yes' : '❌ No'}</div>
              <div>Wallet Address: {suiAccount?.address ? shortenAddress(suiAccount.address, 8) : 'Not connected'}</div>
              <div>Role ID: {shortenAddress(roleId || '', 8)}</div>
            </div>

            <div>
              <strong style={{color: '#fbbf24'}}>Role Status:</strong>
              <div>Is Creator: {isCreator ? '✅ Yes' : '❌ No'}</div>
              <div>Is Active: {isActive ? '✅ Yes' : '❌ No'}</div>
              <div>Is Expired: {isExpired ? '✅ Yes' : '❌ No'}</div>
              <div>Current Time: {format(Date.now(), 'PPP p')}</div>
            </div>

            <div>
              <strong style={{color: '#fbbf24'}}>Payments:</strong>
              <div>Total Scheduled: {roleData.payments.length}</div>
              <div>Executed: {roleData.executedPayments.length}</div>
              <div>Ready Now: {roleData.payments.filter(p => 
                !roleData.executedPayments.some(ep => ep.recipient === p.recipient) && 
                Date.now() >= p.scheduledTime && 
                isActive
              ).length}</div>
              <div>Balance: {(roleData.remainingBalance / 1_000_000_000).toFixed(4)} SUI</div>
            </div>

            <div>
              <strong style={{color: '#fbbf24'}}>Transactions:</strong>
              <div>Total Found: {liveTransactions?.length || 0}</div>
              <div>Funding Txs: {liveTransactions?.filter(tx => tx.type === 'funding').length || 0}</div>
              <div>Payment Txs: {liveTransactions?.filter(tx => tx.type === 'payment').length || 0}</div>
              <div>Status: {txLoading ? '🔄 Loading...' : '✅ Loaded'}</div>
            </div>
          </div>

          <div style={{marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem'}}>
            <strong style={{color: '#fbbf24'}}>🔍 Troubleshooting:</strong>
            <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.875rem'}}>
              <li>Open browser console (F12) to see detailed logs</li>
              <li>After executing, look for transaction digest in console</li>
              <li>Check Sui Explorer: https://suiscan.xyz/testnet/tx/YOUR_DIGEST</li>
              <li>Verify recipient address matches your wallet</li>
              <li>Check role balance is sufficient for payments</li>
              <li>Live feed updates every 5 seconds - wait a moment</li>
            </ul>
          </div>

          <div style={{marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.5)'}}>
            <strong style={{color: '#60a5fa'}}>📋 Payment Details:</strong>
            {roleData.payments.map((p, i) => {
              const executed = roleData.executedPayments.some(ep => ep.recipient === p.recipient && ep.amount === p.amount);
              const ready = !executed && Date.now() >= p.scheduledTime && isActive;
              return (
                <div key={i} style={{marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.25rem', fontSize: '0.875rem'}}>
                  <div>Payment #{i+1}:</div>
                  <div>Recipient: {shortenAddress(p.recipient, 8)}</div>
                  <div>Amount: {(p.amount / 1_000_000_000).toFixed(4)} SUI</div>
                  <div>Scheduled: {formatTimestamp(p.scheduledTime, 'PPP p')}</div>
                  <div>Status: {executed ? '⚪ Executed' : ready ? '🟢 Ready' : '🟡 Scheduled'}</div>
                  <div>Your Wallet Matches: {suiAccount?.address === p.recipient ? '✅ Yes' : '❌ No'}</div>
                </div>
              );
            })}
          </div>

          <div style={{marginTop: '1rem', textAlign: 'center'}}>
            <a 
              href={`https://suiscan.xyz/testnet/object/${roleId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                borderRadius: '0.5rem',
                color: '#60a5fa',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              🔗 View Role on Sui Explorer
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
