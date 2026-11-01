# Techniques

Every motion means something. Pick a technique for what it says, not because it looks advanced.
`motion.md` owns the defaults (how long an entrance is, which ease goes with which role); this file
is the vocabulary you choose from, each entry with what it says, when it earns its place, and what
breaks it.

All snippets assume one paused timeline `tl` in a scene, everything a function of timeline time, and
`beat(n)` = `n * 60 / BPM` computed from the index (`rhythm.md` §5), never accumulated.

## Timing and easing

**Ease-out (`expo` / `power3`).** Says: *arrived with intent*. The default for anything entering.
`ease: "expo.out"`, 0.5–0.9 s. Most of the travel happens in the first third, so the hit goes on the
frame it visually lands (≈30–40% of the duration), not at the end.

**Spring (closed form).** Says: *responsive, physical, alive*. UI reacting to a click, things that
land. GSAP's nearest built-ins are `elastic.out(1, 0.5)` and `back.out(1.4)`; a closed-form spring of
`t` keeps any frame renderable on its own (`motion.md` "Springs" has the damping ratios). Breaks
when everything bounces — that reads as a template — or when a precise brand gets overshoot.

**Ease-in-out (`power2`–`power3`).** Says: *a deliberate move from A to B*. Camera moves and
repositioning, never entrances.

**Linear.** Says: *mechanical, constant, time passing*. Tickers, conveyor belts, rotating rings,
scrolling backgrounds, counters that represent a rate. Its own meaning is speed, so first and last
keyframes must be spaced so the ends don't look cut.

**Anticipation.** Says: *something is about to happen — get ready*. A 2–6% move against the direction,
0.1–0.15 s before the action.

```js
tl.to(el, { x: -8, duration: 0.12, ease: "power2.in" }, t - 0.12)
  .to(el, { x: 600, duration: 0.5, ease: "expo.out" }, t);
```

**Stagger.** Says: *these are many, and they are a set*. Lists, grids, letters. 30–60 ms between
items for UI, 15–25 ms for letters, 60–120 ms for words. Stagger from the point of cause
(`stagger: { from: "center" }`, or from the click). Breaks when a 12-item stagger outlasts the beat
it belongs to.

**Hold.** Says: *this matters; read it*. A hold is a decision: something just landed, or text must be
read (the read floor, `story.md` §8). A deliberate hold that would otherwise trip
`dead_stretch` carries `data-hold`; a hold with nothing to read is dead time.

**Start from a dot.** Says: *something is about to happen, and it will pay off*. The first frame is
one dot breathing on an empty ground; it becomes the subject, then returns at the end as the full
stop or the anchor of a match cut. A hook that is also a motif. It was common enough in top
prompt-gallery films to read as a cliché: use the product's own mark (a cursor, a pixel, a seed), not
a generic dot.

**On the beat.** Says: *this was composed, not generated*. Place events at `beat(n)` from the track's
real tempo (`npx hyperframes beats`), and mark the stretch `data-beat="<name>"` so
`snapshot --review` samples it. Fast sections take fewer beats per event, not a faster tempo.

## Entrances and exits

**Mask reveal (rise from a line).** Says: *precise, editorial, confident*. Text rises out of an
invisible line. Wrap each line in `overflow: hidden`; tween the inner from `yPercent: 110` to `0`,
`expo.out`, staggered by line. The premium default for headlines.

**Scale from zero.** Says: *popped into existence, friendly*. Icons, chips, dots.

```js
tl.fromTo(el, { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(1.4)" }, t);
```

Set `transform-origin` at the cause (the click, the parent). `fromTo` renders its start state
immediately; if the element must not exist before `t`, `tl.set(el, { autoAlpha: 0 }, 0)` first.

**Draw on.** Says: *being made / traced / connected*. SVG strokes with `stroke-dasharray` = length,
tween `stroke-dashoffset` to 0. Lines, routes, underlines, chart lines, signatures.
`getTotalLength()` can return 0 before layout — give it a fallback (`film.md`).

