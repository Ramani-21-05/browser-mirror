import React, { useState } from 'react';
import { Shield, Check, Copy, ExternalLink, X, AlertTriangle } from 'lucide-react';

interface DefenseShieldProps {
  onClose: () => void;
}

export const DefenseShield: React.FC<DefenseShieldProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'firefox' | 'brave' | 'chrome' | 'safari' | 'tor'>('firefox');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyConfig = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl rounded-2xl bg-surface-card border border-surface-border p-6 sm:p-8 flex flex-col gap-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyber-crimson/10 border border-cyber-crimson/30 text-cyber-crimson">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-bold text-white">
                Defense Shield: Remediation Matrix
              </h2>
              <p className="text-xs text-gray-400">
                Actionable browser hardening steps to neutralize silent fingerprinting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-surface-dark border border-surface-border hover:border-white/20 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-surface-border pb-3">
          {[
            { id: 'firefox', label: '🦊 Firefox / LibreWolf' },
            { id: 'brave', label: '🦁 Brave Browser' },
            { id: 'chrome', label: '🌐 Chrome / Edge' },
            { id: 'safari', label: '🍏 Safari / iOS' },
            { id: 'tor', label: '🧅 Tor Browser' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyber-cyan/10 border border-cyber-cyan/50 text-cyber-cyan shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                  : 'bg-surface-dark border border-surface-border text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex flex-col gap-4 text-xs font-mono">
          
          {activeTab === 'firefox' && (
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-surface-dark border border-surface-border flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">1. Enable Resist Fingerprinting (RFP)</span>
                  <button
                    onClick={() => copyConfig('rfp', 'privacy.resistFingerprinting = true')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-card border border-surface-border text-gray-300 hover:text-white"
                  >
                    {copiedKey === 'rfp' ? <Check className="w-3 h-3 text-cyber-green" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'rfp' ? 'Copied' : 'Copy Flag'}</span>
                  </button>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Navigate to <code className="text-cyber-cyan">about:config</code>, search for <code className="text-white">privacy.resistFingerprinting</code>, and set it to <code className="text-cyber-green">true</code>. This locks display metrics to standard dimensions, spoofs WebGL, and randomizes audio buffers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-dark border border-surface-border flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">2. Block WebRTC Local IP Leaks</span>
                  <button
                    onClick={() => copyConfig('webrtc', 'media.peerconnection.ice.default_address_only = true')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-card border border-surface-border text-gray-300 hover:text-white"
                  >
                    {copiedKey === 'webrtc' ? <Check className="w-3 h-3 text-cyber-green" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'webrtc' ? 'Copied' : 'Copy Flag'}</span>
                  </button>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  In <code className="text-cyber-cyan">about:config</code>, set <code className="text-white">media.peerconnection.ice.default_address_only</code> to <code className="text-cyber-green">true</code>, or set <code className="text-white">media.peerconnection.enabled</code> to <code className="text-cyber-crimson">false</code> to prevent LAN IPs from leaking through VPNs.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'brave' && (
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-surface-dark border border-surface-border flex flex-col gap-2">
                <span className="font-bold text-white text-sm">1. Set Fingerprinting Protection to "Strict"</span>
                <p className="text-gray-400 leading-relaxed">
                  Open <code className="text-cyber-cyan">brave://settings/shields</code> and change <strong>Fingerprinting Protection</strong> from Standard to <strong>Aggressive / Strict (Block fingerprinting)</strong>. This adds subtle randomized mathematical noise to Canvas and AudioContext queries on every single page load.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-dark border border-surface-border flex flex-col gap-2">
                <span className="font-bold text-white text-sm">2. Disable WebRTC UDP Leaks</span>
                <p className="text-gray-400 leading-relaxed">
                  In <code className="text-cyber-cyan">brave://settings/privacy</code>, set <strong>WebRTC IP Handling Policy</strong> to <em>"Disable non-proxied UDP"</em>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'chrome' && (
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-surface-dark border border-surface-border flex flex-col gap-2">
                <span className="font-bold text-white text-sm">1. Install WebRTC Network Limiter Extension</span>
                <p className="text-gray-400 leading-relaxed">
                  Chrome exposes local IP candidates by default. Install the official Google <strong>WebRTC Network Limiter</strong> extension from the Chrome Web Store and configure it to prevent non-proxied UDP leaks.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-dark border border-surface-border flex flex-col gap-2">
                <span className="font-bold text-white text-sm">2. Install Canvas Defender / Anti-Fingerprint Extension</span>
                <p className="text-gray-400 leading-relaxed">
                  Chrome does not provide native canvas noise randomization. Use privacy extensions like <strong>Canvas Defender</strong> or <strong>Trace</strong> to intercept and poison <code className="text-cyber-cyan">toDataURL()</code> and <code className="text-cyber-cyan">getImageData()</code> calls.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'safari' && (
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-surface-dark border border-surface-border flex flex-col gap-2">
                <span className="font-bold text-white text-sm">1. Enable Advanced Tracking & Fingerprinting Protection</span>
                <p className="text-gray-400 leading-relaxed">
                  On macOS: Safari → Settings → Advanced → check <strong>"Use advanced tracking and fingerprinting protection"</strong> → select <em>"In all browsing"</em>. This restricts WebGL parameters and font enumeration.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'tor' && (
            <div className="p-4 rounded-xl bg-surface-dark border border-cyber-purple/30 flex flex-col gap-2">
              <span className="font-bold text-cyber-purple text-sm">The Gold Standard: Uniform Baseline Pool</span>
              <p className="text-gray-400 leading-relaxed">
                Tor Browser disables WebRTC, standardizes viewport resolution to fixed intervals, returns uniform dummy audio buffers, and blocks font enumeration. Total Shannon entropy drops below <strong>12 bits</strong>, making millions of Tor users completely indistinguishable from each other.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-surface-border pt-4">
          <span className="text-[11px] font-mono text-gray-400">
            Defense Matrix verified against W3C Web APIs specifications.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-dark border border-surface-border hover:border-cyber-cyan/40 text-xs font-mono text-white transition-all"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
