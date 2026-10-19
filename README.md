# Revwin Studio

A responsive six-page studio website with two concept case studies, privacy information and website terms. Built with semantic HTML, plain JavaScript and CSS to keep this presentation website small and dependency-free. No package installation or environment variables required.

The hero has a coordinated 44-second elliptical CSS orbit with counter-rotation to keep all four cards upright. Websites and Software use orange accents; Marketing and Automation use green. A pause control is available and reduced motion holds all cards at their initial positions. Shared contact links are used in the footer and Contact page.

## Files
- `dist/`: deployable website, including route directories, styles, interactions and metadata.
- `build.py`: regenerates page shells, SEO metadata, sitemap and icons; run `python3 build.py` after route or domain changes.
- `.openai/hosting.json`: Sites project identity and static output configuration.

## Run locally
Run `python3 -m http.server 8080 --directory dist` from this directory. Open http://localhost:8080. No framework build is required. Edit centralized service data and page content in `dist/app.js`; design tokens and breakpoints are in `dist/style.css`.

## Deploy
Publish `dist/` as static output. For Vercel choose Other, no build command, and output directory `dist`. Each clean route has its own index.html. On a different production domain, update `origin` in build.py, regenerate, and check canonical URLs and sitemap.

## Features
- Six main pages, two detailed concept case studies and website information pages.
- Mobile navigation, keyboard-operable capability tabs, six illustrative live workflows, category filters, native FAQ accordions.
- Reusable `ServicesSection()` with five structured service stories, custom code-native mockups, a sticky scroll presentation with opaque cards sliding upward over the preceding card, a fixed left-hand composition, synchronized numbering, progress bar and service navigation. No autoplay, video, or new dependency is needed.
- `dist/services-scroll.js` coordinates a single passive scroll listener with deterministic card interpolation, reading intervals, native scroll jumps, and cleanup. The existing HTML/CSS/JS stack is retained rather than migrating unrelated pages to a framework.
- Mobile, reduced-motion and short-viewports use readable cards in natural document flow. Desktop pinning holds the left column and card viewport in place through the entire sequence; on shorter desktop viewports the card content remains scrollable if needed. Tablet pinning is enabled when the measured content fits. The sixth strategy service remains on the dedicated Services page.
- Project brief validation, multi-service selection, accessible feedback and clipboard export.
- Responsive layout, visible focus, reduced-motion support, restrained entrance and diagram animations.
- Per-page metadata, canonical URLs, sitemap and robots file. The SVG social preview may need a PNG replacement for some social networks.

## Missing content and integrations
The supplied official logo is stored unchanged at `dist/assets/revwin-logo.png` and used by the header and footer. The central hero restores the original white R on its blue dimensional tile. The official telephone is +12513532067 and Instagram is https://www.instagram.com/revwin_studio/. No client project assets, team biographies or verified results were supplied. Portfolio projects are self-initiated concepts, and interface numbers are explicitly examples. No claims are based on those numbers.

The contact form is intentionally a local brief builder. It does not submit, store, or email enquiries and clearly explains this before and after use. To enable delivery: implement a server endpoint with server-side validation, rate limiting and spam protection; configure an approved email/CRM provider with server-side secrets; update the front-end submit handler to POST to that endpoint; display success only after the endpoint confirms delivery; update privacy and consent language with verified operator/contact details and data handling. Never put credentials in app.js.

Google Fonts are requested externally with system-font fallbacks. Self-host font files if required. Business-specific privacy and contractual terms need operator details and review before commercial launch. No marketing trackers are installed.

## Verification
JavaScript syntax, route files, internal link targets and all page templates are checked locally. The service presentation is checked in a simulated DOM at widths 375, 390, 640, 768, 1024, 1280 and 1440, plus reduced motion. Pure progress tests check every interval, the card order, transition overlap, navigation targets, active-link focusability and final-card state. These checks do not replace visual browser QA. Hero markup, links, accent mapping, pause toggling, logo byte identity and geometric orbit envelopes are also checked locally. Browser responsive QA was performed across ten routes and nine widths; see AUDIT.md for current checks and limitations. Lighthouse and full accessibility compliance are not claimed.

## Current development commands

Service illustrations are served as compressed `dist/assets/service-*.jpg` files. Generated PNG originals and prompt provenance are in `output/service-art/`; `optimize-service-images.ps1` prepares web JPEGs from newly supplied service PNGs. These assets are used in the home service story and on the Services page.

The current footer-inspired visual system lives in `dist/studio-theme.css`, loaded after the original styles and responsive refinements. It applies warm gray and cream panels, black surfaces, monospace typography, dotted display accents and orange arrow buttons across all ten routes. The official logo, blue hero R, orange/green service accents, content and interactions are retained.

- Run locally: `node serve.cjs` then open http://localhost:8080.
- Build metadata and check assets/syntax: `node build.cjs` (portable alternative to the Python generator).
- Verify rendered routes, internal anchors and service motion math: `node verify.cjs`.
- Responsive and motion refinements: `dist/refinements.css`. Phones use stationary readable service cards; larger screens retain the orbit. Service pinning falls back to natural flow whenever content does not fit.
- Audit findings and browser verification: `AUDIT.md`.
