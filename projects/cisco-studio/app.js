/* ============================================================
   Mini-Studio — app logic
   Concept prototype by Gaurav Mehta. All data fictional.
   ============================================================ */
const S = window.STUDIO;
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ---------------- Router ---------------- */
const VIEW_TITLES = { studio: "Studio", agent: "BYO Coding Agent", commercial: "Commercial Model", brief: "PM Brief", about: "About this demo" };
function goto(view) {
  $$(".view").forEach(v => v.classList.remove("active"));
  $("#view-" + view).classList.add("active");
  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  $("#topbar-view").textContent = VIEW_TITLES[view];
  if (view === "brief") renderFunnel();
  window.scrollTo(0, 0);
}
$$(".nav-btn").forEach(b => b.addEventListener("click", () => goto(b.dataset.view)));

/* ---------------- Session funnel instrumentation ---------------- */
const FUNNEL_KEY = "ministudio_funnel";
function funnel() { try { return JSON.parse(localStorage.getItem(FUNNEL_KEY)) || {} } catch { return {} } }
function track(stage) {
  const f = funnel(); f[stage] = (f[stage] || 0) + 1;
  try { localStorage.setItem(FUNNEL_KEY, JSON.stringify(f)) } catch {}
}

/* ---------------- Platform data prelude for generated apps ---------------- */
const PRELUDE = `<script>window.platform=${JSON.stringify(S.platform)};<\/script>`;

/* ============================================================
   Gallery app generators — buildAppHtml(id, opts) -> HTML string
   ============================================================ */
const BASE_CSS = `
  :root{--bg:#0d1b26;--panel:#13283a;--line:#21405a;--text:#e9f3fa;--muted:#8fabc0;--cyan:#00bceb;--green:#5ee089;--amber:#ffc14d;--red:#ff7a6e}
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:22px}
  h1{font-size:19px;margin-bottom:4px} .sub{color:var(--muted);font-size:12.5px;margin-bottom:16px}
  .row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
  .kpi{flex:1;min-width:110px;background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:12px 14px;text-align:center}
  .kpi b{font-size:22px;display:block} .kpi span{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px}
  .pill{background:var(--panel);border:1px solid var(--line);color:var(--muted);border-radius:999px;padding:6px 13px;font-size:12.5px;cursor:pointer}
  .pill.on{border-color:var(--cyan);color:var(--cyan)}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th,td{padding:8px 10px;border-bottom:1px solid var(--line);text-align:left}
  th{color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.4px}
  .st{font-weight:700} .st.healthy{color:var(--green)} .st.warning{color:var(--amber)} .st.critical{color:var(--red)}
  .card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:10px}
  button.act{background:var(--cyan);border:none;color:#04121c;font-weight:700;border-radius:8px;padding:6px 13px;font-size:12px;cursor:pointer}
  button.act:disabled{opacity:.35}
  .muted{color:var(--muted)}
`;

function appDevHealth(o = {}) {
  return `<!DOCTYPE html><html><head><style>${BASE_CSS}
  ${o.dense ? ".kpi b{font-size:30px} td{padding:6px 8px;font-size:12px} body{padding:14px}" : ""}
  .bar{display:flex;align-items:flex-end;gap:18px;height:90px;background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:12px 16px;margin-bottom:14px}
  .bcol{flex:1;text-align:center;font-size:11px;color:var(--muted)} .bfill{background:linear-gradient(180deg,var(--red),var(--amber));border-radius:5px 5px 0 0;margin:0 auto 6px;width:34px}
  </style></head><body>
  <h1>Branch Device Health</h1><div class="sub">Live from platform.devices · sorted unhealthy-first${o.dense ? " · NOC display mode" : ""}</div>
  <div class="row" id="kpis"></div>
  ${o.chart ? '<div class="bar" id="chart"></div>' : ""}
  <div class="row" id="sites"></div>
  <table><thead><tr><th>Device</th><th>Site</th><th>Type</th><th>Status</th><th>CPU</th><th>Clients</th><th>Uptime</th></tr></thead><tbody id="tbody"></tbody></table>
  <script>
    const W={critical:0,warning:1,healthy:2}; let site="All";
    const sites=["All",...new Set(platform.devices.map(d=>d.site))];
    function render(){
      const ds=platform.devices.filter(d=>site==="All"||d.site===site).sort((a,b)=>W[a.status]-W[b.status]);
      const c={healthy:0,warning:0,critical:0}; platform.devices.forEach(d=>c[d.status]++);
      document.getElementById("kpis").innerHTML=
        '<div class="kpi"><b style="color:var(--green)">'+c.healthy+'</b><span>Healthy</span></div>'+
        '<div class="kpi"><b style="color:var(--amber)">'+c.warning+'</b><span>Warning</span></div>'+
        '<div class="kpi"><b style="color:var(--red)">'+c.critical+'</b><span>Critical</span></div>';
      document.getElementById("sites").innerHTML=sites.map(s=>'<button class="pill '+(s===site?"on":"")+'" onclick="site=\\''+s+'\\';render()">'+s+'</button>').join("");
      document.getElementById("tbody").innerHTML=ds.map(d=>'<tr><td><b>'+d.name+'</b><br><span class="muted" style="font-size:11px">'+d.id+'</span></td><td>'+d.site+'</td><td>'+d.type.replace("_"," ")+'</td><td class="st '+d.status+'">'+d.status+'</td><td>'+d.cpu+'%</td><td>'+d.clients+'</td><td>'+d.uptimeDays+'d</td></tr>').join("");
      ${o.chart ? `const per={}; platform.devices.forEach(d=>{ if(d.status!=="healthy") per[d.site]=(per[d.site]||0)+1; });
      const mx=Math.max(...Object.values(per),1);
      document.getElementById("chart").innerHTML=Object.entries(per).map(([s,n])=>'<div class="bcol"><div class="bfill" style="height:'+(n/mx*52)+'px"></div>'+s+' ('+n+')</div>').join("");` : ""}
    }
    render();
  <\/script></body></html>`;
}

