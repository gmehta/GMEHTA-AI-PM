# Gaurav AI PM Showcase — Project Memory

> Last updated: June 3, 2026
> Workspace: `/Users/mehtahome/Documents/Claude/Projects/Gaurav AI PM Showcase`
> GitHub repo: `https://github.com/gmehta/GMEHTA-AI-PM`
> Live URL: `https://gmehta.github.io/GMEHTA-AI-PM/`

---

## 1. Project Overview

A GitHub Pages portfolio site showcasing Gaurav Mehta's AI PM work. Built with plain HTML + CSS + JS (no build step, no framework).

**Flagship projects** (3): Migrate.ai, AgenticMOps, Personal OS — each with Live Demo + Product Brief.

**RevOps agent demos** (15): Ported from `/Users/mehtahome/Documents/Claude/Projects/RevForgeHD/demos/` into `projects/agents/` — Ad-Tech (6), SalesTech (5), MarTech (4). Re-sync via `scripts/port-revforge-demos.py`.

**Removed:** `projects/martech-audience-agent/` (build journal) — superseded by live Audience Agent demo under `projects/agents/martech/audience-agent/`.

---

## 2. File Structure

```
/ (root)
├── index.html              — main portfolio landing page
├── styles.css              — all portfolio CSS (CSS custom properties, responsive)
├── script.js               — sticky nav, mobile menu, scroll-reveal (Intersection Observer)
├── .nojekyll               — disables Jekyll processing on GitHub Pages
├── README.md               — project overview and GitHub Pages setup
├── memory.md               — this file
│
└── projects/
    ├── migrate-ai/
    │   ├── index.html              — Migrate.ai showcase hub (light theme)
    │   ├── dashboard.html          — Campaign Complexity Dashboard
    │   ├── segment_campaigns.html  — Segment-Sourced Campaigns view
    │   ├── program_routed.html     — Program-Routed Campaigns view
    │   ├── flow_map.html           — ELM5334 D3.js dependency flow map
    │   └── product-thinking.html  — Product Brief (light theme, Inter font)
    │
    ├── agentic-mops/
    │   ├── index.html              — React 19 + Vite production build (modified)
    │   ├── product-thinking.html  — Product Brief (dark QB-green theme, DM Sans)
    │   └── assets/
    │       ├── index-BR0mLFjY.js  — bundled React app (251KB)
    │       └── index-CEPDO7wF.css — Tailwind CSS (6.5KB)
    │
    ├── agents/
    │   ├── _shared/                — revforge-demo.css, demo-shell.css
    │   ├── ad-tech/                — 6 simulation demos
    │   ├── sales-tech/             — 5 simulation demos
    │   └── martech/                — 4 demos (2 live API → revforgehq.com)
    │
    └── personal-os/
        ├── index.html              — Gaurav-OS Workstream dashboard (dark purple, modified)
        └── product-thinking.html  — Product Brief (dark purple theme, DM Sans/Mono)
```

---

## 3. Source Projects

| Portfolio Project | Source Folder | Notes |
|---|---|---|
| **Migrate.ai** | `/Users/mehtahome/Downloads/migrateiq-app` | React 17 + TypeScript + AppFabric plugin; dashboards are vanilla HTML/JS with embedded JSON |
| **AgenticMOps** | `/Users/mehtahome/Downloads/AgenticMOps` | React 19 + Vite + TypeScript; production build at `ui/dist/`; Express backend on :3939 |
| **RevOps agent demos** | `/Users/mehtahome/Documents/Claude/Projects/RevForgeHD` | Source of truth for `projects/agents/*`; live API on Cloudflare Pages |
| **Personal OS** | `/Users/mehtahome/Downloads/Gaurav_Mehta_OS` | Vanilla HTML/CSS/JS SPA; Express + WebSocket backend on :3737; Neo4j + GenOS |

---

## 4. Design System (Main Portfolio)

- **Framework:** Plain HTML + CSS custom properties (no Tailwind, no framework)
- **Font:** Inter (Google Fonts)
- **Theme:** Light/clean — `#F9FAFB` background, white cards, `#4F6BFF` accent
- **Responsive:** `@media` queries in `styles.css`
- **Animations:** Intersection Observer scroll-reveal in `script.js`
- **Nav:** Sticky, changes opacity on scroll; hamburger menu for mobile

Key CSS custom properties:
```css
--color-accent: #4F6BFF;
--color-bg: #F9FAFB;
--color-surface: #FFFFFF;
--color-text: #111827;
--color-text-muted: #6B7280;
```

