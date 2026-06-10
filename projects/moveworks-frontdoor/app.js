/* ============================================================
   Front Door — app logic
   Concept prototype by Gaurav Mehta. All data is fictional.
   ============================================================ */
const D = window.DATA;
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ---------------- Router ---------------- */
const VIEW_TITLES = { home: "Home", assistant: "Assistant", search: "Enterprise Search", integrations: "Integrations", brief: "PM Brief", about: "About this demo" };
function goto(view) {
  $$(".view").forEach(v => v.classList.remove("active"));
  $("#view-" + view).classList.add("active");
  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  $("#topbar-view").textContent = VIEW_TITLES[view];
  window.scrollTo(0, 0);
}
$$(".nav-btn").forEach(b => b.addEventListener("click", () => goto(b.dataset.view)));
document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-goto]");
  if (g) { e.preventDefault(); goto(g.dataset.goto); }
});

/* ---------------- Greeting ---------------- */
(() => {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  $("#greeting").textContent = `${part}, ${D.persona.name.split(" ")[0]}.`;
})();

/* ---------------- Home: chips + proactive cards ---------------- */
(() => {
  const chips = $("#home-chips");
  D.scenarios.forEach(s => {
    const c = document.createElement("button");
    c.className = "chip"; c.textContent = s.chip;
    c.onclick = () => { goto("assistant"); runScenario(s.id); };
    chips.appendChild(c);
  });

  const p = D.persona;
  const cards = [
    { tag: ["amber", "Action needed"], icon: "🧑‍💻", title: `${p.newHire.name} starts ${p.newHire.startDate}`, body: `Onboarding is ${p.newHire.tasksDone}/${p.newHire.tasksTotal} complete. The agent can finish the rest — laptop, access, channels, day-one calendar — with approval gates where policy requires.`, cta: "Finish onboarding →", run: "onboarding" },
    { tag: ["blue", "Device"], icon: "💻", title: "Your laptop is refresh-eligible", body: `LT-9931 is 31 months old and showing high memory pressure this week. You qualify for a refresh with an upgrade option.`, cta: "Diagnose & order →", run: "slowlaptop" },
    { tag: ["teal", "Time off"], icon: "🌴", title: `${p.ptoBalanceDays} PTO days available`, body: "You're pacing to exceed the 5-day carryover cap by year-end. Small requests auto-approve when team coverage is met.", cta: "Book a day →", run: "pto" },
    { tag: ["green", "Approvals"], icon: "✅", title: "1 approval waiting on you", body: `${p.pendingApprovals[0].what}. Routed by the ${p.pendingApprovals[0].from} under policy AC-12 with audit evidence attached.`, cta: "Review →", run: "onboarding" },
    { tag: ["blue", "Ticket update"], icon: "🎫", title: p.openTickets[0].id + " in progress", body: `“${p.openTickets[0].title}” was updated ${p.openTickets[0].updated}. A replacement dock was ordered; the agent will close the loop when it ships.`, cta: "Ask for status →", run: null, ask: "What's the status of my monitor ticket?" },
    { tag: ["teal", "Benefits"], icon: "💰", title: "You're leaving 401(k) match on the table", body: "You contribute 4%; the plan matches up to 6% of contributions. One question to the assistant fixes it.", cta: "See the policy →", run: "401k" }
  ];
  const wrap = $("#proactive-cards");
  cards.forEach(c => {
    const el = document.createElement("div");
    el.className = "pcard";
    el.innerHTML = `<div class="head"><span style="font-size:20px">${c.icon}</span><span class="tag ${c.tag[0]}">${c.tag[1]}</span></div>
      <h3>${c.title}</h3><p>${c.body}</p><button class="cta">${c.cta}</button>`;
    el.querySelector(".cta").onclick = () => {
      goto("assistant");
      if (c.run) runScenario(c.run); else handleUserMessage(c.ask);
    };
    wrap.appendChild(el);
  });

  const go = () => {
    const v = $("#home-ask").value.trim();
    goto("assistant");
    if (v) handleUserMessage(v);
  };
  $("#home-ask-btn").onclick = go;
  $("#home-ask").addEventListener("keydown", e => { if (e.key === "Enter") go(); });
})();

