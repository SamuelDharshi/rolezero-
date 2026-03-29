import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useFundRole } from '@/hooks/useFundRole';
import { useRoleData } from '@/hooks/useRoleData';
import { useSponsorTracking } from '@/hooks/useSponsorTracking';
import { showToast } from '@/components/Toast/Toast';
import { shortenAddress } from '@/utils/ens';
import { formatTimestamp } from '@/utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Database, 
  ExternalLink, 
  Globe, 
  Hash, 
  Key, 
  Loader2, 
  ShieldCheck, 
  TrendingUp, 
  Wallet, 
  Zap, 
  ZapOff 
} from 'lucide-react';
import './SponsorPayment.css';

export const SponsorPayment: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { data: roleData, isLoading, error } = useRoleData(roleId);
  const fundRole = useFundRole(roleId || '');
  const { sponsorships } = useSponsorTracking(roleId || '');

  const [amount, setAmount] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txDigest, setTxDigest] = useState('');

  if (isLoading) {
    return (
      <div className="sponsor-page">
        <div className="ens-bg" />
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
          <div className="card text-center" style={{ padding: '60px' }}>
            <div className="icon-circle bg-surface flex-center mb-24" style={{ margin: '0 auto', width: '80px', height: '100px' }}>
              <Activity className="spin text-primary" size={40} />
            </div>
            <p className="text-secondary uppercase font-bold letter-2">Syncing Protocol Lab...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !roleData) {
    return (
      <div className="sponsor-page">
        <div className="ens-bg" />
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
          <div className="card text-center" style={{ padding: '60px', maxWidth: '600px' }}>
            <div className="icon-circle bg-error-dim flex-center mb-24" style={{ margin: '0 auto', width: '80px', height: '100px', color: 'var(--error)' }}>
              <ZapOff size={40} />
            </div>
            <h2 className="text-error">Sync Failure</h2>
            <p className="text-secondary mb-32">The protocol manifold could not retrieve the specified role record from the registry.</p>
            <button onClick={() => navigate('/')} className="btn btn-secondary">Return to Registry</button>
          </div>
        </div>
      </div>
    );
  }

  const handleSponsor = async () => {
    if (!account) {
      showToast({ type: 'error', title: 'AUTH_REQUIRED', message: 'Initialize neural node connection before authorizing injection.' });
      return;
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      showToast({ type: 'error', title: 'INVALID_MAGNITUDE', message: 'Specified volumetric magnitude is invalid.' });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await fundRole.mutateAsync(value);
      setTxDigest(result.digest);
      setShowSuccess(true);
      showToast({ type: 'success', title: 'INJECTED', message: 'Liquidity injection synced with ledger.', txDigest: result.digest });
      setAmount('1');
    } catch (err: any) {
      showToast({ type: 'error', title: 'LEGDGER_FAILURE', message: err.message || 'Reserve synchronization failed.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="sponsor-page">
      <div className="ens-bg" />

      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        <header className="sponsor-header flex-between mb-40">
          <div className="flex-center gap-16">
             <button onClick={() => navigate(-1)} className="btn-icon bg-surface"><ArrowLeft size={20} /></button>
             <div>
                <div className="badge">Liquidity Module</div>
                <h1>Reserve Injection</h1>
                <p className="text-secondary">Operationalize distribution flows with strategic liquidity magnitudes.</p>
             </div>
          </div>
        </header>

        {!account ? (
          <div className="flex-center" style={{ minHeight: '60vh' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card flex-center gap-32"
              style={{ padding: '40px 50px', maxWidth: '900px', width: '100%' }}
            >
              <div className="icon-circle bg-surface flex-center" style={{ width: '80px', height: '80px', borderRadius: '20px', flexShrink: 0 }}>
                <Wallet size={36} className="text-secondary" />
              </div>
              <div className="flex-1">
                <h2 className="m-0 text-xl font-bold">Authentication Required</h2>
                <p className="text-secondary m-0 mt-8 leading-relaxed">
                  Please connect your SUI wallet to authorize liquidity injections and temporal reserve updates.
                </p>
              </div>
              <button className="btn btn-primary px-32 py-16 font-bold whitespace-nowrap" style={{ minWidth: '180px' }}>
                Connect Wallet
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="injection-layout">
            <div className="grid-main">
              <section className="card p-32 mb-32">
                  <div className="section-header flex-center gap-12 mb-32">
                    <div className="section-icon flex-center"><Key size={20} /></div>
                    <h3 className="m-0">Protocol Authorization</h3>
                  </div>

                  <div className="injection-input-group mb-40">
                    <label className="text-xs font-bold uppercase letter-1 text-muted mb-12 block">Volumetric Magnitude (SUI)</label>
                    <div className="amount-input card-dim p-24 flex-between">
                        <input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="text-4xl font-bold bg-transparent border-none text-white outline-none w-full"
                        />
                        <span className="text-2xl font-bold text-primary">SUI</span>
                    </div>
                  </div>

                  <div className="telemetry-compact grid-2 gap-20 mb-40">
                    <div className="tele-unit card-dim p-20">
                        <div className="text-xs font-bold uppercase letter-1 text-muted mb-8">Target Protocol</div>
                        <div className="font-bold text-lg truncate">{roleData.name}</div>
                    </div>
                    <div className="tele-unit card-dim p-20">
                        <div className="text-xs font-bold uppercase letter-1 text-muted mb-8 text-success">Reserve Capacity</div>
                        <div className="font-bold text-lg text-success">{(roleData.remainingBalance / 1_000_000_000).toFixed(4)} <span className="text-xs">SUI</span></div>
                    </div>
                  </div>

                  <button
                    onClick={handleSponsor}
                    disabled={isProcessing}
                    className="btn btn-primary btn-full py-20 text-xl font-bold"
                  >
                    {isProcessing ? <Loader2 className="spin" size={24} /> : <Zap size={24} />}
                    <span>{isProcessing ? 'Synchronizing...' : 'Authorize Injection'}</span>
                  </button>
              </section>

              <div className="card-dim p-24 bg-surface-dim">
                <div className="flex-center gap-12 mb-12">
                  <ShieldCheck size={18} className="text-primary" />
                  <h4 className="m-0 text-sm">Security Layer</h4>
                </div>
                <p className="text-xs text-muted leading-relaxed m-0">
                  All injections are mathematically non-reversible and atomically bounded to the target protocol identity across the ledger.
                </p>
              </div>
            </div>

            <aside className="grid-sidebar">
              <section className="card p-24">
                  <div className="section-header flex-between mb-24">
                    <div className="flex-center gap-12">
                       <Activity size={18} className="text-success" />
                       <h3 className="text-sm m-0">Live Telemetry</h3>
                    </div>
                    <span className="badge-live">LIVE</span>
                  </div>

                  <div className="telemetry-list flex-column gap-12">
                    {sponsorships && sponsorships.length > 0 ? (
                      sponsorships.map((sponsor, idx) => (
                        <div key={idx} className="tele-item card-dim p-16 flex-between">
                            <code className="text-xs font-bold">{shortenAddress(sponsor.address, 12)}</code>
                            <span className="text-success font-bold">+{sponsor.total.toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state text-center py-32 opacity-30">
                          <History size={32} className="mb-8" />
                          <p className="text-xs font-bold">No activity detected</p>
                      </div>
                    )}
                  </div>
              </section>
            </aside>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="modal-overlay flex-center"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className="card modal-content p-40 text-center"
              style={{ maxWidth: '500px' }}
            >
              <div className="icon-circle bg-success-dim text-success mb-24" style={{ margin: '0 auto', width: '80px', height: '80px' }}>
                <CheckCircle2 size={40} />
              </div>
              <h2>Injection Sync Complete</h2>
              <p className="text-secondary mb-32">Protocol operational reserves have been successfully synced across the manifold.</p>
              
              <div className="card-dim p-16 mb-32 text-left">
                  <div className="text-xs font-bold uppercase letter-1 text-muted mb-8">TX Digest</div>
                  <code className="text-xs break-all text-primary">{txDigest}</code>
              </div>

              <div className="flex-column gap-12">
                <a 
                  href={`https://suiscan.xyz/testnet/tx/${txDigest}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary no-underline"
                >
                  <Globe size={18} /> Audit Ledger
                </a>
                <button onClick={() => setShowSuccess(false)} className="btn btn-secondary">
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
