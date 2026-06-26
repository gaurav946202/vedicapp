# VedicApp — Full Visual Design Specification
**For Antigravity / AI-assisted frontend redesign**

---

## 1. Design Philosophy

**Theme:** Cosmic Vedic Observatory — the intersection of ancient Indian astrology and deep space mysticism.
**Mood:** Premium, spiritual, mysterious, trustworthy. Like a luxury astrology brand meets NASA aesthetic.
**Inspiration:** Dark cosmic UI × Indian temple architecture × modern glassmorphism.

The app currently feels sparse. The goal is to make it feel like an **immersive celestial experience** — not just a form. Every scroll should feel like moving through the cosmos.

---

## 2. Existing Design Tokens (do not break these)

```css
--bg-void: #0B0A1A;           /* deep space black */
--bg-nebula-1: #2D1B69;       /* dark purple nebula */
--bg-nebula-2: #7B2FF7;       /* bright cosmic purple */
--accent-gold: #F5B942;       /* temple gold */
--accent-cyan: #4FD8E8;       /* cosmic teal */
--accent-rose: #F76FA0;       /* rose nebula */
--text-primary: #F4F1F9;      /* soft white */
--text-muted: #A9A3C2;        /* silver mist */
--glass-bg: rgba(22,19,49,0.65);
--glass-border: rgba(244,241,249,0.08);
```

**Fonts already loaded:** Baloo 2, Noto Sans Devanagari, Inter
**Add these:** `Cinzel` (for headings, celestial feel), `EB Garamond` (optional for quotes)

---

## 3. Global Background System

### Layered Cosmic Background
Replace the flat radial gradient with a 5-layer parallax star system:

**Layer 1 — Void base:** `#0B0A1A` solid
**Layer 2 — Nebula gradient:** large radial blob, top-center, `#2D1B69` → transparent, 80vw wide, very soft
**Layer 3 — Second nebula:** bottom-right corner, `#7B2FF7` at 3% opacity, 60vw wide
**Layer 4 — Star field small:** 200+ tiny 1px white dots, random positions, slow twinkle animation (2–4s cycle, staggered)
**Layer 5 — Star field large:** 30–40 larger 2–3px stars, some gold-tinted (`#F5B942`), some cyan-tinted (`#4FD8E8`), slower twinkle (4–8s)

### Twinkle Animation
```css
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.4); }
}
```
Each star gets a random `animation-delay` (0–8s) so they don't blink in sync.

### Floating Particles (subtle)
3–5 very slow drifting particles (blurred circles, 6–10px, opacity 0.06–0.12) moving upward very slowly (60–90s loop). Pure CSS, no JS.

### Constellation Lines
2–3 faint SVG constellation line patterns (Scorpio, Orion silhouette) overlaid at 3% opacity in the hero and between sections. Thin white lines connecting dots. These should be **decorative only**, not interactive.

---

## 4. Section-by-Section Design

---

### 4.1 HERO SECTION

**Goal:** Full-viewport impact. The user should feel awe before scrolling.

**Layout:**
- Full viewport height (`100vh`)
- Left column (55%): text content
- Right column (45%): cosmic deity image with glow halo
- On mobile: stacked, image below text (60vw wide, centered)

**Left column content:**

```
[small all-caps badge]  ✦ वैदिक ज्योतिष ✦
[H1 — 3 lines max]      अपनी जन्म कुंडली
                         से अपना भाग्य जानें
[subtext]               वैदिक ज्योतिष से करियर, आत्मा का उद्देश्य
                         और आगामी 24 महीनों की भविष्यवाणी।
[CTA button]            [ कुंडली बनाएं  ↓ ]
[trust line below CTA]  ✦ 9 ग्रह · 27 नक्षत्र · वास्तविक गणना ✦
```

**Badge style:** rounded pill, border `1px solid rgba(245,185,66,0.4)`, gold text, background `rgba(245,185,66,0.08)`, letter-spacing 0.15em, font-size 11px

**H1 style:**
- Font: Cinzel or Baloo 2
- Size: `clamp(2.8rem, 6vw, 5rem)`
- Line height: 1.1
- Gradient text: `linear-gradient(135deg, #F4F1F9 0%, #F5B942 50%, #4FD8E8 100%)`
- Text-fill: transparent with background-clip
- Animate in: fade + slide up, 0.8s ease, delay 0.2s

