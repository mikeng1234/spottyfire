// ─── FilterEngine ───────────────────────────────────────────
class FilterEngine {
  constructor(dataStore) {
    this._ds = dataStore;
    this._filters = {};
  }

  setFilter(colName, spec) {
    var prevSpec = this._filters[colName]
      ? JSON.parse(JSON.stringify(this._filters[colName]))
      : undefined;
    var newSpec = JSON.parse(JSON.stringify(spec));
    var col = colName;

    this._filters[colName] = spec;
    this._ds._emitEvent('filter-changed', { column: colName, filter: spec });

    var self = this;
    UndoManager.push({
      type: 'filter',
      label: 'Filter ' + col,
      undo: function () {
        if (prevSpec === undefined) { delete self._filters[col]; }
        else { self._filters[col] = JSON.parse(JSON.stringify(prevSpec)); }
        self._ds._emitEvent('filter-changed', { column: col, filter: prevSpec || null });
      },
      redo: function () {
        self._filters[col] = JSON.parse(JSON.stringify(newSpec));
        self._ds._emitEvent('filter-changed', { column: col, filter: newSpec });
      },
    });
  }

  clearFilter(colName) {
    var prevSpec = this._filters[colName]
      ? JSON.parse(JSON.stringify(this._filters[colName]))
      : undefined;
    if (prevSpec === undefined) return; // nothing to clear

    delete this._filters[colName];
    this._ds._emitEvent('filter-changed', { column: colName, filter: null });

    var self = this;
    var col = colName;
    UndoManager.push({
      type: 'filter',
      label: 'Clear filter on ' + col,
      undo: function () {
        self._filters[col] = JSON.parse(JSON.stringify(prevSpec));
        self._ds._emitEvent('filter-changed', { column: col, filter: prevSpec });
      },
      redo: function () {
        delete self._filters[col];
        self._ds._emitEvent('filter-changed', { column: col, filter: null });
      },
    });
  }

  clearAll() {
    var prevFilters = JSON.parse(JSON.stringify(this._filters));
    if (Object.keys(prevFilters).length === 0) return; // nothing to clear

    this._filters = {};
    this._ds._emitEvent('filter-changed', { column: null, filter: null });

    var self = this;
    UndoManager.push({
      type: 'filter',
      label: 'Clear all filters',
      undo: function () {
        self._filters = JSON.parse(JSON.stringify(prevFilters));
        self._ds._emitEvent('filter-changed', { column: null, filter: null });
      },
      redo: function () {
        self._filters = {};
        self._ds._emitEvent('filter-changed', { column: null, filter: null });
      },
    });
  }

  getActive() { return Object.assign({}, this._filters); }

  applyFilters(rows) {
    var filters = this._filters;
    var keys = Object.keys(filters);
    if (keys.length === 0) return rows;
    return rows.filter(function (row) {
      return keys.every(function (col) {
        var f = filters[col];
        var val = row[col];
        if (f.type === 'values') {
          // Use loose string comparison to handle numeric/string mismatch
          var sVal = String(val);
          return f.selected.some(function (s) { return String(s) === sVal; });
        } else if (f.type === 'range') {
          var n = parseFloat(val);
          if (isNaN(n)) return false;
          return n >= f.min && n <= f.max;
        }
        return true;
      });
    });
  }
}
