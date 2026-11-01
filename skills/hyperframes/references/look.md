# The look

Left alone, the same brief comes out with the same look run after run, and banning that look only moves it to the next default. Outside input breaks it, in this order: the project's design spec, a real brand, a reference image or film the person gave you, the subject's own world. Settle it before the first scene, as numbers in the LOOK line (below).

## The project's design spec

Read the first of `frame.md`, `design.md`, `DESIGN.md` at the project root that exists; ignore the rest.

- **Frontmatter is normative**: `colors`, `typography`, `spacing`, `components`. Quote hex values, families and weights exactly; never round or invent them.
- **The prose is intent**: what the look is for, Do's and Don'ts. Follow it for judgment, not values.
- **Brand, not layout**: hex, fonts, weight relationships and Do's and Don'ts are strict; type sizes, spacing, border weight and decoration are yours to scale for video. A 1px border or a 6% shadow from a web page vanishes on screen.

## From a brand

- A website: `npx hyperframes capture <url> --json` writes screenshots, the copy (`extracted/visible-text.txt`), images, logos, `extracted/tokens.json` (colours, fonts) and `extracted/design-styles.json` under its output folder. Look at the screenshots before choosing anything. A capture that exits non-zero, prints `ok: false` or writes `BLOCKED.md` failed: take no brand data from its partial files.
- Figma: `npx hyperframes figma tokens <fileKey>` (`/figma`).
- Images the person attached: take palette and type from what you see.

Use the brand's own fonts when the capture shipped their files or they are bundled (`format.md`); otherwise download the family's `.woff2` into `assets/fonts/` with an `@font-face`, or pick the closest bundled family and say so.

## From a reference

A reference film or image gives its grammar, never its content: shot lengths, how titles enter and leave, the transitions, the palette roles, the type's scale and weight. Snapshot it next to yours (`snapshot --at <t,…> --against ref.mp4`) and write the grammar down, marking what you measured apart from what you guessed.

## Presets

The presets are slide-deck looks: use one when the person names it, or for a deck (`/slideshow`), never as the fallback for a film without a brand. Each folder in `../assets/frame-presets/` holds a `FRAME.md` spec, a `caption-skin.html` and a `frame-showcase.html` contact sheet. To use one, copy its `FRAME.md` to the project root as `frame.md`, then read it as above; its fonts that aren't bundled need `@font-face` files. The two HTML files are reference code: read them for treatments, never mount them.

| Preset              | Look                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `biennale-yellow`   | Museum catalogue: parchment, deep indigo ink, solar-yellow blooms, Instrument Serif, hairlines |
| `blockframe`        | Loud neobrutalist: 4px black borders, hard shadows, candy pastels, Inter 900 caps              |
| `blue-professional` | Consulting restraint: cream canvas, one cobalt accent, Space Grotesk + Inter, tinted cards     |
| `bold-poster`       | Vintage editorial poster: Shrikhand tilted display, Baskerville, tomato red, double borders    |
| `broadside`         | Protest poster: ink-black and fire-orange planes, giant lowercase Barlow 900, mono chrome      |
| `capsule`           | Friendly editorial: every container a pill, cream, nine candy accents, Bodoni Moda             |
| `cartesian`         | Quiet catalogue: warm-stone palette, Playfair + Inter, taupe hairline grid, compass rings      |
| `cobalt-grid`       | Two-colour risograph: cream paper, cobalt ink, graph-paper grid, Newsreader serif              |
| `code-editorial`    | Developer brand book: warm paper, scarce terracotta, EB Garamond, navy code surface            |
| `coral`             | Bold magazine: coral, ink and cream planes at hard edges, Bebas Neue, giant numerals           |
| `creative-mode`     | Sparse neobrutalist: cream, 4px ink borders, Archivo Black caps, rationed accents              |
| `daisy-days`        | Picture book: charcoal outlines, sunny pastels, Fredoka One, hand-drawn ornaments              |
| `editorial-forest`  | Literary: green, pink and cream, Source Serif display, mono chrome, flat paper                 |

## From an art history

A fable, a period piece, a tribute or a style survey takes its look from a movement rather than
from a brand: `art-styles.md` holds 36 of them as five decisions each — ground, mark, light,
palette, motion — with the numbers, the signature transition and the defect each source build
had. Read that file before choosing; a style is a material system, not a filter.

Two rules from it apply to every film, not only the styled ones: the ground must come from a
medium rather than from an effect, and the subject must go through the same mark, light and
palette ratio as the ground, or it reads as a sticker.

