# SpottyFire — Spotfire Capabilities Reference

> This document catalogs all TIBCO Spotfire charting, marking, filtering, and interactive capabilities.
> It serves as the feature spec for our web-based SpottyFire tool.

---

## 1. Chart / Visualization Types

### Core Built-in Types

| Chart Type | Description | Key Features |
|---|---|---|
| **Bar Chart** | Categorical data summarization | Horizontal/vertical, stacked, side-by-side, 100% modes |
| **Line Chart** | Trends over time | Multiple series, continuous axes, interpolation |
| **Scatter Plot** | Two-variable relationship | Color/size/shape by column, jittering, trend lines |
| **Pie Chart** | Proportional display | Interactive drill-down, label formatting |
| **Combination Chart** | Overlays bars + lines | Dual Y-axes (left/right), mixed aggregations |
| **Cross Table** | Pivot-table matrix | Row/column hierarchies, cell coloring, heat map mode |
| **Table Plot** | Raw row-level data | Sorting, column reorder, conditional formatting |
| **Summary Table** | Aggregated tabular view | Grouped summaries, calculated measures |
| **Graphical Table** | Visual summary per row | Sparklines, bullet graphs, conditional icons, KPI values |
| **Map Chart** | Geospatial visualization | Marker/feature/WMS/TMS/image layers |
| **Heat Map** | Color-coded matrix | Continuous color scales, clustering |
| **Treemap** | Hierarchical area display | Nested rectangles sized by measure, color by category |
| **KPI Chart** | Performance indicators | Current vs comparative values, status indicators |
| **Waterfall Chart** | Cumulative positive/negative | Running totals, subtotals, category bridges |
| **Box Plot** | Distribution display | Median, quartiles, outliers, whiskers |
| **3D Scatter Plot** | Three-variable spatial | Interactive rotation, perspective control |
| **Parallel Coordinate Plot** | Multi-dimensional comparison | Parallel vertical axes, line-per-row, brushing |
| **Text Area** | Rich content container | HTML, images, action controls, property controls, scripts |

### Extended Types (Mods / Extensions)

| Chart Type | Description |
|---|---|
| **Gantt Chart** | Project timelines with start/end ranges |
| **Donut Chart** | Pie with hollow center |
| **Bubble Chart** | Scatter with sized markers (3 variables) |
| **Histogram** | Frequency distribution with binning |
| **Pareto Chart** | Descending bars + cumulative line |
| **Beeswarm Plot** | Distribution with individual points |
| **Sunburst Chart** | Concentric-circle hierarchy |
| **Word Cloud** | Text prominence by frequency/measure |
| **Radar / Spider Chart** | Multi-axis radial comparison |
| **Sankey Diagram** | Flow/relationship visualization |
| **Network Chart** | Node-link relationship display |
| **Gauge / Dial Chart** | Radial scale indicator |
| **Violin Plot** | Probability density distribution |
| **Kanban Chart** | Work-stage visualization |
| **Candlestick Chart** | Financial OHLC price movement |
| **Bump Chart** | Rank changes over time |
| **3D Surface Chart** | 3D surface rendering |
| **Scatter Matrix** | Pairwise variable grid |
| **Animated Bubble Chart** | Time-animated scatter/bubble |

---

## 2. Marking (Selection & Brush-Linking)

### How Marking Works
- Marking operates at **row-level resolution** — a row is either marked or not
- When rows are marked in one visualization, **every other visualization** sharing the same data table and marking is affected (brush-linking)
- Unmarked items **fade out**; marked items retain original colors with a dark outline
- Optionally: marked items shown in a separate marking color

### Multiple Marking Schemes
- An analysis can hold **multiple named markings**, each with a unique color
- Marking in one visualization only affects visualizations using the **same marking**
- Markings are created/managed in Document Properties > Markings tab
- Each marking color is fully customizable

### Selection Modes
| Mode | Description |
|---|---|
| **Rectangle Selection** | Click-and-drag rectangular area |
| **Lasso Selection** | Freeform drawing around data points |
| **Single Click** | Select individual data point |
| **Ctrl+Click** | Add to existing selection |
| **Shift+Click** | Range selection |

---

## 3. Marking Cascading / Nesting (The Core Feature)

### Limit Data Using Markings
- A "child" visualization can be configured to **only show data that is marked** in a "parent" visualization
- Configured per visualization in: `Properties > Data > Limit data using markings`
- Creates a **master-detail** cascade: `Chart 1 → Chart 2 → Chart 3 → ...`

