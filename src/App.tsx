import React, { useState, useMemo, useEffect, useCallback, memo } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  ChevronRight, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Zap,
  Activity,
  ShieldAlert,
  BrainCircuit,
  LayoutDashboard,
  Settings as SettingsIcon,
  Menu,
  X,
  Filter,
  Wifi,
  WifiOff,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Gauge,
  ShieldCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  ComposedChart,
  Bar
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  SENSOR_MODELS, 
  generateTableData, 
  generateChartData, 
  generateAIInsight,
  generateAnomalyAwareInsight,
  generateSparklineData,
  calculateTrendDirection,
  calculateTrendPercent,
  generateAlerts,
  SENSOR_THRESHOLDS,
  getStatusIndicator,
  detectAnomalies,
  formatTo12Hour,
  getDisplayTime12Hour,
  convertTo12Hour,
  type SensorModel,
  type TelemetryRow,
  type AIInsightData,
  type AlertData,
  type AnomalyRecord,
  type StatusIndicator
} from './constants';
import { TelemetryPanel } from './TelemetryPanel';
import { SmartBlowerSystem } from './SmartBlowerSystem';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== PREMIUM KPI CARD COMPONENT ====================
interface KPICardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: React.ComponentType<any>;
  color: 'purple' | 'blue' | 'emerald' | 'indigo';
  sparkline: number[];
  lastUpdated: string;
  dataArrived: boolean;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercent: number;
  sensorName?: string;
  status?: StatusIndicator;
}