## Colour

Colour is the first thing a viewer judges and the fastest way for a film to look like every other
generated one. Nobody good at this picks colours; they find them, then build a system around them.

### Find them, then choose

Work down this list and write where each colour came from:

1. **The brand's own values.** Read them, never eyeball them: the site's CSS custom properties and
   `theme-color`, the most frequent hex values in its stylesheet, the logo file, the app icon.
   `npx hyperframes capture` puts them in `extracted/tokens.json`. A hex with a source beats any
   adjective.
2. **The product itself.** Its interface (sample the pixels of real screenshots), its hardware
   finish, the things it makes. A palette that frames a UI starts from that UI's own neutrals, so
   the interface sits inside the film instead of on top of it.
3. **The world of the idea.** The material the promise lives in, sampled from a real reference:
   specimen paper, wet clay, anodised metal, a terminal's phosphor. Sample the photograph; do not
   turn an adjective into a hex.
4. **Invention, last**, marked "invented: no brand colours found".

An open-source project with only a README still has colours to find: its badges, the outputs it
produces, the tools it lives in, the repository's social image.

### A system, not a pick

| Role | Job | Share of the frame |
| --- | --- | --- |
| ground | the world the film happens in | most of it |
| surface | panels and cards, one or two steps off the ground | about a fifth |
| ink, muted ink | type and lines | small |
| accent | one meaning only: the new thing, the action, the result | a few per cent |
| flood (optional) | the accent or a second hue filling the screen | a moment, once or twice |

What separates a designed palette from a generated one:

- **Value first.** The frame reads in greyscale; hierarchy comes from lightness, colour adds meaning.
  Desaturate a still — if the subject disappears, the palette is doing composition's work.
- **Neutrals with a small deliberate bias.** Measured films tinted their greys a whisper cool or
  warm (a/b within ±3). An unexamined warm brown-black or cream reads as generated.
- **Few hue families.** One family plus neutrals, or two in a chosen relationship (complementary for
  tension, analogous for calm). Three saturated hues of equal weight look cheap.
- **Saturation has one home.** Either a neutral world with one saturated accent, or a saturated field
  behind a neutral subject. Medium saturation everywhere is the mud between the two.
- **Light is part of the colour.** A ground is lit: a falloff, a vignette, grain, a screen's glow, all
  in the same hue. A flat hex fill reads as a slide.
- **Type is neutral.** In 18 of 18 measured films with type it was neutral white or black, often on a
  neutral field; bone and cream type was not an industry default. Small text needs 4.5:1 against its
  ground.
- **Content brings its own colour.** Screenshots and footage already have it; keep the designed
  palette quieter than the content it frames.
- **The accent is scarce so it means something.** On every element it marks nothing; flooding the
  screen is an event, placed on a beat.

### Six roles as a starting set

Pick a name, or take the values and move them. Every set is six keys: `bg` ground, `surface`
card/paper/panel, `ink` primary type, `sub` secondary type and hairlines, `accent` the one meaning,
`accent2` the second. Use only these across the film — lighter, darker and transparent are fine; a
new hue is not.

| Name | Fits | bg | surface | ink | sub | accent | accent2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `paper` | humanities, history, reading, explaining an idea | #F3EDE2 | #FBF8F2 | #1B1A17 | #6B655B | #C8402F | #2F5D62 |
| `poster` | an opinion, a conflict, a claim | #FFD23F | #FFF6D6 | #111111 | #4A4433 | #FF5A36 | #14213D |
| `ink` | tech, night, a serious subject | #121417 | #1E2226 | #F2EFE8 | #A39E93 | #F2B33D | #5FB3A1 |
| `navy` | product, data, phones and devices (flat, never a gradient) | #0D1B2A | #16293D | #EEF3F6 | #8FA3B3 | #5CC8E0 | #F2A93B |
| `bauhaus` | design, structure, geometry, process | #EFE9DD | #FFFFFF | #111111 | #555555 | #D62828 | #1D4E89 |
| `snow` | winter, medical, clean, a lab | #E9EEF0 | #FFFFFF | #1F2A30 | #5E6B72 | #D9482B | #3E7C8C |
| `wood` | life, food, handwork, home | #EDE3D1 | #F7F1E6 | #2B2622 | #7A6E62 | #C4552D | #3F5B4B |
| `chalk` | a classroom, a derivation, a formula | #23302B | #2E3D37 | #F1EFE6 | #A9B3AA | #F4D35E | #E87D5A |

