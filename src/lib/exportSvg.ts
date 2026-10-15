import { Signal, DiagramSettings } from '../types/waveform';
import { calculateDiagramMetrics, escapeXml } from './waveform';

export function generateSvgString(signals: Signal[], settings: DiagramSettings): string {
  const metrics = calculateDiagramMetrics(signals, settings);
  const { maxSlots, padding, headerHeight, tracks, totalWidth, totalHeight } = metrics;
  const startX = padding.left + settings.labelWidth;

  const strokeDashArray =
    settings.gridStyle === 'dashed'
      ? 'stroke-dasharray="4,4"'
      : settings.gridStyle === 'dotted'
      ? 'stroke-dasharray="2,3"'
      : '';

  const gridLines: string[] = [];
  const slotLabels: string[] = [];

  // Generate grid vertical lines and slot labels
  if (settings.showGrid || settings.showSlotNumbers) {
    const gridTop = padding.top + (settings.showSlotNumbers ? headerHeight - 10 : 0);
    const gridBottom = totalHeight - padding.bottom;

    for (let i = 0; i <= maxSlots; i++) {
      const x = startX + i * settings.slotWidth;

      if (settings.showGrid) {
        gridLines.push(
          `<line x1="${x.toFixed(1)}" y1="${gridTop.toFixed(1)}" x2="${x.toFixed(1)}" y2="${gridBottom.toFixed(1)}" stroke="${settings.gridColor}" stroke-width="1" ${strokeDashArray} opacity="0.75" />`
        );
      }

      if (settings.showSlotNumbers && i < maxSlots) {
        const slotCenterX = x + settings.slotWidth / 2;
        const prefix = settings.slotNumberPrefix ? `${settings.slotNumberPrefix}` : '';
        const labelText = `${prefix}${i}`;
        slotLabels.push(
          `<text x="${slotCenterX.toFixed(1)}" y="${(padding.top + 16).toFixed(1)}" text-anchor="middle" fill="${settings.labelColor}" font-size="${Math.max(10, settings.fontSize - 1)}" font-family="system-ui, -apple-system, sans-serif" opacity="0.85">${labelText}</text>`
        );
        // Small tick mark
        slotLabels.push(
          `<line x1="${x.toFixed(1)}" y1="${(padding.top + 22).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(padding.top + 28).toFixed(1)}" stroke="${settings.gridColor}" stroke-width="1" />`
        );
      }
    }

    if (settings.showSlotNumbers) {
      // Final boundary tick
      const endX = startX + maxSlots * settings.slotWidth;
      slotLabels.push(
        `<line x1="${endX.toFixed(1)}" y1="${(padding.top + 22).toFixed(1)}" x2="${endX.toFixed(1)}" y2="${(padding.top + 28).toFixed(1)}" stroke="${settings.gridColor}" stroke-width="1" />`
      );
    }
  }

  // Generate track content: baseline guides, labels, waveforms
  const trackElements: string[] = [];
  tracks.forEach((track) => {
    // Subtle baseline guide
    trackElements.push(
      `<line x1="${startX.toFixed(1)}" y1="${track.botY.toFixed(1)}" x2="${(startX + maxSlots * settings.slotWidth).toFixed(1)}" y2="${track.botY.toFixed(1)}" stroke="${settings.gridColor}" stroke-width="0.75" opacity="0.3" stroke-dasharray="2,2" />`
    );

    // Label
    const safeName = escapeXml(track.signal.name);
    trackElements.push(
      `<text x="${padding.left.toFixed(1)}" y="${track.labelY.toFixed(1)}" fill="${settings.labelColor}" font-family="system-ui, -apple-system, sans-serif" font-size="${settings.fontSize}" font-weight="600" dominant-baseline="middle">${safeName}</text>`
    );

    // Inactive tail (if dim-tail policy)
    if (track.inactivePathD) {
      trackElements.push(
        `<path d="${track.inactivePathD}" fill="none" stroke="${track.signal.color}" stroke-width="${settings.strokeWidth}" stroke-dasharray="3,3" opacity="0.35" stroke-linecap="round" />`
      );
    }

    // Main waveform path
    trackElements.push(
      `<path d="${track.pathD}" fill="none" stroke="${track.signal.color}" stroke-width="${settings.strokeWidth}" stroke-linecap="square" stroke-linejoin="miter" />`
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth.toFixed(1)}" height="${totalHeight.toFixed(1)}" viewBox="0 0 ${totalWidth.toFixed(1)} ${totalHeight.toFixed(1)}" style="background-color: ${settings.backgroundColor};">
  <style>
    text {
      user-select: none;
      -webkit-user-select: none;
    }
  </style>
  <rect width="100%" height="100%" fill="${settings.backgroundColor}" />
  <g class="grid-lines">
    ${gridLines.join('\n    ')}
  </g>
  <g class="slot-labels">
    ${slotLabels.join('\n    ')}
  </g>
  <g class="tracks">
    ${trackElements.join('\n    ')}
  </g>
</svg>`;
}

export function downloadSvg(svgString: string, filename = 'waveform-diagram.svg'): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
