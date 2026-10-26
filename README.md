# Bennett Student Hub

> **Independent student resource for Bennett University campus events, clubs, workshops, and hackathons.**  
> Not officially affiliated with Bennett University or Times of India Group.

---

## 🚀 Quick Start

### Run locally (Python — no install required)
```bash
cd "C:\Users\kanak sethi pc\.gemini\antigravity\scratch\bennett-student-hub"
python server.py
```
Then open **http://localhost:8080** in your browser.

### Alternative: Node.js live-server
```bash
npx live-server --port=8080 --entry-file=index.html
```

### Alternative: VS Code Live Server
Install the **Live Server** extension → Right-click `index.html` → **Open with Live Server**

> **Important:** The site must be served from a web server (not opened as a file) because it fetches JSON data via `fetch()`. Opening `index.html` directly from the filesystem will fail with a CORS error.

---

## 📁 Project Structure

```
bennett-student-hub/
├── index.html              # Main HTML entry point (SPA shell)
├── server.py               # Python dev server with SPA routing
├── netlify.toml            # Netlify deployment config
├── vercel.json             # Vercel deployment config
│
├── src/
│   ├── app.js              # Core application: routing, rendering, interactions
│   ├── styles/
│   │   └── main.css        # Full design system and component styles
│   └── data/
│       ├── events.json     # Event data (20+ events)
│       ├── clubs.json      # Club data (12 clubs)
│       ├── faqs.json       # FAQ data (15 FAQs)
│       ├── venues.json     # Campus venues (10 venues)
│       └── siteConfig.json # Site settings and disclaimer
│
├── public/
│   ├── robots.txt          # Crawl instructions for search engines
│   ├── sitemap.xml         # XML sitemap (30+ URLs)
│   └── _redirects          # Netlify SPA routing
│
└── docs/
    ├── keyword-research.md     # SEO keyword research (50 keywords)
    ├── competitor-analysis.md  # Competitor analysis + SERP research
    ├── research-summary.md     # Target audience, IA, SEO strategy
    └── technical-seo-audit.md  # Technical SEO implementation audit
```

---

## 🗂️ Pages Implemented

| URL | Page | Status |
|-----|------|--------|
| `/` | Homepage | ✅ |
| `/events/` | All Events (search + filter) | ✅ |
| `/events/upcoming/` | Upcoming Events | ✅ |
| `/events/{slug}/` | Individual Event Detail | ✅ |
| `/technical-clubs/` | Clubs Directory (search + filter) | ✅ |
| `/technical-clubs/{slug}/` | Individual Club Page | ✅ |
| `/workshops/` | Workshops | ✅ |
| `/hackathons/` | Hackathons | ✅ |
| `/campus-guide/` | Campus Guide & Venues | ✅ |
| `/past-events/` | Past Events Archive | ✅ |
| `/faq/` | Frequently Asked Questions | ✅ |
| `/contact/` | Contact & Feedback (with validation) | ✅ |

---

## ⚡ Features

### Website
- ✅ Full SPA with client-side routing (no framework dependencies)
- ✅ Hero with live search bar
- ✅ Event filtering by category, status (upcoming/past), keyword search
- ✅ Club filtering by category and keyword search
- ✅ Individual event detail pages with full information
- ✅ Individual club pages with activities and related events
- ✅ Campus guide with venue descriptions
- ✅ FAQ accordion with categorized Q&A
- ✅ Contact form with client-side validation
- ✅ Responsive navigation with accessible mobile hamburger menu
- ✅ Scroll-triggered animations (respects `prefers-reduced-motion`)
- ✅ Accessible (ARIA labels, skip nav, focus management, keyboard navigation)
- ✅ Empty states and error states
- ✅ Unverified data flagged with ⚠️ badges

### SEO
- ✅ Keyword-optimised page titles and meta descriptions
- ✅ Open Graph and Twitter Card tags
- ✅ Geographic meta tags (IN-UP, Greater Noida)
- ✅ Structured data: `WebSite` + `SearchAction`
- ✅ robots.txt
- ✅ XML sitemap (30+ URLs)
- ✅ Clean URLs with trailing slashes
- ✅ Semantic HTML5 structure
- ✅ `defer` script loading
- ✅ SPA routing configured for Netlify and Vercel

### Documentation
- ✅ `docs/keyword-research.md` — 40+ keywords with intent, target page, volume estimates
- ✅ `docs/competitor-analysis.md` — 4 competitors + 5 SERP queries
- ✅ `docs/research-summary.md` — Personas, IA, SEO requirements, content strategy
- ✅ `docs/technical-seo-audit.md` — Full technical SEO implementation review

---

## 📊 Data

All data is stored as JSON in `src/data/`:

| File | Records | Notes |
|------|---------|-------|
| `events.json` | 20 events | 5 hackathons, 6 workshops, 5 technical, 4 cultural — mix of upcoming and past |
| `clubs.json` | 12 clubs | Technical, cultural, literary, sports, entrepreneurship |
| `faqs.json` | 15 FAQs | Events, registration, clubs, accuracy, general |
| `venues.json` | 10 venues | Auditorium, seminar halls, labs, outdoor spaces |

**Data transparency:** All unverified records are marked `"verified": false` in the JSON and shown with a ⚠️ badge in the UI.

---

## 🚀 Deployment

### Netlify (Recommended)
1. Push to GitHub
2. Connect repo to Netlify
3. Build command: *(none — static site)*
4. Publish directory: `/` (or `./`)
5. The `netlify.toml` handles SPA routing automatically

### Vercel
1. Push to GitHub
2. Import project in Vercel
3. Framework preset: **Other**
4. The `vercel.json` handles SPA routing automatically

### GitHub Pages
GitHub Pages doesn't natively support SPA routing. Use the `404.html → index.html` trick or use a subdomain via Netlify/Vercel instead.

---

## ⚠️ Disclaimer

Bennett Student Hub is an **independent student resource** and is not officially affiliated with, endorsed by, or operated by Bennett University or the Times of India Group. Event and club information is sourced from public announcements and student contributions. Always verify details with official university channels.

For official Bennett University information: [bennett.edu.in](https://www.bennett.edu.in/)

---

## 📄 Academic Project Information

This website was built as part of an academic SEO project (Milestone I). The project demonstrates:
1. **Keyword Research** — 40+ keywords with search intent classification
2. **Competitor Analysis** — 4 competitor profiles + SERP evidence
3. **Technical SEO** — All on-page and technical SEO implementations documented
4. **Information Architecture** — 12 pages with clean, semantic URLs
5. **Content Strategy** — Data-driven content aligned with user intent

All documentation is in the `docs/` directory.
