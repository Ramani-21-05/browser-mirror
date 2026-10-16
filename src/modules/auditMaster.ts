import { CompleteAuditData } from '../types/telemetry';
import { auditWebGL } from './webgl';
import { auditAudio } from './audio';
import { auditCanvas } from './canvas';
import { auditWebRTC } from './webrtc';
import { auditHardware } from './hardware';
import { auditFonts } from './fonts';
import { auditJSQuirks } from './quirks';
import { calculateRarity } from '../utils/entropy';
import { sha256 } from '../utils/crypto';

export type ProgressCallback = (moduleName: string, progressPercent: number) => void;

export async function runFullAudit(onProgress?: ProgressCallback): Promise<CompleteAuditData> {
  const startTime = performance.now();

  // Progress helpers
  onProgress?.('Initializing Core Diagnostic...', 10);

  // 1. Concurrently launch synchronous and lightweight audits
  onProgress?.('Inspecting JavaScript Engine & Math Quirks...', 25);
  const quirks = auditJSQuirks();

  onProgress?.('Unmasking GPU & Shader Precision Format...', 40);
  const [webgl, hardware] = await Promise.all([
    auditWebGL(),
    auditHardware(),
  ]);

  onProgress?.('Generating Audio Oscillator Frequency Buffer...', 60);
  const [audio, canvas] = await Promise.all([
    auditAudio(),
    auditCanvas(),
  ]);

  onProgress?.('Enumerating Sub-Pixel System Fonts & WebRTC Interfaces...', 80);
  const [fonts, webrtc] = await Promise.all([
    auditFonts(),
    auditWebRTC(),
  ]);

  onProgress?.('Aggregating Shannon Entropy & Cryptographic Signature...', 95);

  // Calculate Total Shannon Entropy in Bits
  const totalEntropyBits = Number(
    (
      webgl.entropyBits +
      audio.entropyBits +
      canvas.entropyBits +
      webrtc.entropyBits +
      hardware.entropyBits +
      fonts.entropyBits +
      quirks.entropyBits
    ).toFixed(2)
  );

  const { uniquenessPercentage, rarityOneInN, shieldGrade } = calculateRarity(totalEntropyBits);

  // Global Fingerprint SHA-256 Hash
  const canonicalString = [
    webgl.renderer,
    webgl.shaderRenderHash,
    audio.oscillatorHash,
    canvas.canvas2dHash,
    fonts.fontHash,
    hardware.screenResolution,
    hardware.cpuCores,
    hardware.colorGamut,
    quirks.timezone,
    quirks.jsEngine,
  ].join('|');

  const globalFingerprintHash = await sha256(canonicalString);

  // Count vulnerabilities (High Risk categories)
  let vulnerabilitiesCount = 0;
  if (webgl.riskLevel === 'HIGH') vulnerabilitiesCount++;
  if (audio.riskLevel === 'HIGH') vulnerabilitiesCount++;
  if (canvas.riskLevel === 'HIGH') vulnerabilitiesCount++;
  if (webrtc.riskLevel === 'HIGH') vulnerabilitiesCount++;
  if (hardware.riskLevel === 'HIGH') vulnerabilitiesCount++;
  if (fonts.riskLevel === 'HIGH') vulnerabilitiesCount++;

  const scanDurationMs = Math.round(performance.now() - startTime);

  onProgress?.('Audit Complete', 100);

  return {
    webgl,
    audio,
    canvas,
    webrtc,
    hardware,
    fonts,
    quirks,
    totalEntropyBits,
    uniquenessPercentage,
    rarityOneInN,
    globalFingerprintHash,
    shieldGrade,
    vulnerabilitiesCount,
    scanDurationMs,
    timestamp: new Date().toISOString(),
  };
}
