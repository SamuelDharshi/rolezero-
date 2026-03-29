import React, { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Plus, 
  Trash2, 
  Calendar, 
  Wallet, 
  User, 
  Settings, 
  Shield, 
  Cpu, 
  Activity, 
  Terminal,
  Grid,
  Layers,
  Smartphone,
  Fingerprint,
  Award,
  Globe,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Search,
  Hash,
  Clock,
  Navigation,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { showToast } from '@/components/Toast/Toast';
import './RoleDashboard.css';

const PACKAGE_ID = '0x0067cc0149eabee42d24049acabd450486977295fac652f71dd5b2f4f69cbdab';

export const RoleCreation: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const navigate = useNavigate();
  
  const [roleName, setRoleName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [leftoverRecipient, setLeftoverRecipient] = useState('');
  const [developerFee, setDeveloperFee] = useState('10000000');
  const [payments, setPayments] = useState([
    { recipient: '', amount: '', scheduledDate: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const addPayment = () => {
    setPayments([...payments, { recipient: '', amount: '', scheduledDate: '' }]);
  };

  const removePayment = (index: number) => {
    const newPayments = payments.filter((_, i) => i !== index);
    setPayments(newPayments);
  };

  const updatePayment = (index: number, field: string, value: string) => {
    const newPayments = [...payments] as any[];
    newPayments[index][field] = value;
    setPayments(newPayments);
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAccount) {
      showToast({ type: 'error', title: 'AUTH_REQUIRED', message: 'Initialize neural node connection before architecting protocol.' });
      return;
    }

    try {
      setLoading(true);

      const startTimeMs = new Date(startDate).getTime();
      const expiryTimeMs = new Date(expiryDate).getTime();

      if (isNaN(startTimeMs) || isNaN(expiryTimeMs)) {
        showToast({ type: 'error', title: 'EPOCH_FAILURE', message: 'Temporal markers are invalid or malformed.' });
        setLoading(false);
        return;
      }

      if (startTimeMs >= expiryTimeMs) {
        showToast({ type: 'error', title: 'TEMPORAL_CONFLICT', message: 'Genesis epoch must precede depletion boundary.' });
        setLoading(false);
        return;
      }

      const recipients = [];
      const amounts = [];
      const scheduledTimes = [];

      for (const payment of payments) {
        if (!payment.recipient || !payment.amount || !payment.scheduledDate) {
          showToast({ type: 'error', title: 'MANIFEST_INCOMPLETE', message: 'Incomplete dispatch parameters detected.' });
          setLoading(false);
          return;
        }

        const scheduledTimeMs = new Date(payment.scheduledDate).getTime();
        
        if (isNaN(scheduledTimeMs)) {
          showToast({ type: 'error', title: 'EPOCH_FAILURE', message: 'Payment temporal marker is invalid.' });
          setLoading(false);
          return;
        }

        if (scheduledTimeMs < startTimeMs || scheduledTimeMs > expiryTimeMs) {
          showToast({ type: 'error', title: 'EPOCH_OVERFLOW', message: 'Dispatch schedule exceeds protocol temporal bounds.' });
          setLoading(false);
          return;
        }

        recipients.push(payment.recipient);
        amounts.push(Math.floor(parseFloat(payment.amount) * 1000000000));
        scheduledTimes.push(scheduledTimeMs);
      }

      const nameBytes = Array.from(new TextEncoder().encode(roleName));
      const leftoverAddr = leftoverRecipient || currentAccount.address;

      const txb = new Transaction();

      txb.moveCall({
        target: `${PACKAGE_ID}::role::create_role`,
        arguments: [
          txb.pure.vector('u8', nameBytes),
          txb.pure.u64(startTimeMs),
          txb.pure.u64(expiryTimeMs),
          txb.pure.vector('address', recipients),
          txb.pure.vector('u64', amounts),
          txb.pure.vector('u64', scheduledTimes),
          txb.pure.address(leftoverAddr),
          txb.pure.u64(developerFee),
        ],
      });

      signAndExecuteTransaction({
        transaction: txb,
      }, {
        onSuccess: (result) => {
          showToast({ type: 'success', title: 'ARCHITECTED', message: 'Autonomous protocol manifest inscribed successfully.' });
          navigate('/dashboard');
        },
        onError: (err) => {
          showToast({ type: 'error', title: 'LEDGER_FAILURE', message: err.message || 'Cryptographic inscription failed.' });
        }
      });

    } catch (error: any) {
      showToast({ type: 'error', title: 'SYSTEM_PANIC', message: error.message || 'Critical kernel failure.' });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const getDateTimePlus30Days = () => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    return new Date(future.getTime() - future.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  if (!currentAccount) {
    return (
      <div className="role-creation-page">
        <div className="ens-bg" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <div className="card card-glow" style={{ padding: '10rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '60px', textAlign: 'center', maxWidth: '1000px' }}>
             <div className="card" style={{ width: '150px', height: '150px', background: 'rgba(6, 182, 212, 0.05)', color: 'var(--sui-blue)', borderRadius: '40px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6rem' }}>
                <Wallet size={80} strokeWidth={1} />
             </div>
             <h2 className="cyber-glitch-text" style={{ fontSize: '5rem', fontWeight: 950, marginBottom: '3rem' }}>AUTH_REQUIRED</h2>
             <p style={{ fontSize: '1.75rem', color: 'var(--text-dim)', marginBottom: '8rem', lineHeight: 1.8, fontWeight: 500 }}>The protocol architect kernel requires a secure neural connection to the SUI network manifold. Initialize your wallet node to proceed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="role-creation-page">
      <div className="ens-bg" />
      
      <div className="container" style={{ maxWidth: '1800px' }}>
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 1 }} className="page-header" style={{ marginBottom: '15rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px dashed var(--border-light)', paddingBottom: '8rem', paddingTop: '10rem' }}>
          <div style={{ display: 'flex', gap: '5rem', alignItems: 'flex-end' }}>
            <div className="header-icon card card-glow" style={{ width: '150px', height: '150px', borderRadius: '40px', background: 'var(--bg-card)', color: 'var(--sui-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
              <Terminal size={80} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="cyber-glitch-text" style={{ fontSize: '10rem', fontWeight: 950, marginBottom: '4rem', letterSpacing: '-0.0625em', margin: 0 }}>ARCHITECT_PROTOCOL</h1>
              <p className="subtitle" style={{ fontSize: '2.5rem', color: 'var(--text-dim)', maxWidth: '1200px', fontWeight: 500, letterSpacing: '0.025em', lineHeight: 1.6, opacity: 0.8, marginTop: '5rem' }}>Construct highly-scalable autonomous distribution manifests. Secure liquidity across custom temporal EPOCHS on the immutable ledger.</p>
            </div>
          </div>
          
          <div className="header-stats" style={{ display: 'flex', gap: '4rem' }}>
            <div className="stat-pill card card-glow" style={{ padding: '4rem 6rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '40px', textAlign: 'center' }}>
              <div className="stat-value" style={{ fontSize: '5rem', fontWeight: 950, color: 'white' }}>{payments.length}</div>
              <div className="stat-label" style={{ fontSize: '1rem', fontWeight: 950, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.4rem', marginTop: '2rem' }}>DEFINED_DISPATCHES</div>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleCreateRole} className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 650px', gap: '10rem', marginBottom: '20rem' }}>
          <div className="main-content">
            <motion.div initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card card-glow" style={{ padding: '10rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '70px', marginBottom: '8rem' }}>
              <div className="form-section-header" style={{ marginBottom: '8rem', display: 'flex', alignItems: 'center', gap: '4rem' }}>
                 <div className="card card-glow" style={{ padding: '2rem', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '25px', border: '1px solid var(--border-light)' }}>
                    <Layers size={56} strokeWidth={2.5} />
                 </div>
                 <h3 className="cyber-glitch-text" style={{ fontSize: '5rem', fontWeight: 950, margin: 0 }}>GENESIS_PARAMETERS</h3>
              </div>

              <div className="inputs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '1.25rem', fontWeight: 950, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.5rem', marginBottom: '3rem', display: 'block' }}>ROLE_DESIGNATION_ID</label>
                  <div className="card card-glow" style={{ padding: '3.5rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '4rem' }}>
                    <Fingerprint size={48} color="var(--sui-blue)" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="e.g. MARKETING_OPS_ALPHA"
                      required
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '2.5rem', fontWeight: 950, flex: 1, letterSpacing: '0.025em' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '1.25rem', fontWeight: 950, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.5rem', marginBottom: '3rem', display: 'block' }}>TEMPORAL_GENESIS</label>
                    <div className="card card-glow" style={{ padding: '3.5rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '4rem' }}>
                      <Clock size={48} color="rgba(6, 182, 212, 0.4)" strokeWidth={1.5} />
                      <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '1.75rem', fontWeight: 950, flex: 1, fontFamily: 'JetBrains Mono' }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '1.25rem', fontWeight: 950, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.5rem', marginBottom: '3rem', display: 'block' }}>DEPLETION_BOUNDARY</label>
                    <div className="card card-glow" style={{ padding: '3.5rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '4rem' }}>
                      <Activity size={48} color="rgba(239, 68, 68, 0.4)" strokeWidth={1.5} />
                      <input
                        type="datetime-local"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                        style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '1.75rem', fontWeight: 950, flex: 1, fontFamily: 'JetBrains Mono' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="card card-glow" style={{ padding: '10rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '70px' }}>
              <div className="form-section-header" style={{ marginBottom: '8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
                   <div className="card card-glow" style={{ padding: '2rem', background: 'var(--bg-main)', color: 'var(--success)', borderRadius: '25px', border: '1px solid var(--border-light)' }}>
                      <ArrowUpRight size={56} strokeWidth={2.5} />
                   </div>
                   <h3 className="cyber-glitch-text" style={{ fontSize: '5rem', fontWeight: 950, margin: 0 }}>DISPATCH_PIPELINE</h3>
                 </div>
                 <motion.button
                   whileHover={{ scale: 1.05, background: 'var(--sui-blue)', color: 'white', borderColor: 'var(--sui-blue)' }}
                   whileTap={{ scale: 0.95 }}
                   type="button"
                   onClick={addPayment}
                   className="btn btn-secondary card"
                   style={{ padding: '2rem 5rem', fontWeight: 950, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '3rem', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '20px', color: 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.4s' }}
                 >
                   <Plus size={32} strokeWidth={3} />
                   <span>ADD_NODE</span>
                 </motion.button>
              </div>

              <div className="payments-list" style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                <AnimatePresence>
                  {payments.map((payment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.98, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -30 }}
                      className="payment-node card card-glow"
                      style={{ padding: '6rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '45px', position: 'relative' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                           <span style={{ fontSize: '1rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.4rem' }}>NODE_#{index + 1}</span>
                           <div className="pulse" style={{ width: '12px', height: '12px', background: 'var(--success)', borderRadius: '50%' }} />
                        </div>
                        {payments.length > 1 && (
                          <motion.button
                            whileHover={{ scale: 1.1, color: 'var(--error)' }}
                            type="button"
                            onClick={() => removePayment(index)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', opacity: 0.3, cursor: 'pointer', transition: 'all 0.4s' }}
                          >
                            <Trash2 size={36} />
                          </motion.button>
                        )}
                      </div>

                      <div className="node-inputs" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '5rem' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '0.85rem', fontWeight: 950, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.2rem', marginBottom: '2rem', display: 'block' }}>TERMINAL_ENDPOINT</label>
                          <input
                            type="text"
                            value={payment.recipient}
                            onChange={(e) => updatePayment(index, 'recipient', e.target.value)}
                            placeholder="0x..."
                            required
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', padding: '2.5rem', borderRadius: '15px', color: 'white', fontWeight: 950, fontSize: '1.25rem', fontFamily: 'JetBrains Mono', outline: 'none' }}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '0.85rem', fontWeight: 950, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.2rem', marginBottom: '2rem', display: 'block' }}>MAGNITUDE (SUI)</label>
                          <input
                            type="number"
                            step="0.001"
                            value={payment.amount}
                            onChange={(e) => updatePayment(index, 'amount', e.target.value)}
                            placeholder="0.00"
                            required
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', padding: '2.5rem', borderRadius: '15px', color: 'white', fontWeight: 950, fontSize: '1.25rem', fontFamily: 'JetBrains Mono', outline: 'none' }}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ fontSize: '0.85rem', fontWeight: 950, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.2rem', marginBottom: '2rem', display: 'block' }}>EPOCH_TRIGGER</label>
                          <input
                            type="datetime-local"
                            value={payment.scheduledDate}
                            onChange={(e) => updatePayment(index, 'scheduledDate', e.target.value)}
                            required
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', padding: '2.5rem', borderRadius: '15px', color: 'white', fontWeight: 950, fontSize: '1.25rem', fontFamily: 'JetBrains Mono', outline: 'none' }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="side-content" style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
             <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="card card-glow" style={{ padding: '8rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '60px' }}>
                <div className="form-section-header" style={{ marginBottom: '6rem', display: 'flex', alignItems: 'center', gap: '4rem' }}>
                   <div className="card card-glow" style={{ padding: '2rem', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '25px', border: '1px solid var(--border-light)' }}>
                      <Settings size={56} strokeWidth={2.5} />
                   </div>
                   <h3 className="cyber-glitch-text" style={{ fontSize: '4rem', fontWeight: 950, margin: 0 }}>PROTOCOL_CONFIG</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '1.125rem', fontWeight: 950, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.4rem', marginBottom: '3rem', display: 'block' }}>RESIDUAL_RESERVE_BUFFER</label>
                    <input
                      type="text"
                      value={leftoverRecipient}
                      onChange={(e) => setLeftoverRecipient(e.target.value)}
                      placeholder={currentAccount.address.slice(0, 32) + "..."}
                      style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-light)', padding: '3.5rem', borderRadius: '30px', color: 'white', fontWeight: 950, fontSize: '1.5rem', fontFamily: 'JetBrains Mono', outline: 'none' }}
                    />
                    <p style={{ marginTop: '2.5rem', fontSize: '1.1rem', color: 'var(--text-dim)', opacity: 0.5, fontWeight: 900 }}>* DEFAULT_TO_ARCHITECT_NODE_IF_NULL</p>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '1.125rem', fontWeight: 950, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.4rem', marginBottom: '3rem', display: 'block' }}>KERNEL_OPERATIONS_FEE (MIST)</label>
                    <input
                      type="number"
                      value={developerFee}
                      onChange={(e) => setDeveloperFee(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-light)', padding: '3.5rem', borderRadius: '30px', color: 'white', fontWeight: 950, fontSize: '1.75rem', fontFamily: 'JetBrains Mono', outline: 'none' }}
                    />
                    <div style={{ marginTop: '2.5rem', fontSize: '1.5rem', color: 'var(--sui-blue)', fontWeight: 950, letterSpacing: '0.1rem' }}>
                       MAGNITUDE: <span style={{ color: 'white' }}>{(Number(developerFee) / 1000000000).toFixed(4)} SUI</span>
                    </div>
                  </div>

                  <div className="quick-presets card card-glow" style={{ padding: '5rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '40px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 950, color: 'var(--sui-blue)', letterSpacing: '0.3rem', marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                       <Zap size={24} /> TEMPORAL_PRESETS
                    </div>
                    <div style={{ display: 'flex', gap: '3rem' }}>
                       <motion.button
                         whileHover={{ scale: 1.05, background: 'var(--bg-main)', color: 'white' }}
                         type="button"
                         onClick={() => {
                           setStartDate(getCurrentDateTime());
                           setExpiryDate(getDateTimePlus30Days());
                         }}
                         className="card"
                         style={{ padding: '1.5rem 3rem', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '15px', color: 'var(--text-dim)', fontSize: '1.1rem', fontWeight: 950, cursor: 'pointer', transition: 'all 0.3s' }}
                       >
                         NOW → +30D
                       </motion.button>
                       <motion.button
                         whileHover={{ scale: 1.05, background: 'var(--bg-main)', color: 'white' }}
                         type="button"
                         onClick={() => {
                           const now = getCurrentDateTime();
                           setStartDate(now);
                           const updated = [...payments];
                           updated[0].scheduledDate = now;
                           setPayments(updated);
                         }}
                         className="card"
                         style={{ padding: '1.5rem 3rem', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '15px', color: 'var(--text-dim)', fontSize: '1.1rem', fontWeight: 950, cursor: 'pointer', transition: 'all 0.3s' }}
                       >
                         SET_ALL_SYNCHRONOUS
                       </motion.button>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                   <motion.button
                     whileHover={{ scale: 1.02, filter: 'brightness(1.1)', boxShadow: '0 40px 80px rgba(6, 182, 212, 0.4)' }}
                     whileTap={{ scale: 0.98 }}
                     type="submit"
                     disabled={loading}
                     className="btn btn-primary"
                     style={{ width: '100%', padding: '3.5rem', background: 'var(--sui-blue)', color: 'white', border: 'none', borderRadius: '30px', fontSize: '2rem', fontWeight: 950, letterSpacing: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem', transition: 'all 0.4s' }}
                   >
                     {loading ? <Loader2 className="spin" size={48} /> : <Zap size={48} strokeWidth={3} />}
                     <span>{loading ? 'ARCHITECTING...' : 'INITIALIZE_PROTOCOL'}</span>
                   </motion.button>

                   <motion.button
                     whileHover={{ scale: 1.02, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderColor: 'var(--error)' }}
                     whileTap={{ scale: 0.98 }}
                     type="button"
                     onClick={() => navigate('/dashboard')}
                     className="btn btn-secondary card"
                     style={{ width: '100%', padding: '3rem', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '30px', fontSize: '1.5rem', fontWeight: 950, letterSpacing: '0.4rem', cursor: 'pointer', color: 'var(--text-dim)' }}
                   >
                     REJECT_MANIFEST
                   </motion.button>
                </div>
             </motion.div>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', opacity: 0.25, paddingLeft: '5rem', marginTop: '5rem' }}>
                <ShieldCheck size={56} strokeWidth={1} />
                <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.8rem' }}>SECURED_BY_ROLEZERO_CORE</p>
             </div>
          </div>
        </form>

        <footer style={{ marginTop: '15rem', textAlign: 'center', opacity: 0.15, borderTop: '1px dashed var(--border-light)', paddingTop: '15rem', paddingBottom: '20rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12rem', marginBottom: '8rem' }}>
            <Activity size={64} />
            <Smartphone size={64} />
            <Globe size={80} strokeWidth={1} />
            <Database size={80} strokeWidth={1} />
            <Award size={64} />
            <Navigation size={64} />
            <Grid size={64} />
          </div>
          <div style={{ fontWeight: 950, letterSpacing: '1.5rem', fontSize: '2rem', textTransform: 'uppercase' }}>PROTOCOL_ARCHITECTURE_v9.4.0_STABLE_NOMINAL</div>
        </footer>
      </div>
    </div>
  );
};
