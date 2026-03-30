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
    var prevName = _current.name;
    if (typeof themeOrName === 'string') {
      if (!THEMES[themeOrName]) throw new Error('Unknown theme: ' + themeOrName);
      _current = THEMES[themeOrName];
    } else if (themeOrName && typeof themeOrName === 'object') {
      _current = Object.assign({}, THEMES.midnight, themeOrName);
    }
    _applyCSS(_current);
    _emit();

    var newName = _current.name;
    if (typeof UndoManager !== 'undefined') {
      UndoManager.push({
        type: 'theme',
        label: 'Theme: ' + newName,
        undo: function () { setTheme(prevName); },
        redo: function () { setTheme(newName); },
      });
    }
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
        '.sl-cog-menu{position:absolute;right:0;top:100%;background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.3);padding:6px 0;min-width:180px;z-index:100;}' +
        '.sl-cog-item{display:flex;align-items:center;gap:6px;padding:6px 12px;font-size:12px;color:var(--sl-text-secondary);cursor:pointer;transition:background 150ms ease;white-space:nowrap;}' +
        '.sl-cog-item:hover{background:rgba(128,128,128,0.1);color:var(--sl-text-primary);}' +
        '.sl-cog-item input{accent-color:var(--sl-accent);}' +
        '.sl-fullscreen{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;z-index:9999!important;border-radius:0!important;height:100vh!important;width:100vw!important;margin:0!important;}' +
        '@media print{body{background:#fff!important;color:#000!important;}.sl-panel{break-inside:avoid;box-shadow:none!important;border:1px solid #ccc!important;page-break-inside:avoid;}.sl-panel-header-actions,.sl-toolbar,.sl-formula-bar,.sl-filter-panel,.sl-column-panel,.sl-color-sidebar,.sl-y-axis-bar,.sl-x-axis-bar,.sl-table-pager button,.sl-fullscreen,.filter-sidebar,.sidebar-left,.sidebar-right,.sidebar-tab{display:none!important;}.sl-panel-body{padding:4px!important;}.sl-table th,.sl-table td{border:1px solid #ccc!important;color:#000!important;}.sl-panel-header{border-bottom:1px solid #ccc!important;color:#000!important;}}' +
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
        '.sl-filter-range{width:100%;accent-color:var(--sl-accent);display:none;}' +
        '.sl-dualrange{position:relative;height:20px;cursor:pointer;user-select:none;touch-action:none;}' +
        '.sl-dualrange::before{content:"";position:absolute;top:8px;left:0;right:0;height:4px;background:var(--sl-panel-border);border-radius:2px;}' +
        '.sl-dualrange-fill{position:absolute;top:8px;height:4px;background:var(--sl-accent);border-radius:2px;pointer-events:none;}' +
        '.sl-dualrange-thumb{position:absolute;top:4px;width:12px;height:12px;background:var(--sl-accent);border:2px solid var(--sl-panel-bg);border-radius:50%;transform:translateX(-50%);cursor:grab;transition:box-shadow 150ms ease,transform 150ms ease;z-index:2;box-shadow:0 1px 4px rgba(0,0,0,0.3);}' +
        '.sl-dualrange-thumb:hover{transform:translateX(-50%) scale(1.3);box-shadow:0 0 0 4px color-mix(in srgb,var(--sl-accent) 25%,transparent);}' +
        '.sl-dualrange-thumb:active{cursor:grabbing;transform:translateX(-50%) scale(1.2);}' +
        '.sl-filter-num{flex:1;width:0;background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:6px;color:var(--sl-text-primary);padding:4px 6px;font-size:11px;font-family:var(--sl-font);outline:none;transition:border-color var(--sl-transition) ease;-moz-appearance:textfield;}' +
        '.sl-filter-num:focus{border-color:var(--sl-accent);}' +
        '.sl-filter-num::-webkit-inner-spin-button,.sl-filter-num::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}' +
        '.sl-toolbar{display:flex;align-items:center;gap:8px;padding:8px 0;}' +
        '.sl-toolbar button,.sl-toolbar select{background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:8px;color:var(--sl-text-primary);padding:6px 14px;font-size:12px;cursor:pointer;transition:all var(--sl-transition) ease;font-family:var(--sl-font);}' +
        '.sl-toolbar button:hover:not(:disabled),.sl-toolbar select:hover{border-color:var(--sl-accent);}' +
        '.sl-toolbar button:disabled{opacity:0.3;cursor:default;}' +
        '.sl-formula-bar{display:flex;gap:8px;align-items:center;padding:8px 0;}' +
        '.sl-formula-input{flex:1;background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:8px;color:var(--sl-text-primary);padding:8px 12px;font-size:13px;font-family:monospace;outline:none;transition:border-color var(--sl-transition) ease;}' +
        '.sl-formula-input:focus{border-color:var(--sl-accent);}' +
        '.sl-formula-name{background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:8px;color:var(--sl-text-primary);padding:8px 12px;font-size:13px;width:140px;outline:none;transition:border-color var(--sl-transition) ease;}' +
        '.sl-formula-name:focus{border-color:var(--sl-accent);}' +
        '.sl-column-panel{background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:12px;box-shadow:var(--sl-panel-shadow);padding:12px;overflow-y:auto;font-size:13px;color:var(--sl-text-primary);}' +
        '.sl-colpanel-title{font-size:14px;font-weight:700;margin-bottom:12px;color:var(--sl-text-primary);}' +
        '.sl-colpanel-item{padding:8px 0;border-bottom:1px solid var(--sl-panel-border);}' +
        '.sl-colpanel-item:last-child{border-bottom:none;}' +
        '.sl-colpanel-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}' +
        '.sl-colpanel-name{font-size:12px;font-weight:600;color:var(--sl-text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}' +
        '.sl-colpanel-badge{font-size:9px;font-weight:700;color:#fff;padding:1px 5px;border-radius:3px;letter-spacing:0.5px;flex-shrink:0;}' +
        '.sl-colpanel-format-row{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:4px;}' +
        '.sl-colpanel-select{background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:5px;color:var(--sl-text-secondary);padding:2px 4px;font-size:10px;cursor:pointer;font-family:var(--sl-font);outline:none;transition:border-color var(--sl-transition) ease;}' +
        '.sl-colpanel-select:hover,.sl-colpanel-select:focus{border-color:var(--sl-accent);color:var(--sl-text-primary);}' +
        '.sl-colpanel-preview{font-size:11px;color:var(--sl-accent);font-family:monospace;padding:2px 0;}' +
        '.sl-dataset-panel{padding:4px 0;}' +
        '.sl-dataset-title{font-size:14px;font-weight:700;padding:8px 12px;color:var(--sl-text-primary);}' +
        '.sl-dataset-item{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;cursor:pointer;border-left:3px solid transparent;transition:all var(--sl-transition) ease;}' +
        '.sl-dataset-item:hover{background:rgba(128,128,128,0.07);}' +
        '.sl-dataset-active{border-left-color:var(--sl-accent);background:rgba(128,128,128,0.05);}' +
        '.sl-dataset-active .sl-dataset-name{color:var(--sl-accent);font-weight:600;}' +
        '.sl-dataset-name{font-size:12px;color:var(--sl-text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}' +
        '.sl-dataset-badge{font-size:10px;color:var(--sl-text-muted);flex-shrink:0;}';
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
        self._emit({ markedIndices: self._marked, source: 'undo', action: 'clear' });
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
// ─── FilterEngine ───────────────────────────────────────────
class FilterEngine {
  constructor(dataStore) {
    this._ds = dataStore;
    this._filters = {};
  }

