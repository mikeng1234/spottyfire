# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.x.x   | Yes                |
| < 1.0   | No                 |

## Reporting a Vulnerability

If you discover a security vulnerability in SpottyFire, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please:

1. Open a [private security advisory](https://github.com/mikeng1234/spottyfire/security/advisories/new) on GitHub
2. Provide a detailed description of the vulnerability
3. Include steps to reproduce if possible
4. Allow reasonable time for a fix before public disclosure

## What Qualifies

- Cross-site scripting (XSS) through data injection
- Prototype pollution via user-supplied data
- Vulnerabilities in how CSV/JSON data is parsed and rendered
- Formula engine injection (malicious expressions in `addCalculatedColumn`)
- Context menu or menu bar action escalation
- CSV/JSON upload handling vulnerabilities (drag-and-drop or file picker in `app.html`)
- Any issue that could compromise a user's browser or data

## What Does Not Qualify

- Vulnerabilities in third-party dependencies (Plotly.js, PapaParse) — report those to their respective projects
- Missing security headers on pages using SpottyFire (that's the host application's responsibility)
- Issues requiring physical access to a user's machine

## Response Timeline

- **Acknowledgment:** Within 48 hours
- **Assessment:** Within 1 week
- **Fix:** Dependent on severity, typically within 2 weeks for critical issues
