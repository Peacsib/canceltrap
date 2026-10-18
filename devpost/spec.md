---
doc: spec
status: approved
---

# CancelTrap — Technical Spec

## How This Works, In Plain Language
CancelTrap is a single-page Next.js web application designed to help consumers cancel subscription traps and free trials before they are charged.

When a user visits the app, they see a single-viewport landing page styled in an atmospheric glassy blue design (using the Risklyte design tokens). The user either uploads a screenshot of a subscription confirmation/billing receipt or selects one of three built-in realistic presets (*Lovable Pro*, *Adobe Annual Trap*, or *7-Day AI Trial*).

When triggered:
1. The client converts the image to base64 and calls a secure Next.js App Router API route (`POST /api/analyze`).
2. The server calls the **Google Gemini 3.8 Flash** model with a strict structured JSON output schema and multimodal instructions. Gemini extracts the merchant name, billing cycle, renewal deadline, detects the specific dark pattern, calculates a 5-year cumulative "Vampire Bleed", and creates a step-by-step defusal checklist and verified portal link.
3. The server validates the JSON and returns it to the client.
4. The client seamlessly transitions from the hero upload card into the Defusal Dashboard, displaying live countdown badges, financial projections, interactive checklist items, a verified direct portal button, and a 1-click RFC 5545 `.ics` calendar kill-switch file generated entirely in the browser.

Why this architecture? A stateless Next.js app with server-side Gemini route handlers provides the absolute fastest, zero-friction developer experience: no database to provision, no user accounts to manage, full API key security, and instant reproducibility during the hackathon evaluation.

## The Core Journey Through the System
Implements `prd.md > The Core Journey`.

1. **User lands on app (`/`)**:
   - `HeroLanding` renders the left-hand branding/feature cards and the right-hand frosted glass `UploadCard`.
2. **User selects input**:
   - *Option A (Preset)*: User clicks a preset pill (*Lovable Pro*, *Adobe Annual*, *7-Day AI Trial*). Instant mock data is passed directly to the state, transitioning smoothly without network latency.
   - *Option B (Custom Upload)*: User drops or selects an image. The file is validated for type (`image/png`, `image/jpeg`, `image/webp`) and size (< 10MB).
3. **Sequential Analysis State**:
   - `UploadCard` displays an animated sequential checklist (*"Reading screenshot..."*, *"Extracting merchant & renewal terms..."*, *"Analyzing dark patterns..."*).
   - Client sends base64 payload to `POST /api/analyze`.
4. **Gemini Analysis**:
   - Next.js server validates the payload and invokes **Gemini 3.8 Flash** with system instructions enforcing the `SubscriptionDefusalResponse` schema.
   - If the image is unrelated/blurry, Gemini returns `{ isSubscription: false, unrecognizedReason: "..." }`.
5. **Dashboard Transition**:
   - On success, `currentView` switches to `DefusalDashboard`.
   - `MetricsGrid` displays the Renewal Countdown, Billing Price, 5-Year Vampire Bleed, and Dark Pattern badge.
   - `DefusalChecklist` renders interactive step-by-step instructions with decoy warnings.
   - `ActionHub` displays the verified cancellation portal link and the 1-click `.ics` calendar kill-switch generator.
6. **User Action**:
   - User clicks *"Open Direct Cancellation Portal"*: opens the deep link in a new tab; button updates inline to confirmed state (*"✓ Portal Opened — Complete steps on the left"*).
   - User clicks *"Download Calendar Kill-Switch"*: `lib/calendar.ts` creates and triggers download of an `.ics` event file with alarm alerts.
   - User clicks *"New Scan"*: resets state back to the clean initial hero view.

