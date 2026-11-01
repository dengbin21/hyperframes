#!/usr/bin/env node
/* frame-presets-license.test.mjs — ensure every distributable frame preset names
 * its license, source anchor and any bundled third-party assets.
 *
 * node --test scripts/frame-presets-license.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const presets = join(root, "assets", "frame-presets");
const names = readdirSync(presets).filter((name) => name !== ".DS_Store").sort();

function metadata(path) {
  const text = readFileSync(path, "utf8");
  const match = text.match(/\n(provenance:\n[\s\S]*?)\n---\n/);
  assert.ok(match, `${path} must have a provenance metadata section`);
  return match[1];
}

function parsedMetadata(path) {
  // Existing preset specs predate this contract and contain YAML-like style keys such as
  // `body-lede:{...}`, so parsing their whole preamble would test unrelated upstream
  // formatting. The license/provenance section introduced here is standalone YAML and
  // must remain parseable by a real YAML parser.
  const source = metadata(path);
  const json = execFileSync(
    "python3",
    ["-c", "import json, sys, yaml; print(json.dumps(yaml.safe_load(sys.stdin.read())))"],
    { encoding: "utf8", input: source },
  );
  return JSON.parse(json);
}

function scalar(yaml, key) {
  const match = yaml.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim().replace(/^"|"$/g, "");
}

test("every frame preset is provenance-anchored and Apache-2.0 redistributable", () => {
  assert.equal(names.length, 13, "the audited v0.8.214 bundle contains 13 presets");
  for (const name of names) {
    const yaml = metadata(join(presets, name, "FRAME.md"));
    assert.equal(scalar(yaml, "spdx"), "Apache-2.0", `${name}: SPDX license`);
    assert.equal(scalar(yaml, "attribution_required"), "true", `${name}: preserve upstream attribution`);
    assert.equal(scalar(yaml, "redistribution_allowed"), "true", `${name}: redistribution permission`);
    assert.equal(scalar(yaml, "commercial_use"), "true", `${name}: commercial permission`);
    assert.equal(scalar(yaml, "source_version"), "0.8.214", `${name}: source bundle version`);
    assert.equal(
      scalar(yaml, "local_baseline_commit"),
      "f1b0a8446adc9c9a40e0ff851d5b93ef1524a263",
      `${name}: local baseline anchor`,
    );
  }
});

test("the preset with bundled fonts declares their independent OFL license", () => {
  const yaml = metadata(join(presets, "code-editorial", "FRAME.md"));
  assert.match(yaml, /assets_attribution:\n[\s\S]*?license: "SIL-OFL-1\.1"/,
    "code-editorial must name the bundled font license");
  assert.match(yaml, /Inter \+ EB Garamond \+ JetBrains Mono/,
    "code-editorial must identify all bundled font families");
});

test("every added license/provenance section is valid standalone YAML", () => {
  for (const name of names) {
    const data = parsedMetadata(join(presets, name, "FRAME.md"));
    assert.equal(data.license.spdx, "Apache-2.0", `${name}: parsed SPDX license`);
    assert.equal(data.provenance.source_version, "0.8.214", `${name}: parsed source version`);
  }
});