function appTriage(o = {}) {
  return `<!DOCTYPE html><html><head><style>${BASE_CSS}
  .sev{font-size:10.5px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;border-radius:6px;padding:2px 8px}
  .sev.critical{background:rgba(255,122,110,.15);color:var(--red)} .sev.high{background:rgba(255,193,77,.15);color:var(--amber)}
  .sev.medium{background:rgba(0,188,235,.12);color:var(--cyan)} .sev.low{background:rgba(143,171,192,.15);color:var(--muted)}
  .al{display:flex;align-items:center;gap:12px} .al .grow{flex:1}
  .aged{outline:1px solid var(--red);outline-offset:2px;border-radius:12px}
  select{background:var(--bg);border:1px solid var(--line);color:var(--text);border-radius:7px;padding:5px 8px;font-size:12px}
  </style></head><body>
  <h1>Alert Triage</h1><div class="sub">Live from platform.alerts · severity-ranked${o.sla ? " · >60 min in queue flagged red" : ""}</div>
  <div class="row"><button class="pill on" id="f-open">Open only</button><button class="pill" id="f-all">All</button></div>
  <div id="list"></div>
  <script>
    const RANK={critical:0,high:1,medium:2,low:3}; let openOnly=true;
    const acked={}; platform.alerts.forEach(a=>acked[a.id]=a.acked);
    const owners={};
    const mins=t=>{const[h,m]=t.split(":").map(Number);return (9*60+30)-(h*60+m);}
    function render(){
      const as=platform.alerts.filter(a=>!openOnly||!acked[a.id]).sort((a,b)=>RANK[a.severity]-RANK[b.severity]);
      document.getElementById("list").innerHTML=as.map(a=>{
        const age=mins(a.ts);
        return '<div class="card al '+(${o.sla ? "age>60&&!acked[a.id]" : "false"}?"aged":"")+'">'+
        '<span class="sev '+a.severity+'">'+a.severity+'</span><div class="grow"><b>'+a.summary+'</b>'+
        '<div class="muted" style="font-size:12px">'+a.device+' · '+a.ts+(${o.sla ? "true" : "false"}?' · '+age+' min in queue':'')+'</div></div>'+
        ${o.assign ? `'<select onchange="owners[\\''+a.id+'\\']=this.value"><option>Unassigned</option>'+platform.people.map(p=>'<option '+(owners[a.id]===p.name?"selected":"")+'>'+p.name+'</option>').join("")+'</select>'+` : ""}
        '<button class="act" '+(acked[a.id]?"disabled":"")+' onclick="acked[\\''+a.id+'\\']=true;render()">'+(acked[a.id]?"Acked ✓":"Acknowledge")+'</button></div>';
      }).join("")||'<div class="card muted">Queue clear 🎉</div>';
      document.getElementById("f-open").className="pill "+(openOnly?"on":"");
      document.getElementById("f-all").className="pill "+(openOnly?"":"on");
    }
    document.getElementById("f-open").onclick=()=>{openOnly=true;render()};
    document.getElementById("f-all").onclick=()=>{openOnly=false;render()};
    render();
  <\/script></body></html>`;
}

