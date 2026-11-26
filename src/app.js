/**
 * Bennett Student Hub — Core Application Script
 * Handles: Data loading, routing, search, filters, rendering, FAQ, forms, animations
 */

'use strict';

/* ===== Global State ===== */
const App = {
  data: {
    events: [],
    clubs: [],
    faqs: [],
    venues: [],
    config: {}
  },
  state: {
    currentPage: 'home',
    eventFilters: { query: '', category: 'all', status: 'all', sort: 'date-asc' },
    clubFilters: { query: '', category: 'all' },
    loaded: false
  }
};

/* ===== Data Loading ===== */
async function loadData() {
  try {
    const [events, clubs, faqs, venues, config] = await Promise.all([
      fetch('src/data/events.json').then(r => r.json()),
      fetch('src/data/clubs.json').then(r => r.json()),
      fetch('src/data/faqs.json').then(r => r.json()),
      fetch('src/data/venues.json').then(r => r.json()),
      fetch('src/data/siteConfig.json').then(r => r.json())
    ]);
    App.data = { events, clubs, faqs, venues, config };
    App.state.loaded = true;
    return true;
  } catch (err) {
    console.error('Data load error:', err);
    return false;
  }
}

/* ===== Router ===== */
function getPage() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) return { page: 'home' };
  if (parts[0] === 'events') {
    if (parts[1] === 'upcoming') return { page: 'events-upcoming' };
    if (parts[1] && parts[1] !== 'upcoming') return { page: 'event-detail', slug: parts[1] };
    return { page: 'events' };
  }
  if (parts[0] === 'technical-clubs') {
    if (parts[1]) return { page: 'club-detail', slug: parts[1] };
    return { page: 'clubs' };
  }
  if (parts[0] === 'workshops') return { page: 'workshops' };
  if (parts[0] === 'hackathons') return { page: 'hackathons' };
  if (parts[0] === 'campus-guide') return { page: 'campus-guide' };
  if (parts[0] === 'past-events') return { page: 'past-events' };
  if (parts[0] === 'faq') return { page: 'faq' };
  if (parts[0] === 'contact') return { page: 'contact' };
  return { page: '404' };
}

/* ===== Utility Functions ===== */
function formatDate(dateStr, options = {}) {
  if (!dateStr) return 'TBC';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  });
}

function formatDateShort(dateStr) {
  if (!dateStr) return { month: '?', day: '?' };
  const d = new Date(dateStr);
  if (isNaN(d)) return { month: '?', day: '?' };
  return {
    month: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    day: d.getDate()
  };
}

function isUpcoming(event) {
  if (!event.date) return false;
  return new Date(event.date) >= new Date(new Date().toDateString());
}

function getCategoryLabel(cat) {
  const labels = {
    technical: 'Technical',
    cultural: 'Cultural',
    workshop: 'Workshop',
    hackathon: 'Hackathon',
    sports: 'Sports',
    literary: 'Literary',
    entrepreneurship: 'Entrepreneurship'
  };
  return labels[cat] || cat;
}

function getStatusLabel(status) {
  const labels = { open: 'Registration Open', closed: 'Registration Closed', 'coming-soon': 'Coming Soon' };
  return labels[status] || status;
}

function getCategoryEmoji(cat) {
  const emojis = {
    technical: '💻', cultural: '🎭', workshop: '🛠️',
    hackathon: '⚡', sports: '🏆', literary: '📚',
    entrepreneurship: '🚀', ai: '🤖', robotics: '🤖',
    cybersecurity: '🔐', coding: '💻'
  };
  return emojis[cat] || '📌';
}

function getClubCategoryIcon(cat) {
  const icons = {
    technical: '💻', cultural: '🎭', sports: '🏆',
    literary: '📚', entrepreneurship: '🚀'
  };
  return icons[cat] || '🎓';
}

function getClubCategoryBg(cat) {
  const bgs = {
    technical: 'background: #dbeafe; color: #1d4ed8;',
    cultural: 'background: #fce7f3; color: #9d174d;',
    sports: 'background: #fed7aa; color: #9a3412;',
    literary: 'background: #fef9c3; color: #713f12;',
    entrepreneurship: 'background: #d1fae5; color: #065f46;'
  };
  return bgs[cat] || 'background: #f3f4f6; color: #374151;';
}

function getVenueIcon(type) {
  const icons = {
    auditorium: '🏛️', 'seminar-hall': '🪑', lab: '🔬',
    outdoor: '🌳', cafeteria: '☕', library: '📖',
    classroom: '🎓', court: '🏀', ground: '⛳'
  };
  return icons[type] || '📍';
}

