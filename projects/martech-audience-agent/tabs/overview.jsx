// Overview / hero tab
const { useState } = React;

function Overview({ tweaks, onTryDemo }) {
  const { PITCH } = window.AUDIENCE_AGENT;
  const [playing, setPlaying] = useState(false);

  return (
    <div className="section" data-screen-label="01 Overview">
      <div className="hero">
        <div className="hero-left">
          <span className="eyebrow">A MarTech build journal · 2026</span>
          <h1 className="h-display">
            An <em>Audience Agent</em><br/>that thinks before it ships.
          </h1>
          <p className="lede">
            A working prototype of an LLM agent that turns plain-English targeting briefs into
            production-ready CDP audiences — grounded in a curated knowledge graph,
            traceable end-to-end, and gated by human approval.
          </p>
          <div className="cta-row" style={{ marginTop: 32 }}>
            <button className="btn primary" type="button" onClick={() => onTryDemo && onTryDemo()}>
              ↗ Try the live agent
            </button>
            <button className="btn" onClick={() => setPlaying(true)}>
              ▶ Watch 90-sec demo
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="v"><em>4.5d</em> → 4.5s</div>
            <div className="l">Workflow time, before vs after</div>
            <div className="d">Attribute discovery + segment build, collapsed into a single conversation.</div>
          </div>
          <div className="stat">
            <div className="v">~<em>90%</em></div>
            <div className="l">Of the workflow now zero-touch</div>
            <div className="d">Only the final approval step needs a human.</div>
          </div>
          <div className="stat">
            <div className="v"><em>1</em> graph</div>
            <div className="l">Replaces tribal knowledge</div>
            <div className="d">Curated ontology of attributes, events, and relationships.</div>
          </div>
        </div>
      </div>

      <div className="video-card" id="video">
        <div className="video-frame">
          {playing ? (
            <div style={{
              position:"absolute", inset:0, background:"#0a0907",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#9a9286", fontFamily:"var(--mono)", fontSize:12, letterSpacing:"0.1em"
            }}>
              {tweaks.video_url
                ? <iframe src={tweaks.video_url} style={{width:"100%",height:"100%",border:0}} allow="autoplay; encrypted-media" />
                : "DEMO VIDEO · drop your Loom/YouTube URL in Tweaks"}
            </div>
          ) : (
            <div className="play" onClick={() => setPlaying(true)} aria-label="Play demo">▶</div>
          )}
        </div>
        <div className="video-meta">
          <div>
            <div className="title">Walkthrough — building "High-LTV Lapsed Browsers"</div>
            <div className="mono" style={{color:"var(--ink-3)", marginTop:4}}>
              live agent · narrated · captions
            </div>
          </div>
          <div className="dur">01:32</div>
        </div>
      </div>

      <div className="pitch-row">
        {PITCH.map((p) => (
          <div key={p.num} className="pitch">
            <div className="num">{p.num}</div>
            <div className="h">{p.h}</div>
            <div className="p">{p.p}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 64,
        padding: "28px 32px",
        border: "1px solid var(--rule-soft)",
        borderRadius: "var(--radius-lg)",
        background: "var(--paper)",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: 32,
        alignItems: "center",
      }}>
        <div className="mono" style={{color:"var(--ink-3)"}}>
          READING<br/>ORDER
        </div>
        <div style={{display:"flex", gap:24, alignItems:"center"}}>
          <ReadStep n="01" t="Why" sub="Strategy · the case for building" />
          <Arrow/>
          <ReadStep n="02" t="How" sub="Stack, flow, knowledge graph" />
          <Arrow/>
          <ReadStep n="03" t="See it" sub="Interactive agent with traceability" />
        </div>
        <div className="mono" style={{color:"var(--ink-3)", textAlign:"right"}}>
          ~6 min<br/>read
        </div>
      </div>
    </div>
  );
}

function ReadStep({ n, t, sub }) {
  return (
    <div style={{display:"flex", flexDirection:"column", gap:4}}>
      <div className="mono" style={{color:"var(--accent)", fontSize:10, letterSpacing:"0.12em"}}>{n}</div>
      <div style={{fontFamily:"var(--serif)", fontSize:22, lineHeight:1.1, fontStyle:"italic"}}>{t}</div>
      <div style={{fontSize:12, color:"var(--ink-3)"}}>{sub}</div>
    </div>
  );
}
function Arrow() {
  return <div style={{fontSize:24, color:"var(--ink-4)"}}>→</div>;
}

window.Overview = Overview;
