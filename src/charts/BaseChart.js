// ─── BaseChart ──────────────────────────────────────────────
class BaseChart {
  constructor(selector, dataStore, config) {
    this._id = 'sl_' + (BaseChart._counter = (BaseChart._counter || 0) + 1);
    this._ds = dataStore;
    this._config = Object.assign({}, config);
    this._mm = dataStore._markingManager;
    this._limitSet = null; // Set of row indices from source chart, or null

    // Resolve container
    if (typeof selector === 'string') {
      this._container = document.querySelector(selector);
    } else {
      this._container = selector;
    }
    if (!this._container) throw new Error('SpottyFire: container not found: ' + selector);

    // Register in chart registry
    this._ds._registerChart(this);

    // Wrap in panel
    this._wrapper = ChartWrapper.wrap(this._container, this._config.title || '', this);

    // Listen to marking & filter changes
    var self = this;
    this._onMarking = function (e) {
      if (e.source !== self._id) {
        self._handleDataLimiting(e);
        self._onMarkingChanged(e);
      }
    };
    this._onFilter = function () { self.refresh(); };
    this._onTheme = function () { self.refresh(); };
    this._onFormat = function () { self.refresh(); };
    this._onDataLoaded = function () {
      self._autoFixColumns();
      self.refresh();
      // Force all dropdowns to refresh their options and selected value
      if (self._wrapper) {
        var selects = self._wrapper.querySelectorAll('.sl-y-axis-bar select, .sl-x-axis-bar select, .sl-color-sidebar-body select');
        selects.forEach(function (s) { s.dispatchEvent(new Event('focus')); });
      }
    };

    this._mm.on('marking-changed', this._onMarking);
    this._ds.on('filter-changed', this._onFilter);
    this._ds.on('data-loaded', this._onDataLoaded);

    // Double-click empty area to clear marking (matches Plotly's reset behavior)
    // Deferred: bind after first Plotly render since .on() requires Plotly initialization
    this._dblClickBound = false;

    this._ds.on('format-changed', this._onFormat);
    ThemeManager.on(this._onTheme);

    // Right-click context menu
    var plotDiv = this._getPlotDiv();
    if (plotDiv) {
      plotDiv.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        e.stopPropagation();
        // Try to extract point data from Plotly's hover info
        var pointData = null;
        var hoverLayer = plotDiv.querySelector('.hoverlayer');
        // Use Plotly's internal hover data if available
        if (plotDiv._fullLayout && plotDiv._hoverdata && plotDiv._hoverdata.length > 0) {
          var hd = plotDiv._hoverdata[0];
          if (hd.x != null || hd.y != null) {
            var cfg = self._config;
            var catCol = cfg.category || cfg.x;
            var valCol = cfg.value || cfg.y;
            pointData = { column: catCol, value: hd.x };
          }
        }
        var items = ContextMenu.buildChartItems(self, pointData);
        ContextMenu.show(e.clientX, e.clientY, items);
      });
    }
  }

  getConfig() { return Object.assign({}, this._config); }

  updateConfig(newConfig) {
    // Capture previous values for undo
    var prevConfig = {};
    for (var key in newConfig) {
      if (newConfig.hasOwnProperty(key)) {
        prevConfig[key] = this._config[key];
      }
    }

    Object.assign(this._config, newConfig);
    if (newConfig.title && this._wrapper) {
      this._wrapper.querySelector('.sl-panel-header span').textContent = newConfig.title;
    }
    // If dataLimitedBy changed, re-evaluate limit set
    if ('dataLimitedBy' in newConfig) {
      if (!newConfig.dataLimitedBy) {
        this._limitSet = null;
      } else {
        var mm = this._mm;
        if (mm.hasMarking()) {
          this._limitSet = mm.getMarkedIndices();
        } else {
          this._limitSet = new Set();
        }
      }
    }
    this.refresh();

    // Push undo command
    var self = this;
    var newCfg = JSON.parse(JSON.stringify(newConfig));
    var prevCfg = JSON.parse(JSON.stringify(prevConfig));
    UndoManager.push({
      type: 'chartConfig',
      label: 'Update ' + (self._config.title || self._id),
      undo: function () {
        if (!self._container) return;
        Object.assign(self._config, prevCfg);
        if ('dataLimitedBy' in prevCfg) {
          self._limitSet = prevCfg.dataLimitedBy ? new Set() : null;
        }
        self.refresh();
      },
      redo: function () {
        if (!self._container) return;
        Object.assign(self._config, newCfg);
        if ('dataLimitedBy' in newCfg) {
          self._limitSet = newCfg.dataLimitedBy ? new Set() : null;
        }
        self.refresh();
      },
    });
  }

  // Handle data limiting: track marking from the source chart
  _handleDataLimiting(e) {
    var limitBy = this._config.dataLimitedBy;
    if (!limitBy) return; // not limited by anything
    if (e.source === limitBy) {
      // Update limit set from this specific source
      if (e.action === 'clear' || e.markedIndices.size === 0) {
        this._limitSet = new Set(); // source cleared → empty
      } else {
        this._limitSet = new Set(e.markedIndices);
      }
    }
    // If event is from a different chart, ignore for limiting purposes
  }

  // Get rows filtered by data limiting + global filters
  _getLimitedRows() {
    var rows = this._ds.getFilteredRows();
    var limitBy = this._config.dataLimitedBy;

    if (limitBy && this._limitSet !== null) {
      if (this._limitSet.size === 0) {
        return []; // source has nothing marked
      }
      var ls = this._limitSet;
      rows = rows.filter(function (r) { return ls.has(r.__rowIndex); });
    }

    return rows;
  }

  // Check if chart is data-limited with empty result → render empty state
  _renderEmptyIfLimited(layoutOverrides) {
    var limitBy = this._config.dataLimitedBy;
    if (!limitBy) return false;
    if (this._limitSet === null) return false;
    if (this._limitSet.size > 0) return false;

    var entry = this._ds._chartRegistry[limitBy];
    var sourceName = entry ? entry.name : 'source chart';
    var theme = ThemeManager.getTheme();
    var layout = ThemeManager.getPlotlyLayout(layoutOverrides || {});
    layout.annotations = [{
      text: 'Select data in "' + sourceName + '" to display',
      xref: 'paper', yref: 'paper', x: 0.5, y: 0.5,
      showarrow: false, font: { size: 13, color: theme.textMuted },
    }];
    Plotly.react(this._getPlotDiv(), [], layout, this._plotlyConfig());
    return true;
  }

  // Check if a column contains numeric data
  _isNumericColumn(colName) {
    if (!colName) return false;
    var colInfo = this._ds._columns.find(function (c) { return c.name === colName; });
    if (colInfo && colInfo.type === 'number') return true;
    // Fallback: sample first 20 non-null values
    var rows = this._ds._rows;
    var numCount = 0, total = 0;
    for (var i = 0; i < rows.length && total < 20; i++) {
      var v = rows[i][colName];
      if (v == null || v === '') continue;
      total++;
      if (typeof v === 'number' || !isNaN(parseFloat(v))) numCount++;
    }
    return total > 0 && numCount / total >= 0.5;
  }

  // Render an error state on the chart
  _renderError(message, layoutOverrides) {
    var theme = ThemeManager.getTheme();
    var layout = ThemeManager.getPlotlyLayout(layoutOverrides || {});
    layout.annotations = [{
      text: '\u26A0 ' + message,
      xref: 'paper', yref: 'paper', x: 0.5, y: 0.5,
      showarrow: false,
      font: { size: 13, color: theme.marking || '#f43f5e' },
    }];
    Plotly.react(this._getPlotDiv(), [], layout, this._plotlyConfig());
    return true;
  }

  // Validate that value/Y columns are numeric; render error if not
  _validateNumericAxis(colName, axisLabel) {
    if (!colName) return false;
    if (this._isNumericColumn(colName)) return false; // valid
    this._renderError('"' + colName + '" is not a numeric column.\nSelect a numeric column for ' + (axisLabel || 'this axis') + '.');
    return true; // had error
  }

  // Bind double-click to clear after Plotly has initialized the div
  _bindPlotlyDeselect() {
    if (this._dblClickBound) return;
    var plotDiv = this._getPlotDiv();
    if (plotDiv && plotDiv.on) {
      var self = this;
      plotDiv.on('plotly_doubleclick', function () {
        if (self._mm.hasMarking()) {
          self._mm.clearMarking(self._id);
        }
      });
      this._dblClickBound = true;
    }
  }

  // Build tooltip text for a row using config.tooltipColumns or defaults
  _buildTooltip(row) {
    var cfg = this._config;
    var ds = this._ds;
    var cols = cfg.tooltipColumns;
    if (!cols) {
      // Default: show name/label-like columns
      return row.Name || row.name || row.Label || row.label || row.Product || row.product || '';
    }
    return cols.map(function (c) {
      var v = row[c];
      var formatted = ds.formatValue(v, c);
      return c + ': ' + formatted;
    }).join('<br>');
  }

  // Build tooltip array for a set of rows
  _buildTooltips(rows) {
    var self = this;
    var cfg = this._config;
    if (!cfg.tooltipColumns) {
      return rows.map(function (r) { return r.Name || r.name || r.Label || r.label || r.Product || r.product || ''; });
    }
    return rows.map(function (r) { return self._buildTooltip(r); });
  }

  // Auto-fix column references when data changes (new CSV loaded)
  _autoFixColumns() {
    var cols = this._ds.getColumnNames();
    if (cols.length === 0) return;
    var cfg = this._config;

    // Find first numeric and first categorical columns using DataStore metadata
    var numCols = [];
    var catCols = [];
    this._ds.getColumns().forEach(function (col) {
      if (col.name === '__rowIndex') return;
      if (col.type === 'number') {
        numCols.push(col.name);
      } else {
        catCols.push(col.name);
      }
    });

    // Fix axes that reference columns not in the new data
    var axisMap = {
      x: numCols.length > 1 ? numCols[1] : numCols[0] || cols[0],
      y: numCols[0] || cols[0],
      category: catCols[0] || cols[0],
      value: numCols[0] || cols[0],
    };

    var keysToCheck = ['x', 'y', 'category', 'value', 'colorBy', 'groupBy'];
    var changed = false;
    keysToCheck.forEach(function (key) {
      if (cfg[key] && cols.indexOf(cfg[key]) < 0) {
        if (key === 'colorBy' || key === 'groupBy') {
          cfg[key] = null;
        } else {
          cfg[key] = axisMap[key] || cols[0];
        }
        changed = true;
      }
    });
    // Handle y as array (LineChart)
    if (Array.isArray(cfg.y)) {
      cfg.y = cfg.y.map(function (c) {
        if (cols.indexOf(c) < 0) { changed = true; return numCols[0] || cols[0]; }
        return c;
      });
    }

    // Fix DataTable columns array
    if (Array.isArray(cfg.columns)) {
      var validCols = cfg.columns.filter(function (c) { return cols.indexOf(c) >= 0; });
      if (validCols.length === 0) {
        // All old columns gone — use first 10 new columns
        cfg.columns = cols.filter(function (c) { return c !== '__rowIndex'; }).slice(0, 10);
        changed = true;
      } else if (validCols.length < cfg.columns.length) {
        cfg.columns = validCols;
        changed = true;
      }
    }

    // Auto-update title to reflect new columns
    if (changed) {
      var valCol = cfg.value || cfg.y || '';
      if (Array.isArray(valCol)) valCol = valCol[0] || '';
      var catCol = cfg.category || cfg.x || '';
      var agg = cfg.aggregation || '';
      if (agg) agg = agg.charAt(0).toUpperCase() + agg.slice(1) + ' ';
      cfg.title = agg + valCol + (catCol ? ' by ' + catCol : '');
      // Update displayed title
      if (this._wrapper) {
        var titleEl = this._wrapper.querySelector('.sl-panel-header span');
        if (titleEl) titleEl.textContent = cfg.title;
      }
      // Update chart registry name
      this._ds._registerChart(this);
    }
  }

  // Apply column format to a Plotly axis layout object
  _applyAxisFormat(axisLayout, colName) {
    var fmt = this._ds.getPlotlyAxisFormat(colName);
    if (fmt.tickformat) axisLayout.tickformat = fmt.tickformat;
    if (fmt.tickprefix) axisLayout.tickprefix = fmt.tickprefix;
    if (fmt.ticksuffix) axisLayout.ticksuffix = fmt.ticksuffix;
    return axisLayout;
  }

  refresh() {
    // Override in subclass
  }

  _onMarkingChanged(e) {
    // Override in subclass
  }

  _getPlotDiv() {
    return this._wrapper.querySelector('.sl-panel-body');
  }

  _plotlyConfig() {
    return {
      displaylogo: false,
      responsive: true,
      modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'autoScale2d'],
    };
  }

  destroy() {
    this._ds._unregisterChart(this);
    this._mm.off('marking-changed', this._onMarking);
    this._ds.off('filter-changed', this._onFilter);
    this._ds.off('data-loaded', this._onDataLoaded);
    this._ds.off('format-changed', this._onFormat);
    ThemeManager.off(this._onTheme);
    // Clean up document-level listeners
    if (this._escHandler) document.removeEventListener('keydown', this._escHandler);
    if (this._mouseupHandler) document.removeEventListener('mouseup', this._mouseupHandler);
    var div = this._getPlotDiv();
    if (div && typeof Plotly !== 'undefined') {
      try { Plotly.purge(div); } catch (e) {}
    }
    if (this._wrapper && this._wrapper.parentNode) {
      var parentContainer = this._wrapper.parentNode;
      parentContainer.removeChild(this._wrapper);
      // Remove empty container div from grid
      if (parentContainer.children.length === 0 && parentContainer !== document.body) {
        parentContainer.remove();
      }
    }
    // Recalculate layout and resize remaining charts
    if (typeof window.recalcLayout === 'function') window.recalcLayout();
    else BaseChart.resizeAll();
  }

  static resizeAll() {
    // Resize only registered Plotly chart divs — avoids triggering unrelated resize handlers
    setTimeout(function () {
      document.querySelectorAll('.sl-panel-body').forEach(function (div) {
        if (typeof Plotly !== 'undefined' && div._fullLayout) {
          try { Plotly.Plots.resize(div); } catch (e) {}
        }
      });
    }, 50);
  }

}
