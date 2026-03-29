import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useAccount } from 'wagmi';
import { useUserStats } from '@/hooks/useUserStats';
import { DeveloperDashboard } from '@/components/DeveloperDashboard/DeveloperDashboard';
import { shortenAddress } from '@/utils/ens';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  TrendingUp, 
  TrendingDown,
  Activity, 
  CheckCircle,
  Clock,
  ExternalLink,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  BarChart3,
  Crown,
  User,
  Search,
  Hash,
  Shield,
  Cpu,
  Globe,
  Zap,
  Terminal,
  Hexagon,
  Database,
  History,
  Layout,
  LayoutDashboard,
  Navigation,
  Layers,
  Fingerprint,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  ZapOff,
  Award,
  Settings,
  Grid,
  Timer
} from 'lucide-react';
import './UserProfile.css';

type TabType = 'overview' | 'developer';

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const suiAccount = useCurrentAccount();
  const { address: evmAddress } = useAccount();
  const { data: dashboardData, isLoading } = useUserStats();
  const [filter, setFilter] = useState<'all' | 'funding' | 'payment'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const DEVELOPER_ADDRESSES = [
    '0x7cd3b3519b8f7e5033cc3b4ce7ce846c9cd507ed47991cf44bf097895a7de547',
    suiAccount?.address,
    evmAddress,
  ].filter(Boolean);

  const isDeveloper = DEVELOPER_ADDRESSES.some(addr => 
    addr === suiAccount?.address || addr === evmAddress
  );

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="ens-bg" />
        <div className="container" style={{ maxWidth: '1800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <div className="card card-glow" style={{ width: '320px', height: '320px', borderRadius: '100px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', boxShadow: '0 0 150px rgba(6, 182, 212, 0.3)' }}>
             <Activity className="spin" size={200} color="var(--sui-blue)" strokeWidth={1} />
          </div>
          <p style={{ letterSpacing: '2rem', fontWeight: 950, fontSize: '4rem', color: 'var(--sui-blue)', marginTop: '12rem', textTransform: 'uppercase', opacity: 0.8 }}>INITIALIZING_PROTOCOLS...</p>
        </div>
      </div>
    );
  }

  const filteredTransactions = dashboardData?.transactions.filter(tx => {
    if (filter !== 'all' && tx.type !== filter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        tx.from.toLowerCase().includes(search) ||
        tx.to.toLowerCase().includes(search) ||
        tx.roleName.toLowerCase().includes(search) ||
        tx.digest.toLowerCase().includes(search)
      );
    }
    return true;
  }) || [];

  return (
    <div className="profile-page">
      <div className="ens-bg" />

      <div className="container" style={{ maxWidth: '1800px', paddingTop: '150px' }}>
        <motion.div 
          initial={{ opacity: 0, y: -100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.4 }} 
          className="profile-header-manifold" 
          style={{ marginBottom: '22rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px dashed var(--border-light)', paddingBottom: '15rem' }}
        >
          <div>
            <div className="hero-badge card card-glow" style={{ marginBottom: '8rem', fontSize: '1.25rem', letterSpacing: '0.8rem', padding: '1.5rem 6rem', width: 'fit-content', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--sui-blue)', border: '2px solid rgba(6, 182, 212, 0.4)', fontWeight: 950, borderRadius: '25px', boxShadow: '0 0 80px rgba(6, 182, 212, 0.3)' }}>
              <div className="pulse" style={{ width: '18px', height: '18px', background: 'var(--sui-blue)', borderRadius: '50%', boxShadow: '0 0 25px var(--sui-blue)', marginRight: '4rem' }} />
              NEURAL_IDENTITY_v9.4_SECURE
            </div>
            <h1 className="cyber-glitch-text" style={{ fontSize: '15rem', fontWeight: 950, letterSpacing: '-0.0625em', margin: 0, lineHeight: 0.8 }}>PROTOCOL_MANIFEST</h1>
            <p className="manifold-subtitle" style={{ fontSize: '4rem', color: 'var(--text-dim)', maxWidth: '1400px', fontWeight: 500, lineHeight: 1.6, opacity: 0.6, marginTop: '10rem' }}>Synchronized metrics and historical records for the current authenticated neural identity across the global manifolds and autonomous outposts.</p>
          </div>

          <div className="tab-navigation-manifold card card-glow" style={{ padding: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '60px', display: 'flex', gap: '4rem', boxShadow: '0 60px 120px rgba(0,0,0,0.6)' }}>
            <motion.button 
              whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.05)' }}
              whileTap={{ scale: 0.95 }}
              className={`tab-switch-unit font-bold ${activeTab === 'overview' ? 'active' : ''}`} 
              onClick={() => setActiveTab('overview')}
              style={{ padding: '4.5rem 10rem', borderRadius: '45px', fontSize: '2.5rem', fontWeight: 950, letterSpacing: '0.6rem', cursor: 'pointer', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', alignItems: 'center', gap: '6rem', background: activeTab === 'overview' ? 'var(--bg-main)' : 'transparent', color: activeTab === 'overview' ? 'white' : 'var(--text-dim)', border: activeTab === 'overview' ? '3px solid var(--border-light)' : 'none', boxShadow: activeTab === 'overview' ? '0 20px 50px rgba(0,0,0,0.8)' : 'none' }}
            >
              <LayoutDashboard size={64} strokeWidth={2} />
              <span>OPERATIONAL_VIEW</span>
            </motion.button>
            
            {isDeveloper && (
              <motion.button 
                whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.05)' }}
                whileTap={{ scale: 0.95 }}
                className={`tab-switch-unit font-bold ${activeTab === 'developer' ? 'active' : ''}`} 
                onClick={() => setActiveTab('developer')}
                style={{ padding: '4.5rem 10rem', borderRadius: '45px', fontSize: '2.5rem', fontWeight: 950, letterSpacing: '0.6rem', cursor: 'pointer', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', alignItems: 'center', gap: '6rem', background: activeTab === 'developer' ? 'var(--bg-main)' : 'transparent', color: activeTab === 'developer' ? 'white' : 'var(--text-dim)', border: activeTab === 'developer' ? '3px solid var(--border-light)' : 'none', boxShadow: activeTab === 'developer' ? '0 20px 50px rgba(0,0,0,0.8)' : 'none' }}
              >
                <Cpu size={64} strokeWidth={1} />
                <span>CORE_OPS</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'developer' && isDeveloper ? (
            <motion.div key="dev" initial={{ opacity: 0, scale: 0.98, y: 150 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -80 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <DeveloperDashboard />
            </motion.div>
          ) : (
            <motion.div key="overview" initial={{ opacity: 0, x: -150 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 150 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <div className="profile-telemetry-grid-manifold" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15rem', marginBottom: '35rem' }}>
                {[
                  { icon: Layers, color: 'var(--sui-blue)', label: 'ACTIVE_NODES', value: dashboardData?.totalUsers || 0 },
                  { icon: TrendingUp, color: 'var(--success)', label: 'AGGREGATE_SUI_VOL', value: dashboardData?.totalVolume.toFixed(2) || '0.00' },
                  { icon: ArrowDownLeft, color: 'var(--sui-blue)', label: 'TOTAL_INGRESS_VOL', value: dashboardData?.totalFunded.toFixed(2) || '0.00' },
                  { icon: ArrowUpRight, color: 'var(--sui-blue)', label: 'TOTAL_EGRESS_VOL', value: dashboardData?.totalPaid.toFixed(2) || '0.00' },
                  { icon: Clock, color: '#f59e0b', label: 'QUEUED_DISPATCH', value: dashboardData?.pendingPayments || 0 },
                  { icon: Activity, color: 'var(--sui-blue)', label: 'VERIFIED_EVENTS', value: dashboardData?.transactions.length || 0 }
                ].map((stat, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="telemetry-unit-card card card-glow" style={{ padding: '12rem 10rem', background: 'var(--bg-card)', borderRadius: '100px', border: '1px solid var(--border-subtle)', boxShadow: '0 60px 120px rgba(0,0,0,0.6)', display: 'flex', gap: '8rem', alignItems: 'center' }}>
                    <div className="telemetry-icon-cell card card-glow" style={{ width: '220px', height: '220px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)', flexShrink: 0 }}><stat.icon size={130} strokeWidth={1} /></div>
                    <div>
                      <div className="tele-label" style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', marginBottom: '6rem', opacity: 0.4, textTransform: 'uppercase' }}>{stat.label}</div>
                      <div className="tele-value cyber-glitch-text" style={{ fontSize: '13rem', fontWeight: 950, letterSpacing: '-0.04em', color: stat.label.includes('VOL') && stat.icon === TrendingUp ? 'var(--success)' : 'white', lineHeight: 1 }}>{stat.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.98, y: 180 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} className="manifest-registry-manifold card card-glow" style={{ padding: '20rem 15rem', borderRadius: '120px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', marginBottom: '35rem', boxShadow: '0 120px 240px rgba(0,0,0,0.7)' }}>
                <div className="manifest-header-row" style={{ marginBottom: '220px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-light)', paddingBottom: '15rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10rem' }}>
                    <div className="card card-glow" style={{ padding: '5rem', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '50px', border: '1px solid var(--border-light)', boxShadow: '0 0 80px rgba(6, 182, 212, 0.25)' }}>
                      <Database size={120} strokeWidth={1} />
                    </div>
                    <h2 className="cyber-glitch-text" style={{ fontSize: '11rem', fontWeight: 950, letterSpacing: '-0.04em', margin: 0, textTransform: 'uppercase', lineHeight: 1 }}>REGISTRY_MANIFEST</h2>
                  </div>
                  <div className="manifest-controls" style={{ display: 'flex', gap: '8rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={72} style={{ position: 'absolute', left: '80px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sui-blue)', opacity: 0.3 }} />
                      <input
                        type="text"
                        placeholder="RESCAN_HISTORICAL_MANIFEST..."
                        className="manifest-search-input card card-glow"
                        style={{ width: '1100px', padding: '5.5rem 10rem 5.5rem 22rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'white', borderRadius: '60px', fontSize: '3.5rem', fontWeight: 900, outline: 'none', transition: 'all 0.6s', fontFamily: 'JetBrains Mono', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="manifest-filter-manifold card card-glow" style={{ padding: '2.5rem', background: 'var(--bg-main)', borderRadius: '55px', border: '1px solid var(--border-light)', display: 'flex', gap: '4rem', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)' }}>
                      {['all', 'funding', 'payment'].map((f) => (
                        <motion.button
                          key={f}
                          whileHover={{ scale: 1.05, background: filter === f ? 'var(--sui-blue)' : 'rgba(255,255,255,0.1)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFilter(f as any)}
                          className={`filter-btn-unit ${filter === f ? 'active' : ''}`}
                          style={{
                            padding: '4rem 10rem',
                            borderRadius: '45px',
                            border: 'none',
                            background: filter === f ? 'var(--sui-blue)' : 'transparent',
                            color: filter === f ? 'white' : 'var(--text-dim)',
                            fontWeight: 950,
                            fontSize: '2.5rem',
                            letterSpacing: '0.6rem',
                            cursor: 'pointer',
                            transition: 'all 0.6s',
                            boxShadow: filter === f ? '0 15px 40px rgba(6, 182, 212, 0.4)' : 'none'
                          }}
                        >
                          {f.toUpperCase()}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="manifest-stream-items" style={{ display: 'flex', flexDirection: 'column', gap: '10rem' }}>
                  {filteredTransactions.map((transaction, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: -150 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08, ease: [0.16, 1, 0.3, 1], duration: 1.2 }}
                      key={transaction.id}
                      className="manifest-item-shard card card-glow"
                      style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', padding: '12rem 15rem', borderRadius: '80px', display: 'grid', gridTemplateColumns: 'min-content 1fr min-content', gap: '25rem', alignItems: 'center', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)' }}
                    >
                      <div className={`shard-type-visual card card-glow ${transaction.type === 'funding' ? 'ingress' : 'dispatch'}`} style={{ width: '220px', height: '220px', borderRadius: '60px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)', color: transaction.type === 'funding' ? 'var(--success)' : 'var(--sui-blue)', boxShadow: '0 0 40px rgba(0,0,0,0.6)' }}>
                        {transaction.type === 'funding' ? <ArrowDownLeft size={140} strokeWidth={2} /> : <ArrowUpRight size={140} strokeWidth={2} />}
                      </div>

                      <div className="shard-meta-view">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10rem', marginBottom: '10rem' }}>
                          <h4 className="cyber-glitch-text" style={{ margin: 0, fontSize: '7rem', fontWeight: 950, letterSpacing: '-0.02em', color: 'white', lineHeight: 1 }}>{transaction.roleName?.toUpperCase() || 'PROTOCOL_EVENT'}</h4>
                          <div className={`type-badge-manifold card card-glow ${transaction.type}`} style={{ fontSize: '2.25rem', fontWeight: 950, background: transaction.type === 'funding' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(6, 182, 212, 0.2)', padding: '2.5rem 8rem', borderRadius: '30px', color: transaction.type === 'funding' ? 'var(--success)' : 'var(--sui-blue)', border: `3px solid ${transaction.type === 'funding' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(6, 182, 212, 0.6)'}`, letterSpacing: '0.6rem', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
                            {transaction.type === 'funding' ? 'INGRESS' : 'DISPATCH'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5rem', fontSize: '2.5rem', color: 'var(--text-dim)', fontWeight: 950, fontFamily: 'JetBrains Mono', opacity: 0.5 }}>
                            <Clock size={48} strokeWidth={2} />
                            {format(new Date(transaction.timestamp), 'MMM dd | HH:mm').toUpperCase()}
                          </div>
                        </div>
                        
                        <div className="shard-routing-logic" style={{ display: 'flex', alignItems: 'center', gap: '12rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', opacity: 0.4, textTransform: 'uppercase' }}>ORIGIN</span>
                            <span style={{ fontWeight: 950, fontFamily: 'JetBrains Mono', color: 'white', fontSize: '3rem' }}>{shortenAddress(transaction.from, 28).toUpperCase()}</span>
                          </div>
                          <span style={{ fontSize: '6rem', color: 'var(--text-dim)', opacity: 0.15 }}>→</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.8rem', opacity: 0.4, textTransform: 'uppercase' }}>TERMINAL</span>
                            <span style={{ fontWeight: 950, fontFamily: 'JetBrains Mono', color: 'var(--sui-blue)', fontSize: '3rem' }}>{shortenAddress(transaction.to, 28).toUpperCase()}</span>
                          </div>
                        </div>

                        <div style={{ marginTop: '10rem', display: 'flex', alignItems: 'center', gap: '5rem', opacity: 0.3, letterSpacing: '0.3rem' }}>
                          <Hash size={48} />
                          <span className="mono" style={{ fontSize: '2.25rem', fontWeight: 950, fontFamily: 'JetBrains Mono' }}>{transaction.digest.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="shard-magnitude-section" style={{ textAlign: 'right' }}>
                        <div className="cyber-glitch-text" style={{ color: transaction.type === 'funding' ? 'var(--success)' : 'white', marginBottom: '10rem', fontWeight: 950, fontSize: '12rem', letterSpacing: '-0.06em', lineHeight: 1 }}>
                          {transaction.type === 'funding' ? '+' : '-'}{transaction.amount.toFixed(2)} <span style={{ fontSize: '3rem', opacity: 0.5, fontWeight: 950, letterSpacing: '0.3rem' }}>SUI</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05, background: 'var(--sui-blue)', borderColor: 'var(--sui-blue)', color: 'white', boxShadow: '0 60px 120px rgba(6, 182, 212, 0.6)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/live/${transaction.roleId}`)}
                          className="btn btn-secondary card card-glow"
                          style={{ padding: '4.5rem 12rem', fontSize: '2.25rem', fontWeight: 950, background: 'transparent', letterSpacing: '0.6rem', borderRadius: '45px', display: 'flex', alignItems: 'center', gap: '8rem', marginLeft: 'auto', border: '3px solid var(--border-light)', color: 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.6s', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)' }}
                        >
                          <Terminal size={64} strokeWidth={2} />
                          <span>AUDIT</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredTransactions.length === 0 && (
                  <div className="empty-manifest-view" style={{ border: '4px dashed var(--border-light)', borderRadius: '120px', padding: '50rem 0', textAlign: 'center', background: 'rgba(6, 182, 212, 0.05)' }}>
                    <History size={350} style={{ opacity: 0.05, marginBottom: '15rem' }} color="var(--sui-blue)" strokeWidth={0.5} />
                    <p style={{ fontWeight: 950, color: 'var(--text-dim)', fontSize: '5.5rem', letterSpacing: '2rem', textTransform: 'uppercase', opacity: 0.4, lineHeight: 1.6 }}>KERNEL_IDLE:<br/>NO_MANIFEST_DETECTED</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <footer style={{ textAlign: 'center', marginTop: '35rem', opacity: 0.2, paddingBottom: '45rem', borderTop: '1px dashed var(--border-light)', paddingTop: '25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30rem', marginBottom: '25rem' }}>
            <Smartphone size={100} strokeWidth={0.5} />
            <ShieldCheck size={120} strokeWidth={0.5} />
            <Database size={120} strokeWidth={0.5} />
            <Layers size={100} strokeWidth={0.5} />
            <Fingerprint size={120} strokeWidth={0.5} />
            <Award size={100} strokeWidth={0.5} />
            <Settings size={120} strokeWidth={0.5} />
            <Grid size={100} strokeWidth={0.5} />
            <Timer size={120} strokeWidth={0.5} />
            <Cpu size={150} strokeWidth={0.5} />
            <Activity size={150} strokeWidth={0.5} />
            <Globe size={120} strokeWidth={0.5} />
          </div>
          <div style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '6rem', textTransform: 'uppercase' }}>CRYPTO_SHIELDED_MANIFEST_v9.4.0_FINAL_STABLE</div>
        </footer>
      </div>
    </div>
  );
};
