import React, { useState } from 'react';
import { WebGLTelemetry } from '../types/telemetry';
import { Eye, ChevronDown, ChevronUp, Cpu, Layers } from 'lucide-react';

export const WebGLInspector: React.FC<{ data: WebGLTelemetry }> = ({ data }) => {
  const [showExtensions, setShowExtensions] = useState(false);

  return (
    <div className="rounded-xl bg-surface-card border border-surface-border p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-surface-dark border border-surface-border text-cyber-cyan">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">
              WebGL & GPU Hardware Unmasking
            </h3>
            <p className="text-xs text-gray-400">
              Low-level graphics pipeline telemetry
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
          <span className="text-gray-400 block text-[11px]">Unmasked GPU Renderer</span>
          <span className="text-cyber-cyan font-bold text-sm block mt-1 break-words">
            {data.renderer}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Unmasked Hardware Vendor</span>
          <span className="text-white font-semibold text-sm block mt-1 break-words">
            {data.vendor}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Shader Rasterization Hash</span>
          <code className="text-gray-300 block mt-1 truncate select-all">
            {data.shaderRenderHash}
          </code>
        </div>

        <div className="p-3 rounded-lg bg-surface-dark/60 border border-surface-border">
          <span className="text-gray-400 block text-[11px]">Hardware Buffer Ceilings</span>
          <span className="text-gray-300 block mt-1">
            Max Texture: <strong className="text-white">{data.maxTextureSize}px</strong> • Viewport: <strong className="text-white">{data.maxViewportDims[0]}×{data.maxViewportDims[1]}</strong>
          </span>
        </div>

      </div>

      {/* Precision Bits */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono p-3 rounded-lg bg-surface-dark/40 border border-surface-border text-gray-400">
        <span>Float Precision Bits:</span>
        <span className="text-white">High: <strong>{data.precisionFloatBits.high}</strong></span>
        <span className="text-gray-500">•</span>
        <span className="text-white">Medium: <strong>{data.precisionFloatBits.medium}</strong></span>
        <span className="text-gray-500">•</span>
        <span className="text-white">Low: <strong>{data.precisionFloatBits.low}</strong></span>
      </div>

      {/* Extensions Toggle */}
      <div className="border-t border-surface-border pt-3">
        <button
          onClick={() => setShowExtensions(!showExtensions)}
          className="flex items-center justify-between w-full text-xs font-mono text-gray-400 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Exposed WebGL Extensions ({data.extensionsCount})</span>
          </div>
          {showExtensions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showExtensions && (
          <div className="mt-3 p-3 rounded-lg bg-surface-dark border border-surface-border max-h-48 overflow-y-auto">
            <div className="flex flex-wrap gap-1.5">
              {data.extensionsList.map((ext, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-card border border-surface-border text-gray-300"
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
