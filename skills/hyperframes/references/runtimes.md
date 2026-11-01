# Animation runtimes

HyperFrames seeks each frame on its own, so motion must be a function of time, never of the previous frame. Full GSAP reference: `npx hyperframes docs gsap`.

## GSAP facts that bite

- Register the timeline last. Building inside `document.fonts.ready.then(…)` or another async callback is fine if you register at the end of it; registering first renders blank (`gsap_timeline_registered_before_async_build`).
- Place tweens at absolute seconds (`tl.to(el, {…}, 2.4)`). Set start states in the tween (`fromTo`), not in CSS.
- Measure layout once before building tweens, never inside `onUpdate`.
- Finite repeats only: `repeat: Math.max(0, Math.floor(duration / cycle) - 1)`.
- Seed randomness with a small PRNG (mulberry32).
- A scene's timeline can't reach elements outside its file, and two timelines must not animate the same property of one element.
- Transforms on a `<span>` need `display: inline-block` or `block`.
- **A position before 0 shifts the whole timeline.** Placing one tween at `-0.12` (a caption fading in early) makes GSAP start the timeline at −0.12, so every tween anchored to a real second lands 0.12 s late. Measured: a 1.40 s timeline became 1.52 s and the tween anchored at 1.0 s did not begin until 1.12 s. Clamp every position to ≥ 0: `Math.max(0, cue - 0.3)`.
- **A later `fromTo` renders its start state immediately.** A drop at 2 s plus a small `fromTo` nudge at 4 s leaves the element already at the nudge's start pose from frame 0 — the drop never happens. Measured: `y` read 0 at t=0 instead of −200; with `immediateRender: false` on the later tween it read −200. Either set `immediateRender: false`, or write the nudge as `.to(el, { y: "+=6", yoyo: true, repeat: 1 })`. `check` does not catch this: snapshot the frame before a scene's first move.
- **A wrapper with no height collapses once it is transformed.** A plain `<div>` around absolutely positioned full-frame layers is 0 px tall, and the layers only fill the frame because they escape to the viewport. The first transform makes the wrapper their containing block: measured, a 960×540 layer became 944×0 while every check stayed green. Give any wrapper you will scale or move `position: absolute; inset: 0` (or an explicit size) before animating it.
- Text that must fit a width: `window.__hyperframes.fitTextFontSize(text, { fontFamily, fontWeight, maxWidth })` returns `{ fontSize }`; `window.__hyperframes.pretext` measures text without a reflow.
- **`drawSVG`, `SplitText`, `MorphSVG` and `ScrambleText` are separate files, not in the core bundle.** Core `gsap.min.js` contains no `drawSVG` string, so `drawSVG: "0%"` / `"100%"` becomes an unknown property, is set as an invalid CSS declaration and dropped — the tween runs, the line never draws, and no finding names it. **Load the plugin file and register it**, in this order: `<script src="…/gsap/3.13.0/gsap.min.js">`, `<script src="…/gsap/3.13.0/DrawSVGPlugin.min.js">`, then `gsap.registerPlugin(DrawSVGPlugin, SplitText)`. Since 3.13.0 the former Club plugins ship in the public package and the gsap.com Standard License makes them free in commercial work; on 3.12.5 they are a 404. Verified on 0.8.223 with `gsap@3.15.0`: `check` 0 error 0 warning and the path really draws at seek time — from jsDelivr and from a vendored local copy. Without the plugin: hide the path with `getTotalLength()` → `strokeDasharray: len` and `strokeDashoffset: len`, then tween `strokeDashoffset` to 0; measure the length once at build time, since a path that does not change its `d` does not change its length under a transform.
- Tweening split characters is legal, but split them once at build time, not per frame, and keep the parent's `font-size` (a split `<span>` does not add a `text_below_floor` finding of its own — verified). A split line cannot be re-wrapped by CSS afterwards: give it its final width first.
- **Type does not belong inside a perspective or `translateZ` layer.** A `perspective: 1200px` parent draws a child at `p / (p − z)` about its `perspective-origin`, which is the frame's centre unless set. +90 px of depth is 1.081×, +170 px is 1.165×; on a 1080 frame a label at `top: 60` is drawn at y = 21 instead of 60, and at y = −19 — 19 px above the frame — while the rest of the panel still looks placed, so the frame reads as "the label vanished". Keep every px coordinate you set on a flat layer (`translateZ(0)`, its own `z-index`) and let the drawn object alone carry the depth.

## Other runtimes

| Runtime                      | Use for                           | How HyperFrames drives it                                                                        |
| ---------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| CSS `@keyframes`             | Simple loops and decoration       | Found automatically; finite iterations, `animation-fill-mode: both`, `data-start` on the element |
| WAAPI                        | Native keyframes                  | `element.animate(…, { fill: "both" })` then `pause()`; times are document time, so use `delay`   |
| Lottie / dotLottie           | After Effects exports, characters | `autoplay: false`, always set `loop`, push the instance to `window.__hfLottie`                   |
| anime.js v4                  | Existing anime code               | `autoplay: false`, push to `window.__hfAnime`, `anime.createSeededRandom`                        |
| Three.js, WebGPU, p5, canvas | 3D and generative                 | Draw from `e.detail.time` in an `hf-seek` listener; set `data-duration` on the root              |

Charts and map overlays: drive them from a GSAP tween's `onUpdate`, not the library's own transitions. A real place is shown on baked imagery, not drawn (`film.md` "Maps and real places"). Heavy setup (big meshes, shader compiles) registers a `window.__hf.buildReady["<key>"]` promise.

## The seek protocol

```html
<script>
  function renderAt(t) {
    /* draw the frame for t seconds from state derived from t alone */
  }
  window.addEventListener("hf-seek", (e) => {
    renderAt(e.detail.time);
    // async work (GPU submit, image decode): e.detail.waitUntil(promise), called synchronously
  });
  renderAt(0);
</script>
```

No `requestAnimationFrame` loop or timer as the clock.
