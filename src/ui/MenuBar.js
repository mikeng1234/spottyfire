// ─── MenuBar ────────────────────────────────────────────────
class MenuBar {
  constructor(selector, dataStore, config) {
    this._ds = dataStore;
    this._config = config || {};
    this._container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._container) throw new Error('MenuBar: container not found');
    this.render();
  }

  render() {
    var ds = this._ds;
    var cfg = this._config;
    var container = this._container;
    container.innerHTML = '';

    var bar = document.createElement('div');
    bar.className = 'sl-menubar';

    // ── Left: Menu items ──
    var menus = document.createElement('div');
    menus.className = 'sl-menubar-menus';

    // FILE menu
    var fileItems = [
      { label: 'Upload CSV...', icon: '\uD83D\uDCC1', action: function () { _triggerCSVUpload(ds); } },
      { label: 'Upload JSON...', icon: '\uD83D\uDCC4', action: function () { _triggerJSONUpload(ds); } },
      '---',
      { label: 'Export All as CSV', icon: '\u2913', action: function () { ds.downloadCSV('spottyfire-export.csv'); } },
      { label: 'Export Marked as CSV', icon: '\u2913', action: function () { ds.downloadCSV('spottyfire-marked.csv', { markedOnly: true }); },
        disabled: function () { return !ds._markingManager.hasMarking(); } },
      '---',
      { label: 'Clear Data', icon: '\uD83D\uDDD1', action: function () {
        if (confirm('Clear all data? This cannot be undone.')) {
          _clearData(ds);
        }
      }, disabled: function () { return ds.getRowCount() === 0; } },
    ];
    menus.appendChild(_buildMenu('File', fileItems));

    // EDIT menu
    var editItems = [
      { label: 'Undo', icon: '\u21A9', shortcut: 'Ctrl+Z', action: function () { UndoManager.undo(); },
        disabled: function () { return !UndoManager.canUndo(); } },
      { label: 'Redo', icon: '\u21AA', shortcut: 'Ctrl+Y', action: function () { UndoManager.redo(); },
        disabled: function () { return !UndoManager.canRedo(); } },
      '---',
      { label: 'Clear Selection', icon: '\u2715', shortcut: 'Esc', action: function () { ds._markingManager.clearMarking(); },
        disabled: function () { return !ds._markingManager.hasMarking(); } },
      { label: 'Clear All Filters', icon: '\u2205', action: function () { ds.clearAllFilters(); },
        disabled: function () { return Object.keys(ds.getActiveFilters()).length === 0; } },
    ];
    menus.appendChild(_buildMenu('Edit', editItems));

    // VIEW menu
    var viewItems = [];

    // Panel toggles
    viewItems.push({
      label: 'Columns Panel', icon: '\uD83D\uDCCB',
      action: function () {
        var fn = window.toggleAppSidebar || window.toggleLeft;
        if (fn) fn('left');
      }
    });
    viewItems.push({
      label: 'Filters Panel', icon: '\uD83D\uDD0D',
      action: function () {
        var fn = window.toggleAppSidebar || window.toggleRight;
        if (fn) fn('right');
      }
    });

    viewItems.push('---');

    // Layouts
    var layouts = [
      { label: '1 Column', icon: '\u2587', cols: 1 },
      { label: '2 Columns', icon: '\u2587\u2587', cols: 2 },
      { label: '3 Columns', icon: '\u2587\u2587\u2587', cols: 3 },
      { label: '2x2 Grid', icon: '\u2584\u2584', cols: 2 },
      { label: '1 + 2 Split', icon: '\u2587\u2584', cols: '1-2' },
    ];
    layouts.forEach(function (l) {
      viewItems.push({
        label: l.label, icon: l.icon,
        action: function () { _applyLayout(l.cols); },
      });
    });

    viewItems.push('---');

    // Themes
    var themeNames = cfg.themes || ThemeManager.getThemeNames();
    themeNames.forEach(function (t) {
      viewItems.push({
        label: t.charAt(0).toUpperCase() + t.slice(1),
        icon: ThemeManager.getTheme().name === t ? '\u2713' : ' ',
        action: function () { ThemeManager.setTheme(t); _self.render(); },
      });
    });
    menus.appendChild(_buildMenu('View', viewItems));

    bar.appendChild(menus);

    // ── Right: Quick action buttons ──
    var actions = document.createElement('div');
    actions.className = 'sl-menubar-actions';

    // Undo button
    var undoBtn = document.createElement('button');
    undoBtn.className = 'sl-menubar-btn';
    undoBtn.innerHTML = '\u21A9';
    undoBtn.title = 'Undo (Ctrl+Z)';
    undoBtn.disabled = !UndoManager.canUndo();
    undoBtn.addEventListener('click', function () { UndoManager.undo(); });
    actions.appendChild(undoBtn);

    // Redo button
    var redoBtn = document.createElement('button');
    redoBtn.className = 'sl-menubar-btn';
    redoBtn.innerHTML = '\u21AA';
    redoBtn.title = 'Redo (Ctrl+Y)';
    redoBtn.disabled = !UndoManager.canRedo();
    redoBtn.addEventListener('click', function () { UndoManager.redo(); });
    actions.appendChild(redoBtn);

    // Separator
    var sep = document.createElement('div');
    sep.className = 'sl-menubar-sep';
    actions.appendChild(sep);

    // Clear selection
    var clearBtn = document.createElement('button');
    clearBtn.className = 'sl-menubar-btn';
    clearBtn.innerHTML = '\u2715';
    clearBtn.title = 'Clear selection (Esc)';
    clearBtn.addEventListener('click', function () { ds._markingManager.clearMarking(); });
    actions.appendChild(clearBtn);

    // Row count indicator
    var info = document.createElement('span');
    info.className = 'sl-menubar-info';
    info.textContent = ds.getRowCount() + ' rows';
    actions.appendChild(info);

    bar.appendChild(actions);
    container.appendChild(bar);

    // Update button states on undo/marking changes
    var _self = this;
    UndoManager.on('changed', function () {
      undoBtn.disabled = !UndoManager.canUndo();
      redoBtn.disabled = !UndoManager.canRedo();
    });
    ds._markingManager.on('marking-changed', function (e) {
      var count = e.markedIndices.size;
      info.textContent = count > 0 ? count + ' / ' + ds.getRowCount() + ' selected' : ds.getRowCount() + ' rows';
    });
    ds.on('filter-changed', function () {
      var filtered = ds.getFilteredRowCount();
      var total = ds.getRowCount();
      var marked = ds._markingManager.hasMarking() ? ds._markingManager.getMarkedIndices().size : 0;
      if (marked > 0) {
        info.textContent = marked + ' / ' + filtered + ' selected (' + total + ' total)';
      } else if (filtered < total) {
        info.textContent = filtered + ' / ' + total + ' rows (filtered)';
      } else {
        info.textContent = total + ' rows';
      }
    });
  }

  destroy() {}
}

