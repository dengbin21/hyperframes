# Motion languages

A **language** is how things move and what that movement says. It is a different question from the
format (how long, what shape, `types/`) and from the look (ground, type, material, `look.md`): the
same look in two languages is two different films.

Pick the language from the message's shape (`story.md` §3) and
the brand's personality, then take the parameters — tempo, easing family, palette energy, type
contrast, how much is on screen — from the personality sentence. `techniques.md` is the vocabulary
inside a language; `rhythm.md` is the film's shape over time.

| id | Says | Best for | Start from |
| --- | --- | --- | --- |
| `cursor-demo` | it works; here's how | features, workflows, SaaS, AI apps | a captured screen, one verb per step |
| `continuous-morph` | one crafted system | consumer apps, one UI feature, a sting, a loop | one hero element that never leaves |
| `card-montage` | step by step, finished and real | small-team product promos, consumer apps | one headline beside one acting card |
| `kinetic-type` | a claim with conviction | slogans, lists, hooks, endings | the words, set large |
| `modular-grid` | precise, engineered | dev tools, infra, fintech, specs | a grid and one travelling accent |
| `data-story` | here's the evidence | metrics, reports, milestones | the question, then one chart |
| `mechanism` | why it works | AI/ML, algorithms, science | the same objects transforming |
| `system-diagram` | how the parts connect | infra, agents, pipelines, security | a fixed layout, flow on the paths |
| `flat-world` | wonder, scale | science, health, education | one illustrated world, camera travelling scales |
| `editorial-collage` | it's real; look at this line | news, commentary, case studies, history | real documents on a lit surface |
| `hand-drawn` | human, thinking aloud | teaching, friendly brands, annotation | a pen that draws as it is named |
| `character` | emotion, personality | stories, consumer, agents as actors | one rig and a small set of poses |
| `3d-object` | tangible, premium | hardware, logos, devices, spatial data | one hero object in a lit studio |
| `generative-field` | intelligence, mood | model launches, music, loops | one rule that evolves with time |
| `liquid-glass` | premium consumer | iOS apps, photo and media apps | glass over real photography |
| `photo-led` | the real world | travel, food, fashion, ads | strong graded photography in shaped masks |
| `showreel` | range and mastery | capability showcases, "made with X" | 5–8 sections on one spine |
| `retro-digital` | culture, edge | dev culture, games, CLI tools | a seasoning on another language, rarely the whole film |
| `art-styles` | culture, delight | a showcase, the unexpected direction | `art-styles.md` |
| `talking-head` | a real person behind it | founders, creators | `captions.md` + `overlays.md` |

Two languages in one film when the switch means something (a character opens on the problem, cursor
demo carries the product, kinetic type closes on the claim). Carry a spine across the switch —
palette, a shape, the cursor. Three in 30 s is the most that still reads as one film.

## The twenty, in five lines each

Each entry: what it says · use when · the signature that makes it read as itself · the parameter that
decides its feel · what breaks it. HyperFrames mechanism where it differs from a generic DOM build.

### `cursor-demo`

- **Says** it exists, it works, this is exactly how you use it; credibility comes from real UI and a
  visible cause → effect.
- **Use for** a workflow or a feature the audience will actually use, with a UI worth seeing; not for
  a model or an API with no interface (`mechanism`), nor generic CRUD (`data-story` for one number).
- **Signature** rebuilt UI crisp at 3× zoom with real copy and labels; a cursor that decelerates into
  targets, grows on hover (×1.3–1.55), shrinks 10–15% on press, leaves a ripple; the click and the
  state change share a frame; a camera that pushes to the work area per step, out to re-establish.
- **Parameter** camera discipline — one eased move per step, cursor scales with the camera. Variants
  that worked: two cursors (you and the agent), the mascot as cursor, opening on a typed prompt, a
  nested reveal that starts on the result.
- **Breaks when** the UI is a mockup (`types/launch.md`), or nothing is readable after the push
  (text under 26 px at 1080p).

### `continuous-morph`

- **Says** one coherent, crafted system; everything flows from one idea. Reads as keynotecraft and
  rewards rewatching.
- **Use for** a consumer or design-led product with many small features that should feel unified, a
  sting or loop; not when dense real UI must be read, nor when the story needs real-world settings.
