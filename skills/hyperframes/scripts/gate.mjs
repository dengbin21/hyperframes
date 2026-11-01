#!/usr/bin/env node
/* gate.mjs — measure a rendered film for the failures a contact sheet cannot show.
 *
 *   node scripts/gate.mjs film.mp4 [--json] [--sub-band 0.15] [--allow-blue-purple "reason"]
 *
 * `check` reads the source; a contact sheet reads stills; the review pass reads your eye.
 * None of them can tell you that a stretch of the rendered file is an empty frame, that it
 * settled on the blue-purple ground every generated film lands on, or that nothing in it
 * moved at all. Those are measurements, and they belong in the same gate as `check`.
 *
 * What is gated is only what is true of any film whatever its genre, so no threshold here
 * has to be tuned per film:
 *
 *   blank_run_s        longest run of mid-film frames with almost no edge anywhere.
 *                      >= 0.3 s red. Catches the subject leaving the picture, and a
 *                      transition that rests on a flat colour.
 *   blue_purple_share  share of the film whose pixels are blue-purple (hue 225-300 deg,
 *                      saturated, mid-lightness). >= 0.30 red, >= 0.12 yellow.
 *   static_share       share of the picture that never changes anywhere in the film.
 *                      >= 0.98 red: the file is a still, or as good as one.
 *
 * Everything else is measured and reported, never gated, because its line depends on what
 * the film is trying to do:
 *
 *   fast_ratio    share of frame pairs that move inside a shot (cuts, crossfades and the
 *                 subtitle band excluded). Higher means more motion inside shots rather than
 *                 between them. Do NOT compare it to a fixed number: HyperFrames reviewed
 *                 four delivered films against the 0.035 line it was calibrated on for
 *                 narrated explainers, and every one of them landed red — a painted fable
 *                 that holds a shot while the art moves is not a slideshow, and that line
 *                 does not describe this genre. Read it as a trend across your own films.
 *   dead_area     share of the picture whose content never changes within its shots. High
 *                 means the frame is a wallpaper with a corner moving; the fix is to move
 *                 what is already there, not to add an element.
 *   still_ratio   share of frame pairs with no visible change.
 *   pops_s        one-frame pops: an element visible in a single analysed frame and gone
 *                 again. Always a defect or a mistake in a hand-written cue.
 *
 * A film whose subject is genuinely blue-purple passes its reason through
 * --allow-blue-purple and that gate drops to yellow; the reason belongs in REVIEW.md.
 *
 * Exit: 0 green or yellow, 2 red, 1 unreadable.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const FPS = 12; // analysis rate
const WIDTH = 320; // analysis width, also for vertical films
const SAMPLE_FPS = 2; // area-style metrics
const SUB_BAND_H = 0.15; // bottom band masked out: burned-in captions are not picture
const SUB_BAND_V = 0.18;

const STILL = 0.3; // frame-pair mean abs difference below this is a still pair
const FAST = 9.0; // at or above this, the pair moved inside the shot

const STATIC_RED = 0.98;
const BLANK_GRAD = 24.0; // gradient magnitude an edge pixel must exceed
const BLANK_FRAC = 0.002; // fewer edge pixels than this share of the frame = blank
const BLANK_EDGE_S = 0.5; // ignore this much at each end
const BLANK_MIN_S = 0.3;

const BP_HUE = [225, 300];
const BP_SAT = 0.3;
const BP_VAL = [0.06, 0.9];
const BP_FRAME = 0.3; // share of a frame's pixels that must be blue-purple
const BP_RED = 0.3;
const BP_YELLOW = 0.12;

const POP_MIN_DIFF = 3.0; // both sides of the pop must clear this
const POP_RETURN = 0.4; // the frame after must be this close to the frame before

const DEAD_CELL = 32; // cell side in analysis px
const DEAD_RANGE = 12; // a cell whose range over a shot stays under this never changed

// ---------------------------------------------------------------- decode
function ffprobe(file) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration",
    "-of", "json", "--", file,
  ]).toString();
  const j = JSON.parse(out);
  const s = j.streams[0];
  return { width: Number(s.width), height: Number(s.height), duration: Number(j.format.duration || 0) };
}

function decodeGray(file) {
  const { width, height, duration } = ffprobe(file);
  const h = Math.max(2, Math.round((height * WIDTH) / width / 2) * 2);
  const buf = execFileSync(
    "ffmpeg",
    ["-v", "error", "-i", file, "-vf", `fps=${FPS},scale=${WIDTH}:${h}:flags=area`, "-pix_fmt", "gray", "-f", "rawvideo", "-"],
    { maxBuffer: 1 << 30 },
  );
  const size = WIDTH * h;
  const n = Math.floor(buf.length / size);
  const frames = [];
  for (let i = 0; i < n; i++) frames.push(buf.subarray(i * size, (i + 1) * size));
  return { frames, width: WIDTH, height: h, srcW: width, srcH: height, duration };
}

function decodeRgb(file, fps = SAMPLE_FPS, width = 160) {
  const { width: w0, height: h0 } = ffprobe(file);
  const h = Math.max(2, Math.round((h0 * width) / w0 / 2) * 2);
  const buf = execFileSync(
    "ffmpeg",
    ["-v", "error", "-i", file, "-vf", `fps=${fps},scale=${width}:${h}`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
    { maxBuffer: 1 << 30 },
  );
  const size = width * h * 3;
  const n = Math.floor(buf.length / size);
  const frames = [];
  for (let i = 0; i < n; i++) frames.push(buf.subarray(i * size, (i + 1) * size));
  return { frames, width, height: h, fps };
}

// ---------------------------------------------------------------- pair metrics
function pairDiff(a, b) {
  let s = 0;
  for (let p = 0; p < a.length; p++) s += Math.abs(a[p] - b[p]);
  return s / a.length;
}

const median = (xs) => {
  if (!xs.length) return 0;
  const v = Float64Array.from(xs).sort();
  const m = v.length >> 1;
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};

/* A cut is a single-frame spike: the pair jumps far above its neighbours and the frames on
 * either side are unrelated. A fast pan keeps every neighbouring pair high, so it is not a
 * cut and its motion still counts — the distinction the motion number depends on. */
