/* ============================================================
   Front Door — EmployeeWorks Web Surface concept prototype
   Mock data layer. All companies, people, and documents are fictional.
   Built by Gaurav Mehta — concept demo, not affiliated with ServiceNow.
   ============================================================ */

window.DATA = {

  persona: {
    name: "Andrew Mairena",
    initials: "AM",
    title: "Principal Inbound Product Manager — AI Assistant",
    dept: "Employee Experience · Moveworks at ServiceNow",
    company: "Aurora Dynamics",
    manager: "Elena Voss",
    location: "Santa Clara, CA",
    employeeId: "AD-48291",
    ptoBalanceDays: 14,
    benefits: { plan401kMatch: "100% of the first 4% + 50% of the next 2%", hsaEmployer: 750 },
    devices: [{ id: "LT-9931", model: "MacBook Pro 14 (M3, 16GB)", ageMonths: 31, refreshEligible: true }],
    openTickets: [{ id: "ITSM-20447", title: "External monitor flickering at dock", status: "In Progress", updated: "2d ago" }],
    directReports: [],
    pendingApprovals: [
      { id: "APPR-301", what: "Maya Chen — Salesforce read access (new hire)", from: "Provisioning Agent" }
    ],
    newHire: { name: "Maya Chen", role: "Solutions Consultant", startDate: "Monday, Jun 15", tasksDone: 3, tasksTotal: 7 }
  },

  connectors: [
    { name: "ServiceNow ITSM", icon: "🎫", scopes: ["tickets:read", "tickets:create"], category: "IT", actions: "Create/track incidents, hardware orders, diagnostics" },
    { name: "Workday", icon: "🧑‍💼", scopes: ["profile:read", "pto:read", "pto:write"], category: "HR", actions: "Profile, PTO balance & requests, org chart" },
    { name: "Okta", icon: "🔐", scopes: ["accounts:provision", "groups:write"], category: "Identity", actions: "Account provisioning, group membership, MFA" },
    { name: "Slack", icon: "💬", scopes: ["channels:invite", "messages:send"], category: "Comms", actions: "Channel invites, notifications, approvals" },
    { name: "Google Calendar", icon: "📅", scopes: ["events:write"], category: "Productivity", actions: "Schedule onboarding & intro meetings" },
    { name: "Gusto Payroll", icon: "💵", scopes: ["paystubs:read"], category: "Payroll", actions: "Paystubs, W-2, direct deposit" },
    { name: "Confluence", icon: "📚", scopes: ["pages:read"], category: "Knowledge", actions: "Policy & KB retrieval (RAG grounding)" },
    { name: "Jira", icon: "🧩", scopes: ["issues:read"], category: "Eng", actions: "Issue lookups for eng workflows" }
  ],

  /* --------- Mock enterprise knowledge corpus (fictional) --------- */
  corpus: [
    { id: "KB-101", source: "Confluence · IT KB", title: "VPN setup and troubleshooting", text: "Install GlobalProtect from the Self Service portal. Sign in with your Okta credentials and approve the MFA push. If the VPN disconnects repeatedly, switch gateway to US-Central. For DNS errors, flush the DNS cache and reconnect. Contact IT via the assistant if issues persist after reinstalling." },
    { id: "KB-102", source: "Confluence · IT KB", title: "Laptop refresh policy", text: "Employees are eligible for a laptop refresh every 30 months. Eligible employees can order an approved model through the assistant or the IT portal. Manager approval is required for upgrades above the standard configuration, such as additional RAM or storage. Old devices must be returned within 10 business days." },
    { id: "KB-103", source: "Confluence · IT KB", title: "Requesting software and licenses", text: "Standard software (Slack, Zoom, Figma viewer) is auto-approved and installs via Self Service. Licensed software such as Salesforce, Tableau, and Adobe Creative Cloud requires a business justification and manager approval. Provisioning is automated through Okta groups after approval." },
    { id: "KB-104", source: "Confluence · IT KB", title: "MFA and password reset", text: "Passwords expire every 90 days. Reset at id.aurora.example using your recovery factors. If you lose your MFA device, the assistant can verify your identity with your manager and issue a temporary bypass valid for 8 hours. Hardware security keys are available on request." },
    { id: "KB-105", source: "Confluence · IT KB", title: "Slow laptop diagnostics", text: "Common causes of a slow laptop: fewer than 10 GB free disk space, memory pressure from browser tabs, pending OS updates, or background sync clients. Run Diagnostics from Self Service. Devices older than 30 months with sustained memory pressure qualify for a refresh with additional RAM, subject to manager approval." },
    { id: "HR-201", source: "Confluence · HR", title: "Paid time off (PTO) policy", text: "Full-time employees accrue 20 PTO days per year, accruing monthly. Unused PTO carries over up to 5 days into the next calendar year. PTO requests go through Workday and route to your manager for approval. Requests under 3 days are auto-approved if team coverage is met. Sick time is separate and unlimited with manager notification." },
    { id: "HR-202", source: "Confluence · HR", title: "401(k) plan and employer match", text: "Aurora Dynamics matches 100% of the first 4% you contribute and 50% of the next 2%, for a maximum employer match of 5% of eligible pay. Matching contributions vest immediately. Enrollment and contribution changes are managed in Gusto and take effect the next pay period. The plan offers target-date funds and index options." },
    { id: "HR-203", source: "Confluence · HR", title: "Parental leave", text: "Birthing parents receive 18 weeks of fully paid leave; non-birthing parents receive 12 weeks. Leave can be taken continuously or split into two blocks within 12 months of birth or adoption. Notify your manager and file in Workday at least 30 days before the planned start when possible." },
    { id: "HR-204", source: "Confluence · HR", title: "New hire onboarding checklist", text: "Before day one: Workday profile created, Okta account provisioned, laptop ordered and shipped, Slack channels joined, day-one calendar invites sent, badge requested, and payroll enrollment completed. Managers own the checklist; the assistant can run all seven steps automatically with approval gates for spend and access grants." },
    { id: "HR-205", source: "Confluence · HR", title: "Remote work and hybrid policy", text: "Aurora Dynamics is hybrid-first: three days in office for roles designated flexible. Fully remote arrangements require VP approval and are reviewed annually. Home office stipend is $500 per year, claimable through expenses. Work from anywhere is allowed up to 4 weeks per year with manager notification." },
    { id: "HR-206", source: "Confluence · HR", title: "Expense and travel policy", text: "Expenses must be filed within 30 days with itemized receipts. Meals cap at $75 per day domestic. Flights over $600 and any international travel require pre-approval by your manager. Use the corporate card where possible; the assistant can pre-fill expense reports from receipt photos." },
    { id: "PAY-301", source: "Gusto · Payroll", title: "Paystubs and W-2 access", text: "Paystubs are published in Gusto two days before each payday. W-2 forms are available by January 31 each year. Update direct deposit accounts in Gusto; changes within 3 days of payday apply to the following cycle. State tax withholding updates require re-certifying your W-4." },
    { id: "PAY-302", source: "Gusto · Payroll", title: "Payroll calendar", text: "Aurora Dynamics pays semi-monthly on the 15th and last business day of each month. If a payday falls on a weekend or holiday, payment is made the preceding business day. Off-cycle corrections are processed weekly on Thursdays." },
    { id: "FAC-401", source: "Confluence · Facilities", title: "Badge and building access", text: "New badges are issued by Facilities on day one at the front desk. Lost badges must be reported immediately via the assistant; a temporary badge is valid for 5 days. After-hours access requires manager approval and is granted per floor through the badge system." },
    { id: "FAC-402", source: "Confluence · Facilities", title: "Desk and room booking", text: "Hot desks are bookable up to 7 days ahead in the workplace app or through the assistant. Conference rooms over 12 seats require a business reason during peak hours of 10am to 3pm. No-show bookings release after 15 minutes." },
    { id: "SEC-501", source: "Confluence · Security", title: "Phishing and incident reporting", text: "Report suspicious emails with the Report Phish button or by asking the assistant, which files a security incident automatically. Never enter credentials from an email link. Confirmed phishing reports earn security points in the quarterly recognition program. If you clicked a link, report within 1 hour and Security will rotate your credentials." },
    { id: "SEC-502", source: "Confluence · Security", title: "Data classification and AI usage policy", text: "Data is classified as Public, Internal, Confidential, or Restricted. Restricted data (customer PII, financials pre-announcement) may not be pasted into external AI tools. The enterprise assistant is approved for Confidential and below because retrieval is permission-aware and actions are policy-gated with full audit logs." },
    { id: "IT-106", source: "ServiceNow · ITSM KB", title: "Hardware ordering and approvals", text: "Standard laptop configurations ship without approval for refresh-eligible employees. Upgrades such as 32 GB RAM or 1 TB storage create an approval task for your manager with the price delta. Orders placed before 2pm CT ship same week. Loaner devices are available from IT while you wait." },
    { id: "IT-107", source: "ServiceNow · ITSM KB", title: "Access requests and provisioning", text: "Application access is governed by Okta groups mapped to roles. Requests outside your role profile require business justification and approval from the application owner. Provisioning agents execute grants automatically after approval and log evidence for SOX and SOC 2 audits." }
  ],

  /* --------- Scripted agentic scenarios --------- */
  scenarios: [
    {
      id: "onboarding",
      chip: "Get my new hire ready for Monday",
      triggers: ["new hire", "onboard", "maya", "starts monday", "get everything ready"],
      userText: "My new hire Maya Chen starts Monday — get everything ready.",
      trace: [
        { type: "intent", label: "Intent understood", detail: "Multi-system task: complete new-hire onboarding for Maya Chen (start: Mon Jun 15). Persona: hiring manager. Confidence 0.97." },
        { type: "plan", label: "Plan drafted (7 steps across 6 systems)", detail: "1) Verify Workday profile → 2) Provision Okta account + role groups → 3) Order laptop (ITSM) → 4) Slack channel invites → 5) Day-1 calendar → 6) Badge request → 7) Payroll enrollment check. Two steps need human approval: hardware spend, access grant." },
        { type: "tool", system: "Workday", call: "get_worker(name='Maya Chen')", result: '{ "status": "active_pre_hire", "role": "Solutions Consultant", "start": "2026-06-15", "manager": "Andrew Mairena" }', note: "Profile exists — no action needed." },
        { type: "tool", system: "Okta", call: "provision_account(user='mchen', groups=['sc-field','salesforce-read'])", result: '{ "queued": true, "approval_required": "salesforce-read" }', note: "Role-profile groups auto-approved; Salesforce read access requires owner approval." },
        { type: "approval", label: "Approval needed: Salesforce read access for Maya Chen", detail: "Policy AC-12: CRM access outside default role profile requires approver = app owner or hiring manager. Grant is logged for SOC 2 evidence.", approveNote: "Approved by Andrew Mairena (hiring manager) — recorded in audit log." },
        { type: "tool", system: "ServiceNow ITSM", call: "order_hardware(model='MBP14-std', ship_to='Austin HQ')", result: '{ "order": "HW-7782", "eta": "Thu Jun 11" }', note: "Standard config — auto-approved for new hires. Arrives before start date." },
        { type: "tool", system: "Slack", call: "invite(user='mchen', channels=['#field-eng','#sc-team','#help-it'])", result: '{ "invited": 3 }' },
        { type: "tool", system: "Google Calendar", call: "create_events(['Day-1 orientation 9am','Manager 1:1 11am','Team lunch 12pm'])", result: '{ "created": 3 }' },
        { type: "tool", system: "Facilities", call: "request_badge(user='mchen', site='Austin HQ')", result: '{ "ready": "day one, front desk" }' },
        { type: "respond", text: "Done — Maya is ready for Monday. ✅ Workday profile verified · ✅ Okta account provisioned (you approved Salesforce read access) · ✅ MacBook Pro arrives Thu Jun 11 · ✅ 3 Slack channels · ✅ Day-1 calendar set · ✅ Badge ready at the Austin front desk · ✅ Payroll enrollment already complete. I'll watch the laptop shipment and ping you if the ETA slips. One suggestion: her role profile doesn't include Tableau — most SCs request it in week 1. Want me to pre-request it with your justification?" }
      ]
    },
    {
      id: "slowlaptop",
      chip: "My laptop is slow — fix it",
      triggers: ["laptop is slow", "slow laptop", "more ram", "computer slow"],
      userText: "My laptop has been painfully slow all week. Can I get more RAM?",
      trace: [
        { type: "intent", label: "Intent understood", detail: "IT support: device performance issue + hardware upgrade request. Routing to diagnostics-first flow per KB-105 (don't order hardware before diagnosing)." },
        { type: "tool", system: "ServiceNow ITSM", call: "run_diagnostics(device='LT-9931')", result: '{ "disk_free_gb": 41, "memory_pressure": "high (avg 92%)", "os_updates": 0, "age_months": 31 }', note: "Memory pressure is the real cause. Disk and OS are healthy." },
        { type: "tool", system: "Confluence", call: "search_kb('laptop refresh memory upgrade eligibility')", result: '[ "KB-102 Laptop refresh policy", "KB-105 Slow laptop diagnostics" ]', note: "Grounding the recommendation in policy — device is 31 months old, refresh-eligible." },
        { type: "plan", label: "Recommendation formed", detail: "Device is refresh-eligible (31 > 30 months) AND has sustained memory pressure → per KB-105, qualifies for refresh WITH 32GB upgrade instead of a stopgap fix. Upgrade delta requires manager approval per KB-102 / IT-106." },
        { type: "approval", label: "Approval routed: 32GB upgrade (+$180 over standard)", detail: "Approval task sent to Elena Voss with the diagnostics attached as justification. Policy IT-106: price-delta upgrades need manager sign-off.", approveNote: "Elena approved in Slack — 4 min." },
        { type: "tool", system: "ServiceNow ITSM", call: "order_hardware(model='MBP14-32GB', replace='LT-9931')", result: '{ "order": "HW-7790", "eta": "Mon Jun 15", "return_label": true }' },
        { type: "respond", text: "Diagnosed it: your disk and OS are fine, but memory pressure has averaged 92% all week — that's the slowness. Since your MacBook is 31 months old, you're refresh-eligible, so instead of a band-aid I requested a new MBP 14 with 32GB. Elena approved the upgrade (diagnostics were attached as justification) and it arrives Monday with a return label for the old device. Meanwhile: quitting your 40+ Chrome tabs will buy you the most relief — want a 1-pager on taming tab memory?" }
      ]
    },
    {
      id: "pto",
      chip: "Book PTO next Friday",
      triggers: ["pto", "time off", "vacation", "day off", "book next friday"],
      userText: "How much PTO do I have? And book next Friday off.",
      trace: [
        { type: "intent", label: "Intent understood", detail: "Two-part: (1) informational lookup — PTO balance; (2) action — submit PTO request for Fri Jun 19." },
        { type: "tool", system: "Workday", call: "get_pto_balance(employee='AD-48291')", result: '{ "available_days": 14, "accrual": "1.67/mo", "carryover_max": 5 }' },
        { type: "tool", system: "Workday", call: "check_team_coverage(date='2026-06-19', team='Field Engineering')", result: '{ "coverage": "ok", "teammates_out": 1 }', note: "Policy HR-201: requests under 3 days auto-approve if coverage is met." },
        { type: "tool", system: "Workday", call: "submit_pto(date='2026-06-19', days=1)", result: '{ "request": "PTO-5512", "status": "auto_approved" }', note: "Auto-approved per policy — no manager gate needed. Manager notified FYI." },
        { type: "tool", system: "Google Calendar", call: "create_event('OOO — PTO', '2026-06-19', all_day=true, decline_meetings=true)", result: '{ "created": true, "meetings_declined": 2 }' },
        { type: "respond", text: "You have 14 PTO days available (you accrue 1.67/month; up to 5 carry over into next year). Next Friday, Jun 19 is booked ✅ — it auto-approved because team coverage is fine, and Elena got an FYI. I also set your calendar to OOO and declined the 2 meetings you had that day. Heads up: you're pacing to end the year with ~9 unused days — more than the 5-day carryover cap. Want me to suggest some weeks to use them?" }
      ]
    },
    {
      id: "401k",
      chip: "What's our 401(k) match?",
      triggers: ["401k", "401(k)", "match", "retirement"],
      userText: "What's our 401(k) match policy?",
      trace: [
        { type: "intent", label: "Intent understood", detail: "Informational — benefits policy question. No action needed. Routing to permission-aware retrieval (RAG), answer must cite sources." },
        { type: "tool", system: "Confluence", call: "search_kb('401k employer match policy', top_k=3)", result: '[ { "doc": "HR-202", "score": 0.91 }, { "doc": "PAY-301", "score": 0.44 } ]', note: "High-confidence single source. Answer will be grounded in HR-202 with citation." },
        { type: "respond", text: "Aurora matches 100% of your first 4% and 50% of the next 2% — so contribute 6% and you get the full 5% employer match, vested immediately. Changes are made in Gusto and apply the next pay period. 📄 Source: HR-202 — 401(k) plan and employer match. Quick check: you're contributing 4% today, which leaves 1% of free match on the table. Want me to draft the change to 6% in Gusto for your confirmation?" }
      ]
    }
  ],

  /* --------- Fallback reply for unscripted input in demo mode --------- */
  fallback: {
    text: "I'm running in scripted demo mode, so I can only walk through my four prepared journeys — try a suggestion chip below, or switch on Live Mode (⚙️ in the header) with an Anthropic API key to ask me anything against the mock enterprise. The agentic loop, tools, approvals, and audit trail you'll see are the same either way."
  }
};
