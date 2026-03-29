// ─── PieChart ───────────────────────────────────────────────
class PieChart extends BaseChart {
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

    var cat = cfg.category;
    var val = cfg.value;
    var agg = cfg.aggregation || 'sum';

    // Aggregate
    var groups = {};
    var groupRows = {};
    rows.forEach(function (r) {
      var key = String(r[cat] || 'Unknown');
      if (!groups[key]) { groups[key] = []; groupRows[key] = []; }
      groups[key].push(+r[val] || 0);
      groupRows[key].push(r.__rowIndex);
    });

    var labels = Object.keys(groups);
    var values = labels.map(function (k) {
      var arr = groups[k];
      if (agg === 'sum') return arr.reduce(function (a, b) { return a + b; }, 0);
      if (agg === 'avg') return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
      if (agg === 'count') return arr.length;
      if (agg === 'min') return Math.min.apply(null, arr);
      if (agg === 'max') return Math.max.apply(null, arr);
      return arr.reduce(function (a, b) { return a + b; }, 0);
    });

    var colors;
    if (hasMarking) {
      colors = labels.map(function (k, i) {
        var anyMarked = groupRows[k].some(function (ri) { return mm.isMarked(ri); });
        return anyMarked ? theme.palette[i % theme.palette.length] : (theme.unmarkedColor || '#888');
      });
    } else {
      colors = labels.map(function (_, i) { return theme.palette[i % theme.palette.length]; });
    }

    var trace = {
      type: 'pie',
      labels: labels,
      values: values,
      marker: {
        colors: colors,
        line: { color: theme.panelBg, width: 2 },
      },
      hole: cfg.hole != null ? cfg.hole : 0.45,
      textinfo: cfg.showPercent !== false ? 'percent+label' : 'label',
      textfont: { size: 11, color: theme.textPrimary },
      hoverinfo: 'label+value+percent',
      customdata: labels.map(function (k) { return groupRows[k]; }),
      sort: false,
    };

    if (hasMarking) {
      trace.pull = labels.map(function (k) {
        var anyMarked = groupRows[k].some(function (ri) { return mm.isMarked(ri); });
        return anyMarked ? 0.05 : 0;
      });
      trace.opacity = labels.map(function (k) {
        var anyMarked = groupRows[k].some(function (ri) { return mm.isMarked(ri); });
        return anyMarked ? 1 : theme.unmarkedOpacity + 0.2;
      });
    }

    var layout = ThemeManager.getPlotlyLayout({
      showlegend: true,
      legend: { orientation: 'v', x: 1.02, y: 0.5, xanchor: 'left' },
      margin: { t: 40, r: 120, b: 40, l: 40 },
    });

    Plotly.react(this._getPlotDiv(), [trace], layout, this._plotlyConfig());
  }

  _onMarkingChanged() { this.refresh(); }

  _bindEvents() {
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      if (!data || !data.points || !data.points[0]) return;
      var pt = data.points[0];
      var rowIndices = pt.customdata;
      if (!rowIndices) return;
      if (data.event && data.event.shiftKey) self._mm.addToMarking(rowIndices, self._id);
      else if (data.event && data.event.ctrlKey) self._mm.toggleMarking(rowIndices, self._id);
      else self._mm.setMarking(rowIndices, self._id);
    });
  }
}
