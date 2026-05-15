"""One time prose cleanup. Removes em dashes, en dashes, sentence flow
hyphens, semicolons, and common contractions from narrative fixtures,
dashboard fixtures, and the PPTX builder."""

import json
import re
from pathlib import Path

repo = Path(__file__).resolve().parents[1]

COMPOUND_HYPHENS = [
    ("Dashboard-to-Deck", "Dashboard to Deck"),
    ("Dashboard-to-deck", "Dashboard to deck"),
    ("dashboard-to-deck", "dashboard to deck"),
    ("best-in-class", "best in class"),
    ("end-to-end", "end to end"),
    ("day-by-day", "day by day"),
    ("week-by-week", "week by week"),
    ("week-over-week", "week over week"),
    ("quarter-over-quarter", "quarter over quarter"),
    ("year-over-year", "year over year"),
    ("top-of-mind", "top of mind"),
    ("side-by-side", "side by side"),
    ("mid-market", "mid market"),
    ("Mid-market", "Mid market"),
    ("Mid-Market", "Mid Market"),
    ("up-market", "up market"),
    ("Up-market", "Up market"),
    ("down-market", "down market"),
    ("late-stage", "late stage"),
    ("Late-stage", "Late stage"),
    ("early-stage", "early stage"),
    ("Early-stage", "Early stage"),
    ("mid-stage", "mid stage"),
    ("top-tier", "top tier"),
    ("Top-tier", "Top tier"),
    ("best-shaped", "best shaped"),
    ("second-best", "second best"),
    ("root-cause", "root cause"),
    ("Root-cause", "Root cause"),
    ("at-risk", "at risk"),
    ("At-risk", "At risk"),
    ("At-Risk", "At Risk"),
    ("AI-authored", "AI authored"),
    ("AI-powered", "AI powered"),
    ("AI-driven", "AI driven"),
    ("AI-native", "AI native"),
    ("AI-generated", "AI generated"),
    ("AI-curated", "AI curated"),
    ("AI-led", "AI led"),
    ("PPTX-ready", "PPTX ready"),
    ("PDF-ready", "PDF ready"),
    ("one-click", "one click"),
    ("One-click", "One click"),
    ("one-liner", "one liner"),
    ("One-liner", "One liner"),
    ("production-ready", "production ready"),
    ("production-feedback", "production feedback"),
    ("hand-curated", "hand curated"),
    ("Hand-curated", "Hand curated"),
    ("hand-coded", "hand coded"),
    ("hand-authored", "hand authored"),
    ("case-study", "case study"),
    ("case-studies", "case studies"),
    ("long-form", "long form"),
    ("short-form", "short form"),
    ("drill-down", "drill down"),
    ("drill-downs", "drill downs"),
    ("drill-in", "drill in"),
    ("cross-viewport", "cross viewport"),
    ("cross-functional", "cross functional"),
    ("non-monotonic", "non monotonic"),
    ("non-USD", "non USD"),
    ("full-width", "full width"),
    ("full-stack", "full stack"),
    ("full-quarter", "full quarter"),
    ("partner-risk", "partner risk"),
    ("Partner-risk", "Partner risk"),
    ("margin-led", "margin led"),
    ("discount-led", "discount led"),
    ("volume-led", "volume led"),
    ("NRR-driven", "NRR driven"),
    ("new-logo-driven", "new logo driven"),
    ("SDR-AE", "SDR AE"),
    ("per-dashboard", "per dashboard"),
    ("per-segment", "per segment"),
    ("per-channel", "per channel"),
    ("per-customer", "per customer"),
    ("per-product", "per product"),
    ("per-page", "per page"),
    ("per-route", "per route"),
    ("per-cell", "per cell"),
    ("per-slug", "per slug"),
    ("per-bullet", "per bullet"),
    ("per-sprint", "per sprint"),
    ("per-deal", "per deal"),
    ("per-week", "per week"),
    ("per-day", "per day"),
    ("per-quarter", "per quarter"),
    ("per-account", "per account"),
    ("Sprint-Intelligence", "Sprint Intelligence"),
    ("Pipeline-Healer", "Pipeline Healer"),
    ("Anomaly-Alerting", "Anomaly Alerting"),
    ("Dashboard-Factory", "Dashboard Factory"),
    ("Narrative-Generator", "Narrative Generator"),
    ("Self-Healer", "Self Healer"),
    ("self-healer", "self healer"),
    ("self-healing", "self healing"),
    ("data-driven", "data driven"),
    ("dataset-driven", "dataset driven"),
    ("rules-based", "rules based"),
    ("test-coverage", "test coverage"),
    ("feature-flag", "feature flag"),
    ("top-of-funnel", "top of funnel"),
    ("bottom-of-funnel", "bottom of funnel"),
    ("on-pace", "on pace"),
    ("off-pace", "off pace"),
    ("on-track", "on track"),
    ("off-track", "off track"),
    ("multi-format", "multi format"),
    ("multi-tab", "multi tab"),
    ("multi-user", "multi user"),
    ("multi-quarter", "multi quarter"),
    ("multi-region", "multi region"),
    ("high-contrast", "high contrast"),
    ("low-contrast", "low contrast"),
    ("high-priority", "high priority"),
    ("low-priority", "low priority"),
    ("high-volume", "high volume"),
    ("low-volume", "low volume"),
    ("book-ended", "book ended"),
    ("go-to-market", "go to market"),
    ("Go-to-market", "Go to market"),
    ("all-hands", "all hands"),
    ("break-even", "break even"),
    ("quarter-end", "quarter end"),
    ("month-end", "month end"),
    ("quarter-closed", "quarter closed"),
    ("books-closed", "books closed"),
    ("books-close", "books close"),
    ("top-of-quarter", "top of quarter"),
    ("mid-quarter", "mid quarter"),
    ("end-of-quarter", "end of quarter"),
    ("NRR-led", "NRR led"),
    ("expansion-led", "expansion led"),
    ("churn-led", "churn led"),
    ("priority-one", "priority one"),
    ("Sev-1", "Sev 1"),
    ("Sev-2", "Sev 2"),
    ("SEV-1", "SEV 1"),
    ("SEV-2", "SEV 2"),
    ("SEV-3", "SEV 3"),
    ("headline-metric", "headline metric"),
    ("exec-readout", "exec readout"),
    ("leadership-readout", "leadership readout"),
    ("exec-ready", "exec ready"),
    ("over-built", "over built"),
    ("over-build", "over build"),
    ("over-promised", "over promised"),
    ("peer-reviewed", "peer reviewed"),
    ("peer-review", "peer review"),
    ("value-on-bar", "value on bar"),
    ("flow-shaped", "flow shaped"),
    ("force-static", "force static"),
    ("force-dynamic", "force dynamic"),
    ("Q4-comp", "Q4 comp"),
]

