import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useAccount, useEnsText, useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { useCreateRole } from '@/hooks/useCreateRole';
import { useArcCreateRole } from '@/hooks/useArcPaymentRole';
import { useResolveEnsName } from '@/hooks/useResolveEnsName';
import { DEVELOPER_FEE_PERCENT } from '@/config/sui';
import { showToast } from '@/components/Toast/Toast';
import { Plus, X, Loader2, CheckCircle, Zap } from 'lucide-react';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';
import './CreateRole.css';

type SelectedChain = 'sui' | 'arc';

interface PaymentInput {
  id: number;
  recipient: string;
  amount: string;
  scheduledTime: string;
  resolvedAddress?: string;
  ensName?: string;
  token?: 'SUI' | 'USDC';
}

// Template configurations
const ROLE_TEMPLATES = {
  salary: {
    name: 'Monthly Salary',
    description: '6 monthly payments',
    payments: 6,
    intervalDays: 30,
    amount: '1',
  },
  subscription: {
    name: 'Subscription',
    description: '12 monthly recurring payments',
    payments: 12,
    intervalDays: 30,
    amount: '0.5',
  },
  freelance: {
    name: 'Freelance Project',
    description: '3 milestone payments',
    payments: 3,
    intervalDays: 14,
    amount: '2',
  },
  allowance: {
    name: 'Weekly Allowance',
    description: '4 weekly payments',
    payments: 4,
    intervalDays: 7,
    amount: '0.25',
  },
};

