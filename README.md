# Gaurav Mehta — AI PM Portfolio

Personal portfolio site showcasing three end-to-end AI products, hosted on GitHub Pages.

**Live site:** https://gmehta.github.io/GMEHTA-AI-PM/

---

## Projects

| Project | Description |
|---|---|
| **Migrate.ai** | AI-powered migration planning — codebase analysis, dependency mapping, step-by-step plans |
| **AgenticMOps** | Multi-agent ML pipeline monitoring & autonomous remediation |
| **Personal OS** | AI-native personal operating system for knowledge management |

---

## Tech

Plain HTML + CSS + JS — no build step, no framework, no dependencies beyond Google Fonts.

```
/
├── index.html        ← single-page portfolio
├── styles.css        ← all styling (CSS custom properties, responsive)
├── script.js         ← scroll animations, nav behavior, mobile menu
├── .nojekyll         ← prevents GitHub Pages Jekyll processing
└── README.md
```

---

## GitHub Pages Setup

1. Push this repo to `https://github.com/gmehta/GMEHTA-AI-PM`
2. Go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Set branch to `main` and folder to `/ (root)`
5. Save — the site will be live at `https://gmehta.github.io/GMEHTA-AI-PM/` within ~60 seconds

---

## Updating Project Links

Once each project repo is pushed, update the `href` on each "View Project" link in `index.html`:

```html
<!-- Migrate.ai card -->
<a href="https://github.com/gmehta/migrate-ai" ...>View Project</a>

<!-- AgenticMOps card -->
<a href="https://github.com/gmehta/agentic-mops" ...>View Project</a>

<!-- Personal OS card -->
<a href="https://github.com/gmehta/personal-os" ...>View Project</a>
```

Also update the email link in the contact section:
```html
<a href="mailto:your@email.com" ...>Email Me</a>
```

And the LinkedIn URL:
```html
<a href="https://linkedin.com/in/your-profile" ...>LinkedIn</a>
```
