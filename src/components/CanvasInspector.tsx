import React from 'react';
import { CanvasTelemetry } from '../types/telemetry';
import { Brush, Sparkles } from 'lucide-react';

export const CanvasInspector: React.FC<{ data: CanvasTelemetry }> = ({ data }) => {
  return (
    <div className="rounded-xl bg-surface-card border border-surface-border p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-surface-dark border border-surface-border text-cyber-cyan">
            <Brush className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">
              Canvas 2D Geometric & Text Entropy
            </h3>
            <p className="text-xs text-gray-400">
              Sub-pixel rasterizer & emoji antialiasing discrepancies
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
          <span className="text-gray-400 block text-[11px]">2D Canvas SHA-256 Hash</span>
          <code className="text-cyber-cyan block mt-1 truncate select-all font-bold">
            {data.canvas2dHash}
          </code>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Sub-Pixel Text Metrics</span>
          <span className="text-white font-semibold text-sm block mt-1">
            W: <strong className="text-cyber-cyan">{data.subpixelWidth}px</strong> • H: <strong className="text-white">{data.subpixelHeight}px</strong>
          </span>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Winding Rule Test (EvenOdd)</span>
          <span className="text-gray-300 block mt-1">
            {data.windingRuleSupported ? '✅ Standard Non-Zero & Even-Odd Supported' : '❌ Restricted Winding Path'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Radial Gradient Pixel Quirk</span>
          <span className="text-gray-300 block mt-1 truncate">
            {data.colorInterpolationQuirk}
          </span>
        </div>

      </div>

      {/* Explanation Banner */}
      <div className="p-3 rounded-lg bg-surface-dark/40 border border-surface-border flex items-center gap-3 text-xs font-mono text-gray-400">
        <Sparkles className="w-4 h-4 text-cyber-cyan shrink-0" />
        <span>
          Every OS font engine (Windows DirectWrite, macOS CoreText, Linux FreeType) renders fonts with fractional pixel variations, uniquely identifying your operating system without permission.
        </span>
      </div>

    </div>
  );
};
