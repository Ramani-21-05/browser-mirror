import React from 'react';
import { useCustomization } from '../context/CustomizationContext';
import { sound } from '../utils/sound';
import {
  ShieldAlert,
  RefreshCw,
  Share2,
  Globe,
  Lock,
  Search,
  Sliders,
  X
} from 'lucide-react';

interface HeaderProps {
  onRescan: () => void;
  onShare: () => void;
  isScanning: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRescan, onShare, isScanning }) => {
  const {
    searchQuery,
    setSearchQuery,
    setIsCustomizerOpen,
  } = useCustomization();

  return (
    <header className="border-b border-surface-border bg-obsidian/85 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-surface-card border border-cyber-cyan/30 text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyber-green rounded-full ring-2 ring-obsidian"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-wider text-white">
                Browser<span className="text-cyber-cyan">Mirror</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-surface-card text-gray-300 border border-white/10 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping"></span>
                <span>v2.7 Awwwards</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Zero-permission browser & hardware telemetry audit
            </p>
          </div>
        </div>

        {/* Live Search & Filter Omnibar */}
        <div className="flex-1 max-w-xs sm:max-w-sm hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter telemetry (e.g. GPU, IP, Audio)..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-surface-dark border border-surface-border text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan transition-colors"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 text-[10px] font-mono text-gray-500 bg-surface-card px-1.5 py-0.5 rounded border border-surface-border">
              /
            </kbd>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Re-Scan */}
          <button
            onClick={() => {
              sound.playScanChime();
              onRescan();
            }}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border hover:border-cyber-cyan/40 text-xs font-mono text-gray-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyber-cyan' : ''}`} />
            <span>{isScanning ? 'Auditing...' : 'Re-Scan'}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              sound.playClick(900);
              onShare();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/40 hover:bg-cyber-cyan/20 text-xs font-mono text-cyber-cyan font-medium transition-all shadow-[0_0_12px_rgba(0,240,255,0.15)]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Customizer Drawer Trigger */}
          <button
            onClick={() => {
              sound.playClick(1050);
              setIsCustomizerOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border hover:border-white/30 text-xs font-mono text-gray-300 hover:text-white transition-all"
            title="Open UI Customizer"
          >
            <Sliders className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="hidden sm:inline">Theme</span>
          </button>

          {/* RKWS Link */}
          <a
            href="https://rkws.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-gray-400 hover:text-white transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>rkws.in</span>
          </a>
        </div>

      </div>
    </header>
  );
};