**CTA Button:**
- Background: `linear-gradient(135deg, #F5B942, #F76FA0)`
- Padding: `16px 40px`
- Border-radius: 50px
- Font: bold, 1.1rem
- Box-shadow: `0 0 40px rgba(245,185,66,0.35), 0 4px 20px rgba(247,111,160,0.25)`
- Hover: scale 1.04, shadow intensifies
- Pulse animation: subtle breathing glow every 3s

**Right column — Hero Image:**
- The existing `hero_cosmic_deity.png` image
- Wrap in a container with:
  - Outer ring: `border: 1px solid rgba(245,185,66,0.2)`, border-radius 50%, `box-shadow: 0 0 80px rgba(123,47,247,0.4), 0 0 160px rgba(79,216,232,0.15)`
  - Slow rotation of just the outer ring: 120s linear infinite
  - Inner image: no rotation, just the glow
- Behind the image: large blurred circle (`#7B2FF7`, 50% opacity, blur 80px, 70% size of image container) as a light source effect

**Scroll indicator:**
- Bottom center of hero
- Animated chevron / dot bouncing downward
- Text: "नीचे स्क्रॉल करें" in `var(--text-muted)`

**Hero entrance animation sequence:**
1. Badge fades in (0s)
2. H1 slides up + fades in (0.2s)
3. Subtext fades in (0.5s)
4. CTA button pops in with slight scale (0.7s)
5. Image scales from 0.9 to 1.0 with glow expanding (0.3s)

---

### 4.2 TRUST BAR (new section — add between hero and form)

A horizontal band, full width, `rgba(22,19,49,0.5)` background, `1px` gold-tinted border top and bottom.

3 columns separated by thin dividers:

```
🪐  वास्तविक ग्रह गणना        ✦       नक्षत्र-आधारित दशा        ✦       हिंदी में व्याख्या
     Prokerala API से                   सटीक तिथि-समय                  Claude AI से
```

Font: small, muted, centered. Icon: emoji or tiny SVG. Light gold border around each item on hover.
Animation: slide in from sides on scroll-enter.

---

### 4.3 BIRTH DETAILS FORM

**Goal:** Make the form feel like a sacred ritual, not a Google Form.

**Container:**
- Max-width: 640px, centered
- Background: `rgba(22,19,49,0.7)`
- Backdrop-filter: `blur(20px)`
- Border: `1px solid rgba(245,185,66,0.15)`
- Border-radius: 24px
- Box-shadow: `0 0 60px rgba(123,47,247,0.2), 0 20px 60px rgba(0,0,0,0.5)`
- Subtle inner glow top edge: `box-shadow: inset 0 1px 0 rgba(245,185,66,0.1)`

**Header inside form:**
- Small Sanskrit symbol: `॥` or `ॐ` in gold, centered, 2rem
- Title: "अपना जन्म विवरण भरें" — Baloo 2, 1.5rem, gradient from gold to white
- Subtitle: "सटीक परिणाम के लिए सही जानकारी दें" — muted, 0.85rem

**Form field style:**
- Label: `var(--text-muted)`, 0.8rem, letter-spacing 0.05em, uppercase
- Input background: `rgba(11,10,26,0.6)`
- Input border: `1px solid rgba(244,241,249,0.1)` → on focus: `1px solid rgba(245,185,66,0.5)`
- Input border-radius: 12px
- Focus glow: `box-shadow: 0 0 0 3px rgba(245,185,66,0.12)`
- Transition: 0.25s ease

**Place autocomplete dropdown:**
- Same glass styling as the form card
- Each suggestion item: bold place name + smaller muted context below
- Hover: `background: rgba(123,47,247,0.15)`, left border gold `3px`
- Max-height: 240px, scrollable

**Submit button:**
- Full width
- Background: `linear-gradient(90deg, #F5B942, #F76FA0, #7B2FF7)`
- Background-size: 200%
- Animation: `background-position` shifts left-right slowly (shimmer)
- Text: "चार्ट देखें ✦" — white, bold, 1.1rem
- Border-radius: 14px
- Padding: 16px
- Hover: brightness 1.1, scale 1.01

**Decorative elements around the form:**
- 4 tiny gold star `✦` positioned at corners of the card (absolute, pointer-events none)
- Very faint mandala watermark behind the form at 3% opacity (use the image prompt below)

---

### 4.4 LOADING STATE