function appRooms(o = {}) {
  return `<!DOCTYPE html><html><head><style>${BASE_CSS}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
  .slot{background:var(--bg);border:1px solid var(--line);color:var(--text);border-radius:8px;padding:6px 11px;font-size:12px;cursor:pointer;margin:3px 4px 0 0}
  .slot.booked{background:rgba(94,224,137,.15);border-color:var(--green);color:var(--green);cursor:default}
  </style></head><body>
  <h1>Room Booker</h1><div class="sub">Live from platform.rooms · click a slot to book${o.videoonly ? "" : ""}</div>
  <div class="row" id="filters"></div>
  ${o.mybookings ? '<div class="card" id="mine"><b>My bookings today</b><div class="muted" id="minelist" style="font-size:12.5px;margin-top:4px">Nothing yet.</div></div>' : ""}
  <div class="grid" id="grid"></div>
  <script>
    let videoOnly=false; const booked={};
    function render(){
      ${o.videoonly ? `document.getElementById("filters").innerHTML='<button class="pill '+(videoOnly?"on":"")+'" onclick="videoOnly=!videoOnly;render()">🎥 Video rooms only</button>';` : `document.getElementById("filters").innerHTML="";`}
      const rs=platform.rooms.filter(r=>!videoOnly||r.video);
      document.getElementById("grid").innerHTML=rs.map(r=>'<div class="card"><b>'+r.name+'</b> <span class="muted" style="font-size:12px">· '+r.site+' · '+r.seats+' seats'+(r.video?" · 🎥":"")+'</span><div>'+
        r.slots.map(s=>{const k=r.id+s;return '<button class="slot '+(booked[k]?"booked":"")+'" onclick="book(\\''+k+'\\',\\''+r.name+'\\',\\''+s+'\\')">'+s+(booked[k]?" ✓":"")+'</button>'}).join("")+'</div></div>').join("");
      ${o.mybookings ? `const mine=Object.entries(booked).filter(([k,v])=>v).map(([k,v])=>v);
      document.getElementById("minelist").innerHTML=mine.length?mine.join("<br>"):"Nothing yet.";` : ""}
    }
    function book(k,name,slot){ if(booked[k])return; booked[k]=name+" @ "+slot; render(); }
    render();
  <\/script></body></html>`;
}

const GENERATORS = { devhealth: appDevHealth, triage: appTriage, rooms: appRooms };

/* ============================================================
   Builder flow
   ============================================================ */
let current = null; // {id?, name, prompt, opts, html (live mode), shipped, live}
let busy = false;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function addTraceStep(num, step, detail) {
  const el = document.createElement("div");
  el.className = "bstep";
  el.innerHTML = `<div class="bs-head"><span class="bs-num">${num}</span>${step}</div><p>${detail}</p>`;
  $("#trace-list").appendChild(el);
  el.scrollIntoView({ block: "nearest" });
}
function clearTrace() { $("#trace-list").innerHTML = ""; }

function renderPreview(html, name) {
  const frame = $("#preview-frame");
  frame.srcdoc = PRELUDE + html.replace(/<script>window\.platform=[\s\S]*?<\/script>/, "");
  frame.style.display = "block";
  $("#preview-empty").style.display = "none";
  $("#preview-url").textContent = "apps.meridian.example/draft/" + (name || "app").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
  $("#ship-btn").disabled = false;
  $("#shipped-banner").style.display = "none";
  track("preview");
}

async function buildScripted(appId) {
  const app = S.apps.find(a => a.id === appId);
  if (!app || busy) return;
  busy = true;
  current = { id: app.id, name: app.chip, prompt: app.prompt, opts: {}, shipped: false, live: false };
  $("#prompt-input").value = app.prompt;
  clearTrace(); track("prompt");
  $("#refine-box").style.display = "none";
  for (let i = 0; i < app.trace.length; i++) {
    await sleep(i === 0 ? 250 : 650);
    addTraceStep(i + 1, app.trace[i].step, app.trace[i].detail);
  }
  await sleep(350);
  renderPreview(GENERATORS[app.id]({}), app.chip);
  showRefinements(app);
  busy = false;
}

