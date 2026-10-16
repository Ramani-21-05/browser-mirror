export interface WebGLTelemetry {
  vendor: string;
  renderer: string;
  glVersion: string;
  shadingLanguageVersion: string;
  maxTextureSize: number;
  maxViewportDims: [number, number];
  maxRenderBufferSize: number;
  extensionsCount: number;
  extensionsList: string[];
  precisionFloatBits: {
    high: number;
    medium: number;
    low: number;
  };
  shaderRenderHash: string;
  aliasedLineWidthRange: [number, number];
  aliasedPointSizeRange: [number, number];
  entropyBits: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AudioTelemetry {
  sampleRate: number;
  maxChannelCount: number;
  oscillatorHash: string;
  rawSampleSum: number;
  entropyBits: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CanvasTelemetry {
  canvas2dHash: string;
  subpixelWidth: number;
  subpixelHeight: number;
  windingRuleSupported: boolean;
  colorInterpolationQuirk: string;
  entropyBits: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface EdgePing {
  region: string;
  city: string;
  flag: string;
  latencyMs: number | null;
  status: 'pending' | 'testing' | 'success' | 'blocked';
}

export interface WebRTCTelemetry {
  localIps: string[];
  candidateTypes: string[];
  publicIpCandidate: string | null;
  hasMdnsMasking: boolean;
  edgePings: EdgePing[];
  entropyBits: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface HardwareTelemetry {
  cpuCores: number;
  deviceMemoryGb: number | string;
  maxTouchPoints: number;
  screenResolution: string;
  colorDepth: number;
  pixelRatio: number;
  colorGamut: string;
  hdrSupport: boolean;
  refreshRateHz: number;
  battery: {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  } | null;
  entropyBits: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FontTelemetry {
  installedFonts: string[];
  totalTested: number;
  fontHash: string;
  entropyBits: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface JSQuirksTelemetry {
  jsEngine: 'Google V8' | 'Mozilla SpiderMonkey' | 'Apple JavaScriptCore' | 'Unknown';
  mathTan1e300: string;
  mathSinhAnomaly: string;
  timezone: string;
  locale: string;
  calendar: string;
  numberFormatQuirk: string;
  entropyBits: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CompleteAuditData {
  webgl: WebGLTelemetry;
  audio: AudioTelemetry;
  canvas: CanvasTelemetry;
  webrtc: WebRTCTelemetry;
  hardware: HardwareTelemetry;
  fonts: FontTelemetry;
  quirks: JSQuirksTelemetry;
  totalEntropyBits: number;
  uniquenessPercentage: number;
  rarityOneInN: number;
  globalFingerprintHash: string;
  shieldGrade: 'CRITICAL' | 'POOR' | 'MODERATE' | 'HARDENED' | 'STEALTH';
  vulnerabilitiesCount: number;
  scanDurationMs: number;
  timestamp: string;
}

export type ScanStep = 'idle' | 'scanning' | 'aggregating' | 'complete';
