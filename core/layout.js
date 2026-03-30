// SpottyFire Layout Engine — DOM skeleton, panel management, resize

const LayoutEngine = (() => {
  let rootEl = null;
  let chartAreaEl = null;
  let filterPanelEl = null;
  let tabsEl = null;
  let panels = new Map(); // panelId -> { container, config, resizeObserver }
  let currentPageId = null;
  let analysisConfig = null;

  function init(containerSelector, config) {
    analysisConfig = config;
    rootEl = document.querySelector(containerSelector);
    if (!rootEl) {
      rootEl = document.getElementById('spottyfire-root');
    }
    if (!rootEl) {
      console.error('[Layout] Root element not found');
      return;
    }

    rootEl.innerHTML = `
      <nav class="sf-tabs" id="sf-tabs"></nav>
      <div class="sf-workspace">
        <aside class="sf-filter-panel" id="sf-filter-panel">
          <div class="sf-filter-header">
            <span>Filters</span>
            <button class="sf-filter-toggle" id="sf-filter-toggle" title="Toggle filters">&lsaquo;</button>
          </div>
          <div class="sf-filter-content" id="sf-filter-content"></div>
        </aside>
        <main class="sf-chart-area" id="sf-chart-area"></main>
      </div>
      <div class="sf-statusbar" id="sf-statusbar">
        <span id="sf-status-text">Ready</span>
        <span id="sf-status-data"></span>
      </div>
    `;

    tabsEl = rootEl.querySelector('#sf-tabs');
    filterPanelEl = rootEl.querySelector('#sf-filter-panel');
    chartAreaEl = rootEl.querySelector('#sf-chart-area');

    // Filter toggle
    rootEl.querySelector('#sf-filter-toggle').addEventListener('click', toggleFilterPanel);

    // Render page tabs
    renderTabs();

    // Show first page
    if (config.pages && config.pages.length > 0) {
      switchPage(config.pages[0].id);
    }
  }

  function renderTabs() {
    if (!tabsEl || !analysisConfig) return;
    tabsEl.innerHTML = '';
    analysisConfig.pages.forEach(page => {
      const tab = document.createElement('button');
      tab.className = 'sf-tab';
      tab.dataset.pageId = page.id;
      tab.textContent = page.name;
      tab.addEventListener('click', () => switchPage(page.id));
      tabsEl.appendChild(tab);
    });
  }

  function switchPage(pageId) {
    currentPageId = pageId;

    // Update tab active state
    tabsEl.querySelectorAll('.sf-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.pageId === pageId);
    });

    // Clear existing panels
    panels.forEach(p => {
      if (p.resizeObserver) p.resizeObserver.disconnect();
    });
    panels.clear();
    chartAreaEl.innerHTML = '';

    // Find page config
    const page = analysisConfig.pages.find(p => p.id === pageId);
    if (!page) return;

    // Create panel containers using CSS grid
    const gridCols = 12;
    chartAreaEl.style.display = 'grid';
    chartAreaEl.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
    chartAreaEl.style.gridAutoRows = 'minmax(200px, 1fr)';
    chartAreaEl.style.gap = '8px';
    chartAreaEl.style.padding = '8px';

    page.panels.forEach(panelConfig => {
      const container = document.createElement('div');
      container.className = 'sf-panel';
      container.dataset.panelId = panelConfig.id;

      const pos = panelConfig.position || { x: 0, y: 0, w: 6, h: 6 };
      container.style.gridColumn = `${pos.x + 1} / span ${pos.w}`;
      container.style.gridRow = `${pos.y + 1} / span ${pos.h}`;

      // Panel header
      const header = document.createElement('div');
      header.className = 'sf-panel-header';
      header.innerHTML = `
        <span class="sf-panel-title">${panelConfig.title || panelConfig.chartType + ' chart'}</span>
        <div class="sf-panel-actions">
          <button class="sf-panel-btn" title="Settings">&#9881;</button>
        </div>
      `;

      // Chart container
      const chartContainer = document.createElement('div');
      chartContainer.className = 'sf-chart-container';
      chartContainer.id = `chart-${panelConfig.id}`;

      // Empty message overlay
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'sf-empty-message';
      emptyMsg.textContent = 'Select data in the parent chart to see details';
      emptyMsg.style.display = 'none';

      container.appendChild(header);
      container.appendChild(chartContainer);
      container.appendChild(emptyMsg);
      chartAreaEl.appendChild(container);

      // Resize observer
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          EventBus.emit(SF_EVENTS.PANEL_RESIZED, {
            panelId: panelConfig.id,
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });
      resizeObserver.observe(chartContainer);

      panels.set(panelConfig.id, { container, chartContainer, config: panelConfig, resizeObserver });
    });
  }

  function getPanelContainer(panelId) {
    const p = panels.get(panelId);
    return p ? p.chartContainer : null;
  }

  function getPanelDimensions(panelId) {
    const p = panels.get(panelId);
    if (!p) return { width: 400, height: 300 };
    const rect = p.chartContainer.getBoundingClientRect();
    return { width: rect.width || 400, height: rect.height || 300 };
  }

  function showEmptyMessage(panelId, message) {
    const p = panels.get(panelId);
    if (!p) return;
    const emptyEl = p.container.querySelector('.sf-empty-message');
    if (emptyEl) {
      emptyEl.textContent = message || 'Select data in the parent chart to see details';
      emptyEl.style.display = 'flex';
    }
  }

  function hideEmptyMessage(panelId) {
    const p = panels.get(panelId);
    if (!p) return;
    const emptyEl = p.container.querySelector('.sf-empty-message');
    if (emptyEl) emptyEl.style.display = 'none';
  }

  function toggleFilterPanel() {
    filterPanelEl.classList.toggle('collapsed');
  }

  function getFilterContentEl() {
    return rootEl ? rootEl.querySelector('#sf-filter-content') : null;
  }

  function setStatusText(text) {
    const el = rootEl ? rootEl.querySelector('#sf-status-text') : null;
    if (el) el.textContent = text;
  }

  function setStatusData(text) {
    const el = rootEl ? rootEl.querySelector('#sf-status-data') : null;
    if (el) el.textContent = text;
  }

  return {
    init, switchPage, getPanelContainer, getPanelDimensions,
    showEmptyMessage, hideEmptyMessage, toggleFilterPanel,
    getFilterContentEl, setStatusText, setStatusData, renderTabs,
  };
})();
