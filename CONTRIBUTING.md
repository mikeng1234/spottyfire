# Contributing to SpottyFire

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Clone the repo
2. Open `examples/01-quick-start.html` in your browser — no build tools needed
3. Edit files in `src/` and run `bash build.sh` to rebuild

## Project Structure

- `src/core/` — Data layer, marking engine, themes, filters, formulas
- `src/charts/` — Chart components (each extends BaseChart)
- `src/ui/` — UI components (filter panel, formula bar, toolbar)
- `examples/` — Demo HTML files
- `dist/` — Bundled output

## How to Add a New Chart Type

1. Create `src/charts/YourChart.js` extending `BaseChart`
2. Implement `refresh()` and `_onMarkingChanged()`
3. Bind Plotly events for selection in `_bindEvents()`
4. Add it to `src/index.js` in the SpottyFire namespace
5. Add it to `build.sh`
6. Add an example usage in one of the example files

## Guidelines

- No external dependencies beyond Plotly.js and PapaParse
- Vanilla JS only (ES6 classes are fine)
- Every chart must support cross-chart marking
- Test with the sample dataset before submitting

## Submitting Changes

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run `bash build.sh` and test examples in browser
5. Submit a pull request

## Code Style

- 2-space indentation
- ES6 classes for components
- No semicolons are fine, but be consistent within a file
- Keep functions small and focused
