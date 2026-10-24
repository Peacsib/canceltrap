---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Next.js Scaffold with Risklyte Glass System & Single-Viewport Hero Landing**
  - **Becomes usable**: Running Next.js application with glassy blue styling, split-hero layout, transparent logo support, and interactive upload card with 3 selectable preset pills (*Lovable Pro*, *Adobe Annual*, *7-Day AI Trial*).
  - **Why now**: Bootstraps the application, locks in design tokens and typography, and establishes the initial landing surface.
  - **PRD ref**: `prd.md > Surface 1: The Hero Landing`, `prd.md > Look and Feel`
  - **Spec ref**: `spec.md > Technical Stack`, `spec.md > Components`
  - **Verify (mechanical)**: Dev server runs on port 3000 with HTTP 200 and error-free build.
  - **Commit**: `feat: scaffold Next.js app with Risklyte glass styling and HeroLanding`

- [x] **2. The Defusal Dashboard with Vampire Bleed, Interactive Checklist, and 1-Click .ics Kill-Switch**
  - **Becomes usable**: Clicking any preset pill runs the sequential scanning animation and displays the Defusal Dashboard with live countdown, 5-year vampire bleed, interactive defusal checklist, direct portal bypass button, and 1-click `.ics` calendar kill-switch file download.
  - **Why now**: Delivers the core loop immediately using realistic preset data, proving the entire client experience without needing an API key.
  - **PRD ref**: `prd.md > Surface 2: The Defusal Dashboard`, `prd.md > 1. Preset Receipt Selection`, `prd.md > 5. 1-Click Calendar Kill-Switch`
  - **Spec ref**: `spec.md > Components`, `spec.md > Client-Side Calendar Kill-Switch`
  - **Verify (mechanical)**: Test preset selection and verify dashboard renders with correct calculations; test `.ics` generator output string format contains valid `VCALENDAR`, `VEVENT`, and `VALARM` headers.
  - **Commit**: `feat: implement DefusalDashboard with vampire bleed and ics kill switch`

- [x] **3. Live Multimodal Gemini 3.8 Flash Route Handler & Error Handling**
  - **Becomes usable**: Dropping or selecting a real custom screenshot sends the image to `POST /api/analyze`, where Gemini 3.8 Flash extracts the data in strict JSON. If an invalid or blurry image is uploaded, an inline red warning alert is displayed inside the card allowing immediate retry.
  - **Why now**: Connects live multimodal AI reasoning, completes the learning objective for strict Gemini JSON contracts, and closes the edge-case loop.
  - **PRD ref**: `prd.md > Features and Behavior > 2. Custom Screenshot Upload & Analysis`
  - **Spec ref**: `spec.md > Multimodal Screenshot Analysis`
  - **Verify (mechanical)**: POST a mock receipt image to `/api/analyze` and verify 200 response with validated schema.
  - **Commit**: `feat: add Gemini 3.8 Flash multimodal analysis API with error handling`

- [x] **4. Multi-Stage Discovery Pipeline & Zero-Cost Live Web Intelligence Engine**
  - **Becomes usable**: Universal search input supporting any subscription service name or pasted URL. Checks deterministic registry first (50+ services), executes live web intelligence in ~200ms to resolve real domains (e.g. `ecoaitoken.co.zw`, `strava.com`), and validates via Gemini AI.
  - **Why now**: Eliminates reliance on in-memory hardcoding for new services; guarantees zero hallucinated `.io`/`.com` domains.
  - **PRD ref**: `prd.md > Features and Behavior > 1. Multi-Stage Discovery Pipeline`
  - **Spec ref**: `spec.md > The Core Pipeline > 1. Multi-Stage Resolution Pipeline`
  - **Verify (mechanical)**: Queries for `ecoai` resolve real Zimbabwean Econet domain (`ecoaitoken.co.zw`) with USSD `*449#`; nonsense queries (`asdfghjk99`) trigger anti-hallucination guardrails.
  - **Commit**: `feat: implement live web discovery engine and anti-hallucination pipeline`

