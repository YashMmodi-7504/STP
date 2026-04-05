import React, { memo, useMemo } from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== SMART CONTROL BUTTON ====================
interface SmartControlButtonProps {
  isActive: boolean;
  isAdjusting: boolean;
  currentMode: 'manual' | 'auto';
  statusMessage: string;
  currentValue: number;
  threshold: { min: number; max: number; criticalMin: number; criticalMax: number } | null;
}

export const SmartControlButton = memo(({
  isActive,
  isAdjusting,
  currentMode,
  statusMessage,
  currentValue,
  threshold,
}: SmartControlButtonProps) => {
  // Determine if we're in a critical state
  const isCritical = useMemo(() => {
    if (!threshold) return false;
    return currentValue > threshold.criticalMax || currentValue < threshold.criticalMin;
  }, [currentValue, threshold]);

  const isWarning = useMemo(() => {
    if (!threshold || isCritical) return false;
    return currentValue > threshold.max || currentValue < threshold.min;
  }, [currentValue, threshold, isCritical]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <div className="bg-white/60 backdrop-blur-lg border border-slate-200/50 rounded-2xl p-6 shadow-lg overflow-hidden">
        {/* Main Control Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Smart Control Button */}
          <motion.div
            className="flex-shrink-0"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <motion.button
              disabled
              className={cn(
                'relative w-28 h-28 rounded-full flex items-center justify-center font-bold transition-all cursor-default border-2',
                isActive
                  ? 'bg-gradient-to-br from-purple-200 to-purple-100 border-purple-400 shadow-lg'
                  : 'bg-gradient-to-br from-slate-100 to-slate-50 border-slate-300 shadow-md'
              )}
              animate={
                isActive
                  ? {
                      boxShadow: [
                        '0 0 20px rgba(147, 51, 234, 0.4)',
                        '0 0 40px rgba(147, 51, 234, 0.6)',
                        '0 0 20px rgba(147, 51, 234, 0.4)',
                      ],
                    }
                  : {}
              }
              transition={
                isActive
                  ? { duration: 2, repeat: Infinity }
                  : {}
              }
            >
              {/* Pulsing ring for active state */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-400"
                  animate={{ scale: [1, 1.3], opacity: [1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Inner animated background */}
              {isActive && (
                <motion.div
                  className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-300/20 to-purple-100/20 blur-sm"
                  animate={{ opacity: [0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Center Icon */}
              <motion.div
                className="relative z-10"
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={isActive ? { duration: 0.8, repeat: Infinity } : {}}
              >
                <Zap
                  className={cn(
                    'w-12 h-12 transition-colors',
                    isActive ? 'text-purple-600' : 'text-slate-400'
                  )}
                />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Status Information */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div>
              <h3 className="text-lg font-bold text-slate-800">Smart Control System</h3>
              <p className="text-sm text-slate-500">Intelligent threshold-based automation</p>
            </div>

            {/* Current Mode */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mode:</span>
                <span className={cn(
                  'text-sm font-bold px-2.5 py-1 rounded-full',
                  isActive
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-slate-100 text-slate-700'
                )}>
                  {isActive ? '🔄 Auto Stabilizing' : '👁 Manual Monitoring'}
                </span>
              </div>

              {/* Status Message */}
              <motion.div
                key={statusMessage}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'text-xs font-medium px-3 py-2 rounded-lg border flex items-center gap-2',
                  isCritical
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : isWarning
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : isActive
                        ? 'bg-purple-50 border-purple-200 text-purple-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                )}
              >
                {isCritical ? (
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                ) : null}
                {statusMessage}
              </motion.div>
            </div>

            {/* Control Status Indicator */}
            <div className="flex items-center gap-2 pt-1">
              <motion.div
                animate={isActive ? { opacity: [1, 0.5, 1] } : {}}
                transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
                className={cn(
                  'w-2.5 h-2.5 rounded-full',
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-md shadow-purple-500/50'
                    : 'bg-slate-400'
                )}
              />
              <span className={cn(
                'text-xs font-bold uppercase tracking-wider',
                isActive ? 'text-purple-600' : 'text-slate-500'
              )}>
                {isAdjusting ? 'Adjusting…' : isActive ? 'Active' : 'Standby'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer - Control Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]"
        >
          <div className="text-slate-500">
            <span className="font-semibold text-slate-600">Current:</span>{' '}
            <span className="font-mono">{currentValue.toFixed(2)}</span>
          </div>
          {threshold && (
            <>
              <div className="text-slate-500">
                <span className="font-semibold text-slate-600">Warning Range:</span>{' '}
                <span className="font-mono">
                  {threshold.min.toFixed(0)} - {threshold.max.toFixed(0)}
                </span>
              </div>
              <div className="text-slate-500">
                <span className="font-semibold text-slate-600">Critical Range:</span>{' '}
                <span className="font-mono">
                  {threshold.criticalMin.toFixed(0)} - {threshold.criticalMax.toFixed(0)}
                </span>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
});

SmartControlButton.displayName = 'SmartControlButton';