/* ---------------- Integrations ---------------- */
(() => {
  const g = $("#conn-grid");
  D.connectors.forEach(c => {
    const el = document.createElement("div");
    el.className = "conn";
    el.innerHTML = `<div class="chead"><span class="cicon">${c.icon}</span><div><h3>${c.name}</h3><span class="dim small">${c.category}</span></div></div>
      <p>${c.actions}</p>
      <div class="scopes">${c.scopes.map(s => `<span>${s}</span>`).join("")}</div>`;
    g.appendChild(el);
  });
})();

/* ============================================================
   SEARCH — BM25 + in-browser embeddings (transformers.js)
   ============================================================ */
const STOP = new Set("a an and are as at be by for from has have how i in is it of on or our the to we what when where which who will with your you my do does can".split(" "));
const tok = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w && !STOP.has(w));

const bm25 = (() => {
  const docs = D.corpus.map(d => tok(d.title + " " + d.title + " " + d.text)); // title boosted 2x
  const N = docs.length, avgdl = docs.reduce((a, d) => a + d.length, 0) / N;
  const df = {};
  docs.forEach(d => new Set(d).forEach(w => df[w] = (df[w] || 0) + 1));
  const k1 = 1.4, b = 0.75;
  return (query) => {
    const q = tok(query);
    return docs.map((d, i) => {
      const tf = {};
      d.forEach(w => tf[w] = (tf[w] || 0) + 1);
      let score = 0;
      q.forEach(w => {
        if (!tf[w]) return;
        const idf = Math.log(1 + (N - df[w] + 0.5) / (df[w] + 0.5));
        score += idf * (tf[w] * (k1 + 1)) / (tf[w] + k1 * (1 - b + b * d.length / avgdl));
      });
      return { i, score };
    });
  };
})();

let embedder = null, docVecs = null;
const cosine = (a, c) => { let s = 0, na = 0, nc = 0; for (let i = 0; i < a.length; i++) { s += a[i] * c[i]; na += a[i] * a[i]; nc += c[i] * c[i]; } return s / (Math.sqrt(na) * Math.sqrt(nc)); };

(async () => {
  try {
    const { pipeline } = await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const out = [];
    for (const d of D.corpus) {
      const e = await embedder(d.title + ". " + d.text, { pooling: "mean", normalize: true });
      out.push(Array.from(e.data));
    }
    docVecs = out;
    $("#embed-dot").classList.add("on");
    $("#embed-status").textContent = "Semantic engine: ON — MiniLM-L6-v2 (384-dim) running in-browser via WASM. Results use hybrid BM25 + cosine fusion.";
  } catch (err) {
    $("#embed-status").textContent = "Semantic engine unavailable (CDN blocked?) — falling back to BM25 lexical search.";
  }
})();

async function runSearch(query) {
  if (!query.trim()) return;
  const lex = bm25(query);
  const maxLex = Math.max(...lex.map(x => x.score), 1e-9);
  let fused;
  if (embedder && docVecs) {
    const qe = await embedder(query, { pooling: "mean", normalize: true });
    const qv = Array.from(qe.data);
    fused = lex.map((x, i) => ({ i, score: 0.45 * (x.score / maxLex) + 0.55 * Math.max(0, cosine(qv, docVecs[i])) }));
  } else {
    fused = lex.map(x => ({ i: x.i, score: x.score / maxLex }));
  }
  fused.sort((a, b) => b.score - a.score);
  const top = fused.slice(0, 6).filter(x => x.score > 0.08);

  const res = $("#search-results"), ans = $("#search-answer");
  res.innerHTML = ""; ans.innerHTML = "";
  if (!top.length) { res.innerHTML = `<div class="trace-empty">No results in the mock corpus. Try “pto”, “401k match”, “vpn”, “expense limits”…</div>`; return; }

  const best = D.corpus[top[0].i];
  const sentences = best.text.match(/[^.!?]+[.!?]/g) || [best.text];
  const qTokens = new Set(tok(query));
  let bestSent = sentences[0], bestHit = -1;
  sentences.forEach(s => { const h = tok(s).filter(w => qTokens.has(w)).length; if (h > bestHit) { bestHit = h; bestSent = s; } });
  ans.innerHTML = `<div class="answer-box"><b>Answer</b> <span class="tag teal" style="margin-left:6px">grounded</span><p style="margin-top:8px;color:#d7e4ee">${bestSent.trim()}</p><div class="src">📄 ${best.id} — ${best.title} · ${best.source} · permission-aware: you can see this doc</div></div>`;

  top.forEach(t => {
    const d = D.corpus[t.i];
    let snippet = d.text.slice(0, 230) + (d.text.length > 230 ? "…" : "");
    qTokens.forEach(w => { if (w.length > 2) snippet = snippet.replace(new RegExp(`\\b(${w})`, "gi"), "<mark>$1</mark>"); });
    const el = document.createElement("div");
    el.className = "result";
    el.innerHTML = `<div class="rhead"><h3>${d.title}</h3><span class="score">score ${t.score.toFixed(3)}</span></div><div class="rsrc">${d.id} · ${d.source}</div><p>${snippet}</p>`;
    res.appendChild(el);
  });
}
$("#search-btn").onclick = () => runSearch($("#search-input").value);
$("#search-input").addEventListener("keydown", e => { if (e.key === "Enter") runSearch(e.target.value); });