// ── Menu bar helpers ──
function _buildMenu(label, items) {
  var wrap = document.createElement('div');
  wrap.className = 'sl-menu-wrap';

  var btn = document.createElement('button');
  btn.className = 'sl-menu-trigger';
  btn.textContent = label;
  wrap.appendChild(btn);

  var dropdown = document.createElement('div');
  dropdown.className = 'sl-menu-dropdown';
  dropdown.style.display = 'none';

  items.forEach(function (item) {
    if (item === '---') {
      var sep = document.createElement('div');
      sep.className = 'sl-ctx-separator';
      dropdown.appendChild(sep);
      return;
    }

    var row = document.createElement('div');
    row.className = 'sl-ctx-item';
    var isDisabled = typeof item.disabled === 'function' ? item.disabled() : !!item.disabled;
    if (isDisabled) row.classList.add('sl-ctx-disabled');

    if (item.icon) {
      var icon = document.createElement('span');
      icon.className = 'sl-ctx-icon';
      icon.textContent = item.icon;
      row.appendChild(icon);
    }

    var text = document.createElement('span');
    text.textContent = item.label;
    row.appendChild(text);

    if (item.shortcut) {
      var sc = document.createElement('span');
      sc.className = 'sl-ctx-shortcut';
      sc.textContent = item.shortcut;
      row.appendChild(sc);
    }

    if (!isDisabled && item.action) {
      row.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.style.display = 'none';
        item.action();
      });
    }

    dropdown.appendChild(row);
  });

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    // Close any other open menus
    document.querySelectorAll('.sl-menu-dropdown').forEach(function (d) {
      if (d !== dropdown) d.style.display = 'none';
    });
    // Re-evaluate disabled states
    var rows = dropdown.querySelectorAll('.sl-ctx-item');
    var idx = 0;
    items.forEach(function (item) {
      if (item === '---') return;
      var row = rows[idx++];
      if (!row) return;
      var isDisabled = typeof item.disabled === 'function' ? item.disabled() : false;
      row.classList.toggle('sl-ctx-disabled', isDisabled);
    });
    var open = dropdown.style.display === 'block';
    dropdown.style.display = open ? 'none' : 'block';
  });

  // Close on outside click
  document.addEventListener('click', function () { dropdown.style.display = 'none'; });

  wrap.appendChild(dropdown);
  return wrap;
}

