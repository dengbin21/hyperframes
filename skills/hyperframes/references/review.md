# Review

You wrote the timeline, so you know what happens; the viewer sees it once, at full speed, often on a phone. Review is how you see the film as they will: as a harsh motion director, not a proud author. `check` catches what is broken; this pass catches what is weak. Run it after `check` passes, on every new film and on any edit that changes timing or layout, before you reply or render.

## 1. Measure, then look

1. `npx hyperframes check --json`. Besides errors it warns on craft it can measure: a line on screen too briefly to read (`line_unread`), more than 3 s with nothing changing (`dead_stretch`), text under 2.6% of the frame's short side (`text_below_floor`), an empty first frame (`first_frame_empty`, the thumbnail on social players), a film over 15 s with no sound (`film_silent`). A warning is a question, not a rule: fix it, or keep it on purpose and say why in the note (a deliberate hold carries `data-hold`).
   - Read `sourceFile` and `selector` off the finding before touching anything: ids repeat across scenes (`#nCanal` in s3 and in s4 are different lines with different windows), and a `container_overflow` names the clipping ancestor, not the element that should move.
   - A fixed finding is not verified until the same check is re-run over the same window. `--range start,end` (and `--at`, `--components`) re-measures that stretch in one browser session without re-checking the film.
2. `npx hyperframes snapshot --review` writes three sheets: each scene just after it starts and at its middle, plus each `data-beat`, a strip across every cut (−0.2 s to +0.2 s), and the beat frames at phone width (360 px). Open all three.
3. Motion between the beats: `snapshot --range START,END --frames 8` around the hero move and the payoff; `keyframes --shot` for a path that must arc or land.
4. The rendered file: `npx hyperframes audio <video> --json` shows whether sound is there, where it hits and how loud it is. You cannot hear it; say so.

Trust the numbers over your eye where they disagree: a clipped label or a 0.6 s line looks fine on a contact sheet.

## The gate

`node scripts/gate.mjs <file.mp4>` reads the rendered file, not the source, and blocks three
failures no contact sheet can show. Red exits 2: do not deliver.

It gates only what is true of any film whatever its genre, so no threshold has to be tuned per
film:

| Gate | Red | Yellow | What it catches |
| --- | --- | --- | --- |
| `blank_run_s` | ≥ 0.3 s | — | a stretch with almost no edge anywhere: the subject left the picture, or a transition rests on a flat colour. Measured as the longest mid-film run |
| `blue_purple_share` | ≥ 0.30 | ≥ 0.12 | the blue-purple ground generated design lands on by default (hue 225–300°, saturated, mid-lightness) |
| `static_share` | ≥ 0.98 | — | cells of the picture that never change across the whole film: the file is a still |

`blue_purple_share` drops to yellow only when the subject itself is that colour, passed through
`--allow-blue-purple "<reason>"`; the reason belongs in `REVIEW.md`.

**What is measured and not gated, and why.** `fast_ratio` (frame pairs that move inside a
shot), `dead_area` (share of the picture that never changes within its shots), `still_ratio` and
`pops_s` (an element visible in exactly one analysed frame and gone again) are reported because
their right value depends on the kind of film. `fast_ratio`
was calibrated at < 0.035 red on a set of narrated explainers; measured against four delivered
illustrated story films it read 0.009, 0.000, 0.000 and 0.000 — every one red, every one
finishing well. A painted shot that holds while the art moves is not a slideshow, so that line
does not describe the genre and the gate does not pretend it does. Read those four as a trend
across your own films: falling `fast_ratio` with rising `dead_area` means the shots are turning
into wallpaper, whatever the absolute number.

The detections are proven on synthetic films in `scripts/gate.test.mjs`
(`node --test scripts/gate.test.mjs`): a flat ground versus one with a stroke, a still file
versus a sweeping one, purple versus navy, a hard cut and a 0.5 s crossfade versus an in-shot
move, a single-frame pop versus a held element, dead cells under a small mover versus a
sweeping frame, a pan that is never a cut, and the exit codes (red 2, green 0, unreadable 1).

**Kinematics, which the gate cannot read.** The gate counts pixels; `npx hyperframes measure`
follows them. Run it on the render when a review question is *how* something moves rather than
whether it moved:

- `measure events <mp4> --json` — `flash` (a one-frame appearance), `appear` / `disappear` (an
  element that shows up or dies), `cut`, `hold`. This is the pass that catches a popped title and
  a two-frame seam; `pops_s` in the gate only counts single-frame pops over the whole file.
- `measure curve <mp4> --start S --end S --roi x,y,w,h --json` — one element, frame by frame:
  `from`, `to`, `start_s`, `duration_s`, `frames`, then the closest GSAP `ease` with `rmse`,
  `overshoot_pct` and `anticipation_pct`. It answers the three questions source code cannot:
  did the entrance actually ease, how far does it travel in one frame (a move over ~6% of the
  short side per frame smears however well it is written — that is what `data-motion-blur` is
  for), and did the camera stop abruptly. Calibrate the ROI by eye first: give the region holding
  the whole move and nothing else that moves, or the fit reports the wrong element's curve.
