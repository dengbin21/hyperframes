# Art styles

Thirty-six art directions, taken from `huashu-art-motion` (MIT, Alchain), where each one was
built and reviewed as a Canvas 2D scene that repaints the whole frame at 30 fps. HyperFrames
does not repaint per frame: it seeks a paused GSAP timeline over a DOM tree, and only what you
tween changes. That difference is the whole translation, so read the next two sections before
any card.

Use this file when the look has to come from an art history rather than from a brand, a design
spec or a reference film — a fable, a period piece, a tribute, a style survey, a title
sequence that quotes a movement. For a normal film, `look.md` and its presets are the cheaper
and better start; a style card here is a material system, not a preset.

## What a style actually is

Never a filter over the same composition. Every card below is five decisions, and all five
have to agree:

1. **Ground** — what the picture is painted on: paper, plaster, canvas, vinyl, gold leaf, a
   pixel grid. Its texture and its tone are half the style.
2. **Mark** — how a line and an edge are made: a loaded brush, a 5 px comic outline, a 1 px
   sprite outline, a chisel-cut paper edge, a tesserae contour.
3. **Light** — whether light is modelled (Rembrandt, Hopper), decorative (Klimt, Matisse) or
   absent (cave, 8-bit).
4. **Palette** — a closed set of named colours, not a hue rotation. The cards give the hexes;
   use those, and use the *ratio* of them the card implies.
5. **Motion** — what moves and at what frame rate. Paintings breathe, comic panels flip,
   sprites step.

A style you cannot state in those five lines is a colour grade. The source learned this the
expensive way: running one parameter set over a whole frame turns it into a carpet (see
`09_postimp`), and a character drawn with flat vectors on a styled background always reads as
a sticker — that is the single most common defect in all 36 cards.

**Do not carry the source's composition.** All 35 demo scenes are the same room (window upper
left, cat lower left, a girl with a cup at the right). That is the mechanism of a style-survey
film, not a style. Take the renderer, the mark, the palette logic and the motif motion; invent
the room's own coordinates, props and subject for your film.

## Translating a Canvas renderer into the DOM

The source draws into a 2D context and recomputes everything each frame. Here is what each of
its techniques becomes. Numbers and lessons are the source's; the right-hand column is the
HyperFrames equivalent.

| The source does | Do this instead |
| --- | --- |
| Repaints the whole frame from a seeded renderer at 30 fps | **Bake the ground once, then move what moves.** A painterly ground is static in the file: build it as one SVG (or one PNG exported at build time from a script) and let GSAP animate only the motif, the light and the camera. This is the single biggest saving and the reason a 110 ms/frame Canvas scene becomes a normal HyperFrames film. |
| `Math.random()` / `hash(frame, i)` per frame | Seed mulberry32 once at build time. Anything that must flicker (grain boil, dots re-rolling, neon stutter) is `f(seekTime)` with `Math.floor(t * rate)` inside, never a random call. |
| `P.texture` paper grain, `P.grain` | One `<rect>` with `filter="url(#grain)"` (`feTurbulence type="fractalNoise" baseFrequency=".8"`) at `mix-blend-mode: multiply`, opacity 0.1–0.25, built once. Never animate it unless the card asks for boil, then step it. |
| fbm height field + finite-difference normals for a cave wall / plaster | `feTurbulence` + `feDiffuseLighting` (or `feDisplacementMap` over a flat fill) in a filter. Static, one per ground. Set the light direction in the filter and keep it consistent with everything else. |
| `createPattern` halftone tile | An SVG `<pattern>` of five circles (4 corners + centre) at the pitch and radius the card gives, or the CSS equivalent `radial-gradient(circle at center, …) 0 0/13px 13px`. Both align to the screen, so the dots do not swim when an element moves — the source's reason for using a pattern over per-dot drawing. |
| `getImageData` → quantise to N colours + 1 px outline (spriteize) | Do not quantise at runtime. Draw the art *in* the palette, and outline each part as its own stroked shape (the card's lesson: one outline per part, never one per silhouette). For true pixel art, build at 240×135 and scale the element with `image-rendering: pixelated`. |
| Brush ribbon with per-bristle polylines and `dry` noise | One `<path>` per stroke with `stroke-linecap: butt`, a `stroke-dasharray` that encodes the bristle gaps, and a second wider path underneath at ~0.3 alpha for the wet halo. Reveal with `stroke-dashoffset`. The source's bug is worth keeping in mind: one continuous path per bristle, never per-segment strokes with a round cap, or the joints read as bamboo. |
| `blur` + `multiply` for an ink or watercolour wash | `<feGaussianBlur>` or `filter: blur()` on a group at `mix-blend-mode: multiply`. Legal on graphics; footage grades still go through `media-treatment`, never CSS filters. |
| `destination-out` to hold white paper out of a wash (留白) | `<mask>` with the shape painted black, or `mask-image` with an SVG. Holding the ground out reads as paper; painting white reads as gouache. |
| `shadowBlur` glow, `lighter` compositing | `filter: drop-shadow(0 0 Npx <colour>)` stacked twice, `mix-blend-mode: screen` or `plus-lighter`. For a neon tube: one blurred wide stroke, then a 2 px near-white core on the same path. |
| Per-frame `drawImage` of an offscreen cache | A `<div>` layer built once. Animate `transform`, `opacity`, `background-position`; nothing else re-renders. |
| Stepped animation at 8/10/12/15/24 fps | GSAP `ease: "steps(12)"`, or quantise inside an `onUpdate`. Two frame rates in one film is the point: camera and light smooth, marks stepped. |
| `transform(1,0,−0.45,1)` skew sweep for a light streak | A tall rotated div with a `linear-gradient` and `mix-blend-mode: screen`, `transform: skewX(-24deg)`, tweened across in one complete pass. |
| Camera push / pan | One wrapper inside the `.clip`, tweened `scale`/`x`/`y` with `transform-origin` on the point being entered — `motion.md` "The right mechanism". Never on the media element itself. |

Two hard limits that decide which cards travel well:

- **A filter cannot be animated per-pixel here.** If the source's effect is "recompute every
  pixel each frame" (VHS channel split with per-frame noise, per-dot re-rolling, pixel
  quantisation), bake it or fake it with layers and stepped transforms. A still filter plus a
  moving mask usually gets 90% of it.