// ── Modal dialog helper ──
function _showModal(title, contentFn) {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:20000;display:flex;align-items:center;justify-content:center;';
  var modal = document.createElement('div');
  modal.style.cssText = 'background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:12px;box-shadow:0 16px 48px rgba(0,0,0,0.5);padding:24px;min-width:400px;max-width:600px;max-height:80vh;overflow-y:auto;font-family:var(--sl-font);color:var(--sl-text-primary);';
  var h = document.createElement('h3');
  h.style.cssText = 'margin:0 0 16px;font-size:16px;font-weight:700;';
  h.textContent = title;
  modal.appendChild(h);
  var body = document.createElement('div');
  modal.appendChild(body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
  contentFn(body, function () { overlay.remove(); });
  return overlay;
}

function _triggerCSVUpload(ds) {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  input.addEventListener('change', function () {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      var csvText = e.target.result;
      _handleNewData(ds, csvText, 'csv', file.name);
    };
    reader.readAsText(file);
  });
  input.click();
}

function _triggerJSONUpload(ds) {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.addEventListener('change', function () {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var arr = JSON.parse(e.target.result);
        if (Array.isArray(arr)) _handleNewData(ds, arr, 'json', file.name);
      } catch (err) { alert('Invalid JSON file'); }
    };
    reader.readAsText(file);
  });
  input.click();
}

function _clearData(ds) {
  ds._rows = [];
  ds._columns = [];
  ds._calculatedCols = {};
  ds._calculatedFormulas = {};
  ds._columnFormats = {};
  ds._filterEngine._filters = {};
  ds._markingManager._marked = new Set();
  UndoManager.clear();
  ds._emitEvent('data-loaded', { rowCount: 0 });
}

function _applyLayout(cols) {
  var grid = document.querySelector('.app-grid') || document.querySelector('.grid');
  if (!grid) return;

  if (cols === '1-2') {
    // First chart full width, rest 2 columns
    grid.style.gridTemplateColumns = '1fr 1fr';
    var children = grid.children;
    for (var i = 0; i < children.length; i++) {
      children[i].style.gridColumn = (i === 0) ? '1 / -1' : '';
    }
  } else {
    grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    var children = grid.children;
    for (var i = 0; i < children.length; i++) {
      children[i].style.gridColumn = '';
    }
  }

  // Resize all charts to fit new layout
  BaseChart.resizeAll();
}

function _handleNewData(ds, data, type, filename) {
  // If no existing data, just load directly
  if (ds.getRowCount() === 0) {
    if (type === 'csv') ds.loadCSV(data);
    else ds.loadJSON(data);
    return;
  }

  // Parse new data to inspect columns (without loading)
  var newRows = [];
  var newCols = [];
  if (type === 'csv') {
    var parsed = Papa.parse(data, { header: true, dynamicTyping: true, skipEmptyLines: true });
    newRows = parsed.data;
    if (newRows.length > 0) newCols = Object.keys(newRows[0]);
  } else {
    newRows = data;
    if (newRows.length > 0) newCols = Object.keys(newRows[0]);
  }

  var existingCols = ds.getColumnNames();

  // Show dialog
  _showModal('Load Data — ' + filename, function (body, close) {
    var info = document.createElement('p');
    info.style.cssText = 'font-size:13px;color:var(--sl-text-secondary);margin:0 0 16px;';
    info.textContent = 'New file has ' + newRows.length + ' rows and ' + newCols.length + ' columns. Current data has ' + ds.getRowCount() + ' rows.';
    body.appendChild(info);

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:10px;margin-bottom:16px;';

    // Replace button
    var replaceBtn = document.createElement('button');
    replaceBtn.style.cssText = 'flex:1;padding:10px;background:var(--sl-accent);color:#fff;border:none;border-radius:8px;font-size:13px;cursor:pointer;font-family:var(--sl-font);';
    replaceBtn.textContent = 'Replace existing data';
    replaceBtn.addEventListener('click', function () {
      close();
      _clearData(ds);
      if (type === 'csv') ds.loadCSV(data);
      else ds.loadJSON(newRows);
    });
    btnRow.appendChild(replaceBtn);

    // Append button
    var appendBtn = document.createElement('button');
    appendBtn.style.cssText = 'flex:1;padding:10px;background:transparent;color:var(--sl-text-primary);border:1px solid var(--sl-panel-border);border-radius:8px;font-size:13px;cursor:pointer;font-family:var(--sl-font);';
    appendBtn.textContent = 'Append to existing data';
    appendBtn.addEventListener('click', function () {
      // Check column match
      var matching = newCols.filter(function (c) { return existingCols.indexOf(c) >= 0; });
      var missingInNew = existingCols.filter(function (c) { return newCols.indexOf(c) < 0 && c !== '__rowIndex'; });
      var extraInNew = newCols.filter(function (c) { return existingCols.indexOf(c) < 0; });

      if (missingInNew.length === 0 && extraInNew.length === 0) {
        // Perfect match — just append
        close();
        _appendRows(ds, newRows);
      } else {
        // Show column mapping UI
        body.innerHTML = '';
        _showColumnMapper(body, close, ds, newRows, existingCols, newCols);
      }
    });
    btnRow.appendChild(appendBtn);

    body.appendChild(btnRow);

    // Cancel
    var cancelBtn = document.createElement('button');
    cancelBtn.style.cssText = 'width:100%;padding:8px;background:transparent;color:var(--sl-text-muted);border:1px solid var(--sl-panel-border);border-radius:8px;font-size:12px;cursor:pointer;font-family:var(--sl-font);';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', close);
    body.appendChild(cancelBtn);
  });
}

