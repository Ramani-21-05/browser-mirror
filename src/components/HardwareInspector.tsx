import React from 'react';
import { HardwareTelemetry } from '../types/telemetry';
import { HardDrive, Monitor, BatteryCharging, Battery, Zap, Gauge } from 'lucide-react';

export const HardwareInspector: React.FC<{ data: HardwareTelemetry }> = ({ data }) => {
  return (
    <div className="rounded-xl bg-surface-card border border-surface-border p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-surface-dark border border-surface-border text-cyber-cyan">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">
              Hardware Architecture & Display Telemetry
            </h3>
            <p className="text-xs text-gray-400">
              CPU cores, memory tier, refresh rate & battery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2 py-0.5 rounded bg-surface-dark border border-surface-border text-cyber-cyan">
            {data.entropyBits} bits
          </span>
          <span className={`px-2 py-0.5 rounded font-bold ${data.riskLevel === 'HIGH' ? 'bg-cyber-crimson/10 text-cyber-crimson border border-cyber-crimson/30' : 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30'}`}>
            {data.riskLevel}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs font-mono">
        
        {/* CPU Cores */}
        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Logical CPU Cores</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-white font-bold text-lg">{data.cpuCores}</span>
            <span className="text-gray-400 text-xs">Threads</span>
          </div>
        </div>

        {/* RAM Tier */}
        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">RAM Memory Tier</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-white font-bold text-lg">{data.deviceMemoryGb}</span>
            <span className="text-gray-400 text-xs">GB</span>
          </div>
        </div>

        {/* Refresh Rate */}
        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Measured Refresh Rate</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-cyber-cyan font-bold text-lg">{data.refreshRateHz}</span>
            <span className="text-gray-400 text-xs">Hz (rAF)</span>
          </div>
        </div>

        {/* Pixel Density */}
        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Device Pixel Ratio</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-white font-bold text-lg">{data.pixelRatio}x</span>
            <span className="text-gray-400 text-xs">DPI</span>
          </div>
        </div>

      </div>

      {/* Display & Battery Sub-Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        
        <div className="p-3 rounded-lg bg-surface-dark/40 border border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-cyber-cyan" />
            <span className="text-gray-300">Display Profile:</span>
          </div>
          <span className="text-white font-semibold">
            {data.screenResolution} • {data.colorGamut}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/40 border border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            {data.battery?.charging ? (
              <BatteryCharging className="w-4 h-4 text-cyber-green animate-pulse" />
            ) : (
              <Battery className="w-4 h-4 text-cyber-cyan" />
            )}
            <span className="text-gray-300">Battery Telemetry:</span>
          </div>
          <span className="text-white font-semibold">
            {data.battery ? `${data.battery.level}% (${data.battery.charging ? 'Charging' : 'Discharging'})` : 'Restricted by Browser'}
          </span>
        </div>

      </div>

    </div>
  );
};
