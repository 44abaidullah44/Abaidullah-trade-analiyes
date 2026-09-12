import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisForm } from './components/AnalysisForm';
import { AnalysisResultView } from './components/AnalysisResultView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SystemRulesModal } from './components/SystemRulesModal';
import { ImageModal } from './components/ImageModal';
import { ChartImage, AnalysisResult, SamplePresetChart } from './types';
import { saveAnalysisToHistory, getAnalysisHistory, clearAnalysisHistory } from './utils/helpers';
import { convertImageToGeminiFormat } from './utils/imageUtils';
import { AlertCircle, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [images, setImages] = useState<ChartImage[]>([]);
  const [assetName, setAssetName] = useState<string>('');
  const [accountBalance, setAccountBalance] = useState<string>('10000');
  const [riskPercentage, setRiskPercentage] = useState<string>('1.0');
  const [userNotes, setUserNotes] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(getAnalysisHistory());
  }, []);

  // Handle uploading files
  const handleAddImages = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const availableSlots = 5 - images.length;
    if (availableSlots <= 0) return;

    const filesToProcess = fileArray.slice(0, availableSlots);
    const tfOrder = ['15M', '5M', '3M', '1M', '1H'];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const { url, base64Data, mimeType } = await convertImageToGeminiFormat(file);
        const currentCount = images.length + i;
        const defaultTimeframe = tfOrder[currentCount % tfOrder.length];

        const newImg: ChartImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          url,
          base64Data,
          mimeType,
          name: file.name,
          timeframe: defaultTimeframe,
        };

        setImages((prev) => [...prev, newImg].slice(0, 5));
      } catch (err) {
        console.error('Failed to process image:', err);
      }
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUpdateTimeframe = (id: string, timeframe: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, timeframe } : img))
    );
  };

  // Load Preset Charts
  const handleLoadPreset = async (preset: SamplePresetChart) => {
    setAssetName(preset.asset);
    setError(null);

    const processedPresetImages: ChartImage[] = [];
    for (let idx = 0; idx < preset.images.length; idx++) {
      const img = preset.images[idx];
      const { url, base64Data, mimeType } = await convertImageToGeminiFormat(img.url, 'image/svg+xml');
      processedPresetImages.push({
        id: `preset-${preset.id}-${idx}`,
        url,
        base64Data,
        mimeType: mimeType || 'image/png',
        name: img.name,
        timeframe: img.timeframe,
      });
    }

    setImages(processedPresetImages);
  };

  // Trigger analysis call to server API
  const handleAnalyze = async () => {
    if (images.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const payloadImages = images.map((img) => ({
        data: img.base64Data,
        mimeType: img.mimeType || 'image/png',
        timeframe: img.timeframe,
        name: img.name,
      }));

      const res = await fetch('/api/analyze-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: payloadImages,
          assetName: assetName.trim() || undefined,
          accountBalance: accountBalance ? parseFloat(accountBalance) : undefined,
          riskPercentage: riskPercentage ? parseFloat(riskPercentage) : undefined,
          userNotes: userNotes.trim() || undefined,
        }),
      });

      const responseText = await res.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch {
        if (res.status === 413) {
          throw new Error('Image files are too large. Please upload smaller chart screenshots.');
        } else if (res.status === 504 || res.status === 502) {
          throw new Error('AI analysis gateway timed out. Please retry with 3 screenshots.');
        }
        throw new Error(
          `Server returned status ${res.status}: ${
            responseText.slice(0, 150) || 'Unexpected response'
          }`
        );
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete chart analysis.');
      }

      const result: AnalysisResult = data.analysis;

      setCurrentAnalysis(result);
      saveAnalysisToHistory(result);
      setHistory(getAnalysisHistory());

      // Scroll to result view
      setTimeout(() => {
        document.getElementById('analysis-result-view')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred while contacting the AI analysis server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setImages([]);
    setAssetName('');
    setUserNotes('');
    setCurrentAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e4e4e7] flex flex-col font-sans selection:bg-emerald-500 selection:text-[#0a0a0c]">
      {/* Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSystemRules={() => setIsRulesOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Intro banner if no current analysis */}
        {!currentAnalysis && (
          <div className="bg-[#131318] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold uppercase tracking-wider">
                    TradingView Scalping Engine
                  </span>
                  <span className="text-xs text-white/40 font-mono">• Smart Money Concepts (SMC)</span>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-white/90 tracking-tight">
                  Upload 3–5 TradingView screenshots for multi-timeframe precision setup.
                </h2>
                <p className="text-xs text-white/50">
                  Calculates Order Blocks, FVG, Liquidity Sweeps, CHoCH/BOS, Entry, Stop Loss, Take Profits & Confidence Score.
                </p>
              </div>

              {images.length > 0 && (
                <button
                  onClick={handleResetForm}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-xs font-mono font-medium flex items-center gap-1.5 border border-white/10 transition-colors flex-shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear All Charts
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-xs text-red-300 flex items-start gap-3 shadow-lg animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-red-300 font-mono">Analysis Notice</h4>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Upload & Form Section */}
        <ImageUploader
          images={images}
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
          onUpdateTimeframe={handleUpdateTimeframe}
          onLoadPreset={handleLoadPreset}
          onPreviewImage={(url) => setPreviewImageUrl(url)}
        />

        <AnalysisForm
          assetName={assetName}
          setAssetName={setAssetName}
          accountBalance={accountBalance}
          setAccountBalance={setAccountBalance}
          riskPercentage={riskPercentage}
          setRiskPercentage={setRiskPercentage}
          userNotes={userNotes}
          setUserNotes={setUserNotes}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          hasImages={images.length > 0}
          imageCount={images.length}
        />

        {/* Analysis Result Output View */}
        {currentAnalysis && (
          <div className="pt-4 border-t border-white/10">
            <AnalysisResultView analysis={currentAnalysis} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-white/10 bg-[#0f0f12] flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-mono text-white/50">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.6)]"></span>
            <span className="text-[10px] uppercase text-white/60">Risk Protocol: {riskPercentage}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
            <span className="text-[10px] uppercase text-white/60">SMC Engine: Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
            <span className="text-[10px] uppercase text-white/40">Abaidullah Trader Analysis</span>
          </div>
        </div>
        <p className="text-[9px] uppercase text-white/30 tracking-tight text-center sm:text-right">
          Educational scalping analysis. Trade at your own risk. Past performance does not guarantee future results.
        </p>
      </footer>

      {/* Modals & History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectAnalysis={(selected) => setCurrentAnalysis(selected)}
        onClearHistory={() => {
          clearAnalysisHistory();
          setHistory([]);
        }}
      />

      <SystemRulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <ImageModal imageUrl={previewImageUrl} onClose={() => setPreviewImageUrl(null)} />
    </div>
  );
}