function showRefinements(app) {
  const box = $("#refine-box"); box.style.display = "block";
  const chips = $("#refine-chips"); chips.innerHTML = "";
  app.refinements.forEach(r => {
    const c = document.createElement("button");
    c.className = "chip" + (current.opts[r.id] ? " on" : "");
    c.style.borderColor = current.opts[r.id] ? "var(--cyan)" : "";
    c.style.color = current.opts[r.id] ? "var(--cyan)" : "";
    c.textContent = (current.opts[r.id] ? "✓ " : "") + r.label;
    c.title = r.desc;
    c.onclick = async () => {
      if (busy) return; busy = true;
      current.opts[r.id] = !current.opts[r.id];
      addTraceStep("↻", "Refine", `${r.desc} → regenerating with ${Object.keys(current.opts).filter(k => current.opts[k]).length} refinement(s) applied. Diff kept minimal; data bindings untouched.`);
      track("refine");
      await sleep(700);
      renderPreview(GENERATORS[app.id](current.opts), app.chip);
      showRefinements(app);
      busy = false;
    };
    chips.appendChild(c);
  });
}

/* ---------------- Ship ---------------- */
const shipped = [];
$("#ship-btn").onclick = () => {
  if (!current || current.shipped) return;
  current.shipped = true;
  track("ship");
  const url = "apps.meridian.example/" + (current.name || "app").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
  const b = $("#shipped-banner");
  b.style.display = "block";
  b.innerHTML = `🚀 Shipped to <b>${url}</b> — scopes reviewed (read: devices/alerts/rooms${current.id === "triage" ? ", flagged: alerts:write needs approval" : ""}), added to your team catalog, audit trail started.`;
  $("#ship-btn").disabled = true;
  shipped.push({ name: current.name || "Custom app", url, live: current.live });
  $("#myapps").style.display = "block";
  $("#myapps-grid").innerHTML = shipped.map(s => `<div class="appcard"><h3>${s.name}</h3><p>${s.url}${s.live ? " · built live by Claude" : ""}</p></div>`).join("");
};

/* ---------------- Chips + prompt input ---------------- */
(() => {
  const chips = $("#app-chips");
  S.apps.forEach(a => {
    const c = document.createElement("button");
    c.className = "chip"; c.textContent = "✨ " + a.chip;
    c.onclick = () => buildScripted(a.id);
    chips.appendChild(c);
  });
})();

function matchApp(text) {
  const t = text.toLowerCase();
  if (/device|health|switch|router|branch|dashboard|uptime/.test(t)) return "devhealth";
  if (/alert|triage|security|incident|ack/.test(t)) return "triage";
  if (/room|book|meeting|desk/.test(t)) return "rooms";
  return null;
}

async function handleBuild() {
  const text = $("#prompt-input").value.trim();
  if (!text || busy) return;
  if (LIVE.enabled) return buildLive(text);
  const id = matchApp(text);
  if (id) return buildScripted(id);
  clearTrace();
  addTraceStep("!", "Scripted mode", "This demo ships with three pre-built journeys (chips above). For arbitrary prompts like this one, switch on Live Mode (⚙️) with an Anthropic key — Claude will genuinely generate the app, render it, and refine it.");
}
$("#build-btn").onclick = handleBuild;
$("#prompt-input").addEventListener("keydown", e => { if (e.key === "Enter") handleBuild(); });

/* ============================================================
   LIVE MODE — real prompt-to-app via BYOK
   ============================================================ */
const LIVE = { enabled: false, key: "", model: "claude-sonnet-4-6" };
$("#gear-btn").onclick = () => $("#modal-bg").classList.add("open");
$("#modal-off").onclick = () => { LIVE.enabled = false; setPill(); $("#modal-bg").classList.remove("open"); };
$("#modal-save").onclick = () => {
  const k = $("#api-key").value.trim();
  if (!k) { alert("Paste an API key, or use scripted mode."); return; }
  LIVE.key = k; LIVE.model = $("#api-model").value.trim() || "claude-sonnet-4-6"; LIVE.enabled = true;
  setPill(); $("#modal-bg").classList.remove("open");
};
$("#modal-bg").addEventListener("click", e => { if (e.target.id === "modal-bg") $("#modal-bg").classList.remove("open"); });
function setPill() {
  $("#live-dot").classList.toggle("on", LIVE.enabled);
  $("#live-label").textContent = LIVE.enabled ? `Live mode · ${LIVE.model}` : "Scripted demo mode";
}

function extractHtml(text) {
  const fence = text.match(/```(?:html)?\s*([\s\S]*?)```/);
  let h = fence ? fence[1] : text;
  const idx = h.indexOf("<!DOCTYPE");
  if (idx > 0) h = h.slice(idx);
  return h.trim();
}

