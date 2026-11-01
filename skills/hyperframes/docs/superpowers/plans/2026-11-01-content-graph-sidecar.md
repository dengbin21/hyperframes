# Content-graph Sidecar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional `CONTENT_GRAPH.json` planning sidecar that validates narrative relationships and returns a deterministic suggested frame order, without changing existing storyboards or rendering.

**Architecture:** `scripts/content_graph.py` is a Python-standard-library-only module and read-only CLI. Its pure functions validate a JSON graph, then apply Kahn topological sorting to hard `dependency` edges, using `sequence` only to break ties among ready nodes and original node-array order as the last tie-break. `STORYBOARD.md` remains the human-review and rendering-compatible format.

**Tech Stack:** Python 3 standard library (`argparse`, `json`, `math`, `os`, `sys`), executable `scripts/test_*.py` tests, Markdown.

## Global Constraints

- `CONTENT_GRAPH.json` remains optional. Projects without it must not change behavior or acquire a gate.
- Do not alter `STORYBOARD.md`, `StoryboardManifest`, `boards/storyboard.html`, project render logic, or the five existing production gates.
- Do not add PyYAML, NetworkX, html-video, or another dependency.
- Use `schema_version`, `frame_intent`, and `duration_s` exactly as defined in `docs/superpowers/specs/2026-11-01-content-graph-sidecar-design.md`.
- `dependency` is a hard order constraint. `sequence` is a ready-node tie-break only. `contrast` never affects order.
- Omitted `duration_s` is 3.0 seconds. Explicit duration must be a finite positive number.
- Use a clean-room Python implementation informed by Apache-2.0 `nexu-io/html-video` semantics. Do not copy upstream TypeScript implementation text.
- Write and observe failing tests before each new behavior. One independently useful task is one Git commit.

---

## File structure

| File | Responsibility |
| --- | --- |
| `scripts/content_graph.py` | Pure graph validation, deterministic ordering, duration calculation, read-only CLI. |
| `scripts/test_content_graph.py` | Dependency-free behavior tests with literal fixtures. |
| `references/storyboard-format.md` | Documents how an optional graph precedes but never replaces `STORYBOARD.md`. |

---

### Task 1: Pure graph API with structural validation and deterministic ordering

**Files:**
- Create: `scripts/content_graph.py`
- Create: `scripts/test_content_graph.py`

**Interfaces:**
- `DEFAULT_DURATION_S = 3.0`
- `validate_graph(graph: object) -> tuple[list[dict], list[dict]]`, returning `(errors, warnings)`.
- `topo_sort(graph: dict) -> list[str]`, raising `ValueError` if validation reports any error.
- `total_duration_s(graph: dict, order: list[str] | None = None) -> float`.
- Every finding contains `code` and `message`. A node finding has `ref: node_id`; a valid edge finding has `ref: "from->to"`.

- [ ] **Step 1: Write the first failing test for a valid dependency graph**

Create `scripts/test_content_graph.py`:

```python
#!/usr/bin/env python3
import importlib.util
import os

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("content_graph", os.path.join(HERE, "content_graph.py"))
cg = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cg)

OK = True

def check(label, got, want):
    global OK
    good = got == want
    OK = OK and good
    print(f"  {'PASS' if good else 'FAIL'} {label}: got={got!r} want={want!r}")

VALID = {
    "schema_version": 1,
    "intent": "explainer",
    "nodes": [
        {"id": "hook", "kind": "text", "text": "Why does framing matter?", "duration_s": 2.5},
        {"id": "proof", "kind": "data", "data": {"same_total": 7}},
        {"id": "viewer", "kind": "entity", "props": {"role": "surrogate"}, "duration_s": 4.0},
    ],
    "edges": [{"from": "hook", "to": "proof", "kind": "dependency"}],
}

errors, warnings = cg.validate_graph(VALID)
check("valid graph has no errors", errors, [])
check("base validator emits no authoring warnings yet", warnings, [])
check("dependency orders hook before proof and source order breaks remaining tie", cg.topo_sort(VALID), ["hook", "proof", "viewer"])
check("omitted duration uses 3.0 seconds", cg.total_duration_s(VALID), 9.5)

if __name__ == "__main__":
    raise SystemExit(0 if OK else 1)
```

