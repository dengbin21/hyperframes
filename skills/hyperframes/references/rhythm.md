# Rhythm

A film can be correct in every frame and still be boring. Boring has a recognisable shape: one
event every four or five seconds, the same move in every scene (a card grows, holds, shrinks), one
shot scale throughout, every ease a soft 0.6–0.8 s, and the music idling on a pad until a single hit
at the end. Nothing is broken, so nothing gets fixed.

`motion.md` owns how one move is built. This file owns the film over time: the energy curve, how
dense each stretch is, and where it changes. Read it before the beat map, not after the render.

Rhythm is contrast between stretches, not a fast tempo. A film that is fast everywhere is as flat as
one that is slow everywhere. What reads as "cool" or "tech" is control: a hard quick middle, one
moment where everything stops, and a drop on the frame the viewer was waiting for.

## 1. Choose the route before the beat map

| Route | What carries the eye | Cuts | Fits |
| --- | --- | --- | --- |
| **Continuous** | one world, a camera moving through it, objects carried shot to shot | 0–2 | precise and calm brands, mechanisms, a single product UI |
| **Montage** | the beat: every cut lands on it and every frame reads at once | many, on the beat | hype, hardware, games, sport, "look how much it does" |
| **Hybrid** | a continuous spine broken open by one or two montage bursts | bursts only | most launch films that should feel tech and energetic |

"One world, few cuts" is the median of short UI films on X, and it is right for a screen recording
and the continuous route. It is wrong for a launch film: measured across 21 launch films (Oct 2026),
15 cut ten or more times a minute, and the music-driven ones averaged a shot every 1.8–3.5 s
(15–33 cuts a minute). Only UI recordings and slow dissolve films carried no hard cut.
A launch film that should feel *tech* is usually hybrid: a spine the viewer can follow, opened up by
a burst.

## 2. Draw the energy curve

Before the beat map, write the film's energy 0–10 for each stretch of a few seconds, and check the
shape. The shapes that work:

- **Hook inside 3 s.** A clear onset or the first cut inside three seconds: motion, a hit, an
  unresolved shape, a question. That is not a frantic open — only 3 of 18 measured films cut three
  times in the first five seconds, and most opened 6–20 dB under their peak.
- **Climb in steps, not a slope.** Each section adds something nameable (the kick enters, the camera
  starts travelling, the cuts double). A slope nobody can hear or see is a plateau.
- **A burst near the middle.** The densest five seconds of the measured films sat around 37% of the
  length (30–60% typical): 5–8 cuts, about one per beat, framed by shots of 1.5–4 s.
- **The hero moment on the strongest musical point**, usually after the burst: the drop, the first
  downbeat after the build.
- **A stop, when it earns its place.** Near silence for 0.5–1.6 s, then picture and sound slammed in
  on the same frame. Cheap power, a signature move rather than a requirement.
- **Resolve.** The last stretch comes down to the mark: one idea, held, the music ringing or buttoned.

Shapes that read as boring: a flat line at 3–5 with one hit at the end; a slow build whose top
arrives in the last two seconds; the same energy in every scene. Two drops (a small one at a third, a
big one at three quarters) work past 30 s.

## 3. Density: events per bar

Count what happens per bar (four beats). An event is anything the eye or ear registers as new: a cut,
an element landing, a camera move starting or stopping, a word, a hit, an instrument entering.

| Stretch | Events per bar | Shot / move length |
| --- | --- | --- |
| hook | 2–4 | moves of 0.25–0.5 s |
| build | 2–4, rising | 1–2 beats per move |
| stop | 0–1 | hold 1–2 beats |
| peak / montage | 4–8 (one per beat or eighth) | ½–1 beat per shot |
| resolve / mark | 1–2 | hold ≥ 1.5 s on the mark |

The measured shape of a burst (Vercel, 115 BPM): shot lengths 1.67, 1.37, 1.10, 1.00 s, then
thirteen cuts of one beat (0.50–0.57 s), all within 28 ms of the beat, then 1.10 and 3.04 s.
Accelerate, lock to the beat, release.

