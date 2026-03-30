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

      // Click to mark
      row.addEventListener('click', function (e) {
        var idx = r.__rowIndex;
        if (e.shiftKey) mm.addToMarking([idx], self._id);
        else if (e.ctrlKey) mm.toggleMarking([idx], self._id);
        else mm.setMarking([idx], self._id);
      });

      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    div.appendChild(wrap);

    // Pager
    if (totalPages > 1) {
      var pager = document.createElement('div');
      pager.className = 'sl-table-pager';

      var info = document.createElement('span');
      info.textContent = 'Showing ' + (start + 1) + '-' + Math.min(start + pageSize, rows.length) + ' of ' + rows.length;
      pager.appendChild(info);

      var btns = document.createElement('div');
      btns.style.display = 'flex';
      btns.style.gap = '4px';

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
  }

  _onMarkingChanged() { this.refresh(); }
}
