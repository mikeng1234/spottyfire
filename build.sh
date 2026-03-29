#!/bin/bash
echo "Building SpottyFire..."
echo "(function(global) {" > dist/spottyfire.js
echo "'use strict';" >> dist/spottyfire.js
cat src/core/ThemeManager.js >> dist/spottyfire.js
cat src/core/MarkingManager.js >> dist/spottyfire.js
cat src/core/FilterEngine.js >> dist/spottyfire.js
cat src/core/FormulaEngine.js >> dist/spottyfire.js
cat src/core/DataStore.js >> dist/spottyfire.js
cat src/charts/BaseChart.js >> dist/spottyfire.js
cat src/charts/BarChart.js >> dist/spottyfire.js
cat src/charts/ScatterPlot.js >> dist/spottyfire.js
cat src/charts/LineChart.js >> dist/spottyfire.js
cat src/charts/PieChart.js >> dist/spottyfire.js
cat src/charts/HeatMap.js >> dist/spottyfire.js
cat src/charts/DataTable.js >> dist/spottyfire.js
cat src/ui/ChartWrapper.js >> dist/spottyfire.js
cat src/ui/FilterPanel.js >> dist/spottyfire.js
cat src/ui/FormulaBar.js >> dist/spottyfire.js
cat src/index.js >> dist/spottyfire.js
echo "})(typeof window !== 'undefined' ? window : this);" >> dist/spottyfire.js

SIZE=$(wc -c < dist/spottyfire.js)
echo "Built dist/spottyfire.js (${SIZE} bytes)"

cp dist/spottyfire.js dist/spottyfire.min.js
echo "Copied dist/spottyfire.min.js (use terser for real minification)"
echo "Done!"
