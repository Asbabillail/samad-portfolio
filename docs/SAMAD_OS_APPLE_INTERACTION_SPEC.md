# SAMAD-OS — Apple-Inspired Interaction System & Glass Passage
Last updated: 2026-10-31

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
