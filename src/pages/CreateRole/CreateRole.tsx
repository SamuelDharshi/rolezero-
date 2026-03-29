import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useCreateRole } from '@/hooks/useCreateRole';
import { showToast } from '@/components/Toast/Toast';
import { resolveSuiName } from '@/utils/suiNames';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  Users, 
  Shield, 
  CheckCircle, 
  Activity,
  Zap,
  Layout,
  Cpu,
  Globe,
  Lock,
  Loader2,
  Terminal,
  Search,
  Check,
  Award,
  Timer,
  Navigation,
  Key,
  CheckCircle2,
  Fingerprint,
  Layers,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import './CreateRole.css';

interface Payment {
  recipient: string;
  amount: string;
  scheduledTime: string;
}

export const CreateRole: React.FC = () => {
  const account = useCurrentAccount();
  const navigate = useNavigate();
  const { createRole } = useCreateRole();

  const [name, setName] = useState('');
  const [token, setToken] = useState('0x2::sui::SUI');
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [expiryTime, setExpiryTime] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16));
  const [payments, setPayments] = useState<Payment[]>([
    { recipient: '', amount: '1', scheduledTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16) }
  ]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedRole, setDeployedRole] = useState<{ id: string; digest: string } | null>(null);
  const [activeChain, setActiveChain] = useState<'sui' | 'arc'>('sui');

  const addPayment = () => {
    setPayments([
      ...payments,
      { recipient: '', amount: '1', scheduledTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16) }
    ]);
  };

  const removePayment = (index: number) => {
    if (payments.length > 1) {
      setPayments(payments.filter((_, i) => i !== index));
    }
  };

  const updatePayment = (index: number, field: keyof Payment, value: string) => {
    const newPayments = [...payments];
    newPayments[index] = { ...newPayments[index], [field]: value };
    setPayments(newPayments);
  };

  const handleCreateRole = async () => {
    if (!account) {
      showToast({ type: 'error', title: 'Connection Required', message: 'Please connect your Sui wallet to create a role.' });
      return;
    }

    setIsDeploying(true);
    try {
      const resolvedPayments = await Promise.all(
        payments.map(async (p) => {
          let recipient = p.recipient;
          if (recipient.includes('.')) {
            const resolved = await resolveSuiName(recipient);
            if (resolved) recipient = resolved;
          }
          return {
            recipient,
            amount: BigInt(Math.floor(parseFloat(p.amount) * 1_000_000_000)),
            scheduledTime: BigInt(new Date(p.scheduledTime).getTime())
          };
        })
      );

      const result = await createRole({
        name,
        token,
        startTime: BigInt(new Date(startTime).getTime()),
        expiryTime: BigInt(new Date(expiryTime).getTime()),
        payments: resolvedPayments,
        leftoverRecipient: account.address
      });

      setDeployedRole({ id: result.roleId || '', digest: result.digest });
      showToast({ type: 'success', title: 'Role Created', message: 'Your payment role has been deployed successfully.', txDigest: result.digest });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Deployment Failed', message: err.message || 'There was an error creating your role.' });
    } finally {
      setIsDeploying(false);
    }
  };

  if (deployedRole) {
    return (
      <div className="create-page">
        <div className="ens-bg" />
        <div className="container" style={{ paddingTop: '100px' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="success-card card flex-center flex-column"
          >
            <div className="success-icon flex-center">
              <CheckCircle2 size={48} />
            </div>
            <h2>Deployment Successful</h2>
            <p className="text-secondary text-center max-600">
              Your autonomous payment protocol is now live on the ledger. 
              Funds are secured and will be distributed exactly as scheduled.
            </p>
            
            <div className="deployed-info grid-2">
              <div className="info-item card">
                <label>Role ID</label>
                <code className="mono">{deployedRole.id}</code>
              </div>
              <div className="info-item card">
                <label>Transaction Digest</label>
                <code className="mono">{deployedRole.digest.slice(0, 16)}...</code>
              </div>
            </div>

            <div className="flex-center gap-16">
              <button onClick={() => navigate(`/live/${deployedRole.id}`)} className="btn btn-primary">
                View Live Dashboard <ArrowRight size={18} />
              </button>
              <button onClick={() => window.open(`https://suiscan.xyz/testnet/tx/${deployedRole.digest}`, '_blank')} className="btn btn-secondary">
                View on Explorer <Globe size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-page">
      <div className="ens-bg" />
      
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        <header className="create-header">
          <div className="flex-between">
            <div>
              <div className="badge">Genesis Protocol</div>
              <h1>Architect Role</h1>
              <p className="text-secondary">Define payment schedules, recipients, and security parameters.</p>
            </div>
            <div className="header-stats">
              <div className="stat-card card">
                <span className="stat-label">Recipients</span>
                <span className="stat-value">{payments.length}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="create-grid">
          {/* Settings Sidebar */}
          <aside className="create-sidebar">
            <div className="card sticky-sidebar">
              <h3>Target Ledger</h3>
              <div className="chain-selector">
                <button 
                  className={`chain-btn card ${activeChain === 'sui' ? 'active' : ''}`}
                  onClick={() => setActiveChain('sui')}
                >
                  <div className="chain-icon sui"><Zap size={20} /></div>
                  <div className="chain-info">
                    <span className="chain-name">Sui Network</span>
                    <span className="chain-status">Mainnet Stable</span>
                  </div>
                </button>
                <button 
                  className={`chain-btn card ${activeChain === 'arc' ? 'active' : ''}`}
                  onClick={() => setActiveChain('arc')}
                >
                  <div className="chain-icon arc"><Globe size={20} /></div>
                  <div className="chain-info">
                    <span className="chain-name">Arc Network</span>
                    <span className="chain-status">Institutional USDC</span>
                  </div>
                </button>
              </div>

              <div className="security-locks">
                <div className="lock-item flex-center gap-8">
                  <ShieldCheck size={16} className="text-success" />
                  <span className="text-muted text-xs uppercase font-bold">Immutable Logic</span>
                </div>
                <div className="lock-item flex-center gap-8">
                  <ShieldCheck size={16} className="text-success" />
                  <span className="text-muted text-xs uppercase font-bold">Atomic Dispatch</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Configuration Main */}
          <main className="create-main">
            <section className="form-section card">
              <div className="section-header flex-center gap-12">
                <div className="section-icon flex-center"><Cpu size={24} /></div>
                <h3>General Parameters</h3>
              </div>
              
              <div className="form-grid">
                <div className="form-group full">
                  <label>Protocol Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Monthly Marketing Payroll"
                  />
                </div>
                <div className="form-group full">
                  <label>Token Address (SUI/USDC)</label>
                  <input 
                    type="text" 
                    value={token} 
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="0x2::sui::SUI"
                    className="mono"
                  />
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input 
                    type="datetime-local" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mono"
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Time</label>
                  <input 
                    type="datetime-local" 
                    value={expiryTime} 
                    onChange={(e) => setExpiryTime(e.target.value)}
                    className="mono"
                  />
                </div>
              </div>
            </section>

            <section className="outposts-section">
              <div className="section-header flex-between">
                <div className="flex-center gap-12">
                  <div className="section-icon flex-center"><Navigation size={24} /></div>
                  <h3>Payment Outposts</h3>
                </div>
                <button onClick={addPayment} className="btn-add flex-center">
                  <Plus size={16} /> Add Recipient
                </button>
              </div>

              <AnimatePresence mode="popLayout">
                {payments.map((payment, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="outpost-card card"
                  >
                    <div className="outpost-header flex-between">
                      <span className="outpost-num">Recipient #{index + 1}</span>
                      {payments.length > 1 && (
                        <button onClick={() => removePayment(index)} className="btn-remove">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="form-grid">
                      <div className="form-group full">
                        <label>Recipient Address / ENS</label>
                        <input 
                          type="text" 
                          value={payment.recipient} 
                          onChange={(e) => updatePayment(index, 'recipient', e.target.value)}
                          placeholder="0x... or name.sui / name.eth"
                          className="mono"
                        />
                      </div>
                      <div className="form-group">
                        <label>Payment Amount</label>
                        <input 
                          type="number" 
                          value={payment.amount} 
                          onChange={(e) => updatePayment(index, 'amount', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="form-group">
                        <label>Scheduled Execution</label>
                        <input 
                          type="datetime-local" 
                          value={payment.scheduledTime} 
                          onChange={(e) => updatePayment(index, 'scheduledTime', e.target.value)}
                          className="mono"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </section>

            <div className="actions-section">
              <button 
                onClick={handleCreateRole}
                disabled={isDeploying || !name}
                className="btn btn-primary btn-deploy"
              >
                {isDeploying ? (
                  <><Loader2 className="spin" size={20} /> Deploying Protocol...</>
                ) : (
                  <><Zap size={20} /> Deploy Payment Role</>
                )}
              </button>
              <p className="text-dim text-center text-xs uppercase font-bold letter-2 mt-16">
                Transactions are immutable once deployed to the ledger.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};