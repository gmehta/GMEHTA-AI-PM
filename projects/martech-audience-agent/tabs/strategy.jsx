// Strategy / "Why" tab
function Strategy() {
  const { PAIN_POINTS, OUTCOMES } = window.AUDIENCE_AGENT;

  return (
    <div className="section" data-screen-label="02 Strategy">
      <div className="section-head">
        <div>
          <div className="eyebrow">01 — The Why</div>
          <h2 className="h1" style={{marginTop:16}}>
            Marketers wait days<br/>to ask a single question.
          </h2>
        </div>
        <div className="meta">
          STRATEGY MEMO<br/>
          v1.3 · sign-off pending<br/>
          target: Q3 GA
        </div>
      </div>

      <div className="problem-grid">
        <div>
          <div className="eyebrow" style={{marginBottom:16}}>THE PROBLEM</div>
          <div className="pain-list">
            {PAIN_POINTS.map((p) => (
              <div key={p.n} className="pain">
                <div className="n">{p.n}</div>
                <div>
                  <div className="t">{p.t}</div>
                  <div className="d">{p.d}</div>
                </div>
                <div className="tag">{p.tag}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="thesis">
            <div className="label">PRODUCT THESIS</div>
            <blockquote>
              Audience-building is a <em>language problem</em> wearing a data problem's costume.
              Give marketers the right vocabulary, on demand, and 90% of the
              workflow disappears.
            </blockquote>
          </div>

          <div className="timeline-card">
            <div className="head">
              <div>
                <div className="eyebrow">CYCLE TIME · BEFORE</div>
                <div className="h3" style={{marginTop:6}}>4.5 days, mostly waiting</div>
              </div>
              <div className="mono" style={{color:"var(--ink-3)"}}>per audience</div>
            </div>
            <div className="timeline-bar">
              <div className="seg find" style={{ width: "62%" }}>Find attributes · 3.5d</div>
              <div className="seg build" style={{ width: "22%" }}>Build · 1d</div>
              <div className="seg qa" style={{ width: "16%" }}>QA · 0.5d</div>
            </div>
            <div className="timeline-axis">
              <span>0d</span><span>2d</span><span>4d</span><span>5d</span>
            </div>

            <div className="eyebrow" style={{marginTop:28, display:"block"}}>CYCLE TIME · AFTER</div>
            <div className="timeline-after">~4.5s</div>
          </div>
        </div>
      </div>

      <div style={{marginTop:80}}>
        <div className="eyebrow">TARGET OUTCOMES</div>
        <div className="outcomes">
          {OUTCOMES.map((o, i) => (
            <div key={i} className="outcome">
              <div className="k"><em>{o.k.split(/(\d)/)[0]}</em>{o.k.replace(/^[^\d-]+/, '')}</div>
              <div className="l">{o.l}</div>
              <div className="d">{o.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 80,
        display:"grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 32,
      }}>
        <SideNote
          title="Why now"
          body="LLMs got reliable at structured tool-use. Graph DBs got cheap. CDPs got opinionated APIs. The three curves crossed — agents over knowledge graphs are finally the right shape for this job."
        />
        <SideNote
          title="Why not just text-to-SQL"
          body="Tried it. It hallucinates table names, can't traverse multi-hop semantics (a 'churn-risk dad in NJ' is not one column), and is impossible to audit. The graph is the contract."
        />
      </div>
    </div>
  );
}

function SideNote({ title, body }) {
  return (
    <div style={{
      padding: "28px 32px",
      borderLeft: "2px solid var(--accent)",
      background: "var(--bg-elev)",
      borderRadius: "0 8px 8px 0",
    }}>
      <div style={{
        fontFamily:"var(--serif)", fontStyle:"italic",
        fontSize:24, letterSpacing:"-0.005em", marginBottom:8
      }}>{title}</div>
      <div className="body">{body}</div>
    </div>
  );
}

window.Strategy = Strategy;
