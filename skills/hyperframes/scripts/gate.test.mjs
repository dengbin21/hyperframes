#!/usr/bin/env node
/* gate.test.mjs — the gate's detections, proven on synthetic films whose answer is known.
 *
 *   node --test scripts/gate.test.mjs
 *
 * Each case renders a tiny film where exactly one property is dialled in, so a detector
 * that is right here is right for the reason it claims: blank on a flat ground, clean on a
 * ground with a stroke; a frozen picture versus a moving one; blue-purple on a purple
 * ground, clean on navy; a crossfade that is not motion; a one-frame pop against a held
 * element.
 *
 * Motion is built with `overlay` and a `t` expression because `drawbox` does not evaluate
 * `t` per frame — a fixture that quietly never moves would pass a detector that never
 * fires, which is the one thing this file exists to prevent.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { measure } from "./gate.mjs";

const dir = mkdtempSync(join(tmpdir(), "gate-test-"));
let n = 0;
process.on("exit", () => rmSync(dir, { recursive: true, force: true }));

const ff = (args) =>
  execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: ["ignore", "ignore", "inherit"] });
const ground = (color, w, h, dur) => `color=c=${color}:s=${w}x${h}:r=30:d=${dur}`;

/* A film: one ground, plus optional elements laid over it with expressions in t. */
function render(name, { w = 320, h = 180, dur = 3, color = "0x1b1b1b", elements = [] } = {}) {
  const out = join(dir, `${name}-${n++}.mp4`);
  if (!elements.length) {
    ff(["-f", "lavfi", "-i", ground(color, w, h, dur), "-pix_fmt", "yuv420p", "-c:v", "libx264", "-r", "30", out]);
    return out;
  }
  const args = ["-f", "lavfi", "-i", ground(color, w, h, dur)];
  for (const e of elements) {
    args.push("-f", "lavfi", "-i", `color=c=${e.color ?? "white"}:s=${e.w}x${e.h}:r=30:d=${dur}`);
  }
  let chain = "";
  let src = "[0:v]";
  elements.forEach((e, i) => {
    const en = e.enable ? `:enable='${e.enable}'` : "";
    chain += `${src}[${i + 1}:v]overlay=x='${e.x ?? 0}':y='${e.y ?? 0}'${en}[o${i}];`;
    src = `[o${i}]`;
  });
  chain += `${src}null[out]`;
  args.push("-filter_complex", chain, "-map", "[out]", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-r", "30", out);
  ff(args);
  return out;
}

test("a flat ground is an empty frame; one stroke is not", () => {
  const blank = render("blank", { dur: 3 });
  const stroke = render("stroke", { dur: 3, elements: [{ w: 240, h: 4, x: 40, y: 90 }] });
  const a = measure(blank);
  const b = measure(stroke);
  assert.equal(a.lights.blank_run_s, "red", "flat ground must read as blank");
  assert.ok(a.blank_run_s >= 0.3, `blank run ${a.blank_run_s}s should clear 0.3s`);
  assert.equal(b.lights.blank_run_s, "green", "a ground with a stroke must not read as blank");
});

test("a still file is caught by frozen picture, a moving one is not", () => {
  const still = render("still", { dur: 3 });
  const moving = render("moving", {
    elements: [
      { w: 130, h: 180, x: "mod(t*110,320)", y: 0, color: "white@0.9" },
      { w: 320, h: 70, x: 0, y: "mod(t*70,180)", color: "white@0.7" },
    ],
  });
  const a = measure(still);
  const b = measure(moving);
  assert.ok(a.static_share >= 0.98, `a still should freeze every cell, got ${a.static_share}`);
  assert.equal(a.lights.static_share, "red");
  assert.ok(b.static_share < 0.5, `a sweeping frame should freeze few cells, got ${b.static_share}`);
  assert.equal(b.lights.static_share, "green");
});

test("blue-purple ground is flagged, navy is not", () => {
  const purple = render("purple", { dur: 2, color: "0x5a3fc8" });
  const navy = render("navy", { dur: 2, color: "0x14213d" });
  const a = measure(purple);
  const b = measure(navy);
  assert.ok(a.blue_purple_share > 0.9, `purple share ${a.blue_purple_share} should be near 1`);
  assert.equal(a.lights.blue_purple_share, "red");
  assert.ok(b.blue_purple_share < 0.1, `navy share ${b.blue_purple_share} should be near 0`);
  assert.equal(b.lights.blue_purple_share, "green");
});

test("a declared blue-purple subject drops the gate to yellow, never green", () => {
  const purple = render("purple2", { dur: 2, color: "0x5a3fc8" });
  const r = measure(purple, { allowBluePurple: "the brief names a cyberpunk look" });
  assert.equal(r.lights.blue_purple_share, "yellow");
  assert.equal(r.allow_blue_purple, "the brief names a cyberpunk look");
});

test("a cut is not motion; a crossfade is not motion; a move inside the shot is", () => {
  const left = join(dir, `l-${n++}.png`);
  const right = join(dir, `r-${n++}.png`);
  ff(["-f", "lavfi", "-i", ground("0x101010", 320, 180, 1), "-frames:v", "1", "-vf", "drawbox=x=20:y=20:w=60:h=60:color=white:t=fill", left]);
  ff(["-f", "lavfi", "-i", ground("0x101010", 320, 180, 1), "-frames:v", "1", "-vf", "drawbox=x=240:y=100:w=60:h=60:color=white:t=fill", right]);

  const slides = join(dir, `slides-${n++}.mp4`);
  ff([
    "-loop", "1", "-t", "1.5", "-i", left,
    "-loop", "1", "-t", "1.5", "-i", right,
    "-filter_complex", "[0:v][1:v]concat=n=2:v=1:a=0",
    "-pix_fmt", "yuv420p", "-c:v", "libx264", "-r", "30", slides,
  ]);

  const fade = join(dir, `fade-${n++}.mp4`);
  ff([
    "-loop", "1", "-t", "1.5", "-i", left,
    "-loop", "1", "-t", "1.5", "-i", right,
    "-filter_complex", "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=1.0",
    "-pix_fmt", "yuv420p", "-c:v", "libx264", "-r", "30", fade,
  ]);

  const moving = render("moving2", { elements: [{ w: 120, h: 120, x: "20+t*200", y: 30 }] });

  const a = measure(slides);
  const b = measure(fade);
  const c = measure(moving);
  assert.ok(a.fast_ratio < 0.02, `a hard cut must not count as motion, got ${a.fast_ratio}`);
  assert.ok(b.fast_ratio < 0.02, `a crossfade must not count as motion, got ${b.fast_ratio}`);
  assert.ok(b.dissolves >= 1, `the crossfade should be found, got ${b.dissolves}`);
  assert.ok(c.fast_ratio > 0.15, `a sweeping element must count, got ${c.fast_ratio}`);
});

test("one-frame pop is reported, a held element is not", () => {
  const pop = render("pop", { dur: 2, elements: [{ w: 80, h: 60, x: 120, y: 60, enable: "between(t,1,1.09)" }] });
  const held = render("held", { dur: 2, elements: [{ w: 80, h: 60, x: 120, y: 60, enable: "between(t,0.9,1.5)" }] });
  const a = measure(pop);
  const b = measure(held);
  assert.ok(a.pops_s.length >= 1, `single-frame pop should be reported, got ${a.pops_s.length}`);
  assert.equal(b.pops_s.length, 0, `a held element must not be reported, got ${b.pops_s}`);
});

test("dead_area separates wallpaper from a sweeping frame", () => {
  // One small mover on a still ground: most 32px cells never change within the shot.
  const wallpaper = render("wallpaper", { dur: 3, elements: [{ w: 40, h: 40, x: "mod(t*70,280)", y: 20 }] });
  // Two layers crossing the frame linearly (no wrap: a wrap jump would read as a cut and
  // reset the per-shot accumulator): the vertical one covers every column, the tall one
  // crosses most columns over every row.
  const sweeping = render("sweeping", {
    elements: [
      { w: 100, h: 170, x: "10+t*70", y: 5, color: "white@0.9" },
      { w: 320, h: 70, x: 0, y: "10+t*30", color: "white@0.7" },
    ],
  });
  const a = measure(wallpaper);
  const b = measure(sweeping);
  assert.ok(a.dead_area > 0.5, `a small mover over a still ground should leave most cells dead, got ${a.dead_area}`);
  assert.ok(b.dead_area < 0.4, `two sweeping layers should keep most cells alive, got ${b.dead_area}`);
});

test("a pan is never a cut; a hard cut is found", () => {
  const pan = render("pan", { dur: 3, elements: [{ w: 100, h: 170, x: "t*100", y: 5 }] });
  const left = join(dir, `l2-${n++}.png`);
  const right = join(dir, `r2-${n++}.png`);
  ff(["-f", "lavfi", "-i", ground("0x101010", 320, 180, 1), "-frames:v", "1", "-vf", "drawbox=x=20:y=20:w=60:h=60:color=white:t=fill", left]);
  ff(["-f", "lavfi", "-i", ground("0x101010", 320, 180, 1), "-frames:v", "1", "-vf", "drawbox=x=240:y=100:w=60:h=60:color=white:t=fill", right]);
  const slides = join(dir, `slides2-${n++}.mp4`);
  ff([
    "-loop", "1", "-t", "1.5", "-i", left,
    "-loop", "1", "-t", "1.5", "-i", right,
    "-filter_complex", "[0:v][1:v]concat=n=2:v=1:a=0",
    "-pix_fmt", "yuv420p", "-c:v", "libx264", "-r", "30", slides,
  ]);
  const a = measure(pan);
  const b = measure(slides);
  assert.equal(a.hard_cuts, 0, `a continuous pan must not register a cut, got ${a.hard_cuts}`);
  assert.ok(a.fast_ratio > 0.1, `the pan still counts as in-shot motion, got ${a.fast_ratio}`);
  assert.ok(b.hard_cuts >= 1, `a hard cut must register, got ${b.hard_cuts}`);
});

test("exit codes: red exits 2, green exits 0, unreadable exits 1", () => {
  const gatePath = fileURLToPath(new URL("./gate.mjs", import.meta.url));
  const run = (file) => spawnSync(process.execPath, [gatePath, file], { stdio: "ignore" }).status;
  const red = render("exit-red", { dur: 3 });
  const green = render("exit-green", {
    elements: [
      { w: 130, h: 180, x: "mod(t*110,320)", y: 0, color: "white@0.9" },
      { w: 320, h: 70, x: 0, y: "mod(t*70,180)", color: "white@0.7" },
    ],
  });
  const tiny = render("exit-tiny", { dur: 0.05 });
  assert.equal(run(red), 2, "a blank flat film is red and must exit 2");
  assert.equal(run(green), 0, "a moving film with a subject must exit 0");
  assert.equal(run(tiny), 1, "a file with too few frames to analyse must exit 1");
});