function findCuts(d) {
  const n = d.length;
  const cut = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const nb = [];
    for (let k = Math.max(0, i - 6); k < Math.min(n, i + 7); k++) if (k !== i) nb.push(d[k]);
    if (d[i] < Math.max(8.0, 3 * median(nb) + 2)) continue;
    const sides = [i > 0 ? d[i - 1] : 0, i + 1 < n ? d[i + 1] : 0];
    if (d[i] < 2.0 * Math.max(...sides)) continue;
    cut[i] = 1;
  }
  return cut;
}

/* A crossfade is not a cut and not motion: each pair changes a little, the frames between
 * lie on the straight line between the two ends, and the alphas advance monotonically.
 * Testing that blend fit is what keeps a 0.5 s crossfade from counting as fast motion.
 *
 * The candidate is a RUN of consecutive non-cut pairs that all change somewhat, not a local
 * peak: a linear crossfade has a flat difference profile (measured on a real xfade: 2.3 2.2
 * 6.8 4.7 4.6 4.6 4.6 4.6), so looking for a peak inside it either misses the fade or
 * centres the window on noise. The blend-fit test then rejects a pan, whose frames are not
 * on the line between its endpoints. */
function findDissolves(frames, d, cut) {
  const n = frames.length;
  const m = frames[0].length;
  const inDiss = new Uint8Array(Math.max(0, n - 1));
  const spans = [];
  const SOFT = 1.2; // a pair below this did not change
  const runs = [];
  let start = null;
  for (let i = 0; i <= d.length; i++) {
    const live = i < d.length && d[i] >= SOFT && !cut[i];
    if (live && start === null) start = i;
    else if (!live && start !== null) {
      runs.push([start, i]); // pairs [start, i)
      start = null;
    }
  }
  for (const [rs, re] of runs) {
    if (re - rs < 2) continue; // a single pair is not a fade
    if (re - rs > 30) continue; // longer than 2.5 s at 12 fps is a move, not a fade
    const a = rs; // frame before the fade
    const b = re; // frame after it
    if (b >= n) continue;
    let blocked = false;
    for (let i = a; i < re; i++) if (inDiss[i] || cut[i]) { blocked = true; break; }
    if (blocked) continue;
    const A = frames[a];
    const B = frames[b];
    let D = 0;
    let den = 0;
    for (let p = 0; p < m; p++) {
      D += Math.abs(A[p] - B[p]);
      den += (A[p] - B[p]) ** 2;
    }
    D /= m;
    if (D < 8) continue; // the two ends are nearly the same picture: not a scene change
    let resSum = 0;
    // alpha measures how close the frame is to A, so a fade can walk it down or up
    // depending on how the two ends happen to be ordered. Accept either direction.
    let inc = true;
    let dec = true;
    let prev = null;
    let sawMid = 0;
    for (let k = a + 1; k < b; k++) {
      const X = frames[k];
      let num = 0;
      for (let p = 0; p < m; p++) num += (X[p] - B[p]) * (A[p] - B[p]);
      const al = num / (den + 1e-6);
      let r = 0;
      for (let p = 0; p < m; p++) r += Math.abs(X[p] - B[p] - al * (A[p] - B[p]));
      resSum += r / m / (D + 1e-6);
      if (prev !== null) {
        if (al > prev + 0.08) dec = false;
        if (al < prev - 0.08) inc = false;
      }
      if (al > 0.15 && al < 0.85) sawMid++;
      prev = al;
    }
    // A real fade has frames that are genuinely half-blended and sits on the line.
    if ((inc || dec) && sawMid >= 2 && resSum / Math.max(1, b - a - 1) < 0.25) {
      for (let i = a; i < re; i++) inDiss[i] = 1;
      spans.push([a, b, Math.round((a + b) / 2)]);
    }
  }
  return { inDiss, spans };
}

