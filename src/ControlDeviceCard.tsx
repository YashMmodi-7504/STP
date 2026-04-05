import React, { memo, useMemo } from 'react';
import { Zap, Wind, Gauge, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== PROFESSIONAL SCADA CONTROL DEVICE CARD ====================

export type DeviceType = 'chemical' | 'blower' | 'do-sensor';
export type ControlState = 'off' | 'on' | 'adjusting' | 'correcting';

interface ControlDeviceCardProps {
  deviceType: DeviceType;
  isActive: boolean;
  isAdjusting: boolean;
  controlState: ControlState;
  currentValue: number;
  threshold: {
    min: number;
    max: number;
    criticalMin: number;
    criticalMax: number;
  } | null;
}

const getDeviceConfig = (type: DeviceType) => {
  const configs = {
    chemical: {
      name: 'Chemical Dosing System',
      icon: Zap,
      // Gradient background (light purple)
      gradient: 'from-[#F3F0FF] to-[#E6E9FF]',
      iconWrapper: 'from-purple-200/80 to-purple-100/80',
      accentColor: 'text-purple-700',
      accentColorLight: 'text-purple-600',
      ringColor: 'border-purple-400',
      glowColor: 'shadow-purple-500/30',
      dotColor: 'bg-purple-600',
      dotGlow: 'shadow-purple-500/50',
      buttonGradient: 'from-purple-900 to-purple-800',
      buttonNeonGlow: 'shadow-purple-500/40',
    },
    blower: {
      name: 'Smart Blower Control',
      icon: Wind,
      // Gradient background (light blue/teal)
      gradient: 'from-[#E0F4FE] to-[#CCECFF]',
      iconWrapper: 'from-blue-200/80 to-cyan-100/80',
      accentColor: 'text-blue-700',
      accentColorLight: 'text-blue-600',
      ringColor: 'border-blue-400',
      glowColor: 'shadow-blue-500/30',
      dotColor: 'bg-blue-600',
      dotGlow: 'shadow-blue-500/50',
      buttonGradient: 'from-blue-900 to-blue-800',
      buttonNeonGlow: 'shadow-blue-500/40',
    },
    'do-sensor': {
      name: 'DO Level Control',
      icon: Gauge,
      // Gradient background (light teal/cyan)
      gradient: 'from-[#CCFBF1] to-[#A7F3D0]',
      iconWrapper: 'from-teal-200/80 to-cyan-100/80',
      accentColor: 'text-teal-700',
      accentColorLight: 'text-teal-600',
      ringColor: 'border-teal-400',
      glowColor: 'shadow-teal-500/30',
      dotColor: 'bg-teal-600',
      dotGlow: 'shadow-teal-500/50',
      buttonGradient: 'from-teal-900 to-teal-800',
      buttonNeonGlow: 'shadow-teal-500/40',
    },
  };
  return configs[type];
};

const getControlStateConfig = (state: ControlState, deviceConfig: any) => {
  const configs = {
    off: {
      label: 'OFF',
      dotColor: 'bg-slate-400',
      dotGlow: 'shadow-slate-400/30',
      buttonBg: 'bg-slate-200/70',
      buttonBorder: 'border border-slate-300/50',
      textColor: 'text-slate-700',
      glowPulse: false,
      glowIntensity: 'shadow-slate-400/20',
    },
    on: {
      label: 'ON',
      dotColor: deviceConfig.dotColor,
      dotGlow: deviceConfig.dotGlow,
      buttonBg: 'bg-gradient-to-r ' + deviceConfig.buttonGradient,
      buttonBorder: 'border border-transparent',
      textColor: 'text-white',
      glowPulse: true,
      glowIntensity: deviceConfig.buttonNeonGlow,
    },
    adjusting: {
      label: 'ADJUSTING',
      dotColor: 'bg-amber-500',
      dotGlow: 'shadow-amber-500/50',
      buttonBg: 'bg-gradient-to-r from-amber-600 to-amber-700',
      buttonBorder: 'border border-transparent',
      textColor: 'text-white',
      glowPulse: true,
      glowIntensity: 'shadow-amber-500/40',
    },
    correcting: {
      label: 'CORRECTING',
      dotColor: 'bg-red-600',
      dotGlow: 'shadow-red-600/50',
      buttonBg: 'bg-gradient-to-r from-red-700 to-red-600',
      buttonBorder: 'border border-transparent',
      textColor: 'text-white',
      glowPulse: true,
      glowIntensity: 'shadow-red-500/50',
    },
  };
  return configs[state];
};

export const ControlDeviceCard = memo(({
  deviceType,
  isActive,
  isAdjusting,
  controlState,
  currentValue,
  threshold,
}: ControlDeviceCardProps) => {
  const deviceConfig = getDeviceConfig(deviceType);
  const stateConfig = getControlStateConfig(controlState, deviceConfig);
  const Icon = deviceConfig.icon;

  const modeText = useMemo(() => {
    if (!isActive) return 'Manual Monitoring';
    if (isAdjusting) return 'Auto Stabilizing';
    return 'Active Monitoring';
  }, [isActive, isAdjusting]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      {/* Professional SCADA Control Card */}
      <div
        className={cn(
          'relative overflow-hidden rounded-[16px] shadow-lg hover:shadow-xl transition-all duration-300',
          `bg-gradient-to-br ${deviceConfig.gradient}`,
          'backdrop-blur-md border border-white/40'
        )}
      >
        {/* Subtle gradient accent overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255, 0.3), transparent 50%)',
          }}
        />

        {/* Main flex container: ICON | CONTENT | BUTTON */}
        <div className="relative z-10 flex items-center justify-between p-6 gap-8">
          {/* ========== LEFT: CIRCULAR ICON CONTAINER ========== */}
          <motion.div
            className="flex-shrink-0"
            animate={isActive ? { scale: [1, 1.02, 1] } : {}}
            transition={isActive ? { duration: 2, repeat: Infinity } : {}}
          >
            <div className="relative w-24 h-24">
              {/* Soft glow/aura background */}
              {isActive && (
                <motion.div
                  className={cn(
                    'absolute inset-0 rounded-full blur-xl opacity-40',
                    controlState === 'correcting'
                      ? 'bg-red-500'
                      : controlState === 'adjusting'
                        ? 'bg-amber-500'
                        : deviceConfig.dotColor.replace('bg-', 'bg-').replace('-600', '-500')
                  )}
                  animate={{ scale: [0.95, 1.1, 0.95] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              )}

              {/* Circular icon container */}
              <div
                className={cn(
                  'relative w-24 h-24 rounded-full flex items-center justify-center',
                  `bg-gradient-to-br ${deviceConfig.iconWrapper}`,
                  'border-2 border-white/60 shadow-lg',
                  isActive && `${deviceConfig.glowColor} shadow-2xl`
                )}
              >
                {/* Pulsing ring for active state */}
                {isActive && (
                  <motion.div
                    className={cn(
                      'absolute inset-0 rounded-full border-2',
                      controlState === 'correcting'
                        ? 'border-red-400'
                        : controlState === 'adjusting'
                          ? 'border-amber-400'
                          : deviceConfig.ringColor
                    )}
                    animate={{ scale: [1, 1.35], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Device Icon with subtle pulse */}
                <motion.div
                  animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                  transition={isActive ? { duration: 1.2, repeat: Infinity } : {}}
                >
                  <Icon
                    className={cn(
                      'w-12 h-12 transition-colors duration-300',
                      isActive
                        ? controlState === 'correcting'
                          ? 'text-red-600'
                          : controlState === 'adjusting'
                            ? 'text-amber-600'
                            : deviceConfig.accentColor
                        : 'text-slate-400'
                    )}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ========== CENTER: DEVICE INFORMATION ========== */}
          <div className="flex-1 space-y-3">
            {/* Device Name - Top */}
            <div>
              <h3 className={cn(
                'text-base font-bold tracking-wide',
                deviceConfig.accentColor
              )}>
                SMART CONTROL SYSTEM
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {deviceConfig.name}
              </p>
            </div>

            {/* Mode Info - Middle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Mode:
              </span>
              <span className={cn(
                'inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider',
                isActive
                  ? `bg-gradient-to-r ${deviceConfig.buttonGradient} text-white shadow-md`
                  : 'bg-slate-200/50 text-slate-700'
              )}>
                {isActive ? '🔄 ' : '👁 '}{modeText}
              </span>
            </div>

            {/* Status Badge - Bottom */}
            <div className="flex items-center gap-2 pt-1">
              <motion.div
                animate={
                  stateConfig.glowPulse
                    ? {
                        opacity: [1, 0.4, 1],
                        scale: [1, 1.15, 1],
                      }
                    : {}
                }
                transition={
                  stateConfig.glowPulse
                    ? {
                        duration: controlState === 'correcting' ? 0.5 : 0.8,
                        repeat: Infinity,
                      }
                    : {}
                }
                className={cn(
                  'w-3 h-3 rounded-full',
                  stateConfig.dotColor,
                  stateConfig.glowPulse && `${stateConfig.dotGlow} shadow-md`
                )}
              />
              <span className={cn(
                'text-[10px] font-bold uppercase tracking-widest',
                stateConfig.textColor
              )}>
                {isActive
                  ? controlState === 'off'
                    ? 'STANDBY'
                    : controlState.toUpperCase()
                  : 'OFFLINE'}
              </span>
            </div>
          </div>

          {/* ========== RIGHT: ACTION BUTTON (NEON STYLE) ========== */}
          <motion.button
            disabled
            className={cn(
              'flex-shrink-0 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest',
              'transition-all cursor-default',
              `${stateConfig.buttonBg} ${stateConfig.buttonBorder}`,
              stateConfig.textColor,
              isActive && 'shadow-xl'
            )}
            animate={
              isActive
                ? {
                    boxShadow: [
                      `0 0 8px ${
                        controlState === 'correcting'
                          ? 'rgba(220, 38, 38, 0.5)'
                          : controlState === 'adjusting'
                            ? 'rgba(217, 119, 6, 0.4)'
                            : `rgba(${
                                deviceConfig.dotColor === 'bg-purple-600'
                                  ? '147, 51, 234'
                                  : deviceConfig.dotColor === 'bg-blue-600'
                                    ? '59, 130, 246'
                                    : '20, 184, 166'
                              }, 0.4)`
                      }`,
                      `0 0 20px ${
                        controlState === 'correcting'
                          ? 'rgba(220, 38, 38, 0.6)'
                          : controlState === 'adjusting'
                            ? 'rgba(217, 119, 6, 0.5)'
                            : `rgba(${
                                deviceConfig.dotColor === 'bg-purple-600'
                                  ? '147, 51, 234'
                                  : deviceConfig.dotColor === 'bg-blue-600'
                                    ? '59, 130, 246'
                                    : '20, 184, 166'
                              }, 0.5)`
                      }`,
                      `0 0 8px ${
                        controlState === 'correcting'
                          ? 'rgba(220, 38, 38, 0.5)'
                          : controlState === 'adjusting'
                            ? 'rgba(217, 119, 6, 0.4)'
                            : `rgba(${
                                deviceConfig.dotColor === 'bg-purple-600'
                                  ? '147, 51, 234'
                                  : deviceConfig.dotColor === 'bg-blue-600'
                                    ? '59, 130, 246'
                                    : '20, 184, 166'
                              }, 0.4)`
                      }`,
                    ],
                  }
                : {}
            }
            transition={
              isActive
                ? { duration: controlState === 'correcting' ? 0.6 : 1.2, repeat: Infinity }
                : {}
            }
          >
            {/* Neon indicator dot inside button */}
            <div className="flex items-center gap-2.5">
              <motion.div
                animate={stateConfig.glowPulse ? { opacity: [0.8, 1] } : {}}
                transition={stateConfig.glowPulse ? { duration: 0.8, repeat: Infinity } : {}}
                className={cn(
                  'w-2.5 h-2.5 rounded-full',
                  stateConfig.dotColor,
                  stateConfig.glowPulse && stateConfig.dotGlow
                )}
              />
              <span>{stateConfig.label}</span>
            </div>
          </motion.button>
        </div>

        {/* ========== FOOTER: THRESHOLD INFORMATION ========== */}
        {threshold && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'relative z-10 px-6 py-4 border-t',
              'border-white/40 bg-white/30 backdrop-blur-sm',
              'flex items-center justify-between text-[11px] gap-4'
            )}
          >
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-bold">Current:</span>
              <span className="font-mono font-semibold">{currentValue.toFixed(2)}</span>
            </div>

            <div className="h-4 w-px bg-white/30" />

            <div className="flex items-center gap-2 text-emerald-700">
              <span className="font-bold">Safe Range:</span>
              <span className="font-mono font-semibold">
                {threshold.min.toFixed(0)}–{threshold.max.toFixed(0)}
              </span>
            </div>

            <div className="h-4 w-px bg-white/30" />

            <div className="flex items-center gap-2 text-red-700">
              <span className="font-bold">Alert Range:</span>
              <span className="font-mono font-semibold">
                {threshold.criticalMin.toFixed(0)}–{threshold.criticalMax.toFixed(0)}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

ControlDeviceCard.displayName = 'ControlDeviceCard';
