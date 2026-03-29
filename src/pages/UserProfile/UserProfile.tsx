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
  Activity, 
  Clock, 
  ArrowDownLeft, 
  ArrowUpRight, 
  BarChart3, 
  Cpu, 
  Database, 
  History, 
  Layers, 
  LayoutDashboard, 
  ShieldCheck, 
  TrendingUp, 
  Wallet,
  Search,
  Terminal,
  Hash,
  ArrowRight
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
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
          <div className="card text-center" style={{ padding: '60px' }}>
            <div className="icon-circle bg-surface flex-center mb-24" style={{ margin: '0 auto', width: '80px', height: '100px' }}>
              <Activity className="spin text-primary" size={40} />
            </div>
            <p className="text-secondary uppercase font-bold letter-2">Initializing Protocols...</p>
          </div>
        </div>
      </div>
    );
  }

  const authenticated = !!(suiAccount || evmAddress);

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

      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        {!authenticated ? (
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
                  Please connect your SUI or EVM wallet to synchronize your neural identity parameters and view historical manifests.
                </p>
              </div>
              <button className="btn btn-primary px-32 py-16 font-bold whitespace-nowrap" style={{ minWidth: '180px' }}>
                Connect Wallet
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            <header className="profile-header flex-between mb-40">
              <div>
                <div className="badge">Identity Node</div>
                <h1>Protocol Manifest</h1>
                <p className="text-secondary">Synchronized metrics and records for your authenticated identity.</p>
              </div>

              <div className="tab-nav card flex-center gap-4 p-4">
                <button 
                  className={`tab-btn flex-center gap-8 ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <LayoutDashboard size={16} /> Overview
                </button>
                {isDeveloper && (
                  <button 
                    className={`tab-btn flex-center gap-8 ${activeTab === 'developer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('developer')}
                  >
                    <Cpu size={16} /> Developer
                  </button>
                )}
              </div>
            </header>

            <AnimatePresence mode="wait">
              {activeTab === 'developer' && isDeveloper ? (
                <motion.div key="dev" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <DeveloperDashboard />
                </motion.div>
              ) : (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="telemetry-grid mb-40">
                    {[
                      { icon: Layers, color: 'text-primary', label: 'Active Nodes', value: dashboardData?.totalUsers || 0 },
                      { icon: TrendingUp, color: 'text-success', label: 'Aggregate Vol', value: `${dashboardData?.totalVolume.toFixed(2) || '0.00'}` },
                      { icon: ArrowDownLeft, color: 'text-primary', label: 'Ingress Vol', value: dashboardData?.totalFunded.toFixed(2) || '0.00' },
                      { icon: ArrowUpRight, color: 'text-primary', label: 'Egress Vol', value: dashboardData?.totalPaid.toFixed(2) || '0.00' },
                      { icon: Clock, color: 'text-secondary', label: 'Queued', value: dashboardData?.pendingPayments || 0 },
                      { icon: Activity, color: 'text-primary', label: 'Events', value: dashboardData?.transactions.length || 0 }
                    ].map((stat, idx) => (
                      <div key={idx} className="stat-card card flex-center gap-20 p-24">
                        <div className={`icon-box bg-surface ${stat.color}`}><stat.icon size={24} /></div>
                        <div>
                          <div className="text-xs font-bold uppercase letter-1 text-muted mb-4">{stat.label}</div>
                          <div className="text-2xl font-bold">{stat.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <section className="card p-32">
                    <div className="registry-header flex-between mb-32 pb-16 border-subtle-b">
                      <div className="flex-center gap-12">
                        <div className="icon-box bg-surface text-primary"><Database size={20} /></div>
                        <h3 className="m-0">Registry Manifest</h3>
                      </div>
                      
                      <div className="flex-center gap-16">
                        <div className="search-box">
                          <Search size={14} className="text-muted" />
                          <input 
                            type="text" 
                            placeholder="Rescan manifest..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="filter-group flex-center gap-4 bg-surface p-4 rounded-12">
                          {['all', 'funding', 'payment'].map((f) => (
                            <button
                              key={f}
                              onClick={() => setFilter(f as any)}
                              className={`filter-btn ${filter === f ? 'active' : ''}`}
                            >
                              {f.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="manifest-list flex-column gap-12">
                      {filteredTransactions.map((tx, idx) => (
                        <div key={idx} className="tx-item card-dim flex-between p-20 clickable">
                          <div className="flex-center gap-20">
                            <div className={`icon-circle ${tx.type === 'funding' ? 'bg-success-dim text-success' : 'bg-primary-dim text-primary'}`}>
                              {tx.type === 'funding' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div>
                              <div className="flex-center gap-12 mb-4">
                                <h4 className="m-0 font-bold">{tx.roleName?.toUpperCase() || 'Protocol Event'}</h4>
                                <span className={`badge-sm ${tx.type}`}>{tx.type.toUpperCase()}</span>
                                <span className="text-xs text-muted mono">{format(new Date(tx.timestamp), 'MMM dd HH:mm')}</span>
                              </div>
                              <div className="flex-center gap-12 text-xs mono text-muted">
                                <span>{shortenAddress(tx.from, 12)}</span>
                                <ArrowRight size={10} />
                                <span>{shortenAddress(tx.to, 12)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-xl font-bold ${tx.type === 'funding' ? 'text-success' : ''}`}>
                              {tx.type === 'funding' ? '+' : '-'}{tx.amount.toFixed(2)} <span className="text-xs opacity-60">SUI</span>
                            </div>
                            <button onClick={() => navigate(`/live/${tx.roleId}`)} className="btn-text text-primary text-xs font-bold uppercase letter-1 mt-4">
                               Audit Shard <Terminal size={10} className="ml-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {filteredTransactions.length === 0 && (
                        <div className="empty-state text-center py-40 opacity-40">
                          <History size={40} className="mb-12" />
                          <p className="text-xs uppercase font-bold letter-2">No Manifest Shards Detected</p>
                        </div>
                      )}
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};