- **Signature** one hero shape whose box (x, y, w, h, radius, fill) interpolates between states, its
  content swapping inside with its own short mask; shared-element hand-offs (a send button grows into
  the next object, a flood contracts into the next shape); a cursor causing every change; last frame
  equals first.
- **Parameter** the state table: `[{ at, w, h, r, fill, content }]`, one pure function of `t`. Floods
  run ≈0.35 s from the source's centre past the farthest corner.
- **Breaks when** the shape teleports (a state change with no visible path), text overlaps mid-morph
  (contents not masked separately), or every state has the same timing.

### `card-montage`

- **Says** here is what it does, step by step, and it is finished and real. Calmer to read than a
  morph, more designed than a recording.
- **Use for** a consumer or prosumer app with 3–6 clear steps, a small team pointing at a landing
  page; not when the product has one big idea, nor when the UI is the spectacle.
- **Signature** a split layout, 2–5 words of headline beside one UI card or phone; each card does one
  visible thing while on screen (a field fills, a file lands, a ring counts to 100%); a step system
  (`3/6`, a three-part bar) that gives the cuts a reason; a completion moment before the mark.
- **Parameter** one frame per screen with a 1–2% drift, 1.5–3 s per screen; headline lands first, the
  card's action on the next beat.
- **Breaks when** a card only fades in (that is a slide), the layout changes every screen, or the
  headline repeats what the card already shows — the line gives the reason, the card the proof.

### `kinetic-type`

- **Says** a claim with conviction; a rhythm you can feel. The fastest way to make a line memorable
  and the easiest to read muted in a feed.
- **Use for** a claim, a list, a slogan, one number, a social hook, another film's ending; not when
  the viewer must understand how something works.
- **Signature** one idea per beat or two; scale contrast (a 300–400 px word against 28–40 px labels);
  a heavy grotesk or condensed display face plus an italic serif or mono for contrast; pill
  highlights, words swapped inside a sentence, type as a container for images; colour fields
  switching on the cut; punctuation as a character.
- **Parameter** the entrance (`motion.md` "Titles"): per word, per letter, blur-in, grey-to-ink —
  vary it, never the same one for every line. Punctuation rule: full stops on every line or none,
  picked once.
- **Breaks when** type keeps drifting after it lands, or every line enters the same way. Type here is
  not a caption: do not run it at caption size (`captions.md` is for speech).

### `modular-grid`

- **Says** precise, engineered, rational, scales. Order is the message.
- **Use for** technical brands, lists and specifications, abstract ideas (sync, deploy, scale), a
  landing-hero loop; not when warmth or a human story carries the message.
- **Signature** an 8- or 12-column grid that stays visible or implied, everything snapped to it;
  modules that flip, rotate in 90° steps, fill, invert, and stagger across it in waves; monospace
  labels and indices (`01 — DEPLOY`), tabular numbers; two or three flat colours with one accent
  travelling through the grid like a signal; patterns that propagate from a corner.
- **Parameter** decisive easing (`power4.inOut`, `expo.out`, even linear for conveyor motion), no
  bounce; events on eighths; every pattern from one seeded hash so preview and render agree.
- **Breaks when** anything sits off-grid, corner radii mix, a decorative gradient appears, or the
  easing wobbles.

### `data-story`

- **Says** here is the evidence, it changed, this is the turning point.
- **Use for** a number, a trend, a comparison, a result; never invented data, and never a whole chart
  for one lone number (`kinetic-type`).
- **Signature** the question first and the chart second; the line draws then the point lands with a
  label and a hit; count-ups land on the exact value; chart morphs keep each datum's identity;
  highlight by dimming the rest to 20–30% instead of adding arrows; a source line on screen.
- **Parameter** draw at a steady rate (`power1.inOut`), land points on a small spring; at least 2 s of
  readable hold after a chart completes. `types/data.md` owns the honesty rules.
- **Breaks when** a bar grows from the axis minimum, several numbers count up at once, or the axis
  misstates its range.

### `mechanism`

- **Says** this is why it works, and you can see it for yourself.
- **Use for** AI/ML, algorithms, science, a mechanism under the hood; not for a launch with nothing to
  explain, or a hype cut.
