// ─── FilterPanel ────────────────────────────────────────────
class FilterPanel {
  constructor(selector, dataStore, config) {
    this._ds = dataStore;
    this._config = config || {};
    this._container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._container) throw new Error('FilterPanel: container not found');

    var self = this;
    // Re-render on data load — auto-fix columns if they don't match new data
    this._ds.on('data-loaded', function () {
      self._autoFixColumns();
      self.render();
    });
    this.render();
  }

  _autoFixColumns() {
    if (!this._config.columns) return; // using all columns anyway
    var available = this._ds.getColumnNames();
    var valid = this._config.columns.filter(function (c) { return available.indexOf(c) >= 0; });
    if (valid.length === 0) {
      // All old columns gone — use all new columns
      this._config.columns = null; // null = auto-detect all
    } else if (valid.length < this._config.columns.length) {
      this._config.columns = valid;
    }
  }

  render() {
    var ds = this._ds;
    var cols = this._config.columns || ds.getColumnNames().filter(function (c) { return c !== '__rowIndex'; });
    var container = this._container;
    container.innerHTML = '';

    // Detect date columns by sampling values (matches YYYY-MM-DD pattern)
    function _isDateColumn(colName, ds) {
      var vals = ds.getColumnValues(colName);
      if (vals.length === 0) return false;
      var datePattern = /^\d{4}-\d{2}-\d{2}/;
      var matches = 0;
      for (var i = 0; i < Math.min(vals.length, 5); i++) {
        if (datePattern.test(String(vals[i]))) matches++;
      }
      return matches >= Math.min(vals.length, 3);
    }
    container.className = (container.className.indexOf('sl-filter-panel') < 0 ? container.className + ' ' : '') + 'sl-filter-panel';

    var activeFilters = ds.getActiveFilters();

    cols.forEach(function (colName) {
      var colInfo = ds.getColumns().find(function (c) { return c.name === colName; });
      var section = document.createElement('div');
      section.className = 'sl-filter-section';

      var label = document.createElement('label');
      label.textContent = colName;
      section.appendChild(label);

      if (colInfo && colInfo.type === 'number') {
        // Range slider
        var stats = ds.getStats(colName);
        var active = activeFilters[colName];
        var curMin = active ? active.min : stats.min;
        var curMax = active ? active.max : stats.max;

        // Editable min/max inputs
        var rangeRow = document.createElement('div');
        rangeRow.style.cssText = 'display:flex;align-items:center;gap:4px;margin-bottom:6px;';

        var minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.className = 'sl-filter-num';
        minInput.min = stats.min;
        minInput.max = stats.max;
        minInput.step = 'any';
        minInput.value = curMin;

        var dash = document.createElement('span');
        dash.style.cssText = 'color:var(--sl-text-muted);font-size:11px;';
        dash.textContent = '—';

        var maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.className = 'sl-filter-num';
        maxInput.min = stats.min;
        maxInput.max = stats.max;
        maxInput.step = 'any';
        maxInput.value = curMax;

        rangeRow.appendChild(minInput);
        rangeRow.appendChild(dash);
        rangeRow.appendChild(maxInput);
        section.appendChild(rangeRow);

        // Dual-handle range slider
        var totalRange = stats.max - stats.min;
        var loPercent = totalRange ? ((curMin - stats.min) / totalRange) * 100 : 0;
        var hiPercent = totalRange ? ((curMax - stats.min) / totalRange) * 100 : 100;

        var track = document.createElement('div');
        track.className = 'sl-dualrange';
        track.setAttribute('aria-hidden', 'true');

        var fill = document.createElement('div');
        fill.className = 'sl-dualrange-fill';
        fill.style.left = loPercent + '%';
        fill.style.right = (100 - hiPercent) + '%';
        track.appendChild(fill);

        var thumbLo = document.createElement('div');
        thumbLo.className = 'sl-dualrange-thumb';
        thumbLo.style.left = loPercent + '%';
        track.appendChild(thumbLo);

        var thumbHi = document.createElement('div');
        thumbHi.className = 'sl-dualrange-thumb';
        thumbHi.style.left = hiPercent + '%';
        track.appendChild(thumbHi);

        function applyRange(lo, hi) {
          if (lo > hi) { var tmp = lo; lo = hi; hi = tmp; }
          ds.setFilter(colName, { type: 'range', min: lo, max: hi });
        }

        function updateVisuals(lo, hi) {
          var loPct = totalRange ? ((lo - stats.min) / totalRange) * 100 : 0;
          var hiPct = totalRange ? ((hi - stats.min) / totalRange) * 100 : 100;
          thumbLo.style.left = loPct + '%';
          thumbHi.style.left = hiPct + '%';
          fill.style.left = loPct + '%';
          fill.style.right = (100 - hiPct) + '%';
        }

        // Drag logic
        function makeDraggable(thumb, isLo) {
          var dragging = false;
          function onDown(e) {
            e.preventDefault();
            dragging = true;
            UndoManager.beginBatch();
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onUp);
          }
          function onMove(e) {
            if (!dragging) return;
            e.preventDefault();
            var rect = track.getBoundingClientRect();
            var clientX = e.touches ? e.touches[0].clientX : e.clientX;
            var pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            var val = stats.min + (pct / 100) * totalRange;
            val = Math.round(val * 10) / 10; // round to 1 decimal
            if (isLo) {
              var hi = +maxInput.value;
              if (val > hi) val = hi;
              minInput.value = val;
              updateVisuals(val, hi);
              applyRange(val, hi);
            } else {
              var lo = +minInput.value;
              if (val < lo) val = lo;
              maxInput.value = val;
              updateVisuals(lo, val);
              applyRange(lo, val);
            }
          }
          function onUp() {
            dragging = false;
            UndoManager.endBatch();
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onUp);
          }
          thumb.addEventListener('mousedown', onDown);
          thumb.addEventListener('touchstart', onDown, { passive: false });
        }

        makeDraggable(thumbLo, true);
        makeDraggable(thumbHi, false);

        // Click on track to move nearest thumb
        track.addEventListener('mousedown', function (e) {
          if (e.target.classList.contains('sl-dualrange-thumb')) return;
          var rect = track.getBoundingClientRect();
          var pct = ((e.clientX - rect.left) / rect.width) * 100;
          var val = stats.min + (pct / 100) * totalRange;
          var lo = +minInput.value, hi = +maxInput.value;
          // Move whichever thumb is closer
          if (Math.abs(val - lo) <= Math.abs(val - hi)) {
            minInput.value = Math.round(val * 10) / 10;
            updateVisuals(+minInput.value, hi);
            applyRange(+minInput.value, hi);
          } else {
            maxInput.value = Math.round(val * 10) / 10;
            updateVisuals(lo, +maxInput.value);
            applyRange(lo, +maxInput.value);
          }
        });

        // Input fields → sync slider + apply
        minInput.addEventListener('change', function () {
          var v = +minInput.value;
          if (isNaN(v)) return;
          updateVisuals(v, +maxInput.value);
          applyRange(v, +maxInput.value);
        });
        maxInput.addEventListener('change', function () {
          var v = +maxInput.value;
          if (isNaN(v)) return;
          updateVisuals(+minInput.value, v);
          applyRange(+minInput.value, v);
        });

        section.appendChild(track);
      } else if (_isDateColumn(colName, ds)) {
        // Date range picker
        var dateVals = ds.getColumnValues(colName).sort();
        var active = activeFilters[colName];
        var minDate = active ? active.min : (dateVals[0] || '');
        var maxDate = active ? active.max : (dateVals[dateVals.length - 1] || '');

        var dateRow = document.createElement('div');
        dateRow.style.cssText = 'display:flex;align-items:center;gap:4px;';

        var fromInput = document.createElement('input');
        fromInput.type = 'date';
        fromInput.className = 'sl-filter-num';
        fromInput.value = minDate;

        var dateDash = document.createElement('span');
        dateDash.style.cssText = 'color:var(--sl-text-muted);font-size:11px;';
        dateDash.textContent = '\u2014';

        var toInput = document.createElement('input');
        toInput.type = 'date';
        toInput.className = 'sl-filter-num';
        toInput.value = maxDate;

        function onDateChange() {
          var from = fromInput.value;
          var to = toInput.value;
          if (from && to) {
            // Filter rows where date string is between from and to
            var allVals = ds.getColumnValues(colName);
            var selected = allVals.filter(function (v) { return v >= from && v <= to; });
            if (selected.length === allVals.length) ds.clearFilter(colName);
            else ds.setFilter(colName, { type: 'values', selected: selected });
          }
        }

        fromInput.addEventListener('change', onDateChange);
        toInput.addEventListener('change', onDateChange);

        dateRow.appendChild(fromInput);
        dateRow.appendChild(dateDash);
        dateRow.appendChild(toInput);
        section.appendChild(dateRow);
      } else {
        // Checkbox list
        var values = ds.getColumnValues(colName);
        var active = activeFilters[colName];
        var selected = active ? active.selected.slice() : values.slice();

        // Select all / none
        var allBtn = document.createElement('button');
        allBtn.style.cssText = 'font-size:11px;color:var(--sl-accent);cursor:pointer;margin-bottom:4px;background:none;border:none;padding:0;font-family:inherit;';
        allBtn.textContent = selected.length === values.length ? 'Select None' : 'Select All';

        // Build checkboxes first so allBtn can reference them
        var checkboxes = [];
        var checkContainer = document.createElement('div');

        values.slice(0, 20).forEach(function (v) {
          var lbl = document.createElement('label');
          lbl.className = 'sl-filter-check';
          var cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.checked = selected.indexOf(v) >= 0;
          checkboxes.push({ checkbox: cb, value: v });

          cb.addEventListener('change', function () {
            // Read current state from all checkboxes
            var cur = [];
            checkboxes.forEach(function (entry) {
              if (entry.checkbox.checked) cur.push(entry.value);
            });
            if (cur.length === values.length) {
              ds.clearFilter(colName);
              allBtn.textContent = 'Select None';
            } else {
              ds.setFilter(colName, { type: 'values', selected: cur });
              allBtn.textContent = 'Select All';
            }
          });

          lbl.appendChild(cb);
          lbl.appendChild(document.createTextNode(v));
          checkContainer.appendChild(lbl);
        });

        allBtn.addEventListener('click', function () {
          var allChecked = checkboxes.every(function (e) { return e.checkbox.checked; });
          if (allChecked) {
            // Uncheck all
            checkboxes.forEach(function (e) { e.checkbox.checked = false; });
            ds.setFilter(colName, { type: 'values', selected: [] });
            allBtn.textContent = 'Select All';
          } else {
            // Check all
            checkboxes.forEach(function (e) { e.checkbox.checked = true; });
            ds.clearFilter(colName);
            allBtn.textContent = 'Select None';
          }
        });

        section.appendChild(allBtn);
        section.appendChild(checkContainer);

        if (values.length > 20) {
          var more = document.createElement('div');
          more.style.cssText = 'font-size:11px;color:var(--sl-text-muted);margin-top:4px;';
          more.textContent = '+ ' + (values.length - 20) + ' more...';
          section.appendChild(more);
        }
      }

      container.appendChild(section);
    });

    // Clear all button
    var self = this;
    var clearAll = document.createElement('button');
    clearAll.style.cssText = 'width:100%;margin-top:12px;padding:8px;background:transparent;border:1px solid var(--sl-panel-border);border-radius:8px;color:var(--sl-text-secondary);cursor:pointer;font-size:12px;font-family:var(--sl-font);';
    clearAll.textContent = 'Clear All Filters';
    clearAll.addEventListener('click', function () {
      ds.clearAllFilters();
      self.render(); // full re-render only on explicit clear
    });
    container.appendChild(clearAll);
  }

  destroy() {
    // no-op — removed filter-changed listener
  }
}
