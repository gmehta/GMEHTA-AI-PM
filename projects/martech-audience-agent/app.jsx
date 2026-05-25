// Main app shell
const { useState: useStateA, useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "warm",
  "github_url": "https://github.com/gmehta/GMEHTA-AI-PM",
  "video_url": "",
  "your_name": "Gaurav Mehta"
}/*EDITMODE-END*/;

function App() {
  const [tab, setTab] = useStateA("overview");
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply palette
  useEffectA(() => {
    document.documentElement.dataset.palette = tweaks.palette || "warm";
  }, [tweaks.palette]);

  const TABS = [
    { id: "overview", num: "00", label: "Overview" },
    { id: "strategy", num: "01", label: "The Why" },
    { id: "architecture", num: "02", label: "The How" },
    { id: "demo", num: "03", label: "Live Demo" },
  ];

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark"><span className="edge"></span></div>
          <div className="brand-text">
            <span className="name">Audience Agent</span>
            <span className="sub">PM Build Journal · v0.4</span>
          </div>
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={"tab" + (tab === t.id ? " active" : "")}
              onClick={() => setTab(t.id)}
            >
              <span className="num">{t.num}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="cta-row">
          <a className="btn ghost" href="../../index.html#projects">← Portfolio</a>
          <a
            className="btn"
            href={tweaks.github_url || "#"}
            target="_blank" rel="noreferrer"
          >GitHub ↗</a>
        </div>
      </div>

      {tab === "overview" && <Overview tweaks={tweaks} onTryDemo={() => setTab("demo")} />}
      {tab === "strategy" && <Strategy />}
      {tab === "architecture" && <Architecture />}
      {tab === "demo" && <Demo />}

      <div className="footer">
        <div>
          <div className="mono" style={{color:"var(--ink-3)", marginBottom:8}}>BUILD JOURNAL · MAY 2026</div>
          <div className="credit">— {tweaks.your_name || "Your Name"}</div>
        </div>
        <div className="links">
          <a href={tweaks.github_url || "#"} target="_blank" rel="noreferrer" style={{color:"inherit", textDecoration:"none"}}>github</a>
          <span>·</span>
          <a href="https://www.linkedin.com/in/gamehta/" target="_blank" rel="noreferrer" style={{color:"inherit", textDecoration:"none"}}>linkedin</a>
          <span>·</span>
          <span>made with care</span>
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <TweakSelect
            label="Color"
            value={tweaks.palette}
            options={[
              { value: "warm", label: "Warm — cream & coral" },
              { value: "sage", label: "Sage — moss green" },
              { value: "cobalt", label: "Cobalt — blue technical" },
              { value: "ink", label: "Ink — monochrome" },
            ]}
            onChange={(v) => setTweak("palette", v)}
          />
        </TweakSection>

        <TweakSection label="Your details">
          <TweakText
            label="Your name"
            value={tweaks.your_name}
            onChange={(v) => setTweak("your_name", v)}
            placeholder="Header & footer"
          />
          <TweakText
            label="GitHub URL"
            value={tweaks.github_url}
            onChange={(v) => setTweak("github_url", v)}
            placeholder="github.com/you/..."
          />
          <TweakText
            label="Demo video URL"
            value={tweaks.video_url}
            onChange={(v) => setTweak("video_url", v)}
            placeholder="YouTube / Loom embed"
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