- **Text must be text.** Burned-in `PressStart2P`, `Bangers` or a hand-drawn Cyrillic letter
  set: use a bundled font, an `@font-face` file, or draw the few unique glyphs as SVG paths.
  The source hit this repeatedly — full-width kana, `▶` and geometric Cyrillic silently fell
  back to a system face. Check the glyphs render before you build around them.

## Picking one

Pick by subject and by what the film has to do, then settle it as numbers in the LOOK line
(`spec.md`).

| The subject | Style | Why it fits |
| --- | --- | --- |
| A story, a fable, anything hand-made and old | `17_ink`, `20_dunhuang`, `34_shadowpuppet`, `01_cave` | The medium carries age without a filter; strokes and joints move by themselves |
| A mechanism, a system, an argument | `22_constructivism`, `12_bauhaus`, `13_pop` | Flat geometry and type do the explaining; no modelling needed |
| A product, a data story, a modern brief | `16_2026`, `14_8bit`, `26_vaporwave` | Current flat, sprite or neon languages; cheap to keep crisp on screen |
| A mood piece, a landscape, a memory | `09_postimp`, `08_impressionism`, `29_seurat`, `28_monet`, `25_ghibli` | Light and weather are the subject |
| A person, a portrait, an interior, a silence | `24_hopper`, `32_rembrandt`, `18_klimt`, `36_picasso_blue` | Light and decor do the acting |
| A joke, a pop reference, a punch | `13_pop`, `31_haring`, `33_rubberhose`, `27_kirby`, `37_rick_morty` | Loud marks and stepped timing |
| Something strange, mental, dreamlike | `23_dali`, `19_munch`, `11_cubism`, `49_chagall` | Distortion is the language |
| A period, a place, a document | `02_egypt`, `03_greek`, `05_gothic`, `04_roman`, `06_renaissance`, `10_nouveau`, `51_persian_miniature` | The artifact is the authority |

Quality in the source is a three-star scale: ★★★ reads as the style at a glance, ★★ reads as
it with an obvious weak spot, ★ must be rebuilt. Keep it: a ★★ card needs your own work on its
named weakness before it is safe to deliver, and a ★ card is a starting point only.

## Moving a style onto a new subject

A card describes a room from the source's own film. Putting a new subject in it is the part that
fails, and it fails the same way every time: the background goes through the style's renderer and the
subject does not.

### Separate four things

- **The style's language** — mark and material, colour relationships, light, modelling, spatial
  organisation. These survive the change of subject; that is what makes it recognisable.
- **Compositional habits** — an off-centre weight, linked groups, a large scale difference. Re-solve
  these for the new frame and the new event; never copy coordinates or reuse one layout per shot.
- **Content and motifs** — the people, clothes, bridges, boats and gardens of the famous pictures.
  They do not enter a new work unless this film needs them.
- **Narrative and action** — who wants what, what resists, how the action changes the situation. Speed,
  camera and beats come from the content. A quiet style can carry fast action; limited animation can
  carry a complex event.

Naming an artist is not choosing one picture as a template. When the person names a studio, narrow it
to a film, a director or a period first — Ghibli and Pixar do not each have one way of drawing. If
several directions are equally reasonable, fold them into the three directions (`story.md`) instead of
asking another formal question.

### Study at least three works

For a new range, look at three or more different works, or three different scenes from official
footage, covering different subjects, scales or light. Consecutive frames, crops of one painting and
the same composition recoloured are not independent samples. If the material is thin, say what is
missing rather than claiming to have seen it.

Write a short style brief beside the shot plan:

1. the range and its sources, with attribution, medium and period checked;
2. three to five observable stable features, each noting which reference supports it and which does
   not apply;
3. two things that separate it from its nearest neighbour — Renoir, Pissarro and Sisley sharing one
   broken-brush filter is not a differentiation;
4. this film's subject, event, space and frame, rebuilt from the brief rather than lifted from the
   reference;
5. the visual relationships to keep, the content that may change, and the technical approach still to
   be proven.

Record "what is in the picture" separately from "how the painter made it". Write the palette as
relations and value structure, not as a claim that some set of hexes is the artist's standard palette;
three to six key colours do not mean every pixel uses only those. Texture, mixing, shadow and specular
follow the colour relations. The existing palette rules and the gate still apply; when the subject
needs an exception, say why (`--allow-blue-purple "<reason>"`, `REVIEW.md`).

### Prove the new subject before calling it a capability

Make the first frame for *this* subject, still through the three directions. The subject's shape,
edge, light and material are handled together with the background — never a filter on the background
alone. State which part is code, which is existing material, which is a character frame library, or
which is another approved tool.

The first time a researched card becomes a reusable recipe, stress it on a different scene: usually
one with a character acting, one with no people, one where the scale or the environment changes
sharply. The card's own examples may inspire the subject; they must not become the new fixed template.
Whether a landscape painter can carry a character close-up is an open question, not a promise.