CONTRACTIONS_LOWER = [
    ("i'm", "I am"),
    ("i've", "I have"),
    ("i'll", "I will"),
    ("i'd", "I would"),
    ("we've", "we have"),
    ("we'll", "we will"),
    ("we're", "we are"),
    ("we'd", "we would"),
    ("you've", "you have"),
    ("you'll", "you will"),
    ("you're", "you are"),
    ("you'd", "you would"),
    ("they've", "they have"),
    ("they'll", "they will"),
    ("they're", "they are"),
    ("they'd", "they would"),
    ("it's", "it is"),
    ("that's", "that is"),
    ("there's", "there is"),
    ("what's", "what is"),
    ("here's", "here is"),
    ("let's", "let us"),
    ("who's", "who is"),
    ("how's", "how is"),
    ("when's", "when is"),
    ("where's", "where is"),
    ("don't", "do not"),
    ("doesn't", "does not"),
    ("didn't", "did not"),
    ("won't", "will not"),
    ("wouldn't", "would not"),
    ("shouldn't", "should not"),
    ("couldn't", "could not"),
    ("can't", "cannot"),
    ("isn't", "is not"),
    ("aren't", "are not"),
    ("wasn't", "was not"),
    ("weren't", "were not"),
    ("hasn't", "has not"),
    ("haven't", "have not"),
    ("hadn't", "had not"),
]


