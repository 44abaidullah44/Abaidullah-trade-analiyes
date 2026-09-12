import React from 'react';
import { Play, DollarSign, Percent, FileText, TrendingUp, AlertCircle } from 'lucide-react';

interface AnalysisFormProps {
  assetName: string;
  setAssetName: (val: string) => void;
  accountBalance: string;
  setAccountBalance: (val: string) => void;
  riskPercentage: string;
  setRiskPercentage: (val: string) => void;
  userNotes: string;
  setUserNotes: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  hasImages: boolean;
  imageCount: number;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  assetName,
  setAssetName,
  accountBalance,
  setAccountBalance,
  riskPercentage,
  setRiskPercentage,
  userNotes,
  setUserNotes,
  onAnalyze,
  isLoading,
  hasImages,
  imageCount,
}) => {
  return (
    <div id="analysis-form-container" className="bg-[#131318] border border-white/5 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-wider uppercase text-white/90 font-mono">
            Trade Settings & Risk Parameters
          </h2>
        </div>
        <p className="text-xs text-white/50 mt-0.5">
          Provide optional account parameters for exact position sizing and risk calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Asset Pair */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1.5 flex items-center gap-1">
            Asset / Symbol <span className="text-white/20">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. BTC/USDT, EUR/USD, XAU/USD"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            className="w-full bg-[#0f0f12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
          />
        </div>

        {/* Account Balance */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1.5 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Account Balance ($)
          </label>
          <input
            type="number"
            placeholder="e.g. 10000"
            value={accountBalance}
            onChange={(e) => setAccountBalance(e.target.value)}
            className="w-full bg-[#0f0f12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
          />
        </div>

        {/* Risk Percentage */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1.5 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-cyan-400" /> Max Risk Per Trade (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 1.0"
              value={riskPercentage}
              onChange={(e) => setRiskPercentage(e.target.value)}
              className="w-full bg-[#0f0f12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
            />
            {/* Quick Risk Buttons */}
            <div className="flex items-center gap-1">
              {['0.5', '1.0', '2.0'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRiskPercentage(val)}
                  className={`px-2 py-1 text-[10px] font-mono font-bold rounded border transition-colors ${
                    riskPercentage === val
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                      : 'bg-white/5 text-white/50 border-white/10 hover:text-white'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Notes */}
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-white/40 font-mono mb-1.5 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-amber-400" /> Additional Notes / Market Session
        </label>
        <input
          type="text"
          placeholder="e.g. New York session open, Powell speech in 2 hours, watching 1M orderblock..."
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          className="w-full bg-[#0f0f12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          id="btn-analyze-scalp"
          onClick={onAnalyze}
          disabled={isLoading || !hasImages}
          className={`w-full py-3.5 px-6 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
            !hasImages
              ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
              : isLoading
              ? 'bg-emerald-600/40 text-white cursor-wait border border-emerald-500/40 animate-pulse'
              : 'bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] shadow-[0_0_15px_rgba(34,197,94,0.3)] active:scale-[0.99] border border-emerald-400/80 cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>ANALYZING TRADINGVIEW CHARTS WITH GEMINI AI...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-[#0a0a0c]" />
              <span>RUN ABAIDULLAH SCALPING ANALYSIS ({imageCount} CHARTS)</span>
            </>
          )}
        </button>

        {!hasImages && (
          <p className="text-[11px] text-amber-400/80 text-center mt-2 flex items-center justify-center gap-1 font-mono">
            <AlertCircle className="w-3.5 h-3.5" /> Please upload at least 1 chart screenshot or select a preset above to begin.
          </p>
        )}
      </div>
    </div>
  );
};
