"""Walks every weeksPlan day entry in docs/plan.html and runs the
clean_prose helper over the day name and every task string. Avoids
touching code structure (whitespace, identifiers, keys)."""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from importlib import import_module

mod = import_module("clean-prose")
clean = mod.clean_prose

plan = Path(__file__).resolve().parents[1] / "docs" / "plan.html"
content = plan.read_text(encoding="utf-8")
original = content


def walk_tasks_array(text: str, open_bracket_idx: int) -> int:
    """Return the index of the matching `]` for the `[` at open_bracket_idx,
    skipping brackets inside strings."""
    i = open_bracket_idx + 1
    depth = 1
    in_string = False
    escape = False
    while i < len(text):
        ch = text[i]
        if escape:
            escape = False
        elif ch == "\\":
            escape = True
        elif in_string:
            if ch == '"':
                in_string = False
        elif ch == '"':
            in_string = True
        elif ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


# Process from end to start so offsets stay valid.
day_starts = list(re.finditer(r'num:\s*"(W\d+\.D\d+)"', content))
day_starts.reverse()
print(f"found {len(day_starts)} day entries")

changes = 0
for match in day_starts:
    brace_end = content.find("}", match.end())
    if brace_end < 0:
        continue
    entry = content[match.start() : brace_end + 1]
    new_entry = entry

    name_match = re.search(r'(name:\s*")((?:[^"\\]|\\.)*)(")', new_entry)
    if name_match:
        cleaned_name = clean(name_match.group(2), normalize_whitespace=False)
        new_entry = (
            new_entry[: name_match.start()]
            + name_match.group(1)
            + cleaned_name
            + name_match.group(3)
            + new_entry[name_match.end() :]
        )

    tasks_keyword = new_entry.find("tasks:")
    if tasks_keyword >= 0:
        open_b = new_entry.find("[", tasks_keyword)
        if open_b >= 0:
            close_b = walk_tasks_array(new_entry, open_b)
            if close_b > open_b:
                blob = new_entry[open_b + 1 : close_b]

                def replace_task(string_match):
                    return '"' + clean(string_match.group(1), normalize_whitespace=False) + '"'

                new_blob = re.sub(r'"((?:[^"\\]|\\.)*)"', replace_task, blob)
                new_entry = new_entry[: open_b + 1] + new_blob + new_entry[close_b:]

    if new_entry != entry:
        changes += 1
        content = content[: match.start()] + new_entry + content[brace_end + 1 :]

if content != original:
    plan.write_text(content, encoding="utf-8")
    print(f"cleaned {changes} day entries")
else:
    print("no changes")