### Cascade Behavior
```
┌─────────────┐    marking    ┌─────────────┐    marking    ┌─────────────┐
│   Chart 1   │ ──────────▶  │   Chart 2   │ ──────────▶  │   Chart 3   │
│  (master)   │   limits     │  (detail 1) │   limits     │  (detail 2) │
│             │   data in    │             │   data in    │             │
└─────────────┘              └─────────────┘              └─────────────┘
     ▲                            ▲                            ▲
  User marks               Shows only rows              Shows only rows
  data points              marked in Chart 1            marked in Chart 2
```

### Combination Modes
| Mode | Behavior |
|---|---|
| **Intersection (AND)** | Rows must be in ALL selected markings |
| **Union (ANY)** | Rows in ANY of the selected markings are shown |

### Best Practices
- Configure a **"Message on empty background"** for child visualizations when no marking is active
- Use **different marking names** for unrelated data tables
- Combine marking limiting with filtering and expression limiting for complex scenarios

---

## 4. Filtering

### Filter Panel Types

| Filter Type | Description | Use Case |
|---|---|---|
| **Checkbox Filter** | Individual value checkboxes | Categorical columns, multi-select |
| **Checkbox Hierarchy Filter** | Hierarchical checkboxes | Nested categories (Region > City) |
| **Range Filter (Slider)** | Low/high range slider | Numeric, date columns |
| **Radio Button Filter** | Single-value selection | Mutually exclusive categories |
| **List Box Filter** | Scrollable list with search | Long categorical lists, multi-select |
| **Text Filter** | Free-text search | Wildcard (`*son`), boolean (OR), exact phrase (`"quoted"`) |
| **Item Filter** | Single-item selection | Quick single-value pick |

### Filtering Schemes
- Multiple filtering schemes can coexist in an analysis
- Each page or visualization can use a **different filtering scheme**
- Filtering in one scheme does **not** affect other schemes
- Enables independent filter contexts across pages

### Dynamic vs Static Filtering
| Type | Description |
|---|---|
| **Dynamic** | Responds to user interaction in real-time |
| **Static (Expression)** | `Limit data using expression` — hard filter that ignores filter panel changes |

### Filter Actions on Marked Data
- **Filter To**: Keep only marked items (creates tracking column with Yes/No checkbox)
- **Filter Out**: Remove marked items (creates tracking column)

---

## 5. Data Table Relations

### Relations
- Manually defined links between tables
- Enable **marking and filtering propagation** across tables
- Configurable propagation:
  - Include filtered rows only
  - Exclude filtered out rows
  - Ignore filtering

### Column Matches
- Auto-detected based on matching column name + data type
- Allow cross-table calculations on aggregating axes
- Looser than relations (no marking/filtering propagation)

---

## 6. Interactive Features

### Visual Encoding Axes

| Axis | Description |
|---|---|
| **X / Y Axis** | Primary data mapping |
| **Color By** | Categorical coloring, continuous gradients, rule-based |
| **Size By** | Continuous or categorical marker sizing |
| **Shape By** | One shape per category |
| **Rotation By** | Marker rotation angle |

### Drill-Down
- Create detail visualizations showing only currently marked data
- Hierarchical axes support drill-down through category levels
- Seamless drill-down in map chart layers

### Trellis / Small Multiples
- Split any visualization into panels by category
- Layout: rows only, columns only, or matrix
- Shared axis scales across all panels for comparison
- Manual control over max rows/columns

### Animation / Play Axis
- Animate data points over time (Animated Bubble Chart mod)
- Custom animation via scripting (repeatedly updating range filters)

### Reference Lines & Curves
| Type | Description |
|---|---|
| **Horizontal/Vertical Lines** | Fixed or dynamic reference lines |
| **Reference Bands** | Shaded regions between two values |
| **Trend Lines** | Straight, polynomial, logistic regression |
| **Custom Curves** | Expressions linked to data table parameters |

### Tooltips
- Built-in tooltips show data values on hover
- Custom tooltips via Mods/JSViz extensions
- Configurable content and formatting

### Jittering
- Spread overlapping markers in scatter plots
- Makes dense data distributions visible

---

## 7. Expressions & Aggregations

