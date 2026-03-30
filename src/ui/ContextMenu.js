// ─── ContextMenu ────────────────────────────────────────────
var ContextMenu = (function () {
  var _menu = null;
  var _visible = false;
  var _justShown = false;

  function _create() {
    if (_menu) return _menu;
    _menu = document.createElement('div');
    _menu.className = 'sl-context-menu';
    _menu.style.display = 'none';
    document.body.appendChild(_menu);

    // Close on any click outside (delayed to avoid closing immediately after show)
    document.addEventListener('click', function () { hide(); });
    document.addEventListener('contextmenu', function () {
      // Don't hide if we just showed — _justShown flag prevents race
      if (!_justShown) hide();
      _justShown = false;
    });
    window.addEventListener('scroll', function () { hide(); }, true);

    return _menu;
  }

  function show(x, y, items) {
    var menu = _create();
    menu.innerHTML = '';

    items.forEach(function (item) {
      if (item === '---') {
        var sep = document.createElement('div');
        sep.className = 'sl-ctx-separator';
        menu.appendChild(sep);
        return;
      }

      var row = document.createElement('div');
      row.className = 'sl-ctx-item';
      if (item.disabled) row.classList.add('sl-ctx-disabled');

      if (item.icon) {
        var icon = document.createElement('span');
        icon.className = 'sl-ctx-icon';
        icon.textContent = item.icon;
        row.appendChild(icon);
      }

      var label = document.createElement('span');
      label.textContent = item.label;
      row.appendChild(label);

      if (item.submenu) {
        // Submenu arrow
        var arrow = document.createElement('span');
        arrow.className = 'sl-ctx-shortcut';
        arrow.textContent = '\u25B6';
        row.appendChild(arrow);

        // Build submenu
        var sub = document.createElement('div');
        sub.className = 'sl-context-menu sl-ctx-submenu';
        sub.style.cssText = 'display:none;position:absolute;left:100%;top:0;';
        item.submenu.forEach(function (si) {
          var sr = document.createElement('div');
          sr.className = 'sl-ctx-item';
          if (si.icon) {
            var sIcon = document.createElement('span');
            sIcon.className = 'sl-ctx-icon';
            sIcon.textContent = si.icon;
            sr.appendChild(sIcon);
          }
          var sLabel = document.createElement('span');
          sLabel.textContent = si.label;
          sr.appendChild(sLabel);
          sr.addEventListener('click', function (e) {
            e.stopPropagation();
            hide();
            if (si.action) si.action();
          });
          sub.appendChild(sr);
        });
        row.style.position = 'relative';
        row.appendChild(sub);
        row.addEventListener('mouseenter', function () { sub.style.display = 'block'; });
        row.addEventListener('mouseleave', function () { sub.style.display = 'none'; });
      } else if (item.shortcut) {
        var shortcut = document.createElement('span');
        shortcut.className = 'sl-ctx-shortcut';
        shortcut.textContent = item.shortcut;
        row.appendChild(shortcut);
      }

      if (!item.disabled && !item.submenu) {
        row.addEventListener('click', function (e) {
          e.stopPropagation();
          hide();
          if (item.action) item.action();
        });
      }

      menu.appendChild(row);
    });

    // Position
    menu.style.display = 'block';
    var mw = menu.offsetWidth;
    var mh = menu.offsetHeight;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    menu.style.left = (x + mw > vw ? vw - mw - 8 : x) + 'px';
    menu.style.top = (y + mh > vh ? vh - mh - 8 : y) + 'px';
    _visible = true;
    _justShown = true;
  }

  function hide() {
    if (_menu) {
      _menu.style.display = 'none';
      _visible = false;
    }
  }

  function isVisible() { return _visible; }

  // Build standard chart context menu items
  function buildChartItems(chartInstance, pointData) {
    var ds = chartInstance._ds;
    var mm = chartInstance._mm;
    var cfg = chartInstance._config;
    var items = [];

    // If a data point was right-clicked
    if (pointData && pointData.value != null) {
      var col = pointData.column;
      var val = pointData.value;
      var displayVal = ds.formatValue(val, col);
      if (String(displayVal).length > 30) displayVal = String(displayVal).substring(0, 27) + '...';

      items.push({
        icon: '\u2714', label: 'Mark "' + displayVal + '"',
        action: function () {
          var rows = ds.getFilteredRows();
          var indices = [];
          rows.forEach(function (r) {
            if (String(r[col]) === String(val)) indices.push(r.__rowIndex);
          });
          mm.setMarking(indices, chartInstance._id);
        }
      });

      items.push({
        icon: '\u229E', label: 'Add "' + displayVal + '" to marking',
        action: function () {
          var rows = ds.getFilteredRows();
          var indices = [];
          rows.forEach(function (r) {
            if (String(r[col]) === String(val)) indices.push(r.__rowIndex);
          });
          mm.addToMarking(indices, chartInstance._id);
        }
      });

      items.push('---');

      items.push({
        icon: '\uD83D\uDD0D', label: 'Filter to "' + displayVal + '"',
        action: function () {
          ds.setFilter(col, { type: 'values', selected: [val] });
        }
      });

      items.push({
        icon: '\u2716', label: 'Exclude "' + displayVal + '"',
        action: function () {
          var allVals = ds.getColumnValues(col);
          var remaining = allVals.filter(function (v) { return String(v) !== String(val); });
          ds.setFilter(col, { type: 'values', selected: remaining });
        }
      });

      items.push('---');

      items.push({
        icon: '\uD83D\uDCCB', label: 'Copy value',
        action: function () {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(String(val));
          }
        }
      });

      items.push('---');
    }

    // Sort options — only for BarChart and PieChart
    var isBar = chartInstance instanceof BarChart;
    var isPie = chartInstance instanceof PieChart;
    if (isBar || isPie) {
      var catCol = cfg.category;
      var valCol = cfg.value;
      var agg = cfg.aggregation || 'sum';

      // Check if value column is numeric
      var valIsNum = valCol && ds._columns.some(function (c) { return c.name === valCol && c.type === 'number'; });

      if (valIsNum) {
        items.push({
          icon: '\u2191', label: 'Sort by Value (Ascending)',
          action: function () { _sortChart(chartInstance, ds, 'value', 'asc'); }
        });
        items.push({
          icon: '\u2193', label: 'Sort by Value (Descending)',
          action: function () { _sortChart(chartInstance, ds, 'value', 'desc'); }
        });
      }

      items.push({
        icon: '\u2191', label: 'Sort Alphabetical (A \u2192 Z)',
        action: function () { _sortChart(chartInstance, ds, 'category', 'asc'); }
      });
      items.push({
        icon: '\u2193', label: 'Sort Alphabetical (Z \u2192 A)',
        action: function () { _sortChart(chartInstance, ds, 'category', 'desc'); }
      });

      items.push('---');
    }

    // Batch actions on marked data
    if (mm.hasMarking()) {
      var markedCount = mm.getMarkedIndices().size;
      items.push({
        icon: '\uD83D\uDD0D', label: 'Filter to marked (' + markedCount + ' rows)',
        action: function () {
          // Get unique values per string column from marked rows
          var marked = mm.getMarkedIndices();
          var rows = ds.getFilteredRows();
          var markedRows = rows.filter(function (r) { return marked.has(r.__rowIndex); });
          // For each string column, collect unique values in marked set
          var cols = ds.getColumns();
          cols.forEach(function (c) {
            if (c.type !== 'number' && c.name !== '__rowIndex') {
              var vals = {};
              markedRows.forEach(function (r) { if (r[c.name] != null) vals[String(r[c.name])] = true; });
              var selected = Object.keys(vals);
              var allVals = ds.getColumnValues(c.name);
              if (selected.length < allVals.length) {
                ds.setFilter(c.name, { type: 'values', selected: selected });
              }
            }
          });
        }
      });

      items.push({
        icon: '\u2716', label: 'Exclude marked (' + markedCount + ' rows)',
        action: function () {
          var marked = mm.getMarkedIndices();
          var rows = ds.getFilteredRows();
          var markedRows = rows.filter(function (r) { return marked.has(r.__rowIndex); });
          var cols = ds.getColumns();
          cols.forEach(function (c) {
            if (c.type !== 'number' && c.name !== '__rowIndex') {
              var markedVals = {};
              markedRows.forEach(function (r) { if (r[c.name] != null) markedVals[String(r[c.name])] = true; });
              var allVals = ds.getColumnValues(c.name);
              var remaining = allVals.filter(function (v) { return !markedVals[v]; });
              if (remaining.length < allVals.length && remaining.length > 0) {
                ds.setFilter(c.name, { type: 'values', selected: remaining });
              }
            }
          });
        }
      });

      items.push('---');
    }

    // General actions
    items.push({
      icon: '\u2610', label: 'Select all',
      action: function () {
        var rows = ds.getFilteredRows();
        var indices = rows.map(function (r) { return r.__rowIndex; });
        mm.setMarking(indices, chartInstance._id);
      }
    });

    items.push({
      icon: '\u21A9', label: 'Clear marking',
      shortcut: 'Esc',
      disabled: !mm.hasMarking(),
      action: function () { mm.clearMarking(); }
    });

    items.push({
      icon: '\u2205', label: 'Clear all filters',
      disabled: Object.keys(ds.getActiveFilters()).length === 0,
      action: function () { ds.clearAllFilters(); }
    });

    items.push('---');

    items.push({
      icon: '\u2913', label: 'Export visible data',
      action: function () { ds.downloadCSV('spottyfire-export.csv'); }
    });

    items.push({
      icon: '\u2913', label: 'Export marked data',
      disabled: !mm.hasMarking(),
      action: function () { ds.downloadCSV('spottyfire-marked.csv', { markedOnly: true }); }
    });

    items.push('---');

    // Duplicate visualization
    items.push({
      icon: '\uD83D\uDCCB', label: 'Duplicate visualization',
      action: function () { _duplicateChart(chartInstance); }
    });

    // Create visualization submenu
    items.push({
      icon: '\u2795', label: 'Create Visualization',
      submenu: [
        { icon: '\uD83D\uDCCA', label: 'Bar Chart', action: function () { _createLinkedChart(chartInstance, 'bar'); } },
        { icon: '\u2022\u2022', label: 'Scatter Plot', action: function () { _createLinkedChart(chartInstance, 'scatter'); } },
        { icon: '\uD83D\uDCC8', label: 'Line Chart', action: function () { _createLinkedChart(chartInstance, 'line'); } },
        { icon: '\u25D4', label: 'Pie Chart', action: function () { _createLinkedChart(chartInstance, 'pie'); } },
        { icon: '\u2593', label: 'Heatmap', action: function () { _createLinkedChart(chartInstance, 'heatmap'); } },
        { icon: '\u2630', label: 'Data Table', action: function () { _createLinkedChart(chartInstance, 'table'); } },
      ]
    });

    return items;
  }

  // Sort a bar/pie chart by value or category
  function _sortChart(chartInstance, ds, sortBy, direction) {
    var cfg = chartInstance._config;
    var catCol = cfg.category;
    var valCol = cfg.value;
    var agg = cfg.aggregation || 'sum';

    // Get aggregated values per category
    var rows = ds.getFilteredRows();
    var groups = {};
    rows.forEach(function (r) {
      var key = String(r[catCol] || 'Unknown');
      if (!groups[key]) groups[key] = [];
      groups[key].push(+r[valCol] || 0);
    });

    var categories = Object.keys(groups);
    var aggValues = {};
    categories.forEach(function (k) {
      var arr = groups[k];
      if (agg === 'sum') aggValues[k] = arr.reduce(function (a, b) { return a + b; }, 0);
      else if (agg === 'avg') aggValues[k] = arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
      else if (agg === 'count') aggValues[k] = arr.length;
      else if (agg === 'min') aggValues[k] = Math.min.apply(null, arr);
      else if (agg === 'max') aggValues[k] = Math.max.apply(null, arr);
      else aggValues[k] = arr.reduce(function (a, b) { return a + b; }, 0);
    });

    // Sort categories
    if (sortBy === 'value') {
      categories.sort(function (a, b) {
        return direction === 'asc' ? aggValues[a] - aggValues[b] : aggValues[b] - aggValues[a];
      });
    } else {
      categories.sort(function (a, b) {
        var sa = a.toLowerCase(), sb = b.toLowerCase();
        if (sa < sb) return direction === 'asc' ? -1 : 1;
        if (sa > sb) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply sort by reordering the data rows
    // Store sort order in config so refresh uses it
    chartInstance._config._sortOrder = categories;
    chartInstance.refresh();
  }

  // Duplicate a chart with the same config
  function _duplicateChart(chartInstance) {
    var ds = chartInstance._ds;
    var cfg = JSON.parse(JSON.stringify(chartInstance._config));
    cfg.title = (cfg.title || 'Chart') + ' (copy)';

    var grid = document.querySelector('.app-grid');
    if (!grid) return;

    var div = document.createElement('div');
    grid.appendChild(div);

    var type = (chartInstance instanceof BarChart) ? 'bar' :
      (chartInstance instanceof ScatterPlot) ? 'scatter' :
      (chartInstance instanceof LineChart) ? 'line' :
      (chartInstance instanceof PieChart) ? 'pie' :
      (chartInstance instanceof HeatMap) ? 'heatmap' :
      (chartInstance instanceof DataTable) ? 'table' : null;

    _createChartByType(div, ds, type, cfg);

    setTimeout(function () {
      if (typeof window.recalcLayout === 'function') window.recalcLayout();
    }, 50);
  }

  // Create a new chart linked (data limited by) to the source chart
  function _createLinkedChart(sourceChart, newType) {
    var ds = sourceChart._ds;
    var sourceId = sourceChart._id;

    var cols = ds.getColumns().filter(function (c) { return c.name !== '__rowIndex'; });
    var numCols = cols.filter(function (c) { return c.type === 'number'; });
    var strCols = cols.filter(function (c) { return c.type !== 'number'; });
    var catCols = strCols.filter(function (c) { return ds.getColumnValues(c.name).length <= 20; });
    if (catCols.length === 0) catCols = strCols;

    var firstNum = numCols[0] ? numCols[0].name : cols[0].name;
    var secondNum = numCols[1] ? numCols[1].name : firstNum;
    var firstCat = catCols[0] ? catCols[0].name : cols[0].name;
    var secondCat = catCols[1] ? catCols[1].name : firstCat;

    var cfg = { dataLimitedBy: sourceId };

    switch (newType) {
      case 'bar':
        cfg.category = firstCat; cfg.value = firstNum; cfg.aggregation = 'avg'; cfg.showValues = true;
        cfg.title = 'Avg ' + firstNum + ' by ' + firstCat;
        break;
      case 'scatter':
        cfg.x = secondNum; cfg.y = firstNum; cfg.colorBy = catCols[0] ? firstCat : null; cfg.pointSize = 7;
        cfg.title = secondNum + ' vs ' + firstNum;
        break;
      case 'line':
        cfg.x = firstCat; cfg.y = [firstNum]; cfg.smooth = true;
        cfg.title = firstNum + ' by ' + firstCat;
        break;
      case 'pie':
        cfg.category = firstCat; cfg.value = firstNum; cfg.aggregation = 'sum'; cfg.hole = 0.45; cfg.showPercent = true;
        cfg.title = firstNum + ' by ' + firstCat;
        break;
      case 'heatmap':
        cfg.x = firstCat; cfg.y = secondCat; cfg.value = firstNum; cfg.aggregation = 'avg'; cfg.showValues = true;
        cfg.title = 'Avg ' + firstNum + ': ' + firstCat + ' x ' + secondCat;
        break;
      case 'table':
        cfg.columns = cols.map(function (c) { return c.name; }).slice(0, 10); cfg.pageSize = 20;
        cfg.title = 'Data Table';
        break;
    }

    var grid = document.querySelector('.app-grid');
    if (!grid) return;

    var div = document.createElement('div');
    grid.appendChild(div);
    _createChartByType(div, ds, newType, cfg);

    setTimeout(function () {
      if (typeof window.recalcLayout === 'function') window.recalcLayout();
    }, 50);
  }

  // Helper to create chart by type string
  function _createChartByType(div, ds, type, cfg) {
    switch (type) {
      case 'bar': SpottyFire.BarChart(div, ds, cfg); break;
      case 'scatter': SpottyFire.ScatterPlot(div, ds, cfg); break;
      case 'line': SpottyFire.LineChart(div, ds, cfg); break;
      case 'pie': SpottyFire.PieChart(div, ds, cfg); break;
      case 'heatmap': SpottyFire.HeatMap(div, ds, cfg); break;
      case 'table': SpottyFire.DataTable(div, ds, cfg); break;
    }
  }

  return {
    show: show,
    hide: hide,
    isVisible: isVisible,
    buildChartItems: buildChartItems,
  };
})();
