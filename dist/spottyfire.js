(function(global) {
'use strict';
// ─── ThemeManager ───────────────────────────────────────────
const ThemeManager = (function () {
  const THEMES = {};

  const DEFAULTS = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    transition: '220ms',
    unmarkedColor: '#888',
  };

  // ── Theme 1: Midnight (Default Dark) ──
  THEMES.midnight = Object.assign({}, DEFAULTS, {
    name: 'midnight',
    background: '#0f1117',
    panelBg: '#1a1d29',
    panelBorder: '#2a2d3a',
    panelShadow: '0 4px 24px rgba(0,0,0,0.4)',
    textPrimary: '#e4e4e7',
    textSecondary: '#71717a',
    textMuted: '#52525b',
    gridLines: 'rgba(255,255,255,0.06)',
    accent: '#6366f1',
    marking: '#f43f5e',
    unmarkedOpacity: 0.1,
    palette: ['#6366f1','#22d3ee','#a78bfa','#34d399','#fbbf24','#fb923c','#f87171','#e879f9','#38bdf8','#4ade80'],
    sequential: ['#1e1b4b','#3730a3','#4f46e5','#6366f1','#818cf8','#a5b4fc','#c7d2fe'],
    diverging: ['#f43f5e','#fda4af','#fecdd3','#f0f0f0','#bae6fd','#38bdf8','#0284c7'],
  });

  // ── Theme 2: Arctic (Clean Light) ──
  THEMES.arctic = Object.assign({}, DEFAULTS, {
    name: 'arctic',
    background: '#f8fafc',
    panelBg: '#ffffff',
    panelBorder: '#e2e8f0',
    panelShadow: '0 1px 8px rgba(0,0,0,0.08)',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    gridLines: 'rgba(0,0,0,0.06)',
    accent: '#3b82f6',
    marking: '#ef4444',
    unmarkedOpacity: 0.08,
    palette: ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#ec4899','#84cc16','#f97316','#6366f1'],
    sequential: ['#eff6ff','#bfdbfe','#60a5fa','#3b82f6','#2563eb','#1d4ed8','#1e40af'],
    diverging: ['#dc2626','#fca5a5','#fee2e2','#f8fafc','#dbeafe','#60a5fa','#2563eb'],
  });

  // ── Theme 3: Forest (Earthy/Natural Dark) ──
  THEMES.forest = Object.assign({}, DEFAULTS, {
    name: 'forest',
    background: '#0c1410',
    panelBg: '#142019',
    panelBorder: '#1f352b',
    panelShadow: '0 4px 20px rgba(0,0,0,0.5)',
    textPrimary: '#d4e7dc',
    textSecondary: '#7a9987',
    textMuted: '#5a7a67',
    gridLines: 'rgba(255,255,255,0.05)',
    accent: '#22c55e',
    marking: '#f59e0b',
    unmarkedOpacity: 0.1,
    palette: ['#22c55e','#2dd4bf','#a3e635','#fbbf24','#f97316','#f43f5e','#a78bfa','#38bdf8','#fb7185','#4ade80'],
    sequential: ['#052e16','#14532d','#166534','#15803d','#22c55e','#4ade80','#86efac'],
    diverging: ['#dc2626','#fca5a5','#fde68a','#ecfdf5','#6ee7b7','#22c55e','#15803d'],
  });

  // ── Theme 4: Sunset (Warm Dark) ──
  THEMES.sunset = Object.assign({}, DEFAULTS, {
    name: 'sunset',
    background: '#18100e',
    panelBg: '#241a16',
    panelBorder: '#3d2a22',
    panelShadow: '0 4px 20px rgba(0,0,0,0.5)',
    textPrimary: '#ede0d4',
    textSecondary: '#9a8578',
    textMuted: '#7a6a5e',
    gridLines: 'rgba(255,255,255,0.05)',
    accent: '#f97316',
    marking: '#06b6d4',
    unmarkedOpacity: 0.1,
    palette: ['#f97316','#fbbf24','#f43f5e','#a78bfa','#22d3ee','#34d399','#e879f9','#fb7185','#38bdf8','#84cc16'],
    sequential: ['#431407','#7c2d12','#c2410c','#ea580c','#f97316','#fb923c','#fdba74'],
    diverging: ['#0891b2','#67e8f9','#cffafe','#fff7ed','#fed7aa','#f97316','#c2410c'],
  });

  // ── Theme 5: Corporate (Professional Light) ──
  THEMES.corporate = Object.assign({}, DEFAULTS, {
    name: 'corporate',
    background: '#f1f5f9',
    panelBg: '#ffffff',
    panelBorder: '#cbd5e1',
    panelShadow: '0 1px 4px rgba(0,0,0,0.06)',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    gridLines: 'rgba(0,0,0,0.08)',
    accent: '#0f172a',
    marking: '#dc2626',
    unmarkedOpacity: 0.08,
    palette: ['#1e40af','#0f766e','#6d28d9','#b45309','#be123c','#0e7490','#a21caf','#4d7c0f','#c2410c','#4338ca'],
    sequential: ['#f1f5f9','#cbd5e1','#94a3b8','#475569','#334155','#1e293b','#0f172a'],
    diverging: ['#b91c1c','#f87171','#fecaca','#f8fafc','#bae6fd','#0ea5e9','#0369a1'],
  });

  // ── Theme 6: Neon (Vibrant Dark) ──
  THEMES.neon = Object.assign({}, DEFAULTS, {
    name: 'neon',
    background: '#09090b',
    panelBg: '#18181b',
    panelBorder: '#27272a',
    panelShadow: '0 4px 24px rgba(0,0,0,0.6)',
    textPrimary: '#fafafa',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    gridLines: 'rgba(255,255,255,0.06)',
    accent: '#22d3ee',
    marking: '#f43f5e',
    unmarkedOpacity: 0.08,
    palette: ['#22d3ee','#a855f7','#f43f5e','#10b981','#f59e0b','#6366f1','#ec4899','#14b8a6','#f97316','#8b5cf6'],
    sequential: ['#09090b','#18181b','#3f3f46','#6366f1','#818cf8','#a5b4fc','#e0e7ff'],
    diverging: ['#f43f5e','#fb7185','#fecdd3','#27272a','#67e8f9','#22d3ee','#06b6d4'],
  });

  // ── Theme 7: Obsidian (Premium Dark — deep blacks, jewel-tone accents) ──
  THEMES.obsidian = Object.assign({}, DEFAULTS, {
    name: 'obsidian',
    background: '#08080c',
    panelBg: '#101018',
    panelBorder: '#1e1e2e',
    panelShadow: '0 8px 32px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.03) inset',
    textPrimary: '#e8e8f0',
    textSecondary: '#8888a0',
    textMuted: '#555568',
    gridLines: 'rgba(255,255,255,0.04)',
    accent: '#7c6aef',
    marking: '#ff6b8a',
    unmarkedOpacity: 0.07,
    palette: [
      '#7c6aef',  // Soft violet
      '#4fd1c5',  // Teal jade
      '#f6ad55',  // Warm gold
      '#fc8181',  // Coral pink
      '#68d391',  // Mint green
      '#63b3ed',  // Sky blue
      '#f687b3',  // Rose
      '#b794f4',  // Lavender
      '#4fd1c5',  // Aquamarine
      '#fbd38d',  // Peach
    ],
    sequential: ['#08080c','#161630','#2d2a6e','#4c3ecc','#7c6aef','#a89cf5','#d4ccfa'],
    diverging: ['#ff6b8a','#ffa0b4','#ffd0da','#1a1a2e','#a0e0d8','#4fd1c5','#2c9f94'],
  });

  // ── Theme 8: Porcelain (Premium Light — warm whites, refined pastels) ──
  THEMES.porcelain = Object.assign({}, DEFAULTS, {
    name: 'porcelain',
    background: '#faf9f7',
    panelBg: '#ffffff',
    panelBorder: '#e8e4df',
    panelShadow: '0 2px 12px rgba(120,100,80,0.07), 0 1px 0 rgba(120,100,80,0.04)',
    textPrimary: '#2c2520',
    textSecondary: '#7a7068',
    textMuted: '#b0a89e',
    gridLines: 'rgba(44,37,32,0.06)',
    accent: '#6366f1',
    marking: '#e11d48',
    unmarkedOpacity: 0.06,
    palette: [
      '#6366f1',  // Indigo
      '#0d9488',  // Deep teal
      '#c026d3',  // Fuchsia
      '#d97706',  // Amber
      '#e11d48',  // Crimson
      '#2563eb',  // Royal blue
      '#059669',  // Emerald
      '#9333ea',  // Purple
      '#ea580c',  // Burnt orange
      '#0891b2',  // Cyan
    ],
    sequential: ['#faf9f7','#e8e4df','#c8bfb4','#9a8e82','#6366f1','#4f46e5','#3730a3'],
    diverging: ['#e11d48','#fb7185','#fecdd3','#faf9f7','#c7d2fe','#818cf8','#4f46e5'],
  });

  let _current = THEMES.midnight;
  const _listeners = [];

  function _emit() {
    _listeners.forEach(function (fn) { fn(_current); });
  }

  function setTheme(themeOrName) {
    if (typeof themeOrName === 'string') {
      if (!THEMES[themeOrName]) throw new Error('Unknown theme: ' + themeOrName);
      _current = THEMES[themeOrName];
    } else if (themeOrName && typeof themeOrName === 'object') {
      _current = Object.assign({}, THEMES.midnight, themeOrName);
    }
    _applyCSS(_current);
    _emit();
  }

  function getTheme() { return Object.assign({}, _current); }
  function getThemeNames() { return Object.keys(THEMES); }
  function on(fn) { _listeners.push(fn); }
  function off(fn) { var i = _listeners.indexOf(fn); if (i >= 0) _listeners.splice(i, 1); }

  function getPlotlyLayout(overrides) {
    var t = _current;
    var base = {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { family: t.fontFamily, color: t.textPrimary, size: 13 },
      title: { font: { size: 16 }, x: 0.02, xanchor: 'left', y: 0.98, pad: { t: 8, b: 16 } },
      xaxis: {
        gridcolor: t.gridLines, zerolinecolor: t.gridLines, linecolor: t.panelBorder,
        tickfont: { size: 11, color: t.textSecondary },
        title: { font: { size: 12, color: t.textSecondary }, standoff: 12 },
      },
      yaxis: {
        gridcolor: t.gridLines, zerolinecolor: t.gridLines, linecolor: t.panelBorder,
        tickfont: { size: 11, color: t.textSecondary },
        title: { font: { size: 12, color: t.textSecondary }, standoff: 12 },
      },
      legend: {
        bgcolor: 'transparent', font: { size: 11, color: t.textSecondary },
        orientation: 'h', y: -0.15, x: 0.5, xanchor: 'center',
      },
      margin: { t: 52, r: 24, b: 56, l: 56 },
      hoverlabel: {
        bgcolor: t.panelBg, bordercolor: t.panelBorder,
        font: { size: 12, color: t.textPrimary },
      },
      dragmode: 'select',
      modebar: { bgcolor: 'transparent', color: t.textMuted, activecolor: t.accent, orientation: 'v' },
    };
    if (overrides) _deepMerge(base, overrides);
    return base;
  }

  function _deepMerge(target, src) {
    for (var k in src) {
      if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k]) && target[k] && typeof target[k] === 'object') {
        _deepMerge(target[k], src[k]);
      } else {
        target[k] = src[k];
      }
    }
    return target;
  }

  function _applyCSS(t) {
    var id = 'sl-theme-vars';
    var el = document.getElementById(id);
    if (!el) { el = document.createElement('style'); el.id = id; document.head.appendChild(el); }
    el.textContent = ':root{' +
      '--sl-bg:' + t.background + ';' +
      '--sl-panel-bg:' + t.panelBg + ';' +
      '--sl-panel-border:' + t.panelBorder + ';' +
      '--sl-panel-shadow:' + t.panelShadow + ';' +
      '--sl-text-primary:' + t.textPrimary + ';' +
      '--sl-text-secondary:' + t.textSecondary + ';' +
      '--sl-text-muted:' + t.textMuted + ';' +
      '--sl-accent:' + t.accent + ';' +
      '--sl-marking:' + t.marking + ';' +
      '--sl-grid:' + t.gridLines + ';' +
      '--sl-transition:' + t.transition + ';' +
      '--sl-font:' + t.fontFamily + ';' +
    '}body{background:var(--sl-bg);color:var(--sl-text-primary);font-family:var(--sl-font);margin:0;}';

    // Inject base component styles once
    if (!document.getElementById('sl-base-css')) {
      var s = document.createElement('style');
      s.id = 'sl-base-css';
      s.textContent =
        '.sl-panel{background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:12px;box-shadow:var(--sl-panel-shadow);overflow:hidden;display:flex;flex-direction:column;transition:box-shadow var(--sl-transition) ease,border-color var(--sl-transition) ease;animation:sl-fadein 400ms ease both;}' +
        '.sl-panel:hover{border-color:var(--sl-accent);box-shadow:var(--sl-panel-shadow),0 0 0 1px var(--sl-accent);}' +
        '.sl-panel-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--sl-panel-border);font-size:14px;font-weight:600;color:var(--sl-text-primary);user-select:none;}' +
        '.sl-panel-header-actions{display:flex;gap:6px;align-items:center;}' +
        '.sl-panel-header-actions button{background:none;border:1px solid var(--sl-panel-border);border-radius:6px;color:var(--sl-text-muted);cursor:pointer;padding:4px 8px;font-size:11px;transition:all var(--sl-transition) ease;}' +
        '.sl-panel-header-actions button:hover{color:var(--sl-text-primary);border-color:var(--sl-accent);}' +
        '.sl-panel-body{flex:1;padding:8px;min-height:0;position:relative;}' +
        '@keyframes sl-fadein{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}' +
        '.sl-table-wrap{overflow:auto;max-height:100%;font-size:13px;}' +
        '.sl-table{width:100%;border-collapse:collapse;}' +
        '.sl-table th{position:sticky;top:0;background:var(--sl-panel-bg);text-align:left;padding:8px 12px;font-size:12px;font-weight:600;color:var(--sl-text-secondary);text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid var(--sl-panel-border);cursor:pointer;user-select:none;white-space:nowrap;}' +
        '.sl-table th:hover{color:var(--sl-text-primary);}' +
        '.sl-table th .sl-sort{margin-left:4px;opacity:0.4;}.sl-table th.sl-sorted .sl-sort{opacity:1;color:var(--sl-accent);}' +
        '.sl-table td{padding:8px 12px;border-bottom:1px solid var(--sl-panel-border);color:var(--sl-text-primary);white-space:nowrap;}' +
        '.sl-table tr.sl-striped td{background:rgba(128,128,128,0.03);}' +
        '.sl-table tr.sl-row-marked td{background:color-mix(in srgb,var(--sl-marking) 12%,transparent);border-left:3px solid var(--sl-marking);}' +
        '.sl-table tr:hover td{background:rgba(128,128,128,0.07);}' +
        '.sl-table tr{cursor:pointer;transition:background var(--sl-transition) ease;}' +
        '.sl-table-pager{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;font-size:12px;color:var(--sl-text-secondary);border-top:1px solid var(--sl-panel-border);}' +
        '.sl-table-pager button{background:none;border:1px solid var(--sl-panel-border);border-radius:6px;color:var(--sl-text-secondary);cursor:pointer;padding:4px 10px;font-size:11px;}' +
        '.sl-table-pager button:hover:not(:disabled){color:var(--sl-text-primary);border-color:var(--sl-accent);}' +
        '.sl-table-pager button:disabled{opacity:0.3;cursor:default;}' +
        '.sl-filter-panel{background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:12px;box-shadow:var(--sl-panel-shadow);padding:16px;overflow-y:auto;font-size:13px;color:var(--sl-text-primary);}' +
        '.sl-filter-section{margin-bottom:16px;}' +
        '.sl-filter-section label{display:block;font-size:12px;font-weight:600;color:var(--sl-text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;}' +
        '.sl-filter-check{display:flex;align-items:center;gap:6px;padding:3px 0;cursor:pointer;font-size:13px;color:var(--sl-text-primary);}' +
        '.sl-filter-check input{accent-color:var(--sl-accent);}' +
        '.sl-filter-range{width:100%;accent-color:var(--sl-accent);}' +
        '.sl-toolbar{display:flex;align-items:center;gap:8px;padding:8px 0;}' +
        '.sl-toolbar button,.sl-toolbar select{background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:8px;color:var(--sl-text-primary);padding:6px 14px;font-size:12px;cursor:pointer;transition:all var(--sl-transition) ease;font-family:var(--sl-font);}' +
        '.sl-toolbar button:hover,.sl-toolbar select:hover{border-color:var(--sl-accent);}' +
        '.sl-formula-bar{display:flex;gap:8px;align-items:center;padding:8px 0;}' +
        '.sl-formula-input{flex:1;background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:8px;color:var(--sl-text-primary);padding:8px 12px;font-size:13px;font-family:monospace;outline:none;transition:border-color var(--sl-transition) ease;}' +
        '.sl-formula-input:focus{border-color:var(--sl-accent);}' +
        '.sl-formula-name{background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:8px;color:var(--sl-text-primary);padding:8px 12px;font-size:13px;width:140px;outline:none;transition:border-color var(--sl-transition) ease;}' +
        '.sl-formula-name:focus{border-color:var(--sl-accent);}';
      document.head.appendChild(s);
    }
  }

  // Apply default theme CSS on load
  if (typeof document !== 'undefined') {
    _applyCSS(_current);
  }

  return {
    setTheme: setTheme,
    getTheme: getTheme,
    getThemeNames: getThemeNames,
    getPlotlyLayout: getPlotlyLayout,
    on: on,
    off: off,
    _themes: THEMES,
  };
})();
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
// ─── FormulaEngine ──────────────────────────────────────────
var FormulaEngine = (function () {

  // Tokenizer
  function tokenize(expr) {
    var tokens = [];
    var i = 0;
    while (i < expr.length) {
      var ch = expr[i];
      if (/\s/.test(ch)) { i++; continue; }
      // Column reference [ColName]
      if (ch === '[') {
        var j = expr.indexOf(']', i);
        if (j < 0) throw new Error('Unclosed [ at ' + i);
        tokens.push({ type: 'col', value: expr.substring(i + 1, j) });
        i = j + 1;
        continue;
      }
      // String literal
      if (ch === '"' || ch === "'") {
        var q = ch;
        var s = '';
        i++;
        while (i < expr.length && expr[i] !== q) { s += expr[i]; i++; }
        i++; // skip close quote
        tokens.push({ type: 'str', value: s });
        continue;
      }
      // Number
      if (/[0-9.]/.test(ch)) {
        var num = '';
        while (i < expr.length && /[0-9.eE]/.test(expr[i])) { num += expr[i]; i++; }
        tokens.push({ type: 'num', value: parseFloat(num) });
        continue;
      }
      // Operators
      if ('+-*/(),<>=!'.indexOf(ch) >= 0) {
        // Handle >=, <=, !=, ==
        if ((ch === '>' || ch === '<' || ch === '!' || ch === '=') && expr[i + 1] === '=') {
          tokens.push({ type: 'op', value: ch + '=' });
          i += 2; continue;
        }
        tokens.push({ type: 'op', value: ch });
        i++; continue;
      }
      // Identifier (function or keyword)
      if (/[a-zA-Z_]/.test(ch)) {
        var id = '';
        while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) { id += expr[i]; i++; }
        // Check for OVER keyword
        if (id.toUpperCase() === 'OVER') {
          tokens.push({ type: 'over', value: 'OVER' });
        } else if (id.toLowerCase() === 'true') {
          tokens.push({ type: 'bool', value: true });
        } else if (id.toLowerCase() === 'false') {
          tokens.push({ type: 'bool', value: false });
        } else {
          tokens.push({ type: 'ident', value: id });
        }
        continue;
      }
      throw new Error('Unexpected char: ' + ch + ' at pos ' + i);
    }
    return tokens;
  }

  // Recursive descent parser
  function parse(tokens) {
    var pos = 0;

    function peek() { return pos < tokens.length ? tokens[pos] : null; }
    function next() { return tokens[pos++]; }
    function expect(type, val) {
      var t = next();
      if (!t || t.type !== type || (val !== undefined && t.value !== val)) {
        throw new Error('Expected ' + type + (val ? '(' + val + ')' : '') + ' got ' + JSON.stringify(t));
      }
      return t;
    }

    function parseExpr() { return parseComparison(); }

    function parseComparison() {
      var left = parseAddSub();
      var t = peek();
      if (t && t.type === 'op' && ['>', '<', '>=', '<=', '==', '!='].indexOf(t.value) >= 0) {
        next();
        var right = parseAddSub();
        return { type: 'binop', op: t.value, left: left, right: right };
      }
      return left;
    }

    function parseAddSub() {
      var left = parseMulDiv();
      while (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
        var op = next().value;
        left = { type: 'binop', op: op, left: left, right: parseMulDiv() };
      }
      return left;
    }

    function parseMulDiv() {
      var left = parseUnary();
      while (peek() && peek().type === 'op' && (peek().value === '*' || peek().value === '/')) {
        var op = next().value;
        left = { type: 'binop', op: op, left: left, right: parseUnary() };
      }
      return left;
    }

    function parseUnary() {
      if (peek() && peek().type === 'op' && peek().value === '-') {
        next();
        return { type: 'unary', op: '-', expr: parsePrimary() };
      }
      return parsePrimary();
    }

    function parsePrimary() {
      var t = peek();
      if (!t) throw new Error('Unexpected end of expression');

      if (t.type === 'num') { next(); return { type: 'literal', value: t.value }; }
      if (t.type === 'str') { next(); return { type: 'literal', value: t.value }; }
      if (t.type === 'bool') { next(); return { type: 'literal', value: t.value }; }
      if (t.type === 'col') {
        next();
        // Check for OVER
        if (peek() && peek().type === 'over') return { type: 'colref', name: t.value };
        return { type: 'colref', name: t.value };
      }
      if (t.type === 'op' && t.value === '(') {
        next();
        var expr = parseExpr();
        expect('op', ')');
        return expr;
      }
      if (t.type === 'ident') {
        next();
        // Function call
        if (peek() && peek().type === 'op' && peek().value === '(') {
          next(); // skip (
          var args = [];
          if (!(peek() && peek().type === 'op' && peek().value === ')')) {
            args.push(parseExpr());
            while (peek() && peek().type === 'op' && peek().value === ',') {
              next();
              args.push(parseExpr());
            }
          }
          expect('op', ')');
          // Check for OVER
          var overCol = null;
          if (peek() && peek().type === 'over') {
            next();
            var oc = next();
            overCol = oc.value || oc.name;
          }
          return { type: 'call', name: t.value, args: args, over: overCol };
        }
        return { type: 'ident', name: t.value };
      }
      throw new Error('Unexpected token: ' + JSON.stringify(t));
    }

    var ast = parseExpr();
    return ast;
  }

  // Built-in functions
  var FUNCS = {
    // Math
    Abs: function (a) { return Math.abs(a); },
    Round: function (a, d) { var f = Math.pow(10, d || 0); return Math.round(a * f) / f; },
    Floor: function (a) { return Math.floor(a); },
    Ceil: function (a) { return Math.ceil(a); },
    Log: function (a) { return Math.log(a); },
    Sqrt: function (a) { return Math.sqrt(a); },
    Power: function (a, b) { return Math.pow(a, b); },
    Min: function () { return Math.min.apply(null, arguments); },
    Max: function () { return Math.max.apply(null, arguments); },
    // String
    Upper: function (s) { return String(s).toUpperCase(); },
    Lower: function (s) { return String(s).toLowerCase(); },
    Trim: function (s) { return String(s).trim(); },
    Left: function (s, n) { return String(s).substring(0, n); },
    Right: function (s, n) { return String(s).slice(-n); },
    Len: function (s) { return String(s).length; },
    Concatenate: function () { return Array.from(arguments).join(''); },
    Replace: function (s, old, rep) { return String(s).split(old).join(rep); },
    Contains: function (s, sub) { return String(s).indexOf(sub) >= 0; },
    // Date
    Year: function (d) { return new Date(d).getFullYear(); },
    Month: function (d) { return new Date(d).getMonth() + 1; },
    Day: function (d) { return new Date(d).getDate(); },
    Today: function () { return new Date().toISOString().slice(0, 10); },
    DateDiff: function (a, b, unit) {
      var d1 = new Date(a), d2 = new Date(b);
      var ms = d2 - d1;
      if (unit === 'days') return Math.floor(ms / 86400000);
      if (unit === 'months') return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
      if (unit === 'years') return d2.getFullYear() - d1.getFullYear();
      return ms;
    },
    DateAdd: function (d, n, unit) {
      var dt = new Date(d);
      if (unit === 'days') dt.setDate(dt.getDate() + n);
      else if (unit === 'months') dt.setMonth(dt.getMonth() + n);
      else if (unit === 'years') dt.setFullYear(dt.getFullYear() + n);
      return dt.toISOString().slice(0, 10);
    },
    // Logic
    If: function (cond, a, b) { return cond ? a : b; },
    And: function () { return Array.from(arguments).every(Boolean); },
    Or: function () { return Array.from(arguments).some(Boolean); },
    Not: function (a) { return !a; },
    IsNull: function (a) { return a == null || a === ''; },
    IfNull: function (a, b) { return (a == null || a === '') ? b : a; },
  };

  // Evaluate AST for a single row
  function evaluate(ast, row) {
    if (!ast) return null;
    switch (ast.type) {
      case 'literal': return ast.value;
      case 'colref': return row[ast.name];
      case 'ident': return ast.name;
      case 'unary':
        return ast.op === '-' ? -evaluate(ast.expr, row) : evaluate(ast.expr, row);
      case 'binop': {
        var l = evaluate(ast.left, row);
        var r = evaluate(ast.right, row);
        switch (ast.op) {
          case '+': return (typeof l === 'string' || typeof r === 'string') ? String(l) + String(r) : (+l) + (+r);
          case '-': return (+l) - (+r);
          case '*': return (+l) * (+r);
          case '/': return (+r) === 0 ? null : (+l) / (+r);
          case '>': return (+l) > (+r);
          case '<': return (+l) < (+r);
          case '>=': return (+l) >= (+r);
          case '<=': return (+l) <= (+r);
          case '==': return l == r;
          case '!=': return l != r;
        }
        break;
      }
      case 'call': {
        var fname = ast.name;
        // Case-insensitive lookup
        var fn = FUNCS[fname] || FUNCS[fname.charAt(0).toUpperCase() + fname.slice(1).toLowerCase()];
        if (!fn) {
          // Try case-insensitive
          for (var k in FUNCS) {
            if (k.toLowerCase() === fname.toLowerCase()) { fn = FUNCS[k]; break; }
          }
        }
        if (!fn) throw new Error('Unknown function: ' + fname);
        var args = ast.args.map(function (a) { return evaluate(a, row); });
        return fn.apply(null, args);
      }
    }
    return null;
  }

  // Compile formula → function(row) → value
  function compile(formula) {
    var tokens = tokenize(formula);
    var ast = parse(tokens);
    return function (row) {
      try { return evaluate(ast, row); }
      catch (e) { return null; }
    };
  }

  // Window functions: pre-compute aggregates over groups
  function compileWindow(formula, rows) {
    var tokens = tokenize(formula);
    var ast = parse(tokens);
    if (ast.type === 'call' && ast.over) {
      var aggName = ast.name.toLowerCase();
      var colNode = ast.args[0];
      var colName = colNode.name || colNode.value;
      var groupCol = ast.over;
      // Group rows
      var groups = {};
      rows.forEach(function (r) {
        var gk = String(r[groupCol]);
        if (!groups[gk]) groups[gk] = [];
        groups[gk].push(+r[colName] || 0);
      });
      // Compute aggregate per group
      var results = {};
      for (var g in groups) {
        var vals = groups[g];
        if (aggName === 'avg') results[g] = vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
        else if (aggName === 'sum') results[g] = vals.reduce(function (a, b) { return a + b; }, 0);
        else if (aggName === 'min') results[g] = Math.min.apply(null, vals);
        else if (aggName === 'max') results[g] = Math.max.apply(null, vals);
        else if (aggName === 'count') results[g] = vals.length;
      }
      return function (row) { return results[String(row[groupCol])]; };
    }
    return compile(formula);
  }

  return { compile: compile, compileWindow: compileWindow, tokenize: tokenize, parse: parse, FUNCS: FUNCS };
})();
// ─── DataStore ──────────────────────────────────────────────
class DataStore {
  constructor() {
    this._rows = [];
    this._columns = [];
    this._calculatedCols = {};  // name → fn
    this._eventListeners = {};
    this._markingManager = new MarkingManager();
    this._filterEngine = new FilterEngine(this);
    this._chartRegistry = {};   // chartId → { id, name, instance }
  }

