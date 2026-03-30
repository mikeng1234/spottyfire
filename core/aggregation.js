// SpottyFire Aggregation Engine — Grouped aggregation with row-index backreferences

const AggregationEngine = (() => {

  const aggFunctions = {
    count: (values) => values.length,
    sum: (values) => values.reduce((a, b) => a + b, 0),
    avg: (values) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0,
    min: (values) => values.length ? Math.min(...values) : 0,
    max: (values) => values.length ? Math.max(...values) : 0,
    median: (values) => {
      if (!values.length) return 0;
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    },
  };

  // Grouped aggregation — returns array of { group, value, rowIndices }
  function aggregate({ rowIndices, groupByColumn, valueColumn, aggregation }) {
    const groupCol = DataStore.getColumn(groupByColumn);
    const valCol = valueColumn ? DataStore.getColumn(valueColumn) : null;
    if (!groupCol) return [];

    const totalRows = DataStore.getRowCount();
    const isAllRows = (rowIndices === null);

    // Bucket rows by group
    const buckets = new Map(); // groupValue -> { values: number[], rowIndices: Set }

    const iterateRow = (i) => {
      const groupVal = groupCol.values[i];
      if (!buckets.has(groupVal)) {
        buckets.set(groupVal, { values: [], rowIndices: new Set() });
      }
      const bucket = buckets.get(groupVal);
      bucket.rowIndices.add(i);
      if (valCol) {
        bucket.values.push(valCol.values[i]);
      }
    };

    if (isAllRows) {
      for (let i = 0; i < totalRows; i++) iterateRow(i);
    } else {
      for (const i of rowIndices) iterateRow(i);
    }

    // Apply aggregation function
    const aggFn = aggFunctions[aggregation] || aggFunctions.count;
    const results = [];

    buckets.forEach((bucket, groupVal) => {
      const value = (aggregation === 'count')
        ? bucket.rowIndices.size
        : aggFn(bucket.values);

      results.push({
        group: groupVal,
        value,
        rowIndices: bucket.rowIndices,
      });
    });

    // Sort by group name for consistent display
    results.sort((a, b) => {
      if (typeof a.group === 'number' && typeof b.group === 'number') return a.group - b.group;
      return String(a.group).localeCompare(String(b.group));
    });

    return results;
  }

  // For scatter plots — returns per-point data (no grouping)
  function getPointData({ rowIndices, xColumn, yColumn, colorColumn, sizeColumn, labelColumn }) {
    const xCol = DataStore.getColumn(xColumn);
    const yCol = DataStore.getColumn(yColumn);
    if (!xCol || !yCol) return [];

    const colorCol = colorColumn ? DataStore.getColumn(colorColumn) : null;
    const sizeCol = sizeColumn ? DataStore.getColumn(sizeColumn) : null;
    const labelCol = labelColumn ? DataStore.getColumn(labelColumn) : null;
    const totalRows = DataStore.getRowCount();
    const isAllRows = (rowIndices === null);

    const points = [];
    const iterate = (i) => {
      points.push({
        x: xCol.values[i],
        y: yCol.values[i],
        color: colorCol ? colorCol.values[i] : null,
        size: sizeCol ? sizeCol.values[i] : null,
        label: labelCol ? labelCol.values[i] : null,
        rowIndex: i,
      });
    };

    if (isAllRows) {
      for (let i = 0; i < totalRows; i++) iterate(i);
    } else {
      for (const i of rowIndices) iterate(i);
    }

    return points;
  }

  // Two-column cross aggregation (for heat maps, cross tables)
  function crossAggregate({ rowIndices, rowColumn, colColumn, valueColumn, aggregation }) {
    const rowCol = DataStore.getColumn(rowColumn);
    const colCol = DataStore.getColumn(colColumn);
    const valCol = valueColumn ? DataStore.getColumn(valueColumn) : null;
    if (!rowCol || !colCol) return { rows: [], cols: [], matrix: [], rowIndicesMatrix: [] };

    const totalRows = DataStore.getRowCount();
    const isAllRows = (rowIndices === null);
    const buckets = new Map(); // `${rowVal}|||${colVal}` -> { values, rowIndices }

    const iterateRow = (i) => {
      const rVal = rowCol.values[i];
      const cVal = colCol.values[i];
      const key = `${rVal}|||${cVal}`;
      if (!buckets.has(key)) buckets.set(key, { values: [], rowIndices: new Set() });
      const bucket = buckets.get(key);
      bucket.rowIndices.add(i);
      if (valCol) bucket.values.push(valCol.values[i]);
    };

    if (isAllRows) {
      for (let i = 0; i < totalRows; i++) iterateRow(i);
    } else {
      for (const i of rowIndices) iterateRow(i);
    }

    const uniqueRows = [...new Set(rowCol.values)].sort();
    const uniqueCols = [...new Set(colCol.values)].sort();
    const aggFn = aggFunctions[aggregation] || aggFunctions.count;

    const matrix = [];
    const rowIndicesMatrix = [];
    uniqueRows.forEach(rVal => {
      const row = [];
      const riRow = [];
      uniqueCols.forEach(cVal => {
        const bucket = buckets.get(`${rVal}|||${cVal}`);
        if (bucket) {
          row.push(aggregation === 'count' ? bucket.rowIndices.size : aggFn(bucket.values));
          riRow.push(bucket.rowIndices);
        } else {
          row.push(0);
          riRow.push(new Set());
        }
      });
      matrix.push(row);
      rowIndicesMatrix.push(riRow);
    });

    return { rows: uniqueRows, cols: uniqueCols, matrix, rowIndicesMatrix };
  }

  return { aggregate, getPointData, crossAggregate };
})();