/* ============================================================
   ASSISTANT — shared chat + trace rendering
   ============================================================ */
const chatLog = $("#chat-log"), traceBody = $("#trace-body");
let busy = false;

function addMsg(text, who, thinking = false) {
  const el = document.createElement("div");
  el.className = `msg ${who}${thinking ? " thinking" : ""}`;
  el.textContent = text;
  chatLog.appendChild(el);
  chatLog.scrollTop = chatLog.scrollHeight;
  return el;
}
function clearTrace() { traceBody.innerHTML = ""; }
const ICONS = { intent: "🎯", plan: "🧭", tool: "⚙️", approval: "✋", respond: "💬" };

function addTraceStep(step) {
  const el = document.createElement("div");
  el.className = `tstep ${step.type}`;
  const sys = step.system ? `<span class="tsys">${step.system}</span>` : "";
  const label = step.label || (step.type === "tool" ? step.call.split("(")[0] + "()" : step.type);
  el.innerHTML = `<div class="trow"><div class="ticon">${ICONS[step.type] || "•"}</div><div class="tlabel">${label}</div>${sys}</div><div class="tdetail"></div>`;
  const det = el.querySelector(".tdetail");
  if (step.detail) det.innerHTML += `<div>${step.detail}</div>`;
  if (step.call) det.innerHTML += `<code>→ ${step.call}</code>`;
  if (step.result) det.innerHTML += `<code>← ${step.result}</code>`;
  if (step.note) det.innerHTML += `<div class="note">${step.note}</div>`;
  el.querySelector(".trow").onclick = () => el.classList.toggle("open");
  if (step.type !== "tool") el.classList.add("open");
  traceBody.appendChild(el);
  traceBody.scrollTop = traceBody.scrollHeight;
  return el;
}

function addApprovalGate(step) {
  return new Promise(resolve => {
    const el = addTraceStep({ type: "approval", label: step.label, detail: step.detail });
    const box = document.createElement("div");
    box.className = "approve-box";
    box.innerHTML = `<b>Human-in-the-loop gate</b><div class="small muted" style="margin-top:4px">This action is policy-gated. The agent pauses until you decide.</div>
      <div class="btns"><button class="approve-yes">Approve</button><button class="approve-no">Deny</button></div>`;
    el.appendChild(box);
    traceBody.scrollTop = traceBody.scrollHeight;
    box.querySelector(".approve-yes").onclick = () => {
      box.innerHTML = `<b style="color:var(--green)">✓ Approved</b><div class="small muted" style="margin-top:4px">${step.approveNote || "Approved by Andrew Mairena — written to audit log."}</div>`;
      resolve(true);
    };
    box.querySelector(".approve-no").onclick = () => {
      box.innerHTML = `<b style="color:var(--red)">✕ Denied</b><div class="small muted" style="margin-top:4px">Action skipped. The agent re-plans without it; denial is logged.</div>`;
      resolve(false);
    };
  });
}
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ---------------- Scripted scenario player ---------------- */
async function runScenario(id) {
  if (busy) return;
  const s = D.scenarios.find(x => x.id === id);
  if (!s) return;
  busy = true;
  addMsg(s.userText, "user");
  clearTrace();
  const think = addMsg("Working on it — watch the agent trace →", "bot", true);
  let denied = false;
  for (const step of s.trace) {
    await sleep(step.type === "tool" ? 750 : 500);
    if (step.type === "approval") {
      const ok = await addApprovalGate(step);
      if (!ok) denied = true;
    } else if (step.type === "respond") {
      await sleep(400);
      think.remove();
      let text = step.text;
      if (denied) text = "Done, with one exception — you denied an approval gate, so I skipped that step and noted it in the log. Everything else completed:\n\n" + text;
      addMsg(text, "bot");
      addTraceStep({ type: "respond", label: "Final response delivered", detail: "Grounded in tool results above. Full run written to audit log." });
    } else {
      addTraceStep(step);
    }
  }
  busy = false;
}

