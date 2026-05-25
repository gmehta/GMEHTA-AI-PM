// Static content / demo script for the Audience Agent showcase

const PITCH = [
  {
    num: "01",
    h: "From 4.5 days to 4.5 seconds",
    p: "Audience attribute discovery and segment build, once a multi-day cross-team effort, collapses into a single conversation.",
  },
  {
    num: "02",
    h: "A knowledge graph, not a guess",
    p: "The agent reasons over a curated graph of customer attributes, events, and relationships — so its answers are grounded, auditable, and reproducible.",
  },
  {
    num: "03",
    h: "Trust through traceability",
    p: "Every plan step, graph query, and inference is surfaced inline. Humans approve before anything ships to the CDP.",
  },
];

const PAIN_POINTS = [
  {
    n: "01",
    t: "Marketers don't know what's tracked.",
    d: "Attribute discovery happens by Slack DM. The right schema lives in three different docs, two analysts' heads, and a Looker dashboard nobody owns.",
    tag: "Discovery · 3.5 days",
  },
  {
    n: "02",
    t: "Naming things is half the battle.",
    d: "Is it `last_purchase_date`, `most_recent_order_ts`, or `mro_dt`? Pick wrong and your segment misses 30% of the audience.",
    tag: "Consistency",
  },
  {
    n: "03",
    t: "Building is fragile, manual SQL.",
    d: "Once attributes are found, an analyst hand-writes SQL, validates counts, and ships to the CDP. One typo = one bad campaign.",
    tag: "Build · 1 day",
  },
  {
    n: "04",
    t: "No one trusts what they can't trace.",
    d: "Marketing ops won't push 'agent-built' segments live without seeing why. Black-box AI fails the compliance test on day one.",
    tag: "Trust",
  },
];

const OUTCOMES = [
  { k: "−98%", l: "Cycle time", d: "Discovery + build collapsed into seconds." },
  { k: "1×", l: "Source of truth", d: "Knowledge graph replaces tribal knowledge." },
  { k: "100%", l: "Auditable", d: "Every step traced, every query logged." },
  { k: "0", l: "Rogue pushes", d: "HITL gate before CDP write." },
];

const STACK_LAYERS = [
  {
    label: "Interface",
    chips: [
      { t: "Chat UI", k: "ink" },
      { t: "Trace Panel" },
      { t: "HITL Approval" },
    ],
  },
  {
    label: "Reasoning",
    chips: [
      { t: "LLM Planner", k: "ink" },
      { t: "Tool Router" },
      { t: "Self-critique loop" },
    ],
  },
  {
    label: "Knowledge",
    chips: [
      { t: "Audience Knowledge Graph", k: "steel" },
      { t: "Attribute Ontology", k: "steel" },
      { t: "Synonym index", k: "steel" },
    ],
  },
  {
    label: "Data",
    chips: [
      { t: "CDP · Customer Events" },
      { t: "CRM · Profiles" },
      { t: "Web/App · Behavioral" },
      { t: "Loyalty · Transactions" },
    ],
  },
  {
    label: "Action",
    chips: [
      { t: "Segment compiler" },
      { t: "CDP Write API", k: "ink" },
      { t: "Audit log" },
    ],
  },
];

const FLOW = [
  { n: "01", t: "Intent", d: "Marketer phrases targeting in plain English." },
  { n: "02", t: "Plan", d: "LLM decomposes into attribute + filter sub-goals." },
  { n: "03", t: "Resolve", d: "Knowledge graph maps concepts to real attributes." },
  { n: "04", t: "Query", d: "Compiled graph + CDP queries, count + sample." },
  { n: "05", t: "Approve & Ship", d: "Human approves; agent writes to CDP." },
];

// ---- The demo script ----
// Each "turn" plays a sequence of user message, plan steps, KG queries, tool calls,
// HITL approval, and a final segment summary.

const DEMO_PROMPT = "Find high-LTV customers who browsed our premium tier last week but haven't purchased in 60 days. Exclude anyone unsubscribed from email.";