- **Signature** objects that transform rather than being replaced (transform-matching-shapes
  thinking); colour carries identity, so the same quantity keeps its colour through every step; one
  new idea per sentence of narration, the picture changing when the sentence does; a final frame that
  shows the whole mechanism at once.
- **Parameter** slow and deliberate: `power2.inOut`, 0.8–1.5 s per transformation, holds while the
  voice explains. The camera moves only to follow the object in focus.
- **Breaks when** a cut replaces the object instead of transforming it (that is `whiteboard-build` in
  `explainer-grammars.md`), or a colour means two things.

### `system-diagram`

- **Says** this is how the pieces connect and what flows between them.
- **Use for** infra, APIs, agents, B2B platforms, security, any multi-step process; not when consumer
  emotion is the goal.
- **Signature** a fixed layout of components that stays put while the flow moves; packets travelling
  along paths at a consistent speed per channel, colour = data type; components lighting up on
  receipt; an isometric 30° projection for infra, flat 2D for clarity; a step index and one-line
  captions.
- **Parameter** packets move linearly (a constant rate means data), components react on a spring; the
  camera pushes to the active component and pulls out to the whole system at the end.
- **Breaks when** the furniture moves instead of the flow, or a packet changes speed without a reason.

### `flat-world`

- **Says** wonder; here is what is inside; how big or small this is.
- **Use for** science, health, education, "what is inside X", calm narrated explainers with warmth;
  not when a real product must be seen as it is.
- **Signature** flat shapes with one soft gradient and a rim light, thick rounded forms, a limited
  saturated palette; scale travel (push through one object into the next level); small characters as
  scale references and emotion; constant gentle secondary motion under clear primary actions.
- **Parameter** `sine.inOut` drifts and deep push-throughs; the world is one container and the camera
  is a wrapper over it, so a 60× scale crossing never blurs one element.
- **Breaks when** the background is a flat colour for the whole shot — the world must read as a world.

### `editorial-collage`

- **Says** this is real; look at this line; here is the argument. Journalistic authority.
- **Use for** commentary, news, case studies, history, "here is what they said"; never without real
  material — it becomes fake evidence.
- **Signature** real sources as physical objects on a surface (paper texture, drop shadow, slight
  rotation, torn edges); a highlighter stroke or circle that draws on as the voice says it; a push to
  the exact line while everything else dims; halftone, engraving or riso texture; serif display plus
  typewriter or grotesk.
- **Parameter** a hand-held micro drift; new paper slides in on `power3.out` with a 2–4° settle; 0.5–1.5 s
  per item for an ad, slower for an explainer; elements step at 12 fps so they land like a hand.
- **Breaks when** annotated regions were not measured from the real frame — a circle that misses its
  line by 20 px destroys the authority the language exists for.

### `hand-drawn`

- **Says** human, approachable, honest, thinking out loud. In an AI context the hand is the
  differentiator.
- **Use for** teaching, reasoning step by step, friendly brands, annotation over real UI, small
  announcements that want warmth; not where precision and polish are the brand.
- **Signature** strokes that draw on at the pen's speed (accelerating into curves, slowing at
  corners); boiling lines that jitter every 2–3 frames from a seeded hash so a held drawing stays
  alive; paper or riso grain with one or two ink colours; writing that appears as it is said.
- **Parameter** a locked camera or slow pans over an oversize board; on a whiteboard the camera motion
  is the transition, so the board never cuts (`explainer-grammars.md`, `whiteboard-build`).
- **Breaks when** the whole diagram appears at once, or the boil runs at 8 fps across the full screen
  — that reads as the picture flickering, not as a hand.

### `character`

- **Says** emotion, humour, personality; this product has a heart.
- **Use for** stories, consumer and kids' products, brand personality, agents as characters, social
  content; not when facts must land fast.
- **Signature** a clear silhouette and a small set of expressions (eyes do most of the acting); the
  twelve principles visibly (anticipation, squash and stretch, overlap, follow-through, arcs); a
  simple world with props that matter; beats with a turn and a payoff.
- **Parameter** staging — wide to establish, medium for action, close for reaction — and holds after
  punchlines. `types/character.md` has the rig.
- **Breaks when** every part moves at once on one curve by the same amount. In Oct 2026 launch films
  animated characters were absent; the stories there were told by real people.

### `3d-object`