- [x] **5. Universal High-Res Brand Marks & Regional Provider Support**
  - **Becomes usable**: Autocomplete suggestions and destination cards render real 128px high-res brand logos via Google Favicon API with regional telecom badges (e.g. `🇿🇼 ZIM` for Econet Wireless Zimbabwe).
  - **Why now**: Users recognize services by visual logos; prevents brand confusion between global and regional entities.
  - **PRD ref**: `prd.md > Features and Behavior > 2. Universal High-Res Brand Marks`
  - **Spec ref**: `spec.md > Universal Brand Mark Engine`
  - **Verify (mechanical)**: Inspected autocomplete dropdown and verified logos for Google Cloud, Adobe, Econet, Figma, Netflix, and Spotify render cleanly.
  - **Commit**: `feat: add dynamic high-res brand logo engine with regional flags`

- [x] **6. Enjoyous Comic Stick Figure Search Animation & Emerald Celebration**
  - **Becomes usable**: Search transitions into an energetic comic stick runner on the hunt (puffing ear steam, flying sweat drops, wielding a giant scanner with active cyan radar beam, dodging trap obstacles, and cycling comic punchlines). Upon discovery, screeches to a dead stop in the center, power-surges into radiant emerald green (`#10b981`), hoists the Golden Key of Defusal 🗝️, and celebrates with a 10-piece multi-color confetti shower!
  - **Why now**: Delivers dopamine, humor, and emotional delight to transform an annoying subscription cancellation chore into an entertaining win.
  - **PRD ref**: `prd.md > The Core Journey > 3. Enjoyous Comic Search Animation`
  - **Spec ref**: `spec.md > Enjoyous Comic Search Animation`
  - **Verify (mechanical)**: Puppeteer visual regression confirmed `huntState` and `celebrationState` with non-flipping upright speech bubbles.
  - **Commit**: `feat: add enjoyous comic stick figure search animation with emerald victory celebration`

---

## Hands-on Checkpoints

- [x] **Early Usable Behavior Explored**: Checkpoint after Slice 2 (single-viewport hero, preset scanning, interactive defusal dashboard, and .ics calendar generation).
- [x] **Mid-Stage Core Refinement**: Verified that the clean "Find the right page." dashboard layout is preserved as the primary surface, with search autocomplete and service chips.
- [x] **Final Kick-The-Tires Exploration**: User verified live web discovery for regional entities (Econet `ecoAI`), anti-hallucination shielding for non-existent entities, high-res brand marks, and the enjoyous comic search runner animation with confetti.

---

## Final Review

- [x] Final review complete — all user feedback resolved, zero TypeScript errors (`npx tsc --noEmit`), dev server running cleanly on port 3000, and ready to ship for Devpost evaluation.

- [x] **7. Hero Panel BlueStickFighter & UI Polish**
  - **Becomes usable**: The Hero Landing right panel shows an autonomous SVG martial-arts stick figure (`BlueStickFighter.tsx`) that free-roams, dodges, spins, dances, and strikes 9 subscription brand logos with comic hit tags and recoil animations — replacing the old static upload card as the primary hero visual.
  - **Changes bundled**:
    - Removed redundant *Sign In* header button (consolidated to single *Dashboard* CTA).
    - Removed *"Your data is safe & private"* trust line from hero.
    - Updated *How it works* modal to reflect search-first flow.
    - Updated *Core Features* modal to list current features accurately.
    - Dashboard search bar starts blank when arriving via `/dashboard` with no `?service=` param.
    - Muted all automatic hit sounds from the stick fighter.
    - Converted all PNG images to sharp WebP: logo 663 KB → 183 KB (-72%), hero bg 1.4 MB → 34 KB (-98%).
    - Deleted 3 unused image assets (`canceltrap-hero.png`, `canceltrap-hero-water.jpg`, `water-glass-hero.jpg`).
  - **Verify (mechanical)**: `npx tsc --noEmit` exits 0; no PNG references remain in `src/`.
  - **Commit**: `feat: BlueStickFighter hero animation, search-first UX, WebP image optimisation`

---

## Code Tour and App Map

- [x] Learning activity complete — documented multi-stage pipeline connecting deterministic registry (`src/lib/engine/registry.ts`), live web discovery (`src/lib/engine/liveDiscovery.ts`), Gemini API validation (`src/app/api/resolve/route.ts`), and enjoyous comic animation (`src/components/StickAngerSearcher.tsx`).
- [x] Transfer reflection addressed: Multi-tiered architecture (Deterministic Cache -> Live Web Scraping -> LLM Validation) provides the optimal balance of speed, cost efficiency, and accuracy.
