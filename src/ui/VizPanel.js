// ─── VizPanel — Add Visualization Tiles ────────────────────
class VizPanel {
  constructor(selector, dataStore, config) {
    this._ds = dataStore;
    this._config = config || {};
    this._container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._container) throw new Error('VizPanel: container not found');
    this._targetGrid = this._config.target || null; // CSS selector or element for chart grid
    this.render();
  }

  render() {
    var ds = this._ds;
    var self = this;
    var container = this._container;
    container.innerHTML = '';

    var wrap = document.createElement('div');
    wrap.className = 'sl-viz-panel';

    var title = document.createElement('div');
    title.className = 'sl-viz-title';
    title.textContent = 'Visualizations';
    wrap.appendChild(title);

    var subtitle = document.createElement('div');
    subtitle.style.cssText = 'font-size:10px;color:var(--sl-text-muted);padding:0 12px 8px;';
    subtitle.textContent = 'Click to add a chart';
    wrap.appendChild(subtitle);

    var grid = document.createElement('div');
    grid.className = 'sl-viz-grid';

    var chartTypes = [
      { type: 'bar', icon: '\uD83D\uDCCA', label: 'Bar', desc: 'Category vs Value' },
      { type: 'scatter', icon: '\u2022\u2022', label: 'Scatter', desc: 'X vs Y correlation' },
      { type: 'line', icon: '\uD83D\uDCC8', label: 'Line', desc: 'Trend over time' },
      { type: 'pie', icon: '\u25D4', label: 'Pie', desc: 'Part of whole' },
      { type: 'heatmap', icon: '\u2593', label: 'Heatmap', desc: 'Matrix values' },
      { type: 'table', icon: '\u2630', label: 'Table', desc: 'Data rows' },
    ];

    chartTypes.forEach(function (ct) {
      var tile = document.createElement('div');
      tile.className = 'sl-viz-tile';
      tile.title = ct.desc;

      var icon = document.createElement('div');
      icon.className = 'sl-viz-icon';
      icon.textContent = ct.icon;
      tile.appendChild(icon);

      var label = document.createElement('div');
      label.className = 'sl-viz-label';
      label.textContent = ct.label;
      tile.appendChild(label);

      tile.addEventListener('click', function () {
        self._addChart(ct.type);
      });

      grid.appendChild(tile);
    });

    wrap.appendChild(grid);
    container.appendChild(wrap);
  }

  _addChart(type) {
    var ds = this._ds;
    var cols = ds.getColumns().filter(function (c) { return c.name !== '__rowIndex'; });
    var numCols = cols.filter(function (c) { return c.type === 'number'; });
    var strCols = cols.filter(function (c) { return c.type === 'string'; });
    var catCols = strCols.filter(function (c) { return ds.getColumnValues(c.name).length <= 20; });
    if (catCols.length === 0) catCols = strCols;

    if (cols.length === 0) { alert('No data loaded. Upload a CSV first.'); return; }

    // Find or create target grid
    var target = this._targetGrid;
    if (typeof target === 'string') target = document.querySelector(target);
    if (!target) {
      target = document.querySelector('.app-grid') || document.querySelector('.grid');
    }
    if (!target) { alert('No chart grid found.'); return; }

    // Create container div
    var div = document.createElement('div');
    target.appendChild(div);

    var firstNum = numCols[0] ? numCols[0].name : cols[0].name;
    var secondNum = numCols[1] ? numCols[1].name : firstNum;
    var firstCat = catCols[0] ? catCols[0].name : cols[0].name;
    var secondCat = catCols[1] ? catCols[1].name : firstCat;

    switch (type) {
      case 'bar':
        SpottyFire.BarChart(div, ds, {
          category: firstCat, value: firstNum,
          aggregation: 'avg', showValues: true,
          title: 'Avg ' + firstNum + ' by ' + firstCat,
        });
        break;
      case 'scatter':
        SpottyFire.ScatterPlot(div, ds, {
          x: secondNum, y: firstNum,
          colorBy: catCols.length > 0 ? firstCat : null,
          pointSize: 7,
          title: secondNum + ' vs ' + firstNum,
        });
        break;
      case 'line':
        SpottyFire.LineChart(div, ds, {
          x: firstCat, y: [firstNum],
          title: firstNum + ' by ' + firstCat,
          smooth: true,
        });
        break;
      case 'pie':
        SpottyFire.PieChart(div, ds, {
          category: firstCat, value: firstNum,
          aggregation: 'sum', hole: 0.45, showPercent: true,
          title: firstNum + ' by ' + firstCat,
        });
        break;
      case 'heatmap':
        SpottyFire.HeatMap(div, ds, {
          x: firstCat, y: secondCat,
          value: firstNum, aggregation: 'avg', showValues: true,
          title: 'Avg ' + firstNum + ': ' + firstCat + ' x ' + secondCat,
        });
        break;
      case 'table':
        SpottyFire.DataTable(div, ds, {
          columns: cols.map(function (c) { return c.name; }).slice(0, 10),
          pageSize: 20,
          title: 'Data Table',
        });
        break;
    }

    // Recalculate layout and resize (delay to ensure DOM is updated)
    setTimeout(function () {
      if (typeof window.recalcLayout === 'function') window.recalcLayout();
      else BaseChart.resizeAll();
    }, 50);
  }

  destroy() {}
}
