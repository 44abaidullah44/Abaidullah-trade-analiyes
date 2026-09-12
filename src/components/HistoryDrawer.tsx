import React from 'react';
import { X, Trash2, Clock, Activity, ArrowRight, ExternalLink } from 'lucide-react';
import { AnalysisResult } from '../types';
import { formatTimestamp, getSignalBadgeColor } from '../utils/helpers';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisResult[];
  onSelectAnalysis: (item: AnalysisResult) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectAnalysis,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0a0a0c]/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#131318] border-l border-white/10 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold tracking-wider uppercase text-white/90 font-mono">
              Analysis History <span className="text-white/40">({history.length})</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="px-2.5 py-1 text-white/60 hover:text-red-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-xs flex items-center gap-1 font-mono cursor-pointer"
                title="Clear History"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-white/40 font-mono text-xs space-y-2">
              <Activity className="w-8 h-8 mx-auto text-white/20" />
              <p>No previous analyses stored yet.</p>
              <p className="text-[11px] text-white/30">Run a chart analysis to save it here automatically.</p>
            </div>
          ) : (
            history.map((item) => {
              const signalColor = getSignalBadgeColor(item.finalSignal);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectAnalysis(item);
                    onClose();
                  }}
                  className="bg-[#0f0f12] hover:bg-[#15151c] border border-white/5 hover:border-white/15 rounded-xl p-3.5 cursor-pointer transition-all duration-200 group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      {item.market}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${signalColor.text} ${signalColor.bg} border ${signalColor.border}`}
                    >
                      {item.finalSignal}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-white/50">
                    <div>
                      <span className="text-white/30">Entry: </span>
                      <span className="text-white/80 font-medium truncate block">{item.tradeSetup.entry}</span>
                    </div>
                    <div>
                      <span className="text-white/30">Score: </span>
                      <span className="text-emerald-400 font-bold">{item.tradeSetup.confidenceScore}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-1.5 border-t border-white/5">
                    <span>{formatTimestamp(item.timestamp)}</span>
                    <span className="flex items-center gap-1 text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                      View Setup <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