The rule underneath: **no stretch longer than about two bars without something new**, except a stop
you planned. `check` reports the mechanical half of this as `dead_stretch` (more than 3 s with
nothing changing); a stretch that passes `check` and still feels dead has events and no *new* ones.

## 4. Contrast schedule: what changes between stretches

Change at least two of these at every section boundary, and all of them at the drop:

- **Shot scale**: extreme close-up ↔ wide. Open on a detail (a dot, a cursor, a key) and pull out
  hard; punch in 2× on a number as it lands; cut from a macro to the whole system.
- **Speed**: move durations (0.25 s hard moves against a 2 s glide), and speed ramps inside one move
  (fast in, near-stop at the key frame, fast out) — `data-automation`'s `rate` lane on the media.
- **Ease family**: hard ease-out (`expo`, `power4`) for tech; springs only for things that should
  feel physical. Soft 0.6–0.8 s eases everywhere is the default that puts an audience to sleep.
- **Camera**: still ↔ travelling ↔ whipping.
- **Density**: one object on screen ↔ a grid of nine.
- **Colour / ground**: a flood to the brand colour, a flip to dark.
- **Music texture**: half-time ↔ full beat ↔ stop ↔ drop (§6).

The moves themselves are in `techniques.md`; pick each for what it says.

## 5. Montage bursts

A montage is a run of shots each lasting a beat or less, cut exactly on the beat, each readable at a
glance. It turns "it does many things" into a feeling instead of a list.

- Build it from real material: the product's outputs, user stories, screenshots, numbers. Invented
  filler makes a montage look like stock footage.
- One spine through it: a shared position, colour or shape (the same dot in every shot, the same
  grid cell), so it reads as one move and not as noise.
- Accelerate inside it: two beats per shot, then one, then half, then stop.
- Every cut in the burst lands on the beat (±1 frame at 30 fps) and every new shot enters already
  moving. Outside the burst, cut on phrases and information: only 2 of 11 measured films cut on the
  beat throughout.
- Keep the eye where it is and change what it sees. Three fast-cut grammars held up: an anchor locked
  in place while the world behind it changes (Vercel's two figures, Gemini's prompt pill over
  changing materials); a step cut on one framing (iPhone: 12 → 200 mm, a label per step, 0.3 s each);
  a spec label slammed in with each shot (GoPro: 8K60, 4K240, 1080p960).
- Give the montage its own sound: a hit or tick on each cut, the music at full energy (`sound.md` §4).

```html
<!-- one shot per beat: the runtime owns visibility, GSAP owns the move inside each -->
<div id="montage" data-beat="montage">
  <div class="shot" data-start="15.00" data-duration="0.94"><img src="assets/shot-01.png" alt="" /></div>
  <div class="shot" data-start="15.94" data-duration="0.94"><img src="assets/shot-02.png" alt="" /></div>
  <!-- …; data-start comes from beat(n), never from a rounded beat added repeatedly -->
</div>
```

```js
const BPM = 128;
const beat = (n) => (n * 60) / BPM;                 // compute from the index; adding rounded beats drifts
const beats = [2, 2, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5]; // accelerate, then the stop
let t = beat(32);                                     // bar 9
gsap.utils.toArray("#montage .shot").forEach((el, i) => {
  tl.fromTo(el, { scale: 1.12 }, { scale: 1, duration: beat(beats[i]), ease: "none" }, t);
  t += beat(beats[i]);
});
```

Each shot is its own `data-start`/`data-duration` window, so the cut is a real cut and the runtime
switches it — never tween `visibility` or `autoAlpha` on a `.clip` (contract 5). Ten shots on one
track is what `timeline_track_too_dense` warns about: give the montage its own sub-composition rather
than flattening it into the scene.

Cuts drift off the music when the picture's grid and the score's tempo differ. `npx hyperframes beats`
writes the detected beat times; place every cut from `beat(n)` at the track's real tempo rather than
from a BPM quoted on the track's page, and re-run it if you change the track.

## 6. Music that has rhythm

The music's energy curve is the picture's energy curve (`sound.md` §3).

- **An onset inside 3 s** for anything that should feel tech or energetic: a hit, the kick, a driving
  pulse. Pad-only openings with nothing landing are for calm films.
