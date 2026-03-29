// ─── FormulaEngine ──────────────────────────────────────────
var FormulaEngine = (function () {

  // Tokenizer
  function tokenize(expr) {
    var tokens = [];
    var i = 0;
    while (i < expr.length) {
      var ch = expr[i];
      if (/\s/.test(ch)) { i++; continue; }
      // Column reference [ColName]
      if (ch === '[') {
        var j = expr.indexOf(']', i);
        if (j < 0) throw new Error('Unclosed [ at ' + i);
        tokens.push({ type: 'col', value: expr.substring(i + 1, j) });
        i = j + 1;
        continue;
      }
      // String literal
      if (ch === '"' || ch === "'") {
        var q = ch;
        var s = '';
        i++;
        while (i < expr.length && expr[i] !== q) { s += expr[i]; i++; }
        i++; // skip close quote
        tokens.push({ type: 'str', value: s });
        continue;
      }
      // Number
      if (/[0-9.]/.test(ch)) {
        var num = '';
        while (i < expr.length && /[0-9.eE]/.test(expr[i])) { num += expr[i]; i++; }
        tokens.push({ type: 'num', value: parseFloat(num) });
        continue;
      }
      // Operators
      if ('+-*/(),<>=!'.indexOf(ch) >= 0) {
        // Handle >=, <=, !=, ==
        if ((ch === '>' || ch === '<' || ch === '!' || ch === '=') && expr[i + 1] === '=') {
          tokens.push({ type: 'op', value: ch + '=' });
          i += 2; continue;
        }
        tokens.push({ type: 'op', value: ch });
        i++; continue;
      }
      // Identifier (function or keyword)
      if (/[a-zA-Z_]/.test(ch)) {
        var id = '';
        while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) { id += expr[i]; i++; }
        // Check for OVER keyword
        if (id.toUpperCase() === 'OVER') {
          tokens.push({ type: 'over', value: 'OVER' });
        } else if (id.toLowerCase() === 'true') {
          tokens.push({ type: 'bool', value: true });
        } else if (id.toLowerCase() === 'false') {
          tokens.push({ type: 'bool', value: false });
        } else {
          tokens.push({ type: 'ident', value: id });
        }
        continue;
      }
      throw new Error('Unexpected char: ' + ch + ' at pos ' + i);
    }
    return tokens;
  }

  // Recursive descent parser
  function parse(tokens) {
    var pos = 0;

    function peek() { return pos < tokens.length ? tokens[pos] : null; }
    function next() { return tokens[pos++]; }
    function expect(type, val) {
      var t = next();
      if (!t || t.type !== type || (val !== undefined && t.value !== val)) {
        throw new Error('Expected ' + type + (val ? '(' + val + ')' : '') + ' got ' + JSON.stringify(t));
      }
      return t;
    }

    function parseExpr() { return parseComparison(); }

    function parseComparison() {
      var left = parseAddSub();
      var t = peek();
      if (t && t.type === 'op' && ['>', '<', '>=', '<=', '==', '!='].indexOf(t.value) >= 0) {
        next();
        var right = parseAddSub();
        return { type: 'binop', op: t.value, left: left, right: right };
      }
      return left;
    }

    function parseAddSub() {
      var left = parseMulDiv();
      while (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
        var op = next().value;
        left = { type: 'binop', op: op, left: left, right: parseMulDiv() };
      }
      return left;
    }

    function parseMulDiv() {
      var left = parseUnary();
      while (peek() && peek().type === 'op' && (peek().value === '*' || peek().value === '/')) {
        var op = next().value;
        left = { type: 'binop', op: op, left: left, right: parseUnary() };
      }
      return left;
    }

    function parseUnary() {
      if (peek() && peek().type === 'op' && peek().value === '-') {
        next();
        return { type: 'unary', op: '-', expr: parsePrimary() };
      }
      return parsePrimary();
    }

    function parsePrimary() {
      var t = peek();
      if (!t) throw new Error('Unexpected end of expression');

      if (t.type === 'num') { next(); return { type: 'literal', value: t.value }; }
      if (t.type === 'str') { next(); return { type: 'literal', value: t.value }; }
      if (t.type === 'bool') { next(); return { type: 'literal', value: t.value }; }
      if (t.type === 'col') {
        next();
        // Check for OVER
        if (peek() && peek().type === 'over') return { type: 'colref', name: t.value };
        return { type: 'colref', name: t.value };
      }
      if (t.type === 'op' && t.value === '(') {
        next();
        var expr = parseExpr();
        expect('op', ')');
        return expr;
      }
      if (t.type === 'ident') {
        next();
        // Function call
        if (peek() && peek().type === 'op' && peek().value === '(') {
          next(); // skip (
          var args = [];
          if (!(peek() && peek().type === 'op' && peek().value === ')')) {
            args.push(parseExpr());
            while (peek() && peek().type === 'op' && peek().value === ',') {
              next();
              args.push(parseExpr());
            }
          }
          expect('op', ')');
          // Check for OVER
          var overCol = null;
          if (peek() && peek().type === 'over') {
            next();
            var oc = next();
            overCol = oc.value || oc.name;
          }
          return { type: 'call', name: t.value, args: args, over: overCol };
        }
        return { type: 'ident', name: t.value };
      }
      throw new Error('Unexpected token: ' + JSON.stringify(t));
    }

    var ast = parseExpr();
    return ast;
  }

  // Built-in functions
  var FUNCS = {
    // Math
    Abs: function (a) { return Math.abs(a); },
    Round: function (a, d) { var f = Math.pow(10, d || 0); return Math.round(a * f) / f; },
    Floor: function (a) { return Math.floor(a); },
    Ceil: function (a) { return Math.ceil(a); },
    Log: function (a) { return Math.log(a); },
    Sqrt: function (a) { return Math.sqrt(a); },
    Power: function (a, b) { return Math.pow(a, b); },
    Min: function () { return Math.min.apply(null, arguments); },
    Max: function () { return Math.max.apply(null, arguments); },
    // String
    Upper: function (s) { return String(s).toUpperCase(); },
    Lower: function (s) { return String(s).toLowerCase(); },
    Trim: function (s) { return String(s).trim(); },
    Left: function (s, n) { return String(s).substring(0, n); },
    Right: function (s, n) { return String(s).slice(-n); },
    Len: function (s) { return String(s).length; },
    Concatenate: function () { return Array.from(arguments).join(''); },
    Replace: function (s, old, rep) { return String(s).split(old).join(rep); },
    Contains: function (s, sub) { return String(s).indexOf(sub) >= 0; },
    // Date
    Year: function (d) { return new Date(d).getFullYear(); },
    Month: function (d) { return new Date(d).getMonth() + 1; },
    Day: function (d) { return new Date(d).getDate(); },
    Today: function () { return new Date().toISOString().slice(0, 10); },
    DateDiff: function (a, b, unit) {
      var d1 = new Date(a), d2 = new Date(b);
      var ms = d2 - d1;
      if (unit === 'days') return Math.floor(ms / 86400000);
      if (unit === 'months') return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
      if (unit === 'years') return d2.getFullYear() - d1.getFullYear();
      return ms;
    },
    DateAdd: function (d, n, unit) {
      var dt = new Date(d);
      if (unit === 'days') dt.setDate(dt.getDate() + n);
      else if (unit === 'months') dt.setMonth(dt.getMonth() + n);
      else if (unit === 'years') dt.setFullYear(dt.getFullYear() + n);
      return dt.toISOString().slice(0, 10);
    },
    // Logic
    If: function (cond, a, b) { return cond ? a : b; },
    And: function () { return Array.from(arguments).every(Boolean); },
    Or: function () { return Array.from(arguments).some(Boolean); },
    Not: function (a) { return !a; },
    IsNull: function (a) { return a == null || a === ''; },
    IfNull: function (a, b) { return (a == null || a === '') ? b : a; },
  };

  // Evaluate AST for a single row
  function evaluate(ast, row) {
    if (!ast) return null;
    switch (ast.type) {
      case 'literal': return ast.value;
      case 'colref': return row[ast.name];
      case 'ident': return ast.name;
      case 'unary':
        return ast.op === '-' ? -evaluate(ast.expr, row) : evaluate(ast.expr, row);
      case 'binop': {
        var l = evaluate(ast.left, row);
        var r = evaluate(ast.right, row);
        switch (ast.op) {
          case '+': return (typeof l === 'string' || typeof r === 'string') ? String(l) + String(r) : (+l) + (+r);
          case '-': return (+l) - (+r);
          case '*': return (+l) * (+r);
          case '/': return (+r) === 0 ? null : (+l) / (+r);
          case '>': return (+l) > (+r);
          case '<': return (+l) < (+r);
          case '>=': return (+l) >= (+r);
          case '<=': return (+l) <= (+r);
          case '==': return l == r;
          case '!=': return l != r;
        }
        break;
      }
      case 'call': {
        var fname = ast.name;
        // Case-insensitive lookup
        var fn = FUNCS[fname] || FUNCS[fname.charAt(0).toUpperCase() + fname.slice(1).toLowerCase()];
        if (!fn) {
          // Try case-insensitive
          for (var k in FUNCS) {
            if (k.toLowerCase() === fname.toLowerCase()) { fn = FUNCS[k]; break; }
          }
        }
        if (!fn) throw new Error('Unknown function: ' + fname);
        var args = ast.args.map(function (a) { return evaluate(a, row); });
        return fn.apply(null, args);
      }
    }
    return null;
  }

  // Compile formula → function(row) → value
  function compile(formula) {
    var tokens = tokenize(formula);
    var ast = parse(tokens);
    return function (row) {
      try { return evaluate(ast, row); }
      catch (e) { return null; }
    };
  }

  // Window functions: pre-compute aggregates over groups
  function compileWindow(formula, rows) {
    var tokens = tokenize(formula);
    var ast = parse(tokens);
    if (ast.type === 'call' && ast.over) {
      var aggName = ast.name.toLowerCase();
      var colNode = ast.args[0];
      var colName = colNode.name || colNode.value;
      var groupCol = ast.over;
      // Group rows
      var groups = {};
      rows.forEach(function (r) {
        var gk = String(r[groupCol]);
        if (!groups[gk]) groups[gk] = [];
        groups[gk].push(+r[colName] || 0);
      });
      // Compute aggregate per group
      var results = {};
      for (var g in groups) {
        var vals = groups[g];
        if (aggName === 'avg') results[g] = vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
        else if (aggName === 'sum') results[g] = vals.reduce(function (a, b) { return a + b; }, 0);
        else if (aggName === 'min') results[g] = Math.min.apply(null, vals);
        else if (aggName === 'max') results[g] = Math.max.apply(null, vals);
        else if (aggName === 'count') results[g] = vals.length;
      }
      return function (row) { return results[String(row[groupCol])]; };
    }
    return compile(formula);
  }

  return { compile: compile, compileWindow: compileWindow, tokenize: tokenize, parse: parse, FUNCS: FUNCS };
})();
