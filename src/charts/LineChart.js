// ─── LineChart ──────────────────────────────────────────────
class LineChart extends BaseChart {
  constructor(selector, dataStore, config) {
    super(selector, dataStore, config);
    this.refresh();
    this._bindEvents();
  }

  refresh() {
    if (this._renderEmptyIfLimited()) return;
    var cfg = this._config;
    var theme = ThemeManager.getTheme();
    var rows = this._getLimitedRows();
    var hasMarking = this._mm.hasMarking();
    var mm = this._mm;

    // showOnlyMarked: empty state
    if (cfg.showOnlyMarked && !hasMarking) {
      var emptyLayout = ThemeManager.getPlotlyLayout({
        xaxis: { title: { text: cfg.x } },
        yaxis: { title: { text: Array.isArray(cfg.y) ? cfg.y.join(', ') : cfg.y } },
        annotations: [{
          text: 'Select data in another chart to display',
          xref: 'paper', yref: 'paper', x: 0.5, y: 0.5,
          showarrow: false, font: { size: 14, color: theme.textMuted },
        }],
      });
      Plotly.react(this._getPlotDiv(), [], emptyLayout, this._plotlyConfig());
      return;
    }

    // showOnlyMarked: filter to marked rows
    if (cfg.showOnlyMarked && hasMarking) {
      rows = rows.filter(function (r) { return mm.isMarked(r.__rowIndex); });
      hasMarking = false;
    }

    var xCol = cfg.x;
    var yCols = Array.isArray(cfg.y) ? cfg.y : [cfg.y];
    var groupBy = cfg.groupBy;
    var smooth = cfg.smooth !== false;
    var showArea = cfg.showArea || false;

    var traces = [];

    // Sort by x
    rows = rows.slice().sort(function (a, b) {
      var va = a[xCol], vb = b[xCol];
      if (va < vb) return -1;
      if (va > vb) return 1;
      return 0;
    });

    if (groupBy) {
      var groups = {};
      rows.forEach(function (r) {
        var g = String(r[groupBy] || 'Other');
        if (!groups[g]) groups[g] = [];
        groups[g].push(r);
      });

      var groupNames = Object.keys(groups).sort();
      groupNames.forEach(function (g, gi) {
        var gRows = groups[g];
        var color = theme.palette[gi % theme.palette.length];
        yCols.forEach(function (yCol) {
          var tr = {
            type: 'scatter',
            mode: 'lines' + (cfg.showMarkers ? '+markers' : ''),
            name: groupBy ? g : yCol,
            x: gRows.map(function (r) { return r[xCol]; }),
            y: gRows.map(function (r) { return r[yCol]; }),
            customdata: gRows.map(function (r) { return r.__rowIndex; }),
            line: { color: color, width: 2, shape: smooth ? 'spline' : 'linear' },
          };
          if (showArea) { tr.fill = 'tozeroy'; tr.fillcolor = color + '20'; }
          if (hasMarking) {
            var anyMarked = gRows.some(function (r) { return mm.isMarked(r.__rowIndex); });
            if (!anyMarked) { tr.line.color = theme.unmarkedColor || '#888'; tr.opacity = theme.unmarkedOpacity; }
          }
          traces.push(tr);
        });
      });
    } else {
      yCols.forEach(function (yCol, yi) {
        var color = theme.palette[yi % theme.palette.length];
        var tr = {
          type: 'scatter',
          mode: 'lines' + (cfg.showMarkers ? '+markers' : ''),
          name: yCol,
          x: rows.map(function (r) { return r[xCol]; }),
          y: rows.map(function (r) { return r[yCol]; }),
          customdata: rows.map(function (r) { return r.__rowIndex; }),
          line: { color: color, width: 2, shape: smooth ? 'spline' : 'linear' },
        };
        if (showArea) { tr.fill = 'tozeroy'; tr.fillcolor = color + '20'; }
        traces.push(tr);
      });
    }

    var layout = ThemeManager.getPlotlyLayout({
      xaxis: { title: { text: xCol } },
      yaxis: { title: { text: yCols.join(', ') } },
    });

    Plotly.react(this._getPlotDiv(), traces, layout, this._plotlyConfig());
  }

  _onMarkingChanged() { this.refresh(); }

  _bindEvents() {
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      if (!data || !data.points || !data.points[0]) return;
      var idx = data.points[0].customdata;
      if (idx == null) return;
      if (data.event && data.event.shiftKey) self._mm.addToMarking([idx], self._id);
      else if (data.event && data.event.ctrlKey) self._mm.toggleMarking([idx], self._id);
      else self._mm.setMarking([idx], self._id);
    });
    div.on('plotly_selected', function (data) {
      if (!data || !data.points) return;
      var indices = data.points.map(function (p) { return p.customdata; }).filter(function (v) { return v != null; });
      if (indices.length) self._mm.setMarking(indices, self._id);
    });
  }
}
