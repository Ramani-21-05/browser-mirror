import React, { useState, useRef } from 'react';
import { CompleteAuditData } from '../types/telemetry';
import { Share2, Download, Copy, Check, X, Shield, Fingerprint } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ShareModalProps {
  data: CompleteAuditData;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ data, onClose }) => {
  const [copiedText, setCopiedText] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const shareText = `🛡️ I tested my browser & hardware telemetry on BrowserMirror (https://mirror.rkws.in):
• Global Device Rarity: 1 in ${data.rarityOneInN.toLocaleString()}
• Shannon Entropy: ${data.totalEntropyBits} bits
• Trackability Index: ${data.uniquenessPercentage}%
• Unmasked GPU: ${data.webgl.renderer}
• Shield Grade: ${data.shieldGrade}
• Leaks Detected: ${data.vulnerabilitiesCount} high-entropy vectors

Find out what trackers silently extract from your device before you type a letter: https://mirror.rkws.in`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `BrowserMirror-Audit-${data.totalEntropyBits}bits.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export scorecard PNG:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl bg-surface-card border border-surface-border p-6 flex flex-col gap-5 relative shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-cyber-cyan" />
            <h3 className="text-base font-mono font-bold text-white">
              Export Privacy Scorecard
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-surface-dark border border-surface-border hover:border-white/20 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Graphic Badge Card (Export Target) */}
        <div
          ref={cardRef}
          className="p-6 rounded-xl bg-obsidian border-2 border-cyber-cyan/40 flex flex-col gap-4 relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)]"
        >
          {/* Subtle watermark */}
          <div className="flex items-center justify-between border-b border-surface-border/80 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyber-cyan" />
              <span className="font-mono text-xs font-bold tracking-wider text-white">
                Browser<span className="text-cyber-cyan">Mirror</span>.rkws.in
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan uppercase font-bold">
              {data.shieldGrade}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-1">
            <div>
              <span className="text-[10px] font-mono uppercase text-gray-400">Device Rarity</span>
              <div className="text-2xl font-mono font-bold text-white">
                1 in {data.rarityOneInN.toLocaleString()}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-gray-400">Shannon Entropy</span>
              <div className="text-2xl font-mono font-bold text-cyber-cyan">
                {data.totalEntropyBits} <span className="text-xs font-normal text-gray-400">bits</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-dark/80 border border-surface-border text-xs font-mono">
            <span className="text-gray-400 text-[10px] block">Unmasked Graphics Engine:</span>
            <span className="text-white font-medium truncate block mt-0.5">
              {data.webgl.renderer}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 border-t border-surface-border/80 pt-2.5">
            <div className="flex items-center gap-1.5 truncate">
              <Fingerprint className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
              <span className="truncate">{data.globalFingerprintHash.slice(0, 24)}...</span>
            </div>
            <span className="shrink-0 text-cyber-green">100% Client Probed</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/40 hover:bg-cyber-cyan/20 text-cyber-cyan font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Rendering Image...' : 'Download PNG Card'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surface-dark border border-surface-border hover:border-white/30 text-white font-medium transition-all"
          >
            {copiedText ? <Check className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? 'Copied Share Text!' : 'Copy Text for Reddit / LinkedIn'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
