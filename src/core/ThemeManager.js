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
      margin: { t: 64, r: 24, b: 56, l: 56 },
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
    '}body{background:var(--sl-bg);color:var(--sl-text-primary);font-family:var(--sl-font);margin:0;}' +
    '*{scrollbar-width:thin;scrollbar-color:var(--sl-panel-border) transparent;}' +
    '*::-webkit-scrollbar{width:6px;height:6px;}' +
    '*::-webkit-scrollbar-track{background:transparent;}' +
    '*::-webkit-scrollbar-thumb{background:var(--sl-panel-border);border-radius:3px;}' +
    '*::-webkit-scrollbar-thumb:hover{background:var(--sl-accent);}';

    // Inject base component styles once
    if (!document.getElementById('sl-base-css')) {
      var s = document.createElement('style');
      s.id = 'sl-base-css';
      s.textContent =
        '.sl-panel{background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:12px;box-shadow:var(--sl-panel-shadow);overflow:hidden;display:flex;flex-direction:column;transition:box-shadow var(--sl-transition) ease,border-color var(--sl-transition) ease;animation:sl-fadein 400ms ease both;min-width:0;}' +
        '.sl-panel:hover{border-color:var(--sl-accent);box-shadow:var(--sl-panel-shadow),0 0 0 1px var(--sl-accent);}' +
        '.sl-panel-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--sl-panel-border);font-size:14px;font-weight:600;color:var(--sl-text-primary);user-select:none;}' +
        '.sl-panel-header-actions{display:flex;gap:6px;align-items:center;}' +
        '.sl-panel-header-actions button{background:none;border:1px solid var(--sl-panel-border);border-radius:6px;color:var(--sl-text-muted);cursor:pointer;padding:4px 8px;font-size:11px;transition:all var(--sl-transition) ease;}' +
        '.sl-panel-header-actions button:hover{color:var(--sl-text-primary);border-color:var(--sl-accent);}' +
        '.sl-panel-body{flex:1;padding:8px;min-height:0;min-width:0;position:relative;overflow:hidden;}' +
        '.sl-panel-body .js-plotly-plot,.sl-panel-body .plot-container,.sl-panel-body .svg-container{width:100%!important;height:100%!important;}' +
        '@keyframes sl-fadein{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}' +
        '.sl-menubar{display:flex;align-items:center;justify-content:space-between;background:var(--sl-panel-bg);border-bottom:1px solid var(--sl-panel-border);padding:0 8px;height:36px;font-family:var(--sl-font);user-select:none;flex-shrink:0;}' +
        '.sl-menubar-menus{display:flex;align-items:center;gap:0;}' +
        '.sl-menu-wrap{position:relative;}' +
        '.sl-menu-trigger{background:none;border:none;color:var(--sl-text-secondary);padding:8px 12px;font-size:12px;font-weight:500;cursor:pointer;font-family:var(--sl-font);transition:all 150ms ease;}' +
        '.sl-menu-trigger:hover{color:var(--sl-text-primary);background:rgba(128,128,128,0.1);}' +
        '.sl-menu-dropdown{position:absolute;top:100%;left:0;background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.4);padding:4px 0;min-width:220px;z-index:10000;}' +
        '.sl-menubar-actions{display:flex;align-items:center;gap:4px;}' +
        '.sl-menubar-btn{background:none;border:1px solid transparent;border-radius:5px;color:var(--sl-text-muted);cursor:pointer;padding:4px 8px;font-size:14px;transition:all 150ms ease;font-family:var(--sl-font);}' +
        '.sl-menubar-btn:hover:not(:disabled){color:var(--sl-text-primary);border-color:var(--sl-panel-border);background:rgba(128,128,128,0.08);}' +
        '.sl-menubar-btn:disabled{opacity:0.25;cursor:default;}' +
        '.sl-menubar-sep{width:1px;height:16px;background:var(--sl-panel-border);margin:0 4px;}' +
        '.sl-menubar-info{font-size:11px;color:var(--sl-text-muted);padding:0 8px;white-space:nowrap;}' +
        '.sl-context-menu{position:fixed;z-index:10000;background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.4);padding:4px 0;min-width:200px;font-family:var(--sl-font);}' +
        '.sl-ctx-item{display:flex;align-items:center;gap:8px;padding:7px 14px;font-size:12px;color:var(--sl-text-primary);cursor:pointer;transition:background 120ms ease;user-select:none;}' +
        '.sl-ctx-item:hover{background:color-mix(in srgb,var(--sl-accent) 15%,transparent);}' +
        '.sl-ctx-disabled{opacity:0.35;cursor:default;pointer-events:none;}' +
        '.sl-ctx-icon{width:16px;text-align:center;font-size:13px;flex-shrink:0;}' +
        '.sl-ctx-shortcut{margin-left:auto;font-size:10px;color:var(--sl-text-muted);padding-left:16px;}' +
        '.sl-ctx-separator{height:1px;background:var(--sl-panel-border);margin:4px 8px;}' +
        '.sl-cog-menu{position:absolute;right:0;top:100%;background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.3);padding:6px 0;min-width:180px;z-index:100;}' +
        '.sl-cog-item{display:flex;align-items:center;gap:6px;padding:6px 12px;font-size:12px;color:var(--sl-text-secondary);cursor:pointer;transition:background 150ms ease;white-space:nowrap;}' +
        '.sl-cog-item:hover{background:rgba(128,128,128,0.1);color:var(--sl-text-primary);}' +
        '.sl-cog-item input{accent-color:var(--sl-accent);}' +
        '.sl-resize-handle{height:6px;cursor:ns-resize;background:transparent;transition:background 150ms ease;flex-shrink:0;}' +
        '.sl-resize-handle:hover,.sl-resize-handle:active{background:var(--sl-accent);opacity:0.4;border-radius:0 0 12px 12px;}' +
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
        '.sl-table tr{cursor:pointer;transition:background var(--sl-transition) ease;user-select:none;}' +
        '.sl-table-pager{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;font-size:12px;color:var(--sl-text-secondary);border-top:1px solid var(--sl-panel-border);}' +
        '.sl-table-pager button{background:none;border:1px solid var(--sl-panel-border);border-radius:6px;color:var(--sl-text-secondary);cursor:pointer;padding:4px 10px;font-size:11px;}' +
        '.sl-table-pager button:hover:not(:disabled){color:var(--sl-text-primary);border-color:var(--sl-accent);}' +
        '.sl-table-pager button:disabled{opacity:0.3;cursor:default;}' +
        '.sl-filter-panel{background:var(--sl-panel-bg);border:1px solid var(--sl-panel-border);border-radius:12px;box-shadow:var(--sl-panel-shadow);padding:16px;overflow-y:auto;font-size:13px;color:var(--sl-text-primary);}' +
        '.sl-filter-section{margin-bottom:12px;border-bottom:1px solid var(--sl-panel-border);padding-bottom:12px;max-height:180px;overflow-y:auto;}' +
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
        '.sl-viz-panel{padding:4px 0;}' +
        '.sl-viz-title{font-size:14px;font-weight:700;padding:8px 12px;color:var(--sl-text-primary);}' +
        '.sl-viz-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;padding:0 12px 12px;}' +
        '.sl-viz-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 4px;border:1px solid var(--sl-panel-border);border-radius:8px;cursor:pointer;transition:all 200ms ease;user-select:none;}' +
        '.sl-viz-tile:hover{border-color:var(--sl-accent);background:color-mix(in srgb,var(--sl-accent) 8%,transparent);transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,0.2);}' +
        '.sl-viz-icon{font-size:20px;margin-bottom:4px;opacity:0.7;}' +
        '.sl-viz-tile:hover .sl-viz-icon{opacity:1;}' +
        '.sl-viz-label{font-size:10px;font-weight:600;color:var(--sl-text-secondary);text-transform:uppercase;letter-spacing:0.5px;}' +
        '.sl-viz-desc{font-size:9px;color:var(--sl-text-muted);margin-top:2px;text-align:center;line-height:1.3;}' +
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

  // Global window resize handler — force all Plotly charts to fit their containers
  if (typeof window !== 'undefined') {
    var _resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(_resizeTimer);
      _resizeTimer = setTimeout(function () {
        var plots = document.querySelectorAll('.sl-panel-body .js-plotly-plot');
        plots.forEach(function (p) {
          if (p.data) {
            try { Plotly.Plots.resize(p); } catch (e) {}
          }
        });
      }, 250);
    });
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