- `measure energy <reference> <yours> --json` — whether two clips move at the same moments; use
  it to hold rhythm still while you change something else, or to compare a rebuild with the film
  it replaces.

Why this is not a source reading: only a `fromTo` with numbers at both ends has a knowable
per-frame speed. In one audit of ten films that was 41 tweens out of more than 400, and a
container-name heuristic for camera moves false-flagged six of the ten projects. The measurement
of the delivered file has neither limitation.

The gate cannot see a weak shot, a wrong diagram, a seam that jumps, a face that reads wrong,
or a fable whose motion is too quiet. Everything below still runs.

## 2. What to look for

First, describe each beat frame in one sentence as a stranger would, naming every object; an object you would have to explain ("those bars are mirrors") is a P0. Then read the beat frames in order: do they tell a story a stranger follows, each one causing the next? Compare each with its shot in `SPEC.md`; what does not match is a note. Then name every default the frames show (`spec.md` "BANNED by default", or one not on the list yet), add each to the BANNED line, and fix them before anything else.

### The information test

`check` cannot tell a frame that *shows* something from a frame that only *says* something, and that is the difference between a film and a slide deck. Ask it of every shot, and of every narration line when there is a voice: does the picture carry information the words alone do not?

- **Words only**: big type, one sentence, one number, a list, a label. The frame reads the same with the words spoken instead of shown.
- **An information visual**: a flow, a comparison, a chart, a diagram, boxes / arrows / circles, an annotated real screen, a drawing of the mechanism, a cutaway, a before-and-after, a labelled object. **Four or more separately placed text blocks visible at once** (a hand-built UI, a table, labels on a figure) count as an information layout — the arrangement itself carries the meaning.
- **Exempt**: the opening hook, the title drop, the end card. They are allowed to be words only.

Count them. An occasional words-only shot is only named in the summary line (`Information: 5 of 6 shots carry an information visual (words only: s4)`). **From 30% of the shots each one is a P1; from 60% the film as a whole is a P1** — whatever else is good, it will be read as a slideshow. A promo that makes a claim also needs **concrete points: at least 4 in 30 s**, where a point is an information visual, a number, or a demonstrated action — not a slogan.

Two follow-ups this catches, and they are worth more than the count:

- **A shot that only repeats a keyword of the narration** gets rewritten as a diagram, a flow, a comparison or an annotation — the picture must add, not echo.
- **An action the words mention must be acted out on screen.** "Drag to reorder" → really drag once. "One click" → click and switch. "Filled in automatically" → watch it fill. A sentence over a still picture convinces nobody, and no metric sees it.

### Where the words came from

Every line on screen has a source, and the source is not your memory. Before review, open `SPEC.md` (or the brief the person gave) and check each on-screen line against it: a fact, a number, a name, a quote, a claim.

- A line that is **not** in the source is either removed or marked decorative on purpose (`data-hold`-style intent goes in `REVIEW.md`); the default assumption is that you invented it.
- **A number with no date is not a fact**, it is a measurement of unknown age. Live data, prices, counts and rankings carry the date they were true.
- A demonstrated result **really matches**: the same prompt, the same options, the same price, the same output in the frame that the copy claims.

A film can pass every measurement and still be wrong because one line was invented. This check is cheap and it is the one people sue over.

Then go through the sheets once per question:

| Question                      | What it catches                                                                                                                                    |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Does it read as what it is?   | A shape that reads as another object, a material that reads as plastic, a product screen that reads as a mockup, a face or mascot that reads wrong |
| Does the subject separate?    | Subject and ground too close in value, two focal points in one frame, the eye with nowhere to go                                                   |
| Framing and contact           | Crops, text at the edge or under platform UI, collisions at a seam, things floating that should touch                                              |
| Timing as a first-time viewer | A read shorter than its words (`story.md` §8), something that pops on with no move, a jump at a cut, everything moving at once on one curve        |
| Tells                         | Which items of `story.md` §10 and `motion.md` "Defaults that look generated" are on screen                                                          |
| The pictures alone            | With the words covered, do the beat frames still tell the storyline?                                                                               |
| The phone sheet               | Can every line meant to be read be read at 360 px?                                                                                                 |

## 3. Notes and fixes

Write each problem as one line: `t=4.2s · where · problem → exact change · what stays`. Rank them:

- **P0** breaks the read or the contract: unreadable, wrong, broken, a tell in the hero shot.
- **P1** weakens the film: a dead stretch, a soft payoff, a seam that jumps.
- **P2** polish.

**A P0 is one of eight objective problems.** Taste varies and a second reviewer will always find a new batch of "problems", so only what can be verified blocks delivery. Everything else — whether the opening grabs, preferred pace, composition, colour, this font over that one — is optional, and a note about it must not hold the film hostage:

