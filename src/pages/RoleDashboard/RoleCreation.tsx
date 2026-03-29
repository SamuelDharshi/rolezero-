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
  Settings, 
  Cpu, 
  Activity, 
  Terminal,
  Layers,
  Fingerprint,
  Loader2,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  ArrowRight
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
          showToast({ type: 'success', title: 'ARCHITECTED', message: 'Autonomous protocol manifest inscribed successfully.', txDigest: result.digest });
          navigate('/roles');
        },
        onError: (err: any) => {
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
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card text-center" style={{ maxWidth: '600px', padding: '60px' }}>
            <div className="icon-circle bg-surface flex-center mb-24" style={{ margin: '0 auto', width: '80px', height: '80px' }}>
              <Wallet size={40} className="text-secondary" />
            </div>
            <h2>Authentication Required</h2>
            <p className="text-secondary mb-32">Initialize your SUI wallet node to architect a payment protocol.</p>
            <button className="btn btn-primary">Connect Wallet</button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="role-creation-page">
      <div className="ens-bg" />
      
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        <header className="creation-header flex-between mb-40">
          <div>
            <div className="badge">Protocol Lab</div>
            <h1>Architect Protocol</h1>
            <p className="text-secondary">Construct autonomous distribution manifests with atomic precision.</p>
          </div>
          <div className="stat-card card flex-center gap-12">
            <span className="text-xs uppercase font-bold letter-1 text-muted">Active Nodes</span>
            <span className="font-bold text-xl">{payments.length}</span>
          </div>
        </header>

        <form onSubmit={handleCreateRole} className="creation-grid">
          <div className="grid-main">
            {/* General Parameters */}
            <section className="creation-section card mb-32">
              <div className="section-header flex-center gap-12 mb-32">
                <div className="section-icon flex-center"><Layers size={20} /></div>
                <h3 className="m-0">Genesis Parameters</h3>
              </div>

              <div className="form-grid">
                <div className="form-group full">
                  <label>Designation Identifier</label>
                  <div className="input-with-icon">
                    <Fingerprint size={18} className="text-muted" />
                    <input
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="e.g. MARKETING_OPS_ALPHA"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Temporal Genesis</label>
                  <div className="input-with-icon">
                    <Clock size={18} className="text-muted" />
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Depletion Boundary (Expiry)</label>
                  <div className="input-with-icon">
                    <Activity size={18} className="text-muted" />
                    <input
                      type="datetime-local"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Dispatch Pipeline */}
            <section className="creation-section card">
              <div className="section-header flex-between mb-32">
                <div className="flex-center gap-12">
                  <div className="section-icon flex-center bg-success-dim"><ArrowUpRight size={20} className="text-success" /></div>
                  <h3 className="m-0">Dispatch Pipeline</h3>
                </div>
                <button type="button" onClick={addPayment} className="btn-add-node flex-center gap-8">
                  <Plus size={16} /> Add Node
                </button>
              </div>

              <div className="nodes-list flex-column gap-20">
                <AnimatePresence initial={false}>
                  {payments.map((payment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="node-item card-dim"
                    >
                      <div className="node-header flex-between mb-16">
                        <span className="text-xs font-bold uppercase letter-2 text-primary">Node #{index + 1}</span>
                        {payments.length > 1 && (
                          <button type="button" onClick={() => removePayment(index)} className="btn-remove-node">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="form-grid">
                        <div className="form-group full">
                          <label>Endpoint Address</label>
                          <input
                            type="text"
                            value={payment.recipient}
                            onChange={(e) => updatePayment(index, 'recipient', e.target.value)}
                            placeholder="0x..."
                            required
                            className="mono"
                          />
                        </div>
                        <div className="form-group">
                          <label>Magnitude (SUI)</label>
                          <input
                            type="number"
                            step="0.001"
                            value={payment.amount}
                            onChange={(e) => updatePayment(index, 'amount', e.target.value)}
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Epoch Trigger</label>
                          <input
                            type="datetime-local"
                            value={payment.scheduledDate}
                            onChange={(e) => updatePayment(index, 'scheduledDate', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </div>

          <aside className="grid-sidebar">
            <div className="sticky-sidebar">
              <section className="sidebar-section card mb-24">
                <div className="section-header flex-center gap-12 mb-24">
                  <div className="section-icon flex-center"><Settings size={20} /></div>
                  <h3 className="m-0">Operations</h3>
                </div>

                <div className="form-group mb-24">
                  <label className="text-xs uppercase font-bold letter-1 text-muted mb-8 block">Residual Reserve</label>
                  <input
                    type="text"
                    value={leftoverRecipient}
                    onChange={(e) => setLeftoverRecipient(e.target.value)}
                    placeholder="Auto: Architect Node"
                    className="mono text-sm"
                  />
                </div>

                <div className="form-group mb-32">
                  <label className="text-xs uppercase font-bold letter-1 text-muted mb-8 block">Kernel Fee (MIST)</label>
                  <input
                    type="number"
                    value={developerFee}
                    onChange={(e) => setDeveloperFee(e.target.value)}
                    className="mono text-sm"
                  />
                  <div className="mt-8 text-xs font-bold text-primary">
                    Total: {(Number(developerFee) / 1000000000).toFixed(4)} SUI
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-full py-16"
                >
                  {loading ? <Loader2 className="spin" size={20} /> : <Zap size={20} />}
                  <span>Initialize Protocol</span>
                </button>
              </section>

              <div className="card bg-surface-dim">
                <div className="flex-center gap-12 mb-12">
                  <ShieldCheck size={18} className="text-primary" />
                  <h4 className="m-0 text-sm">Security Layer</h4>
                </div>
                <p className="text-xs text-muted leading-relaxed m-0">
                  Transactions are immutable once inscribed on the SUI ledger. Verify all temporal triggers before initialization.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};
