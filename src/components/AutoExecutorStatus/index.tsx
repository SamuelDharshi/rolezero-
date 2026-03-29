import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, ZapOff, Bot, Timer, Shield, Cpu } from 'lucide-react';

interface AutoExecutorStatusProps {
  isMonitoring?: boolean;
  autoExecuteEnabled?: boolean;
  readyCount?: number;
  onToggle?: () => void;
}

export const AutoExecutorStatus: React.FC<AutoExecutorStatusProps> = ({
  isMonitoring = false,
  autoExecuteEnabled = false,
  readyCount = 0,
  onToggle
}) => {
  const isActive = isMonitoring && autoExecuteEnabled;
  const [countdown, setCountdown] = React.useState<number | null>(null);

  React.useEffect(() => {
    let interval: any;
    if (isActive && typeof window !== 'undefined') {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 0) return 30;
          return prev - 1;
        });
      }, 1000);
      setCountdown(30);
    } else {
      setCountdown(null);
    }
    return () => interval && clearInterval(interval);
  }, [isActive]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onToggle}
      className={`card fixed bottom-12 right-12 z-[2000] cursor-pointer overflow-hidden ${isActive ? 'card-glow' : ''}`}
      style={{ padding: '2rem 3rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '25px', width: '380px' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: isActive ? 'var(--success)' : 'var(--text-dim)', opacity: 0.4 }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div className={`card ${isActive ? 'pulse' : ''}`} style={{ width: '56px', height: '56px', borderRadius: '15px', background: isActive ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-main)', border: `1px solid ${isActive ? 'var(--success)' : 'var(--border-light)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? 'var(--success)' : 'var(--text-dim)' }}>
          {isActive ? <Bot size={28} /> : <ZapOff size={28} />}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 950, letterSpacing: '0.05em' }}>BOT: EXECUTOR</span>
            {readyCount > 0 && isActive && (
              <span style={{ background: 'var(--success)', color: 'white', fontSize: '0.65rem', fontWeight: 950, padding: '0.2rem 0.6rem', borderRadius: '100px', letterSpacing: '0.05em' }}>
                {readyCount} READY
              </span>
            )}
          </div>
          
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isActive ? 'var(--success)' : 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className={isActive ? 'pulse' : ''} style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? 'var(--success)' : 'var(--text-dim)' }} />
            {isActive ? 'KERNEL_ACTIVE_MONITORING' : isMonitoring ? 'EXECUTOR_PAUSED_NOMINAL' : 'KERNEL_OFFLINE_VOID'}
          </div>

          <AnimatePresence>
            {isActive && countdown !== null && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ fontSize: '0.7rem', color: 'var(--sui-blue)', fontWeight: 950, marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '0.05em' }}
              >
                <Timer size={14} /> NEXT_CYCLE: {countdown}S
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)', fontSize: '0.65rem', fontWeight: 950 }}>
          <Shield size={12} /> SECURE_LEDGER_SYNC
        </div>
        <div style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--sui-blue)' }}>
           {isActive ? 'CLICK_TO_ABORT' : 'CLICK_TO_ENGAGE'}
        </div>
      </div>
    </motion.div>
  );
};
