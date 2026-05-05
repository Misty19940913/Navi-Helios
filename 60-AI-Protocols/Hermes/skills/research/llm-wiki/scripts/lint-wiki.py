#!/usr/bin/env python3
"""
lint-wiki.py — win4r v3.0 aligned wiki health auditor.
Run via: python3 /path/to/scripts/lint-wiki.py

Checks (grouped by severity):
  1. broken_links      (CRITICAL)
  2. missing_frontmatter (CRITICAL)
  3. orphans           (WARNING)
  4. unknown_tags      (WARNING)
  5. not_indexed       (WARNING)
  6. stale_pages       (INFO)  — updated >90 days ago
  7. oversized_pages   (INFO)  — >1200 words

Usage:
  python3 scripts/lint-wiki.py [WIKI_PATH]
  WIKI_PATH defaults to ~/wiki/llm-wiki
"""

import os, re, sys, argparse
from pathlib import Path
from collections import defaultdict
from datetime import date, timedelta

def main():
    parser = argparse.ArgumentParser(description="Lint a win4r-style LLM wiki.")
    parser.add_argument("wiki_path", nargs="?", default=None)
    args = parser.parse_args()

    if args.wiki_path:
        wiki = Path(args.wiki_path)
    else:
        wiki = Path(os.environ.get("WIKI_PATH", str(Path.home() / "wiki" / "llm-wiki")))

    if not wiki.exists():
        print(f"ERROR: Wiki path does not exist: {wiki}")
        sys.exit(1)

    DIRS = ["entities", "concepts", "comparisons", "queries"]
    wiki_dirs = [wiki / d for d in DIRS]

    # ── Collect all wiki pages ───────────────────────────────────────────────
    pages = {}  # stem -> Path
    for d in wiki_dirs:
        if d.exists():
            for p in d.glob("*.md"):
                pages[p.stem] = p

    # Also collect subdirectory index pages (concepts/topic/index.md → topic)
    for d in wiki_dirs:
        if d.exists():
            for subd in d.iterdir():
                if subd.is_dir() and (subd / "index.md").exists():
                    pages[subd.name] = subd / "index.md"

    # ── Load taxonomy from SCHEMA.md ──────────────────────────────────────────
    taxonomy = set()
    schema_path = wiki / "SCHEMA.md"
    if schema_path.exists():
        schema_text = schema_path.read_text()
        # win4r style: lines like "  - model, architecture, benchmark, training"
        for line in schema_text.splitlines():
            m = re.match(r"^\s*-\s+([a-zA-Z0-9\-_, ]+)", line)
            if m:
                for t in m.group(1).split(","):
                    t = t.strip()
                    if t:
                        taxonomy.add(t)

    # ── Extract wikilinks and frontmatter ────────────────────────────────────
    inbound = defaultdict(set)   # target_stem -> set of source_stems
    issues = {
        "broken_links": [],
        "missing_frontmatter": [],
        "orphans": [],
        "unknown_tags": [],
        "not_indexed": [],
        "stale_pages": [],
        "oversized_pages": [],
    }

    cutoff_date = (date.today() - timedelta(days=90)).isoformat()

    for name, path in pages.items():
        text = path.read_text()

        # Parse frontmatter
        fm_match = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
        if not fm_match:
            issues["missing_frontmatter"].append(str(path))
            continue
        try:
            import yaml
            fm = yaml.safe_load(fm_match.group(1)) or {}
        except Exception:
            issues["missing_frontmatter"].append(str(path))
            continue

        # Required fields
        required = {"title", "created", "updated", "type", "tags"}
        missing = required - set(fm.keys())
        if missing:
            issues["missing_frontmatter"].append(f"{path} (missing: {', '.join(missing)})")

        # Check tags against taxonomy
        if taxonomy:
            for tag in (fm.get("tags") or []):
                if tag not in taxonomy:
                    issues["unknown_tags"].append(f"{path}: '{tag}'")

        # Wikilinks — build inbound map
        for link in re.findall(r"\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]", text):
            target = link.strip()
            if target in pages:
                inbound[target].add(name)
            else:
                issues["broken_links"].append(f"{path} -> [[{target}]]")

        # Stale check
        updated = fm.get("updated", "")
        if updated and updated < cutoff_date:
            issues["stale_pages"].append(f"{path} (last updated {updated})")

        # Size check (word count)
        body = text[fm_match.end():]
        word_count = len(body.split())
        if word_count > 1200:
            issues["oversized_pages"].append(f"{path} ({word_count} words — candidate for split)")

    # ── Orphans: zero inbound links ──────────────────────────────────────────
    for name, path in pages.items():
        if not inbound[name]:
            issues["orphans"].append(str(path))

    # ── Index completeness ────────────────────────────────────────────────────
    index_path = wiki / "index.md"
    if index_path.exists():
        index_text = index_path.read_text()
        for name in pages:
            # check if the stem appears in index (wikilink or plain text mention)
            if name not in index_text and name.lower() not in index_text.lower():
                issues["not_indexed"].append(str(pages[name]))

    # ── Report ────────────────────────────────────────────────────────────────
    severity_order = ["broken_links", "missing_frontmatter", "orphans",
                     "unknown_tags", "not_indexed", "stale_pages", "oversized_pages"]

    total = sum(len(v) for v in issues.values())
    print(f"\n{'='*60}")
    print(f"  LINT REPORT — {wiki}")
    print(f"  Total issues: {total} | Pages scanned: {len(pages)}")
    print(f"{'='*60}")

    for key in severity_order:
        items = issues[key]
        if not items:
            continue
        label = key.replace("_", " ").title()
        print(f"\n## {label} ({len(items)})")
        for item in items[:20]:
            print(f"  - {item}")
        if len(items) > 20:
            print(f"  ... and {len(items)-20} more")

    print(f"\n{'='*60}")
    if total == 0:
        print("  ✅ No issues found — wiki is healthy.")
    else:
        print(f"  ⚠️  {total} issue(s) need attention.")
    print(f"{'='*60}\n")

    # ── Log to log.md ─────────────────────────────────────────────────────────
    log_path = wiki / "log.md"
    stamp = date.today().isoformat()
    entry = f"\n## [{stamp}] lint | {total} issues found\n"
    entry += f"- broken_links: {len(issues['broken_links'])}, orphans: {len(issues['orphans'])}, "
    entry += f"unknown_tags: {len(issues['unknown_tags'])}, not_indexed: {len(issues['not_indexed'])}\n"
    log_path.write_text(log_path.read_text() + entry)

    return 1 if total > 0 else 0

if __name__ == "__main__":
    sys.exit(main())
