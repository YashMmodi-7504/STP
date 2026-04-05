import { 
  Droplets, Wind, Zap, FlaskConical, Activity, AlertTriangle, 
  Thermometer, Microscope, Waves, Gauge, Settings, Database, 
  Wrench, ShieldCheck, Flame, TrendingUp, RefreshCw, Layers, 
  Cpu, Binary, Factory, Box, CircleDashed
} from 'lucide-react';

export interface SensorModel {
  id: string;
  name: string;
  icon: any;
  description: string;
  unit: string;
  baseValue: number;
}

export interface SensorThreshold {
  sensorId: string;
  min: number;
  max: number;
  criticalMin?: number;
  criticalMax?: number;
}

export interface AnomalyRecord {
  sensorId: string;
  sensorName: string;
  value: number;
  threshold: SensorThreshold;
  status: 'CRITICAL' | 'WARNING' | 'NORMAL';
  deviation: number; // percentage from threshold
}

export interface StatusIndicator {
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  blinkRate: number; // ms (0 for no blink, 1000 for 1sec blink, 500 for 0.5sec)
  color: string;
}

export const SENSOR_MODELS: SensorModel[] = [
  { id: 'do-opt', name: 'DO Optimization', icon: Droplets, description: 'Optimizes Dissolved Oxygen levels.', unit: 'mg/L', baseValue: 2.5 },
  { id: 'aeration-demand', name: 'Aeration Demand', icon: Wind, description: 'Predicts future aeration requirements.', unit: 'Nm³/h', baseValue: 1200 },
  { id: 'energy-opt', name: 'Energy Optimization', icon: Zap, description: 'Analyzes power consumption patterns.', unit: 'kW', baseValue: 450 },
  { id: 'chemical-dosing', name: 'Chemical Dosing', icon: FlaskConical, description: 'Precise control of coagulants.', unit: 'L/h', baseValue: 15 },
  { id: 'effluent-pred', name: 'Effluent Prediction', icon: Activity, description: 'Forecasting of final water quality.', unit: 'NTU', baseValue: 4.2 },
  { id: 'shock-load', name: 'Shock Load Detection', icon: AlertTriangle, description: 'Early warning for industrial discharge.', unit: 'Index', baseValue: 0.8 },
  { id: 'nitrification', name: 'Nitrification', icon: Microscope, description: 'Monitors ammonia to nitrate conversion.', unit: 'mg/L', baseValue: 12.4 },
  { id: 'denitrification', name: 'Denitrification', icon: Waves, description: 'Ensures efficient nitrogen removal.', unit: 'mg/L', baseValue: 3.1 },
  { id: 'biofilm-health', name: 'Biofilm Health', icon: Layers, description: 'Assesses structural integrity of fixed-film.', unit: 'μm', baseValue: 250 },
  { id: 'biofilm-stress', name: 'Biofilm Stress', icon: ShieldCheck, description: 'Detects environmental stressors.', unit: 'Pa', baseValue: 1.2 },
  { id: 'temp-adaptation', name: 'Temperature Adaptation', icon: Thermometer, description: 'Adjusts parameters for seasonal temp.', unit: '°C', baseValue: 18.5 },
  { id: 'mlss-pred', name: 'MLSS Prediction', icon: TrendingUp, description: 'Forecasts Mixed Liquor Suspended Solids.', unit: 'mg/L', baseValue: 3200 },
  { id: 'mlss-srt-coupling', name: 'MLSS-SRT Coupling', icon: RefreshCw, description: 'Maintains biomass and SRT balance.', unit: 'Ratio', baseValue: 0.95 },
  { id: 'seasonal-srt', name: 'Seasonal SRT', icon: Gauge, description: 'Dynamic SRT adjustment based on climate.', unit: 'Days', baseValue: 12 },
  { id: 'sludge-bulking', name: 'Sludge Bulking', icon: AlertTriangle, description: 'Predicts sludge settling issues.', unit: 'SVI', baseValue: 110 },
  { id: 'scl-virtual', name: 'SCL Virtual Sensor', icon: Binary, description: 'Machine learning parameter estimation.', unit: '%', baseValue: 98 },
  { id: 'digester-opt', name: 'Digester Optimization', icon: Flame, description: 'Maximizes volatile solids reduction.', unit: 'm³/d', baseValue: 850 },
  { id: 'biogas-pred', name: 'Biogas Prediction', icon: Database, description: 'Forecasts energy generation potential.', unit: 'm³/h', baseValue: 125 },
  { id: 'predictive-maint', name: 'Predictive Maintenance', icon: Wrench, description: 'Identifies potential equipment failures.', unit: 'Prob %', baseValue: 12 },
  { id: 'chlorine-opt', name: 'Chlorine Optimization', icon: Settings, description: 'Balances pathogen removal with by-products.', unit: 'mg/L', baseValue: 1.5 },
];

