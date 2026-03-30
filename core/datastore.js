// SpottyFire DataStore — Columnar in-memory store with categorical indexes

const DataStore = (() => {
  let columns = {};    // { colName: { type: 'string'|'number', values: [] } }
  let rowCount = 0;
  let indexes = {};    // { colName: Map<value, Set<rowIndex>> } for categorical
  let ranges = {};     // { colName: { min, max } } for numeric
  let columnNames = [];

  function detectType(values) {
    let numericCount = 0;
    const sample = values.slice(0, 20).filter(v => v !== '' && v != null);
    sample.forEach(v => {
      if (!isNaN(parseFloat(v)) && isFinite(v)) numericCount++;
    });
    return (sample.length > 0 && numericCount / sample.length > 0.8) ? 'number' : 'string';
  }

  function buildIndexes() {
    indexes = {};
    ranges = {};
    columnNames.forEach(name => {
      const col = columns[name];
      if (col.type === 'string') {
        const idx = new Map();
        col.values.forEach((val, i) => {
          if (!idx.has(val)) idx.set(val, new Set());
          idx.get(val).add(i);
        });
        indexes[name] = idx;
      } else if (col.type === 'number') {
        let min = Infinity, max = -Infinity;
        const uniqueVals = new Set();
        col.values.forEach((val, i) => {
          if (val < min) min = val;
          if (val > max) max = val;
          uniqueVals.add(val);
        });
        ranges[name] = { min, max };
        // Build categorical index for low-cardinality numeric columns
        if (uniqueVals.size <= 30) {
          const idx = new Map();
          col.values.forEach((val, i) => {
            if (!idx.has(val)) idx.set(val, new Set());
            idx.get(val).add(i);
          });
          indexes[name] = idx;
        }
      }
    });
  }

  function loadCSV(csvString, sourceId = 'default') {
    const parsed = Papa.parse(csvString.trim(), {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      console.warn('CSV parse warnings:', parsed.errors);
    }

    const rows = parsed.data;
    columnNames = parsed.meta.fields;
    rowCount = rows.length;
    columns = {};

    // Detect types from raw string values
    const types = {};
    columnNames.forEach(name => {
      const rawValues = rows.map(r => r[name]);
      types[name] = detectType(rawValues);
    });

    // Build columnar storage with typed values
    columnNames.forEach(name => {
      const type = types[name];
      const values = rows.map(r => {
        const raw = r[name];
        if (type === 'number') {
          const n = parseFloat(raw);
          return isNaN(n) ? 0 : n;
        }
        return (raw || '').trim();
      });
      columns[name] = { type, values };
    });

    buildIndexes();

    EventBus.emit(SF_EVENTS.DATA_LOADED, {
      sourceId,
      rowCount,
      columns: columnNames.map(n => ({ name: n, type: columns[n].type })),
    });

    console.log(`[DataStore] Loaded ${rowCount} rows, ${columnNames.length} columns`);
  }

  function getColumn(name) {
    return columns[name] || null;
  }

  function getRow(index) {
    if (index < 0 || index >= rowCount) return null;
    const row = {};
    columnNames.forEach(name => {
      row[name] = columns[name].values[index];
    });
    return row;
  }

  function getUniqueValues(column) {
    if (indexes[column]) return Array.from(indexes[column].keys());
    const col = columns[column];
    if (!col) return [];
    return [...new Set(col.values)];
  }

  function getRange(column) {
    return ranges[column] || null;
  }

  function getColumnNames() {
    return [...columnNames];
  }

  function getColumnType(name) {
    return columns[name] ? columns[name].type : null;
  }

  function getRowCount() {
    return rowCount;
  }

  function getCategoricalIndex(column) {
    return indexes[column] || null;
  }

  function getRows(rowIndices) {
    const result = [];
    for (const i of rowIndices) {
      result.push(getRow(i));
    }
    return result;
  }

  return {
    loadCSV, getColumn, getRow, getRows, getUniqueValues, getRange,
    getColumnNames, getColumnType, getRowCount, getCategoricalIndex,
  };
})();
