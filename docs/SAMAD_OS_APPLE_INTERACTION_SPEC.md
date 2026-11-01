# SAMAD-OS — Apple-Inspired Interaction System & Glass Passage
Last updated: 2026-10-31

## 2026-10-31 — Floor, scroll correctness and accessibility completion pass

### Recovered and observed
- Recovered feature HEAD `420e9c2`, draft PR #8, and READY baseline preview of `846eae4`.
- Actual Chrome baseline at scrollY=1100: story top=-288, sticky top=-288; only chapter 5 had nonzero opacity (~0.26). Camera and narrative were desynchronized. The root `overflow-hidden` trapped the sticky layout.
- Floor was visually near-black; low-opacity inlays and a 78% edge vignette obscured it. Large scroll-linked text blur persisted when scrolling stopped.

### Implemented
- Root uses `overflow-x-clip`, preserving viewport sticky positioning.
- Shared `useJourneyProgress` hook measures the visible story in document coordinates, caches bounds with ResizeObserver, and batches scroll updates with requestAnimationFrame. Camera and HTML use the same convention; the 3D test route uses document progress.
- Brighter rough floor material, antialiased perspective inlays, continuous rails, analytic light pools and reduced vignette. Light pools are an approximation, not planar ray-traced reflections. No rendering dependency or postprocessing pass added.
- Recessed portal piers and ceiling returns, varied bay height/width, eased forward camera travel through all eight portals. Text blur removed; readable holds enlarged.
- Small/short viewports use a linear narrative; reduced-motion visitors retain their static narrative. Background animation stops when the document is hidden; canvas errors have a gradient error boundary.
- Larger desktop nav targets, search combobox/listbox semantics, keyboard result tracking, focus restoration without scroll jumps, and real mailto contact action.
- Resolved pre-existing lint failures in fluid initialization, ambient module typing and legacy AudioContext typing. Existing tools, CV, career copy and dashboards retained.
- Tablet story cue moved above the mobile dock after visual inspection.

### Verification evidence
Runtime implementation `5b15abe5d891bc74827b10b31d5c4bcf8dcb5bb2`:
https://my-samad-portfolio-quhhwm28l-samad-portfolio.vercel.app

- `npm ci --ignore-scripts`: 509 packages installed from lockfile. No dependency changes.
- `npm run lint`: passes with no warnings or errors.
- `npm run build`: compilation, TypeScript and 5/5 static pages pass.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.
- Vercel preview READY; target null (preview), not production.
- Chrome desktop: sticky top=0 at scrollY=1100, first chapter opacity=1, others=0. Subsequent scrollY=1780/2460/3140/3820 reveals chapters 2/3/4/5 in order.
- Chrome 375x812: no horizontal overflow; linear story readable. Contact mail link bottom=572 versus dock top=733, leaving clear space.
- Chrome 768x1024: pinned story readable; dock clear of main content. Scroll cue overlap was identified and corrected in the follow-up.
- Search: Ctrl+K opens, ArrowDown selects Metrics, Escape closes and restores search-trigger focus. Filtering Contact then Enter navigates to #contact and closes the dialog.
- Architecture network tab displays Fortinet & Aruba Backbone. Updated /3d-test entry scene reviewed.
- No runtime errors observed in captured console logs; existing Three.Clock deprecation warning remains in dependency code.

### Remaining release checks
- Safari, real-device sustained FPS, reduced-motion OS setting, forced WebGL context loss and screen-reader testing are not verified. Do not infer these from a passing build.
- Reconcile existing professional claims before public release: current job title, Jamf School versus Jamf Pro, infrastructure counts, uptime and savings assertions. This visual pass preserves existing copy and does not certify its truth.
- No Higgsfield credits spent. No generated video substituted for WebGL.
- Keep PR #8 draft. Production/main require explicit user approval.
- Rollback: restore the parent `420e9c2` on the feature branch with a reviewed revert; the original preview remains available.

### Design sources applied
Apple HIG Materials/Motion and WWDC25 “Meet Liquid Glass”: readable content, restrained top-level glass controls, reduced motion/transparency and clear hierarchy. This is a web interpretation, not Apple's native compositor.

## 2026-10-31 — Cinematic motion refinement (ATLAS review)

**Screenshot audit:** The user-supplied browser screenshots were from earlier Vercel preview `my-samad-portfolio-jsyadvw5e-samad-portfolio.vercel.app`, not the most recent build. The previous floating "partner" collage comprised oversized, independently bobbing logo tiles. Several marks were approximate CSS/typography recreations and looked unauthentic.

