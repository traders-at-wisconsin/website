# Traders at Wisconsin — Website

Live site: [tradersatwisconsin.com](https://tradersatwisconsin.com)  
Repo: [github.com/traders-at-wisconsin/website](https://github.com/traders-at-wisconsin/website)

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · Sanity CMS · Vercel

---

## For Exec Members — Updating Site Content

Most content updates (sponsors, placements) are done through **Sanity Studio** — no coding required.

### Accessing the CMS

Go to [traders-at-wisconsin.sanity.studio](https://traders-at-wisconsin.sanity.studio) and log in with your Sanity account. Ask the current webmaster to invite you as an editor.

### Adding or Removing a Sponsor

1. In the studio, click **Sponsor** in the left sidebar
2. Click **+ New Sponsor** to add one, or click an existing sponsor to edit/delete
3. Fill in:
   - **Company Name** — displayed as alt text if no logo
   - **Logo** — upload a PNG or SVG (transparent background works best)
   - **Website URL** — optional, makes the logo clickable
   - **Tier** — Platinum (larger cards) or Gold (smaller cards)
4. Click **Publish** — the site updates within 60 seconds

### Adding or Removing a Placement

1. Click **Placement** in the left sidebar
2. Click **+ New Placement**
3. Fill in:
   - **Company** — firm name
   - **Category** — Quant or Tech
   - **Photo** — company logo (optional, falls back to text)
4. Click **Publish** — the site updates within 60 seconds

### Updating Static Text (Join page, FAQ, About section)

These are hardcoded in the source files — you'll need to edit the code directly:

| Content | File |
|---------|------|
| Homepage copy — hero, mission, the three tracks | `app/page.js` |
| Recruiting timeline stages | `app/join/page.js` |
| FAQ questions and answers | `app/components/FAQList.js` |
| Sponsor page copy, "what sponsorship supports" | `app/sponsors/page.js` |
| Footer text, social links | `app/components/Footer.js` |
| Nav links | `app/components/NavBar.js` |
| Colours, type scale, spacing | `app/globals.css` |

After editing, commit and push to GitHub — Vercel redeploys automatically.

### Where the "Stay Updated" Button Goes

The **Stay Updated** button on the Join page opens the club's LinkedIn page:
`https://www.linkedin.com/company/traders-at-wisconsin/`

That is deliberate — LinkedIn is where recruiting dates and deadlines get
posted, so the button and the FAQ both point there. If the club ever moves
announcements elsewhere, update the `LINKEDIN` constant in **both**
`app/join/page.js` and `app/components/Footer.js`.

### A Note on Logo Files

You do **not** need to crop logos before uploading them. The site measures
each logo's real ink bounding box, trims the surrounding whitespace, and
sizes every logo so they all carry roughly the same visual weight — a wide
wordmark and a square mark will no longer render at wildly different sizes.

Two things still help:

- **Upload the highest resolution you have.** The site never upscales, so a
  small source stays soft. Anything under ~600 px wide will look soft on a
  retina screen.
- **Prefer a transparent PNG or SVG.** Logos on a solid white or coloured
  canvas still work — logo cells are pure white so a white canvas sits
  flush — but transparency trims most accurately.

Current assets worth re-uploading at higher resolution: **Belvedere**
(310 px wide) and **Nvidia** (600 px). Both are visibly soft on a retina
screen. Also worth correcting in the CMS, since the company name is the
image's alt text and what a screen reader announces: "Open AI" → OpenAI,
"Playstation" → PlayStation, "Cap1" → Capital One, "LA Cap Mng" → Los
Angeles Capital, "JPMC" → J.P. Morgan.

---

## Making Code Changes

### Setup

```bash
# Clone the repo
git clone https://github.com/traders-at-wisconsin/website.git
cd website

# Install dependencies
npm install --legacy-peer-deps

# Create environment file
echo "NEXT_PUBLIC_SANITY_PROJECT_ID=3vxa65y6" > .env.local
echo "NEXT_PUBLIC_SANITY_DATASET=production" >> .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploying Changes

Vercel deploys automatically on every push to `main`:

```bash
git add -A
git commit -m "describe your change"
git push
```

The live site updates in ~1 minute.

---

## Project Structure

```
app/
  page.js            — Home (hero + placements + mission + tracks + sponsors + CTA)
  join/page.js       — Recruiting (timeline + FAQ)
  sponsors/page.js   — Sponsors (wall + what sponsorship supports + outcomes)
  about/page.js      — Redirects to /#about
  layout.js          — Root layout (fonts, metadata, NavBar + Footer)
  not-found.js       — 404 page
  globals.css        — Design tokens: colour, type scale, utilities
  components/
    NavBar.js          — Top navigation + mobile menu
    Footer.js          — Site footer
    Mark.js            — WT monogram as inline SVG
    Wordmark.js        — Mark + lockup
    HeroField.js       — Animated random-walk / distribution canvas
    LogoMarquee.js     — Scrolling company logo strip
    LogoImage.js       — One size-normalised logo
    SectionLabel.js    — Numbered mono section marker
    FAQList.js         — FAQ accordion (native <details>)
    RouteProgress.js   — Loading rule during navigation
    PausableRegion.js  — Pause control for the scrolling logo strip
lib/
  sanity.js          — Sanity client, image URL helper, safeFetch
  logo-metrics.js    — Logo trimming + optical-area normalisation
sanity-studio/
  sanity.config.js
  schemas/
    sponsor.js       — Sponsor content type
    placement.js     — Placement content type
public/
  mark.svg           — Monogram used across the site
  logo.png           — Original square logo artwork
```

---

## Design System

Everything lives in `app/globals.css` as Tailwind v4 `@theme` tokens. Use the
tokens; avoid one-off hex values and off-scale font sizes.

### Colour

| Token | Value | Use |
|-------|-------|-----|
| `brand-400` | `#ff6b75` | Red text and marks **on dark** (7.2:1 on ink) |
| `brand-500` | `#c5050c` | Signal red — rules, graphics, hover fills |
| `brand-600` | `#a60211` | The mark's own red — primary buttons, red text on paper |
| `ink` / `ink-2` / `ink-3` | `#0a0a0b` … | Dark surfaces |
| `paper` / `paper-2` | `#faf9f7` / `#f2f1ed` | Light surfaces |
| `body` / `mute` | `#3d3d44` / `#55555e` | Text on paper (10.3:1 / 7.1:1) |
| `body-dark` / `mute-dark` | `#b9b9c2` / `#8f8f99` | Text on ink (10.2:1 / 6.2:1) |
| `hair` / `hair-dark` | `#e3e1db` / `#27272e` | Hairline rules |

Every text pairing above clears WCAG AA on its intended background. If you add
a colour, check it before shipping.

Red is a signal, not a surface. It belongs on hairlines, eyebrows, one primary
button per view, and the hero graphic — not as large flat fills.

### Type

Base is **17px**, not 16 — the whole Tailwind scale is shifted up with it, so
`text-base` and `text-sm` are already larger than stock. Two faces only:

- **IBM Plex Sans** — headings and body
- **IBM Plex Mono** — eyebrows, labels, buttons, numbers (never body copy)

Fluid display sizes: `text-title`, `text-display`, `text-hero`.

Use the `eyebrow` utility for the recurring mono uppercase label, and
`<SectionLabel index="01">` for numbered section markers.

### The Hero Graphic

`app/components/HeroField.js` runs a two-act loop: the UW–Madison campus
as a network, which then collapses to a point and walks back out as
random walks forming a normal distribution.

The campus geometry is baked into `app/data/campus.json` (6 KB) from
**OpenStreetMap** — 88 real building centroids, the Lake Mendota
shoreline, and labels for the buildings this club's subjects live in.
There is no runtime API call — Overpass is rate-limited and its uptime
is not ours. The data changes rarely enough that the output is
committed. To regenerate it:

```bash
python3 scripts/build-campus-data.py
```

That script holds the bounding box, the Overpass queries, the
simplification tolerances and the label list, all commented.

OSM is ODbL-licensed, so the attribution in the footer must stay.

Timing, easing and staggering follow manim's grammar — `smooth` is the
quintic smootherstep (6t⁵−15t⁴+10t³), transforms travel along a circular
`path_arc`, and reveals cascade with a 0.05 lag ratio.

### Motion

One signature motion — the hero canvas. Everything else is a short
colour or transform transition. `prefers-reduced-motion` is handled globally
in `globals.css`: animations collapse, the marquee becomes a scrollable strip,
and the hero canvas renders a single static frame. If you add motion, verify
it under reduced motion before shipping.

---

## Deployment Reference

### Vercel (Next.js)

| Setting | Value |
|---------|-------|
| Framework | Next.js (auto-detected) |
| Environment variable | `NEXT_PUBLIC_SANITY_PROJECT_ID` = `3vxa65y6` |
| Environment variable | `NEXT_PUBLIC_SANITY_DATASET` = `production` |
| Auto-deploy | Yes, on every push to `main` |

### Sanity Studio

```bash
cd sanity-studio
npx sanity deploy
```

### Domain

`tradersatwisconsin.com` is registered on Squarespace. DNS is pointed to Vercel via:
- A record: `@` → `216.198.79.1`
- CNAME: `www` → `93f987c3765317aa.vercel-dns-017.com`
