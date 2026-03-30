// ─── UndoManager ────────────────────────────────────────────
var UndoManager = (function () {
  var MAX_DEPTH = 50;
  var _undoStack = [];
  var _redoStack = [];
  var _listeners = [];
  var _suppressPush = false;
  var _batch = null;

  function _emit() {
    _listeners.forEach(function (fn) { fn(); });
  }

  function push(cmd) {
    if (_suppressPush) return;
    if (_batch) {
      // Batching: keep first undo, overwrite redo with latest
      if (!_batch.firstUndo) {
        _batch.firstUndo = cmd.undo;
        _batch.label = cmd.label;
        _batch.type = cmd.type;
      }
      _batch.lastRedo = cmd.redo;
      return;
    }
    _undoStack.push(cmd);
    if (_undoStack.length > MAX_DEPTH) _undoStack.shift();
    _redoStack = [];
    _emit();
  }

  function undo() {
    if (_undoStack.length === 0) return;
    var cmd = _undoStack.pop();
    _suppressPush = true;
    try { cmd.undo(); } finally { _suppressPush = false; }
    _redoStack.push(cmd);
    _emit();
  }

  function redo() {
    if (_redoStack.length === 0) return;
    var cmd = _redoStack.pop();
    _suppressPush = true;
    try { cmd.redo(); } finally { _suppressPush = false; }
    _undoStack.push(cmd);
    _emit();
  }

  function beginBatch() {
    _batch = { firstUndo: null, lastRedo: null, label: '', type: '' };
  }

  function endBatch() {
    if (!_batch) return;
    if (_batch.firstUndo && _batch.lastRedo) {
      _undoStack.push({
        type: _batch.type,
        label: _batch.label,
        undo: _batch.firstUndo,
        redo: _batch.lastRedo,
      });
      if (_undoStack.length > MAX_DEPTH) _undoStack.shift();
      _redoStack = [];
      _emit();
    }
    _batch = null;
  }

  function canUndo() { return _undoStack.length > 0; }
  function canRedo() { return _redoStack.length > 0; }
  function clear() { _undoStack = []; _redoStack = []; _emit(); }

  function on(event, cb) { if (event === 'changed') _listeners.push(cb); }
  function off(event, cb) {
    if (event === 'changed') {
      var i = _listeners.indexOf(cb);
      if (i >= 0) _listeners.splice(i, 1);
    }
  }

  // Keyboard shortcuts
  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
        else if (e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
        else if (e.key === 'y') { e.preventDefault(); redo(); }
      }
    });
  }

  return {
    push: push, undo: undo, redo: redo,
    canUndo: canUndo, canRedo: canRedo, clear: clear,
    beginBatch: beginBatch, endBatch: endBatch,
    on: on, off: off,
  };
})();