const TRACE_STEPS = [
  {
    id: "s1",
    kind: "plan",
    title: "Decompose intent",
    body: "Parsed 4 conditions: (1) high-LTV (2) browsed premium tier last 7d (3) no purchase 60d (4) email-subscribed.",
    code: null,
    time: 220,
  },
  {
    id: "s2",
    kind: "kg-resolve",
    title: "Resolve attributes",
    body: "Mapped natural-language phrases → 4 canonical attributes in the graph.",
    kv: [
      { k: "high-LTV", v: "customer.ltv_band == 'tier_a'" },
      { k: "premium tier browse", v: "event.page_view WHERE category='premium'" },
      { k: "no purchase 60d", v: "MAX(order.created_at) < now() - 60d" },
      { k: "email-subscribed", v: "consent.email == 'opted_in'" },
    ],
    time: 410,
  },
  {
    id: "s3",
    kind: "kg-query",
    title: "Knowledge graph query",
    body: "Cypher walk across Customer → Event → Order → Consent.",
    code: [
      { type: "c", text: "// Audience KG · v3.2.1\n" },
      { type: "k", text: "MATCH" },
      { type: "t", text: " (c:" },
      { type: "n", text: "Customer" },
      { type: "t", text: ")-[:HAS_EVENT]->(e:" },
      { type: "n", text: "PageView" },
      { type: "t", text: ")\n" },
      { type: "k", text: "WHERE" },
      { type: "t", text: " c." },
      { type: "v", text: "ltv_band" },
      { type: "t", text: " = " },
      { type: "s", text: "'tier_a'" },
      { type: "t", text: "\n  " },
      { type: "k", text: "AND" },
      { type: "t", text: " e." },
      { type: "v", text: "category" },
      { type: "t", text: " = " },
      { type: "s", text: "'premium'" },
      { type: "t", text: "\n  " },
      { type: "k", text: "AND" },
      { type: "t", text: " e." },
      { type: "v", text: "ts" },
      { type: "t", text: " > " },
      { type: "v", text: "now() - 7d" },
      { type: "t", text: "\n" },
      { type: "k", text: "MATCH" },
      { type: "t", text: " (c)-[:HAS_ORDER]->(o:" },
      { type: "n", text: "Order" },
      { type: "t", text: ")\n" },
      { type: "k", text: "WITH" },
      { type: "t", text: " c, " },
      { type: "v", text: "MAX" },
      { type: "t", text: "(o.created_at) " },
      { type: "k", text: "AS" },
      { type: "t", text: " last_order\n" },
      { type: "k", text: "WHERE" },
      { type: "t", text: " last_order < " },
      { type: "v", text: "now() - 60d" },
      { type: "t", text: "\n" },
      { type: "k", text: "MATCH" },
      { type: "t", text: " (c)-[:HAS_CONSENT { channel: " },
      { type: "s", text: "'email'" },
      { type: "t", text: ", state: " },
      { type: "s", text: "'opted_in'" },
      { type: "t", text: " }]->()\n" },
      { type: "k", text: "RETURN" },
      { type: "t", text: " c." },
      { type: "v", text: "id" },
      { type: "t", text: ", " },
      { type: "v", text: "count" },
      { type: "t", text: "(*) " },
      { type: "k", text: "AS" },
      { type: "t", text: " n" },
    ],
    time: 1840,
  },
  {
    id: "s4",
    kind: "reason",
    title: "Self-critique",
    body: "Edge case: should we treat customers with active subscriptions as 'no purchase'? Checked ontology — subscription renewal IS an order. Holding as-is. Flagging to human in summary.",
    time: 380,
  },
  {
    id: "s5",
    kind: "count",
    title: "Count + sample",
    body: "Audience returned. Pulled 5 sample profiles for QA.",
    kv: [
      { k: "matched_customers", v: "84,217" },
      { k: "% of base", v: "2.1%" },
      { k: "est. reachable", v: "84,217 (100% — email gate enforced)" },
      { k: "sample drawn", v: "5 profiles" },
    ],
    time: 290,
  },
];

const LINEAGE = [
  { src: "CDP", field: "customer.ltv_band", conf: "100%" },
  { src: "CDP", field: "event.page_view (category=premium)", conf: "100%" },
  { src: "CDP", field: "order.created_at", conf: "100%" },
  { src: "CRM", field: "consent.email_state", conf: "98%" },
  { src: "KG", field: "subscription↔order edge resolution", conf: "94%" },
];

const SEGMENT_NAME = "High-LTV Lapsed Premium Browsers · 7d/60d";
const SEGMENT_SIZE = "84,217 customers";

// expose
window.AUDIENCE_AGENT = {
  PITCH, PAIN_POINTS, OUTCOMES, STACK_LAYERS, FLOW,
  DEMO_PROMPT, TRACE_STEPS, LINEAGE, SEGMENT_NAME, SEGMENT_SIZE,
};
