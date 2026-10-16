import React from 'react';
import { ShieldAlert, Terminal, RefreshCw, Share2, Globe, Lock } from 'lucide-react';

interface HeaderProps {
  onRescan: () => void;
  onShare: () => void;
  isScanning: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRescan, onShare, isScanning }) => {
  return (
    <header className="border-b border-surface-border bg-obsidian/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-surface-card border border-cyber-cyan/30 text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyber-green rounded-full ring-2 ring-obsidian"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-wider text-white">
                Browser<span className="text-cyber-cyan">Mirror</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface-border text-gray-300 border border-white/5">
                v2.6 Enterprise
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Zero-permission browser & hardware telemetry audit
            </p>
          </div>
        </div>

        {/* Global Security Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card/60 border border-surface-border text-xs text-gray-300 font-mono">
          <Lock className="w-3.5 h-3.5 text-cyber-green" />
          <span>100% Client-Side</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">Zero Server Telemetry</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRescan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border hover:border-cyber-cyan/40 text-xs font-mono text-gray-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyber-cyan' : ''}`} />
            <span>{isScanning ? 'Auditing...' : 'Re-Scan'}</span>
          </button>

          <button
            onClick={onShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/40 hover:bg-cyber-cyan/20 text-xs font-mono text-cyber-cyan font-medium transition-all shadow-[0_0_12px_rgba(0,240,255,0.15)]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Audit</span>
          </button>

          <a
            href="https://rkws.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-gray-400 hover:text-white transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>rkws.in</span>
          </a>
        </div>

      </div>
    </header>
  );
};
