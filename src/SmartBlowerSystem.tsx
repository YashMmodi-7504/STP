import React, { memo, useMemo } from 'react';
import { Wind } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== PREMIUM ENTERPRISE SMART BLOWER SYSTEM - HERO CONTROL MODULE ====================

interface SmartBlowerSystemProps {
  currentValue: number;
  threshold: {
    min: number;
    max: number;
    criticalMin?: number;
    criticalMax?: number;
  } | null;
  isAutoEnabled: boolean;
  onStateChange?: (state: string) => void;
}

export const SmartBlowerSystem = memo(({
  currentValue,
  threshold,
  isAutoEnabled,
  onStateChange,
}: SmartBlowerSystemProps) => {
  // Determine control state based on thresholds
  const controlState = useMemo(() => {
    if (!isAutoEnabled) return 'off';
    
    if (!threshold) return 'normal';
    
    // Critical state - trigger correcting
    if (threshold.criticalMin !== undefined || threshold.criticalMax !== undefined) {
      if (
        (threshold.criticalMax !== undefined && currentValue > threshold.criticalMax) ||
        (threshold.criticalMin !== undefined && currentValue < threshold.criticalMin)
      ) {
        return 'critical';
      }
    }
    
    // Warning state - adjusting
    if (currentValue > threshold.max || currentValue < threshold.min) {
      return 'warning';
    }
    
    // Normal state - stable
    return 'normal';
  }, [currentValue, threshold, isAutoEnabled]);

  // Dynamic status message based on state
  const getStatusMessage = (state: string) => {
    switch (state) {
      case 'critical':
        return 'Critical deviation – corrective action active';
      case 'warning':
        return 'Flow deviation detected – adjusting';
      case 'normal':
        return 'System operating within optimal range';
      default:
        return 'System idle – standby mode';
    }
  };

  // State colors and animations configuration
  const getStateConfig = (state: string) => {
    switch (state) {
      case 'critical':
        return {
          label: 'CORRECTING',
          dot: 'bg-red-500',
          glowColor: 'shadow-red-500/60',
          textColor: 'text-red-400',
          cardBorder: 'border-red-400/70',
          cardShadow: 'shadow-2xl shadow-red-500/40',
          cardGlow: 'border-red-500/50',
          glowAura: 'rgba(239, 68, 68, 0.3)',
          iconColor: 'text-red-400',
          dotPulse: 0.5,
          rotationDuration: 2,
        };
      case 'warning':
        return {
          label: 'ADJUSTING',
          dot: 'bg-amber-400',
          glowColor: 'shadow-amber-500/40',
          textColor: 'text-amber-400',
          cardBorder: 'border-amber-400/50',
          cardShadow: 'shadow-xl shadow-amber-500/30',
          cardGlow: 'border-amber-400/40',
          glowAura: 'rgba(217, 119, 6, 0.2)',
          iconColor: 'text-amber-400',
          dotPulse: 1,
          rotationDuration: 3,
        };
      case 'normal':
        return {
          label: 'ON',
          dot: 'bg-emerald-500',
          glowColor: 'shadow-emerald-500/40',
          textColor: 'text-emerald-400',
          cardBorder: 'border-emerald-400/40',
          cardShadow: 'shadow-lg shadow-emerald-500/25',
          cardGlow: 'border-emerald-400/30',
          glowAura: 'rgba(16, 185, 129, 0.15)',
          iconColor: 'text-emerald-400',
          dotPulse: 1.5,
          rotationDuration: 4,
        };
      default: // 'off'
        return {
          label: 'OFF',
          dot: 'bg-slate-500',
          glowColor: 'shadow-slate-500/20',
          textColor: 'text-slate-400',
          cardBorder: 'border-slate-600/40',
          cardShadow: 'shadow-lg shadow-slate-700/15',
          cardGlow: 'border-slate-500/20',
          glowAura: 'rgba(100, 116, 139, 0.1)',
          iconColor: 'text-slate-400',
          dotPulse: 0,
          rotationDuration: 0,
        };
    }
  };

  const stateConfig = getStateConfig(controlState);
  const statusMessage = getStatusMessage(controlState);
  
  // Calculate threshold status badge
  const thresholdStatus = useMemo(() => {
    if (!threshold) return 'NORMAL';
    if (controlState === 'critical') return 'CRITICAL';
    if (controlState === 'warning') return 'WARNING';
    return 'NORMAL';
  }, [controlState, threshold]);

  const getThresholdColor = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'text-red-400';
      case 'WARNING':
        return 'text-amber-400';
      default:
        return 'text-emerald-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full"
    >
      {/* Hero Premium Enterprise Control Card */}
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border-[1.5px] backdrop-blur-2xl',
          'bg-gradient-to-br from-[#1E2A78] via-[#2F3FAF] to-[#3B4CC0]',
          'transition-all duration-500',
          'min-h-[240px] flex flex-col',
          stateConfig.cardBorder,
          stateConfig.cardShadow
        )}
      >
        {/* Premium noise texture overlay (very subtle) */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2' /%3E%3C/filter%3E%3Crect width='400' height='400' fill='white' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />

        {/* Inner glow effect */}
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          animate={{
            opacity: controlState !== 'off' ? [0.15, 0.25, 0.15] : 0.05,
          }}
          transition={{
            duration: controlState === 'critical' ? 1 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, ${stateConfig.glowAura}, transparent 70%)`,
          }}
        />

        {/* Animated background gradient shift */}
        <motion.div
          className="absolute inset-0 opacity-30 pointer-events-none"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
            backgroundSize: '200% 200%',
          }}
        />

        {/* Main content grid */}
        <div className="relative z-10 flex flex-col flex-1 p-6 gap-4">
          {/* TOP ROW: Icon + Title Section + Status Badge */}
          <div className="flex items-start justify-between gap-6">
            {/* Left: Animated Icon Container */}
            <motion.div
              className="flex-shrink-0"
              animate={controlState !== 'off' ? { rotate: 360 } : { rotate: 0 }}
              transition={
                controlState !== 'off'
                  ? { duration: stateConfig.rotationDuration, repeat: Infinity, ease: 'linear' }
                  : { duration: 0.3 }
              }
            >
              {/* Icon with glassmorphism */}
              <motion.div
                className={cn(
                  'w-20 h-20 rounded-2xl flex items-center justify-center',
                  'bg-gradient-to-br from-blue-900/50 to-purple-900/30',
                  'border border-blue-400/40 backdrop-blur-xl',
                  'transition-all duration-500',
                  controlState === 'critical'
                    ? 'border-red-400/70 shadow-2xl'
                    : controlState === 'warning'
                    ? 'border-amber-400/60 shadow-xl'
                    : controlState === 'normal'
                    ? 'border-emerald-400/50 shadow-lg'
                    : 'border-slate-500/30 shadow-md'
                )}
                animate={
                  controlState === 'critical'
                    ? {
                        boxShadow: [
                          `0 0 20px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(239, 68, 68, 0.1)`,
                          `0 0 40px rgba(239, 68, 68, 0.6), inset 0 0 30px rgba(239, 68, 68, 0.2)`,
                          `0 0 20px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(239, 68, 68, 0.1)`,
                        ],
                      }
                    : {}
                }
                transition={
                  controlState === 'critical'
                    ? { duration: 1.5, repeat: Infinity }
                    : {}
                }
              >
                <Wind className={cn('w-10 h-10 transition-colors duration-500', stateConfig.iconColor)} />
              </motion.div>
            </motion.div>

            {/* Center: Title & Status Message */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-bold text-blue-300/80 uppercase tracking-widest mb-1.5"
              >
                Blower System
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="text-2xl font-bold text-white mb-1.5 leading-tight"
              >
                Smart Blower System
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs text-blue-300/70 font-medium"
              >
                Auto airflow stabilization engine
              </motion.p>

              {/* DYNAMIC STATUS MESSAGE - Key Feature */}
              <motion.div
                key={statusMessage}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'mt-3 px-3 py-2 rounded-lg border text-xs font-semibold',
                  'bg-gradient-to-r',
                  controlState === 'critical'
                    ? 'from-red-900/40 to-red-900/20 border-red-400/50 text-red-300'
                    : controlState === 'warning'
                    ? 'from-amber-900/40 to-amber-900/20 border-amber-400/50 text-amber-300'
                    : controlState === 'normal'
                    ? 'from-emerald-900/40 to-emerald-900/20 border-emerald-400/40 text-emerald-300'
                    : 'from-slate-900/30 to-slate-900/20 border-slate-500/30 text-slate-400'
                )}
              >
                {statusMessage}
              </motion.div>
            </div>

            {/* Right: Status Badge & Control Button */}
            <motion.div
              className="flex-shrink-0 flex flex-col items-end gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              {/* Threshold Status Badge */}
              <motion.div
                className={cn(
                  'px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider',
                  'bg-blue-900/30 border-blue-400/40',
                  getThresholdColor(thresholdStatus)
                )}
              >
                {thresholdStatus}
              </motion.div>

              {/* Advanced Control Button with Vibration Effect */}
              <motion.button
                disabled
                className={cn(
                  'px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm',
                  'transition-all duration-300 cursor-default',
                  'border border-white/20',
                  'flex items-center gap-3',
                  'bg-gradient-to-b from-blue-900/60 to-blue-900/40',
                  'backdrop-blur-md',
                  controlState === 'critical'
                    ? 'from-red-900/70 to-red-900/50 border-red-400/60'
                    : controlState === 'warning'
                    ? 'from-amber-900/60 to-amber-900/40 border-amber-400/50'
                    : controlState === 'normal'
                    ? 'from-emerald-900/60 to-emerald-900/40 border-emerald-400/50'
                    : 'from-slate-900/50 to-slate-900/30 border-slate-500/30'
                )}
                animate={
                  controlState === 'critical'
                    ? {
                        boxShadow: [
                          'inset 0 0 20px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.4)',
                          'inset 0 0 35px rgba(239, 68, 68, 0.8), 0 0 45px rgba(239, 68, 68, 0.5)',
                          'inset 0 0 20px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.4)',
                        ],
                        y: [0, -2, 0],
                      }
                    : controlState === 'warning'
                    ? {
                        boxShadow: [
                          'inset 0 0 15px rgba(217, 119, 6, 0.4), 0 0 20px rgba(217, 119, 6, 0.25)',
                          'inset 0 0 25px rgba(217, 119, 6, 0.6), 0 0 30px rgba(217, 119, 6, 0.35)',
                          'inset 0 0 15px rgba(217, 119, 6, 0.4), 0 0 20px rgba(217, 119, 6, 0.25)',
                        ],
                      }
                    : controlState === 'normal'
                    ? {
                        boxShadow: [
                          'inset 0 0 15px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.2)',
                          'inset 0 0 20px rgba(16, 185, 129, 0.4), 0 0 25px rgba(16, 185, 129, 0.25)',
                          'inset 0 0 15px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.2)',
                        ],
                      }
                    : {}
                }
                transition={
                  controlState !== 'off'
                    ? {
                        duration: controlState === 'critical' ? 0.5 : 1,
                        repeat: Infinity,
                      }
                    : {}
                }
              >
                {/* Inner neon dot with ripple effect on critical */}
                <motion.div
                  className={cn('w-3.5 h-3.5 rounded-full', stateConfig.dot)}
                  animate={
                    controlState === 'critical'
                      ? {
                          scale: [1, 1.3, 1],
                          boxShadow: [
                            `0 0 8px currentColor`,
                            `0 0 20px currentColor`,
                            `0 0 8px currentColor`,
                          ],
                        }
                      : controlState !== 'off'
                      ? { scale: [1, 1.2, 1] }
                      : {}
                  }
                  transition={
                    controlState !== 'off'
                      ? {
                          duration: stateConfig.dotPulse,
                          repeat: Infinity,
                        }
                      : {}
                  }
                />
                <span className="text-white font-bold">{stateConfig.label}</span>
              </motion.button>
            </motion.div>
          </div>

          {/* BOTTOM: Premium Live Data Strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'mt-auto border-t transition-all duration-500',
              controlState === 'critical'
                ? 'border-red-400/30'
                : controlState === 'warning'
                ? 'border-amber-400/30'
                : controlState === 'normal'
                ? 'border-emerald-400/30'
                : 'border-slate-600/30'
            )}
          >
            <div className="flex items-center justify-between pt-4 gap-4 text-xs">
              {/* Left: Current Value */}
              <motion.div
                className="flex items-center gap-2 flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-blue-300/70 font-semibold">Current Value</span>
                <motion.span
                  key={currentValue}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'font-mono font-bold text-base ml-auto',
                    stateConfig.textColor
                  )}
                >
                  {currentValue.toFixed(2)} mg/L
                </motion.span>
              </motion.div>

              {/* Center Divider */}
              <div
                className={cn(
                  'w-px h-6 transition-colors duration-500',
                  controlState === 'critical'
                    ? 'bg-red-400/30'
                    : controlState === 'warning'
                    ? 'bg-amber-400/30'
                    : 'bg-blue-400/20'
                )}
              />

              {/* Center: Safe Range */}
              {threshold && (
                <motion.div
                  className="flex items-center gap-2 flex-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-blue-300/70 font-semibold">Safe Range</span>
                  <span className="font-mono font-bold text-emerald-400 ml-auto">
                    {threshold.min.toFixed(1)} – {threshold.max.toFixed(1)}
                  </span>
                </motion.div>
              )}

              {/* Right Divider */}
              <div
                className={cn(
                  'w-px h-6 transition-colors duration-500',
                  controlState === 'critical'
                    ? 'bg-red-400/30'
                    : controlState === 'warning'
                    ? 'bg-amber-400/30'
                    : 'bg-blue-400/20'
                )}
              />

              {/* Right: Threshold Status Dot + Label */}
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <motion.div
                  className={cn('w-2.5 h-2.5 rounded-full', stateConfig.dot)}
                  animate={controlState !== 'off' ? { scale: [1, 1.3, 1] } : {}}
                  transition={
                    controlState !== 'off'
                      ? {
                          duration: stateConfig.dotPulse,
                          repeat: Infinity,
                        }
                      : {}
                  }
                />
                <span className={cn('font-semibold', stateConfig.textColor)}>
                  {thresholdStatus}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

SmartBlowerSystem.displayName = 'SmartBlowerSystem';
