import React, { useState } from 'react';
import { Signal, DiagramSettings } from '../types/waveform';
import { generateSvgString, downloadSvg } from '../lib/exportSvg';
import { downloadPdf } from '../lib/exportPdf';
import { Download, FileCode, Check, Loader2, AlertCircle } from 'lucide-react';

interface ExportControlsProps {
  signals: Signal[];
  settings: DiagramSettings;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ signals, settings }) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  const handleExportSvg = () => {
    try {
      const svg = generateSvgString(signals, settings);
      downloadSvg(svg, 'waveform-diagram.svg');
      showNotification('success', 'Downloaded waveform-diagram.svg');
    } catch (err: any) {
      showNotification('error', `SVG export failed: ${err.message || err}`);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      await downloadPdf(signals, settings, 'waveform-diagram.pdf', {
        pageSize: 'custom-diagram-size',
        scale: 2,
      });
      showNotification('success', 'Downloaded waveform-diagram.pdf');
    } catch (err: any) {
      showNotification('error', `PDF export failed: ${err.message || err}`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopySvg = async () => {
    try {
      const svg = generateSvgString(signals, settings);
      await navigator.clipboard.writeText(svg);
      showNotification('success', 'SVG markup copied to clipboard');
    } catch (err: any) {
      showNotification('error', `Could not copy to clipboard: ${err.message || err}`);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Toast Feedback Notification */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`absolute -bottom-10 right-0 z-50 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium shadow-xl border animate-bounce ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60'
              : 'bg-rose-950/90 text-rose-300 border-rose-700/60'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Copy SVG Action */}
      <button
        type="button"
        onClick={handleCopySvg}
        title="Copy raw SVG markup to clipboard"
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/80 transition-all hover:text-white"
      >
        <FileCode className="w-3.5 h-3.5 text-slate-400" />
        <span>Copy SVG</span>
      </button>

      {/* Export SVG Action */}
      <button
        type="button"
        onClick={handleExportSvg}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
      >
        <Download className="w-3.5 h-3.5 text-cyan-400" />
        <span>Export SVG</span>
      </button>

      {/* Export PDF Action */}
      <button
        type="button"
        disabled={isExportingPdf}
        onClick={handleExportPdf}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-900/60 text-white text-xs font-semibold shadow-md shadow-cyan-950/40 transition-all hover:scale-[1.02] disabled:cursor-wait"
      >
        {isExportingPdf ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        <span>{isExportingPdf ? 'Generating PDF...' : 'Export PDF'}</span>
      </button>
    </div>
  );
};