  setFilter(colName, spec) {
    var prevSpec = this._filters[colName]
      ? JSON.parse(JSON.stringify(this._filters[colName]))
      : undefined;
    var newSpec = JSON.parse(JSON.stringify(spec));
    var col = colName;

    this._filters[colName] = spec;
    this._ds._emitEvent('filter-changed', { column: colName, filter: spec });

    var self = this;
    UndoManager.push({
      type: 'filter',
      label: 'Filter ' + col,
      undo: function () {
        if (prevSpec === undefined) { delete self._filters[col]; }
        else { self._filters[col] = JSON.parse(JSON.stringify(prevSpec)); }
        self._ds._emitEvent('filter-changed', { column: col, filter: prevSpec || null });
      },
      redo: function () {
        self._filters[col] = JSON.parse(JSON.stringify(newSpec));
        self._ds._emitEvent('filter-changed', { column: col, filter: newSpec });
      },
    });
  }

  clearFilter(colName) {
    var prevSpec = this._filters[colName]
      ? JSON.parse(JSON.stringify(this._filters[colName]))
      : undefined;
    if (prevSpec === undefined) return; // nothing to clear

    delete this._filters[colName];
    this._ds._emitEvent('filter-changed', { column: colName, filter: null });

    var self = this;
    var col = colName;
    UndoManager.push({
      type: 'filter',
      label: 'Clear filter on ' + col,
      undo: function () {
        self._filters[col] = JSON.parse(JSON.stringify(prevSpec));
        self._ds._emitEvent('filter-changed', { column: col, filter: prevSpec });
      },
      redo: function () {
        delete self._filters[col];
        self._ds._emitEvent('filter-changed', { column: col, filter: null });
      },
    });
  }

  clearAll() {
    var prevFilters = JSON.parse(JSON.stringify(this._filters));
    if (Object.keys(prevFilters).length === 0) return; // nothing to clear

    this._filters = {};
    this._ds._emitEvent('filter-changed', { column: null, filter: null });

    var self = this;
    UndoManager.push({
      type: 'filter',
      label: 'Clear all filters',
      undo: function () {
        self._filters = JSON.parse(JSON.stringify(prevFilters));
        self._ds._emitEvent('filter-changed', { column: null, filter: null });
      },
      redo: function () {
        self._filters = {};
        self._ds._emitEvent('filter-changed', { column: null, filter: null });
      },
    });
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
    this._calculatedFormulas = {};  // name → formula string (for undo/redo)
    this._eventListeners = {};
    this._markingManager = new MarkingManager();
    this._filterEngine = new FilterEngine(this);
    this._chartRegistry = {};   // chartId → { id, name, instance }
    this._columnFormats = {};   // colName → { type, decimals, currency }
  }

  // ── Column Formatting ──
  setColumnFormat(colName, formatSpec) {
    this._columnFormats[colName] = formatSpec;
    this._emitEvent('format-changed', { column: colName, format: formatSpec });
  }

  getColumnFormat(colName) {
    return this._columnFormats[colName] || { type: 'auto' };
  }