function sobelEdgeShare(f, w, h) {
  let edges = 0;
  for (let y = 1; y < h - 1; y++) {
    const r0 = (y - 1) * w;
    const r1 = y * w;
    const r2 = (y + 1) * w;
    for (let x = 1; x < w - 1; x++) {
      const gx = f[r0 + x + 1] + 2 * f[r1 + x + 1] + f[r2 + x + 1] - f[r0 + x - 1] - 2 * f[r1 + x - 1] - f[r2 + x - 1];
      const gy = f[r2 + x - 1] + 2 * f[r2 + x] + f[r2 + x + 1] - f[r0 + x - 1] - 2 * f[r0 + x] - f[r0 + x + 1];
      if (Math.sqrt(gx * gx + gy * gy) > BLANK_GRAD) edges++;
    }
  }
  return edges / ((w - 2) * (h - 2));
}

function blankRuns(frames, w, h, cut, inDiss) {
  const n = frames.length;
  const blank = new Uint8Array(n);
  for (let i = 0; i < n; i++) blank[i] = sobelEdgeShare(frames[i], w, h) < BLANK_FRAC ? 1 : 0;
  const ok = new Uint8Array(n).fill(1);
  const edge = Math.round(BLANK_EDGE_S * FPS);
  for (let i = 0; i < Math.min(edge, n); i++) ok[i] = 0;
  for (let i = Math.max(0, n - edge); i < n; i++) ok[i] = 0;
  for (let i = 0; i < n - 1; i++) {
    if (cut[i] || inDiss[i]) {
      ok[i] = 0;
      ok[i + 1] = 0;
    }
  }
  const runs = [];
  let start = null;
  for (let i = 0; i <= n; i++) {
    const v = i < n && blank[i] && ok[i];
    if (v && start === null) start = i;
    else if (!v && start !== null) {
      if ((i - start) / FPS >= BLANK_MIN_S - 1e-9) runs.push([start / FPS, i / FPS]);
      start = null;
    }
  }
  return runs;
}

/* One-frame pops: an element visible in a single analysed frame. The tell is that frames
 * i-1 and i+1 agree while both differ from i. A cut fails that test because the two sides
 * are different scenes, which is why cuts never show up here. */
function findPops(frames, d) {
  const pops = [];
  for (let i = 1; i < frames.length - 1; i++) {
    if (d[i - 1] < POP_MIN_DIFF || d[i] < POP_MIN_DIFF) continue;
    const back = pairDiff(frames[i - 1], frames[i + 1]);
    if (back < POP_RETURN * Math.min(d[i - 1], d[i])) pops.push(i / FPS);
  }
  return pops;
}

/* dead_area / static_share. Both ask the same question at two scales: which cells of the
 * picture ever change? Per shot for dead_area (a cut is not change, so the accumulator
 * resets at every seam); across the whole film for static_share, which needs no calibration
 * because a film whose every cell is frozen is a still whatever it is about. */
