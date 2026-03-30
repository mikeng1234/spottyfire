# Changelog

All notable changes to SpottyFire are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [1.0.0] - 2025-03-30

### Added — Core Library
- **DataStore**: CSV loading (PapaParse), JSON loading, schema detection, row access, computed columns, CSV export
- **MarkingManager**: Cross-chart selection state with pub/sub events (set, add, toggle, clear)
- **FilterEngine**: Global + per-column filtering (value lists, numeric ranges)
- **FormulaEngine**: Recursive descent parser with 30+ built-in functions (math, string, date, logic, window aggregates)
- **ThemeManager**: 8 built-in color themes with CSS variable system and runtime switching

### Added — Chart Types
- **BarChart**: Vertical/horizontal, aggregation (sum/avg/count/min/max), showValues, colorBy
- **ScatterPlot**: colorBy, sizeBy (bubble), scattergl for performance, lasso/box select
- **LineChart**: Multi-line, groupBy, smooth spline, area fill, showMarkers
- **PieChart**: Donut (configurable hole), percent labels, slice pull on marking
- **HeatMap**: Cell values, sequential color scale, click-to-mark cells
- **DataTable**: Sortable columns, pagination, striped rows, row marking, showOnlyMarked

### Added — UI Components
- **ChartWrapper**: Panel with header, body, fade-in animation, hover glow
- **FilterPanel**: Auto-generated controls from column types
- **FormulaBar**: Column name + formula input with add button
- **Toolbar**: Export buttons, theme picker, clear selection

### Added — Themes
- Midnight (default dark), Arctic (clean light), Forest (earthy dark), Sunset (warm dark), Corporate (professional light), Neon (vibrant dark)

### Added — Examples
- 01-quick-start.html — 2 charts + table (< 40 lines)
- 02-full-dashboard.html — All chart types + filters + formulas
- 03-payroll-demo.html — GenXcript payroll analytics
- 04-embed-streamlit.py — Streamlit wrapper
- 05-themes-gallery.html — All themes side by side
- 06-custom-theme.html — Custom branded theme

### Added — Repo
- 200-row Filipino employee sample dataset
- MIT License, README with API docs, CONTRIBUTING guide
- bash build.sh (cat-based IIFE bundler)

---

## [1.1.0] - 2025-03-30

### Added
- **Obsidian theme**: Premium dark — deep blacks (#08080c), jewel-tone palette (violet, teal, gold, coral)
- **Porcelain theme**: Premium light — warm whites (#faf9f7), refined pastels, editorial elegance
- 07-premium-themes.html showcase with split-view comparison

---

## [1.2.0] - 2025-03-30

### Added
- **showOnlyMarked** config option for all chart types — chart shows empty state until data is marked in another chart
- **Color By collapsible sidebar** — right-side panel with column picker + color legend (legend items clickable to mark)
- **Axis selectors** — Y axis dropdown on left side (rotated), X axis dropdown on bottom
- **Context-aware labels** — Pie charts show "Size by" / "Slice by" instead of "Value" / "Category"
- **Aggregation selector** in header for bar, pie, and heatmap charts

---

## [1.3.0] - 2025-03-30

### Added
- **Data Limiting** — cross-chart filtering via "Data Limited By" dropdown
  - Chart registry in DataStore (auto-registers charts by title)
  - Sidebar dropdown lists all other charts as filter sources
  - Header dropdown for charts without sidebar (pie, heatmap, table)
  - Empty state shows source chart name: "Select data in [chart] to display"
  - Status indicator shows row count from source

### Added
- **Numeric axis validation** — error overlay when non-numeric column selected for value/Y axis
  - Warning annotation with column name and guidance message
  - Skips validation for count aggregation
  - Auto-clears when valid column selected

---

## [1.4.0] - 2025-03-30

### Added
- **Global filter sidebar** — collapsible left-side panel layout
  - Smooth slide animation with toggle button
  - Vertical "FILTERS" tab visible when collapsed
  - Charts auto-resize via Plotly when sidebar toggles

### Improved
- **Dual-handle range slider** — replaced two separate sliders with single bar, two draggable thumbs
  - Highlighted fill between thumbs using accent color
  - Click track to move nearest thumb
  - Touch support for mobile
  - Hover/active states with glow effect

### Improved
- **Editable range values** — min/max number inputs synced bidirectionally with slider thumbs

### Fixed
- **Slider drag interruption** — FilterPanel no longer re-renders DOM on every filter change (was destroying slider mid-drag)

---

## [1.5.0] - 2025-03-30

### Added
- **Undo/Redo system** — command pattern with dual stacks
  - Ctrl+Z = undo, Ctrl+Y / Ctrl+Shift+Z = redo
  - Toolbar buttons with auto-enabled/disabled state
  - Max 50 undo entries
  - Tracks: marking, filters, chart config, computed columns, themes
  - Batch coalescing for slider drags (one undo per gesture, not per tick)
  - Suppression flag prevents re-entry during undo/redo replay
  - Undo stack cleared on data reload (stale index protection)

### Added — Repo & DevOps
- .gitignore, .editorconfig, .prettierrc, .eslintrc.json
- GitHub Actions CI workflow (build verify, syntax check, dataset validation)
- Issue templates (bug report, feature request)
- Pull request template with checklist
- CODE_OF_CONDUCT.md (Contributor Covenant v2.1)
- SECURITY.md (vulnerability reporting policy)
- ROADMAP.md (full feature roadmap with categories)
- package.json: repository URL, bugs URL, homepage, engines, lint/format scripts
- README.md: CI badge, license badge, stars badge, issues badge
