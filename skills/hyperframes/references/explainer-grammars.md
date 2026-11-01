# Explainer grammars

Eight ways an explainer carries one idea across a narration, distilled from the explainer
grammars in `huashu-art-motion` and its sibling `huashu-motion` (both MIT, Alchain). Those
cards were written for a Canvas 2D engine whose demos hold one 1-3 s thought at a time; this
file is the same eight grammars said in HyperFrames terms — a paused GSAP timeline over a DOM
tree — with the HyperFrames numbers where the originals differ.

Read `types/explainer.md` first: that file owns what an explainer is and where it starts. This
file owns how each shot carries its idea, once you know what the film has to say.

## Picking one

Pick by what the narration is doing, not by what looks good. A film may change grammar at a
seam; one segment keeps one grammar, and the palette and type stay the same across the change.

| The narration is… | Grammar | Not this, because |
| --- | --- | --- |
| Explaining a mechanism, a formula, an algorithm: this becomes that | `transform` | `scene-object` (a beautiful picture of a mechanism explains nothing) |
| Answering "what is inside X", scale, parts, systems, calm science | `scale-world` | `collage` (no real documents to show, so it becomes fake evidence) |
| Arguing from a document, a screenshot, a quote, "look at this line" | `collage` | `scale-world` (flat shapes blunt the credibility) |
| A person's experience, a failure, a joke; the person is the subject | `character-read` | `keynote-ui` (its emotional register is good news) |
| A list, N stages, a line worth quoting, one number as a hero | `kinetic-line` | `transform` (nothing to morph) |
| A product, a feature, a spec, a tutorial step | `keynote-ui` | `transform` (glass and glow carry no logic) |
| A number, a trend, a share, a turning point | `chart-truth` | `keynote-ui` big digits (only for a single lone number) |
| Reasoning step by step, "why", worked out live | `whiteboard-build` | a whole-diagram drop (the build IS the explanation) |

Two fallbacks: real screenshots exist → `keynote-ui` (tutorial, clean) or `collage`
(argument, evidence). One lone number → no chart, a big digit in `keynote-ui` or
`kinetic-line`, landing on the word that says it.

## Shared rules

These hold across all eight, and each one is a rule the originals arrived at by measuring.

1. **The camera is a function of time; the scene is redrawn from it.** One move, one tween on
   a wrapper inside the clip — `scale` and `x`/`y`, never on the timed media element
   (`motion.md` "The right mechanism"). Log-interpolate zoom: a linear scale ramp starts slow
   and ends violent.
2. **Reveal on the word, not before it.** With TTS this is `npx hyperframes transcribe` word
   times; without it, put each reveal at the moment the narration names the thing, across the
   back half of the scene. `references/sound.md` has the voice-as-clock rules.
3. **Structure first, data second, annotation last.** Axes before marks, marks before the
   callout, one callout per shot.
4. **One focal point at a time.** Everything else holds still. The background sits a step
   lower in saturation, contrast and line weight than the hero.
5. **Arrive slow, leave fast, then hold.** Entrances 0.3-0.4 s on a long tail; exits ~0.18 s;
   a landed number holds at least 0.5 s, a punchline at least 0.9 s. This is `motion.md`
   already; the originals measured it independently and agree.
6. **Motion on the event.** The camera moves only when the eye must go somewhere new. A push
   in means a pull back, a pan, or a cut out — never three pushes in a row, and never a
   constant 2% drift as a substitute for a move.
7. **Two frame rates.** Camera and gradients are smooth; hand-drawn elements step (12 fps for
   paper and marker, 24 fps for a character). All-smooth reads as corporate; all-stepped
   reads as a flipbook.
8. **Colour is a concept.** One colour means one thing across the film. Past three or four
   semantic colours the viewer stops tracking them.
9. **Transitions at the breath, not mid-sentence.** A narratable cut lands between two
   phrases.
10. **Real material stays whole.** A screenshot or photo at full width, pushed to the part
    being discussed; code annotates and moves, it does not redraw. Never crop a key UI.
11. **Zoom through an opening needs enough magnification.** Pushing into a circular aperture
    only reads if the frame is covered by the time the camera reaches it: the scale must be at
    least the distance from the opening's centre to the farthest screen corner divided by the
    opening's radius — about `1100 / r` for a centred aperture on a 1920-wide frame. Anything
    less and the edges of the old world slide in around it.