function cellStats(frames, w, h, cut, inDiss) {
  const n = frames.length;
  const cols = Math.max(1, Math.floor(w / DEAD_CELL));
  const rows = Math.max(1, Math.floor(h / DEAD_CELL));
  const cells = cols * rows;
  if (n < 3) return { dead: 0, staticShare: 0 };

  const cellMeans = (f) => {
    const out = new Float32Array(cells);
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        let sum = 0;
        let cnt = 0;
        const y0 = cy * DEAD_CELL;
        const x0 = cx * DEAD_CELL;
        for (let y = y0; y < y0 + DEAD_CELL; y++) {
          const row = y * w;
          for (let x = x0; x < x0 + DEAD_CELL; x++) {
            sum += f[row + x];
            cnt++;
          }
        }
        out[cy * cols + cx] = sum / cnt;
      }
    }
    return out;
  };

  // Whole film: a cell that never leaves its initial range never changed, cuts included.
  const gLo = new Float32Array(cells).fill(255);
  const gHi = new Float32Array(cells).fill(0);
  // Per shot: reset so a cut cannot be mistaken for the shot changing.
  const sLo = new Float32Array(cells).fill(255);
  const sHi = new Float32Array(cells).fill(0);
  let deadCells = 0;
  let liveCells = 0;

  const flush = () => {
    for (let c = 0; c < cells; c++) {
      if (sHi[c] - sLo[c] < DEAD_RANGE) deadCells++;
      sLo[c] = 255;
      sHi[c] = 0;
    }
    liveCells += cells;
  };

  for (let i = 0; i < n; i++) {
    const m = cellMeans(frames[i]);
    for (let c = 0; c < cells; c++) {
      const v = m[c];
      if (v < gLo[c]) gLo[c] = v;
      if (v > gHi[c]) gHi[c] = v;
      if (v < sLo[c]) sLo[c] = v;
      if (v > sHi[c]) sHi[c] = v;
    }
    const seam = i < n - 1 && (cut[i] || inDiss[i]);
    if (seam) flush();
  }
  flush();

  let frozen = 0;
  for (let c = 0; c < cells; c++) if (gHi[c] - gLo[c] < DEAD_RANGE) frozen++;
  return { dead: liveCells ? deadCells / liveCells : 0, staticShare: frozen / cells };
}

// ---------------------------------------------------------------- blue-purple
function bluePurple(file) {
  const { frames, width, height, fps } = decodeRgb(file);
  if (!frames.length) return { share: 0, spans: [] };
  const bad = new Uint8Array(frames.length);
  const px = width * height;
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    let hit = 0;
    for (let p = 0; p < px; p++) {
      const r = f[p * 3] / 255;
      const g = f[p * 3 + 1] / 255;
      const b = f[p * 3 + 2] / 255;
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      if (mx < BP_VAL[0] || mx > BP_VAL[1]) continue;
      const dl = mx - mn + 1e-6;
      if (dl / (mx + 1e-6) < BP_SAT) continue;
      let hue;
      if (mx === r) hue = (((g - b) / dl) % 6) * 60;
      else if (mx === g) hue = ((b - r) / dl + 2) * 60;
      else hue = ((r - g) / dl + 4) * 60;
      if (hue < 0) hue += 360;
      if (hue >= BP_HUE[0] && hue <= BP_HUE[1]) hit++;
    }
    if (hit / px >= BP_FRAME) bad[i] = 1;
  }
  let share = 0;
  for (let i = 0; i < bad.length; i++) share += bad[i];
  share /= bad.length;
  const spans = [];
  let start = null;
  for (let i = 0; i <= bad.length; i++) {
    const v = i < bad.length && bad[i];
    if (v && start === null) start = i;
    else if (!v && start !== null) {
      if (i - start >= 2) spans.push([start / fps, i / fps]);
      start = null;
    }
  }
  return { share, spans };
}

// ---------------------------------------------------------------- grading
function level(v, { red, yellow, highBad = true }) {
  const hit = (t) => (highBad ? v >= t : v <= t);
  if (red != null && hit(red)) return "red";
  if (yellow != null && hit(yellow)) return "yellow";
  return "green";
}

