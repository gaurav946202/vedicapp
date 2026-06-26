# Vedic Birth Chart App — Backend Integration Brief

**Purpose of this document:** the UI has already been built (via Google Antigravity) using the design spec in `vedic-app-ui-design-and-antigravity-prompt.md`. This document is for **Claude Code to integrate the full working backend** into that existing project folder — real API calls, real data, no mock/placeholder logic left in place.

-----

## 1. What Already Exists

- A working React frontend (built via Antigravity) with:
  - Hindi-only UI (Devanagran labels, buttons, headers)
  - Birth details form (DOB, time, place)
  - 5 result cards (soul purpose, career timing, current dasha, 24-month outlook, remedies)
  - A North Indian-style birth chart wheel (SVG, built to accept dynamic planet-position data via props)
  - Hero illustration + icon set (AI-generated static images, already wired in)
- **What’s missing:** the actual backend — no real API calls exist yet. Form submission currently has no live data behind it (mock/placeholder state only).

**Your job:** build the backend that takes the form input, gets real chart data, gets real Hindi interpretation text, and wires both into the existing frontend components without changing the visual design.

-----

## 2. System Architecture (target end state)

```
┌─────────────────┐      ┌──────────────────┐      ┌───────────────────┐      ┌─────────────────┐
│   Frontend       │ ───> │   Backend         │ ───> │  Prokerala API     │      │  Claude API       │
│   (existing UI)  │      │   (Node/Express)  │      │  (chart math)      │      │  (Sonnet 4.6)     │
│                  │      │                   │ ───> │  planets, houses,  │ ───> │  Hindi             │
│  Birth form      │ <─── │  Combines & returns│ <─── │  nakshatra, dasha  │ <─── │  interpretation   │
│  + result cards  │      │  final JSON        │      │  → structured JSON │      │  JSON output       │
└─────────────────┘      └──────────────────┘      └───────────────────┘      └─────────────────┘
```

**Core principle — do not violate this:** Claude never calculates planetary positions, houses, or dasha periods. All astronomy/math comes from Prokerala. Claude’s only job is turning correct structured chart data into Hindi narrative interpretation. This separation is intentional — LLMs hallucinate ephemeris math, and a wrong chart breaks user trust on something this personal.

-----

## 3. APIs to Integrate

### 3.1 Geocoding (for place-of-birth input)

- Need lat/long + timezone from the user’s typed place name.
- Use any standard geocoding API (Google Geocoding API, or OpenCage as a cheaper alternative) — pick based on what’s already available in the project’s existing tool access; if Google Maps/Places is already connected elsewhere in this codebase, reuse it instead of adding a new dependency.

### 3.2 Prokerala API — chart calculation

- **Purpose:** compute planet positions, house placements, ascendant (lagna), nakshatra, and current Vimshottari dasha period.
- **Auth:** OAuth2 client credentials flow — requires `CLIENT_ID` and `CLIENT_SECRET` from a Prokerala developer account. Store as environment variables (`PROKERALA_CLIENT_ID`, `PROKERALA_CLIENT_SECRET`), never hardcoded.
- **Tier:** start on the free tier for development/testing. Upgrade to the Ruby plan ($19/month, 100,000 credits) before public launch.
- **Important:** call Prokerala in English only (non-English output costs 2x credits on their side). All Hindi output is generated later, by Claude — not by Prokerala.
- **Endpoints needed (check current Prokerala docs for exact paths/params, as these can change):**
  - Birth chart / Kundli endpoint → planets, houses, ascendant
  - Nakshatra endpoint (may be bundled with chart endpoint)
  - Dasha (Vimshottari) endpoint → current mahadasha/antardasha with date ranges
- Request inputs needed: date of birth, time of birth (or noon default if user opted “don’t know exact time” — see section 5), latitude, longitude, timezone.
- Output: structured JSON — this becomes the input to both (a) the chart wheel component on the frontend, and (b) the Claude interpretation call.

### 3.3 Claude API — Hindi interpretation

- **Model: `claude-sonnet-4-6`**
- **Why this model:** strong long-form interpretive writing and reliable structured-JSON output; fluent native Hindi generation (Devanagari, not transliterated/Hinglish); cheaper than Opus while still strong enough for content this personal (career, life purpose) — Haiku would be too shallow for this use case.
- **Auth:** `ANTHROPIC_API_KEY` environment variable.
- **Input to the model:** the structured chart JSON from Prokerala (planets, houses, nakshatra, dasha) + the user’s birth details. Never send raw natural-language “calculate my chart” requests — only send already-calculated data for interpretation.
- **Required output format:** strict JSON, no markdown fencing, no preamble, exactly these 5 keys (key names in English for code stability, all values in Hindi):
  
  ```json
  {
    "soulPurpose": "Hindi text...",
    "careerTiming": "Hindi text...",
    "currentDasha": "Hindi text...",
    "next24Months": "Hindi text...",
    "remediesAndUpgrades": "Hindi text..."
  }
  ```