  formatValue(value, colName) {
    if (value == null || value === '') return '';
    var fmt = this._columnFormats[colName];
    if (!fmt || fmt.type === 'auto') {
      // Default: use toLocaleString for numbers
      if (typeof value === 'number') return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
      return String(value);
    }
    if (typeof value !== 'number') {
      value = parseFloat(value);
      if (isNaN(value)) return String(value);
    }
    var d = fmt.decimals != null ? fmt.decimals : 2;
    switch (fmt.type) {
      case 'integer':
        return Math.round(value).toLocaleString();
      case 'decimal':
        return value.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
      case 'currency':
        var symbols = { USD: '$', PHP: '\u20B1', EUR: '\u20AC', GBP: '\u00A3', JPY: '\u00A5', KRW: '\u20A9', CNY: '\u00A5', INR: '\u20B9', BRL: 'R$', MXN: 'MX$' };
        var sym = symbols[fmt.currency] || fmt.currency || '$';
        return sym + value.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
      case 'percent':
        return value.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }) + '%';
      case 'scientific':
        return value.toExponential(d);
      default:
        return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
  }

  // Returns Plotly axis format properties for a column
  getPlotlyAxisFormat(colName) {
    var fmt = this._columnFormats[colName];
    if (!fmt || fmt.type === 'auto') return {};
    var d = fmt.decimals != null ? fmt.decimals : 2;
    var dStr = '.' + d;
    switch (fmt.type) {
      case 'integer':
        return { tickformat: ',d' };
      case 'decimal':
        return { tickformat: ',' + dStr + 'f' };
      case 'currency':
        var symbols = { USD: '$', PHP: '\u20B1', EUR: '\u20AC', GBP: '\u00A3', JPY: '\u00A5', KRW: '\u20A9', CNY: '\u00A5', INR: '\u20B9', BRL: 'R$', MXN: 'MX$' };
        var sym = symbols[fmt.currency] || fmt.currency || '$';
        return { tickprefix: sym, tickformat: ',' + dStr + 'f' };
      case 'percent':
        return { ticksuffix: '%', tickformat: ',' + dStr + 'f' };
      case 'scientific':
        return { tickformat: dStr + 'e' };
      default:
        return {};
    }
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
          UndoManager.clear();
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
    UndoManager.clear();
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
    this._calculatedFormulas[name] = formula;
    this._emitEvent('column-added', { name: name });

    var self = this;
    UndoManager.push({
      type: 'calculatedColumn',
      label: 'Add column "' + name + '"',
      undo: function () { self.removeCalculatedColumn(name); },
      redo: function () { self.addCalculatedColumn(name, formula); },
    });
  }

  removeCalculatedColumn(name) {
    var formulaStr = this._calculatedFormulas[name] || null;
    delete this._calculatedCols[name];
    delete this._calculatedFormulas[name];
    this._rows.forEach(function (r) { delete r[name]; });
    this._columns = this._columns.filter(function (c) { return c.name !== name; });
    this._emitEvent('column-removed', { name: name });

    if (formulaStr) {
      var self = this;
      UndoManager.push({
        type: 'calculatedColumn',
        label: 'Remove column "' + name + '"',
        undo: function () { self.addCalculatedColumn(name, formulaStr); },
        redo: function () { self.removeCalculatedColumn(name); },
      });
    }
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
    this._onFormat = function () { self.refresh(); };

    this._mm.on('marking-changed', this._onMarking);
    this._ds.on('filter-changed', this._onFilter);

    // Double-click empty area to clear marking (matches Plotly's reset behavior)
    // Deferred: bind after first Plotly render since .on() requires Plotly initialization
    this._dblClickBound = false;

    this._ds.on('format-changed', this._onFormat);
    ThemeManager.on(this._onTheme);
  }

  getConfig() { return Object.assign({}, this._config); }

  updateConfig(newConfig) {
    // Capture previous values for undo
    var prevConfig = {};
    for (var key in newConfig) {
      if (newConfig.hasOwnProperty(key)) {
        prevConfig[key] = this._config[key];
      }
    }

    Object.assign(this._config, newConfig);
    if (newConfig.title && this._wrapper) {
      this._wrapper.querySelector('.sl-panel-header span').textContent = newConfig.title;
    }
    // If dataLimitedBy changed, re-evaluate limit set
    if ('dataLimitedBy' in newConfig) {
      if (!newConfig.dataLimitedBy) {
        this._limitSet = null;
      } else {
        var mm = this._mm;
        if (mm.hasMarking()) {
          this._limitSet = mm.getMarkedIndices();
        } else {
          this._limitSet = new Set();
        }
      }
    }
    this.refresh();

    // Push undo command
    var self = this;
    var newCfg = JSON.parse(JSON.stringify(newConfig));
    var prevCfg = JSON.parse(JSON.stringify(prevConfig));
    UndoManager.push({
      type: 'chartConfig',
      label: 'Update ' + (self._config.title || self._id),
      undo: function () {
        if (!self._container) return;
        Object.assign(self._config, prevCfg);
        if ('dataLimitedBy' in prevCfg) {
          self._limitSet = prevCfg.dataLimitedBy ? new Set() : null;
        }
        self.refresh();
      },
      redo: function () {
        if (!self._container) return;
        Object.assign(self._config, newCfg);
        if ('dataLimitedBy' in newCfg) {
          self._limitSet = newCfg.dataLimitedBy ? new Set() : null;
        }
        self.refresh();
      },
    });
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

  // Check if a column contains numeric data
  _isNumericColumn(colName) {
    if (!colName) return false;
    var colInfo = this._ds._columns.find(function (c) { return c.name === colName; });
    if (colInfo && colInfo.type === 'number') return true;
    // Fallback: sample first 20 non-null values
    var rows = this._ds._rows;
    var numCount = 0, total = 0;
    for (var i = 0; i < rows.length && total < 20; i++) {
      var v = rows[i][colName];
      if (v == null || v === '') continue;
      total++;
      if (typeof v === 'number' || !isNaN(parseFloat(v))) numCount++;
    }
    return total > 0 && numCount / total >= 0.5;
  }

  // Render an error state on the chart
  _renderError(message, layoutOverrides) {
    var theme = ThemeManager.getTheme();
    var layout = ThemeManager.getPlotlyLayout(layoutOverrides || {});
    layout.annotations = [{
      text: '\u26A0 ' + message,
      xref: 'paper', yref: 'paper', x: 0.5, y: 0.5,
      showarrow: false,
      font: { size: 13, color: theme.marking || '#f43f5e' },
    }];
    Plotly.react(this._getPlotDiv(), [], layout, this._plotlyConfig());
    return true;
  }

  // Validate that value/Y columns are numeric; render error if not
  _validateNumericAxis(colName, axisLabel) {
    if (!colName) return false;
    if (this._isNumericColumn(colName)) return false; // valid
    this._renderError('"' + colName + '" is not a numeric column.\nSelect a numeric column for ' + (axisLabel || 'this axis') + '.');
    return true; // had error
  }

  // Bind double-click to clear after Plotly has initialized the div
  _bindPlotlyDeselect() {
    if (this._dblClickBound) return;
    var plotDiv = this._getPlotDiv();
    if (plotDiv && plotDiv.on) {
      var self = this;
      plotDiv.on('plotly_doubleclick', function () {
        if (self._mm.hasMarking()) {
          self._mm.clearMarking(self._id);
        }
      });
      this._dblClickBound = true;
    }
  }

  // Build tooltip text for a row using config.tooltipColumns or defaults
  _buildTooltip(row) {
    var cfg = this._config;
    var ds = this._ds;
    var cols = cfg.tooltipColumns;
    if (!cols) {
      // Default: show name/label-like columns
      return row.Name || row.name || row.Label || row.label || row.Product || row.product || '';
    }
    return cols.map(function (c) {
      var v = row[c];
      var formatted = ds.formatValue(v, c);
      return c + ': ' + formatted;
    }).join('<br>');
  }

  // Build tooltip array for a set of rows
  _buildTooltips(rows) {
    var self = this;
    var cfg = this._config;
    if (!cfg.tooltipColumns) {
      return rows.map(function (r) { return r.Name || r.name || r.Label || r.label || r.Product || r.product || ''; });
    }
    return rows.map(function (r) { return self._buildTooltip(r); });
  }

  // Apply column format to a Plotly axis layout object
  _applyAxisFormat(axisLayout, colName) {
    var fmt = this._ds.getPlotlyAxisFormat(colName);
    if (fmt.tickformat) axisLayout.tickformat = fmt.tickformat;
    if (fmt.tickprefix) axisLayout.tickprefix = fmt.tickprefix;
    if (fmt.ticksuffix) axisLayout.ticksuffix = fmt.ticksuffix;
    return axisLayout;
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
    this._ds.off('format-changed', this._onFormat);
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
    if (cfg.aggregation !== 'count' && this._validateNumericAxis(cfg.value, 'Value')) return;
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

    if (cfg.showOnlyMarked && hasMarking) {
      rows = rows.filter(function (r) { return mm.isMarked(r.__rowIndex); });
      hasMarking = false;
    }

    var traces = [];

    function _agg(arr) {
      if (arr.length === 0) return 0;
      if (agg === 'sum') return arr.reduce(function (a, b) { return a + b; }, 0);
      if (agg === 'avg') return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
      if (agg === 'count') return arr.length;
      if (agg === 'min') return Math.min.apply(null, arr);
      if (agg === 'max') return Math.max.apply(null, arr);
      return arr.reduce(function (a, b) { return a + b; }, 0);
    }

    // Get unique categories
    var catSet = {};
    rows.forEach(function (r) { catSet[String(r[cat] || 'Unknown')] = true; });
    var categories = Object.keys(catSet);

    if (colorBy && colorBy !== cat) {
      // ── Stacked bar: one trace per colorBy value ──
      var colorValues = {};
      rows.forEach(function (r) { colorValues[String(r[colorBy] || 'Other')] = true; });
      var colorKeys = Object.keys(colorValues);

      // Build a grid: [colorKey][category] → { vals:[], indices:[] }
      var grid = {};
      colorKeys.forEach(function (ck) {
        grid[ck] = {};
        categories.forEach(function (c) { grid[ck][c] = { vals: [], indices: [] }; });
      });
      rows.forEach(function (r) {
        var c = String(r[cat] || 'Unknown');
        var ck = String(r[colorBy] || 'Other');
        grid[ck][c].vals.push(+r[val] || 0);
        grid[ck][c].indices.push(r.__rowIndex);
      });

      colorKeys.forEach(function (ck, ci) {
        var baseColor = theme.palette[ci % theme.palette.length];
        var aggVals = categories.map(function (c) { return _agg(grid[ck][c].vals); });
        var rowIndices = categories.map(function (c) { return grid[ck][c].indices; });

        if (hasMarking) {
          // Split each segment into marked/unmarked
          var markedVals = [];
          var unmarkedVals = [];
          categories.forEach(function (c) {
            var cell = grid[ck][c];
            var mSum = 0, mCount = 0, uSum = 0, uCount = 0;
            cell.indices.forEach(function (ri, j) {
              if (mm.isMarked(ri)) { mCount++; mSum += cell.vals[j]; }
              else { uCount++; uSum += cell.vals[j]; }
            });
            markedVals.push(_agg(mCount > 0 ? (agg === 'count' ? new Array(mCount) : [mSum]) : []));
            unmarkedVals.push(_agg(uCount > 0 ? (agg === 'count' ? new Array(uCount) : [uSum]) : []));
          });

          // Marked trace
          var mTrace = { type: 'bar', name: ck, legendgroup: ck, showlegend: true,
            marker: { color: baseColor, opacity: 1, line: { width: 0 } },
            customdata: rowIndices, hoverinfo: 'x+y+name' };
          var uTrace = { type: 'bar', name: ck, legendgroup: ck, showlegend: false,
            marker: { color: theme.unmarkedColor || '#888', opacity: theme.unmarkedOpacity, line: { width: 0 } },
            customdata: rowIndices, hoverinfo: 'x+y+name' };

          if (orientation === 'horizontal') {
            mTrace.y = categories; mTrace.x = markedVals; mTrace.orientation = 'h';
            uTrace.y = categories; uTrace.x = unmarkedVals; uTrace.orientation = 'h';
          } else {
            mTrace.x = categories; mTrace.y = markedVals;
            uTrace.x = categories; uTrace.y = unmarkedVals;
          }
          traces.push(mTrace);
          traces.push(uTrace);
        } else {
          var trace = { type: 'bar', name: ck,
            marker: { color: baseColor, opacity: 0.9, line: { width: 0 } },
            customdata: rowIndices, hoverinfo: 'x+y+name' };

          if (orientation === 'horizontal') {
            trace.y = categories; trace.x = aggVals; trace.orientation = 'h';
          } else {
            trace.x = categories; trace.y = aggVals;
          }
          traces.push(trace);
        }
      });
    } else if (hasMarking) {
      // ── No colorBy, but has marking → split into marked/unmarked ──
      var groupRows = {};
      var groups = {};
      rows.forEach(function (r) {
        var key = String(r[cat] || 'Unknown');
        if (!groups[key]) { groups[key] = []; groupRows[key] = []; }
        groups[key].push(+r[val] || 0);
        groupRows[key].push(r.__rowIndex);
      });

      var markedVals = [];
      var unmarkedVals = [];
      categories.forEach(function (k) {
        var mCount = 0, mSum = 0, uCount = 0, uSum = 0;
        groupRows[k].forEach(function (ri, j) {
          if (mm.isMarked(ri)) { mCount++; mSum += groups[k][j]; }
          else { uCount++; uSum += groups[k][j]; }
        });
        var mv = agg === 'count' ? mCount : agg === 'avg' ? (mCount ? mSum / mCount : 0) : mSum;
        var uv = agg === 'count' ? uCount : agg === 'avg' ? (uCount ? uSum / uCount : 0) : uSum;
        markedVals.push(mCount > 0 ? mv : 0);
        unmarkedVals.push(uCount > 0 ? uv : 0);
      });

      var markedTrace = { type: 'bar', name: 'Selected',
        marker: { color: theme.marking, opacity: 1, line: { width: 0 } },
        customdata: categories.map(function (k) { return groupRows[k]; }), hoverinfo: 'x+y' };
      var unmarkedTrace = { type: 'bar', name: 'Other',
        marker: { color: theme.unmarkedColor || '#888', opacity: theme.unmarkedOpacity },
        customdata: categories.map(function (k) { return groupRows[k]; }), hoverinfo: 'x+y' };

      if (orientation === 'horizontal') {
        markedTrace.y = categories; markedTrace.x = markedVals; markedTrace.orientation = 'h';
        unmarkedTrace.y = categories; unmarkedTrace.x = unmarkedVals; unmarkedTrace.orientation = 'h';
      } else {
        markedTrace.x = categories; markedTrace.y = markedVals;
        unmarkedTrace.x = categories; unmarkedTrace.y = unmarkedVals;
      }
      traces = [markedTrace, unmarkedTrace];
    } else {
      // ── No colorBy, no marking → simple colored bars ──
      var groupRows = {};
      var groups = {};
      rows.forEach(function (r) {
        var key = String(r[cat] || 'Unknown');
        if (!groups[key]) { groups[key] = []; groupRows[key] = []; }
        groups[key].push(+r[val] || 0);
        groupRows[key].push(r.__rowIndex);
      });

      var values = categories.map(function (k) { return _agg(groups[k]); });
      var colors = categories.map(function (_, i) { return theme.palette[i % theme.palette.length]; });
      var trace = {
        type: 'bar',
        marker: { color: colors, line: { width: 0 }, opacity: 0.9 },
        customdata: categories.map(function (k) { return groupRows[k]; }),
        hoverinfo: 'x+y',
      };

      if (orientation === 'horizontal') {
        trace.y = categories; trace.x = values; trace.orientation = 'h';
      } else {
        trace.x = categories; trace.y = values;
      }

      if (cfg.showValues) {
        var ds = this._ds;
        var valCol = cfg.value;
        trace.text = values.map(function (v) { return ds.formatValue(v, valCol); });
        trace.textposition = 'outside';
        trace.textfont = { size: 11, color: theme.textSecondary };
      }
      traces = [trace];
    }

    var layout = ThemeManager.getPlotlyLayout({
      barmode: (colorBy || hasMarking) ? 'stack' : 'group',
      showlegend: !!(colorBy || hasMarking),
    });
    // Apply column format to value axis
    if (orientation === 'horizontal') {
      this._applyAxisFormat(layout.xaxis, val);
      layout.yaxis.automargin = true;
    } else {
      this._applyAxisFormat(layout.yaxis, val);
    }

    Plotly.react(this._getPlotDiv(), traces, layout, this._plotlyConfig());
  }

  _onMarkingChanged() {
    this.refresh();
  }

  _bindEvents() {
    this._bindPlotlyDeselect();
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      self._plotClickPending = false;
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
    if (this._validateNumericAxis(cfg.y, 'Y axis')) return;
    if (this._validateNumericAxis(cfg.x, 'X axis')) return;
    var self = this;
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
        groups[g].text.push(self._buildTooltip(r));
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
        bucket.text.push(self._buildTooltip(r));
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
        text.push(self._buildTooltip(r));
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
    this._applyAxisFormat(layout.xaxis, cfg.x);
    this._applyAxisFormat(layout.yaxis, cfg.y);

    // Apply custom tooltip template if tooltipColumns specified
    if (cfg.tooltipColumns) {
      traces.forEach(function (t) {
        t.hovertemplate = '%{text}<extra></extra>';
      });
    }

    var div = this._getPlotDiv();
    Plotly.react(div, traces, layout, this._plotlyConfig());
  }

  _onMarkingChanged() { this.refresh(); }

  _bindEvents() {
    this._bindPlotlyDeselect();
    var self = this;
    var div = this._getPlotDiv();

    div.on('plotly_selected', function (data) {
      self._plotClickPending = false;
      if (!data || !data.points) { return; }
      var indices = data.points.map(function (p) { return p.customdata; }).filter(function (v) { return v != null; });
      if (indices.length === 0) return;
      self._mm.setMarking(indices, self._id);
    });

    div.on('plotly_click', function (data) {
      self._plotClickPending = false;
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
    var yCols = Array.isArray(cfg.y) ? cfg.y : [cfg.y];
    for (var _vi = 0; _vi < yCols.length; _vi++) {
      if (this._validateNumericAxis(yCols[_vi], 'Y axis')) return;
    }
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
    this._applyAxisFormat(layout.xaxis, xCol);
    this._applyAxisFormat(layout.yaxis, yCols[0]);

    Plotly.react(this._getPlotDiv(), traces, layout, this._plotlyConfig());
  }

  _onMarkingChanged() { this.refresh(); }

  _bindEvents() {
    this._bindPlotlyDeselect();
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      self._plotClickPending = false;
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
    if (cfg.aggregation !== 'count' && this._validateNumericAxis(cfg.value, 'Value')) return;
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
    this._bindPlotlyDeselect();
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      self._plotClickPending = false;
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
    if (cfg.aggregation !== 'count' && this._validateNumericAxis(cfg.value, 'Value')) return;
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

    var ds = this._ds;
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
        txtRow.push(val ? ds.formatValue(val, valCol) : '');
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
      hovertemplate: xCol + ': %{x}<br>' + yCol + ': %{y}<br>' + valCol + ': %{text}<extra></extra>',
      customdata: customdata,
    };

    trace.text = textVals; // always set for hover
    if (cfg.showValues) {
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
    this._bindPlotlyDeselect();
    var self = this;
    var div = this._getPlotDiv();
    div.on('plotly_click', function (data) {
      self._plotClickPending = false;
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

      var ds = self._ds;
      cols.forEach(function (c) {
        var td = document.createElement('td');
        var v = r[c];
        if (v == null) td.textContent = '';
        else if (typeof v === 'boolean') td.textContent = v ? 'Yes' : 'No';
        else td.textContent = ds.formatValue(v, c);
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

  // Helper: axis dropdown that refreshes options on focus
  function _makeAxisSelect(label, getVal, chartInst, onChange) {
    var select = document.createElement('select');
    select.title = label;
    select.className = 'sl-axis-select';

    function _populate() {
      var curVal = getVal();
      select.innerHTML = '';
      var cols = chartInst._ds.getColumnNames();
      cols.forEach(function (c) {
        var el = document.createElement('option');
        el.value = c;
        el.textContent = c;
        if (c === curVal) el.selected = true;
        select.appendChild(el);
      });
    }

    _populate();
    select.addEventListener('focus', _populate);
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
      '.sl-y-axis-bar select,.sl-y-axis-bar input{writing-mode:vertical-lr;text-orientation:mixed;transform:rotate(180deg);max-height:100%;padding:6px 3px;}' +
      '.sl-chart-column{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;}' +
      '.sl-x-axis-bar{display:flex;align-items:center;justify-content:center;padding:4px 8px;gap:4px;border-top:1px solid var(--sl-panel-border);}' +
      '.sl-x-axis-bar .sl-axis-label{font-size:10px;color:var(--sl-text-muted);text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;}' +
      // Properties sidebar
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

  // Build the collapsible properties sidebar
  function _buildColorSidebar(chartInstance, colorByKey, colOptsWithNone) {
    var cfg = chartInstance._config;
    var ds = chartInstance._ds;
    var theme = ThemeManager.getTheme();

    var sidebar = document.createElement('div');
    sidebar.className = 'sl-color-sidebar';

    // Toggle button
    var toggle = document.createElement('button');
    toggle.className = 'sl-color-sidebar-toggle';
    toggle.textContent = '\u25C0 Properties';
    toggle.addEventListener('click', function () {
      var collapsed = sidebar.classList.toggle('sl-collapsed');
      // Force reflow: hide → reflow → show to recalculate flex layout
      sidebar.style.display = 'none';
      void sidebar.offsetWidth;
      sidebar.style.display = '';
      toggle.textContent = collapsed ? 'Properties \u25B6' : '\u25C0 Properties';
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

    // Data Limited By — header dropdown for ALL chart types
    if (ds) {
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

    // Fullscreen toggle
    var fsBtn = document.createElement('button');
    fsBtn.textContent = '\u26F6';
    fsBtn.title = 'Fullscreen';
    fsBtn.addEventListener('click', function () {
      var isFs = panel.classList.toggle('sl-fullscreen');
      fsBtn.textContent = isFs ? '\u2716' : '\u26F6';
      fsBtn.title = isFs ? 'Exit fullscreen' : 'Fullscreen';
      document.body.style.overflow = isFs ? 'hidden' : '';
      setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 100);
    });
    actions.appendChild(fsBtn);

    // Settings cog menu
    if (hasAxes) {
      var cogWrap = document.createElement('div');
      cogWrap.style.cssText = 'position:relative;display:inline-block;';

      var cogBtn = document.createElement('button');
      cogBtn.textContent = '\u2699';
      cogBtn.title = 'Chart settings';
      cogBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = cogMenu.style.display === 'block';
        cogMenu.style.display = open ? 'none' : 'block';
      });
      cogWrap.appendChild(cogBtn);

      var cogMenu = document.createElement('div');
      cogMenu.className = 'sl-cog-menu';
      cogMenu.style.display = 'none';

      function _addToggle(label, defaultOn, onToggle) {
        var row = document.createElement('label');
        row.className = 'sl-cog-item';
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = defaultOn;
        cb.addEventListener('change', function () { onToggle(cb.checked); });
        row.appendChild(cb);
        row.appendChild(document.createTextNode(' ' + label));
        cogMenu.appendChild(row);
        return cb;
      }

      // We'll reference these elements after they're created below
      cogWrap._toggles = {};
      cogWrap._addToggle = _addToggle;
      cogWrap.appendChild(cogMenu);
      actions.appendChild(cogWrap);

      // Close menu on outside click
      document.addEventListener('click', function () { cogMenu.style.display = 'none'; });
      cogMenu.addEventListener('click', function (e) { e.stopPropagation(); });

      panel._cogMenu = cogWrap;
    }

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
        yBar.appendChild(_makeAxisSelect('Y axis', function () { return chartInstance._config.y; }, chartInstance, function (val) {
          chartInstance.updateConfig({ y: val });
        }));
      } else if (isPie) {
        yBar.appendChild(_makeAxisSelect('Size by', function () { return chartInstance._config.value; }, chartInstance, function (val) {
          chartInstance.updateConfig({ value: val });
        }));
      } else if (isBar) {
        yBar.appendChild(_makeAxisSelect('Value', function () { return chartInstance._config.value; }, chartInstance, function (val) {
          chartInstance.updateConfig({ value: val });
        }));
      } else if (isLine) {
        yBar.appendChild(_makeAxisSelect('Y axis', function () { var y = chartInstance._config.y; return Array.isArray(y) ? y[0] : y; }, chartInstance, function (val) {
          chartInstance.updateConfig({ y: [val] });
        }));
      } else if (isHeat) {
        yBar.appendChild(_makeAxisSelect('Y axis', function () { return chartInstance._config.y; }, chartInstance, function (val) {
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
        xBar.appendChild(_makeAxisSelect('X axis', function () { return chartInstance._config.x; }, chartInstance, function (val) {
          chartInstance.updateConfig({ x: val });
        }));
      } else if (isPie) {
        xBar.appendChild(_makeAxisSelect('Slice by', function () { return chartInstance._config.category; }, chartInstance, function (val) {
          chartInstance.updateConfig({ category: val });
        }));
      } else if (isBar) {
        xBar.appendChild(_makeAxisSelect('Category', function () { return chartInstance._config.category; }, chartInstance, function (val) {
          chartInstance.updateConfig({ category: val });
        }));
      } else if (isHeat) {
        xBar.appendChild(_makeAxisSelect('X axis', function () { return chartInstance._config.x; }, chartInstance, function (val) {
          chartInstance.updateConfig({ x: val });
        }));
        var lbl = document.createElement('span');
        lbl.className = 'sl-axis-label';
        lbl.textContent = 'Value:';
        xBar.appendChild(lbl);
        xBar.appendChild(_makeAxisSelect('Value', function () { return chartInstance._config.value; }, chartInstance, function (val) {
          chartInstance.updateConfig({ value: val });
        }));
      }

      col.appendChild(xBar);
      layout.appendChild(col);

      // Properties sidebar (right side, collapsible)
      if (supportsColorBy) {
        var colorByKey = isLine ? 'groupBy' : 'colorBy';
        var sidebar = _buildColorSidebar(chartInstance, colorByKey, colOptsWithNone);
        layout.appendChild(sidebar);
      }

      panel.appendChild(layout);

      // Add settings toggles to cog menu (now that axis elements exist)
      if (panel._cogMenu) {
        var _addToggle = panel._cogMenu._addToggle;
        var plotDiv = body; // the .sl-panel-body

        _addToggle('Show X axis selector', true, function (on) {
          xBar.style.display = on ? '' : 'none';
          setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
        });

        _addToggle('Show Y axis selector', true, function (on) {
          yBar.style.display = on ? '' : 'none';
          setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
        });

        _addToggle('Show X axis label', true, function (on) {
          var curLayout = plotDiv._fullLayout;
          if (curLayout) {
            Plotly.relayout(plotDiv, { 'xaxis.showticklabels': on, 'xaxis.title.text': on ? (chartInstance._config.x || chartInstance._config.category || '') : '' });
          }
        });

        _addToggle('Show Y axis label', true, function (on) {
          var curLayout = plotDiv._fullLayout;
          if (curLayout) {
            Plotly.relayout(plotDiv, { 'yaxis.showticklabels': on, 'yaxis.title.text': on ? (chartInstance._config.y || chartInstance._config.value || '') : '' });
          }
        });
      }

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
    // Only re-render on data load, NOT on filter changes (prevents slider destruction mid-drag)
    this._ds.on('data-loaded', function () { self.render(); });
    this.render();
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
        var allBtn = document.createElement('div');
        allBtn.style.cssText = 'font-size:11px;color:var(--sl-accent);cursor:pointer;margin-bottom:4px;';
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

    // Undo / Redo buttons
    var undoBtn = document.createElement('button');
    undoBtn.textContent = '\u21A9 Undo';
    undoBtn.title = 'Undo (Ctrl+Z)';
    undoBtn.disabled = !UndoManager.canUndo();
    undoBtn.addEventListener('click', function () { UndoManager.undo(); });
    bar.appendChild(undoBtn);

    var redoBtn = document.createElement('button');
    redoBtn.textContent = '\u21AA Redo';
    redoBtn.title = 'Redo (Ctrl+Y)';
    redoBtn.disabled = !UndoManager.canRedo();
    redoBtn.addEventListener('click', function () { UndoManager.redo(); });
    bar.appendChild(redoBtn);

    UndoManager.on('changed', function () {
      undoBtn.disabled = !UndoManager.canUndo();
      redoBtn.disabled = !UndoManager.canRedo();
    });

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
  ColumnPanel: function (sel, ds, cfg) { return new ColumnPanel(sel, ds, cfg); },

  // Theme API
  setTheme: function (t) { ThemeManager.setTheme(t); },
  getTheme: function () { return ThemeManager.getTheme(); },
  getThemeNames: function () { return ThemeManager.getThemeNames(); },

  // Undo/Redo
  UndoManager: UndoManager,
  undo: function () { UndoManager.undo(); },
  redo: function () { UndoManager.redo(); },

  // ── Quick Create: auto-generates a full dashboard from data ──
  // Usage:
  //   SpottyFire.create('#app', data)
  //   SpottyFire.create('#app', data, { theme: 'obsidian', title: 'My Dashboard' })
  //   SpottyFire.create('#app', '/api/data.csv')  // CSV URL
  create: function (selector, dataOrUrl, opts) {
    opts = opts || {};
    var container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!container) throw new Error('SpottyFire.create: container not found');

    var theme = opts.theme || 'midnight';
    var title = opts.title || 'Dashboard';
    ThemeManager.setTheme(theme);

    var ds = new DataStore();

    function _build() {
      // Detect column types
      var cols = ds.getColumns().filter(function (c) { return c.name !== '__rowIndex'; });
      var numCols = cols.filter(function (c) { return c.type === 'number'; });
      var strCols = cols.filter(function (c) { return c.type === 'string'; });
      var allNames = cols.map(function (c) { return c.name; });

      // Apply user-specified formats
      if (opts.formats) {
        for (var col in opts.formats) {
          ds.setColumnFormat(col, opts.formats[col]);
        }
      }

      // Build layout
      container.innerHTML = '';
      container.style.cssText = 'display:flex;min-height:100vh;';

      // Filter sidebar (right)
      var rightBar = document.createElement('div');
      rightBar.style.cssText = 'width:220px;min-width:220px;background:var(--sl-panel-bg);border-left:1px solid var(--sl-panel-border);overflow-y:auto;order:2;';

      var filterDiv = document.createElement('div');
      rightBar.appendChild(filterDiv);

      // Main area
      var main = document.createElement('div');
      main.style.cssText = 'flex:1;padding:20px;overflow-y:auto;order:1;min-width:0;';

      // Title
      var h1 = document.createElement('h1');
      h1.style.cssText = 'font-size:22px;font-weight:700;margin:0 0 4px;color:var(--sl-text-primary);';
      h1.textContent = title;
      main.appendChild(h1);

      var sub = document.createElement('p');
      sub.style.cssText = 'font-size:13px;color:var(--sl-text-secondary);margin:0 0 16px;';
      sub.textContent = ds.getRowCount() + ' rows \u00B7 ' + cols.length + ' columns. Click charts to cross-filter.';
      main.appendChild(sub);

      // Toolbar
      var toolbarDiv = document.createElement('div');
      main.appendChild(toolbarDiv);

      // Chart grid
      var grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;';

      // Auto-pick best charts based on column types
      var chartCount = 0;

      // 1. Bar chart: first string col as category, first numeric as value
      if (strCols.length > 0 && numCols.length > 0) {
        var barDiv = document.createElement('div');
        barDiv.style.minHeight = '360px';
        grid.appendChild(barDiv);
        SpottyFire.BarChart(barDiv, ds, {
          category: strCols[0].name,
          value: numCols[0].name,
          aggregation: 'avg',
          showValues: true,
          title: 'Avg ' + numCols[0].name + ' by ' + strCols[0].name,
        });
        chartCount++;
      }

      // 2. Scatter plot: first two numeric cols
      if (numCols.length >= 2) {
        var scatterDiv = document.createElement('div');
        scatterDiv.style.minHeight = '360px';
        grid.appendChild(scatterDiv);
        SpottyFire.ScatterPlot(scatterDiv, ds, {
          x: numCols[1].name,
          y: numCols[0].name,
          colorBy: strCols.length > 0 ? strCols[0].name : null,
          pointSize: 7,
          title: numCols[1].name + ' vs ' + numCols[0].name,
        });
        chartCount++;
      }

      // 3. Pie chart: second string col (or first if only one), first numeric
      if (strCols.length > 0 && numCols.length > 0) {
        var pieDiv = document.createElement('div');
        pieDiv.style.minHeight = '360px';
        grid.appendChild(pieDiv);
        var pieCat = strCols.length > 1 ? strCols[1].name : strCols[0].name;
        SpottyFire.PieChart(pieDiv, ds, {
          category: pieCat,
          value: numCols[0].name,
          aggregation: 'sum',
          hole: 0.45,
          showPercent: true,
          title: numCols[0].name + ' by ' + pieCat,
        });
        chartCount++;
      }

      // 4. Stacked bar: if 2+ string cols, stack second on first
      if (strCols.length >= 2 && numCols.length > 0) {
        var stackDiv = document.createElement('div');
        stackDiv.style.minHeight = '360px';
        grid.appendChild(stackDiv);
        SpottyFire.BarChart(stackDiv, ds, {
          category: strCols[0].name,
          value: numCols[0].name,
          aggregation: 'sum',
          colorBy: strCols[1].name,
          title: numCols[0].name + ' by ' + strCols[0].name + ' & ' + strCols[1].name,
        });
        chartCount++;
      }

      // 5. Data table (full width)
      var tableDiv = document.createElement('div');
      tableDiv.style.cssText = 'grid-column:1/-1;height:320px;';
      grid.appendChild(tableDiv);
      SpottyFire.DataTable(tableDiv, ds, {
        columns: allNames.slice(0, 10),
        showOnlyMarked: false,
        pageSize: 20,
        title: 'Data Table',
      });

      main.appendChild(grid);
      container.appendChild(main);
      container.appendChild(rightBar);

      // Initialize UI components
      SpottyFire.Toolbar(toolbarDiv, ds, { showExport: true, showThemeToggle: true });
      SpottyFire.FilterPanel(filterDiv, ds);
    }

    // Handle data: array, CSV URL, or CSV string
    if (Array.isArray(dataOrUrl)) {
      ds.loadJSON(dataOrUrl);
      _build();
    } else if (typeof dataOrUrl === 'string') {
      ds.loadCSV(dataOrUrl).then(_build);
    }

    return ds;
  },

  // Version
  version: '1.0.0',
};

// Also expose as Spotlight for backward compatibility
global.SpottyFire = SpottyFire;
global.Spotlight = SpottyFire;
})(typeof window !== 'undefined' ? window : this);