  // ── Chart Registry ──
  _registerChart(chart) {
    var name = chart._config.name || chart._config.title || chart._id;
    this._chartRegistry[chart._id] = { id: chart._id, name: name, instance: chart };
  }

  _unregisterChart(chart) {
    delete this._chartRegistry[chart._id];
  }

  getRegisteredCharts() {
    return Object.values(this._chartRegistry);
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
// ─── BaseChart ──────────────────────────────────────────────
class BaseChart {
  constructor(selector, dataStore, config) {
    this._id = 'sl_' + (BaseChart._counter = (BaseChart._counter || 0) + 1);
    this._ds = dataStore;
    this._config = Object.assign({}, config);
    this._mm = dataStore._markingManager;
    this._limitSet = null; // Set of row indices from source chart, or null

    // Resolve container
    if (typeof selector === 'string') {
      this._container = document.querySelector(selector);
    } else {
      this._container = selector;
    }
    if (!this._container) throw new Error('SpottyFire: container not found: ' + selector);

    // Register in chart registry
    this._ds._registerChart(this);

    // Wrap in panel
    this._wrapper = ChartWrapper.wrap(this._container, this._config.title || '', this);

    // Listen to marking & filter changes
    var self = this;
    this._onMarking = function (e) {
      if (e.source !== self._id) {
        self._handleDataLimiting(e);
        self._onMarkingChanged(e);
      }
    };
    this._onFilter = function () { self.refresh(); };
    this._onTheme = function () { self.refresh(); };

    this._mm.on('marking-changed', this._onMarking);
    this._ds.on('filter-changed', this._onFilter);
    ThemeManager.on(this._onTheme);
  }

  getConfig() { return Object.assign({}, this._config); }

  updateConfig(newConfig) {
    Object.assign(this._config, newConfig);
    if (newConfig.title && this._wrapper) {
      this._wrapper.querySelector('.sl-panel-header span').textContent = newConfig.title;
    }
    // If dataLimitedBy changed, re-evaluate limit set
    if ('dataLimitedBy' in newConfig) {
      if (!newConfig.dataLimitedBy) {
        this._limitSet = null; // cleared
      } else {
        // Grab current marking state from source chart
        var mm = this._mm;
        if (mm.hasMarking()) {
          this._limitSet = mm.getMarkedIndices();
        } else {
          this._limitSet = new Set(); // source has nothing marked → empty
        }
      }
    }
    this.refresh();
  }

  // Handle data limiting: track marking from the source chart
  _handleDataLimiting(e) {
    var limitBy = this._config.dataLimitedBy;
    if (!limitBy) return; // not limited by anything
    if (e.source === limitBy) {
      // Update limit set from this specific source
      if (e.action === 'clear' || e.markedIndices.size === 0) {
        this._limitSet = new Set(); // source cleared → empty
      } else {
        this._limitSet = new Set(e.markedIndices);
      }
    }
    // If event is from a different chart, ignore for limiting purposes
  }

  // Get rows filtered by data limiting + global filters
  _getLimitedRows() {
    var rows = this._ds.getFilteredRows();
    var limitBy = this._config.dataLimitedBy;

    if (limitBy && this._limitSet !== null) {
      if (this._limitSet.size === 0) {
        return []; // source has nothing marked
      }
      var ls = this._limitSet;
      rows = rows.filter(function (r) { return ls.has(r.__rowIndex); });
    }

    return rows;
  }

  // Check if chart is data-limited with empty result → render empty state
  _renderEmptyIfLimited(layoutOverrides) {
    var limitBy = this._config.dataLimitedBy;
    if (!limitBy) return false;
    if (this._limitSet === null) return false;
    if (this._limitSet.size > 0) return false;

    var entry = this._ds._chartRegistry[limitBy];
    var sourceName = entry ? entry.name : 'source chart';
    var theme = ThemeManager.getTheme();
    var layout = ThemeManager.getPlotlyLayout(layoutOverrides || {});
    layout.annotations = [{
      text: 'Select data in "' + sourceName + '" to display',
      xref: 'paper', yref: 'paper', x: 0.5, y: 0.5,
      showarrow: false, font: { size: 13, color: theme.textMuted },
    }];
    Plotly.react(this._getPlotDiv(), [], layout, this._plotlyConfig());
    return true;
  }

  refresh() {
    // Override in subclass
  }

  _onMarkingChanged(e) {
    // Override in subclass
  }

  _getPlotDiv() {
    return this._wrapper.querySelector('.sl-panel-body');
  }

  _plotlyConfig() {
    return {
      displaylogo: false,
      responsive: true,
      modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
    };
  }

  destroy() {
    this._ds._unregisterChart(this);
    this._mm.off('marking-changed', this._onMarking);
    this._ds.off('filter-changed', this._onFilter);
    ThemeManager.off(this._onTheme);
    var div = this._getPlotDiv();
    if (div && typeof Plotly !== 'undefined') {
      try { Plotly.purge(div); } catch (e) {}
    }
    if (this._wrapper && this._wrapper.parentNode) {
      this._wrapper.parentNode.removeChild(this._wrapper);
    }
  }
}
// ─── BarChart ───────────────────────────────────────────────
class BarChart extends BaseChart {
  constructor(selector, dataStore, config) {
    super(selector, dataStore, config);
    this.refresh();
    this._bindEvents();
  }

  refresh() {
    if (this._renderEmptyIfLimited()) return;
    var cfg = this._config;
    var theme = ThemeManager.getTheme();
    var rows = this._getLimitedRows();
    var cat = cfg.category;
    var val = cfg.value;
    var agg = cfg.aggregation || 'sum';
    var orientation = cfg.orientation || 'vertical';
    var colorBy = cfg.colorBy;
    var hasMarking = this._mm.hasMarking();
    var mm = this._mm;

    // showOnlyMarked: empty state
    if (cfg.showOnlyMarked && !hasMarking) {
      var emptyLayout = ThemeManager.getPlotlyLayout({
        annotations: [{
          text: 'Select data in another chart to display',
          xref: 'paper', yref: 'paper', x: 0.5, y: 0.5,
          showarrow: false, font: { size: 14, color: theme.textMuted },
        }],
      });
      Plotly.react(this._getPlotDiv(), [], emptyLayout, this._plotlyConfig());
      return;
    }

    // showOnlyMarked: filter to marked rows
    if (cfg.showOnlyMarked && hasMarking) {
      rows = rows.filter(function (r) { return mm.isMarked(r.__rowIndex); });
      hasMarking = false; // no need to split — already filtered
    }

    // Aggregate
    var groups = {};
    var groupRows = {};
    rows.forEach(function (r) {
      var key = String(r[cat] || 'Unknown');
      if (!groups[key]) { groups[key] = []; groupRows[key] = []; }
      groups[key].push(+r[val] || 0);
      groupRows[key].push(r.__rowIndex);
    });

    var categories = Object.keys(groups);
    var values = categories.map(function (k) {
      var arr = groups[k];
      if (agg === 'sum') return arr.reduce(function (a, b) { return a + b; }, 0);
      if (agg === 'avg') return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
      if (agg === 'count') return arr.length;
      if (agg === 'min') return Math.min.apply(null, arr);
      if (agg === 'max') return Math.max.apply(null, arr);
      return arr.reduce(function (a, b) { return a + b; }, 0);
    });

    var traces = [];
    var mm = this._mm;

    if (hasMarking) {
      // Split into marked / unmarked
      var markedVals = [];
      var unmarkedVals = [];
      categories.forEach(function (k, i) {
        var markedCount = 0, markedSum = 0;
        var unmarkedCount = 0, unmarkedSum = 0;
        groupRows[k].forEach(function (ri, j) {
          if (mm.isMarked(ri)) { markedCount++; markedSum += groups[k][j]; }
          else { unmarkedCount++; unmarkedSum += groups[k][j]; }
        });
        var mv = agg === 'count' ? markedCount : agg === 'avg' ? (markedCount ? markedSum / markedCount : 0) : markedSum;
        var uv = agg === 'count' ? unmarkedCount : agg === 'avg' ? (unmarkedCount ? unmarkedSum / unmarkedCount : 0) : unmarkedSum;
        markedVals.push(markedCount > 0 ? mv : 0);
        unmarkedVals.push(unmarkedCount > 0 ? uv : 0);
      });

      var markedTrace = {
        name: 'Selected',
        marker: { color: theme.marking, opacity: 1, line: { width: 0 } },
        customdata: categories.map(function (k) { return groupRows[k]; }),
        hoverinfo: 'x+y',
      };
      var unmarkedTrace = {
        name: 'Other',
        marker: { color: theme.unmarkedColor || '#888', opacity: theme.unmarkedOpacity },
        customdata: categories.map(function (k) { return groupRows[k]; }),
        hoverinfo: 'x+y',
      };

      if (orientation === 'horizontal') {
        markedTrace.y = categories; markedTrace.x = markedVals; markedTrace.type = 'bar'; markedTrace.orientation = 'h';
        unmarkedTrace.y = categories; unmarkedTrace.x = unmarkedVals; unmarkedTrace.type = 'bar'; unmarkedTrace.orientation = 'h';
      } else {
        markedTrace.x = categories; markedTrace.y = markedVals; markedTrace.type = 'bar';
        unmarkedTrace.x = categories; unmarkedTrace.y = unmarkedVals; unmarkedTrace.type = 'bar';
      }
      traces = [markedTrace, unmarkedTrace];
    } else {
      // No marking — use palette colors
      var colors = categories.map(function (_, i) { return theme.palette[i % theme.palette.length]; });
      var trace = {
        type: 'bar',
        marker: { color: colors, line: { width: 0 }, opacity: 0.9 },
        customdata: categories.map(function (k) { return groupRows[k]; }),
        hoverinfo: 'x+y',
      };
      if (cfg.barRadius) {
        // Plotly doesn't natively support border-radius, but we add rounded look via marker line
      }
      if (orientation === 'horizontal') {
        trace.y = categories; trace.x = values; trace.orientation = 'h';
      } else {
        trace.x = categories; trace.y = values;
      }

      if (cfg.showValues) {
        trace.text = values.map(function (v) { return typeof v === 'number' ? v.toLocaleString(undefined, { maximumFractionDigits: 1 }) : v; });
        trace.textposition = 'outside';
        trace.textfont = { size: 11, color: theme.textSecondary };
      }
      traces = [trace];
    }

    var layout = ThemeManager.getPlotlyLayout({
      barmode: hasMarking ? 'stack' : 'group',
      showlegend: hasMarking,
    });
    if (orientation === 'horizontal') {
      layout.yaxis.automargin = true;
    }

    var div = this._getPlotDiv();
    Plotly.react(div, traces, layout, this._plotlyConfig());
  }

  _onMarkingChanged() {
    this.refresh();
  }

  _bindEvents() {
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      if (!data || !data.points || !data.points[0]) return;
      var pt = data.points[0];
      var rowIndices = pt.customdata;
      if (!rowIndices) return;
      var flat = Array.isArray(rowIndices[0]) ? [].concat.apply([], rowIndices) : rowIndices;
      if (data.event && data.event.shiftKey) {
        self._mm.addToMarking(flat, self._id);
      } else if (data.event && data.event.ctrlKey) {
        self._mm.toggleMarking(flat, self._id);
      } else {
        self._mm.setMarking(flat, self._id);
      }
    });
  }
}
// ─── ScatterPlot ────────────────────────────────────────────
class ScatterPlot extends BaseChart {
  constructor(selector, dataStore, config) {
    super(selector, dataStore, config);
    this.refresh();
    this._bindEvents();
  }

