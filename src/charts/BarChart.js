// ─── BarChart ───────────────────────────────────────────────
class BarChart extends BaseChart {
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

    if (cfg.showOnlyMarked && hasMarking) {
      rows = rows.filter(function (r) { return mm.isMarked(r.__rowIndex); });
      hasMarking = false;
    }

    var traces = [];

    function _agg(arr) {
      if (arr.length === 0) return 0;
      if (agg === 'sum') return arr.reduce(function (a, b) { return a + b; }, 0);
      if (agg === 'avg') return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
      if (agg === 'count') return arr.length;
      if (agg === 'min') return Math.min.apply(null, arr);
      if (agg === 'max') return Math.max.apply(null, arr);
      return arr.reduce(function (a, b) { return a + b; }, 0);
    }

    // Get unique categories (respect sort order if set)
    // If category is "None" or empty, show single bar with total
    if (!cat || cat === 'None') {
      var _allLabel = 'All Data (' + rows.length + ' rows)';
      // Create mapped rows with a temporary key (not mutating originals)
      cat = '__sl_allcat';
      rows = rows.map(function (r) {
        var copy = Object.assign({}, r);
        copy.__sl_allcat = _allLabel;
        return copy;
      });
      var categories = [_allLabel];
      var catSet = {};
      catSet[_allLabel] = true;
    } else {
      var catSet = {};
      rows.forEach(function (r) { catSet[String(r[cat] || 'Unknown')] = true; });
      var categories = cfg._sortOrder ? cfg._sortOrder.filter(function (c) { return !!catSet[c]; }) : Object.keys(catSet);
    }

