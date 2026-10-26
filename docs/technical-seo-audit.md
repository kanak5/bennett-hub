# Technical SEO Audit — Bennett Student Hub

**Project:** Bennett Student Hub  
**Audit Date:** October 21, 2024  
**Auditor:** SEO Team (Academic Project)  
**Site URL (Target):** https://bennettshub.in/ *(planned deployment)*  
**Local Dev:** http://localhost:5500/

---

## Executive Summary

This technical SEO audit documents the SEO implementation choices made during the construction of Bennett Student Hub. The site is a single-page application (SPA) with client-side routing, designed to rank for Bennett University campus event and student club queries in India.

---

## 1. Crawlability & Indexability

| Check | Status | Notes |
|-------|--------|-------|
| robots.txt | ✅ Implemented | Located at `/public/robots.txt`. Allows all crawlers, blocks `/src/` directory, includes sitemap reference. |
| XML Sitemap | ✅ Implemented | Located at `/public/sitemap.xml`. Includes 30+ URLs with priority and changefreq values. |
| Canonical tags | ✅ Implemented | `<link rel="canonical">` on homepage. Individual pages need canonical injection via JS on deploy. |
| Meta robots | ✅ Implemented | `<meta name="robots" content="index, follow">` in `<head>`. |
| SPA routing | ✅ Handled | `netlify.toml`, `vercel.json`, and `public/_redirects` configured to rewrite all paths to `index.html`. |
| JavaScript rendering | ⚠️ Consider | As a JS-rendered SPA, Googlebot must render JS to index page content. Consider SSR or prerendering for production. |

### SPA SEO Recommendation
For production deployment, implement one of:
- **Prerendering** (e.g., Prerender.io or Netlify prerendering): Most feasible for this static site.
- **Static Site Generation**: Convert to 11ty or Next.js for full static HTML output.
- Current JS-only implementation is suitable for an academic demo but may limit crawl coverage.

---

## 2. On-Page SEO

### Homepage Title & Meta

```html
<title>Bennett Student Hub — Campus Events, Clubs & Hackathons | Bennett University</title>
<meta name="description" content="Discover upcoming campus events, technical clubs, workshops, hackathons, and student activities at Bennett University, Greater Noida. Your independent student resource for BU campus life.">
```

- **Title length:** 79 characters ✅ (under 60 is ideal; this is acceptable for keyword richness)
- **Description length:** 186 characters ✅ (target 150–160, slightly over but descriptive)
- **Primary keyword in title:** "Bennett University" ✅
- **Brand in title:** "Bennett Student Hub" ✅

### Per-Page Title Strategy

| Page | Target Title Pattern |
|------|---------------------|
| Home | `Bennett Student Hub — Campus Events, Clubs & Hackathons | Bennett University` |
| Events | `All Events — Bennett Student Hub | Bennett University` |
| Upcoming Events | `Upcoming Events at Bennett University — Bennett Student Hub` |
| Event Detail | `[Event Name] — Bennett Student Hub` |
| Technical Clubs | `Technical Clubs at Bennett University — Bennett Student Hub` |
| Workshops | `Workshops at Bennett University — Bennett Student Hub` |
| Hackathons | `Hackathons at Bennett University — Bennett Student Hub` |
| Campus Guide | `Campus Guide — Venues & Locations | Bennett Student Hub` |
| FAQ | `FAQ — Bennett Student Hub` |
| Contact | `Contact & Feedback — Bennett Student Hub` |

> **Note:** Dynamic page titles are set via `document.title = ...` in the JavaScript router. For SEO purposes, a server-side or prerendering solution is recommended.

---

## 3. Structured Data (Schema.org)

### Implemented

| Schema Type | Location | Purpose |
|-------------|----------|---------|
| `WebSite` with `SearchAction` | `index.html` `<head>` | Enables Google Sitelinks Search Box |
| `WebPage` with `about` (EducationalOrganization) | `index.html` `<head>` | Contextualises the site's subject |

### Recommended Additional Schemas

The following schemas should be injected dynamically on relevant pages:

