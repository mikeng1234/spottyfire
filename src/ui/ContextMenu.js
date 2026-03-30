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

      if (item.shortcut) {
        var shortcut = document.createElement('span');
        shortcut.className = 'sl-ctx-shortcut';
        shortcut.textContent = item.shortcut;
        row.appendChild(shortcut);
      }

      if (!item.disabled) {
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

    return items;
  }

  return {
    show: show,
    hide: hide,
    isVisible: isVisible,
    buildChartItems: buildChartItems,
  };
})();