12. **The reveal frame is what lands on the beat.** A transition starts before the bar line, not
    at it: scene start = bar line − (reveal point × transition duration). A count-up starts
    (word time − count duration) so its final value lands on the word that says it. A whiteboard
    stroke begins about 0.5 s after its phrase, which is the delay a hand actually has.

### Numbers that have to survive the frame

An explainer is judged on whether its numbers are honest, and the failures are specific:

- **The wording sets the arithmetic.** "It rose 8.7×" and "it rose to 8.7× its old value" are
  different claims; so are "40 min to 2 min" and "20× faster". Write the claim from the data,
  then check the picture matches the sentence.
- **A multiple has to be computable from what is on screen.** If the label says 4.3×, both
  numbers it came from are visible, or the source line says where they are.
- **Bars start at zero; an axis that does not start at zero says so**, on screen, in the
  chart's own words.
- **A count-up that has finished stays finished.** Re-entering the same chart at full screen
  must not restart from 0 — the value is state, not an entrance.
- **Tick labels never lie.** A step of 2.5 printed through a formatter that rounds to integers
  shows −3/3/8 on a grid drawn at −2.5/2.5/7.5; the label and the gridline have to come from
  the same number.
- **Every bar that is annotated has a name.** Label thinning on a crowded portrait chart is
  how "the first one" ends up as the one unlabelled bar.
- **A big number placed in a corner collides with a rising line.** Place it against the
  direction the data moves, or reserve the corner.
- **Invented data is marked as illustrative in every frame it appears in**; real data never
  carries that mark.

### Fit, then fall back

Everything that has to fit will be tested at a length nobody wrote the sample for. The order is
fixed: shrink the type, then wrap the line, then move the element, and only then warn. A layout
tuned on the sample's word count breaks on the first real narration — the caption band, the
portrait crop and the dense chart are where it breaks.

## The eight

Each entry gives the grammar's core move, its numbers, the HyperFrames mechanism, and the
tell that says you built the wrong one.

### `transform` — the thing becomes the next thing

One idea per frame, and the next frame is the previous one transformed: a matrix becomes a
grid becomes a vector. Colour names the concept and moves with it. Almost no cuts.

- **Beat**: 1-3 s of transform, then ~1 s of hold. One concept runs 8-20 s.
- **Ease**: a smooth ease for nearly everything — `power3.inOut` is the nearest built-in to
  the originals' `6t⁵−15t⁴+10t³`. Linear only for a rotation that must not ease.
- **Mechanism**: two absolutely-positioned SVGs (or two `<path>` d attributes) sharing a
  viewBox; tween the `d` via a shape morph, or cross-fade at the moment of maximum overlap
  with `filter: blur(4px)` peaking mid-move. Colour via a CSS variable animated with
  `@property` so it interpolates.
- **Wrong if**: you cut between two finished pictures. If the viewer needs the cut, it is
  `scene-object` or `whiteboard-build`, not `transform`.

### `scale-world` — the world zooms through its own scales

An abstract idea drawn as one concrete object inside a world that can scale without limit;
the camera travels between scales (a drop of water into a diatom). The environment moves
gently the whole time; the subject changes on the narration's beats.

- **Beat**: hard-cut shots 7-9 s; the visual unit changes every 4.6-6.7 s in the originals'
  demo density, roughly 2.5-3× slower in a real film.
- **Ease**: `power2.inOut` for camera moves (`bezier(.75,0,.25,1)` upstream).
- **Mechanism**: one full-frame wrapper with `transform: scale()` and `transform-origin` set
  to the point being entered; children carry `will-change: transform`. Cross the scale range
  by nesting: an inner world at 1×, the next at 40×, each fading in as the camera passes its
  threshold — no single element is ever scaled 60×, which is what keeps it sharp.
- **Wrong if**: the background is a flat colour for the whole shot. The world must read as a
  world.

### `collage` — the argument printed on a table

The evidence sits on a surface with real material (clippings, screenshots, a photograph with
a white border), and the camera moves across the table like an investigator's eye. Lines and
highlighter go on in steps.

- **Beat**: slow band 3-7 s per card; fast band 1.4-1.8 s.
- **Ease**: camera `sine.inOut`; elements step at 12 fps (`steps(1)` timing or a quantised
  `onUpdate`) so they land like a hand, not a tween.
