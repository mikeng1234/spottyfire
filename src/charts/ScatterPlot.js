// ─── ScatterPlot ────────────────────────────────────────────
class ScatterPlot extends BaseChart {
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
    var colorBy = cfg.colorBy;
    var sizeBy = cfg.sizeBy;
    var pointSize = cfg.pointSize || 7;

    // showOnlyMarked: empty state when nothing is marked
    if (cfg.showOnlyMarked && !hasMarking) {
      var emptyLayout = ThemeManager.getPlotlyLayout({
        xaxis: { title: { text: cfg.x } },
        yaxis: { title: { text: cfg.y } },
        dragmode: 'select',
        annotations: [{
          text: 'Select data in another chart to display',
          xref: 'paper', yref: 'paper', x: 0.5, y: 0.5,
          showarrow: false, font: { size: 14, color: theme.textMuted },
        }],
      });
      Plotly.react(this._getPlotDiv(), [], emptyLayout, this._plotlyConfig());
      return;
    }

    // showOnlyMarked: filter rows to marked only
    if (cfg.showOnlyMarked && hasMarking) {
      rows = rows.filter(function (r) { return mm.isMarked(r.__rowIndex); });
    }

    // When showOnlyMarked is active, we already filtered — treat as "no marking split needed"
    var splitMarking = hasMarking && !cfg.showOnlyMarked;
    var traces = [];

    if (colorBy) {
      // Group by colorBy column
      var groups = {};
      rows.forEach(function (r) {
        var g = String(r[colorBy] || 'Other');
        if (!groups[g]) groups[g] = { x: [], y: [], idx: [], text: [], sizes: [] };
        groups[g].x.push(r[cfg.x]);
        groups[g].y.push(r[cfg.y]);
        groups[g].idx.push(r.__rowIndex);
        groups[g].text.push(r.Name || r.name || '');
        if (sizeBy) groups[g].sizes.push(+r[sizeBy] || pointSize);
      });

      var groupNames = Object.keys(groups);
      groupNames.forEach(function (g, gi) {
        var grp = groups[g];
        var baseColor = theme.palette[gi % theme.palette.length];

        if (splitMarking) {
          // Split each group into marked/unmarked
          var mX = [], mY = [], mI = [], mT = [], mS = [];
          var uX = [], uY = [], uI = [], uT = [], uS = [];
          grp.idx.forEach(function (ri, j) {
            if (mm.isMarked(ri)) {
              mX.push(grp.x[j]); mY.push(grp.y[j]); mI.push(ri); mT.push(grp.text[j]); mS.push(grp.sizes[j] || pointSize);
            } else {
              uX.push(grp.x[j]); uY.push(grp.y[j]); uI.push(ri); uT.push(grp.text[j]); uS.push(grp.sizes[j] || pointSize);
            }
          });
          if (mX.length) {
            traces.push({
              type: 'scattergl', mode: 'markers', name: g,
              x: mX, y: mY, customdata: mI, text: mT,
              marker: { color: baseColor, size: sizeBy ? mS : pointSize + 2, opacity: 1, line: { width: 1, color: 'rgba(255,255,255,0.3)' } },
              legendgroup: g, showlegend: uX.length === 0,
            });
          }
          if (uX.length) {
            traces.push({
              type: 'scattergl', mode: 'markers', name: g,
              x: uX, y: uY, customdata: uI, text: uT,
              marker: { color: theme.unmarkedColor || '#888', size: sizeBy ? uS : pointSize, opacity: theme.unmarkedOpacity },
              legendgroup: g, showlegend: mX.length === 0,
            });
          }
        } else {
          traces.push({
            type: 'scattergl', mode: 'markers', name: g,
            x: grp.x, y: grp.y, customdata: grp.idx, text: grp.text,
            marker: {
              color: baseColor, size: sizeBy ? grp.sizes : pointSize,
              opacity: 0.85, line: { width: 1, color: 'rgba(255,255,255,0.15)' },
            },
          });
        }
      });
    } else if (splitMarking) {
      // No colorBy, but we have marking to split
      var marked = { x: [], y: [], customdata: [], text: [] };
      var unmarked = { x: [], y: [], customdata: [], text: [] };
      rows.forEach(function (r) {
        var bucket = mm.isMarked(r.__rowIndex) ? marked : unmarked;
        bucket.x.push(r[cfg.x]);
        bucket.y.push(r[cfg.y]);
        bucket.customdata.push(r.__rowIndex);
        bucket.text.push(r.Name || r.name || '');
      });

      traces.push({
        type: 'scattergl', mode: 'markers', name: 'Selected',
        x: marked.x, y: marked.y, customdata: marked.customdata, text: marked.text,
        marker: { color: theme.marking, size: pointSize + 2, opacity: 1, line: { width: 1, color: 'rgba(255,255,255,0.3)' } },
      });
      traces.push({
        type: 'scattergl', mode: 'markers', name: 'Other',
        x: unmarked.x, y: unmarked.y, customdata: unmarked.customdata, text: unmarked.text,
        marker: { color: theme.unmarkedColor || '#888', size: pointSize, opacity: theme.unmarkedOpacity },
      });
    } else {
      // Single trace, no color grouping, no marking split
      var x = [], y = [], idx = [], text = [];
      rows.forEach(function (r) {
        x.push(r[cfg.x]); y.push(r[cfg.y]); idx.push(r.__rowIndex);
        text.push(r.Name || r.name || '');
      });
      traces.push({
        type: 'scattergl', mode: 'markers',
        x: x, y: y, customdata: idx, text: text,
        marker: { color: theme.palette[0], size: pointSize, opacity: 0.85, line: { width: 1, color: 'rgba(255,255,255,0.15)' } },
      });
    }

    var layout = ThemeManager.getPlotlyLayout({
      xaxis: { title: { text: cfg.x } },
      yaxis: { title: { text: cfg.y } },
      dragmode: 'select',
    });

    var div = this._getPlotDiv();
    Plotly.react(div, traces, layout, this._plotlyConfig());
  }

  _onMarkingChanged() { this.refresh(); }

  _bindEvents() {
    var self = this;
    var div = this._getPlotDiv();

    div.on('plotly_selected', function (data) {
      if (!data || !data.points) { return; }
      var indices = data.points.map(function (p) { return p.customdata; }).filter(function (v) { return v != null; });
      if (indices.length === 0) return;
      self._mm.setMarking(indices, self._id);
    });

    div.on('plotly_click', function (data) {
      if (!data || !data.points || !data.points[0]) return;
      var idx = data.points[0].customdata;
      if (idx == null) return;
      if (data.event && data.event.shiftKey) {
        self._mm.addToMarking([idx], self._id);
      } else if (data.event && data.event.ctrlKey) {
        self._mm.toggleMarking([idx], self._id);
      } else {
        self._mm.setMarking([idx], self._id);
      }
    });

    div.on('plotly_deselect', function () {
      self._mm.clearMarking(self._id);
    });
  }
}
