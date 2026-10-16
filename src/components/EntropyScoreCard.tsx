import React, { useState } from 'react';
import { CompleteAuditData } from '../types/telemetry';
import { Shield, Fingerprint, Copy, Check, Info, AlertTriangle, Zap, Cpu } from 'lucide-react';

interface ScoreCardProps {
  data: CompleteAuditData;
  onOpenShield: () => void;
  onOpenShare: () => void;
}

export const EntropyScoreCard: React.FC<ScoreCardProps> = ({ data, onOpenShield, onOpenShare }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(data.globalFingerprintHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGradeBadge = (grade: CompleteAuditData['shieldGrade']) => {
    switch (grade) {
      case 'CRITICAL':
        return {
          bg: 'bg-cyber-crimson/10 border-cyber-crimson/40 text-cyber-crimson',
          label: 'CRITICAL EXPOSURE',
          desc: 'Your browser configuration is highly unique and globally trackable across sites without cookies.',
        };
      case 'POOR':
        return {
          bg: 'bg-cyber-amber/10 border-cyber-amber/40 text-cyber-amber',
          label: 'POOR DEFENSE',
          desc: 'Substantial telemetry is exposed to ad-trackers and cross-site scripts.',
        };
      case 'MODERATE':
        return {
          bg: 'bg-cyber-cyan/10 border-cyber-cyan/40 text-cyber-cyan',
          label: 'MODERATE SHIELD',
          desc: 'Standard commercial browser profile. Noticeable entropy in hardware and canvas.',
        };
      case 'HARDENED':
        return {
          bg: 'bg-cyber-green/10 border-cyber-green/40 text-cyber-green',
          label: 'HARDENED PRIVACY',
          desc: 'Effective anti-fingerprinting protections active. Fingerprint noise detected.',
        };
      case 'STEALTH':
        return {
          bg: 'bg-cyber-purple/10 border-cyber-purple/40 text-cyber-purple',
          label: 'STEALTH IDENTITY',
          desc: 'Maximum privacy standard (Tor / ResistFingerprinting). Indistinguishable from baseline pool.',
        };
    }
  };

  const gradeInfo = getGradeBadge(data.shieldGrade);

  return (
    <div className="w-full rounded-2xl bg-surface-card border border-surface-border p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      {/* Background cyber accent glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyber-green/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-6">
        
        {/* Top Header: Grade & Scan Duration */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border pb-5">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-wider ${gradeInfo.bg}`}>
              {gradeInfo.label}
            </div>
            <span className="text-xs font-mono text-gray-400">
              {data.vulnerabilitiesCount} High-Entropy Vectors Detected
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Diagnostic Latency: <strong className="text-white">{data.scanDurationMs}ms</strong></span>
            </div>
            <span>•</span>
            <span>100% Client Probing</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 1-in-N Rarity */}
          <div className="p-5 rounded-xl bg-surface-dark/70 border border-surface-border flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Global Device Rarity
              </span>
              <div className="mt-2 text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
                1 in {data.rarityOneInN.toLocaleString()}
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400 leading-relaxed">
              Out of thousands of random internet visitors, only one possesses this exact device & graphics profile.
            </p>
          </div>

          {/* Card 2: Shannon Entropy in Bits */}
          <div className="p-5 rounded-xl bg-surface-dark/70 border border-surface-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  Shannon Entropy
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-card border border-white/10 text-cyber-cyan">
                  Information Theory
                </span>
              </div>
              <div className="mt-2 text-3xl sm:text-4xl font-mono font-bold text-cyber-cyan tracking-tight">
                {data.totalEntropyBits} <span className="text-lg font-normal text-gray-400">bits</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400 leading-relaxed">
              Calculated sum of mathematical uniqueness bits extracted silently across 7 hardware & browser subsystems.
            </p>
          </div>

          {/* Card 3: Trackability Index */}
          <div className="p-5 rounded-xl bg-surface-dark/70 border border-surface-border flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Trackability Index
              </span>
              <div className="mt-2 text-3xl sm:text-4xl font-mono font-bold text-cyber-amber tracking-tight">
                {data.uniquenessPercentage}%
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400 leading-relaxed">
              Probability that trackers can cross-reference your identity across distinct websites without third-party cookies.
            </p>
          </div>

        </div>

        {/* Global Cryptographic Signature Bar */}
        <div className="p-4 rounded-xl bg-surface-dark/50 border border-surface-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Fingerprint className="w-5 h-5 text-cyber-cyan shrink-0" />
            <div className="truncate">
              <span className="text-[11px] font-mono text-gray-400 block">
                Canonical SHA-256 Fingerprint Signature
              </span>
              <code className="text-xs font-mono text-gray-200 truncate select-all block">
                {data.globalFingerprintHash}
              </code>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyHash}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border hover:border-cyber-cyan/40 text-xs font-mono text-gray-300 hover:text-white transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-cyber-green" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Signature'}</span>
            </button>

            <button
              onClick={onOpenShield}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-crimson/10 border border-cyber-crimson/40 hover:bg-cyber-crimson/20 text-xs font-mono text-cyber-crimson font-medium transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Remediate Leaks</span>
            </button>

            <button
              onClick={onOpenShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/40 hover:bg-cyber-cyan/20 text-xs font-mono text-cyber-cyan font-medium transition-all"
            >
              <span>Export Audit Card</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