- **Says** tangible, premium, real, crafted. Depth gives value.
- **Use for** hardware, physical products, logos and numerals as monuments, spatial data, premium
  launches; not when the message lives in UI text.
- **Signature** one hero object under soft studio light (key, rim, bounce) with contact shadows and
  real materials; a camera on arcs; assembly, explode and rotate to reveal facets; matte, paper-model
  or clay looks that avoid uncanny realism; a flat → 3D transition where a 2D map, logo or chart
  extrudes into space.
- **Parameter** `power2.inOut` orbits of 2–4 s, quick snaps on beats, depth of field to guide focus.
  `types/3d.md` has the light, the space and the traps.
- **Breaks when** the product UI is tilted into 3D, or a frame's middle is the dark back of a slab
  (that reads as a black flash).

### `generative-field`

- **Says** intelligence, emergence, scale, mood. Feeling over facts.
- **Use for** model launches, music, mood pieces, backgrounds and loops, a logo forming from
  particles; never as a substitute for showing the product, and it is the AI-launch cliché without a
  specific idea (blue particles forming a brain).
- **Signature** one rule that generates the image and evolves with time; particles forming a
  meaningful shape (the logo, a number, a word) and dissolving; a restrained palette of one hue
  family plus white; additive blending only where light is the point; determinism everywhere.
- **Parameter** slow drifts and dollies; formations land on the beat with `expo.inOut`; positions are
  a pure function of `(seed, t)`, never accumulated state (`runtimes.md`, `types/3d.md`).
- **Breaks when** the field is drawn from `Math.random` per frame — it will differ between renders and
  fail the contract.

### `liquid-glass`

- **Says** premium, modern, delightful consumer product.
- **Use for** consumer apps on Apple platforms, photo and media apps, lifestyle products; not for
  developer tools or anything needing flat clarity.
- **Signature** glass elements refracting what is behind them, chromatic edges, a rim light; liquid
  morphs (a word melts into a droplet that stretches into a toolbar); real photography behind the
  glass; springs with slight overshoot, everything touchable.
- **Parameter** per-element clone of the background displaced with `feDisplacementMap` at three
  scales; keep the number of glass elements small because the filters are expensive.
- **Breaks when** glass sits over flat colour (nothing to refract), blur is used as fake glass, or
  glass is stacked over bright footage without a scrim (`overlays.md`).

### `photo-led`

- **Says** the real world; the life this product lives in.
- **Use for** travel, food, fashion, photo apps, ads with user content; never without rights-cleared
  images.
- **Signature** strong consistent photography, graded alike; image transitions that are shapes
  (iris, a mask opening from a line, a rectangle morph, a tile reflow); graphics painted over images
  in one accent; fast pacing for ads with a long hold on the hero image.
- **Parameter** `object-fit: cover` inside shaped masks; footage re-encoded all-intra (`-g 1`) so
  seek is frame-accurate; HDR converted to SDR first (`film.md`).
- **Breaks when** grading is mismatched, Ken Burns runs on everything, or text sits over a busy area
  with no scrim.

### `showreel`

- **Says** range and mastery; also, this tool can do all of this.
- **Use for** capability showcases, portfolio pieces, "made with X" launches; not when a product needs
  one clear message — a reel is about the maker, not the user.
- **Signature** a spine visible in every section (palette, HUD chrome, a recurring shape, one track);
  5–8 sections with one technique each; transitions that carry a shape from one section into the
  next; meta content (animation about animation); the maker's mark at the end.
- **Parameter** one track and one tempo for the whole reel; the section boundaries are the bars.
  `techniques.md` "Finishing" lists the genre's conventions — use them knowingly, they are clichés.
- **Breaks when** the sections share nothing, so the reel reads as eight unrelated films.

### `retro-digital`

- **Says** culture, edge. Mostly a seasoning, not a whole film.
- **Use for** dev culture, games, CLI tools — as a treatment on `kinetic-type` or `showreel`; not as
  the language of a premium launch.
- **Signature** pixel grids with integer scaling, CRT scanlines and a slight chromatic offset, a
  terminal's phosphor palette, dithering instead of gradients, 8-bit type set as pixels.
- **Parameter** integer pixel scale (2×, 3×, never 1.7×), stepped motion at 12–15 fps against a 30 fps
  timeline, sound design with bit-crushed ticks.
