import React from 'react';
import { X, BookOpen, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface SystemRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemRulesModal: React.FC<SystemRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0c]/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#131318] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0f0f12]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold tracking-wider uppercase text-white font-mono">
              ABAIDULLAH TRADER ANALYSIS — MASTER SYSTEM RULES
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-white/80 font-sans leading-relaxed">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-1">
            <h3 className="font-bold text-emerald-400 font-mono text-xs uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Core Directive
            </h3>
            <p className="text-white/80">
              Your objective is NOT to generate many trades. Your objective is to find <span className="font-bold text-white">ONE BEST SCALPING SETUP</span> with high-quality confluence or output <span className="font-bold text-white">NO TRADE</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f12] p-4 rounded-xl border border-white/5 space-y-2">
              <h4 className="font-bold text-cyan-400 font-mono uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 1. Timeframe Hierarchy
              </h4>
              <p className="text-white/60">
                Preferred hierarchy: <span className="font-bold text-white font-mono">15M → 5M → 3M → 1M</span>
              </p>
              <ul className="list-disc list-inside text-white/50 space-y-1 text-[11px]">
                <li>Higher TF: Trend direction & key liquidity zones</li>
                <li>Middle TF: Structure shift & supply/demand</li>
                <li>Lower TF: Precise FVG/Order block entry trigger</li>
              </ul>
            </div>

            <div className="bg-[#0f0f12] p-4 rounded-xl border border-white/5 space-y-2">
              <h4 className="font-bold text-amber-400 font-mono uppercase tracking-wider text-[11px]">
                2. Perfect Entry Rule
              </h4>
              <p className="font-mono text-white/90">
                Liquidity sweep → Structure shift → Displacement → Retest → Entry
              </p>
              <p className="text-white/50 text-[11px]">
                Never chase price. If price is too far from entry zone, state <span className="text-amber-400 font-bold">WAIT FOR RETEST</span>.
              </p>
            </div>
          </div>

          <div className="bg-[#0f0f12] p-4 rounded-xl border border-white/5 space-y-2">
            <h4 className="font-bold text-white font-mono uppercase tracking-wider text-[11px]">
              3. Smart Money Concepts & Technical Confluence Criteria
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <span className="p-2 bg-[#0a0a0c] rounded border border-white/5 text-white/80">✓ Market Structure (BOS / CHoCH)</span>
              <span className="p-2 bg-[#0a0a0c] rounded border border-white/5 text-white/80">✓ Liquidity Sweeps (SSL/BSL)</span>
              <span className="p-2 bg-[#0a0a0c] rounded border border-white/5 text-white/80">✓ Order Blocks & Breakers</span>
              <span className="p-2 bg-[#0a0a0c] rounded border border-white/5 text-white/80">✓ Fair Value Gaps (FVG)</span>
              <span className="p-2 bg-[#0a0a0c] rounded border border-white/5 text-white/80">✓ Support & Resistance</span>
              <span className="p-2 bg-[#0a0a0c] rounded border border-white/5 text-white/80">✓ Min 1:2 Risk to Reward</span>
            </div>
          </div>

          <div className="bg-[#0f0f12] p-4 rounded-xl border border-white/5 space-y-2">
            <h4 className="font-bold text-white font-mono uppercase tracking-wider text-[11px]">
              4. Confidence Score Scale
            </h4>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between"><span className="text-emerald-400 font-bold">90–100%:</span> <span className="text-white/70">Exceptional confluence</span></div>
              <div className="flex justify-between"><span className="text-teal-400 font-bold">80–89%:</span> <span className="text-white/70">Strong setup with multiple confirmations</span></div>
              <div className="flex justify-between"><span className="text-cyan-400 font-bold">70–79%:</span> <span className="text-white/70">Good setup (Recommended entry threshold)</span></div>
              <div className="flex justify-between"><span className="text-amber-400 font-bold">Below 60%:</span> <span className="text-white/70">Prefer NO TRADE unless exceptional reason</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
