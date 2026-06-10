# Mini-Studio — Prompt-to-App Builder Concept

A working prototype built by **Gaurav Mehta** for the *Engineering Product Manager, Cloud Control Studio* role at Cisco.

**Suggested URL:** `https://gmehta.github.io/GMEHTA-AI-PM/projects/cisco-studio/`

## What it shows

| JD requirement | Where in the demo |
|---|---|
| "How building feels": prompt → preview → refine → ship | Studio tab — 3 scripted journeys generate real, interactive apps (device dashboard, alert triage, room booker) with a glass-box build trace, working refinements, and a ship gate with scope review |
| Prompt-to-app / agentic app-generation | **Live Mode** (⚙️ + Anthropic key): Claude genuinely generates a working app from any prompt, renders it sandboxed, refines it conversationally |
| BYO coding agent, "two paths, one product" | BYO Coding Agent tab — the current app as spec / CLI workflow / MCP tools / AGENTS.md, same checks and ship gate as the visual path |
| Commercial model: free/paid, monetization | Commercial Model tab — packaging matrix with per-row reasoning, upgrade moments placed in the flow, interactive ARR calculator vs. commit |
| Outcomes measured | PM Brief — Weekly Shipped Apps north star, **your own session funnel instrumented live**, eval harness for generated apps, competitive POV (v0/Lovable/Replit, Copilot Studio, Retool) |

## Deploy

Copy this folder into the portfolio repo and push:

```bash
cp -r cisco-studio-demo <portfolio-repo>/projects/cisco-studio
cd <portfolio-repo> && git add -A && git commit -m "Mini-Studio concept demo" && git push
```

Three static files, no build step, no backend. Live Mode keys stay in browser memory only.

## Disclaimer

Independent concept demo for a job application. Not affiliated with or endorsed by Cisco. "Meridian Networks" / "Mini-Studio" and all data are fictional.
