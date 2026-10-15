import React, { useState, useRef, useMemo } from 'react';
import { Signal, DiagramSettings } from '../types/waveform';
import { calculateDiagramMetrics } from '../lib/waveform';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Activity } from 'lucide-react';

interface WaveformCanvasProps {
  signals: Signal[];
  settings: DiagramSettings;
  onToggleBit?: (signalIndex: number, bitIndex: number) => void;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  signals,
  settings,
  onToggleBit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [fitToWidth, setFitToWidth] = useState<boolean>(false);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  const metrics = useMemo(() => {
    return calculateDiagramMetrics(signals, settings);
  }, [signals, settings]);

  const { maxSlots, padding, headerHeight, tracks, totalWidth, totalHeight } = metrics;
  const startX = padding.left + settings.labelWidth;
  const contentWidth = maxSlots * settings.slotWidth;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - svgRect.left;
    // Scale coordinate according to zoom or viewBox
    const scaleFactor = fitToWidth && containerRef.current
      ? containerRef.current.clientWidth / totalWidth
      : zoom;
    const svgX = clientX / scaleFactor;

    if (svgX >= startX && svgX <= startX + contentWidth) {
      const slotIndex = Math.floor((svgX - startX) / settings.slotWidth);
      if (slotIndex >= 0 && slotIndex < maxSlots) {
        setHoveredSlot(slotIndex);
        return;
      }
    }
    setHoveredSlot(null);
  };

  const handleMouseLeave = () => {
    setHoveredSlot(null);
  };

  const handleSlotClick = (signalIndex: number, slotIndex: number) => {
    if (onToggleBit) {
      onToggleBit(signalIndex, slotIndex);
    }
  };

  const strokeDashArray =
    settings.gridStyle === 'dashed'
      ? '4,4'
      : settings.gridStyle === 'dotted'
      ? '2,3'
      : undefined;

  const gridTop = padding.top + (settings.showSlotNumbers ? headerHeight - 10 : 0);
  const gridBottom = totalHeight - padding.bottom;

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Canvas Top Bar / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-sm text-xs select-none">
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">Timing Diagram Preview</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">
            {signals.length} {signals.length === 1 ? 'signal' : 'signals'}, {maxSlots}{' '}
            {maxSlots === 1 ? 'slot' : 'slots'}
          </span>
          {hoveredSlot !== null && (
            <div className="hidden sm:flex items-center gap-2 ml-3 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 animate-fadeIn">
              <span className="font-bold">
                {settings.slotNumberPrefix ? `${settings.slotNumberPrefix}` : 'T'}
                {hoveredSlot}
              </span>
              <span className="text-cyan-600">|</span>
              <div className="flex items-center gap-2">
                {tracks.map((t, idx) => {
                  const bit = t.validBits[hoveredSlot] ?? (settings.unequalLengthPolicy === 'pad-low' ? '0' : '-');
                  return (
                    <span key={idx} className="flex items-center gap-1">
                      <span className="text-slate-400">{t.signal.name}:</span>
                      <span
                        className="font-bold px-1 rounded text-[11px]"
                        style={{
                          backgroundColor: `${t.signal.color}25`,
                          color: t.signal.color,
                        }}
                      >
                        {bit}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Zoom & Display Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => setFitToWidth(!fitToWidth)}
            title={fitToWidth ? 'Disable Fit to Width (Enable Scroll)' : 'Fit to Width'}
            className={`p-1.5 rounded transition-colors ${
              fitToWidth
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-[1px] bg-slate-800 mx-1" />
          <button
            type="button"
            disabled={fitToWidth || zoom <= 0.5}
            onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.15).toFixed(2))))}
            title="Zoom Out"
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-12 text-center font-mono text-slate-400 text-[11px]">
            {fitToWidth ? 'FIT' : `${Math.round(zoom * 100)}%`}
          </span>
          <button
            type="button"
            disabled={fitToWidth || zoom >= 2.5}
            onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.15).toFixed(2))))}
            title="Zoom In"
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={!fitToWidth && zoom === 1}
            onClick={() => {
              setZoom(1);
              setFitToWidth(false);
            }}
            title="Reset Zoom to 100%"
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto overflow-y-auto p-4 transition-all duration-150 flex items-center justify-start min-h-[300px]"
        style={{ backgroundColor: settings.backgroundColor }}
      >
        <svg
          id="waveform-svg-element"
          width={fitToWidth ? '100%' : totalWidth * zoom}
          height={fitToWidth ? undefined : totalHeight * zoom}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          preserveAspectRatio={fitToWidth ? 'xMidYMid meet' : undefined}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="transition-transform duration-75 origin-top-left select-none drop-shadow-sm"
          style={{
            maxWidth: fitToWidth ? '100%' : 'none',
            display: 'block',
          }}
        >
          {/* Background fill */}
          <rect width="100%" height="100%" fill={settings.backgroundColor} />

          {/* Hover highlight column */}
          {hoveredSlot !== null && (
            <rect
              x={startX + hoveredSlot * settings.slotWidth}
              y={gridTop}
              width={settings.slotWidth}
              height={gridBottom - gridTop}
              fill="#38bdf8"
              fillOpacity={0.07}
              className="pointer-events-none transition-all duration-75"
            />
          )}

          {/* Grid lines and slot numbers */}
          {(settings.showGrid || settings.showSlotNumbers) && (
            <g className="grid-layer">
              {Array.from({ length: maxSlots + 1 }).map((_, i) => {
                const x = startX + i * settings.slotWidth;
                return (
                  <g key={`grid-${i}`}>
                    {settings.showGrid && (
                      <line
                        x1={x}
                        y1={gridTop}
                        x2={x}
                        y2={gridBottom}
                        stroke={settings.gridColor}
                        strokeWidth={1}
                        strokeDasharray={strokeDashArray}
                        opacity={0.65}
                      />
                    )}
                    {settings.showSlotNumbers && i < maxSlots && (
                      <>
                        <text
                          x={x + settings.slotWidth / 2}
                          y={padding.top + 16}
                          textAnchor="middle"
                          fill={settings.labelColor}
                          fontSize={Math.max(10, settings.fontSize - 1)}
                          fontFamily="ui-monospace, monospace"
                          opacity={hoveredSlot === i ? 1 : 0.75}
                          fontWeight={hoveredSlot === i ? '700' : '400'}
                          className="pointer-events-none"
                        >
                          {settings.slotNumberPrefix ? `${settings.slotNumberPrefix}` : ''}
                          {i}
                        </text>
                        {/* Tick mark at boundary */}
                        <line
                          x1={x}
                          y1={padding.top + 22}
                          x2={x}
                          y2={padding.top + 28}
                          stroke={settings.gridColor}
                          strokeWidth={1}
                        />
                      </>
                    )}
                  </g>
                );
              })}
              {settings.showSlotNumbers && (
                <line
                  x1={startX + maxSlots * settings.slotWidth}
                  y1={padding.top + 22}
                  x2={startX + maxSlots * settings.slotWidth}
                  y2={padding.top + 28}
                  stroke={settings.gridColor}
                  strokeWidth={1}
                />
              )}
            </g>
          )}

          {/* Signal tracks */}
          <g className="tracks-layer">
            {tracks.map((track, trackIdx) => {
              const { signal, pathD, inactivePathD, topY, botY, labelY } = track;

              return (
                <g key={signal.id} className="signal-track">
                  {/* Baseline guide line */}
                  <line
                    x1={startX}
                    y1={botY}
                    x2={startX + contentWidth}
                    y2={botY}
                    stroke={settings.gridColor}
                    strokeWidth={0.75}
                    strokeDasharray="2,2"
                    opacity={0.3}
                  />

                  {/* Level labels '1' and '0' subtle indicator */}
                  <text
                    x={startX - 8}
                    y={topY + 3}
                    textAnchor="end"
                    fill={settings.labelColor}
                    fontSize={Math.max(9, settings.fontSize - 3)}
                    fontFamily="ui-monospace, monospace"
                    opacity={0.35}
                  >
                    1
                  </text>
                  <text
                    x={startX - 8}
                    y={botY + 3}
                    textAnchor="end"
                    fill={settings.labelColor}
                    fontSize={Math.max(9, settings.fontSize - 3)}
                    fontFamily="ui-monospace, monospace"
                    opacity={0.35}
                  >
                    0
                  </text>

                  {/* Signal Name Label */}
                  <text
                    x={padding.left}
                    y={labelY}
                    fill={settings.labelColor}
                    fontSize={settings.fontSize}
                    fontWeight="600"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    dominantBaseline="middle"
                    className="cursor-default"
                  >
                    {signal.name || 'Untitled'}
                  </text>

                  {/* Dimmed tail for unequal lengths */}
                  {inactivePathD && (
                    <path
                      d={inactivePathD}
                      fill="none"
                      stroke={signal.color}
                      strokeWidth={settings.strokeWidth}
                      strokeDasharray="3,3"
                      opacity={0.35}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Main Waveform Path */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={signal.color}
                    strokeWidth={settings.strokeWidth}
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />

                  {/* Clickable interactive slots for quick bit toggling */}
                  {Array.from({ length: maxSlots }).map((_, slotIdx) => {
                    const slotX = startX + slotIdx * settings.slotWidth;
                    const isWithinSequence = slotIdx < track.validBits.length;
                    return (
                      <rect
                        key={`click-${slotIdx}`}
                        x={slotX}
                        y={topY}
                        width={settings.slotWidth}
                        height={botY - topY}
                        fill="transparent"
                        className="cursor-pointer hover:fill-white/5 transition-colors"
                        onClick={() => handleSlotClick(trackIdx, slotIdx)}
                      >
                        <title>
                          {signal.name} [Slot {slotIdx}]:{' '}
                          {isWithinSequence ? track.validBits[slotIdx] : 'Unassigned'} (Click to toggle)
                        </title>
                      </rect>
                    );
                  })}
                </g>
              );
            })}
          </g>

          {/* Interactive cursor line */}
          {hoveredSlot !== null && (
            <line
              x1={startX + hoveredSlot * settings.slotWidth + settings.slotWidth / 2}
              y1={gridTop}
              x2={startX + hoveredSlot * settings.slotWidth + settings.slotWidth / 2}
              y2={gridBottom}
              stroke="#38bdf8"
              strokeWidth={1}
              strokeDasharray="2,2"
              opacity={0.8}
              className="pointer-events-none"
            />
          )}
        </svg>
      </div>

      {/* Interactive Helper Footer */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          Click any slot on the diagram to toggle its binary state (0 ↔ 1)
        </span>
        <span className="font-mono text-slate-500 hidden sm:inline">
          Dimensions: {Math.round(totalWidth)} × {Math.round(totalHeight)} px
        </span>
      </div>
    </div>
  );
};
