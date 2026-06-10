# Front Door — EmployeeWorks Web Surface Concept

A working prototype built by **Gaurav Mehta** for the *Principal Inbound Product Manager — AI Assistant (Employee Experience), Moveworks* role at ServiceNow.

**Live demo:** `https://gmehta.github.io/frontdoor-demo/` (after deploy — see below)

## What it shows

| Capability | Where | Real or simulated |
|---|---|---|
| Front-door home: universal ask bar + proactive cards from system signals | Home | Working UI, mock signals |
| Agentic assistant with glass-box trace: plan → tool calls → policy gates → human approval → grounded answer | Assistant | Scripted by default; **real agentic loop** in Live Mode |
| Hybrid enterprise search (BM25 + MiniLM-L6-v2 embeddings, in-browser via transformers.js) | Enterprise Search | **Real** — client-side ML, no server |
| Governed connector registry (typed tools, least-privilege scopes, 3-gate governance) | Integrations | Concept UI |
| Strategy: competitive POV (Glean / Microsoft / Google), north-star metrics, eval harness, rollout plan | PM Brief | Real PM thinking |

**Live Mode (optional):** click ⚙️ and paste an Anthropic API key. The assistant switches from scripted replays to a real tool-use loop — Claude plans, calls the same mock enterprise tools, and pauses at the same human-approval gates. Key stays in browser memory only.

## Deploy to GitHub Pages

```bash
# 1. create a new repo (e.g. frontdoor-demo) on github.com, then:
cd servicenow-frontdoor-demo
git init && git add -A && git commit -m "Front Door concept demo"
git branch -M main
git remote add origin https://github.com/gmehta/frontdoor-demo.git
git push -u origin main
# 2. Repo → Settings → Pages → Source: Deploy from branch → main / root → Save
# 3. Live in ~1 min at https://gmehta.github.io/frontdoor-demo/
```

No build step, no dependencies — three static files (`index.html`, `app.js`, `data.js`). The embedding model (~25 MB, cached after first load) streams from the Hugging Face CDN; search gracefully falls back to BM25 if blocked.

## Disclaimer

Independent concept demo for a job application. Not affiliated with or endorsed by ServiceNow/Moveworks. "Aurora Dynamics" and all data are fictional.
