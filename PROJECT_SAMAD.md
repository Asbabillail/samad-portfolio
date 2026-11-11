# PROJECT SAMAD — Upgrade Register

**Product:** Personal executive/business-and-technology portfolio
**Repository:** `Asbabillail/samad-portfolio`
**Production branch:** `main`
**Implementation branch:** `project-samad/phase-01-foundation`
**Baseline commit:** `9002267729686d87b1124c377d583b7907cf5741`
**Started:** 2026-10-19
**Release policy:** Do not merge to `main` or deploy to production without separate user approval.

## Current direction

- **Brand:** Hybrid Business & Technology Leadership, with entrepreneurship and consulting as future aspirations, not an existing company.
- **Visual art:** Concept C — cinematic but executive; smooth pointer-responsive 3D accents, graceful motion and performance fallbacks.
- **Evidence:** Role title displayed on business card is Head of IT Department; no formal Qiwa title or contract was established. No employer-specific figures, security details, commercial values or case studies may be newly released without verification and disclosure permission.
- **Ownership:** Private repositories and institutional work are excluded from publication pending approval.
- **Phase reporting:** A `docs/phase-reports/PHASE-NNN.md` record for each upgrade; update the index below.

## Phase index

| Phase | Purpose | Status | Report |
| --- | --- | --- | --- |
| 001 | Foundation, business-first homepage and pointer-responsive 3D prototype | Implemented on development branch; verification pending | [PDF](docs/phase-reports/PHASE-001.pdf) / [Technical notes](docs/phase-reports/PHASE-001.md) |
| 002 | Responsive navigation, business-led sections, lighter motion foundation | Development branch; test and disclosure review pending | [PDF](docs/phase-reports/PHASE-002.pdf) |
| 003 | Native WebGL2 3D visual, reduced-motion/visibility controls and executive SEO | Development implementation; test pending | [PDF](docs/phase-reports/PHASE-003.pdf) |
| 004 | Enforce Next.js TypeScript checks; validate protected Vercel preview | Preview build passed; browser/privacy QA pending | [PDF](docs/phase-reports/PHASE-004.pdf) |

## Record format

For each phase record: date, rationale, before/after state, source files, Git commits, validation commands and results, risk classification, unresolved blockers, rollback, and explicit production approval status.

## Releasing a phase

1. Review commit diff and evidence disclosure.
2. Run `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run build` and relevant interaction tests in an environment with dependencies.
3. Use a protected preview deployment and test mobile, keyboard, reduced-motion, errors and performance.
4. Obtain user approval for a merge and production deployment as separate actions.
5. Record production deployment SHA, URL, acceptance result and rollback reference.

Do not treat GitHub commit success as equivalent to a successful build or browser test.
