// ─── BarChart ───────────────────────────────────────────────
class BarChart extends BaseChart {
  constructor(selector, dataStore, config) {
    super(selector, dataStore, config);
    this.refresh();
    this._bindEvents();
  }

  refresh() {
    var cfg = this._config;
    var theme = ThemeManager.getTheme();
    var rows = this._ds.getFilteredRows();
    var cat = cfg.category;
    var val = cfg.value;
    var agg = cfg.aggregation || 'sum';
    var orientation = cfg.orientation || 'vertical';
    var colorBy = cfg.colorBy;
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
      hasMarking = false; // no need to split — already filtered
    }

    // Aggregate
    var groups = {};
    var groupRows = {};
    rows.forEach(function (r) {
      var key = String(r[cat] || 'Unknown');
      if (!groups[key]) { groups[key] = []; groupRows[key] = []; }
      groups[key].push(+r[val] || 0);
      groupRows[key].push(r.__rowIndex);
    });

    var categories = Object.keys(groups);
    var values = categories.map(function (k) {
      var arr = groups[k];
      if (agg === 'sum') return arr.reduce(function (a, b) { return a + b; }, 0);
      if (agg === 'avg') return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
      if (agg === 'count') return arr.length;
      if (agg === 'min') return Math.min.apply(null, arr);
      if (agg === 'max') return Math.max.apply(null, arr);
      return arr.reduce(function (a, b) { return a + b; }, 0);
    });

    var traces = [];
    var mm = this._mm;

    if (hasMarking) {
      // Split into marked / unmarked
      var markedVals = [];
      var unmarkedVals = [];
      categories.forEach(function (k, i) {
        var markedCount = 0, markedSum = 0;
        var unmarkedCount = 0, unmarkedSum = 0;
        groupRows[k].forEach(function (ri, j) {
          if (mm.isMarked(ri)) { markedCount++; markedSum += groups[k][j]; }
          else { unmarkedCount++; unmarkedSum += groups[k][j]; }
        });
        var mv = agg === 'count' ? markedCount : agg === 'avg' ? (markedCount ? markedSum / markedCount : 0) : markedSum;
        var uv = agg === 'count' ? unmarkedCount : agg === 'avg' ? (unmarkedCount ? unmarkedSum / unmarkedCount : 0) : unmarkedSum;
        markedVals.push(markedCount > 0 ? mv : 0);
        unmarkedVals.push(unmarkedCount > 0 ? uv : 0);
      });

      var markedTrace = {
        name: 'Selected',
        marker: { color: theme.marking, opacity: 1, line: { width: 0 } },
        customdata: categories.map(function (k) { return groupRows[k]; }),
        hoverinfo: 'x+y',
      };
      var unmarkedTrace = {
        name: 'Other',
        marker: { color: theme.unmarkedColor || '#888', opacity: theme.unmarkedOpacity },
        customdata: categories.map(function (k) { return groupRows[k]; }),
        hoverinfo: 'x+y',
      };

      if (orientation === 'horizontal') {
        markedTrace.y = categories; markedTrace.x = markedVals; markedTrace.type = 'bar'; markedTrace.orientation = 'h';
        unmarkedTrace.y = categories; unmarkedTrace.x = unmarkedVals; unmarkedTrace.type = 'bar'; unmarkedTrace.orientation = 'h';
      } else {
        markedTrace.x = categories; markedTrace.y = markedVals; markedTrace.type = 'bar';
        unmarkedTrace.x = categories; unmarkedTrace.y = unmarkedVals; unmarkedTrace.type = 'bar';
      }
      traces = [markedTrace, unmarkedTrace];
    } else {
      // No marking — use palette colors
      var colors = categories.map(function (_, i) { return theme.palette[i % theme.palette.length]; });
      var trace = {
        type: 'bar',
        marker: { color: colors, line: { width: 0 }, opacity: 0.9 },
        customdata: categories.map(function (k) { return groupRows[k]; }),
        hoverinfo: 'x+y',
      };
      if (cfg.barRadius) {
        // Plotly doesn't natively support border-radius, but we add rounded look via marker line
      }
      if (orientation === 'horizontal') {
        trace.y = categories; trace.x = values; trace.orientation = 'h';
      } else {
        trace.x = categories; trace.y = values;
      }

      if (cfg.showValues) {
        trace.text = values.map(function (v) { return typeof v === 'number' ? v.toLocaleString(undefined, { maximumFractionDigits: 1 }) : v; });
        trace.textposition = 'outside';
        trace.textfont = { size: 11, color: theme.textSecondary };
      }
      traces = [trace];
    }

    var layout = ThemeManager.getPlotlyLayout({
      barmode: hasMarking ? 'stack' : 'group',
      showlegend: hasMarking,
    });
    if (orientation === 'horizontal') {
      layout.yaxis.automargin = true;
    }

    var div = this._getPlotDiv();
    Plotly.react(div, traces, layout, this._plotlyConfig());
  }

  _onMarkingChanged() {
    this.refresh();
  }

  _bindEvents() {
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      if (!data || !data.points || !data.points[0]) return;
      var pt = data.points[0];
      var rowIndices = pt.customdata;
      if (!rowIndices) return;
      var flat = Array.isArray(rowIndices[0]) ? [].concat.apply([], rowIndices) : rowIndices;
      if (data.event && data.event.shiftKey) {
        self._mm.addToMarking(flat, self._id);
      } else if (data.event && data.event.ctrlKey) {
        self._mm.toggleMarking(flat, self._id);
      } else {
        self._mm.setMarking(flat, self._id);
      }
    });
  }
}
