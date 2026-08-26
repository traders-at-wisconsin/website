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
  canvas still work, but transparency trims most accurately.

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
