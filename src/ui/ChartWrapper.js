// ─── ChartWrapper ───────────────────────────────────────────
var ChartWrapper = (function () {

  // Helper: create a labeled dropdown
  function _makeSelect(label, currentVal, options, onChange) {
    var select = document.createElement('select');
    select.title = label;
    select.className = 'sl-axis-select';
    options.forEach(function (opt) {
      var el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.label;
      if (opt.value === currentVal) el.selected = true;
      select.appendChild(el);
    });
    select.addEventListener('change', function () { onChange(select.value); });
    return select;
  }

  // Helper: axis dropdown that refreshes options from chart's current dataset columns on focus
  function _makeAxisSelect(label, getVal, chartInst, onChange) {
    var select = document.createElement('select');
    select.title = label;
    select.className = 'sl-axis-select';

    function _populate() {
      var curVal = getVal();
      select.innerHTML = '';
      var cols = chartInst._ds.getColumnNames();
      cols.forEach(function (c) {
        var el = document.createElement('option');
        el.value = c;
        el.textContent = c;
        if (c === curVal) el.selected = true;
        select.appendChild(el);
      });
    }

    _populate();
    select.addEventListener('focus', _populate);
    select.addEventListener('change', function () { onChange(select.value); });
    return select;
  }

  // Inject CSS once
  function _injectCSS() {
    if (document.getElementById('sl-axis-css')) return;
    var s = document.createElement('style');
    s.id = 'sl-axis-css';
    s.textContent =
      '.sl-axis-select{font-size:11px;background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:6px;color:var(--sl-text-secondary);padding:3px 6px;cursor:pointer;font-family:var(--sl-font);transition:border-color var(--sl-transition) ease;outline:none;}' +
      '.sl-axis-select:hover,.sl-axis-select:focus{border-color:var(--sl-accent);color:var(--sl-text-primary);}' +
      '.sl-chart-layout{display:flex;flex:1;min-height:0;}' +
      '.sl-y-axis-bar{display:flex;align-items:center;justify-content:center;padding:4px;min-width:0;flex-shrink:0;}' +
      '.sl-y-axis-bar select{writing-mode:vertical-lr;text-orientation:mixed;transform:rotate(180deg);max-height:100%;padding:6px 3px;}' +
      '.sl-chart-column{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;}' +
      '.sl-x-axis-bar{display:flex;align-items:center;justify-content:center;padding:4px 8px;gap:4px;border-top:1px solid var(--sl-panel-border);}' +
      '.sl-x-axis-bar .sl-axis-label{font-size:10px;color:var(--sl-text-muted);text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;}' +
      // Color sidebar
      '.sl-color-sidebar{display:flex;flex-direction:column;border-left:1px solid var(--sl-panel-border);overflow:hidden;transition:width var(--sl-transition) ease,min-width var(--sl-transition) ease,max-width var(--sl-transition) ease;width:140px;min-width:140px;max-width:140px;flex-shrink:0;}' +
      '.sl-color-sidebar.sl-collapsed{width:28px !important;min-width:28px !important;max-width:28px !important;}' +
      '.sl-color-sidebar-toggle{background:none;border:none;border-bottom:1px solid var(--sl-panel-border);color:var(--sl-text-muted);cursor:pointer;padding:6px 4px;font-size:11px;font-family:var(--sl-font);text-align:center;white-space:nowrap;transition:color var(--sl-transition) ease;}' +
      '.sl-color-sidebar-toggle:hover{color:var(--sl-text-primary);}' +
      '.sl-collapsed .sl-color-sidebar-toggle{writing-mode:vertical-lr;transform:rotate(180deg);padding:8px 6px;border-bottom:none;flex:0 0 auto;}' +
      '.sl-color-sidebar-body{flex:1;overflow-y:auto;padding:6px;}' +
      '.sl-collapsed .sl-color-sidebar-body{display:none;}' +
      '.sl-color-item{display:flex;align-items:center;gap:6px;padding:3px 4px;cursor:pointer;border-radius:4px;font-size:11px;color:var(--sl-text-secondary);transition:background var(--sl-transition) ease;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '.sl-color-item:hover{background:rgba(128,128,128,0.1);color:var(--sl-text-primary);}' +
      '.sl-color-item.sl-active{color:var(--sl-text-primary);font-weight:600;}' +
      '.sl-color-swatch{width:10px;height:10px;border-radius:3px;flex-shrink:0;}' +
      '.sl-color-label{font-size:10px;font-weight:600;color:var(--sl-text-muted);text-transform:uppercase;letter-spacing:0.5px;padding:6px 4px 3px;user-select:none;}';
    document.head.appendChild(s);
  }

  // Build the collapsible color sidebar
  function _buildColorSidebar(chartInstance, colorByKey, colOptsWithNone) {
    var cfg = chartInstance._config;
    var ds = chartInstance._ds;
    var theme = ThemeManager.getTheme();

    var sidebar = document.createElement('div');
    sidebar.className = 'sl-color-sidebar';

    // Toggle button
    var toggle = document.createElement('button');
    toggle.className = 'sl-color-sidebar-toggle';
    toggle.textContent = '\u25C0 Color';
    toggle.addEventListener('click', function () {
      var collapsed = sidebar.classList.toggle('sl-collapsed');
      // Force reflow: hide → reflow → show to recalculate flex layout
      sidebar.style.display = 'none';
      void sidebar.offsetWidth;
      sidebar.style.display = '';
      toggle.textContent = collapsed ? 'Color \u25B6' : '\u25C0 Color';
      // Tell Plotly to resize into the new space
      var plotDiv = sidebar.parentElement && sidebar.parentElement.querySelector('.sl-panel-body');
      if (plotDiv) {
        setTimeout(function () { Plotly.Plots.resize(plotDiv); }, 50);
      }
    });
    sidebar.appendChild(toggle);

    // Body
    var body = document.createElement('div');
    body.className = 'sl-color-sidebar-body';

    // Column selector dropdown
    var label = document.createElement('div');
    label.className = 'sl-color-label';
    label.textContent = 'Color by';
    body.appendChild(label);

    var select = _makeSelect('Color by', cfg[colorByKey] || '', colOptsWithNone, function (val) {
      var update = {};
      update[colorByKey] = val || null;
      chartInstance.updateConfig(update);
      _renderLegend();
    });
    select.style.width = '100%';
    select.style.marginBottom = '6px';
    body.appendChild(select);

    // Legend area — shows color swatches for current colorBy values
    var legendDiv = document.createElement('div');
    body.appendChild(legendDiv);

    function _renderLegend() {
      legendDiv.innerHTML = '';
      var currentCol = chartInstance._config[colorByKey];
      if (!currentCol) return;
      var values = ds.getColumnValues(currentCol);
      var palette = ThemeManager.getTheme().palette;
      values.forEach(function (v, i) {
        var item = document.createElement('div');
        item.className = 'sl-color-item';

        var swatch = document.createElement('div');
        swatch.className = 'sl-color-swatch';
        swatch.style.background = palette[i % palette.length];
        item.appendChild(swatch);

        var text = document.createElement('span');
        text.textContent = v;
        item.appendChild(text);

        // Click legend item to mark those rows
        item.addEventListener('click', function () {
          var rows = ds.getFilteredRows();
          var indices = [];
          rows.forEach(function (r) {
            if (String(r[currentCol]) === String(v)) indices.push(r.__rowIndex);
          });
          chartInstance._mm.setMarking(indices, chartInstance._id);
        });

        legendDiv.appendChild(item);
      });
    }

    _renderLegend();

    // Update legend on theme change
    ThemeManager.on(function () { _renderLegend(); });

    // ── Data Limited By section ──
    var limitLabel = document.createElement('div');
    limitLabel.className = 'sl-color-label';
    limitLabel.style.marginTop = '12px';
    limitLabel.style.borderTop = '1px solid var(--sl-panel-border)';
    limitLabel.style.paddingTop = '10px';
    limitLabel.textContent = 'Data limited by';
    body.appendChild(limitLabel);

    var limitSelect = document.createElement('select');
    limitSelect.className = 'sl-axis-select';
    limitSelect.title = 'Data limited by';
    limitSelect.style.width = '100%';
    limitSelect.style.marginBottom = '4px';

    function _refreshLimitDropdown() {
      var curVal = chartInstance._config.dataLimitedBy || '';
      limitSelect.innerHTML = '';
      var noneOpt = document.createElement('option');
      noneOpt.value = '';
      noneOpt.textContent = 'None';
      limitSelect.appendChild(noneOpt);

      var charts = ds.getRegisteredCharts();
      charts.forEach(function (entry) {
        if (entry.id === chartInstance._id) return; // skip self
        var opt = document.createElement('option');
        opt.value = entry.id;
        opt.textContent = entry.name;
        if (entry.id === curVal) opt.selected = true;
        limitSelect.appendChild(opt);
      });
    }

    _refreshLimitDropdown();

    // Refresh dropdown when it gets focus (in case new charts were added)
    limitSelect.addEventListener('focus', _refreshLimitDropdown);

    limitSelect.addEventListener('change', function () {
      chartInstance.updateConfig({ dataLimitedBy: limitSelect.value || null });
    });

    body.appendChild(limitSelect);

    // Status indicator
    var limitStatus = document.createElement('div');
    limitStatus.style.cssText = 'font-size:10px;color:var(--sl-text-muted);padding:2px 4px;';
    body.appendChild(limitStatus);

    // Update status on marking changes
    chartInstance._mm.on('marking-changed', function () {
      var limitBy = chartInstance._config.dataLimitedBy;
      if (!limitBy) {
        limitStatus.textContent = '';
        return;
      }
      var entry = ds._chartRegistry[limitBy];
      var sourceName = entry ? entry.name : limitBy;
      if (chartInstance._limitSet && chartInstance._limitSet.size > 0) {
        limitStatus.textContent = chartInstance._limitSet.size + ' rows from "' + sourceName + '"';
      } else {
        limitStatus.textContent = 'No selection in "' + sourceName + '"';
      }
    });

    sidebar.appendChild(body);
    return sidebar;
  }

  function wrap(container, title, chartInstance) {
    _injectCSS();

    var panel = document.createElement('div');
    panel.className = 'sl-panel';
    panel.style.height = '100%';
    panel.style.animationDelay = (ChartWrapper._count = (ChartWrapper._count || 0) + 1) * 100 + 'ms';

    // Header — title + agg + clear
    var header = document.createElement('div');
    header.className = 'sl-panel-header';

    var titleEl = document.createElement('span');
    titleEl.textContent = title || '';
    header.appendChild(titleEl);

    var actions = document.createElement('div');
    actions.className = 'sl-panel-header-actions';

    // Determine chart capabilities
    var cfg = (chartInstance && chartInstance._config) || {};
    var ds = chartInstance && chartInstance._ds;
    var cols = ds ? ds.getColumnNames() : [];
    var colOpts = cols.map(function (c) { return { value: c, label: c }; });
    var colOptsWithNone = [{ value: '', label: 'None' }].concat(colOpts);

    var isScatter = chartInstance instanceof ScatterPlot;
    var isBar = chartInstance instanceof BarChart;
    var isLine = chartInstance instanceof LineChart;
    var isPie = chartInstance instanceof PieChart;
    var isHeat = chartInstance instanceof HeatMap;
    var hasAxes = isScatter || isBar || isLine || isPie || isHeat;
    var supportsColorBy = isScatter || isBar || isLine;

    // Aggregation selector in header (bar, pie, heatmap)
    if (isBar || isPie || isHeat) {
      var aggOpts = [
        { value: 'sum', label: 'Sum' },
        { value: 'avg', label: 'Average' },
        { value: 'count', label: 'Count' },
        { value: 'min', label: 'Min' },
        { value: 'max', label: 'Max' },
      ];
      actions.appendChild(_makeSelect('Agg', cfg.aggregation || 'sum', aggOpts, function (val) {
        chartInstance.updateConfig({ aggregation: val });
      }));
    }

    // Data Limited By — header dropdown for ALL chart types
    if (ds) {
      var limitHeaderSelect = _makeSelect('Limit by', cfg.dataLimitedBy || '', [{ value: '', label: 'All data' }], function (val) {
        chartInstance.updateConfig({ dataLimitedBy: val || null });
      });
      // Populate on focus
      limitHeaderSelect.addEventListener('focus', function () {
        var curVal = chartInstance._config.dataLimitedBy || '';
        limitHeaderSelect.innerHTML = '';
        var none = document.createElement('option');
        none.value = ''; none.textContent = 'All data';
        limitHeaderSelect.appendChild(none);
        ds.getRegisteredCharts().forEach(function (entry) {
          if (entry.id === chartInstance._id) return;
          var o = document.createElement('option');
          o.value = entry.id; o.textContent = entry.name;
          if (entry.id === curVal) o.selected = true;
          limitHeaderSelect.appendChild(o);
        });
      });
      actions.appendChild(limitHeaderSelect);
    }

    // Clear marking button
    var clearBtn = document.createElement('button');
    clearBtn.textContent = '\u2715 Clear';
    clearBtn.title = 'Clear marking (Esc)';
    clearBtn.addEventListener('click', function () {
      if (chartInstance && chartInstance._mm) chartInstance._mm.clearMarking();
    });
    actions.appendChild(clearBtn);

    header.appendChild(actions);
    panel.appendChild(header);

    // Chart body area with axis selectors
    if (hasAxes && ds) {
      var layout = document.createElement('div');
      layout.className = 'sl-chart-layout';

      // Y-axis selector (left side, rotated)
      var yBar = document.createElement('div');
      yBar.className = 'sl-y-axis-bar';

      if (isScatter) {
        yBar.appendChild(_makeAxisSelect('Y axis', function () { return chartInstance._config.y; }, chartInstance, function (val) {
          chartInstance.updateConfig({ y: val });
        }));
      } else if (isPie) {
        yBar.appendChild(_makeAxisSelect('Size by', function () { return chartInstance._config.value; }, chartInstance, function (val) {
          chartInstance.updateConfig({ value: val });
        }));
      } else if (isBar) {
        yBar.appendChild(_makeAxisSelect('Value', function () { return chartInstance._config.value; }, chartInstance, function (val) {
          chartInstance.updateConfig({ value: val });
        }));
      } else if (isLine) {
        yBar.appendChild(_makeAxisSelect('Y axis', function () { var y = chartInstance._config.y; return Array.isArray(y) ? y[0] : y; }, chartInstance, function (val) {
          chartInstance.updateConfig({ y: [val] });
        }));
      } else if (isHeat) {
        yBar.appendChild(_makeAxisSelect('Y axis', function () { return chartInstance._config.y; }, chartInstance, function (val) {
          chartInstance.updateConfig({ y: val });
        }));
      }

      layout.appendChild(yBar);

      // Center column: plot + x-axis
      var col = document.createElement('div');
      col.className = 'sl-chart-column';

      var body = document.createElement('div');
      body.className = 'sl-panel-body';
      col.appendChild(body);

      // X-axis selector (bottom)
      var xBar = document.createElement('div');
      xBar.className = 'sl-x-axis-bar';

      if (isScatter || isLine) {
        xBar.appendChild(_makeAxisSelect('X axis', function () { return chartInstance._config.x; }, chartInstance, function (val) {
          chartInstance.updateConfig({ x: val });
        }));
      } else if (isPie) {
        xBar.appendChild(_makeAxisSelect('Slice by', function () { return chartInstance._config.category; }, chartInstance, function (val) {
          chartInstance.updateConfig({ category: val });
        }));
      } else if (isBar) {
        xBar.appendChild(_makeAxisSelect('Category', function () { return chartInstance._config.category; }, chartInstance, function (val) {
          chartInstance.updateConfig({ category: val });
        }));
      } else if (isHeat) {
        xBar.appendChild(_makeAxisSelect('X axis', function () { return chartInstance._config.x; }, chartInstance, function (val) {
          chartInstance.updateConfig({ x: val });
        }));
        var lbl = document.createElement('span');
        lbl.className = 'sl-axis-label';
        lbl.textContent = 'Value:';
        xBar.appendChild(lbl);
        xBar.appendChild(_makeAxisSelect('Value', function () { return chartInstance._config.value; }, chartInstance, function (val) {
          chartInstance.updateConfig({ value: val });
        }));
      }

      col.appendChild(xBar);
      layout.appendChild(col);

      // Color sidebar (right side, collapsible)
      if (supportsColorBy) {
        var colorByKey = isLine ? 'groupBy' : 'colorBy';
        var sidebar = _buildColorSidebar(chartInstance, colorByKey, colOptsWithNone);
        layout.appendChild(sidebar);
      }

      panel.appendChild(layout);
    } else {
      // No axes (DataTable etc.) — simple body
      var body = document.createElement('div');
      body.className = 'sl-panel-body';
      panel.appendChild(body);
    }

    container.innerHTML = '';
    container.appendChild(panel);

    // Keyboard: Escape to clear marking
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && chartInstance && chartInstance._mm) {
        chartInstance._mm.clearMarking();
      }
    });

    return panel;
  }

  return { wrap: wrap };
})();