def cap(value: str) -> str:
    return value[0].upper() + value[1:] if value else value


CONTRACTIONS = []
for low, expanded in CONTRACTIONS_LOWER:
    CONTRACTIONS.append((low, expanded))
    CONTRACTIONS.append((cap(low), cap(expanded)))


def clean_prose(text: str, *, normalize_whitespace: bool = True) -> str:
    """Clean prose. Pass normalize_whitespace=False on code files so the
    multi-space-to-single-space rule does not crush indentation."""
    if not isinstance(text, str):
        return text
    text = re.sub(r"\s*[—–]\s*", ". ", text)
    text = re.sub(r"\s*;\s*", ". ", text)
    for old, new in CONTRACTIONS:
        text = re.sub(r"\b" + re.escape(old) + r"\b", new, text)
    for old, new in COMPOUND_HYPHENS:
        text = text.replace(old, new)
    if normalize_whitespace:
        text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"\.\s+\.\s+", ". ", text)
    if normalize_whitespace:
        text = re.sub(r"(\.\s+)([a-z])(?=[a-zA-Z])", lambda m: m.group(1) + m.group(2).upper(), text)
    return text


def process_json(path: Path, fields=("text",)) -> bool:
    data = json.loads(path.read_text(encoding="utf-8"))
    changed = False
    for field in fields:
        if field in data and isinstance(data[field], str):
            new_text = clean_prose(data[field])
            if new_text != data[field]:
                data[field] = new_text
                changed = True
    if changed:
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return changed


# Field names whose values are prose and should be cleaned. Identifier-like
# fields (id, slug, icon, thumbnail, colorToken, domain, format, status,
# priority, segment, channel, deltaDirection, currency, unit) are skipped.
DASHBOARD_PROSE_FIELDS = {
    "title",
    "tagline",
    "audience",
    "period",
    "label",
    "subtext",
    "subtitle",
    "name",
    "subject",
    "root_cause",
    "customer_impact",
    "pitch",
    "scope",
}


def clean_walk(value, parent_field: str | None = None):
    if isinstance(value, str):
        if parent_field in DASHBOARD_PROSE_FIELDS:
            return clean_prose(value)
        return value
    if isinstance(value, list):
        return [clean_walk(v, parent_field) for v in value]
    if isinstance(value, dict):
        return {k: clean_walk(v, k) for k, v in value.items()}
    return value


def main():
    narratives = repo / "fixtures" / "narrative-generator" / "narratives"
    n_changed = 0
    for fp in sorted(narratives.glob("*.json")):
        if process_json(fp):
            n_changed += 1
            print("cleaned " + fp.name)
    print("narratives changed:", n_changed)

    pptx_path = repo / "apps" / "narrative-generator" / "lib" / "build-pptx.ts"
    src = pptx_path.read_text(encoding="utf-8")
    # Code file: keep indentation intact.
    new_src = clean_prose(src, normalize_whitespace=False)
    if new_src != src:
        pptx_path.write_text(new_src, encoding="utf-8")
        print("cleaned build-pptx.ts")

    dashboards = repo / "fixtures" / "narrative-generator" / "dashboards"
    d_changed = 0
    for fp in sorted(dashboards.glob("*.json")):
        data = json.loads(fp.read_text(encoding="utf-8"))
        new_data = clean_walk(data)
        if new_data != data:
            fp.write_text(json.dumps(new_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            d_changed += 1
            print("cleaned " + fp.name)
    print("dashboards changed:", d_changed)


if __name__ == "__main__":
    main()
