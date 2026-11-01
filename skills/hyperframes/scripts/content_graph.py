#!/usr/bin/env python3
"""Optional CONTENT_GRAPH.json validation and suggested-order helpers.

This is a planning sidecar. It never writes a storyboard, composition, or
rendered asset. See references/storyboard-format.md for the human workflow.
"""
import argparse
import json
import math
import sys

DEFAULT_DURATION_S = 3.0
INTENTS = {"single-frame", "explainer", "data-viz", "promo", "comparison", "other"}
NODE_KINDS = {"entity", "data", "text"}
EDGE_KINDS = {"dependency", "sequence", "contrast"}


def finding(code, message, ref=None):
    """Build a stable, serializable validation finding."""
    result = {"code": code, "message": message}
    if ref is not None:
        result["ref"] = ref
    return result


def nonempty_string(value):
    return isinstance(value, str) and bool(value.strip())


def dependency_reaches(adjacency, start, target):
    """Return whether following hard dependency edges can reach target."""
    pending, seen = [start], set()
    while pending:
        current = pending.pop()
        if current == target:
            return True
        if current not in seen:
            seen.add(current)
            pending.extend(adjacency.get(current, ()))
    return False


def has_dependency_cycle(adjacency, ids):
    """Kahn's processed-node count detects a cycle in hard edges only."""
    indegree = {node_id: 0 for node_id in ids}
    for targets in adjacency.values():
        for target in targets:
            indegree[target] += 1
    ready = [node_id for node_id in ids if indegree[node_id] == 0]
    visited = 0
    while ready:
        node_id = ready.pop()
        visited += 1
        for target in adjacency[node_id]:
            indegree[target] -= 1
            if indegree[target] == 0:
                ready.append(target)
    return visited != len(ids)


def validate_graph(graph):
    """Return (errors, warnings) for a JSON-shaped content graph.

    Errors prevent an order from being produced. Warnings describe incomplete
    authoring metadata or a soft sequence preference that contradicts a hard
    dependency, but never block use of the graph.
    """
    errors, warnings = [], []
    if not isinstance(graph, dict):
        return ([finding("invalid-root", "Graph root must be an object")], [])

    if (isinstance(graph.get("schema_version"), bool) or
            graph.get("schema_version") != 1):
        errors.append(finding("invalid-schema-version",
                              "schema_version must be 1"))
    if graph.get("intent") not in INTENTS:
        errors.append(finding("invalid-intent", "intent must be a supported value"))

    nodes = graph.get("nodes")
    if not isinstance(nodes, list) or not nodes:
        errors.append(finding("empty-graph", "nodes must be a nonempty array"))
        nodes = []
    edges = graph.get("edges")
    if not isinstance(edges, list):
        errors.append(finding("invalid-edges", "edges must be an array"))
        edges = []

    known_ids = set()
    valid_nodes = []
    for node in nodes:
        if not isinstance(node, dict):
            errors.append(finding("invalid-node", "Node must be an object"))
            continue
        node_id = node.get("id")
        if not nonempty_string(node_id):
            errors.append(finding("invalid-node-id",
                                  "Node id must be a nonempty string"))
            continue
        if node_id in known_ids:
            errors.append(finding("duplicate-node-id",
                                  f'Duplicate node id "{node_id}"', node_id))
            continue
        known_ids.add(node_id)
        kind = node.get("kind")
        if kind not in NODE_KINDS:
            errors.append(finding("invalid-kind",
                                  f'Node "{node_id}" has unsupported kind "{kind}"', node_id))
            continue
        if ((kind == "entity" and not isinstance(node.get("props"), dict)) or
                (kind == "data" and "data" not in node) or
                (kind == "text" and not isinstance(node.get("text"), str))):
            errors.append(finding("invalid-node-payload",
                                  f'Node "{node_id}" has an invalid {kind} payload', node_id))
            continue
        if "duration_s" in node:
            duration = node["duration_s"]
            if (isinstance(duration, bool) or not isinstance(duration, (int, float)) or
                    not math.isfinite(duration) or duration <= 0):
                errors.append(finding(
                    "invalid-duration",
                    f'Node "{node_id}" duration_s must be a finite positive number',
                    node_id))
                continue
        valid_nodes.append(node)

    dependency_adjacency = {node["id"]: [] for node in valid_nodes}
    usable_edges = []
    usable_sequence_edges = []
    connected = set()
    for edge in edges:
        if not isinstance(edge, dict):
            errors.append(finding("invalid-edge", "Edge must be an object"))
            continue
        kind = edge.get("kind")
        if kind not in EDGE_KINDS:
            errors.append(finding("invalid-edge-kind",
                                  f'Edge has unsupported kind "{kind}"'))
            continue
        source, target = edge.get("from"), edge.get("to")
        if not nonempty_string(source) or not nonempty_string(target):
            errors.append(finding("invalid-edge-endpoint",
                                  "Edge from and to must be nonempty strings"))
            continue
        edge_ref = f"{source}->{target}"
        if source not in dependency_adjacency or target not in dependency_adjacency:
            errors.append(finding("edge-unknown-node",
                                  f'Edge {edge_ref} references an unknown node', edge_ref))
            continue
        if source == target:
            errors.append(finding("self-edge", f"Edge {edge_ref} is a self-edge", edge_ref))
        else:
            connected.update((source, target))
        usable_edges.append(edge)
        if kind == "dependency":
            dependency_adjacency[source].append(target)
        elif kind == "sequence" and source != target:
            usable_sequence_edges.append(edge)

    if dependency_adjacency and has_dependency_cycle(dependency_adjacency,
                                                      list(dependency_adjacency)):
        errors.append(finding("dependency-cycle", "Dependency cycle detected"))

    if not nonempty_string(graph.get("synopsis")):
        warnings.append(finding("missing-synopsis", "synopsis is missing"))
    for node in valid_nodes:
        node_id = node["id"]
        if not nonempty_string(node.get("label")):
            warnings.append(finding("node-without-label",
                                    f'Node "{node_id}" has no label', node_id))
        if not nonempty_string(node.get("frame_intent")):
            warnings.append(finding("node-without-frame-intent",
                                    f'Node "{node_id}" has no frame_intent', node_id))
    for node in valid_nodes:
        node_id = node["id"]
        if node_id not in connected:
            warnings.append(finding("node-unconnected",
                                    f'Node "{node_id}" has no edge', node_id))
    for edge in usable_sequence_edges:
        source, target = edge["from"], edge["to"]
        if dependency_reaches(dependency_adjacency, target, source):
            edge_ref = f"{source}->{target}"
            warnings.append(finding("sequence-conflicts-dependency",
                                    f"Sequence {edge_ref} conflicts with a dependency", edge_ref))

    return errors, warnings


