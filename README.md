# SpottyFire

**Drop-in interactive charts with cross-chart marking — like Spotfire, but open-source.**

[Quick Start](#quick-start) | [Chart Types](#chart-types) | [Themes](#themes) | [API Reference](#api-reference)

> Screenshot/GIF placeholder: click a bar chart category and watch the scatter plot, pie chart, and table all respond instantly.

## Why SpottyFire?

- **Linked Charts** — Click data in one chart, every other chart responds instantly
- **6 Beautiful Themes** — Looks production-ready out of the box
- **Single File** — One `<script>` tag. No build tools. No frameworks.
- **Fast** — Handles 10k rows smoothly with scattergl and virtual scrolling
- **Computed Columns** — Add formula-based columns like spreadsheets
- **Filtering** — Global filters that affect all charts at once

## Quick Start

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

Click "Engineering" on the bar chart. The scatter plot highlights only Engineering employees. The table shows only those rows. That's it.

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

6 built-in themes — set globally or switch at runtime:

```javascript
SpottyFire.setTheme('midnight');   // Default dark
SpottyFire.setTheme('arctic');     // Clean light
SpottyFire.setTheme('forest');     // Earthy dark
SpottyFire.setTheme('sunset');     // Warm dark
SpottyFire.setTheme('corporate');  // Professional light
SpottyFire.setTheme('neon');       // Vibrant dark
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
| Lasso/Box Select | Select area (scatter plot) |
| Escape | Clear all marking |

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
// Filter sidebar
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
```

## Examples

| File | Description |
|------|-------------|
| `01-quick-start.html` | 2 charts + table with marking (< 40 lines) |
| `02-full-dashboard.html` | All 6 chart types + filters + formulas |
| `03-payroll-demo.html` | GenXcript payroll analytics scenario |
| `04-embed-streamlit.py` | Streamlit embedding wrapper |
| `05-themes-gallery.html` | All 6 themes side by side |
| `06-custom-theme.html` | How to create a branded theme |

## Dependencies

- [Plotly.js](https://plotly.com/javascript/) — Charting engine
- [PapaParse](https://www.papaparse.com/) — CSV parsing

Both loaded from CDN. No npm install required.

## Building

```bash
bash build.sh
# Outputs: dist/spottyfire.js (~79KB)
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
