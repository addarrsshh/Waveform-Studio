# Waveform Studio — AI Development Instructions

## Project goal

Build a polished, minimalistic, browser-only digital waveform editor inspired by the supplied reference image. Users enter binary sequences (`0` and `1`) for multiple signals, view synchronized digital square waves, customize timing and colors, label each wave, and export the diagram as SVG or PDF.

The application must be deployable directly to Vercel as a static frontend. Do not build or require a backend, database, server-side API, authentication, or environment secrets.

## Required technology

- React
- TypeScript
- Vite
- Tailwind CSS
- SVG for drawing the waveform diagram
- Client-side PDF export library if needed (for example, jsPDF); all PDF creation must happen in the browser
- Use browser-native Blob/download APIs for SVG export
- Use npm scripts that work in a standard Vercel build

Use stable, maintained packages and avoid unnecessary dependencies. Do not introduce a backend framework such as Express.

## Core interface

Keep the interface clean, compact, and focused on the waveform. Avoid gradients, excessive cards, large hero sections, decorative animations, and clutter.

Suggested layout:
1. A small header with the app name, a concise subtitle, and export actions.
2. A large waveform preview, using crisp SVG paths and light timing-grid lines.
3. A signal editor below the preview, where each row contains:
   - Editable signal name/label (examples: `A`, `B`, `C`, `A.(B+C)`)
   - Binary sequence input containing only `0` and `1`
   - A color picker for that signal
   - A control to remove the signal
4. A clear “Add signal” control.
5. A compact settings area for timing spacing, high/low levels, line width, and other diagram-wide options.

Make the layout responsive. On narrow screens, preserve usability by allowing the editor to stack or scroll horizontally where appropriate. The waveform itself should remain readable.

## Waveform behavior

- Each signal is a digital square wave.
- `0` means low level; `1` means high level.
- Each character represents one time slot.
- All signals share the same time axis and slot boundaries.
- Draw vertical transitions at slot boundaries, with horizontal segments inside each slot.
- Use a consistent time grid across all signals.
- The initial example should resemble the supplied reference:
  - `A`: `00001111`
  - `B`: `00110011`
  - `C`: `01010101`
- Include example derived labels/signals such as `A.(B+C)` only as editable signal rows; do not imply that arbitrary labels are automatically evaluated as Boolean expressions unless that functionality is explicitly implemented.
- Allow users to add, rename, recolor, edit, and delete signals.
- Update the preview immediately when any input changes.
- Preserve alignment across all rows even when sequences have different lengths. Define and implement a clear policy for unequal lengths; recommended default: extend the displayed time axis to the longest sequence and leave shorter signals low or visually terminate them at their last entered slot. Prefer an explicit, consistent behavior and explain it in the UI if necessary.
- Empty input should not crash the app. Show a helpful validation state.
- Strip whitespace from sequences and reject or remove characters other than `0` and `1`; clearly indicate invalid input rather than silently corrupting data.
- Handle long sequences without breaking the layout. Use a sensible minimum slot width and a horizontal-scroll/fit-to-view strategy.
- Make sure the first and final signal levels are rendered correctly and that transitions align exactly with grid lines.

## Customization requirements

Provide usable controls for:
- Horizontal distance / width of each time slot
- Vertical spacing between signal rows
- High-level and low-level vertical positions or overall signal height
- Color of each signal
- Signal name/label
- Waveform stroke width
- Grid visibility and grid color
- Label color and background/canvas color if practical

Use simple sliders, number fields, color inputs, or compact controls. Show current values beside controls. Prevent invalid values such as zero or negative slot widths.

## Export requirements

### SVG
- Export the actual current waveform diagram as a standalone `.svg` file.
- The exported SVG must include the signal labels, waveform paths, grid/timing divisions, and relevant styling.
- SVG must be self-contained: no external CSS, fonts, images, or network resources required.
- Use correct XML escaping for labels and other user-entered text.
- Use a sensible viewBox and dimensions so the exported file opens correctly in browsers, vector editors, and common design tools.
- Export the diagram, not the website interface.

### PDF
- Export the same diagram to a downloadable `.pdf` file from the browser.
- Include labels, waveforms, and timing grid in the PDF.
- Preserve readable proportions and colors.
- For long diagrams, choose a sensible page orientation and scaling strategy; if one page would make text unreadable, use a deliberate multi-page or landscape fit strategy.
- Do not require a server to generate the PDF.

