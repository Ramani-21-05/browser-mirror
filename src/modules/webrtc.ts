import { WebRTCTelemetry, EdgePing } from '../types/telemetry';
import { calculateBitsOfEntropy, EMPIRICAL_ENTROPY_WEIGHTS } from '../utils/entropy';

export async function auditWebRTC(): Promise<WebRTCTelemetry> {
  const localIps = new Set<string>();
  const candidateTypes = new Set<string>();
  let publicIpCandidate: string | null = null;
  let hasMdnsMasking = false;

  const edgePings: EdgePing[] = [
    { region: 'ap-south-1', city: 'Mumbai', flag: '🇮🇳', latencyMs: null, status: 'pending' },
    { region: 'ap-southeast-1', city: 'Singapore', flag: '🇸🇬', latencyMs: null, status: 'pending' },
    { region: 'eu-central-1', city: 'Frankfurt', flag: '🇩🇪', latencyMs: null, status: 'pending' },
    { region: 'ap-northeast-1', city: 'Tokyo', flag: '🇯🇵', latencyMs: null, status: 'pending' },
    { region: 'us-east-1', city: 'Virginia', flag: '🇺🇸', latencyMs: null, status: 'pending' },
  ];

  // 1. WebRTC ICE Gathering
  const rtcPromise = new Promise<void>((resolve) => {
    try {
      const RTCPC = window.RTCPeerConnection || (window as unknown as { webkitRTCPeerConnection: typeof RTCPeerConnection }).webkitRTCPeerConnection;
      if (!RTCPC) {
        resolve();
        return;
      }

      const pc = new RTCPC({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      // Timeout safety
      const timer = setTimeout(() => {
        try { pc.close(); } catch { /* ignore */ }
        resolve();
      }, 2500);

      pc.onicecandidate = (event) => {
        if (!event || !event.candidate) {
          clearTimeout(timer);
          try { pc.close(); } catch { /* ignore */ }
          resolve();
          return;
        }

        const candidateStr = event.candidate.candidate;
        const parts = candidateStr.split(' ');
        
        // candidate format: candidate:foundation component protocol priority ip port type ...
        if (parts.length >= 8) {
          const ip = parts[4];
          const type = parts[7];
          candidateTypes.add(type);

          if (ip.endsWith('.local')) {
            hasMdnsMasking = true;
            localIps.add(`mDNS: ${ip}`);
          } else if (
            ip.startsWith('192.168.') || 
            ip.startsWith('10.') || 
            ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
            ip.startsWith('fe80:')
          ) {
            localIps.add(ip);
          } else if (type === 'srflx') {
            publicIpCandidate = ip;
          }
        }
      };

      pc.createDataChannel('telemetry');
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => resolve());
    } catch {
      resolve();
    }
  });

  // 2. Regional Edge Ping Probing
  const pingPromises = edgePings.map(async (item) => {
    item.status = 'testing';
    const endpoints: Record<string, string> = {
      'ap-south-1': 'https://cloudflare-dns.com/dns-query',
      'ap-southeast-1': 'https://1.1.1.1/cdn-cgi/trace',
      'eu-central-1': 'https://dns.google/resolve?name=example.com',
      'ap-northeast-1': 'https://speed.cloudflare.com/__down?bytes=0',
      'us-east-1': 'https://www.gstatic.com/generate_204',
    };

    const targetUrl = endpoints[item.region] || 'https://www.cloudflare.com/cdn-cgi/trace';
    const start = performance.now();
    try {
      await fetch(`${targetUrl}?t=${Date.now()}_${Math.random()}`, {
        mode: 'no-cors',
        cache: 'no-store',
      });
      const duration = Math.round(performance.now() - start);
      item.latencyMs = duration;
      item.status = 'success';
    } catch {
      item.status = 'blocked';
      item.latencyMs = null;
    }
  });

  await Promise.all([rtcPromise, Promise.all(pingPromises)]);

  const localIpsList = Array.from(localIps);
  const entropyBits = calculateBitsOfEntropy(
    localIpsList.join(',') || 'no_local_ips', 
    EMPIRICAL_ENTROPY_WEIGHTS.webrtcCandidates
  );

  return {
    localIps: localIpsList,
    candidateTypes: Array.from(candidateTypes),
    publicIpCandidate,
    hasMdnsMasking,
    edgePings,
    entropyBits,
    riskLevel: localIpsList.length > 0 && !hasMdnsMasking ? 'HIGH' : 'MEDIUM',
  };
}
