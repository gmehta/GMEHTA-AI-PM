# Gaurav Mehta — AI PM Portfolio

Personal portfolio site showcasing flagship AI products and RevOps agent demos, hosted on GitHub Pages.

**Live site:** https://gmehta.github.io/GMEHTA-AI-PM/

---

## Flagship projects

| Project | Description |
|---|---|
| **Migrate.ai** | AI-powered migration planning — codebase analysis, dependency mapping, step-by-step plans |
| **AgenticMOps** | Multi-agent campaign operations — industry-first agentic MOps at Intuit |
| **Personal OS** | AI-native personal operating system for knowledge management |

Each flagship project includes a **Live Demo** and **Product Brief** under `projects/<name>/`.

---

## RevOps agent demos

Fifteen interactive agent walkthroughs ported from [RevForgeHQ](https://www.revforgehq.com/demos/) (source: `RevForgeHD` workspace). Hosted statically on GitHub Pages under `projects/agents/`:

| Domain | Path prefix | Agents |
|---|---|---|
| **Ad-Tech** | `projects/agents/ad-tech/` | Portfolio, Creative, Audience Expansion, Copy Matrix, Guardian, Narrative |
| **SalesTech** | `projects/agents/sales-tech/` | Account Research, Outbound Sequencing, Call-to-CRM, Deal Desk, Pipeline Health |
| **MarTech** | `projects/agents/martech/` | Audience Agent, Audience Collision, Trial-to-Paid, Expansion & Upsell |

**Live API demos** (Audience Agent, Audience Collision) call `https://www.revforgehq.com/api/*` with CORS enabled for `https://gmehta.github.io`. Re-sync demos from RevForgeHD when updating:

```bash
python3 scripts/port-revforge-demos.py
```

---

## Tech

Plain HTML + CSS + JS — no build step, no framework, no dependencies beyond Google Fonts.

```
/
├── index.html              ← portfolio + agent demo cards
├── styles.css
├── script.js
├── .nojekyll
├── scripts/port-revforge-demos.py
└── projects/
    ├── migrate-ai/
    ├── agentic-mops/
    ├── personal-os/
    └── agents/             ← RevForge demos (ad-tech, sales-tech, martech)
```

---

## GitHub Pages setup

1. Push this repo to `https://github.com/gmehta/GMEHTA-AI-PM`
2. Go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Set branch to `main` and folder to `/ (root)`
5. Save — the site will be live at `https://gmehta.github.io/GMEHTA-AI-PM/` within ~60 seconds

Local preview:

```bash
python3 -m http.server 8080
# open http://localhost:8080/GMEHTA-AI-PM/ if serving from parent, or http://localhost:8080 from repo root
```
