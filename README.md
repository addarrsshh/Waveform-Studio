# Waveform Studio

A minimalistic, browser-based digital timing diagram editor and vector exporter built with React, TypeScript, Vite, and Tailwind CSS.

Inspired by textbook digital logic diagrams, Waveform Studio lets engineers, students, and digital designers enter binary sequences, inspect synchronized digital square waves, customize timing and visual styles, and export high-resolution SVG and PDF diagrams directly in the browser with zero backend requirements.

---

## Features

- **Real-Time Digital Waveforms**: Synchronized square waves derived directly from user-input binary sequences (`0` = Low, `1` = High).
- **Interactive Editing**:
  - Live sequence updating with real-time validation.
  - Interactive diagram canvas: click any slot on the diagram to toggle its binary state (0 ↔ 1).
  - Add, rename, recolor, reorder, duplicate, and delete signal channels.
  - Fast bit utilities: Invert (`NOT`), Shift Left (`<<`), Shift Right (`>>`), Repeat (`2x`).
- **Textbook-Quality Rendering**:
  - Crisp SVG paths with sharp vertical transitions at slot boundaries.
  - Configurable timing-grid lines (dashed, dotted, solid) and cycle markers (`T0`, `T1`, ...).
  - Hover inspector tracking current cycle time and instantaneous bit values across all channels.
  - Zoom controls (50% to 250%) and "Fit to Width" toggle for responsive inspection of long waveforms.
- **Unequal Sequence Lengths Policy**:
  - Automatically calculates diagram extent from the longest sequence.
  - Configurable handling for shorter signals:
    - *Pad with Low Level (0)*: Shorter signals hold low level for remaining cycles (default).
    - *Dim Inactive Tail*: Shows a dashed, dimmed reference line after the signal's last bit.
    - *Terminate*: Ends the signal path precisely at its final entered bit.
- **Comprehensive Customization**:
  - Time slot width (px).
  - Signal height / vertical separation (px).
  - Signal track spacing (px).
  - Line stroke width (px).
  - Grid visibility, style, and color.
  - Time axis number visibility and prefix (`T`, `#`, etc.).
  - Label column width and color.
  - Color themes: Technical Navy, Obsidian Dark, Clean White, and Slate Studio, plus custom color pickers.
- **Zero-Dependency Vector & PDF Exports**:
  - **Standalone SVG**: Clean, self-contained SVG file with embedded styles, XML-escaped labels, and exact viewBox. Does not depend on external fonts or network resources.
  - **Client-Side PDF**: Uses `jspdf` to generate downloadable PDFs directly in the browser at high DPI (2x retina scale).
  - **Copy SVG**: One-click clipboard copy of raw SVG markup for instant pasting into Figma, Inkscape, or LaTeX documents.

---

## Default Example

Waveform Studio initializes with the canonical 3-bit truth-table sequence:

- **Signal A**: `00001111` (Cyan `#38bdf8`)
- **Signal B**: `00110011` (Purple `#a78bfa`)
- **Signal C**: `01010101` (Emerald `#34d399`)

Additional built-in presets include:
- **4-Bit Binary Counter**: Q0 (LSB), Q1, Q2, Q3 (MSB)
- **SPI Bus Protocol**: CS#, SCLK, MOSI, MISO
- **Handshake Sequence**: REQ, ACK, DATA_VALID

---

## Local Setup & Development

### Prerequisites
- Node.js >= 18 (Tested on Node v20 & v24)
- npm >= 9

### 1. Install dependencies
```bash
npm install
```

### 2. Start local development server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for production
```bash
npm run build
```
The optimized static bundle will be emitted to the `dist/` directory.

### 4. Preview production build locally
```bash
npm run preview
```

---

## Vercel Deployment

Waveform Studio is a **100% static, client-only application**. It does not require any backend, Node server, database, API keys, or environment secrets.

### Recommended Vercel Settings:
| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` (or leave default root) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x or 20.x or 22.x |

No `vercel.json` or serverless functions are required.

---

## Project Structure

```text
wavegen/
├── public/
├── src/
│   ├── components/
│   │   ├── DiagramSettings.tsx   # Timing, spacing, grid, and theme controls
│   │   ├── ExportControls.tsx    # SVG and PDF download triggers + toast feedback
│   │   ├── SignalEditor.tsx      # Signal rows, sequence input, color picker, validation
│   │   └── WaveformCanvas.tsx    # Interactive SVG diagram renderer & hover inspector
│   ├── lib/
│   │   ├── exportPdf.ts          # Client-side PDF rendering using jsPDF & offscreen canvas
│   │   ├── exportSvg.ts          # Standalone SVG generator with XML escaping
│   │   └── waveform.ts           # Binary validation, metrics, and path math
│   ├── types/
│   │   └── waveform.ts           # TypeScript interfaces for signals and diagram settings
│   ├── App.tsx                   # Main application layout and state coordination
│   ├── index.css                 # Tailwind CSS styles and custom scrollbars
│   └── main.tsx                  # React entry point
├── index.html                    # HTML shell with Google Fonts and SEO tags
├── package.json                  # Dependencies and build scripts
├── postcss.config.js             # PostCSS Tailwind plugins
├── tailwind.config.js            # Tailwind theme tokens and fonts
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite bundler configuration
└── README.md                     # Documentation
```

---

## License

MIT