- [ ] **Step 2: Confirm the test is red before production code exists**

Run:

```bash
python3 scripts/test_content_graph.py
```

Expected: `FileNotFoundError` naming `scripts/content_graph.py`. The failure proves the test reaches the missing production boundary rather than passing on an unrelated fixture.

- [ ] **Step 3: Implement only the valid-graph path**

Create `scripts/content_graph.py` with this complete initial implementation. It deliberately accepts only the valid shape exercised above; structural diagnostics, sequence semantics and warnings come after their tests are red.

```python
#!/usr/bin/env python3
"""Optional CONTENT_GRAPH.json validation and suggested-order helpers."""
import math

DEFAULT_DURATION_S = 3.0


def validate_graph(graph):
    if not isinstance(graph, dict):
        return ([{"code": "invalid-root", "message": "Graph root must be an object"}], [])
    return ([], [])


def topo_sort(graph):
    errors, _ = validate_graph(graph)
    if errors:
        raise ValueError(errors[0]["message"])
    nodes = graph["nodes"]
    order_index = {node["id"]: index for index, node in enumerate(nodes)}
    indegree = {node["id"]: 0 for node in nodes}
    dependents = {node["id"]: [] for node in nodes}
    for edge in graph["edges"]:
        if edge["kind"] == "dependency":
            dependents[edge["from"]].append(edge["to"])
            indegree[edge["to"]] += 1
    ready = [node["id"] for node in nodes if indegree[node["id"]] == 0]
    result = []
    while ready:
        ready.sort(key=order_index.__getitem__)
        node_id = ready.pop(0)
        result.append(node_id)
        for target in dependents[node_id]:
            indegree[target] -= 1
            if indegree[target] == 0:
                ready.append(target)
    if len(result) != len(nodes):
        raise ValueError("Dependency cycle detected")
    return result


def total_duration_s(graph, order=None):
    by_id = {node["id"]: node for node in graph["nodes"]}
    return sum(by_id[node_id].get("duration_s", DEFAULT_DURATION_S) for node_id in (order or topo_sort(graph)))
```

- [ ] **Step 4: Confirm the first green state**

Run:

```bash
python3 scripts/test_content_graph.py
```

Expected: four `PASS` lines and exit status `0`.

- [ ] **Step 5: Add failing tests for all remaining semantics and diagnostics**

Append this code before the existing `if __name__ == "__main__"` footer. Move the footer to the new end of the file.

