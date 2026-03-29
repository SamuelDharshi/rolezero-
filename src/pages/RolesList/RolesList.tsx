import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { formatTimestamp, getRoleStatus } from '@/utils/dateUtils';
import { useAllRoles } from '@/hooks/useAllRoles';
import { 
  Clock, 
  Plus, 
  AlertCircle, 
  Activity, 
  Shield, 
  TrendingUp, 
  Cpu, 
  Globe, 
  Zap, 
  Database,
  Hash,
  Layout,
  Layers,
  CheckCircle2,
  Users,
  Coins,
  ArrowRight,
  ShieldCheck,
  Search,
  Check,
  Timer,
  Info,
  Loader2
} from 'lucide-react';
import { shortenAddress } from '@/utils/ens';
import { SkeletonRolesList } from '@/components/Skeleton/Skeleton';
import { ENSAddress } from '@/components/ENSAddress';
import './RolesList.css';

export const RolesList: React.FC = () => {
  const navigate = useNavigate();
  const { data: allRoles, isLoading, error } = useAllRoles();
  const [search, setSearch] = useState('');

  const roles = (allRoles || []).filter(role => 
    role.name.toLowerCase().includes(search.toLowerCase()) || 
    role.id.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="roles-list-page">
        <div className="ens-bg" />
        <div className="container" style={{ paddingTop: '100px' }}>
          <SkeletonRolesList />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roles-list-page">
        <div className="ens-bg" />
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="card text-center"
            style={{ padding: '60px', maxWidth: '600px', border: '1px solid var(--error-subtle)' }}
          >
            <div className="icon-circle flex-center mb-24 error">
              <AlertCircle size={40} className="text-secondary" />
            </div>
            <h2>Registry Sync Interrupted</h2>
            <p className="text-secondary mb-32">
              The protocol gateway failed to retrieve role definitions from the on-chain registry. 
              Please check your connection and try again.
            </p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Retry Connection
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="roles-list-page">
      <div className="ens-bg" />
      
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        <header className="roles-header flex-between mb-40">
          <div>
            <div className="badge">Active Registry</div>
            <h1>Global Protocols</h1>
            <p className="text-secondary">Explore all autonomous payment protocols deployed on the ledger.</p>
          </div>
          <button onClick={() => navigate('/create')} className="btn btn-primary">
            <Plus size={18} /> Initialize Protocol
          </button>
        </header>

        {/* Filters */}
        <div className="filters-bar card mb-32">
          <div className="search-group flex-center gap-12">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Filter by name or protocol hash..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mono"
            />
          </div>
        </div>

        {roles.length === 0 ? (
          <div className="empty-state text-center py-80">
            <div className="icon-circle flex-center mb-24 opacity-20" style={{ margin: '0 auto', background: 'rgba(255,255,255,0.05)', width: '100px', height: '100px' }}>
              <Database size={50} />
            </div>
            <h3>Registry is Empty</h3>
            <p className="text-secondary max-600 center mb-32">
              No active protocols match your current search criteria. 
              Be the first to architect a distribution role on this orbital layer.
            </p>
            <button onClick={() => navigate('/create')} className="btn btn-secondary">
              Deploy First Role
            </button>
          </div>
        ) : (
          <div className="roles-grid">
            {roles.map((role, index) => {
              const status = getRoleStatus(role.startTime, role.expiryTime);
              const isActive = status.label === 'Active';
              
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="role-card card"
                  onClick={() => navigate(`/live/${role.id}`)}
                >
                  <div className="role-card-header flex-between mb-24">
                    <div className="flex-center gap-12">
                      <div className="role-icon-box flex-center sui">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h3 className="m-0 font-bold">{role.name}</h3>
                        <code className="text-xs text-muted mono">{role.id.slice(0, 16).toUpperCase()}...</code>
                      </div>
                    </div>
                    <span className={`status-badge ${isActive ? 'active' : 'expired'}`}>
                      <span className="dot" />
                      {isActive ? 'Live' : 'Closed'}
                    </span>
                  </div>

                  <div className="role-meta-row flex-between mb-24">
                    <div className="meta-item">
                      <span className="meta-label">Total Funded</span>
                      <span className="meta-value text-success font-bold">
                        {(role.totalFunded / 1_000_000_000).toFixed(2)} <span className="text-xs">SUI</span>
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Active Balance</span>
                      <span className="meta-value font-bold">
                        {(role.remainingBalance / 1_000_000_000).toFixed(2)} <span className="text-xs">SUI</span>
                      </span>
                    </div>
                  </div>

                  <div className="role-stats-grid grid-3 mb-24">
                    <div className="stat-box">
                      <Users size={14} className="text-muted" />
                      <span>{role.sponsorCount} Nodes</span>
                    </div>
                    <div className="stat-box">
                      <Layers size={14} className="text-muted" />
                      <span>{role.paymentCount} Outposts</span>
                    </div>
                    <div className="stat-box">
                      <Clock size={14} className="text-muted" />
                      <span>Exp {format(new Date(Number(role.expiryTime)), 'MMM dd')}</span>
                    </div>
                  </div>

                  <div className="role-footer flex-between opacity-60">
                    <div className="creator-info flex-center gap-8">
                      <span className="text-xs uppercase font-bold letter-1 text-muted">Architect:</span>
                      <ENSAddress address={role.creator} showAvatar={false} maxLength={10} className="text-xs mono" />
                    </div>
                    <ArrowRight size={16} />
                  </div>

                  {!isActive && <div className="card-dimmer" />}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Global Integrity Shard */}
        <section className="integrity-section card mt-80 bg-surface-dim">
          <div className="flex-center gap-32">
            <div className="integrity-icon flex-center">
              <ShieldCheck size={48} className="text-primary" />
            </div>
            <div>
              <h3>On-Chain Integrity Verification</h3>
              <p className="text-secondary max-800 m-0">
                All roles in this registry are immutable once deployed. The Rolezero reactor coordinates 
                with SUI and Ethereum neural nodes to guarantee atomic execution of every scheduled dispatch.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
