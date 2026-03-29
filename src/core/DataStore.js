// ─── DataStore ──────────────────────────────────────────────
class DataStore {
  constructor() {
    this._rows = [];
    this._columns = [];
    this._calculatedCols = {};  // name → fn
    this._eventListeners = {};
    this._markingManager = new MarkingManager();
    this._filterEngine = new FilterEngine(this);
  }

  // ── Loading ──
  async loadCSV(urlOrString) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var config = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (results) {
          self._rows = results.data;
          self._detectColumns();
          self._applyCalculatedColumns();
          self._emitEvent('data-loaded', { rowCount: self._rows.length });
          resolve(self);
        },
        error: function (err) { reject(err); }
      };
      // If it looks like a URL, download it
      if (urlOrString.indexOf('\n') < 0 && (urlOrString.startsWith('http') || urlOrString.startsWith('/') || urlOrString.endsWith('.csv'))) {
        config.download = true;
        Papa.parse(urlOrString, config);
      } else {
        Papa.parse(urlOrString, config);
      }
    });
  }

  loadJSON(arr) {
    this._rows = arr.map(function (r, i) { return Object.assign({ __rowIndex: i }, r); });
    this._detectColumns();
    this._applyCalculatedColumns();
    this._emitEvent('data-loaded', { rowCount: this._rows.length });
    return this;
  }

  _detectColumns() {
    if (this._rows.length === 0) { this._columns = []; return; }
    var first = this._rows[0];
    this._columns = Object.keys(first).filter(function (k) { return k !== '__rowIndex'; }).map(function (k) {
      return { name: k, type: typeof first[k] === 'number' ? 'number' : (first[k] instanceof Date ? 'date' : 'string') };
    });
    // Assign __rowIndex
    this._rows.forEach(function (r, i) { r.__rowIndex = i; });
  }

  // ── Schema ──
  getColumns() {
    var rows = this._rows;
    return this._columns.map(function (c) {
      var nulls = 0;
      rows.forEach(function (r) { if (r[c.name] == null || r[c.name] === '') nulls++; });
      return { name: c.name, type: c.type, nullCount: nulls };
    });
  }

  getColumnNames() { return this._columns.map(function (c) { return c.name; }); }

  getColumnValues(colName) {
    var set = {};
    this._rows.forEach(function (r) { if (r[colName] != null && r[colName] !== '') set[r[colName]] = true; });
    return Object.keys(set).sort();
  }

  getStats(colName) {
    var vals = [];
    var nulls = 0;
    this._rows.forEach(function (r) {
      var v = parseFloat(r[colName]);
      if (isNaN(v)) nulls++;
      else vals.push(v);
    });
    vals.sort(function (a, b) { return a - b; });
    var sum = vals.reduce(function (a, b) { return a + b; }, 0);
    return {
      min: vals.length ? vals[0] : null,
      max: vals.length ? vals[vals.length - 1] : null,
      mean: vals.length ? sum / vals.length : null,
      median: vals.length ? vals[Math.floor(vals.length / 2)] : null,
      count: this._rows.length,
      nulls: nulls,
    };
  }

  // ── Rows ──
  getRows(opts) {
    var rows = this._rows;
    if (opts && opts.filtered !== false) {
      rows = this._filterEngine.applyFilters(rows);
    }
    if (opts && opts.markedOnly && this._markingManager.hasMarking()) {
      var mm = this._markingManager;
      rows = rows.filter(function (r) { return mm.isMarked(r.__rowIndex); });
    }
    return rows;
  }

  getFilteredRows() { return this._filterEngine.applyFilters(this._rows); }
  getRowCount() { return this._rows.length; }
  getFilteredRowCount() { return this.getFilteredRows().length; }

  // ── Computed Columns ──
  addCalculatedColumn(name, formula) {
    var fn;
    // Check if it's a window function (contains OVER)
    if (formula.toUpperCase().indexOf('OVER') >= 0) {
      fn = FormulaEngine.compileWindow(formula, this._rows);
    } else {
      fn = FormulaEngine.compile(formula);
    }
    this._calculatedCols[name] = fn;
    // Apply to all rows
    this._rows.forEach(function (r) { r[name] = fn(r); });
    // Add to columns list
    if (!this._columns.find(function (c) { return c.name === name; })) {
      var sample = this._rows.length > 0 ? this._rows[0][name] : null;
      this._columns.push({ name: name, type: typeof sample === 'number' ? 'number' : 'string' });
    }
    this._emitEvent('column-added', { name: name });
  }

  removeCalculatedColumn(name) {
    delete this._calculatedCols[name];
    this._rows.forEach(function (r) { delete r[name]; });
    this._columns = this._columns.filter(function (c) { return c.name !== name; });
    this._emitEvent('column-removed', { name: name });
  }

  _applyCalculatedColumns() {
    var calc = this._calculatedCols;
    var names = Object.keys(calc);
    if (names.length === 0) return;
    this._rows.forEach(function (r) {
      names.forEach(function (n) { r[n] = calc[n](r); });
    });
  }

  // ── Filtering (delegate) ──
  setFilter(col, spec) { this._filterEngine.setFilter(col, spec); }
  clearFilter(col) { this._filterEngine.clearFilter(col); }
  clearAllFilters() { this._filterEngine.clearAll(); }
  getActiveFilters() { return this._filterEngine.getActive(); }

  // ── Events ──
  on(event, cb) {
    if (!this._eventListeners[event]) this._eventListeners[event] = [];
    this._eventListeners[event].push(cb);
  }

  off(event, cb) {
    var arr = this._eventListeners[event];
    if (arr) {
      var i = arr.indexOf(cb);
      if (i >= 0) arr.splice(i, 1);
    }
  }

  _emitEvent(event, detail) {
    var arr = this._eventListeners[event];
    if (arr) arr.forEach(function (fn) { fn(detail); });
  }

  // ── Export ──
  exportCSV(opts) {
    var rows = this.getRows(opts);
    var cols = this.getColumnNames();
    var lines = [cols.join(',')];
    rows.forEach(function (r) {
      lines.push(cols.map(function (c) {
        var v = r[c];
        if (v == null) return '';
        var s = String(v);
        if (s.indexOf(',') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0) {
          return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
      }).join(','));
    });
    return lines.join('\n');
  }

  downloadCSV(filename, opts) {
    var csv = this.exportCSV(opts);
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename || 'export.csv';
    a.click();
  }
}