```python
def graph(nodes, edges=(), **extra):
    return {"schema_version": 1, "intent": "other", "nodes": nodes, "edges": list(edges), **extra}

def error_codes(value):
    return [item["code"] for item in cg.validate_graph(value)[0]]

SEQUENCE = graph(
    [{"id": "later", "kind": "text", "text": "later"}, {"id": "first", "kind": "text", "text": "first"}],
    [{"from": "first", "to": "later", "kind": "sequence"}],
)
CONTRAST = graph(
    [{"id": "a", "kind": "text", "text": "before"}, {"id": "b", "kind": "text", "text": "after"}],
    [{"from": "b", "to": "a", "kind": "contrast"}],
)
check("sequence changes a ready-node tie only", cg.topo_sort(SEQUENCE), ["first", "later"])
check("contrast does not change source-array order", cg.topo_sort(CONTRAST), ["a", "b"])

CASES = [
    ([], ["invalid-root"]),
    (graph([], []), ["empty-graph"]),
    ({"schema_version": 2, "intent": "other", "nodes": [], "edges": []}, ["invalid-schema-version", "empty-graph"]),
    (graph([{"id": "x", "kind": "bogus"}]), ["invalid-kind"]),
    (graph([{"id": "x", "kind": "text", "text": "x", "duration_s": 0}]), ["invalid-duration"]),
    (graph([{"id": "x", "kind": "text", "text": "x"}, {"id": "x", "kind": "text", "text": "again"}]), ["duplicate-node-id"]),
    (graph([{"id": "x", "kind": "text", "text": "x"}], [{"from": "x", "to": "none", "kind": "dependency"}]), ["edge-unknown-node"]),
    (graph([{"id": "x", "kind": "text", "text": "x"}], [{"from": "x", "to": "x", "kind": "dependency"}]), ["self-edge", "dependency-cycle"]),
    (graph([{"id": "a", "kind": "text", "text": "a"}, {"id": "b", "kind": "text", "text": "b"}], [{"from": "a", "to": "b", "kind": "dependency"}, {"from": "b", "to": "a", "kind": "dependency"}]), ["dependency-cycle"]),
]
for number, (bad, want) in enumerate(CASES, 1):
    check(f"blocker case {number}", error_codes(bad), want)

CONFLICT = graph(
    [{"id": "a", "kind": "text", "text": "a"}, {"id": "b", "kind": "text", "text": "b"}],
    [{"from": "a", "to": "b", "kind": "dependency"}, {"from": "b", "to": "a", "kind": "sequence"}],
)
errors, conflict_warnings = cg.validate_graph(CONFLICT)
check("reversed sequence warns but hard dependency remains", ([item["code"] for item in errors], sorted(item["code"] for item in conflict_warnings), cg.topo_sort(CONFLICT)), ([], ["missing-synopsis", "node-without-frame-intent", "node-without-frame-intent", "node-without-label", "node-without-label", "sequence-conflicts-dependency"], ["a", "b"]))

_, valid_warnings = cg.validate_graph(VALID)
check("authoring omissions warn without blocking", sorted(item["code"] for item in valid_warnings), ["missing-synopsis", "node-unconnected", "node-without-frame-intent", "node-without-frame-intent", "node-without-frame-intent", "node-without-label", "node-without-label", "node-without-label"])
```

- [ ] **Step 6: Confirm the expanded tests are red**

Run:

```bash
python3 scripts/test_content_graph.py
```

Expected: the first four assertions stay green; new assertions fail because the initial validator does not report structural errors or warnings and the initial sorter ignores `sequence`.

- [ ] **Step 7: Replace the initial validator with the complete specified behavior**

Implement these exact rules in `validate_graph`:

1. Require root object, `schema_version == 1`, an allowed intent (`single-frame`, `explainer`, `data-viz`, `promo`, `comparison`, `other`), a nonempty node list, and an edge list.
2. Process nodes in source order. Require a node object, nonempty string ID, unique ID, kind in `entity/data/text`, and respective payload: object `props`, present `data`, or string `text`. If explicit, `duration_s` must be an `int`/`float` but not `bool`, `math.isfinite`, and greater than zero.
3. Process edges in source order. Require edge object, kind in `dependency/sequence/contrast`, nonempty string `from` and `to`, known endpoints, and distinct endpoints. For usable dependency edges build an adjacency map.
4. Append `dependency-cycle` when Kahn processing of the usable dependency adjacency visits fewer valid node IDs than it contains. Ignore sequence and contrast edges for this check.
5. Add one `missing-synopsis` warning if `synopsis` is absent or not a nonempty string. For every otherwise valid node add `node-without-label` if label is absent/blank and `node-without-frame-intent` if frame_intent is absent/blank. Add `node-unconnected` for each valid node never used by any valid edge endpoint.
6. For each usable sequence `B -> A`, add `sequence-conflicts-dependency` if a depth-first or iterative reachability walk from `A` reaches `B` through dependency adjacency. Include `ref: "B->A"`. This is a warning, never an error.
7. Preserve deterministic finding order: top-level errors, node errors, edge errors, cycle error; then synopsis warning, node warnings in source order, unconnected warnings in source order, sequence-conflict warnings in edge order.

