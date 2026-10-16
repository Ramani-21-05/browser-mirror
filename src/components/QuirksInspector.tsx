import React from 'react';
import { JSQuirksTelemetry } from '../types/telemetry';
import { Binary, Globe, Calculator } from 'lucide-react';

export const QuirksInspector: React.FC<{ data: JSQuirksTelemetry }> = ({ data }) => {
  return (
    <div className="rounded-xl bg-surface-card border border-surface-border p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-surface-dark border border-surface-border text-cyber-cyan">
            <Binary className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">
              JavaScript Engine & Precision Quirks
            </h3>
            <p className="text-xs text-gray-400">
              V8 / SpiderMonkey / JSC runtime anomalies & localization
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
        
        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Identified JS Engine</span>
          <span className="text-cyber-cyan font-bold text-sm block mt-1">
            {data.jsEngine}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Timezone & Locale</span>
          <span className="text-white font-semibold text-sm block mt-1 truncate">
            {data.timezone} • {data.locale}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Trigonometric Precision Quirk</span>
          <code className="text-gray-300 block mt-1 truncate">
            tan(-1e300): {data.mathTan1e300}
          </code>
        </div>

      </div>

      {/* Intl Details */}
      <div className="p-3 rounded-lg bg-surface-dark/40 border border-surface-border flex items-center justify-between text-xs font-mono text-gray-400">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-cyber-cyan" />
          <span>Resolved Calendar: <strong className="text-white">{data.calendar}</strong></span>
        </div>
        <div>
          <span>Intl Number Token: <strong className="text-white">{data.numberFormatQuirk}</strong></span>
        </div>
      </div>

    </div>
  );
};
