import React, { useState } from 'react';
import { Signal, DiagramSettings } from './types/waveform';
import { DEFAULT_SIGNALS, DEFAULT_SETTINGS, sanitizeBits } from './lib/waveform';
import { WaveformCanvas } from './components/WaveformCanvas';
import { SignalEditor } from './components/SignalEditor';
import { DiagramSettingsPanel } from './components/DiagramSettings';
import { ExportControls } from './components/ExportControls';
import { Activity, SlidersHorizontal, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>(DEFAULT_SIGNALS);
  const [settings, setSettings] = useState<DiagramSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<'signals' | 'settings'>('signals');

  const handleResetDefaultSignals = () => {
    setSignals(DEFAULT_SIGNALS);
  };

  const handleResetDefaultSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Toggle single bit at signalIndex and slotIndex
  const handleToggleBit = (signalIndex: number, slotIndex: number) => {
    if (signalIndex < 0 || signalIndex >= signals.length) return;
    const targetSignal = signals[signalIndex];
    const { sanitized } = sanitizeBits(targetSignal.bits);

    let newBits = sanitized;
    if (slotIndex < newBits.length) {
      const currentBit = newBits[slotIndex];
      const toggled = currentBit === '1' ? '0' : '1';
      newBits = newBits.substring(0, slotIndex) + toggled + newBits.substring(slotIndex + 1);
    } else {
      // Pad up to slotIndex with 0s and set slotIndex to '1'
      const paddingCount = slotIndex - newBits.length;
      newBits = newBits + '0'.repeat(paddingCount) + '1';
    }

    const updatedSignals = [...signals];
    updatedSignals[signalIndex] = {
      ...targetSignal,
      bits: newBits,
    };
    setSignals(updatedSignals);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-900/30">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-mono">
                Waveform Studio
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Minimalist digital timing diagram editor & vector exporter
            </p>
          </div>
        </div>

        {/* Export and Action Controls */}
        <div className="flex items-center gap-3">
          <ExportControls signals={signals} settings={settings} />
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Section 1: Waveform Diagram Preview (Centerpiece) */}
        <section aria-label="Waveform Diagram Preview" className="flex flex-col gap-2">
          <WaveformCanvas
            signals={signals}
            settings={settings}
            onToggleBit={handleToggleBit}
          />
        </section>

        {/* Section 2: Navigation Tabs on mobile / compact view */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('signals')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'signals'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Signal Channels ({signals.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'settings'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Diagram Settings
            </button>
          </div>
        </div>

        {/* Section 3: Configuration Panels */}
        <section className="flex flex-col gap-6">
          {activeTab === 'signals' ? (
            <SignalEditor
              signals={signals}
              onChangeSignals={setSignals}
              onResetDefault={handleResetDefaultSignals}
            />
          ) : (
            <DiagramSettingsPanel
              settings={settings}
              onChangeSettings={setSettings}
              onResetSettings={handleResetDefaultSettings}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
