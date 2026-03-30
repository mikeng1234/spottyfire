# Contributing to SpottyFire

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Clone the repo
2. Open `examples/01-quick-start.html` in your browser — no build tools needed
3. Edit files in `src/` and run `bash build.sh` to rebuild

## Project Structure

- `src/core/` — Data layer, marking engine, themes, filters, formulas, undo/redo
  - `DataStore.js` — Data loading, filtering, computed columns
  - `MarkingEngine.js` — Cross-chart marking state
  - `ThemeManager.js` — 8 built-in themes + custom theme API
  - `FilterEngine.js` — Global filter logic
  - `FormulaEngine.js` — 30+ formula functions
  - `UndoManager.js` — Undo/redo stack for marking and filter operations
- `src/charts/` — Chart components (each extends BaseChart)
  - `BaseChart.js` — Shared chart logic, `resizeAll()`, theme/filter reactivity
  - `BarChart.js`, `ScatterPlot.js`, `LineChart.js`, `PieChart.js`, `HeatMap.js`, `DataTable.js`
- `src/ui/` — UI components
  - `FilterPanel.js` — Collapsible filter sidebar (checkboxes, dual-range sliders, date pickers)
  - `FormulaBar.js` — Formula input
  - `Toolbar.js` — Export and theme toggle toolbar
  - `MenuBar.js` — File/Edit/View menu bar with CSV/JSON upload, export, undo/redo
  - `ContextMenu.js` — Right-click context menu (mark, filter, exclude, copy, sort, duplicate, create linked viz)
  - `VizPanel.js` — Add new visualizations from sidebar tiles
  - `ColumnPanel.js` — Column format manager (currency, percent, integer, scientific)
  - `TileEngine.js` — Smart layout engine (2 per row, auto-fill)
  - `ChartWrapper.js` — Chart container with type switcher, properties sidebar, cog settings
- `examples/` — Demo HTML files
- `app.html` — Standalone app with drag-and-drop CSV landing page
- `dist/` — Bundled output (~233KB IIFE)

## How to Add a New Chart Type

1. Create `src/charts/YourChart.js` extending `BaseChart`
2. Implement `refresh()` and `_onMarkingChanged()`
3. Bind Plotly events for selection in `_bindEvents()`
4. Add it to `src/index.js` in the SpottyFire namespace
5. Add it to `build.sh`
6. Add an example usage in one of the example files

## Guidelines

- No external dependencies beyond Plotly.js and PapaParse
- Vanilla JS only (ES6 classes are fine)
- Every chart must support cross-chart marking
- Use `recalcLayout()` when adding/removing/resizing chart panels
- Use `BaseChart.resizeAll()` to trigger responsive resize across all active charts
- New actions that modify state should integrate with the undo system (`UndoManager`)
- Context menu actions should be registered in `ContextMenu.js`
- Test with the sample dataset before submitting

## Submitting Changes

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run `bash build.sh` and test examples in browser
5. Submit a pull request

## Code Style

- 2-space indentation
- ES6 classes for components
- No semicolons are fine, but be consistent within a file
- Keep functions small and focused
