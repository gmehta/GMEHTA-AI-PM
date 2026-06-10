/* ============================================================
   Mini-Studio — prompt-to-app builder concept prototype
   Mock data layer. "Meridian Networks" and all data are fictional.
   Built by Gaurav Mehta — independent concept demo, not Cisco IP.
   ============================================================ */

window.STUDIO = {

  /* --------- Mock platform APIs (injected into every generated app) --------- */
  platform: {
    devices: [
      { id: "SW-AUS-01", name: "Austin Branch Core Switch", site: "Austin", type: "switch", status: "healthy", uptimeDays: 212, cpu: 31, clients: 184 },
      { id: "AP-AUS-12", name: "Austin Floor-2 AP", site: "Austin", type: "access_point", status: "warning", uptimeDays: 14, cpu: 78, clients: 96 },
      { id: "RT-DEN-01", name: "Denver Edge Router", site: "Denver", type: "router", status: "healthy", uptimeDays: 365, cpu: 22, clients: 0 },
      { id: "SW-DEN-04", name: "Denver Lab Switch", site: "Denver", type: "switch", status: "critical", uptimeDays: 0, cpu: 0, clients: 0 },
      { id: "FW-NYC-01", name: "NYC Perimeter Firewall", site: "New York", type: "firewall", status: "healthy", uptimeDays: 120, cpu: 55, clients: 0 },
      { id: "AP-NYC-31", name: "NYC Lobby AP", site: "New York", type: "access_point", status: "healthy", uptimeDays: 89, cpu: 12, clients: 41 },
      { id: "SW-NYC-02", name: "NYC Distribution Switch", site: "New York", type: "switch", status: "warning", uptimeDays: 45, cpu: 84, clients: 312 },
      { id: "RT-AUS-02", name: "Austin Backup Router", site: "Austin", type: "router", status: "healthy", uptimeDays: 300, cpu: 8, clients: 0 }
    ],
    alerts: [
      { id: "AL-901", severity: "critical", device: "SW-DEN-04", summary: "Device unreachable for 22 minutes", ts: "09:14", acked: false },
      { id: "AL-902", severity: "high", device: "SW-NYC-02", summary: "CPU above 80% threshold for 1 hour", ts: "08:51", acked: false },
      { id: "AL-903", severity: "high", device: "AP-AUS-12", summary: "Client auth failures spiking (412 in 10 min)", ts: "08:32", acked: false },
      { id: "AL-904", severity: "medium", device: "FW-NYC-01", summary: "Firmware 2 versions behind", ts: "07:58", acked: true },
      { id: "AL-905", severity: "low", device: "AP-NYC-31", summary: "Channel utilization elevated", ts: "07:21", acked: false },
      { id: "AL-906", severity: "medium", device: "RT-DEN-01", summary: "Certificate expires in 14 days", ts: "06:40", acked: false }
    ],
    rooms: [
      { id: "RM-1", name: "Rio Grande", site: "Austin", seats: 8, video: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00"] },
      { id: "RM-2", name: "Barton Springs", site: "Austin", seats: 4, video: false, slots: ["9:00", "10:00", "13:00", "16:00"] },
      { id: "RM-3", name: "Five Points", site: "Denver", seats: 12, video: true, slots: ["10:00", "11:00", "14:00", "15:00"] },
      { id: "RM-4", name: "Hudson", site: "New York", seats: 6, video: true, slots: ["9:00", "11:00", "13:00", "15:00", "16:00"] }
    ],
    people: [
      { id: "U-1", name: "Sam Okafor", team: "NetOps" }, { id: "U-2", name: "Lena Fischer", team: "Security" },
      { id: "U-3", name: "Dev Patel", team: "Workplace" }, { id: "U-4", name: "Maria Cruz", team: "NetOps" }
    ]
  },

  /* --------- API docs shown to BYOK model + in the agent-path view --------- */
  apiDocs: `Available in every app as a global \`window.platform\` object (read-only mock of Meridian platform APIs):
- platform.devices: [{id, name, site, type(switch|router|access_point|firewall), status(healthy|warning|critical), uptimeDays, cpu, clients}]
- platform.alerts:  [{id, severity(critical|high|medium|low), device, summary, ts, acked}]
- platform.rooms:   [{id, name, site, seats, video, slots[]}]
- platform.people:  [{id, name, team}]`,

  /* --------- Gallery apps (scripted prompt-to-app) --------- */
  apps: [
    {
      id: "devhealth",
      chip: "Branch device health dashboard",
      prompt: "Build a device health dashboard for my branch offices. Show status at a glance, let me filter by site, and surface the unhealthy gear first.",
      refinements: [
        { id: "chart", label: "Add a per-site health chart", desc: "Refine: \"add a bar chart of unhealthy devices by site\"" },
        { id: "dense", label: "Make it compact for a wall display", desc: "Refine: \"denser layout, bigger status colors, for the NOC TV\"" }
      ],
      trace: [
        { step: "Understand", detail: "Intent: operational dashboard. Entities: devices, sites, health status. Read paths only — no write scopes needed." },
        { step: "Plan", detail: "Layout: KPI row (healthy/warning/critical counts) → site filter → device table sorted critical-first. Data: platform.devices. Refresh: on load." },
        { step: "Scaffold", detail: "Generated app shell, bound platform.devices, wrote sort/filter logic (status weight: critical > warning > healthy)." },
        { step: "Wire data", detail: "8 devices across 3 sites returned from the devices API mock. Status counts: 5 healthy, 2 warning, 1 critical." },
        { step: "Preview", detail: "App rendered in sandboxed preview. Passed generation checks: no runtime errors, no external network calls, read-only API usage." }
      ]
    },
    {
      id: "triage",
      chip: "Security alert triage app",
      prompt: "I need an alert triage app for the security team: alerts sorted by severity, one-click acknowledge, and a way to see only what's still open.",
      refinements: [
        { id: "assign", label: "Add owner assignment", desc: "Refine: \"let me assign each alert to a person on the team\"" },
        { id: "sla", label: "Show time-in-queue", desc: "Refine: \"flag anything older than an hour\"" }
      ],
      trace: [
        { step: "Understand", detail: "Intent: triage workflow. Entities: alerts, severity, ack state. One write-like action (acknowledge) — kept in-app state, flagged for a real ack scope at ship time." },
        { step: "Plan", detail: "Severity-ranked list, open/all toggle, ack buttons that update state. Data: platform.alerts." },
        { step: "Scaffold", detail: "Generated list component with severity color tokens and an in-memory ack store." },
        { step: "Wire data", detail: "6 alerts loaded: 1 critical, 2 high, 2 medium, 1 low. 1 pre-acknowledged." },
        { step: "Preview", detail: "Rendered. Generation checks passed. Note added to spec: production version needs alerts:write scope + audit log for acks." }
      ]
    },
    {
      id: "rooms",
      chip: "Meeting room booker",
      prompt: "Make a simple meeting room booker: show rooms by site with video capability, and let people grab an open slot.",
      refinements: [
        { id: "videoonly", label: "Filter to video rooms", desc: "Refine: \"add a toggle to only show rooms with video\"" },
        { id: "mybookings", label: "Add a my-bookings panel", desc: "Refine: \"show me what I've booked today\"" }
      ],
      trace: [
        { step: "Understand", detail: "Intent: self-service booking. Entities: rooms, slots, sites. Booking is an in-app state write — flagged calendar:write scope for ship." },
        { step: "Plan", detail: "Room cards grouped by site, slot chips that toggle to booked. Data: platform.rooms." },
        { step: "Scaffold", detail: "Generated card grid with slot-state management and booked-state styling." },
        { step: "Wire data", detail: "4 rooms across 3 sites, 19 open slots loaded from the rooms API mock." },
        { step: "Preview", detail: "Rendered. Generation checks passed. A11y check: slot buttons keyboard-reachable." }
      ]
    }
  ],

  /* --------- Commercial model content --------- */
  tiers: {
    philosophy: "The value metric is shipped apps, not seats or prompts. The free tier must contain the complete craft loop (describe → preview → refine → ship) — gating creativity kills the funnel that feeds paid. Monetize scale, governance, and production guarantees: the things that matter exactly when an app starts mattering.",
    rows: [
      { feature: "Prompt-to-app builder (full craft loop)", free: "✓", pro: "✓", ent: "✓", why: "Never gate the core loop. Time-to-first-shipped-app is the activation metric; friction here starves every downstream number." },
      { feature: "Shipped apps", free: "3 live", pro: "Unlimited", ent: "Unlimited", why: "The natural upgrade moment: the 4th app is proof the platform became a habit. Limit live apps, not attempts." },
      { feature: "Platform data connectors", free: "Read-only, 2", pro: "All, read/write", ent: "All + custom", why: "Write scopes are where apps become real workflows. Real workflows justify spend." },
      { feature: "Bring-your-own coding agent (API/CLI/MCP)", free: "✓ rate-limited", pro: "✓ full rate", ent: "✓ + service accounts", why: "Keep BYO-agent in free: it recruits the most influential builders. Charge for throughput, not entry." },
      { feature: "Sharing & distribution", free: "Team link", pro: "Org catalog", ent: "Org catalog + external", why: "Distribution is a paid feature because it is where value compounds beyond the builder." },
      { feature: "Governance: SSO, audit logs, scope policies, app review gates", free: "—", pro: "Basic audit", ent: "✓ full", why: "Governance is the enterprise unlock. IT buys Studio the day a free app becomes business-critical." },
      { feature: "Production SLAs & support", free: "Community", pro: "Standard", ent: "Priority + TAM", why: "Sell certainty to the apps that earned it." }
    ],
    upgradeMoments: [
      { at: "Ships 4th app", to: "Pro", note: "Habit formed. Email + in-product moment references the 3 live apps by name. Expected free→Pro trigger #1." },
      { at: "Needs a write scope (ack an alert, book a room for real)", to: "Pro", note: "The app wants to act, not just display. Upgrade framed as 'make it real'." },
      { at: "Shares app beyond their team", to: "Pro/Ent", note: "Distribution moment. The org catalog is where apps meet their audience." },
      { at: "IT discovers 50 shadow apps", to: "Enterprise", note: "Governance conversation. Studio's answer: don't ban them, govern them — scope policies + review gates + audit." },
      { at: "Partner wants to publish a template", to: "Ecosystem", note: "Rev-share on partner templates/connectors. Ecosystem health metric, not just revenue." }
    ]
  },

  /* --------- BYOK system prompt --------- */
  byokSystem: `You generate small, complete, single-file web apps for "Mini-Studio", a prompt-to-app builder demo. Rules:
- Return ONLY a complete HTML document (no markdown fences, no commentary). It renders inside a sandboxed iframe.
- A global read-only object window.platform is ALREADY defined before your code runs. Do not redefine it. API:
{API_DOCS}
- Style: modern, dark theme (#0d1b26 background, #00bceb accents, system font stack), clean cards, generous spacing. Must look genuinely polished.
- Interactivity in plain JS, state in memory. No external network calls, no external libraries, no localStorage.
- Keep it under 200 lines. Make filtering/sorting/actions actually work.
- If the user asks to refine an existing app, you will receive the current HTML; return the full updated HTML document.`
};