function highlight(text, query) {
  if (!query || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function debounce(fn, wait = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/* ===== Component Renderers ===== */

function renderNavbar(activePage = '') {
  const pages = [
    { href: '/events/', label: 'Events' },
    { href: '/events/upcoming/', label: 'Upcoming' },
    { href: '/technical-clubs/', label: 'Clubs' },
    { href: '/workshops/', label: 'Workshops' },
    { href: '/hackathons/', label: 'Hackathons' },
    { href: '/campus-guide/', label: 'Campus Guide' },
    { href: '/faq/', label: 'FAQ' },
  ];

  const navLinks = pages.map(p =>
    `<li><a href="${p.href}" class="nav-link${activePage === p.label ? ' active' : ''}">${p.label}</a></li>`
  ).join('');

  const mobileLinks = pages.map(p =>
    `<a href="${p.href}" class="nav-link${activePage === p.label ? ' active' : ''}">${p.label}</a>`
  ).join('');

  return `
    <nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
      <div class="nav-inner">
        <a href="/" class="nav-logo" aria-label="Bennett Student Hub Home">
          <div class="nav-logo-icon" aria-hidden="true">BSH</div>
          <span class="nav-logo-text">Bennett <span>Student Hub</span></span>
        </a>
        <ul class="nav-links" role="list">${navLinks}</ul>
        <div class="nav-actions">
          <a href="/events/upcoming/" class="btn btn-primary btn-sm">Explore Events</a>
          <button class="nav-hamburger" id="navHamburger" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navMobile">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
    <div class="nav-mobile" id="navMobile" role="menu">
      ${mobileLinks}
      <a href="/contact/" class="btn btn-primary" style="margin-top: 8px;">Contact & Feedback</a>
    </div>
  `;
}

function renderFooter() {
  const config = App.data.config;
  return `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <a href="/" class="footer-logo">
              <div class="footer-logo-icon" aria-hidden="true">BSH</div>
              <span class="footer-logo-name">Bennett Student Hub</span>
            </a>
            <p class="footer-desc">Your one-stop resource for discovering campus events, workshops, hackathons, and student clubs at Bennett University, Greater Noida.</p>
            <p class="footer-disclaimer">⚠️ ${config.disclaimer || 'This is an independent student resource and is not officially affiliated with Bennett University.'}</p>
          </div>
          <div>
            <p class="footer-col-title">Discover</p>
            <ul class="footer-links">
              <li><a href="/events/">All Events</a></li>
              <li><a href="/events/upcoming/">Upcoming Events</a></li>
              <li><a href="/hackathons/">Hackathons</a></li>
              <li><a href="/workshops/">Workshops</a></li>
              <li><a href="/past-events/">Past Events</a></li>
            </ul>
          </div>
          <div>
            <p class="footer-col-title">Campus</p>
            <ul class="footer-links">
              <li><a href="/technical-clubs/">Technical Clubs</a></li>
              <li><a href="/campus-guide/">Campus Guide</a></li>
              <li><a href="/faq/">FAQ</a></li>
              <li><a href="/contact/">Contact & Feedback</a></li>
            </ul>
          </div>
          <div>
            <p class="footer-col-title">Sources</p>
            <ul class="footer-links">
              <li><a href="https://www.bennett.edu.in/bennett-life/life-at-campus/university-events/" target="_blank" rel="noopener noreferrer">BU Official Events ↗</a></li>
              <li><a href="https://www.bennett.edu.in/bennett-life/life-at-campus/club-and-societies/" target="_blank" rel="noopener noreferrer">BU Clubs & Societies ↗</a></li>
              <li><a href="https://unstop.com/hackathons" target="_blank" rel="noopener noreferrer">Unstop Hackathons ↗</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-bottom-text">© ${new Date().getFullYear()} Bennett Student Hub. An independent student resource. Not affiliated with Bennett University.</p>
          <p class="footer-bottom-text">Last updated: ${config.lastUpdated || 'Oct 2024'}</p>
        </div>
      </div>
    </footer>
  `;
}

function renderEventCard(event, query = '') {
  const dateInfo = formatDateShort(event.date);
  const title = highlight(event.title, query);
  const desc = highlight(event.description?.substring(0, 120) + '...', query);
  const statusClass = `badge-${event.registrationStatus === 'open' ? 'open' : event.registrationStatus === 'closed' ? 'closed' : 'soon'}`;
  const upcoming = isUpcoming(event);

  return `
    <article class="card event-card" data-event-id="${event.id}">
      <div class="event-card-header">
        <div class="event-date-block" aria-label="${formatDate(event.date)}">
          <span class="event-date-month">${dateInfo.month}</span>
          <span class="event-date-day">${dateInfo.day}</span>
        </div>
        <div class="event-card-meta">
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
            <span class="badge badge-${event.category}">${getCategoryLabel(event.category)}</span>
            <span class="badge ${statusClass}">${getStatusLabel(event.registrationStatus)}</span>
            ${event.cost === 'Free' || event.cost === '0' ? '<span class="badge badge-free">Free</span>' : ''}
          </div>
          <h3 class="event-card-title"><a href="/events/${event.id}/" style="color:inherit;text-decoration:none;">${title}</a></h3>
          <div class="event-card-info">
            ${event.venue ? `<span class="event-card-venue">📍 ${event.venue}</span>` : ''}
            ${event.time ? `<span class="event-card-time">🕐 ${event.time}${event.endTime ? ' – ' + event.endTime : ''}</span>` : ''}
          </div>
        </div>
      </div>
      <p class="event-card-desc">${desc}</p>
      <div class="card-footer">
        <span style="font-size:0.8125rem; color:var(--color-gray-400);">
          ${event.organizingClub ? '🏫 ' + getClubName(event.organizingClub) : ''}
        </span>
        <div style="display:flex; gap:8px;">
          <a href="/events/${event.id}/" class="btn btn-ghost btn-sm">Details</a>
          ${event.registrationStatus === 'open' && event.registrationUrl && event.registrationUrl !== '#'
            ? `<a href="${event.registrationUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" data-track-registration="true" data-event-id="${event.id}">Register ↗</a>`
            : upcoming && event.registrationStatus === 'coming-soon'
              ? `<span class="btn btn-secondary btn-sm" style="cursor:default; opacity:0.7;">Coming Soon</span>`
              : ''
          }
        </div>
      </div>
    </article>
  `;
}

function renderClubCard(club, query = '') {
  const name = highlight(club.name, query);
  const desc = highlight(club.description, query);

  return `
    <article class="card club-card card-body">
      <div class="club-icon" style="${getClubCategoryBg(club.category)}">
        ${getClubCategoryIcon(club.category)}
      </div>
      <span class="badge badge-${club.category === 'technical' ? 'technical' : club.category === 'cultural' ? 'cultural' : 'workshop'}" style="margin-bottom:10px; display:inline-flex;">
        ${getCategoryLabel(club.category)}
      </span>
      <h3 class="club-name"><a href="/technical-clubs/${club.id}/" style="color:inherit;text-decoration:none;">${name}</a></h3>
      <p class="club-tagline">${club.tagline}</p>
      <p class="club-desc">${desc}</p>
      <div style="margin-top:var(--space-4); padding-top:var(--space-3); border-top:1px solid var(--color-gray-100); display:flex; justify-content:flex-end; gap:8px;">
        ${club.socialLinks?.instagram ? `<a href="${club.socialLinks.instagram}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm">📸 Instagram</a>` : ''}
        <a href="/technical-clubs/${club.id}/" class="btn btn-outline btn-sm">Learn More</a>
      </div>
    </article>
  `;
}

function getClubName(clubId) {
  const club = App.data.clubs.find(c => c.id === clubId);
  return club ? club.name : clubId;
}

/* ===== Filter Functions ===== */
function filterEvents(events, filters) {
  let result = [...events];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(e =>
      e.title?.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.tags?.some(t => t.toLowerCase().includes(q)) ||
      e.venue?.toLowerCase().includes(q)
    );
  }

  if (filters.category && filters.category !== 'all') {
    result = result.filter(e => e.category === filters.category);
  }

  if (filters.status === 'upcoming') {
    result = result.filter(e => isUpcoming(e));
  } else if (filters.status === 'past') {
    result = result.filter(e => !isUpcoming(e));
  }

  if (filters.sort === 'date-asc') {
    result.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (filters.sort === 'date-desc') {
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return result;
}

function filterClubs(clubs, filters) {
  let result = [...clubs];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.tagline?.toLowerCase().includes(q) ||
      c.activities?.some(a => a.toLowerCase().includes(q))
    );
  }

  if (filters.category && filters.category !== 'all') {
    result = result.filter(c => c.category === filters.category);
  }

  return result;
}

/* ===== Page Renderers ===== */

function renderHome() {
  const { events, clubs, faqs, config } = App.data;
  const upcomingEvents = events.filter(isUpcoming).slice(0, 6);
  const featuredHackathons = events.filter(e => e.category === 'hackathon' && isUpcoming(e)).slice(0, 3);
  const featuredWorkshops = events.filter(e => e.category === 'workshop' && isUpcoming(e)).slice(0, 3);
  const featuredClubs = clubs.filter(c => c.category === 'technical').slice(0, 4);
  const pastEvents = events.filter(e => !isUpcoming(e)).slice(0, 4);
  const featuredFaqs = faqs.slice(0, 5);

  const totalEvents = events.length;
  const totalClubs = clubs.length;
  const totalUpcoming = events.filter(isUpcoming).length;

  return `
    <!-- Hero -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-badge" aria-label="Status">
        <span>📅</span>
        <span>${totalUpcoming} upcoming events this semester</span>
      </div>
      <h1 class="hero-title" id="hero-title">
        Discover What's Happening at<br>
        <span class="highlight">Bennett University</span>
      </h1>
      <p class="hero-subtitle">
        Your independent student resource for campus events, workshops, hackathons, and clubs — all in one place.
      </p>
      <div class="hero-search" role="search" aria-label="Search events">
        <div class="search-bar">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            id="heroSearch"
            placeholder="Search events, clubs, workshops, hackathons…"
            aria-label="Search for campus events and clubs"
            autocomplete="off"
          >
          <button class="btn btn-primary" onclick="heroSearchSubmit()" aria-label="Search">
            Search
          </button>
        </div>
      </div>
      <div class="hero-cta-group">
        <a href="/events/upcoming/" class="btn btn-primary btn-lg">
          📅 Upcoming Events
        </a>
        <a href="/technical-clubs/" class="btn btn-secondary btn-lg" style="background:rgba(255,255,255,0.12); border-color:rgba(255,255,255,0.25); color:white;">
          🏫 Explore Clubs
        </a>
      </div>
      <div class="hero-stat-strip" aria-label="Site statistics">
        <div class="hero-stat">
          <div class="hero-stat-number">${totalUpcoming}+</div>
          <div class="hero-stat-label">Upcoming Events</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-number">${totalClubs}+</div>
          <div class="hero-stat-label">Student Clubs</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-number">${events.filter(e => e.category === 'hackathon').length}+</div>
          <div class="hero-stat-label">Hackathons</div>
        </div>
        <div class="hero-stat">
          <div class="hero-stat-number">${events.filter(e => e.category === 'workshop').length}+</div>
          <div class="hero-stat-label">Workshops</div>
        </div>
      </div>
    </section>

    <!-- Disclaimer Banner -->
    <div class="container" style="padding-top: var(--space-8);">
      <div class="disclaimer-banner" role="note">
        <span class="disclaimer-banner-icon" aria-hidden="true">ℹ️</span>
        <span>${config.disclaimer || 'This is an independent student resource. Always verify event details with official university channels.'}</span>
      </div>
    </div>

    <!-- Upcoming Events -->
    <section class="section" aria-labelledby="upcoming-events-heading">
      <div class="container">
        <div class="section-header">
          <span class="section-eyebrow">What's on</span>
          <h2 class="section-title" id="upcoming-events-heading">Upcoming Events</h2>
          <p class="section-desc">Don't miss out — explore upcoming campus events, competitions, and gatherings.</p>
        </div>

        <!-- Quick Filters -->
        <div class="filter-chips" style="justify-content:center; margin-bottom:var(--space-8);" role="group" aria-label="Filter events by category">
          <button class="filter-chip active" onclick="homeFilterEvents(this, 'all')" aria-pressed="true">All</button>
          <button class="filter-chip" onclick="homeFilterEvents(this, 'technical')" aria-pressed="false">Technical</button>
          <button class="filter-chip" onclick="homeFilterEvents(this, 'hackathon')" aria-pressed="false">Hackathons</button>
          <button class="filter-chip" onclick="homeFilterEvents(this, 'workshop')" aria-pressed="false">Workshops</button>
          <button class="filter-chip" onclick="homeFilterEvents(this, 'cultural')" aria-pressed="false">Cultural</button>
        </div>

        <div class="events-grid" id="homeEventsGrid">
          ${upcomingEvents.length > 0
            ? upcomingEvents.map(e => renderEventCard(e)).join('')
            : '<div class="empty-state"><span class="empty-state-icon">📅</span><h3>No upcoming events</h3><p>Check back soon!</p></div>'
          }
        </div>
        <div class="text-center mt-8">
          <a href="/events/upcoming/" class="btn btn-outline btn-lg">View All Upcoming Events →</a>
        </div>
      </div>
    </section>

    <!-- Hackathons & Workshops -->
    <section class="section" style="background:var(--color-gray-100);" aria-labelledby="featured-heading">
      <div class="container">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:var(--space-12);">
          <!-- Hackathons -->
          <div>
            <span class="section-eyebrow">⚡ Competitive</span>
            <h2 class="section-title" style="font-size:1.75rem; margin-bottom:var(--space-2);">Hackathons</h2>
            <p style="color:var(--color-gray-500); margin-bottom:var(--space-6); font-size:0.9375rem;">Build, compete, and win — hackathons at Bennett and beyond.</p>
            <div style="display:flex; flex-direction:column; gap:var(--space-4);">
              ${featuredHackathons.length > 0
                ? featuredHackathons.map(e => renderCompactEventCard(e)).join('')
                : '<p style="color:var(--color-gray-400);">No upcoming hackathons right now. Check back soon!</p>'
              }
            </div>
            <a href="/hackathons/" class="btn btn-primary mt-6">Explore Hackathons →</a>
          </div>
          <!-- Workshops -->
          <div>
            <span class="section-eyebrow">🛠️ Learn & Build</span>
            <h2 class="section-title" style="font-size:1.75rem; margin-bottom:var(--space-2);">Workshops</h2>
            <p style="color:var(--color-gray-500); margin-bottom:var(--space-6); font-size:0.9375rem;">Hands-on skill-building sessions for every interest.</p>
            <div style="display:flex; flex-direction:column; gap:var(--space-4);">
              ${featuredWorkshops.length > 0
                ? featuredWorkshops.map(e => renderCompactEventCard(e)).join('')
                : '<p style="color:var(--color-gray-400);">No upcoming workshops right now. Check back soon!</p>'
              }
            </div>
            <a href="/workshops/" class="btn btn-primary mt-6">Explore Workshops →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Technical Clubs -->
    <section class="section" aria-labelledby="clubs-heading">
      <div class="container">
        <div class="section-header">
          <span class="section-eyebrow">Student Communities</span>
          <h2 class="section-title" id="clubs-heading">Technical Clubs</h2>
          <p class="section-desc">Join a club, build skills, collaborate on projects, and create lasting memories.</p>
        </div>
        <div class="clubs-grid">
          ${featuredClubs.map(c => renderClubCard(c)).join('')}
        </div>
        <div class="text-center mt-8">
          <a href="/technical-clubs/" class="btn btn-outline btn-lg">View All Clubs →</a>
        </div>
      </div>
    </section>

    <!-- Campus Guide Preview -->
    <section class="section" style="background:linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-60) 100%);" aria-labelledby="guide-heading">
      <div class="container">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:var(--space-12); align-items:center;">
          <div>
            <span class="section-eyebrow" style="color:#93c5fd;">Find Your Way</span>
            <h2 class="section-title" id="guide-heading" style="color:white; margin-bottom:var(--space-4);">Campus Guide</h2>
            <p style="color:rgba(255,255,255,0.7); margin-bottom:var(--space-6); font-size:1.0625rem; line-height:1.7;">
              New to campus? Not sure where the seminar hall is? Our campus guide covers venues, labs, auditoriums, and more — helping you find exactly where your events are happening.
            </p>
            <a href="/campus-guide/" class="btn btn-primary btn-lg">Open Campus Guide →</a>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4);">
            ${App.data.venues.slice(0, 4).map(v => `
              <div style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:var(--radius-xl); padding:var(--space-4);">
                <span style="font-size:1.75rem; display:block; margin-bottom:var(--space-2);">${getVenueIcon(v.type)}</span>
                <p style="color:white; font-weight:600; font-size:0.9375rem; margin-bottom:4px;">${v.name}</p>
                <p style="color:rgba(255,255,255,0.55); font-size:0.8125rem;">${v.type?.replace('-', ' ') || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Past Events Highlights -->
    <section class="section" aria-labelledby="past-heading">
      <div class="container">
        <div class="section-header">
          <span class="section-eyebrow">Look Back</span>
          <h2 class="section-title" id="past-heading">Past Event Highlights</h2>
          <p class="section-desc">See what students at Bennett have been building, learning, and celebrating.</p>
        </div>
        <div class="events-grid">
          ${pastEvents.map(e => renderEventCard(e)).join('')}
        </div>
        <div class="text-center mt-8">
          <a href="/past-events/" class="btn btn-outline btn-lg">View All Past Events →</a>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section" style="background:var(--color-gray-50);" aria-labelledby="faq-heading">
      <div class="container" style="max-width:800px;">
        <div class="section-header">
          <span class="section-eyebrow">Got Questions?</span>
          <h2 class="section-title" id="faq-heading">Frequently Asked Questions</h2>
        </div>
        <div class="faq-list" id="faqList">
          ${featuredFaqs.map(f => renderFaqItem(f)).join('')}
        </div>
        <div class="text-center mt-6">
          <a href="/faq/" class="btn btn-outline">See All FAQs →</a>
        </div>
      </div>
    </section>
  `;
}

function renderCompactEventCard(event) {
  const dateInfo = formatDateShort(event.date);
  return `
    <div style="display:flex; gap:var(--space-4); background:white; border:1px solid var(--color-gray-200); border-radius:var(--radius-lg); padding:var(--space-4); box-shadow:var(--shadow-xs); transition:transform 0.2s ease, box-shadow 0.2s ease;" onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-md)';" onmouseleave="this.style.transform=''; this.style.boxShadow='var(--shadow-xs)';">
      <div class="event-date-block" style="width:50px; height:54px; min-width:50px;">
        <span class="event-date-month" style="font-size:0.5625rem;">${dateInfo.month}</span>
        <span class="event-date-day" style="font-size:1.25rem;">${dateInfo.day}</span>
      </div>
      <div>
        <h4 style="font-size:0.9375rem; color:var(--color-navy); margin-bottom:4px;">
          <a href="/events/${event.id}/" style="color:inherit; text-decoration:none;">${event.title}</a>
        </h4>
        <p style="font-size:0.8125rem; color:var(--color-gray-500);">📍 ${event.venue || 'Bennett University'}</p>
        <div style="margin-top:6px; display:flex; gap:6px; align-items:center;">
          <span class="badge badge-${event.registrationStatus === 'open' ? 'open' : 'soon'}">${getStatusLabel(event.registrationStatus)}</span>
          ${event.cost === 'Free' ? '<span class="badge badge-free">Free</span>' : ''}
        </div>
      </div>
    </div>
  `;
}

function renderFaqItem(faq) {
  return `
    <div class="faq-item" id="faq-${faq.id}">
      <button class="faq-question" onclick="toggleFaq(this)" aria-expanded="false">
        <span>${faq.question}</span>
        <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="faq-answer" role="region">
        <div class="faq-answer-inner">${faq.answer}</div>
      </div>
    </div>
  `;
}

function renderEventsPage(filters = {}, title = 'All Events', subtitle = '') {
  const activeFilters = { ...App.state.eventFilters, ...filters };
  const filtered = filterEvents(App.data.events, activeFilters);

  return `
    <div class="page-header">
      <div class="page-header-content">
        <p class="page-header-eyebrow">Bennett Student Hub</p>
        <h1 class="page-header-title">${title}</h1>
        <p class="page-header-desc">${subtitle || 'Explore and discover campus events, competitions, workshops, and more.'}</p>
      </div>
    </div>
    <section class="section-sm">
      <div class="container">
        <div class="filter-bar" role="search" aria-label="Filter events">
          <div class="filter-search">
            <span class="search-icon" aria-hidden="true">🔍</span>
            <input type="search" id="eventSearch" placeholder="Search events…" value="${activeFilters.query || ''}" oninput="debounceEventSearch(this.value)" aria-label="Search events">
          </div>
          <div class="filter-chips" role="group" aria-label="Filter by category">
            ${['all','technical','cultural','workshop','hackathon','sports','literary'].map(c =>
              `<button class="filter-chip${activeFilters.category === c ? ' active' : ''}" onclick="setEventFilter('category', '${c}')" aria-pressed="${activeFilters.category === c}">${c === 'all' ? 'All Categories' : getCategoryLabel(c)}</button>`
            ).join('')}
          </div>
          <div class="filter-chips" role="group" aria-label="Filter by status">
            ${[['all','All Time'],['upcoming','Upcoming'],['past','Past']].map(([v,l]) =>
              `<button class="filter-chip${activeFilters.status === v ? ' active' : ''}" onclick="setEventFilter('status', '${v}')" aria-pressed="${activeFilters.status === v}">${l}</button>`
            ).join('')}
          </div>
          ${(activeFilters.query || activeFilters.category !== 'all' || activeFilters.status !== 'all')
            ? `<button class="btn btn-ghost btn-sm" onclick="clearEventFilters()" aria-label="Clear all filters">✕ Clear</button>`
            : ''
          }
        </div>

        <p style="font-size:0.875rem; color:var(--color-gray-500); margin-bottom:var(--space-6);">
          Showing <strong>${filtered.length}</strong> event${filtered.length !== 1 ? 's' : ''}
          ${activeFilters.query ? ` matching "<em>${activeFilters.query}</em>"` : ''}
        </p>

        <div class="events-grid" id="eventsGrid">
          ${filtered.length > 0
            ? filtered.map(e => renderEventCard(e, activeFilters.query)).join('')
            : `<div class="empty-state" style="grid-column:1/-1;">
                <span class="empty-state-icon">🔍</span>
                <h3>No events found</h3>
                <p>Try a different search term or adjust your filters.</p>
                <button class="btn btn-primary mt-4" onclick="clearEventFilters()">Clear Filters</button>
               </div>`
          }
        </div>
      </div>
    </section>
  `;
}

function renderClubsPage() {
  const filters = App.state.clubFilters;
  const filtered = filterClubs(App.data.clubs, filters);

  return `
    <div class="page-header">
      <div class="page-header-content">
        <p class="page-header-eyebrow">Bennett Student Hub</p>
        <h1 class="page-header-title">Technical & Student Clubs</h1>
        <p class="page-header-desc">Discover student clubs at Bennett University — from coding and robotics to cultural and entrepreneurship communities.</p>
      </div>
    </div>
    <section class="section-sm">
      <div class="container">
        <div class="filter-bar" role="search" aria-label="Filter clubs">
          <div class="filter-search">
            <span class="search-icon" aria-hidden="true">🔍</span>
            <input type="search" id="clubSearch" placeholder="Search clubs…" value="${filters.query || ''}" oninput="debounceClubSearch(this.value)" aria-label="Search clubs">
          </div>
          <div class="filter-chips" role="group" aria-label="Filter by category">
            ${['all','technical','cultural','sports','literary','entrepreneurship'].map(c =>
              `<button class="filter-chip${filters.category === c ? ' active' : ''}" onclick="setClubFilter('category', '${c}')" aria-pressed="${filters.category === c}">${c === 'all' ? 'All Categories' : getCategoryLabel(c)}</button>`
            ).join('')}
          </div>
          ${(filters.query || filters.category !== 'all')
            ? `<button class="btn btn-ghost btn-sm" onclick="clearClubFilters()">✕ Clear</button>`
            : ''
          }
        </div>

        <p style="font-size:0.875rem; color:var(--color-gray-500); margin-bottom:var(--space-6);">
          Showing <strong>${filtered.length}</strong> club${filtered.length !== 1 ? 's' : ''}
        </p>

        <div class="clubs-grid" id="clubsGrid">
          ${filtered.length > 0
            ? filtered.map(c => renderClubCard(c, filters.query)).join('')
            : `<div class="empty-state" style="grid-column:1/-1;">
                <span class="empty-state-icon">🔍</span>
                <h3>No clubs found</h3>
                <p>Try a different search or category.</p>
               </div>`
          }
        </div>
      </div>
    </section>
  `;
}

function renderEventDetail(slug) {
  const event = App.data.events.find(e => e.id === slug);
  if (!event) return render404();

  const club = event.organizingClub ? App.data.clubs.find(c => c.id === event.organizingClub) : null;
  const relatedEvents = App.data.events.filter(e =>
    e.id !== event.id &&
    (e.category === event.category || e.organizingClub === event.organizingClub) &&
    isUpcoming(e)
  ).slice(0, 3);

  document.title = `${event.title} — Bennett Student Hub`;

  return `
    <div class="page-header">
      <div class="page-header-content">
        <p class="page-header-eyebrow"><a href="/events/" style="color:#93c5fd;">Events</a> / ${getCategoryLabel(event.category)}</p>
        <h1 class="page-header-title" style="font-size:clamp(1.75rem, 4vw, 2.75rem);">${event.title}</h1>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:var(--space-4);">
          <span class="badge badge-${event.category}">${getCategoryLabel(event.category)}</span>
          <span class="badge badge-${event.registrationStatus === 'open' ? 'open' : event.registrationStatus === 'closed' ? 'closed' : 'soon'}">${getStatusLabel(event.registrationStatus)}</span>
          ${event.cost === 'Free' ? '<span class="badge badge-free">Free</span>' : ''}
          ${!event.verified ? '<span class="badge" style="background:#fef3c7;color:#92400e;">⚠️ Unverified</span>' : ''}
        </div>
      </div>
    </div>

    <section class="section-sm">
      <div class="container">
        <div class="event-detail-layout">
          <!-- Main content -->
          <div>
            ${!event.verified ? `
              <div class="disclaimer-banner mb-6" role="alert">
                <span class="disclaimer-banner-icon">⚠️</span>
                <span>Details for this event have not been independently verified. Please check the official source before attending or registering.</span>
              </div>` : ''
            }

            <div class="detail-box mb-6">
              <h2 style="font-size:1.125rem; margin-bottom:var(--space-4);">Event Details</h2>
              <div class="detail-row">
                <span class="detail-label">📅 Date</span>
                <span class="detail-value">${formatDate(event.date)}${event.endDate && event.endDate !== event.date ? ' — ' + formatDate(event.endDate) : ''}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🕐 Time</span>
                <span class="detail-value">${event.time || 'To be confirmed'}${event.endTime ? ' – ' + event.endTime : ''}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📍 Venue</span>
                <span class="detail-value">${event.venue || 'To be confirmed'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🏫 Organised by</span>
                <span class="detail-value">${club ? `<a href="/technical-clubs/${club.id}/">${club.name}</a>` : 'To be confirmed'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">👥 Eligibility</span>
                <span class="detail-value">${event.eligibility || 'To be confirmed'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">⏰ Reg. deadline</span>
                <span class="detail-value">${formatDate(event.registrationDeadline) || 'To be confirmed'}</span>
              </div>
              ${event.cost ? `
                <div class="detail-row">
                  <span class="detail-label">💰 Cost</span>
                  <span class="detail-value">${event.cost}</span>
                </div>` : ''
              }
              <div class="detail-row">
                <span class="detail-label">🔗 Source</span>
                <span class="detail-value">${event.sourceUrl && event.sourceUrl !== '#'
                  ? `<a href="${event.sourceUrl}" target="_blank" rel="noopener noreferrer">Official page ↗</a>`
                  : 'Not available'
                }</span>
              </div>
              <div class="detail-row" style="border-bottom:none;">
                <span class="detail-label">✅ Verified</span>
                <span class="detail-value">${event.lastVerified ? 'Last checked ' + formatDate(event.lastVerified) : 'Not verified'}</span>
              </div>
            </div>

            <div class="detail-box">
              <h2 style="font-size:1.125rem; margin-bottom:var(--space-4);">About This Event</h2>
              <p style="color:var(--color-gray-700); line-height:1.8;">${event.description}</p>

              ${event.tags?.length > 0 ? `
                <div style="margin-top:var(--space-4); display:flex; gap:8px; flex-wrap:wrap;">
                  ${event.tags.map(t => `<span class="badge" style="background:var(--color-gray-100);color:var(--color-gray-600);">#${t}</span>`).join('')}
                </div>` : ''
              }
            </div>

            ${relatedEvents.length > 0 ? `
              <div style="margin-top:var(--space-8);">
                <h2 style="font-size:1.25rem; color:var(--color-navy); margin-bottom:var(--space-4);">Related Events</h2>
                <div class="events-grid">
                  ${relatedEvents.map(e => renderEventCard(e)).join('')}
                </div>
              </div>` : ''
            }
          </div>

          <!-- Sidebar -->
          <div class="event-detail-sidebar">
            <div class="detail-box" style="border:2px solid var(--color-blue);">
              <h3 style="margin-bottom:var(--space-4);">Registration</h3>
              <div style="margin-bottom:var(--space-4);">
                <span class="badge badge-${event.registrationStatus === 'open' ? 'open' : event.registrationStatus === 'closed' ? 'closed' : 'soon'}" style="font-size:0.875rem; padding:0.35rem 0.75rem;">
                  ${getStatusLabel(event.registrationStatus)}
                </span>
              </div>

              ${event.registrationStatus === 'open' && event.registrationUrl && event.registrationUrl !== '#' ? `
                <a href="${event.registrationUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" style="width:100%; justify-content:center;" aria-label="Register for ${event.title}" data-track-registration="true" data-event-id="${event.id}">
                  Register Now ↗
                </a>
                <p style="font-size:0.8125rem; color:var(--color-gray-500); margin-top:var(--space-3); text-align:center;">
                  You'll be taken to the official registration page.
                </p>
              ` : event.registrationStatus === 'closed' ? `
                <p style="color:var(--color-error); font-size:0.9375rem;">Registration has closed for this event.</p>
              ` : event.registrationStatus === 'coming-soon' ? `
                <p style="color:var(--color-warning); font-size:0.9375rem;">Registration opening soon. Check back later!</p>
              ` : `
                <p style="color:var(--color-gray-500); font-size:0.9375rem;">Registration details not yet available.</p>
              `}

              ${event.registrationDeadline ? `
                <div style="margin-top:var(--space-4); padding-top:var(--space-4); border-top:1px solid var(--color-gray-100);">
                  <p style="font-size:0.8125rem; font-weight:600; color:var(--color-gray-500);">DEADLINE</p>
                  <p style="font-size:0.9375rem; color:var(--color-navy); font-weight:600;">${formatDate(event.registrationDeadline)}</p>
                </div>` : ''
              }
            </div>

            ${club ? `
              <div class="detail-box" style="margin-top:var(--space-4);">
                <h3 style="margin-bottom:var(--space-3);">Organising Club</h3>
                <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-3);">
                  <div style="width:44px; height:44px; border-radius:var(--radius-lg); display:flex; align-items:center; justify-content:center; font-size:1.25rem; ${getClubCategoryBg(club.category)}">
                    ${getClubCategoryIcon(club.category)}
                  </div>
                  <div>
                    <p style="font-weight:700; color:var(--color-navy);">${club.name}</p>
                    <p style="font-size:0.8125rem; color:var(--color-gray-500);">${getCategoryLabel(club.category)} club</p>
                  </div>
                </div>
                <p style="font-size:0.875rem; color:var(--color-gray-600); margin-bottom:var(--space-3);">${club.tagline}</p>
                <a href="/technical-clubs/${club.id}/" class="btn btn-outline btn-sm" style="width:100%; justify-content:center;">View Club Page →</a>
              </div>
            ` : ''}

            <div class="detail-box" style="margin-top:var(--space-4); background:var(--color-accent-light); border-color:#fcd34d;">
              <p style="font-size:0.8125rem; color:#78350f; line-height:1.6;">
                ℹ️ Information on this page is sourced from public announcements and student contributions. Always verify with official university channels before attending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderClubDetail(slug) {
  const club = App.data.clubs.find(c => c.id === slug);
  if (!club) return render404();

  const clubEvents = App.data.events.filter(e => e.organizingClub === club.id);
  const upcomingClubEvents = clubEvents.filter(isUpcoming);
  const pastClubEvents = clubEvents.filter(e => !isUpcoming(e));

  document.title = `${club.name} — Bennett Student Hub`;

  return `
    <div class="page-header">
      <div class="page-header-content">
        <p class="page-header-eyebrow"><a href="/technical-clubs/" style="color:#93c5fd;">Clubs</a> / ${getCategoryLabel(club.category)}</p>
        <div style="display:flex; align-items:center; gap:var(--space-4); flex-wrap:wrap; margin-top:var(--space-4);">
          <div style="width:64px; height:64px; border-radius:var(--radius-xl); display:flex; align-items:center; justify-content:center; font-size:2rem; background:rgba(255,255,255,0.15);">
            ${getClubCategoryIcon(club.category)}
          </div>
          <div>
            <h1 class="page-header-title" style="margin-bottom:8px;">${club.name}</h1>
            <span class="badge badge-${club.category === 'technical' ? 'technical' : club.category === 'cultural' ? 'cultural' : 'workshop'}">${getCategoryLabel(club.category)}</span>
            ${!club.verified ? '<span class="badge" style="background:#fef3c7;color:#92400e; margin-left:8px;">⚠️ Unverified info</span>' : ''}
          </div>
        </div>
      </div>
    </div>

    <section class="section-sm">
      <div class="container">
        <div style="display:grid; grid-template-columns:1fr 320px; gap:var(--space-8); align-items:start;">
          <div>
            <div class="detail-box mb-6">
              <h2 style="font-size:1.125rem; margin-bottom:var(--space-3);">About</h2>
              <p class="club-tagline" style="font-size:1.0625rem; color:var(--color-blue); margin-bottom:var(--space-4); font-weight:500;">${club.tagline}</p>
              <p style="color:var(--color-gray-700); line-height:1.8; font-size:0.9375rem;">${club.description}</p>
            </div>

            ${club.activities?.length > 0 ? `
              <div class="detail-box mb-6">
                <h2 style="font-size:1.125rem; margin-bottom:var(--space-4);">Activities & Focus Areas</h2>
                <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:var(--space-3);">
                  ${club.activities.map(a => `
                    <li style="display:flex; align-items:flex-start; gap:var(--space-3); font-size:0.9375rem; color:var(--color-gray-700);">
                      <span style="color:var(--color-blue); font-weight:700; flex-shrink:0;">→</span>
                      <span>${a}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            ${upcomingClubEvents.length > 0 ? `
              <div>
                <h2 style="font-size:1.25rem; color:var(--color-navy); margin-bottom:var(--space-4);">Upcoming Events</h2>
                <div class="events-grid">
                  ${upcomingClubEvents.map(e => renderEventCard(e)).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Sidebar -->
          <div style="position:sticky; top:calc(var(--nav-height) + var(--space-6));">
            <div class="detail-box">
              <h3 style="margin-bottom:var(--space-4);">Club Info</h3>
              <div class="detail-row">
                <span class="detail-label">📅 Meetings</span>
                <span class="detail-value">${club.meetingFrequency || 'To be confirmed'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📊 Type</span>
                <span class="detail-value">${getCategoryLabel(club.category)}</span>
              </div>
              ${club.contactEmail ? `
                <div class="detail-row">
                  <span class="detail-label">📧 Contact</span>
                  <span class="detail-value"><a href="mailto:${club.contactEmail}">${club.contactEmail}</a></span>
                </div>` : ''
              }
              <div class="detail-row" style="border-bottom:none;">
                <span class="detail-label">✅ Verified</span>
                <span class="detail-value">${club.lastVerified || 'Not verified'}</span>
              </div>

              ${club.socialLinks?.instagram || club.socialLinks?.linkedin || club.socialLinks?.website ? `
                <div style="margin-top:var(--space-4); padding-top:var(--space-4); border-top:1px solid var(--color-gray-100);">
                  <p style="font-size:0.8125rem; font-weight:600; color:var(--color-gray-500); margin-bottom:var(--space-3);">LINKS</p>
                  <div style="display:flex; flex-direction:column; gap:var(--space-2);">
                    ${club.socialLinks?.instagram ? `<a href="${club.socialLinks.instagram}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">📸 Instagram</a>` : ''}
                    ${club.socialLinks?.linkedin ? `<a href="${club.socialLinks.linkedin}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">💼 LinkedIn</a>` : ''}
                    ${club.socialLinks?.website ? `<a href="${club.socialLinks.website}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">🌐 Website</a>` : ''}
                  </div>
                </div>
              ` : ''}
            </div>

            ${club.sourceUrl ? `
              <div class="detail-box" style="margin-top:var(--space-4);">
                <p style="font-size:0.8125rem; color:var(--color-gray-500); margin-bottom:var(--space-2);">Official Source</p>
                <a href="${club.sourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="width:100%; justify-content:center;">View Official Page ↗</a>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderCampusGuide() {
  const venues = App.data.venues;
  const grouped = {};
  venues.forEach(v => {
    const t = v.type || 'other';
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push(v);
  });

  return `
    <div class="page-header">
      <div class="page-header-content">
        <p class="page-header-eyebrow">Bennett Student Hub</p>
        <h1 class="page-header-title">Campus Guide</h1>
        <p class="page-header-desc">Find venues, labs, seminar halls, auditoriums, and event spaces at Bennett University, Greater Noida.</p>
      </div>
    </div>
    <section class="section-sm">
      <div class="container">
        <div class="disclaimer-banner mb-8" role="note">
          <span class="disclaimer-banner-icon">ℹ️</span>
          <span>Venue information is sourced from publicly available university materials and student contributions. For precise directions and room assignments, always confirm with event organisers or the university.</span>
        </div>

        ${Object.entries(grouped).map(([type, vens]) => `
          <div style="margin-bottom:var(--space-10);">
            <h2 style="font-size:1.25rem; color:var(--color-navy); margin-bottom:var(--space-4); display:flex; align-items:center; gap:var(--space-2);">
              <span>${getVenueIcon(type)}</span>
              <span>${type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}s</span>
            </h2>
            <div class="clubs-grid">
              ${vens.map(v => `
                <div class="venue-card">
                  <span class="venue-icon">${getVenueIcon(v.type)}</span>
                  <h3 style="font-size:1.0625rem; color:var(--color-navy); margin-bottom:var(--space-2);">${v.name}</h3>
                  <p style="font-size:0.8125rem; color:var(--color-blue); font-weight:500; margin-bottom:var(--space-3);">Capacity: ${v.capacity || 'N/A'} • ${v.location || ''}</p>
                  <p style="font-size:0.875rem; color:var(--color-gray-600); line-height:1.6;">${v.description}</p>
                  ${!v.verified ? '<p style="font-size:0.8rem; color:#92400e; margin-top:8px;">⚠️ Details unverified</p>' : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderFaqPage() {
  const faqs = App.data.faqs;
  const categories = [...new Set(faqs.map(f => f.category))];

  return `
    <div class="page-header">
      <div class="page-header-content">
        <p class="page-header-eyebrow">Bennett Student Hub</p>
        <h1 class="page-header-title">Frequently Asked Questions</h1>
        <p class="page-header-desc">Everything you need to know about discovering events, joining clubs, and using Bennett Student Hub.</p>
      </div>
    </div>
    <section class="section-sm">
      <div class="container" style="max-width:800px;">
        ${categories.map(cat => `
          <div style="margin-bottom:var(--space-10);">
            <h2 style="font-size:1.125rem; color:var(--color-blue); text-transform:uppercase; letter-spacing:0.08em; font-size:0.8125rem; margin-bottom:var(--space-4);">${cat.toUpperCase()}</h2>
            <div class="faq-list">
              ${faqs.filter(f => f.category === cat).map(f => renderFaqItem(f)).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderContactPage() {
  return `
    <div class="page-header">
      <div class="page-header-content">
        <p class="page-header-eyebrow">Bennett Student Hub</p>
        <h1 class="page-header-title">Contact & Feedback</h1>
        <p class="page-header-desc">Found an error? Want to add an event? Have a suggestion? We'd love to hear from you.</p>
      </div>
    </div>
    <section class="section-sm">
      <div class="container">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-12); align-items:start; max-width:1000px; margin:0 auto;">
          <div>
            <h2 style="font-size:1.375rem; margin-bottom:var(--space-4);">Get in Touch</h2>
            <p style="color:var(--color-gray-600); line-height:1.7; margin-bottom:var(--space-6);">
              Bennett Student Hub is maintained by students for students. If you notice incorrect information, want to submit an event, or have suggestions for improving the site, please use the form.
            </p>
            <div style="display:flex; flex-direction:column; gap:var(--space-5);">
              <div style="display:flex; gap:var(--space-4); align-items:flex-start;">
                <span style="font-size:1.5rem; flex-shrink:0;">📧</span>
                <div>
                  <p style="font-weight:600; color:var(--color-navy); margin-bottom:4px;">Email</p>
                  <a href="mailto:${App.data.config.contactEmail || 'hello@bennettshub.in'}" style="color:var(--color-blue); font-size:0.9375rem;">${App.data.config.contactEmail || 'hello@bennettshub.in'}</a>
                </div>
              </div>
              <div style="display:flex; gap:var(--space-4); align-items:flex-start;">
                <span style="font-size:1.5rem; flex-shrink:0;">📍</span>
                <div>
                  <p style="font-weight:600; color:var(--color-navy); margin-bottom:4px;">University</p>
                  <p style="color:var(--color-gray-600); font-size:0.9375rem;">Bennett University, Plot No 8–11, TechZone II, Greater Noida, Uttar Pradesh 201310</p>
                </div>
              </div>
              <div style="display:flex; gap:var(--space-4); align-items:flex-start;">
                <span style="font-size:1.5rem; flex-shrink:0;">⏱️</span>
                <div>
                  <p style="font-weight:600; color:var(--color-navy); margin-bottom:4px;">Response Time</p>
                  <p style="color:var(--color-gray-600); font-size:0.9375rem;">We aim to respond within 2–3 business days. This is a student-run resource — please bear with us!</p>
                </div>
              </div>
            </div>

            <div class="disclaimer-banner mt-8" role="note">
              <span class="disclaimer-banner-icon">ℹ️</span>
              <span style="font-size:0.8125rem;">${App.data.config.disclaimer}</span>
            </div>
          </div>

          <!-- Contact Form -->
          <div>
            <form class="contact-form" id="contactForm" novalidate onsubmit="handleContactSubmit(event)" aria-labelledby="form-heading">
              <h2 style="font-size:1.25rem; margin-bottom:var(--space-6);" id="form-heading">Send a Message</h2>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4);">
                <div class="form-group">
                  <label class="form-label" for="contactName">Your name <span class="required" aria-hidden="true">*</span></label>
                  <input class="form-input" id="contactName" name="name" type="text" placeholder="Ananya Sharma" required autocomplete="name">
                  <p class="form-error-msg" id="nameError" role="alert" aria-live="polite"></p>
                </div>
                <div class="form-group">
                  <label class="form-label" for="contactEmail">Email address <span class="required" aria-hidden="true">*</span></label>
                  <input class="form-input" id="contactEmail" name="email" type="email" placeholder="you@bennett.edu.in" required autocomplete="email">
                  <p class="form-error-msg" id="emailError" role="alert" aria-live="polite"></p>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="contactSubject">Subject <span class="required" aria-hidden="true">*</span></label>
                <select class="form-select" id="contactSubject" name="subject" required>
                  <option value="">Select a topic…</option>
                  <option value="event-correction">Correct event information</option>
                  <option value="event-submission">Submit a new event</option>
                  <option value="club-info">Club information update</option>
                  <option value="suggestion">Site suggestion or feedback</option>
                  <option value="other">Other</option>
                </select>
                <p class="form-error-msg" id="subjectError" role="alert" aria-live="polite"></p>
              </div>

              <div class="form-group">
                <label class="form-label" for="contactMessage">Message <span class="required" aria-hidden="true">*</span></label>
                <textarea class="form-textarea" id="contactMessage" name="message" placeholder="Please describe your message in detail. If reporting an error, include the event name and what's incorrect." required minlength="20"></textarea>
                <p class="form-error-msg" id="messageError" role="alert" aria-live="polite"></p>
              </div>

              <div style="background:var(--color-gray-50); border:1px solid var(--color-gray-200); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-5);">
                <p style="font-size:0.8125rem; color:var(--color-gray-500); line-height:1.6;">
                  🔒 <strong>Demo note:</strong> This form is a UI demonstration. In a production deployment, it would be connected to a backend service or email API. Your message will not be sent. For urgent matters, please email us directly.
                </p>
              </div>

              <button type="submit" class="btn btn-primary btn-lg" style="width:100%; justify-content:center;">
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderPastEventsPage() {
  App.state.eventFilters = { ...App.state.eventFilters, status: 'past' };
  return renderEventsPage({ status: 'past' }, 'Past Events', 'Browse historical events, competitions, and workshops that took place at Bennett University.');
}

function renderWorkshopsPage() {
  return renderEventsPage({ category: 'workshop', status: 'all' }, 'Workshops', 'Hands-on learning sessions, skill workshops, and technical tutorials at Bennett University.');
}

function renderHackathonsPage() {
  return renderEventsPage({ category: 'hackathon', status: 'all' }, 'Hackathons', 'Competitive hackathons, coding competitions, and innovation challenges at Bennett University.');
}

function render404() {
  return `
    <div style="min-height:60vh; display:flex; align-items:center; justify-content:center; text-align:center; padding:var(--space-16);">
      <div>
        <div style="font-size:5rem; margin-bottom:var(--space-4);">🔍</div>
        <h1 style="font-size:1.75rem; color:var(--color-navy); margin-bottom:var(--space-4);">Page Not Found</h1>
        <p style="color:var(--color-gray-500); margin-bottom:var(--space-8);">The page you're looking for doesn't exist or may have moved.</p>
        <div style="display:flex; gap:var(--space-4); justify-content:center; flex-wrap:wrap;">
          <a href="/" class="btn btn-primary">Go Home</a>
          <a href="/events/" class="btn btn-secondary">Browse Events</a>
        </div>
      </div>
    </div>
  `;
}

/* ===== GA4 Registration Click Tracking ===== */
function setupRegistrationTracking() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-track-registration="true"]');
    if (!link) return;

    if (typeof window.gtag !== 'function') {
      console.warn('GA4 is not available. Registration click was not tracked.');
      return;
    }

    window.gtag('event', 'event_register_click', {
      event_id: link.dataset.eventId || 'unknown',
      registration_url: link.href,
      page_location: window.location.href
    });

    console.log('GA4 event sent: event_register_click');
  });
}
/* ===== Interactive Handlers ===== */

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all others
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

function heroSearchSubmit() {
  const val = document.getElementById('heroSearch')?.value?.trim();
  if (val) {
    window.location.href = `/events/?q=${encodeURIComponent(val)}`;
  } else {
    window.location.href = '/events/';
  }
}

function homeFilterEvents(btn, category) {
  const grid = document.getElementById('homeEventsGrid');
  if (!grid) return;

  document.querySelectorAll('.filter-chips .filter-chip').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');

  const filtered = filterEvents(App.data.events.filter(isUpcoming), { category, query: '', status: 'upcoming', sort: 'date-asc' });
  grid.innerHTML = filtered.length > 0
    ? filtered.slice(0, 6).map(e => renderEventCard(e)).join('')
    : '<div class="empty-state" style="grid-column:1/-1;"><span class="empty-state-icon">📅</span><h3>No events in this category</h3></div>';
}

function setEventFilter(key, value) {
  App.state.eventFilters[key] = value;
  reRenderEventsGrid();
}

function setClubFilter(key, value) {
  App.state.clubFilters[key] = value;
  reRenderClubsGrid();
}

function clearEventFilters() {
  App.state.eventFilters = { query: '', category: 'all', status: 'all', sort: 'date-asc' };
  const input = document.getElementById('eventSearch');
  if (input) input.value = '';
  navigateTo(window.location.pathname);
}

function clearClubFilters() {
  App.state.clubFilters = { query: '', category: 'all' };
  const input = document.getElementById('clubSearch');
  if (input) input.value = '';
  reRenderClubsGrid();
}

function reRenderEventsGrid() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  const filtered = filterEvents(App.data.events, App.state.eventFilters);
  grid.innerHTML = filtered.length > 0
    ? filtered.map(e => renderEventCard(e, App.state.eventFilters.query)).join('')
    : `<div class="empty-state" style="grid-column:1/-1;">
        <span class="empty-state-icon">🔍</span>
        <h3>No events found</h3>
        <p>Try different search terms or clear your filters.</p>
        <button class="btn btn-primary mt-4" onclick="clearEventFilters()">Clear Filters</button>
       </div>`;

  // Update count
  const countEl = document.querySelector('[data-count="events"]');
  if (countEl) countEl.textContent = filtered.length;

  // Update filter chip states
  document.querySelectorAll('[onclick*="setEventFilter"]').forEach(btn => {
    const match = btn.getAttribute('onclick').match(/'([^']+)'/g);
    if (match?.length === 2) {
      const key = match[0].replace(/'/g, '');
      const val = match[1].replace(/'/g, '');
      const isActive = App.state.eventFilters[key] === val;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    }
  });
}

function reRenderClubsGrid() {
  const grid = document.getElementById('clubsGrid');
  if (!grid) return;
  const filtered = filterClubs(App.data.clubs, App.state.clubFilters);
  grid.innerHTML = filtered.length > 0
    ? filtered.map(c => renderClubCard(c, App.state.clubFilters.query)).join('')
    : `<div class="empty-state" style="grid-column:1/-1;">
        <span class="empty-state-icon">🔍</span>
        <h3>No clubs found</h3>
        <p>Try a different search or category.</p>
       </div>`;
}

const debounceEventSearch = debounce((q) => {
  App.state.eventFilters.query = q;
  reRenderEventsGrid();
});

const debounceClubSearch = debounce((q) => {
  App.state.clubFilters.query = q;
  reRenderClubsGrid();
});

/* ===== Contact Form Validation ===== */
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  let valid = true;

  const name = form.querySelector('#contactName');
  const email = form.querySelector('#contactEmail');
  const subject = form.querySelector('#contactSubject');
  const message = form.querySelector('#contactMessage');

  [name, email, subject, message].forEach(el => {
    el.classList.remove('error');
    const err = document.getElementById(el.id + 'Error') || document.getElementById(el.id.replace('contact', '').toLowerCase() + 'Error');
    if (err) err.textContent = '';
  });

  if (!name.value.trim()) {
    name.classList.add('error');
    document.getElementById('nameError').textContent = 'Please enter your name.';
    valid = false;
  }

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRx.test(email.value)) {
    email.classList.add('error');
    document.getElementById('emailError').textContent = 'Please enter a valid email address.';
    valid = false;
  }

  if (!subject.value) {
    document.getElementById('subjectError').textContent = 'Please select a topic.';
    valid = false;
  }

  if (!message.value.trim() || message.value.trim().length < 20) {
    message.classList.add('error');
    document.getElementById('messageError').textContent = 'Please enter a message (at least 20 characters).';
    valid = false;
  }

  if (!valid) return;

  // Demo success state
  const formEl = document.getElementById('contactForm');
  formEl.innerHTML = `
    <div class="form-success">
      <span class="form-success-icon">✅</span>
      <h3 style="color:var(--color-navy); margin-bottom:var(--space-3);">Message Received!</h3>
      <p style="color:var(--color-gray-600); line-height:1.7;">
        Thank you for reaching out. In a live deployment, your message would be sent to our team. We aim to respond within 2–3 business days.
      </p>
      <p style="color:var(--color-gray-400); font-size:0.8125rem; margin-top:var(--space-4);">Demo mode — no actual email was sent.</p>
      <a href="/" class="btn btn-primary mt-6">Back to Home</a>
    </div>
  `;
}

/* ===== Navigation ===== */
function setupNavbar() {
  // Scroll effect
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('navMobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ===== Scroll-triggered Animations ===== */
function setupRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ===== SPA Navigation ===== */
function navigateTo(path) {
  window.history.pushState({}, '', path);
  renderPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle URL query params for search
function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) App.state.eventFilters.query = params.get('q');
  if (params.get('category')) App.state.eventFilters.category = params.get('category');
}

/* ===== Main Render ===== */
function renderPage() {
  const route = getPage();
  const mainEl = document.getElementById('main');
  if (!mainEl) return;

  readUrlParams();

  // Reset filters unless we're on an events page
  if (!['events', 'events-upcoming', 'workshops', 'hackathons', 'past-events'].includes(route.page)) {
    App.state.eventFilters = { query: '', category: 'all', status: 'all', sort: 'date-asc' };
  }
  if (route.page !== 'clubs') {
    App.state.clubFilters = { query: '', category: 'all' };
  }

  let content = '';
  let pageTitle = 'Bennett Student Hub';

  switch (route.page) {
    case 'home':
      content = renderHome();
      break;
    case 'events':
      content = renderEventsPage({}, 'All Events', 'Browse all campus events — technical, cultural, workshops, hackathons, and more.');
      pageTitle = 'All Events — Bennett Student Hub';
      break;
    case 'events-upcoming':
      content = renderEventsPage({ status: 'upcoming' }, 'Upcoming Events', 'Discover what\'s coming up at Bennett University — events, workshops, hackathons, and activities.');
      pageTitle = 'Upcoming Events — Bennett Student Hub';
      break;
    case 'event-detail':
      content = renderEventDetail(route.slug);
      break;
    case 'clubs':
      content = renderClubsPage();
      pageTitle = 'Student Clubs — Bennett Student Hub';
      break;
    case 'club-detail':
      content = renderClubDetail(route.slug);
      break;
    case 'workshops':
      content = renderWorkshopsPage();
      pageTitle = 'Workshops — Bennett Student Hub';
      break;
    case 'hackathons':
      content = renderHackathonsPage();
      pageTitle = 'Hackathons — Bennett Student Hub';
      break;
    case 'campus-guide':
      content = renderCampusGuide();
      pageTitle = 'Campus Guide — Bennett Student Hub';
      break;
    case 'past-events':
      content = renderPastEventsPage();
      pageTitle = 'Past Events — Bennett Student Hub';
      break;
    case 'faq':
      content = renderFaqPage();
      pageTitle = 'FAQ — Bennett Student Hub';
      break;
    case 'contact':
      content = renderContactPage();
      pageTitle = 'Contact & Feedback — Bennett Student Hub';
      break;
    default:
      content = render404();
      pageTitle = 'Page Not Found — Bennett Student Hub';
  }

  document.title = pageTitle;
  mainEl.innerHTML = content;

  // Post-render setup
  setupRevealAnimations();

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const isActive = window.location.pathname === href ||
      (href !== '/' && window.location.pathname.startsWith(href));
    link.classList.toggle('active', isActive);
  });
}

/* ===== Init ===== */
async function init() {
  // Render shell immediately
  const app = document.getElementById('app');
  if (!app) return;

  // Show loading
  app.innerHTML = `
    <div id="nav-container"></div>
    <main id="main" role="main" aria-live="polite">
      <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:16px;">
        <div style="width:40px; height:40px; border:3px solid var(--color-gray-200); border-top-color:var(--color-blue); border-radius:50%; animation:spin 0.8s linear infinite;"></div>
        <p style="color:var(--color-gray-500); font-size:0.9375rem;">Loading Bennett Student Hub…</p>
      </div>
    </main>
    <div id="footer-container"></div>
    <div class="toast-container" id="toastContainer" aria-live="assertive" aria-atomic="true"></div>
  `;

  // Add spin keyframe
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);

  // Load data
  const ok = await loadData();
  if (!ok) {
    document.getElementById('main').innerHTML = `
      <div class="empty-state" style="min-height:60vh; display:flex; align-items:center; justify-content:center; flex-direction:column;">
        <span class="empty-state-icon">⚠️</span>
        <h3>Unable to load data</h3>
        <p>Please check your connection or try refreshing the page.</p>
        <button class="btn btn-primary mt-4" onclick="location.reload()">Retry</button>
      </div>
    `;
    return;
  }

  // Render nav & footer
  document.getElementById('nav-container').innerHTML = renderNavbar();
  document.getElementById('footer-container').innerHTML = renderFooter();

  // Render page
  renderPage();
  setupNavbar();
  setupRegistrationTracking();

  // Handle browser back/forward
  window.addEventListener('popstate', renderPage);

  // Intercept internal link clicks for SPA routing
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#') || href.includes('://')) return;
    e.preventDefault();
    navigateTo(href);
  });
}

// Handle hero search enter key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement?.id === 'heroSearch') {
    heroSearchSubmit();
  }
});

// Boot
document.addEventListener('DOMContentLoaded', init);