/* ---------------- Input routing ---------------- */
function matchScenario(text) {
  const t = text.toLowerCase();
  let best = null, bestHits = 0;
  D.scenarios.forEach(s => {
    const hits = s.triggers.filter(tr => t.includes(tr)).length;
    if (hits > bestHits) { bestHits = hits; best = s; }
  });
  return best;
}

async function handleUserMessage(text) {
  if (busy || !text.trim()) return;
  if (LIVE.enabled) return runLive(text);
  const s = matchScenario(text);
  if (s) return runScenario(s.id);
  // ticket status special-case
  if (/ticket|monitor|itsm/i.test(text)) {
    busy = true;
    addMsg(text, "user"); clearTrace();
    addTraceStep({ type: "intent", label: "Intent understood", detail: "Status lookup on the employee's open ticket." });
    await sleep(600);
    addTraceStep({ type: "tool", system: "ServiceNow ITSM", call: "get_ticket('ITSM-20447')", result: '{ "status": "In Progress", "note": "Replacement dock ordered", "eta": "Jun 12" }' });
    await sleep(600);
    addMsg("Your ticket ITSM-20447 (monitor flickering at dock) is In Progress — IT diagnosed a faulty dock and ordered a replacement, ETA Jun 12. I'll message you when it ships and close the ticket once you confirm the fix. 📋", "bot");
    addTraceStep({ type: "respond", label: "Final response delivered" });
    busy = false;
    return;
  }
  addMsg(text, "user");
  addMsg(D.fallback.text, "bot");
}

$("#chat-send").onclick = () => { const v = $("#chat-input").value; $("#chat-input").value = ""; handleUserMessage(v); };
$("#chat-input").addEventListener("keydown", e => { if (e.key === "Enter") { const v = e.target.value; e.target.value = ""; handleUserMessage(v); } });

(() => {
  const wrap = $("#chat-chips");
  D.scenarios.forEach(s => {
    const c = document.createElement("button");
    c.className = "chip"; c.textContent = s.chip;
    c.onclick = () => runScenario(s.id);
    wrap.appendChild(c);
  });
  addMsg("Hi Andrew 👋 I'm your work assistant — I can answer anything from company knowledge and take real actions across IT, HR, payroll, and facilities, with approvals where policy requires. Try a suggestion below, and watch the agent trace panel to see exactly how I work.", "bot");
})();

/* ============================================================
   LIVE MODE — real agentic loop against mock tools (BYOK)
   ============================================================ */
const LIVE = { enabled: false, key: "", model: "claude-sonnet-4-6" };

$("#gear-btn").onclick = () => $("#modal-bg").classList.add("open");
$("#modal-off").onclick = () => { LIVE.enabled = false; setLivePill(); $("#modal-bg").classList.remove("open"); };
$("#modal-save").onclick = () => {
  const k = $("#api-key").value.trim();
  if (!k) { alert("Paste an API key first, or choose scripted mode."); return; }
  LIVE.key = k; LIVE.model = $("#api-model").value.trim() || "claude-sonnet-4-6"; LIVE.enabled = true;
  setLivePill(); $("#modal-bg").classList.remove("open");
};
$("#modal-bg").addEventListener("click", e => { if (e.target.id === "modal-bg") $("#modal-bg").classList.remove("open"); });
function setLivePill() {
  $("#live-dot").classList.toggle("on", LIVE.enabled);
  $("#live-label").textContent = LIVE.enabled ? `Live mode · ${LIVE.model}` : "Scripted demo mode";
}