Check the still first: remove the artist's name and the famous motifs — are the form, colour, light,
mark and space still recognisable? Beside its nearest neighbour, is there a real difference? Then check
the motion: contact, occlusion, texture coordinates, character identity, material consistency, watched
at normal speed. A good still does not prove the animation flows, and a sensible written plan does not
prove the picture works.

### Say which state it is in

- **Researched recipe** — sources and a stated visual hypothesis, enough to direct an attempt; no
  dedicated implementation and no verified frames. It cannot be delivered on the strength of a card.
- **Single-scene build** — an implementation, an output and a check record, covering only that scene.
  Note the reference parameters and where it fails.
- **Cross-scene verified** — different new scenes passed an independent frame review; note the
  coverage achieved, and describe motion verification separately.

One branch of a studio passing does not make the family pass. A new card does not inherit an old
sample's stars, performance or acceptance. A card's same-room parameters are historical evidence with
reference value only in the matching scene.

### Write the experience back

Read a card's range, weak points and latest measurements before using it. After a film, record in the
card: date, task and scene, sources, implementation and output evidence, observation, fix, verification
state and boundary. If new evidence overturns an old claim, fix the sentence and check the routing that
depended on it; if a fault reproduces stably, fix the tool first and test it. A single work's trait does
not become a rule for every work.

## Two mechanisms instead of a flat picture plus noise

The most common way a styled film goes wrong is a clean flat-vector drawing with a noise layer on top
and a caption calling it a style. Split the scene in two layers:

- **the form layer** — objects, people, space drawn clean;
- **the medium layer** — the form layer put through what the material actually does.

| Channel | What it does | For |
| --- | --- | --- |
| broken brush | repaint as individual curved strokes, warm in the light and cool in the shade | impressionism, Sisley, Pissarro, Renoir, Guardi |
| fresco | pigment eaten by lime, plaster grain, pinholes, seams | Giotto, Piero, Raphael |
| silk and ink | silk weave, dry-brush streaks, five tones of ink | Chinese ink, Ma Yuan |
| flat with a moving edge | short strokes inside each flat area following one direction, plus a thick uneven dark contour | Gauguin, synthetism, stained glass |
| modelled figure | robes, capes, folds, gaze — volume on a clothed body | murals, miniature painting, flat narrative |
| outline and hatch | variable-width line, hatching for shadow | woodcut, engraving, miniature |

In the DOM, the form layer is ordinary elements and the medium layer is one of: an SVG filter chain
(`feTurbulence`, `feDisplacementMap`, `feGaussianBlur` + `feColorMatrix` for the threshold), a
`<canvas>` that receives the form layer via `drawImage` and repaints it, or a mask whose edges are
displaced. Write a channel as a named function the first time you need it and reuse it; do not bury it
in one scene.

## A journey through styles: one skeleton, one choreography, N ways of drawing

For a style-survey film that walks through many movements, done this way the continuity comes free.

- Fix the **rig** first: one character skeleton (or a cat, an object) with anchor points, and one
  action curve evaluated on **film time `t`**, not per-segment local time. A character that restarts
  its gesture in every segment reads as "she raised the glass five times", not as one instant drawn
  five ways, and a pose that resets at a seam produces two heads.
- **The transition is the next style's signature.** Every seam both leaves the old style and
  announces the new one, so the viewer knows within 0.3 s who is next. List the new style's most
  identifiable formal element (material, stroke, motif, media failure), pick one that can go from
  nothing to full, and grow it out of an object already in the picture.
- **Hit both layers on the beat.** When a beat lands, the change must be visible full-screen; if only
  the incoming layer is hit, the first six seams of fifteen drift 0.1–0.17 s late.
- **The first picture draws itself.** With no transition to borrow at the open, use the style's own
  making-of: a stroke writing itself, plates printing one by one, pixels lighting row by row.
- **Region palettes, not colour jitter.** A Van Gogh that only jitters one blue is noise; each region
  gets its own group of 7–8 colours and every dab draws from its group, then mixes 30–45% of the
  underpainting back in to keep the value structure.
- **Big areas to the renderer, small objects and characters on their own layer, lines last.** Large
  areas swallow sunflowers and table legs into one mass; splitting the layers makes them read.
- **Small things are drawn larger than instinct says.** Kanagawa's wave claws at 22–50 px do not read;
  at 44–74 px they do.

## What the source's own 36 styles got wrong

Useful because the failures repeat. Read them as constraints, not as history.

- **Nobody looked at the originals.** The rewritten demos came out as one modern flat illustrator with
  a swapped palette, because the cards carried a text description and a museum link and the person
  building them drew from memory. Fix: fetch three public-domain works and actually look at the
  contact sheet before writing a line.
- **The card's wording removed the anchor.** "Do not generalise from one famous work" was meant to stop
  copying, and became "do not study the original". What must not be copied is the famous figures and
  coordinates, not the brushwork, the material, the colour relations or the way bodies are built.
- **There was no medium layer**, so a style became palette plus noise (above).
- **One subject was run through every style.** Wash machines, water wheels and repair scenes repeated,
  and each style's own narrative logic (Ma Yuan's corner, a miniature's full-field packing, Gauguin's
  cropping, Giotto's gaze) was flattened away.
- **There was no threshold.** Technical checks passed and nobody asked "does it look like it", so six
  seconds of clean render counted as delivered.

Each of these five has a countermeasure in the sections above; the last one is why the gate and
`review.md` exist.

## Material layer

These seventeen can go on any subject — they are mark, light and colour rather than a scene.
Each card gives the five decisions, the numbers, and what the source got wrong.

