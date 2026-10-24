---
doc: prd
status: approved
---

# CancelTrap — Product Requirements

AI-powered dark-pattern subscription defuser & trial kill-switch to cancel subscriptions before you get charged.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > The POC Boundary`.

## The Core Journey
1. **Arrival**: The user lands on a visually striking hero: on the left, a bold headline + "Find my subscription" CTA; on the right, the **BlueStickFighter** — an autonomous, free-roaming martial-arts stick figure that dodges, spins, punches, and kick-flips subscription brand logos (Adobe, AWS, ChatGPT, Lovable, Netflix, etc.) for instant comic delight.
2. **Input Selection**:
   - **Service Search (Primary)**: User clicks "Find my subscription" and is taken to the dashboard where they type any service name (e.g. `ecoai`, `strava`, `netflix`). High-res logo suggestions populate in real time.
   - **Quick Presets**: Three hero-level preset pills (*"Lovable Pro"*, *"Adobe Annual Trap"*, *"7-Day AI Trial"*) jump the user straight into the dashboard with pre-loaded data.
3. **Clean Comic Search Animation**:
   - The card transitions into a clean, expressive cartoon stick runner on the hunt:
     - Iconic hand-drawn line art with 3 spiky cowlick hairs and fierce gritted teeth.
     - Smooth billowing ear steam plumes (`~~~☁️`) reflecting consumer frustration.
     - Energetic running stride with pumping arms holding a magnifying glass.
     - A single, crisp speech bubble cycling concise, relatable quips (e.g. *"Where's the cancel button?! 😤"*).
     - Subtle, clean ground baseline with zero visual clutter.
4. **Resolution & Victory Celebration**:
   - The system queries the deterministic registry, live web discovery engine, and Gemini AI validation gate.
   - Upon discovery, the runner smoothly halts in the center, transitions to vibrant emerald green (`#10b981`), beams a joyful smile with happy crescent eyes and blushing cheeks, raises his arms in victory, and celebrates with a clean confetti drop as the bubble pops:
     `"Aha! Found it! 🎉"`
5. **Dashboard Reveal**:
   - High-impact metrics: **Renewal Countdown**, **Current Price**, **5-Year Vampire Bleed**, and **Dark Pattern Identified**.
   - **Step-by-Step Defusal Action Plan**: Exact instructions to bypass decoy buttons, pause traps, or multi-step retention mazes (including USSD/SMS fallback for mobile VAS).
   - **Direct Bypass Portal Link**: One-click button opening the verified merchant cancellation URL in a new tab with an authentic high-res brand logo.
   - **In-App Defusal Guide Co-Pilot (`InAppDefusalWindow.tsx`)**: Interactive modal walking users through cancellation steps with warning banners.
   - **1-Click Calendar Kill-Switch (.ics)**: Instant download of a calendar event scheduled 24–48 hours before auto-renewal with reminders and direct portal links in the description.
6. **Success & Reset**: The user saves the route to their bookmark list or clicks "New Scan" in the header to evaluate another subscription.

---

## Screens and Surfaces

### Surface 1: The Main Defusal Dashboard
- **Top Navigation Bar**:
  - CancelTrap logo and active defusal status pill (`● Direct Defusal Active`).
  - Navigation tabs: `Defusal Mission`, `Saved (N)`, `History (N)`, and `New Scan`.
- **Search & URL Input Hub**:
  - Toggle between **Search service** and **Paste a URL**.
  - Search input with real-time autocomplete suggestions displaying high-res brand logos and domain badges.
  - "Find destination" primary CTA with animated loading state.
  - Quick-access service chips: AWS, Google Cloud, Adobe, Microsoft 365, ChatGPT, Lovable, Figma, Wikipedia (Free), Blender (Free).
- **Dynamic Search Stage (StickAngerSearcher)**:
  - Houses the clean cartoon search runner, ear steam plumes, and emerald confetti victory celebration.
- **Active Destination Card**:
  - Authentic high-res brand mark (128px Google favicon API or regional telecom icon).
  - Verified domain pill (e.g. `ecoaitoken.co.zw`, `en.wikipedia.org`).
  - Action title and verified navigation breadcrumb trail (e.g. `Billing account → Subscriptions → Manage subscription`).
  - **Zero-Billing / Free Software Mode**: For 100% free / open-source software (e.g. Wikipedia, Blender, Signal, VLC, Ubuntu), displays an emerald green shield (`🛡️ 100% Free & Safe — Zero Recurring Billing Risk`), shows `$0.00 / Free Forever`, provides official portal links (`Visit official site`), and clarifies that no subscription cancellation is required.
  - Regional telecom defusal banner when applicable (e.g. `🇿🇼 Econet Wireless Zimbabwe: USSD *449# / ecoaitoken.co.zw`).
  - Primary Action Buttons: `Open real tab` (or `Visit official site`) and `Open destination` (in-app co-pilot / safety guide).
  - Bookmark route toggle button.

