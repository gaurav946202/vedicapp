# Vedic Birth Chart App — UI Design Spec + Google Antigravity Build Prompt

## 1. Design Reference Breakdown

The reference (Collabra studio horoscope design) works because of four things:

1. **Deep cosmic color field** — near-black indigo/purple base, never flat black.
1. **Glowing gradient cards** — each card has its own gradient identity (not one repeated color), with a soft outer glow and thin circular icon frame.
1. **Ethereal painted creature art** — ornate, bioluminescent-looking deity/animal illustrations as hero imagery, not flat icons.
1. **Layered device mockup composition** — tablet + phone overlapping at an angle, set against a separate dusk/forest photo background, giving the whole page physical depth.

We carry over all four, re-themed from Western zodiac → Hindi Vedic astrology (grahas/planets, nakshatras, dasha periods) for your 5 result sections instead of 12 zodiac signs.

-----

## 2. Design Tokens

**Color palette:**

|Token           |Hex      |Use                                                          |
|----------------|---------|-------------------------------------------------------------|
|`--bg-void`     |`#0B0A1A`|Page base, near-black indigo                                 |
|`--bg-nebula-1` |`#2D1B69`|Deep violet gradient stop                                    |
|`--bg-nebula-2` |`#7B2FF7`|Mid purple gradient stop                                     |
|`--accent-gold` |`#F5B942`|Primary CTA, highlights (ties to your existing Drishix amber)|
|`--accent-cyan` |`#4FD8E8`|Secondary glow, planet/icon strokes                          |
|`--accent-rose` |`#F76FA0`|Card gradient variant (career/love-adjacent themes)          |
|`--text-primary`|`#F4F1F9`|Body text on dark                                            |
|`--text-muted`  |`#A9A3C2`|Captions, labels                                             |

**Typography (Devanagari-first, since app is Hindi-only):**

- **Display face:** Baloo 2 (rounded, friendly weight for headlines — reads well at large sizes in Devanagari, has personality unlike default sans)
- **Body face:** Noto Sans Devanagari (clean, highly legible at small sizes)
- **Utility/numeric face:** Inter (for any English numerals, dates, percentages mixed into Hindi copy — degrees, dates like “21.03.2026”)

**Layout concept:**

```
┌─────────────────────────────┐
│   [starfield bg, glow dots]  │
│        collabra-style        │
│   ┌───────────────────────┐  │
│   │  HERO: generated deity │  │ ← mystical art, frosted glass
│   │  art + chart teaser    │  │   panel overlay, CTA button
│   └───────────────────────┘  │
│                               │
│  जन्म विवरण फॉर्म (form)      │ ← glassmorphic input card
│                               │
│  [5 glowing result cards,     │ ← 2-2-1 or 3-2 grid, like
│   grid layout]                │   the zodiac card grid
│                               │
│  चार्ट व्हील (North Indian)    │ ← static SVG, planets injected
└─────────────────────────────┘
```

**Signature element:** the hero deity/planet illustration — a single ornate, glowing AI-generated artwork (Krishna-flute-meets-cosmos or Navagraha-themed) anchoring the top of the page, mirroring the reference’s antlered-deer-creature hero. This is the one “expensive-looking” risk worth taking; everything else (cards, form, chart) stays disciplined and consistent.

-----

## 3. The 5 Result Cards (mapped from reference’s 12 zodiac cards)

Grid: 3 cards top row, 2 cards bottom row (or 2-2-1), each with a distinct gradient + glowing icon, matching the reference’s per-card color variation:

|Card|Hindi Header|Gradient       |Icon motif           |
|----|------------|---------------|---------------------|
|1   |आत्मा का उद्देश्य    |gold → rose    |lotus / flame        |
|2   |करियर का समय  |cyan → violet  |ascending steps      |
|3   |वर्तमान दशा     |violet → indigo|rotating planet rings|
|4   |आगामी 24 महीने  |rose → gold    |crescent moon + stars|
|5   |उपाय         |cyan → gold    |yantra/mandala       |

Each card: glowing soft-shadow on hover/tap (like reference’s card-lift), short Hindi header, 1-line teaser, tap-to-expand for full Claude-generated content.