### `09_postimp` — Van Gogh, 1889 · ★★★ the benchmark

- **Ground**: flat block-in, then repainted in directional strokes. Three passes, never one:
  wall vertical `−π/2 ± 0.22·noise`, floor along the perspective lines to the vanishing point
  (`960,330`), everything else in a flow field. Wall strokes `cell 14 / len 64 / w 8`, floor
  `cell 12 / len 46 / w 8`, rest `cell 10 / len 22 / w 6.5`; outline 0.8–0.9, 40–45 % mixed
  toward deep blue; reseed at 8 fps so the marks boil.
- **Mark**: loaded short strokes with a visible direction. Props (chairs, vases, frames) get
  their own small-stroke layer, `source-atop`, or the big strokes smash them.
- **Light**: decorative, not modelled — the light is in the stroke colour.
- **Palette** (a *region* palette, not a hue): wall `#7f9be6 #5f7fd8 #a7bbf2 #6c6fd2 #8ad0e6
  #c3cbf6 #4f6cc8 #9a8fe0`; sky `#22339a #2f4fb8 #5c86dc #8fb6ee #1b2a78 #3c6bd0`; floor
  `#c0573c #a8453a #d7774a #8e3b30 #5f8f6a #c96a52 #e08a5c`. Ten-odd hues inside one region is
  the whole effect; jittering one blue gives noise, not Van Gogh.
- **Motion**: the sky's swirl rotates (`0.3 t` added to the field angle), lamp halos expand as
  dashed rings, stars pulse, and the subject's spiral stripes turn at `0.6 rad/s` inside their
  clip.
- **Signature transition**: the sky vortex pulls the new frame in.
- **Build here**: the stroke field is a static SVG built once (paths, not a canvas). Animate
  the swirl by rotating a group whose strokes were generated along it; animate the halos and
  the stars. Do not rebuild the field per frame.

### `08_impressionism` — ★★

- Pastel short strokes in fixed positions with a *fine* stroke pass for the window; the strokes
  stay put while the light moves.
- **Motion**: light dabs drift and blink, poppies sway, clouds travel, ribbons flutter. The
  subject is nearly still — the weather is the animation.
- **Weakness**: faces and hands are destroyed by the strokes. Keep a small clear zone: one
  region at 30–40 % of the stroke density, or the character reads as broken.
- **Build**: baked stroke ground + two moving light layers at `screen`, low alpha, 8 fps steps.

### `29_seurat` — pointillism, 1884 · ★★

- **Ground**: the block-in, then blurred (`4px`) at `saturate(.85) brightness(1.06)` as a
  substrate so the gaps between dots are not white.
- **Mark**: a fixed hexagonal grid — pitch 10, row 8.66, radius 4.5, static jitter ±1.2 px,
  every dot the same size. Colour is *mixed by the eye* from a closed 21-colour board:
  14 saturated `#1a2058 #2a3a9a #3f6fd0 #6aaee6 #1f6a52 #2f9a5a #a8c83a #f2cf3a #f08a2a
  #e0432a #c0306a #7a4aa8 #f8f4e8 #e8b48a`, 7 pale `#f6e49a #f6c48a #cfe08a #b0cff0
  #f2b8c8 #c99a4a #9a7ac8`. For each target colour, project it onto the segment between two
  board colours, clamp the ratio to `[.2,.8]`, penalise far pairs by `0.004·|Δ|²`, and pick per
  dot by hash against that ratio.
- **Two bugs to avoid**: a near-solid-colour preference cuts gradients into vertical bands, and
  a continuous ratio switches whole columns at once. Fix both by jittering the target colour
  ±20 before the lookup, so the switch boundary is interleaved dots.
- **Motion**: 8 % of dots become complementaries (blue↔orange, green↔red-violet, yellow↔violet),
  and at 6 fps 7 % re-roll — that shimmer is the "light trembling between the dots". At 4 fps /
  3 % a reviewer judged the film essentially frozen; the source raised it to 6 fps / 7 %.
- **Weakness**: static and grid-regular. The 6 fps re-roll is the fix, not more dots.
- **Build**: bake the dot field as one PNG at build time (24k dots is too many DOM nodes), then
  animate a second sparse layer of a few hundred shimmer dots on top at 6 fps. If you only
  have a few hundred dots in the frame, keep them as `<circle>`s.

### `25_ghibli` — watercolour background + cel character · ★★

- **Ground**: wash. Deform a polygon by midpoint displacement (3 rounds, amplitude ∝ edge
  length, ×0.6 per round), then stack 3–5 translucent fills at `multiply`, each with a 1.6 px
  same-colour edge at `α = edge`. Stacked edges are the watercolour's drying line. Big areas
  `layers 5 / α 0.4 / amp 12`; colour blooms `layers 3 / α 0.045 / amp 40`; planks
  `layers 3 / α 0.5 / amp 3 / edge 0.14`; opaque white (frames, cloth, cloud) `source-over`
  at `α 0.9`. A paper-grain multiply at 0.3 over the top.
- **Character**: cel — fill the shadow colour, then inside the clip translate by `(−dx,−dy)`
  and fill the base colour, leaving one crescent of shadow; outline 2.4 px warm brown
  `#4a3428`. Two colours and a line, nothing more.
- **The known weak spot, and the fix**: characters read as flat vector stickers. The source's
  repair is worth copying — draw the character to its own layer, build a texture layer (paper
  grain + 40 transparent blooms), `destination-in` it against the character's silhouette, and
  composite. Here: `mask-image` the grain + bloom group with the character's SVG silhouette.