---

## 5. Per-Project Design Themes

| Project | Background | Accent | Font | Notes |
|---|---|---|---|---|
| **Migrate.ai showcase** | `#F9FAFB` (light) | `#4F6BFF` blue | Inter | Matches main portfolio theme |
| **AgenticMOps showcase** | `#0b0c0e` (dark) | `#2db757` QB-green | DM Sans | Original app theme preserved |
| **Personal OS showcase** | `#0d0e1a` (dark) | `#7c5cfc` purple | DM Sans + DM Mono | Original app theme preserved |
| **Migrate.ai Product Brief** | `#F9FAFB` | `#4F6BFF` | Inter | Light, matches showcase |
| **AgenticMOps Product Brief** | `#0b0c0e` | `#2db757` | DM Sans | Dark QB-green |
| **Personal OS Product Brief** | `#0d0e1a` | `#7c5cfc` | DM Sans + DM Mono | Dark purple |

---

## 6. Migrate.ai Showcase — Implementation Notes

**Strategy:** Pure static HTML pages with embedded JSON data (no backend).

**Data sources (from migrateiq-app):**
- `campaigns.json` → 40-record sample embedded in `dashboard.html`
- `segment_campaigns.json` → all 52 records embedded in `segment_campaigns.html`
- `program_routed_campaigns.json` → 20-record sample embedded in `program_routed.html`
- `elm5334_nodes.json` (125 nodes) + `elm5334_edges.json` (214 edges, keys `s`/`d` not `source`/`target`) → embedded in `flow_map.html`

**Flow map:** D3.js v7 from CDN. Force-directed graph + depth-layer layout. Color modes: Node Type, Product, Depth Layer, Loop/SCC, Role. Edge data fix: use `e.get('s','')` and `e.get('d','')` not `e.get('source','')` / `e.get('target','')`.

**Key UI features:** Filtering, sorting, detail panel, distribution bar charts. Sticky headers.

---

## 7. AgenticMOps Showcase — Implementation Notes

**Strategy:** Copy `ui/dist/` production build + inject a `fetch()` interceptor before the React bundle to mock all API endpoints.

**How demo mode works:**
- `window.fetch` is overridden before the React bundle loads
- Intercepted endpoints:
  - `GET /v1/status` → returns demo KG/GenOS status
  - `POST /v1/agent/invoke/stream` → streams pre-written Audience Agent markdown (word-by-word, 18ms/chunk)
  - `POST /v1/creative/run` → simulates Figma → HTML → Marketo SSE events
  - `POST /v1/ixp/run` → simulates IXP experiment creation SSE events
  - `POST /v1/e2e-qa/send-email` → simulates test email sends
- SSE streams use `ReadableStream` + `TextEncoder` with configurable delays
- All 5 tabs are functional in demo mode
- Input fields are pre-filled via React's native value setter + `Event('input', {bubbles:true})`