    if (colorBy && colorBy !== cat) {
      // ── Stacked bar: one trace per colorBy value ──
      var colorValues = {};
      rows.forEach(function (r) { colorValues[String(r[colorBy] || 'Other')] = true; });
      var colorKeys = Object.keys(colorValues);

      // Build a grid: [colorKey][category] → { vals:[], indices:[] }
      var grid = {};
      colorKeys.forEach(function (ck) {
        grid[ck] = {};
        categories.forEach(function (c) { grid[ck][c] = { vals: [], indices: [] }; });
      });
      rows.forEach(function (r) {
        var c = String(r[cat] || 'Unknown');
        var ck = String(r[colorBy] || 'Other');
        grid[ck][c].vals.push(+r[val] || 0);
        grid[ck][c].indices.push(r.__rowIndex);
      });

      colorKeys.forEach(function (ck, ci) {
        var baseColor = theme.palette[ci % theme.palette.length];
        var aggVals = categories.map(function (c) { return _agg(grid[ck][c].vals); });
        var rowIndices = categories.map(function (c) { return grid[ck][c].indices; });

        if (hasMarking) {
          // Split each segment into marked/unmarked
          var markedVals = [];
          var unmarkedVals = [];
          categories.forEach(function (c) {
            var cell = grid[ck][c];
            var mSum = 0, mCount = 0, uSum = 0, uCount = 0;
            cell.indices.forEach(function (ri, j) {
              if (mm.isMarked(ri)) { mCount++; mSum += cell.vals[j]; }
              else { uCount++; uSum += cell.vals[j]; }
            });
            markedVals.push(_agg(mCount > 0 ? (agg === 'count' ? new Array(mCount) : [mSum]) : []));
            unmarkedVals.push(_agg(uCount > 0 ? (agg === 'count' ? new Array(uCount) : [uSum]) : []));
          });

          // Marked trace
          var mTrace = { type: 'bar', name: ck, legendgroup: ck, showlegend: true,
            marker: { color: baseColor, opacity: 1, line: { width: 0 } },
            customdata: rowIndices, hoverinfo: 'x+y+name' };
          var uTrace = { type: 'bar', name: ck, legendgroup: ck, showlegend: false,
            marker: { color: theme.unmarkedColor || '#888', opacity: theme.unmarkedOpacity, line: { width: 0 } },
            customdata: rowIndices, hoverinfo: 'x+y+name' };

          if (orientation === 'horizontal') {
            mTrace.y = categories; mTrace.x = markedVals; mTrace.orientation = 'h';
            uTrace.y = categories; uTrace.x = unmarkedVals; uTrace.orientation = 'h';
          } else {
            mTrace.x = categories; mTrace.y = markedVals;
            uTrace.x = categories; uTrace.y = unmarkedVals;
          }
          traces.push(mTrace);
          traces.push(uTrace);
        } else {
          var trace = { type: 'bar', name: ck,
            marker: { color: baseColor, opacity: 0.9, line: { width: 0 } },
            customdata: rowIndices, hoverinfo: 'x+y+name' };

          if (orientation === 'horizontal') {
            trace.y = categories; trace.x = aggVals; trace.orientation = 'h';
          } else {
            trace.x = categories; trace.y = aggVals;
          }
          traces.push(trace);
        }
      });
    } else if (hasMarking) {
      // ── No colorBy, but has marking → split into marked/unmarked ──
      var groupRows = {};
      var groups = {};
      rows.forEach(function (r) {
        var key = String(r[cat] || 'Unknown');
        if (!groups[key]) { groups[key] = []; groupRows[key] = []; }
        groups[key].push(+r[val] || 0);
        groupRows[key].push(r.__rowIndex);
      });

      var markedVals = [];
      var unmarkedVals = [];
      categories.forEach(function (k) {
        var mCount = 0, mSum = 0, uCount = 0, uSum = 0;
        groupRows[k].forEach(function (ri, j) {
          if (mm.isMarked(ri)) { mCount++; mSum += groups[k][j]; }
          else { uCount++; uSum += groups[k][j]; }
        });
        var mv = agg === 'count' ? mCount : agg === 'avg' ? (mCount ? mSum / mCount : 0) : mSum;
        var uv = agg === 'count' ? uCount : agg === 'avg' ? (uCount ? uSum / uCount : 0) : uSum;
        markedVals.push(mCount > 0 ? mv : 0);
        unmarkedVals.push(uCount > 0 ? uv : 0);
      });

      var markedTrace = { type: 'bar', name: 'Selected',
        marker: { color: theme.marking, opacity: 1, line: { width: 0 } },
        customdata: categories.map(function (k) { return groupRows[k]; }), hoverinfo: 'x+y' };
      var unmarkedTrace = { type: 'bar', name: 'Other',
        marker: { color: theme.unmarkedColor || '#888', opacity: theme.unmarkedOpacity },
        customdata: categories.map(function (k) { return groupRows[k]; }), hoverinfo: 'x+y' };

      if (orientation === 'horizontal') {
        markedTrace.y = categories; markedTrace.x = markedVals; markedTrace.orientation = 'h';
        unmarkedTrace.y = categories; unmarkedTrace.x = unmarkedVals; unmarkedTrace.orientation = 'h';
      } else {
        markedTrace.x = categories; markedTrace.y = markedVals;
        unmarkedTrace.x = categories; unmarkedTrace.y = unmarkedVals;
      }
      traces = [markedTrace, unmarkedTrace];
    } else {
      // ── No colorBy, no marking → simple colored bars ──
      var groupRows = {};
      var groups = {};
      rows.forEach(function (r) {
        var key = String(r[cat] || 'Unknown');
        if (!groups[key]) { groups[key] = []; groupRows[key] = []; }
        groups[key].push(+r[val] || 0);
        groupRows[key].push(r.__rowIndex);
      });

      var values = categories.map(function (k) { return _agg(groups[k]); });
      var colors = categories.map(function (_, i) { return theme.palette[i % theme.palette.length]; });
      var trace = {
        type: 'bar',
        marker: { color: colors, line: { width: 0 }, opacity: 0.9 },
        customdata: categories.map(function (k) { return groupRows[k]; }),
        hoverinfo: 'x+y',
      };

      if (orientation === 'horizontal') {
        trace.y = categories; trace.x = values; trace.orientation = 'h';
      } else {
        trace.x = categories; trace.y = values;
      }

      if (cfg.showValues) {
        var ds = this._ds;
        var valCol = cfg.value;
        trace.text = values.map(function (v) { return ds.formatValue(v, valCol); });
        trace.textposition = 'outside';
        trace.cliponaxis = false;
        trace.textfont = { size: 11, color: theme.textSecondary };
      }
      traces = [trace];
    }

    var layout = ThemeManager.getPlotlyLayout({
      barmode: (colorBy || hasMarking) ? 'stack' : 'group',
      showlegend: !!(colorBy || hasMarking),
    });
    // Apply column format to value axis
    if (orientation === 'horizontal') {
      this._applyAxisFormat(layout.xaxis, val);
      layout.yaxis.automargin = true;
    } else {
      this._applyAxisFormat(layout.yaxis, val);
    }

    Plotly.react(this._getPlotDiv(), traces, layout, this._plotlyConfig());
  }

  _onMarkingChanged() {
    this.refresh();
  }

  _bindEvents() {
    this._bindPlotlyDeselect();
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
