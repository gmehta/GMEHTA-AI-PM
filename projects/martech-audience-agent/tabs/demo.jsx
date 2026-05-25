// Live agent demo with traceability
const { useState: useStateD, useEffect: useEffectD, useRef: useRefD } = React;

function Demo() {
  const { DEMO_PROMPT, TRACE_STEPS, LINEAGE, SEGMENT_NAME, SEGMENT_SIZE } = window.AUDIENCE_AGENT;

  const [phase, setPhase] = useStateD("idle");
    // idle → running → awaitingApproval → approved → pushed
  const [activeStepIdx, setActiveStepIdx] = useStateD(-1);
  const [doneSteps, setDoneSteps] = useStateD([]);
  const [input, setInput] = useStateD("");
  const [chat, setChat] = useStateD([]);
  const [traceTab, setTraceTab] = useStateD("trace");
  const [tokens, setTokens] = useStateD(0);
  const [latency, setLatency] = useStateD(0);
  const [cost, setCost] = useStateD(0);
  const traceRef = useRefD(null);
  const chatRef = useRefD(null);

  // autoscroll
  useEffectD(() => {
    if (traceRef.current) traceRef.current.scrollTop = traceRef.current.scrollHeight;
  }, [activeStepIdx, phase]);
  useEffectD(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat, phase]);

  const startRun = (promptText) => {
    if (phase === "running") return;
    setPhase("running");
    setDoneSteps([]);
    setActiveStepIdx(-1);
    setTokens(0); setLatency(0); setCost(0);
    setChat([
      { who: "user", text: promptText },
      { who: "agent", text: "Got it — let me work through this step by step.", thinking: true },
    ]);

    // play through steps
    let i = 0;
    const playNext = () => {
      if (i >= TRACE_STEPS.length) {
        // finished steps → awaiting approval
        setActiveStepIdx(-1);
        setChat((c) => [
          ...c.filter(m => !m.thinking),
          { who: "agent", text: `Done. I matched **84,217 customers** for "${SEGMENT_NAME}". Ready for your approval before I push to the CDP — see the trace panel for the full reasoning chain and data lineage.` },
        ]);
        setPhase("awaitingApproval");
        return;
      }
      setActiveStepIdx(i);
      const step = TRACE_STEPS[i];
      // simulate per-step latency (sped up)
      const sim = Math.max(300, step.time * 0.35);
      setTimeout(() => {
        setDoneSteps((d) => [...d, step.id]);
        // increment telemetry
        setTokens((t) => t + 180 + Math.floor(Math.random() * 220));
        setLatency((l) => l + sim);
        setCost((c) => c + (0.0008 + Math.random() * 0.0015));
        i += 1;
        playNext();
      }, sim);
    };
    setTimeout(playNext, 350);
  };

  const approve = () => {
    setPhase("approved");
    setTimeout(() => {
      setChat((c) => [...c, {
        who: "agent",
        text: `Approved. Writing segment "${SEGMENT_NAME}" to the CDP… ✓ Done. Audience ID: \`aud_8s2k_lapsed_prem_v3\`. It'll be available in your activation channels in ~2 min.`
      }]);
      setPhase("pushed");
    }, 900);
  };
  const revise = () => {
    setChat((c) => [...c, {
      who: "agent",
      text: "No problem. What should I change? E.g. extend the lapsed window, include SMS-consented users, or split into A/B holdouts."
    }]);
    setPhase("idle");
  };

  const reset = () => {
    setPhase("idle");
    setActiveStepIdx(-1);
    setDoneSteps([]);
    setChat([]);
    setTokens(0); setLatency(0); setCost(0);
  };

  return (
    <div className="section" data-screen-label="04 Demo">
      <div className="section-head">
        <div>
          <div className="eyebrow">03 — See it</div>
          <h2 className="h1" style={{marginTop:16}}>
            Ask in English.<br/>Watch it think out loud.
          </h2>
        </div>
        <div className="meta">
          LIVE PROTOTYPE<br/>
          sandbox · demo data only<br/>
          {phase === "pushed" ? "✓ pushed" : phase === "awaitingApproval" ? "● awaiting approval" : phase === "running" ? "● running" : "○ idle"}
        </div>
      </div>

      <div className="demo-shell">
        {/* chat */}
        <div className="chat-panel">
          <div className="panel-head">
            <div className="panel-title">
              <span className="dot-live"></span>
              Audience Agent · chat
            </div>
            <button className="btn ghost" onClick={reset} style={{fontSize:11, padding:"4px 10px"}}>↺ reset</button>
          </div>

          <div className="chat-body" ref={chatRef}>
            {chat.length === 0 && (
              <EmptyState onPick={(p) => { setInput(p); startRun(p); }} />
            )}
            {chat.map((m, i) => (
              <Msg key={i} m={m} />
            ))}
            {phase === "running" && <ThinkingDots />}
          </div>

          {chat.length === 0 && (
            <div className="preset-row">
              <button className="preset" onClick={() => { setInput(DEMO_PROMPT); startRun(DEMO_PROMPT); }}>
                ▸ run the demo prompt
              </button>
              <button className="preset" onClick={() => { const p="Loyalty members in NYC with 3+ orders in last 90d"; setInput(p); startRun(p); }}>
                ▸ loyalty · NYC · frequent
              </button>
              <button className="preset" onClick={() => { const p="Cart abandoners with high churn risk score, SMS-consented"; setInput(p); startRun(p); }}>
                ▸ cart abandon · SMS
              </button>
            </div>
          )}

          <div className="chat-input">
            <textarea
              placeholder={phase === "running" ? "Agent is thinking…" : "Describe the audience you want…"}
              value={input}
              disabled={phase === "running"}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && phase !== "running") startRun(input.trim());
                }
              }}
            />
            <button
              className="btn primary"
              disabled={phase === "running" || !input.trim()}
              onClick={() => input.trim() && startRun(input.trim())}
            >
              {phase === "running" ? "…" : "Send"}
            </button>
          </div>
        </div>

        {/* trace */}
        <div className="trace-panel">
          <div className="panel-head">
            <div className="panel-title">
              <span style={{
                width:8, height:8, borderRadius:50, background:"var(--accent)"
              }}></span>
              Reasoning trace · explainability
            </div>
            <div className="mono" style={{color:"var(--ink-3)", fontSize:11}}>
              run · {phase === "idle" ? "—" : "r_8s2k"}
            </div>
          </div>

          <div className="trace-tabs">
            {[
              { id: "trace", label: "Trace", c: TRACE_STEPS.length },
              { id: "lineage", label: "Data lineage", c: LINEAGE.length },
              { id: "ontology", label: "Ontology", c: 12 },
            ].map(t => (
              <button
                key={t.id}
                className={"ttab" + (traceTab === t.id ? " active" : "")}
                onClick={() => setTraceTab(t.id)}
              >
                {t.label}<span className="c">{t.c}</span>
              </button>
            ))}
          </div>

          <div className="trace-body" ref={traceRef}>
            {traceTab === "trace" && (
              <>
                {TRACE_STEPS.map((s, i) => (
                  <TraceStep
                    key={s.id}
                    step={s}
                    state={
                      doneSteps.includes(s.id) ? "done" :
                      activeStepIdx === i ? "active" : "pending"
                    }
                  />
                ))}
                {phase === "awaitingApproval" || phase === "approved" || phase === "pushed" ? (
                  <>
                    <SegmentSummary
                      name={SEGMENT_NAME}
                      size={SEGMENT_SIZE}
                      pushed={phase === "pushed"}
                    />
                    {phase === "awaitingApproval" && (
                      <HITLCard onApprove={approve} onRevise={revise} />
                    )}
                  </>
                ) : null}
              </>
            )}

            {traceTab === "lineage" && (
              <div style={{padding:"20px"}}>
                <div className="body" style={{marginBottom:16, fontSize:13}}>
                  Every attribute the agent used, traced back to its source system with a confidence score.
                </div>
                <div className="lineage">
                  {LINEAGE.map((l, i) => (
                    <div key={i} className="l-row">
                      <span className="src">{l.src}</span>
                      <span className="field">{l.field}</span>
                      <span className="conf">conf {l.conf}</span>
                    </div>
                  ))}
                </div>

                <div style={{marginTop:32}}>
                  <div className="eyebrow" style={{marginBottom:12}}>SAMPLE PROFILES (5/84,217)</div>
                  <SampleTable />
                </div>
              </div>
            )}

            {traceTab === "ontology" && (
              <div style={{padding:"20px"}}>
                <div className="body" style={{marginBottom:16, fontSize:13}}>
                  Concepts the agent resolved during this run — the graph walk that turned plain English into a query.
                </div>
                <OntologyResolutions />
              </div>
            )}
          </div>

          <div className="metric-strip">
            <div className="metric">
              <div className="l">Latency</div>
              <div className="v">{latency ? (latency/1000).toFixed(2) : "—"}s</div>
            </div>
            <div className="metric">
              <div className="l">Tokens</div>
              <div className="v">{tokens ? tokens.toLocaleString() : "—"}</div>
            </div>
            <div className="metric">
              <div className="l">Cost (est)</div>
              <div className="v">{cost ? "$" + cost.toFixed(4) : "—"}</div>
            </div>
            <div className="metric">
              <div className="l">KG hits</div>
              <div className="v">{doneSteps.length ? doneSteps.length * 7 : "—"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mono" style={{
        marginTop:16, color:"var(--ink-3)", fontSize:11, textAlign:"center",
      }}>
        EVERY STEP IS LOGGED · EVERY QUERY IS REPRODUCIBLE · NO WRITE WITHOUT APPROVAL
      </div>
    </div>
  );
}

