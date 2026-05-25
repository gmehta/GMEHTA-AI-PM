// Architecture / "How" tab
function Architecture() {
  const { STACK_LAYERS, FLOW } = window.AUDIENCE_AGENT;

  return (
    <div className="section" data-screen-label="03 Architecture">
      <div className="section-head">
        <div>
          <div className="eyebrow">02 — The How</div>
          <h2 className="h1" style={{marginTop:16}}>
            A planner, a graph,<br/>and a careful door to production.
          </h2>
        </div>
        <div className="meta">
          ARCHITECTURE NOTE<br/>
          stack v0.4 · review with eng<br/>
          last updated · May 2026
        </div>
      </div>

      {/* stack */}
      <div className="stack">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
          <div>
            <div className="eyebrow">STACK</div>
            <h3 className="h2" style={{marginTop:8}}>Five layers, one contract.</h3>
          </div>
          <div className="mono" style={{color:"var(--ink-3)"}}>diagram · simplified</div>
        </div>

        <div className="stack-layers">
          {STACK_LAYERS.map((layer, i) => (
            <div key={i} className="layer">
              <div className="layer-label">{layer.label}</div>
              <div className="layer-row">
                {layer.chips.map((c, j) => (
                  <div key={j} className={"chip" + (c.k ? " " + c.k : "")}>
                    <div className="dot"></div>
                    {c.t}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* flow */}
      <div className="flow" style={{marginTop:24}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
          <div>
            <div className="eyebrow">USE CASE FLOW</div>
            <h3 className="h2" style={{marginTop:8}}>From sentence to segment.</h3>
          </div>
          <div className="mono" style={{color:"var(--ink-3)"}}>happy path · 5 steps</div>
        </div>

        <div className="flow-diagram">
          {FLOW.map((step) => (
            <div key={step.n} className="flow-step">
              <div className="step-n">{step.n}</div>
              <div className="step-t">{step.t}</div>
              <div className="step-d">{step.d}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
        }}>
          <FlowAnnot t="Prompt parsing" sub="natural language" />
          <FlowAnnot t="LLM · GPT-4 class" sub="JSON tool-use" />
          <FlowAnnot t="Cypher / GraphQL" sub="against AKG" />
          <FlowAnnot t="Counts + samples" sub="QA payload" />
          <FlowAnnot t="CDP write API" sub="signed, logged" />
        </div>
      </div>

      {/* KG diagram */}
      <div className="kg-card" style={{marginTop:24}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
          <div>
            <div className="eyebrow">THE AUDIENCE KNOWLEDGE GRAPH</div>
            <h3 className="h2" style={{marginTop:8}}>Concepts, not columns.</h3>
            <p className="body" style={{marginTop:12}}>
              A curated ontology of every customer concept the business cares about. The
              agent walks this graph instead of guessing table names — which is why answers
              are auditable, and why two marketers asking the same question get the same answer.
            </p>
          </div>
          <div className="mono" style={{color:"var(--ink-3)", textAlign:"right"}}>
            nodes · 412<br/>
            edges · 1,108<br/>
            v3.2.1
          </div>
        </div>

        <div className="kg-canvas">
          <KGDiagram />
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16, marginTop:20}}>
          <KGLegend swatch="var(--ink)" label="Entity" detail="Customer, Order, Product" />
          <KGLegend swatch="var(--accent)" label="Attribute" detail="LTV band, channel pref" />
          <KGLegend swatch="var(--steel)" label="Event" detail="PageView, AddToCart" />
          <KGLegend swatch="var(--good)" label="Consent" detail="Email, SMS, push state" />
        </div>
      </div>

      {/* decisions */}
      <div style={{marginTop:80}}>
        <div className="eyebrow">DESIGN DECISIONS · WORTH ARGUING ABOUT</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24, marginTop:24}}>
          <Decision
            n="D-01"
            t="Knowledge graph over RAG"
            chose="Graph"
            why="Multi-hop joins are first-class. Lineage is free. RAG over a schema doc is a worse version of this."
          />
          <Decision
            n="D-02"
            t="Tool-use over fine-tune"
            chose="Tools"
            why="Schemas change weekly. A fine-tune is stale on day two. Tool-use against the graph stays current."
          />
          <Decision
            n="D-03"
            t="HITL is not optional"
            chose="Hard gate"
            why="Marketers want the agent. Ops won't sign off without an explicit approval step. We agreed: never auto-write."
          />
        </div>
      </div>
    </div>
  );
}

function FlowAnnot({ t, sub }) {
  return (
    <div style={{
      borderTop: "1px dashed var(--rule)",
      paddingTop: 8,
      fontFamily: "var(--mono)",
      fontSize: 10,
      color: "var(--ink-3)",
      letterSpacing: "0.08em",
    }}>
      <div style={{color:"var(--ink-2)"}}>{t.toUpperCase()}</div>
      <div style={{marginTop:2}}>{sub}</div>
    </div>
  );
}

function KGLegend({ swatch, label, detail }) {
  return (
    <div style={{display:"flex", gap:10, alignItems:"flex-start"}}>
      <div style={{
        width:14, height:14, borderRadius:"50%",
        background: swatch, flexShrink:0, marginTop:4
      }}></div>
      <div>
        <div style={{fontWeight:600, fontSize:13}}>{label}</div>
        <div style={{fontSize:12, color:"var(--ink-3)"}}>{detail}</div>
      </div>
    </div>
  );
}

function Decision({ n, t, chose, why }) {
  return (
    <div style={{
      padding: 24,
      border: "1px solid var(--rule-soft)",
      borderRadius: "var(--radius-lg)",
      background: "var(--paper)",
    }}>
      <div className="mono" style={{color:"var(--accent)", fontSize:10, letterSpacing:"0.12em"}}>{n}</div>
      <div style={{fontFamily:"var(--serif)", fontSize:22, lineHeight:1.15, marginTop:8}}>{t}</div>
      <div style={{
        marginTop:14, display:"inline-block",
        fontFamily:"var(--mono)", fontSize:10,
        letterSpacing:"0.1em",
        padding:"4px 8px",
        background:"var(--bg-elev)",
        border:"1px solid var(--rule)",
        borderRadius:4,
      }}>CHOSE · {chose.toUpperCase()}</div>
      <div style={{fontSize:13, color:"var(--ink-3)", lineHeight:1.55, marginTop:14}}>{why}</div>
    </div>
  );
}

// ---- Knowledge graph SVG (static but designy) ----
function KGDiagram() {
  // node positions hand-tuned
  const nodes = [
    { id: "customer", x: 280, y: 190, r: 30, label: "Customer", kind: "entity", main: true },
    { id: "ltv", x: 120, y: 90, r: 18, label: "LTV band", kind: "attr" },
    { id: "geo", x: 80, y: 200, r: 16, label: "Geo", kind: "attr" },
    { id: "consent", x: 130, y: 300, r: 18, label: "Email consent", kind: "consent" },
    { id: "order", x: 470, y: 100, r: 24, label: "Order", kind: "entity" },
    { id: "value", x: 620, y: 60, r: 14, label: "value", kind: "attr" },
    { id: "ts", x: 620, y: 130, r: 14, label: "created_at", kind: "attr" },
    { id: "product", x: 720, y: 180, r: 22, label: "Product", kind: "entity" },
    { id: "tier", x: 870, y: 130, r: 14, label: "tier", kind: "attr" },
    { id: "event", x: 470, y: 290, r: 24, label: "PageView", kind: "event" },
    { id: "category", x: 620, y: 320, r: 14, label: "category", kind: "attr" },
    { id: "session", x: 470, y: 380, r: 16, label: "Session", kind: "event" },
    { id: "campaign", x: 280, y: 380, r: 18, label: "Campaign", kind: "entity" },
  ];
  const edges = [
    ["customer","ltv","HAS_ATTR"],
    ["customer","geo","HAS_ATTR"],
    ["customer","consent","HAS_CONSENT"],
    ["customer","order","HAS_ORDER"],
    ["customer","event","HAS_EVENT"],
    ["order","value","HAS_ATTR"],
    ["order","ts","HAS_ATTR"],
    ["order","product","CONTAINS"],
    ["product","tier","HAS_ATTR"],
    ["event","category","HAS_ATTR"],
    ["event","session","IN_SESSION"],
    ["customer","campaign","RECEIVED"],
  ];
  const colorFor = (k) => ({
    entity: "var(--ink)",
    attr: "var(--accent)",
    event: "var(--steel)",
    consent: "var(--good)",
  })[k];

  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));

  // path used during demo (highlighted)
  const activePath = new Set(["customer","ltv","event","category","order","ts","consent"]);

  return (
    <svg viewBox="0 0 960 460" style={{width:"100%", height:"100%", display:"block"}}>
      {/* edges */}
      {edges.map(([a, b, lbl], i) => {
        const A = byId[a], B = byId[b];
        const active = activePath.has(a) && activePath.has(b);
        return (
          <g key={i}>
            <line
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke={active ? "var(--accent)" : "var(--kg-edge)"}
              strokeWidth={active ? 1.8 : 1}
              strokeOpacity={active ? 1 : 0.6}
              strokeDasharray={active ? "0" : "3 4"}
            />
            <text
              x={(A.x+B.x)/2} y={(A.y+B.y)/2 - 4}
              fontFamily="var(--mono)"
              fontSize="9"
              fill={active ? "var(--accent-deep)" : "var(--ink-4)"}
              opacity={active ? 1 : 0.7}
              textAnchor="middle"
              style={{letterSpacing:"0.06em"}}
            >{lbl}</text>
          </g>
        );
      })}
      {/* nodes */}
      {nodes.map((n, i) => {
        const active = activePath.has(n.id);
        return (
          <g key={i} transform={`translate(${n.x},${n.y})`}>
            <circle
              r={n.r}
              fill={n.main ? "var(--ink)" : (active ? "var(--paper)" : "var(--bg)")}
              stroke={active ? colorFor(n.kind) : "var(--rule)"}
              strokeWidth={active || n.main ? 2 : 1}
            />
            <circle r={n.r * 0.55} fill={colorFor(n.kind)} opacity={n.main ? 1 : (active ? 0.85 : 0.4)} />
            <text
              y={n.r + 14}
              fontFamily="var(--sans)"
              fontSize="11"
              fontWeight={active ? 600 : 500}
              fill={active ? "var(--ink)" : "var(--ink-3)"}
              textAnchor="middle"
            >{n.label}</text>
          </g>
        );
      })}
      {/* legend */}
      <g transform="translate(20, 20)">
        <text fontFamily="var(--mono)" fontSize="9" fill="var(--ink-3)" style={{letterSpacing:"0.1em"}}>
          HIGHLIGHTED · NODES TRAVERSED BY THE DEMO QUERY
        </text>
      </g>
    </svg>
  );
}

window.Architecture = Architecture;
