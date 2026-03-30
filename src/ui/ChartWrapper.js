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
  // colFilter: 'numeric', 'string', 'category', or null (all)
  function _makeAxisSelect(label, getVal, chartInst, onChange, colFilter, includeNone) {
    var select = document.createElement('select');
    select.title = label;
    select.className = 'sl-axis-select';

    function _populate() {
      var curVal = getVal();
      select.innerHTML = '';
      var ds = chartInst._ds;
      var allCols = ds.getColumns().filter(function (c) { return c.name !== '__rowIndex'; });

      var filtered = allCols;
      if (colFilter === 'numeric') {
        filtered = allCols.filter(function (c) { return c.type === 'number'; });
      } else if (colFilter === 'string') {
        filtered = allCols.filter(function (c) { return c.type !== 'number'; });
      } else if (colFilter === 'category') {
        // String columns with <= 30 unique values
        filtered = allCols.filter(function (c) {
          if (c.type === 'number') return false;
          return ds.getColumnValues(c.name).length <= 30;
        });
        if (filtered.length === 0) filtered = allCols.filter(function (c) { return c.type !== 'number'; });
      }

      // Always include current value even if it doesn't match filter
      var hasCurrentVal = filtered.some(function (c) { return c.name === curVal; });
      if (curVal && !hasCurrentVal) {
        var curCol = allCols.find(function (c) { return c.name === curVal; });
        if (curCol) filtered.unshift(curCol);
      }

      if (includeNone) {
        var noneEl = document.createElement('option');
        noneEl.value = 'None';
        noneEl.textContent = 'None (show total)';
        if (curVal === 'None' || !curVal) noneEl.selected = true;
        select.appendChild(noneEl);
      }

      filtered.forEach(function (c) {
        var el = document.createElement('option');
        el.value = c.name;
        el.textContent = c.name;
        if (c.name === curVal) el.selected = true;
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

  // Transform a chart to a different type
  function _transformChart(oldChart, container, newType) {
    var ds = oldChart._ds;
    var oldCfg = oldChart._config;

    // Keep container in DOM — prevent destroy() from removing it
    var parentGrid = container.parentNode;
    var nextSibling = container.nextSibling;

    // Get available columns
    var cols = ds.getColumns().filter(function (c) { return c.name !== '__rowIndex'; });
    var numCols = cols.filter(function (c) { return c.type === 'number'; });
    var strCols = cols.filter(function (c) { return c.type !== 'number'; });
    var catCols = strCols.filter(function (c) { return ds.getColumnValues(c.name).length <= 30; });
    if (catCols.length === 0) catCols = strCols;

    // Try to reuse existing axis values, fall back to best match
    var bestNum = oldCfg.value || oldCfg.y || (numCols[0] ? numCols[0].name : cols[0].name);
    var bestNum2 = oldCfg.x || (numCols[1] ? numCols[1].name : bestNum);
    var bestCat = oldCfg.category || oldCfg.x || (catCols[0] ? catCols[0].name : cols[0].name);
    var bestCat2 = catCols[1] ? catCols[1].name : bestCat;
    var bestColor = oldCfg.colorBy || oldCfg.groupBy || null;

    // Validate: make sure numeric picks are actually numeric
    if (!numCols.some(function (c) { return c.name === bestNum; })) bestNum = numCols[0] ? numCols[0].name : cols[0].name;
    if (!numCols.some(function (c) { return c.name === bestNum2; })) bestNum2 = numCols[1] ? numCols[1].name : bestNum;
    if (!catCols.some(function (c) { return c.name === bestCat; }) && !strCols.some(function (c) { return c.name === bestCat; })) bestCat = catCols[0] ? catCols[0].name : cols[0].name;

    // Destroy old chart (this may remove the container from DOM)
    oldChart.destroy();

    // Re-insert container if it was removed by destroy()
    if (!container.parentNode && parentGrid) {
      if (nextSibling) parentGrid.insertBefore(container, nextSibling);
      else parentGrid.appendChild(container);
    }
    container.innerHTML = ''; // clear any leftover content

    // Create new chart
    switch (newType) {
      case 'bar':
        SpottyFire.BarChart(container, ds, {
          category: bestCat, value: bestNum, aggregation: 'avg', showValues: true,
          colorBy: bestColor, title: 'Avg ' + bestNum + ' by ' + bestCat,
        });
        break;
      case 'scatter':
        SpottyFire.ScatterPlot(container, ds, {
          x: bestNum2, y: bestNum, colorBy: bestColor || (catCols[0] ? catCols[0].name : null),
          pointSize: 7, title: bestNum2 + ' vs ' + bestNum,
        });
        break;
      case 'line':
        SpottyFire.LineChart(container, ds, {
          x: bestCat, y: [bestNum], groupBy: bestColor, smooth: true,
          title: bestNum + ' by ' + bestCat,
        });
        break;
      case 'pie':
        SpottyFire.PieChart(container, ds, {
          category: bestCat, value: bestNum, aggregation: 'sum',
          hole: 0.45, showPercent: true, title: bestNum + ' by ' + bestCat,
        });
        break;
      case 'heatmap':
        SpottyFire.HeatMap(container, ds, {
          x: bestCat, y: bestCat2, value: bestNum, aggregation: 'avg', showValues: true,
          title: 'Avg ' + bestNum + ': ' + bestCat + ' x ' + bestCat2,
        });
        break;
      case 'table':
        SpottyFire.DataTable(container, ds, {
          columns: cols.map(function (c) { return c.name; }).slice(0, 10),
          pageSize: 20, title: 'Data Table',
        });
        break;
    }

    // Recalculate layout
    if (typeof window.recalcLayout === 'function') window.recalcLayout();
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

    // Column selector dropdown — "Line by" for LineChart, "Color by" for others
    var colorLabel = (chartInstance instanceof LineChart) ? 'Line by' : 'Color by';
    var label = document.createElement('div');
    label.className = 'sl-color-label';
    label.textContent = colorLabel;
    body.appendChild(label);

    var select = _makeSelect(colorLabel, cfg[colorByKey] || '', colOptsWithNone, function (val) {
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

    // ── Marker By section (Line chart only) ──
    if (chartInstance instanceof LineChart) {
      var markerLabel = document.createElement('div');
      markerLabel.className = 'sl-color-label';
      markerLabel.style.marginTop = '10px';
      markerLabel.style.borderTop = '1px solid var(--sl-panel-border)';
      markerLabel.style.paddingTop = '8px';
      markerLabel.textContent = 'Marker by';
      body.appendChild(markerLabel);

      var markerSelect = document.createElement('select');
      markerSelect.className = 'sl-axis-select';
      markerSelect.style.width = '100%';
      markerSelect.style.marginBottom = '4px';

      function _populateMarkerBy() {
        var curVal = chartInstance._config.markerBy || '';
        markerSelect.innerHTML = '';
        var noneOpt = document.createElement('option');
        noneOpt.value = '';
        noneOpt.textContent = 'None';
        markerSelect.appendChild(noneOpt);
        var allCols = ds.getColumns().filter(function (c) { return c.name !== '__rowIndex' && c.type !== 'number'; });
        allCols.forEach(function (c) {
          if (ds.getColumnValues(c.name).length > 20) return;
          var opt = document.createElement('option');
          opt.value = c.name;
          opt.textContent = c.name;
          if (c.name === curVal) opt.selected = true;
          markerSelect.appendChild(opt);
        });
      }
      _populateMarkerBy();
      markerSelect.addEventListener('focus', _populateMarkerBy);
      markerSelect.addEventListener('change', function () {
        chartInstance.updateConfig({ markerBy: markerSelect.value || null });
      });
      body.appendChild(markerSelect);

      // Marker legend
      var markerLegend = document.createElement('div');
      function _renderMarkerLegend() {
        markerLegend.innerHTML = '';
        var mb = chartInstance._config.markerBy;
        if (!mb) return;
        var symbols = ['\u25CF', '\u25A0', '\u25C6', '\u2716', '\u2573', '\u25B2', '\u25BC', '\u2605', '\u2B22', '\u2B1F'];
        var vals = ds.getColumnValues(mb).slice(0, 10);
        vals.forEach(function (v, i) {
          var item = document.createElement('div');
          item.className = 'sl-color-item';
          var sym = document.createElement('span');
          sym.style.cssText = 'width:14px;text-align:center;font-size:12px;flex-shrink:0;';
          sym.textContent = symbols[i % symbols.length];
          item.appendChild(sym);
          var txt = document.createElement('span');
          txt.textContent = v;
          item.appendChild(txt);
          markerLegend.appendChild(item);
        });
      }
      _renderMarkerLegend();
      body.appendChild(markerLegend);

      // Show markers toggle
      var showMarkersLabel = document.createElement('label');
      showMarkersLabel.className = 'sl-color-item';
      showMarkersLabel.style.marginTop = '6px';
      var smCb = document.createElement('input');
      smCb.type = 'checkbox';
      smCb.checked = !!(chartInstance._config.showMarkers || chartInstance._config.markerBy);
      smCb.addEventListener('change', function () {
        chartInstance.updateConfig({ showMarkers: smCb.checked });
      });
      showMarkersLabel.appendChild(smCb);
      showMarkersLabel.appendChild(document.createTextNode(' Show markers'));
      body.appendChild(showMarkersLabel);
    }

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

    // Chart type switcher
    var titleWrap = document.createElement('div');
    titleWrap.style.cssText = 'display:flex;align-items:center;gap:6px;min-width:0;flex:1;';

    if (chartInstance && chartInstance._ds) {
      var typeSelect = document.createElement('select');
      typeSelect.className = 'sl-axis-select';
      typeSelect.title = 'Change chart type';
      typeSelect.style.cssText += 'font-size:13px;padding:2px 4px;flex-shrink:0;';
      var types = [
        { value: 'bar', label: '\uD83D\uDCCA', name: 'Bar' },
        { value: 'scatter', label: '\u2022\u2022', name: 'Scatter' },
        { value: 'line', label: '\uD83D\uDCC8', name: 'Line' },
        { value: 'pie', label: '\u25D4', name: 'Pie' },
        { value: 'heatmap', label: '\u2593', name: 'Heatmap' },
        { value: 'table', label: '\u2630', name: 'Table' },
      ];
      var currentType = (chartInstance instanceof BarChart) ? 'bar' :
        (chartInstance instanceof ScatterPlot) ? 'scatter' :
        (chartInstance instanceof LineChart) ? 'line' :
        (chartInstance instanceof PieChart) ? 'pie' :
        (chartInstance instanceof HeatMap) ? 'heatmap' :
        (chartInstance instanceof DataTable) ? 'table' : '';

      types.forEach(function (t) {
        var opt = document.createElement('option');
        opt.value = t.value;
        opt.textContent = t.label + ' ' + t.name;
        if (t.value === currentType) opt.selected = true;
        typeSelect.appendChild(opt);
      });

      typeSelect.addEventListener('change', function () {
        _transformChart(chartInstance, container, typeSelect.value);
      });
      titleWrap.appendChild(typeSelect);
    }

    var titleEl = document.createElement('span');
    titleEl.textContent = title || '';
    titleEl.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    titleWrap.appendChild(titleEl);
    header.appendChild(titleWrap);

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

    // Page size selector — only for DataTable
    if (chartInstance instanceof DataTable) {
      var pgSelect = _makeSelect('Show', String(cfg.pageSize || 20), [
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '50', label: '50' },
        { value: '100', label: '100' },
        { value: '200', label: '200' },
        { value: '500', label: '500' },
        { value: '1000', label: '1000' },
      ], function (val) {
        chartInstance._config.pageSize = +val;
        chartInstance._page = 0;
        chartInstance.refresh();
      });
      actions.appendChild(pgSelect);
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
    fsBtn.innerHTML = '\u26F6'; // ⛶ expand
    fsBtn.title = 'Fullscreen';
    var _preFsHeight = null;
    fsBtn.addEventListener('click', function () {
      var isFs = panel.classList.toggle('sl-fullscreen');
      fsBtn.innerHTML = isFs ? '\u2199' : '\u26F6'; // ↙ compress / ⛶ expand
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

    // Close (remove) chart button — always last
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '\u2715';
    closeBtn.title = 'Close this chart';
    closeBtn.style.cssText += 'color:var(--sl-text-muted);';
    closeBtn.addEventListener('click', function () {
      if (chartInstance && chartInstance.destroy) {
        chartInstance.destroy();
      }
    });
    actions.appendChild(closeBtn);

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
        }, 'numeric'));
      } else if (isPie) {
        yBar.appendChild(_makeAxisSelect('Size by', function () { return chartInstance._config.value; }, chartInstance, function (val) {
          chartInstance.updateConfig({ value: val });
        }, 'numeric'));
      } else if (isBar) {
        yBar.appendChild(_makeAxisSelect('Value', function () { return chartInstance._config.value; }, chartInstance, function (val) {
          chartInstance.updateConfig({ value: val });
        }, 'numeric'));
      } else if (isLine) {
        yBar.appendChild(_makeAxisSelect('Y axis', function () { var y = chartInstance._config.y; return Array.isArray(y) ? y[0] : y; }, chartInstance, function (val) {
          chartInstance.updateConfig({ y: [val] });
        }, 'numeric'));
      } else if (isHeat) {
        yBar.appendChild(_makeAxisSelect('Y axis', function () { return chartInstance._config.y; }, chartInstance, function (val) {
          chartInstance.updateConfig({ y: val });
        }, 'category'));
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

      if (isScatter) {
        xBar.appendChild(_makeAxisSelect('X axis', function () { return chartInstance._config.x; }, chartInstance, function (val) {
          chartInstance.updateConfig({ x: val });
        }, 'numeric'));
      } else if (isLine) {
        xBar.appendChild(_makeAxisSelect('X axis', function () { return chartInstance._config.x; }, chartInstance, function (val) {
          chartInstance.updateConfig({ x: val });
        }, null)); // line X can be date/string/numeric
      } else if (isPie) {
        xBar.appendChild(_makeAxisSelect('Slice by', function () { return chartInstance._config.category; }, chartInstance, function (val) {
          chartInstance.updateConfig({ category: val });
        }, 'category'));
      } else if (isBar) {
        xBar.appendChild(_makeAxisSelect('Category', function () { return chartInstance._config.category; }, chartInstance, function (val) {
          chartInstance.updateConfig({ category: val === 'None' ? null : val });
        }, null, true));
      } else if (isHeat) {
        xBar.appendChild(_makeAxisSelect('X axis', function () { return chartInstance._config.x; }, chartInstance, function (val) {
          chartInstance.updateConfig({ x: val });
        }, 'category'));
        var lbl = document.createElement('span');
        lbl.className = 'sl-axis-label';
        lbl.textContent = 'Value:';
        xBar.appendChild(lbl);
        xBar.appendChild(_makeAxisSelect('Value', function () { return chartInstance._config.value; }, chartInstance, function (val) {
          chartInstance.updateConfig({ value: val });
        }, 'numeric'));
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

        // Pie chart specific toggles
        if (isPie) {
          _addToggle('Show percentage', cfg.showPercent !== false, function (on) {
            chartInstance._config.showPercent = on;
            chartInstance.refresh();
          });

          _addToggle('Show values', false, function (on) {
            chartInstance._config.showValues = on;
            chartInstance.refresh();
          });
        }

        // Bar chart specific toggle
        if (isBar) {
          _addToggle('Show values', cfg.showValues || false, function (on) {
            chartInstance._config.showValues = on;
            chartInstance.refresh();
          });
        }
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

    // Keyboard: Escape to clear marking (stored for cleanup)
    chartInstance._escHandler = function (e) {
      if (e.key === 'Escape' && chartInstance && chartInstance._mm) {
        chartInstance._mm.clearMarking();
      }
    };
    document.addEventListener('keydown', chartInstance._escHandler);

    return panel;
  }

  return { wrap: wrap };
})();
