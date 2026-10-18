---
doc: prd
status: approved
---

# CancelTrap — Product Requirements

AI-powered dark-pattern subscription defuser & trial kill-switch to cancel subscriptions before you get charged.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > The POC Boundary`.

## The Core Journey
1. **Arrival**: The user lands on a single-viewport, no-scroll hero screen with an atmospheric glassy blue environment.
2. **Input Selection**: On the right frosted card, the user either drags & drops a subscription receipt/screenshot or clicks one of 3 sample preset pills (*"Lovable Pro $20/mo"*, *"Adobe Annual Trap"*, *"7-Day AI Trial"*).
3. **Sequential Analysis**: The card transitions into an animated progress checklist:
   - ✓ Reading image
   - ✓ Detecting merchant & renewal deadline
   - ⟳ Dissecting dark patterns & building kill-switch
4. **Dashboard Reveal**: The view transitions into a clean, comprehensive Defusal Dashboard:
   - High-impact metric cards: **Renewal Countdown** (time remaining), **Current Price**, **5-Year Vampire Bleed** cost, and **Dark Pattern Identified**.
   - **Step-by-Step Defusal Action Plan**: Exact instructions to bypass decoy cancellation buttons, pause traps, or multi-step retention mazes.
   - **Direct Bypass Portal Link**: One-click button opening the verified merchant cancellation URL in a new tab, instantly updating to a confirmed status (*"Portal Opened — Follow steps below"*).
   - **1-Click Calendar Kill-Switch (.ics)**: Instant download of a calendar event scheduled 24–48 hours before auto-renewal with reminders and direct portal links in the description.
5. **Success & Reset**: The user defuses their subscription and can click "New Scan" in the header to evaluate another subscription.

## Screens and Layout

### Surface 1: The Hero Landing (Single Viewport, No-Scroll)
Source: `scope.md > Inspiration & Identity`
- **Left Column**:
  - CancelTrap logo (transparent image asset).
  - High-impact headline: *"Defuse deceptive subscriptions before they charge you."*
  - Supporting subhead explaining how AI exposes hidden cancel buttons and calculates multi-year compounding bleed.
  - 4 bottom feature cards: *"Instant Dark-Pattern Detection"*, *"Direct Portal Bypass"*, *"1-Click Calendar Kill-Switch"*, *"100% Private & In-Browser"*.
- **Right Column**:
  - Frosted glass floating card with subtle background depth.
  - Drag-and-drop dropzone supporting PNG/JPEG/WEBP receipts.
  - "Choose screenshot" primary CTA button.
  - Interactive preset chips: *"Or try a sample receipt: Lovable Pro | Adobe Annual | 7-Day AI Trial"*.
  - Privacy indicator footer: *"🛡️ Processed privately on your device"*.

### Surface 2: The Defusal Dashboard
Source: `scope.md > The Core Loop`
- **Top Navigation Bar**:
  - CancelTrap logo on left.
  - Active merchant name tag (e.g. *"Adobe Creative Cloud"*) and receipt filename.
  - "New Scan" outline button on right to reset.
- **Top Metrics Row (4 Glass Cards)**:
  - **Renewal Countdown**: Remaining time formatted in days/hours with high-urgency color coding (e.g., *"Renews in 3 Days, 14 Hours"*).
  - **Billing Amount**: Current recurring cost (e.g., *"$59.99 / month"*).
  - **5-Year Vampire Bleed**: Compounding financial projection if auto-renewal continues unchecked (e.g., *"$3,599.40 drained"*).
  - **Deceptive Dark Pattern**: Flagged deceptive practice (e.g., *"Disguised 'Pause' & $300 Early-Fee Maze"*).
- **Primary Content Grid (Two Columns)**:
  - **Left Column — Step-by-Step Defusal Checklist**:
    - Sequential actionable cards detailing the exact click path through the merchant's settings.
    - Highlights decoy buttons to avoid (e.g., *"Do not click 'Keep Plan for 50% Off' or 'Pause for 30 Days'"*).
    - Interactive checkboxes for each step so the user can mark off their progress.
  - **Right Column — Defusal Action Hub**:
    - **Verified Direct Portal Button**: Prominent button linking straight to the deep-linked cancellation page. When clicked, transitions to confirmed state: *"✓ Portal Opened — Complete steps on the left"*.
    - **Calendar Kill-Switch (.ics) Card**: Visual calendar widget displaying event details (Date, Alert 48h prior, Title: *"Kill-Switch: Cancel [Merchant]"*) with a 1-click button to download the `.ics` file.
    - **Merchant Cancellation Notes**: Summary of merchant-specific fine print (e.g., notice periods, refund windows).

## Look and Feel
Source: `scope.md > Inspiration & Identity`
- **Design Inspiration**: Exact styling and design tokens extracted from the Risklyte design system.
- **Typography**:
  - Headings & Display: `Manrope` (bold/semibold, clean geometric tracking).
  - Body & UI: `Plus Jakarta Sans` (400 regular, 500 medium, line-height 1.5).
- **Core Color System & CSS Variables**:
  - Sky Background Gradient: `--gradient-sky: linear-gradient(160deg, #f8fdff, #d2ecff 60%, #afdeff);`
  - Page Background: `--background: #f0f8fe;`
  - High-Contrast Foreground: `--foreground: #0f1e3b;` / `#031F3B;`
  - Primary Action Blue: `--primary: #11338a;` (with hover `--brand: #1640ad;`)
  - Secondary Light Blue: `--secondary: #e0f1fe;`
  - Accent Tint: `--accent: #d2ecff;`
  - Glass Containers: `--glass: #ffffff9e;` with `backdrop-filter: blur(16px)`
  - Glass Borders: `--glass-border: #ffffffd9;` (1px subtle border)
  - Card Shadow: `--shadow-glass: 0 20px 50px -20px #1f559659, inset 0 1px 0 #ffffffe6;`
  - Button Shadow: `--shadow-button: 0 10px 24px -10px #11338ab3;`
  - Corner Radius: `--radius: 0.875rem;` (14px)
- **Status & Urgency Accents**:
  - Safe / Verified: `#54b66e` (green)
  - Attention / Renewal Notice: `#eab532` (amber)
  - Urgent / Dark-Pattern Trap: `#e62b34` (crimson red)
- **Tone & Atmosphere**: Calm institutional confidence, high-end translucent glass cards, zero cyberpunk clutter.

## Features and Behavior

### 1. Preset Receipt Selection
- User clicks one of the 3 sample preset pills on the upload card.
- Instantly loads pre-configured sample receipt metadata without requiring the user to supply personal files.
  - **Lovable Pro**: $20/mo, 30-day recurring cycle, dark pattern: downgrade disguised as cancel, direct billing URL: `https://lovable.dev/settings/billing`.
  - **Adobe Annual**: $59.99/mo, annual plan paid monthly, dark pattern: hidden $300 early termination cancellation fee & 4-page retention quiz, direct billing URL: `https://account.adobe.com/plans`.
  - **7-Day AI Trial**: $0 now, $39.99/mo starting in 72 hours, dark pattern: immediate trial conversion without confirmation email, direct billing URL: `https://platform.example.com/billing`.

### 2. Custom Screenshot Upload & Analysis
- User drops or selects an image (`.png`, `.jpg`, `.jpeg`, `.webp`).
- Client triggers sequential visual progress indicators inside the card:
  - Step 1: "Reading screenshot..." (immediate)
  - Step 2: "Extracting merchant & renewal terms..." (500ms)
  - Step 3: "Analyzing dark retention patterns..." (1000ms)
- Multimodal Gemini 2.5 Flash analyzes the image and returns a strictly typed JSON payload.

### 3. Edge Case & Ambiguity Handling
- **Non-Receipt / Blurry Upload**: If the uploaded image cannot be identified as a receipt or billing page:
  - The upload card displays an inline red-tinted warning banner (matching the Risklyte error reference):
    *"⚠️ This doesn't look like a subscription receipt or trial confirmation — couldn't detect a merchant, billing amount, or renewal terms."*
  - The card remains on the upload screen and allows the user to re-upload or select one of the 3 presets.
- **Relative Dates ("Ends in 3 days")**:
  - The system calculates the renewal date based on `current_time + relative_duration`.
  - The Kill-Switch .ics event is scheduled 24 hours prior to that calculated cutoff.

### 4. Direct Portal Bypass & Verification
- Displays the verified direct cancellation link for the merchant.
- User clicks "Open Direct Cancellation Portal" -> Opens in new tab with `rel="noopener noreferrer"`.
- Button visually morphs into an active state: *"✓ Portal Opened — Complete steps below"*.

### 5. Calendar Kill-Switch (.ics Generation)
- Pure client-side generation of an RFC 5545 `.ics` file.
- Event Title: `🚨 Kill-Switch: Cancel [Merchant] Subscription`
- Event Date/Time: 24–48 hours prior to detected renewal deadline.
- Description: Includes detected renewal cost, 5-year vampire bleed, and direct cancellation URL.
- Alarm Trigger: Pre-configured calendar alarm alert 2 hours before the event.

## States and Boundaries

- **Hero / Initial State**: Single-viewport landing page with clean dropzone and active preset pills.
- **Scanning State**: Upload card displays animated step-by-step progress checklist.
- **Dashboard / Success State**: Full-screen glassy dashboard displaying metrics, defusal checklist, portal bypass, and kill-switch generator.
- **Error State**: Non-blocking inline warning card allowing immediate retry or preset selection.
- **Persistence Boundary**: 100% stateless in-memory session. Refreshing returns to the clean initial hero screen without stale storage or database dependencies.

## Product Decisions
- **Single-Viewport Hero**: Decided based on the Risklyte design reference to give an immediate, high-converting, professional first impression with zero page clutter.
- **Presets Inside the Upload Card**: Positioned as sample chips directly within the upload card for intuitive 1-click evaluation without hunting.
- **Verified Portal Opened State**: Button updates inline to confirm launch and redirect the user's attention to the defusal checklist.
- **Cut Dispute/Refund Letters**: Focused exclusively on proactive, timely cancellation to eliminate post-charge dispute complexity.

## What We're Building
- Single-viewport glassy blue hero layout with split branding/upload cards.
- 3 interactive preset scenarios (Lovable, Adobe, 7-Day AI).
- Real screenshot upload zone with drag-and-drop.
- Multimodal Gemini 2.5 Flash analysis with structured schema.
- Comprehensive Defusal Dashboard:
  - Renewal Countdown & 5-Year Vampire Bleed.
  - Step-by-step dark pattern defusal checklist with interactive checkboxes.
  - Direct portal bypass button with stateful launch verification.
  - 1-Click .ics calendar download.
- Error banner for unrecognized/blurry images.

## Deferred From the POC
- Live DOM extension to manipulate merchant pages in real time.
- Direct sync with Google Calendar API / Outlook API (using standard `.ics` downloads instead).
- Multi-currency currency converter.

## Non-Goals
- No post-charge refund negotiation, FTC dispute letters, or bank chargeback flows.
- No user accounts, passwords, or cloud database storage.
- No backend automated email dispatch (SMTP).
- No scraping of live merchant portals behind logins.

## Open Questions
- None blocking. Technical implementation details (Next.js route handlers vs. client API, exact JSON schema) will be locked in `4-spec`.