Update `topo_sort` after validation: among ready IDs, choose the first source-order ID that is not the target of a sequence edge from another ready ID. If every ready ID is such a target, choose the first source-order ID. This makes sequence a soft preference and never introduces a false cycle. Leave `contrast` absent from the ordering data structures.

Keep `total_duration_s` unchanged except use `DEFAULT_DURATION_S` only after validation has already accepted the graph.

- [ ] **Step 8: Confirm all pure API tests are green and review mutation coverage**

Run:

```bash
python3 scripts/test_content_graph.py
```

Expected: every assertion prints `PASS`, exit status is `0`.

Review these mutations against literal tests: change default duration from 3.0; let contrast reorder nodes; treat sequence as a hard edge; remove duplicate-ID detection; remove endpoint detection; ignore dependency cycles; turn a sequence conflict into an error. At least one test must fail for each mutation.

- [ ] **Step 9: Commit Task 1**

```bash
git add scripts/content_graph.py scripts/test_content_graph.py
git commit -m "feat(storyboard): add validated content-graph ordering sidecar"
```

---

### Task 2: Read-only CLI and storyboard documentation

**Files:**
- Modify: `scripts/content_graph.py`
- Modify: `scripts/test_content_graph.py`
- Modify: `references/storyboard-format.md`

**Interfaces:**
- Adds `main(argv: list[str] | None = None) -> int`.
- Adds `validate --file PATH` and `order --file PATH` commands.
- `validate` exits `0` without errors and `1` with JSON/validation errors. `order` exits `0` only after emitting a complete order; on error it exits `1` without numbered order lines.

- [ ] **Step 1: Write failing CLI behavior tests**

Add `import json`, `import subprocess`, `import sys`, and `import tempfile` beside existing imports. Append this before the test footer:

```python
SCRIPT = os.path.join(HERE, "content_graph.py")

def run_cli(command, payload):
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8", delete=False) as f:
        json.dump(payload, f)
        path = f.name
    try:
        return subprocess.run([sys.executable, SCRIPT, command, "--file", path], text=True, capture_output=True, check=False)
    finally:
        os.unlink(path)

valid_cli = run_cli("validate", VALID)
check("validate CLI accepts valid graph", valid_cli.returncode, 0)
check("validate CLI prints pass", "RESULT: PASS" in valid_cli.stdout, True)

ordered_cli = run_cli("order", SEQUENCE)
check("order CLI prints full order and total", ordered_cli.stdout.splitlines()[-3:], ["1. first — 3.0s (cumulative 3.0s)", "2. later — 3.0s (cumulative 6.0s)", "TOTAL: 6.0s"])

invalid_cli = run_cli("order", CASES[8][0])
check("invalid order exits one", invalid_cli.returncode, 1)
check("invalid order identifies cycle", "dependency-cycle" in invalid_cli.stdout, True)
check("invalid order emits no partial number", "1. " in invalid_cli.stdout, False)
```

- [ ] **Step 2: Confirm CLI tests are red**

Run:

```bash
python3 scripts/test_content_graph.py
```

Expected: pure API tests pass; CLI assertions fail because no parser or command output exists.

- [ ] **Step 3: Add the read-only CLI**

Add `argparse`, `json`, and `sys` imports. Implement these operations:

