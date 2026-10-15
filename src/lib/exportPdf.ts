import { jsPDF } from 'jspdf';
import { Signal, DiagramSettings } from '../types/waveform';
import { generateSvgString } from './exportSvg';
import { calculateDiagramMetrics } from './waveform';

export interface PdfExportOptions {
  orientation?: 'auto' | 'landscape' | 'portrait';
  pageSize?: 'fit-page-a4' | 'custom-diagram-size';
  scale?: number;
}

export async function generatePdf(
  signals: Signal[],
  settings: DiagramSettings,
  options: PdfExportOptions = {}
): Promise<jsPDF> {
  const { orientation = 'auto', pageSize = 'custom-diagram-size', scale = 2 } = options;
  const metrics = calculateDiagramMetrics(signals, settings);
  const svgString = generateSvgString(signals, settings);

  // Render SVG to canvas via Image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not create canvas context for PDF generation');
  }

  const width = metrics.totalWidth;
  const height = metrics.totalHeight;

  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG for PDF export: ' + e));
    };
    img.src = url;
  });

  const imgData = canvas.toDataURL('image/png', 1.0);

  // Determine PDF layout
  const isLandscape =
    orientation === 'landscape'
      ? true
      : orientation === 'portrait'
      ? false
      : width >= height;

  let pdf: jsPDF;

  if (pageSize === 'custom-diagram-size') {
    // Custom page size precisely matching diagram proportions (pt)
    // 1 px = 0.75 pt approx (96dpi -> 72pt)
    const ptWidth = Math.max(100, width * 0.75);
    const ptHeight = Math.max(80, height * 0.75);

    pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [ptWidth, ptHeight],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, ptWidth, ptHeight, undefined, 'FAST');
  } else {
    // Standard A4
    pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // 10mm margin
    const availWidth = pageWidth - margin * 2;
    const availHeight = pageHeight - margin * 2;

    const imgAspect = width / height;
    let targetWidth = availWidth;
    let targetHeight = targetWidth / imgAspect;

    if (targetHeight > availHeight) {
      targetHeight = availHeight;
      targetWidth = targetHeight * imgAspect;
    }

    const x = margin + (availWidth - targetWidth) / 2;
    const y = margin + (availHeight - targetHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, targetWidth, targetHeight, undefined, 'FAST');
  }

  return pdf;
}

export async function downloadPdf(
  signals: Signal[],
  settings: DiagramSettings,
  filename = 'waveform-diagram.pdf',
  options?: PdfExportOptions
): Promise<void> {
  const pdf = await generatePdf(signals, settings, options);
  pdf.save(filename);
}
