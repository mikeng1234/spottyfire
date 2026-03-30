// ─── ColumnPanel ────────────────────────────────────────────
class ColumnPanel {
  constructor(selector, dataStore, config) {
    this._ds = dataStore;
    this._config = config || {};
    this._container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._container) throw new Error('ColumnPanel: container not found');

    var self = this;
    this._ds.on('data-loaded', function () { self.render(); });
    this._ds.on('column-added', function () { self.render(); });
    this._ds.on('column-removed', function () { self.render(); });
    this.render();
  }

  render() {
    var ds = this._ds;
    var cols = ds.getColumns().filter(function (c) { return c.name !== '__rowIndex'; });
    var container = this._container;
    container.innerHTML = '';
    container.className = (container.className.indexOf('sl-column-panel') < 0 ? container.className + ' ' : '') + 'sl-column-panel';

    // Title
    var title = document.createElement('div');
    title.className = 'sl-colpanel-title';
    title.textContent = 'Columns';
    container.appendChild(title);

    // Column list
    cols.forEach(function (col) {
      var section = document.createElement('div');
      section.className = 'sl-colpanel-item';

      // Column name + type badge
      var header = document.createElement('div');
      header.className = 'sl-colpanel-header';

      var nameEl = document.createElement('span');
      nameEl.className = 'sl-colpanel-name';
      nameEl.textContent = col.name;
      header.appendChild(nameEl);

      var badge = document.createElement('span');
      badge.className = 'sl-colpanel-badge';
      badge.textContent = col.type === 'number' ? 'NUM' : col.type === 'date' ? 'DATE' : 'STR';
      badge.style.background = col.type === 'number' ? 'var(--sl-accent)' : col.type === 'date' ? '#f59e0b' : 'var(--sl-text-muted)';
      header.appendChild(badge);

      section.appendChild(header);

      // Format selector — only for numeric columns
      if (col.type === 'number') {
        var curFmt = ds.getColumnFormat(col.name);

        var formatRow = document.createElement('div');
        formatRow.className = 'sl-colpanel-format-row';

        // Format type dropdown
        var fmtSelect = document.createElement('select');
        fmtSelect.className = 'sl-colpanel-select';
        var formats = [
          { value: 'auto', label: 'Auto' },
          { value: 'integer', label: 'Integer' },
          { value: 'decimal', label: 'Decimal' },
          { value: 'currency', label: 'Currency' },
          { value: 'percent', label: 'Percent' },
          { value: 'scientific', label: 'Scientific' },
        ];
        formats.forEach(function (f) {
          var opt = document.createElement('option');
          opt.value = f.value;
          opt.textContent = f.label;
          if (curFmt.type === f.value) opt.selected = true;
          fmtSelect.appendChild(opt);
        });
        formatRow.appendChild(fmtSelect);

        // Currency selector (shown only when currency selected)
        var currencySelect = document.createElement('select');
        currencySelect.className = 'sl-colpanel-select sl-colpanel-currency';
        var currencies = [
          { value: 'USD', label: '$ USD' },
          { value: 'PHP', label: '\u20B1 PHP' },
          { value: 'EUR', label: '\u20AC EUR' },
          { value: 'GBP', label: '\u00A3 GBP' },
          { value: 'JPY', label: '\u00A5 JPY' },
          { value: 'KRW', label: '\u20A9 KRW' },
          { value: 'CNY', label: '\u00A5 CNY' },
          { value: 'INR', label: '\u20B9 INR' },
          { value: 'BRL', label: 'R$ BRL' },
          { value: 'MXN', label: 'MX$ MXN' },
        ];
        currencies.forEach(function (c) {
          var opt = document.createElement('option');
          opt.value = c.value;
          opt.textContent = c.label;
          if (curFmt.currency === c.value) opt.selected = true;
          currencySelect.appendChild(opt);
        });
        currencySelect.style.display = curFmt.type === 'currency' ? '' : 'none';
        formatRow.appendChild(currencySelect);

        // Decimals selector (shown for decimal, currency, percent, scientific)
        var decSelect = document.createElement('select');
        decSelect.className = 'sl-colpanel-select sl-colpanel-dec';
        for (var d = 0; d <= 6; d++) {
          var opt = document.createElement('option');
          opt.value = d;
          opt.textContent = d + ' dec';
          if ((curFmt.decimals != null ? curFmt.decimals : 2) === d) opt.selected = true;
          decSelect.appendChild(opt);
        }
        var showDec = ['decimal', 'currency', 'percent', 'scientific'].indexOf(curFmt.type) >= 0;
        decSelect.style.display = showDec ? '' : 'none';
        formatRow.appendChild(decSelect);

        section.appendChild(formatRow);

        // Preview
        var preview = document.createElement('div');
        preview.className = 'sl-colpanel-preview';
        var sampleVal = null;
        var rows = ds._rows;
        for (var i = 0; i < rows.length && i < 10; i++) {
          if (typeof rows[i][col.name] === 'number') { sampleVal = rows[i][col.name]; break; }
        }
        if (sampleVal !== null) {
          preview.textContent = ds.formatValue(sampleVal, col.name);
        }
        section.appendChild(preview);

        // Change handlers
        function applyFormat() {
          var type = fmtSelect.value;
          var spec = { type: type };
          if (type === 'currency') {
            spec.currency = currencySelect.value;
            spec.decimals = +decSelect.value;
          } else if (['decimal', 'percent', 'scientific'].indexOf(type) >= 0) {
            spec.decimals = +decSelect.value;
          }

          // Show/hide sub-selectors
          currencySelect.style.display = type === 'currency' ? '' : 'none';
          decSelect.style.display = ['decimal', 'currency', 'percent', 'scientific'].indexOf(type) >= 0 ? '' : 'none';

          ds.setColumnFormat(col.name, spec);

          // Update preview
          if (sampleVal !== null) {
            preview.textContent = ds.formatValue(sampleVal, col.name);
          }
        }

        fmtSelect.addEventListener('change', applyFormat);
        currencySelect.addEventListener('change', applyFormat);
        decSelect.addEventListener('change', applyFormat);
      } else {
        // Non-numeric: just show type
        var info = document.createElement('div');
        info.className = 'sl-colpanel-preview';
        info.textContent = col.type === 'date' ? 'Date column' : 'Text column';
        section.appendChild(info);
      }

      container.appendChild(section);
    });
  }

  destroy() {}
}