export function measure(file, opts = {}) {
  const { frames, width, height, srcW, srcH, duration } = decodeGray(file);
  const vertical = srcH > srcW;
  const subBand = opts.subBand ?? (vertical ? SUB_BAND_V : SUB_BAND_H);
  const keep = Math.max(1, Math.round(height * (1 - subBand)));
  const F = frames.map((f) => f.subarray(0, keep * width));
  const h = keep;
  const n = F.length;
  if (n < 4) throw new Error("too few frames to analyse");

  const d = new Float64Array(Math.max(0, n - 1));
  for (let i = 0; i < n - 1; i++) d[i] = pairDiff(F[i], F[i + 1]);

  const cut = findCuts(d);
  const { inDiss, spans: dissolveSpans } = findDissolves(F, d, cut);
  const trans = new Uint8Array(d.length);
  for (let i = 0; i < d.length; i++) trans[i] = cut[i] || inDiss[i] ? 1 : 0;

  let fast = 0;
  let still = 0;
  let counted = 0;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    if (trans[i]) continue;
    counted++;
    sum += d[i];
    if (d[i] >= FAST) fast++;
    if (d[i] < STILL) still++;
  }
  const fastRatio = counted ? fast / counted : 0;
  const stillRatio = counted ? still / counted : 0;

  const blankRunsS = blankRuns(F, width, h, cut, inDiss);
  const blankRunS = blankRunsS.reduce((a, [s, e]) => Math.max(a, e - s), 0);
  const pops = findPops(F, d);
  const { dead, staticShare } = cellStats(F, width, h, cut, inDiss);
  const bp = bluePurple(file);

  const cutIdx = [];
  for (let i = 0; i < cut.length; i++) if (cut[i]) cutIdx.push((i + 1) / FPS);
  const shots = Math.max(1, cutIdx.length + dissolveSpans.length);
  const secs = n / FPS;

  const lights = {
    blank_run_s: level(blankRunS, { red: BLANK_MIN_S }),
    blue_purple_share: level(bp.share, { red: BP_RED, yellow: BP_YELLOW }),
    static_share: level(staticShare, { red: STATIC_RED }),
  };
  if (lights.blue_purple_share === "red" && opts.allowBluePurple?.trim()) lights.blue_purple_share = "yellow";

  return {
    file,
    orientation: vertical ? "vertical" : "horizontal",
    duration_s: Number(secs.toFixed(2)),
    src: { width: srcW, height: srcH, duration_s: Number(duration.toFixed(2)) },
    sub_band: subBand,
    shots,
    hard_cuts: cutIdx.length,
    dissolves: dissolveSpans.length,
    asl_s: Number((secs / shots).toFixed(2)),
    mean_diff: Number((counted ? sum / counted : 0).toFixed(2)),
    still_ratio: Number(stillRatio.toFixed(3)),
    fast_ratio: Number(fastRatio.toFixed(4)),
    dead_area: Number(dead.toFixed(3)),
    static_share: Number(staticShare.toFixed(3)),
    blank_run_s: Number(blankRunS.toFixed(2)),
    blank_runs_s: blankRunsS.map(([s, e]) => [Number(s.toFixed(2)), Number(e.toFixed(2))]),
    blue_purple_share: Number(bp.share.toFixed(3)),
    blue_purple_spans_s: bp.spans.map(([s, e]) => [Number(s.toFixed(1)), Number(e.toFixed(1))]),
    pops_s: pops.map((t) => Number(t.toFixed(2))),
    cut_times_s: cutIdx.map((t) => Number(t.toFixed(2))),
    allow_blue_purple: opts.allowBluePurple?.trim() || null,
    lights,
    verdict: Object.values(lights).includes("red") ? "red" : Object.values(lights).includes("yellow") ? "yellow" : "green",
  };
}

// ---------------------------------------------------------------- report
const MARK = { red: "[RED]", yellow: "[YEL]", green: "[ ok]" };

function report(r) {
  const L = [
    `${r.file}  ${r.orientation}  ${r.duration_s}s  ` +
      `${r.shots} shots (${r.hard_cuts} cuts, ${r.dissolves} crossfades)  mean shot ${r.asl_s}s`,
    `  ${MARK[r.lights.static_share]} gate  frozen picture ${r.static_share}  (red >= ${STATIC_RED})`,
    `  ${MARK[r.lights.blank_run_s]} gate  longest blank run ${r.blank_run_s}s  (red >= ${BLANK_MIN_S}s)`,
    `  ${MARK[r.lights.blue_purple_share]} gate  blue_purple_share ${r.blue_purple_share}` +
      `  (red >= ${BP_RED}, yellow >= ${BP_YELLOW})` +
      (r.allow_blue_purple ? `  — declared: ${r.allow_blue_purple}` : ""),
    `  [   ] rpt   fast_ratio ${r.fast_ratio}   dead_area ${r.dead_area}   still_ratio ${r.still_ratio}   mean_diff ${r.mean_diff}`,
  ];
  if (r.blank_runs_s.length) L.push(`        blank at ` + r.blank_runs_s.map(([a, b]) => `${a}-${b}s`).join(", "));
  if (r.blue_purple_spans_s.length && r.lights.blue_purple_share !== "green") {
    L.push(`        blue-purple at ` + r.blue_purple_spans_s.slice(0, 8).map(([a, b]) => `${a}-${b}s`).join(", "));
  }
  if (r.pops_s.length) L.push(`        one-frame pops at ` + r.pops_s.slice(0, 12).join(", ") + "s");
  return L;
}

