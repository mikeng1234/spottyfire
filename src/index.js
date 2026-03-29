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

  // Theme API
  setTheme: function (t) { ThemeManager.setTheme(t); },
  getTheme: function () { return ThemeManager.getTheme(); },
  getThemeNames: function () { return ThemeManager.getThemeNames(); },

  // Version
  version: '1.0.0',
};

// Also expose as Spotlight for backward compatibility
global.SpottyFire = SpottyFire;
global.Spotlight = SpottyFire;
