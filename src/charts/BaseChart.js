// ─── BaseChart ──────────────────────────────────────────────
class BaseChart {
  constructor(selector, dataStore, config) {
    this._id = 'sl_' + (BaseChart._counter = (BaseChart._counter || 0) + 1);
    this._ds = dataStore;
    this._config = Object.assign({}, config);
    this._mm = dataStore._markingManager;

    // Resolve container
    if (typeof selector === 'string') {
      this._container = document.querySelector(selector);
    } else {
      this._container = selector;
    }
    if (!this._container) throw new Error('SpottyFire: container not found: ' + selector);

    // Wrap in panel
    this._wrapper = ChartWrapper.wrap(this._container, this._config.title || '', this);

    // Listen to marking & filter changes
    var self = this;
    this._onMarking = function (e) { if (e.source !== self._id) self._onMarkingChanged(e); };
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
    this.refresh();
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