  refresh() {
    if (this._renderEmptyIfLimited()) return;
    var cfg = this._config;
    var theme = ThemeManager.getTheme();
    var rows = this._getLimitedRows();
    var hasMarking = this._mm.hasMarking();
    var mm = this._mm;
    var colorBy = cfg.colorBy;
    var sizeBy = cfg.sizeBy;
    var pointSize = cfg.pointSize || 7;

    // showOnlyMarked: empty state when nothing is marked
    if (cfg.showOnlyMarked && !hasMarking) {
      var emptyLayout = ThemeManager.getPlotlyLayout({
        xaxis: { title: { text: cfg.x } },
        yaxis: { title: { text: cfg.y } },
        dragmode: 'select',
        annotations: [{
          text: 'Select data in another chart to display',
          xref: 'paper', yref: 'paper', x: 0.5, y: 0.5,
          showarrow: false, font: { size: 14, color: theme.textMuted },
        }],
      });
      Plotly.react(this._getPlotDiv(), [], emptyLayout, this._plotlyConfig());
      return;
    }

    // showOnlyMarked: filter rows to marked only
    if (cfg.showOnlyMarked && hasMarking) {
      rows = rows.filter(function (r) { return mm.isMarked(r.__rowIndex); });
    }

    // When showOnlyMarked is active, we already filtered — treat as "no marking split needed"
    var splitMarking = hasMarking && !cfg.showOnlyMarked;
    var traces = [];

    if (colorBy) {
      // Group by colorBy column
      var groups = {};
      rows.forEach(function (r) {
        var g = String(r[colorBy] || 'Other');
        if (!groups[g]) groups[g] = { x: [], y: [], idx: [], text: [], sizes: [] };
        groups[g].x.push(r[cfg.x]);
        groups[g].y.push(r[cfg.y]);
        groups[g].idx.push(r.__rowIndex);
        groups[g].text.push(r.Name || r.name || '');
        if (sizeBy) groups[g].sizes.push(+r[sizeBy] || pointSize);
      });

      var groupNames = Object.keys(groups);
      groupNames.forEach(function (g, gi) {
        var grp = groups[g];
        var baseColor = theme.palette[gi % theme.palette.length];

        if (splitMarking) {
          // Split each group into marked/unmarked
          var mX = [], mY = [], mI = [], mT = [], mS = [];
          var uX = [], uY = [], uI = [], uT = [], uS = [];
          grp.idx.forEach(function (ri, j) {
            if (mm.isMarked(ri)) {
              mX.push(grp.x[j]); mY.push(grp.y[j]); mI.push(ri); mT.push(grp.text[j]); mS.push(grp.sizes[j] || pointSize);
            } else {
              uX.push(grp.x[j]); uY.push(grp.y[j]); uI.push(ri); uT.push(grp.text[j]); uS.push(grp.sizes[j] || pointSize);
            }
          });
          if (mX.length) {
            traces.push({
              type: 'scattergl', mode: 'markers', name: g,
              x: mX, y: mY, customdata: mI, text: mT,
              marker: { color: baseColor, size: sizeBy ? mS : pointSize + 2, opacity: 1, line: { width: 1, color: 'rgba(255,255,255,0.3)' } },
              legendgroup: g, showlegend: uX.length === 0,
            });
          }
          if (uX.length) {
            traces.push({
              type: 'scattergl', mode: 'markers', name: g,
              x: uX, y: uY, customdata: uI, text: uT,
              marker: { color: theme.unmarkedColor || '#888', size: sizeBy ? uS : pointSize, opacity: theme.unmarkedOpacity },
              legendgroup: g, showlegend: mX.length === 0,
            });
          }
        } else {
          traces.push({
            type: 'scattergl', mode: 'markers', name: g,
            x: grp.x, y: grp.y, customdata: grp.idx, text: grp.text,
            marker: {
              color: baseColor, size: sizeBy ? grp.sizes : pointSize,
              opacity: 0.85, line: { width: 1, color: 'rgba(255,255,255,0.15)' },
            },
          });
        }
      });
    } else if (splitMarking) {
      // No colorBy, but we have marking to split
      var marked = { x: [], y: [], customdata: [], text: [] };
      var unmarked = { x: [], y: [], customdata: [], text: [] };
      rows.forEach(function (r) {
        var bucket = mm.isMarked(r.__rowIndex) ? marked : unmarked;
        bucket.x.push(r[cfg.x]);
        bucket.y.push(r[cfg.y]);
        bucket.customdata.push(r.__rowIndex);
        bucket.text.push(r.Name || r.name || '');
      });

      traces.push({
        type: 'scattergl', mode: 'markers', name: 'Selected',
        x: marked.x, y: marked.y, customdata: marked.customdata, text: marked.text,
        marker: { color: theme.marking, size: pointSize + 2, opacity: 1, line: { width: 1, color: 'rgba(255,255,255,0.3)' } },
      });
      traces.push({
        type: 'scattergl', mode: 'markers', name: 'Other',
        x: unmarked.x, y: unmarked.y, customdata: unmarked.customdata, text: unmarked.text,
        marker: { color: theme.unmarkedColor || '#888', size: pointSize, opacity: theme.unmarkedOpacity },
      });
    } else {
      // Single trace, no color grouping, no marking split
      var x = [], y = [], idx = [], text = [];
      rows.forEach(function (r) {
        x.push(r[cfg.x]); y.push(r[cfg.y]); idx.push(r.__rowIndex);
        text.push(r.Name || r.name || '');
      });
      traces.push({
        type: 'scattergl', mode: 'markers',
        x: x, y: y, customdata: idx, text: text,
        marker: { color: theme.palette[0], size: pointSize, opacity: 0.85, line: { width: 1, color: 'rgba(255,255,255,0.15)' } },
      });
    }

    var layout = ThemeManager.getPlotlyLayout({
      xaxis: { title: { text: cfg.x } },
      yaxis: { title: { text: cfg.y } },
      dragmode: 'select',
    });

    var div = this._getPlotDiv();
    Plotly.react(div, traces, layout, this._plotlyConfig());
  }