## Stack
- **Framework**: Next.js 15 (App Router) with React 19 and TypeScript.
  - *Rationale*: User is comfortable with Next.js and React; App Router provides built-in server route handlers for secure API key isolation.
  - [Next.js Docs](https://nextjs.org/docs)
- **Styling**: Tailwind CSS with custom CSS variables matching the Risklyte design system tokens.
  - *Rationale*: Rapid UI development with pixel-perfect control over glassy backdrops, lab colors, and shadows.
  - [Tailwind CSS Docs](https://tailwindcss.com/docs)
- **AI / Multimodal LLM**: Google Gemini 3.8 Flash via `@google/genai` (or `@google/generative-ai`).
  - *Rationale*: Low latency, high multimodal reasoning accuracy for extracting tabular receipt data, and native structured JSON schema enforcement (`responseMimeType: "application/json"`).
  - [Google Gemini API Docs](https://ai.google.dev/docs)
- **Icons**: Lucide React.
  - *Rationale*: Clean, modern icons for security shields, checkmarks, warning flags, and calendar alerts.
  - [Lucide Docs](https://lucide.dev)
- **Calendar Generation**: Zero-dependency pure TypeScript RFC 5545 iCalendar generator.
  - *Rationale*: Eliminates third-party bloated packages; creates lightweight `.ics` files client-side.

## Where It Runs and How Someone Tries It
- **Runtime**: Node.js 18+ (local development or Vercel/Netlify hosting).
- **Environment Requirements**:
  - `GEMINI_API_KEY`: Google Gemini API key obtained from [Google AI Studio](https://aistudio.google.com/).
  - `GEMINI_MODEL`: Defaults to `gemini-2.5-flash` / `gemini-3.8-flash`.
- **How to Start Locally**:
  ```bash
  # 1. Install dependencies
  npm install

  # 2. Configure environment
  echo "GEMINI_API_KEY=your_key_here" > .env.local

  # 3. Start development server
  npm run dev
  ```
- **Demo Recording Target**: Open browser to `http://localhost:3000`. The submission demo video will record the single-viewport hero, clicking a preset, uploading a custom receipt, viewing the animated analysis, and interacting with the Defusal Dashboard.

## Look and Feel
Implements `prd.md > Look and Feel`.
- **Design Tokens (Risklyte Integration)**:
  - Font Headings: `Manrope`, sans-serif.
  - Font Body: `Plus Jakarta Sans`, ui-sans-serif.
  - Background Sky Gradient: `linear-gradient(160deg, #f8fdff, #d2ecff 60%, #afdeff)`
  - Card Glass: `rgba(255, 255, 255, 0.7)` with `backdrop-filter: blur(16px)` and border `1px solid rgba(255, 255, 255, 0.85)`
  - Card Shadow: `0 20px 50px -20px rgba(31, 85, 150, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.9)`
  - Primary Indigo Button: `#11338a` with hover `#1640ad` and shadow `0 10px 24px -10px rgba(17, 51, 138, 0.7)`
  - Status Accents: Verified green (`#54b66e`), warning amber (`#eab532`), trap crimson (`#e62b34`).

## Components

### 1. `HeroLanding` (`src/components/HeroLanding.tsx`)
Implements `prd.md > Surface 1: The Hero Landing`.
- Renders the single-viewport split screen.
- Left column: Transparent CancelTrap logo, headline, subhead, and 4 bottom feature badges.
- Right column: Houses the `UploadCard`.

### 2. `UploadCard` (`src/components/UploadCard.tsx`)
Implements `prd.md > Surface 1: The Hero Landing`, `prd.md > 1. Preset Receipt Selection`, and `prd.md > 2. Custom Screenshot Upload & Analysis`.
- Manages drag-and-drop state, file input selection, and preset selection pills.
- Displays the animated sequential scanning checklist during analysis.
- Displays inline error warnings for unreadable images.

### 3. `DefusalDashboard` (`src/components/DefusalDashboard.tsx`)
Implements `prd.md > Surface 2: The Defusal Dashboard`.
- Top navigation bar with merchant tag, receipt name, and "New Scan" reset button.
- Layout container uniting `MetricsGrid`, `DefusalChecklist`, and `ActionHub`.

### 4. `MetricsGrid` (`src/components/MetricsGrid.tsx`)
Implements `prd.md > Surface 2: The Defusal Dashboard`.
- 4 glass metric cards: Renewal Countdown, Billing Price, 5-Year Vampire Bleed, and Dark Pattern Identified.

### 5. `DefusalChecklist` (`src/components/DefusalChecklist.tsx`)
Implements `prd.md > Surface 2: The Defusal Dashboard`.
- Step-by-step interactive cards with checklist checkboxes and explicit decoy button warnings.

### 6. `ActionHub` (`src/components/ActionHub.tsx`)
Implements `prd.md > Surface 2: The Defusal Dashboard`, `prd.md > 4. Direct Portal Bypass`, and `prd.md > 5. Calendar Kill-Switch`.
- Verified Direct Portal Button with stateful launch confirmation.
- 1-Click .ics calendar download card.
- Merchant fine print / cancellation notes.

## Data Model

```typescript
export interface SubscriptionDefusalResponse {
  isSubscription: boolean;             // false if image is unrelated/blurry
  unrecognizedReason?: string;         // explanation if isSubscription is false
  merchant: {
    name: string;                      // e.g. "Adobe Creative Cloud", "Lovable"
    category: string;                  // e.g. "AI Coding Assistant", "Design Software"
    directPortalUrl: string;           // verified cancellation/billing deep link
    finePrintNotes?: string;           // cancellation window or policy terms
  };
  billing: {
    amount: number;                    // recurring price (e.g. 20.00)
    currency: string;                  // e.g. "USD", "$"
    billingCycle: "monthly" | "annual" | "weekly" | "trial";
    renewalDate: string;               // ISO 8601 date string or relative text
    daysUntilRenewal: number;          // calculated days remaining
    vampireBleed5Year: number;         // 5-year cumulative cost
  };
  darkPattern: {
    detected: boolean;
    patternType: string;               // e.g. "Disguised Downgrade Trap", "Early Termination Fee"
    severity: "critical" | "warning" | "info";
    summary: string;                   // plain-English summary of the deceptive trick
    tricksExposed: string[];           // bullet points of specific decoys found
  };
  defusalChecklist: {
    stepNumber: number;
    instruction: string;
    decoyWarning?: string;             // explicit advice on what button to avoid
  }[];
  killSwitch: {
    eventTitle: string;
    suggestedAlertDate: string;        // ISO timestamp 24–48h before renewal
    alertMinutesBefore: number;        // minutes before event to trigger alarm (e.g. 120)
    eventDescription: string;
  };
}
```

## File Structure

```
cancel-trap/
├── .env.example                  # Secret-free environment variable template
├── .gitignore                    # Ignores .env*, node_modules, and learner-profile.md
├── package.json                  # Next.js 15, React 19, Lucide React, Google Gen AI SDK
├── tsconfig.json                 # TypeScript strict mode configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Custom colors, fonts (Manrope, Plus Jakarta Sans), and glass tokens
├── devpost/                      # Hackathon planning artifacts
│   ├── learner-profile.md
│   ├── scope.md
│   └── prd.md
└── src/
    ├── app/
    │   ├── layout.tsx            # Global HTML layout with Google Font imports
    │   ├── page.tsx              # Main orchestrator (HeroLanding vs DefusalDashboard)
    │   ├── globals.css           # Risklyte CSS variables, gradients, and utility classes
    │   └── api/
    │       └── analyze/
    │           └── route.ts      # Server-side Gemini 3.8 Flash structured endpoint
    ├── components/
    │   ├── HeroLanding.tsx       # Single-viewport hero split container
    │   ├── UploadCard.tsx        # Drag-and-drop dropzone, presets, and scanning animation
    │   ├── DefusalDashboard.tsx  # Main dashboard layout
    │   ├── MetricsGrid.tsx       # 4 top metric cards (Countdown, Bleed, Price, Trap)
    │   ├── DefusalChecklist.tsx  # Step-by-step interactive defusal walkthrough
    │   └── ActionHub.tsx         # Direct portal bypass button & .ics kill-switch card
    ├── data/
    │   └── presets.ts            # 3 built-in demo presets (Lovable Pro, Adobe, 7-Day AI)
    ├── lib/
    │   ├── gemini.ts             # Gemini API client, system prompt, and schema config
    │   ├── calendar.ts           # Zero-dependency RFC 5545 .ics generator
    │   └── types.ts              # TypeScript interfaces for API and state
    └── types/
```

## External Services and Dependencies
- **Google Gemini API**:
  - Endpoint: `generateContent` via SDK
  - Model: `gemini-2.5-flash` / `gemini-3.8-flash`
  - Input: Base64 image + structured prompt
  - Output: `application/json` strictly matching `SubscriptionDefusalResponse`
  - Cost: Free tier / pay-as-you-go (<$0.01 per scan)
  - Key: `process.env.GEMINI_API_KEY` (server-side only)
- **Lucide Icons**:
  - `lucide-react`: Lightweight SVG icons (`ShieldAlert`, `Clock`, `ExternalLink`, `Calendar`, `CheckCircle2`, `AlertTriangle`, `FileText`, `Sparkles`).

## Important Failure Modes

1. **Unrecognized or Blurry Image**:
   - *Failure*: User uploads an unrelated image, cat photo, or completely blurry receipt.
   - *Fallback*: Gemini returns `{ isSubscription: false, unrecognizedReason: "..." }`. The `UploadCard` displays an inline red alert banner (matching the Risklyte error reference) and keeps the upload dropzone accessible for immediate retry or preset selection without crashing.
2. **Missing or Invalid Gemini API Key**:
   - *Failure*: `GEMINI_API_KEY` is unset or invalid in `.env.local`.
   - *Fallback*: API returns a clean 500 error with descriptive guidance: *"Gemini API key is missing or invalid. Please configure GEMINI_API_KEY in .env.local or test using one of the built-in demo presets."*
3. **Relative or Ambiguous Renewal Dates**:
   - *Failure*: Screenshot only indicates *"Renews in 3 days"* without an exact calendar date.
   - *Fallback*: Gemini prompts calculate `now + 3 days` and formats it as an ISO timestamp, while the `.ics` utility schedules the kill-switch alarm 24 hours prior to that timestamp.

## What Was Simplified and Why
- **Serverless API Route instead of Dedicated Backend Server**: Built inside Next.js App Router route handlers. Eliminates managing an express/fastapi server while keeping credentials 100% private.
- **Client-Side .ics Generation instead of Calendar API OAuth**: Generates standard RFC 5545 `.ics` file downloads instead of requiring Google/Outlook OAuth credentials and user consent flows.
- **Stateless Session instead of Database**: No database provisioned; eliminates schema migrations and login forms while making the PoC instantly demonstrable.

## Decisions and Open Issues

### Key Decisions:
- **Model Choice**: Selected **Gemini 3.8 Flash** for fast multimodal extraction and robust JSON output formatting.
- **Preset Data Isolation**: 3 realistic presets stored in `src/data/presets.ts` allowing immediate, zero-latency demonstration even without an active internet connection or API quota.
- **Direct Portal Link Behavior**: External link opens in a new tab and updates the button inline to *"✓ Portal Opened — Complete steps on the left"*.

### One Useful Unknown Clarified:
- **Upfront Gemini Structured Output Enforcement**: The learner identified mastering structured multimodal JSON contracts as their primary learning objective. To prevent Gemini from wrapping JSON in markdown code blocks (` ```json `) or omitting critical fields, the spec configures `responseMimeType: "application/json"` and enforces typed schema validation with safe JSON parsing on the route handler.
