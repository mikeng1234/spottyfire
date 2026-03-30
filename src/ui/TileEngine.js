// ─── TileEngine — Binary Split Layout ───────────────────────
// Implements Spotfire-style hierarchical tiling.
// The layout is a binary tree where each node is either:
//   - A "split" (row or column) with two children and a ratio
//   - A "leaf" containing a chart container element
var TileEngine = (function () {

  // Create a tile container element
  function _createTileEl() {
    var el = document.createElement('div');
    el.style.cssText = 'position:absolute;overflow:hidden;box-sizing:border-box;';
    return el;
  }

  // The layout tree node
  function TileNode(type, parent) {
    this.type = type; // 'leaf', 'row' (horizontal split), 'col' (vertical split)
    this.parent = parent || null;
    this.el = _createTileEl();
    this.children = []; // [TileNode, TileNode] for splits
    this.ratio = 0.5;   // split ratio (0-1), first child gets ratio, second gets 1-ratio
    this.chartEl = null; // the chart container element (only for leaf nodes)
  }

  // Main engine
  function Engine(containerEl) {
    this._container = containerEl;
    this._container.style.position = 'relative';
    this._container.style.overflow = 'hidden';
    this._container.style.width = '100%';
    this._container.style.height = '100%';
    this._root = null;
    this._gap = 6; // gap between tiles in px
  }

  // Add a chart element to the layout
  Engine.prototype.addTile = function (chartEl) {
    if (!this._root) {
      // First tile — becomes the root leaf
      this._root = new TileNode('leaf', null);
      this._root.chartEl = chartEl;
      this._root.el.appendChild(chartEl);
      this._container.appendChild(this._root.el);
      this.layout();
      return this._root;
    }

    // Find the largest leaf to split
    var target = this._findLargestLeaf(this._root);
    return this._splitLeaf(target, chartEl);
  };

  // Split a leaf node to add a new chart
  Engine.prototype._splitLeaf = function (leaf, newChartEl) {
    var parent = leaf.parent;

    // Alternate split direction based on depth — even depth = col, odd = row
    // This creates a balanced 2x2 grid pattern
    var depth = 0;
    var p = parent;
    while (p) { depth++; p = p.parent; }
    var splitType = depth % 2 === 0 ? 'col' : 'row';

    // Create new split node
    var split = new TileNode(splitType, parent);
    split.ratio = 0.5;

    // Existing leaf becomes first child
    leaf.parent = split;
    split.children[0] = leaf;

    // New leaf for the new chart
    var newLeaf = new TileNode('leaf', split);
    newLeaf.chartEl = newChartEl;
    newLeaf.el.appendChild(newChartEl);
    split.children[1] = newLeaf;

    // Replace leaf with split in parent
    if (parent) {
      var idx = parent.children.indexOf(leaf);
      parent.children[idx] = split;
      parent.el.removeChild(leaf.el);
      parent.el.appendChild(split.el);
    } else {
      // leaf was root
      this._container.removeChild(leaf.el);
      this._root = split;
      this._container.appendChild(split.el);
    }

    split.el.appendChild(leaf.el);
    split.el.appendChild(newLeaf.el);

    this.layout();
    return newLeaf;
  };

  // Remove a chart from the layout
  Engine.prototype.removeTile = function (chartEl) {
    var leaf = this._findLeafByChart(this._root, chartEl);
    if (!leaf) return;

    var parent = leaf.parent;
    if (!parent) {
      // Only tile — clear everything
      this._container.removeChild(leaf.el);
      this._root = null;
      return;
    }

    // Find sibling
    var sibling = parent.children[0] === leaf ? parent.children[1] : parent.children[0];

    // Replace parent with sibling in grandparent
    var grandparent = parent.parent;
    if (grandparent) {
      var idx = grandparent.children.indexOf(parent);
      grandparent.children[idx] = sibling;
      sibling.parent = grandparent;
      grandparent.el.removeChild(parent.el);
      grandparent.el.appendChild(sibling.el);
    } else {
      // parent was root
      this._container.removeChild(parent.el);
      this._root = sibling;
      sibling.parent = null;
      this._container.appendChild(sibling.el);
    }

    this.layout();
  };

  // Recalculate all positions and sizes
  Engine.prototype.layout = function () {
    if (!this._root) return;
    var rect = this._container.getBoundingClientRect();
    this._layoutNode(this._root, 0, 0, rect.width, rect.height);

    // Trigger Plotly resize on all charts
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 50);
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  };

  Engine.prototype._layoutNode = function (node, x, y, w, h) {
    node.el.style.left = x + 'px';
    node.el.style.top = y + 'px';
    node.el.style.width = w + 'px';
    node.el.style.height = h + 'px';

    if (node.type === 'leaf') {
      // Size the chart element to fill the tile
      if (node.chartEl) {
        node.chartEl.style.width = '100%';
        node.chartEl.style.height = '100%';
        var panel = node.chartEl.querySelector('.sl-panel');
        if (panel) {
          panel.style.height = '100%';
        }
      }
      return;
    }

    var gap = this._gap;
    var r = node.ratio;

    if (node.type === 'col') {
      // Vertical split: left | right
      var leftW = (w - gap) * r;
      var rightW = w - gap - leftW;
      this._layoutNode(node.children[0], x, y, leftW, h);
      this._layoutNode(node.children[1], x + leftW + gap, y, rightW, h);
    } else {
      // Horizontal split: top / bottom
      var topH = (h - gap) * r;
      var bottomH = h - gap - topH;
      this._layoutNode(node.children[0], x, y, w, topH);
      this._layoutNode(node.children[1], x, y + topH + gap, w, bottomH);
    }
  };

  // Find the largest leaf node (by area)
  Engine.prototype._findLargestLeaf = function (node) {
    if (node.type === 'leaf') return node;
    var a = this._findLargestLeaf(node.children[0]);
    var b = this._findLargestLeaf(node.children[1]);
    var aRect = a.el.getBoundingClientRect();
    var bRect = b.el.getBoundingClientRect();
    return (aRect.width * aRect.height >= bRect.width * bRect.height) ? a : b;
  };

  // Find leaf by chart element
  Engine.prototype._findLeafByChart = function (node, chartEl) {
    if (!node) return null;
    if (node.type === 'leaf') return node.chartEl === chartEl ? node : null;
    return this._findLeafByChart(node.children[0], chartEl) ||
           this._findLeafByChart(node.children[1], chartEl);
  };

  // Get all leaf nodes
  Engine.prototype.getLeaves = function () {
    var leaves = [];
    function _walk(node) {
      if (!node) return;
      if (node.type === 'leaf') { leaves.push(node); return; }
      _walk(node.children[0]);
      _walk(node.children[1]);
    }
    _walk(this._root);
    return leaves;
  };

  // Handle window resize
  Engine.prototype.onResize = function () {
    this.layout();
  };

  return { Engine: Engine };
})();