- **Tempo is not the lever.** The cool films measured 77–130 BPM (median 105). Speed comes from cut
  density, onsets and hat subdivision; 100–125 BPM is the default range.
- **Change the feel, not the tempo.** Half-time (kick on 1, snare on 3) for the verse, the full beat
  for the chorus, double-time hats for the build. The BPM stays and the cuts stay on the grid.
- **Fills and turnarounds** on the last beat before every section: a snare run, a tom fill, a stutter.
- **The stop.** Before the drop: the band cut to silence with only a riser or a reversed cymbal
  pulling into the hit (`<audio>` with `data-fade-out`, or a reversed file).
- **The drop.** On the reveal frame: the full band, a crash, an impact and a sub-drop together.
- **Cut hits.** In a montage, a hit clip on each cut gives the picture weight.
- Floors and ceilings: a bed with most of its energy under 150 Hz plays as nothing on a phone
  speaker, and a bed that never ducks under a voice is the mixer's most common miss (`sound.md` §5).

## 7. Write it down: the rhythm sheet

Add one line per stretch to the beat map (`spec.md`'s SHOTS line, or the `STORYBOARD.md` frames):

```
stretch      bars   energy  events/bar  route moves                               music
hook         1–2    7       3           ECU on the dot → hard pull-out on beat 3   kick + hats from bar 1, motif
build        3–6    5→7     3           cards land on beats, camera tracks right   half-time, bass enters bar 5
stop         7      1       0           freeze, one word                           band out, reversed cymbal
drop/peak    8–11   9       6           3×3 grid slams on eighths, punch-ins       full band, crash, impact + sub-drop
resolve      12–13  4       1           pull back to the mark, hold                motif on the logo, ring
```

Then check the sheet before writing a tween: is there a hook inside 3 s, a burst of 5–8 cuts in five
seconds, and the hero on the strongest musical point? Does every section boundary change at least
two things? Is any stretch longer than two bars with nothing new?

Mark the sheet in the DOM so the review sees the same frames you planned: `data-beat="stop"`,
`data-beat="drop"` on a timed element at each stretch. `npx hyperframes snapshot --review` then
writes `review-beats.jpg` with those moments labelled, instead of spreading frames evenly and
missing the one that matters.

## 8. A case: the same film, boring and not

A 30 s launch for a calm, warm personal-agent brand (a colon for a logo, a sky-to-peach gradient).
The first build matched the brand's calm: 96 BPM felt piano, energy low until a single drop at 79%,
every scene the same grammar (a card unfolds from the avatar, holds, folds back), small cards on a
big empty wall, 0.6–0.8 s gentle eases, an average shot of 10 s. It passed every check and an
independent review. The person: not cool, a bit boring — music, picture and rhythm.

The rebuild kept the palette and the type and changed only the rhythm: a beat from bar 1 at 120 BPM;
an extreme close-up on the colon pulled out hard to reveal 7:59; a 2× punch-in on the number as it
counts; one wide world travelled left to right, where the two dots fly ahead and the camera whips
after them (the product's promise became the camera move); nine real user stories slamming into a
3×3 grid on eighth notes while the camera pulls back; everything sucked back into the colon, one beat
of stillness, the drop. The person scored it 80 against the first version's 60: "the rhythm is much
better." What still cost points was craft (a typeface, text over the UI), not rhythm.

## 9. Check it at normal speed

Frames show craft; rhythm only shows in motion. Watch the render at 1× from start to end with the
sound, and mark every moment your attention drops: that is where a stretch needs an event, a
contrast, or a cut.

`check` catches the mechanical version — `dead_stretch`, `line_unread`, `film_silent` — and
`scripts/gate.mjs` reports motion, dead area and pops. Neither can tell you the film is boring; they
can only tell you it might be. What does scale is watching two cuts of the same stretch back to back:
`npx hyperframes compare <a> <b> --at <t> --labels before,after` puts both at one frame on a
labelled sheet, so a rhythm change is judged with the palette and type held still. Across your own
films, falling motion with rising dead area means the shots are turning into wallpaper.