def topo_sort(graph):
    """Return deterministic playback order after validation succeeds."""
    errors, _ = validate_graph(graph)
    if errors:
        raise ValueError(errors[0]["message"])

    nodes = graph["nodes"]
    order_index = {node["id"]: index for index, node in enumerate(nodes)}
    indegree = {node["id"]: 0 for node in nodes}
    dependents = {node["id"]: [] for node in nodes}
    sequence_after = {node["id"]: set() for node in nodes}
    for edge in graph["edges"]:
        source, target = edge["from"], edge["to"]
        if edge["kind"] == "dependency":
            dependents[source].append(target)
            indegree[target] += 1
        elif edge["kind"] == "sequence":
            sequence_after[source].add(target)

    ready = [node["id"] for node in nodes if indegree[node["id"]] == 0]
    result = []
    while ready:
        ready.sort(key=order_index.__getitem__)
        pick_index = 0
        for index, candidate in enumerate(ready):
            if not any(candidate in sequence_after[other]
                       for other in ready if other != candidate):
                pick_index = index
                break
        node_id = ready.pop(pick_index)
        result.append(node_id)
        for target in dependents[node_id]:
            indegree[target] -= 1
            if indegree[target] == 0:
                ready.append(target)

    if len(result) != len(nodes):
        raise ValueError("Dependency cycle detected")
    return result


def total_duration_s(graph, order=None):
    """Return the duration of an already-valid graph in a suggested order."""
    by_id = {node["id"]: node for node in graph["nodes"]}
    return sum(by_id[node_id].get("duration_s", DEFAULT_DURATION_S)
               for node_id in (order or topo_sort(graph)))


def load_graph(path):
    """Read one UTF-8 JSON graph file without modifying it."""
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f), None
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        return None, str(error)


def print_findings(errors, warnings):
    """Print validation findings in their established deterministic order."""
    for item in errors:
        print(f"ERROR [{item['code']}] {item['message']}")
    for item in warnings:
        print(f"WARN  [{item['code']}] {item['message']}")


def main(argv=None):
    """Run the read-only validate or order command and return its exit code."""
    parser = argparse.ArgumentParser(
        description="Validate and order an optional CONTENT_GRAPH.json sidecar")
    subparsers = parser.add_subparsers(dest="command", required=True)
    for command in ("validate", "order"):
        subparser = subparsers.add_parser(command)
        subparser.add_argument("--file", required=True)
    args = parser.parse_args(argv)

    graph, load_error = load_graph(args.file)
    if load_error:
        print(f"ERROR [invalid-json] {load_error}")
        return 1

    errors, warnings = validate_graph(graph)
    print_findings(errors, warnings)
    if errors:
        print(f"RESULT: FAIL — {len(errors)} error(s)")
        return 1
    if args.command == "validate":
        print("RESULT: PASS")
        return 0

    order = topo_sort(graph)
    nodes_by_id = {node["id"]: node for node in graph["nodes"]}
    cumulative = 0.0
    for index, node_id in enumerate(order, 1):
        node = nodes_by_id[node_id]
        duration = node.get("duration_s", DEFAULT_DURATION_S)
        cumulative += duration
        label = node.get("label") or node_id
        print(f"{index}. {label} — {duration:.1f}s (cumulative {cumulative:.1f}s)")
    print(f"TOTAL: {cumulative:.1f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
