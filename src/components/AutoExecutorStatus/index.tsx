import React from 'react';
import { motion } from 'framer-motion';

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
  // Add countdown timer for next auto-payment
  const [countdown, setCountdown] = React.useState<number | null>(null);
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 cursor-pointer"
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        <div>
          <div className="text-base font-bold flex items-center gap-2">
            <span>Auto-Payment Bot</span>
            {readyCount > 0 && isActive && (
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                {readyCount} ready
              </span>
            )}
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
            {isActive ? '✅ Auto-payment is running' : isMonitoring ? '⏸️ Bot paused' : '❌ Bot inactive'}
          </div>
          {isActive && countdown !== null && (
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              Next auto-payment in <b>{countdown}s</b>
            </div>
          )}
          {onToggle && (
            <div className="text-xs text-blue-500 mt-2">
              Click to {autoExecuteEnabled ? 'disable' : 'enable'} auto-payment
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
