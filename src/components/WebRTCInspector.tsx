import React from 'react';
import { WebRTCTelemetry } from '../types/telemetry';
import { Network, ShieldAlert, ShieldCheck, Globe, Wifi } from 'lucide-react';

export const WebRTCInspector: React.FC<{ data: WebRTCTelemetry }> = ({ data }) => {
  return (
    <div className="rounded-xl bg-surface-card border border-surface-border p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-surface-dark border border-surface-border text-cyber-cyan">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">
              WebRTC & Regional Edge Latency
            </h3>
            <p className="text-xs text-gray-400">
              ICE candidate leaks & global edge ping times
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

      {/* Local IP Leak Alert */}
      <div className={`p-3.5 rounded-lg border text-xs font-mono flex items-start gap-3 ${
        data.localIps.length > 0 && !data.hasMdnsMasking 
          ? 'bg-cyber-crimson/10 border-cyber-crimson/30 text-cyber-crimson'
          : 'bg-surface-dark/70 border-surface-border text-gray-300'
      }`}>
        {data.localIps.length > 0 && !data.hasMdnsMasking ? (
          <ShieldAlert className="w-5 h-5 shrink-0 text-cyber-crimson" />
        ) : (
          <ShieldCheck className="w-5 h-5 shrink-0 text-cyber-green" />
        )}
        <div className="flex-1">
          <span className="font-bold block">
            {data.localIps.length > 0 && !data.hasMdnsMasking 
              ? 'VULNERABILITY: Local Subnet IP Leaked via WebRTC ICE' 
              : 'WebRTC Local IP Shield: mDNS Masking Active'}
          </span>
          <p className="mt-1 text-gray-400">
            {data.localIps.length > 0 
              ? `Detected candidates: ${data.localIps.join(', ')}`
              : 'No unmasked local intranet IP addresses exposed to JavaScript.'}
          </p>
        </div>
      </div>

      {/* Regional Edge Latency Grid */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
          <span>Global Edge Latency Probes (RTT)</span>
          <span>5 Regions Tested</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {data.edgePings.map((ping, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-surface-dark border border-surface-border flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{ping.flag}</span>
                <span className="text-[10px] font-mono text-gray-500 uppercase">{ping.region.split('-')[0]}</span>
              </div>
              
              <div className="mt-2">
                <span className="text-xs font-mono font-medium text-gray-200 block truncate">
                  {ping.city}
                </span>
                <span className="text-xs font-mono font-bold mt-0.5 block text-cyber-cyan">
                  {ping.latencyMs !== null ? `${ping.latencyMs} ms` : 'Testing...'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