async function callClaude(messages) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": LIVE.key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({ model: LIVE.model, max_tokens: 8000, system: S.byokSystem.replace("{API_DOCS}", S.apiDocs), messages })
  });
  if (!resp.ok) throw new Error(`API ${resp.status}: ${(await resp.text()).slice(0, 180)}`);
  const data = await resp.json();
  return data.content.filter(c => c.type === "text").map(c => c.text).join("");
}

async function buildLive(text) {
  busy = true; clearTrace(); track("prompt");
  $("#refine-box").style.display = "none";
  addTraceStep(1, "Understand", `Sending your prompt to ${LIVE.model} with the platform API docs. This is a real generation — not a script.`);
  addTraceStep(2, "Generate", "Claude is writing a complete single-file app against window.platform…");
  try {
    const t0 = performance.now();
    const out = await callClaude([{ role: "user", content: `Build this app: ${text}` }]);
    const html = extractHtml(out);
    const secs = ((performance.now() - t0) / 1000).toFixed(1);
    addTraceStep(3, "Generation checks", `Received ${html.length.toLocaleString()} chars in ${secs}s. Sandboxed render (allow-scripts only), no external network access, platform object injected read-only.`);
    current = { name: text.slice(0, 40), prompt: text, html, opts: {}, shipped: false, live: true };
    renderPreview(html, text);
    addTraceStep(4, "Preview", "Rendered. Refine it conversationally below — each refinement sends the current code back with your instruction.");
    $("#refine-box").style.display = "block";
    $("#refine-chips").innerHTML = "";
  } catch (err) {
    addTraceStep("✕", "Error", err.message + " — check the key/model in ⚙️, or use the scripted chips.");
  }
  busy = false;
}

$("#refine-btn").onclick = () => liveRefine();
$("#refine-input").addEventListener("keydown", e => { if (e.key === "Enter") liveRefine(); });
async function liveRefine() {
  const ins = $("#refine-input").value.trim();
  if (!ins || busy) return;
  if (!LIVE.enabled || !current?.html) {
    addTraceStep("!", "Refine", "Free-text refinement needs Live Mode (⚙️). In scripted mode, use the refinement chips.");
    return;
  }
  busy = true; $("#refine-input").value = "";
  addTraceStep("↻", "Refine (live)", `"${ins}" — sending current app code + instruction to ${LIVE.model}.`);
  track("refine");
  try {
    const out = await callClaude([
      { role: "user", content: `Build this app: ${current.prompt}` },
      { role: "assistant", content: current.html },
      { role: "user", content: `Refine the app: ${ins}. Return the full updated HTML document.` }
    ]);
    current.html = extractHtml(out);
    renderPreview(current.html, current.name);
    addTraceStep("✓", "Refined", "Updated app rendered.");
  } catch (err) {
    addTraceStep("✕", "Error", err.message);
  }
  busy = false;
}

/* ============================================================
   BYO AGENT view — spec/CLI/MCP/AGENTS.md from current app
   ============================================================ */