- **Motion**: a curtain billows (`q²·(90+70·gust)`, `gust = 0.55+0.45·sin(3.2t+φ)` plus a
  `sin(7t+6q)` ripple), grass waves as a travelling front (`wind = 0.5+0.5·sin(3.1t−0.018x)`),
  clouds 22–30 px/s, 34 komorebi patches drift and blink on the wall.
- **Build**: `feTurbulence` + `feDisplacementMap` gives the deformed wash edge statically; the
  billow is a per-column `translateY` on a subdivided curtain div.

### `17_ink` — Chinese ink, 八大山人 / 齐白石 · ★★

- **Ground**: `#efe6d0` paper, `scale .0025, amt 9, grain 7`, plus ~2600 short fibres (half
  brown `α .05–.13`, half light `α .12–.27`), and a radial vignette to `α .22`. Never open on a
  blank sheet — the source's first frame was a white page and failed as a thumbnail.
- **Mark**: a loaded brush. Resample the point list to 4 px arc length (or the dry-brush noise
  frequency changes with stroke length); pressure `smoothstep(0,head,q) ·
  (1−0.7·smoothstep(1−tail,1,q)) · (0.85+0.15·noise)`; the wet core narrows as the stroke runs
  out (`1−0.85·dry·q^0.8`); bristles are ±0.475·w·prof and break where noise exceeds the dry
  threshold. Window frame `w 14–18 / dry .45–.6`, table `w 22`, drapery `w 4–6 / dry .3–.4`,
  ground line `w 5 / dry .85`.
- **Palette**: five ink tones from `rgb(16,14,12)` — 焦 .9 / 浓 .8 / 重 .6 / 淡 .35 / 清 .15;
  ochre `#c47a3c`; indigo `#6f8aa0`, sleeve `#7d97ab`; gamboge `rgba(226,170,52,.75)` at
  multiply; rouge `rgb(190,40,40)` on exactly three places; vermilion sun `#d8553f`; seal
  `#c4281e`.
- **留给空白**: hold the paper out of the ochre layer with `destination-out` for the muzzle,
  chest and paws — a mask, not white paint.
- **Motion**: the opening draws itself (`reveal = ss(d, d+l, t/0.45)` in the order window,
  table, bamboo, cat, figure), wash halos keep widening, four paper-coloured fog bands cross at
  150–270 px/s, bamboo sways `sin(2.9t)·0.11` increasing toward the tips, leaves flip
  `sin(7t+φ)·0.2`, shrimp antennae and claws travel as waves, the seal presses in at 1.5×→1×.
- **Weakness**: the figures are not written enough — 6/10 at review. Build the subject from
  brush strokes first, then add the minimum anatomy inside them.
- **Build**: one `<path>` per stroke, `stroke-dasharray`/`dashoffset` for the reveal; wash is
  `blur` + `multiply`; 留白 is a mask; bake the finished static strokes once the draw-on ends.

### `13_pop` — Lichtenstein + Warhol, 1962 · ★★★

- **Mark**: 5 px black outline plus flat fill, one `ink()` function for everything; highlights
  are short thick white strokes; shadow is hatching (10 px spacing, 3.5 px black diagonals
  inside an elliptical clip).
- **Halftone as a pattern**: `pitch 24 / r 5.6` blue `#2f5cc8` on white for the wall (the
  measured period was 17 px on the diagonal), `pitch 13 / r 3.3` red `#e2483c` on skin
  `#fae0cc`, `pitch 14 / r 2.2` at `α .18` for a hint of print on the yellow.
- **Palette**: black `#141414`, paper `#f3eedb`, blue `#2f5cc8`, yellow `#f7d52c`, red
  `#d8232a` / `#a8161c`, white `#fbf8ee`, skin `#fae0cc` + dots `#e2483c`, gold hair
  `#f8d62c` / `#d9a514`, cat `#f39a2c` / `#c4561a`, Warhol grounds `#9ccf3a #e0359a #2fc0b0
  #f08a2a`.
- **Motion**: the four Warhol panels cycle their four palettes every 5.5 frames
  (`step = floor(t·11)`); the three thinking dots light in a 12-frame stagger; the onomatopoeia
  burst shakes ±8 px / ±6 px / ±0.03 rad on the beat with 10 black action lines pulsing
  `0.85+0.25·sin(40t+2i)`.
- **Signature transition**: a lightning bolt, then halftone dots close over the frame.
- **Build**: everything is SVG with the halftone `<pattern>`; the panel cycle is one tween that
  swaps `fill` per panel on a stepped ease.

### `14_8bit` — 1985 · ★★★

- **Ground**: build at 240×135 (1 low pixel = 8 screen px, measured), then one upscale with
  smoothing off — here `image-rendering: pixelated` on a 240×135 element. Per-pixel fills for
  the background: a 6 px cross-dot wall, planks with a seam every 24 px, bricks 16×6 with a
  1 px gap and a `#fbe2a6` highlight on the top and left. Sky gradients are dithered with
  `(x+y)%2` — that checker *is* the NES gradient.
- **Mark**: 14-colour palette, quantised, then a 1 px black outline **per part** (far arm,
  body, hair, face, fringe, near arm, cat body, cat head). One outline around the whole
  silhouette fuses the parts; this is the card's main lesson.
- **Type**: HUD at full resolution, `PressStart2P` at 48 px with an 8 px black drop shadow;
  icons as 8×8 character bitmaps.
- **Motion**: 15 fps four-pose tail loop `[-0.55, 0, 0.55, 0]`, hearts swap every 2 frames,
  a coin rises 9 px and falls, clouds step 1 px, 1×2 hot-air pixels climb at 30 fps in a 6 px
  loop.
