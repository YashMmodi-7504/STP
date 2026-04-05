import React, { useState, useMemo, memo, useCallback } from 'react';
import {
  Search,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Signal,
  SignalLow,
  SignalZero,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { type TelemetryRow, convertTo12Hour } from './constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== QUALITY INDICATOR ====================
interface QualityIndicatorProps {
  quality: 'GOOD' | 'BAD' | 'ESTIMATED';
}

const QualityIndicator = memo(({ quality }: QualityIndicatorProps) => {
  const config = {
    GOOD: {
      icon: CheckCircle2,
      color: 'emerald',
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-700 font-semibold',
      dot: 'bg-emerald-500',
    },
    ESTIMATED: {
      icon: Activity,
      color: 'blue',
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700 font-semibold',
      dot: 'bg-blue-500',
    },
    BAD: {
      icon: AlertTriangle,
      color: 'red',
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-700 font-semibold',
      dot: 'bg-red-500',
    },
  };

  const cfg = config[quality];
  const Icon = cfg.icon;

  return (
    <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider border', cfg.bg)}>
      <Icon className={`w-3.5 h-3.5 text-${cfg.color}-500`} />
      <span className={cfg.text}>{quality}</span>
    </div>
  );
});
QualityIndicator.displayName = 'QualityIndicator';

// ==================== STATUS BADGE ====================
interface StatusBadgeProps {
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
}

const StatusBadge = memo(({ status }: StatusBadgeProps) => {
  const config = {
    NORMAL: {
      bg: 'bg-emerald-100',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      glow: 'shadow-none',
    },
    WARNING: {
      bg: 'bg-amber-100',
      border: 'border-amber-300',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      glow: 'shadow-lg shadow-amber-500/20',
    },
    CRITICAL: {
      bg: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-700',
      dot: 'bg-red-500',
      glow: 'shadow-lg shadow-red-500/40',
    },
  };

  const cfg = config[status];

  return (
    <motion.div
      animate={status === 'CRITICAL' ? { scale: [1, 1.02, 1], boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.4)', '0 0 0 8px rgba(239, 68, 68, 0)'] } : {}}
      transition={{ duration: 0.6, repeat: status === 'CRITICAL' ? Infinity : 0 }}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-sm',
        cfg.bg,
        cfg.border,
        cfg.text,
        cfg.glow,
        status === 'CRITICAL' && 'pl-3'
      )}
    >
      <motion.div
        animate={status !== 'NORMAL' ? { opacity: [1, 0.3] } : {}}
        transition={{ duration: status === 'CRITICAL' ? 0.5 : 1, repeat: status !== 'NORMAL' ? Infinity : 0 }}
        className={cn('w-2.5 h-2.5 rounded-full', cfg.dot)}
      />
      {status}
    </motion.div>
  );
});
StatusBadge.displayName = 'StatusBadge';

// ==================== LATENCY INDICATOR ====================
interface LatencyIndicatorProps {
  delaySeconds: number;
}

const LatencyIndicator = memo(({ delaySeconds }: LatencyIndicatorProps) => {
  const getSignalIcon = () => {
    if (delaySeconds < 15) return { icon: Wifi, color: 'text-emerald-500', label: 'Good' };
    if (delaySeconds < 60) return { icon: Signal, color: 'text-amber-500', label: 'Delay' };
    return { icon: SignalZero, color: 'text-red-500', label: 'Critical' };
  };

  const signal = getSignalIcon();
  const Icon = signal.icon;
  const isDelayHigh = delaySeconds > 60;

  const formatDelay = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  return (
    <div className="flex items-center gap-2">
      {isDelayHigh ? (
        <motion.div animate={{ opacity: [1, 0.3] }} transition={{ duration: 1, repeat: Infinity }}>
          <Icon className={cn('w-5 h-5', signal.color)} />
        </motion.div>
      ) : (
        <Icon className={cn('w-5 h-5', signal.color)} />
      )}
      <span className={cn('text-xs font-mono font-semibold', isDelayHigh ? 'text-red-600' : 'text-emerald-600')}>
        {formatDelay(delaySeconds)}
      </span>
    </div>
  );
});
LatencyIndicator.displayName = 'LatencyIndicator';

// ==================== TELEMETRY CARD ROW ====================
interface TelemetryCardProps {
  row: TelemetryRow;
  index: number;
  isNewest: boolean;
  isAlternate: boolean;
}

