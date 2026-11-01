#!/usr/bin/env python3
import importlib.util
import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location(
    "content_graph", os.path.join(HERE, "content_graph.py"))
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
check("dependency orders hook before proof and source order breaks remaining tie",
      cg.topo_sort(VALID), ["hook", "proof", "viewer"])
check("omitted duration uses 3.0 seconds", cg.total_duration_s(VALID), 9.5)


def graph(nodes, edges=(), **extra):
    return {
        "schema_version": 1,
        "intent": "other",
        "nodes": nodes,
        "edges": list(edges),
        **extra,
    }


def error_codes(value):
    return [item["code"] for item in cg.validate_graph(value)[0]]


SEQUENCE = graph(
    [
        {"id": "later", "kind": "text", "text": "later"},
        {"id": "first", "kind": "text", "text": "first"},
    ],
    [{"from": "first", "to": "later", "kind": "sequence"}],
)
CONTRAST = graph(
    [
        {"id": "a", "kind": "text", "text": "before"},
        {"id": "b", "kind": "text", "text": "after"},
    ],
    [{"from": "b", "to": "a", "kind": "contrast"}],
)
check("sequence changes a ready-node tie only", cg.topo_sort(SEQUENCE),
      ["first", "later"])
check("contrast does not change source-array order", cg.topo_sort(CONTRAST),
      ["a", "b"])

CASES = [
    ([], ["invalid-root"]),
    ({}, ["invalid-schema-version", "invalid-intent", "empty-graph", "invalid-edges"]),
    (graph([], []), ["empty-graph"]),
    ({"schema_version": 2, "intent": "other", "nodes": [], "edges": []},
     ["invalid-schema-version", "empty-graph"]),
    ({"schema_version": True, "intent": "other", "nodes": [], "edges": []},
     ["invalid-schema-version", "empty-graph"]),
    ({"schema_version": 1, "intent": "unknown", "nodes": [], "edges": []},
     ["invalid-intent", "empty-graph"]),
    (graph(["not-a-node"]), ["invalid-node"]),
    (graph([{"id": " ", "kind": "text", "text": "x"}]), ["invalid-node-id"]),
    (graph([{"id": "x", "kind": "bogus"}]), ["invalid-kind"]),
    (graph([{"id": "x", "kind": "entity", "props": []}]), ["invalid-node-payload"]),
    (graph([{"id": "x", "kind": "data"}]), ["invalid-node-payload"]),
    (graph([{"id": "x", "kind": "text", "text": 3}]), ["invalid-node-payload"]),
    (graph([{"id": "x", "kind": "text", "text": "x", "duration_s": 0}]),
     ["invalid-duration"]),
    (graph([{"id": "x", "kind": "text", "text": "x", "duration_s": None}]),
     ["invalid-duration"]),
    (graph([{"id": "x", "kind": "text", "text": "x", "duration_s": True}]),
     ["invalid-duration"]),
    (graph([{"id": "x", "kind": "text", "text": "x", "duration_s": float("inf")}]),
     ["invalid-duration"]),
    (graph([
        {"id": "x", "kind": "text", "text": "x"},
        {"id": "x", "kind": "text", "text": "again"},
    ]), ["duplicate-node-id"]),
    ({
        "schema_version": 1,
        "intent": "other",
        "nodes": [{"id": "x", "kind": "text", "text": "x"}],
        "edges": "not-a-list",
    },
     ["invalid-edges"]),
    (graph([{"id": "x", "kind": "text", "text": "x"}], ["not-an-edge"]),
     ["invalid-edge"]),
    (graph([{"id": "x", "kind": "text", "text": "x"}],
           [{"from": "x", "to": "x", "kind": "bad"}]),
     ["invalid-edge-kind"]),
    (graph([{"id": "x", "kind": "text", "text": "x"}],
           [{"from": "x", "kind": "dependency"}]),
     ["invalid-edge-endpoint"]),
    (graph([{"id": "x", "kind": "text", "text": "x"}],
           [{"from": "x", "to": "none", "kind": "dependency"}]),
     ["edge-unknown-node"]),
    (graph([{"id": "x", "kind": "text", "text": "x"}],
           [{"from": "x", "to": "x", "kind": "dependency"}]),
     ["self-edge", "dependency-cycle"]),
    (graph([
        {"id": "a", "kind": "text", "text": "a"},
        {"id": "b", "kind": "text", "text": "b"},
    ], [
        {"from": "a", "to": "b", "kind": "dependency"},
        {"from": "b", "to": "a", "kind": "dependency"},
    ]), ["dependency-cycle"]),
]
for number, (bad, want) in enumerate(CASES, 1):
    check(f"blocker case {number}", error_codes(bad), want)

