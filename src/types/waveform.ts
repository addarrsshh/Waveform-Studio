export interface Signal {
  id: string;
  name: string;
  bits: string;
  color: string;
}

export type GridStyle = 'dashed' | 'dotted' | 'solid';
export type UnequalLengthPolicy = 'pad-low' | 'dim-tail' | 'truncate';
export type ThemePreset = 'technical-navy' | 'obsidian' | 'clean-white' | 'slate-gray';

export interface DiagramSettings {
  slotWidth: number;
  signalHeight: number;
  rowSpacing: number;
  strokeWidth: number;
  showGrid: boolean;
  gridColor: string;
  gridStyle: GridStyle;
  showSlotNumbers: boolean;
  slotNumberPrefix: string;
  labelColor: string;
  labelWidth: number;
  fontSize: number;
  backgroundColor: string;
  unequalLengthPolicy: UnequalLengthPolicy;
  themePreset: ThemePreset;
}

export interface TrackRenderData {
  signal: Signal;
  pathD: string;
  inactivePathD?: string;
  topY: number;
  botY: number;
  midY: number;
  labelY: number;
  bitsLength: number;
  validBits: string;
  hasInvalidChars: boolean;
}

export interface DiagramMetrics {
  maxSlots: number;
  labelWidth: number;
  diagramContentWidth: number;
  totalWidth: number;
  totalHeight: number;
  headerHeight: number;
  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  tracks: TrackRenderData[];
}
