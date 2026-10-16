import React, { useState } from 'react';
import { FontTelemetry } from '../types/telemetry';
import { Type, Search } from 'lucide-react';

export const FontInspector: React.FC<{ data: FontTelemetry }> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFonts = data.installedFonts.filter((f) =>
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-xl bg-surface-card border border-surface-border p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-surface-dark border border-surface-border text-cyber-cyan">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">
              Sub-Pixel System Font Enumeration
            </h3>
            <p className="text-xs text-gray-400">
              Installed OS typography & software profile detection
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

      {/* Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="text-gray-300">
          Detected <strong className="text-white">{data.installedFonts.length}</strong> installed fonts out of{' '}
          <strong className="text-gray-400">{data.totalTested}</strong> tested system families.
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search fonts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1 rounded-lg bg-surface-dark border border-surface-border text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/40"
          />
        </div>
      </div>

      {/* Fonts Badges Grid */}
      <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border max-h-40 overflow-y-auto">
        <div className="flex flex-wrap gap-1.5">
          {filteredFonts.length > 0 ? (
            filteredFonts.map((font, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded text-xs font-mono bg-surface-card border border-surface-border text-cyber-cyan font-medium"
              >
                {font}
              </span>
            ))
          ) : (
            <span className="text-xs font-mono text-gray-500 py-1">
              No matching fonts detected.
            </span>
          )}
        </div>
      </div>

      {/* Font Hash */}
      <div className="flex items-center justify-between text-xs font-mono text-gray-400">
        <span>Font Profile SHA-256:</span>
        <code className="text-gray-300 truncate max-w-xs select-all">
          {data.fontHash}
        </code>
      </div>

    </div>
  );
};