const KPICard = memo(({
  label,
  value,
  unit,
  icon: Icon,
  color,
  sparkline,
  lastUpdated,
  dataArrived,
  trendDirection,
  trendPercent,
  sensorName,
  status
}: KPICardProps) => {
  const colorMap = {
    purple: { bg: 'from-purple-50 to-blue-50', border: 'border-purple-200', gradient: 'from-[#6C5CE7] to-[#A29BFE]', icon: 'bg-purple-100 text-purple-600', line: '#6C5CE7' },
    blue: { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200', gradient: 'from-blue-500 to-cyan-500', icon: 'bg-blue-100 text-blue-600', line: '#3B82F6' },
    emerald: { bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', gradient: 'from-emerald-500 to-teal-500', icon: 'bg-emerald-100 text-emerald-600', line: '#10B981' },
    indigo: { bg: 'from-indigo-50 to-purple-50', border: 'border-indigo-200', gradient: 'from-indigo-500 to-purple-500', icon: 'bg-indigo-100 text-indigo-600', line: '#4F46E5' },
  };

  const colorConfig = colorMap[color];
  const trendColor = trendDirection === 'up' ? 'text-emerald-600' : trendDirection === 'down' ? 'text-red-600' : 'text-slate-400';
  const trendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;
  const TrendIcon = trendIcon;

  const statusColor = status?.status === 'CRITICAL' ? 'bg-red-500 shadow-lg shadow-red-500/50' 
    : status?.status === 'WARNING' ? 'bg-yellow-500'
    : 'bg-emerald-600';

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border backdrop-blur-lg transition-all duration-300",
        `bg-gradient-to-br ${colorConfig.bg}`,
        `border-${colorConfig.border}`,
        "shadow-md min-h-[280px] flex flex-col"
      )}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md pointer-events-none" />
      
      {/* Subtle gradient accent */}
      <div className={cn(
        "absolute top-0 right-0 w-48 h-48 -mt-24 -mr-24 rounded-full blur-2xl opacity-15 pointer-events-none",
        `bg-gradient-to-br ${colorConfig.gradient}`
      )} />

      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Header: Label + Status Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
            {sensorName && (
              <p className="text-xs text-slate-400 font-medium truncate">
                {sensorName}
              </p>
            )}
          </div>
          {status && (
            <motion.div
              animate={status.blinkRate > 0 ? { opacity: [1, 0.3] } : undefined}
              transition={status.blinkRate > 0 ? { duration: status.blinkRate / 1000, repeat: Infinity } : undefined}
              className={cn(
                "w-3 h-3 rounded-full flex-shrink-0",
                statusColor,
                "shadow-sm"
              )}
            />
          )}
        </div>

        {/* Main Value */}
        <div className="mb-4 flex-1">
          <motion.div
            key={`${value}-${unit}`}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900">{value}</span>
              <span className="text-sm font-medium text-slate-500">{unit}</span>
            </div>
          </motion.div>
        </div>

        {/* Mini Sparkline Graph with Enhanced Glow */}
        <div className="mb-4 h-12 w-full">
          <svg viewBox="0 0 100 40" className="w-full h-full">
            <defs>
              <linearGradient id={`grad-kpi-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorConfig.line} stopOpacity="0.4" />
                <stop offset="100%" stopColor={colorConfig.line} stopOpacity="0" />
              </linearGradient>
              <filter id={`glow-${color}`}>
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {sparkline.length > 0 && (
              <>
                {/* Sparkline fill */}
                <path
                  d={
                    (() => {
                      const minVal = Math.min(...sparkline);
                      const maxVal = Math.max(...sparkline);
                      const range = maxVal - minVal || 1;
                      const points = sparkline.map((v: number, i: number) => ({
                        x: (i / (sparkline.length - 1)) * 95 + 2.5,
                        y: 37 - ((v - minVal) / range) * 35
                      }));
                      let d = `M ${points[0].x} ${points[0].y}`;
                      for (let i = 1; i < points.length; i++) {
                        const xMid = (points[i - 1].x + points[i].x) / 2;
                        const yMid = (points[i - 1].y + points[i].y) / 2;
                        d += ` Q ${xMid} ${yMid} ${points[i].x} ${points[i].y}`;
                      }
                      d += ` L ${points[points.length - 1].x} 40 L ${points[0].x} 40 Z`;
                      return d;
                    })()
                  }
                  fill={`url(#grad-kpi-${color})`}
                />
                {/* Sparkline line with filter */}
                <path
                  d={
                    (() => {
                      const minVal = Math.min(...sparkline);
                      const maxVal = Math.max(...sparkline);
                      const range = maxVal - minVal || 1;
                      const points = sparkline.map((v: number, i: number) => ({
                        x: (i / (sparkline.length - 1)) * 95 + 2.5,
                        y: 37 - ((v - minVal) / range) * 35
                      }));
                      let d = `M ${points[0].x} ${points[0].y}`;
                      for (let i = 1; i < points.length; i++) {
                        const xMid = (points[i - 1].x + points[i].x) / 2;
                        const yMid = (points[i - 1].y + points[i].y) / 2;
                        d += ` Q ${xMid} ${yMid} ${points[i].x} ${points[i].y}`;
                      }
                      return d;
                    })()
                  }
                  stroke={colorConfig.line}
                  strokeWidth="2"
                  fill="none"
                  filter={`url(#glow-${color})`}
                />
                {/* Glowing last point with enhanced animations */}
                <motion.circle
                  cx={
                    (() => {
                      const minVal = Math.min(...sparkline);
                      const maxVal = Math.max(...sparkline);
                      const range = maxVal - minVal || 1;
                      return (sparkline.length - 1) / (sparkline.length - 1) * 95 + 2.5;
                    })()
                  }
                  cy={
                    (() => {
                      const minVal = Math.min(...sparkline);
                      const maxVal = Math.max(...sparkline);
                      const range = maxVal - minVal || 1;
                      const lastVal = sparkline[sparkline.length - 1];
                      return 37 - ((lastVal - minVal) / range) * 35;
                    })()
                  }
                  r="2"
                  fill={colorConfig.line}
                  filter={`drop-shadow(0 0 4px ${colorConfig.line})`}
                />
              </>
            )}
          </svg>
        </div>

        {/* Trend & Last Updated */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200/40 space-x-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1",
              trendDirection === 'up' ? 'bg-emerald-100 text-emerald-700' :
              trendDirection === 'down' ? 'bg-red-100 text-red-700' :
              'bg-slate-100 text-slate-700'
            )}>
              {trendDirection === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : trendDirection === 'down' ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              {trendDirection === 'up' ? '+' : trendDirection === 'down' ? '-' : ''}{trendPercent}%
            </div>
            <span className="text-xs text-slate-400 font-medium">trend</span>
          </div>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-slate-400 font-mono whitespace-nowrap"
          >
            {lastUpdated}
          </motion.span>
        </div>

        {/* Data Arrived Pulse */}
        {dataArrived && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-purple-400 to-pink-400 border border-purple-300/80 rounded-full flex items-center gap-1.5 shadow-lg shadow-purple-500/30 backdrop-blur-sm"
          >
            <motion.div 
              animate={{ scale: [1, 1.4, 1] }} 
              transition={{ duration: 0.6, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full" 
            />
            <span className="text-[10px] font-bold text-white">Live</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

KPICard.displayName = 'KPICard';

// ==================== HEADER KPI STRIP COMPONENT ====================
interface HeaderKpiStripProps {
  sensorStatuses: { [key: string]: StatusIndicator };
  selectedFilter: 'all' | 'normal' | 'warning' | 'critical';
  onFilterChange: (filter: 'all' | 'normal' | 'warning' | 'critical') => void;
  dataJustArrived: boolean;
}

const HeaderKpiStrip = memo(({
  sensorStatuses,
  selectedFilter,
  onFilterChange,
  dataJustArrived
}: HeaderKpiStripProps) => {
  const normalCount = Object.values(sensorStatuses).filter(s => s.status === 'NORMAL').length;
  const warningCount = Object.values(sensorStatuses).filter(s => s.status === 'WARNING').length;
  const criticalCount = Object.values(sensorStatuses).filter(s => s.status === 'CRITICAL').length;
  const totalCount = Object.keys(sensorStatuses).length;
  const normalPercent = totalCount > 0 ? Math.round((normalCount / totalCount) * 100) : 0;

  const cards = [
    {
      id: 'normal',
      label: 'NORMAL',
      count: normalCount,
      percent: normalPercent,
      icon: CheckCircle2,
      filter: 'normal' as const,
      gradient: 'from-emerald-400/20 to-emerald-500/10',
      border: 'border-emerald-300/40',
      badge: 'bg-emerald-50 text-emerald-700',
      glow: 'shadow-emerald-500/10',
      numberColor: 'text-emerald-700'
    },
    {
      id: 'warning',
      label: 'WARNING',
      count: warningCount,
      percent: totalCount > 0 ? Math.round((warningCount / totalCount) * 100) : 0,
      icon: AlertTriangle,
      filter: 'warning' as const,
      gradient: 'from-amber-400/20 to-amber-500/10',
      border: 'border-amber-300/40',
      badge: 'bg-amber-50 text-amber-700',
      glow: 'shadow-amber-500/10',
      numberColor: 'text-amber-700'
    },
    {
      id: 'critical',
      label: 'CRITICAL',
      count: criticalCount,
      percent: totalCount > 0 ? Math.round((criticalCount / totalCount) * 100) : 0,
      icon: ShieldAlert,
      filter: 'critical' as const,
      gradient: 'from-red-400/20 to-red-500/10',
      border: 'border-red-300/40',
      badge: 'bg-red-50 text-red-700',
      glow: 'shadow-red-500/10',
      numberColor: 'text-red-700'
    },
    {
      id: 'total',
      label: 'TOTAL',
      count: totalCount,
      percent: 100,
      icon: Gauge,
      filter: 'all' as const,
      gradient: 'from-slate-400/20 to-slate-500/10',
      border: 'border-slate-300/40',
      badge: 'bg-slate-50 text-slate-700',
      glow: 'shadow-slate-500/10',
      numberColor: 'text-slate-700'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {cards.map(card => {
        const Icon = card.icon;
        const isActive = selectedFilter === card.filter;

        return (
          <motion.button
            key={card.id}
            onClick={() => onFilterChange(card.filter)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative overflow-hidden rounded-2xl border backdrop-blur-lg transition-all duration-300 p-5 text-left group",
              `bg-gradient-to-br ${card.gradient}`,
              card.border,
              "shadow-lg hover:shadow-xl",
              isActive && `ring-2 ring-offset-2 ${card.glow}`,
              `hover:${card.glow}`
            )}
          >
            {/* Background animation on click */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={dataJustArrived && isActive ? { opacity: [0, 0.3, 0], scale: [0.5, 1.5, 2] } : undefined}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full"
              style={{ 
                background: card.id === 'normal' ? '#10b981' : 
                           card.id === 'warning' ? '#d97706' :
                           card.id === 'critical' ? '#ef4444' : '#6b7280'
              }}
            />

            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                <motion.div
                  animate={dataJustArrived && isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className="flex items-baseline gap-1.5 mb-2"
                >
                  <span className={cn("text-4xl font-bold", card.numberColor)}>
                    {card.count}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {card.count !== 1 ? 'sensors' : 'sensor'}
                  </span>
                </motion.div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {card.label}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  <span className="font-bold text-slate-700">{card.percent}%</span> of total
                </p>
              </div>

              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={cn(
                  "p-3 rounded-xl flex-shrink-0",
                  card.badge
                )}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            </div>

            {/* Hover indicator line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r"
              style={{
                backgroundImage: 
                  card.id === 'normal' ? 'linear-gradient(to right, #10b981, #34d399)' :
                  card.id === 'warning' ? 'linear-gradient(to right, #d97706, #fbbf24)' :
                  card.id === 'critical' ? 'linear-gradient(to right, #ef4444, #f87171)' : 
                  'linear-gradient(to right, #6b7280, #9ca3af)'
              }}
            />
          </motion.button>
        );
      })}
    </motion.div>
  );
});

HeaderKpiStrip.displayName = 'HeaderKpiStrip';

// ==================== DASHBOARD COMPONENT - ALL SENSORS ====================
interface DashboardProps {
  playbackTimestamp: Date;
  lastUpdateTime: string;
  dataJustArrived: boolean;
  sensorStatuses: { [key: string]: StatusIndicator };
  selectedFilter: 'all' | 'normal' | 'warning' | 'critical';
  onFilterChange: (filter: 'all' | 'normal' | 'warning' | 'critical') => void;
}

const Dashboard = memo(({ 
  playbackTimestamp,
  lastUpdateTime,
  dataJustArrived,
  sensorStatuses,
  selectedFilter,
  onFilterChange
}: DashboardProps) => {
  // Pre-calculate all KPI data for all sensors
  const allKPIs = useMemo(() => {
    return SENSOR_MODELS.map(model => {
      const tableData = generateTableData(model, playbackTimestamp);
      const sparklineData = generateSparklineData(model, playbackTimestamp);
      
      const currentVal = tableData[0]?.value || 0;
      const avgVal = tableData.length > 0 ? (tableData.reduce((acc, row) => acc + row.value, 0) / tableData.length).toFixed(2) : 0;
      
      const trendDir = calculateTrendDirection(sparklineData);
      const trendPct = calculateTrendPercent(sparklineData);
      
      return {
        model,
        currentVal,
        avgVal,
        sparklineData,
        trendDir,
        trendPct,
        status: sensorStatuses[model.id]
      };
    });
  }, [playbackTimestamp, sensorStatuses]);

  // Filter KPIs based on selected status
  const filteredKPIs = useMemo(() => {
    if (selectedFilter === 'all') return allKPIs;
    return allKPIs.filter(kpi => kpi.status?.status === selectedFilter.toUpperCase());
  }, [allKPIs, selectedFilter]);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">All Sensors Overview</h2>
        <p className="text-slate-600 text-sm">Real-time monitoring of all 20 AI-powered STP sensors</p>
      </motion.div>

      {/* Header KPI Strip - PREMIUM STATUS CARDS */}
      <HeaderKpiStrip
        sensorStatuses={sensorStatuses}
        selectedFilter={selectedFilter}
        onFilterChange={onFilterChange}
        dataJustArrived={dataJustArrived}
      />

      {/* Filtered KPI Grid - ENHANCED DESIGN */}
      <motion.div
        key={`kpi-grid-${selectedFilter}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filteredKPIs.map((kpi, idx) => (
            <motion.div
              key={kpi.model.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              layout
            >
              <KPICard
                label={kpi.model.name}
                value={typeof kpi.currentVal === 'number' ? kpi.currentVal.toFixed(2) : kpi.currentVal}
                unit={kpi.model.unit}
                icon={kpi.model.icon}
                color={['purple', 'blue', 'emerald', 'indigo'][idx % 4] as any}
                sparkline={kpi.sparklineData}
                lastUpdated={lastUpdateTime}
                dataArrived={dataJustArrived}
                trendDirection={kpi.trendDir}
                trendPercent={kpi.trendPct}
                sensorName={kpi.model.name}
                status={kpi.status}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredKPIs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <Gauge className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No sensors found with this status</p>
          <p className="text-slate-400 text-sm">Try selecting a different filter</p>
        </motion.div>
      )}
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

// ==================== MAIN APP ====================
export default function App() {
  const [selectedModel, setSelectedModel] = useState<SensorModel>(SENSOR_MODELS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  
  // Real-time data streaming
  const [playbackTimestamp, setPlaybackTimestamp] = useState(new Date('2025-09-01T00:00:00'));
  const [countdown, setCountdown] = useState(59);
  const [systemTime, setSystemTime] = useState<string>('');
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');
  const [dataJustArrived, setDataJustArrived] = useState(false);
  
  // Control System
  const [blowerAutoSwitchEnabled, setBlowerAutoSwitchEnabled] = useState(false);
  const [blowerControlImpact, setBlowerControlImpact] = useState(0);
  
  // Navigation
  const [currentView, setCurrentView] = useState<'dashboard' | 'sensor'>('dashboard');
  
  // Dashboard filtering
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'normal' | 'warning' | 'critical'>('all');
  
  // Anomaly monitoring
  const [detectedAnomalies, setDetectedAnomalies] = useState<AnomalyRecord[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [displayedInsight, setDisplayedInsight] = useState<AIInsightData | null>(null);
  const [sensorStatuses, setSensorStatuses] = useState<{ [key: string]: StatusIndicator }>({});

  const tableData = useMemo(() => generateTableData(selectedModel, playbackTimestamp), [selectedModel, playbackTimestamp]);
  const chartData = useMemo(() => generateChartData(selectedModel, playbackTimestamp), [selectedModel, playbackTimestamp]);
  const sparklineData = useMemo(() => generateSparklineData(selectedModel, playbackTimestamp), [selectedModel, playbackTimestamp]);
  const threshold = useMemo(() => SENSOR_THRESHOLDS[selectedModel.id], [selectedModel.id]);
  
  const aiInsight = useMemo(() => {
    const relevantAnomalies = detectedAnomalies.filter(a => a.sensorId === selectedModel.id);
    if (relevantAnomalies.length > 0) {
      return generateAnomalyAwareInsight(relevantAnomalies);
    }
    return generateAIInsight(selectedModel, playbackTimestamp);
  }, [selectedModel, playbackTimestamp, detectedAnomalies]);

  const alerts = useMemo(() => generateAlerts(selectedModel), [selectedModel]);
  
  const allAnomalies = useMemo(() => {
    const anomalies: AnomalyRecord[] = [];
    SENSOR_MODELS.forEach(model => {
      const modelData = generateTableData(model, playbackTimestamp);
      const modelAnomalies = detectAnomalies(modelData, model.id);
      anomalies.push(...modelAnomalies);
    });
    return anomalies;
  }, [playbackTimestamp]);
  
  const controlledChartData = useMemo(() => {
    if (!blowerAutoSwitchEnabled || currentView === 'dashboard') {
      return chartData;
    }
    
    return chartData.map((point: any, index: number) => {
      const controlEffect = blowerControlImpact * 0.5;
      const impact = controlEffect * (index / Math.max(1, chartData.length - 1));
      return {
        ...point,
        value: Math.max(0, point.value + impact)
      };
    });
  }, [chartData, blowerAutoSwitchEnabled, blowerControlImpact, currentView]);
  
  useEffect(() => {
    const statuses: { [key: string]: StatusIndicator } = {};
    SENSOR_MODELS.forEach(model => {
      const modelData = generateTableData(model, playbackTimestamp);
      if (modelData.length > 0) {
        const thresh = SENSOR_THRESHOLDS[model.id];
        if (thresh) {
          statuses[model.id] = getStatusIndicator(modelData[0].value, thresh);
        }
      }
    });
    setSensorStatuses(statuses);
  }, [playbackTimestamp]);
  
  useEffect(() => {
    setDetectedAnomalies(allAnomalies);
  }, [allAnomalies]);
  
  useEffect(() => {
    if (currentView === 'dashboard') {
      setBlowerControlImpact(0);
      return;
    }
    
    const currentValue = tableData[0]?.value || 0;
    const thresh = threshold;
    
    if (!thresh) {
      setBlowerControlImpact(0);
      setBlowerAutoSwitchEnabled(false);
      return;
    }

    // Auto-activate based on threshold crossing
    const shouldActivate = 
      currentValue > (thresh.max || 500) || 
      currentValue < (thresh.min || 0);
    
    setBlowerAutoSwitchEnabled(shouldActivate);

    // Calculate control impact based on how far we are from normal range
    if (currentValue > (thresh.criticalMax || 1000)) {
      setBlowerControlImpact(-80);
    } else if (currentValue > (thresh.max || 500)) {
      setBlowerControlImpact(-50);
    } else if (currentValue < (thresh.criticalMin || 0) && currentValue > 0) {
      setBlowerControlImpact(80);
    } else if (currentValue < (thresh.min || 0) && currentValue > 0) {
      setBlowerControlImpact(50);
    } else {
      setBlowerControlImpact(0);
    }
  }, [tableData, threshold, currentView]);

  useEffect(() => {
    setDisplayedInsight(aiInsight);
  }, [aiInsight]);

  useEffect(() => {
    const updateClock = () => {
      setSystemTime(getDisplayTime12Hour());
    };
    
    updateClock();
    const clockInterval = setInterval(updateClock, 60000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          setPlaybackTimestamp(curr => new Date(curr.getTime() + 60000));
          const now = new Date();
          const hours = now.getHours();
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = String((hours % 12) || 12).padStart(2, '0');
          setLastUpdateTime(`${displayHours}:${minutes} ${ampm}`);
          setDataJustArrived(true);
          
          setTimeout(() => setDataJustArrived(false), 1000);
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = String((hours % 12) || 12).padStart(2, '0');
    setLastUpdateTime(`${displayHours}:${minutes} ${ampm}`);
  }, []);

  const filteredModels = SENSOR_MODELS.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTableData = useMemo(() => {
    let filtered = tableData.filter(row => 
      row.sensor_name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      row.plant_section.toLowerCase().includes(tableSearch.toLowerCase())
    );

    if (sortConfig) {
      filtered.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        return sortConfig.direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }
    
    return filtered;
  }, [tableData, tableSearch, sortConfig]);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const currentVal = tableData[0]?.value || 0;
  const avgVal = (tableData.reduce((acc, row) => acc + row.value, 0) / tableData.length).toFixed(2);
  const maxVal = Math.max(...tableData.map(r => r.value)).toFixed(2);
  const minVal = Math.min(...tableData.map(r => r.value)).toFixed(2);
  const goodQualityCount = tableData.filter(r => r.quality_flag === 'GOOD').length;
  const qualityPercent = ((goodQualityCount / tableData.length) * 100).toFixed(1);

  // Generate control status message based on current state
  const controlStatusMessage = useMemo(() => {
    if (!threshold) return 'System stable';
    
    const currentValue = tableData[0]?.value || 0;
    
    if (currentValue > threshold.criticalMax!) {
      return '🔴 Critical: Rapidly increasing - Activating maximum control';
    } else if (currentValue > threshold.max!) {
      return '🟠 Warning: Exceeding optimal range - Adjusting parameters';
    } else if (currentValue < threshold.criticalMin! && currentValue > 0) {
      return '🔴 Critical: Critically low levels - Emergency response active';
    } else if (currentValue < threshold.min! && currentValue > 0) {
      return '🟠 Warning: Below optimal range - Restoring stability';
    } else if (blowerAutoSwitchEnabled) {
      return '✅ System stable - Auto monitoring active';
    } else {
      return '✅ All parameters normal - Manual monitoring engaged';
    }
  }, [currentVal, threshold, tableData, blowerAutoSwitchEnabled]);

  // Determine device type based on selected sensor
  const getDeviceType = useCallback(() => {
    const sensorId = selectedModel.id;
    if (sensorId === 'chemical-dosing') return 'chemical' as const;
    if (sensorId === 'aeration-demand' || sensorId === 'do-opt') return 'blower' as const;
    return 'blower' as const;
  }, [selectedModel.id]);

  // Determine control state based on threshold and current value
  const getControlState = useCallback(() => {
    if (!threshold || !blowerAutoSwitchEnabled) return 'off' as const;
    
    const currentValue = tableData[0]?.value || 0;
    if (currentValue > threshold.criticalMax! || currentValue < threshold.criticalMin!) {
      return 'correcting' as const;
    } else if (currentValue > threshold.max! || currentValue < threshold.min!) {
      return 'adjusting' as const;
    }
    return 'on' as const;
  }, [threshold, blowerAutoSwitchEnabled, tableData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F5F3FF] to-[#F8F9FF] text-slate-800 font-sans selection:bg-[#6C5CE7]/20 flex">
      {/* PREMIUM SIDEBAR WITH REORDERED STRUCTURE */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full z-50 bg-white border-r border-slate-200/80 transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.03)]",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Branding */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <div className={cn("flex items-center gap-3 transition-opacity", !isSidebarOpen && "opacity-0")}>
              <div className="w-8 h-8 bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] rounded-lg flex items-center justify-center shadow-lg shadow-[#6C5CE7]/20">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">
                AuraFlow
              </span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Search Bar - Fixed at Top */}
          {isSidebarOpen && (
            <div className="px-4 py-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7] transition-all"
                />
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
            {/* Section 1: Dashboard */}
            <motion.button
              onClick={() => {
                setCurrentView('dashboard');
                setSearchQuery('');
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative overflow-hidden",
                currentView === 'dashboard'
                  ? "bg-gradient-to-r from-[#6C5CE7]/15 to-[#A29BFE]/15 text-[#6C5CE7] font-semibold shadow-md shadow-[#6C5CE7]/10" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-all",
                currentView === 'dashboard'
                  ? "bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] text-white shadow-lg shadow-[#6C5CE7]/30" 
                  : "bg-white border border-slate-200"
              )}>
                <LayoutDashboard className="w-4 h-4" />
              </div>
              {isSidebarOpen && (
                <span className="text-sm truncate">Dashboard</span>
              )}
              {currentView === 'dashboard' && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#6C5CE7] to-[#A29BFE] rounded-r-full"
                />
              )}
            </motion.button>

            {/* Divider */}
            {isSidebarOpen && <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2" />}

            {/* Section 2: AI Modules */}
            {isSidebarOpen && (
              <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Modules</p>
            )}

            {filteredModels.map((model, idx) => {
              const Icon = model.icon;
              const isActive = selectedModel.id === model.id && currentView === 'sensor';
              const status = sensorStatuses[model.id];
              const statusColor = status?.color || '#00C853';
              
              return (
                <motion.button
                  key={model.id}
                  onClick={() => {
                    setCurrentView('sensor');
                    setSelectedModel(model);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-r from-[#6C5CE7]/15 to-[#A29BFE]/15 text-[#6C5CE7] font-semibold shadow-md shadow-[#6C5CE7]/10" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {/* SCADA Status Indicator */}
                  {status && (
                    <motion.div
                      animate={status.blinkRate > 0 ? { opacity: [1, 0.3] } : undefined}
                      transition={status.blinkRate > 0 ? { duration: status.blinkRate / 1000, repeat: Infinity } : undefined}
                      className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full shadow-lg"
                      style={{ 
                        backgroundColor: statusColor, 
                        boxShadow: `0 0 8px ${statusColor}` 
                      }}
                    />
                  )}
                  
                  <motion.div 
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    className={cn(
                      "p-2 rounded-lg transition-all flex-shrink-0",
                      isActive 
                        ? "bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] text-white shadow-lg shadow-[#6C5CE7]/30" 
                        : "bg-white border border-slate-200 group-hover:border-slate-300"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>

                  {isSidebarOpen && (
                    <div className="flex flex-col items-start overflow-hidden flex-1">
                      <span className="text-xs font-medium truncate w-full text-left">{model.name}</span>
                      <span className="text-[10px] text-slate-400 truncate w-full text-left">{model.unit}</span>
                    </div>
                  )}

                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#6C5CE7] to-[#A29BFE] rounded-r-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "ml-72" : "ml-20"
      )}>
        {/* Premium Header */}
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg border-b border-slate-200/50 px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              {currentView === 'dashboard' ? 'Dashboard Overview' : selectedModel.name}
            </h1>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
              "bg-emerald-50 border border-emerald-200"
            )}>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-emerald-600"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Live
              </span>
            </div>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
              "bg-blue-50 border border-blue-200"
            )}>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Stable
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Clock (12-hour) */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full font-mono shadow-sm hover:border-[#6C5CE7] transition-colors">
              <Clock className="w-4 h-4 text-[#6C5CE7]" />
              <span className="text-xs font-bold text-slate-800">{systemTime}</span>
            </div>

            {/* Countdown Timer */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full font-mono transition-all shadow-sm",
              countdown <= 10 
                ? "bg-yellow-100 border border-yellow-300" 
                : "bg-purple-100 border border-[#6C5CE7]/30"
            )}>
              <motion.div
                animate={{ scale: countdown === 59 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: countdown === 59 ? 0.3 : 0 }}
                className={cn(
                  "w-2 h-2 rounded-full",
                  countdown <= 10 ? "bg-yellow-600" : "bg-[#6C5CE7]"
                )}
              />
              <span className={cn(
                "text-xs font-bold",
                countdown <= 10 ? "text-yellow-700" : "text-[#6C5CE7]"
              )}>
                Next: {countdown}s
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full">
              <Wifi className="w-4 h-4 text-slate-600" />
              <span className="text-[10px] font-semibold text-slate-600">Real-time</span>
            </div>
            
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors relative shadow-sm">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden">
          {currentView === 'dashboard' ? (
            <div className="p-8">
              <Dashboard 
                playbackTimestamp={playbackTimestamp}
                lastUpdateTime={lastUpdateTime}
                dataJustArrived={dataJustArrived}
                sensorStatuses={sensorStatuses}
                selectedFilter={dashboardFilter}
                onFilterChange={setDashboardFilter}
              />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Modern SCADA Smart Blower System Control Card */}
              <SmartBlowerSystem
                currentValue={tableData[0]?.value || 0}
                threshold={threshold}
                isAutoEnabled={blowerAutoSwitchEnabled}
              />

              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                  label="Current Value" 
                  value={currentVal.toFixed(2)} 
                  unit={selectedModel.unit} 
                  icon={Activity}
                  color="purple"
                  sparkline={sparklineData}
                  lastUpdated={lastUpdateTime}
                  dataArrived={dataJustArrived}
                  trendDirection={calculateTrendDirection(sparklineData)}
                  trendPercent={calculateTrendPercent(sparklineData)}
                  status={sensorStatuses[selectedModel.id]}
                />
                <KPICard 
                  label="Average (1h)" 
                  value={avgVal} 
                  unit={selectedModel.unit} 
                  icon={TrendingUp}
                  color="blue"
                  sparkline={sparklineData}
                  lastUpdated={lastUpdateTime}
                  dataArrived={dataJustArrived}
                  trendDirection={calculateTrendDirection(sparklineData)}
                  trendPercent={calculateTrendPercent(sparklineData)}
                />
                <KPICard 
                  label="Max / Min" 
                  value={`${maxVal} / ${minVal}`} 
                  unit={selectedModel.unit} 
                  icon={Gauge}
                  color="emerald"
                  sparkline={sparklineData}
                  lastUpdated={lastUpdateTime}
                  dataArrived={dataJustArrived}
                  trendDirection={calculateTrendDirection(sparklineData)}
                  trendPercent={calculateTrendPercent(sparklineData)}
                />
                <KPICard 
                  label="Data Quality" 
                  value={qualityPercent} 
                  unit="%" 
                  icon={ShieldCheck}
                  color="indigo"
                  sparkline={sparklineData}
                  lastUpdated={lastUpdateTime}
                  dataArrived={dataJustArrived}
                  trendDirection={calculateTrendDirection(sparklineData)}
                  trendPercent={calculateTrendPercent(sparklineData)}
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Chart */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="xl:col-span-2 bg-white/60 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6 flex flex-col shadow-lg"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">1h Trend Analysis</h3>
                      <p className="text-sm text-slate-500">
                        Industrial monitoring for {selectedModel.name}
                      </p>
                    </div>
                    {dataJustArrived && (
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 0.6 }}
                        className="px-2 py-1 bg-purple-100 border border-purple-300 rounded-full"
                      >
                        <span className="text-[10px] font-bold text-purple-700">✓ New Data</span>
                      </motion.div>
                    )}
                  </div>
                  <div className="flex-1 min-h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={controlledChartData} margin={{ top: 30, right: 30, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ color: '#6C5CE7', fontWeight: 600 }}
                          labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                        />
                        
                        {threshold && (
                          <>
                            <ReferenceLine y={threshold.max} stroke="#FFC107" strokeDasharray="5 5" strokeWidth={1.5}
                              label={{ value: 'Warning Max', position: 'right', fill: '#FFC107', fontSize: 10 }} />
                            <ReferenceLine y={threshold.min} stroke="#FFC107" strokeDasharray="5 5" strokeWidth={1.5}
                              label={{ value: 'Warning Min', position: 'right', fill: '#FFC107', fontSize: 10 }} />
                            {threshold.criticalMax && <ReferenceLine y={threshold.criticalMax} stroke="#FF4D4F" strokeDasharray="3 3" strokeWidth={2}
                              label={{ value: 'Critical Max', position: 'right', fill: '#FF4D4F', fontSize: 10, fontWeight: 'bold' }} />}
                            {threshold.criticalMin && <ReferenceLine y={threshold.criticalMin} stroke="#FF4D4F" strokeDasharray="3 3" strokeWidth={2}
                              label={{ value: 'Critical Min', position: 'right', fill: '#FF4D4F', fontSize: 10, fontWeight: 'bold' }} />}
                          </>
                        )}

                        <Area type="monotone" dataKey="value" stroke="#6C5CE7" strokeWidth={3}
                          fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 8, fill: '#6C5CE7', stroke: '#fff', strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>

                    {/* Control Action Annotation */}
                    {blowerAutoSwitchEnabled && blowerControlImpact !== 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 rounded-lg"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-2 h-2 bg-purple-600 rounded-full"
                        />
                        <span className="text-xs font-semibold text-purple-900">
                          {blowerControlImpact > 0 
                            ? "🔺 Control action applied — Increasing airflow"
                            : "🔻 Control action applied — Decreasing airflow"}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* AI Insights & Alerts */}
                <div className="space-y-6 flex flex-col">
                  <motion.div 
                    key={`insight-${displayedInsight?.text}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] rounded-2xl p-6 text-white shadow-lg shadow-[#6C5CE7]/30 relative overflow-hidden"
                  >
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <BrainCircuit className="w-24 h-24" />
                    </div>
                    
                    <div className="relative z-10 space-y-4">
                      {/* Header */}
                      <div className="flex items-center gap-2">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm"
                        >
                          <BrainCircuit className="w-5 h-5 text-white" />
                        </motion.div>
                        <h3 className="text-base font-bold">AI Insight</h3>
                      </div>

                      {/* Main Insight Text */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-sm text-white/95 leading-relaxed font-medium">
                          {displayedInsight?.text || "Analyzing system parameters..."}
                        </p>
                      </div>

                      {/* Detailed Metrics */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                          <p className="text-white/60 mb-1">Status</p>
                          <p className="font-bold text-green-200">Optimal</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                          <p className="text-white/60 mb-1">Trend</p>
                          <p className="font-bold text-blue-200">Stable</p>
                        </div>
                      </div>

                      {/* Confidence Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold">Confidence Level</span>
                          <span className="text-xs font-bold">{displayedInsight?.confidence}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(displayedInsight?.confidence || 0)}%` }}
                            transition={{ duration: 0.8 }}
                            className="bg-gradient-to-r from-white to-blue-200 h-full rounded-full shadow-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-slate-200/50 p-6 flex-1 flex flex-col shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-slate-800">Active Alerts</h3>
                      <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-md uppercase border border-red-100">
                        {alerts.filter(a => a.type === 'critical').length} Critical
                      </span>
                    </div>
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      <AnimatePresence mode="popLayout">
                        {alerts.map((alert, idx) => (
                          <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                              "p-3 rounded-xl border transition-all hover:shadow-sm bg-white overflow-hidden relative",
                              alert.type === 'critical' ? "border-red-100 hover:border-red-200 bg-red-50/30" :
                              alert.type === 'warning' ? "border-amber-100 hover:border-amber-200 bg-amber-50/30" :
                              "border-blue-100 hover:border-blue-200 bg-blue-50/30"
                            )}
                          >
                            {alert.type === 'critical' && (
                              <motion.div 
                                animate={{ x: [0, 2, -2, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                className="absolute left-0 top-0 w-1 h-full bg-red-500"
                              />
                            )}
                            <div className="flex items-start justify-between mb-1 pl-2">
                              <div className="flex items-center gap-2">
                                {alert.type === 'critical' ? (
                                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                    <ShieldAlert className="w-4 h-4 text-red-500" />
                                  </motion.div>
                                ) : alert.type === 'warning' ? (
                                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                                ) : (
                                  <Info className="w-4 h-4 text-blue-500" />
                                )}
                                <span className="text-sm font-bold text-slate-800">{alert.title}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">{alert.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed ml-6">{alert.description}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium SCADA Telemetry Panel */}
              <TelemetryPanel 
                data={tableData}
                searchText={tableSearch}
                onSearchChange={setTableSearch}
                dataJustArrived={dataJustArrived}
              />
            </div>
          )}
        </div>
      </main>

      {/* CSS for SCADA Animations & Glassmorphism */}
      <style>{`
        @keyframes scada-pulse-critical {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes scada-pulse-warning {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes scada-glow-critical {
          0%, 100% { box-shadow: 0 0 8px currentColor; }
          50% { box-shadow: 0 0 16px currentColor; }
        }

        .scada-blink-critical {
          animation: scada-pulse-critical 0.5s infinite;
        }
        .scada-blink-warning {
          animation: scada-pulse-warning 1s infinite;
        }
        .scada-glow-critical {
          animation: scada-glow-critical 0.5s infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