1. Parse required subcommands `validate` and `order`, each with required `--file PATH`.
2. Read `--file` as UTF-8 JSON. For read error or `json.JSONDecodeError`, print `ERROR [invalid-json] <original error>` and return `1`.
3. Run `validate_graph`; print every error as `ERROR [<code>] <message>` and every warning as `WARN  [<code>] <message>`.
4. If any errors exist, print `RESULT: FAIL — <count> error(s)` and return `1`.
5. For `validate` without errors, print exactly `RESULT: PASS` and return `0`.
6. For `order` without errors, call `topo_sort`; print one line per node as `<index>. <label-or-id> — <duration>.1fs (cumulative <total>.1fs)`, then `TOTAL: <total>.1fs`, and return `0`.
7. End the module with `raise SystemExit(main())` only under `if __name__ == "__main__":`. The CLI must never write a graph, storyboard, or project file.

- [ ] **Step 4: Confirm all sidecar tests are green**

Run:

```bash
python3 scripts/test_content_graph.py
```

Expected: every pure API and CLI assertion prints `PASS`; exit status is `0`.

- [ ] **Step 5: Document the optional workflow**

Append this section after `## Notes` in `references/storyboard-format.md`:

```markdown
## Optional content graph — `CONTENT_GRAPH.json`

For a film with explanatory dependencies, competing claims, or a complex sequence, create an optional
`CONTENT_GRAPH.json` beside `STORYBOARD.md` before the board. It records content nodes and relationships;
it never replaces the Markdown board.

```bash
python3 scripts/content_graph.py validate --file CONTENT_GRAPH.json
python3 scripts/content_graph.py order --file CONTENT_GRAPH.json
```

`dependency` edges are hard prerequisites. `sequence` edges break ties only when independent nodes are
simultaneously ready. `contrast` edges do not alter order; they prompt a comparison layout. Fix errors before
using the suggested order. Warnings are review prompts, not delivery blockers.

Turn the suggested node order into ordinary `STORYBOARD.md` frames yourself, adding `scene`, `voiceover`,
`reads`, `sound`, actual durations, and source paths. A graph node may become one frame, or several closely
related nodes may become one frame. `STORYBOARD.md` and `boards/storyboard.html` remain the files the person
reviews and existing tools understand.

The exact format and validation semantics are in
`docs/superpowers/specs/2026-11-01-content-graph-sidecar-design.md`.
```

- [ ] **Step 6: Run all relevant verification and inspect scope**

Run:

```bash
python3 scripts/test_content_graph.py
node --test scripts/gate.test.mjs scripts/frame-presets-license.test.mjs
git diff --check
git diff -- scripts/content_graph.py scripts/test_content_graph.py references/storyboard-format.md
```

Expected: content-graph test exits `0`; Node reports `12` passing tests and `0` failures; `git diff --check` is silent. Inspect the diff and confirm it includes only the optional sidecar, its tests, and the documentation section.

- [ ] **Step 7: Commit Task 2**

```bash
git add scripts/content_graph.py scripts/test_content_graph.py references/storyboard-format.md
git commit -m "feat(storyboard): expose optional content-graph CLI and workflow"
```

---

## Plan self-review

- **Spec coverage:** Task 1 covers the top-level contract, all node and edge categories, blockers, warnings, dependency-only cycle checks, deterministic ordering, and duration. Task 2 covers file loading, commands, output, exit codes, and existing-storyboard documentation. No task modifies a renderer, existing parser, or project without a graph.
- **Test-first integrity:** Step 2 observes a missing-module failure. Step 6 observes failures for every behavior absent from the initial implementation. Task 2 observes CLI failures before adding CLI code.
- **No placeholders:** Tests contain literal fixtures and expected output. Every public function, finding code, ordering rule, CLI line format, target file, and commit command is specified; no behavior is deferred.
- **Type consistency:** `validate_graph` returns `(errors, warnings)` everywhere; `topo_sort` returns node IDs; `total_duration_s` returns a float; `main` returns an exit code. JSON fields use `schema_version`, `frame_intent`, and `duration_s` consistently.
- **Scope:** The two commits are independently reviewable: pure graph behavior, then read-only integration/docs. No external dependency or cross-project coupling is introduced.