-----

## 4. Google Antigravity Build Prompt

Paste this directly into Antigravity. It includes both the **UI build instructions** and **embedded image-generation prompts** for every visual asset needed, so Antigravity can generate the art and wire it into the working UI in one pass.

```
You are building a Hindi-language Vedic astrology web app called "Drishix Kundli" (or similar — keep branding placeholder if needed). Build a fully working, responsive React UI with the following spec. Generate all images described below using your image generation capability and wire them directly into the components — do not use placeholder gray boxes.

## VISUAL DIRECTION
Aesthetic: deep cosmic mysticism — near-black indigo/purple gradient backgrounds, glowing gradient cards, ornate ethereal deity/planet illustrations, soft starfield ambiance. Reference mood: premium astrology app, not playful/cartoonish. All UI text in Hindi (Devanagari script).

## DESIGN TOKENS
- Background base: #0B0A1A (near-black indigo)
- Background gradient stops: #2D1B69 → #7B2FF7 (radial nebula glow behind hero)
- Accent gold: #F5B942 (primary CTA, highlights)
- Accent cyan: #4FD8E8 (secondary glow, icon strokes)
- Accent rose: #F76FA0 (card gradient variant)
- Text primary: #F4F1F9
- Text muted: #A9A3C2
- Display font: 'Baloo 2' (Google Fonts) — headlines
- Body font: 'Noto Sans Devanagari' (Google Fonts) — all body copy, labels, buttons
- Utility font: 'Inter' — for numerals/dates only
- Border radius: 20-24px on cards (soft, organic, matches reference)
- Card glow: box-shadow with the card's accent color at 40% opacity, blurred 24px

## PAGE STRUCTURE

### 1. Hero Section
- Full-width, dark nebula gradient background with scattered small star/glow dots (CSS radial-gradient dots or subtle particle animation, low density, ambient not busy)
- Centered ornate illustration (GENERATE THIS IMAGE — see prompt below) as the focal hero art
- Above the art: small eyebrow text "ड्रिशिक्स कुंडली" in gold, letter-spaced
- Below the art: large Baloo 2 headline "अपनी जन्म कुंडली जानें" (Know your birth chart)
- Subheadline in Noto Sans Devanagari, muted color: "वैदिक ज्योतिष से अपने करियर, उद्देश्य और भविष्य की झलक पाएं"
- Primary CTA button, gold gradient fill, rounded-full, Hindi text: "कुंडली बनाएं" (Generate Chart) — scrolls to form

**IMAGE PROMPT FOR HERO ART:**
"An ornate, ethereal, bioluminescent illustration of a cosmic deity figure meditating in lotus position, surrounded by glowing concentric planetary rings and the nine Navagraha symbols subtly woven into a halo behind their head, rendered in deep violet, cyan, and gold tones against a transparent/dark background, intricate linework like bioluminescent veins, mystical and premium in feeling, digital painting style, soft glow lighting, 1:1 square aspect ratio, no text or watermarks"

### 2. Birth Details Form Section
- Glassmorphic card (semi-transparent dark panel, subtle border, backdrop-blur) floating over the nebula background
- Heading: "अपना जन्म विवरण भरें" (Fill your birth details)
- Three inputs, each with Hindi label above:
  - "जन्म तिथि" (date picker)
  - "जन्म समय" (time picker) + small checkbox/toggle below it: "मुझे सही समय नहीं पता" (I don't know exact time) — if checked, show muted helper text: "हम दोपहर 12 बजे का अनुमान उपयोग करेंगे, परिणाम कम सटीक हो सकते हैं"
  - "जन्म स्थान" (text input with autocomplete dropdown for city/place)
- Submit button: gold gradient, Hindi text "चार्ट देखें" (View Chart)
- On submit: show a loading state with a subtle rotating mandala/planet-ring spinner animation and Hindi loading text: "आपकी कुंडली बन रही है..." (Your chart is being generated...)

### 3. Result Cards Grid (5 cards)
Layout: CSS grid, 3 columns on desktop (3 top, 2 centered below), 2 columns on tablet, 1 column stacked on mobile. Each card:
- Distinct gradient background (see table below)
- Circular icon frame at top (thin border ring, glowing icon inside — generate these as a matched set, see prompt below)
- Hindi title (Baloo 2, bold)
- One-line teaser text (Noto Sans Devanagari, muted)
- Entire card is tappable — on tap, expand to show full content (the Claude-generated interpretation text for that section) in a modal or inline expansion with a smooth height-transition animation
- Hover/tap state: card lifts slightly (translateY -4px) and glow intensifies

| Card | Hindi Title | Gradient (CSS) |
|---|---|---|
| 1 | आत्मा का उद्देश्य | linear-gradient(135deg, #F5B942, #F76FA0) |
| 2 | करियर का समय | linear-gradient(135deg, #4FD8E8, #7B2FF7) |
| 3 | वर्तमान दशा | linear-gradient(135deg, #7B2FF7, #2D1B69) |
| 4 | आगामी 24 महीने | linear-gradient(135deg, #F76FA0, #F5B942) |
| 5 | उपाय | linear-gradient(135deg, #4FD8E8, #F5B942) |

**IMAGE PROMPT FOR CARD ICON SET (generate as 5 separate icon images, consistent style):**
"A set of 5 minimal glowing line-art icons in a consistent mystical style, each enclosed in a thin circular ring border, white/cyan glowing strokes on transparent background, icon themes: (1) a lotus flower with a small flame at center for 'soul purpose', (2) ascending stairs made of light for 'career timing', (3) a planet with concentric orbit rings for 'current planetary period', (4) a crescent moon surrounded by small stars for '24-month outlook', (5) a yantra/mandala geometric symbol for 'remedies'. Each icon simple, elegant, single-color glow, suitable as a UI icon, transparent background, no text"

### 4. Birth Chart Wheel Section
- Heading: "आपकी जन्म कुंडली" (Your birth chart)
- North Indian diamond-style Vedic chart: build this as an SVG component with FIXED house positions (12 diamond/triangle segments in the traditional North Indian layout) — do NOT generate this as an image, build it as actual SVG/CSS so planet data can be dynamically injected into the correct house slots from the backend API response
- Each house slot displays Hindi planet abbreviations (सू, चं, मं, बु, गु, शु, श, रा, के for Sun through Ketu/Rahu) positioned inside the correct diamond segment based on the API's house-placement data
- Chart container has the same glassmorphic card treatment as the form, with a soft gold border glow

### 5. Footer
- Simple, muted, dark background
- Hindi tagline + small print: disclaimer that this is for guidance/entertainment, not a substitute for professional consultation
- Social/contact icons if applicable

## TECHNICAL NOTES
- All text content in Hindi (Devanagari) — do not default to English anywhere in the UI
- Responsive breakpoints: mobile-first, test at 375px, 768px, 1280px
- Respect prefers-reduced-motion for all animations
- The 5 result cards and chart wheel should accept data via props/API response — structure components to receive: `{ soulPurpose, careerTiming, currentDasha, next24Months, remediesAndUpgrades }` (interpretation text in Hindi) and `{ planets: [{name, house, degree}], ascendant, nakshatra }` (chart data) as separate data shapes, matching a backend that calls Prokerala for chart math and Claude Sonnet 4.6 for Hindi interpretation text
- Use the generated hero image and icon set as actual image assets wired into the components, not placeholders
```

-----

## 5. Notes on Using This With Your Backend

- The chart wheel section is intentionally built as **real SVG/CSS, not a generated image** — this is the one place we don’t use AI image generation, because planet positions must update dynamically per user based on actual Prokerala API data. Generated art is only for static decorative elements (hero illustration, card icons).
- When you wire up the live backend, the 5 result cards’ “teaser” text and expanded content should map directly to the Claude Sonnet 4.6 JSON output keys (`soulPurpose`, `careerTiming`, `currentDasha`, `next24Months`, `remediesAndUpgrades`) from your existing plan.
- If Antigravity’s image generation produces art that doesn’t match tone, regenerate with the same prompt but add stylistic anchors like “in the style of ethereal fantasy concept art” or reduce/increase the word “ornate” for complexity control.