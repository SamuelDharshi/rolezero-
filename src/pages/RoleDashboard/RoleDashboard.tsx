import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useRoleData } from '@/hooks/useRoleData';
import { formatTimestamp } from '@/utils/dateUtils';
import { SkeletonDashboard } from '@/components/Skeleton/Skeleton';
import { getTokenIcon } from '@/utils/token';
import { shortenAddress } from '@/utils/ens';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Wallet, 
  ExternalLink,
  Shield,
  Users,
  Activity,
  Zap,
  TrendingUp,
  AlertCircle,
  Terminal,
  Calendar
} from 'lucide-react';
import './RoleDashboard.css';

export const RoleDashboard: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { data: roleData, isLoading, error } = useRoleData(roleId);

  // Always redirect to live dashboard for better UX as requested by the Cyber-Luxe system
  React.useEffect(() => {
    if (roleId) {
      navigate(`/live/${roleId}`, { replace: true });
    }
  }, [roleId, navigate]);

  if (isLoading) return <SkeletonDashboard />;

  if (error || !roleData) {
    return (
      <div className="dashboard-page">
        <div className="ens-bg" />
        <div className="card" style={{ maxWidth: '600px', margin: '5rem auto', textAlign: 'center', borderColor: 'var(--error)' }}>
          <AlertCircle size={48} color="var(--error)" style={{ marginBottom: '1.5rem' }} />
          <h2>SYNC FAILURE</h2>
          <p>{error?.message || 'Role record not found in registry.'}</p>
          <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginTop: '2.5rem' }}>
            RETURN TO TERMINAL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="ens-bg" />
      <div className="dashboard-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '2rem' }}>
        <Loader2 className="spin" size={48} color="var(--sui-blue)" />
        <h2 style={{ letterSpacing: '0.2em', fontWeight: 800 }}>INITIALIZING OPERATIONS PANEL...</h2>
      </div>
    </div>
  );
};