const TelemetryCard = memo(({ row, index, isNewest, isAlternate }: TelemetryCardProps) => {
  const SectionIcon = row.section_icon;
  const isDelayHigh = row.delay_seconds > 60;
  const isCritical = row.status_flag === 'CRITICAL';
  const isWarning = row.status_flag === 'WARNING';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      className={cn(
        'mx-4 my-3 rounded-lg border backdrop-blur-sm transition-all duration-200 hover:shadow-md cursor-pointer group',
        isNewest && 'ring-2 ring-purple-400/50 shadow-lg',
        isCritical && 'border-red-300 bg-red-50/40 hover:bg-red-50/60',
        isWarning && 'border-amber-300 bg-amber-50/30 hover:bg-amber-50/50',
        !isCritical && !isWarning && (isAlternate ? 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/50' : 'border-slate-200 bg-white/50 hover:bg-slate-50/30')
      )}
    >
      {/* Critical/Warning Left Border Accent */}
      {(isCritical || isWarning) && (
        <div className={cn(
          'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg',
          isCritical ? 'bg-gradient-to-b from-red-500 to-red-600' : 'bg-gradient-to-b from-amber-400 to-amber-500'
        )} />
      )}

      {/* New Badge */}
      {isNewest && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-4 top-4 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-[10px] font-bold rounded-full shadow-md"
        >
          NEW
        </motion.div>
      )}

      <div className="p-4 grid grid-cols-12 gap-3 items-center">
        {/* LEFT: Date & Time */}
        <div className={cn('col-span-2', isCritical || isWarning ? 'pl-3' : '')}>
          <div className="space-y-2">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date</p>
              <p className="text-sm font-bold text-slate-700 font-mono">{row.event_date}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Event Time</p>
              <p className="text-xs font-semibold text-slate-600 font-mono">{convertTo12Hour(row.event_time)}</p>
            </div>
            <div className="text-[9px] text-slate-500">Ingested: {convertTo12Hour(row.ingestion_time)}</div>
          </div>
        </div>

        {/* MIDDLE: Sensor Info */}
        <div className="col-span-3">
          <div className="space-y-2">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sensor</p>
              <p className="text-sm font-bold text-slate-800">{row.sensor_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <SectionIcon className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600">{row.plant_section}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Values */}
        <div className="col-span-2">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Value</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900">{row.value}</span>
            <span className="text-xs text-slate-500 font-medium">{row.unit}</span>
          </div>
        </div>

        {/* QUALITY */}
        <div className="col-span-2 flex justify-center">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 block w-full">Quality</p>
          <div className="w-full">
            <QualityIndicator quality={row.quality_flag} />
          </div>
        </div>

        {/* STATUS */}
        <div className="col-span-2 flex justify-center">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">Status</p>
            <StatusBadge status={row.status_flag} />
          </div>
        </div>

        {/* LATENCY */}
        <div className="col-span-1 flex justify-end">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-right">Latency</p>
            <LatencyIndicator delaySeconds={row.delay_seconds} />
          </div>
        </div>
      </div>
    </motion.div>
  );
});
TelemetryCard.displayName = 'TelemetryCard';

// ==================== DATE GROUP HEADER ====================
interface DateGroupHeaderProps {
  date: string;
  count: number;
}

const DateGroupHeader = memo(({ date, count }: DateGroupHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="sticky top-0 z-20 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent backdrop-blur-md border-b border-slate-200/60 px-6 py-3 shadow-sm"
  >
    <div className="flex items-center gap-3">
      <div className="w-1 h-5 bg-gradient-to-b from-slate-300 to-slate-200 rounded-full" />
      <h4 className="text-sm font-bold text-slate-700">
        📅 {date}
        <span className="ml-2 text-xs font-semibold text-slate-500 bg-slate-200/40 px-2.5 py-1 rounded-full">
          {count} {count === 1 ? 'record' : 'records'}
        </span>
      </h4>
    </div>
  </motion.div>
));
DateGroupHeader.displayName = 'DateGroupHeader';

// ==================== FILTER BUTTONS ====================
interface FilterChipsProps {
  selectedFilter: 'all' | 'NORMAL' | 'WARNING' | 'CRITICAL';
  onFilterChange: (filter: 'all' | 'NORMAL' | 'WARNING' | 'CRITICAL') => void;
  statusCounts: Record<string, number>;
}