function agentArtifacts() {
  const name = current ? (current.name || "custom-app") : "branch-device-health";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
  const promptTxt = current ? current.prompt : S.apps[0].prompt;
  const refs = current && current.opts ? Object.keys(current.opts).filter(k => current.opts[k]) : [];
  return {
    spec: JSON.stringify({
      app: slug, version: "0.3.0", origin: current?.live ? "byok-live-generation" : "studio-visual-builder",
      prompt: promptTxt,
      refinements: refs,
      data_scopes: { read: ["platform.devices", "platform.alerts", "platform.rooms"], write_requested: slug.includes("triage") ? ["alerts:ack"] : [] },
      surfaces: ["web"], sharing: "team",
      checks: { runtime_errors: 0, external_network: "blocked", a11y: "pass" },
      note: "Same spec whether the app was built visually or by a coding agent. Pull it, edit it, push it back."
    }, null, 2),
    cli: `# The BYO-coding-agent path — same app, your tools
$ studio login                         # device-code auth, free tier OK
$ studio pull ${slug}                  # fetch spec + generated source
$ cursor .                             # or claude code, or any agent you like
# … your agent edits the app …
$ studio check                         # generation checks run locally:
  ✓ runtime errors: 0    ✓ scopes match spec    ✓ no external calls
$ studio push                          # renders in the visual builder too
$ studio ship --env team               # same ship gate as the UI`,
    mcp: JSON.stringify({
      mcpServers: { "meridian-studio": { url: "https://mcp.meridian.example/studio", note: "Studio exposes itself as MCP tools, so ANY agent can build apps" } },
      tools: [
        { name: "studio_create_app", input: { prompt: "string" }, returns: "app_id + spec" },
        { name: "studio_get_app", input: { app_id: "string" }, returns: "spec + source" },
        { name: "studio_update_app", input: { app_id: "string", source: "string" }, returns: "check results" },
        { name: "studio_run_checks", input: { app_id: "string" }, returns: "runtime/scope/a11y report" },
        { name: "studio_ship", input: { app_id: "string", env: "team|org" }, returns: "url (pauses at human ship-gate)" },
        { name: "platform_query", input: { api: "devices|alerts|rooms|people" }, returns: "read-scoped data" }
      ]
    }, null, 2),
    agents: `# AGENTS.md — dropped into every pulled app
This repo is a Mini-Studio app ("${slug}"). For AI coding agents working here:

## What this app is
${promptTxt}

## Rules
- window.platform is injected at runtime (read-only). Never mock or redefine it.
- All writes go through declared scopes in app.spec.json. Adding a write? Update the spec; it triggers a human review gate at ship.
- Run \`studio check\` before push. Zero runtime errors and scope compliance are ship-blocking.
- Keep it a single file unless the spec says otherwise. Style tokens in :root are the design system.

## Why this file exists
Studio treats coding agents as first-class builders. The visual builder and your agent
edit the same spec and source, pass the same checks, and hit the same ship gate.
Two paths, one product.`
  };
}
(() => {
  let tab = "spec";
  const render = () => {
    const art = agentArtifacts();
    $("#codebox").textContent = art[tab];
    $$(".codetab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  };
  $$(".codetab").forEach(t => t.onclick = () => { tab = t.dataset.tab; render(); });
  $('[data-view="agent"]').addEventListener("click", render);
  render();
})();

/* ============================================================
   COMMERCIAL view
   ============================================================ */
(() => {
  $("#tier-philosophy").textContent = S.tiers.philosophy;
  const tb = $("#tier-table tbody");
  S.tiers.rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><b>${r.feature}</b></td><td class="center">${r.free}</td><td class="center">${r.pro}</td><td class="center">${r.ent}</td>`;
    tr.title = r.why;
    const why = document.createElement("tr");
    why.innerHTML = `<td colspan="4" class="whyrow">↳ ${r.why}</td>`;
    why.style.display = "none";
    tr.style.cursor = "pointer";
    tr.onclick = () => { why.style.display = why.style.display === "none" ? "table-row" : "none"; };
    tb.appendChild(tr); tb.appendChild(why);
  });
  $("#moments").innerHTML = S.tiers.upgradeMoments.map(m =>
    `<div class="moment"><div class="m-at">${m.at}</div><div class="m-to"><span class="tag ${m.to === "Enterprise" ? "amber" : m.to === "Ecosystem" ? "green" : "cyan"}">${m.to}</span></div><div class="m-note">${m.note}</div></div>`).join("");

  const sliders = [
    { id: "mab", label: "Monthly active builders", min: 1000, max: 200000, step: 1000, val: 40000, fmt: v => v.toLocaleString() },
    { id: "shiprate", label: "% who ship an app (activation)", min: 5, max: 80, step: 1, val: 35, fmt: v => v + "%" },
    { id: "conv", label: "Free → paid conversion of shippers", min: 2, max: 40, step: 1, val: 12, fmt: v => v + "%" },
    { id: "arpu", label: "Avg revenue per paid builder / mo", min: 10, max: 120, step: 5, val: 45, fmt: v => "$" + v },
    { id: "entmix", label: "Enterprise uplift (governance deals)", min: 0, max: 100, step: 5, val: 40, fmt: v => "+" + v + "%" }
  ];
  const box = $("#calc-sliders");
  const state = {};
  sliders.forEach(s => {
    state[s.id] = s.val;
    const row = document.createElement("div");
    row.className = "slider-row";
    row.innerHTML = `<div>${s.label}</div><input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.val}"><div class="val" id="v-${s.id}">${s.fmt(s.val)}</div>`;
    row.querySelector("input").addEventListener("input", e => {
      state[s.id] = +e.target.value;
      $("#v-" + s.id).textContent = s.fmt(state[s.id]);
      calc();
    });
    box.appendChild(row);
  });
  function calc() {
    const paid = state.mab * (state.shiprate / 100) * (state.conv / 100);
    const arr = paid * state.arpu * 12 * (1 + state.entmix / 100);
    $("#arr-num").textContent = "$" + (arr >= 1e6 ? (arr / 1e6).toFixed(1) + "M" : Math.round(arr / 1000) + "K");
    const pct = Math.min(100, arr / 25e6 * 100);
    $("#arr-fill").style.width = pct + "%";
    $("#arr-note").textContent = pct >= 100 ? "Above commit — raise it or invest in ecosystem." :
      `${Math.round(pct)}% of commit · biggest lever: ${state.shiprate < 30 ? "activation (ship rate)" : state.conv < 10 ? "free→paid conversion" : "enterprise governance attach"}`;
  }
  calc();
})();

