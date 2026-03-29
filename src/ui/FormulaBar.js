// ─── FormulaBar ─────────────────────────────────────────────
class FormulaBar {
  constructor(selector, dataStore, config) {
    this._ds = dataStore;
    this._config = config || {};
    this._container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._container) throw new Error('FormulaBar: container not found');
    this.render();
  }

  render() {
    var ds = this._ds;
    var container = this._container;
    container.innerHTML = '';

    var bar = document.createElement('div');
    bar.className = 'sl-formula-bar';

    // Name input
    var nameInput = document.createElement('input');
    nameInput.className = 'sl-formula-name';
    nameInput.placeholder = 'Column name';
    bar.appendChild(nameInput);

    // Formula input
    var formulaInput = document.createElement('input');
    formulaInput.className = 'sl-formula-input';
    formulaInput.placeholder = 'Formula: [Salary] * 12';
    bar.appendChild(formulaInput);

    // Add button
    var addBtn = document.createElement('button');
    addBtn.style.cssText = 'background:var(--sl-accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;cursor:pointer;white-space:nowrap;font-family:var(--sl-font);';
    addBtn.textContent = '+ Add Column';
    addBtn.addEventListener('click', function () {
      var name = nameInput.value.trim();
      var formula = formulaInput.value.trim();
      if (!name || !formula) return;
      try {
        ds.addCalculatedColumn(name, formula);
        nameInput.value = '';
        formulaInput.value = '';
        // Show success
        addBtn.textContent = 'Added!';
        setTimeout(function () { addBtn.textContent = '+ Add Column'; }, 1500);
      } catch (e) {
        addBtn.textContent = 'Error!';
        addBtn.style.background = 'var(--sl-marking)';
        setTimeout(function () { addBtn.textContent = '+ Add Column'; addBtn.style.background = 'var(--sl-accent)'; }, 2000);
        console.error('Formula error:', e);
      }
    });
    bar.appendChild(addBtn);

    container.appendChild(bar);
  }
}

// ─── Toolbar ────────────────────────────────────────────────
class Toolbar {
  constructor(selector, dataStore, config) {
    this._ds = dataStore;
    this._config = config || {};
    this._container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._container) throw new Error('Toolbar: container not found');
    this.render();
  }

  render() {
    var ds = this._ds;
    var cfg = this._config;
    var container = this._container;
    container.innerHTML = '';

    var bar = document.createElement('div');
    bar.className = 'sl-toolbar';

    // Export
    if (cfg.showExport !== false) {
      var expAll = document.createElement('button');
      expAll.textContent = '\u2B07 Export All';
      expAll.addEventListener('click', function () { ds.downloadCSV('spotlight-export.csv'); });
      bar.appendChild(expAll);

      var expMarked = document.createElement('button');
      expMarked.textContent = '\u2B07 Export Marked';
      expMarked.addEventListener('click', function () { ds.downloadCSV('spotlight-marked.csv', { markedOnly: true }); });
      bar.appendChild(expMarked);
    }

    // Clear marking
    var clearBtn = document.createElement('button');
    clearBtn.textContent = '\u2715 Clear Selection';
    clearBtn.addEventListener('click', function () { ds._markingManager.clearMarking(); });
    bar.appendChild(clearBtn);

    // Theme picker
    if (cfg.showThemeToggle !== false) {
      var themes = cfg.themes || ThemeManager.getThemeNames();
      var select = document.createElement('select');
      var currentTheme = ThemeManager.getTheme().name;
      themes.forEach(function (t) {
        var opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
        if (t === currentTheme) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener('change', function () { ThemeManager.setTheme(select.value); });
      bar.appendChild(select);
    }

    container.appendChild(bar);
  }
}