**Goal:** The loading state is shown for 25–45 seconds. Make it beautiful.

**Replace the simple spinner with:**

**Outer ring:** large SVG circle (200px), dashed gold stroke, slow clockwise rotation (8s)
**Middle ring:** smaller SVG circle (140px), dashed cyan stroke, counterclockwise (6s)  
**Inner mandala:** 80px, rotating gold lotus/mandala SVG, 4s
**Center dot:** 12px pulsing gold circle

**Ambient glow:** behind the rings, a 300px blurred gold/purple circle pulsing 0.5 opacity → 0.2 (3s cycle)

**Text below:**
```
आपकी कुंडली बन रही है...
[progress hint — rotates every 5s:]
  "ग्रहों की स्थिति की गणना हो रही है"
  "नक्षत्र और दशा का विश्लेषण"  
  "AI से हिंदी व्याख्या तैयार हो रही है"
```

Text rotation: CSS animation swapping opacity 0→1→0.

---

### 4.5 RESULTS — INTERPRETATION CARDS

**Goal:** The cards are the heart of the app. They should feel like illuminated manuscripts.

**Grid layout:**
- Desktop: 2 columns (first card spans full width — featured)
- Tablet: 2 columns
- Mobile: 1 column
- Gap: 20px

**Card anatomy:**

```
┌─────────────────────────────────────────┐
│  [top accent bar — 3px, gradient]        │
│  [icon frame — 48px circle]  [card #]    │
│                                          │
│  [Category Title]                        │
│  [Teaser — slightly larger, italic]      │
│                                          │
│  [faint divider line]                    │
│                                          │
│  "विस्तार से पढ़ें ✦"  [arrow icon]    │
└─────────────────────────────────────────┘
```

**Card base style:**
- Background: `rgba(22,19,49,0.6)`
- Backdrop-filter: `blur(16px)`
- Border: `1px solid rgba(244,241,249,0.07)`
- Border-radius: 20px
- Padding: 28px
- `--card-glow-color` drives the box-shadow: `0 0 40px var(--card-glow-color)`
- Transition: transform 0.3s, box-shadow 0.3s

**Card hover:**
- `transform: translateY(-6px) scale(1.01)`
- Shadow intensifies: `0 20px 60px var(--card-glow-color), 0 0 0 1px rgba(255,255,255,0.06)`
- Top accent bar glows (brightness increases)
- Cursor: pointer

**First card (soulPurpose) — featured full-width:**
- Larger padding (36px)
- H3 font size 1.3rem
- Teaser font size 1.05rem
- Slightly more prominent glow

**Icon frame:**
- 56px circle
- Background: `var(--card-gradient)` (already in component as CSS var)
- Box-shadow: `0 0 20px var(--card-glow-color)`
- Icon image: 32px, white tinted

**Card entrance animation:**
Each card animates in on scroll-enter:
- `opacity: 0, transform: translateY(30px)` → `opacity: 1, transform: translateY(0)`
- Duration: 0.6s ease-out
- Stagger: 0.1s delay per card (card 1 at 0s, card 2 at 0.1s, etc.)

---

### 4.6 RESULTS — BIRTH CHART WHEEL (right column)

**Goal:** The SVG North Indian chart should feel alive, not like a data table.

**Container:**
- Sticky on desktop (sticks to top while cards scroll)
- Background: `rgba(22,19,49,0.5)`
- Border: `1px solid rgba(245,185,66,0.12)`
- Border-radius: 20px
- Padding: 24px
- Box-shadow: `0 0 60px rgba(245,185,66,0.08)`

**Chart enhancements:**
- Planet symbols in each house cell: slightly larger, gold color
- Active house cells: subtle inner glow when planet is present
- Ascendant cell: distinct highlight — `background: rgba(245,185,66,0.08)`, labeled "लग्न"
- Outer ring of the chart: thin gold stroke, 1px
- Grid lines: `rgba(244,241,249,0.15)` instead of harsh white

**Metadata below the chart:**
Three pills in a row:
```
[ लग्न: सिंह ]    [ राशि: कर्क ]    [ नक्षत्र: पुष्य ]
```
Pill style: `background: rgba(245,185,66,0.1)`, gold border 1px, gold text, border-radius 20px, padding 6px 16px, font-size 0.8rem

**Entrance animation:**
- Chart container: fade in + slight scale from 0.95 to 1.0
- Planet cells: stagger blink-in (each cell lights up in sequence, 30ms apart)