**Demo banner:** Green (#2db757) strip matching app theme, sits above `#root` div.

**Asset files:** `assets/index-BR0mLFjY.js` (251KB), `assets/index-CEPDO7wF.css` (6.5KB).

---

## 8. Personal OS Showcase — Implementation Notes

**Strategy:** Copy the original `index.html` (2,837 lines, all CSS + JS inline) and replace `connectWS()` with a static bootstrap function.

**How demo mode works:**
- `connectWS()` call is replaced with `(function bootStatic() {...})()` that:
  - Injects a demo banner as the first child of `<body>`
  - Disables action buttons (refresh, classify) with tooltip
  - Overrides `archiveMention`, `sendReply`, `approveDraft`, `rejectDraft` to show toast
  - Mocks `loadCalendarEvents()` with realistic Intuit meeting names
  - Calls `renderAll()`, `renderTop5()`, `renderAgentInbox()` directly with static data

**Embedded sample data (from JSON files):**
- `mentions.json` → 20 sample mentions (8 high / 7 medium / 5 low priority)
- `agent-drafts.json` → 5 pending drafts with routing rationale
- `top5.json` → all 7 Top 5 tasks (Segment Inventory Closure, Validation Strategy, etc.)

**Demo banner:** Purple (`rgba(124,92,252,.12)`) strip, injected at `body.firstChild`.

---

## 9. Product Brief Pages — Structure

Each Product Brief is a standalone HTML file styled as a PM artifact with:
1. Problem statement
2. Users & JTBD (Migrate.ai) / Product Vision (AgenticMOps/OS)
3. Product goals & success metrics (or design goals)
4. Key insight / architecture
5. Design decisions & tradeoffs
6. Results / roadmap / reflections

Linked from each project showcase page (breadcrumb nav) and from the main portfolio card ("Product Brief" link). Briefs link to each other in series (Migrate.ai → AgenticMOps → Personal OS).

---

## 10. GitHub Pages Setup

- Repo: `https://github.com/gmehta/GMEHTA-AI-PM`
- Branch: `main`
- Pages source: root `/`
- `.nojekyll` file present at root (bypasses Jekyll processing)
- All asset paths are relative (no absolute `/` prefixes in sub-pages)
- Google Fonts loaded from CDN in all pages

---

## 11. Gaurav's Profile & Portfolio Content

**Name:** Gaurav Mehta  
**Title:** Staff Product Manager, Go-To-Market Technology, Intuit  
**Location:** San Francisco Bay Area  
**Email:** gaurav.rs.mehta@gmail.com  
**GitHub:** https://github.com/gmehta  
**LinkedIn:** https://www.linkedin.com/in/gamehta/

**Hero subtitle:** "Staff Product Manager · AI, Platform & Experiences"  
**About section headline:** "AI-native builder, platform thinking at scale"  
**Positioning:** AI-native PM builder; first-principles thinking; builds without waiting for briefs/roadmap slots; ships working products (code + agents)

**Key stats:**
- 13+ years in Product
- $350M+ revenue built (Fanatics LightHouse + CRM platform)
- 10,000× campaign velocity gain (AgenticMOps)

**Skills groups:**
1. Product: Platform Strategy, System Design, Roadmapping, Vendor RFPs, Data Modeling, Stakeholder Mgmt
2. AI & Agentic: Multi-Agent Systems, Claude API, LangGraph, RAG Pipelines, Neo4j, MCP, LLM Evaluation, Python
3. Platform Stack: Adobe Experience Platform, Adobe Journey Optimizer, Marketo, Eloqua, Segment CDP, Salesforce, SalesTech, AdTech

---

## 12. Change Log

| Date | Change |
|---|---|
| Initial | Created index.html, styles.css, script.js, .nojekyll, README.md |
| Initial | Built all sections: nav, hero, about, projects (3 cards), contact, footer |
| Early | Updated email and LinkedIn URL |
| Early | Added resume-based content to hero, about, project cards |
| Early | Added San Francisco Bay Area location to hero |
| Phase 2 | Created `projects/migrate-ai/` with 5 HTML files (hub + 4 dashboards) |
| Phase 2 | Updated main index.html Migrate.ai card to "Live Demo" link |
| Phase 3 | Created `projects/personal-os/index.html` (static dashboard snapshot) |
| Phase 3 | Updated main index.html Personal OS card to "Live Demo" link |
| Phase 4 | Created `projects/agentic-mops/` (React build + fetch interceptor demo) |
| Phase 4 | Updated main index.html AgenticMOps card to "Live Demo" link |
| Phase 5 | Added Product Brief pages for all 3 projects |
| Phase 5 | Added "Product Brief" links to all 3 project cards |
| May 23 | Fixed LinkedIn URL to https://www.linkedin.com/in/gamehta/ |
| May 23 | Updated hero subtitle to "AI, Platform & Experiences" |
| May 23 | Updated about section: platform-centric framing (MarTech + SalesTech + AdTech) |
| May 23 | Renamed "MarTech Platforms" skill group to "Platform Stack"; added SalesTech, AdTech chips |
| May 23 | Added LinkedIn icon link to footer (was GitHub only) |
| Jun 3 | Removed `martech-audience-agent`; added `#agent-demos` (Ad-Tech → SalesTech → MarTech) with 15 RevForge demos |
| Jun 3 | Port script: `scripts/port-revforge-demos.py`; live API demos use `revforgehq.com` + CORS |

---

## 13. Known Issues / Future Work

- AgenticMOps pre-fill polling works but may miss fast-rendering tabs — could refine with MutationObserver
- Personal OS calendar panel shows mock Intuit meetings; real calendar integration requires macOS + local server
- Product Briefs are static; future version could add interactive timeline or embedded metrics
- Audience Agent / Collision require RevForge Cloudflare deploy with CORS for GitHub Pages origin
- Re-run `port-revforge-demos.py` after RevForgeHD demo updates
