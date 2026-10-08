# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/CV website for a DevOps/Cloud Engineer, built with **Docusaurus 3.6.3** (React-based static site generator). Deployed as a Docker container on an ARM64 Kubernetes cluster on Oracle Cloud, managed via GitOps with ArgoCD.

## Commands

```bash
npm start          # Start dev server with hot reload (localhost:3000)
npm run build      # Build static site for production
npm run serve      # Serve production build locally
npm run clear      # Clear Docusaurus build cache
npm run swizzle    # Customize Docusaurus theme components
```

No test suite is configured.

## Architecture

### Content Structure
- `src/pages/index.js` — Homepage: hero (photo, name, lead sentence, resume download and contact buttons, certification badges), pipeline card, strengths strip, experience timeline, personal projects cards and a closing contact row (all inline, no separate component file)
- `src/data/profile.json` — Single source of truth for all profile data: name, title, careerStartYear, contact, location, skills, languages, badges, description paragraphs, strengths, profileImage, learnMoreLink, projects, and experiences array
- `src/utils/generateResume.js` — Generates and downloads an A4 PDF resume from `profile.json` using jsPDF (dynamically imported for SSR safety). Two variants: the designed 1-page two-column layout, and `{ plain: true }`, a single-column text-only one for applicant tracking systems. Its palette is hardcoded in the file (the site's earlier blue palette, not the current tokens). The designed layout has no overflow handling: after adding text, check that both columns still end above the footer, in both languages (Spanish runs longer).
- `src/css/custom.css` — The design system: every `--rl-*` token (palette, semantic colors per theme, fonts and sizes, spacing, radii, borders, shadows, motion), the Infima variables mapped onto them, and the navbar/footer styling
- `nginx/` — Nginx config copied into the image: serves `<path>/index.html` for `<path>` without a redirect, gzip, cache headers, security headers and the Docusaurus 404 pages
- `static/img/social-card.png` — Share-preview image (`themeConfig.image`), 1200×630
- `docs/site-infrastructure.md` — Infrastructure documentation (Kubernetes, Terraform, ArgoCD, CI/CD)
- `blog/` — Portfolio project posts
- `blog/authors.yml` — Author definitions required when creating new blog posts (add entries here first)

### Key rendering patterns in `index.js`
- `{yearsExp}` placeholder in `profile.json` description strings is resolved at runtime via `resolveText()`. Only the first `description` paragraph is shown on the homepage (hero lead and meta description); the PDF prints all of them
- Each experience is rendered by `Entry` from these fields:
  - `summary` and `highlights` (`[{ lead, text }]`, both with `_es` variants) — the one-line scope and the 2–3 impact bullets. Homepage only, the PDF ignores them
  - `description` lines of the form `"- Label: item1, item2"` → labeled rows of stack chips (`parseStack`). `stack` holds lines in the same format for a role whose description has none
  - The remaining `description` lines (prose) and the full `achievements` array (with `achievements_es`) → inside the collapsed "More about this role" block. The PDF prints both in full
- `Pipeline` is the card with the steps that deploy the site. The steps play once on load with CSS animations only (`--i` is the step index) and "Replay" remounts the list. It parses the deploy time out of `customFields.imageTag` (`ga-YYYY.MM.DD-HHMM`, UTC) and hides that row when the tag has another format, as in local builds
- `src/pages/index.module.css` — Component styles for the homepage

### Design system
- Dark-first navy "blueprint" look with one amber accent; green (`--rl-ok`) is reserved for status. Light mode is the same system on paper
- Components never hardcode a color, size, radius, border or shadow: they read the `--rl-*` tokens. Breakpoints are the only literals, since media and container queries cannot read variables
- Boxed elements share one shape (1px hairline, `--rl-radius-md`, no shadow; `--rl-radius-sm` for chips) and one hover (border turns to the accent, surface goes one step up, nothing moves)
- The global `.rl-ink` class keeps a subtree on the dark theme in both modes (pipeline card; the footer does the same). Rules inside such a subtree must use `--rl-*` tokens directly: `--ifm-*` variables are resolved on `<html>` and keep the page theme
- Animations live inside `@media (prefers-reduced-motion: no-preference)`, so without motion the final state is what renders
- Fonts are self-hosted through `@fontsource-variable/archivo` (display and body, the width axis is the display voice) and `@fontsource-variable/martian-mono`

### i18n (English / Spanish)
The site is bilingual. Two separate systems handle translations:

1. **`profile.json` dynamic content** — append `_es` to any field to provide a Spanish override (e.g., `title_es`, `date_es`, `description_es`). The `loc(locale, obj, key)` helper in `index.js` picks the right variant at render time.
2. **Static UI strings in `index.js`** — `<Translate id="home.…">` / `translate()` with the English text inline; the Spanish text is in `i18n/es/code.json` under the same id.
3. **Blog posts and docs** — Spanish versions live under `i18n/es/docusaurus-plugin-content-blog/` and `i18n/es/docusaurus-plugin-content-docs/` mirroring the same filenames.
4. **Navbar/footer** — translated in `i18n/es/docusaurus-theme-classic/navbar.json` and `footer.json`.

### Dependencies
- `jspdf` — PDF resume generation (dynamic import, client-side only)
- `@fontsource-variable/archivo`, `@fontsource-variable/martian-mono` — font files, imported at the top of `custom.css`

### Configuration
- `docusaurus.config.js` — Site config with navbar, footer, and theme. Respects `DOCKER_IMAGE_TAG` and `DOCUSAURUS_CONF_URL` env vars. The image tag is also exposed as `customFields.imageTag` and shown in the pipeline card of the homepage, and in the footer copyright (an HTML string styled by `.footer__build`). The homepage `<title>` is `title | tagline`
- `sidebars.js` — Auto-generates sidebar from `docs/` directory

### CI/CD & Deployment
The GitHub Actions workflow (`.github/workflows/build-deploy-docker.yml`) triggers on push to `main`:
1. Builds a multi-stage Docker image for `linux/arm64` (Nginx serving static files). The Node build stage runs on `$BUILDPLATFORM` (no emulation); only the final Nginx stage is arm64
2. Tags the image with timestamp format `ga-YYYY.MM.DD-HHMM` and pushes to Docker Hub (`rllopdev/rllopsite`)
3. Checks out a separate Helm repo (`ricardllop/oke-helm-charts`) and updates the image tag in `values.yaml` using `yq`
4. ArgoCD detects the Helm repo change and auto-syncs the deployment

**Dockerfile** targets production ARM64. **Dockerfile-local** is for local container testing with different URL defaults:
```bash
docker build -f Dockerfile-local -t rllopsite:local .
docker run -p 80:80 rllopsite:local
```

> **Note:** `npm run predeploy` and `npm run deploy` exist in `package.json` but are unused — deployment is via Docker/ArgoCD, not GitHub Pages. Do not use these scripts.
