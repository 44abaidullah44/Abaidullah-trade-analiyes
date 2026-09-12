import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  MinusCircle,
  AlertTriangle,
  Copy,
  Check,
  Download,
  Target,
  Shield,
  Award,
  Zap,
  BarChart3,
  HelpCircle,
  CheckCircle,
  Clock,
  Layers,
  FileText,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import {
  getSignalBadgeColor,
  getExecutionBadgeColor,
  formatTimestamp,
} from '../utils/helpers';

interface AnalysisResultViewProps {
  analysis: AnalysisResult;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report'>('dashboard');

  const signalColors = getSignalBadgeColor(analysis.finalSignal);
  const executionColorClass = getExecutionBadgeColor(analysis.execution);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(analysis.rawReportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReport = () => {
    const element = document.createElement('a');
    const file = new Blob([analysis.rawReportMarkdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `Abaidullah_Analysis_${analysis.market.replace('/', '_')}_${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div id="analysis-result-view" className="space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="bg-[#131318] border border-white/5 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold font-mono tracking-wider text-white flex items-center gap-2">
              <span className="text-emerald-400">ABAIDULLAH</span> ANALYSIS
            </h2>
            <span className="px-2.5 py-1 bg-white/5 text-white/90 border border-white/10 font-mono text-xs font-bold rounded-lg">
              {analysis.market}
            </span>
            <span className="px-2.5 py-1 bg-white/5 text-cyan-400 border border-cyan-500/20 font-mono text-xs rounded-lg flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {analysis.timeframesAnalyzed?.join(' • ') || 'Multi-TF'}
            </span>
            <span className="text-[11px] text-white/40 font-mono">
              {formatTimestamp(analysis.timestamp)}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1 flex items-center gap-2">
            <span className="text-white/40 uppercase text-[10px] tracking-wider font-mono">Market Bias:</span>
            <span className="font-bold text-white uppercase tracking-wider font-mono">
              {analysis.marketBias}
            </span>
          </p>
        </div>

        {/* Action Controls & Tab Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-[#0f0f12] p-1 rounded-xl border border-white/10 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-[#0a0a0c] shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Terminal Dashboard
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'report'
                  ? 'bg-emerald-500 text-[#0a0a0c] shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Official Report Text
            </button>
          </div>

          <button
            onClick={handleCopyReport}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
            title="Copy Report to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownloadReport}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
            title="Download Markdown Report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="space-y-6">
          {/* Signal & Execution Hero Header */}
          <div
            className={`relative rounded-2xl border p-6 md:p-8 overflow-hidden shadow-2xl transition-all ${signalColors.bg} ${signalColors.border} ${signalColors.glow}`}
          >
            {/* Background Accent Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Signal Block */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">
                    FINAL SCALPING SIGNAL
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase ${executionColorClass}`}>
                    {analysis.execution}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {analysis.finalSignal === 'BUY' && (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                      <TrendingUp className="w-8 h-8 sm:w-9 sm:h-9" />
                    </div>
                  )}
                  {analysis.finalSignal === 'SELL' && (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                      <TrendingDown className="w-8 h-8 sm:w-9 sm:h-9" />
                    </div>
                  )}
                  {analysis.finalSignal === 'NO TRADE' && (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                      <MinusCircle className="w-8 h-8 sm:w-9 sm:h-9" />
                    </div>
                  )}

                  <div>
                    <h3 className={`text-3xl md:text-5xl font-black font-mono tracking-tight ${signalColors.text}`}>
                      {analysis.finalSignal}
                    </h3>
                    <p className="text-xs text-white/50 font-mono mt-1">
                      Target Asset: <span className="text-white font-bold">{analysis.market}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Confidence Gauge */}
              <div className="md:col-span-5 bg-[#0f0f12] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                    CONFIDENCE SCORE
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black font-mono text-white">
                      {analysis.tradeSetup.confidenceScore}
                    </span>
                    <span className="text-lg font-mono text-emerald-400">%</span>
                  </div>
                  <span className="text-[10px] text-white/50 font-mono mt-1 block">
                    {analysis.tradeSetup.confidenceScore >= 80
                      ? 'High Quality Confluence Setup'
                      : analysis.tradeSetup.confidenceScore >= 70
                      ? 'Good Setup • Follow Risk Rules'
                      : 'Moderate / Low Quality • Exercise Caution'}
                  </span>
                </div>

                {/* Score Circular Progress Ring */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-white/10"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeDasharray={200}
                      strokeDashoffset={200 - (200 * analysis.tradeSetup.confidenceScore) / 100}
                      strokeLinecap="round"
                      className={
                        analysis.tradeSetup.confidenceScore >= 80
                          ? 'text-emerald-400'
                          : analysis.tradeSetup.confidenceScore >= 70
                          ? 'text-cyan-400'
                          : 'text-amber-400'
                      }
                      fill="transparent"
                    />
                  </svg>
                  <Award className="w-6 h-6 text-emerald-400 absolute" />
                </div>
              </div>
            </div>
          </div>

          {/* Trade Setup Grid */}
          <div className="bg-[#131318] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white font-mono tracking-wider uppercase flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                TRADE SETUP & PRICE LEVELS
              </h3>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-mono font-bold">
                R/R Ratio: {analysis.tradeSetup.riskRewardRatio}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Entry Level */}
              <div className="bg-[#0f0f12] border border-white/10 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                  ENTRY ZONE
                </span>
                <p className="text-base font-bold font-mono text-cyan-400">
                  {analysis.tradeSetup.entry}
                </p>
                <span className="text-[10px] text-white/40 font-mono block">
                  Execution: {analysis.execution}
                </span>
              </div>

              {/* Stop Loss */}
              <div className="bg-[#0f0f12] border border-red-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block">
                  STOP LOSS (SL)
                </span>
                <p className="text-base font-bold font-mono text-red-400">
                  {analysis.tradeSetup.stopLoss}
                </p>
                <span className="text-[10px] text-white/40 font-mono block">
                  Logical Invalidation
                </span>
              </div>

              {/* Take Profit 1 */}
              <div className="bg-[#0f0f12] border border-emerald-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                  TAKE PROFIT 1 (TP1)
                </span>
                <p className="text-base font-bold font-mono text-emerald-400">
                  {analysis.tradeSetup.takeProfit1}
                </p>
                <span className="text-[10px] text-white/40 font-mono block">
                  Primary Target
                </span>
              </div>

              {/* Take Profit 2 */}
              <div className="bg-[#0f0f12] border border-emerald-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                  TAKE PROFIT 2 (TP2)
                </span>
                <p className="text-base font-bold font-mono text-emerald-300">
                  {analysis.tradeSetup.takeProfit2}
                </p>
                <span className="text-[10px] text-white/40 font-mono block">
                  Secondary Runner Target
                </span>
              </div>
            </div>
          </div>

          {/* WHY THIS TRADE? & CONFLUENCE BREAKDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Why this trade reasons */}
            <div className="lg:col-span-7 bg-[#131318] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white font-mono tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                WHY THIS TRADE? (KEY CONFLUENCE)
              </h3>

              <div className="space-y-3">
                {analysis.reasonsForTrade.map((reason, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-[#0f0f12] p-3 rounded-xl border border-white/5"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed font-sans">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Confluence Radar / Score Breakdown */}
            {analysis.confluenceScores && (
              <div className="lg:col-span-5 bg-[#131318] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white font-mono tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-3">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  CONFLUENCE MATRIX
                </h3>

                <div className="space-y-2.5 text-xs font-mono">
                  <ConfluenceBar label="HTF Bias" score={analysis.confluenceScores.higherTimeframeBias} max={15} />
                  <ConfluenceBar label="Market Structure" score={analysis.confluenceScores.marketStructure} max={15} />
                  <ConfluenceBar label="Liquidity Sweep" score={analysis.confluenceScores.liquidity} max={15} />
                  <ConfluenceBar label="Entry Zone Quality" score={analysis.confluenceScores.entryZoneQuality} max={15} />
                  <ConfluenceBar label="Price Action (PA)" score={analysis.confluenceScores.priceActionConfirmation} max={10} />
                  <ConfluenceBar label="FVG / Order Block" score={analysis.confluenceScores.fvgOrderBlock} max={10} />
                  <ConfluenceBar label="Risk / Reward" score={analysis.confluenceScores.riskReward} max={10} />
                  <ConfluenceBar label="MTF Alignment" score={analysis.confluenceScores.multiTimeframeAlignment} max={5} />
                  <ConfluenceBar label="Indicator / Momentum" score={analysis.confluenceScores.indicatorMomentum} max={5} />
                </div>
              </div>
            )}
          </div>

          {/* MARKET STRUCTURE BREAKDOWN */}
          <div className="bg-[#131318] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-3">
              <Layers className="w-4 h-4 text-cyan-400" />
              DETAILED MARKET STRUCTURE (SMC & PRICE ACTION)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <StructureCard title="Trend / Direction" value={analysis.marketStructure.trend} />
              <StructureCard title="BOS / CHoCH / MSS" value={analysis.marketStructure.bosChoch} />
              <StructureCard title="Liquidity Pools / Sweep" value={analysis.marketStructure.liquidity} />
              <StructureCard title="Support & Resistance" value={analysis.marketStructure.supportResistance} />
              <StructureCard title="Order Block / Zone" value={analysis.marketStructure.orderBlock} />
              <StructureCard title="Fair Value Gap (FVG)" value={analysis.marketStructure.fvg} />
              <StructureCard title="Momentum & Volume" value={analysis.marketStructure.momentum} />
              <StructureCard title="Market Classification" value={analysis.marketBias} />
            </div>
          </div>

          {/* INVALIDATION & POSITION SIZING */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invalidation Rules */}
            <div className="bg-[#131318] border border-red-500/20 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-red-400 font-mono tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                SETUP INVALIDATION CONDITION
              </h3>
              <p className="text-xs text-white/80 leading-relaxed font-sans bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                {analysis.invalidation}
              </p>
            </div>

            {/* Position Sizing if available */}
            {analysis.positionSizing ? (
              <div className="bg-[#131318] border border-emerald-500/20 rounded-2xl p-6 shadow-xl space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 font-mono tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-3">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  RISK MANAGEMENT & POSITION SIZING
                </h3>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-white/50">
                    <span>Account Balance:</span>
                    <span className="text-white font-bold">${analysis.positionSizing.accountBalance?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Max Risk Per Trade:</span>
                    <span className="text-emerald-400 font-bold">{analysis.positionSizing.riskPercentage}%</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Dollar Risk Amount:</span>
                    <span className="text-red-400 font-bold">${analysis.positionSizing.riskAmountDollars?.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-white/40 mt-2 pt-2 border-t border-white/5 leading-relaxed">
                    {analysis.positionSizing.lotOrContractAdvice}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#131318] border border-white/5 rounded-2xl p-6 shadow-xl space-y-3">
                <h3 className="text-sm font-bold text-white/80 font-mono tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-3">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  DEFAULT RISK GUIDELINE
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans">
                  Default educational guideline: <span className="text-emerald-400 font-bold font-mono">0.5% – 1.0% maximum risk per trade</span>. Never chase price or move stop loss after entry.
                </p>
              </div>
            )}
          </div>

          {/* Risk Warning Disclaimer */}
          <div className="bg-[#0f0f12] border border-white/5 rounded-xl p-4 text-[11px] text-white/40 font-mono leading-relaxed">
            <span className="font-bold text-white/60">RISK WARNING:</span> {analysis.riskWarning}
          </div>
        </div>
      ) : (
        /* Raw Report Text View */
        <div className="bg-[#131318] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white font-mono tracking-wider uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              OFFICIAL ABAIDULLAH TRADER REPORT (MARKDOWN)
            </h3>
            <button
              onClick={handleCopyReport}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>

          <pre className="bg-[#0f0f12] p-6 rounded-xl border border-white/10 text-xs font-mono text-white/80 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
            {analysis.rawReportMarkdown}
          </pre>
        </div>
      )}
    </div>
  );
};

/* Helper subcomponents */
function ConfluenceBar({ label, score, max }: { label: string; score: number; max: number }) {
  const percentage = Math.min(100, Math.round((score / max) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-white/60">{label}</span>
        <span className="text-emerald-400 font-bold font-mono">
          {score}/{max} ({percentage}%)
        </span>
      </div>
      <div className="w-full h-1.5 bg-[#0a0a0c] rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function StructureCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[#0f0f12] border border-white/5 rounded-xl p-3.5 space-y-1">
      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
        {title}
      </span>
      <p className="text-xs font-semibold text-white/90 leading-snug font-mono">{value || 'N/A'}</p>
    </div>
  );
}
