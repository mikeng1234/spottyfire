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

function _triggerCSVUpload(ds) {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  input.addEventListener('change', function () {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      ds.loadCSV(e.target.result);
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
        if (Array.isArray(arr)) ds.loadJSON(arr);
      } catch (err) { console.error('Invalid JSON:', err); }
    };
    reader.readAsText(file);
  });
  input.click();
}
