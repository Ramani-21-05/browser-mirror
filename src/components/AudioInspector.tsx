import React from 'react';
import { AudioTelemetry } from '../types/telemetry';
import { Volume2, Activity, Disc } from 'lucide-react';

export const AudioInspector: React.FC<{ data: AudioTelemetry }> = ({ data }) => {
  return (
    <div className="rounded-xl bg-surface-card border border-surface-border p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-surface-dark border border-surface-border text-cyber-cyan">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">
              AudioContext Acoustic Fingerprint
            </h3>
            <p className="text-xs text-gray-400">
              DSP oscillator & compressor floating-point quirks
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
        
        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Oscillator Buffer SHA-256</span>
          <code className="text-cyber-cyan block mt-1 truncate select-all font-bold">
            {data.oscillatorHash}
          </code>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Raw Sample Float Sum</span>
          <span className="text-white font-semibold text-sm block mt-1">
            {data.rawSampleSum}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Sample Rate & Channels</span>
          <span className="text-gray-300 block mt-1">
            <strong className="text-white">{data.sampleRate} Hz</strong> • {data.maxChannelCount} Channel(s)
          </span>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Audio Stack Vector</span>
          <span className="text-gray-300 block mt-1">
            Hardware DAC / Driver Floating Point Filter
          </span>
        </div>

      </div>

      {/* Waveform graphic visualization */}
      <div className="p-3 rounded-lg bg-surface-dark/40 border border-surface-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
          <span className="text-xs font-mono text-gray-400">
            Acoustic Dynamics Compressor Curve:
          </span>
        </div>
        
        <div className="flex items-center gap-1 h-6">
          {[40, 65, 80, 50, 95, 30, 85, 60, 45, 90, 70, 35, 75, 55].map((val, idx) => (
            <div
              key={idx}
              className="w-1 bg-cyber-cyan/70 rounded-full transition-all"
              style={{ height: `${val}%` }}
            ></div>
          ))}
        </div>
      </div>

    </div>
  );
};