function Msg({ m }) {
  // render bold **text**
  const parts = m.text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <div className={"msg " + (m.who === "user" ? "user" : "agent")}>
      <div className="who">{m.who === "user" ? "marketer" : "audience agent"}</div>
      <div className={"bubble" + (m.thinking ? " thinking" : "")}>
        {parts.map((p, i) => {
          if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2,-2)}</strong>;
          if (p.startsWith("`") && p.endsWith("`")) return <code key={i} style={{fontFamily:"var(--mono)", fontSize:12, background:"rgba(0,0,0,0.08)", padding:"1px 5px", borderRadius:3}}>{p.slice(1,-1)}</code>;
          return <span key={i}>{p}</span>;
        })}
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="msg agent">
      <div className="who">audience agent</div>
      <div className="bubble thinking" style={{display:"flex", gap:4, alignItems:"center"}}>
        thinking
        <span style={{display:"inline-flex", gap:3, marginLeft:6}}>
          <Dot d={0}/><Dot d={0.2}/><Dot d={0.4}/>
        </span>
      </div>
    </div>
  );
}
function Dot({ d }) {
  return (
    <span style={{
      width:5, height:5, borderRadius:"50%",
      background:"var(--accent-deep)",
      animation: `bob 1s ${d}s infinite ease-in-out`,
      display:"inline-block",
    }}></span>
  );
}