Building your own: three to six values, one ground, one surface, one ink, one sub, one or two
accents; settle light ground or dark ground first and never switch mid-film; no gradient ground and
no neon outer glow — depth comes from paper grain, a two-tone flat, or a shadow.

Two bans with teeth. **Hue 225°–300° at saturation ≥ 0.30 is the zone generated design lands on**:
blue-purple gradient grounds, deep purple starfields, neon cyan-purple glows, purple frosted glass.
`gate.mjs` measures it (a frame more than 30% in that zone), so a palette built there fails the
delivery gate. A flat navy at hue ≈210° is not in the zone — a deliberate single ground, not a glow —
which is why `navy` above is usable. When the subject itself is that colour (a cyberpunk purple the
person asked for, a *Starry Night* style scene), pass `--allow-blue-purple "<reason>"` and put the
reason in `REVIEW.md`.

### The house look, as patterns

These make a film interchangeable. Avoid them in invented palettes; when the brand's own values are
one of them, use them and say so:

- dark ground, one warm accent (terracotta, amber, vermilion, orange), bone or cream type, often a
  serif display;
- warm off-white or cream ground, a serif or giant grotesk, an orange-red accent;
- near-black with an acid lime or green;
- a purple-to-blue gradient; neon on a GitHub-dark ground;
- the same "neutral plus one accent" strategy in every direction.

Changing the hex while keeping the pattern does not count. Six near-black frames with one warm
accent from three independent agents, for three different products, is what no method produces.

### What 21 launch films did (measured, 2026-10)

- **Colours were found, not invented**, in 19: brand values, the product's finish or interface, the
  light of the footage. Designed from nothing: 2.
- **Ground follows the content.** 10 mostly dark, 8 mostly light, 2 mixed; hardware leaned dark (6 of
  9), software leaned light (5 of 10). "Tech needs black" did not hold.
- **The accent was scarce.** In 12 films no frame had more than 5% strongly saturated pixels; the
  designed accents sat on the point being operated, about 1% of the frame.
- **Floods were rhythm.** Full-screen colour appeared in 4 films, all energetic ones.
- **The two house patterns appeared in 0 of 21.** Where warmth appeared on dark it came from the
  product's finish, a beam of light, or the footage.

Colour over time belongs in the rhythm sheet (`rhythm.md` §7): a ground flip at the stop, a flood on
the drop, fields switching through a burst, the brand's ground again at the mark.

## The LOOK line

With no design spec, the look is the LOOK line of `SPEC.md` (`spec.md`), taken from the brand, the reference or the subject itself: its era, its materials, where it would be shown. Every part is a number (hex, px, %, a named face and weight), the ground and the hero come from a medium rather than from effects, and the BANNED line keeps it off the defaults. Inter, Space Grotesk, Instrument Serif, Geist and JetBrains Mono are where generated design lands; use them when the brand does, not by default. Copy the palette and the faces into the root variables below.

## Video facts

- Full-screen linear gradients on dark grounds band under H.264; use a radial gradient, a solid fill or a solid plus a local glow.
- An accent at 5% opacity disappears in compression: 15–25% for atmosphere, full saturation for the focal element.
- **A stroke has to survive the deliverable's size, not the design canvas.** A 1.3 px hairline at 1920 is 0.49 px in a 720-wide preview and gone entirely in a phone thumbnail; the same hairline at 10% opacity is gone at any size. Sort every stroke into a role and give each role a floor: structural edges and anything the eye must follow ≥ 2 px at ink value, leaders and tick marks 1.5–2 px, texture and hatching 1–1.3 px at ≤ 25 % opacity where it is felt and not read. A distant arc drawn with the leader width is the common case — it looks right in the source and is absent in the render, so look at the frame at the width it will be watched at.

## Make it re-brandable

Declare palette and fonts as variables on the root `<html>` and use them everywhere, so the person can re-brand from Studio's Variables panel:

```html
<html
  data-composition-variables='[
  {"id":"color-ground","type":"color","label":"Background","default":"<ground from the plan>"},
  {"id":"color-ink","type":"color","label":"Text","default":"<ink from the plan>"},
  {"id":"color-accent","type":"color","label":"Accent","default":"<accent from the plan>"},
  {"id":"font-display","type":"string","label":"Display font","default":"<display face from the plan>"}
]'
></html>
```

Reference them as `var(--color-accent)`; point a registry item's colour and font variables at the same values.