CONFLICT = graph(
    [
        {"id": "a", "kind": "text", "text": "a"},
        {"id": "b", "kind": "text", "text": "b"},
    ],
    [
        {"from": "a", "to": "b", "kind": "dependency"},
        {"from": "b", "to": "a", "kind": "sequence"},
    ],
)
errors, conflict_warnings = cg.validate_graph(CONFLICT)
check("reversed sequence warns but hard dependency remains", (
    [item["code"] for item in errors],
    sorted(item["code"] for item in conflict_warnings),
    cg.topo_sort(CONFLICT),
), ([], [
    "missing-synopsis",
    "node-without-frame-intent", "node-without-frame-intent",
    "node-without-label", "node-without-label",
    "sequence-conflicts-dependency",
], ["a", "b"]))

_, valid_warnings = cg.validate_graph(VALID)
check("authoring omissions warn without blocking",
      sorted(item["code"] for item in valid_warnings), [
          "missing-synopsis",
          "node-unconnected",
          "node-without-frame-intent", "node-without-frame-intent",
          "node-without-frame-intent",
          "node-without-label", "node-without-label", "node-without-label",
      ])


SCRIPT = os.path.join(HERE, "content_graph.py")


def run_cli(command, payload):
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8",
                                     delete=False) as f:
        json.dump(payload, f)
        path = f.name
    try:
        return subprocess.run(
            [sys.executable, SCRIPT, command, "--file", path],
            text=True, capture_output=True, check=False)
    finally:
        os.unlink(path)


def run_cli_with_text(command, text):
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8",
                                     delete=False) as f:
        f.write(text)
        path = f.name
    try:
        return subprocess.run(
            [sys.executable, SCRIPT, command, "--file", path],
            text=True, capture_output=True, check=False)
    finally:
        os.unlink(path)


def run_cli_with_bytes(command, content):
    with tempfile.NamedTemporaryFile("wb", suffix=".json", delete=False) as f:
        f.write(content)
        path = f.name
    try:
        return subprocess.run(
            [sys.executable, SCRIPT, command, "--file", path],
            text=True, capture_output=True, check=False)
    finally:
        os.unlink(path)


valid_cli = run_cli("validate", VALID)
check("validate CLI accepts valid graph", valid_cli.returncode, 0)
check("validate CLI prints pass", "RESULT: PASS" in valid_cli.stdout, True)

ordered_cli = run_cli("order", SEQUENCE)
check("order CLI prints full order and total", ordered_cli.stdout.splitlines()[-3:], [
    "1. first — 3.0s (cumulative 3.0s)",
    "2. later — 3.0s (cumulative 6.0s)",
    "TOTAL: 6.0s",
])

invalid_cli = run_cli("order", CASES[-1][0])
check("invalid order exits one", invalid_cli.returncode, 1)
check("invalid order identifies cycle", "dependency-cycle" in invalid_cli.stdout, True)
check("invalid order emits no partial number", "1. " in invalid_cli.stdout, False)

invalid_json_cli = run_cli_with_text("validate", "{not JSON")
check("malformed JSON exits one", invalid_json_cli.returncode, 1)
check("malformed JSON identifies parse failure", "ERROR [invalid-json]" in invalid_json_cli.stdout,
      True)

invalid_utf8_cli = run_cli_with_bytes("validate", b"\xff\xfe")
check("invalid UTF-8 exits one", invalid_utf8_cli.returncode, 1)
check("invalid UTF-8 identifies read failure", "ERROR [invalid-json]" in invalid_utf8_cli.stdout,
      True)

with tempfile.TemporaryDirectory() as directory:
    missing_file_cli = subprocess.run(
        [sys.executable, SCRIPT, "validate", "--file", os.path.join(directory, "missing.json")],
        text=True, capture_output=True, check=False)
check("missing file exits one", missing_file_cli.returncode, 1)
check("missing file identifies read failure", "ERROR [invalid-json]" in missing_file_cli.stdout,
      True)


if __name__ == "__main__":
    raise SystemExit(0 if OK else 1)
