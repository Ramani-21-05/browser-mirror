import React from 'react';
import { Activity, Cpu, ShieldCheck } from 'lucide-react';

interface ScanProgressProps {
  progress: number;
  statusText: string;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({ progress, statusText }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-xl bg-surface-card border border-surface-border shadow-2xl relative overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f2430_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <span className="font-mono text-sm uppercase tracking-wider text-white font-semibold">
              Deep Telemetry Probing...
            </span>
          </div>
          <span className="font-mono text-sm text-cyber-cyan font-bold">
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-surface-dark border border-surface-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-green to-cyber-cyan transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(0,240,255,0.8)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Status Line */}
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyber-cyan animate-ping"></span>
            <span className="text-gray-300">{statusText}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Cpu className="w-3.5 h-3.5" />
            <span>Zero-Permission Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};