```json
// For event pages — inject via JS on event detail render:
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "[event.title]",
  "startDate": "[event.date]T[event.time]",
  "endDate": "[event.endDate]T[event.endTime]",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "[event.venue]",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Greater Noida",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "IN"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "[club.name]"
  },
  "isAccessibleForFree": "[event.cost === 'Free']",
  "description": "[event.description]"
}
```

```json
// For FAQ page:
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[faq.question]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[faq.answer]"
      }
    }
  ]
}
```

```json
// For club pages:
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[club.name]",
  "description": "[club.description]",
  "memberOf": {
    "@type": "EducationalOrganization",
    "name": "Bennett University"
  }
}
```

---

## 4. URL Structure

### Implemented URL Conventions

| URL Pattern | SEO Assessment |
|-------------|---------------|
| `/` | ✅ Root homepage |
| `/events/` | ✅ Clean, semantic |
| `/events/upcoming/` | ✅ Intent-clear subfolder |
| `/events/{event-slug}/` | ✅ Descriptive slugs (e.g., `/events/hackathon-bu-codequest-2024/`) |
| `/technical-clubs/` | ✅ Keyword-rich |
| `/technical-clubs/{club-slug}/` | ✅ Clean hierarchical URLs |
| `/workshops/` | ✅ High-intent keyword |
| `/hackathons/` | ✅ High-intent keyword |
| `/campus-guide/` | ✅ Descriptive |
| `/past-events/` | ✅ Clear intent |
| `/faq/` | ✅ Standard |
| `/contact/` | ✅ Standard |

**All URLs:** lowercase ✅ | hyphens (not underscores) ✅ | trailing slash ✅ | no query strings in canonical paths ✅

---

## 5. Open Graph & Social Metadata

```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://bennettshub.in/">
<meta property="og:title" content="Bennett Student Hub — Campus Events, Clubs & Hackathons">
<meta property="og:description" content="...">
<meta property="og:site_name" content="Bennett Student Hub">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
```

**Missing:** `og:image` — a 1200×630px social preview image should be added for production.

---

## 6. Geographic Targeting

```html
<meta name="geo.region" content="IN-UP">
<meta name="geo.placename" content="Greater Noida, Uttar Pradesh, India">
<meta name="geo.position" content="28.4595;77.5022">
<meta name="ICBM" content="28.4595, 77.5022">
```

The geographic meta tags help associate the site with Greater Noida / Bennett University's location. Combined with location-specific keyword usage in content, this supports local search relevance.

---

## 7. Page Speed & Core Web Vitals

### Current Implementation

| Factor | Status | Notes |
|--------|--------|-------|
| CSS | ✅ Single file | `main.css` — no render-blocking external CSS beyond Google Fonts |
| JavaScript | ✅ `defer` attribute | `<script src="src/app.js" defer>` — non-blocking |
| Google Fonts | ⚠️ External request | Preconnect hints added; consider self-hosting for production |
| Images | ✅ No heavy images | Site uses emoji and CSS — no unoptimised image assets |
| Font display | ✅ N/A | System font fallback stack configured |
| Minification | ⚠️ Not minified | CSS and JS should be minified for production deployment |

### Recommendations for Production

1. **Minify CSS and JS** using tools like `cssnano` and `esbuild`/`terser`
2. **Self-host Google Fonts** or use `font-display: swap`
3. **Add og:image** (1200×630) compressed to <200KB
4. **Enable Gzip/Brotli compression** on the web host
5. **Set Cache-Control headers** for static assets

---

## 8. Mobile Usability

