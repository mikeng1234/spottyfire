// SpottyFire Config — Schema definitions, defaults, and validation

const SFConfig = (() => {
  function createDefaultMarking(id, name, color) {
    return { id, name, color: color || '#1f77b4' };
  }

  function createDefaultPanel(overrides = {}) {
    return {
      id: overrides.id || 'panel-' + Date.now(),
      chartType: overrides.chartType || 'bar',
      dataSourceId: overrides.dataSourceId || 'default',
      xColumn: overrides.xColumn || null,
      yColumn: overrides.yColumn || null,
      colorColumn: overrides.colorColumn || null,
      sizeColumn: overrides.sizeColumn || null,
      aggregation: overrides.aggregation || 'count',
      writesMarkingId: overrides.writesMarkingId || null,
      limitByMarkingIds: overrides.limitByMarkingIds || [],
      limitByMode: overrides.limitByMode || 'intersection',
      filterSchemeId: overrides.filterSchemeId || 'scheme-1',
      title: overrides.title || '',
      position: overrides.position || { x: 0, y: 0, w: 6, h: 6 },
    };
  }

  function createDefaultAnalysis() {
    return {
      dataSources: [],
      markings: [],
      filterSchemes: [{ id: 'scheme-1', name: 'Default' }],
      pages: [{ id: 'page-1', name: 'Page 1', panels: [] }],
    };
  }

  // Validate that marking dependencies form a DAG (no circular cascades)
  function validateMarkings(panels) {
    // Build adjacency: markingId -> set of markingIds it feeds into
    const writesTo = new Map(); // panelId -> markingId it writes
    const limitsBy = new Map(); // panelId -> markingIds it reads

    panels.forEach(p => {
      if (p.writesMarkingId) writesTo.set(p.id, p.writesMarkingId);
      if (p.limitByMarkingIds.length > 0) limitsBy.set(p.id, p.limitByMarkingIds);
    });

    // Build marking dependency graph: if panel reads marking-A and writes marking-B,
    // then marking-A -> marking-B is an edge
    const graph = new Map();
    panels.forEach(p => {
      const writes = writesTo.get(p.id);
      const reads = limitsBy.get(p.id);
      if (writes && reads) {
        reads.forEach(readId => {
          if (!graph.has(readId)) graph.set(readId, new Set());
          graph.get(readId).add(writes);
        });
      }
    });

    // Cycle detection via DFS
    const visited = new Set();
    const inStack = new Set();

    function hasCycle(node) {
      if (inStack.has(node)) return true;
      if (visited.has(node)) return false;
      visited.add(node);
      inStack.add(node);
      const neighbors = graph.get(node) || new Set();
      for (const neighbor of neighbors) {
        if (hasCycle(neighbor)) return true;
      }
      inStack.delete(node);
      return false;
    }

    for (const node of graph.keys()) {
      if (hasCycle(node)) {
        return { valid: false, error: `Circular marking dependency detected involving "${node}"` };
      }
    }

    return { valid: true };
  }

  return { createDefaultMarking, createDefaultPanel, createDefaultAnalysis, validateMarkings };
})();
