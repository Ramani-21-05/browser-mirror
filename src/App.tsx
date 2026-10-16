import React, { useEffect, useState, useCallback } from 'react';
import { CompleteAuditData } from './types/telemetry';
import { runFullAudit } from './modules/auditMaster';
import { Header } from './components/Header';
import { ScanProgress } from './components/ScanProgress';
import { EntropyScoreCard } from './components/EntropyScoreCard';
import { WebGLInspector } from './components/WebGLInspector';
import { AudioInspector } from './components/AudioInspector';
import { CanvasInspector } from './components/CanvasInspector';
import { WebRTCInspector } from './components/WebRTCInspector';
import { HardwareInspector } from './components/HardwareInspector';
import { FontInspector } from './components/FontInspector';
import { QuirksInspector } from './components/QuirksInspector';
import { DefenseShield } from './components/DefenseShield';
import { ShareModal } from './components/ShareModal';
import { ShieldCheck, Terminal, Cpu, Filter, Lock, ArrowRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [auditData, setAuditData] = useState<CompleteAuditData | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scanProgress, setScanProgress] = useState<number>(10);
  const [statusText, setStatusText] = useState<string>('Initializing Core Diagnostic...');
  
  const [isShieldOpen, setIsShieldOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'graphics' | 'audio' | 'network' | 'hardware'>('all');

  const executeAudit = useCallback(async () => {
    setIsScanning(true);
    setScanProgress(15);
    setStatusText('Spinning Up Cryptographic Entropy Engine...');

    try {
      const result = await runFullAudit((stepText, progressPct) => {
        setStatusText(stepText);
        setScanProgress(progressPct);
      });

      setAuditData(result);
      
      // If privacy is hardened, trigger subtle celebration
      if (result.shieldGrade === 'HARDENED' || result.shieldGrade === 'STEALTH') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#00f0ff', '#10b981', '#a855f7'],
        });
      }
    } catch (err) {
      console.error('Audit execution error:', err);
      setStatusText('Diagnostic completed with partial fallbacks.');
    } finally {
      setIsScanning(false);
    }
  }, []);

  useEffect(() => {
    executeAudit();
  }, [executeAudit]);

  return (
    <div className="min-h-screen bg-obsidian text-gray-200 flex flex-col font-sans crt-overlay">
      
      {/* Sticky Header */}
      <Header
        onRescan={executeAudit}
        onShare={() => setIsShareOpen(true)}
        isScanning={isScanning}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-surface-border text-xs font-mono text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <Terminal className="w-3.5 h-3.5" />
            <span>Zero-Permission Client-Side Telemetry Inspection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-mono font-extrabold tracking-tight text-white leading-tight">
            What the internet whispers about your device before you type a letter.
          </h1>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl leading-relaxed">
            Every website silently gathers dozens of microscopic hardware & graphics nuances to construct a permanent, cross-site tracking fingerprint. Here is your full diagnostic exposure.
          </p>
        </div>

        {/* Progress or Hero Card */}
        {isScanning && !auditData ? (
          <div className="py-12 flex items-center justify-center">
            <ScanProgress progress={scanProgress} statusText={statusText} />
          </div>
        ) : auditData ? (
          <div className="flex flex-col gap-8">
            
            {/* Flagship Hero Scorecard */}
            <EntropyScoreCard
              data={auditData}
              onOpenShield={() => setIsShieldOpen(true)}
              onOpenShare={() => setIsShareOpen(true)}
            />

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyber-cyan" />
                <span className="text-xs font-mono font-semibold text-gray-300">
                  Telemetry Inspectors:
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {[
                  { id: 'all', label: 'All 7 Engines' },
                  { id: 'graphics', label: 'GPU & WebGL' },
                  { id: 'audio', label: 'Audio & Canvas' },
                  { id: 'network', label: 'WebRTC & Latency' },
                  { id: 'hardware', label: 'Hardware & Fonts' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeCategory === cat.id
                        ? 'bg-cyber-cyan/15 border border-cyber-cyan/50 text-cyber-cyan font-bold shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                        : 'bg-surface-card border border-surface-border text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {(activeCategory === 'all' || activeCategory === 'graphics') && (
                <WebGLInspector data={auditData.webgl} />
              )}

              {(activeCategory === 'all' || activeCategory === 'audio') && (
                <AudioInspector data={auditData.audio} />
              )}

              {(activeCategory === 'all' || activeCategory === 'audio') && (
                <CanvasInspector data={auditData.canvas} />
              )}

              {(activeCategory === 'all' || activeCategory === 'network') && (
                <WebRTCInspector data={auditData.webrtc} />
              )}

              {(activeCategory === 'all' || activeCategory === 'hardware') && (
                <HardwareInspector data={auditData.hardware} />
              )}

              {(activeCategory === 'all' || activeCategory === 'hardware') && (
                <FontInspector data={auditData.fonts} />
              )}

              {(activeCategory === 'all' || activeCategory === 'graphics') && (
                <QuirksInspector data={auditData.quirks} />
              )}

            </div>

            {/* Callout Banner: Remediate Leaks */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-surface-card via-surface-card to-cyber-cyan/5 border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex flex-col gap-1.5 text-center sm:text-left">
                <span className="text-xs font-mono uppercase tracking-wider text-cyber-cyan font-bold">
                  Take Back Your Digital Privacy
                </span>
                <h3 className="text-lg sm:text-xl font-mono font-bold text-white">
                  Want to neutralize these fingerprinting vectors?
                </h3>
                <p className="text-xs text-gray-400 max-w-xl">
                  Inspect our browser-by-browser remediation matrix to enable native canvas noise injection, block WebRTC IP leaks, and configure RFP defense shields.
                </p>
              </div>

              <button
                onClick={() => setIsShieldOpen(true)}
                className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-cyber-cyan text-black font-mono font-bold text-xs hover:bg-cyber-cyan/90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                <span>Open Defense Shield</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : null}

      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-dark py-8 text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyber-cyan" />
            <span>BrowserMirror is 100% open, private, and client-side.</span>
          </div>
          <div>
            Built with precision by{' '}
            <a
              href="https://rkws.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-cyber-cyan transition-colors font-medium underline underline-offset-4"
            >
              Ramani Krishnan (RKWS)
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isShieldOpen && (
        <DefenseShield onClose={() => setIsShieldOpen(false)} />
      )}

      {isShareOpen && auditData && (
        <ShareModal data={auditData} onClose={() => setIsShareOpen(false)} />
      )}

    </div>
  );
};

export default App;