function EmptyState({ onPick }) {
  return (
    <div style={{
      flex:1,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      textAlign:"center", padding:"40px 20px",
    }}>
      <div style={{
        width:48, height:48, borderRadius:"50%",
        background:"var(--bg-elev)", border:"1px solid var(--rule)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:22, marginBottom:16,
      }}>◐</div>
      <div style={{fontFamily:"var(--serif)", fontSize:26, lineHeight:1.15, letterSpacing:"-0.005em"}}>
        Describe your audience.
      </div>
      <div style={{fontSize:13, color:"var(--ink-3)", marginTop:8, maxWidth:"32ch"}}>
        Plain English. The agent will plan, query the graph, and ask you to approve before pushing to the CDP.
      </div>
    </div>
  );
}

function TraceStep({ step, state }) {
  const showDetail = state !== "pending";
  return (
    <div className={"trace-step " + state}>
      <div className="marker"></div>
      <div>
        <div className="title-row">
          <div>
            <span className="t-kind">{step.kind}</span>
            <div className="t-title" style={{marginTop:2}}>{step.title}</div>
          </div>
        </div>
        {showDetail && (
          <>
            <div className="t-body">{step.body}</div>
            {step.code && <CodeBlock parts={step.code} />}
            {step.kv && (
              <div className="kv-list">
                {step.kv.map((kv, i) => (
                  <div key={i} className="kv">
                    <span className="k">{kv.k}</span>
                    <span className="v">{kv.v}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="t-time">{showDetail ? step.time + "ms" : ""}</div>
    </div>
  );
}

function CodeBlock({ parts }) {
  return (
    <div className="code-block">
      {parts.map((p, i) => (
        <span key={i} className={p.type !== "t" ? p.type : undefined}>{p.text}</span>
      ))}
    </div>
  );
}

function HITLCard({ onApprove, onRevise }) {
  return (
    <div className="hitl-card">
      <div className="h">
        <div className="t">🔒 Human-in-the-loop · approval required</div>
        <div className="badge">HITL · GATE</div>
      </div>
      <div className="body">
        Agent paused before write. One ontology edge resolved with 94% confidence (subscription↔order)
        — flagging for your sign-off. Nothing has been pushed to the CDP yet.
      </div>
      <div className="hitl-actions">
        <button className="btn accent" onClick={onApprove}>✓ Approve & push</button>
        <button className="btn" onClick={onRevise}>↻ Revise</button>
        <button className="btn ghost">View full diff</button>
      </div>
    </div>
  );
}

function SegmentSummary({ name, size, pushed }) {
  return (
    <div className="segment-summary">
      <div className="top">
        <div>
          <div className="meta">PROPOSED SEGMENT · v1</div>
          <div className="name">{name}</div>
        </div>
        <div className="size">{size}</div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16, marginTop:14}}>
        <SumStat l="% of base" v="2.1%" />
        <SumStat l="Reachable (email)" v="84,217" />
        <SumStat l="Est. revenue lift" v="$112K / mo" />
      </div>
      {pushed && (
        <div style={{
          marginTop:16, paddingTop:14, borderTop:"1px solid rgba(244,239,230,0.2)",
          fontFamily:"var(--mono)", fontSize:11, color:"var(--accent-soft)",
          letterSpacing:"0.08em",
        }}>
          ✓ PUSHED TO CDP · aud_8s2k_lapsed_prem_v3 · {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

function SumStat({ l, v }) {
  return (
    <div>
      <div className="mono" style={{fontSize:10, color:"rgba(244,239,230,0.6)", letterSpacing:"0.1em"}}>{l.toUpperCase()}</div>
      <div style={{fontFamily:"var(--serif)", fontSize:22, marginTop:4}}>{v}</div>
    </div>
  );
}

function SampleTable() {
  const rows = [
    ["cust_8f2", "tier_a", "$4,820", "12d ago", "premium · watches"],
    ["cust_b41", "tier_a", "$6,140", "5d ago",  "premium · jewelry"],
    ["cust_9c7", "tier_a", "$3,290", "2d ago",  "premium · bags"],
    ["cust_e08", "tier_a", "$8,910", "6d ago",  "premium · watches"],
    ["cust_2a3", "tier_a", "$5,505", "4d ago",  "premium · shoes"],
  ];
  return (
    <div style={{
      border:"1px solid var(--rule-soft)", borderRadius:6, overflow:"hidden",
      fontFamily:"var(--mono)", fontSize:11.5,
    }}>
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 0.6fr 0.7fr 0.8fr 1.2fr",
        padding:"8px 12px", background:"var(--bg-elev)",
        borderBottom:"1px solid var(--rule-soft)",
        color:"var(--ink-3)", fontSize:10, letterSpacing:"0.08em",
      }}>
        <span>ID</span><span>LTV</span><span>LTV $</span><span>BROWSE</span><span>CATEGORY</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display:"grid", gridTemplateColumns:"1fr 0.6fr 0.7fr 0.8fr 1.2fr",
          padding:"8px 12px",
          borderBottom: i === rows.length-1 ? "none" : "1px solid var(--rule-soft)",
        }}>
          {r.map((c, j) => <span key={j} style={{color: j === 0 ? "var(--ink)" : "var(--ink-2)"}}>{c}</span>)}
        </div>
      ))}
    </div>
  );
}

function OntologyResolutions() {
  const rows = [
    { phrase: '"high-LTV"', concept: "Customer.ltv_band", path: "Customer → has_attr → LTVBand", conf: "high" },
    { phrase: '"premium tier"', concept: "Product.tier='premium'", path: "Product → has_attr → Tier → premium", conf: "high" },
    { phrase: '"browsed last week"', concept: "PageView.ts > now()-7d", path: "Customer → has_event → PageView", conf: "high" },
    { phrase: '"haven\'t purchased in 60d"', concept: "MAX(Order.created_at) < now()-60d", path: "Customer → has_order → Order", conf: "med" },
    { phrase: '"unsubscribed from email"', concept: "Consent.email_state='opted_out'", path: "Customer → has_consent → Consent", conf: "high" },
  ];
  return (
    <div style={{display:"grid", gap:14}}>
      {rows.map((r, i) => (
        <div key={i} style={{
          padding:14, border:"1px solid var(--rule-soft)", borderRadius:8,
          background:"var(--bg-elev)",
        }}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:6}}>
            <div style={{fontFamily:"var(--serif)", fontStyle:"italic", fontSize:18}}>{r.phrase}</div>
            <span className="mono" style={{
              fontSize:10, padding:"2px 8px",
              background: r.conf === "high" ? "var(--accent-soft)" : "var(--rule-soft)",
              color: r.conf === "high" ? "var(--accent-deep)" : "var(--ink-3)",
              borderRadius:4, letterSpacing:"0.08em",
            }}>conf · {r.conf}</span>
          </div>
          <div className="mono" style={{fontSize:11.5, color:"var(--ink-2)", marginBottom:4}}>→ {r.concept}</div>
          <div className="mono" style={{fontSize:10.5, color:"var(--ink-3)"}}>path · {r.path}</div>
        </div>
      ))}
    </div>
  );
}

window.Demo = Demo;