  _onMarkingChanged() { this.refresh(); }

  _bindEvents() {
    var self = this;
    var div = this._getPlotDiv();

    div.on('plotly_selected', function (data) {
      if (!data || !data.points) { return; }
      var indices = data.points.map(function (p) { return p.customdata; }).filter(function (v) { return v != null; });
      if (indices.length === 0) return;
      self._mm.setMarking(indices, self._id);
    });

    div.on('plotly_click', function (data) {
      if (!data || !data.points || !data.points[0]) return;
      var idx = data.points[0].customdata;
      if (idx == null) return;
      if (data.event && data.event.shiftKey) {
        self._mm.addToMarking([idx], self._id);
      } else if (data.event && data.event.ctrlKey) {
        self._mm.toggleMarking([idx], self._id);
      } else {
        self._mm.setMarking([idx], self._id);
      }
    });

    div.on('plotly_deselect', function () {
      self._mm.clearMarking(self._id);
    });
  }
}
// ─── LineChart ──────────────────────────────────────────────
class LineChart extends BaseChart {
  constructor(selector, dataStore, config) {
    super(selector, dataStore, config);
    this.refresh();
    this._bindEvents();
  }

  refresh() {
    if (this._renderEmptyIfLimited()) return;
    var cfg = this._config;
    var theme = ThemeManager.getTheme();
    var rows = this._getLimitedRows();
    var hasMarking = this._mm.hasMarking();
    var mm = this._mm;

    // showOnlyMarked: empty state
    if (cfg.showOnlyMarked && !hasMarking) {
      var emptyLayout = ThemeManager.getPlotlyLayout({
        xaxis: { title: { text: cfg.x } },
        yaxis: { title: { text: Array.isArray(cfg.y) ? cfg.y.join(', ') : cfg.y } },
        annotations: [{
          text: 'Select data in another chart to display',
          xref: 'paper', yref: 'paper', x: 0.5, y: 0.5,
          showarrow: false, font: { size: 14, color: theme.textMuted },
        }],
      });
      Plotly.react(this._getPlotDiv(), [], emptyLayout, this._plotlyConfig());
      return;
    }

    // showOnlyMarked: filter to marked rows
    if (cfg.showOnlyMarked && hasMarking) {
      rows = rows.filter(function (r) { return mm.isMarked(r.__rowIndex); });
      hasMarking = false;
    }

    var xCol = cfg.x;
    var yCols = Array.isArray(cfg.y) ? cfg.y : [cfg.y];
    var groupBy = cfg.groupBy;
    var smooth = cfg.smooth !== false;
    var showArea = cfg.showArea || false;

    var traces = [];

    // Sort by x
    rows = rows.slice().sort(function (a, b) {
      var va = a[xCol], vb = b[xCol];
      if (va < vb) return -1;
      if (va > vb) return 1;
      return 0;
    });

    if (groupBy) {
      var groups = {};
      rows.forEach(function (r) {
        var g = String(r[groupBy] || 'Other');
        if (!groups[g]) groups[g] = [];
        groups[g].push(r);
      });

      var groupNames = Object.keys(groups).sort();
      groupNames.forEach(function (g, gi) {
        var gRows = groups[g];
        var color = theme.palette[gi % theme.palette.length];
        yCols.forEach(function (yCol) {
          var tr = {
            type: 'scatter',
            mode: 'lines' + (cfg.showMarkers ? '+markers' : ''),
            name: groupBy ? g : yCol,
            x: gRows.map(function (r) { return r[xCol]; }),
            y: gRows.map(function (r) { return r[yCol]; }),
            customdata: gRows.map(function (r) { return r.__rowIndex; }),
            line: { color: color, width: 2, shape: smooth ? 'spline' : 'linear' },
          };
          if (showArea) { tr.fill = 'tozeroy'; tr.fillcolor = color + '20'; }
          if (hasMarking) {
            var anyMarked = gRows.some(function (r) { return mm.isMarked(r.__rowIndex); });
            if (!anyMarked) { tr.line.color = theme.unmarkedColor || '#888'; tr.opacity = theme.unmarkedOpacity; }
          }
          traces.push(tr);
        });
      });
    } else {
      yCols.forEach(function (yCol, yi) {
        var color = theme.palette[yi % theme.palette.length];
        var tr = {
          type: 'scatter',
          mode: 'lines' + (cfg.showMarkers ? '+markers' : ''),
          name: yCol,
          x: rows.map(function (r) { return r[xCol]; }),
          y: rows.map(function (r) { return r[yCol]; }),
          customdata: rows.map(function (r) { return r.__rowIndex; }),
          line: { color: color, width: 2, shape: smooth ? 'spline' : 'linear' },
        };
        if (showArea) { tr.fill = 'tozeroy'; tr.fillcolor = color + '20'; }
        traces.push(tr);
      });
    }

    var layout = ThemeManager.getPlotlyLayout({
      xaxis: { title: { text: xCol } },
      yaxis: { title: { text: yCols.join(', ') } },
    });

    Plotly.react(this._getPlotDiv(), traces, layout, this._plotlyConfig());
  }

