import React from 'react';
import { useCustomization, AppTheme, PerspectiveMode } from '../context/CustomizationContext';
import { sound } from '../utils/sound';
import {
  Volume2,
  VolumeX,
  Tv,
  Sparkles,
  Sliders,
  Eye,
  Terminal,
  ShieldAlert,
} from 'lucide-react';

export const AwwwardsDock: React.FC = () => {
  const {
    theme,
    setTheme,
    perspective,
    setPerspective,
    soundEnabled,
    setSoundEnabled,
    crtMode,
    setCrtMode,
    showHologram,
    setShowHologram,
    setIsCustomizerOpen,
  } = useCustomization();

  const themes: { id: AppTheme; name: string; color: string }[] = [
    { id: 'cyber', name: 'Cyber Matrix', color: '#00f0ff' },
    { id: 'editorial', name: 'Awwwards Editorial', color: '#ffffff' },
    { id: 'amber', name: 'Solar Amber', color: '#ffb703' },
    { id: 'synthwave', name: 'Neo Synthwave', color: '#c084fc' },
    { id: 'matrix', name: 'Emerald Terminal', color: '#22c55e' },
    { id: 'oled', name: 'OLED Pitch Black', color: '#38bdf8' },
  ];

  const perspectives: { id: PerspectiveMode; label: string; icon: React.ReactNode; tooltip: string }[] = [
    { id: 'human', label: 'Plain English', icon: <Eye className="w-3.5 h-3.5" />, tooltip: 'Everyday analogies for non-tech visitors' },
    { id: 'terminal', label: 'Pro Telemetry', icon: <Terminal className="w-3.5 h-3.5" />, tooltip: 'Raw GPU buffers & crypto hashes' },
    { id: 'auditor', label: 'Risk Auditor', icon: <ShieldAlert className="w-3.5 h-3.5" />, tooltip: 'Vulnerability analysis & defenses' },
  ];

  return (
    <>
      {/* Floating Bottom Action Pill Dock */}
      <nav aria-label="Awwwards UI customization dock" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] sm:max-w-2xl w-full flex items-center justify-between gap-2 p-2 rounded-2xl bg-surface-card/90 backdrop-blur-xl border border-surface-border shadow-[0_10px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
        
        {/* Perspective Mode Switcher */}
        <div className="flex items-center gap-1 bg-surface-dark/80 p-1 rounded-xl border border-surface-border">
          {perspectives.map((p) => {
            const isActive = perspective === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPerspective(p.id)}
                title={p.tooltip}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {p.icon}
                <span className="hidden sm:inline">{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Theme Color Dots */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-surface-dark/60 rounded-xl border border-surface-border">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.name}
              className={`w-4 h-4 rounded-full transition-transform hover:scale-125 ${
                theme === t.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: t.color }}
            />
          ))}
        </div>

        {/* Sensory & Display Toggles */}
        <div className="flex items-center gap-1">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Tactile SFX' : 'Enable Tactile SFX'}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan'
                : 'bg-surface-dark/80 border-surface-border text-gray-500 hover:text-gray-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={() => {
              const next: typeof crtMode = crtMode === 'off' ? 'subtle' : crtMode === 'subtle' ? 'retro' : 'off';
              setCrtMode(next);
            }}
            title={`CRT Scanlines: ${crtMode.toUpperCase()}`}
            className={`p-2 rounded-xl border transition-all ${
              crtMode !== 'off'
                ? 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan'
                : 'bg-surface-dark/80 border-surface-border text-gray-500 hover:text-gray-300'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          {/* Hologram Toggle */}
          <button
            onClick={() => setShowHologram(!showHologram)}
            title={showHologram ? 'Hide 3D Hologram' : 'Show 3D Hologram'}
            className={`p-2 rounded-xl border transition-all ${
              showHologram
                ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green'
                : 'bg-surface-dark/80 border-surface-border text-gray-500 hover:text-gray-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Open Full Customizer Drawer */}
          <button
            onClick={() => {
              setIsCustomizerOpen(true);
              sound.playClick(1000);
            }}
            title="Open UI Customizer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-cyan text-black font-mono font-bold text-xs hover:bg-cyber-cyan/90 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customize</span>
          </button>
        </div>

      </nav>
    </>
  );
};