- **Breaks when** the pixel grid is scaled non-integer (everything shimmers), or the retro look is
  laid over modern rounded UI.

### `art-styles`

- **Says** culture, delight, a point of view the film could only have here.
- **Use for** a showcase, the unexpected direction, a fable or a period piece; not when the brand's
  own material must lead.
- **Signature** a style is a material system, not a filter: `art-styles.md` gives 36 of them as five
  decisions (ground, mark, light, palette, motion) with the numbers.
- **Parameter** the two rules that apply to every film: the ground comes from a medium rather than an
  effect, and the subject goes through the same mark, light and palette ratio as the ground.
- **Breaks when** a modern flat-vector drawing gets a noise layer and is called a style — the most
  common failure in the source's own 17 rebuilt demos.

### `talking-head`

- **Says** a real person behind it. Trust.
- **Use for** founders, creators, a narrated launch; the person's own footage plays as it is.
- **Signature** the speaker carries the film; cards, lower thirds and split layouts sit over the
  footage; captions at 2–6 words a group; the face is never under a card.
- **Parameter** `overlays.md` has the rectangles for 1920×1080 and 1080×1920; `captions.md` has the
  group sizes, the fit function and the text-behind-the-speaker stack.
- **Breaks when** the layout covers the speaker, or a card sits static for more than about 8 s.

## Choosing: message shape × personality

Rows are the message's shape, columns the dominant personality (`story.md`). The first entry in a cell
is the fit; the rest are amplify or unexpected options.

| | Precise / technical | Calm / premium | Playful / energetic | Human / warm |
| --- | --- | --- | --- | --- |
| **Claim** | `kinetic-type` · `modular-grid` · `system-diagram` ident | `3d-object` · `generative-field` · `photo-led` | `kinetic-type` (slams) · `showreel` · `retro-digital` | `hand-drawn` · `kinetic-type` · `character` |
| **Workflow** | `cursor-demo` · `system-diagram` · `continuous-morph` | `cursor-demo` · `continuous-morph` · `card-montage` | `continuous-morph` · `cursor-demo` · `card-montage` | `cursor-demo` · `talking-head` · `hand-drawn` |
| **Mechanism** | `mechanism` · `system-diagram` · `modular-grid` | `mechanism` · `3d-object` · `flat-world` | `flat-world` · `character` · `art-styles` | `hand-drawn` · `flat-world` · `character` |
| **Evidence** | `data-story` · `modular-grid` · `kinetic-type` | `data-story` · `editorial-collage` · `3d-object` | `data-story` (bold) · `kinetic-type` | `data-story` · `editorial-collage` · `talking-head` |
| **List** | `modular-grid` · `kinetic-type` · `continuous-morph` | `card-montage` · `continuous-morph` · `kinetic-type` | `continuous-morph` · `card-montage` · `3d-object` | `card-montage` · `hand-drawn` · `character` |
| **Transformation** | `continuous-morph` · `data-story` | `continuous-morph` · `photo-led` | `continuous-morph` · `character` | `photo-led` · `hand-drawn` |
| **Story** | `system-diagram` (agent as packet) · `talking-head` | `photo-led` · `talking-head` · `flat-world` | `character` · `art-styles` · `photo-led` | `talking-head` · `photo-led` · `character` |
| **Showcase** | one deep artifact (`mechanism`, `3d-object`) · `showreel` | one deep artifact · `3d-object` · `showreel` (restrained) | `showreel` · `art-styles` · `retro-digital` | `art-styles` · `character` · the product demoing itself |

What the measured films say about this table: every launch "story" was told by real people, none by
an animated character; "showcase" launches were one deeply made artifact (a working simulation, a
drawing of an epicycle), not reels; a calm premium claim moved an object or a field, not the words.

## The house look is not a language

Many top AI-made films of Sep–Oct 2026 look alike: a warm off-white or near-black ground, an
orange-red or lime accent, a giant grotesk with mono labels, one-second modules, a dot that opens the
film. The languages above come from those films; the pattern is the problem, not the names in it.

After choosing a language, say in one line how this film's look differs from that pattern, or that
the brand really looks like that. The look comes from the product (`look.md` "Colour"); the language
comes from here.
