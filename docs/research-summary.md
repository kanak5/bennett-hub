# Research Summary: Bennett Student Hub

**Project:** Bennett Student Hub  
**Date:** October 21, 2024  
**Purpose:** Academic SEO project — Milestone I deliverable support

---

## 1. Target Audience & User Personas

### Persona 1: Ananya — The Engaged Student
- **Year:** 2nd year B.Tech CSE
- **Goals:** Stay on top of hackathons and technical workshops. Wants to join a coding club.
- **Frustrations:** Information scattered across Instagram DMs, WhatsApp groups, and the BU website. Misses registration deadlines because she finds out too late.
- **Search behaviour:** Searches "Bennett University upcoming events" and "Bennett hackathon November" on Google. Checks Unstop regularly.
- **Device:** Primarily mobile (Android).

### Persona 2: Rohan — The Fresher
- **Year:** 1st year B.Tech
- **Goals:** Find the right clubs to join at the start of the semester. Understand what events happen on campus.
- **Frustrations:** Doesn't know which clubs exist or how to join them. The official website is confusing and not updated.
- **Search behaviour:** Searches "what clubs are there at Bennett University" and "how to join clubs at Bennett University".
- **Device:** Mix of mobile and laptop.

### Persona 3: Priya — The Prospective Student
- **Year:** Class 12 / gap year
- **Goals:** Evaluate Bennett University's campus life and extracurricular activities before making an admission decision.
- **Frustrations:** The official website's campus life section is generic and lacks specifics about events, competitions, and student achievements.
- **Search behaviour:** Searches "Bennett University student clubs", "Bennett University campus activities", "BU technical clubs".
- **Device:** Laptop.

---

## 2. Student Search Behaviour Analysis

### Primary Search Channels
1. **Google** — Dominant discovery channel. Students search event names, registration links, club names.
2. **Unstop** — Used specifically for hackathon/competition discovery and registration.
3. **Instagram** — Club official handles and BU student community accounts. Not searchable externally.
4. **WhatsApp Groups** — Last-mile information delivery. Information is ephemeral and non-searchable.

### Key Search Behaviour Patterns

| Behaviour | Implication for Bennett Student Hub |
|-----------|-------------------------------------|
| Students search event names + "registration" | Each event page needs a prominent registration CTA and FAQ about registration process |
| Freshers search "how to join clubs at BU" | FAQ and club pages need a "How to Join" section |
| Students check Unstop for BU hackathons | BSH should list all hackathons with Unstop registration links |
| Information spreads on WhatsApp → students miss events | BSH's value proposition: centralised, always-current event listings |
| Searches are mobile-first (India: 80%+ mobile web) | Mobile-first design is non-negotiable |

### Problems Being Solved
1. **Information fragmentation** — Events announced on club Instagram → WhatsApp → BU website → Unstop. Students must monitor all channels.
2. **Registration deadline misses** — Students discover events after deadlines have passed.
3. **Club discovery gap** — The official club directory is sparse; students can't discover clubs by interest area.
4. **Venue confusion** — New students don't know where events are held on campus.

---

## 3. Site Architecture Recommendation

```
bennettshub.in/
├── /                            Homepage
├── /events/                     All Events (searchable, filterable)
│   └── /events/upcoming/        Upcoming Events (default sort: soonest first)
│   └── /events/{slug}/          Individual Event Detail Page
├── /technical-clubs/            Technical Clubs Directory
│   └── /technical-clubs/{slug}/ Individual Club Page
├── /workshops/                  Workshops Category Landing Page
├── /hackathons/                 Hackathons Category Landing Page
├── /campus-guide/               Campus Venues & Guide
├── /past-events/                Past Events Archive
├── /faq/                        Frequently Asked Questions
└── /contact/                    Contact & Feedback
```

**URL Design Principles:**
- Lowercase with hyphens
- Trailing slashes for consistency
- Maximum 3-level depth (beyond event/club slugs)
- Semantic, human-readable slugs

---

## 4. Top 10 SEO Requirements

| Priority | Requirement | Rationale |
|----------|-------------|-----------|
| 1 | **Keyword-mapped page titles** | Each page targets one primary keyword in `<title>` |
| 2 | **Event Schema on event detail pages** | Enables Google event rich results and SERP carousels |
| 3 | **FAQPage Schema on FAQ page** | Enables PAA (People Also Ask) rich results |
| 4 | **robots.txt + sitemap.xml** | Ensures Googlebot can discover and crawl all pages |
| 5 | **Mobile-first responsive design** | India: 80%+ searches are mobile; Google uses mobile-first indexing |
| 6 | **Geographic meta tags** | Signals relevance for Greater Noida / India localised searches |
| 7 | **Clean URL structure** | Lowercase, hyphenated, trailing slash — crawlable and shareable |
| 8 | **Descriptive meta descriptions** | Improves click-through rate from SERP |
| 9 | **Open Graph tags** | Ensures proper social sharing previews |
| 10 | **Independent resource disclaimer** | Transparency and trust signals; avoids misleading claims |

---

## 5. Content Strategy Recommendations

### Pillar Content
| Pillar | URL | Primary Keyword |
|--------|-----|----------------|
| Events Hub | `/events/` | Bennett University campus events |
| Clubs Hub | `/technical-clubs/` | Bennett University technical clubs |
| Hackathons | `/hackathons/` | Bennett University hackathons |
| Workshops | `/workshops/` | Bennett University workshops |

### Supporting Content
- Individual event pages with full structured data
- Individual club pages with activities and event history
- Campus Guide with venue descriptions
- FAQ addressing all student registration questions

### Content Refresh Calendar
- **Weekly:** Check for new event announcements; update registration status
- **Monthly:** Add new events and verify existing event details
- **Semester start (July/January):** Full audit; update club rosters and semester schedules
- **Post-event:** Add event recaps to past events archive

### Unique Value Proposition (Content)
Bennett Student Hub offers what no other site does:
- **BU-specific event aggregation** with filter/search
- **Club profiles** with activity listings and related events
- **Campus venue guide** with descriptions and capacity
- **Registration guidance** consolidated in one FAQ
- **Verified data with transparency** (last-verified dates, ⚠️ unverified flags)

---

## 6. SEO Roadmap

### Phase 1: Foundation (Month 1-2)
- [x] Site build with clean URL structure
- [x] robots.txt and sitemap.xml
- [x] On-page SEO (titles, meta, canonical)
- [x] Structured data (WebSite, WebPage)
- [x] Mobile-responsive design
- [ ] Google Search Console setup
- [ ] Google Analytics (privacy-friendly alternative) setup

### Phase 2: Content Expansion (Month 3-4)
- [ ] Add all verified club pages with activities and social links
- [ ] Implement Event Schema on all event detail pages
- [ ] Implement FAQPage Schema on FAQ page
- [ ] Expand FAQ to 25+ questions
- [ ] Add campus guide with venue photos

### Phase 3: Authority Building (Month 5-6)
- [ ] Reach out to BU clubs for verified information and backlinks
- [ ] Submit to KnowAFest, CollegeSearch, and similar directories
- [ ] Create shareable resources (hackathon guide, clubs guide PDF)
- [ ] Build Instagram presence to drive branded searches

### Phase 4: Technical Optimisation (Ongoing)
- [ ] Implement prerendering for JS-rendered content
- [ ] Minify CSS and JS
- [ ] Self-host Google Fonts
- [ ] Add PWA manifest for home-screen installation
- [ ] Implement push notifications for new events