### Aggregation Methods
| Method | Description |
|---|---|
| `Sum` | Total of values |
| `Avg` | Arithmetic mean |
| `Count` | Number of rows |
| `UniqueCount` | Distinct values |
| `Min` / `Max` | Minimum / Maximum |
| `Median` | Middle value |
| `Percentile` | Nth percentile |
| `StdDev` / `Variance` | Statistical spread |
| `Concatenate` | Join text values |
| `First` / `Last` | First/last in order |

### Expression Types
| Type | Scope | Responds to Filtering |
|---|---|---|
| **Calculated Column** | New column in data table, all visualizations | No (ignores filtering) |
| **Custom Expression** | Applied to axis/setting, single visualization | Yes (re-evaluates with filtering) |

### Advanced Expressions
- **OVER**: Partitioned aggregations — `Sum([Sales]) OVER ([Region])`
- **THEN**: Post-aggregation expressions — cumulative sums, rank
- **Axis References**: `[Axis.X]`, `[Axis.Y]` for computed positioning
- **Nested Aggregations**: Supported differently in columns vs expressions

---

## 8. Data Functions (Computation Extensions)

### Supported Engines
- TIBCO Enterprise Runtime for R (TERR)
- Open-source R
- Python
- SAS / MATLAB / S-PLUS

### Input Parameters
- Expressions, columns, properties
- Can be limited by markings and filtering (intersection)

### Output Operations
- Add new table
- Add columns (join or direct)
- Add rows
- Replace table data
- Set document/column/table properties

---

## 9. Layout & Navigation

### Pages / Tabs
- Multiple pages per analysis
- Navigation modes: Titled Tabs, Step-by-Step, History Arrows
- Pages can be hidden from end users in step-by-step mode
- Each page can use its own filtering scheme

### Visualization Areas
- Multiple visualizations freely arranged on each page
- Resizable and repositionable
- Tiling or overlapping layouts

### Text Areas with HTML
- Rich content container for formatted text, images, hyperlinks
- Supports HTML editing
- Can embed action controls, property controls, filter controls
- Scripting triggers (IronPython)

### Action Controls
| Control | Description |
|---|---|
| **Button** | Triggers one or more actions on click |
| **Link** | Text hyperlink triggering actions |
| **Image** | Clickable image triggering actions |

### Actions Available
- Switch page
- Apply bookmark
- Refresh data function
- Run script
- Open Spotfire tools

### Property Controls
| Control | Description |
|---|---|
| **Drop-down List** | Select from predefined or column-derived values |
| **List Box** | Multi-select from list |
| **Slider** | Numeric range selection |
| **Input Field** | Free-text entry |
| **Label** | Display current property value |

### Bookmarks
- Save and restore analysis states (filters, markings, page, properties)
- Named bookmarks for quick navigation

---

## 10. SpottyFire Implementation Priority

### Phase 1 — Core (MVP)
- [ ] Bar, Line, Scatter, Pie charts
- [ ] Marking with brush-linking across charts
- [ ] Marking cascade/nesting (limit data using markings)
- [ ] Basic filter panel (checkbox, range slider, text search)
- [ ] Color/Size by column
- [ ] Tooltips on hover
- [ ] Page/tab navigation
- [ ] CSV/JSON data loading

### Phase 2 — Enhanced
- [ ] Combination chart (dual Y-axis)
- [ ] Treemap, Heat Map, Box Plot
- [ ] Trellis / small multiples
- [ ] Multiple marking schemes
- [ ] Filtering schemes
- [ ] Reference lines and trend lines
- [ ] Aggregation expressions (Sum, Avg, Count, etc.)
- [ ] Details-on-demand panel

### Phase 3 — Advanced
- [ ] Cross Table / Pivot
- [ ] Map chart (GeoJSON layers)
- [ ] Parallel coordinates
- [ ] KPI chart / Graphical table
- [ ] Custom expressions / calculated columns
- [ ] OVER/THEN expression syntax
- [ ] Data table relations
- [ ] Animation / play axis
- [ ] Lasso selection
- [ ] Bookmarks (save/restore state)

### Phase 4 — Extensions
- [ ] Sankey, Sunburst, Radar, Network charts
- [ ] Histogram, Pareto, Waterfall
- [ ] 3D Scatter
- [ ] Word Cloud
- [ ] Property controls (dropdowns, sliders driving visualizations)
- [ ] Action controls (buttons triggering page switches)
- [ ] Export to PDF / image
- [ ] Plugin/mod system for custom chart types
