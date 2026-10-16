import { HardwareTelemetry } from '../types/telemetry';
import { calculateBitsOfEntropy, EMPIRICAL_ENTROPY_WEIGHTS } from '../utils/entropy';

interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

/**
 * Calculates display refresh rate by measuring frame delta across 60 frames.
 */
async function measureRefreshRate(): Promise<number> {
  return new Promise((resolve) => {
    let frameCount = 0;
    const maxFrames = 60;
    let startTime: number | null = null;

    const step = (now: number) => {
      if (startTime === null) startTime = now;
      frameCount++;

      if (frameCount >= maxFrames) {
        const elapsedSec = (now - startTime) / 1000;
        const fps = Math.round(frameCount / elapsedSec);
        // Round to common refresh rates if close
        if (Math.abs(fps - 60) <= 3) resolve(60);
        else if (Math.abs(fps - 75) <= 3) resolve(75);
        else if (Math.abs(fps - 90) <= 3) resolve(90);
        else if (Math.abs(fps - 120) <= 4) resolve(120);
        else if (Math.abs(fps - 144) <= 4) resolve(144);
        else if (Math.abs(fps - 165) <= 5) resolve(165);
        else if (Math.abs(fps - 240) <= 6) resolve(240);
        else resolve(fps);
      } else {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  });
}

export async function auditHardware(): Promise<HardwareTelemetry> {
  const cpuCores = navigator.hardwareConcurrency || 4;
  const navAny = navigator as unknown as { deviceMemory?: number; getBattery?: () => Promise<BatteryManager> };
  const deviceMemoryGb = navAny.deviceMemory || 'Restricted';
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // Screen & Display
  const screenResolution = `${window.screen.width} × ${window.screen.height} (${window.screen.availWidth} × ${window.screen.availHeight} Avail)`;
  const colorDepth = window.screen.colorDepth || 24;
  const pixelRatio = window.devicePixelRatio || 1;

  // Color gamut
  let colorGamut = 'Standard sRGB';
  if (window.matchMedia && window.matchMedia('(color-gamut: p3)').matches) {
    colorGamut = 'Wide Gamut DCI-P3';
  } else if (window.matchMedia && window.matchMedia('(color-gamut: rec2020)').matches) {
    colorGamut = 'Ultra-Wide Rec.2020';
  }

  // HDR Support
  const hdrSupport = window.matchMedia ? window.matchMedia('(dynamic-range: high)').matches : false;

  // Battery Telemetry
  let battery: HardwareTelemetry['battery'] = null;
  try {
    if (typeof navAny.getBattery === 'function') {
      const b = await navAny.getBattery();
      battery = {
        charging: b.charging,
        chargingTime: b.chargingTime,
        dischargingTime: b.dischargingTime,
        level: Math.round(b.level * 100),
      };
    }
  } catch {
    battery = null;
  }

  // Refresh Rate
  const refreshRateHz = await measureRefreshRate();

  // Calculate entropy
  const cpuEntropy = calculateBitsOfEntropy(cpuCores, EMPIRICAL_ENTROPY_WEIGHTS.hardwareCoresMemory);
  const displayEntropy = calculateBitsOfEntropy(screenResolution, EMPIRICAL_ENTROPY_WEIGHTS.displayResolution);
  const refreshEntropy = calculateBitsOfEntropy(refreshRateHz, EMPIRICAL_ENTROPY_WEIGHTS.refreshRate);
  const totalEntropy = Number((cpuEntropy + displayEntropy + refreshEntropy).toFixed(2));

  return {
    cpuCores,
    deviceMemoryGb,
    maxTouchPoints,
    screenResolution,
    colorDepth,
    pixelRatio,
    colorGamut,
    hdrSupport,
    refreshRateHz,
    battery,
    entropyBits: totalEntropy,
    riskLevel: totalEntropy > 10 ? 'HIGH' : 'MEDIUM',
  };
}
