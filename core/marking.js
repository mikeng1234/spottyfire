// SpottyFire Marking System — Marking state, cascade engine, getVisibleRows

const MarkingSystem = (() => {
  const markings = new Map();       // markingId -> { name, color, rows: Set<rowIndex> }
  let filterEngine = null;          // injected dependency

  function setFilterEngine(fe) {
    filterEngine = fe;
  }

  function createMarking(id, name, color) {
    markings.set(id, { name, color, rows: new Set() });
  }

  function mark(markingId, rowIndices, mode = 'replace') {
    const m = markings.get(markingId);
    if (!m) {
      console.warn(`[Marking] Unknown marking: ${markingId}`);
      return;
    }

    switch (mode) {
      case 'replace':
        m.rows = new Set(rowIndices);
        break;
      case 'add':
        rowIndices.forEach(i => m.rows.add(i));
        break;
      case 'toggle':
        rowIndices.forEach(i => {
          if (m.rows.has(i)) m.rows.delete(i);
          else m.rows.add(i);
        });
        break;
    }

    EventBus.emit(SF_EVENTS.MARKING_CHANGED, {
      markingId,
      rowIndices: new Set(m.rows),
    });
  }

  function clearMarking(markingId) {
    const m = markings.get(markingId);
    if (m) {
      m.rows.clear();
      EventBus.emit(SF_EVENTS.MARKING_CLEARED, { markingId });
    }
  }

  function getMarkedRows(markingId) {
    const m = markings.get(markingId);
    return m ? new Set(m.rows) : new Set();
  }

  function isMarkingActive(markingId) {
    const m = markings.get(markingId);
    return m ? m.rows.size > 0 : false;
  }

  function getMarkingColor(markingId) {
    const m = markings.get(markingId);
    return m ? m.color : null;
  }

  // THE CASCADE ENGINE — computes which rows a panel should display
  function getVisibleRows(panelConfig) {
    const { limitByMarkingIds, limitByMode, filterSchemeId } = panelConfig;
    const totalRows = DataStore.getRowCount();

    let result = null; // null = all rows

    // Step 1: Apply marking limits
    if (limitByMarkingIds && limitByMarkingIds.length > 0) {
      const anyActive = limitByMarkingIds.some(id => isMarkingActive(id));

      if (!anyActive) {
        // No parent has selected anything — return empty (show prompt message)
        return new Set();
      }

      if (limitByMode === 'union') {
        // Union: rows in ANY marking
        result = new Set();
        limitByMarkingIds.forEach(id => {
          const rows = getMarkedRows(id);
          rows.forEach(r => result.add(r));
        });
      } else {
        // Intersection (default): rows in ALL active markings
        const activeSets = limitByMarkingIds
          .filter(id => isMarkingActive(id))
          .map(id => getMarkedRows(id));

        if (activeSets.length === 0) {
          return new Set();
        }

        // Start with smallest set for efficiency
        activeSets.sort((a, b) => a.size - b.size);
        result = new Set(activeSets[0]);
        for (let i = 1; i < activeSets.length; i++) {
          const next = activeSets[i];
          for (const r of result) {
            if (!next.has(r)) result.delete(r);
          }
        }
      }
    }

    // Step 2: Apply filter scheme
    if (filterEngine && filterSchemeId) {
      const filteredRows = filterEngine.getFilteredRows(filterSchemeId);
      if (filteredRows !== null) {
        if (result === null) {
          result = filteredRows;
        } else {
          // Intersect marking result with filter result
          for (const r of result) {
            if (!filteredRows.has(r)) result.delete(r);
          }
        }
      }
    }

    return result; // null means all rows visible
  }

  function getAllMarkings() {
    const result = [];
    markings.forEach((val, key) => {
      result.push({ id: key, name: val.name, color: val.color, count: val.rows.size });
    });
    return result;
  }

  return {
    setFilterEngine, createMarking, mark, clearMarking,
    getMarkedRows, isMarkingActive, getMarkingColor,
    getVisibleRows, getAllMarkings,
  };
})();
