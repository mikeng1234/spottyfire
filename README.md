# SpottyFire

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/mikeng1234/spottyfire/actions/workflows/ci.yml/badge.svg)](https://github.com/mikeng1234/spottyfire/actions/workflows/ci.yml)
[![GitHub Stars](https://img.shields.io/github/stars/mikeng1234/spottyfire?style=social)](https://github.com/mikeng1234/spottyfire)
[![GitHub Issues](https://img.shields.io/github/issues/mikeng1234/spottyfire)](https://github.com/mikeng1234/spottyfire/issues)

**A lightweight open-source data analytics tool — like Spotfire, but free and zero-dependency.**

[Quick Start](#quick-start) | [Chart Types](#chart-types) | [Themes](#themes) | [API Reference](#api-reference) | [Contributing](CONTRIBUTING.md)

> Screenshot/GIF placeholder: click a bar chart category and watch the scatter plot, pie chart, and table all respond instantly.

## Why SpottyFire?

- **Linked Charts** — Click data in one chart, every other chart responds instantly (click/shift/ctrl/lasso)
- **8 Built-in Themes** — Looks production-ready out of the box, plus custom theme API
- **Single File** — One `<script>` tag (~233KB). No build tools. No frameworks.
- **Fast** — Handles 10k rows smoothly with scattergl and virtual scrolling
- **Formula Engine** — 30+ functions for computed columns (math, string, date, logic, window)
- **Global Filters** — Checkboxes, dual-range sliders, and date pickers that affect all charts
- **Undo/Redo** — Full Ctrl+Z / Ctrl+Y support for marking and filter operations
- **Menu Bar** — File/Edit/View menus with CSV/JSON upload, export, and undo/redo
- **Right-Click Context Menu** — Mark, filter, exclude, copy, sort, duplicate, create linked viz
- **Standalone App** — `app.html` with drag-and-drop CSV landing page and auto-generated dashboards
- **One-Liner Setup** — `SpottyFire.create()` auto-detects columns and generates best charts

## Quick Start

### One-Liner (Recommended)

```html
<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script src="dist/spottyfire.js"></script>

<script>
  SpottyFire.create('data/sample-employees.csv');
</script>
```

That's it. SpottyFire auto-detects column types, picks the best chart types, builds a full dashboard with filters, menu bar, and cross-chart marking.

### Manual Setup

```html
<!-- 1. Add dependencies -->
<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script src="dist/spottyfire.js"></script>

<!-- 2. Add containers -->
<div id="bar" style="height: 400px;"></div>
<div id="scatter" style="height: 400px;"></div>
<div id="table" style="height: 300px;"></div>

<!-- 3. Initialize -->
<script>
  const ds = new SpottyFire.DataStore();
  ds.loadCSV('data/sample-employees.csv').then(() => {

    SpottyFire.BarChart('#bar', ds, {
      category: 'Department',
      value: 'Salary',
      aggregation: 'avg',
      title: 'Avg Salary by Department'
    });

    SpottyFire.ScatterPlot('#scatter', ds, {
      x: 'Age',
      y: 'Salary',
      colorBy: 'Department',
      title: 'Age vs Salary'
    });

    SpottyFire.DataTable('#table', ds, {
      columns: ['Name', 'Department', 'Salary', 'Age'],
      showOnlyMarked: true,
      title: 'Selected Employees'
    });
  });
</script>
```

Click "Engineering" on the bar chart. The scatter plot highlights only Engineering employees. The table shows only those rows.

### Standalone App

Open `app.html` in your browser for a drag-and-drop CSV landing page that auto-generates a full dashboard.

## Chart Types

| Chart | Constructor | Key Config |
|-------|-----------|-----------|
| Bar Chart | `SpottyFire.BarChart(el, ds, cfg)` | `category`, `value`, `aggregation`, `orientation` |
| Scatter Plot | `SpottyFire.ScatterPlot(el, ds, cfg)` | `x`, `y`, `colorBy`, `sizeBy` |
| Line Chart | `SpottyFire.LineChart(el, ds, cfg)` | `x`, `y`, `groupBy`, `smooth`, `showArea` |
| Pie Chart | `SpottyFire.PieChart(el, ds, cfg)` | `category`, `value`, `hole` |
| Heat Map | `SpottyFire.HeatMap(el, ds, cfg)` | `x`, `y`, `value`, `colorScale` |
| Data Table | `SpottyFire.DataTable(el, ds, cfg)` | `columns`, `showOnlyMarked`, `pageSize` |

All charts support: `title`, cross-chart marking, theme awareness, and filter responsiveness.

## Themes

8 built-in themes — set globally or switch at runtime:

```javascript
SpottyFire.setTheme('midnight');   // Default dark
SpottyFire.setTheme('arctic');     // Clean light
SpottyFire.setTheme('forest');     // Earthy dark
SpottyFire.setTheme('sunset');     // Warm dark
SpottyFire.setTheme('corporate');  // Professional light
SpottyFire.setTheme('neon');       // Vibrant dark
SpottyFire.setTheme('obsidian');   // Deep dark
SpottyFire.setTheme('porcelain'); // Soft light
```

### Custom Themes

```javascript
SpottyFire.setTheme({
  name: 'mybrand',
  background: '#0a0f1a',
  panelBg: '#111827',
  accent: '#2563eb',
  marking: '#f59e0b',
  palette: ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626'],
  // Inherits defaults for anything not specified
});
```

## Interactions

| Action | Behavior |
|--------|----------|
| Click | Select/mark data points |
| Shift + Click | Add to current marking |
| Ctrl + Click | Toggle marking |
| Double-Click | Clear all marking |
| Lasso/Box Select | Select area (scatter plot) |
| Escape | Clear all marking |
| Ctrl + Z | Undo last action |
| Ctrl + Y | Redo last action |
| Right-Click | Open context menu (mark, filter, exclude, copy, sort, duplicate) |
| F11 | Toggle fullscreen mode |

## API Reference

### DataStore

```javascript
const ds = new SpottyFire.DataStore();

// Loading
await ds.loadCSV(urlOrString);
ds.loadJSON(arrayOfObjects);

// Schema
ds.getColumns();              // [{ name, type, nullCount }]
ds.getColumnValues(col);      // unique sorted values
ds.getStats(col);             // { min, max, mean, median, count, nulls }

// Computed Columns
ds.addCalculatedColumn('Annual', '[Salary] * 12');
ds.addCalculatedColumn('Bracket', 'If([Salary] > 50000, "High", "Low")');

// Filtering
ds.setFilter('Dept', { type: 'values', selected: ['Engineering', 'Sales'] });
ds.setFilter('Age', { type: 'range', min: 25, max: 45 });
ds.clearFilter('Dept');
ds.clearAllFilters();

// Export
ds.downloadCSV('export.csv');
ds.downloadCSV('marked.csv', { markedOnly: true });
```

### FormulaEngine Functions

| Category | Functions |
|----------|-----------|
| Math | `Abs`, `Round`, `Floor`, `Ceil`, `Log`, `Sqrt`, `Power`, `Min`, `Max` |
| String | `Upper`, `Lower`, `Trim`, `Left`, `Right`, `Len`, `Concatenate`, `Replace`, `Contains` |
| Date | `Year`, `Month`, `Day`, `Today`, `DateDiff`, `DateAdd` |
| Logic | `If`, `And`, `Or`, `Not`, `IsNull`, `IfNull` |
| Window | `Avg([col]) OVER [group]`, `Sum([col]) OVER [group]` |

Column references use `[BracketNotation]`.

### UI Components

```javascript
// Filter sidebar with checkboxes, dual-range sliders, and date pickers
SpottyFire.FilterPanel('#sidebar', ds, {
  columns: ['Department', 'Region', 'Salary']
});

// Formula input
SpottyFire.FormulaBar('#formula', ds);

// Toolbar with export + theme toggle
SpottyFire.Toolbar('#toolbar', ds, {
  showExport: true,
  showThemeToggle: true,
  themes: ['midnight', 'arctic', 'sunset']
});

// Menu bar (File/Edit/View) with CSV/JSON upload, export, undo/redo
SpottyFire.MenuBar('#menubar', ds);

// Visualization panel — add new charts from sidebar tiles
SpottyFire.VizPanel('#vizpanel', ds);

// Column format manager (currency, percent, integer, scientific, etc.)
SpottyFire.ColumnPanel('#colpanel', ds);
```

### One-Liner Dashboard

```javascript
// Auto-detect columns and generate best charts with full UI
SpottyFire.create('data/sample.csv');
SpottyFire.create('data/sample.csv', { theme: 'sunset' });
```

### Undo/Redo

```javascript
SpottyFire.undo();  // or Ctrl+Z
SpottyFire.redo();  // or Ctrl+Y
```

## Examples

| File | Description |
|------|-------------|
| `01-quick-start.html` | 2 charts + table with marking (< 40 lines) |
| `02-full-dashboard.html` | All 6 chart types + filters + formulas |
| `03-payroll-demo.html` | GenXcript payroll analytics scenario |
| `04-embed-streamlit.py` | Streamlit embedding wrapper |
| `05-themes-gallery.html` | All 8 themes side by side |
| `06-custom-theme.html` | How to create a branded theme |
| `07-premium-themes.html` | Obsidian and Porcelain theme showcase |
| `08-correlation-sales.html` | Sales correlation analysis with linked charts |
| `app.html` | Standalone app with drag-and-drop CSV landing page |

## Dependencies

- [Plotly.js](https://plotly.com/javascript/) — Charting engine
- [PapaParse](https://www.papaparse.com/) — CSV parsing

Both loaded from CDN. No npm install required.

## Building

```bash
bash build.sh
# Outputs: dist/spottyfire.js (~233KB)
```

No webpack, no rollup — just `cat` concatenation wrapped in an IIFE.

## Roadmap

- [ ] Supabase direct connection
- [ ] Trellis / small multiples
- [ ] Saved bookmarks (filter + marking state)
- [ ] npm package publish
- [ ] Details-on-demand panel
- [ ] Drag-and-drop chart builder

## License

MIT