**Type on.** Says: *someone is typing this, live*. Characters by time, not by interval:
`const n = Math.floor((t - t0) * cps)`, with an irregular rhythm table (a hold every 2–3 characters).
Keep the text on fixed lines so the camera never chases a wrapping cursor. Caret always on. This is
one of the few places an `onUpdate` that reads `tl.time()` is correct, because it derives the frame
from time rather than accumulating.

**Wipe / `clip-path`.** Says: *replace, reveal underneath*. `clip-path: inset(0 100% 0 0)` →
`inset(0)`. Direction follows reading order or the cause.

**Blur-in.** Says: *dreamy, coming into focus*. It is the single most overused AI-made entrance, and
two of the seven structured top prompts ban it. It earns its place only when the meaning is focus: a
brand name resolving out of fog, an answer sharpening.

**Exit faster than entrance.** Entrances 0.5–0.9 s, exits 0.25–0.4 s with `power2.in`. The eye has
already moved on.

## Continuity devices (instead of cuts)

These are why the best films feel like one take. Plan one per transition — this is the continuity
chain in `story.md` §7.

**Shared element.** Says: *it's the same thing, now in a new context*. The button becomes the page;
the card flies into its slot; the bubble carries its words. Build both states, then interpolate one
element's box (x, y, w, h, radius) while its contents swap with their own short mask or blur. Text
inside a morphing container needs its own enter/exit timing or it overlaps.

**Morph.** Says: *transformation, one idea becoming the next*. A shape changes size, radius and
colour into the next UI state (pill → loader → check → island). For paths, interpolate equal-point
polygons, or vendor `MorphSVGPlugin`. For UI, animate the box and radius, not the path.

**Flood and contract.** Says: *a state change; commitment; a new chapter*. A colour or shape grows
from an object to fill the frame (≈0.3–0.35 s; overscale past the farthest corner, or half the screen
changes in one frame), holds a beat, then contracts into the next scene's object. Carry a copy of the
source's text inside the flood if it continues.

**Nested reveal.** Says: *what you just watched was made by this*. Open on the finished result
playing, then pull back to show it sitting inside the product's player, editor or chat. One per film,
at the start or as the turn.

**Path-follow.** Says: *a journey from here to there*. An object travels along a dashed path as the
path draws on; the path connects two ideas or two places.

**Mascot through-line.** Says: *one friend guides you through*. The same character carries every
transition or replaces the cursor. Only with a real mascot of the product.

**White flash cut.** Says: *a beat of light; next chapter*. 2–3 frames of white (or the accent) at a
cut. Common in hype edits; twice a film at most.

**Iris.** Says: *focus, a window opening onto something*. Circular `clip-path: circle(r at x y)`, or
six blades around a hexagonal aperture. Opens onto photos and reveals.

**Push-through (zoom into an object).** Says: *go deeper, enter this*. The camera pushes into a
screen, a letter's counter, a dot, until it becomes the next world. The next scene is already laid out
inside the target (that is `motion.md` "Zoom through a button").

**Match cut.** Says: *these two are alike*. Cut between two shots whose shape, position or motion
matches (circle → sun → button). A cut that rhymes is continuity.

**Whip.** Says: *fast, energetic, next!*. A 0.13–0.3 s camera move with directional blur that carries
into the next shot already moving. Real smear comes from page motion blur at render, not a CSS filter.

**Hard cut on the beat.** Says: *a new question, a punch*. Legitimate when it lands exactly on a beat
and the new frame is instantly readable. Never cut on a still frame: enter the next shot already
moving.

**Smash cut / J-cut / L-cut.** A smash cut jumps loud → quiet (or the reverse) for comedy or shock.
In a J-cut the next scene's sound starts before its picture; in an L-cut the old sound runs over the
new picture. Both make a cut feel continuous. J and L are separate `<audio>` clips with their starts
offset from the picture (`sound.md`).

**Crossfade.** Says: *time passing / dream*. Almost always the weakest transition between scenes;
four of the seven structured top prompts ban it. A short white flash-dissolve inside one shot is a
different thing and still common. If you crossfade, overlap the clips (`data-start` inset by the
fade) — `motion.md` has the seams rule.