/* ============================================================
   PM BRIEF
   ============================================================ */
function renderFunnel() {
  const f = funnel();
  const stages = [["prompt", "Prompts"], ["preview", "Previews"], ["refine", "Refinements"], ["ship", "Shipped"]];
  $("#live-funnel").innerHTML = stages.map(([k, l]) =>
    `<div class="fstage"><div class="fnum">${f[k] || 0}</div><div class="flab">${l}</div></div>`).join("");
}

$("#brief-content").innerHTML = `
<h2>1 · What Studio actually competes on</h2>
<p>Prompt-to-app is becoming a commodity; v0, Lovable, Replit, and Bolt all produce a working app from a sentence. The race Studio can win is different: <b>apps that are born connected and born governed.</b> A consumer app builder gives you a UI; Studio gives you a UI already wired to your platform's devices, meetings, alerts, and identity, with scopes, review gates, and audit from the first preview. The enterprise question isn't "can AI build an app?" anymore — it's "can I let a thousand employees do it without creating a thousand ungoverned workflows?"</p>
<table>
  <tr><th></th><th>Studio (this concept)</th><th>v0 / Lovable / Replit</th><th>Copilot Studio / Power Apps</th><th>Retool</th></tr>
  <tr><td><b>Wins on</b></td><td>Platform data gravity + governance + two builder paths</td><td>Craft, speed, consumer-grade joy</td><td>M365 distribution, price bundling</td><td>Pro-developer internal tools</td></tr>
  <tr><td><b>Weak on</b></td><td>Must match consumer-grade craft (the bar is HIGH)</td><td>Enterprise data, scopes, governance, audit</td><td>Builder experience quality; agent-native paths</td><td>Prompt-native building; non-technical builders</td></tr>
  <tr><td><b>Our play</b></td><td>—</td><td>Match craft "good enough", win where apps touch real systems</td><td>Be the cross-stack option with a genuinely loved builder</td><td>Win the non-engineer 80% they don't serve</td></tr>
</table>
<div class="callout">The honest risk is craft. If describing → previewing → refining feels worse than Lovable, governance won't save us — builders try the free tier alone, and they judge in the first ten minutes. That's why the demo you're holding leads with the builder loop, not the admin console.</div>

<h2>2 · Two paths, one product</h2>
<p>The BYO-coding-agent path isn't an integration checkbox; it's the ecosystem strategy. Engineers and AI agents who build through the spec/CLI/MCP surface create the templates, connectors, and patterns that non-technical builders consume in the visual builder. Keep BYO-agent access in the free tier (rate-limited) because those builders are disproportionately the ones who seed the catalog. The seam — same spec, same checks, same ship gate (see the BYO tab) — is what makes it one product instead of two.</p>

<h2>3 · Your session, instrumented</h2>
<p>The product's north star is below, measured on you, right now. This funnel is the actual telemetry of this demo session:</p>
<div class="funnel" id="live-funnel"></div>
<div class="metric-grid">
  <div class="metric"><div class="mname">Weekly Shipped Apps ★</div><p>North star. Not prompts, not previews — apps that ship and survive 30 days. Counts only what reached value.</p></div>
  <div class="metric"><div class="mname">Time-to-First-Shipped-App</div><p>Activation. Target: under 15 minutes from first prompt for the median new builder. Every onboarding decision answers to this.</p></div>
  <div class="metric"><div class="mname">Refinement depth</div><p>Craft proxy: median refinements before ship. Too high = generation quality is weak; near zero = builders aren't iterating, the preview isn't inviting.</p></div>
  <div class="metric"><div class="mname">Free → paid conversion</div><p>The commercial engine, measured at the upgrade moments designed into the flow (4th app, first write scope, first share).</p></div>
  <div class="metric"><div class="mname">Ecosystem health</div><p>% of shipped apps using a partner template/connector; BYO-agent share of builds; 3P template publish rate. Revenue against commit follows these.</p></div>
  <div class="metric"><div class="mname">Trust & safety</div><p>Generated-app runtime error rate, scope-violation attempts caught, ship-gate override rate. Zero-tolerance: an app exceeding declared scopes.</p></div>
</div>

<h2>4 · Quality: evals for generated apps</h2>
<p>A builder is a generation product, so the eval harness is the spec. Golden prompt set (200 prompts across personas and app types) scored on: compiles-and-runs rate, functional correctness against the prompt (LLM-as-judge + scripted assertions on the rendered DOM), design-quality rubric, scope discipline (does generated code stay inside declared data scopes), and refinement fidelity (does "make it compact" change layout without breaking data bindings). Run as CI gates on every model/prompt-chain change; regressions block deploy. The same checks run on BYO-agent pushes — one quality bar for both paths.</p>

<h2>5 · Sequencing</h2>
<p><b>Now:</b> nail the loop for 3 app archetypes (dashboard, triage/queue, booking/self-service) — depth beats breadth while craft is the risk. <b>Next:</b> write scopes with review gates, org catalog, the first three upgrade moments live. <b>Then:</b> partner templates with rev-share, MCP surface GA, and the governance console that turns shadow apps into governed ones. Free/paid pricing ships in "Next" — early enough to learn, late enough that activation data shapes the gates.</p>

<h2>6 · Open questions I'd bring</h2>
<p>① Where's the craft bar — do we match Lovable's polish or define an enterprise-appropriate aesthetic that's cheaper to guarantee? ② Is the value metric shipped apps or monthly active apps — builders or beneficiaries? ③ How aggressively do we let agents ship without a human gate as trust accrues — earned autonomy per builder, per app, or per scope? ④ Does the partner rev-share apply to internal platform teams publishing templates, which changes the internal economics entirely?</p>
`;

