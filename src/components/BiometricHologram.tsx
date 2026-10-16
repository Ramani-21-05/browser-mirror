import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../utils/sound';
import { Sparkles, Compass, Activity } from 'lucide-react';

interface BiometricHologramProps {
  hash: string;
  rarity: number;
  entropyBits: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
  colorType: 'cyan' | 'green' | 'accent' | 'white';
}

export const BiometricHologram: React.FC<BiometricHologramProps> = ({ hash, rarity, entropyBits }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hologramMode, setHologramMode] = useState<'sphere' | 'ring' | 'dna'>('ring');

  const rotRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const shockwaveRef = useRef<number>(0);

  // Generate deterministic particle cloud based on hash characters
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 360);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Seed particles using the fingerprint hash
    const particles: Particle3D[] = [];
    const count = 180;
    const radius = Math.min(width, height) * 0.36;

    for (let i = 0; i < count; i++) {
      // Extract pseudo-random numbers from hash characters
      const charCode = hash.charCodeAt(i % hash.length) || 65;
      const charCode2 = hash.charCodeAt((i * 3 + 7) % hash.length) || 72;

      let x = 0, y = 0, z = 0;

      if (hologramMode === 'sphere') {
        const theta = (i / count) * Math.PI * 2;
        const phi = Math.acos((2 * (i % 50)) / 50 - 1);
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      } else if (hologramMode === 'ring') {
        const angle = (i / count) * Math.PI * 2;
        const ringRad = radius * (0.8 + ((charCode % 10) / 30));
        x = Math.cos(angle) * ringRad;
        y = ((charCode2 % 40) - 20) * 2;
        z = Math.sin(angle) * ringRad;
      } else {
        // DNA double-helix spiral
        const t = (i / count) * Math.PI * 4;
        const strand = i % 2 === 0 ? 1 : -1;
        x = Math.cos(t) * radius * 0.7 * strand;
        y = (i / count - 0.5) * radius * 1.8;
        z = Math.sin(t) * radius * 0.7 * strand;
      }

      const colorTypes: Particle3D['colorType'][] = ['cyan', 'green', 'accent', 'white'];
      const colorType = colorTypes[i % colorTypes.length];

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: 1 + (charCode % 3) * 0.8,
        alpha: 0.3 + (charCode2 % 60) / 100,
        speed: 0.005 + (charCode % 20) / 2000,
        phase: (charCode % 100) / 100,
        colorType,
      });
    }

    let angleY = 0;
    let angleX = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth rotation dampening towards target
      rotRef.current.x += (rotRef.current.targetX - rotRef.current.x) * 0.06;
      rotRef.current.y += (rotRef.current.targetY - rotRef.current.y) * 0.06;

      angleY += 0.008;
      angleX = Math.sin(angleY * 0.5) * 0.15 + rotRef.current.x;
      const currentRotY = angleY + rotRef.current.y;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const fov = 340;
      const cx = width / 2;
      const cy = height / 2;

      // Handle shockwave ripple
      if (shockwaveRef.current > 0) {
        shockwaveRef.current += 4;
        ctx.beginPath();
        ctx.arc(cx, cy, shockwaveRef.current, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 0.8 - shockwaveRef.current / (radius * 1.8))})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (shockwaveRef.current > radius * 1.8) {
          shockwaveRef.current = 0;
        }
      }

      // Draw subtle orbital guide reticles
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sort particles by Z-depth for correct visual layering
      const projected = particles.map((p) => {
        // 3D rotation around Y then X
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;

        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        const scale = fov / (fov + z2);
        const x2d = x1 * scale + cx;
        const y2d = y2 * scale + cy;

        return {
          x: x2d,
          y: y2d,
          z: z2,
          scale,
          alpha: Math.max(0.1, Math.min(1, p.alpha * (scale * 0.9))),
          size: p.size * scale,
          colorType: p.colorType,
        };
      });

      projected.sort((a, b) => b.z - a.z);

      // Draw particle connectors for close pairs (neural mesh effect)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i += 2) {
        const p1 = projected[i];
        const p2 = projected[(i + 1) % projected.length];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 45) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 45)})`;
          ctx.stroke();
        }
      }

      // Draw Particles
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        let color = `rgba(0, 240, 255, ${p.alpha})`;
        if (p.colorType === 'green') color = `rgba(16, 185, 129, ${p.alpha})`;
        else if (p.colorType === 'accent') color = `rgba(255, 183, 3, ${p.alpha})`;
        else if (p.colorType === 'white') color = `rgba(255, 255, 255, ${p.alpha * 0.9})`;

        ctx.fillStyle = color;
        ctx.fill();

        // Extra glow for foreground particles
        if (p.scale > 1.1) {
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Central cryptographic pulse core
      const pulseSize = 10 + Math.sin(angleY * 2) * 3;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseSize * 2);
      coreGrad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
      coreGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.1)');
      coreGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, pulseSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Crosshair HUD lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1;
      const chSize = 8;
      ctx.beginPath();
      ctx.moveTo(cx - chSize, cy);
      ctx.lineTo(cx + chSize, cy);
      ctx.moveTo(cx, cy - chSize);
      ctx.lineTo(cx, cy + chSize);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [hash, hologramMode]);

  // Mouse move handler for tactile 3D tilting
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    rotRef.current.targetY = nx * 1.4;
    rotRef.current.targetX = -ny * 0.8;
    setMousePos({ x: Math.round(nx * 100), y: Math.round(ny * 100) });
  };

  const handleMouseLeave = () => {
    rotRef.current.targetX = 0;
    rotRef.current.targetY = 0;
  };

  const handleClick = () => {
    shockwaveRef.current = 5;
    sound.playClick(1100);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="relative w-full h-[340px] sm:h-[380px] rounded-2xl bg-surface-dark/90 border border-surface-border overflow-hidden cursor-crosshair select-none group shadow-inner"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none"></div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Top Left HUD: Diagnostic Coordinates */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none font-mono text-[10px] text-gray-400">
        <div className="flex items-center gap-1.5 text-cyber-cyan font-bold tracking-wider">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>BIOMETRIC IDENTITY HOLOGRAM</span>
        </div>
        <div>SHA-256 SEED: <span className="text-white">{hash.slice(0, 10)}...{hash.slice(-6)}</span></div>
        <div className="text-gray-500">PITCH: {mousePos.y}° • YAW: {mousePos.x}° • ENTROPY: {entropyBits}b</div>
      </div>

      {/* Top Right: Hologram Mode Switcher */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-surface-card/80 backdrop-blur-md p-1 rounded-lg border border-surface-border">
        {(['ring', 'sphere', 'dna'] as const).map((mode) => (
          <button
            key={mode}
            onClick={(e) => {
              e.stopPropagation();
              setHologramMode(mode);
              sound.playClick(950);
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-mono capitalize transition-all ${
              hologramMode === mode
                ? 'bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan font-bold shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Bottom Floating Interactive Callout */}
      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between pointer-events-none text-[11px] font-mono text-gray-400">
        <div className="flex items-center gap-1.5 bg-surface-card/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
          <Compass className="w-3 h-3 text-cyber-cyan animate-spin" />
          <span>Interactive Kinetic Matrix • Move cursor to tilt • Click to pulse</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-surface-card/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
          <Sparkles className="w-3 h-3 text-cyber-green" />
          <span>Rarity: 1 in {rarity.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
