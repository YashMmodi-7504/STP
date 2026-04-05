# Real-Time Playback/Simulation Feature

## Overview
A real-time playback and simulation system that allows you to replay data streams with automatic timestamp progression, simulating a live data streaming scenario starting from a defined timestamp.

## Features

### ✨ Core Functionality
- **Start Timestamp**: Begins at `2025-09-01 00:00:00` (customizable)
- **Automatic Progression**: Moves forward 1 minute every 1 second (real-time simulation)
- **Dynamic Data Updates**: Dashboard data refreshes at each timestamp
- **Controls**: Play, Pause, and Reset buttons for control

### 🎮 User Controls
Located in the header:
- **▶ Start Playback**: Initiates the simulation
- **⏸ Pause**: Pauses the simulation at current timestamp
- **⏹ Reset**: Stops and resets to start timestamp (2025-09-01 00:00:00)

### 📊 What Updates During Playback
1. **Timestamp Display**: Blue badge shows current simulation time (HH:MM:SS format)
2. **Table Data**: Telemetry stream updates with data relative to current timestamp
3. **Chart Data**: 24-hour trend analysis updates based on current timestamp
4. **KPI Cards**: Values recalculate based on current data
5. **Status Badge**: Shows "Playback Active" when running

## How It Works

### Architecture
```
State: playbackTimestamp
├── Timer (useEffect)
│   └── Increments timestamp by 1 minute every 1 second
├── Memoized Data Generation
│   ├── generateTableData(model, timestamp)
│   ├── generateChartData(model, timestamp)
│   └── Data relative to provided timestamp
└── UI Re-renders with new data
```

### Data Generation Timeline
- **Current Approach**: Mock data generation based on timestamp
- **Ready for Supabase Integration**: Pass `playbackTimestamp` to Supabase queries
  ```typescript
  // Example: Query data for current timestamp
  const { data } = await supabase
    .from('telemetry')
    .select('*')
    .eq('timestamp', playbackTimestamp)
    .limit(15);
  ```

## Implementation Details

### Modified Files

#### 1. **App.tsx**
- Added playback state management:
  ```typescript
  const [isPlaybackActive, setIsPlaybackActive] = useState(false);
  const [playbackTimestamp, setPlaybackTimestamp] = useState(new Date('2025-09-01T00:00:00'));
  ```
- Added timer effect that runs when playback is active
- Updated header with playback controls and timestamp display
- Passed `playbackTimestamp` to data generation functions

#### 2. **constants.ts**
- Modified `generateTableData()` to accept optional `timestamp` parameter
- Modified `generateChartData()` to accept optional `timestamp` parameter
- Data is now generated relative to the provided timestamp

### Timer Configuration
```typescript
// Increments by 1 minute every 1 second
useEffect(() => {
  if (!isPlaybackActive) return;
  
  const interval = setInterval(() => {
    setPlaybackTimestamp(prev => new Date(prev.getTime() + 60000));
  }, 1000);
  
  return () => clearInterval(interval);
}, [isPlaybackActive]);
```

## Usage Guide

### Starting Playback
1. Click the **"▶ Start Playback"** button in the header
2. Timestamp badge appears in blue showing: `2025-09-01 00:00:00`
3. Dashboard data updates automatically every second
4. Each update shows data for +1 minute from previous

### Controlling Playback
- **Pause**: Click **"⏸ Pause"** to freeze at current timestamp
- **Continue**: The button reverts to **"▶ Start Playback"** - click to resume
- **Reset**: Click **"⏹ Reset"** to stop and return to `2025-09-01 00:00:00`

### Monitoring Progress
- Watch the blue timestamp badge in the header
- Check telemetry table for event times matching simulation time
- Observe chart and KPI values changing dynamically

## Integration with Supabase (Future)

To connect with real Supabase data:

```typescript
// Modify generateTableData in constants.ts
export const generateTableData = async (model: SensorModel, timestamp: Date) => {
  const { data, error } = await supabase
    .from('telemetry')
    .select('*')
    .eq('timestamp', timestamp)
    .eq('sensor_id', model.id)
    .limit(15);
  
  return data || [];
};
```

## Current Simulation Speed
- **Real Time**: 1000ms (1 second) = 60 seconds (1 minute) in simulation
- **Speed Ratio**: 60x real-time
- **Reason**: Allows rapid testing without waiting real-time duration

### Adjusting Speed
To change simulation speed, modify the interval in App.tsx:
```typescript
// Current: 60000ms (1 minute) every 1000ms (1 second)
setPlaybackTimestamp(prev => new Date(prev.getTime() + 60000));

// For real-time (1:1 ratio), change interval to 60000ms:
const interval = setInterval(() => {
  setPlaybackTimestamp(prev => new Date(prev.getTime() + 60000));
}, 60000); // 60 seconds instead of 1 second
```

## Troubleshooting

### Timestamp Not Updating
- Ensure playback is active (button shows "⏸ Pause")
- Check browser console for errors
- Verify `useEffect` is running (dependencies: `[isPlaybackActive]`)

### Data Not Changing
- Confirm `playbackTimestamp` is being passed to data generation functions
- Check that `useMemo` dependencies include `playbackTimestamp`
- Clear browser cache if needed

### Performance Issues
- Reduce the frequency of updates by increasing interval duration
- Consider debouncing the UI updates
- Optimize data generation functions

## Future Enhancements
- [ ] Speed control slider (0.5x, 1x, 2x, 10x)
- [ ] Date/time picker to jump to specific timestamps
- [ ] Pause duration display (elapsed time)
- [ ] Data export functionality during playback
- [ ] Supabase integration for real data
- [ ] Playback history/logs
- [ ] Multiple speed profiles