// THRESHOLD CONFIGURATION FOR INDUSTRIAL ANOMALY DETECTION
export const SENSOR_THRESHOLDS: { [key: string]: SensorThreshold } = {
  'do-opt': { sensorId: 'do-opt', min: 2.0, max: 3.5, criticalMin: 1.5, criticalMax: 4.0 },
  'aeration-demand': { sensorId: 'aeration-demand', min: 1000, max: 1500, criticalMin: 800, criticalMax: 1800 },
  'energy-opt': { sensorId: 'energy-opt', min: 400, max: 550, criticalMin: 300, criticalMax: 650 },
  'chemical-dosing': { sensorId: 'chemical-dosing', min: 10, max: 20, criticalMin: 8, criticalMax: 25 },
  'effluent-pred': { sensorId: 'effluent-pred', min: 2, max: 6, criticalMin: 1, criticalMax: 8 },
  'shock-load': { sensorId: 'shock-load', min: 0.2, max: 1.5, criticalMin: 0, criticalMax: 2.5 },
  'nitrification': { sensorId: 'nitrification', min: 10, max: 15, criticalMin: 8, criticalMax: 18 },
  'denitrification': { sensorId: 'denitrification', min: 2, max: 4, criticalMin: 1, criticalMax: 5 },
  'biofilm-health': { sensorId: 'biofilm-health', min: 200, max: 300, criticalMin: 150, criticalMax: 350 },
  'biofilm-stress': { sensorId: 'biofilm-stress', min: 0.5, max: 2.0, criticalMin: 0, criticalMax: 3 },
  'temp-adaptation': { sensorId: 'temp-adaptation', min: 15, max: 25, criticalMin: 10, criticalMax: 30 },
  'mlss-pred': { sensorId: 'mlss-pred', min: 2500, max: 3500, criticalMin: 2000, criticalMax: 4000 },
  'mlss-srt-coupling': { sensorId: 'mlss-srt-coupling', min: 0.8, max: 1.2, criticalMin: 0.6, criticalMax: 1.5 },
  'seasonal-srt': { sensorId: 'seasonal-srt', min: 10, max: 15, criticalMin: 8, criticalMax: 18 },
  'sludge-bulking': { sensorId: 'sludge-bulking', min: 80, max: 130, criticalMin: 60, criticalMax: 150 },
  'scl-virtual': { sensorId: 'scl-virtual', min: 90, max: 100, criticalMin: 85, criticalMax: 105 },
  'digester-opt': { sensorId: 'digester-opt', min: 700, max: 1000, criticalMin: 600, criticalMax: 1200 },
  'biogas-pred': { sensorId: 'biogas-pred', min: 100, max: 150, criticalMin: 80, criticalMax: 180 },
  'predictive-maint': { sensorId: 'predictive-maint', min: 5, max: 20, criticalMin: 0, criticalMax: 30 },
  'chlorine-opt': { sensorId: 'chlorine-opt', min: 0.8, max: 2.0, criticalMin: 0.5, criticalMax: 2.5 },
};

export const getStatusIndicator = (value: number, threshold: SensorThreshold): StatusIndicator => {
  if (value < threshold.criticalMin! || value > threshold.criticalMax!) {
    return { status: 'CRITICAL', blinkRate: 500, color: '#FF4D4F' };
  }
  if (value < threshold.min || value > threshold.max) {
    return { status: 'WARNING', blinkRate: 1000, color: '#FFC107' };
  }
  return { status: 'NORMAL', blinkRate: 0, color: '#00C853' };
};