export const CreateRole: React.FC = () => {
  const navigate = useNavigate();
  const suiAccount = useCurrentAccount();
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { createRole: createSuiRole } = useCreateRole();
  const { createRole: createArcRole } = useArcCreateRole();
  const [searchParams] = useSearchParams();

  const [selectedChain, setSelectedChain] = useState<SelectedChain>('sui');
  const [roleName, setRoleName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [leftoverRecipient, setLeftoverRecipient] = useState('');
  const [payments, setPayments] = useState<PaymentInput[]>([
    { id: 1, recipient: '', amount: '', scheduledTime: '', token: selectedChain === 'sui' ? 'SUI' : 'USDC' },
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<{ digest: string; roleId: string | null } | null>(null);

  // Update token type when chain changes
  useEffect(() => {
    setPayments(prev => prev.map(payment => ({
      ...payment,
      token: selectedChain === 'sui' ? 'SUI' : 'USDC'
    })));
  }, [selectedChain]);

  // Check account connections for selected chain
  const isConnected = selectedChain === 'sui' ? !!suiAccount?.address : isEvmConnected;

  // Load template from URL parameter
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam && templateParam in ROLE_TEMPLATES) {
      const template = ROLE_TEMPLATES[templateParam as keyof typeof ROLE_TEMPLATES];
      
      // Set role name
      setRoleName(template.name);

      // Set start time to now
      const now = new Date();
      const startTimeStr = new Date(now.getTime() + 5 * 60000).toISOString().slice(0, 16); // Start in 5 minutes
      setStartTime(startTimeStr);

      // Calculate expiry (last payment + 30 days buffer)
      const expiryDate = new Date(now.getTime() + (template.intervalDays * template.payments + 30) * 24 * 60 * 60 * 1000);
      setExpiryTime(expiryDate.toISOString().slice(0, 16));

      // Generate payment schedule
      const generatedPayments: PaymentInput[] = [];
      for (let i = 0; i < template.payments; i++) {
        const scheduledDate = new Date(now.getTime() + (i * template.intervalDays * 24 * 60 * 60 * 1000));
        generatedPayments.push({
          id: Date.now() + i,
          recipient: '',
          amount: template.amount,
          scheduledTime: scheduledDate.toISOString().slice(0, 16),
          token: 'SUI',
        });
      }
      setPayments(generatedPayments);

      // Show success toast
      showToast({
        type: 'success',
        title: '✨ Template Loaded!',
        message: `${template.name} template with ${template.payments} payments loaded. Customize as needed.`,
        duration: 5000,
      });
    }
  }, [searchParams]);

  // ENS resolution for leftover recipient
  const leftoverEns = useResolveEnsName(leftoverRecipient);

  // Handle leftover recipient ENS resolution
  const leftoverAddress = leftoverEns.isEnsName && leftoverEns.address
    ? leftoverEns.address
    : leftoverRecipient;

  const addPayment = () => {
    setPayments([
      ...payments,
      { id: Date.now(), recipient: '', amount: '', scheduledTime: '', token: 'SUI' },
    ]);
  };

  const removePayment = (id: number) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const updatePayment = (id: number, field: keyof PaymentInput, value: string) => {
    setPayments(payments.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // Resolve ENS names for each payment
  const PaymentRow: React.FC<{ payment: PaymentInput }> = ({ payment }) => {
    const ensResolution = useResolveEnsName(payment.recipient);
    
    // Get ENS name from resolved address (for reverse lookup)
    const { data: reversedEnsName } = useEnsName({
      address: ensResolution.address as `0x${string}` | undefined,
      chainId: mainnet.id,
    });

    // Fetch ENS text records for payment preferences
    const ensNameToCheck = ensResolution.isEnsName ? payment.recipient : reversedEnsName;
    
    const { data: preferredToken } = useEnsText({
      name: ensNameToCheck || undefined,
      key: 'payment.preferredToken',
      chainId: mainnet.id,
    });

    const { data: minAmount } = useEnsText({
      name: ensNameToCheck || undefined,
      key: 'payment.minAmount',
      chainId: mainnet.id,
    });

    const { data: autoExecute } = useEnsText({
      name: ensNameToCheck || undefined,
      key: 'payment.autoExecute',
      chainId: mainnet.id,
    });

    const hasPreferences = !!(preferredToken || minAmount || autoExecute);
    const [showPreferencesBanner, setShowPreferencesBanner] = useState(false);

    useEffect(() => {
      if (ensResolution.isEnsName && ensResolution.address) {
        updatePayment(payment.id, 'resolvedAddress', ensResolution.address);
        updatePayment(payment.id, 'ensName', payment.recipient);
      }
    }, [ensResolution.address]);

    // Show preferences banner when detected
    useEffect(() => {
      if (hasPreferences && ensNameToCheck) {
        setShowPreferencesBanner(true);
      }
    }, [hasPreferences, ensNameToCheck]);

    const applyPreferences = () => {
      if (minAmount) {
        updatePayment(payment.id, 'amount', minAmount);
      }
      setShowPreferencesBanner(false);
      showToast({
        type: 'success',
        title: '✨ Preferences Applied!',
        message: `${ensNameToCheck}'s payment preferences have been applied`,
        duration: 3000,
      });
    };

    return (
      <div className="payment-row card">
        {/* ENS Preferences Banner */}
        {showPreferencesBanner && hasPreferences && (
          <div className="ens-preferences-banner">
            <div className="ens-preferences-content">
              <div className="ens-preferences-header">
                <Zap size={16} className="ens-preferences-icon" />
                <strong>{ensNameToCheck}</strong> has payment preferences!
              </div>
              <div className="ens-preferences-details">
                {preferredToken && <span>🪙 Token: {preferredToken}</span>}
                {minAmount && <span>💰 Min Amount: {minAmount}</span>}
                {autoExecute && <span>⚡ Auto-Execute: {autoExecute}</span>}
              </div>
            </div>
            <div className="ens-preferences-actions">
              <button
                type="button"
                className="btn-apply-preferences"
                onClick={applyPreferences}
              >
                Apply
              </button>
              <button
                type="button"
                className="btn-dismiss-preferences"
                onClick={() => setShowPreferencesBanner(false)}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
        
        <div className="payment-fields">
          <div className="form-group">
            <label>Recipient (Address or ENS)</label>
            <input
              type="text"
              placeholder="0x... or alice.eth"
              value={payment.recipient}
              onChange={(e) => updatePayment(payment.id, 'recipient', e.target.value)}
            />
            {ensResolution.isLoading && (
              <div className="ens-status">
                <Loader2 className="spin" size={14} /> Resolving ENS...
              </div>
            )}
            {ensResolution.address && (
              <div className="ens-status success">
                <CheckCircle size={14} /> Resolved: {ensResolution.address.slice(0, 10)}...{ensResolution.address.slice(-8)}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Amount ({selectedChain === 'sui' ? 'SUI' : 'USDC'})</label>
            <input
              type="number"
              placeholder="100"
              step="0.01"
              value={payment.amount}
              onChange={(e) => updatePayment(payment.id, 'amount', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Scheduled Time</label>
            <input
              type="datetime-local"
              value={payment.scheduledTime}
              onChange={(e) => updatePayment(payment.id, 'scheduledTime', e.target.value)}
            />
          </div>
        </div>

        {payments.length > 1 && (
          <button
            type="button"
            className="btn-icon btn-remove"
            onClick={() => removePayment(payment.id)}
          >
            <X size={18} />
          </button>
        )}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      showToast({
        type: 'warning',
        title: 'Wallet Not Connected',
        message: `Please connect your ${selectedChain.toUpperCase()} wallet to create a role`,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate leftover recipient address
      const isValidAddress = selectedChain === 'sui' 
        ? (leftoverAddress && leftoverAddress.length === 66 && leftoverAddress.startsWith('0x'))
        : (leftoverAddress && leftoverAddress.length === 42 && leftoverAddress.startsWith('0x'));
        
      if (!isValidAddress) {
        showToast({
          type: 'error',
          title: 'Invalid Address',
          message: `Leftover recipient address "${leftoverAddress}" is invalid. Must be a valid ${selectedChain.toUpperCase()} address (0x... ${selectedChain === 'sui' ? '66' : '42'} characters).`,
        });
        setIsSubmitting(false);
        return;
      }

      // Validate payment recipients
      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];
        const addr = payment.resolvedAddress || payment.recipient;
        
        const isValidPaymentAddress = selectedChain === 'sui' 
          ? (addr && addr.length === 66 && addr.startsWith('0x'))
          : (addr && addr.length === 42 && addr.startsWith('0x'));
        
        if (!isValidPaymentAddress) {
          showToast({
            type: 'error',
            title: `Invalid Payment #${i + 1}`,
            message: `Recipient address "${addr}" is invalid. Must be a valid ${selectedChain.toUpperCase()} address (0x... ${selectedChain === 'sui' ? '66' : '42'} characters).`,
          });
          setIsSubmitting(false);
          return;
        }

        if (!payment.amount || parseFloat(payment.amount) <= 0) {
          showToast({
            type: 'error',
            title: `Invalid Payment #${i + 1}`,
            message: 'Amount must be greater than 0',
          });
          setIsSubmitting(false);
          return;
        }

        if (!payment.scheduledTime) {
          showToast({
            type: 'error',
            title: `Invalid Payment #${i + 1}`,
            message: 'Scheduled time is required',
          });
          setIsSubmitting(false);
          return;
        }

        // Validate scheduled time is not in the past
        const scheduledDate = new Date(payment.scheduledTime).getTime();
        if (scheduledDate < Date.now()) {
          showToast({
            type: 'error',
            title: `Invalid Payment #${i + 1}`,
            message: 'Scheduled time cannot be in the past',
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Validate start time
      const startTimestamp = new Date(startTime).getTime();
      if (startTimestamp < Date.now()) {
        showToast({
          type: 'error',
          title: 'Invalid Start Time',
          message: 'Start time cannot be in the past',
        });
        setIsSubmitting(false);
        return;
      }

      // Validate expiry time is after start time
      const expiryTimestamp = new Date(expiryTime).getTime();
      if (expiryTimestamp <= startTimestamp) {
        showToast({
          type: 'error',
          title: 'Invalid Expiry Time',
          message: 'Expiry time must be after start time',
        });
        setIsSubmitting(false);
        return;
      }

      // Validate all payment times are between start and expiry
      for (let i = 0; i < payments.length; i++) {
        const scheduledTime = new Date(payments[i].scheduledTime).getTime();
        if (scheduledTime < startTimestamp) {
          showToast({
            type: 'error',
            title: `Invalid Payment #${i + 1}`,
            message: 'Payment is scheduled before role start time. All payments must be after start time.',
          });
          setIsSubmitting(false);
          return;
        }
        if (scheduledTime > expiryTimestamp) {
          showToast({
            type: 'error',
            title: `Invalid Payment #${i + 1}`,
            message: 'Payment is scheduled after role expiry time. All payments must be before expiry.',
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Helper function to convert SUI to MIST (moved inline for use)
      // Convert all inputs to proper format
      // Processed payments would be used in the actual transaction

      let result;

      if (selectedChain === 'sui') {
        // SUI chain logic
        const suiToMist = (sui: string): bigint => {
          return BigInt(Math.floor(parseFloat(sui) * 1_000_000_000));
        };

        const processedPayments = payments.map(p => ({
          recipient: p.resolvedAddress || p.recipient,
          amount: suiToMist(p.amount),
          scheduledTime: BigInt(new Date(p.scheduledTime || Date.now() + 86400000).getTime()), // Default to tomorrow if empty
          ensName: p.ensName,
        }));

        result = await createSuiRole({
          roleName,
          startTime: BigInt(new Date(startTime).getTime()),
          expiryTime: BigInt(new Date(expiryTime).getTime()),
          payments: processedPayments,
          leftoverRecipient: leftoverAddress,
        });
      } else {
        // Arc chain logic - convert bigint to number for Arc contract
        const processedPayments = payments.map(p => ({
          recipient: p.resolvedAddress || p.recipient,
          amount: Math.floor(parseFloat(p.amount) * 1_000_000), // USDC has 6 decimals
          scheduledTime: Math.floor(new Date(p.scheduledTime).getTime() / 1000), // Unix timestamp in seconds
          ensName: p.ensName,
        }));

        const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0).toString();
        
        result = await createArcRole({
          name: roleName,
          recipients: processedPayments.map(p => p.recipient),
          amounts: processedPayments.map(p => (p.amount / 1_000_000).toString()),
          scheduledTimes: processedPayments.map(p => p.scheduledTime),
          expiryTime: Math.floor(new Date(expiryTime).getTime() / 1000),
          totalAmount,
        });
      }

      setTxResult({
        digest: result?.digest || (result as any)?.hash || '',
        roleId: (result as any)?.roleId || null
      });
      
      showToast({
        type: 'success',
        title: 'Role Created Successfully!',
        message: `Your role "${roleName}" has been created and recorded on-chain with ${payments.length} scheduled payment${payments.length > 1 ? 's' : ''}.`,
        txDigest: result?.digest || (result as any)?.hash || '',
        duration: 10000,
      });
    } catch (error) {
      console.error('❌ Error creating role:', error);
      const errorMessage = (error as Error).message;
      
      // Show user-friendly error for RPC issues
      if (errorMessage.includes('Arc testnet is currently experiencing issues')) {
        showToast({
          type: 'warning',
          title: '🚧 Arc Testnet Unavailable',
          message: 'Arc testnet RPC is down. Switch to Sui blockchain for testing! Your Arc contract is ready when the network recovers.',
          duration: 8000,
        });
      } else {
        showToast({
          type: 'error',
          title: 'Failed to Create Role',
          message: errorMessage || 'Transaction could not be completed',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (txResult) {
    return (
      <div className="container create-role-page">
        <div className="card success-card">
          <CheckCircle size={64} className="text-rose" />
          <h2>Role Created Successfully!</h2>
          
          <div className="result-info">
            <div className="result-field">
              <label>Transaction Digest:</label>
              <code>{txResult.digest}</code>
            </div>
            
            {txResult.roleId && (
              <div className="result-field">
                <label>Role Object ID:</label>
                <code>{txResult.roleId}</code>
              </div>
            )}
          </div>

          <div className="button-group">
            <MovingBorderButton
              onClick={() => {
                if (txResult.roleId) {
                  navigate(`/role/${txResult.roleId}/live`);
                }
              }}
              borderRadius="0.75rem"
              className="btn btn-primary"
            >
              View Dashboard
            </MovingBorderButton>
            <MovingBorderButton
              onClick={() => window.location.reload()}
              borderRadius="0.75rem"
              className="btn btn-secondary"
            >
              Create New Role
            </MovingBorderButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container create-role-page">
      <h1>Create New Role</h1>
      <p className="subtitle">
        Set up an autonomous payment role on{' '}
        {selectedChain === 'sui' ? 'Sui blockchain (SUI tokens)' : 'Arc blockchain (USDC native)'}
      </p>

      {/* Template Indicator Banner */}
      {(() => {
        const template = searchParams.get('template');
        return template && template in ROLE_TEMPLATES && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
            border: '2px solid rgba(168, 85, 247, 0.5)',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(168, 85, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              ✨
            </div>
            <div style={{flex: 1}}>
              <h3 style={{margin: 0, marginBottom: '0.25rem', color: '#a78bfa', fontSize: '1.25rem'}}>
                Template Loaded: {ROLE_TEMPLATES[template as keyof typeof ROLE_TEMPLATES].name}
              </h3>
              <p style={{margin: 0, fontSize: '0.875rem', opacity: 0.9}}>
                Pre-configured with {ROLE_TEMPLATES[template as keyof typeof ROLE_TEMPLATES].description}. 
                Customize recipients, amounts, and schedules as needed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/create')}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                borderRadius: '0.5rem',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              Start Fresh
            </button>
          </div>
        );
      })()}

      <form onSubmit={handleSubmit} className="create-role-form">
        
        {/* 🚀 WEB3 AUTOMATION SUITE - Enhanced & Professional */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
          border: '2px solid rgba(59, 130, 246, 0.2)',
          padding: '2rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative blockchain circuit pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }} />

          {/* Suite Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
              }}>
                <Zap size={24} color="white" />
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  marginBottom: '0.25rem',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em'
                }}>
                  Web3 Automation Suite
                </h2>
                <p style={{
                  margin: 0, 
                  fontSize: '0.875rem', 
                  color: '#64748b',
                  fontWeight: '500'
                }}>
                  On-chain scheduling • Gas optimization • Multi-chain execution
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Role Details</h3>
          
          {/* ARC TESTNET STATUS WARNING */}
          {selectedChain === 'arc' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(220, 53, 69, 0.2) 100%)',
              border: '2px solid rgba(255, 193, 7, 0.5)',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                <span style={{fontSize: '1.25rem'}}>🚧</span>
                <strong style={{color: '#ffc107'}}>Arc Testnet Status</strong>
              </div>
              <div style={{lineHeight: '1.4', opacity: 0.9}}>
                Arc testnet RPC is experiencing intermittent issues. If role creation fails,
                <strong style={{color: '#4DA2FF'}}> switch to Sui blockchain</strong> for reliable testing!
                Your Arc contract (0xd914...138) is deployed and ready when the network recovers.
              </div>
            </div>
          )}
          
          {/* BLOCKCHAIN SELECTOR */}
          <div className="form-group" style={{marginBottom: '1.5rem'}}>
            <label style={{marginBottom: '0.5rem', display: 'block', fontWeight: 'bold'}}>
              Choose Blockchain *
            </label>
            <div style={{display: 'flex', gap: '1rem', marginBottom: '0.5rem'}}>
              <button
                type="button"
                onClick={() => setSelectedChain('sui')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: selectedChain === 'sui' ? '2px solid #4DA2FF' : '2px solid #333',
                  borderRadius: '0.75rem',
                  background: selectedChain === 'sui' 
                    ? 'linear-gradient(135deg, rgba(77, 162, 255, 0.2) 0%, rgba(30, 92, 206, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{fontSize: '1.5rem'}}>🌊</div>
                <div>
                  <div style={{fontWeight: 'bold', marginBottom: '0.25rem'}}>Sui</div>
                  <div style={{fontSize: '0.75rem', opacity: 0.7}}>Pay with SUI • DeFi Optimized</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedChain('arc')}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: selectedChain === 'arc' ? '2px solid #007bff' : '2px solid #333',
                  borderRadius: '0.75rem',
                  background: selectedChain === 'arc' 
                    ? 'linear-gradient(135deg, rgba(0, 123, 255, 0.2) 0%, rgba(0, 86, 179, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{fontSize: '1.5rem'}}>⚡</div>
                <div>
                  <div style={{fontWeight: 'bold', marginBottom: '0.25rem'}}>Arc</div>
                  <div style={{fontSize: '0.75rem', opacity: 0.7}}>Pay with USDC • Institutional</div>
                </div>
              </button>
            </div>
            
            {/* WALLET CONNECTION STATUS */}
            <div style={{fontSize: '0.875rem', color: isConnected ? 'green' : '#ff6b6b', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Zap size={14} />
              {isConnected 
                ? `✅ Connected to ${selectedChain.toUpperCase()}: ${
                    selectedChain === 'sui' 
                      ? `${suiAccount?.address.slice(0, 6)}...${suiAccount?.address.slice(-4)}`
                      : `${evmAddress?.slice(0, 6)}...${evmAddress?.slice(-4)}`
                  }`
                : `❌ Connect your ${selectedChain.toUpperCase()} wallet to continue`
              }
            </div>
          </div>
          
          <div className="form-group">
            <label>Role Name *</label>
            <input
              type="text"
              placeholder="Marketing Campaign Manager"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Expiry Time *</label>
              <input
                type="datetime-local"
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Leftover Recipient (Address or ENS) *</label>
            <input
              type="text"
              placeholder="0x... or treasury.eth"
              value={leftoverRecipient}
              onChange={(e) => setLeftoverRecipient(e.target.value)}
              required
            />
            {leftoverEns.isLoading && (
              <div className="ens-status">
                <Loader2 className="spin" size={14} /> Resolving ENS...
              </div>
            )}
            {leftoverEns.address && (
              <div className="ens-status success">
                <CheckCircle size={14} /> Resolved: {leftoverEns.address.slice(0, 10)}...{leftoverEns.address.slice(-8)}
              </div>
            )}
          </div>

          <div className="fee-info">
            <span>Developer Fee:</span>
            <span className="text-rose">{DEVELOPER_FEE_PERCENT * 100}%</span>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <h3>Scheduled Payments</h3>
            <MovingBorderButton
              type="button"
              onClick={addPayment}
              borderRadius="0.75rem"
              className="btn btn-secondary"
            >
              <Plus size={18} /> Add Payment
            </MovingBorderButton>
          </div>

          <div className="payments-list">
            {payments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
            ))}
          </div>
        </div>

        <MovingBorderButton
          type="submit"
          disabled={isSubmitting || !isConnected}
          borderRadius="0.75rem"
          className="btn btn-primary btn-large"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="spin" /> Creating Role...
            </>
          ) : (
            'Create Role'
          )}
        </MovingBorderButton>

        {!isConnected && (
          <p className="warning-text">⚠️ Please connect your Sui wallet to create a role</p>
        )}
      </form>
    </div>
  );
};