Both exports must reflect the current data and customization settings, not a stale initial version. Use clear filenames such as `waveform-diagram.svg` and `waveform-diagram.pdf`. Handle export failures gracefully with a useful error message.

## Accessibility and interaction quality

- Every input must have a visible label or accessible name.
- Controls must be keyboard accessible.
- Use clear focus indicators and adequate contrast.
- Buttons need meaningful text or accessible labels.
- Do not rely on color alone to communicate binary state.
- Keep error and validation messages concise and useful.
- Avoid disruptive alerts where inline feedback is appropriate.

## Architecture and code quality

- Use TypeScript types for signals and diagram settings.
- Separate waveform calculation/rendering, editor controls, and export logic into clear modules/components.
- Keep one source of truth for signal data and settings so preview and exports cannot drift apart.
- Avoid direct DOM mutation for normal React state updates.
- Add comments only where they clarify non-obvious logic.
- Do not leave TODO placeholders, fake controls, dead buttons, mock export functions, or unfinished sections.
- Do not add unrelated features such as accounts, cloud saving, collaboration, AI generation, or a backend.
- Keep dependencies and code size reasonable.

## Suggested data model

Each signal can use a structure similar to:

```ts
type Signal = {
  id: string;
  name: string;
  bits: string;
  color: string;
};
```

Diagram settings can include slot width, row spacing, signal height, stroke width, grid visibility/color, label color, and background color.

## Suggested project structure

Adapt as needed, but keep the project organized:

```text
waveform-studio/
  public/
  src/
    components/
      WaveformCanvas.tsx
      SignalEditor.tsx
      DiagramSettings.tsx
      ExportControls.tsx
    lib/
      waveform.ts
      exportSvg.ts
      exportPdf.ts
    types/
      waveform.ts
    App.tsx
    main.tsx
    index.css
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  README.md
```

Use an SVG-based renderer rather than drawing a raster image, so lines remain sharp at any zoom level and export cleanly.

## Vercel deployment constraints

- The app must work as a static Vite frontend.
- `npm run build` must produce the production site in `dist`.
- Do not require serverless functions, API routes, backend services, or runtime secrets.
- Ensure browser-side export libraries are compatible with Vite and run only in the browser where required.
- Provide a README with local setup and deployment instructions.
- Vercel configuration should be minimal. Use the Vite framework preset, root directory set to the project root, build command `npm run build`, and output directory `dist`. Install command can be `npm install`.
- Do not add a `vercel.json` unless there is a concrete need.

## Design direction

Aim for a technical instrument / engineering-tool aesthetic:
- Neutral background
- Crisp thin lines
- Subtle grid
- One restrained accent color for primary actions
- Compact typography
- Clear spacing and alignment
- No unnecessary shadows or visual noise

The preview is the main focus. Make the diagram visually similar to a digital logic timing diagram from an electronics or digital systems textbook, not a generic analytics dashboard.

## Acceptance checklist

Before declaring the project complete, verify all of the following:

- [ ] App runs locally with the documented command.
- [ ] `npm run build` completes without TypeScript or Vite errors.
- [ ] Default example shows `A = 00001111`, `B = 00110011`, `C = 01010101`.
- [ ] Editing any bit updates the correct waveform immediately.
- [ ] Adding, renaming, recoloring, and deleting signals work.
- [ ] Slot width and row spacing controls work.
- [ ] All signals share correctly aligned timing divisions.
- [ ] Long and unequal-length sequences are handled consistently.
- [ ] SVG export downloads a valid, standalone SVG.
- [ ] PDF export downloads a readable PDF of the current diagram.
- [ ] Exported labels and colors match the preview.
- [ ] No backend, database, login, or external API is required.
- [ ] Vercel build/output settings are documented correctly.
- [ ] No visible controls are nonfunctional.

## Final response expected from the coding agent

After implementation, report:
1. The main files created and their roles.
2. The exact commands to install, run, and build the project.
3. The exact Vercel settings.
4. Any limitations or trade-offs in handling unequal sequence lengths and long diagrams.
5. Confirmation that both SVG and PDF export were tested, or clearly state what was not tested.

Do not merely describe how to build the app. Implement it in the current workspace, run the build, fix errors, and verify the acceptance checklist.