**Colour-field flip.** Says: *new chapter, hard and clean*. The whole frame flips black ↔ white (or to
the brand colour) for one beat, then the next scene draws on the new ground. Costs nothing, reads as a
section break and a cut at once. Overused when every section flips.

**Collapse into the mark.** Says: *all of this is one thing — us*. The parts of the diagram, product or
scene fold, slide or merge into the logo's geometry, then the mark holds alone. Needs a logo whose
shape the content can honestly become.

## Camera

Use one world and one camera: a wrapper inside each clip that carries `scale` and `x`/`y`
(`motion.md` "The right mechanism"). Never tween the timed media element. Log-interpolate zoom: a
linear scale ramp starts slow and ends violent.

**Push in.** Says: *look closer; this is the evidence*. One tween on the wrapper to 1.6–3× with
`power3.inOut`, landing on a target that rewards the push (the text you can now read, the number).

**Pull back (reveal).** Says: *this is part of something bigger*. Out to show the system; there must be
new information in the wider frame. Often 1.5–2× distance, 0.8–2 s, long tail.

**Screen-studio zoom.** Says: *follow the action*. Auto-zoom to the cursor's work area for each step,
1.6–3×, then out. One eased move per step; never zoom in and out back to back.

**Drift.** Says: *alive, premium*. A 1–3% slow push during a hold keeps it breathing. Linear, the whole
hold — but a drift is not a substitute for a move, and a slow creeping scale on a landed title is one
of `motion.md`'s banned defaults.

**Parallax.** Says: *depth*. Layers move at different rates (foreground 1.3×, background 0.6×), driven
by the same tween clock, not by scroll or pointer.

**3D orbit / dolly.** Says: *it's a real object*. A camera on an arc around the product —
`types/3d.md` for the moves, `runtimes.md` for the runtime.

**Card wall / carousel.** Says: *scale — there are many of these*. A wall of sites, videos or icons in
perspective, flying past or turning as a carousel; the camera then pushes into one card. Lay the cards
on a 3D plane (`translate3d` / `rotateY`) and move the camera, not the cards.

**Camera shake / impact.** Says: *weight, a slam*. 2–6 px decaying over 0.2 s on the impact frame,
offsets from a seeded PRNG. Once or twice a film.

**Rack focus.** Says: *attention moves from here to there*. Blur the old subject and sharpen the new
over 0.4–0.6 s. Do it on a layer inside the clip, never as a CSS filter over footage (`SKILL.md`
contract 11 — footage treatments go through `media-treatment`).

**Dolly zoom (vertigo).** Says: *realisation, unease*. Zoom in while pulling the background layer's
scale the other way. Once, if at all.

**Speed ramp.** Says: *this moment matters*. A `rate` lane in `data-automation` on the media (`t` in
clip seconds, `v` 0.1–10): fast, near-stop at the key frame, fast out.

**Freeze frame.** Says: *stop — look at this / that's me*. Everything halts on a hit, a label slams in,
then motion resumes. A freeze mid-source needs a still exported and placed as its own clip
(`motion.md`).

Camera moves must not reverse direction mid-scene, and reading moments sit still or drift.

## Typography in motion

`motion.md` "Titles" owns the entrance vocabulary. These are the devices on top of it.

**Weight / width axis animation.** Says: *the word itself is alive*. Variable fonts
(`font-variation-settings`) from 300 to 900, or `wdth` 75→125, on the beat. Needs the font's file in
`assets/fonts/` with an `@font-face` (contract 9).

**Scale slam.** Says: *THIS*. A word enters at 140–200% and lands at 100% on `expo.out`, with an
impact hit and maybe a 2 px shake.

**Word-by-word / beat-by-beat.** Says: *a rhythm you can feel; a manifesto*. One word per beat,
replacing or stacking.

**Kerning squeeze / accordion.** Says: *compression, the brand gathering into a mark*. Letters move
toward a point with their width following.

**Pill highlight.** Says: *the key phrase*. A rounded rect grows behind 1–3 words (left to right,
0.3 s) in the accent colour. The 2026 launch-film staple; once or twice a film.