function _showColumnMapper(body, close, ds, newRows, existingCols, newCols) {
  var title = document.createElement('p');
  title.style.cssText = 'font-size:13px;color:var(--sl-text-secondary);margin:0 0 12px;';
  title.textContent = 'Columns don\'t match. Map new columns to existing ones:';
  body.appendChild(title);

  var table = document.createElement('div');
  table.style.cssText = 'max-height:300px;overflow-y:auto;margin-bottom:16px;';

  var mappings = {}; // newCol → existingCol or null

  existingCols.filter(function (c) { return c !== '__rowIndex'; }).forEach(function (existCol) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--sl-panel-border);';

    var label = document.createElement('span');
    label.style.cssText = 'flex:1;font-size:12px;font-weight:600;color:var(--sl-text-primary);';
    label.textContent = existCol;
    row.appendChild(label);

    var arrow = document.createElement('span');
    arrow.style.cssText = 'color:var(--sl-text-muted);font-size:11px;';
    arrow.textContent = '\u2190';
    row.appendChild(arrow);

    var select = document.createElement('select');
    select.style.cssText = 'flex:1;background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:6px;color:var(--sl-text-primary);padding:4px 6px;font-size:11px;font-family:var(--sl-font);';

    // Skip option
    var skipOpt = document.createElement('option');
    skipOpt.value = '';
    skipOpt.textContent = '(leave empty)';
    select.appendChild(skipOpt);

    // Auto-match by name
    newCols.forEach(function (nc) {
      var opt = document.createElement('option');
      opt.value = nc;
      opt.textContent = nc;
      if (nc === existCol || nc.toLowerCase() === existCol.toLowerCase()) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', function () {
      mappings[existCol] = select.value || null;
    });
    // Set initial mapping
    var autoMatch = newCols.find(function (nc) { return nc === existCol || nc.toLowerCase() === existCol.toLowerCase(); });
    mappings[existCol] = autoMatch || null;

    row.appendChild(select);
    table.appendChild(row);
  });

  body.appendChild(table);

  // Apply button
  var applyBtn = document.createElement('button');
  applyBtn.style.cssText = 'width:100%;padding:10px;background:var(--sl-accent);color:#fff;border:none;border-radius:8px;font-size:13px;cursor:pointer;font-family:var(--sl-font);margin-bottom:8px;';
  applyBtn.textContent = 'Append with mapping';
  applyBtn.addEventListener('click', function () {
    close();
    // Map new rows to existing columns
    var mappedRows = newRows.map(function (r) {
      var mapped = {};
      for (var existCol in mappings) {
        var srcCol = mappings[existCol];
        mapped[existCol] = srcCol ? r[srcCol] : null;
      }
      return mapped;
    });
    _appendRows(ds, mappedRows);
  });
  body.appendChild(applyBtn);

  var cancelBtn = document.createElement('button');
  cancelBtn.style.cssText = 'width:100%;padding:8px;background:transparent;color:var(--sl-text-muted);border:1px solid var(--sl-panel-border);border-radius:8px;font-size:12px;cursor:pointer;font-family:var(--sl-font);';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', close);
  body.appendChild(cancelBtn);
}

function _appendRows(ds, newRows) {
  var startIdx = ds._rows.length;
  newRows.forEach(function (r, i) {
    r.__rowIndex = startIdx + i;
    ds._rows.push(r);
  });
  ds._detectColumns();
  ds._applyCalculatedColumns();
  ds._emitEvent('data-loaded', { rowCount: ds._rows.length });
}