| # | P0 | The test |
| --- | --- | --- |
| 1 | **No source** | on-screen text is absent from `SPEC.md` / the brief, or breaks a "must not say" |
| 2 | **Cut off** | text or the subject clipped by the frame edge, under platform UI (top 8%), or in the caption band (bottom 20% in portrait) |
| 3 | **Unreadable** | 2 s or more with no line readable at 360 px, or key information (name, URL, the result) under ~10 px on a phone |
| 4 | **Inaudible** | over 0.5 s with nothing audible in the phone band (above 150 Hz), 0.3 s at the start |
| 5 | **Off the beat** | a section impact, a hard cut or the landing of the core picture is 2 frames or more off its accent |
| 6 | **Continuity** | ghosting, a one-frame flash, a one-frame jump, a loading state or blank showing, two layers misaligned, an element early or lingering |
| 7 | **The result is not delivered** | the thing the film is about is not full-screen or nearly so, or not held for 1 s |
| 8 | **Dead air** | 1.2 s or more of only slow motion with no new text, no sound effect and no cut; or 1.5 s with no *new action* at all. For a narrated film, the same test applies only where the voice pauses (a long silence between lines, or after the last one) |

Everything below is optional by definition. When you report a must-fix, give its timecode, which of the eight it is, and what changes; when you accept an optional note for now, say so instead of fixing it silently.

Fix every P0 and the P1s worth their time: text first, then timing, then detail. Then snapshot only what you changed, once. A second pass only when a P0 is still open. Never score the film out of 10: a score finds nothing to fix. When a fix does not hold, snapshot the frames on either side of the problem, list every difference, and change only the line that causes it. A film that feels busy: remove a third of the motion and keep the moves that lead the eye.

### Batch the loop

A snapshot of the whole film plus its contact sheet costs minutes; reads are cheap. Spending one full rebuild on each one-line edit is how a two-hour film takes eight, and it also hides the cause: an edit that failed for two reasons looks the same as one that failed for one.

- **Collect 3–5 findings of the same kind, fix them in one edit, then look once.** Group by cause, not by timecode: five labels at the wrong `top` is one geometry decision, not five fixes.
- **Do the arithmetic before the render.** Whether a label clears the frame, whether two blocks cross, which of two opaque layers wins — each is a sum over numbers you already wrote. `top + font-size × 1.2 ≤ 1080` and `next.top − this.top ≥ this.font-size × 1.25` catch most of it; paint order is `z-index`, which no tween changes. A render is the proof of a computation, never the way to find out.
- **Look at the width the person will watch.** A 1440-wide frame hides a hairline that a 720 preview drops; check the phone sheet in §2 before you decide a detail is visible.
- **Keep the interesting frame, then change one variable.** `--at` on the same instant across two versions is the only clean A/B; a fresh set of timestamps answers a different question.
- **Roll back, do not rewrite.** A change that made things worse is reverted in seconds from version control and half a day when the file was overwritten. Commit before a batch, so the next batch starts from something that worked.

A fresh pair of eyes, when your host can start a sub-agent: give it only `STORYBOARD.md` and the three sheets, ask for P0 and P1 lines in the format above, and keep editing to yourself. Commit or copy the project before you fix, so a fix that makes things worse can be rolled back.

## 4. The delivery note

Write `REVIEW.md` at the project root and put its short form in your reply:

- the creative calls you made, and the storylines you did not build;
- the information count (`Information: N of M shots carry an information visual`), and any shot you let stay words-only on purpose;
- what you measured and what you only looked at; what nobody checked (the sound was measured, not heard);
- the weakest shot, and what you would change with more time;
- warnings you kept on purpose, and why.

The next turn reads it before changing anything.

## 5. Claims you may not make

The review is worth what its coverage is worth. Each of these has cost a film its delivery.

- **A frame is not the motion.** Having looked at the sheets does not mean the motion was reviewed;
  a still cannot show whether a move flows. Say which stretches you watched at 1× and which you only
  saw as frames.
- **A metric is not an ear.** `audio --json` proves sound is present, on time and under the ceiling.
  It does not prove it sounds good. Say the sound was measured, not heard.
- **A passing check is not a delivered film.** Confirm the check can fail: break something on purpose
  (`gate.mjs` on a file with 0.5 s of black) and watch it go red once. A green run from a check that
  never executed is worse than no check.
- **The last sample is not the skill.** Frame-for-frame determinism proves only that a change was
  bounded; a test count proves only that those counterexamples pass. A film the person rejected is a
  technical regression case from then on, not evidence the approach works.
- **No score.** Counting points finds nothing to fix and invites arguing with the number.

When a sub-agent reviews, give it the request, the rendered file, the three sheets and the sources
for every line on screen — not your reasoning. Without the provenance table it will read the brand's
own sentence as invented copy. Ask it, in these words: which stretch made you drift off, and where was
it flat? A review that only asks "is anything wrong" cannot find boring, which is what people reject
most.

Report each defect with its timecode, what kind it is, and how bad — unreadable, wrong, unclear,
rough craft, flat or runaway rhythm, an unmotivated camera move, a technical fault. Fix what blocks
understanding and use; verify the original defect and the seams either side of it. Do not reopen a
trade-off the person already accepted unless there is new evidence, and when they say stop, stop and
state what remains unverified.
