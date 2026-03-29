// ─── FilterEngine ───────────────────────────────────────────
class FilterEngine {
  constructor(dataStore) {
    this._ds = dataStore;
    this._filters = {};  // colName → { type:'values', selected:[...] } or { type:'range', min, max }
  }

  setFilter(colName, spec) {
    this._filters[colName] = spec;
    this._ds._emitEvent('filter-changed', { column: colName, filter: spec });
  }

  clearFilter(colName) {
    delete this._filters[colName];
    this._ds._emitEvent('filter-changed', { column: colName, filter: null });
  }

  clearAll() {
    this._filters = {};
    this._ds._emitEvent('filter-changed', { column: null, filter: null });
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
          return f.selected.indexOf(val) >= 0;
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