  _onMarkingChanged() { this.refresh(); }

  _bindEvents() {
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      if (!data || !data.points || !data.points[0]) return;
      var idx = data.points[0].customdata;
      if (idx == null) return;
      if (data.event && data.event.shiftKey) self._mm.addToMarking([idx], self._id);
      else if (data.event && data.event.ctrlKey) self._mm.toggleMarking([idx], self._id);
      else self._mm.setMarking([idx], self._id);
    });
    div.on('plotly_selected', function (data) {
      if (!data || !data.points) return;
      var indices = data.points.map(function (p) { return p.customdata; }).filter(function (v) { return v != null; });
      if (indices.length) self._mm.setMarking(indices, self._id);
    });
  }
}
// ─── PieChart ───────────────────────────────────────────────
class PieChart extends BaseChart {
  constructor(selector, dataStore, config) {
    super(selector, dataStore, config);
    this.refresh();
    this._bindEvents();
  }

  refresh() {
    if (this._renderEmptyIfLimited()) return;
    var cfg = this._config;
    var theme = ThemeManager.getTheme();
    var rows = this._getLimitedRows();
    var hasMarking = this._mm.hasMarking();
    var mm = this._mm;

    // showOnlyMarked: empty state
    if (cfg.showOnlyMarked && !hasMarking) {
      var emptyLayout = ThemeManager.getPlotlyLayout({
        annotations: [{
          text: 'Select data in another chart to display',
          xref: 'paper', yref: 'paper', x: 0.5, y: 0.5,
          showarrow: false, font: { size: 14, color: theme.textMuted },
        }],
      });
      Plotly.react(this._getPlotDiv(), [], emptyLayout, this._plotlyConfig());
      return;
    }

    // showOnlyMarked: filter to marked rows
    if (cfg.showOnlyMarked && hasMarking) {
      rows = rows.filter(function (r) { return mm.isMarked(r.__rowIndex); });
      hasMarking = false;
    }

    var cat = cfg.category;
    var val = cfg.value;
    var agg = cfg.aggregation || 'sum';

    // Aggregate
    var groups = {};
    var groupRows = {};
    rows.forEach(function (r) {
      var key = String(r[cat] || 'Unknown');
      if (!groups[key]) { groups[key] = []; groupRows[key] = []; }
      groups[key].push(+r[val] || 0);
      groupRows[key].push(r.__rowIndex);
    });

    var labels = Object.keys(groups);
    var values = labels.map(function (k) {
      var arr = groups[k];
      if (agg === 'sum') return arr.reduce(function (a, b) { return a + b; }, 0);
      if (agg === 'avg') return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
      if (agg === 'count') return arr.length;
      if (agg === 'min') return Math.min.apply(null, arr);
      if (agg === 'max') return Math.max.apply(null, arr);
      return arr.reduce(function (a, b) { return a + b; }, 0);
    });

    var colors;
    if (hasMarking) {
      colors = labels.map(function (k, i) {
        var anyMarked = groupRows[k].some(function (ri) { return mm.isMarked(ri); });
        return anyMarked ? theme.palette[i % theme.palette.length] : (theme.unmarkedColor || '#888');
      });
    } else {
      colors = labels.map(function (_, i) { return theme.palette[i % theme.palette.length]; });
    }

    var trace = {
      type: 'pie',
      labels: labels,
      values: values,
      marker: {
        colors: colors,
        line: { color: theme.panelBg, width: 2 },
      },
      hole: cfg.hole != null ? cfg.hole : 0.45,
      textinfo: cfg.showPercent !== false ? 'percent+label' : 'label',
      textfont: { size: 11, color: theme.textPrimary },
      hoverinfo: 'label+value+percent',
      customdata: labels.map(function (k) { return groupRows[k]; }),
      sort: false,
    };

    if (hasMarking) {
      trace.pull = labels.map(function (k) {
        var anyMarked = groupRows[k].some(function (ri) { return mm.isMarked(ri); });
        return anyMarked ? 0.05 : 0;
      });
      trace.opacity = labels.map(function (k) {
        var anyMarked = groupRows[k].some(function (ri) { return mm.isMarked(ri); });
        return anyMarked ? 1 : theme.unmarkedOpacity + 0.2;
      });
    }

    var layout = ThemeManager.getPlotlyLayout({
      showlegend: true,
      legend: { orientation: 'v', x: 1.02, y: 0.5, xanchor: 'left' },
      margin: { t: 40, r: 120, b: 40, l: 40 },
    });

    Plotly.react(this._getPlotDiv(), [trace], layout, this._plotlyConfig());
  }