- **Mechanism**: `rotation` ±1.5-3° per card, `box-shadow` for lift, torn edges as an SVG
  mask or a `clip-path` polygon; a red annotation line drawn with `stroke-dasharray` +
  `stroke-dashoffset`. Images at full width, never redrawn.
- **Wrong if**: you have no real material and invent "documents". Fake evidence is worse than
  no evidence — use `scale-world` instead.

### `character-read` — the narrator's face carries the joke

The voice is the subject; the picture is the expression it needs. Poses snap in and hold; the
laugh lands in a cut to a reaction close-up held in silence.

- **Beat**: the originals' demo averages 1.87 s per pose, 2.43 s per read.
- **Ease**: a 0.1 s `expo.out` into the new pose plus a squash-settle; the character animates
  at 24 fps against a 30 fps timeline.
- **Mechanism**: a rig as keyed states eased between (`types/character.md`); one wrapper per
  pose that swaps at the beat, so no part drifts. Hold the reaction — the silence is the
  punchline.
- **Wrong if**: every pose is a smooth tween. Snapping to a pose and holding is the acting.

### `kinetic-line` — words are the cast

A keyword slams in on the accent, the hero word fills the width, one focal point per frame.

- **Beat**: one shot per bar (about 2 s at 120 BPM).
- **Ease**: `expo.out` in, `expo.in` out faster; a slam is `1.55 → 0.94 → 1.0` in 0.17 s.
- **Mechanism**: `motion.md` "Titles" already owns the entrance vocabulary — per word, per
  letter, blur-in. One highlighted word in the accent colour, and it carries meaning.
- **Wrong if**: the type keeps drifting after it lands, or every line enters the same way.

### `keynote-ui` — one screen, one thing

A product screen or a real object is the hero, pushed close; nouns and numbers land when the
narration says them. Glass cards and glow are optional dressing, and usually wrong.

- **Beat**: one screen 5-8 s; product montage 1.5-3 s.
- **Ease**: springs at damping 0.85-1.0 (no bounce; `motion.md` "Springs" has the mapping);
  `power3.out` for arrivals.
- **Mechanism**: the captured screen as an `<img>` at 1.6-2× its real size, text at least
  26 px after any push (`types/launch.md`); a wrapper that pushes to the region being named.
  Every number is a variable so it can be corrected.
- **Wrong if**: it is a small window centred in an empty canvas, or the product UI is tilted
  in 3D.

### `chart-truth` — axes, then data, then one callout

The coordinate system appears first, the data grows out of it, and exactly one thing is
annotated. Numbers are honest; animation decides only how they arrive.

- **Beat**: one chart 2.5-6 s.
- **Ease**: `power4.out` for a growing bar; a line draws with `power1.inOut`; a count-up runs
  1.2-1.6 s then holds.
- **Mechanism**: SVG `<path>` with `stroke-dashoffset` for the line, `scaleY` from a zero
  baseline for bars (never from the axis minimum), and one `<text>` callout with a leader
  line. Drive every figure from one data module so the numbers agree (`types/data.md`).
- **Wrong if**: a bar does not start at zero, the axis lies about its range, or a lone number
  gets a whole chart.

### `whiteboard-build` — the argument written out

Says a line, draws the piece that line needs, moves across a large white board, pulls back at
the end to show the whole argument.

- **Beat**: each board section holds about 6.6 s; a long jump across the board is 0.8 s with
  motion blur; a pan inside a section is 1.2-2.4 s.
- **Ease**: the camera is `sine.inOut` — on a whiteboard the camera motion IS the transition,
  so the board never cuts.
- **Mechanism**: one oversized surface, `transform: translate()` on a wrapper; strokes drawn
  with `stroke-dashoffset` at roughly marker speed; a "pen" or "hand" element that tracks the
  stroke tip so the drawing has a visible cause.
- **Wrong if**: the whole diagram appears at once, or each step is a full-screen swap.

## Checking a segment

Before you move on, ask of each segment's frames:

- Does the frame show the thing the narration just named, at the moment it names it?
- Is exactly one thing the focal point? Cover the words — does the picture still say it?
- Did the camera move because the eye had to go somewhere, or because a beat was empty?
- Is the colour that means "X" the same colour it meant in the last segment?

The rendered file gets `scripts/gate.mjs`; this list is the part no script can see.
