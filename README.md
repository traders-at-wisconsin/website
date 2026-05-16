# Traders at Wisconsin

Website for Traders at Wisconsin, a student-led quant finance club at UW-Madison.

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · Sanity CMS · Vercel

---

## Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=3vxa65y6
NEXT_PUBLIC_SANITY_DATASET=production
```

### Sanity Studio

```bash
cd sanity-studio
npm install --legacy-peer-deps
npx sanity dev        # runs studio at http://localhost:3333
```

---

## Deployment

### Next.js → Vercel

1. Push repo to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `3vxa65y6`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
4. Deploy

### Sanity Studio → Sanity Hosting

```bash
cd sanity-studio
npx sanity deploy
```

Choose a hostname when prompted (e.g. `traders-at-wisconsin`). The studio will be available at `https://traders-at-wisconsin.sanity.studio`.

---

## Project Structure

```
app/
  page.js           — Home (hero + about + CTA)
  join/page.js      — Join Us (timeline + FAQ)
  sponsors/page.js  — Sponsors (Platinum / Gold tiers)
  placements/page.js — Placements (Quant / Tech)
  layout.js         — Root layout (NavBar + Footer)
  not-found.js      — 404 page
  components/
    NavBar.js
    FooterLinks.js
    IntroAnimation.js
    ScrollToAbout.js
    FAQList.js
lib/
  sanity.js         — Sanity client + urlFor helper
sanity-studio/
  sanity.config.js
  schemas/
    sponsor.js
    placement.js
public/
  logo.png
  uw-campus.jpg
```

---

## Content Management

Log in to the Sanity Studio to manage:

- **Sponsors** — name, logo, website, tier (Platinum / Gold)
- **Placements** — company, category (Quant / Tech), photo

Pages with Sanity content revalidate every 60 seconds via ISR.
