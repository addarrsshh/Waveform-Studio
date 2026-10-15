import { DEFAULT_SIGNALS, DEFAULT_SETTINGS, calculateDiagramMetrics, sanitizeBits } from '../src/lib/waveform.ts';
import { generateSvgString } from '../src/lib/exportSvg.ts';

console.log('--- Testing Waveform Studio Engine ---');

// Test 1: Default Signals & Settings
console.log('Test 1: Default signals check...');
if (DEFAULT_SIGNALS.length !== 3) throw new Error('Expected 3 default signals');
if (DEFAULT_SIGNALS[0].name !== 'A' || DEFAULT_SIGNALS[0].bits !== '00001111') throw new Error('Signal A mismatch');
if (DEFAULT_SIGNALS[1].name !== 'B' || DEFAULT_SIGNALS[1].bits !== '00110011') throw new Error('Signal B mismatch');
if (DEFAULT_SIGNALS[2].name !== 'C' || DEFAULT_SIGNALS[2].bits !== '01010101') throw new Error('Signal C mismatch');
console.log('✓ Default signals verified: A (00001111), B (00110011), C (01010101)');

// Test 2: Sanitization
console.log('Test 2: Sanitization check...');
const s1 = sanitizeBits('0 0 1 1');
if (s1.sanitized !== '0011' || s1.hasInvalidChars) throw new Error('Failed to sanitize whitespace');
const s2 = sanitizeBits('01X2AB1');
if (s2.sanitized !== '011' || !s2.hasInvalidChars) throw new Error('Failed to detect invalid characters');
console.log('✓ Sanitization handles whitespace and rejects non-binary chars');

// Test 3: Metrics & Path generation
console.log('Test 3: Metrics and Path generation...');
const metrics = calculateDiagramMetrics(DEFAULT_SIGNALS, DEFAULT_SETTINGS);
if (metrics.maxSlots !== 8) throw new Error(`Expected 8 maxSlots, got ${metrics.maxSlots}`);
if (metrics.tracks.length !== 3) throw new Error('Expected 3 tracks');

metrics.tracks.forEach((t) => {
  if (!t.pathD.startsWith('M ')) throw new Error(`Track ${t.signal.name} path does not start with M`);
  if (!t.pathD.includes('H ') && !t.pathD.includes('V ')) throw new Error(`Track ${t.signal.name} has no H or V commands`);
});
console.log(`✓ Metrics: maxSlots=${metrics.maxSlots}, width=${metrics.totalWidth}, height=${metrics.totalHeight}`);

// Test 4: Unequal sequence lengths
console.log('Test 4: Unequal length handling...');
const unequalSignals = [
  { id: '1', name: 'SHORT', bits: '10', color: '#ff0000' },
  { id: '2', name: 'LONG', bits: '01010101', color: '#00ff00' },
];

const padLowMetrics = calculateDiagramMetrics(unequalSignals, { ...DEFAULT_SETTINGS, unequalLengthPolicy: 'pad-low' });
if (padLowMetrics.maxSlots !== 8) throw new Error('Max slots should match longest sequence (8)');
// Short track path should extend across all 8 slots (startX + 8 * slotWidth)
const startX = padLowMetrics.padding.left + DEFAULT_SETTINGS.labelWidth;
const expectedEndX = (startX + 8 * DEFAULT_SETTINGS.slotWidth).toFixed(1);
if (!padLowMetrics.tracks[0].pathD.includes(`H ${expectedEndX}`)) {
  throw new Error(`pad-low expected to extend to ${expectedEndX}, got ${padLowMetrics.tracks[0].pathD}`);
}

const dimTailMetrics = calculateDiagramMetrics(unequalSignals, { ...DEFAULT_SETTINGS, unequalLengthPolicy: 'dim-tail' });
if (!dimTailMetrics.tracks[0].inactivePathD) {
  throw new Error('dim-tail should generate inactivePathD for tail slots');
}
console.log('✓ Unequal sequence policies (pad-low, dim-tail) work accurately');

// Test 5: Standalone SVG Generation
console.log('Test 5: Standalone SVG generation...');
const svgString = generateSvgString(DEFAULT_SIGNALS, DEFAULT_SETTINGS);
if (!svgString.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) throw new Error('Missing XML declaration');
if (!svgString.includes('<svg xmlns="http://www.w3.org/2000/svg"')) throw new Error('Missing SVG root or xmlns');
if (!svgString.includes('</svg>')) throw new Error('Missing SVG closing tag');
if (!svgString.includes('A') || !svgString.includes('B') || !svgString.includes('C')) throw new Error('Missing signal labels in SVG');
console.log('✓ Standalone SVG string successfully generated');

// Test 6: XML escaping in labels
const specialSignal = [{ id: 's', name: 'A·(B+C) & <D>"', bits: '01', color: '#38bdf8' }];
const escapedSvg = generateSvgString(specialSignal, DEFAULT_SETTINGS);
if (!escapedSvg.includes('&amp;') || !escapedSvg.includes('&lt;') || !escapedSvg.includes('&gt;') || !escapedSvg.includes('&quot;')) {
  throw new Error('Failed to escape special XML characters in signal names');
}
console.log('✓ XML special characters in labels are properly escaped');

console.log('--- ALL TESTS PASSED SUCCESSFULLY! ---');
