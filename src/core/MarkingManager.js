// ─── MarkingManager ─────────────────────────────────────────
class MarkingManager {
  constructor() {
    this._marked = new Set();
    this._listeners = [];
  }

  setMarking(rowIndices, source) {
    var prevMarked = new Set(this._marked);
    this._marked = new Set(rowIndices);
    this._emit({ markedIndices: this._marked, source: source, action: 'set' });

    var self = this;
    var newMarked = new Set(this._marked);
    UndoManager.push({
      type: 'marking',
      label: 'Select ' + newMarked.size + ' rows',
      undo: function () {
        self._marked = prevMarked;
        self._emit({ markedIndices: self._marked, source: 'undo', action: 'set' });
      },
      redo: function () {
        self._marked = newMarked;
        self._emit({ markedIndices: self._marked, source: 'redo', action: 'set' });
      },
    });
  }

  addToMarking(rowIndices, source) {
    var prevMarked = new Set(this._marked);
    rowIndices.forEach(i => this._marked.add(i));
    this._emit({ markedIndices: this._marked, source: source, action: 'add' });

    var self = this;
    var newMarked = new Set(this._marked);
    UndoManager.push({
      type: 'marking',
      label: 'Add to selection (' + newMarked.size + ' rows)',
      undo: function () {
        self._marked = prevMarked;
        self._emit({ markedIndices: self._marked, source: 'undo', action: 'set' });
      },
      redo: function () {
        self._marked = newMarked;
        self._emit({ markedIndices: self._marked, source: 'redo', action: 'set' });
      },
    });
  }

  toggleMarking(rowIndices, source) {
    var prevMarked = new Set(this._marked);
    rowIndices.forEach(i => {
      if (this._marked.has(i)) this._marked.delete(i);
      else this._marked.add(i);
    });
    var action = this._marked.size === 0 ? 'clear' : 'toggle';
    this._emit({ markedIndices: this._marked, source: source, action: action });

    var self = this;
    var newMarked = new Set(this._marked);
    UndoManager.push({
      type: 'marking',
      label: 'Toggle selection',
      undo: function () {
        self._marked = prevMarked;
        self._emit({ markedIndices: self._marked, source: 'undo', action: 'set' });
      },
      redo: function () {
        self._marked = newMarked;
        self._emit({ markedIndices: self._marked, source: 'redo', action: 'set' });
      },
    });
  }

  clearMarking(source) {
    var prevMarked = new Set(this._marked);
    if (prevMarked.size === 0) return; // nothing to clear, skip undo entry
    this._marked = new Set();
    this._emit({ markedIndices: this._marked, source: source || null, action: 'clear' });

    var self = this;
    UndoManager.push({
      type: 'marking',
      label: 'Clear selection',
      undo: function () {
        self._marked = prevMarked;
        self._emit({ markedIndices: self._marked, source: 'undo', action: 'set' });
      },
      redo: function () {
        self._marked = new Set();
        self._emit({ markedIndices: self._marked, source: 'redo', action: 'clear' });
      },
    });
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
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => {
      this._listeners.forEach(fn => fn(detail));
    });
  }
}