**Change set:**
- Replaced the collage with `components/experience/TechConstellation.tsx`: 8 exact technology/product names, with concise context labels, modest edge-positioned glass surfaces, staggered entrances and damped pointer-relative depth. Uses plain-text names **rather than pretending to reproduce third-party logo art** or implying sponsorship. Hidden below `xl` to protect small-screen composition.
- Removed per-logo hover synthesizer and 9KB+ of repetitive markup from `app/page.tsx`.
- Added `data-samad-journey` to `components/story/ScrollStory.tsx` and adjusted the camera progress in `components/background/SamadWorld.tsx` to match the story section's actual scroll track instead of the total document height. This ensures the eight portals move coherently as five chapters are revealed.
- Added approach-driven glints to portal tops, two subtly travelling floor ribbons, and a small camera lateral arc. No extra rendering/postprocessing dependency was added. Star/sparkle counts lowered to offset additional animation work.
- Existing reduced-motion path, classic background, full portfolio and main branch are preserved.

**Actual validation:** Vercel build for `846eae4596205476a30795ff565c9852bd13d8ff` reports successful optimized compilation, completed TypeScript, 5/5 generated static pages, and deployment READY:
https://my-samad-portfolio-ajyjg0a7x-samad-portfolio.vercel.app

**Still unverified:** Visual QA on a real device/browser, WebGL frame timings, Safari, reduced-motion testing and screen-reader behavior. These are acceptance checks, not passed results.

**Higgsfield:** Read-only model recommendations consulted for original abstract glass-corridor mood boards. No paid generation was requested or claimed. A rendered video cannot substitute for responsive real-time 3D motion.

**Trademark caution:** Published Microsoft and Apple guidelines restrict use of corporate logos in promotional settings without permission; accurate names can communicate experience without visually inventing or misusing official marks. If licensed/authorized brand assets are supplied later, add them carefully without implying affiliation.

## Executive brief (APEX — intent and constraints)

**Product:** Abdul Samad Babillail's public-facing professional IT leadership portfolio.

**Core experience:** The visitor must feel as if they move through a real cinematic 3D architectural world when scrolling. Real information about work, technology, projects and professional experience should appear with spatial depth, animated timing, readable hierarchy and graceful exit transitions. Avoid turning the experience into a standard card-based dashboard on top of a moving wallpaper.

**Stylistic brief:** Clean executive credibility + glass architecture + refined typography + precise motion. The video reference `121120.mp4` discussed Apple's Human Interface Guidelines (including spacing, type and motion), WWDC guidance and systematic attention to interface detail. It was **not** a demonstration of an embeddable Apple OS graphics API.

**Non-negotiable constraints:**
- Preserve true, reviewable information. Do not invent career achievements or expose additional internal employer information.
- The interactive application is a website built with Next.js, React, Tailwind and Three.js. Do **not** advertise it as running Apple's native Liquid Glass compositor or copying Apple-proprietary graphics assets.
- Use glass as a distinct **control/navigation layer** rather than putting blur on every content surface.
- Content remains legible over the scene and controls stay accessible via keyboard and touch.
- Honor `prefers-reduced-motion`, small screens and constrained GPUs.
- Leave `main` and production unchanged until separately approved. Preserve the Classic background fallback.
- No destructive rewrites of established functional dashboard tools.

## Evidence and source review

- User-provided video: 44.76-second vertical clip. Visuals depict abstract UI examples, a HIG reference (displayed as "123 pages"), WWDC talks, and an interface detail progression ending with "Spacing / Type / Motion". The count shown is part of the clip and **not** a claim about the current size of Apple documentation.
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Apple HIG — Materials: https://developer.apple.com/design/human-interface-guidelines/materials
- Apple HIG — Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- Apple WWDC25 — Meet Liquid Glass: https://developer.apple.com/videos/play/wwdc2025/219/
- Apple WWDC25 — Get to know the new design system: https://developer.apple.com/videos/play/wwdc2025/356/

Apple's guidance emphasizes adaptive readability, intentional hierarchy, responsive navigation, translucent interactive controls and concise feedback. These are principles to translate to web affordances, not identical software implementations.

## Historical project decisions preserved

- Visual ambition: deliberate, premium, hybrid business + technology leadership; no generic AI-template gradients, cards or unnecessary noise.
- Previous direction: 3D Glass Passage with eight portals; moving page-scroll camera and five narrative chapters.
- Earlier code lineage `project-samad/phase-07-liquid-glass` contains a CSS glass-stack hero and WebGL scene. It is a **different history**, not automatically merged into the working 3D feature branch.
- Work on `feature/samad-3d-world-v2`; draft PR #8 targets `main`.
- Previous default homepage includes functional infrastructure/architecture dashboards, robotics matrix, case studies, CV, and terminal; keep these working.

