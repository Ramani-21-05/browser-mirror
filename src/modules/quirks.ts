import { JSQuirksTelemetry } from '../types/telemetry';
import { calculateBitsOfEntropy, EMPIRICAL_ENTROPY_WEIGHTS } from '../utils/entropy';

export function auditJSQuirks(): JSQuirksTelemetry {
  // 1. JS Engine Detection
  let jsEngine: JSQuirksTelemetry['jsEngine'] = 'Unknown';
  
  const errAny = Error as unknown as { captureStackTrace?: unknown };
  const errProto = Error.prototype as unknown as { toSource?: unknown };

  if (typeof errAny.captureStackTrace === 'function') {
    jsEngine = 'Google V8';
  } else if (typeof errProto.toSource === 'function') {
    jsEngine = 'Mozilla SpiderMonkey';
  } else if (
    typeof navigator !== 'undefined' &&
    /AppleWebKit/.test(navigator.userAgent) &&
    !/Chrome/.test(navigator.userAgent)
  ) {
    jsEngine = 'Apple JavaScriptCore';
  }

  // 2. Mathematical Precision Quirks
  const mathTan1e300 = String(Math.tan(-1e300));
  const mathSinhAnomaly = String(Math.sinh(-2e-17));

  // 3. Intl and Localization
  let timezone = 'UTC';
  let locale = 'en-US';
  let calendar = 'gregory';

  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions();
    timezone = resolved.timeZone || 'Unknown';
    locale = resolved.locale || 'en-US';
    calendar = resolved.calendar || 'gregory';
  } catch {
    timezone = 'Blocked';
  }

  // Number format quirk
  let numberFormatQuirk = 'default';
  try {
    numberFormatQuirk = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(123456.78);
  } catch {
    numberFormatQuirk = 'fallback';
  }

  const entropyBits = calculateBitsOfEntropy(
    `${jsEngine}_${timezone}_${mathTan1e300}`,
    EMPIRICAL_ENTROPY_WEIGHTS.jsQuirks
  );

  return {
    jsEngine,
    mathTan1e300,
    mathSinhAnomaly,
    timezone,
    locale,
    calendar,
    numberFormatQuirk,
    entropyBits,
    riskLevel: entropyBits > 4.5 ? 'HIGH' : 'MEDIUM',
  };
}