/* --- Tool definitions exposed to the model --- */
const TOOLS = [
  { name: "search_kb", description: "Permission-aware semantic search over company knowledge (IT KB, HR policy, payroll, facilities, security). Returns top documents with ids. ALWAYS cite doc ids in your answer.", input_schema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
  { name: "get_employee", description: "Get the current employee's profile: role, manager, devices, open tickets, PTO balance, 401k contribution, new hires, pending approvals.", input_schema: { type: "object", properties: {} } },
  { name: "get_pto_balance", description: "Get PTO balance and accrual for the current employee.", input_schema: { type: "object", properties: {} } },
  { name: "submit_pto", description: "Submit a PTO request. SENSITIVE: triggers an approval gate in the UI.", input_schema: { type: "object", properties: { date: { type: "string" }, days: { type: "number" } }, required: ["date", "days"] } },
  { name: "run_diagnostics", description: "Run device diagnostics on the employee's laptop.", input_schema: { type: "object", properties: {} } },
  { name: "create_ticket", description: "Create an ITSM ticket. SENSITIVE: triggers an approval gate in the UI.", input_schema: { type: "object", properties: { title: { type: "string" }, details: { type: "string" } }, required: ["title"] } },
  { name: "order_hardware", description: "Order hardware (laptop/peripherals). SENSITIVE: triggers approval gate; upgrades need manager approval per policy.", input_schema: { type: "object", properties: { item: { type: "string" }, justification: { type: "string" } }, required: ["item"] } },
  { name: "provision_access", description: "Grant an application access via Okta groups. SENSITIVE: triggers an approval gate.", input_schema: { type: "object", properties: { user: { type: "string" }, application: { type: "string" }, justification: { type: "string" } }, required: ["user", "application"] } },
  { name: "schedule_event", description: "Create a calendar event for the employee.", input_schema: { type: "object", properties: { title: { type: "string" }, date: { type: "string" } }, required: ["title", "date"] } }
];
const SENSITIVE = new Set(["submit_pto", "create_ticket", "order_hardware", "provision_access"]);

async function execTool(name, input) {
  const p = D.persona;
  switch (name) {
    case "search_kb": {
      const lex = bm25(input.query || "");
      const maxLex = Math.max(...lex.map(x => x.score), 1e-9);
      let fused = lex.map(x => ({ i: x.i, score: x.score / maxLex }));
      if (embedder && docVecs) {
        const qe = await embedder(input.query, { pooling: "mean", normalize: true });
        const qv = Array.from(qe.data);
        fused = lex.map((x, i) => ({ i, score: 0.45 * (x.score / maxLex) + 0.55 * Math.max(0, cosine(qv, docVecs[i])) }));
      }
      fused.sort((a, b) => b.score - a.score);
      return fused.slice(0, 3).map(t => { const d = D.corpus[t.i]; return { id: d.id, title: d.title, source: d.source, text: d.text }; });
    }
    case "get_employee": return { name: p.name, title: p.title, dept: p.dept, manager: p.manager, employeeId: p.employeeId, location: p.location, devices: p.devices, openTickets: p.openTickets, ptoBalanceDays: p.ptoBalanceDays, current401kContribution: "4%", newHire: p.newHire, pendingApprovals: p.pendingApprovals };
    case "get_pto_balance": return { available_days: p.ptoBalanceDays, accrual_per_month: 1.67, carryover_max_days: 5, policy: "Requests under 3 days auto-approve if team coverage is met (HR-201)." };
    case "submit_pto": return { request: "PTO-" + Math.floor(5000 + Math.random() * 999), status: "submitted", date: input.date, days: input.days, manager_notified: true };
    case "run_diagnostics": return { device: "LT-9931", disk_free_gb: 41, memory_pressure: "high (avg 92%)", os_updates_pending: 0, age_months: 31, refresh_eligible: true };
    case "create_ticket": return { ticket: "ITSM-" + Math.floor(20000 + Math.random() * 999), status: "Open", title: input.title };
    case "order_hardware": return { order: "HW-" + Math.floor(7000 + Math.random() * 999), item: input.item, eta: "3-5 business days" };
    case "provision_access": return { queued: true, user: input.user, application: input.application, audit_event: "AE-" + Math.floor(100000 + Math.random() * 9999) };
    case "schedule_event": return { created: true, title: input.title, date: input.date };
    default: return { error: "unknown tool" };
  }
}

const SYSTEM_PROMPT = `You are the employee-facing AI assistant at Aurora Dynamics (a fictional demo company) — the "front door" for everything at work. The current user is Andrew Mairena, Principal Inbound Product Manager — AI Assistant, Employee Experience · Moveworks at ServiceNow, Santa Clara CA, employee AD-48291, manager Elena Voss.

Rules:
- Use tools to ground every factual answer; cite KB doc ids (e.g. HR-202) when you used search_kb.
- Prefer acting over explaining how to act, but sensitive actions (PTO, tickets, hardware, access) pass through a human approval gate the UI enforces — if a tool result shows approved_by_user:false, do not retry; acknowledge and move on.
- Be concise, warm, and concrete. Plain text only (no markdown headers). End with one proactive, genuinely useful suggestion when natural.
- If asked something outside the mock company's scope, say what you'd need and answer best-effort. Never invent policy numbers or doc ids.`;

async function runLive(text) {
  busy = true;
  addMsg(text, "user");
  clearTrace();
  const think = addMsg("Thinking (live agentic loop)…", "bot", true);
  addTraceStep({ type: "intent", label: "Live mode — real model planning", detail: `Sending to ${LIVE.model} with ${TOOLS.length} typed tools. The loop below is real: the model decides which tools to call; this page executes them against mock systems.` });

  const messages = [{ role: "user", content: text }];
  try {
    for (let turn = 0; turn < 8; turn++) {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": LIVE.key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: LIVE.model, max_tokens: 1200, system: SYSTEM_PROMPT, tools: TOOLS, messages })
      });
      if (!resp.ok) throw new Error(`API ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
      const data = await resp.json();
      messages.push({ role: "assistant", content: data.content });

      const toolUses = data.content.filter(c => c.type === "tool_use");
      const textPart = data.content.filter(c => c.type === "text").map(c => c.text).join("\n").trim();

      if (data.stop_reason !== "tool_use") {
        think.remove();
        addMsg(textPart || "(no text returned)", "bot");
        addTraceStep({ type: "respond", label: "Final response delivered", detail: "Loop complete. In production every step above becomes an audit event." });
        busy = false;
        return;
      }

      const results = [];
      for (const tu of toolUses) {
        let approved = true;
        if (SENSITIVE.has(tu.name)) {
          approved = await addApprovalGate({ label: `Approval needed: ${tu.name}(${JSON.stringify(tu.input).slice(0, 80)})`, detail: "Live mode enforces the same human-in-the-loop policy gates as scripted mode. The model is paused awaiting your decision." });
        }
        const out = approved ? await execTool(tu.name, tu.input) : { approved_by_user: false, note: "User denied this action at the approval gate." };
        if (approved && SENSITIVE.has(tu.name)) out.approved_by_user = true;
        addTraceStep({ type: "tool", system: "mock " + tu.name, call: `${tu.name}(${JSON.stringify(tu.input)})`, result: JSON.stringify(out).slice(0, 400) });
        results.push({ type: "tool_result", tool_use_id: tu.id, content: JSON.stringify(out) });
      }
      messages.push({ role: "user", content: results });
    }
    throw new Error("Loop limit reached (8 turns)");
  } catch (err) {
    think.remove();
    addMsg(`Live mode error: ${err.message}\n\nFalling back is easy — switch to scripted mode via ⚙️, or check the key/model and try again.`, "bot");
    busy = false;
  }
}

/* ============================================================
   PM BRIEF content
   ============================================================ */
$("#brief-content").innerHTML = `
<h2>1 · The thesis: win the front door</h2>
<p>Every employee question or task today starts in one of a dozen places — a search bar, a Slack ping to IT, a Workday menu, a ticket form, a hallway ask. Whoever consolidates that first step owns the most valuable real estate in enterprise software: <b>the place where intent enters the system</b>. EmployeeWorks' stated mission — be the daily assistant for all employees — is a land-grab for that real estate.</p>
<div class="callout">A chat window alone can't win it. Chat is pull-only, ephemeral, and blank-page. The Web surface is the strategic unlock: <b>persistent</b> (a tab that stays open), <b>proactive</b> (cards from live system signals — see the Home view), and <b>composable</b> (search + actions + approvals + status in one place). The browser start-page is the beachhead; the assistant is the engine behind it.</div>
<p>The compounding loop: more front-door entries → more intent data → better retrieval and action models → higher autonomous-resolution rate → more trust → more entries. Distribution feeds quality feeds distribution.</p>

<h2>2 · Why this player can win</h2>
<p>The differentiated asset is the <b>action layer</b>. Competitors largely answer; this platform can <i>finish</i> — connect intent to governed action across any system, with workflow infrastructure that 8,100+ enterprises (85% of the Fortune 500) already trust for exactly this kind of orchestration, approval routing, and audit evidence. Conversational AI + enterprise search (Moveworks DNA) fused with autonomous workflows (platform DNA) is a combination none of the named competitors fully has.</p>
<table>
  <tr><th></th><th>This platform (EmployeeWorks)</th><th>Glean Agent Builder</th><th>Microsoft Workflows Agent</th><th>Google Workspace Studio</th></tr>
  <tr><td><b>Center of gravity</b></td><td>Action & workflow — intent → governed execution</td><td>Search & knowledge — best-in-class indexing</td><td>Distribution — bundled with M365/Teams</td><td>Workspace-native context (Docs/Gmail)</td></tr>
  <tr><td><b>Strength</b></td><td>Deep ITSM/HR workflow rails, approval & audit machinery, cross-system reach, install base</td><td>Connector breadth, retrieval quality, developer-friendly agent builder</td><td>Ubiquity, price bundling, Copilot habit formation</td><td>Native access to where documents live; consumer-grade UX</td></tr>
  <tr><td><b>Structural gap</b></td><td>Must prove daily-habit UX beyond ticket deflection</td><td>Thin action/write layer; governance of agents at scale</td><td>Weak outside the Microsoft graph; fragmented agent story</td><td>Limited enterprise system reach (ITSM/HR depth)</td></tr>
  <tr><td><b>Our play against</b></td><td>—</td><td>Match retrieval “good enough,” win on actions actually completing</td><td>Be the cross-stack front door Copilot can't be (most enterprises are hybrid)</td><td>Win the work-systems layer; coexist on content</td></tr>
</table>
<p class="small dim">Honest risk: Microsoft's distribution is the existential threat — "good enough + free-ish" wins defaults. Counter: the front door must save measurable time in week one (instant-win journeys below) and land where Microsoft is weakest — actions across non-Microsoft systems.</p>

<h2>3 · What I'd ship first (and why these four journeys)</h2>
<p>The four scenarios in this prototype aren't random — they're chosen on a <b>frequency × completion-value × autonomy-feasibility</b> screen: <b>① New-hire onboarding</b> (low frequency, massive value, showcases multi-system orchestration + approval gates — the "wow" that sells the platform to buyers). <b>② Device support</b> (high frequency, diagnostics-first flow proves the agent reasons before acting). <b>③ PTO</b> (the habit-former — everyone does it, auto-approval policy makes it feel magical). <b>④ Policy Q&A</b> (the trust-builder — grounded, cited answers are the safest first interaction). One flagship, one workhorse, one habit, one trust anchor.</p>

<h2>4 · Success metrics</h2>
<div class="metric-grid">
  <div class="metric"><div class="mname">Front-Door Capture Rate ★</div><p>North star: % of employee service interactions (tickets, HR cases, searches, requests) that <i>begin</i> at the assistant surface. Measures the land-grab directly.</p></div>
  <div class="metric"><div class="mname">Weekly Active Employees %</div><p>Reach. A daily assistant that 8% of employees touch isn't a front door — target >60% WAU within 6 months of a deployment.</p></div>
  <div class="metric"><div class="mname">Autonomous Resolution Rate</div><p>% of journeys completed end-to-end with no human agent — the economic engine (deflection $) and the quality bar that gates expansion to new journey types.</p></div>
  <div class="metric"><div class="mname">Time-to-Resolution Delta</div><p>Median minutes vs. the legacy path per journey (e.g. PTO: 2 days → 40 seconds). The stat that sells renewals.</p></div>
  <div class="metric"><div class="mname">Search Success Rate</div><p>% of searches ending in a click/answer-accept without reformulation; plus answer citation-coverage (every claim grounded).</p></div>
  <div class="metric"><div class="mname">Trust & Safety</div><p>Approval-gate precision (% of gated actions users approve — too low = annoying, too high = gates miscalibrated), action error rate, audit completeness: 100%, non-negotiable.</p></div>
</div>
<p class="small dim">Counter-metric watch: deflection without satisfaction (CSAT on autonomous journeys must match human-handled), and capture without completion (front door that dead-ends erodes trust faster than no front door).</p>

<h2>5 · Eval harness — how we ship model-backed features safely</h2>
<p>Agentic products fail silently and embarrassingly; the eval harness is the real product spec. Four layers, run as CI gates on every model/prompt/retrieval change:</p>
<p><b>① Retrieval evals</b> — golden query→doc set per customer vertical; recall@5, MRR, permission-leak tests (the assistant must never retrieve what the user can't see — a single leak is a sev-1). <b>② Answer evals</b> — LLM-as-judge rubrics for groundedness (every claim traceable to a retrieved doc), citation accuracy, tone; human-labeled calibration set refreshed monthly. <b>③ Action evals</b> — simulated-enterprise sandbox (like this demo's mock tools, industrialized): plan-quality scoring, tool-call correctness, approval-gate compliance (the agent must never bypass a gate), destructive-action red-teaming. <b>④ Journey evals</b> — end-to-end task completion on scripted scenarios with injected failures (API timeouts, permission denials, ambiguous user replies) — the agent's recovery behavior is scored, not just its happy path.</p>
<div class="callout">Shipping rule: no feature graduates from design-partner to GA until autonomous-resolution ≥ target on the journey eval AND zero permission leaks across 10k adversarial retrievals. Regressions block deploy, same as failing unit tests.</div>

<h2>6 · Rollout strategy</h2>
<p><b>Phase 0 — dogfood</b> (internal, 4–6 wks): every employee on the new surface; instrument everything; fix the top-20 intent gaps. <b>Phase 1 — design partners</b> (5–8 customers across verticals): co-design the proactive-cards signal library; weekly journey-eval reviews; name a champion metric per customer (e.g. "IT ticket volume −30%"). <b>Phase 2 — tiered GA</b>: read-only journeys (search, status, policy Q&A) default-on; write-actions opt-in per connector with admin-controlled policy gates; expansion driven by the autonomous-resolution quality bar, not the sales calendar. <b>Phase 3 — habit</b>: browser start-page placement, proactive cards, and the morning-digest moment — the features that turn a tool into a default.</p>
<p>Change management is product work here: admin trust console (what can the agent do, to whom, with what evidence), per-journey kill switches, and a "show the work" trace UI (← the glass-box panel in this demo) ship <i>with</i> v1, not after.</p>

<h2>7 · Open questions I'd bring to the team</h2>
<p>① Where's the line between the standalone Moveworks surface and the platform's native UX — one front door or two during migration? ② Proactive cards: push too hard and it's clippy, too soft and no habit — what's the signal-quality bar for interrupting someone's day? ③ Speech and ambient capture are in the JD's skill list — is voice a v1 bet for deskless workers (huge underserved segment) or a fast-follow? ④ How do we price front-door value — per-seat assistant, per-resolution, or platform pull-through?</p>
`;

/* ============================================================
   ABOUT content
   ============================================================ */
$("#about-content").innerHTML = `
<p>Hi — I'm <b>Gaurav Mehta</b>, a Staff Product Manager at Intuit working on agentic AI and GTM/MarTech platforms. I built this working prototype for the <b>Principal Inbound Product Manager — AI Assistant (Employee Experience), Moveworks</b> role, because the best way to show how I think about a product is to ship a small version of it.</p>
<p><b>What this demo is:</b> a concept of the "front door" Web surface the role owns — universal ask bar, proactive cards generated from system signals, an agentic assistant with a glass-box trace (plan → tool calls → policy gates → human approvals → grounded answer), hybrid enterprise search with <i>real semantic embeddings running in your browser</i> (MiniLM via transformers.js — no server), a governed connector registry, and the PM brief with the strategy, metrics, eval harness, and rollout plan behind it.</p>
<p><b>What's real vs. simulated:</b> the search engine (BM25 + 384-dim embeddings + fusion) is real and runs client-side. The agentic flows are scripted by default so the demo works with zero setup; flip on <b>Live Mode</b> (⚙️, bring your own Anthropic key) and the assistant becomes a real agentic loop — the model plans and calls the same typed mock tools, pauses at the same approval gates. All company data is fictional. Static site, zero backend, hosted on GitHub Pages.</p>
<p><b>Why I built it this way:</b> my day job is shipping this pattern in production — a multi-agent marketing-operations platform (10,000× campaign-launch acceleration), custom MCP servers, LLM-as-judge eval pipelines and CI regression gates, RAG assistants with permission-aware retrieval, and human-in-the-loop guardrails for irreversible actions. The trace panel, approval gates, and eval-first PM brief in this demo are lifted from how that system actually works.</p>
<p style="margin-top:18px">
  📬 <a href="mailto:gaurav.rs.mehta@gmail.com">gaurav.rs.mehta@gmail.com</a> ·
  💼 <a href="https://www.linkedin.com/in/gamehta" target="_blank" rel="noopener">linkedin.com/in/gamehta</a> ·
  🌐 <a href="https://gmehta.github.io/GMEHTA-AI-PM" target="_blank" rel="noopener">Portfolio & AI PM work</a>
</p>
<p class="disclaimer">This is an independent concept demo created as part of a job application. It is not affiliated with, endorsed by, or built on ServiceNow or Moveworks IP. "Aurora Dynamics" and all people, policies, and data are fictional.</p>
`;