- **Language requirement:** all values must be natural, fluent Hindi in Devanagari script — not Hinglish, not romanized. Astrology terms (nakshatra names, dasha names, planet names) should appear in proper Hindi (e.g. “बुध-शुक्र अंतर्दशा”) rather than romanized English terms.
- **System prompt to use as the base** (adapt/refine, do not use the raw viral version verbatim — see section 6 for why):
  - Role: act as a Vedic astrology interpreter combining classical jyotish knowledge with clear, practical writing.
  - Input: structured chart JSON (already calculated — do not recalculate anything).
  - Task: produce the 5-section interpretation in Hindi, grounded strictly in the provided chart data (houses, planets, dasha) — no invented placements.
  - Output: strict JSON, the 5 keys above, Hindi values only.

-----

## 4. Original Reference Prompt (context only — do not use verbatim)

The project’s design/content direction was originally inspired by a viral Instagram comment containing this Hindi mega-prompt (translated context below for Claude Code’s reference, **not** to be pasted directly into the system prompt):

> Acts as a “Cosmic Fate Architect” — a 5th-generation Vedic astrologer (jyotish scholar) and world-class data visualization engineer. Goal: build a comprehensive, multi-dimensional Vedic birth chart analysis as an interactive, beautiful React-based dashboard visualizing the user’s birth chart. Chart: North Indian style Lagna chart with a clean SVG-based grid. With 100% accuracy, complete five sections: (1) explain the “soul purpose” behind the person’s ascendant and specific nakshatra, (2) explain growth in professional life — interpreting the 10th house, Saturn’s placement, and 7th house/Venus timing, (3) what dasha period the person is currently in, (4) what to expect in the next 24 months, prosperity and relationships, using “Mahadasha” and “Antardasha”, (5) professional, practical remedies (mantra, gemstone, or behavioral change) to build a “digital sanctuary” of their fate. Use full 10,000% capability.

**Why we are NOT using this verbatim as the system prompt:**

1. It asks the model to both calculate AND interpret the chart — we’ve split that (Prokerala calculates, Claude interprets only) for accuracy.
1. It claims “100% accuracy,” which Claude Code should not encode as a literal instruction — frame output as interpretive guidance grounded in the provided data, not as a certainty claim.
1. It’s written as a single dense paragraph — Claude Code should restructure it into the clean 5-key JSON schema described in section 3.3 for reliable parsing on the frontend.

The five conceptual sections (soul purpose/nakshatra, career via 10th house & Saturn & 7th house/Venus, current dasha, 24-month outlook, remedies) are the real content backbone worth preserving — keep these five themes, discard the literal wording and the “calculate everything yourself” framing.

-----

## 5. Form Input Handling Notes

- **Time of birth:** frontend already has a “मुझे सही समय नहीं पता” (I don’t know exact time) toggle. When checked, backend should default to 12:00 PM (noon) for the Prokerala call, and the final response should include a flag (e.g. `approximateTime: true`) so the frontend can show its existing disclaimer text near the chart.
- **Place of birth:** geocode before calling Prokerala — Prokerala needs lat/long + timezone, not a place name string.

-----

## 6. Environment Variables Needed

```
PROKERALA_CLIENT_ID=
PROKERALA_CLIENT_SECRET=
ANTHROPIC_API_KEY=
GEOCODING_API_KEY=   # whichever provider is chosen
```

-----

## 7. Backend Endpoint to Build

```
POST /api/chart

Request body:
{
  "dob": "YYYY-MM-DD",
  "timeOfBirth": "HH:MM" | null,
  "approximateTime": boolean,
  "placeOfBirth": "string (free text)"
}

Response body:
{
  "chartData": {
    "ascendant": "...",
    "nakshatra": "...",
    "planets": [ { "name": "...", "house": 1-12, "degree": 0-30 }, ... ],
    "dasha": { "mahadasha": "...", "antardasha": "...", "startDate": "...", "endDate": "..." }
  },
  "interpretation": {
    "soulPurpose": "Hindi text",
    "careerTiming": "Hindi text",
    "currentDasha": "Hindi text",
    "next24Months": "Hindi text",
    "remediesAndUpgrades": "Hindi text"
  },
  "approximateTime": boolean
}
```

`chartData` feeds the existing SVG chart wheel component. `interpretation` feeds the existing 5 result cards. Wire both into the existing frontend components — do not change their visual structure, only connect real data where mock/placeholder state currently is.

-----

## 8. Cost Reference (for awareness, not implementation)

|Layer                                  |Approx. cost per chart|
|---------------------------------------|----------------------|
|Prokerala (Ruby plan, $19/mo)          |~₹1–2                 |
|Claude Sonnet 4.6 (interpretation call)|~₹2–4                 |
|**Total**                              |**~₹3–6 per chart**   |

Pricing/monetization logic (Razorpay, free vs. paid tiers) is a separate later phase — not part of this integration task.

-----

## 9. Out of Scope for This Task

- Payment/credit system integration (Razorpay) — later phase.
- Self-hosting Swiss Ephemeris as a Prokerala replacement — later phase, only if volume justifies it.
- Any redesign of the existing UI — visual design is final; this task is data wiring only.