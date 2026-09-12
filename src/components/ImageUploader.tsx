import React, { useRef } from 'react';
import { Upload, X, Eye, Clock, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { ChartImage, SamplePresetChart } from '../types';
import { SAMPLE_PRESETS } from '../data/samplePresets';

interface ImageUploaderProps {
  images: ChartImage[];
  onAddImages: (files: FileList | File[]) => void;
  onRemoveImage: (id: string) => void;
  onUpdateTimeframe: (id: string, timeframe: string) => void;
  onLoadPreset: (preset: SamplePresetChart) => void;
  onPreviewImage: (url: string) => void;
}

const TIMEFRAME_OPTIONS = ['15M', '5M', '3M', '1M', '1H', '4H', '1D', 'Custom'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onAddImages,
  onRemoveImage,
  onUpdateTimeframe,
  onLoadPreset,
  onPreviewImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddImages(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddImages(e.target.files);
    }
  };

  return (
    <div id="image-uploader-container" className="bg-[#131318] border border-white/5 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold tracking-wider uppercase text-white/90 font-mono">
              TradingView Screenshots <span className="text-white/40">({images.length}/5)</span>
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            Upload <span className="text-white/80 font-medium">3 to 5 chart screenshots</span> across timeframes (Hierarchy: 15M → 5M → 3M → 1M).
          </p>
        </div>

        {/* Load Preset Shortcuts */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
          </span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset)}
              className="px-2.5 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 text-white/80 hover:text-emerald-400 border border-white/10 hover:border-white/20 transition-all font-mono font-medium flex items-center gap-1"
              title={preset.description}
            >
              {preset.asset}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Dropzone */}
      {images.length < 5 && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="group relative border border-dashed border-white/10 hover:border-emerald-500/50 bg-[#0f0f12] hover:bg-[#111116] rounded-xl p-6 text-center cursor-pointer transition-all duration-200"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-emerald-500/10 text-white/50 group-hover:text-emerald-400 flex items-center justify-center mx-auto mb-2.5 transition-colors border border-white/5">
            <Upload className="w-5 h-5" />
          </div>

          <p className="text-xs sm:text-sm font-medium text-white/80 group-hover:text-emerald-400 transition-colors">
            Click or drag TradingView chart screenshots here
          </p>
          <p className="text-[11px] text-white/40 mt-1 font-mono">
            Supports PNG, JPG, WEBP • Max 5 screenshots (3-5 recommended)
          </p>
        </div>
      )}

      {/* Uploaded Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative bg-[#0f0f12] rounded-xl border border-white/5 hover:border-white/15 overflow-hidden group shadow-md"
            >
              <div className="aspect-[16/10] bg-[#070709] relative overflow-hidden">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-[#0a0a0c]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => onPreviewImage(img.url)}
                    className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-emerald-500 hover:text-[#0a0a0c] transition-colors"
                    title="Zoom Screenshot"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveImage(img.id)}
                    className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-red-500 hover:text-white transition-colors"
                    title="Remove Screenshot"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[#0a0a0c]/80 border border-white/10 text-[9px] font-mono font-bold text-emerald-400">
                  #{idx + 1}
                </span>
              </div>

              {/* Timeframe Selector & Name */}
              <div className="p-2.5 bg-[#0f0f12] border-t border-white/5 space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] text-white/40 font-mono truncate flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> Timeframe:
                  </span>
                  <select
                    value={img.timeframe}
                    onChange={(e) => onUpdateTimeframe(img.id, e.target.value)}
                    className="bg-white/5 text-emerald-400 text-xs font-mono font-bold rounded px-1.5 py-0.5 border border-white/10 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {TIMEFRAME_OPTIONS.map((tf) => (
                      <option key={tf} value={tf} className="bg-[#131318] text-white">
                        {tf}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[10px] text-white/40 truncate font-mono" title={img.name}>
                  {img.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multi-timeframe Status indicator */}
      {images.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-white/50 bg-[#0f0f12] p-2.5 rounded-lg border border-white/5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            {images.length < 3 ? (
              <span className="text-amber-400/90 font-medium">
                Tip: Uploading {3 - images.length} more screenshot(s) will unlock higher timeframe confluence analysis.
              </span>
            ) : (
              <span className="text-emerald-400 font-medium font-mono text-[11px]">
                Multi-timeframe hierarchy ready ({images.map((i) => i.timeframe).join(' → ')})
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
};
