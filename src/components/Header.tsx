import React from 'react';
import { ShieldCheck, History, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenSystemRules: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenSystemRules,
  historyCount,
}) => {
  return (
    <header id="terminal-header" className="sticky top-0 z-40 bg-[#0f0f12]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.7)] flex-shrink-0 animate-pulse"></div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-widest uppercase text-white/90 font-mono">
                Abaidullah Trader Analysis <span className="font-normal text-white/40 ml-1.5 text-xs">v4.2.0</span>
              </h1>
              <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-mono font-bold bg-white/5 text-emerald-400 border border-emerald-500/30 rounded">
                SMC SCALP PRO
              </span>
            </div>
            <p className="text-[11px] text-white/40 flex items-center gap-2 mt-0.5">
              <span>Multi-Timeframe Scalping Engine</span>
              <span className="text-white/20">•</span>
              <span className="font-mono text-[10px] text-white/60">15M → 5M → 3M → 1M</span>
            </p>
          </div>
        </div>

        {/* Live Session Indicators & Controls */}
        <div className="flex items-center gap-4 sm:gap-6 text-[10px] font-mono tracking-tight justify-between w-full sm:w-auto">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-white/40 uppercase text-[9px]">Scanning Session</span>
            <span className="text-white/90 font-medium">NY / LONDON OVERLAP</span>
          </div>
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-white/40 uppercase text-[9px]">Data Feed</span>
            <span className="text-emerald-400 font-medium">TRADINGVIEW RT-API</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-system-prompt-rules"
              onClick={onOpenSystemRules}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
              title="View Master System Rules"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Master Rules</span>
            </button>

            <button
              id="btn-open-history"
              onClick={onOpenHistory}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-500 text-[#0a0a0c] text-[10px] font-bold rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
