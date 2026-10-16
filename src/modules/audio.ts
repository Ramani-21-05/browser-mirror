import { AudioTelemetry } from '../types/telemetry';
import { sha256 } from '../utils/crypto';
import { calculateBitsOfEntropy, EMPIRICAL_ENTROPY_WEIGHTS } from '../utils/entropy';

export async function auditAudio(): Promise<AudioTelemetry> {
  const AudioCtx = window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;

  if (!AudioCtx) {
    return {
      sampleRate: 0,
      maxChannelCount: 0,
      oscillatorHash: 'audio_context_unsupported',
      rawSampleSum: 0,
      entropyBits: 1.0,
      riskLevel: 'LOW',
    };
  }

  try {
    const context = new AudioCtx(1, 44100, 44100);
    
    // Create oscillator
    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(10000, context.currentTime);

    // Create compressor with tight dynamic constraints
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, context.currentTime);
    compressor.knee.setValueAtTime(40, context.currentTime);
    compressor.ratio.setValueAtTime(12, context.currentTime);
    compressor.attack.setValueAtTime(0, context.currentTime);
    compressor.release.setValueAtTime(0.25, context.currentTime);

    // Create biquad filter
    const filter = context.createBiquadFilter();
    filter.type = 'allpass';
    filter.frequency.setValueAtTime(5200, context.currentTime);
    filter.Q.setValueAtTime(0.707, context.currentTime);

    // Chain nodes
    oscillator.connect(compressor);
    compressor.connect(filter);
    filter.connect(context.destination);

    oscillator.start(0);

    const audioBuffer = await context.startRendering();
    const channelData = audioBuffer.getChannelData(0);

    // Calculate sum of sample amplitudes (from sample 4500 to 5000 where compressor curve settles)
    let sum = 0;
    for (let i = 4500; i < 5000; i++) {
      sum += Math.abs(channelData[i]);
    }

    // Convert buffer slice to ArrayBuffer and SHA-256 hash
    const slice = channelData.slice(4000, 6000);
    const oscillatorHash = await sha256(slice.buffer);

    const entropyBits = calculateBitsOfEntropy(oscillatorHash, EMPIRICAL_ENTROPY_WEIGHTS.audioOscillator);

    return {
      sampleRate: audioBuffer.sampleRate,
      maxChannelCount: audioBuffer.numberOfChannels,
      oscillatorHash,
      rawSampleSum: Number(sum.toFixed(8)),
      entropyBits,
      riskLevel: entropyBits > 8 ? 'HIGH' : 'MEDIUM',
    };
  } catch (err) {
    console.warn('AudioContext fingerprinting error/blocked:', err);
    return {
      sampleRate: 44100,
      maxChannelCount: 2,
      oscillatorHash: 'audio_blocked_or_spoofed',
      rawSampleSum: 0,
      entropyBits: 2.0,
      riskLevel: 'LOW',
    };
  }
}
