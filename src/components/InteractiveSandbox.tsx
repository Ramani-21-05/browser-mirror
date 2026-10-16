import React, { useState, useEffect, useRef } from 'react';
import { CompleteAuditData } from '../types/telemetry';
import { sound } from '../utils/sound';
import { Sliders, RefreshCw, ShieldCheck, AlertCircle, Sparkles, Check } from 'lucide-react';
import { sha256 } from '../utils/crypto';

interface SandboxProps {
  data: CompleteAuditData;
}

export const InteractiveSandbox: React.FC<SandboxProps> = ({ data }) => {
  const [noiseLevel, setNoiseLevel] = useState<number>(0);
  const [spoofCores, setSpoofCores] = useState<boolean>(false);
  const [spoofWebGL, setSpoofWebGL] = useState<boolean>(false);
  const [simulatedHash, setSimulatedHash] = useState<string>(data.globalFingerprintHash);
  const [simulatedEntropy, setSimulatedEntropy] = useState<number>(data.totalEntropyBits);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Recalculate simulated hash when parameters change
  useEffect(() => {
    let isCancelled = false;

    const computeSimulated = async () => {

      // Render demo canvas with simulated noise
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#11131a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw test pattern
          ctx.font = '14px monospace';
          ctx.fillStyle = '#00f0ff';
          ctx.fillText('BrowserMirror Anti-Fingerprint Test', 12, 28);

          // Render gradient rectangle
          const grad = ctx.createLinearGradient(12, 35, 260, 65);
          grad.addColorStop(0, '#00f0ff');
          grad.addColorStop(0.5, '#10b981');
          grad.addColorStop(1, '#a855f7');
          ctx.fillStyle = grad;
          ctx.fillRect(12, 35, 250, 20);

          // Inject visual noise dots if noiseLevel > 0
          if (noiseLevel > 0) {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imgData.data;
            const noiseIntensity = noiseLevel * 0.05;

            for (let i = 0; i < pixels.length; i += 4) {
              if (Math.random() < noiseIntensity) {
                const delta = (Math.random() - 0.5) * (noiseLevel * 0.8);
                pixels[i] = Math.min(255, Math.max(0, pixels[i] + delta));
                pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1] + delta));
                pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2] + delta));
              }
            }
            ctx.putImageData(imgData, 0, 0);
          }
        }
      }

      // Generate seed
      const seed = `${data.globalFingerprintHash}_noise${noiseLevel}_cores${spoofCores}_gl${spoofWebGL}`;
      const newHash = await sha256(seed);

      if (!isCancelled) {
        setSimulatedHash(newHash);
        // If protections are applied, entropy drops because profile matches generic pool
        let entropy = data.totalEntropyBits;
        if (noiseLevel > 0) entropy -= 4.2;
        if (spoofCores) entropy -= 3.1;
        if (spoofWebGL) entropy -= 7.4;
        setSimulatedEntropy(Math.max(8.5, Math.round(entropy * 10) / 10));
      }
    };

    computeSimulated();

    return () => {
      isCancelled = true;
    };
  }, [noiseLevel, spoofCores, spoofWebGL, data.globalFingerprintHash, data.totalEntropyBits]);

  const handleNoiseChange = (val: number) => {
    setNoiseLevel(val);
    sound.playClick(600 + val * 6);
  };

  const handleToggleCores = () => {
    setSpoofCores(!spoofCores);
    sound.playClick(850);
  };

  const handleToggleWebGL = () => {
    setSpoofWebGL(!spoofWebGL);
    sound.playClick(950);
  };

  const handleReset = () => {
    setNoiseLevel(0);
    setSpoofCores(false);
    setSpoofWebGL(false);
    sound.playSuccess();
  };

  const isHardened = noiseLevel > 30 || spoofCores || spoofWebGL;

  return (
    <div className="w-full rounded-2xl bg-surface-card border border-surface-border p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden shadow-2xl">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-surface-dark border border-cyber-cyan/30 text-cyber-cyan shadow-[0_0_12px_rgba(0,240,255,0.2)]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
              <span>Interactive Anti-Fingerprint Simulator</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
                Live Sandbox
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Manipulate subpixel canvas noise and hardware telemetry to see how trackers lose your trail in real time.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-dark border border-surface-border hover:border-white/20 text-xs font-mono text-gray-300 hover:text-white transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Slider 1: Canvas Subpixel Noise */}
          <div className="p-4 rounded-xl bg-surface-dark/70 border border-surface-border flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-gray-200 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Subpixel Canvas Noise Injection:</span>
              </label>
              <span className="text-xs font-mono font-bold text-cyber-cyan">
                {noiseLevel === 0 ? '0% (Standard Unprotected)' : `${noiseLevel}% Noise Active`}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={noiseLevel}
              onChange={(e) => handleNoiseChange(Number(e.target.value))}
              className="w-full h-2 bg-surface-border rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
            />

            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>Bit-Identical Leak</span>
              <span>Subtle Noise (Brave Standard)</span>
              <span>Maximum Scramble (Tor RFP)</span>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            
            {/* Toggle 1: CPU Concurrency Spoof */}
            <button
              onClick={handleToggleCores}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                spoofCores
                  ? 'bg-cyber-green/10 border-cyber-green/40 text-cyber-green'
                  : 'bg-surface-dark/70 border-surface-border text-gray-400 hover:text-white'
              }`}
            >
              <div>
                <span className="font-bold block">Normalize CPU Cores</span>
                <span className="text-[11px] opacity-75">
                  {spoofCores ? 'Spoofed to 4 Cores' : `Exposing ${data.hardware.cpuCores} Cores`}
                </span>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${spoofCores ? 'bg-cyber-green text-black border-cyber-green' : 'border-gray-600'}`}>
                {spoofCores && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>

            {/* Toggle 2: WebGL Vendor Masking */}
            <button
              onClick={handleToggleWebGL}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                spoofWebGL
                  ? 'bg-cyber-cyan/10 border-cyber-cyan/40 text-cyber-cyan'
                  : 'bg-surface-dark/70 border-surface-border text-gray-400 hover:text-white'
              }`}
            >
              <div>
                <span className="font-bold block">Mask GPU Vendor</span>
                <span className="text-[11px] opacity-75">
                  {spoofWebGL ? 'Generic Mesa / Angle' : 'Exposing Real GPU Chip'}
                </span>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${spoofWebGL ? 'bg-cyber-cyan text-black border-cyber-cyan' : 'border-gray-600'}`}>
                {spoofWebGL && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>

          </div>

          {/* Real-Time Live Canvas Preview */}
          <div className="p-3.5 rounded-xl bg-surface-dark border border-surface-border flex flex-col gap-2">
            <span className="text-[11px] font-mono text-gray-400 flex items-center justify-between">
              <span>Live Rasterizer Output:</span>
              <span className="text-gray-500">280×70 px</span>
            </span>
            <canvas ref={canvasRef} width={280} height={70} className="w-full h-16 rounded border border-surface-border" />
          </div>

        </div>

        {/* Right Column: Dynamic Impact Telemetry */}
        <div className="lg:col-span-5 flex flex-col gap-4 p-5 rounded-xl bg-surface-dark/80 border border-surface-border">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
              Live Hash Mutation
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
              isHardened
                ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/40'
                : 'bg-cyber-amber/20 text-cyber-amber border border-cyber-amber/40'
            }`}>
              {isHardened ? 'DEFENSE ACTIVE' : 'UNPROTECTED'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-gray-400 block mb-1">
              Mutated Fingerprint Signature:
            </span>
            <code className="text-xs font-mono text-cyber-cyan bg-surface-card p-2.5 rounded-lg border border-surface-border block break-all select-all shadow-inner">
              {simulatedHash}
            </code>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-surface-card border border-surface-border">
              <span className="text-[10px] font-mono text-gray-400 block">Baseline Entropy</span>
              <span className="text-base font-mono font-bold text-gray-300">
                {data.totalEntropyBits} bits
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-card border border-surface-border">
              <span className="text-[10px] font-mono text-gray-400 block">Simulated Entropy</span>
              <span className={`text-base font-mono font-bold ${simulatedEntropy < data.totalEntropyBits ? 'text-cyber-green' : 'text-cyber-cyan'}`}>
                {simulatedEntropy} bits
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-surface-card/60 border border-white/5 text-xs text-gray-400 leading-relaxed">
            {isHardened ? (
              <span className="text-cyber-green flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Success:</strong> Every page load now generates a completely randomized signature. Trackers can no longer link your sessions together.
                </span>
              </span>
            ) : (
              <span className="text-gray-400 flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-cyber-amber" />
                <span>
                  Move the noise slider or toggle protections to experience how privacy shields dismantle tracking scripts.
                </span>
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