- **Signature transition**: the pixel block scales up or down.
- **Build**: a 240×135 `<canvas>` drawn once, or SVG with `shape-rendering="crispEdges"`, and
  a container that is `image-rendering: pixelated`. Step all motion.

### `26_vaporwave` — 2011 neon · ★★★

- **Ground**: deep purple wall gradient `#0d0322 → #4a0f6a`, magenta radial light at the window,
  cyan at the sign, cyan strip along the skirt.
- **Mark**: `glowLine` — the same path stroked wide with `shadowBlur`, then 2–3 px near-white
  core. Sun: yellow→orange→magenta vertical gradient cut with 7 horizontal
  `destination-out` slits that widen with depth (`2+q²·16`) and rise at 0.9/s. Floor: magenta
  perspective grid, vanishing point `(960,600)`, horizontals `y = 600+520/d`,
  `d = k+1−phase`, `phase = 1.3t mod 1`.
- **Palette**: magenta `#ff4fd8`, hot pink `#ff2f8f`, cyan `#3ff6ff`, deep purple `#12052a` /
  `#2a0b4a`, sun yellow `#ffd84a`, orange `#ff8a3a`.
- **Two lessons**: the first outfit was pink and merged into pink-lit skin — a reviewer read it
  as undressed; a lavender coat `#8f7cf6` fixed it. And per-part glows light up the seams
  between waist, arm and torso; if you want an outline only, silhouette the figure first, then
  stroke the silhouette.
- **Motion**: the sun's bars rise, the grid rolls toward camera, the sign's kana stutter
  (`hash(floor(30t),k) < .07` off), a tracking band rolls down with ±30 px horizontal
  displacement inside it.
- **Signature transition**: VHS tear and roll-up.
- **Build**: the channel split is three copies at `mix-blend-mode: screen` with the red and blue
  copies offset by a CSS variable; the scanline band is a 4×4 repeating gradient; the tracking
  band is a stepped `translateX` per 6 px row. `▶` and kana are drawn, not typed.

### `35_shinkai` — ★★

- Cumulus built from stacked puff sprites, god rays as a soft `linear-gradient` at `screen` with
  a mask, cel shadow with a hard edge, bloom on the highlights.
- **Motion**: light particles drift, clouds travel. **Weakness**: interiors lack background
  density — the style only holds up outdoors. Add a detailed far layer or change the subject.

### `32_rembrandt` — ★ the weakest card, rebuild it

- Light is a map multiplied over the whole frame: window key plus candle fill, dust in the
  beam, cloud shadows crossing the window.
- **Weakness**: the figures are flat, 5/10 at review. The technique is right (see `24_hopper`
  for the two-version crop, which is the same idea done properly) but the character has to be
  modelled, not silhouetted, or the light lands on a cutout.
- **Build**: paint the lit version and the shadow version of every layer, then `mask` the lit
  one with the light shapes. That is a static mask per shot, which fits this engine well.

### `11_cubism` — analytic, ★★

- Translucent gradient planes layered in space, planes cut by a facet tool that does not clip
  triangles, a two-viewpoint face.
- **Motion**: letters jump and swap, window facets slide, newspaper flutters.
- **Weakness**: too light; the deep-brown masses are missing. Push the value range down before
  adding facets.
- **Build**: overlapping polygons at `multiply`, alpha 0.35–0.6, seams nudged ±2 px.

### `30_matisse` — paper cut-outs · ★★★

- Scissor-cut edges: an irregular polygon, not a rounded rect. Pinned-paper shadow,
  saturated flat fill.
- **Motion**: paper pieces drift, seaweed sways.
- **Weakness**: too much gouache texture under the flats.
- **Signature transition**: a cut blue sheet sweeps across.
- **Build**: `clip-path: polygon()` with hand-jittered points (no two angles equal), plus
  `drop-shadow(4px 6px 0 rgba(0,0,0,.16))` for the pin.

### `16_2026` — contemporary flat illustration · ★★★

- Grain-dot density functions, no outlines, flat colour blocks.
- **Motion**: character performance with damped secondary motion — jump, clap, shatter, gasp,
  sign. **Signature transition**: three concentric colour rings.
- **Build**: flat SVG shapes plus a grain overlay; secondary motion is a lagged follow tween on
  hair, coat and prop.

### `22_constructivism` — Rodchenko / Lissitzky, 1924 · ★★★

- **Ground**: aged paper `#e9dfc4` (dark `#d9c9a4`), a black diagonal bar at −0.5 rad, a red
  square at 0.26 rad, five bars of "body text", a big black circle behind the head (r 215 at
  `1330,395`), an oblique red ground plane with a 12 px black top edge.
- **Mark**: two collage registers. A photo becomes a halftone — cell 7, gain 0.8, 45°, all dots
  in one path; skin is cell 4.6, gain 0.74 over a greyscale gradient, with a 7 px
  `#fbf7ea` cut-out border and the features drawn clear on top. Everything else is flat cut
  paper with a 3 px black line.
- **Palette**: paper `#e9dfc4`, red `#c8231c` / `#8f1711`, black `#151311`, cream `#f4ecd6`,
  hair `#e3b03e` / `#a87a1c`, cat `#e2741c`.
- **Motion**: the red wedge stabs the black circle
  (`70·(0.5−0.5cos(2π·1.6t))` along a 0.34 rad axis), a dashed red ring runs
  (`lineDashOffset = −260t`), four radio arcs from the tower expand and fade, and the ground
  slogan stamps letter by letter then waves.