**Text reel.** Says: *many, continuous, at scale*. Words, currencies or stack names scroll behind one
fixed word ("works with ___"), with a blur mask on the edges. Land on the word that matters.

**Strike-through and replace.** Says: *the old way is over*. A line is drawn through the old claim or
price, then the new one lands beside it. One reversal per film.

**Punctuation as a character.** Says: *crafted, with a voice*. The full stop, question mark or comma
becomes the brand's shape, moves on its own, or carries the transition. One device per film.

**Text on a path / spiral.** Says: *journey, motion, hypnotic*. SVG `textPath` with an animated
`startOffset`.

**Type as container.** Says: *the word holds the world*. Video or images masked inside letterforms
(`clip-path` per glyph, or an SVG mask).

## Shape and material

**Squash and stretch.** Says: *mass, elasticity, cartoon life*. Scale x/y inversely on impact
(1.2 × 0.8), recover on a spring. Characters, balls, playful UI.

**Overlap and follow-through.** Says: *it's physical*. Parts arrive at different times: the label
settles 60 ms after its card; a tab indicator's leading edge runs ahead of its trailing edge (two
tweens on two edges).

**Goo / metaball.** Says: *liquid, merging, organic*. Blur plus an alpha threshold
(`feGaussianBlur` + `feColorMatrix`), then composite the sharp source on top.

**Liquid glass.** Says: *premium, modern consumer*. Each glass element holds its own clone of what is
behind it, displaced with `feDisplacementMap` at three slightly different scales for chromatic edges,
plus a rim highlight. `backdrop-filter: url()` misreads displacement maps in Chromium — clone the
scene. Glass over bright footage goes white on white (`overlays.md`).

**Grain / noise.** Says: *film, warmth, analog*. A seeded noise canvas at 3–6% opacity, re-seeded from
the frame number so every render matches.

**Light sweep.** Says: *polish, premium, "new"*. A narrow bright gradient band crosses a logo or card
once (0.6–0.9 s, `power2.inOut`). Once per film.

**Motion trail.** Says: *speed, path*. Fading copies or a stroke behind a fast object. Prefer real
motion blur; use trails when the path itself matters.

**Impact rings and burst lines.** Says: *the accent, drawn*. Concentric rings or speed lines at a hit.
Divisive: four of the seven structured top prompts ban shockwaves and particle bursts, while the
showreel family uses them constantly. Only on the one or two biggest hits, in the accent.

**Text ↔ particles.** Says: *emergence; form from noise*. Letters dissolve into particles or particles
gather into a word. Sample points from the text (`getImageData`), give each particle a seeded start,
tween to the target. Model launches and generative pieces; never on body copy.