  _onMarkingChanged() { this.refresh(); }

  _bindEvents() {
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      if (!data || !data.points || !data.points[0]) return;
      var pt = data.points[0];
      var rowIndices = pt.customdata;
      if (!rowIndices) return;
      if (data.event && data.event.shiftKey) self._mm.addToMarking(rowIndices, self._id);
      else if (data.event && data.event.ctrlKey) self._mm.toggleMarking(rowIndices, self._id);
      else self._mm.setMarking(rowIndices, self._id);
    });
  }
}
// ─── HeatMap ────────────────────────────────────────────────
class HeatMap extends BaseChart {
  constructor(selector, dataStore, config) {
    super(selector, dataStore, config);
    this.refresh();
    this._bindEvents();
  }

  refresh() {
    if (this._renderEmptyIfLimited()) return;
    var cfg = this._config;
    var theme = ThemeManager.getTheme();
    var rows = this._getLimitedRows();
    var mm = this._mm;
    var hasMarking = mm.hasMarking();

    // showOnlyMarked: empty state
    if (cfg.showOnlyMarked && !hasMarking) {
      var emptyLayout = ThemeManager.getPlotlyLayout({
        xaxis: { title: { text: cfg.x }, type: 'category' },
        yaxis: { title: { text: cfg.y }, type: 'category' },
        annotations: [{
          text: 'Select data in another chart to display',
          xref: 'paper', yref: 'paper', x: 0.5, y: 0.5,
          showarrow: false, font: { size: 14, color: theme.textMuted },
        }],
      });
      Plotly.react(this._getPlotDiv(), [], emptyLayout, this._plotlyConfig());
      return;
    }

    // showOnlyMarked: filter to marked rows
    if (cfg.showOnlyMarked && hasMarking) {
      rows = rows.filter(function (r) { return mm.isMarked(r.__rowIndex); });
      hasMarking = false;
    }

    var xCol = cfg.x;
    var yCol = cfg.y;
    var valCol = cfg.value;
    var agg = cfg.aggregation || 'avg';

    // Get unique X and Y values
    var xVals = []; var yVals = [];
    var xSet = {}; var ySet = {};
    rows.forEach(function (r) {
      var xv = String(r[xCol] || '');
      var yv = String(r[yCol] || '');
      if (!xSet[xv]) { xSet[xv] = true; xVals.push(xv); }
      if (!ySet[yv]) { ySet[yv] = true; yVals.push(yv); }
    });

    // Build grid
    var grid = {};
    var gridRows = {};
    rows.forEach(function (r) {
      var xv = String(r[xCol] || '');
      var yv = String(r[yCol] || '');
      var key = xv + '||' + yv;
      if (!grid[key]) { grid[key] = []; gridRows[key] = []; }
      grid[key].push(+r[valCol] || 0);
      gridRows[key].push(r.__rowIndex);
    });

    var z = [];
    var textVals = [];
    var customdata = [];
    yVals.forEach(function (yv) {
      var row = [];
      var txtRow = [];
      var cdRow = [];
      xVals.forEach(function (xv) {
        var key = xv + '||' + yv;
        var arr = grid[key] || [];
        var val = 0;
        if (arr.length > 0) {
          if (agg === 'avg') val = arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
          else if (agg === 'sum') val = arr.reduce(function (a, b) { return a + b; }, 0);
          else if (agg === 'count') val = arr.length;
          else if (agg === 'min') val = Math.min.apply(null, arr);
          else if (agg === 'max') val = Math.max.apply(null, arr);
        }
        row.push(val);
        txtRow.push(val ? val.toFixed(1) : '');
        cdRow.push(gridRows[key] || []);
      });
      z.push(row);
      textVals.push(txtRow);
      customdata.push(cdRow);
    });

    var colorscale = theme.sequential.map(function (c, i, arr) {
      return [i / (arr.length - 1), c];
    });

    var trace = {
      type: 'heatmap',
      x: xVals,
      y: yVals,
      z: z,
      colorscale: colorscale,
      showscale: true,
      hovertemplate: xCol + ': %{x}<br>' + yCol + ': %{y}<br>' + valCol + ': %{z:.1f}<extra></extra>',
      customdata: customdata,
    };

    if (cfg.showValues) {
      trace.text = textVals;
      trace.texttemplate = '%{text}';
      trace.textfont = { size: 11, color: theme.textPrimary };
    }

    // If marking, add overlay annotations
    var layout = ThemeManager.getPlotlyLayout({
      xaxis: { title: { text: xCol }, type: 'category' },
      yaxis: { title: { text: yCol }, type: 'category', autorange: 'reversed' },
      margin: { t: 40, r: 80, b: 60, l: 80 },
    });

    if (hasMarking) {
      // Add shapes around marked cells
      var shapes = [];
      yVals.forEach(function (yv, yi) {
        xVals.forEach(function (xv, xi) {
          var key = xv + '||' + yv;
          var rws = gridRows[key] || [];
          var anyMarked = rws.some(function (ri) { return mm.isMarked(ri); });
          if (anyMarked) {
            shapes.push({
              type: 'rect',
              x0: xi - 0.5, x1: xi + 0.5,
              y0: yi - 0.5, y1: yi + 0.5,
              line: { color: theme.marking, width: 3 },
              fillcolor: 'transparent',
            });
          }
        });
      });
      layout.shapes = shapes;
    }

    Plotly.react(this._getPlotDiv(), [trace], layout, this._plotlyConfig());
  }

  _onMarkingChanged() { this.refresh(); }

  _bindEvents() {
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      if (!data || !data.points || !data.points[0]) return;
      var pt = data.points[0];
      var xi = pt.pointIndex[1] != null ? pt.pointIndex[1] : pt.x;
      var yi = pt.pointIndex[0] != null ? pt.pointIndex[0] : pt.y;

      // Get customdata for this cell
      if (pt.customdata) {
        var rowIndices = Array.isArray(pt.customdata) ? pt.customdata : [pt.customdata];
        if (data.event && data.event.shiftKey) self._mm.addToMarking(rowIndices, self._id);
        else if (data.event && data.event.ctrlKey) self._mm.toggleMarking(rowIndices, self._id);
        else self._mm.setMarking(rowIndices, self._id);
      }
    });
  }
}
// ─── DataTable ──────────────────────────────────────────────
class DataTable extends BaseChart {
  constructor(selector, dataStore, config) {
    super(selector, dataStore, Object.assign({ pageSize: 50, sortable: true, striped: true }, config));
    this._page = 0;
    this._sortCol = null;
    this._sortAsc = true;
    this.refresh();
  }