- **Two bugs worth knowing**: geometric Cyrillic glyphs must be filled **per part** — two
  overlapping strokes in one path cancel under nonzero winding and `А` reads as `В`; and a
  breve drawn outside its letter box gets covered by the letter above, so `Й` reads as `И`.
- **Build**: the halftone photo is an SVG `<pattern>`-masked image or a baked PNG; the red
  wedge, ring and arcs are SVG; the slogan is per-letter `<text>` with a stagger.

### `12_bauhaus` — ★★★

- Pure geometric construction, Schlemmer figure joints as discs. Primary palette.
- **Motion**: the pointer arm swings steeply, Mondrian cells recolour, the subject bats a ball.
- **Weakness**: the figure's head drifted off the skeleton position.
- **Signature transition**: red/yellow/blue geometry rotates and scales up.

### `04_roman` — Pompeii mosaic · ★★★

- Tesserae laid along the contour by distance field, mortar as weighted L∞ Voronoi, layout
  computed once and colour flowing per frame.
- **Palette**: the Pompeii set — iron red, ochre, black, cream — with a wave border.
- **Motion**: the border wave travels clockwise; Vesuvius smokes and throws sparks.
- **Signature transition**: tesserae flip over outward from the subject.
- **Build**: bake the tessera layout as one PNG; animate a masked second layer for the wave and
  the flip. Faces lose detail at small tessera sizes — keep the face above 12 px tiles.

### `15_raytrace` — early CGI · ★★

- Uniform plastic shading, per-pixel checker reflection, chrome sphere with an environment map.
- **Motion**: a purple ring rotates, lens flare, the subject's eyes glow green.
- **Weakness**: limbs read as straight columns, the face as a mask. Silhouette first.
- **Signature transition**: green wireframe, then scanlines fill it in.
- **Build**: `repeating-conic-gradient` for chrome, a perspective-transformed checker plane,
  `drop-shadow` for the specular. It is a period joke, so lean into the stiffness.

## Era specimens

Nineteen that are tied to a period or an artist's motif. All are strong in their own scene and
weaker when moved; take the visual language and recompose rather than transplanting the room.
★ rating as above.

