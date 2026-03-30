// ─── DataTable ──────────────────────────────────────────────
class DataTable extends BaseChart {
  constructor(selector, dataStore, config) {
    super(selector, dataStore, Object.assign({ pageSize: 50, sortable: true, striped: true }, config));
    this._page = 0;
    this._sortCol = null;
    this._sortAsc = true;
    this.refresh();
  }

  refresh() {
    var cfg = this._config;
    var theme = ThemeManager.getTheme();
    var mm = this._mm;
    var hasMarking = mm.hasMarking();
    var rows;

    if (cfg.showOnlyMarked && hasMarking) {
      rows = this._ds.getRows({ filtered: true, markedOnly: true });
    } else {
      rows = this._getLimitedRows();
    }

    var cols = cfg.columns || this._ds.getColumnNames();
    cols = cols.filter(function (c) { return c !== '__rowIndex'; });

    // Sort
    if (this._sortCol) {
      var sc = this._sortCol;
      var asc = this._sortAsc;
      rows = rows.slice().sort(function (a, b) {
        var va = a[sc], vb = b[sc];
        if (va == null) return 1;
        if (vb == null) return -1;
        if (typeof va === 'number' && typeof vb === 'number') return asc ? va - vb : vb - va;
        var sa = String(va).toLowerCase(), sb = String(vb).toLowerCase();
        if (sa < sb) return asc ? -1 : 1;
        if (sa > sb) return asc ? 1 : -1;
        return 0;
      });
    }

    var pageSize = cfg.pageSize || 50;
    var totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    if (this._page >= totalPages) this._page = totalPages - 1;
    if (this._page < 0) this._page = 0;
    var start = this._page * pageSize;
    var pageRows = rows.slice(start, start + pageSize);

    var div = this._getPlotDiv();
    div.innerHTML = '';
    div.style.padding = '0';

    // Build table
    var wrap = document.createElement('div');
    wrap.className = 'sl-table-wrap';

    var table = document.createElement('table');
    table.className = 'sl-table';

    // Header
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    var self = this;
    cols.forEach(function (c) {
      var th = document.createElement('th');
      th.textContent = c;
      if (self._sortCol === c) {
        th.classList.add('sl-sorted');
        var arrow = document.createElement('span');
        arrow.className = 'sl-sort';
        arrow.textContent = self._sortAsc ? ' \u25B2' : ' \u25BC';
        th.appendChild(arrow);
      } else if (cfg.sortable) {
        var arrow2 = document.createElement('span');
        arrow2.className = 'sl-sort';
        arrow2.textContent = ' \u25B2';
        th.appendChild(arrow2);
      }
      if (cfg.sortable) {
        th.addEventListener('click', function () {
          if (self._sortCol === c) {
            self._sortAsc = !self._sortAsc;
          } else {
            self._sortCol = c;
            self._sortAsc = true;
          }
          self.refresh();
        });
      }
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    // Body
    var tbody = document.createElement('tbody');
    pageRows.forEach(function (r, ri) {
      var row = document.createElement('tr');
      if (cfg.striped && ri % 2 === 1) row.classList.add('sl-striped');
      if (hasMarking && mm.isMarked(r.__rowIndex)) row.classList.add('sl-row-marked');

      var ds = self._ds;
      cols.forEach(function (c) {
        var td = document.createElement('td');
        var v = r[c];
        if (v == null) td.textContent = '';
        else if (typeof v === 'boolean') td.textContent = v ? 'Yes' : 'No';
        else td.textContent = ds.formatValue(v, c);
        row.appendChild(td);
      });

      // Store row index on the element for drag selection
      row._rowIndex = r.__rowIndex;

      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);

    // Drag-to-select rows
    var _dragging = false;
    var _dragIndices = [];
    var _startIdx = null;
    var _dragMode = 'replace'; // 'replace' or 'add'

    tbody.addEventListener('mousedown', function (e) {
      var row = e.target.closest('tr');
      if (!row || row._rowIndex == null) return;
      e.preventDefault();
      _dragging = true;
      self._isDragging = true;
      _startIdx = row._rowIndex;
      _dragIndices = [row._rowIndex];

      if (e.ctrlKey || e.metaKey) {
        // Ctrl+click: add this row to existing marking, then drag extends from here
        mm.addToMarking([row._rowIndex], self._id);
        _dragMode = 'add';
      } else if (e.shiftKey) {
        mm.addToMarking([row._rowIndex], self._id);
        _dragMode = 'add';
      } else {
        mm.setMarking([row._rowIndex], self._id);
        _dragMode = 'replace';
      }
    });

    tbody.addEventListener('mouseover', function (e) {
      if (!_dragging) return;
      var row = e.target.closest('tr');
      if (!row || row._rowIndex == null) return;

      // Collect indices of all visible rows between start and current
      var allRows = Array.from(tbody.querySelectorAll('tr'));
      var startPos = -1, endPos = -1;
      allRows.forEach(function (r, i) {
        if (r._rowIndex === _startIdx) startPos = i;
        if (r._rowIndex === row._rowIndex) endPos = i;
      });

      if (startPos < 0 || endPos < 0) return;
      var from = Math.min(startPos, endPos);
      var to = Math.max(startPos, endPos);

      _dragIndices = [];
      for (var i = from; i <= to; i++) {
        if (allRows[i] && allRows[i]._rowIndex != null) {
          _dragIndices.push(allRows[i]._rowIndex);
        }
      }

      if (_dragMode === 'add') {
        mm.addToMarking(_dragIndices, self._id);
      } else {
        mm.setMarking(_dragIndices, self._id);
      }
    });

    // Store handler to remove on next refresh
    if (self._mouseupHandler) document.removeEventListener('mouseup', self._mouseupHandler);
    self._mouseupHandler = function () {
      if (_dragging) {
        _dragging = false;
        self._isDragging = false;
        self.refresh();
      }
    };
    document.addEventListener('mouseup', self._mouseupHandler);
    div.appendChild(wrap);

    // Pager — always show
    var pager = document.createElement('div');
    pager.className = 'sl-table-pager';

    var info = document.createElement('span');
    info.textContent = 'Showing ' + (start + 1) + '-' + Math.min(start + pageSize, rows.length) + ' of ' + rows.length;
    pager.appendChild(info);

    // Nav buttons
    var btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:4px;';

    var prev = document.createElement('button');
    prev.textContent = '\u25C0 Prev';
    prev.disabled = this._page === 0;
    prev.addEventListener('click', function () { self._page--; self.refresh(); });

    var next = document.createElement('button');
    next.textContent = 'Next \u25B6';
    next.disabled = this._page >= totalPages - 1;
    next.addEventListener('click', function () { self._page++; self.refresh(); });

    btns.appendChild(prev);
    btns.appendChild(next);
    pager.appendChild(btns);
    div.appendChild(pager);
  }

  _onMarkingChanged() {
    // Don't full-refresh during drag selection (would destroy DOM)
    if (this._isDragging) {
      // Just update row highlights without rebuilding
      var mm = this._mm;
      var rows = this._getPlotDiv().querySelectorAll('tbody tr');
      rows.forEach(function (row) {
        if (row._rowIndex != null) {
          row.classList.toggle('sl-row-marked', mm.isMarked(row._rowIndex));
        }
      });
      return;
    }
    this.refresh();
  }
}
