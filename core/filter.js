// SpottyFire Filter Engine — Filter state management and row computation

const FilterEngine = (() => {
  // Map<schemeId, Map<columnName, FilterState>>
  const schemes = new Map();

  function initScheme(schemeId) {
    const filterMap = new Map();
    const colNames = DataStore.getColumnNames();

    colNames.forEach(name => {
      const type = DataStore.getColumnType(name);
      if (type === 'string') {
        const allValues = DataStore.getUniqueValues(name);
        filterMap.set(name, {
          type: 'checkbox',
          selected: new Set(allValues),  // all selected = no filtering
          allValues,
        });
      } else if (type === 'number') {
        const range = DataStore.getRange(name);
        if (range) {
          filterMap.set(name, {
            type: 'range',
            min: range.min,
            max: range.max,
            dataMin: range.min,
            dataMax: range.max,
          });
        }
      }
    });

    schemes.set(schemeId, filterMap);
    console.log(`[FilterEngine] Initialized scheme "${schemeId}" with ${filterMap.size} filters`);
  }

  function setCheckboxFilter(schemeId, column, selectedValues) {
    const scheme = schemes.get(schemeId);
    if (!scheme) return;
    const filter = scheme.get(column);
    if (!filter || filter.type !== 'checkbox') return;

    filter.selected = new Set(selectedValues);
    EventBus.emit(SF_EVENTS.FILTER_CHANGED, { schemeId, column, filterState: filter });
  }

  function setRangeFilter(schemeId, column, min, max) {
    const scheme = schemes.get(schemeId);
    if (!scheme) return;
    const filter = scheme.get(column);
    if (!filter || filter.type !== 'range') return;

    filter.min = min;
    filter.max = max;
    EventBus.emit(SF_EVENTS.FILTER_CHANGED, { schemeId, column, filterState: filter });
  }

  function setTextFilter(schemeId, column, query) {
    const scheme = schemes.get(schemeId);
    if (!scheme) return;

    // Text filter can be applied to any column type
    let filter = scheme.get(column);
    if (!filter) {
      filter = { type: 'text', query: '', mode: 'contains' };
      scheme.set(column, filter);
    }

    if (filter.type === 'text') {
      filter.query = query;
    } else {
      // Wrap existing filter with text search — store separately
      scheme.set(column + '__text', { type: 'text', query, mode: 'contains' });
    }
    EventBus.emit(SF_EVENTS.FILTER_CHANGED, { schemeId, column, filterState: filter });
  }

  function resetFilter(schemeId, column) {
    const scheme = schemes.get(schemeId);
    if (!scheme) return;
    const filter = scheme.get(column);
    if (!filter) return;

    if (filter.type === 'checkbox') {
      filter.selected = new Set(filter.allValues);
    } else if (filter.type === 'range') {
      filter.min = filter.dataMin;
      filter.max = filter.dataMax;
    } else if (filter.type === 'text') {
      filter.query = '';
    }
    EventBus.emit(SF_EVENTS.FILTER_CHANGED, { schemeId, column, filterState: filter });
  }

  function resetAllFilters(schemeId) {
    const scheme = schemes.get(schemeId);
    if (!scheme) return;
    scheme.forEach((filter, column) => {
      if (filter.type === 'checkbox') {
        filter.selected = new Set(filter.allValues);
      } else if (filter.type === 'range') {
        filter.min = filter.dataMin;
        filter.max = filter.dataMax;
      } else if (filter.type === 'text') {
        filter.query = '';
      }
    });
    EventBus.emit(SF_EVENTS.FILTER_RESET, { schemeId });
  }

  // Returns Set<rowIndex> of rows passing ALL filters, or null if no filters active
  function getFilteredRows(schemeId) {
    const scheme = schemes.get(schemeId);
    if (!scheme) return null;

    const totalRows = DataStore.getRowCount();
    const activeFilters = [];

    scheme.forEach((filter, column) => {
      if (filter.type === 'checkbox') {
        // Active if not all values are selected
        if (filter.selected.size < filter.allValues.length) {
          activeFilters.push({ column, filter });
        }
      } else if (filter.type === 'range') {
        if (filter.min > filter.dataMin || filter.max < filter.dataMax) {
          activeFilters.push({ column, filter });
        }
      } else if (filter.type === 'text') {
        if (filter.query && filter.query.trim() !== '') {
          activeFilters.push({ column, filter });
        }
      }
    });

    if (activeFilters.length === 0) return null; // No active filters = all rows pass

    // Compute passing rows — start with the most selective filter
    let result = null;

    for (const { column, filter } of activeFilters) {
      let passing;

      if (filter.type === 'checkbox') {
        // Use categorical index for O(k) lookup
        passing = new Set();
        const catIndex = DataStore.getCategoricalIndex(column);
        if (catIndex) {
          filter.selected.forEach(val => {
            const rows = catIndex.get(val);
            if (rows) rows.forEach(r => passing.add(r));
          });
        }
      } else if (filter.type === 'range') {
        passing = new Set();
        const col = DataStore.getColumn(column);
        if (col) {
          for (let i = 0; i < col.values.length; i++) {
            const v = col.values[i];
            if (v >= filter.min && v <= filter.max) passing.add(i);
          }
        }
      } else if (filter.type === 'text') {
        passing = new Set();
        const col = DataStore.getColumn(column.replace('__text', ''));
        const query = filter.query.toLowerCase();
        if (col) {
          for (let i = 0; i < col.values.length; i++) {
            const v = String(col.values[i]).toLowerCase();
            if (v.includes(query)) passing.add(i);
          }
        }
      }

      if (result === null) {
        result = passing;
      } else {
        // AND: intersect
        for (const r of result) {
          if (!passing.has(r)) result.delete(r);
        }
      }
    }

    return result;
  }

  function getFilterState(schemeId, column) {
    const scheme = schemes.get(schemeId);
    if (!scheme) return null;
    return scheme.get(column) || null;
  }

  function getSchemeColumns(schemeId) {
    const scheme = schemes.get(schemeId);
    if (!scheme) return [];
    return Array.from(scheme.keys());
  }

  return {
    initScheme, setCheckboxFilter, setRangeFilter, setTextFilter,
    resetFilter, resetAllFilters, getFilteredRows, getFilterState, getSchemeColumns,
  };
})();
