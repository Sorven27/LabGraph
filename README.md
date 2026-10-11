# LabGraph

LabGraph is a small, privacy-friendly web app for creating print-ready experimental charts with uncertainty bars. It runs entirely in the browser, works offline, and exports calibrated A4 documents without requiring an account or external service.

The interface is English by default. Russian is available from the `RU` language button.

## Highlights

- Manual data entry, clipboard paste, and CSV/TSV import
- X and Y uncertainty bars
- Linear, direct-proportion, and quadratic regression
- Smooth interpolation for unknown relationships
- Automatic horizontal and vertical mean lines
- One-click X/Y axis swap, including uncertainties and scale settings
- Automatic or manual axis ranges and tick spacing
- Plain, coordinate-grid, and calibrated graph-paper backgrounds
- Landscape and portrait A4 layouts
- SVG, PNG (300 dpi), PDF, and CSV export
- Portable `.labgraph.json` project files
- Undo/redo, keyboard shortcuts, and local autosave
- Dark theme by default, with a persistent light-theme option
- English and Russian interface
- No analytics, ads, uploads, or external runtime dependencies

## Run the app

### Browser

Open `index.html` directly, or start any static web server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

### Windows

Download and extract the Windows ZIP from [Releases](../../releases), then double-click `Start LabGraph on Windows.cmd`.

The launcher uses the Windows PowerShell already included with Windows. It does not require Python or Node.js. Use the **Quit** button in LabGraph, or close the launcher window, to stop the local server.

### macOS

Download the macOS ZIP from [Releases](../../releases), extract it, and open `LabGraph.app`.

The release is ad-hoc signed. Depending on your macOS security settings, the first launch may require Control-clicking the app and choosing **Open**.

## Basic workflow

1. Enter, paste, or import X/Y values and optional uncertainties.
2. Choose a fit, constant line, page orientation, and paper style.
3. Review the live chart preview.
4. Export PDF for printing, SVG for editing, PNG for documents, or CSV for data reuse.

For calibrated graph paper, print the downloaded PDF at **100% scale** and disable options such as “Fit to page”. The 10 mm control mark in the lower-right corner can be measured after printing.

## Keyboard shortcuts

| Action | Shortcut |
| --- | --- |
| Save project | `Ctrl/Command + S` |
| Open project | `Ctrl/Command + O` |
| Download PDF | `Ctrl/Command + P` |
| Undo | `Ctrl/Command + Z` |
| Redo | `Ctrl/Command + Shift + Z` or `Ctrl + Y` |
| Move to the next table cell | `Enter` |

## Development

LabGraph has no production dependencies and no build step for the web version.

```bash
npm test
```

The test command checks JavaScript syntax, required project files, default-language settings, and translation-key parity.

To build local release archives on macOS:

```bash
./scripts/build-release.sh
```

Artifacts are written to `dist/`.

## GitHub deployment

- Every push and pull request runs the smoke test.
- Every push to `main` deploys the static app to GitHub Pages.
- Pushing a tag such as `v1.0.0` builds Windows and macOS archives and creates a GitHub Release.

Enable GitHub Pages with **Settings → Pages → Source → GitHub Actions** after creating the repository.

## Privacy

All chart data remains in the browser. Autosave uses local browser storage. LabGraph does not send chart data anywhere.

## Contributing

Bug reports and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

## License

Released under the [MIT License](LICENSE).
