import React, { useState } from 'react';
import { Signal } from '../types/waveform';
import { COLOR_PALETTE, sanitizeBits } from '../lib/waveform';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  RotateCw,
  Sparkles,
  AlertTriangle,
  Layers,
  Wand2,
} from 'lucide-react';

interface SignalEditorProps {
  signals: Signal[];
  onChangeSignals: (signals: Signal[]) => void;
  onResetDefault: () => void;
}

export const SignalEditor: React.FC<SignalEditorProps> = ({
  signals,
  onChangeSignals,
  onResetDefault,
}) => {
  const [activeColorPickerId, setActiveColorPickerId] = useState<string | null>(null);

  const handleUpdateSignal = (id: string, updates: Partial<Signal>) => {
    onChangeSignals(
      signals.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleAddSignal = () => {
    const nextIdx = signals.length + 1;
    const defaultColor = COLOR_PALETTE[(nextIdx - 1) % COLOR_PALETTE.length].value;
    const newSignal: Signal = {
      id: `sig-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `SIG_${nextIdx}`,
      bits: '01010101',
      color: defaultColor,
    };
    onChangeSignals([...signals, newSignal]);
  };

  const handleDeleteSignal = (id: string) => {
    if (signals.length <= 1) return;
    onChangeSignals(signals.filter((s) => s.id !== id));
  };

  const handleDuplicateSignal = (signal: Signal) => {
    const duplicate: Signal = {
      ...signal,
      id: `sig-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${signal.name}_copy`,
    };
    const index = signals.findIndex((s) => s.id === signal.id);
    const newSignals = [...signals];
    newSignals.splice(index + 1, 0, duplicate);
    onChangeSignals(newSignals);
  };

  const handleMoveSignal = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= signals.length) return;
    const newSignals = [...signals];
    const temp = newSignals[index];
    newSignals[index] = newSignals[targetIndex];
    newSignals[targetIndex] = temp;
    onChangeSignals(newSignals);
  };

  // Quick transformations
  const handleInvertBits = (id: string, bits: string) => {
    const inverted = bits
      .split('')
      .map((c) => (c === '0' ? '1' : c === '1' ? '0' : c))
      .join('');
    handleUpdateSignal(id, { bits: inverted });
  };

  const handleShiftLeft = (id: string, bits: string) => {
    if (bits.length <= 1) return;
    const shifted = bits.slice(1) + bits[0];
    handleUpdateSignal(id, { bits: shifted });
  };

  const handleShiftRight = (id: string, bits: string) => {
    if (bits.length <= 1) return;
    const shifted = bits[bits.length - 1] + bits.slice(0, -1);
    handleUpdateSignal(id, { bits: shifted });
  };

  const handleRepeatBits = (id: string, bits: string) => {
    const { sanitized } = sanitizeBits(bits);
    if (!sanitized) return;
    handleUpdateSignal(id, { bits: sanitized + sanitized });
  };

  const handleSanitize = (id: string, bits: string) => {
    const { sanitized } = sanitizeBits(bits);
    handleUpdateSignal(id, { bits: sanitized });
  };

  // Presets
  const applyPreset = (presetName: string) => {
    if (presetName === 'default') {
      onResetDefault();
    } else if (presetName === 'counter') {
      onChangeSignals([
        { id: 'cnt-0', name: 'Q0 (LSB)', bits: '0101010101010101', color: '#38bdf8' },
        { id: 'cnt-1', name: 'Q1', bits: '0011001100110011', color: '#818cf8' },
        { id: 'cnt-2', name: 'Q2', bits: '0000111100001111', color: '#a78bfa' },
        { id: 'cnt-3', name: 'Q3 (MSB)', bits: '0000000011111111', color: '#fb7185' },
      ]);
    } else if (presetName === 'spi') {
      onChangeSignals([
        { id: 'spi-1', name: 'CS#', bits: '100000000011', color: '#fbbf24' },
        { id: 'spi-2', name: 'SCLK', bits: '010101010100', color: '#38bdf8' },
        { id: 'spi-3', name: 'MOSI', bits: '011010010000', color: '#34d399' },
        { id: 'spi-4', name: 'MISO', bits: '000110110000', color: '#a78bfa' },
      ]);
    } else if (presetName === 'handshake') {
      onChangeSignals([
        { id: 'hs-1', name: 'REQ', bits: '0011111000', color: '#fb7185' },
        { id: 'hs-2', name: 'ACK', bits: '0000111100', color: '#38bdf8' },
        { id: 'hs-3', name: 'DATA_VALID', bits: '0001110000', color: '#34d399' },
      ]);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Header with Title and Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
            Signal Channels ({signals.length})
          </h2>
        </div>

        {/* Preset quick actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('default')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Default (A, B, C)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('counter')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            4-Bit Counter
          </button>
          <button
            type="button"
            onClick={() => applyPreset('spi')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            SPI Bus
          </button>
          <button
            type="button"
            onClick={() => applyPreset('handshake')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Handshake
          </button>
        </div>
      </div>

      {/* Signal Rows List */}
      <div className="flex flex-col gap-3">
        {signals.map((signal, index) => {
          const { sanitized, hasInvalidChars, rawLength } = sanitizeBits(signal.bits);
          const isColorPickerOpen = activeColorPickerId === signal.id;

          return (
            <div
              key={signal.id}
              className="group relative bg-slate-850/90 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              {/* Left Column: Ordering and Color Swatch */}
              <div className="flex items-center gap-2">
                {/* Up/Down buttons */}
                <div className="flex flex-col -space-y-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveSignal(index, 'up')}
                    title="Move signal up"
                    aria-label={`Move signal ${signal.name} up`}
                    className="p-1 rounded text-slate-500 hover:text-slate-300 disabled:opacity-20 transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === signals.length - 1}
                    onClick={() => handleMoveSignal(index, 'down')}
                    title="Move signal down"
                    aria-label={`Move signal ${signal.name} down`}
                    className="p-1 rounded text-slate-500 hover:text-slate-300 disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Color Button & Palette Popover */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveColorPickerId(isColorPickerOpen ? null : signal.id)
                    }
                    title="Change signal color"
                    aria-label={`Change color for ${signal.name}`}
                    className="w-7 h-7 rounded-md border-2 border-slate-700 shadow-sm flex items-center justify-center transition-transform hover:scale-105"
                    style={{ backgroundColor: signal.color }}
                  />

                  {/* Color Palette dropdown */}
                  {isColorPickerOpen && (
                    <div className="absolute top-9 left-0 z-50 bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-2xl flex flex-col gap-2 w-48">
                      <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                        Select Signal Color
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {COLOR_PALETTE.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              handleUpdateSignal(signal.id, { color: c.value });
                              setActiveColorPickerId(null);
                            }}
                            title={c.name}
                            className="w-7 h-7 rounded-md border border-slate-700/60 hover:scale-110 transition-transform"
                            style={{ backgroundColor: c.value }}
                          />
                        ))}
                      </div>
                      {/* Native Custom Color Picker */}
                      <label className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800 cursor-pointer">
                        <span>Custom Hex</span>
                        <input
                          type="color"
                          value={signal.color}
                          onChange={(e) =>
                            handleUpdateSignal(signal.id, { color: e.target.value })
                          }
                          className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Signal Name Input */}
                <div className="w-32 sm:w-36 flex-shrink-0">
                  <input
                    type="text"
                    value={signal.name}
                    onChange={(e) => handleUpdateSignal(signal.id, { name: e.target.value })}
                    placeholder="Signal Name"
                    aria-label={`Signal name for index ${index + 1}`}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono font-semibold text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Middle Column: Binary Sequence Input with live metrics */}
              <div className="flex-1 flex flex-col gap-1 min-w-[200px]">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={signal.bits}
                    onChange={(e) => handleUpdateSignal(signal.id, { bits: e.target.value })}
                    placeholder="e.g. 00001111"
                    aria-label={`Binary sequence for ${signal.name}`}
                    className={`w-full bg-slate-900 border rounded px-3 py-1.5 text-xs font-mono tracking-widest text-slate-100 focus:outline-none focus:ring-1 transition-colors pr-20 ${
                      hasInvalidChars
                        ? 'border-amber-500/80 focus:border-amber-500 focus:ring-amber-500'
                        : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500'
                    }`}
                  />
                  <div className="absolute right-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {sanitized.length}b
                    </span>
                  </div>
                </div>

                {/* Validation and Helper Bar */}
                <div className="flex items-center justify-between text-[11px] px-1">
                  {hasInvalidChars ? (
                    <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3 h-3" />
                      Contains non-binary characters.
                      <button
                        type="button"
                        onClick={() => handleSanitize(signal.id, signal.bits)}
                        className="underline ml-1 hover:text-amber-300 font-semibold"
                      >
                        Keep 0/1 only
                      </button>
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">
                      {rawLength === 0 ? 'Empty sequence (will render low level)' : 'Valid binary sequence'}
                    </span>
                  )}

                  {/* Fast bit transformation shortcuts */}
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      type="button"
                      onClick={() => handleInvertBits(signal.id, signal.bits)}
                      title="Invert bits (NOT)"
                      className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-colors"
                    >
                      INV
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShiftLeft(signal.id, signal.bits)}
                      title="Shift left (&lt;&lt;)"
                      className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-colors"
                    >
                      &lt;&lt;
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShiftRight(signal.id, signal.bits)}
                      title="Shift right (&gt;&gt;)"
                      className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-colors"
                    >
                      &gt;&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRepeatBits(signal.id, signal.bits)}
                      title="Repeat sequence (2x)"
                      className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-colors"
                    >
                      2×
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Row Action Buttons */}
              <div className="flex items-center gap-1 justify-end pt-1 sm:pt-0">
                <button
                  type="button"
                  onClick={() => handleDuplicateSignal(signal)}
                  title="Duplicate Signal"
                  aria-label={`Duplicate signal ${signal.name}`}
                  className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={signals.length <= 1}
                  onClick={() => handleDeleteSignal(signal.id)}
                  title={signals.length <= 1 ? 'Cannot delete the only signal' : 'Delete Signal'}
                  aria-label={`Delete signal ${signal.name}`}
                  className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Signal Action */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleAddSignal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950/50 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          Add Signal
        </button>

        <span className="text-xs text-slate-400">
          Tip: You can paste raw binary strings directly into any sequence box.
        </span>
      </div>
    </div>
  );
};
