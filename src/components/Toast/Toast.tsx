import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Copy, Check, Shield, Info, Zap, Terminal, Globe, Search, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Toast.css';

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  txDigest?: string;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  txDigest,
  duration = 5000,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} className="pulse" />;
      case 'error':
        return <XCircle size={24} />;
      case 'warning':
        return <AlertCircle size={24} />;
      case 'info':
        return <Info size={24} />;
    }
  };

  const copyTxDigest = () => {
    if (txDigest) {
      navigator.clipboard.writeText(txDigest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`toast toast-${type} card-glow`}
    >
      <div className="toast-icon card" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
        {getIcon()}
      </div>
      <div className="toast-content">
        <div className="toast-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 950 }}>
          <span className="cyber-glitch-text">{title}</span>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', opacity: 0.4 }} />
        </div>
        <div className="toast-message" style={{ fontWeight: 500, opacity: 0.7, fontSize: '0.85rem', lineHeight: 1.6 }}>{message}</div>
        
        {txDigest && (
          <div className="toast-actions">
            <motion.button
              whileHover={{ scale: 1.05, color: 'var(--text-primary)' }}
              whileTap={{ scale: 0.95 }}
              className="toast-action-btn"
              onClick={copyTxDigest}
              style={{ fontWeight: 950, fontSize: '0.65rem' }}
            >
              {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
              {copied ? 'DIGEST_COPIED' : 'COPY_DIGEST'}
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05, color: 'var(--text-primary)' }}
              whileTap={{ scale: 0.95 }}
              href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
              target="_blank"
              rel="noopener noreferrer"
              className="toast-action-btn"
              style={{ fontWeight: 950, fontSize: '0.65rem', textDecoration: 'none' }}
            >
              <Globe size={14} />
              <span>LEGDGER_AUDIT</span>
            </motion.a>
          </div>
        )}
      </div>
      <motion.button 
        whileHover={{ scale: 1.2, color: 'var(--error)' }}
        className="toast-close" 
        onClick={onClose}
      >
        <XCircle size={18} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
};

// Toast Manager
interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  txDigest?: string;
  duration?: number;
}

class ToastManager {
  private static toasts: ToastData[] = [];
  private static listeners: ((toasts: ToastData[]) => void)[] = [];

  static show(toast: Omit<ToastData, 'id'>) {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    this.toasts = [...this.toasts, newToast];
    this.notify();
    
    if (toast.duration !== 0) {
      setTimeout(() => this.remove(id), toast.duration || 5000);
    }
  }

  static remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  static subscribe(listener: (toasts: ToastData[]) => void) {
    this.listeners.push(listener);
    listener(this.toasts);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    return ToastManager.subscribe(setToasts);
  }, []);

  return (
    <div className="toast-container">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => ToastManager.remove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const showToast = (toast: Omit<ToastData, 'id'>) => {
  ToastManager.show(toast);
};
