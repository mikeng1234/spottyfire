// ─── Spotlight Namespace ────────────────────────────────────
var SpottyFire = {
  DataStore: DataStore,
  MarkingManager: MarkingManager,
  FilterEngine: FilterEngine,
  FormulaEngine: FormulaEngine,

  // Charts
  BarChart: function (sel, ds, cfg) { return new BarChart(sel, ds, cfg); },
  ScatterPlot: function (sel, ds, cfg) { return new ScatterPlot(sel, ds, cfg); },
  LineChart: function (sel, ds, cfg) { return new LineChart(sel, ds, cfg); },
  PieChart: function (sel, ds, cfg) { return new PieChart(sel, ds, cfg); },
  HeatMap: function (sel, ds, cfg) { return new HeatMap(sel, ds, cfg); },
  DataTable: function (sel, ds, cfg) { return new DataTable(sel, ds, cfg); },

  // UI
  FilterPanel: function (sel, ds, cfg) { return new FilterPanel(sel, ds, cfg); },
  FormulaBar: function (sel, ds, cfg) { return new FormulaBar(sel, ds, cfg); },
  Toolbar: function (sel, ds, cfg) { return new Toolbar(sel, ds, cfg); },
  ColumnPanel: function (sel, ds, cfg) { return new ColumnPanel(sel, ds, cfg); },

  // Theme API
  setTheme: function (t) { ThemeManager.setTheme(t); },
  getTheme: function () { return ThemeManager.getTheme(); },
  getThemeNames: function () { return ThemeManager.getThemeNames(); },

  // Undo/Redo
  UndoManager: UndoManager,
  undo: function () { UndoManager.undo(); },
  redo: function () { UndoManager.redo(); },

  // ── Quick Create: auto-generates a full dashboard from data ──
  // Usage:
  //   SpottyFire.create('#app', data)
  //   SpottyFire.create('#app', data, { theme: 'obsidian', title: 'My Dashboard' })
  //   SpottyFire.create('#app', '/api/data.csv')  // CSV URL
  create: function (selector, dataOrUrl, opts) {
    opts = opts || {};
    var container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!container) throw new Error('SpottyFire.create: container not found');

    var theme = opts.theme || 'midnight';
    var title = opts.title || 'Dashboard';
    ThemeManager.setTheme(theme);

    var ds = new DataStore();

    function _build() {
      // Detect column types
      var cols = ds.getColumns().filter(function (c) { return c.name !== '__rowIndex'; });
      var numCols = cols.filter(function (c) { return c.type === 'number'; });
      var strCols = cols.filter(function (c) { return c.type === 'string'; });
      var allNames = cols.map(function (c) { return c.name; });

      // Apply user-specified formats
      if (opts.formats) {
        for (var col in opts.formats) {
          ds.setColumnFormat(col, opts.formats[col]);
        }
      }

      // Build layout
      container.innerHTML = '';
      container.style.cssText = 'display:flex;min-height:100vh;';

      // Filter sidebar (right)
      var rightBar = document.createElement('div');
      rightBar.style.cssText = 'width:220px;min-width:220px;background:var(--sl-panel-bg);border-left:1px solid var(--sl-panel-border);overflow-y:auto;order:2;';

      var filterDiv = document.createElement('div');
      rightBar.appendChild(filterDiv);

      // Main area
      var main = document.createElement('div');
      main.style.cssText = 'flex:1;padding:20px;overflow-y:auto;order:1;min-width:0;';

      // Title
      var h1 = document.createElement('h1');
      h1.style.cssText = 'font-size:22px;font-weight:700;margin:0 0 4px;color:var(--sl-text-primary);';
      h1.textContent = title;
      main.appendChild(h1);

      var sub = document.createElement('p');
      sub.style.cssText = 'font-size:13px;color:var(--sl-text-secondary);margin:0 0 16px;';
      sub.textContent = ds.getRowCount() + ' rows \u00B7 ' + cols.length + ' columns. Click charts to cross-filter.';
      main.appendChild(sub);

      // Toolbar
      var toolbarDiv = document.createElement('div');
      main.appendChild(toolbarDiv);

      // Chart grid
      var grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;';

      // Auto-pick best charts based on column types
      var chartCount = 0;

      // 1. Bar chart: first string col as category, first numeric as value
      if (strCols.length > 0 && numCols.length > 0) {
        var barDiv = document.createElement('div');
        barDiv.style.minHeight = '360px';
        grid.appendChild(barDiv);
        SpottyFire.BarChart(barDiv, ds, {
          category: strCols[0].name,
          value: numCols[0].name,
          aggregation: 'avg',
          showValues: true,
          title: 'Avg ' + numCols[0].name + ' by ' + strCols[0].name,
        });
        chartCount++;
      }

      // 2. Scatter plot: first two numeric cols
      if (numCols.length >= 2) {
        var scatterDiv = document.createElement('div');
        scatterDiv.style.minHeight = '360px';
        grid.appendChild(scatterDiv);
        SpottyFire.ScatterPlot(scatterDiv, ds, {
          x: numCols[1].name,
          y: numCols[0].name,
          colorBy: strCols.length > 0 ? strCols[0].name : null,
          pointSize: 7,
          title: numCols[1].name + ' vs ' + numCols[0].name,
        });
        chartCount++;
      }

      // 3. Pie chart: second string col (or first if only one), first numeric
      if (strCols.length > 0 && numCols.length > 0) {
        var pieDiv = document.createElement('div');
        pieDiv.style.minHeight = '360px';
        grid.appendChild(pieDiv);
        var pieCat = strCols.length > 1 ? strCols[1].name : strCols[0].name;
        SpottyFire.PieChart(pieDiv, ds, {
          category: pieCat,
          value: numCols[0].name,
          aggregation: 'sum',
          hole: 0.45,
          showPercent: true,
          title: numCols[0].name + ' by ' + pieCat,
        });
        chartCount++;
      }

      // 4. Stacked bar: if 2+ string cols, stack second on first
      if (strCols.length >= 2 && numCols.length > 0) {
        var stackDiv = document.createElement('div');
        stackDiv.style.minHeight = '360px';
        grid.appendChild(stackDiv);
        SpottyFire.BarChart(stackDiv, ds, {
          category: strCols[0].name,
          value: numCols[0].name,
          aggregation: 'sum',
          colorBy: strCols[1].name,
          title: numCols[0].name + ' by ' + strCols[0].name + ' & ' + strCols[1].name,
        });
        chartCount++;
      }

      // 5. Data table (full width)
      var tableDiv = document.createElement('div');
      tableDiv.style.cssText = 'grid-column:1/-1;height:320px;';
      grid.appendChild(tableDiv);
      SpottyFire.DataTable(tableDiv, ds, {
        columns: allNames.slice(0, 10),
        showOnlyMarked: false,
        pageSize: 20,
        title: 'Data Table',
      });

      main.appendChild(grid);
      container.appendChild(main);
      container.appendChild(rightBar);

      // Initialize UI components
      SpottyFire.Toolbar(toolbarDiv, ds, { showExport: true, showThemeToggle: true });
      SpottyFire.FilterPanel(filterDiv, ds);
    }

    // Handle data: array, CSV URL, or CSV string
    if (Array.isArray(dataOrUrl)) {
      ds.loadJSON(dataOrUrl);
      _build();
    } else if (typeof dataOrUrl === 'string') {
      ds.loadCSV(dataOrUrl).then(_build);
    }

    return ds;
  },

  // Version
  version: '1.0.0',
};

// Also expose as Spotlight for backward compatibility
global.SpottyFire = SpottyFire;
global.Spotlight = SpottyFire;
