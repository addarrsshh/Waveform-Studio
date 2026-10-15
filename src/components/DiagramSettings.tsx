import React from 'react';
import { DiagramSettings, UnequalLengthPolicy, ThemePreset } from '../types/waveform';
import { Sliders, Grid, Palette, RotateCcw } from 'lucide-react';

interface DiagramSettingsProps {
  settings: DiagramSettings;
  onChangeSettings: (settings: DiagramSettings) => void;
  onResetSettings: () => void;
}

export const DiagramSettingsPanel: React.FC<DiagramSettingsProps> = ({
  settings,
  onChangeSettings,
  onResetSettings,
}) => {
  const update = <K extends keyof DiagramSettings>(key: K, value: DiagramSettings[K]) => {
    onChangeSettings({
      ...settings,
      [key]: value,
    });
  };

  const applyTheme = (theme: ThemePreset) => {
    if (theme === 'technical-navy') {
      onChangeSettings({
        ...settings,
        themePreset: theme,
        backgroundColor: '#0f172a',
        gridColor: '#334155',
        labelColor: '#e2e8f0',
      });
    } else if (theme === 'obsidian') {
      onChangeSettings({
        ...settings,
        themePreset: theme,
        backgroundColor: '#09090b',
        gridColor: '#27272a',
        labelColor: '#f4f4f5',
      });
    } else if (theme === 'clean-white') {
      onChangeSettings({
        ...settings,
        themePreset: theme,
        backgroundColor: '#ffffff',
        gridColor: '#e2e8f0',
        labelColor: '#0f172a',
      });
    } else if (theme === 'slate-gray') {
      onChangeSettings({
        ...settings,
        themePreset: theme,
        backgroundColor: '#1e293b',
        gridColor: '#475569',
        labelColor: '#f1f5f9',
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-5">
      {/* Settings Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
            Diagram Settings
          </h2>
        </div>
        <button
          type="button"
          onClick={onResetSettings}
          title="Reset to default settings"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 1: Dimensions & Timing */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Timing & Dimensions
          </div>

          {/* Slot Width */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="slot-width" className="text-slate-400">
                Time Slot Width
              </label>
              <span className="font-mono text-cyan-400 font-semibold">{settings.slotWidth}px</span>
            </div>
            <input
              id="slot-width"
              type="range"
              min="24"
              max="120"
              step="2"
              value={settings.slotWidth}
              onChange={(e) => update('slotWidth', Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Signal Height */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="signal-height" className="text-slate-400">
                Waveform Height (0-to-1)
              </label>
              <span className="font-mono text-cyan-400 font-semibold">{settings.signalHeight}px</span>
            </div>
            <input
              id="signal-height"
              type="range"
              min="20"
              max="70"
              step="2"
              value={settings.signalHeight}
              onChange={(e) => update('signalHeight', Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Row Spacing */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="row-spacing" className="text-slate-400">
                Signal Row Spacing
              </label>
              <span className="font-mono text-cyan-400 font-semibold">{settings.rowSpacing}px</span>
            </div>
            <input
              id="row-spacing"
              type="range"
              min="12"
              max="60"
              step="2"
              value={settings.rowSpacing}
              onChange={(e) => update('rowSpacing', Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Line Stroke Width */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="stroke-width" className="text-slate-400">
                Waveform Line Thickness
              </label>
              <span className="font-mono text-cyan-400 font-semibold">{settings.strokeWidth}px</span>
            </div>
            <input
              id="stroke-width"
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={settings.strokeWidth}
              onChange={(e) => update('strokeWidth', Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Section 2: Grid & Labels */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            Grid & Numbers
          </div>

          {/* Toggle Grid */}
          <div className="flex items-center justify-between py-0.5">
            <label htmlFor="show-grid-toggle" className="text-xs text-slate-300 cursor-pointer">
              Show Vertical Grid Lines
            </label>
            <input
              id="show-grid-toggle"
              type="checkbox"
              checked={settings.showGrid}
              onChange={(e) => update('showGrid', e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
            />
          </div>

          {/* Grid Style & Color */}
          {settings.showGrid && (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400">Grid Line Style</label>
                <select
                  value={settings.gridStyle}
                  onChange={(e) => update('gridStyle', e.target.value as any)}
                  className="bg-slate-850 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
                >
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="solid">Solid</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400">Grid Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.gridColor}
                    onChange={(e) => update('gridColor', e.target.value)}
                    className="w-8 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    {settings.gridColor}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Slot Numbers */}
          <div className="flex items-center justify-between py-0.5">
            <label htmlFor="show-slot-num-toggle" className="text-xs text-slate-300 cursor-pointer">
              Show Time Axis Numbers
            </label>
            <input
              id="show-slot-num-toggle"
              type="checkbox"
              checked={settings.showSlotNumbers}
              onChange={(e) => update('showSlotNumbers', e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
            />
          </div>

          {/* Slot Number Prefix */}
          {settings.showSlotNumbers && (
            <div className="flex items-center justify-between gap-3 text-xs">
              <label htmlFor="slot-prefix" className="text-slate-400">
                Number Prefix
              </label>
              <input
                id="slot-prefix"
                type="text"
                value={settings.slotNumberPrefix}
                onChange={(e) => update('slotNumberPrefix', e.target.value)}
                placeholder="e.g. T or #"
                maxLength={4}
                className="w-20 bg-slate-850 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-200 text-center focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* Label Column Width */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="label-width" className="text-slate-400">
                Label Column Width
              </label>
              <span className="font-mono text-cyan-400 font-semibold">{settings.labelWidth}px</span>
            </div>
            <input
              id="label-width"
              type="range"
              min="20"
              max="160"
              step="5"
              value={settings.labelWidth}
              onChange={(e) => update('labelWidth', Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Section 3: Color Themes & Sequence Policy */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            Theme & Behavior
          </div>

          {/* Canvas Themes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400">Canvas Color Preset</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => applyTheme('technical-navy')}
                className={`px-2.5 py-1.5 rounded text-xs border text-left transition-colors ${
                  settings.themePreset === 'technical-navy'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-semibold'
                    : 'border-slate-800 bg-slate-850 text-slate-300 hover:border-slate-700'
                }`}
              >
                Technical Navy
              </button>
              <button
                type="button"
                onClick={() => applyTheme('obsidian')}
                className={`px-2.5 py-1.5 rounded text-xs border text-left transition-colors ${
                  settings.themePreset === 'obsidian'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-semibold'
                    : 'border-slate-800 bg-slate-850 text-slate-300 hover:border-slate-700'
                }`}
              >
                Obsidian Dark
              </button>
              <button
                type="button"
                onClick={() => applyTheme('clean-white')}
                className={`px-2.5 py-1.5 rounded text-xs border text-left transition-colors ${
                  settings.themePreset === 'clean-white'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-semibold'
                    : 'border-slate-800 bg-slate-850 text-slate-300 hover:border-slate-700'
                }`}
              >
                Clean White
              </button>
              <button
                type="button"
                onClick={() => applyTheme('slate-gray')}
                className={`px-2.5 py-1.5 rounded text-xs border text-left transition-colors ${
                  settings.themePreset === 'slate-gray'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-semibold'
                    : 'border-slate-800 bg-slate-850 text-slate-300 hover:border-slate-700'
                }`}
              >
                Slate Studio
              </button>
              {/* Custom colour — spans full width, triggers native colour picker */}
              <label
                className={`col-span-2 flex items-center gap-2 px-2.5 py-1.5 rounded text-xs border cursor-pointer transition-colors ${
                  settings.themePreset === 'technical-navy' ||
                  settings.themePreset === 'obsidian' ||
                  settings.themePreset === 'clean-white' ||
                  settings.themePreset === 'slate-gray'
                    ? 'border-slate-800 bg-slate-850 text-slate-300 hover:border-slate-700'
                    : 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-semibold'
                }`}
              >
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => {
                    // Mark as custom by using a themePreset value that isn't one of the 4 named ones.
                    // We reuse the existing backgroundColor field via the generic update helper.
                    onChangeSettings({
                      ...settings,
                      themePreset: 'technical-navy', // reset highlight so none are "active"
                      backgroundColor: e.target.value,
                    });
                  }}
                  className="w-5 h-5 rounded border-0 bg-transparent cursor-pointer flex-shrink-0"
                />
                <span>Custom Colour</span>
                <span className="ml-auto font-mono text-[10px] uppercase opacity-70">
                  {settings.backgroundColor}
                </span>
              </label>
            </div>
          </div>

          {/* Unequal Sequence Policy */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-400">Shorter Signals Policy</label>
            <select
              value={settings.unequalLengthPolicy}
              onChange={(e) => update('unequalLengthPolicy', e.target.value as UnequalLengthPolicy)}
              className="bg-slate-850 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="pad-low">Pad with Low Level (0) to Max Length</option>
              <option value="dim-tail">Dim Inactive Tail (Dashed)</option>
              <option value="truncate">Terminate Line at Last Bit</option>
            </select>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Defines how signals with fewer bits align with longer signals on the common time axis.
            </p>
          </div>

          {/* Custom Background and Label Color */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => update('backgroundColor', e.target.value)}
                  className="w-8 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  {settings.backgroundColor}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400">Label Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.labelColor}
                  onChange={(e) => update('labelColor', e.target.value)}
                  className="w-8 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  {settings.labelColor}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