const FilterChips = memo(({ selectedFilter, onFilterChange, statusCounts }: FilterChipsProps) => {
  const filters = [
    { id: 'all', label: 'All', count: statusCounts.all || 0, icon: '📊' },
    { id: 'NORMAL', label: 'Normal', count: statusCounts.NORMAL || 0, icon: '✓' },
    { id: 'WARNING', label: 'Warning', count: statusCounts.WARNING || 0, icon: '⚠' },
    { id: 'CRITICAL', label: 'Critical', count: statusCounts.CRITICAL || 0, icon: '🚨' },
  ] as const;

  const getButtonStyles = (filter: (typeof filters)[number], isSelected: boolean) => {
    const baseClass = 'px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-all';
    
    if (filter.id === 'all') {
      return cn(
        baseClass,
        isSelected
          ? 'bg-slate-100 border-slate-400 text-slate-700 shadow-md'
          : 'bg-white border-slate-200 text-slate-600'
      );
    }
    
    if (filter.id === 'NORMAL') {
      return cn(
        baseClass,
        isSelected
          ? 'bg-emerald-100 border-emerald-400 text-emerald-700 shadow-md'
          : 'bg-white border-slate-200 text-slate-600'
      );
    }
    
    if (filter.id === 'WARNING') {
      return cn(
        baseClass,
        isSelected
          ? 'bg-amber-100 border-amber-400 text-amber-700 shadow-md'
          : 'bg-white border-slate-200 text-slate-600'
      );
    }
    
    if (filter.id === 'CRITICAL') {
      return cn(
        baseClass,
        isSelected
          ? 'bg-red-100 border-red-400 text-red-700 shadow-md'
          : 'bg-white border-slate-200 text-slate-600'
      );
    }
    
    return baseClass;
  };

  const getCountBadgeClass = (filter: (typeof filters)[number], isSelected: boolean) => {
    if (isSelected) {
      if (filter.id === 'NORMAL') return 'bg-emerald-200';
      if (filter.id === 'WARNING') return 'bg-amber-200';
      if (filter.id === 'CRITICAL') return 'bg-red-200';
      return 'bg-slate-200';
    }
    return 'bg-slate-200';
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.id;

        return (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(filter.id as any)}
            className={getButtonStyles(filter, isSelected)}
          >
            <span className="mr-1">{filter.icon}</span>
            {filter.label}
            <span className={cn('ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold', getCountBadgeClass(filter, isSelected))}>
              {filter.count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
});
FilterChips.displayName = 'FilterChips';

// ==================== MAIN TELEMETRY PANEL ====================
interface TelemetryPanelProps {
  data: TelemetryRow[];
  searchText: string;
  onSearchChange: (text: string) => void;
  dataJustArrived: boolean;
}

export const TelemetryPanel = memo(({ data, searchText, onSearchChange, dataJustArrived }: TelemetryPanelProps) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'NORMAL' | 'WARNING' | 'CRITICAL'>('all');

  // Filter data by search and status
  const filteredData = useMemo(() => {
    let result = data.filter((row) => {
      const matchesSearch =
        row.sensor_name.toLowerCase().includes(searchText.toLowerCase()) ||
        row.plant_section.toLowerCase().includes(searchText.toLowerCase());
      const matchesFilter = statusFilter === 'all' || row.status_flag === statusFilter;
      return matchesSearch && matchesFilter;
    });
    return result;
  }, [data, searchText, statusFilter]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, TelemetryRow[]> = {};
    filteredData.forEach((row) => {
      if (!groups[row.event_date]) {
        groups[row.event_date] = [];
      }
      groups[row.event_date].push(row);
    });
    // Return in order of newest to oldest date
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => {
        const [dayA, monthA, yearA] = dateA.split('/').map(Number);
        const [dayB, monthB, yearB] = dateB.split('/').map(Number);
        const dateObjA = new Date(yearA, monthA - 1, dayA);
        const dateObjB = new Date(yearB, monthB - 1, dayB);
        return dateObjB.getTime() - dateObjA.getTime();
      });
  }, [filteredData]);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    return {
      all: data.length,
      NORMAL: data.filter((r) => r.status_flag === 'NORMAL').length,
      WARNING: data.filter((r) => r.status_flag === 'WARNING').length,
      CRITICAL: data.filter((r) => r.status_flag === 'CRITICAL').length,
    };
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/60 backdrop-blur-lg overflow-hidden rounded-2xl border border-slate-200/50 flex flex-col shadow-lg h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-white/80">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800">Telemetry Stream</h3>
          <p className="text-sm text-slate-500">Real-time data ingestion log with full date and time tracking</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by sensor name or plant section..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>

        {/* Filter Chips */}
        <FilterChips selectedFilter={statusFilter} onFilterChange={setStatusFilter} statusCounts={statusCounts} />
      </div>

      {/* Telemetry Rows */}
      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
        <AnimatePresence mode="popLayout">
          {groupedByDate.length > 0 ? (
            groupedByDate.map(([date, rows]) => (
              <div key={date}>
                <DateGroupHeader date={date} count={rows.length} />
                <div className="space-y-1 py-2">
                  {rows.map((row, idx) => {
                    const isNewest = idx === 0 && dataJustArrived;
                    const isAlternate = idx % 2 === 1;
                    return (
                      <TelemetryCard
                        key={row.id}
                        row={row}
                        index={idx}
                        isNewest={isNewest}
                        isAlternate={isAlternate}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-slate-500 flex items-center justify-center h-full flex-col"
            >
              <p className="text-sm font-medium">No telemetry records found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      {filteredData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-slate-100 bg-slate-50/50 grid grid-cols-4 gap-3 text-xs"
        >
          <div className="text-center">
            <p className="text-slate-500 font-semibold">Total Records</p>
            <p className="text-lg font-bold text-slate-700">{filteredData.length}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 font-semibold">Date Groups</p>
            <p className="text-lg font-bold text-slate-700">{groupedByDate.length}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 font-semibold">Unique Sensors</p>
            <p className="text-lg font-bold text-slate-700">{new Set(filteredData.map((r) => r.sensor_name)).size}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 font-semibold">Avg Latency</p>
            <p className="text-lg font-bold text-slate-700">
              {(filteredData.reduce((sum, r) => sum + r.delay_seconds, 0) / filteredData.length).toFixed(0)}s
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});
TelemetryPanel.displayName = 'TelemetryPanel';