function explain(r) {
  const out = [];
  if (r.lights.blank_run_s === "red") {
    out.push(
      `Empty frame for ${r.blank_run_s}s at ` +
        r.blank_runs_s.map(([a, b]) => `${a}-${b}s`).join(", ") +
        `: almost no edge anywhere, so the subject is out of picture. Keep it in frame and let the shot breathe by ` +
        `holding or pulling back; never rest on a flat colour for 0.3 s. A black ground or a whiteboard is fine as ` +
        `long as strokes, lines or type are present.`,
    );
  }
  if (r.lights.blue_purple_share === "red") {
    out.push(
      `${(r.blue_purple_share * 100).toFixed(0)}% of the film is a blue-purple ground ` +
        `(${r.blue_purple_spans_s.slice(0, 6).map(([a, b]) => `${a}-${b}s`).join(", ")}), the palette generated ` +
        `design lands on by default. Move the ground to the subject's own medium (references/look.md) — a paper, a ` +
        `material, a brand colour. Only when the subject itself is blue-purple (a named cyberpunk look, a ` +
        `starry-night style) pass --allow-blue-purple "<reason>"; the reason belongs in REVIEW.md.`,
    );
  }
  if (r.lights.static_share === "red") {
    out.push(
      `${((r.static_share ?? 0) * 100).toFixed(0)}% of the picture never changes anywhere in the film — the file is ` +
        `a still or as good as one. Something must move: the subject acting, a camera move, a background that changes ` +
        `with the content.`,
    );
  }
  if (r.pops_s.length) {
    out.push(
      `${r.pops_s.length} one-frame pop${r.pops_s.length > 1 ? "s" : ""} (${r.pops_s.slice(0, 6).join(", ")}s): an ` +
        `element is visible for a single frame. Find the cue and give it a real duration or drop it.`,
    );
  }
  return out;
}

function main() {
  const argv = process.argv.slice(2);
  const pos = argv.filter((a) => !a.startsWith("--"));
  const opt = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) continue;
    const k = argv[i].slice(2);
    const v = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
    opt[k] = v;
  }
  const file = pos[0];
  if (!file) {
    console.error('usage: node gate.mjs <film.mp4> [--json] [--sub-band 0.15] [--allow-blue-purple "reason"]');
    process.exit(1);
  }
  if (!existsSync(file)) {
    console.error(`no such file: ${file}`);
    process.exit(1);
  }
  let r;
  try {
    r = measure(file, {
      subBand: opt["sub-band"] != null ? Number(opt["sub-band"]) : undefined,
      allowBluePurple: typeof opt["allow-blue-purple"] === "string" ? opt["allow-blue-purple"] : null,
    });
  } catch (e) {
    console.error(`cannot read ${file}: ${e.message}`);
    process.exit(1);
  }
  if (opt.json) {
    console.log(JSON.stringify(r, null, 1));
  } else {
    console.log(report(r).join("\n"));
    const ex = explain(r);
    const tag = { red: "RED — do not deliver", yellow: "YELLOW — deliverable, but look", green: "green" }[r.verdict];
    console.log(`\nverdict: ${tag}`);
    if (ex.length) console.log(ex.map((s) => "  - " + s).join("\n"));
    console.log(
      "\nThe gate blocks an empty stretch, a blue-purple ground and a frozen picture; motion, dead area and " +
        "one-frame pops are reported, not gated. It cannot see a weak shot, a wrong diagram, a seam that jumps, or " +
        "a fable whose motion is too quiet — references/review.md still runs.",
    );
  }
  process.exit(r.verdict === "red" ? 2 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
