import { Signal, DiagramSettings, DiagramMetrics, TrackRenderData } from '../types/waveform';

export const DEFAULT_SIGNALS: Signal[] = [
  { id: 'sig-1', name: 'A', bits: '00001111', color: '#38bdf8' },
  { id: 'sig-2', name: 'B', bits: '00110011', color: '#a78bfa' },
  { id: 'sig-3', name: 'C', bits: '01010101', color: '#34d399' },
];

export const DEFAULT_SETTINGS: DiagramSettings = {
  slotWidth: 50,
  signalHeight: 36,
  rowSpacing: 28,
  strokeWidth: 2,
  showGrid: true,
  gridColor: '#334155',
  gridStyle: 'dashed',
  showSlotNumbers: true,
  slotNumberPrefix: 'T',
  labelColor: '#e2e8f0',
  labelWidth: 100,
  fontSize: 12,
  backgroundColor: '#0f172a',
  unequalLengthPolicy: 'pad-low',
  themePreset: 'technical-navy',
};

export const COLOR_PALETTE = [
  { name: 'Cyan', value: '#38bdf8' },
  { name: 'Emerald', value: '#34d399' },
  { name: 'Purple', value: '#a78bfa' },
  { name: 'Amber', value: '#fbbf24' },
  { name: 'Rose', value: '#fb7185' },
  { name: 'Blue', value: '#60a5fa' },
  { name: 'Indigo', value: '#818cf8' },
  { name: 'Teal', value: '#2dd4bf' },
  { name: 'Orange', value: '#fb923c' },
  { name: 'Lime', value: '#a3e635' },
  { name: 'White', value: '#f8fafc' },
  { name: 'Slate', value: '#94a3b8' },
];

export function sanitizeBits(raw: string): { sanitized: string; hasInvalidChars: boolean; rawLength: number } {
  const stripped = raw.replace(/\s+/g, '');
  const hasInvalidChars = /[^01]/.test(stripped);
  const sanitized = stripped.replace(/[^01]/g, '');
  return {
    sanitized,
    hasInvalidChars,
    rawLength: stripped.length,
  };
}

export function calculateDiagramMetrics(
  signals: Signal[],
  settings: DiagramSettings
): DiagramMetrics {
  const sanitizedSignals = signals.map(s => {
    const { sanitized, hasInvalidChars } = sanitizeBits(s.bits);
    return {
      signal: s,
      validBits: sanitized,
      hasInvalidChars,
    };
  });

  const lengths = sanitizedSignals.map(s => s.validBits.length);
  const maxSlots = Math.max(1, ...lengths);

  const padding = {
    top: 16,
    bottom: 24,
    left: 20,
    right: 32,
  };

  const headerHeight = settings.showSlotNumbers ? 38 : 16;
  const diagramContentWidth = maxSlots * settings.slotWidth;
  const totalWidth = padding.left + settings.labelWidth + diagramContentWidth + padding.right;

  const totalHeight =
    padding.top +
    headerHeight +
    (signals.length > 0
      ? signals.length * settings.signalHeight + (signals.length - 1) * settings.rowSpacing
      : 60) +
    padding.bottom;

  const startX = padding.left + settings.labelWidth;

  const tracks: TrackRenderData[] = sanitizedSignals.map((item, index) => {
    const topY =
      padding.top +
      headerHeight +
      index * (settings.signalHeight + settings.rowSpacing);
    const botY = topY + settings.signalHeight;
    const midY = topY + settings.signalHeight / 2;
    const labelY = midY + 4;

    const bits = item.validBits;
    let pathD = '';
    let inactivePathD = '';

    if (bits.length === 0) {
      // Empty sequence: draw a flat low line across first slot or all slots
      const endX = startX + settings.slotWidth;
      pathD = `M ${startX.toFixed(1)} ${botY.toFixed(1)} H ${endX.toFixed(1)}`;
    } else {
      let currentX = startX;
      let prevY = bits[0] === '1' ? topY : botY;

      // Start path
      pathD = `M ${currentX.toFixed(1)} ${prevY.toFixed(1)}`;

      for (let i = 0; i < bits.length; i++) {
        const bit = bits[i];
        const targetY = bit === '1' ? topY : botY;

        // If level changed at this slot boundary, draw vertical transition
        if (i > 0 && targetY !== prevY) {
          pathD += ` V ${targetY.toFixed(1)}`;
          prevY = targetY;
        }

        currentX += settings.slotWidth;
        pathD += ` H ${currentX.toFixed(1)}`;
      }

      // Handle remaining slots if bits.length < maxSlots
      if (bits.length < maxSlots) {
        if (settings.unequalLengthPolicy === 'pad-low') {
          // Transition to low if not already at low, then extend to maxSlots
          if (prevY !== botY) {
            pathD += ` V ${botY.toFixed(1)}`;
          }
          const finalX = startX + maxSlots * settings.slotWidth;
          pathD += ` H ${finalX.toFixed(1)}`;
        } else if (settings.unequalLengthPolicy === 'dim-tail') {
          // Separate inactive path for the tail
          let tailStartX = currentX;
          inactivePathD = `M ${tailStartX.toFixed(1)} ${botY.toFixed(1)} H ${(
            startX +
            maxSlots * settings.slotWidth
          ).toFixed(1)}`;
        }
        // If 'truncate', we don't extend pathD further
      }
    }

    return {
      signal: item.signal,
      pathD,
      inactivePathD: inactivePathD || undefined,
      topY,
      botY,
      midY,
      labelY,
      bitsLength: bits.length,
      validBits: bits,
      hasInvalidChars: item.hasInvalidChars,
    };
  });

  return {
    maxSlots,
    labelWidth: settings.labelWidth,
    diagramContentWidth,
    totalWidth,
    totalHeight,
    headerHeight,
    padding,
    tracks,
  };
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