export const detectAnomalies = (tableData: TelemetryRow[], modelId: string): AnomalyRecord[] => {
  const threshold = SENSOR_THRESHOLDS[modelId];
  if (!threshold) return [];
  
  return tableData
    .filter(row => row.value !== undefined && row.value !== null)
    .map(row => {
      const status = getStatusIndicator(row.value, threshold);
      const avg = (threshold.min + threshold.max) / 2;
      const deviation = ((row.value - avg) / avg) * 100;
      
      return {
        sensorId: modelId,
        sensorName: row.sensor_name,
        value: row.value,
        threshold,
        status: status.status,
        deviation: Math.abs(deviation),
      };
    })
    .filter(record => record.status !== 'NORMAL');
};

export interface TelemetryRow {
  id: string;
  event_date: string; // DD/MM/YYYY
  event_time: string;
  ingestion_time: string;
  sensor_name: string;
  plant_section: string;
  section_icon: any;
  value: number;
  unit: string;
  quality_flag: 'GOOD' | 'BAD' | 'ESTIMATED';
  status_flag: 'NORMAL' | 'WARNING' | 'CRITICAL';
  delay_seconds: number;
}

const PLANT_SECTIONS = [
  { name: 'Primary Clarifier', icon: CircleDashed },
  { name: 'Aeration Basin A', icon: Waves },
  { name: 'Aeration Basin B', icon: Waves },
  { name: 'Secondary Clarifier', icon: CircleDashed },
  { name: 'Anaerobic Digester', icon: Factory },
  { name: 'Effluent Discharge', icon: Droplets },
  { name: 'Chemical Storage', icon: Box },
];

export const generateTableData = (model: SensorModel, timestamp?: Date): TelemetryRow[] => {
  const data: TelemetryRow[] = [];
  const baseTime = timestamp || new Date();
  const threshold = SENSOR_THRESHOLDS[model.id];
  
  for (let i = 0; i < 15; i++) {
    // Snap to minute boundaries
    const eventTime = new Date(baseTime.getTime() - i * 60000);
    eventTime.setSeconds(0, 0);
    
    const delay = Math.floor(Math.random() * 100); // 0 to 100 seconds
    const ingestionTime = new Date(eventTime.getTime() + delay * 1000);
    
    const section = PLANT_SECTIONS[Math.floor(Math.random() * PLANT_SECTIONS.length)];
    
    // Generate value with occasional anomalies for demo (20% chance of anomaly)
    let val: number;
    const randVal = Math.random();
    if (randVal < 0.15 && threshold?.criticalMax) {
      // Critical anomaly
      val = threshold.criticalMax + Math.random() * (threshold.criticalMax * 0.2);
    } else if (randVal < 0.3 && threshold?.max) {
      // Warning anomaly
      val = threshold.max + Math.random() * (threshold.max * 0.1);
    } else {
      // Normal value
      const avg = (threshold?.min! + threshold?.max!) / 2;
      const variance = (Math.random() - 0.5) * (threshold?.max! - threshold?.min!);
      val = avg + variance;
    }
    val = Number(val.toFixed(2));

    // Determine status based on thresholds
    let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
    if (threshold) {
      if (val < threshold.criticalMin! || val > threshold.criticalMax!) {
        status = 'CRITICAL';
      } else if (val < threshold.min || val > threshold.max) {
        status = 'WARNING';
      }
    }

    let quality: 'GOOD' | 'BAD' | 'ESTIMATED' = 'GOOD';
    const qRand = Math.random();
    if (qRand > 0.85) quality = 'ESTIMATED';
    if (qRand > 0.95) quality = 'BAD';

    // Format date as DD/MM/YYYY
    const day = String(eventTime.getDate()).padStart(2, '0');
    const month = String(eventTime.getMonth() + 1).padStart(2, '0');
    const year = eventTime.getFullYear();
    const eventDate = `${day}/${month}/${year}`;

    data.push({
      id: `evt-${i}-${eventTime.getTime()}`,
      event_date: eventDate,
      event_time: eventTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }),
      ingestion_time: ingestionTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sensor_name: `${model.id.toUpperCase()}_SENS_${Math.floor(Math.random() * 9) + 1}`,
      plant_section: section.name,
      section_icon: section.icon,
      value: val,
      unit: model.unit,
      quality_flag: quality,
      status_flag: status,
      delay_seconds: delay,
    });
  }
  return data;
};

