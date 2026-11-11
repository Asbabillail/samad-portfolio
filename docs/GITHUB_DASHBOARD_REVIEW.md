# A4.s03 · GitHub engineering dashboard

**Scope:** Review-branch implementation of `/github`, not yet deployed to production.

## Design
- Premium-white and pearl-blue responsive dashboard with soft-glass card surfaces and a restrained cobalt accent.
- Left identity sidebar, project cards, actual public GitHub metrics, primary language distribution, contribution activity link, credential-gallery link.
- User's public GitHub avatar (no AI-generated identity image).
- Real repository links: APEX, ATLAS, SAMAD-OS and Apple Management Architect.

## Data & truth safeguards
- Account counts, repository stars, forks, followers and primary languages are read from GitHub's **public REST API**.
- API data is cached by Next.js for one hour. If GitHub fails or rate-limits requests, numeric values are not fabricated; they display an em dash instead.
- Aggregate star/fork counts are displayed only when the public repository list covers the full public-repository count. This avoids showing partial counts as totals.
- Technology percentages count repositories whose reported primary language matches, not lines of code or engineering proficiency.
- GitHub's own contribution calendar is linked rather than inventing a heatmap or using a third-party tracking service.
- Featured-project summaries are editorial and distinguish experimental AI skills, documentation previews, and illustrative portfolio demonstrations from deployed software.
- No personal credential PDFs, school/student device records, confidential diagrams, fee rules or raw operational exports are used.

## Technical implementation
- The page is built as a Next.js App Router server component in `app/github/page.tsx`.
- Styling is isolated in `app/github/github.module.css`.
- No dependency on API tokens or added paid services.
- Keyboard focus indicators, semantic headings, accessible link names, mobile breakpoints, and reduced-motion support.
- The global homepage (`/`), application configuration, and production deployment are not changed.

## Validation gates
- Verify TypeScript in a focused `tsconfig.github.json` to avoid inherited unrelated errors on main.
- Run ESLint for `app/github/page.tsx` and Next.js production build in a pull-request workflow.
- Manually inspect the rendered page in desktop and mobile browsers, including links and real GitHub API fallback behavior, before production merge.
- GitHub's REST API is subject to public rate limits; a displayed dash is expected during quota interruptions.

## Next release decision
After reviewing the dashboard's visual appearance and data, the owner can decide whether to merge this isolated page, link it from the public GitHub README, and deploy via the site's existing authorized Vercel workflow. No direct production deployment is part of this feature branch.
