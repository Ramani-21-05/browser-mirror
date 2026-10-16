import { CanvasTelemetry } from '../types/telemetry';
import { sha256 } from '../utils/crypto';
import { calculateBitsOfEntropy, EMPIRICAL_ENTROPY_WEIGHTS } from '../utils/entropy';

export async function auditCanvas(): Promise<CanvasTelemetry> {
  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 60;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      canvas2dHash: 'canvas_unsupported',
      subpixelWidth: 0,
      subpixelHeight: 0,
      windingRuleSupported: false,
      colorInterpolationQuirk: 'none',
      entropyBits: 1.0,
      riskLevel: 'LOW',
    };
  }

  try {
    // 1. Text with complex font fallback and sub-pixel antialiasing
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);

    ctx.fillStyle = '#069';
    ctx.font = '11pt "Times New Roman", "Segoe UI Emoji", "Noto Color Emoji"';
    const testString = 'BrowserMirror ⚡ 👨‍👩‍👧‍👦 🇸🇪 1.6180339887';
    ctx.fillText(testString, 2, 15);

    // 2. Measure sub-pixel text metrics
    const metrics = ctx.measureText(testString);
    const subpixelWidth = Number(metrics.width.toFixed(4));
    const subpixelHeight = Number(((metrics.actualBoundingBoxAscent || 0) + (metrics.actualBoundingBoxDescent || 0)).toFixed(4));

    // 3. Composite operations & bezier paths
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.font = '18pt Arial';
    ctx.fillText(testString, 4, 45);

    // Multiply blend mode test
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgb(255,0,255)';
    ctx.beginPath();
    ctx.arc(50, 30, 25, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgb(0,255,255)';
    ctx.beginPath();
    ctx.arc(65, 30, 25, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // 4. Radial gradient interpolation
    ctx.globalCompositeOperation = 'source-over';
    const radgrad = ctx.createRadialGradient(150, 30, 10, 150, 30, 35);
    radgrad.addColorStop(0, '#FF5F6D');
    radgrad.addColorStop(0.5, '#FFC371');
    radgrad.addColorStop(1, 'rgba(0, 240, 255, 0.5)');
    ctx.fillStyle = radgrad;
    ctx.fillRect(120, 25, 60, 30);

    // 5. Test winding rule
    const path = new Path2D();
    path.arc(200, 30, 20, 0, Math.PI * 2);
    path.arc(200, 30, 10, 0, Math.PI * 2);
    const windingRuleSupported = ctx.isPointInPath(path, 200, 25, 'evenodd');

    // 6. Extract pixel buffer and SHA-256 hash
    const imageData = ctx.getImageData(0, 0, 240, 60);
    const canvas2dHash = await sha256(imageData.data.buffer);

    // Check color interpolation quirk (pixel sample)
    const colorInterpolationQuirk = `rgba(${imageData.data[100]}, ${imageData.data[101]}, ${imageData.data[102]}, ${imageData.data[103]})`;

    const entropyBits = calculateBitsOfEntropy(canvas2dHash, EMPIRICAL_ENTROPY_WEIGHTS.canvas2d);

    return {
      canvas2dHash,
      subpixelWidth,
      subpixelHeight,
      windingRuleSupported,
      colorInterpolationQuirk,
      entropyBits,
      riskLevel: entropyBits > 7.5 ? 'HIGH' : 'MEDIUM',
    };
  } catch (err) {
    console.warn('Canvas 2D fingerprinting error/protection:', err);
    return {
      canvas2dHash: 'canvas_spoofed_or_noise_injected',
      subpixelWidth: 0,
      subpixelHeight: 0,
      windingRuleSupported: true,
      colorInterpolationQuirk: 'noise_detected',
      entropyBits: 2.0,
      riskLevel: 'LOW',
    };
  }
}