export const generateChartData = (model: SensorModel, timestamp?: Date) => {
  const data = [];
  const baseTime = timestamp || new Date();
  baseTime.setSeconds(0, 0); // Snap to minute
  const threshold = SENSOR_THRESHOLDS[model.id];
  
  // Generate 60 minutes of data (1 hour lookback)
  for (let i = 59; i >= 0; i--) {
    const time = new Date(baseTime.getTime() - i * 60 * 1000);
    
    // Generate value with occasional anomalies
    let value: number;
    const randVal = Math.random();
    if (randVal < 0.1 && threshold?.criticalMax) {
      // 10% chance of critical
      value = threshold.criticalMax + Math.random() * (threshold.criticalMax * 0.15);
    } else if (randVal < 0.2 && threshold?.max) {
      // 10% chance of warning
      value = threshold.max + Math.random() * (threshold.max * 0.08);
    } else {
      // Normal value within range
      const avg = (threshold?.min || model.baseValue - 1) + (threshold?.max || model.baseValue + 1) / 2;
      const variance = (Math.random() - 0.5) * ((threshold?.max || model.baseValue + 1) - (threshold?.min || model.baseValue - 1));
      value = avg + variance;
    }
    value = Number(value.toFixed(2));
    
    data.push({
      time: time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }),
      value,
      isCritical: threshold && (value < threshold.criticalMin! || value > threshold.criticalMax!),
      isWarning: threshold && !((value < threshold.criticalMin! || value > threshold.criticalMax!) || (value < threshold.min || value > threshold.max)),
    });
  }
  return data;
};

export interface SparklineDataPoint {
  value: number;
  time: string;
}

export interface AIInsightData {
  text: string;
  confidence: number;
}

export interface AlertData {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  sensor?: string;
}

// Generate sparkline data (last 10 minutes)
export const generateSparklineData = (model: SensorModel, timestamp?: Date): number[] => {
  const data: number[] = [];
  const baseTime = timestamp || new Date();
  
  // Generate smooth data with moving average (no sharp spikes)
  const rawData: number[] = [];
  for (let i = 0; i < 10; i++) {
    const variance = (Math.random() - 0.5) * (model.baseValue * 0.15); // Reduced variance
    rawData.push(model.baseValue + variance);
  }
  
  // Apply moving average smoothing (3-point)
  for (let i = 0; i < rawData.length; i++) {
    if (i === 0) {
      data.push(Number((rawData[i]).toFixed(2)));
    } else if (i === rawData.length - 1) {
      data.push(Number((rawData[i]).toFixed(2)));
    } else {
      const smoothed = (rawData[i - 1] + rawData[i] + rawData[i + 1]) / 3;
      data.push(Number((smoothed).toFixed(2)));
    }
  }
  
  return data;
};

// Calculate trend direction (up/down/stable)
export const calculateTrendDirection = (data: number[]): 'up' | 'down' | 'stable' => {
  if (data.length < 2) return 'stable';
  
  const first = data[0];
  const last = data[data.length - 1];
  const diff = last - first;
  const threshold = Math.abs(first) * 0.02; // 2% threshold for stable
  
  if (Math.abs(diff) < threshold) return 'stable';
  return diff > 0 ? 'up' : 'down';
};

// Calculate average trend percentage
export const calculateTrendPercent = (data: number[]): number => {
  if (data.length < 2) return 0;
  
  const first = data[0];
  const last = data[data.length - 1];
  const percent = ((last - first) / first) * 100;
  
  return Number(Math.abs(percent).toFixed(1));
};

