---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Next.js Scaffold with Risklyte Glass System & Single-Viewport Hero Landing**
  Becomes usable: A running Next.js app in the browser with the exact Risklyte glassy blue styling, split-hero layout, transparent logo support, and interactive upload card with 3 selectable preset pills (*Lovable Pro*, *Adobe Annual*, *7-Day AI Trial*).
  Why now: Bootstraps the application, locks in the exact design tokens and typography upfront, and delivers the initial landing surface the user first encounters.
  PRD ref: `prd.md > Surface 1: The Hero Landing`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Stack`, `spec.md > Look and Feel`, `spec.md > Components > 1. HeroLanding`, `spec.md > Components > 2. UploadCard`
  Build: Initialize Next.js with TypeScript and Tailwind, configure fonts (Manrope & Plus Jakarta Sans) and Risklyte CSS variables/gradients in `globals.css`, build `HeroLanding` and `UploadCard`, add preset pills, and handle drag-and-drop state.
  Verify (mechanical): Run dev server, curl localhost:3000, verify HTTP 200 and error-free build.
  Learner check: Open `http://localhost:3000` in your browser; verify the single-viewport layout, atmospheric blue gradient, and frosted glass upload card.
  Commit: `feat: scaffold Next.js app with Risklyte glass styling and HeroLanding`

- [x] **2. The Defusal Dashboard with Vampire Bleed, Interactive Checklist, and 1-Click .ics Kill-Switch**
  Becomes usable: Clicking any preset pill runs the sequential scanning animation (*"Reading screenshot..."*, *"Detecting terms..."*, *"Dissecting dark patterns..."*) and opens the Defusal Dashboard with live countdown, 5-year vampire bleed, interactive defusal checklist, working direct portal bypass button, and 1-click `.ics` calendar kill-switch file download.
  Why now: Delivers the unique kernel and the full demonstrable core loop immediately using realistic preset data, proving the entire client experience without needing an API key yet.
  PRD ref: `prd.md > Surface 2: The Defusal Dashboard`, `prd.md > 1. Preset Receipt Selection`, `prd.md > 4. Direct Portal Bypass`, `prd.md > 5. Calendar Kill-Switch`
  Spec ref: `spec.md > Components > 3. DefusalDashboard`, `spec.md > Components > 4. MetricsGrid`, `spec.md > Components > 5. DefusalChecklist`, `spec.md > Components > 6. ActionHub`, `spec.md > Calendar Generation`
  Build: Create `src/data/presets.ts`, implement `MetricsGrid`, `DefusalChecklist`, `ActionHub`, and `DefusalDashboard`, implement zero-dependency RFC 5545 generator in `src/lib/calendar.ts`, and wire the sequential scanning transition and "New Scan" reset.
  Verify (mechanical): Test preset selection and verify dashboard renders with correct calculations; test .ics generator output string format contains valid VCALENDAR, VEVENT, and VALARM headers.
  Learner check: Click the "Adobe Annual Trap" preset, watch the scanning animation, view the Vampire Bleed calculation, click "Open Direct Cancellation Portal", and click "Download Calendar Kill-Switch" to verify the calendar alert downloads to your computer.
  Commit: `feat: implement DefusalDashboard with vampire bleed and ics kill switch`

- [ ] **3. Live Multimodal Gemini 3.8 Flash Route Handler & Unrecognized Image Error Handling**
  Becomes usable: Dropping or selecting a real custom screenshot sends the image to `POST /api/analyze`, where Gemini 3.8 Flash extracts the data in strict JSON. If an invalid or blurry image is uploaded, an inline red warning alert is displayed inside the card allowing immediate retry.
  Why now: Connects live multimodal AI reasoning, completes the learning objective for strict Gemini JSON contracts, and closes the final edge-case loop.
  PRD ref: `prd.md > 2. Custom Screenshot Upload & Analysis`, `prd.md > 3. Edge Case & Ambiguity Handling`
  Spec ref: `spec.md > External Services and Dependencies`, `spec.md > Data Model`, `spec.md > Important Failure Modes`
  Build: Implement `@google/genai` (or `@google/generative-ai`) route handler in `src/app/api/analyze/route.ts` enforcing `SubscriptionDefusalResponse` JSON schema, connect `UploadCard` custom file drop to this endpoint, and add inline error warning state.
  Verify (mechanical): POST a mock receipt image to `/api/analyze` and verify 200 response with validated schema; POST an empty/invalid payload and verify handled error response.
  Learner check: Drop an actual subscription receipt or image, watch Gemini analyze it live, or test an invalid image to confirm the friendly warning alert appears.
  Commit: `feat: add Gemini 3.8 Flash multimodal analysis API with error handling`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — Checkpoint after Slice 2 (single-viewport hero, preset scanning, interactive defusal dashboard, and .ics calendar generation).
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [to be recorded upon completion]
Route and stops: [to be recorded upon completion]
Edit outcome: [to be recorded upon completion]
Reflection: [to be recorded upon completion]
Activity mode: [to be recorded upon completion]

## Revisions