| id | Style | Medium and mark | Motif motion | Signature transition | Build here |
| --- | --- | --- | --- | --- | --- |
| `01_cave` | 40,000 BC rock art ★★★ | Half-res fbm relief (`fbm(x·.0022,4)·1 + fbm(x·.011,3)·.16 + noise·.03`) with normals, light `(-.55,-.62,.56)`; base `#ce925a` / `#6e4426` / `#b6643a`; every shape is a fuzz stroke, then an ink stroke with 7 % holes, then flat fill; pigment multiplied into the rock once at the end | Animals alternate two poses to run; firelight flickers; embers | (opening) | `feTurbulence` + `feDiffuseLighting` for the wall, baked once; charcoal texture as a mask, firelight as a breathing orange `screen` layer. Warning from the source: too much mid-frequency relief turns the wall into camouflage |
| `02_egypt` | Tomb painting ★★★ | Profile face with a frontal eye, flat fill and fine outline, 24 hand-written hieroglyphs | Scarab pushes the sun; Aten's hands open and close; glyphs rewrite stroke by stroke | A tapestry strip falls and bounces | Flat SVG + one line weight; the sun disc is a circle on a slow path |
| `03_greek` | Attic black-figure ★★★ | Black silhouette with incised terracotta lines, purple-red band with white dots | Meander band scrolls backwards; boat rises; dolphins leap; lyre sways | A vase rotates to show the next face | `stroke` in clay over black fills; the meander is one `<pattern>` |
| `05_gothic` | Illuminated manuscript ★★★ | Per-pixel gold leaf (brushed, embossed with a 1 px offset highlight), gold-density mask for the shine | Gold catches a diagonal highlight sweep; vines sway; snail crawls; mouse runs | Parchment page turns | Gold as a layered gradient + a mask for the sweep; page turn is a perspective `rotateY` with a shadow |
| `06_renaissance` | Sfumato ★★ | Whole-layer soft blur plus a crisp layer at high opacity; craquelure, canvas weave, yellow varnish | Glider flies past; river light breaks; dust | A shaft of light through a window | One blurred group + one crisp group at 0.6–0.75 alpha; varnish as a multiply gradient |
| `10_nouveau` | Mucha ★★★ | Variable-width path (thick outside, thin inside), offset silhouette behind | Sun rises; halo turns; flowers sway; S-curve steam; waves of hair | An organic gold-edged shape grows | Vary `stroke-width` per segment or use two offset paths; halo is a `rotate` on a dashed ring |
| `18_klimt` | Gold period, 1907 ★★★ | Gold leaf `[120,78,18]→[196,148,52]→[246,216,128]` with 96 px seams; 150 motifs: concentric circles 30 % (red-white-blue, blue-gold-red, purple-white-gold), gold spirals on dark brown 32 % (`±3 rad/s`), eye motifs 22 % (blink when `sin(2.2t+φ)>.86`), white dot clusters 16 %; hem of 60 black-and-white rectangles; face and hands modelled with a radial `#fbe8da→#f0cfb8→#d8a88c→#b88068` and only a 1.2 px outline | Eye motifs blink in turn; gold dust floats | Gold spirals outward from the head | Decorative planes flat, face modelled: that contrast *is* Klimt. Light streak 520 px wide at `α .24`, skewed, one pass in 1.15 s. The source's fix for static frames: 34 gold flakes falling at 150 px/s, dust rising at 26 px/s, flower nods at 0.35 r |
| `19_munch` | Expressionism ★★ | Long curved strokes followed 20–30 steps down a flow field, plus a whole-frame per-row sine warp | The whole picture writhes; blood-red sky streams | A band of scream colour presses down | The warp is the trick: `feDisplacementMap` with an animated scale, or a per-row `translateX` (cheap, and it reads) |
| `20_dunhuang` | Dunhuang mural ★★ | Earth-red ground, mineral colours, flaking patches only in the background, desaturated | Flying apsaras' ribbons; ceiling flowers; lamp flames | A ribbon sweeps across; old paint flakes off | Flaking as a mask that only ever grows; ribbons as long tapered paths |
| `21_kusama` | Polka dots ★★★ | Hand-drawn irregular circles on a hexagonal grid indexed modulo a true period | Dots inflate and deflate in rings from the subject; pumpkins; infinity room | Dots grow out to clip in the next image | One `<pattern>` of irregular circles; the wave is a radial mask scale |
| `23_dali` | Surrealism ★★ | Soft-melting clocks, long shadows as sheared affine | Clocks drip; long-legged elephant walks; ants circle a watch; shadows lengthen | New image drips in with a rounded head | Clock face is a shape with a `d` morph or a `scaleY` on a clipped group; the drip is a `border-radius` blob |
| `24_hopper` | American realism, 1942 ★★★ | Two paints of the same geometry: shadow version (`#5d8679` wall, `#5b3d2b` floor) and lit version (`#efcf8f`, `#c98b52`); the light shape clips the lit version in, so every shadow edge is hard and the whole patch can translate. Shadow on the wall is the figure's silhouette offset `(+150,+18)`, masked into the shadow paint | The light patch moves 95 px over 1.25 s and sweeps the face from half-shadow to full; dust motes only inside the beam | A hard-edged sunbeam sweeps across | This is the most directly transferable card: paint two layers, `mask` one. Palette lit `#efcf8f` / `#d8ad68` / `#c98b52`, shadow `#5d8679` / `#4b6d63` / `#5b3d2b`, dress `#cc4a3c` vs `#7a2c2a`, hair `#f3d67e` vs `#a8893f`, brick `#b4553a` |
| `27_kirby` | Marvel cosmic ★★ | Four-colour dots, misregistered plates, black shadow with hatched feathering, krackle energy dots | Onomatopoeia, panel close-ups, krackle | (opening of its film) | Treat it as `13_pop` with heavier black and dot misregistration; the card itself says it reads more Lichtenstein than Kirby |
| `28_monet` | Water lilies ★★ | Short strokes for water reflections, light trembling on the surface | Lilies drift, willow shadows sway, ripples spread | The water ripples open | Strokes baked, ripples as expanding rings at `screen`; the card's own bug is a spatial one — wall read as pond and floor as wood, so settle the room's geometry first |
| `31_haring` | ★★★ | Thick even black line, radiating action lines | Figures hard-cut through 8 poses at 8 fps, everything bounces to the beat | A dancing figure scales up and the next image is inside it | Eight poses as eight groups, swapped on a stepped ease; the beat is the timeline |
| `33_rubberhose` | 1930 cartoon ★★★ | Pie-cut eyes, noodle arms, white gloves, 12 fps, film scratches and flicker | Everything bounces on the beat | (an old reel before the main film) | Noodle limbs as quadratic paths re-tweened per pose; scratches as a stepped overlay. Half the motion in the source is film noise — do not rely on it for liveness |
| `34_shadowpuppet` | Chinese shadow puppet ★★★ | Translucent hide with cut-out holes, riveted joints, 10 fps, oil lamp behind | Rods drive stiff joints; the wrist snaps | The lamp is lit behind the screen | Joints as pivot groups with a `steps(10)` ease; hide as a warm translucent fill at `screen`. The card's bug: overlapping translucent parts multiply to near-black — keep overlaps under three layers |
| `36_picasso_blue` | Blue period ★★ | Monochrome blue, broad strokes, Prussian-blue contour, elongated bodies | Slow breathing | Colour drains to blue, then a wide brush passes | One hue family at 5–6 values, one wide contour; the breathing is a 6 s `scale` on the body group. The card's own weakness: not melancholy enough — the value range is too wide |
| `37_rick_morty` | ★★ | Rounded dark-grey thin outline, flat fill, mottled background | Cup, blink, gaze, tail | (per story) | Plain SVG + `stroke-linejoin: round`; the card notes it has no walk rig, so keep the character seated or cut between poses |

## The character rule

The most common defect across all 36 cards, stated in the source's own summary: the background
passes through the style's renderer and the character does not, so the character looks pasted
on. Six cards name it outright — Rembrandt, Picasso blue, ink, Ghibli, Dalí, Kirby.

Before you deliver a styled film, put the subject through the same five decisions: the same
mark (a brush stroke, a 5 px outline, a 1 px sprite edge), the same light (the same two values
as the ground, or the same modelled pass), the same palette ratio. The Ghibli card's masking
trick and Hopper's two-paint trick are the two cheapest ways to do it.

## Checking a styled shot

The gate (`scripts/gate.mjs`) measures the whole film; these are the questions it cannot see,
one per style decision:

- **Ground**: does the ground have a material, or is it a flat colour with a texture laid on?
  Cover the subject — is there still a surface?
- **Mark**: is the line one line? Mixed line weights, or an outline that stops at a joint, read
  as clip art.
- **Light**: one direction, one temperature, and the contact shadows agree with it.
- **Palette**: count the hues. Past five, the style has dissolved. Are the two or three
  semantic colours the ones the narration needs?
- **Motion**: at what frame rate do the marks move, and is it the rate the card names?
- **Default test**: cover the subject and the type. Could this frame belong to any film? If
  yes, the style is a filter, not a medium.
