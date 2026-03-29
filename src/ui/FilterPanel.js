// ─── FilterPanel ────────────────────────────────────────────
class FilterPanel {
  constructor(selector, dataStore, config) {
    this._ds = dataStore;
    this._config = config || {};
    this._container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._container) throw new Error('FilterPanel: container not found');

    var self = this;
    this._onFilter = function () { self.render(); };
    this._ds.on('filter-changed', this._onFilter);
    this._ds.on('data-loaded', function () { self.render(); });
    this.render();
  }

  render() {
    var ds = this._ds;
    var cols = this._config.columns || ds.getColumnNames().filter(function (c) { return c !== '__rowIndex'; });
    var container = this._container;
    container.innerHTML = '';
    container.className = (container.className.indexOf('sl-filter-panel') < 0 ? container.className + ' ' : '') + 'sl-filter-panel';

    var title = document.createElement('div');
    title.style.cssText = 'font-size:16px;font-weight:700;margin-bottom:16px;color:var(--sl-text-primary);';
    title.textContent = 'Filters';
    container.appendChild(title);

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

        var rangeInfo = document.createElement('div');
        rangeInfo.style.cssText = 'font-size:11px;color:var(--sl-text-muted);margin-bottom:4px;';
        rangeInfo.textContent = curMin.toLocaleString() + ' — ' + curMax.toLocaleString();
        section.appendChild(rangeInfo);

        var minSlider = document.createElement('input');
        minSlider.type = 'range';
        minSlider.className = 'sl-filter-range';
        minSlider.min = stats.min;
        minSlider.max = stats.max;
        minSlider.step = (stats.max - stats.min) / 100;
        minSlider.value = curMin;
        minSlider.addEventListener('input', function () {
          ds.setFilter(colName, { type: 'range', min: +minSlider.value, max: +maxSlider.value });
        });
        section.appendChild(minSlider);

        var maxSlider = document.createElement('input');
        maxSlider.type = 'range';
        maxSlider.className = 'sl-filter-range';
        maxSlider.min = stats.min;
        maxSlider.max = stats.max;
        maxSlider.step = (stats.max - stats.min) / 100;
        maxSlider.value = curMax;
        maxSlider.addEventListener('input', function () {
          ds.setFilter(colName, { type: 'range', min: +minSlider.value, max: +maxSlider.value });
        });
        section.appendChild(maxSlider);
      } else {
        // Checkbox list
        var values = ds.getColumnValues(colName);
        var active = activeFilters[colName];
        var selected = active ? active.selected : values;

        // Select all / none
        var allBtn = document.createElement('div');
        allBtn.style.cssText = 'font-size:11px;color:var(--sl-accent);cursor:pointer;margin-bottom:4px;';
        allBtn.textContent = selected.length === values.length ? 'Select None' : 'Select All';
        allBtn.addEventListener('click', function () {
          if (selected.length === values.length) {
            ds.setFilter(colName, { type: 'values', selected: [] });
          } else {
            ds.clearFilter(colName);
          }
        });
        section.appendChild(allBtn);

        values.slice(0, 20).forEach(function (v) {
          var lbl = document.createElement('label');
          lbl.className = 'sl-filter-check';
          var cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.checked = selected.indexOf(v) >= 0;
          cb.addEventListener('change', function () {
            var cur = activeFilters[colName] ? activeFilters[colName].selected : values.slice();
            if (cb.checked) {
              if (cur.indexOf(v) < 0) cur.push(v);
            } else {
              cur = cur.filter(function (x) { return x !== v; });
            }
            if (cur.length === values.length) ds.clearFilter(colName);
            else ds.setFilter(colName, { type: 'values', selected: cur });
          });
          lbl.appendChild(cb);
          lbl.appendChild(document.createTextNode(v));
          section.appendChild(lbl);
        });

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
    var clearAll = document.createElement('button');
    clearAll.style.cssText = 'width:100%;margin-top:12px;padding:8px;background:transparent;border:1px solid var(--sl-panel-border);border-radius:8px;color:var(--sl-text-secondary);cursor:pointer;font-size:12px;font-family:var(--sl-font);';
    clearAll.textContent = 'Clear All Filters';
    clearAll.addEventListener('click', function () { ds.clearAllFilters(); });
    container.appendChild(clearAll);
  }

  destroy() {
    this._ds.off('filter-changed', this._onFilter);
  }
}
