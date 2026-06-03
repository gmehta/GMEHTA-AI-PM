#!/usr/bin/env python3
"""Port RevForgeHD demos into Gaurav AI PM Showcase for GitHub Pages."""

import re
import shutil
from pathlib import Path

REVFORGE = Path("/Users/mehtahome/Documents/Claude/Projects/RevForgeHD")
SHOWCASE = Path("/Users/mehtahome/Documents/Claude/Projects/Gaurav AI PM Showcase")
AGENTS = SHOWCASE / "projects" / "agents"
SHARED = AGENTS / "_shared"

DOMAINS = {
    "ad-tech": [
        "portfolio-agent",
        "creative-agent",
        "audience-expansion",
        "copy-matrix",
        "guardian-agent",
        "narrative-agent",
    ],
    "sales-tech": [
        "account-research",
        "outbound-sequencing",
        "call-to-crm",
        "deal-desk",
        "pipeline-health",
    ],
    "martech": [
        "audience-agent",
        "audience-collision",
        "trial-to-paid",
        "expansion-upsell",
    ],
}

ANCHORS = {
    "ad-tech": "ad-tech-agents",
    "sales-tech": "sales-tech-agents",
    "martech": "martech-agents",
}

PORTFOLIO_NAV = """<header class="portfolio-demo-bar" role="banner">
  <a href="../../../index.html#{anchor}" class="portfolio-demo-back">← Portfolio</a>
  <span class="portfolio-demo-brand">Gaurav Mehta · Agent Demo</span>
</header>
"""

API_BASE_SNIPPET = "const API_BASE = 'https://www.revforgehq.com';"


def strip_revforge_nav(html: str) -> str:
    html = re.sub(r"<script src=\"/analytics\.js\"></script>\s*", "", html)
    html = re.sub(
        r"<nav id=\"nav\".*?</nav>\s*",
        "",
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = re.sub(
        r"<footer class=\"footer\">.*?</footer>\s*",
        "",
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = re.sub(r"<script src=\"/script\.js\"></script>\s*", "", html)
    return html


def fix_paths(html: str, slug: str, domain: str) -> str:
    html = html.replace('href="/styles.css"', 'href="../../_shared/revforge-demo.css"')
    html = html.replace(
        'href="/styles.css"',
        'href="../../_shared/revforge-demo.css"',
    )
    extra = (
        '<link rel="stylesheet" href="../../_shared/demo-shell.css" />\n  '
    )
    if "demo-shell.css" not in html:
        html = html.replace(
            'href="../../_shared/revforge-demo.css" />',
            'href="../../_shared/revforge-demo.css" />\n  ' + extra.strip(),
            1,
        )

    html = re.sub(
        rf'<script src="/demos/{re.escape(slug)}/([^"]+\.js)"></script>',
        r'<script src="\1"></script>',
        html,
    )
    html = re.sub(
        r'<script src="/demos/[^/]+/([^"]+\.js)"></script>',
        r'<script src="\1"></script>',
        html,
    )

    html = html.replace(
        'href="/demos/" class="back-link"',
        f'href="../../../index.html#{ANCHORS[domain]}" class="back-link"',
    )
    html = re.sub(r" RevForgeHQ", " · Gaurav Mehta", html)
    html = html.replace("· RevForgeHQ", "· Gaurav Mehta")

    if domain == "martech" and slug in ("audience-agent", "audience-collision"):
        if "const API_BASE" not in html:
            html = html.replace(
                "<script>",
                f"<script>\n    {API_BASE_SNIPPET}\n",
                1,
            )
        html = re.sub(
            r"fetch\(['\"]/api/([^'\"]+)['\"]",
            r"fetch(`${API_BASE}/api/\1`",
            html,
        )

    anchor = ANCHORS[domain]
    nav = PORTFOLIO_NAV.format(anchor=anchor)
    html = html.replace("<body", f"<body", 1)
    html = re.sub(
        r"(<body[^>]*>)",
        r"\1\n  " + nav.strip().replace("\n", "\n  "),
        html,
        count=1,
    )

    # Adjust demo-shell padding (no RevForge nav)
    html = html.replace(
        "padding-top: calc(var(--nav-h) + 32px)",
        "padding-top: 32px",
    )
    html = html.replace(
        "padding-top: calc(var(--nav-h) + 48px)",
        "padding-top: 48px",
    )

    return html


def port_demo(slug: str, domain: str) -> None:
    src = REVFORGE / "demos" / slug
    dest = AGENTS / domain / slug
    if dest.exists():
        shutil.rmtree(dest)
    shutil.copytree(src, dest)

    index = dest / "index.html"
    if not index.exists():
        return
    html = index.read_text(encoding="utf-8")
    html = strip_revforge_nav(html)
    html = fix_paths(html, slug, domain)
    index.write_text(encoding="utf-8", data=html)


def main() -> None:
    SHARED.mkdir(parents=True, exist_ok=True)
    shutil.copy2(REVFORGE / "styles.css", SHARED / "revforge-demo.css")

    for domain, slugs in DOMAINS.items():
        for slug in slugs:
            port_demo(slug, domain)
            print(f"ported {domain}/{slug}")


if __name__ == "__main__":
    main()