---

### 4.7 MODAL (card detail view)

**Current:** Basic glass card. Needs premium feel.

**Redesign:**
- Overlay: `rgba(5,5,16,0.85)` backdrop-filter blur 8px
- Modal card: max-width 580px, same glass style as form
- Top: gradient icon frame (larger, 80px), title below
- Body: teaser in larger italic gold text, horizontal rule (gradient), then full content
- Bottom: close button (outlined, gold border)
- Entrance animation: scale 0.9→1.0 + fade in, 0.3s cubic-bezier(0.34,1.56,0.64,1) (springy)
- Backdrop click: fade out modal

---

### 4.8 FOOTER

**Goal:** Feels intentional, not an afterthought.

**Layout:**
```
[OM symbol large, gold, centered at top]

ज्योतिष एक मार्गदर्शन है, भविष्यवाणी नहीं।
जीवन के निर्णय स्वयं विवेक से लें।

[divider line]

Made with ✦ in India  ·  Vedic Astrology × AI
© 2025
```

- Background: `rgba(11,10,26,0.8)`
- Top border: `1px solid rgba(245,185,66,0.1)`
- OM symbol: Cinzel or Devanagari, 3rem, `var(--accent-gold)`, opacity 0.5, animated gentle pulse (4s)
- Disclaimer text: italic, `var(--text-muted)`, 0.85rem

---

## 5. Animation Library

