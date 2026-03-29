// ─── HeatMap ────────────────────────────────────────────────
class HeatMap extends BaseChart {
  constructor(selector, dataStore, config) {
    super(selector, dataStore, config);
    this.refresh();
    this._bindEvents();
  }

  refresh() {
    if (this._renderEmptyIfLimited()) return;
    var cfg = this._config;
    if (cfg.aggregation !== 'count' && this._validateNumericAxis(cfg.value, 'Value')) return;
    var theme = ThemeManager.getTheme();
    var rows = this._getLimitedRows();
    var mm = this._mm;
    var hasMarking = mm.hasMarking();

    // showOnlyMarked: empty state
    if (cfg.showOnlyMarked && !hasMarking) {
      var emptyLayout = ThemeManager.getPlotlyLayout({
        xaxis: { title: { text: cfg.x }, type: 'category' },
        yaxis: { title: { text: cfg.y }, type: 'category' },
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
    var yCol = cfg.y;
    var valCol = cfg.value;
    var agg = cfg.aggregation || 'avg';

    // Get unique X and Y values
    var xVals = []; var yVals = [];
    var xSet = {}; var ySet = {};
    rows.forEach(function (r) {
      var xv = String(r[xCol] || '');
      var yv = String(r[yCol] || '');
      if (!xSet[xv]) { xSet[xv] = true; xVals.push(xv); }
      if (!ySet[yv]) { ySet[yv] = true; yVals.push(yv); }
    });

    // Build grid
    var grid = {};
    var gridRows = {};
    rows.forEach(function (r) {
      var xv = String(r[xCol] || '');
      var yv = String(r[yCol] || '');
      var key = xv + '||' + yv;
      if (!grid[key]) { grid[key] = []; gridRows[key] = []; }
      grid[key].push(+r[valCol] || 0);
      gridRows[key].push(r.__rowIndex);
    });

    var z = [];
    var textVals = [];
    var customdata = [];
    yVals.forEach(function (yv) {
      var row = [];
      var txtRow = [];
      var cdRow = [];
      xVals.forEach(function (xv) {
        var key = xv + '||' + yv;
        var arr = grid[key] || [];
        var val = 0;
        if (arr.length > 0) {
          if (agg === 'avg') val = arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
          else if (agg === 'sum') val = arr.reduce(function (a, b) { return a + b; }, 0);
          else if (agg === 'count') val = arr.length;
          else if (agg === 'min') val = Math.min.apply(null, arr);
          else if (agg === 'max') val = Math.max.apply(null, arr);
        }
        row.push(val);
        txtRow.push(val ? val.toFixed(1) : '');
        cdRow.push(gridRows[key] || []);
      });
      z.push(row);
      textVals.push(txtRow);
      customdata.push(cdRow);
    });

    var colorscale = theme.sequential.map(function (c, i, arr) {
      return [i / (arr.length - 1), c];
    });

    var trace = {
      type: 'heatmap',
      x: xVals,
      y: yVals,
      z: z,
      colorscale: colorscale,
      showscale: true,
      hovertemplate: xCol + ': %{x}<br>' + yCol + ': %{y}<br>' + valCol + ': %{z:.1f}<extra></extra>',
      customdata: customdata,
    };

    if (cfg.showValues) {
      trace.text = textVals;
      trace.texttemplate = '%{text}';
      trace.textfont = { size: 11, color: theme.textPrimary };
    }

    // If marking, add overlay annotations
    var layout = ThemeManager.getPlotlyLayout({
      xaxis: { title: { text: xCol }, type: 'category' },
      yaxis: { title: { text: yCol }, type: 'category', autorange: 'reversed' },
      margin: { t: 40, r: 80, b: 60, l: 80 },
    });

    if (hasMarking) {
      // Add shapes around marked cells
      var shapes = [];
      yVals.forEach(function (yv, yi) {
        xVals.forEach(function (xv, xi) {
          var key = xv + '||' + yv;
          var rws = gridRows[key] || [];
          var anyMarked = rws.some(function (ri) { return mm.isMarked(ri); });
          if (anyMarked) {
            shapes.push({
              type: 'rect',
              x0: xi - 0.5, x1: xi + 0.5,
              y0: yi - 0.5, y1: yi + 0.5,
              line: { color: theme.marking, width: 3 },
              fillcolor: 'transparent',
            });
          }
        });
      });
      layout.shapes = shapes;
    }

    Plotly.react(this._getPlotDiv(), [trace], layout, this._plotlyConfig());
  }

  _onMarkingChanged() { this.refresh(); }

  _bindEvents() {
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      if (!data || !data.points || !data.points[0]) return;
      var pt = data.points[0];
      var xi = pt.pointIndex[1] != null ? pt.pointIndex[1] : pt.x;
      var yi = pt.pointIndex[0] != null ? pt.pointIndex[0] : pt.y;

      // Get customdata for this cell
      if (pt.customdata) {
        var rowIndices = Array.isArray(pt.customdata) ? pt.customdata : [pt.customdata];
        if (data.event && data.event.shiftKey) self._mm.addToMarking(rowIndices, self._id);
        else if (data.event && data.event.ctrlKey) self._mm.toggleMarking(rowIndices, self._id);
        else self._mm.setMarking(rowIndices, self._id);
      }
    });
  }
}
