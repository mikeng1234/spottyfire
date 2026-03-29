// ─── MarkingManager ─────────────────────────────────────────
class MarkingManager {
  constructor() {
    this._marked = new Set();
    this._listeners = [];
  }

  setMarking(rowIndices, source) {
    this._marked = new Set(rowIndices);
    this._emit({ markedIndices: this._marked, source: source, action: 'set' });
  }

  addToMarking(rowIndices, source) {
    rowIndices.forEach(i => this._marked.add(i));
    this._emit({ markedIndices: this._marked, source: source, action: 'add' });
  }

  toggleMarking(rowIndices, source) {
    rowIndices.forEach(i => {
      if (this._marked.has(i)) this._marked.delete(i);
      else this._marked.add(i);
    });
    if (this._marked.size === 0) {
      this._emit({ markedIndices: this._marked, source: source, action: 'clear' });
    } else {
      this._emit({ markedIndices: this._marked, source: source, action: 'toggle' });
    }
  }

  clearMarking(source) {
    this._marked = new Set();
    this._emit({ markedIndices: this._marked, source: source || null, action: 'clear' });
  }

  getMarkedIndices() { return new Set(this._marked); }
  isMarked(idx) { return this._marked.has(idx); }
  hasMarking() { return this._marked.size > 0; }

  on(event, cb) {
    if (event === 'marking-changed') this._listeners.push(cb);
  }

  off(event, cb) {
    if (event === 'marking-changed') {
      var i = this._listeners.indexOf(cb);
      if (i >= 0) this._listeners.splice(i, 1);
    }
  }

  _emit(detail) {
    // Batch via rAF
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => {
      this._listeners.forEach(fn => fn(detail));
    });
  }
}