  refresh() {
    var cfg = this._config;
    var theme = ThemeManager.getTheme();
    var mm = this._mm;
    var hasMarking = mm.hasMarking();
    var rows;

    if (cfg.showOnlyMarked && hasMarking) {
      rows = this._ds.getRows({ filtered: true, markedOnly: true });
    } else {
      rows = this._getLimitedRows();
    }

    var cols = cfg.columns || this._ds.getColumnNames();
    cols = cols.filter(function (c) { return c !== '__rowIndex'; });

    // Sort
    if (this._sortCol) {
      var sc = this._sortCol;
      var asc = this._sortAsc;
      rows = rows.slice().sort(function (a, b) {
        var va = a[sc], vb = b[sc];
        if (va == null) return 1;
        if (vb == null) return -1;
        if (typeof va === 'number' && typeof vb === 'number') return asc ? va - vb : vb - va;
        var sa = String(va).toLowerCase(), sb = String(vb).toLowerCase();
        if (sa < sb) return asc ? -1 : 1;
        if (sa > sb) return asc ? 1 : -1;
        return 0;
      });
    }

    var pageSize = cfg.pageSize || 50;
    var totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    if (this._page >= totalPages) this._page = totalPages - 1;
    if (this._page < 0) this._page = 0;
    var start = this._page * pageSize;
    var pageRows = rows.slice(start, start + pageSize);

    var div = this._getPlotDiv();
    div.innerHTML = '';
    div.style.padding = '0';

    // Build table
    var wrap = document.createElement('div');
    wrap.className = 'sl-table-wrap';

    var table = document.createElement('table');
    table.className = 'sl-table';

    // Header
    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    var self = this;
    cols.forEach(function (c) {
      var th = document.createElement('th');
      th.textContent = c;
      if (self._sortCol === c) {
        th.classList.add('sl-sorted');
        var arrow = document.createElement('span');
        arrow.className = 'sl-sort';
        arrow.textContent = self._sortAsc ? ' \u25B2' : ' \u25BC';
        th.appendChild(arrow);
      } else if (cfg.sortable) {
        var arrow2 = document.createElement('span');
        arrow2.className = 'sl-sort';
        arrow2.textContent = ' \u25B2';
        th.appendChild(arrow2);
      }
      if (cfg.sortable) {
        th.addEventListener('click', function () {
          if (self._sortCol === c) {
            self._sortAsc = !self._sortAsc;
          } else {
            self._sortCol = c;
            self._sortAsc = true;
          }
          self.refresh();
        });
      }
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    // Body
    var tbody = document.createElement('tbody');
    pageRows.forEach(function (r, ri) {
      var row = document.createElement('tr');
      if (cfg.striped && ri % 2 === 1) row.classList.add('sl-striped');
      if (hasMarking && mm.isMarked(r.__rowIndex)) row.classList.add('sl-row-marked');

      cols.forEach(function (c) {
        var td = document.createElement('td');
        var v = r[c];
        if (v == null) td.textContent = '';
        else if (typeof v === 'number') td.textContent = v.toLocaleString(undefined, { maximumFractionDigits: 2 });
        else if (typeof v === 'boolean') td.textContent = v ? 'Yes' : 'No';
        else td.textContent = String(v);
        row.appendChild(td);
      });

      // Click to mark
      row.addEventListener('click', function (e) {
        var idx = r.__rowIndex;
        if (e.shiftKey) mm.addToMarking([idx], self._id);
        else if (e.ctrlKey) mm.toggleMarking([idx], self._id);
        else mm.setMarking([idx], self._id);
      });

      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    div.appendChild(wrap);

    // Pager
    if (totalPages > 1) {
      var pager = document.createElement('div');
      pager.className = 'sl-table-pager';

      var info = document.createElement('span');
      info.textContent = 'Showing ' + (start + 1) + '-' + Math.min(start + pageSize, rows.length) + ' of ' + rows.length;
      pager.appendChild(info);

      var btns = document.createElement('div');
      btns.style.display = 'flex';
      btns.style.gap = '4px';

      var prev = document.createElement('button');
      prev.textContent = '\u25C0 Prev';
      prev.disabled = this._page === 0;
      prev.addEventListener('click', function () { self._page--; self.refresh(); });

      var next = document.createElement('button');
      next.textContent = 'Next \u25B6';
      next.disabled = this._page >= totalPages - 1;
      next.addEventListener('click', function () { self._page++; self.refresh(); });

      btns.appendChild(prev);
      btns.appendChild(next);
      pager.appendChild(btns);
      div.appendChild(pager);
    }
  }

  _onMarkingChanged() { this.refresh(); }
}
// ─── ChartWrapper ───────────────────────────────────────────
var ChartWrapper = (function () {

  // Helper: create a labeled dropdown
  function _makeSelect(label, currentVal, options, onChange) {
    var select = document.createElement('select');
    select.title = label;
    select.className = 'sl-axis-select';
    options.forEach(function (opt) {
      var el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.label;
      if (opt.value === currentVal) el.selected = true;
      select.appendChild(el);
    });
    select.addEventListener('change', function () { onChange(select.value); });
    return select;
  }

  // Inject CSS once
  function _injectCSS() {
    if (document.getElementById('sl-axis-css')) return;
    var s = document.createElement('style');
    s.id = 'sl-axis-css';
    s.textContent =
      '.sl-axis-select{font-size:11px;background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:6px;color:var(--sl-text-secondary);padding:3px 6px;cursor:pointer;font-family:var(--sl-font);transition:border-color var(--sl-transition) ease;outline:none;}' +
      '.sl-axis-select:hover,.sl-axis-select:focus{border-color:var(--sl-accent);color:var(--sl-text-primary);}' +
      '.sl-chart-layout{display:flex;flex:1;min-height:0;}' +
      '.sl-y-axis-bar{display:flex;align-items:center;justify-content:center;padding:4px;min-width:0;flex-shrink:0;}' +
      '.sl-y-axis-bar select{writing-mode:vertical-lr;text-orientation:mixed;transform:rotate(180deg);max-height:100%;padding:6px 3px;}' +
      '.sl-chart-column{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;}' +
      '.sl-x-axis-bar{display:flex;align-items:center;justify-content:center;padding:4px 8px;gap:4px;border-top:1px solid var(--sl-panel-border);}' +
      '.sl-x-axis-bar .sl-axis-label{font-size:10px;color:var(--sl-text-muted);text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;}' +
      // Color sidebar
      '.sl-color-sidebar{display:flex;flex-direction:column;border-left:1px solid var(--sl-panel-border);overflow:hidden;transition:width var(--sl-transition) ease,min-width var(--sl-transition) ease,max-width var(--sl-transition) ease;width:140px;min-width:140px;max-width:140px;flex-shrink:0;}' +
      '.sl-color-sidebar.sl-collapsed{width:28px !important;min-width:28px !important;max-width:28px !important;}' +
      '.sl-color-sidebar-toggle{background:none;border:none;border-bottom:1px solid var(--sl-panel-border);color:var(--sl-text-muted);cursor:pointer;padding:6px 4px;font-size:11px;font-family:var(--sl-font);text-align:center;white-space:nowrap;transition:color var(--sl-transition) ease;}' +
      '.sl-color-sidebar-toggle:hover{color:var(--sl-text-primary);}' +
      '.sl-collapsed .sl-color-sidebar-toggle{writing-mode:vertical-lr;transform:rotate(180deg);padding:8px 6px;border-bottom:none;flex:0 0 auto;}' +
      '.sl-color-sidebar-body{flex:1;overflow-y:auto;padding:6px;}' +
      '.sl-collapsed .sl-color-sidebar-body{display:none;}' +
      '.sl-color-item{display:flex;align-items:center;gap:6px;padding:3px 4px;cursor:pointer;border-radius:4px;font-size:11px;color:var(--sl-text-secondary);transition:background var(--sl-transition) ease;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '.sl-color-item:hover{background:rgba(128,128,128,0.1);color:var(--sl-text-primary);}' +
      '.sl-color-item.sl-active{color:var(--sl-text-primary);font-weight:600;}' +
      '.sl-color-swatch{width:10px;height:10px;border-radius:3px;flex-shrink:0;}' +
      '.sl-color-label{font-size:10px;font-weight:600;color:var(--sl-text-muted);text-transform:uppercase;letter-spacing:0.5px;padding:6px 4px 3px;user-select:none;}';
    document.head.appendChild(s);
  }

  // Build the collapsible color sidebar
  function _buildColorSidebar(chartInstance, colorByKey, colOptsWithNone) {
    var cfg = chartInstance._config;
    var ds = chartInstance._ds;
    var theme = ThemeManager.getTheme();

    var sidebar = document.createElement('div');
    sidebar.className = 'sl-color-sidebar';

    // Toggle button
    var toggle = document.createElement('button');
    toggle.className = 'sl-color-sidebar-toggle';
    toggle.textContent = '\u25C0 Color';
    toggle.addEventListener('click', function () {
      var collapsed = sidebar.classList.toggle('sl-collapsed');
      // Force reflow: hide → reflow → show to recalculate flex layout
      sidebar.style.display = 'none';
      void sidebar.offsetWidth;
      sidebar.style.display = '';
      toggle.textContent = collapsed ? 'Color \u25B6' : '\u25C0 Color';
      // Tell Plotly to resize into the new space
      var plotDiv = sidebar.parentElement && sidebar.parentElement.querySelector('.sl-panel-body');
      if (plotDiv) {
        setTimeout(function () { Plotly.Plots.resize(plotDiv); }, 50);
      }
    });
    sidebar.appendChild(toggle);

    // Body
    var body = document.createElement('div');
    body.className = 'sl-color-sidebar-body';

    // Column selector dropdown
    var label = document.createElement('div');
    label.className = 'sl-color-label';
    label.textContent = 'Color by';
    body.appendChild(label);

    var select = _makeSelect('Color by', cfg[colorByKey] || '', colOptsWithNone, function (val) {
      var update = {};
      update[colorByKey] = val || null;
      chartInstance.updateConfig(update);
      _renderLegend();
    });
    select.style.width = '100%';
    select.style.marginBottom = '6px';
    body.appendChild(select);

    // Legend area — shows color swatches for current colorBy values
    var legendDiv = document.createElement('div');
    body.appendChild(legendDiv);

    function _renderLegend() {
      legendDiv.innerHTML = '';
      var currentCol = chartInstance._config[colorByKey];
      if (!currentCol) return;
      var values = ds.getColumnValues(currentCol);
      var palette = ThemeManager.getTheme().palette;
      values.forEach(function (v, i) {
        var item = document.createElement('div');
        item.className = 'sl-color-item';

        var swatch = document.createElement('div');
        swatch.className = 'sl-color-swatch';
        swatch.style.background = palette[i % palette.length];
        item.appendChild(swatch);

        var text = document.createElement('span');
        text.textContent = v;
        item.appendChild(text);

        // Click legend item to mark those rows
        item.addEventListener('click', function () {
          var rows = ds.getFilteredRows();
          var indices = [];
          rows.forEach(function (r) {
            if (String(r[currentCol]) === String(v)) indices.push(r.__rowIndex);
          });
          chartInstance._mm.setMarking(indices, chartInstance._id);
        });

        legendDiv.appendChild(item);
      });
    }

    _renderLegend();

    // Update legend on theme change
    ThemeManager.on(function () { _renderLegend(); });

    // ── Data Limited By section ──
    var limitLabel = document.createElement('div');
    limitLabel.className = 'sl-color-label';
    limitLabel.style.marginTop = '12px';
    limitLabel.style.borderTop = '1px solid var(--sl-panel-border)';
    limitLabel.style.paddingTop = '10px';
    limitLabel.textContent = 'Data limited by';
    body.appendChild(limitLabel);

    var limitSelect = document.createElement('select');
    limitSelect.className = 'sl-axis-select';
    limitSelect.title = 'Data limited by';
    limitSelect.style.width = '100%';
    limitSelect.style.marginBottom = '4px';

    function _refreshLimitDropdown() {
      var curVal = chartInstance._config.dataLimitedBy || '';
      limitSelect.innerHTML = '';
      var noneOpt = document.createElement('option');
      noneOpt.value = '';
      noneOpt.textContent = 'None';
      limitSelect.appendChild(noneOpt);

      var charts = ds.getRegisteredCharts();
      charts.forEach(function (entry) {
        if (entry.id === chartInstance._id) return; // skip self
        var opt = document.createElement('option');
        opt.value = entry.id;
        opt.textContent = entry.name;
        if (entry.id === curVal) opt.selected = true;
        limitSelect.appendChild(opt);
      });
    }

    _refreshLimitDropdown();

    // Refresh dropdown when it gets focus (in case new charts were added)
    limitSelect.addEventListener('focus', _refreshLimitDropdown);

    limitSelect.addEventListener('change', function () {
      chartInstance.updateConfig({ dataLimitedBy: limitSelect.value || null });
    });

    body.appendChild(limitSelect);

    // Status indicator
    var limitStatus = document.createElement('div');
    limitStatus.style.cssText = 'font-size:10px;color:var(--sl-text-muted);padding:2px 4px;';
    body.appendChild(limitStatus);

    // Update status on marking changes
    chartInstance._mm.on('marking-changed', function () {
      var limitBy = chartInstance._config.dataLimitedBy;
      if (!limitBy) {
        limitStatus.textContent = '';
        return;
      }
      var entry = ds._chartRegistry[limitBy];
      var sourceName = entry ? entry.name : limitBy;
      if (chartInstance._limitSet && chartInstance._limitSet.size > 0) {
        limitStatus.textContent = chartInstance._limitSet.size + ' rows from "' + sourceName + '"';
      } else {
        limitStatus.textContent = 'No selection in "' + sourceName + '"';
      }
    });

    sidebar.appendChild(body);
    return sidebar;
  }

  function wrap(container, title, chartInstance) {
    _injectCSS();

    var panel = document.createElement('div');
    panel.className = 'sl-panel';
    panel.style.height = '100%';
    panel.style.animationDelay = (ChartWrapper._count = (ChartWrapper._count || 0) + 1) * 100 + 'ms';

    // Header — title + agg + clear
    var header = document.createElement('div');
    header.className = 'sl-panel-header';

    var titleEl = document.createElement('span');
    titleEl.textContent = title || '';
    header.appendChild(titleEl);

    var actions = document.createElement('div');
    actions.className = 'sl-panel-header-actions';

    // Determine chart capabilities
    var cfg = (chartInstance && chartInstance._config) || {};
    var ds = chartInstance && chartInstance._ds;
    var cols = ds ? ds.getColumnNames() : [];
    var colOpts = cols.map(function (c) { return { value: c, label: c }; });
    var colOptsWithNone = [{ value: '', label: 'None' }].concat(colOpts);

    var isScatter = chartInstance instanceof ScatterPlot;
    var isBar = chartInstance instanceof BarChart;
    var isLine = chartInstance instanceof LineChart;
    var isPie = chartInstance instanceof PieChart;
    var isHeat = chartInstance instanceof HeatMap;
    var hasAxes = isScatter || isBar || isLine || isPie || isHeat;
    var supportsColorBy = isScatter || isBar || isLine;

    // Aggregation selector in header (bar, pie, heatmap)
    if (isBar || isPie || isHeat) {
      var aggOpts = [
        { value: 'sum', label: 'Sum' },
        { value: 'avg', label: 'Average' },
        { value: 'count', label: 'Count' },
        { value: 'min', label: 'Min' },
        { value: 'max', label: 'Max' },
      ];
      actions.appendChild(_makeSelect('Agg', cfg.aggregation || 'sum', aggOpts, function (val) {
        chartInstance.updateConfig({ aggregation: val });
      }));
    }

    // Data Limited By — header dropdown for charts WITHOUT a sidebar
    if (ds && !supportsColorBy) {
      var limitHeaderSelect = _makeSelect('Limit by', cfg.dataLimitedBy || '', [{ value: '', label: 'All data' }], function (val) {
        chartInstance.updateConfig({ dataLimitedBy: val || null });
      });
      // Populate on focus
      limitHeaderSelect.addEventListener('focus', function () {
        var curVal = chartInstance._config.dataLimitedBy || '';
        limitHeaderSelect.innerHTML = '';
        var none = document.createElement('option');
        none.value = ''; none.textContent = 'All data';
        limitHeaderSelect.appendChild(none);
        ds.getRegisteredCharts().forEach(function (entry) {
          if (entry.id === chartInstance._id) return;
          var o = document.createElement('option');
          o.value = entry.id; o.textContent = entry.name;
          if (entry.id === curVal) o.selected = true;
          limitHeaderSelect.appendChild(o);
        });
      });
      actions.appendChild(limitHeaderSelect);
    }

    // Clear marking button
    var clearBtn = document.createElement('button');
    clearBtn.textContent = '\u2715 Clear';
    clearBtn.title = 'Clear marking (Esc)';
    clearBtn.addEventListener('click', function () {
      if (chartInstance && chartInstance._mm) chartInstance._mm.clearMarking();
    });
    actions.appendChild(clearBtn);

    header.appendChild(actions);
    panel.appendChild(header);

    // Chart body area with axis selectors
    if (hasAxes && ds) {
      var layout = document.createElement('div');
      layout.className = 'sl-chart-layout';

      // Y-axis selector (left side, rotated)
      var yBar = document.createElement('div');
      yBar.className = 'sl-y-axis-bar';

      if (isScatter) {
        yBar.appendChild(_makeSelect('Y axis', cfg.y, colOpts, function (val) {
          chartInstance.updateConfig({ y: val });
        }));
      } else if (isBar || isPie) {
        yBar.appendChild(_makeSelect('Value', cfg.value, colOpts, function (val) {
          chartInstance.updateConfig({ value: val });
        }));
      } else if (isLine) {
        var curY = Array.isArray(cfg.y) ? cfg.y[0] : cfg.y;
        yBar.appendChild(_makeSelect('Y axis', curY, colOpts, function (val) {
          chartInstance.updateConfig({ y: [val] });
        }));
      } else if (isHeat) {
        yBar.appendChild(_makeSelect('Y axis', cfg.y, colOpts, function (val) {
          chartInstance.updateConfig({ y: val });
        }));
      }

      layout.appendChild(yBar);

      // Center column: plot + x-axis
      var col = document.createElement('div');
      col.className = 'sl-chart-column';

      var body = document.createElement('div');
      body.className = 'sl-panel-body';
      col.appendChild(body);

      // X-axis selector (bottom)
      var xBar = document.createElement('div');
      xBar.className = 'sl-x-axis-bar';

      if (isScatter || isLine) {
        xBar.appendChild(_makeSelect('X axis', cfg.x, colOpts, function (val) {
          chartInstance.updateConfig({ x: val });
        }));
      } else if (isBar || isPie) {
        xBar.appendChild(_makeSelect('Category', cfg.category, colOpts, function (val) {
          chartInstance.updateConfig({ category: val });
        }));
      } else if (isHeat) {
        xBar.appendChild(_makeSelect('X axis', cfg.x, colOpts, function (val) {
          chartInstance.updateConfig({ x: val });
        }));
        var lbl = document.createElement('span');
        lbl.className = 'sl-axis-label';
        lbl.textContent = 'Value:';
        xBar.appendChild(lbl);
        xBar.appendChild(_makeSelect('Value', cfg.value, colOpts, function (val) {
          chartInstance.updateConfig({ value: val });
        }));
      }

      col.appendChild(xBar);
      layout.appendChild(col);

      // Color sidebar (right side, collapsible)
      if (supportsColorBy) {
        var colorByKey = isLine ? 'groupBy' : 'colorBy';
        var sidebar = _buildColorSidebar(chartInstance, colorByKey, colOptsWithNone);
        layout.appendChild(sidebar);
      }

      panel.appendChild(layout);
    } else {
      // No axes (DataTable etc.) — simple body
      var body = document.createElement('div');
      body.className = 'sl-panel-body';
      panel.appendChild(body);
    }

    container.innerHTML = '';
    container.appendChild(panel);

    // Keyboard: Escape to clear marking
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && chartInstance && chartInstance._mm) {
        chartInstance._mm.clearMarking();
      }
    });

    return panel;
  }

  return { wrap: wrap };
})();
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
// ─── Spotlight Namespace ────────────────────────────────────
var SpottyFire = {
  DataStore: DataStore,
  MarkingManager: MarkingManager,
  FilterEngine: FilterEngine,
  FormulaEngine: FormulaEngine,

  // Charts
  BarChart: function (sel, ds, cfg) { return new BarChart(sel, ds, cfg); },
  ScatterPlot: function (sel, ds, cfg) { return new ScatterPlot(sel, ds, cfg); },
  LineChart: function (sel, ds, cfg) { return new LineChart(sel, ds, cfg); },
  PieChart: function (sel, ds, cfg) { return new PieChart(sel, ds, cfg); },
  HeatMap: function (sel, ds, cfg) { return new HeatMap(sel, ds, cfg); },
  DataTable: function (sel, ds, cfg) { return new DataTable(sel, ds, cfg); },

  // UI
  FilterPanel: function (sel, ds, cfg) { return new FilterPanel(sel, ds, cfg); },
  FormulaBar: function (sel, ds, cfg) { return new FormulaBar(sel, ds, cfg); },
  Toolbar: function (sel, ds, cfg) { return new Toolbar(sel, ds, cfg); },

  // Theme API
  setTheme: function (t) { ThemeManager.setTheme(t); },
  getTheme: function () { return ThemeManager.getTheme(); },
  getThemeNames: function () { return ThemeManager.getThemeNames(); },

  // Version
  version: '1.0.0',
};

// Also expose as Spotlight for backward compatibility
global.SpottyFire = SpottyFire;
global.Spotlight = SpottyFire;
})(typeof window !== 'undefined' ? window : this);