export const generateAIInsight = (model: SensorModel, timestamp?: Date): AIInsightData => {
  const insights = [
    {
      text: `${model.name} levels are stable within optimal range for the last 15 minutes. No intervention needed.`,
      confidence: 94
    },
    {
      text: `Minor fluctuation detected in ${model.name} due to airflow variation. System self-adjusting. Status: Normal.`,
      confidence: 87
    },
    {
      text: `AI models predict a 15% efficiency gain if ${model.name} setpoints are optimized during off-peak hours.`,
      confidence: 92
    },
    {
      text: `Slight upward trend in ${model.name}. Continue monitoring. Risk assessment: Low (2%).`,
      confidence: 89
    },
    {
      text: `System is operating at peak efficiency. ${model.name} parameters are optimal. Energy usage minimized.`,
      confidence: 96
    }
  ];
  return insights[Math.floor(Math.random() * insights.length)];
};

// Generate anomaly-aware insights based on detected anomalies
export const generateAnomalyAwareInsight = (anomalies: AnomalyRecord[]): AIInsightData => {
  if (anomalies.length === 0) {
    return {
      text: '✓ All sensors within normal parameters. System stable.',
      confidence: 98
    };
  }

  const criticalAnomalies = anomalies.filter(a => a.status === 'CRITICAL');
  const warningAnomalies = anomalies.filter(a => a.status === 'WARNING');

  let text = '';
  let confidence = 90;

  if (criticalAnomalies.length > 0) {
    const sensor = criticalAnomalies[0];
    const direction = sensor.value > (sensor.threshold.max + sensor.threshold.min) / 2 ? 'exceeded' : 'dropped below';
    text = `⚠ CRITICAL: ${sensor.sensorName} has ${direction} safe threshold. Deviation: ${sensor.deviation.toFixed(1)}%. Auto-switching to monitor this anomaly.`;
    confidence = 96;
  } else if (warningAnomalies.length > 0) {
    const sensor = warningAnomalies[0];
    const count = warningAnomalies.length > 1 ? ` (+${warningAnomalies.length - 1} more)` : '';
    text = `⚠ WARNING: ${sensor.sensorName} approaching threshold limits${count}. Deviation: ${sensor.deviation.toFixed(1)}%. Monitoring closely.`;
    confidence = 92;
  }

  if (anomalies.length > 1) {
    text += ` [${anomalies.length} total anomalies detected]`;
  }

  return { text, confidence };
};

export const generateAlerts = (model: SensorModel): AlertData[] => {
  const alertTemplates: AlertData[] = [
    {
      id: 'alert-1',
      type: 'critical',
      title: 'Sensor Calibration Needed',
      description: `${model.name} sensor showing high variance. Recalibration recommended.`,
      time: '10m ago',
      sensor: model.name
    },
    {
      id: 'alert-2',
      type: 'warning',
      title: 'Data Latency Spike',
      description: 'Ingestion delayed by >60s in Sector B.',
      time: '1h ago',
      sensor: model.name
    },
    {
      id: 'alert-3',
      type: 'info',
      title: 'Maintenance Scheduled',
      description: 'Routine calibration maintenance in 4 hours.',
      time: '3h ago'
    }
  ];
  
  return alertTemplates.map(alert => ({
    ...alert,
    id: `${alert.id}-${Date.now()}`
  }));
};

// ==================== TIME FORMATTING UTILITIES ====================
export const formatTo12Hour = (timeStr: string): string => {
  // Input: "HH:MM" or "HH:MM:SS"
  const parts = timeStr.split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const seconds = parts[2];
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  
  const hoursStr = String(hours).padStart(2, '0');
  
  if (seconds) {
    return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
  }
  return `${hoursStr}:${minutes} ${ampm}`;
};

export const getDisplayTime12Hour = (): string => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

// Convert 24-hour time string to 12-hour format (e.g., "13:45:32" → "1:45:32 PM")
export const convertTo12Hour = (time24: string): string => {
  try {
    const [hourStr, ...rest] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${rest.join(':')} ${suffix}`;
  } catch {
    return time24;
  }
};