## Implementation / release map

| Area | Implemented in feature branch | Remaining acceptance checks |
| --- | --- | --- |
| 3D world | `components/background/SamadWorld.tsx`: camera-driven glass corridor, moving light, particle atmosphere | Desktop/mobile WebGL visual review and sustained frame-time analysis |
| Scroll narrative | `components/story/ScrollStory.tsx`: five scroll-revealed chapters; original dashboards retained | Check readability, animation pacing, reduced motion |
| Glass navigation | `components/ui/AppleGlassNav.tsx`: desktop pill/dock, active capsule, pointer illumination, mobile bottom dock | Verify every anchor, active state, safe-area spacing, focus and zoom |
| Command center | `components/ui/PortfolioSpotlight.tsx`: Ctrl/⌘K, searchable sections, CV, terminal, environment and sound actions | Keyboard-only and screen-reader checks; Escape, Tab and URL updates |
| Home integration | `app/page.tsx`: nav, Spotlight and existing scene controls | Ensure no regressions to legacy dashboards or terminal |
| Build and security | Next.js patched 16.4.2; `.github/workflows/samad-qa.yml` added | Obtain TypeScript/CI result; check npm audit findings |
| Preview | Vercel preview of commit `dd2289a` built successfully on 2026-10-31 | Newer docs/glass-highlight commits still require validation |

## Interaction grammar — HIG-inspired, not Apple proprietary

### Spacing
Use an intentional baseline rhythm (8 / 12 / 16 / 24 / 32 / 48 / 64 px) and preserve reading margins for long-form content. Keep navigation touch targets at least approximately 44 CSS pixels in each dimension. Avoid crowding the 3D subject into the reading aperture.

### Typography
Use a small number of deliberate sizes: display, section title, body and system microcopy. Establish hierarchy through weight, contrast and space, not constant all-caps labels. Let the hero and key career outcomes lead.

### Motion
Use fast, interruptible spring feedback for navigation and controls. Long-scroll storytelling can transition more slowly, but must never lock scrolling or block links. Honor `prefers-reduced-motion` and avoid excessive GPU shaders.

### Materials
Use translucent responsive glass mainly for nav, Spotlight and transient controls. Give it surface highlights, edge definition and a backdrop that preserves contrast. Do not stack multiple equally translucent panels or obscure readable text. Never imply the web result is technically identical to native Apple graphics.

## Test matrix — stop before release if any material failure

1. `npm ci`, `npx tsc --noEmit`, `npm run build`, `npm audit --omit=dev --audit-level=high`.
2. Desktop Chrome / Safari if available; 375px phone, 768px tablet, 1440px desktop, and keyboard-only.
3. Navbar anchors and active selection, Spotlight `Ctrl/⌘K`, arrows, Enter, Escape, Tab trap, command actions, CV and terminal.
4. Long scroll through all five story chapters and the detailed dashboard sections; no invisible interactive overlays.
5. Run with Reduce Motion enabled; inspect static alternative and ensure content remains available.
6. Inspect GPU/canvas fallback, tab visibility, performance and Lighthouse accessibility. Report measured data, not assumptions.
7. User visual sign-off on preview. Only then discuss merging draft PR #8 to `main` and a separate production release.

## APEX → ATLAS continuation prompt (copy-ready)

> Continue SAMAD-OS from the current GitHub feature branch `feature/samad-3d-world-v2` in repository `Asbabillail/samad-portfolio`. Treat this file as the agreed product specification. Inspect the exact latest diff, preview and CI results first. Follow Apple Human Interface Guidelines for spacing, typography, motion and appropriate glass navigation without claiming Apple's proprietary native compositor. Preserve the scroll-driven Three.js world, existing verified portfolio content, accessible nav and Spotlight. Improve one coherent visual or functional issue per small commit, verify with typecheck/build plus mobile and reduced-motion checks, and document what was observed versus untested. Never change production or `main` without explicit approval. Prioritize the user experience: *entering a world and discovering information through motion*, not stacking translucent cards on a static page.

## Next priorities

**P0:** Verify typecheck/CI and actual preview behavior. Fix bugs before adding more effects.

**P1:** Refine information reveals to feel spatially integrated with the 3D portals. Use geometry-sensitive layering sparingly and protect hero legibility.

**P2:** Reduce redundancy in introductory partner badges, control density, card styles and paragraph length. Establish a cohesive premium executive identity.

**P3:** Profile device performance, accessibility and visual snapshots before proposing a production merge.
