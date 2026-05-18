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
| About section, activity descriptions | `app/page.js` |
| Recruiting timeline steps | `app/join/page.js` |
| FAQ questions and answers | `app/components/FAQList.js` |
| Footer text | `app/layout.js` |
| Nav links | `app/components/NavBar.js` |

After editing, commit and push to GitHub — Vercel redeploys automatically.

### Updating the "Stay Updated" Link

The **Stay Updated** button on the Join page currently links to `#`. To wire it to a real form:

1. Open `app/join/page.js`
2. Find `href="#"` on the Stay Updated button
3. Replace `#` with your Google Form URL
4. Commit and push

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
  page.js            — Home (hero + about + CTA)
  join/page.js       — Join Us (timeline + FAQ)
  sponsors/page.js   — Sponsors (Platinum / Gold tiers)
  placements/page.js — Placements (Quant / Tech)
  layout.js          — Root layout (NavBar + Footer)
  not-found.js       — 404 page
  components/
    NavBar.js          — Top navigation bar
    FooterLinks.js     — Footer nav links
    IntroAnimation.js  — Red intro screen on first load
    PageTransition.js  — Red screen between page navigations
    ScrollToAbout.js   — Smooth scroll to About section
    FAQList.js         — Accordion FAQ on Join page
lib/
  sanity.js          — Sanity client + image URL helper
sanity-studio/
  sanity.config.js
  schemas/
    sponsor.js       — Sponsor content type
    placement.js     — Placement content type
public/
  logo.png
  uw-campus.jpg
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
