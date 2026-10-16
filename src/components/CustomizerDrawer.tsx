import React from 'react';
import { useCustomization, AppTheme, PerspectiveMode, CrtMode, LayoutDensity } from '../context/CustomizationContext';
import { sound } from '../utils/sound';
import {
  X,
  Palette,
  Eye,
  Terminal,
  ShieldAlert,
  Volume2,
  Tv,
  Sparkles,
  LayoutGrid,
  Check,
} from 'lucide-react';

export const CustomizerDrawer: React.FC = () => {
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
    layoutDensity,
    setLayoutDensity,
    isCustomizerOpen,
    setIsCustomizerOpen,
  } = useCustomization();

  if (!isCustomizerOpen) return null;

  const themes: { id: AppTheme; name: string; desc: string; color: string; border: string }[] = [
    { id: 'cyber', name: 'Cyber Matrix', desc: 'Electric cyan neon with deep obsidian surfaces', color: '#00f0ff', border: 'border-cyan-500/40' },
    { id: 'editorial', name: 'Awwwards Editorial', desc: 'Stark monochromatic luxury titanium & pure black', color: '#ffffff', border: 'border-neutral-500/40' },
    { id: 'amber', name: 'Solar Amber', desc: 'Analog phosphor terminal with warm golden ember glow', color: '#ffb703', border: 'border-amber-500/40' },
    { id: 'synthwave', name: 'Neo Tokyo Synthwave', desc: 'Electric purple with neon magenta highlights', color: '#c084fc', border: 'border-purple-500/40' },
    { id: 'matrix', name: 'Emerald Terminal', desc: 'Hacker green bio-cybernetic defense aesthetic', color: '#22c55e', border: 'border-emerald-500/40' },
    { id: 'oled', name: 'OLED Deep Pitch', desc: 'Pure 0% pitch black with high-contrast micro-borders', color: '#38bdf8', border: 'border-sky-500/40' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={() => setIsCustomizerOpen(false)} />

      {/* Drawer Container */}
      <div className="w-full max-w-md bg-surface-card border-l border-surface-border p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-surface-dark border border-cyber-cyan/30 text-cyber-cyan">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-mono text-base font-bold text-white">
                UI & Sensory Customization
              </h3>
              <p className="text-xs text-gray-400">
                Awwwards-level aesthetics & presentation controls
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCustomizerOpen(false);
              sound.playClick(600);
            }}
            className="p-1.5 rounded-lg bg-surface-dark border border-surface-border text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Themes */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Curated Design Themes</span>
          </span>

          <div className="grid grid-cols-1 gap-2.5">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  theme === t.id
                    ? `bg-surface-dark/90 ${t.border} shadow-lg ring-1 ring-white/10`
                    : 'bg-surface-dark/40 border-surface-border hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: t.color, color: t.color }}
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">{t.name}</span>
                    <span className="text-[11px] text-gray-400 block">{t.desc}</span>
                  </div>
                </div>

                {theme === t.id && (
                  <Check className="w-4 h-4 text-cyber-cyan shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Perspective Mode */}
        <div className="flex flex-col gap-3 border-t border-surface-border pt-5">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Audience Perspective Mode</span>
          </span>

          <div className="grid grid-cols-1 gap-2">
            {[
              {
                id: 'human' as PerspectiveMode,
                title: 'Plain English / Human Mode',
                desc: 'Everyday analogies (supermarket barcodes, passports) for non-tech visitors',
                icon: <Eye className="w-4 h-4 text-cyber-green" />,
              },
              {
                id: 'terminal' as PerspectiveMode,
                title: 'Pro Telemetry Terminal',
                desc: 'Raw cryptographic hashes, GPU buffer ceilings, and precision bits',
                icon: <Terminal className="w-4 h-4 text-cyber-cyan" />,
              },
              {
                id: 'auditor' as PerspectiveMode,
                title: 'Security Risk Auditor',
                desc: 'Ad-tracker attack surfaces, tracking bypasses, and remediation configs',
                icon: <ShieldAlert className="w-4 h-4 text-cyber-amber" />,
              },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPerspective(p.id)}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  perspective === p.id
                    ? 'bg-surface-dark/90 border-cyber-cyan/50 text-white shadow-lg'
                    : 'bg-surface-dark/40 border-surface-border text-gray-400 hover:text-white'
                }`}
              >
                <div className="mt-0.5">{p.icon}</div>
                <div className="flex-1">
                  <span className="text-xs font-mono font-bold block">{p.title}</span>
                  <span className="text-[11px] opacity-75 block mt-0.5">{p.desc}</span>
                </div>
                {perspective === p.id && <Check className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Sensory & Motion Controls */}
        <div className="flex flex-col gap-3 border-t border-surface-border pt-5">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Sensory & Visual FX</span>
          </span>

          <div className="grid grid-cols-1 gap-2.5 text-xs font-mono">
            
            {/* Audio Toggle */}
            <div className="p-3 rounded-xl bg-surface-dark/60 border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-cyber-cyan" />
                <div>
                  <span className="text-white block font-semibold">Web Audio Tactile SFX</span>
                  <span className="text-[11px] text-gray-400">Synthesizes real-time click & chime frequencies</span>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  soundEnabled
                    ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold'
                    : 'bg-surface-card border-surface-border text-gray-500'
                }`}
              >
                {soundEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            {/* CRT Mode */}
            <div className="p-3 rounded-xl bg-surface-dark/60 border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Tv className="w-4 h-4 text-cyber-cyan" />
                <div>
                  <span className="text-white block font-semibold">CRT Scanlines & Glow</span>
                  <span className="text-[11px] text-gray-400">Retro cathode-ray monitor simulation</span>
                </div>
              </div>
              <div className="flex gap-1">
                {(['off', 'subtle', 'retro'] as CrtMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCrtMode(mode)}
                    className={`px-2 py-1 rounded text-[10px] uppercase transition-all ${
                      crtMode === mode
                        ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-bold'
                        : 'bg-surface-card border border-surface-border text-gray-400'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Hologram */}
            <div className="p-3 rounded-xl bg-surface-dark/60 border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyber-cyan" />
                <div>
                  <span className="text-white block font-semibold">3D Biometric Hologram</span>
                  <span className="text-[11px] text-gray-400">Interactive kinetic particle mesh in hero</span>
                </div>
              </div>
              <button
                onClick={() => setShowHologram(!showHologram)}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  showHologram
                    ? 'bg-cyber-green/20 border-cyber-green text-cyber-green font-bold'
                    : 'bg-surface-card border-surface-border text-gray-500'
                }`}
              >
                {showHologram ? 'VISIBLE' : 'HIDDEN'}
              </button>
            </div>

            {/* Layout Density */}
            <div className="p-3 rounded-xl bg-surface-dark/60 border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-4 h-4 text-cyber-cyan" />
                <div>
                  <span className="text-white block font-semibold">Layout Density</span>
                  <span className="text-[11px] text-gray-400">Bento cards vs compact terminal stream</span>
                </div>
              </div>
              <div className="flex gap-1">
                {(['bento', 'compact'] as LayoutDensity[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setLayoutDensity(d)}
                    className={`px-2 py-1 rounded text-[10px] uppercase transition-all ${
                      layoutDensity === d
                        ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-bold'
                        : 'bg-surface-card border border-surface-border text-gray-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