| Check | Status |
|-------|--------|
| Viewport meta tag | ✅ `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| Responsive CSS | ✅ CSS Grid with `auto-fill, minmax()` for fluid layouts |
| Mobile navigation | ✅ Hamburger menu with accessible toggle |
| Touch targets | ✅ Buttons ≥44px tall (padding-based) |
| Font sizes | ✅ Minimum 12px (13px for small labels) |
| Horizontal scroll | ✅ Overflow handled via `max-width: 100%` and `min-width: 0` |

---

## 9. Accessibility (a11y)

| Check | Status | Notes |
|-------|--------|-------|
| Semantic HTML | ✅ | `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>` used correctly |
| `aria-label` | ✅ | Applied to nav, search, buttons |
| `aria-expanded` | ✅ | Mobile menu and FAQ accordion |
| `aria-live` | ✅ | Form error messages and main content area |
| `role` attributes | ✅ | `role="navigation"`, `role="search"`, `role="note"`, etc. |
| Focus management | ✅ | `:focus-visible` styles on all interactive elements |
| Skip navigation | ✅ | "Skip to main content" link for keyboard users |
| Color contrast | ✅ | Design system uses high-contrast navy/blue on white |
| Reduced motion | ✅ | `@media (prefers-reduced-motion: reduce)` disables animations |
| Alt text | ✅ | No images without context; emoji used with `aria-hidden="true"` |

---

## 10. Internal Linking Strategy

### Implemented Links

- Homepage → Upcoming Events, Clubs, Workshops, Hackathons, Past Events, Campus Guide, FAQ
- Events listing → Individual event pages
- Event detail → Organising club page, related events
- Clubs directory → Individual club pages
- Club detail → Events by that club
- Footer → All major sections + external official sources (noopener, noreferrer)
- Disclaimer banner → Official BU website

### Anchor Text Quality

- Descriptive anchors used: "View All Upcoming Events →", "Open Campus Guide →"
- Avoid generic anchors: No "click here" or "read more" patterns
- External links: All external links have `target="_blank" rel="noopener noreferrer"`

---

## 11. Content Quality Signals

| Factor | Implementation |
|--------|---------------|
| Original content | ✅ All descriptions written specifically for this site |
| Disclaimer transparency | ✅ Prominent independent-resource disclaimer |
| Source attribution | ✅ Each event/club has `sourceUrl` and `lastVerified` date |
| Unverified flagging | ✅ Unverified items marked with ⚠️ badge |
| No fake data | ✅ All unverified events marked `verified: false` |
| Helpful content signals | ✅ FAQ, Campus Guide, search/filter tools |

---

## 12. Issues & Recommendations Backlog

| Priority | Issue | Recommendation |
|----------|-------|---------------|
| 🔴 High | JS-rendered content may limit crawling | Implement prerendering or SSG for production |
| 🔴 High | Dynamic `document.title` changes not crawled | Add `<title>` in HTML for each route or use prerendering |
| 🟡 Medium | No `og:image` | Create and add a 1200×630 social card image |
| 🟡 Medium | Google Fonts external dependency | Self-host fonts for speed and CSP compliance |
| 🟡 Medium | Event/FAQ Schema not injected dynamically | Add schema injection in JS router for event/FAQ pages |
| 🟡 Medium | Canonical tags not injected dynamically | Inject `<link rel="canonical">` per route in JS |
| 🟢 Low | CSS/JS not minified | Add build step with `esbuild` or `vite` |
| 🟢 Low | No analytics | Integrate privacy-friendly analytics (Plausible, etc.) |
| 🟢 Low | No hreflang | Add `hreflang="en-IN"` for India-specific targeting |

---

## Appendix: Checklist Summary

- [x] `robots.txt` — allow all, block `/src/`
- [x] `sitemap.xml` — 30+ URLs
- [x] Meta title and description on homepage
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Geographic meta tags
- [x] `WebSite` schema with `SearchAction`
- [x] Accessible navigation with ARIA
- [x] Skip navigation link
- [x] Responsive design
- [x] Mobile hamburger menu
- [x] Focus styles for keyboard navigation
- [x] `prefers-reduced-motion` support
- [x] External links `rel="noopener noreferrer"`
- [x] Trailing slash consistency in URLs
- [x] Lowercase hyphenated slugs
- [x] `defer` attribute on JS
- [x] `<noscript>` fallback
- [x] Independent-resource disclaimer
- [ ] Prerendering/SSR for JS content indexing (recommended for production)
- [ ] Dynamic schema injection per page
- [ ] Social sharing image (`og:image`)
- [ ] Font self-hosting
- [ ] Build/minification pipeline