### Surface 2: The In-App Defusal Co-Pilot (`InAppDefusalWindow.tsx`)
- Side-by-side floating modal window that provides step-by-step guidance while the user navigates the external cancellation flow:
  - Step progress indicators with active checkmarks.
  - Decoy button warnings highlighted in amber/red alert boxes.
  - Quick-copy text fields for account identifiers or cancellation codes.
  - Direct link to launch the official portal in a split tab.

### Surface 3: Hero Landing
- Single-viewport split layout:
  - **Left panel**: Brand pill, punchy headline (*"Stop paying for subscriptions you forgot"*), concise two-line tagline, "Find my subscription" primary CTA, and "How it works" ghost button.
  - **Right panel**: `BlueStickFighter` — an autonomous SVG martial-arts stick figure that free-roams, dodges, spins, dances, and strikes subscription brand logos (AWS, ChatGPT, Adobe, Lovable, Netflix, Gemini, etc.) with random comic hit tags and logo recoil effects.
- Subtle footer strip with three benefit micro-cards (Save money / Save time / Stay in control).
- No redundant sign-in button; single "Dashboard" header button routes to `/dashboard`.

---

## Features and Behavior

### 1. Multi-Stage Discovery Pipeline
- **Tier 1: Deterministic Registry (Sub-millisecond)**: 50+ hand-curated services with verified deep links and dark pattern breakdowns.
- **Tier 2: Live Web Discovery Engine (`src/lib/engine/liveDiscovery.ts`)**: Real-time web intelligence querying live search indexes in ~200ms without API quotas, extracting canonical domains and cancellation navigation paths.
- **Tier 3: Google Gemini 3.8 Flash Validation Gate**: Evaluates uncataloged queries, formats structured JSON payloads, and enforces anti-hallucination protocols.
- **Anti-Hallucination Safe-Guard**: Rejects non-existent queries (`asdfghjk99`) with a clean security warning rather than fabricating fake URLs or steps.

### 2. Universal High-Res Brand Marks
- Powered by Google's universal favicon API (`https://www.google.com/s2/favicons?domain=${domain}&sz=128`) with DuckDuckGo fallback and styled initials.
- Custom vector marks for regional entities (e.g., Econet `ecoAI` with Zimbabwean flag `🇿🇼 ZIM` badge).

### 3. Enjoyous Comic Search Animation
- **Puffing Ear Steam & Head Heat Squiggles**: Reflects user frustration with cancellation dark patterns.
- **Flying Sweat Droplets & Pumping Scissor Legs**: High-energy sprint dynamics.
- **Giant Magnifying Glass Scanner**: Projecting a semi-transparent cyan radar sweep beam over the track.
- **Non-Flipping Comic Speech Bubbles**: Bubbles stay upright and readable when the character turns around.
- **Emerald Victory Power-Up**: Instant color shift to emerald green, joyous smiling face, glowing Golden Key, sunburst rays, and a 10-piece multi-color confetti shower.

### 4. Regional Subscription Defusal (Econet Wireless Zimbabwe `ecoAI`)
- Supports mobile telecom recurring airtime/wallet deductions.
- Provides USSD shortcode guidance (`*449#`), SMS keyword opt-outs (`STOP` to `449`), and web portal deep links (`ecoaitoken.co.zw`).

### 5. 1-Click Calendar Kill-Switch (.ics)
- Client-side RFC 5545 `.ics` generator with `VALARM` notifications scheduled 24–48 hours prior to renewal.

---

## Look and Feel
- **Theme**: Institutional calm, clean glassy blue gradients, crisp borders, and joyful comic accents.
- **Typography**: `Manrope` for bold headings, `Plus Jakarta Sans` for body copy, and `JetBrains Mono` for domain pills.
- **Color Palette**:
  - Primary Action Blue: `#1658eb` / `#11338a`
  - Emerald Victory Green: `#10b981` / `#0f8b3c`
  - Dark-Pattern Danger Red: `#e11d48` / `#e62b34`
  - Attention Amber: `#f59e0b` / `#eab532`
  - Surface Glass: `rgba(255, 255, 255, 0.95)` with `backdrop-filter: blur(16px)`

---

## Non-Goals
- No post-charge legal dispute letters or bank chargebacks.
- No user accounts or persistent backend databases (100% private, client-side session).
- No scraping behind user authentication credentials.