**Particle burst / gather / orbit.** Says: *energy released; things coming together*. Seeded particles
burst from a hit, gather into a shape or orbit a centre. The most common effect in one wave of
Claude-made films, which is also why it reads as generic. Give the particles a meaning (letters,
pixels of the product, the product's own icons) or skip it.

**Idle life.** Says: *alive, waiting for you*. A held subject keeps a tiny loop going: a blink, a
float, a breathing glow. Keeps holds from going dead without moving the camera. On titles and UI it is
a tell (`motion.md` "Defaults that look generated"); on a character it is acting
(`types/character.md`).

**Glitch.** Says: *digital, broken, edgy*. 2–4 frames of seeded slice offsets and RGB split on a beat.
More than twice a film becomes noise.

**Glow.** Says: *energy, AI, magic*. Six of the seven structured top prompts ban glow on UI and on
text. It survives on a final wordmark, rim light, particles, and dark grounds where the light source
is the content (a terminal, a neon sign).

## Data

`types/data.md` owns what a data beat must say. These are how each arrives.

**Count up.** Says: *it grew to this*. A counter tween with `snap`, landing on the final number with a
hit; tabular figures so digits don't jitter. Runs 1.2–1.6 s, then holds.

**Bars grow from zero.** Says: *comparison*. Always from a zero baseline, staggered, the hero bar last
and in the accent. Never grow from the axis minimum.

**Price anchor flip.** Says: *the difference is absurd*. The big old number holds, then the new one
slams in beside it, or two counters run opposite ways. Pricing and speed claims.

**Line draws, then the point lands.** Says: *trend, and this moment on it*. Draw the line
(`stroke-dashoffset`), then pop the latest point with its label.

**Chart morph.** Says: *same data, new view*. Bars → dots → line by interpolating each datum's mark.
Keep one identity per datum so the eye can follow it.

## Product UI

`types/launch.md` owns what must be real. These are the devices.

**Cursor choreography.** Says: *a real person is using this, and it works*. An arrow that glides on
eased curves, decelerates into targets, grows on hover (×1.55), shrinks 10–15% on press, and leaves a
press ripple. Clicks change state on the same frame. The cursor scales with the camera and is 4–7% of
the frame.

**Prompt receipt.** Says: *you can make this too*. The prompt or code that made the film stays on
screen beside it, typed in or pinned as a card. Films that showed their prompt were among the most
saved of Oct 2026.

**Chat-bubble stack.** Says: *a conversation, live*. Bubbles spring in from the bottom and push the
older ones up; the newest gets the accent.

**Completion receipt.** Says: *the promise is kept*. A progress run 1/6 → 6/6, a ring to 100%, a
timeline ticking off each step, a check that pops. The emotional peak of a UI film.

**Direct manipulation.** Says: *you control it*. While the cursor holds, the value follows the cursor
position; on release it springs back from wherever it was.

**UI state springs.** Toggles, tabs, sliders, sheets: every state change is a spring on the specific
property that changed, nothing else moves.

**Rebuild, don't screenshot.** Rebuilt UI (HTML/CSS) stays sharp at any zoom and can morph. Use
screenshots only as textures for context. A real screen recording is fine when the real product is the
point; what fails is a still screenshot panned around (`types/launch.md`).

**Split compare.** Says: *before and after; this vs that*. Two states side by side, or wiped across one
frame with a divider, the same content in both. Everything identical except the one thing compared.

## Finishing

**Motion blur.** Says nothing — it removes the strobing that marks animation as cheap. Opt in with
`data-motion-blur="on"` on the root (it is off unless asked for); `render --page-motion-blur off`
turns it off for one render. Until about a tenth of the frame per frame the blur reads clean; past
that it leaves discrete ghost copies, so slow the move down or accept them as a stylised smear.

**The editor on screen.** Says: *this was made, and it is adjustable*. Keyframes, easing curves,
selection boxes, bezier handles, a playhead and live readouts become the content, not just the frame.
Makes code-made motion credible.

**Leader-line callout.** Says: *this exact part*. A thin line from a point to a small caps label; draw
the line, then type the label. Engineering idents, hardware, diagrams.

**Stamp.** Says: *approved, signed, final*. A seal rotates and scales down onto the frame with a small
shake. Once per film, on the confirmation.

**Spec card ending.** Says: *made by someone who knows what they did*. The film ends by stating its own
specs (palette, type, frame count, BPM) or a signature line. A showreel convention; in a product film
the brand mark replaces it.

**HUD chrome.** Says: *a professional piece, a system*. Corner brackets, timecode, section labels
(`01 — EASING`), BPM. Small monospace caps at the frame edges. Note that decorative HUD is on the
`spec.md` banned list for most films — this is for showreels and technical pieces.

**60 fps.** Fast UI motion and showreels look better at 60 (`render --fps 60` or the root's
`data-fps`); story and documentary at 24–30.

**Seamless loop.** Says: *an object, not an ad*. The last frame equals the first, including cursor
position and velocity. Three ways back to the start: reset with the state kept (the scene tidies
itself), a varied repeat (the same move with a new value), rewind. Compare the two ends with
`npx hyperframes compare <a.html> <b.html> --at 0,<end>`.

**Chapter counter.** Says: *this is a set and you know where you are*. `01/08`, `13 OF 20` in a fixed
corner, ticking on each cut. Lists, tutorials, game trailers.
