import { FontTelemetry } from '../types/telemetry';
import { sha256 } from '../utils/crypto';
import { calculateBitsOfEntropy, EMPIRICAL_ENTROPY_WEIGHTS } from '../utils/entropy';

// Comprehensive cross-platform target fonts list
const CANDIDATE_FONTS = [
  // Windows
  'Segoe UI', 'Calibri', 'Cambria', 'Consolas', 'Constantia', 'Corbel', 'Gabriola',
  'Candara', 'Palatino Linotype', 'Lucida Console', 'Microsoft YaHei', 'MS Gothic',
  'Bahnschrift', 'Ink Free', 'Comic Sans MS', 'Trebuchet MS', 'Impact',
  // macOS / iOS
  'SF Pro', 'SF Compact', 'San Francisco', 'Helvetica Neue', 'Avenir', 'Avenir Next',
  'Monaco', 'Menlo', 'Optima', 'Futura', 'Baskerville', 'Didot', 'American Typewriter',
  'Gill Sans', 'Chalkduster', 'Apple Color Emoji', 'Geneva',
  // Linux
  'Ubuntu', 'Ubuntu Mono', 'Cantarell', 'DejaVu Sans', 'DejaVu Serif', 'Liberation Sans',
  'Liberation Serif', 'Liberation Mono', 'Fira Code', 'Roboto', 'Noto Sans', 'Droid Sans',
  // Professional & Adobe
  'Myriad Pro', 'Minion Pro', 'Adobe Garamond Pro', 'Source Code Pro', 'Cascadia Code',
  'JetBrains Mono', 'Hack', 'Inconsolata', 'Inter'
];

export async function auditFonts(): Promise<FontTelemetry> {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.visibility = 'hidden';
  document.body.appendChild(container);

  const sentinel = 'mmmwWooOIl1!iI§~@#$%^&*()_+';
  const baseFonts = ['monospace', 'sans-serif', 'serif'];

  // Measure base font widths and heights
  const baseMeasurements: Record<string, { w: number; h: number }> = {};
  for (const base of baseFonts) {
    const span = document.createElement('span');
    span.style.fontSize = '72px';
    span.style.fontFamily = base;
    span.textContent = sentinel;
    container.appendChild(span);
    baseMeasurements[base] = {
      w: span.offsetWidth,
      h: span.offsetHeight,
    };
    container.removeChild(span);
  }

  const installedFonts: string[] = [];

  // Test each candidate font
  for (const font of CANDIDATE_FONTS) {
    let detected = false;
    for (const base of baseFonts) {
      const span = document.createElement('span');
      span.style.fontSize = '72px';
      span.style.fontFamily = `"${font}", ${base}`;
      span.textContent = sentinel;
      container.appendChild(span);

      const matchBase = baseMeasurements[base];
      if (span.offsetWidth !== matchBase.w || span.offsetHeight !== matchBase.h) {
        detected = true;
      }
      container.removeChild(span);
      if (detected) break;
    }

    if (detected) {
      installedFonts.push(font);
    }
  }

  // Cleanup DOM
  document.body.removeChild(container);

  installedFonts.sort();
  const fontHash = await sha256(installedFonts.join(','));
  const entropyBits = calculateBitsOfEntropy(fontHash, EMPIRICAL_ENTROPY_WEIGHTS.fontsEnumerated);

  return {
    installedFonts,
    totalTested: CANDIDATE_FONTS.length,
    fontHash,
    entropyBits,
    riskLevel: installedFonts.length > 10 ? 'HIGH' : 'MEDIUM',
  };
}
