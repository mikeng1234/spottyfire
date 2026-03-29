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
