# Waveform Studio

> **A fast, minimalistic, browser-based digital timing diagram editor & vector exporter.**

**Waveform Studio** is an interactive engineering tool designed to create clean, textbook-quality digital timing diagrams in seconds. Instead of wrestling with generic drawing tools or slide editors, simply enter binary sequences (`0` and `1`), customize timing and styling, and export crisp, publication-ready vector diagrams (**SVG**) and **PDFs** directly from your browser.

---

## ⚡ What Does Waveform Studio Do?

### 1. Instant Digital Waveform Generation
Type or paste binary sequences (e.g. `00001111`) for any number of digital signals. Waveform Studio automatically calculates and draws synchronized digital square waves with razor-sharp vertical transitions at exact clock cycle boundaries.

### 2. Interactive Click-to-Edit Diagram Canvas
- **Direct Canvas Editing**: Click directly on any cycle slot on the waveform canvas to toggle its binary state (`0` ↔ `1`) in real time.
- **Cycle Inspector Crosshair**: Hover anywhere over the diagram to inspect the active cycle (e.g., `T3`) and view instantaneous high/low states across all channels simultaneously.
- **Zoom & Pan**: Inspect long or complex waveforms with fluid zoom controls (`50%` to `250%`) and a responsive **Fit to Width** mode.

### 3. Multi-Channel Signal Management
- **Custom Engineering Labels**: Name your signals whatever you need—`CLK`, `RESET#`, `MOSI`, `MISO`, `DATA[7:0]`, or Boolean logic expressions like `A·(B+C)`.
- **Per-Channel Colors**: Assign distinct colors to each signal using curated engineering palettes or custom hex codes.
- **Sequence Transformation Shortcuts**:
  - `INV`: Inverts the sequence (`NOT` logic).
  - `<<` & `>>`: Circularly bit-shifts sequences left or right.
  - `2×`: Duplicates and repeats sequence patterns.
- **Reordering & Duplication**: Drag, reorder channels up and down, or duplicate signals with one click.
- **Input Validation**: Automatically handles whitespace and highlights any non-binary characters with a 1-click cleanup tool.

### 4. Smart Unequal Sequence Length Handling
When signals have different bit lengths, Waveform Studio automatically aligns them on a shared time axis and lets you choose how shorter signals behave:
- **Pad with Low (0)** *(Default)*: Extends shorter signals at low level across remaining cycles.
- **Dim Inactive Tail**: Displays a subtle dashed reference line to show that a signal has concluded.
- **Terminate**: Stops the signal line cleanly at its final bit.

### 5. Custom Diagram Styling & Themes
Fine-tune every visual dimension to match your document or slide style:
- Time slot width (horizontal cycle stretch).
- Signal track height (vertical amplitude) and row spacing.
- Stroke thickness.
- Timing grid visibility and styling (*dashed*, *dotted*, or *solid*).
- Cycle numbering formats (`T0, T1, ...` or `#0, #1, ...` or simple numbers).
- One-click color themes:
  - **Technical Navy** (Oscilloscope / Logic Analyzer aesthetic)
  - **Obsidian Dark** (Minimalist modern dark mode)
  - **Clean White** (High-contrast paper theme for academic papers, theses, and print)
  - **Slate Studio** (Balanced neutral slate)

### 6. Publication-Ready SVG & PDF Export
- **Standalone SVG**: Generates self-contained, valid SVG files with embedded styling and XML-escaped labels. No external fonts, stylesheets, or network access required. Drag and drop directly into Figma, Illustrator, Inkscape, or HTML/Markdown documentation.
- **Copy SVG Markup**: One-click copy of the raw SVG code straight to your clipboard.
- **High-Resolution PDF**: Generates crisp vector-scaled PDFs with automatic diagram-fitting for homework submissions, lab reports, and datasheets.
- **100% Client-Side**: All rendering and export computations execute locally in your browser. No files or data ever leave your machine.

---

## 🛠 Built-in Presets

Quickly load standard digital design patterns:
- **Default Logic (A, B, C)**: Truth-table standard test pattern (`00001111`, `00110011`, `01010101`).
- **4-Bit Binary Counter**: Synchronous counter waveform (`Q0` through `Q3`).
- **SPI Bus Protocol**: Synchronized `CS#`, `SCLK`, `MOSI`, and `MISO` communication.
- **Handshake Sequence**: Request (`REQ`), Acknowledge (`ACK`), and `DATA_VALID` timing.

---

## 🚀 How to Use

1. **Enter Your Signals**: Rename channels and type your desired `0`s and `1`s into the sequence boxes (or click on the waveform preview to flip bits).
2. **Customize Appearance**: Adjust timing slot width, grid style, and row spacing using the **Diagram Settings** tab.
3. **Export Your Diagram**: Click **Export SVG** or **Export PDF** in the top navigation bar to download your finished diagram.

---

## 💻 Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Vector Engine**: Pure browser SVG
- **PDF Engine**: jsPDF (client-side rendering)
- **Icons**: Lucide React

---

## 📦 Running Locally

```bash
# Clone the repository
git clone https://github.com/addarrsshh/Waveform-Studio.git
cd Waveform-Studio

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## 📄 License

MIT License. Free to use for personal, academic, and commercial projects.
