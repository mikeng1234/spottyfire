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

  // Helper: axis dropdown that refreshes options on focus
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
      '.sl-chart-layout{display:flex;flex:1;min-height:0;min-width:0;overflow:hidden;}' +
      '.sl-y-axis-bar{display:flex;align-items:center;justify-content:center;padding:4px;min-width:0;flex-shrink:0;}' +
      '.sl-y-axis-bar select,.sl-y-axis-bar input{writing-mode:vertical-lr;text-orientation:mixed;transform:rotate(180deg);max-height:100%;padding:6px 3px;}' +
      '.sl-chart-column{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;}' +
      '.sl-x-axis-bar{display:flex;align-items:center;justify-content:center;padding:4px 8px;gap:4px;border-top:1px solid var(--sl-panel-border);}' +
      '.sl-x-axis-bar .sl-axis-label{font-size:10px;color:var(--sl-text-muted);text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;}' +
      // Properties sidebar
      '.sl-color-sidebar{display:flex;flex-direction:column;border-left:1px solid var(--sl-panel-border);overflow:hidden;transition:width var(--sl-transition) ease,min-width var(--sl-transition) ease,max-width var(--sl-transition) ease;width:140px;min-width:140px;max-width:140px;flex-shrink:0;height:100%;}' +
      '.sl-color-sidebar.sl-collapsed{width:28px !important;min-width:28px !important;max-width:28px !important;}' +
      '.sl-color-sidebar-toggle{background:none;border:none;border-bottom:1px solid var(--sl-panel-border);color:var(--sl-text-muted);cursor:pointer;padding:6px 4px;font-size:11px;font-family:var(--sl-font);text-align:center;white-space:nowrap;transition:color var(--sl-transition) ease;}' +
      '.sl-color-sidebar-toggle:hover{color:var(--sl-text-primary);}' +
      '.sl-collapsed .sl-color-sidebar-toggle{writing-mode:vertical-lr;transform:rotate(180deg);padding:8px 6px;border-bottom:none;flex:0 0 auto;}' +
      '.sl-color-sidebar-body{flex:1;overflow-y:auto;padding:6px;min-height:0;max-height:calc(100% - 32px);}' +
      '.sl-collapsed .sl-color-sidebar-body{display:none;}' +
      '.sl-color-item{display:flex;align-items:center;gap:6px;padding:3px 4px;cursor:pointer;border-radius:4px;font-size:11px;color:var(--sl-text-secondary);transition:background var(--sl-transition) ease;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '.sl-color-item:hover{background:rgba(128,128,128,0.1);color:var(--sl-text-primary);}' +
      '.sl-color-item.sl-active{color:var(--sl-text-primary);font-weight:600;}' +
      '.sl-color-swatch{width:10px;height:10px;border-radius:3px;flex-shrink:0;}' +
      '.sl-color-label{font-size:10px;font-weight:600;color:var(--sl-text-muted);text-transform:uppercase;letter-spacing:0.5px;padding:6px 4px 3px;user-select:none;}';
    document.head.appendChild(s);
  }

  // Build the collapsible properties sidebar
  function _buildColorSidebar(chartInstance, colorByKey, colOptsWithNone) {
    var cfg = chartInstance._config;
    var ds = chartInstance._ds;
    var theme = ThemeManager.getTheme();

    var sidebar = document.createElement('div');
    sidebar.className = 'sl-color-sidebar';

    // Toggle button
    var toggle = document.createElement('button');
    toggle.className = 'sl-color-sidebar-toggle';
    toggle.textContent = '\u25C0 Properties';
    toggle.addEventListener('click', function () {
      var collapsed = sidebar.classList.toggle('sl-collapsed');
      // Force reflow: hide → reflow → show to recalculate flex layout
      sidebar.style.display = 'none';
      void sidebar.offsetWidth;
      sidebar.style.display = '';
      toggle.textContent = collapsed ? 'Properties \u25B6' : '\u25C0 Properties';
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
      var maxVisible = 10;
      var showValues = values.slice(0, maxVisible);

      showValues.forEach(function (v, i) {
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

      // Show remaining count
      if (values.length > maxVisible) {
        var more = document.createElement('div');
        more.style.cssText = 'font-size:10px;color:var(--sl-text-muted);padding:4px;';
        more.textContent = '+ ' + (values.length - maxVisible) + ' more values';
        legendDiv.appendChild(more);
      }
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

    // Fullscreen toggle
    var fsBtn = document.createElement('button');
    fsBtn.textContent = '\u26F6';
    fsBtn.title = 'Fullscreen';
    var _preFsHeight = null;
    fsBtn.addEventListener('click', function () {
      var isFs = panel.classList.toggle('sl-fullscreen');
      fsBtn.textContent = isFs ? '\u2716' : '\u26F6';
      fsBtn.title = isFs ? 'Exit fullscreen' : 'Fullscreen';
      document.body.style.overflow = isFs ? 'hidden' : '';
      if (isFs) {
        _preFsHeight = panel.style.height || '';
      } else {
        // Clear all inline sizing so CSS takes over
        panel.style.height = _preFsHeight || '';
        panel.style.width = '';
        panel.style.position = '';
        panel.style.top = '';
        panel.style.left = '';
        panel.style.right = '';
        panel.style.bottom = '';
        panel.style.zIndex = '';
      }
      setTimeout(function () {
        var plotDiv = panel.querySelector('.sl-panel-body');
        if (plotDiv && plotDiv.data) {
          Plotly.Plots.resize(plotDiv);
        }
        window.dispatchEvent(new Event('resize'));
      }, 200);
    });
    actions.appendChild(fsBtn);

    // Settings cog menu
    if (hasAxes) {
      var cogWrap = document.createElement('div');
      cogWrap.style.cssText = 'position:relative;display:inline-block;';

      var cogBtn = document.createElement('button');
      cogBtn.textContent = '\u2699';
      cogBtn.title = 'Chart settings';
      cogBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = cogMenu.style.display === 'block';
        cogMenu.style.display = open ? 'none' : 'block';
      });
      cogWrap.appendChild(cogBtn);

      var cogMenu = document.createElement('div');
      cogMenu.className = 'sl-cog-menu';
      cogMenu.style.display = 'none';

      function _addToggle(label, defaultOn, onToggle) {
        var row = document.createElement('label');
        row.className = 'sl-cog-item';
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = defaultOn;
        cb.addEventListener('change', function () { onToggle(cb.checked); });
        row.appendChild(cb);
        row.appendChild(document.createTextNode(' ' + label));
        cogMenu.appendChild(row);
        return cb;
      }

      // We'll reference these elements after they're created below
      cogWrap._toggles = {};
      cogWrap._addToggle = _addToggle;
      cogWrap.appendChild(cogMenu);
      actions.appendChild(cogWrap);

      // Close menu on outside click
      document.addEventListener('click', function () { cogMenu.style.display = 'none'; });
      cogMenu.addEventListener('click', function (e) { e.stopPropagation(); });

      panel._cogMenu = cogWrap;
    }

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

      // Properties sidebar (right side, collapsible)
      if (supportsColorBy) {
        var colorByKey = isLine ? 'groupBy' : 'colorBy';
        var sidebar = _buildColorSidebar(chartInstance, colorByKey, colOptsWithNone);
        layout.appendChild(sidebar);
      }

      panel.appendChild(layout);

      // Add settings toggles to cog menu (now that axis elements exist)
      if (panel._cogMenu) {
        var _addToggle = panel._cogMenu._addToggle;
        var plotDiv = body; // the .sl-panel-body

        _addToggle('Show X axis selector', true, function (on) {
          xBar.style.display = on ? '' : 'none';
          setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
        });

        _addToggle('Show Y axis selector', true, function (on) {
          yBar.style.display = on ? '' : 'none';
          setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
        });

        _addToggle('Show X axis label', true, function (on) {
          var curLayout = plotDiv._fullLayout;
          if (curLayout) {
            Plotly.relayout(plotDiv, { 'xaxis.showticklabels': on, 'xaxis.title.text': on ? (chartInstance._config.x || chartInstance._config.category || '') : '' });
          }
        });

        _addToggle('Show Y axis label', true, function (on) {
          var curLayout = plotDiv._fullLayout;
          if (curLayout) {
            Plotly.relayout(plotDiv, { 'yaxis.showticklabels': on, 'yaxis.title.text': on ? (chartInstance._config.y || chartInstance._config.value || '') : '' });
          }
        });
      }

    } else {
      // No axes (DataTable etc.) — simple body
      var body = document.createElement('div');
      body.className = 'sl-panel-body';
      panel.appendChild(body);
    }

    // Drag-to-resize handle (bottom edge)
    var resizeHandle = document.createElement('div');
    resizeHandle.className = 'sl-resize-handle';
    var _dragging = false;
    var _startY = 0;
    var _startH = 0;
    resizeHandle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      _dragging = true;
      _startY = e.clientY;
      _startH = panel.offsetHeight;
      document.addEventListener('mousemove', _onDrag);
      document.addEventListener('mouseup', _onDragEnd);
    });
    function _onDrag(e) {
      if (!_dragging) return;
      var newH = Math.max(150, _startH + (e.clientY - _startY));
      panel.style.height = newH + 'px';
    }
    function _onDragEnd() {
      _dragging = false;
      document.removeEventListener('mousemove', _onDrag);
      document.removeEventListener('mouseup', _onDragEnd);
      // Resize Plotly to fit new height
      var pd = panel.querySelector('.sl-panel-body');
      if (pd && pd.data) {
        setTimeout(function () { Plotly.Plots.resize(pd); }, 50);
      }
    }
    panel.appendChild(resizeHandle);

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