/* ============================================================
   ABOUT
   ============================================================ */
$("#about-content").innerHTML = `
<p>Hi — I'm <b>Gaurav Mehta</b>, a Staff Product Manager at Intuit working on agentic AI platforms. I built this prototype for the <b>Engineering Product Manager, Cloud Control Studio</b> role at Cisco, because the role owns how building feels — and that's easier to show than to describe.</p>
<p><b>What this is:</b> a working concept of a prompt-to-app builder. Three scripted journeys build real, interactive apps (try them — filter the devices, ack the alerts, book a room; they run live against a mock platform API). The refine loop, ship gate with scope review, session-funnel telemetry, BYO-coding-agent surface (spec/CLI/MCP/AGENTS.md), and an interactive commercial model — free/paid packaging with the reasoning per row, upgrade moments, and a revenue calculator — are all here because the JD says the experience <i>and</i> the business are one job.</p>
<p><b>What's real vs. simulated:</b> the generated apps are real working software rendered in sandboxed frames; in scripted mode they're pre-built so the demo needs zero setup. Flip on <b>Live Mode</b> (⚙️, your own Anthropic key) and the prompt bar becomes a genuine prompt-to-app builder: Claude writes a complete app from any prompt against the mock APIs, renders it, and refines it conversationally. The funnel in the PM Brief is real telemetry from your session.</p>
<p><b>Why I'm credible here:</b> I ship this pattern in production — a multi-agent system at Intuit that turns a natural-language brief into live, production-grade campaign setups (launch time: weeks → minutes), custom MCP servers that let AI agents build against platform APIs as first-class consumers, and LLM-as-judge eval pipelines gating every production promotion. I use AI coding agents daily; this demo was built with them.</p>
<p style="margin-top:18px">
  📬 <a href="mailto:gaurav.rs.mehta@gmail.com">gaurav.rs.mehta@gmail.com</a> ·
  💼 <a href="https://www.linkedin.com/in/gamehta" target="_blank" rel="noopener">linkedin.com/in/gamehta</a> ·
  🌐 <a href="https://gmehta.github.io/GMEHTA-AI-PM" target="_blank" rel="noopener">Portfolio & AI PM work</a>
</p>
<p class="disclaimer">Independent concept demo created as part of a job application. Not affiliated with, endorsed by, or built on Cisco IP. "Meridian Networks" and all data are fictional. "Mini-Studio" is a concept name, not a Cisco product.</p>
`;

renderFunnel();
