# SpottyFire Roadmap

Current version: **1.0.0**

---

## Done

### Charts & Visualizations
- [x] Bar Chart (vertical/horizontal, aggregation, showValues)
- [x] Scatter Plot (colorBy, sizeBy, scattergl for performance)
- [x] Line Chart (multi-line, groupBy, smooth/spline, area fill)
- [x] Pie / Donut Chart (hole, percent labels)
- [x] Heat Map (cell values, sequential color scale)
- [x] Data Table (sortable, paginated, striped, row marking)

### Marking & Selection
- [x] Click to mark
- [x] Shift+click (add to marking)
- [x] Ctrl+click (toggle marking)
- [x] Lasso / box select (scatter plot)
- [x] Escape to clear
- [x] Cross-chart marking sync via MarkingManager
- [x] Data Limiting (per-chart source filter via dropdown)
- [x] showOnlyMarked mode
- [x] Legend click to mark category rows

### Filtering
- [x] Global FilterPanel component
- [x] Checkbox filters (categorical columns)
- [x] Dual-handle range slider (numeric columns)
- [x] Editable min/max number inputs
- [x] Collapsible filter sidebar layout
- [x] Clear All Filters button

### Chart Configuration UI
- [x] X / Y axis selector dropdowns (positioned on axes)
- [x] Category / Value / Size by / Slice by (context-aware labels)
- [x] Color By collapsible right sidebar with legend
- [x] Aggregation selector (sum, avg, count, min, max)
- [x] Data Limited By dropdown (sidebar + header)
- [x] Invalid axis error overlay (non-numeric validation)

### Data & Formulas
- [x] CSV loading (PapaParse)
- [x] JSON loading
- [x] Computed columns via FormulaEngine (30+ functions)
- [x] Window functions (Avg/Sum OVER group)
- [x] CSV export (all data or marked only)
- [x] Formula bar UI with autocomplete

### Undo/Redo
- [x] Command pattern with undo/redo stacks (max 50)
- [x] Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z keyboard shortcuts
- [x] Toolbar undo/redo buttons with enabled/disabled state
- [x] Batch coalescing for slider drags (one undo per gesture)
- [x] Tracks: marking, filters, chart config, computed columns, themes

### Theming & Styling
- [x] 8 built-in themes (Midnight, Arctic, Forest, Sunset, Corporate, Neon, Obsidian, Porcelain)
- [x] Custom theme API with inheritance
- [x] Runtime theme switching
- [x] CSS variable system
- [x] Panel hover glow, fade-in animations
- [x] Toolbar with theme picker

### Developer Experience
- [x] Single-file IIFE bundle (~120KB)
- [x] Zero-config defaults
- [x] GitHub CI pipeline
- [x] Issue/PR templates, CODE_OF_CONDUCT, SECURITY policy
- [x] .gitignore, .editorconfig, .prettierrc, .eslintrc
- [x] 7 example HTML files + Streamlit wrapper

---

## Planned — Next Up

### More Chart Types
- [ ] Treemap (hierarchical data visualization)
- [ ] Combination Chart (bar + line overlay on dual Y axis)
- [ ] Box Plot (statistical distribution)
- [ ] Waterfall Chart (cumulative totals)
- [ ] KPI / Summary Cards (single-value display with trend)
- [ ] Gantt Chart (timeline/schedule visualization)
- [ ] Map Chart (geographic data via Leaflet.js)
- [ ] Cross Table / Pivot Table

### Layout & Navigation
- [ ] Pages / Tabs (multi-page dashboard with tab bar)
- [ ] Text Area / Annotation panel (markdown or HTML content)
- [ ] Drag-and-drop chart builder (add/move/resize panels)
- [ ] Resizable panels (drag borders to resize)
- [ ] Fullscreen mode per chart

### Data & Connectivity
- [ ] Supabase direct connection (load from table/view)
- [ ] REST API data source (fetch JSON from endpoint)
- [ ] Data refresh / polling (auto-reload at interval)
- [ ] Data on demand / lazy loading (virtual scroll for large datasets)
- [ ] Multi-dataset support (join/link multiple CSVs)

### Interactivity
- [ ] Bookmarks (save/restore filter + marking + config state)
- [ ] Right-click context menu (chart actions, copy, export)
- [ ] Tooltip customization (choose which columns to show)
- [ ] Details-on-Demand panel (click row → side panel with full record)
- [ ] Column search in dropdowns (filter long column lists)
- [ ] Date range picker (calendar widget for date filters)

---

## Future — Post-Launch

### Security
- [ ] XSS sanitization on user-supplied data (HTML entities in tooltips, table cells)
- [ ] Content Security Policy (CSP) compatibility (no inline eval)
- [ ] Input validation on FormulaEngine (prevent code injection via formula strings)
- [ ] Sanitize CSV column names (prevent prototype pollution)
- [ ] Rate-limit filter/marking events (prevent DoS via rapid programmatic calls)

### Performance & Optimization
- [ ] Virtual scrolling for DataTable (handle 100K+ rows)
- [ ] Web Worker for FormulaEngine (off-main-thread computation)
- [ ] Debounced rendering pipeline (coalesce rapid updates)
- [ ] Bundle minification with terser (reduce ~120KB → ~40KB)
- [ ] Source maps for debugging
- [ ] Tree-shakeable ES module build
- [ ] Lazy-load Plotly.js (defer until first chart render)

### Compatibility & Standards
- [ ] TypeScript type definitions (.d.ts file)
- [ ] npm package publishing
- [ ] ES Module export (import { BarChart } from 'spottyfire')
- [ ] CommonJS export (require('spottyfire'))
- [ ] Accessibility (ARIA labels, keyboard navigation, screen reader support)
- [ ] RTL language support
- [ ] Mobile/touch optimization (responsive breakpoints, touch-friendly controls)
- [ ] Browser compatibility testing (Safari, Firefox, Edge, mobile browsers)
- [ ] Print stylesheet (charts render cleanly when printed)

### Testing
- [ ] Unit tests for FormulaEngine (parser, evaluator, edge cases)
- [ ] Unit tests for MarkingManager (set, add, toggle, clear)
- [ ] Unit tests for FilterEngine (values, range, clear)
- [ ] Unit tests for UndoManager (push, undo, redo, batch, max depth)
- [ ] Integration tests for cross-chart marking flow
- [ ] Visual regression tests (screenshot comparison)
- [ ] Performance benchmarks (10K, 50K, 100K rows)

### Documentation
- [ ] API docs site (generated from JSDoc or manual)
- [ ] Interactive playground (edit config → see chart live)
- [ ] Video tutorials
- [ ] Migration guide from Spotfire
- [ ] Cookbook / recipes (common dashboard patterns)

### Ecosystem
- [ ] React wrapper component
- [ ] Vue wrapper component
- [ ] Svelte wrapper component
- [ ] Angular wrapper component
- [ ] Streamlit component (proper Python package)
- [ ] Jupyter notebook widget
- [ ] Figma design tokens (theme export)
