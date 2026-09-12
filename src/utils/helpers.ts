import { AnalysisResult, ChartImage } from '../types';

export function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function saveAnalysisToHistory(analysis: AnalysisResult) {
  try {
    const existing = getAnalysisHistory();
    const updated = [analysis, ...existing.filter((item) => item.id !== analysis.id)].slice(0, 30);
    localStorage.setItem('abaidullah_trader_history', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save analysis history:', e);
  }
}

export function getAnalysisHistory(): AnalysisResult[] {
  try {
    const data = localStorage.getItem('abaidullah_trader_history');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load analysis history:', e);
    return [];
  }
}

export function clearAnalysisHistory() {
  try {
    localStorage.removeItem('abaidullah_trader_history');
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

export function getSignalBadgeColor(signal: string) {
  switch (signal) {
    case 'BUY':
      return {
        bg: 'bg-emerald-950/80',
        border: 'border-emerald-500/50',
        text: 'text-emerald-400',
        glow: 'shadow-emerald-500/20',
        badgeBg: 'bg-emerald-500',
      };
    case 'SELL':
      return {
        bg: 'bg-rose-950/80',
        border: 'border-rose-500/50',
        text: 'text-rose-400',
        glow: 'shadow-rose-500/20',
        badgeBg: 'bg-rose-500',
      };
    default:
      return {
        bg: 'bg-slate-800/80',
        border: 'border-slate-600/50',
        text: 'text-slate-300',
        glow: 'shadow-slate-500/10',
        badgeBg: 'bg-slate-500',
      };
  }
}

export function getExecutionBadgeColor(execution: string) {
  switch (execution) {
    case 'ENTER NOW':
      return 'bg-emerald-500 text-slate-950 font-bold';
    case 'WAIT FOR RETEST':
      return 'bg-amber-500 text-slate-950 font-bold';
    case 'WAIT FOR CONFIRMATION':
      return 'bg-blue-500 text-slate-950 font-bold';
    default:
      return 'bg-slate-700 text-slate-200 font-medium';
  }
}