### Scroll-triggered entrance (use Intersection Observer or pure CSS @scroll-timeline)
All major sections animate in on scroll. Default:
```css
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Shimmer effect (for CTA button and card accents)
```css
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
```

### Orbiting element (hero image ring)
```css
@keyframes orbit {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
```

### Star twinkle (see Section 3)

### Card hover lift
`transform: translateY(-6px)` with `transition: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Page load fade
Full app: `opacity: 0` → `opacity: 1` over 0.5s on first render.

---

## 6. Mobile Optimization

### Breakpoints
- Mobile: `< 640px`
- Tablet: `640px – 1024px`  
- Desktop: `> 1024px`

### Hero (mobile)
- Single column, text centered
- Image: 200px, shown below text
- H1: `clamp(2rem, 8vw, 2.8rem)`
- CTA button: full width

### Form (mobile)
- Full width, padding 20px
- Stack all fields vertically (already done)
- Autocomplete dropdown: max-height 180px

### Results (mobile)
- Remove the 2-column layout
- Chart wheel moves ABOVE cards on mobile
- Chart: full width, 340px max
- Cards: single column, 1 card per row
- Cards scroll vertically, no sticky

### Trust bar (mobile)
- Stack 3 items vertically
- Show separator as horizontal rule instead of `·`

### Typography scale down (mobile)
- Section titles: 1.3rem
- Card titles: 1rem
- Card teaser: 0.9rem

---

## 7. Image Generation Prompts

Use these prompts to generate images within Antigravity's image generation feature. Each prompt is ready to paste as-is.

---

### 7.1 Hero Image — Cosmic Deity (replace/enhance existing)
```
A majestic Indian goddess or cosmic deity figure in a meditative pose, 
surrounded by glowing Vedic astrological symbols, celestial constellations, 
and a luminous mandala halo. Deep indigo and purple space background with 
golden light emanating from the center. Intricate jewelry with lapis lazuli 
and gold. Sanskrit symbols floating around. Ultra-detailed digital art, 
cinematic lighting, 8K quality. Vertical aspect ratio 3:4.
```

### 7.2 Background Nebula Texture
```
Abstract deep space nebula texture, dark purple and midnight blue tones,
subtle gold and teal glowing star clusters scattered throughout, 
soft volumetric light rays, no text, seamless tile-able, 
photorealistic space photography style, very dark, moody, premium.
```

### 7.3 Mandala Watermark (for form background)
```
Intricate sacred geometry mandala, thin golden lines on transparent background, 
16-fold symmetry, Vedic yantra patterns, lotus petals interlaced with 
geometric circles and triangles, minimalist elegant style, 
gold color only (#F5B942), transparent PNG background.
```

### 7.4 Section Divider — Constellation
```
Minimalist constellation line art, a few connected star dots forming 
a simple zodiac shape (Scorpius or Orion), thin white lines, 
small white circle dots at vertices, transparent background, 
very subtle and elegant, horizontal orientation, vector style.
```

### 7.5 Card Icons (generate a set of 5)

**Soul Purpose icon:**
```
Glowing lotus flower with an eye of consciousness in the center, 
golden aura, spiritual mystical style, transparent background, 
square aspect ratio, premium icon style.
```

**Career Timing icon:**
```
A golden hourglass with stars and planetary rings around it, 
cosmic timing symbol, rich golden tones, mystical glow effect, 
transparent background, icon style.
```

**Current Dasha icon:**
```
Planetary alignment diagram, 9 planets in orbital motion, 
centered around a glowing sun, rich cosmic purple and gold palette, 
circular composition, transparent background, icon style.
```

**Next 24 Months icon:**
```
A crescent moon with a calendar grid and star sparkles, 
prophetic and mystical, soft blue-gold palette, 
transparent background, icon style.
```

**Remedies icon:**
```
A gemstone (ruby or sapphire) with divine light rays and 
Sanskrit Om symbol below, healing energy waves, 
gold and purple tones, transparent background, icon style.
```

### 7.6 Loading Animation Center — Mandala
```
Intricate rotating mandala for loading animation, 
16 petals with detailed geometric patterns, 
golden (#F5B942) and teal (#4FD8E8) dual-color scheme, 
transparent background, perfect circle, 
symmetrical, sacred geometry style.
```

### 7.7 Om Symbol (Footer)
```
Elegant Sanskrit Om (ॐ) symbol, Devanagari calligraphy style, 
soft golden glow effect, subtle aura, transparent background, 
centered composition, premium minimalist aesthetic.
```

---

## 8. Typography Hierarchy

| Element          | Font           | Size (desktop) | Weight | Color              |
|-----------------|----------------|----------------|--------|--------------------|
| H1 Hero         | Cinzel/Baloo 2 | clamp(2.8–5rem)| 700    | gradient gold-cyan |
| H2 Section      | Baloo 2        | 1.8rem         | 600    | `var(--text-primary)` |
| H3 Card title   | Baloo 2        | 1.05rem        | 600    | `var(--text-primary)` |
| Card teaser     | Noto Sans Dev  | 0.9rem         | 400    | `var(--text-muted)` |
| Body/modal text | Noto Sans Dev  | 0.95rem        | 400    | `var(--text-primary)` |
| Labels/pills    | Inter          | 0.75rem        | 500    | `var(--accent-gold)` |
| Button text     | Baloo 2/Inter  | 1rem           | 700    | white              |

---

## 9. Spacing System

Base unit: 8px

| Token   | Value  | Usage                        |
|---------|--------|------------------------------|
| `--s-1` | 8px    | tight gaps, icon padding     |
| `--s-2` | 16px   | input padding, small margins |
| `--s-3` | 24px   | card padding, section gaps   |
| `--s-4` | 32px   | between major elements       |
| `--s-5` | 48px   | section vertical padding     |
| `--s-6` | 80px   | between full sections        |

---

## 10. Do Not Change

These elements must remain functionally identical (Antigravity should only restyle, not restructure):

- All React component props and data bindings
- The `onSubmit` form handler signature
- The `interpretations.{key}.{title,teaser,content}` data shape
- The `chartData.planets[{name,house,degree}]` array
- The `BirthChartWheel` SVG grid logic
- All class names that have backend-driven dynamic styles (`--card-gradient`, `--card-glow-color`)
- The modal open/close logic in `ResultCardsGrid`
- The `suggestions-list` autocomplete dropdown behavior

You may add new CSS classes, keyframes, and decorative elements freely. Do not change JSX logic.

---

## 11. Overall Page Scroll Experience

```
[HERO — full viewport, cosmic, impactful]
         ↓ (smooth scroll, stars parallax shift slightly)
[TRUST BAR — 80px, subtle proof points]
         ↓
[FORM — centered, sacred ritual feel, 600px wide]
         ↓ (on submit: form fades, loading mandala appears)
[LOADING STATE — mandala spinner, rotating text hints]
         ↓ (on completion: results fade in gracefully)
[RESULTS — 2-column: cards left, chart right, sticky chart]
         ↓
[FOOTER — OM symbol, disclaimer, minimal]
```

Total page feel: like consulting a cosmic oracle. Premium, calm, spiritual.

---

*Document prepared for VedicApp frontend redesign — June 2025*
